// rpg-room.js - Sistema de Sala de RPG

class RPGRoom {
    constructor(roomId) {
        this.roomId = roomId;
        this.players = [];
        this.spectators = [];
        this.messages = [];
        this.narration = [];
        this.isGM = false;
        this.timer = null;
        this.diceHistory = [];
        
        this.init();
    }
    
    init() {
        this.loadRoomData();
        this.setupEventListeners();
        this.startSessionTimer();
        this.connectToRoom();
    }
    
    loadRoomData() {
        const roomData = JSON.parse(localStorage.getItem(`room_${this.roomId}`)) || {
            title: 'Sessão de RPG',
            system: 'vampire',
            maxPlayers: 5,
            maxSpectators: 20,
            isPrivate: false,
            password: null,
            createdAt: new Date().toISOString()
        };
        
        this.roomData = roomData;
        this.updateRoomUI();
    }
    
    updateRoomUI() {
        document.getElementById('room-title').textContent = this.roomData.title;
        document.getElementById('player-count').textContent = `${this.players.length}/${this.roomData.maxPlayers}`;
        document.getElementById('spectator-count').textContent = this.spectators.length;
    }
    
    setupEventListeners() {
        // Chat
        document.getElementById('chat-input')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendChatMessage();
            }
        });
        
        document.querySelector('.btn-send-chat')?.addEventListener('click', () => {
            this.sendChatMessage();
        });
        
        // Ação do jogador
        document.querySelector('.btn-send-action')?.addEventListener('click', () => {
            this.sendPlayerAction();
        });
        
        // Dados rápidos
        document.querySelectorAll('.btn-dice-quick').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const diceType = e.target.getAttribute('data-dice');
                this.rollQuickDice(diceType);
            });
        });
        
        // Ferramentas
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tool = e.target.closest('.tool-btn').getAttribute('data-tool');
                this.openTool(tool);
            });
        });
    }
    
    connectToRoom() {
        // Simulação de conexão WebSocket
        console.log(`Conectando à sala ${this.roomId}...`);
        
        // Em produção, aqui seria WebSocket
        this.simulateConnection();
    }
    
    simulateConnection() {
        // Adiciona alguns jogadores de exemplo
        setTimeout(() => {
            this.addPlayer({
                id: 1,
                name: 'GM',
                avatar: 'assets/avatars/gm.png',
                isGM: true,
                status: 'online'
            });
            
            this.addPlayer({
                id: 2,
                name: 'Elena',
                avatar: 'assets/avatars/elena.png',
                character: 'Lady Elena Ventrue',
                status: 'online',
                health: 7,
                maxHealth: 8
            });
        }, 1000);
    }
    
    addPlayer(playerData) {
        this.players.push(playerData);
        this.updatePlayerList();
        
        // Notifica outros jogadores
        this.broadcastMessage('system', `${playerData.name} entrou na sala.`);
    }
    
    updatePlayerList() {
        const container = document.querySelector('.players-list');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.players.forEach(player => {
            const playerCard = document.createElement('div');
            playerCard.className = `player-card ${player.isGM ? 'gm' : ''}`;
            playerCard.innerHTML = `
                <div class="player-avatar">
                    <img src="${player.avatar || 'assets/avatars/default.png'}" alt="${player.name}">
                    <span class="player-status ${player.status}"></span>
                </div>
                <div class="player-info">
                    <div class="player-name">
                        <strong>${player.name}</strong>
                        ${player.isGM ? '<span class="player-role">🎭 Narrador</span>' : ''}
                    </div>
                    ${player.character ? `
                    <div class="player-character">
                        <i class="fas fa-address-card"></i>
                        <span>${player.character}</span>
                    </div>
                    ` : ''}
                    ${player.health !== undefined ? `
                    <div class="player-health">
                        <div class="health-bar">
                            <div class="health-fill" style="width: ${(player.health / player.maxHealth) * 100}%"></div>
                        </div>
                        <span class="health-text">${player.health}/${player.maxHealth}</span>
                    </div>
                    ` : ''}
                </div>
            `;
            
            container.appendChild(playerCard);
        });
    }
    
    sendChatMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        const messageData = {
            id: Date.now(),
            sender: 'Você',
            content: message,
            timestamp: new Date().toISOString(),
            type: 'chat'
        };
        
        this.addMessage(messageData);
        
        // Em produção, enviaria para servidor
        this.broadcastMessage('player', message, 'Você');
        
        input.value = '';
    }
    
    sendPlayerAction() {
        const input = document.getElementById('player-action-input');
        const actionType = document.getElementById('action-type').value;
        const action = input.value.trim();
        
        if (!action) return;
        
        const actionData = {
            id: Date.now(),
            sender: 'Você',
            content: action,
            type: actionType,
            timestamp: new Date().toISOString()
        };
        
        // Adiciona à narração
        this.addNarration(actionData);
        
        // Processa com IA se necessário
        if (actionType === 'action' && window.aiNarrator) {
            this.processActionWithAI(action);
        }
        
        input.value = '';
    }
    
    async processActionWithAI(action) {
        try {
            const narration = await window.aiNarrator.processPlayerAction('Você', action);
            
            setTimeout(() => {
                this.addNarration({
                    id: Date.now(),
                    sender: 'Narrador (IA)',
                    content: narration,
                    type: 'narration',
                    timestamp: new Date().toISOString()
                });
            }, 1000);
        } catch (error) {
            console.error('Erro ao processar com IA:', error);
        }
    }
    
    addMessage(messageData) {
        this.messages.push(messageData);
        this.renderMessage(messageData);
    }
    
    addNarration(narrationData) {
        this.narration.push(narrationData);
        this.renderNarration(narrationData);
    }
    
    renderMessage(messageData) {
        const container = document.getElementById('chat-messages');
        if (!container) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${messageData.type}`;
        
        const time = new Date(messageData.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        messageDiv.innerHTML = `
            <span class="message-sender">${messageData.sender}:</span>
            <span class="message-content">${messageData.content}</span>
            <span class="message-time">${time}</span>
        `;
        
        container.appendChild(messageDiv);
        container.scrollTop = container.scrollHeight;
    }
    
    renderNarration(narrationData) {
        const container = document.getElementById('narration-content');
        if (!container) return;
        
        const narrationDiv = document.createElement('div');
        narrationDiv.className = `narration-message ${narrationData.sender === 'Você' ? 'player' : 'gm'}`;
        
        const time = new Date(narrationData.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        narrationDiv.innerHTML = `
            <div class="message-sender">
                ${narrationData.sender === 'Narrador (IA)' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>'}
                <strong>${narrationData.sender}:</strong>
                <span class="message-time">${time}</span>
            </div>
            <div class="message-content">
                <p>${narrationData.content}</p>
            </div>
        `;
        
        container.appendChild(narrationDiv);
        container.scrollTop = container.scrollHeight;
    }
    
    broadcastMessage(type, content, sender = 'Sistema') {
        // Em produção, enviaria via WebSocket
        console.log(`Broadcasting: ${sender} - ${content}`);
        
        // Simula resposta de outros jogadores
        if (type === 'player' && sender === 'Você') {
            setTimeout(() => {
                const responses = [
                    "Interessante...",
                    "O que você acha disso?",
                    "Vamos em frente!",
                    "Precisamos discutir isso."
                ];
                
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                this.addMessage({
                    id: Date.now(),
                    sender: 'Outro Jogador',
                    content: randomResponse,
                    type: 'chat',
                    timestamp: new Date().toISOString()
                });
            }, 2000);
        }
    }
    
    rollQuickDice(diceType) {
        if (!window.diceRoller) return;
        
        const result = window.diceRoller.roll(diceType, 1, 0);
        
        // Adiciona ao histórico
        const historyContainer = document.getElementById('dice-history');
        if (historyContainer) {
            const rollItem = document.createElement('div');
            rollItem.className = 'dice-roll-item';
            rollItem.innerHTML = `
                <span class="dice-roller">Você</span>
                <span class="dice-type">${diceType}</span>
                <span class="dice-result">${result.total}</span>
                <span class="dice-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            `;
            
            historyContainer.prepend(rollItem);
            
            // Limita histórico
            if (historyContainer.children.length > 10) {
                historyContainer.lastChild.remove();
            }
        }
        
        // Adiciona à narração
        this.addNarration({
            id: Date.now(),
            sender: 'Sistema',
            content: `🎲 Rolagem: ${diceType} = ${result.total}`,
            type: 'dice',
            timestamp: new Date().toISOString()
        });
    }
    
    openTool(tool) {
        const tools = {
            dice: () => this.openDiceRoller(),
            map: () => this.openMapTool(),
            music: () => this.openMusicPlayer(),
            notes: () => this.openNotes(),
            character: () => this.openCharacterSheet(),
            inventory: () => this.openInventory(),
            rulebook: () => this.openRulebook(),
            settings: () => this.openSettings()
        };
        
        if (tools[tool]) {
            tools[tool]();
        }
    }
    
    openDiceRoller() {
        if (window.diceRoller) {
            window.diceRoller.showDiceTray();
        }
    }
    
    openMapTool() {
        alert('Ferramenta de Mapa - Em desenvolvimento');
    }
    
    openMusicPlayer() {
        if (window.rpgAmbience) {
            window.rpgAmbience.openPlayer();
        }
    }
    
    openNotes() {
        const notes = localStorage.getItem(`room_${this.roomId}_notes`) || '';
        const notesText = prompt('Anotações da sessão:', notes);
        
        if (notesText !== null) {
            localStorage.setItem(`room_${this.roomId}_notes`, notesText);
        }
    }
    
    startSessionTimer() {
        let seconds = 0;
        const timerElement = document.getElementById('session-timer');
        
        this.timer = setInterval(() => {
            seconds++;
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const secs = seconds % 60;
            
            if (timerElement) {
                timerElement.textContent = 
                    `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            }
        }, 1000);
    }
    
    saveRoom() {
        const roomData = {
            ...this.roomData,
            players: this.players,
            spectators: this.spectators,
            messages: this.messages.slice(-100), // Salva últimas 100 mensagens
            narration: this.narration.slice(-50), // Salva últimas 50 narrações
            lastUpdated: new Date().toISOString()
        };
        
        localStorage.setItem(`room_${this.roomId}`, JSON.stringify(roomData));
    }
    
    leaveRoom() {
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        this.saveRoom();
        
        // Em produção, desconectaria do WebSocket
        console.log(`Desconectando da sala ${this.roomId}...`);
        
        // Redireciona para homepage
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 500);
    }
}

// Inicialização quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('room') || 'default';
    
    window.rpgRoom = new RPGRoom(roomId);
    
    // Botão de sair
    document.querySelector('.btn-leave')?.addEventListener('click', () => {
        if (window.rpgRoom) {
            window.rpgRoom.leaveRoom();
        }
    });
    
    // Salva ao sair da página
    window.addEventListener('beforeunload', () => {
        if (window.rpgRoom) {
            window.rpgRoom.saveRoom();
        }
    });
});