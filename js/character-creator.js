// character-creator.js - Sistema Avançado de Criação de Personagens

class CharacterCreator {
    constructor(system = 'vampire') {
        this.system = system;
        this.character = this.getDefaultCharacter();
        this.currentStep = 1;
        this.totalSteps = 5;
        this.points = this.getSystemPoints();
        this.templates = this.loadTemplates();
        
        this.init();
    }
    
    init() {
        this.loadSystemData();
        this.setupEventListeners();
        this.updateUI();
        this.loadSavedCharacter();
    }
    
    getDefaultCharacter() {
        return {
            id: Date.now(),
            system: this.system,
            name: '',
            playerName: '',
            avatar: 'assets/avatars/default.png',
            description: '',
            background: '',
            notes: '',
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
            
            // Atributos base
            attributes: {
                physical: { strength: 1, dexterity: 1, stamina: 1 },
                social: { charisma: 1, manipulation: 1, appearance: 1 },
                mental: { perception: 1, intelligence: 1, wits: 1 }
            },
            
            // Sistemas específicos
            vampire: {
                clan: '',
                generation: 13,
                sire: '',
                embrace: '',
                disciplines: [],
                background: [],
                virtues: { conscience: 3, self_control: 3, courage: 3 },
                humanity: 7,
                willpower: 5,
                bloodPool: 10
            },
            
            werewolf: {
                tribe: '',
                auspice: '',
                breed: 'homid',
                pack: '',
                totem: '',
                gifts: [],
                rites: [],
                renown: { glory: 0, honor: 0, wisdom: 0 },
                rage: 0,
                gnosis: 0,
                willpower: 5
            },
            
            mage: {
                tradition: '',
                essence: '',
                avatar: '',
                spheres: [],
                focus: '',
                arete: 1,
                quintessence: 0,
                paradox: 0,
                willpower: 5
            },
            
            // Equipamento e recursos
            equipment: [],
            resources: [],
            contacts: [],
            allies: [],
            enemies: []
        };
    }
    
    getSystemPoints() {
        const points = {
            vampire: {
                attributes: 7,
                abilities: 13,
                disciplines: 3,
                advantages: 7
            },
            werewolf: {
                attributes: 6,
                abilities: 13,
                gifts: 3,
                backgrounds: 5
            },
            mage: {
                attributes: 7,
                abilities: 13,
                spheres: 6,
                backgrounds: 7
            },
            tormenta: {
                attributes: 15,
                skills: 20,
                powers: 3,
                advantages: 5
            },
            dnd: {
                attributes: 27,
                skills: 4,
                feats: 1,
                equipment: 150
            }
        };
        
        return points[this.system] || points.vampire;
    }
    
    loadSystemData() {
        // Carrega dados específicos do sistema
        switch(this.system) {
            case 'vampire':
                this.loadVampireData();
                break;
            case 'werewolf':
                this.loadWerewolfData();
                break;
            case 'mage':
                this.loadMageData();
                break;
        }
    }
    
    loadVampireData() {
        this.clans = [
            { id: 'ventrue', name: 'Ventrue', description: 'Os aristocratas', disciplines: ['Dominate', 'Presence', 'Fortitude'] },
            { id: 'brujah', name: 'Brujah', description: 'Os rebeldes', disciplines: ['Celerity', 'Potence', 'Presence'] },
            { id: 'toreador', name: 'Toreador', description: 'Os artistas', disciplines: ['Auspex', 'Celerity', 'Presence'] },
            { id: 'tremere', name: 'Tremere', description: 'Os magos do sangue', disciplines: ['Auspex', 'Dominate', 'Thaumaturgy'] },
            { id: 'nosferatu', name: 'Nosferatu', description: 'Os repugnantes', disciplines: ['Animalism', 'Obfuscate', 'Potence'] },
            { id: 'gangrel', name: 'Gangrel', description: 'Os bestiais', disciplines: ['Animalism', 'Fortitude', 'Protean'] },
            { id: 'malkavian', name: 'Malkavian', description: 'Os loucos', disciplines: ['Auspex', 'Dominate', 'Obfuscate'] }
        ];
        
        this.disciplines = [
            'Animalism', 'Auspex', 'Celerity', 'Dominate', 'Fortitude',
            'Obfuscate', 'Potence', 'Presence', 'Protean', 'Thaumaturgy'
        ];
        
        this.backgrounds = [
            'Allies', 'Contacts', 'Fame', 'Generation', 'Herd',
            'Influence', 'Mentor', 'Resources', 'Retainers', 'Status'
        ];
    }
    
    loadWerewolfData() {
        this.tribes = [
            { id: 'shadowlords', name: 'Lords das Sombras', auspice: 'Ahroun', totem: 'Grifo' },
            { id: 'getoffenris', name: 'Get of Fenris', auspice: 'Ahroun', totem: 'Fenris' },
            { id: 'glasswalkers', name: 'Andarilhos Urbanos', auspice: 'Ragabash', totem: 'Aranha' },
            { id: 'blackfuries', name: 'Fúrias Negras', auspice: 'Ahroun', totem: 'Pegasus' },
            { id: 'silverfangs', name: 'Presas de Prata', auspice: 'Philodox', totem: 'Falcão' },
            { id: 'bonegnawers', name: 'Roe Ossos', auspice: 'Ragabash', totem: 'Rato' },
            { id: 'redtalons', name: 'Garras Vermelhas', auspice: 'Ahroun', totem: 'Lobo' },
            { id: 'stargazers', name: 'Observadores das Estrelas', auspice: 'Theurge', totem: 'Coruja' }
        ];
        
        this.auspices = [
            { id: 'ragabash', name: 'Ragabash', moon: 'Lua Nova', role: 'Trapaceiro' },
            { id: 'theurge', name: 'Theurge', moon: 'Lua Crescente', role: 'Xamã' },
            { id: 'philodox', name: 'Philodox', moon: 'Meia Lua', role: 'Juiz' },
            { id: 'galliard', name: 'Galliard', moon: 'Lua Gibosa', role: 'Bardo' },
            { id: 'ahroun', name: 'Ahroun', moon: 'Lua Cheia', role: 'Guerreiro' }
        ];
        
        this.gifts = {
            ragabash: ['Sussurros na Escuridão', 'Olhos da Coruja', 'Sombra do Coiote'],
            theurge: ['Mão da Gaia', 'Olhos do Espírito', 'Fala com a Terra'],
            philodox: ['Olhos da Verdade', 'Presa do Leão', 'Justiça da Gaia'],
            galliard: ['Canção da Batalha', 'Dança do Vento', 'Pergaminho dos Antigos'],
            ahroun: ['Presa do Lobo', 'Pele de Pedra', 'Fúria da Tempestade']
        };
    }
    
    loadMageData() {
        this.traditions = [
            { id: 'hermetic', name: 'Herméticos', essence: 'Dinâmico', spheres: ['Forças', 'Matéria'] },
            { id: 'verbena', name: 'Verbena', essence: 'Padrão', spheres: ['Vida', 'Tempo'] },
            { id: 'ecstatic', name: 'Extáticos', essence: 'Primordial', spheres: ['Mente', 'Entropia'] },
            { id: 'virtual', name: 'Virtual Adepts', essence: 'Padrão', spheres: ['Correspondência', 'Forças'] },
            { id: 'euthanatos', name: 'Eutanatos', essence: 'Primordial', spheres: ['Entropia', 'Mente'] }
        ];
        
        this.spheres = [
            'Correspondência', 'Entropia', 'Forças', 'Vida', 'Matéria',
            'Mente', 'Prima Matéria', 'Espírito', 'Tempo'
        ];
    }
    
    setupEventListeners() {
        // Navegação entre abas
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.getAttribute('data-tab');
                this.switchTab(tab);
            });
        });
        
        // Controles de atributos
        document.querySelectorAll('.attr-increase').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const attribute = e.target.closest('.attribute').getAttribute('data-attr');
                const category = e.target.closest('.attribute-column').getAttribute('data-category');
                this.increaseAttribute(category, attribute);
            });
        });
        
        document.querySelectorAll('.attr-decrease').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const attribute = e.target.closest('.attribute').getAttribute('data-attr');
                const category = e.target.closest('.attribute-column').getAttribute('data-category');
                this.decreaseAttribute(category, attribute);
            });
        });
        
        // Sistema específico
        document.getElementById('char-clan')?.addEventListener('change', (e) => {
            this.character.vampire.clan = e.target.value;
            this.updateClanInfo();
        });
        
        document.getElementById('char-tribe')?.addEventListener('change', (e) => {
            this.character.werewolf.tribe = e.target.value;
            this.updateTribeInfo();
        });
        
        // Upload de avatar
        document.getElementById('portrait-upload')?.addEventListener('change', (e) => {
            this.uploadAvatar(e.target.files[0]);
        });
        
        // Rolagem de dados
        document.querySelector('.btn-roll-attributes')?.addEventListener('click', () => {
            this.rollAttributes();
        });
        
        // Botões de ação
        document.querySelector('.btn-save-character')?.addEventListener('click', () => {
            this.saveCharacter();
        });
        
        document.querySelector('.btn-export-sheet')?.addEventListener('click', () => {
            this.exportCharacterSheet();
        });
        
        document.querySelector('.btn-start-game')?.addEventListener('click', () => {
            this.startGameWithCharacter();
        });
        
        // Auto-save
        setInterval(() => {
            this.autoSave();
        }, 30000);
    }
    
    switchTab(tabId) {
        // Remove classe active de todas as abas
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });
        
        // Ativa aba selecionada
        document.querySelector(`.tab-btn[data-tab="${tabId}"]`)?.classList.add('active');
        document.getElementById(`tab-${tabId}`)?.classList.add('active');
        
        this.currentStep = this.getStepFromTab(tabId);
        this.updateProgress();
    }
    
    getStepFromTab(tabId) {
        const steps = {
            'basic': 1,
            'attributes': 2,
            'skills': 3,
            'discipline': 4,
            'equipment': 5
        };
        
        return steps[tabId] || 1;
    }
    
    updateProgress() {
        const progress = (this.currentStep / this.totalSteps) * 100;
        const progressBar = document.querySelector('.progress-bar');
        
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
            progressBar.textContent = `Passo ${this.currentStep} de ${this.totalSteps}`;
        }
    }
    
    increaseAttribute(category, attribute) {
        const currentValue = this.character.attributes[category][attribute];
        const maxValue = 5;
        
        if (currentValue >= maxValue) return;
        
        // Verifica pontos disponíveis
        const pointCost = this.getAttributeCost(currentValue + 1);
        if (this.points.attributes < pointCost) {
            this.showMessage('Pontos de atributo insuficientes!', 'error');
            return;
        }
        
        this.character.attributes[category][attribute] = currentValue + 1;
        this.points.attributes -= pointCost;
        
        this.updateAttributeUI(category, attribute);
        this.updatePointsDisplay();
    }
    
    decreaseAttribute(category, attribute) {
        const currentValue = this.character.attributes[category][attribute];
        const minValue = 1;
        
        if (currentValue <= minValue) return;
        
        // Devolve pontos
        const pointRefund = this.getAttributeCost(currentValue);
        this.character.attributes[category][attribute] = currentValue - 1;
        this.points.attributes += pointRefund;
        
        this.updateAttributeUI(category, attribute);
        this.updatePointsDisplay();
    }
    
    getAttributeCost(level) {
        // Custo progressivo: 1->2: 1 ponto, 2->3: 2 pontos, etc.
        return level;
    }
    
    updateAttributeUI(category, attribute) {
        const attributeElement = document.querySelector(`[data-category="${category}"] [data-attr="${attribute}"]`);
        if (!attributeElement) return;
        
        const value = this.character.attributes[category][attribute];
        const valueElement = attributeElement.querySelector('.attr-value');
        const dotsElement = attributeElement.querySelector('.attribute-dots');
        
        if (valueElement) {
            valueElement.textContent = value;
        }
        
        if (dotsElement) {
            dotsElement.innerHTML = '';
            for (let i = 0; i < 5; i++) {
                const dot = document.createElement('div');
                dot.className = `attribute-dot ${i < value ? 'filled' : ''}`;
                dotsElement.appendChild(dot);
            }
        }
    }
    
    updatePointsDisplay() {
        const pointsElement = document.getElementById('attr-points');
        if (pointsElement) {
            pointsElement.textContent = this.points.attributes;
            
            // Altera cor se estiver com poucos pontos
            if (this.points.attributes < 3) {
                pointsElement.style.color = '#FF4444';
            } else if (this.points.attributes < 6) {
                pointsElement.style.color = '#FFA500';
            } else {
                pointsElement.style.color = '#32CD32';
            }
        }
    }
    
    updateClanInfo() {
        const clanId = this.character.vampire.clan;
        const clan = this.clans.find(c => c.id === clanId);
        
        if (!clan) return;
        
        // Atualiza informações do clã
        const infoElement = document.getElementById('clan-info');
        if (infoElement) {
            infoElement.innerHTML = `
                <h4>${clan.name}</h4>
                <p>${clan.description}</p>
                <div class="clan-disciplines">
                    <strong>Disciplinas:</strong>
                    ${clan.disciplines.map(d => `<span class="discipline-badge">${d}</span>`).join(' ')}
                </div>
            `;
        }
        
        // Atualiza disciplinas disponíveis
        this.updateDisciplinesList(clan.disciplines);
    }
    
    updateTribeInfo() {
        const tribeId = this.character.werewolf.tribe;
        const tribe = this.tribes.find(t => t.id === tribeId);
        
        if (!tribe) return;
        
        const infoElement = document.getElementById('tribe-info');
        if (infoElement) {
            infoElement.innerHTML = `
                <h4>${tribe.name}</h4>
                <p><strong>Auspício Sugerido:</strong> ${tribe.auspice}</p>
                <p><strong>Totem:</strong> ${tribe.totem}</p>
            `;
        }
        
        // Atualiza auspício se não estiver definido
        if (!this.character.werewolf.auspice) {
            document.getElementById('char-auspice').value = tribe.auspice.toLowerCase();
            this.character.werewolf.auspice = tribe.auspice.toLowerCase();
        }
    }
    
    updateDisciplinesList(availableDisciplines) {
        const container = document.getElementById('disciplines-list');
        if (!container) return;
        
        container.innerHTML = '';
        
        availableDisciplines.forEach(discipline => {
            const div = document.createElement('div');
            div.className = 'discipline-item';
            div.innerHTML = `
                <label>
                    <input type="checkbox" value="${discipline.toLowerCase()}">
                    ${discipline}
                </label>
                <div class="discipline-dots">
                    <button class="dot-btn minus">-</button>
                    <span class="dot-count">0</span>
                    <button class="dot-btn plus">+</button>
                </div>
            `;
            
            container.appendChild(div);
            
            // Event listeners para os pontos
            div.querySelector('.minus').addEventListener('click', () => {
                this.adjustDiscipline(discipline, -1);
            });
            
            div.querySelector('.plus').addEventListener('click', () => {
                this.adjustDiscipline(discipline, 1);
            });
        });
    }
    
    adjustDiscipline(discipline, change) {
        const disc = this.character.vampire.disciplines.find(d => d.name === discipline);
        
        if (!disc && change > 0) {
            // Adiciona nova disciplina
            this.character.vampire.disciplines.push({
                name: discipline,
                level: 1,
                description: ''
            });
        } else if (disc) {
            disc.level = Math.max(0, Math.min(5, disc.level + change));
            
            if (disc.level === 0) {
                // Remove disciplina
                this.character.vampire.disciplines = this.character.vampire.disciplines.filter(
                    d => d.name !== discipline
                );
            }
        }
        
        this.updateDisciplineUI(discipline);
    }
    
    updateDisciplineUI(discipline) {
        const disc = this.character.vampire.disciplines.find(d => d.name === discipline);
        const level = disc ? disc.level : 0;
        
        const item = document.querySelector(`.discipline-item input[value="${discipline.toLowerCase()}"]`);
        if (!item) return;
        
        const countElement = item.closest('.discipline-item').querySelector('.dot-count');
        if (countElement) {
            countElement.textContent = level;
        }
    }
    
    async uploadAvatar(file) {
        if (!file) return;
        
        if (!file.type.startsWith('image/')) {
            this.showMessage('Por favor, selecione um arquivo de imagem.', 'error');
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) { // 5MB
            this.showMessage('A imagem deve ter menos de 5MB.', 'error');
            return;
        }
        
        try {
            // Em produção, enviaria para servidor
            // Por enquanto, usa Data URL
            const reader = new FileReader();
            
            reader.onload = (e) => {
                this.character.avatar = e.target.result;
                this.updateAvatarPreview();
                this.showMessage('Avatar atualizado com sucesso!', 'success');
            };
            
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Erro ao carregar avatar:', error);
            this.showMessage('Erro ao carregar imagem.', 'error');
        }
    }
    
    updateAvatarPreview() {
        const preview = document.getElementById('portrait-preview');
        if (preview) {
            preview.src = this.character.avatar;
        }
    }
    
    rollAttributes() {
        if (!window.diceRoller) {
            this.showMessage('Sistema de dados não disponível.', 'error');
            return;
        }
        
        const attributes = ['strength', 'dexterity', 'stamina', 'charisma', 'manipulation', 'appearance', 'perception', 'intelligence', 'wits'];
        const results = {};
        
        attributes.forEach(attr => {
            // Rola 4d6, descarta o menor
            const rolls = [];
            for (let i = 0; i < 4; i++) {
                rolls.push(Math.floor(Math.random() * 6) + 1);
            }
            
            rolls.sort((a, b) => a - b);
            rolls.shift(); // Remove o menor
            
            const total = rolls.reduce((sum, roll) => sum + roll, 0);
            results[attr] = total;
        });
        
        // Aplica os resultados
        this.character.attributes.physical.strength = this.getAttributeValue(results.strength);
        this.character.attributes.physical.dexterity = this.getAttributeValue(results.dexterity);
        this.character.attributes.physical.stamina = this.getAttributeValue(results.stamina);
        this.character.attributes.social.charisma = this.getAttributeValue(results.charisma);
        this.character.attributes.social.manipulation = this.getAttributeValue(results.manipulation);
        this.character.attributes.social.appearance = this.getAttributeValue(results.appearance);
        this.character.attributes.mental.perception = this.getAttributeValue(results.perception);
        this.character.attributes.mental.intelligence = this.getAttributeValue(results.intelligence);
        this.character.attributes.mental.wits = this.getAttributeValue(results.wits);
        
        // Atualiza a interface
        this.updateAllAttributes();
        this.showRollResults(results);
    }
    
    getAttributeValue(rollResult) {
        // Converte resultado de rolagem para valor de atributo (1-5)
        if (rollResult >= 16) return 5;
        if (rollResult >= 14) return 4;
        if (rollResult >= 12) return 3;
        if (rollResult >= 10) return 2;
        return 1;
    }
    
    updateAllAttributes() {
        Object.keys(this.character.attributes).forEach(category => {
            Object.keys(this.character.attributes[category]).forEach(attribute => {
                this.updateAttributeUI(category, attribute);
            });
        });
    }
    
    showRollResults(results) {
        const container = document.querySelector('.roll-results');
        if (!container) return;
        
        let html = '<h4>Resultados da Rolagem:</h4><div class="results-grid">';
        
        Object.entries(results).forEach(([attr, value]) => {
            const attributeName = this.getAttributeDisplayName(attr);
            const finalValue = this.getAttributeValue(value);
            
            html += `
                <div class="result-item">
                    <span class="attr-name">${attributeName}:</span>
                    <span class="roll-value">${value}</span>
                    <span class="arrow">→</span>
                    <span class="final-value">${finalValue}</span>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
    }
    
    getAttributeDisplayName(attr) {
        const names = {
            strength: 'Força',
            dexterity: 'Destreza',
            stamina: 'Vigor',
            charisma: 'Carisma',
            manipulation: 'Manipulação',
            appearance: 'Aparência',
            perception: 'Percepção',
            intelligence: 'Inteligência',
            wits: 'Raciocínio'
        };
        
        return names[attr] || attr;
    }
    
    saveCharacter() {
        // Coleta dados dos campos
        this.collectFormData();
        
        // Validação básica
        if (!this.character.name) {
            this.showMessage('Por favor, digite um nome para o personagem.', 'error');
            return;
        }
        
        // Salva no localStorage
        const userCharacters = JSON.parse(localStorage.getItem('userCharacters') || '[]');
        
        // Verifica se é um personagem existente
        const existingIndex = userCharacters.findIndex(c => c.id === this.character.id);
        
        if (existingIndex !== -1) {
            userCharacters[existingIndex] = this.character;
        } else {
            userCharacters.push(this.character);
        }
        
        localStorage.setItem('userCharacters', JSON.stringify(userCharacters));
        
        this.showMessage('Personagem salvo com sucesso!', 'success');
        
        // Atualiza timestamp
        this.character.updated = new Date().toISOString();
    }
    
    collectFormData() {
        // Coleta dados básicos
        const nameInput = document.getElementById('char-name');
        const playerInput = document.getElementById('player-name');
        const descriptionInput = document.getElementById('char-description');
        
        if (nameInput) this.character.name = nameInput.value;
        if (playerInput) this.character.playerName = playerInput.value;
        if (descriptionInput) this.character.description = descriptionInput.value;
        
        // Coleta dados específicos do sistema
        switch(this.system) {
            case 'vampire':
                this.collectVampireData();
                break;
            case 'werewolf':
                this.collectWerewolfData();
                break;
            case 'mage':
                this.collectMageData();
                break;
        }
    }
    
    collectVampireData() {
        const clanSelect = document.getElementById('char-clan');
        const generationSelect = document.getElementById('char-generation');
        const sireInput = document.getElementById('char-sire');
        const humanityInput = document.getElementById('char-humanity');
        const willpowerInput = document.getElementById('char-willpower');
        
        if (clanSelect) this.character.vampire.clan = clanSelect.value;
        if (generationSelect) this.character.vampire.generation = parseInt(generationSelect.value);
        if (sireInput) this.character.vampire.sire = sireInput.value;
        if (humanityInput) this.character.vampire.humanity = parseInt(humanityInput.value);
        if (willpowerInput) this.character.vampire.willpower = parseInt(willpowerInput.value);
    }
    
    collectWerewolfData() {
        const tribeSelect = document.getElementById('char-tribe');
        const auspiceSelect = document.getElementById('char-auspice');
        const breedSelect = document.getElementById('char-breed');
        const totemInput = document.getElementById('char-totem');
        const rageInput = document.getElementById('char-rage');
        const gnosisInput = document.getElementById('char-gnosis');
        
        if (tribeSelect) this.character.werewolf.tribe = tribeSelect.value;
        if (auspiceSelect) this.character.werewolf.auspice = auspiceSelect.value;
        if (breedSelect) this.character.werewolf.breed = breedSelect.value;
        if (totemInput) this.character.werewolf.totem = totemInput.value;
        if (rageInput) this.character.werewolf.rage = parseInt(rageInput.value);
        if (gnosisInput) this.character.werewolf.gnosis = parseInt(gnosisInput.value);
    }
    
    async exportCharacterSheet(format = 'pdf') {
        // Primeiro salva o personagem
        this.saveCharacter();
        
        // Prepara dados para exportação
        const exportData = {
            meta: {
                system: this.system,
                version: '1.0',
                exportDate: new Date().toISOString(),
                format: format
            },
            character: this.character
        };
        
        // Simula exportação
        if (format === 'json') {
            const dataStr = JSON.stringify(exportData, null, 2);
            this.downloadFile(dataStr, `${this.character.name}_ficha.json`, 'application/json');
        } else if (format === 'html') {
            const html = this.generateHTMLSheet();
            this.downloadFile(html, `${this.character.name}_ficha.html`, 'text/html');
        } else {
            this.showMessage('Exportação para PDF em desenvolvimento...', 'info');
            // Em produção, usaria uma biblioteca como jsPDF
        }
    }
    
    generateHTMLSheet() {
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Ficha de ${this.character.name}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .section { margin-bottom: 20px; border-bottom: 1px solid #ccc; padding-bottom: 10px; }
        .attribute-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        .attribute { background: #f5f5f5; padding: 10px; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${this.character.name}</h1>
        <p>Sistema: ${this.system.toUpperCase()} | Jogador: ${this.character.playerName}</p>
    </div>
    
    <div class="section">
        <h2>Atributos</h2>
        <div class="attribute-grid">
            ${Object.entries(this.character.attributes).map(([category, attrs]) => `
                <div class="attribute-category">
                    <h3>${category}</h3>
                    ${Object.entries(attrs).map(([attr, value]) => `
                        <div class="attribute">
                            <strong>${attr}:</strong> ${value}
                        </div>
                    `).join('')}
                </div>
            `).join('')}
        </div>
    </div>
    
    <div class="section">
        <h2>Informações Adicionais</h2>
        <p><strong>Descrição:</strong> ${this.character.description}</p>
        <p><strong>Criado em:</strong> ${new Date(this.character.created).toLocaleDateString()}</p>
    </div>
</body>
</html>`;
    }
    
    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    startGameWithCharacter() {
        this.saveCharacter();
        
        // Salva personagem como ativo
        localStorage.setItem('activeCharacter', JSON.stringify(this.character));
        
        // Redireciona para busca de sessões
        window.location.href = `index.html?character=${this.character.id}`;
    }
    
    loadSavedCharacter() {
        const urlParams = new URLSearchParams(window.location.search);
        const charId = urlParams.get('character');
        
        if (!charId) return;
        
        const userCharacters = JSON.parse(localStorage.getItem('userCharacters') || '[]');
        const savedChar = userCharacters.find(c => c.id === parseInt(charId));
        
        if (savedChar) {
            this.character = { ...this.character, ...savedChar };
            this.loadCharacterIntoForm();
            this.showMessage('Personagem carregado com sucesso!', 'success');
        }
    }
    
    loadCharacterIntoForm() {
        // Carrega dados básicos
        const nameInput = document.getElementById('char-name');
        const playerInput = document.getElementById('player-name');
        const descriptionInput = document.getElementById('char-description');
        
        if (nameInput) nameInput.value = this.character.name;
        if (playerInput) playerInput.value = this.character.playerName;
        if (descriptionInput) descriptionInput.value = this.character.description;
        
        // Carrega avatar
        this.updateAvatarPreview();
        
        // Carrega atributos
        this.updateAllAttributes();
        
        // Carrega dados específicos
        switch(this.system) {
            case 'vampire':
                this.loadVampireIntoForm();
                break;
            case 'werewolf':
                this.loadWerewolfIntoForm();
                break;
        }
    }
    
    loadVampireIntoForm() {
        const clanSelect = document.getElementById('char-clan');
        const generationSelect = document.getElementById('char-generation');
        
        if (clanSelect && this.character.vampire.clan) {
            clanSelect.value = this.character.vampire.clan;
            this.updateClanInfo();
        }
        
        if (generationSelect && this.character.vampire.generation) {
            generationSelect.value = this.character.vampire.generation.toString();
        }
    }
    
    autoSave() {
        this.collectFormData();
        
        // Salva rascunho
        const draftKey = `character_draft_${this.system}`;
        localStorage.setItem(draftKey, JSON.stringify(this.character));
        
        console.log('Auto-save realizado');
    }
    
    showMessage(message, type = 'info') {
        // Remove mensagens anteriores
        const existingMessages = document.querySelectorAll('.creator-message');
        existingMessages.forEach(msg => msg.remove());
        
        // Cria nova mensagem
        const messageDiv = document.createElement('div');
        messageDiv.className = `creator-message ${type}`;
        messageDiv.innerHTML = `
            <span class="message-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
            <span class="message-text">${message}</span>
            <button class="message-close">&times;</button>
        `;
        
        // Adiciona ao container
        const container = document.querySelector('.creator-actions') || document.body;
        container.insertBefore(messageDiv, container.firstChild);
        
        // Remove após 5 segundos
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
        
        // Botão de fechar
        messageDiv.querySelector('.message-close').addEventListener('click', () => {
            messageDiv.remove();
        });
    }
    
    loadTemplates() {
        return {
            vampire: [
                {
                    name: 'Ventrue Executivo',
                    clan: 'ventrue',
                    attributes: { strength: 2, dexterity: 2, stamina: 2, charisma: 4, manipulation: 3, appearance: 3, perception: 3, intelligence: 3, wits: 3 },
                    disciplines: ['Dominate', 'Presence'],
                    description: 'Um executivo bem-sucedido que agora manipula o mundo dos negócios à noite.'
                },
                {
                    name: 'Brujah Revolucionário',
                    clan: 'brujah',
                    attributes: { strength: 4, dexterity: 3, stamina: 3, charisma: 2, manipulation: 2, appearance: 2, perception: 3, intelligence: 2, wits: 4 },
                    disciplines: ['Celerity', 'Potence'],
                    description: 'Um ativista que encontrou uma nova causa na sociedade vampírica.'
                }
            ],
            werewolf: [
                {
                    name: 'Urban Ragabash',
                    tribe: 'glasswalkers',
                    auspice: 'ragabash',
                    attributes: { strength: 2, dexterity: 4, stamina: 2, charisma: 3, manipulation: 4, appearance: 2, perception: 3, intelligence: 3, wits: 4 },
                    gifts: ['Sussurros na Escuridão', 'Olhos da Coruja'],
                    description: 'Um trapaceiro urbano que usa a tecnologia para lutar contra a Wyrm.'
                }
            ]
        };
    }
    
    applyTemplate(templateName) {
        const templates = this.templates[this.system];
        const template = templates?.find(t => t.name === templateName);
        
        if (!template) {
            this.showMessage('Template não encontrado.', 'error');
            return;
        }
        
        // Aplica atributos
        Object.keys(template.attributes).forEach(attr => {
            const [category, attribute] = this.findAttributeCategory(attr);
            if (category && attribute) {
                this.character.attributes[category][attribute] = template.attributes[attr];
            }
        });
        
        // Aplica dados específicos
        if (this.system === 'vampire') {
            this.character.vampire.clan = template.clan;
            this.character.vampire.disciplines = template.disciplines.map(d => ({
                name: d,
                level: 1,
                description: ''
            }));
        } else if (this.system === 'werewolf') {
            this.character.werewolf.tribe = template.tribe;
            this.character.werewolf.auspice = template.auspice;
        }
        
        this.character.description = template.description;
        this.character.name = template.name;
        
        // Atualiza UI
        this.updateAllAttributes();
        this.loadCharacterIntoForm();
        
        this.showMessage(`Template "${templateName}" aplicado com sucesso!`, 'success');
    }
    
    findAttributeCategory(attributeName) {
        for (const [category, attrs] of Object.entries(this.character.attributes)) {
            if (attrs.hasOwnProperty(attributeName)) {
                return [category, attributeName];
            }
        }
        return [null, null];
    }
}

// Inicialização global
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const system = urlParams.get('system') || 'vampire';
    
    window.characterCreator = new CharacterCreator(system);
    
    // Funções globais para templates
    window.applyCharacterTemplate = (templateName) => {
        if (window.characterCreator) {
            window.characterCreator.applyTemplate(templateName);
        }
    };
    
    // Atalhos de teclado
    document.addEventListener('keydown', (e) => {
        // Ctrl + S: Salvar personagem
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            if (window.characterCreator) {
                window.characterCreator.saveCharacter();
            }
        }
        
        // Ctrl + E: Exportar
        if (e.ctrlKey && e.key === 'e') {
            e.preventDefault();
            if (window.characterCreator) {
                window.characterCreator.exportCharacterSheet('json');
            }
        }
        
        // F1: Ajuda
        if (e.key === 'F1') {
            e.preventDefault();
            alert('Atalhos disponíveis:\nCtrl+S: Salvar personagem\nCtrl+E: Exportar ficha\nF1: Esta ajuda');
        }
    });
});

// Estilos CSS para o criador
const creatorStyles = `
.creator-message {
    padding: 10px 15px;
    margin: 10px 0;
    border-radius: 5px;
    display: flex;
    align-items: center;
    gap: 10px;
    animation: slideIn 0.3s ease;
}

.creator-message.success {
    background: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
}

.creator-message.error {
    background: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
}

.creator-message.info {
    background: #d1ecf1;
    color: #0c5460;
    border: 1px solid #bee5eb;
}

.message-close {
    margin-left: auto;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.2rem;
    color: inherit;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.progress-container {
    width: 100%;
    background: #e0e0e0;
    border-radius: 10px;
    margin: 20px 0;
    overflow: hidden;
}

.progress-bar {
    height: 20px;
    background: linear-gradient(90deg, #4CAF50, #8BC34A);
    text-align: center;
    color: white;
    line-height: 20px;
    font-size: 0.9rem;
    transition: width 0.3s ease;
}

.attribute-controls {
    display: flex;
    align-items: center;
    gap: 10px;
}

.attr-controls button {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: none;
    background: var(--primary);
    color: white;
    cursor: pointer;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
}

.attr-controls button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.attribute-dots {
    display: flex;
    gap: 3px;
}

.attribute-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 1px solid currentColor;
}

.attribute-dot.filled {
    background: currentColor;
}

.character-portrait {
    width: 150px;
    height: 150px;
    border: 3px solid var(--primary);
    border-radius: 10px;
    overflow: hidden;
    position: relative;
}

.character-portrait img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.character-portrait input {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,0.7);
    color: white;
    border: none;
    padding: 5px;
    cursor: pointer;
}

.discipline-badge {
    display: inline-block;
    padding: 3px 8px;
    margin: 2px;
    background: rgba(139, 0, 0, 0.2);
    border-radius: 10px;
    font-size: 0.8rem;
    border: 1px solid var(--primary);
}

.results-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-top: 10px;
}

.result-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 10px;
    background: rgba(0,0,0,0.1);
    border-radius: 5px;
}

.roll-value {
    font-weight: bold;
    color: var(--primary);
}

.final-value {
    font-weight: bold;
    color: #4CAF50;
}

.creator-actions {
    display: flex;
    gap: 10px;
    margin-top: 20px;
    flex-wrap: wrap;
}

.creator-actions button {
    flex: 1;
    min-width: 150px;
}

@media (max-width: 768px) {
    .results-grid {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .creator-actions {
        flex-direction: column;
    }
    
    .creator-actions button {
        width: 100%;
    }
}
`;

// Adiciona estilos ao documento
const styleElement = document.createElement('style');
styleElement.textContent = creatorStyles;
document.head.appendChild(styleElement);