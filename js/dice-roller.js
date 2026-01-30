// dice-roller.js - Sistema Avançado de Rolagem de Dados

class VirtualDiceRoller {
    constructor(options = {}) {
        this.availableDice = options.dice || ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'];
        this.rollHistory = [];
        this.maxHistory = 50;
        this.soundsEnabled = options.sounds !== false;
        this.animationsEnabled = options.animations !== false;
        
        this.init();
    }
    
    init() {
        this.loadHistory();
        this.setupDiceTray();
    }
    
    roll(diceType, quantity = 1, modifier = 0, description = '') {
        if (!this.availableDice.includes(diceType)) {
            throw new Error(`Dado ${diceType} não disponível`);
        }
        
        const sides = parseInt(diceType.replace('d', ''));
        const results = [];
        let total = 0;
        
        // Rola os dados
        for (let i = 0; i < quantity; i++) {
            const roll = Math.floor(Math.random() * sides) + 1;
            results.push(roll);
            total += roll;
        }
        
        // Aplica modificador
        total += modifier;
        
        const rollData = {
            id: Date.now() + Math.random(),
            dice: diceType,
            quantity: quantity,
            modifier: modifier,
            results: results,
            total: total,
            description: description,
            timestamp: new Date().toISOString(),
            formattedTime: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        };
        
        // Salva no histórico
        this.rollHistory.unshift(rollData);
        if (this.rollHistory.length > this.maxHistory) {
            this.rollHistory.pop();
        }
        
        // Anima e toca som
        if (this.animationsEnabled) {
            this.animateRoll(rollData);
        }
        
        if (this.soundsEnabled) {
            this.playDiceSound(quantity);
        }
        
        // Salva no localStorage
        this.saveHistory();
        
        // Dispara evento
        this.dispatchRollEvent(rollData);
        
        return rollData;
    }
    
    // Sistema específico: Vampiro (D10)
    rollVampireDice(pool, difficulty = 6, specialty = false, willpower = false) {
        const results = [];
        let successes = 0;
        let botches = 0;
        let ones = 0;
        
        // Dados normais
        for (let i = 0; i < pool; i++) {
            const roll = Math.floor(Math.random() * 10) + 1;
            results.push(roll);
            
            if (roll >= difficulty) {
                successes++;
                if (roll === 10) successes++; // 10 conta como 2 sucessos
            }
            
            if (roll === 1) {
                ones++;
                botches++;
            }
        }
        
        // Dados de especialidade (10 conta como 2 sucessos)
        if (specialty) {
            results.forEach((roll, index) => {
                if (roll === 10) {
                    successes++; // Extra success for specialty
                }
            });
        }
        
        // Vontade (reroll failures)
        if (willpower) {
            const failures = results.filter(r => r < difficulty && r !== 1);
            failures.forEach(() => {
                const reroll = Math.floor(Math.random() * 10) + 1;
                results.push(reroll);
                
                if (reroll >= difficulty) {
                    successes++;
                    if (reroll === 10) successes++;
                }
                
                if (reroll === 1) {
                    ones++;
                    botches++;
                }
            });
        }
        
        const finalResult = {
            system: 'vampire',
            pool: pool,
            difficulty: difficulty,
            rolls: results,
            successes: successes,
            botches: botches,
            ones: ones,
            netSuccesses: botches > successes ? -1 : Math.max(0, successes - botches),
            outcome: this.getVampireOutcome(successes, botches)
        };
        
        this.rollHistory.unshift({
            ...finalResult,
            id: Date.now(),
            timestamp: new Date().toISOString(),
            description: `Vampiro: ${pool}d10 Dificuldade ${difficulty}`
        });
        
        this.saveHistory();
        this.animateVampireRoll(finalResult);
        
        return finalResult;
    }
    
    getVampireOutcome(successes, botches) {
        if (botches > successes) return 'Desastre';
        if (successes === 0) return 'Falha';
        if (successes === 1) return 'Sucesso Marginal';
        if (successes <= 3) return 'Sucesso';
        if (successes <= 5) return 'Sucesso Bom';
        return 'Sucesso Excepcional';
    }
    
    // Sistema específico: D&D (D20)
    rollD20(advantage = false, disadvantage = false, modifier = 0) {
        const roll1 = Math.floor(Math.random() * 20) + 1;
        let roll2 = null;
        let finalRoll = roll1;
        
        if (advantage || disadvantage) {
            roll2 = Math.floor(Math.random() * 20) + 1;
            
            if (advantage) {
                finalRoll = Math.max(roll1, roll2);
            } else {
                finalRoll = Math.min(roll1, roll2);
            }
        }
        
        const total = finalRoll + modifier;
        
        const result = {
            system: 'dnd',
            roll: finalRoll,
            roll2: roll2,
            modifier: modifier,
            total: total,
            advantage: advantage,
            disadvantage: disadvantage,
            isCritical: finalRoll === 20,
            isCriticalFail: finalRoll === 1,
            outcome: this.getDNDOutcome(total, finalRoll)
        };
        
        this.rollHistory.unshift({
            ...result,
            id: Date.now(),
            timestamp: new Date().toISOString(),
            description: `D&D: ${advantage ? 'Vantagem' : disadvantage ? 'Desvantagem' : 'Normal'} +${modifier}`
        });
        
        this.saveHistory();
        this.animateD20Roll(result);
        
        return result;
    }
    
    getDNDOutcome(total, naturalRoll) {
        if (naturalRoll === 20) return 'Acerto Crítico!';
        if (naturalRoll === 1) return 'Falha Crítica';
        if (total >= 15) return 'Sucesso';
        return 'Falha';
    }
    
    // Sistema de WoD (D10)
    rollWoDDice(pool, difficulty = 6, specialties = []) {
        return this.rollVampireDice(pool, difficulty, specialties.length > 0, false);
    }
    
    // Sistema de Força (3d6)
    roll3d6(modifier = 0) {
        const results = [];
        let total = 0;
        
        for (let i = 0; i < 3; i++) {
            const roll = Math.floor(Math.random() * 6) + 1;
            results.push(roll);
            total += roll;
        }
        
        total += modifier;
        
        return {
            system: '3d6',
            rolls: results,
            total: total,
            modifier: modifier,
            isExceptional: total >= 16,
            isPoor: total <= 6
        };
    }
    
    // Rolagem customizada complexa
    rollCustom(expression) {
        // Suporta expressões como "2d6+1d4+3"
        const regex = /(\d+)d(\d+)/g;
        let match;
        let total = 0;
        const rolls = [];
        
        while ((match = regex.exec(expression)) !== null) {
            const quantity = parseInt(match[1]);
            const sides = parseInt(match[2]);
            
            for (let i = 0; i < quantity; i++) {
                const roll = Math.floor(Math.random() * sides) + 1;
                rolls.push({ dice: `d${sides}`, value: roll });
                total += roll;
            }
        }
        
        // Adiciona modificadores
        const modifierMatch = expression.match(/[+-]\s*\d+/g);
        if (modifierMatch) {
            modifierMatch.forEach(mod => {
                total += parseInt(mod.replace(/\s+/g, ''));
            });
        }
        
        return {
            expression: expression,
            rolls: rolls,
            total: total,
            timestamp: new Date().toISOString()
        };
    }
    
    // Animação de dados
    animateRoll(rollData) {
        const animationContainer = document.getElementById('dice-animation-container');
        if (!animationContainer) return;
        
        // Limpa animações anteriores
        animationContainer.innerHTML = '';
        
        // Cria dados
        rollData.results.forEach((result, index) => {
            const die = document.createElement('div');
            die.className = `animated-die die-${rollData.dice}`;
            die.textContent = result;
            die.style.setProperty('--die-index', index);
            die.style.setProperty('--die-result', result);
            
            animationContainer.appendChild(die);
        });
        
        // Adiciona classe de animação
        animationContainer.classList.add('rolling');
        setTimeout(() => {
            animationContainer.classList.remove('rolling');
        }, 1000);
    }
    
    animateVampireRoll(rollData) {
        const container = document.getElementById('dice-animation-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        rollData.rolls.forEach((roll, index) => {
            const die = document.createElement('div');
            die.className = `vampire-die d10-result-${roll}`;
            die.textContent = roll;
            
            if (roll >= rollData.difficulty) {
                die.classList.add('success');
                if (roll === 10) die.classList.add('critical');
            } else if (roll === 1) {
                die.classList.add('botch');
            }
            
            container.appendChild(die);
        });
        
        // Mostra resultado
        const resultDiv = document.createElement('div');
        resultDiv.className = 'vampire-result';
        resultDiv.innerHTML = `
            <strong>Resultado:</strong> ${rollData.netSuccesses} sucesso(s) líquido(s)
            <br>
            <span class="outcome">${rollData.outcome}</span>
        `;
        
        container.appendChild(resultDiv);
    }
    
    animateD20Roll(rollData) {
        const container = document.getElementById('dice-animation-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        const die = document.createElement('div');
        die.className = `d20-die ${rollData.isCritical ? 'critical-hit' : rollData.isCriticalFail ? 'critical-fail' : ''}`;
        die.textContent = rollData.roll;
        
        container.appendChild(die);
        
        if (rollData.roll2) {
            const die2 = document.createElement('div');
            die2.className = `d20-die secondary`;
            die2.textContent = rollData.roll2;
            container.appendChild(die2);
        }
        
        const resultDiv = document.createElement('div');
        resultDiv.className = 'd20-result';
        resultDiv.innerHTML = `
            <strong>Total:</strong> ${rollData.total} (${rollData.roll} + ${rollData.modifier})
            <br>
            <span class="outcome ${rollData.isCritical ? 'critical' : rollData.isCriticalFail ? 'fail' : ''}">
                ${rollData.outcome}
            </span>
        `;
        
        container.appendChild(resultDiv);
    }
    
    playDiceSound(quantity) {
        if (!this.soundsEnabled) return;
        
        try {
            const audio = new Audio('/assets/audio/dice-roll.mp3');
            audio.volume = Math.min(0.3 + (quantity * 0.05), 0.7);
            audio.play().catch(e => console.log('Áudio não suportado'));
        } catch (e) {
            console.log('Não foi possível tocar som de dados');
        }
    }
    
    // Sistema de bandeja de dados
    setupDiceTray() {
        const tray = document.createElement('div');
        tray.id = 'dice-tray';
        tray.className = 'dice-tray';
        tray.innerHTML = `
            <div class="tray-header">
                <h4>🎲 Bandeja de Dados</h4>
                <button class="tray-close">&times;</button>
            </div>
            <div class="tray-dice">
                ${this.availableDice.map(dice => `
                    <button class="tray-die" data-dice="${dice}">
                        ${dice.toUpperCase()}
                    </button>
                `).join('')}
            </div>
            <div class="tray-controls">
                <input type="number" min="1" max="10" value="1" id="tray-quantity">
                <button id="tray-roll">Rolar</button>
            </div>
        `;
        
        document.body.appendChild(tray);
        
        // Configura eventos
        tray.querySelector('.tray-close').addEventListener('click', () => {
            tray.classList.remove('visible');
        });
        
        tray.querySelectorAll('.tray-die').forEach(button => {
            button.addEventListener('click', (e) => {
                const diceType = e.target.getAttribute('data-dice');
                const quantity = parseInt(tray.querySelector('#tray-quantity').value);
                this.roll(diceType, quantity);
            });
        });
        
        tray.querySelector('#tray-roll').addEventListener('click', () => {
            const selectedDie = tray.querySelector('.tray-die.selected');
            if (selectedDie) {
                const diceType = selectedDie.getAttribute('data-dice');
                const quantity = parseInt(tray.querySelector('#tray-quantity').value);
                this.roll(diceType, quantity);
            }
        });
    }
    
    showDiceTray() {
        const tray = document.getElementById('dice-tray');
        if (tray) {
            tray.classList.add('visible');
        }
    }
    
    // Histórico
    saveHistory() {
        try {
            const history = this.rollHistory.slice(0, 20); // Salva apenas os 20 últimos
            localStorage.setItem('diceRollHistory', JSON.stringify(history));
        } catch (e) {
            console.warn('Não foi possível salvar histórico de dados');
        }
    }
    
    loadHistory() {
        try {
            const saved = localStorage.getItem('diceRollHistory');
            if (saved) {
                this.rollHistory = JSON.parse(saved);
            }
        } catch (e) {
            console.warn('Não foi possível carregar histórico de dados');
        }
    }
    
    clearHistory() {
        this.rollHistory = [];
        localStorage.removeItem('diceRollHistory');
    }
    
    getHistory() {
        return [...this.rollHistory];
    }
    
    getStats() {
        const stats = {
            totalRolls: this.rollHistory.length,
            byDiceType: {},
            averageRolls: {},
            criticals: 0,
            botches: 0
        };
        
        this.rollHistory.forEach(roll => {
            // Contagem por tipo de dado
            if (roll.dice) {
                stats.byDiceType[roll.dice] = (stats.byDiceType[roll.dice] || 0) + 1;
                
                // Médias
                if (!stats.averageRolls[roll.dice]) {
                    stats.averageRolls[roll.dice] = { total: 0, count: 0 };
                }
                stats.averageRolls[roll.dice].total += roll.total;
                stats.averageRolls[roll.dice].count++;
            }
            
            // Críticos e desastres
            if (roll.isCritical || roll.outcome?.includes('Crítico')) {
                stats.criticals++;
            }
            if (roll.outcome === 'Desastre' || roll.botches > 0) {
                stats.botches++;
            }
        });
        
        // Calcula médias
        Object.keys(stats.averageRolls).forEach(dice => {
            const data = stats.averageRolls[dice];
            stats.averageRolls[dice] = data.total / data.count;
        });
        
        return stats;
    }
    
    // Eventos
    dispatchRollEvent(rollData) {
        const event = new CustomEvent('diceRolled', {
            detail: rollData
        });
        document.dispatchEvent(event);
    }
    
    onRoll(callback) {
        document.addEventListener('diceRolled', (e) => {
            callback(e.detail);
        });
    }
    
    // Exportação
    exportHistory(format = 'json') {
        const data = this.getHistory();
        
        switch (format) {
            case 'json':
                return JSON.stringify(data, null, 2);
                
            case 'csv':
                let csv = 'Data,Hora,Dados,Quantidade,Modificador,Resultados,Total,Descrição\n';
                data.forEach(roll => {
                    const date = new Date(roll.timestamp).toLocaleDateString();
                    const time = new Date(roll.timestamp).toLocaleTimeString();
                    csv += `${date},${time},${roll.dice},${roll.quantity},${roll.modifier},"${roll.results.join(',')}",${roll.total},${roll.description || ''}\n`;
                });
                return csv;
                
            case 'html':
                let html = '<table class="dice-history-table"><thead><tr><th>Data/Hora</th><th>Dados</th><th>Resultado</th><th>Total</th></tr></thead><tbody>';
                data.forEach(roll => {
                    const time = new Date(roll.timestamp).toLocaleString();
                    html += `<tr>
                        <td>${time}</td>
                        <td>${roll.quantity}${roll.dice}${roll.modifier ? (roll.modifier > 0 ? '+' : '') + roll.modifier : ''}</td>
                        <td>${roll.results.join(', ')}</td>
                        <td><strong>${roll.total}</strong></td>
                    </tr>`;
                });
                html += '</tbody></table>';
                return html;
        }
    }
    
    downloadHistory(format = 'json') {
        const content = this.exportHistory(format);
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dice_history_${new Date().toISOString().split('T')[0]}.${format}`;
        a.click();
    }
}

// Instância global
window.diceRoller = new VirtualDiceRoller({
    dice: ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'],
    sounds: true,
    animations: true
});

// Funções auxiliares globais
function rollDice(diceType, quantity = 1, modifier = 0) {
    return window.diceRoller.roll(diceType, quantity, modifier);
}

function rollVampireDice(pool, difficulty = 6) {
    return window.diceRoller.rollVampireDice(pool, difficulty);
}

function rollD20(advantage = false, disadvantage = false, modifier = 0) {
    return window.diceRoller.rollD20(advantage, disadvantage, modifier);
}

function showDiceTray() {
    window.diceRoller.showDiceTray();
}

// Inicialização automática
document.addEventListener('DOMContentLoaded', function() {
    // Adiciona estilos para animações
    const style = document.createElement('style');
    style.textContent = `
        .dice-tray {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--bg);
            border: 2px solid var(--primary);
            border-radius: var(--radius-lg);
            padding: var(--spacing-md);
            box-shadow: var(--shadow-xl);
            z-index: 1000;
            display: none;
        }
        
        .dice-tray.visible {
            display: block;
        }
        
        .tray-dice {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: var(--spacing-sm);
            margin: var(--spacing-md) 0;
        }
        
        .tray-die {
            padding: var(--spacing-sm);
            background: var(--secondary);
            border: 1px solid var(--border);
            border-radius: var(--radius-md);
            color: var(--text);
            cursor: pointer;
            transition: all var(--transition-fast);
        }
        
        .tray-die:hover {
            background: var(--primary);
            transform: scale(1.1);
        }
        
        .tray-die.selected {
            background: var(--primary);
            border-color: var(--accent);
            box-shadow: 0 0 10px var(--primary);
        }
        
        .animated-die {
            display: inline-block;
            width: 50px;
            height: 50px;
            margin: 5px;
            background: white;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 1.2rem;
            color: black;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            animation: rollAnimation 1s ease;
            animation-delay: calc(var(--die-index) * 0.1s);
        }
        
        @keyframes rollAnimation {
            0% {
                transform: translateY(-100px) rotate(0deg);
                opacity: 0;
            }
            100% {
                transform: translateY(0) rotate(360deg);
                opacity: 1;
            }
        }
        
        .vampire-die {
            width: 40px;
            height: 40px;
            margin: 5px;
            background: #8B0000;
            color: white;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        }
        
        .vampire-die.success {
            background: #228B22;
            box-shadow: 0 0 10px #228B22;
        }
        
        .vampire-die.critical {
            background: #FFD700;
            color: black;
            box-shadow: 0 0 15px #FFD700;
        }
        
        .vampire-die.botch {
            background: #2C2C2C;
            box-shadow: 0 0 10px #DC143C;
        }
        
        .d20-die {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #1E90FF, #00008B);
            color: white;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            font-weight: bold;
            margin: 10px;
            box-shadow: 0 6px 12px rgba(0,0,0,0.4);
        }
        
        .d20-die.critical-hit {
            background: linear-gradient(135deg, #FFD700, #FF8C00);
            animation: pulse 1s infinite;
        }
        
        .d20-die.critical-fail {
            background: linear-gradient(135deg, #DC143C, #8B0000);
            animation: shake 0.5s;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
    `;
    
    document.head.appendChild(style);
});