// app.js - Aplicação Principal da Plataforma RPG

class RPGPlatform {
    constructor() {
        this.currentSystem = 'vampire';
        this.currentUser = null;
        this.activeSessions = [];
        this.characterData = {};
        
        this.init();
    }
    
    init() {
        this.loadUserPreferences();
        this.setupEventListeners();
        this.checkForUpdates();
        this.initializeStorage();
    }
    
    loadUserPreferences() {
        // Carrega tema salvo
        const savedTheme = localStorage.getItem('rpgTheme') || 'vampire';
        this.setTheme(savedTheme);
        this.currentSystem = savedTheme;
        
        // Carrega dados do usuário
        const userData = localStorage.getItem('rpgUserData');
        if (userData) {
            this.currentUser = JSON.parse(userData);
            this.updateUIForUser();
        }
    }
    
    setTheme(system) {
        document.documentElement.setAttribute('data-theme', system);
        localStorage.setItem('rpgTheme', system);
        this.currentSystem = system;
        
        // Atualiza componentes específicos do tema
        this.updateThemeComponents();
    }
    
    updateThemeComponents() {
        // Atualiza cores de componentes específicos
        const themeColors = {
            vampire: { primary: '#8B0000', secondary: '#2C2C2C' },
            werewolf: { primary: '#8B4513', secondary: '#2F4F4F' },
            mage: { primary: '#4B0082', secondary: '#2E2E5A' },
            tormenta: { primary: '#228B22', secondary: '#006400' },
            dnd: { primary: '#1E90FF', secondary: '#00008B' }
        };
        
        const colors = themeColors[this.currentSystem] || themeColors.vampire;
        
        // Aplica cores CSS dinâmicas
        document.documentElement.style.setProperty('--theme-primary', colors.primary);
        document.documentElement.style.setProperty('--theme-secondary', colors.secondary);
    }
    
    setupEventListeners() {
        // Sistema de notificações
        this.setupNotifications();
        
        // Atalhos de teclado
        this.setupKeyboardShortcuts();
        
        // Gerenciamento de conexão
        this.setupConnectionMonitor();
    }
    
    setupNotifications() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    console.log('Notificações habilitadas');
                }
            });
        }
    }
    
    sendNotification(title, message, icon = '🎲') {
        if (Notification.permission === 'granted') {
            new Notification(title, {
                body: message,
                icon: `/assets/icons/${icon}.png`
            });
        }
        
        // Fallback para navegadores sem suporte
        this.showToastNotification(title, message);
    }
    
    showToastNotification(title, message) {
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.innerHTML = `
            <div class="toast-icon">🎲</div>
            <div class="toast-content">
                <strong>${title}</strong>
                <p>${message}</p>
            </div>
            <button class="toast-close">&times;</button>
        `;
        
        document.body.appendChild(toast);
        
        // Remove após 5 segundos
        setTimeout(() => {
            toast.remove();
        }, 5000);
        
        // Fechar ao clicar
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.remove();
        });
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl + D: Rolagem rápida de dados
            if (e.ctrlKey && e.key === 'd') {
                e.preventDefault();
                this.openQuickDiceRoller();
            }
            
            // Ctrl + M: Alternar música
            if (e.ctrlKey && e.key === 'm') {
                e.preventDefault();
                this.toggleBackgroundMusic();
            }
            
            // Ctrl + T: Alternar tema
            if (e.ctrlKey && e.key === 't') {
                e.preventDefault();
                this.cycleTheme();
            }
            
            // Ctrl + N: Nova sessão
            if (e.ctrlKey && e.key === 'n') {
                e.preventDefault();
                window.location.href = 'create-session.html';
            }
        });
    }
    
    openQuickDiceRoller() {
        const roller = document.createElement('div');
        roller.className = 'quick-dice-roller';
        roller.innerHTML = `
            <div class="roller-header">
                <h3>🎲 Rolagem Rápida</h3>
                <button class="close-roller">&times;</button>
            </div>
            <div class="roller-body">
                <div class="dice-buttons">
                    <button data-dice="d4">D4</button>
                    <button data-dice="d6">D6</button>
                    <button data-dice="d8">D8</button>
                    <button data-dice="d10">D10</button>
                    <button data-dice="d12">D12</button>
                    <button data-dice="d20">D20</button>
                    <button data-dice="d100">D100</button>
                </div>
                <div class="roll-results" id="quick-results"></div>
            </div>
        `;
        
        document.body.appendChild(roller);
        
        // Fechar
        roller.querySelector('.close-roller').addEventListener('click', () => {
            roller.remove();
        });
        
        // Configurar botões de dados
        roller.querySelectorAll('.dice-buttons button').forEach(button => {
            button.addEventListener('click', (e) => {
                const diceType = e.target.getAttribute('data-dice');
                this.rollDice(diceType);
            });
        });
    }
    
    rollDice(diceType) {
        const sides = parseInt(diceType.replace('d', ''));
        const result = Math.floor(Math.random() * sides) + 1;
        
        const resultsDiv = document.getElementById('quick-results');
        const resultElement = document.createElement('div');
        resultElement.className = 'dice-result';
        resultElement.innerHTML = `
            <span class="dice-type">${diceType}</span>
            <span class="dice-value">${result}</span>
            <span class="dice-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        `;
        
        resultsDiv.prepend(resultElement);
        
        // Efeito sonoro
        this.playDiceSound();
        
        // Limita a 5 resultados
        if (resultsDiv.children.length > 5) {
            resultsDiv.lastChild.remove();
        }
    }
    
    playDiceSound() {
        const audio = new Audio('/assets/audio/dice-roll.mp3');
        audio.volume = 0.3;
        audio.play().catch(e => console.log('Áudio não suportado'));
    }
    
    toggleBackgroundMusic() {
        const musicSystem = window.rpgAmbience;
        if (musicSystem) {
            if (musicSystem.isPlaying) {
                musicSystem.pauseMusic();
                this.sendNotification('Música', 'Música de ambiente pausada', '🎵');
            } else {
                musicSystem.playBackgroundMusic(this.currentSystem);
                this.sendNotification('Música', 'Música de ambiente iniciada', '🎵');
            }
        }
    }
    
    cycleTheme() {
        const themes = ['vampire', 'werewolf', 'mage', 'tormenta', 'dnd'];
        const currentIndex = themes.indexOf(this.currentSystem);
        const nextIndex = (currentIndex + 1) % themes.length;
        
        this.setTheme(themes[nextIndex]);
        this.sendNotification('Tema Alterado', `Mudou para tema: ${themes[nextIndex]}`, '🎨');
    }
    
    setupConnectionMonitor() {
        // Monitora conexão com internet
        window.addEventListener('online', () => {
            this.sendNotification('Conexão Restabelecida', 'Você está online novamente', '🌐');
            this.syncOfflineData();
        });
        
        window.addEventListener('offline', () => {
            this.sendNotification('Conexão Perdida', 'Modo offline ativado', '⚠️');
        });
    }
    
    syncOfflineData() {
        // Sincroniza dados salvos offline
        const offlineData = localStorage.getItem('offlineData');
        if (offlineData) {
            // Em produção, enviaria para servidor
            console.log('Sincronizando dados offline:', JSON.parse(offlineData));
            localStorage.removeItem('offlineData');
        }
    }
    
    initializeStorage() {
        // Verifica se há dados de exemplo
        if (!localStorage.getItem('exampleCharacters')) {
            this.loadExampleData();
        }
    }
    
    loadExampleData() {
        const exampleCharacters = [
            {
                id: 1,
                name: "Vladimir, o Antigo",
                system: "vampire",
                clan: "Tremere",
                generation: 8,
                attributes: { strength: 3, dexterity: 4, stamina: 3 },
                disciplines: ["Thaumaturgy", "Auspex"],
                description: "Um vampiro ancião buscando conhecimento proibido"
            },
            {
                id: 2,
                name: "Luna da Floresta",
                system: "werewolf",
                tribe: "Shadow Lords",
                breed: "Homid",
                auspice: "Ragabash",
                gifts: ["Persuasion", "Claws of the Wolf"],
                description: "Uma Garou astuta e estrategista"
            }
        ];
        
        localStorage.setItem('exampleCharacters', JSON.stringify(exampleCharacters));
    }
    
    // Sistema de login
    login(username, password) {
        // Em produção, seria uma chamada API
        const userData = {
            id: 1,
            username: username,
            email: `${username}@rpgplatform.com`,
            avatar: '/assets/avatars/default.png',
            preferences: {
                theme: this.currentSystem,
                notifications: true,
                musicVolume: 0.5
            },
            characters: [],
            sessions: [],
            stats: {
                gamesPlayed: 0,
                hoursPlayed: 0,
                rating: 5.0
            }
        };
        
        this.currentUser = userData;
        localStorage.setItem('rpgUserData', JSON.stringify(userData));
        
        this.sendNotification('Bem-vindo!', `Login realizado como ${username}`, '👋');
        this.updateUIForUser();
        
        return Promise.resolve(userData);
    }
    
    logout() {
        this.currentUser = null;
        localStorage.removeItem('rpgUserData');
        this.updateUIForUser();
        this.sendNotification('Até logo!', 'Logout realizado com sucesso', '👋');
    }
    
    updateUIForUser() {
        const loginBtn = document.querySelector('.btn-login');
        const userSection = document.querySelector('.nav-user');
        
        if (this.currentUser) {
            if (loginBtn) loginBtn.style.display = 'none';
            
            // Mostra informações do usuário
            if (userSection) {
                userSection.innerHTML = `
                    <div class="user-menu">
                        <img src="${this.currentUser.avatar}" alt="${this.currentUser.username}" class="user-avatar">
                        <span class="username">${this.currentUser.username}</span>
                        <div class="user-dropdown">
                            <a href="#"><i class="fas fa-user"></i> Perfil</a>
                            <a href="character-creator.html"><i class="fas fa-address-card"></i> Meus Personagens</a>
                            <a href="#"><i class="fas fa-cog"></i> Configurações</a>
                            <hr>
                            <a href="#" onclick="rpgPlatform.logout()"><i class="fas fa-sign-out-alt"></i> Sair</a>
                        </div>
                    </div>
                `;
            }
        }
    }
    
    // Gerenciamento de sessões
    createSession(sessionData) {
        const newSession = {
            id: Date.now(),
            ...sessionData,
            created: new Date().toISOString(),
            players: [],
            status: 'waiting'
        };
        
        // Salva localmente
        const sessions = JSON.parse(localStorage.getItem('userSessions') || '[]');
        sessions.push(newSession);
        localStorage.setItem('userSessions', JSON.stringify(sessions));
        
        this.sendNotification('Sessão Criada', `${sessionData.title} está aguardando jogadores`, '🎭');
        
        return newSession;
    }
    
    joinSession(sessionId, password = null) {
        // Em produção, validaria senha e limitações
        const session = this.findSession(sessionId);
        
        if (session) {
            if (session.private && session.password !== password) {
                throw new Error('Senha incorreta');
            }
            
            if (session.players.length >= session.maxPlayers) {
                throw new Error('Sessão lotada');
            }
            
            // Adiciona jogador
            session.players.push({
                id: this.currentUser?.id || 0,
                username: this.currentUser?.username || 'Convidado',
                character: null,
                joined: new Date().toISOString()
            });
            
            this.sendNotification('Entrando na Sessão', `Juntando-se a ${session.title}`, '🚪');
            
            // Redireciona para sala
            setTimeout(() => {
                window.location.href = `rpg-room.html?session=${sessionId}`;
            }, 1000);
            
            return session;
        }
        
        throw new Error('Sessão não encontrada');
    }
    
    findSession(sessionId) {
        // Busca em sessões locais
        const sessions = JSON.parse(localStorage.getItem('userSessions') || '[]');
        return sessions.find(s => s.id === parseInt(sessionId));
    }
    
    // Sistema de busca
    searchSessions(filters = {}) {
        const allSessions = JSON.parse(localStorage.getItem('allSessions') || '[]');
        
        return allSessions.filter(session => {
            // Filtro por sistema
            if (filters.system && session.system !== filters.system) return false;
            
            // Filtro por tipo de narrador
            if (filters.gmType && session.gmType !== filters.gmType) return false;
            
            // Filtro por vagas
            if (filters.hasVacancies && session.players.length >= session.maxPlayers) return false;
            
            // Filtro por texto
            if (filters.searchText) {
                const searchLower = filters.searchText.toLowerCase();
                if (!session.title.toLowerCase().includes(searchLower) &&
                    !session.description.toLowerCase().includes(searchLower)) {
                    return false;
                }
            }
            
            return true;
        });
    }
    
    // Gerenciamento de personagens
    createCharacter(characterData) {
        const newCharacter = {
            id: Date.now(),
            ...characterData,
            created: new Date().toISOString(),
            lastUsed: new Date().toISOString()
        };
        
        // Salva localmente
        const characters = JSON.parse(localStorage.getItem('userCharacters') || '[]');
        characters.push(newCharacter);
        localStorage.setItem('userCharacters', JSON.stringify(characters));
        
        // Atualiza usuário atual
        if (this.currentUser) {
            this.currentUser.characters.push(newCharacter.id);
            localStorage.setItem('rpgUserData', JSON.stringify(this.currentUser));
        }
        
        this.sendNotification('Personagem Criado', `${characterData.name} está pronto para aventuras!`, '🎭');
        
        return newCharacter;
    }
    
    exportCharacterSheet(characterId, format = 'pdf') {
        const character = this.getCharacter(characterId);
        if (!character) throw new Error('Personagem não encontrado');
        
        // Em produção, geraria PDF
        const sheetData = this.generateCharacterSheet(character);
        
        // Simula download
        const blob = new Blob([JSON.stringify(sheetData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${character.name}_ficha.${format}`;
        a.click();
        
        this.sendNotification('Ficha Exportada', `${character.name} exportado com sucesso`, '📄');
    }
    
    generateCharacterSheet(character) {
        // Gera dados da ficha formatados
        return {
            meta: {
                system: character.system,
                version: '1.0',
                exportDate: new Date().toISOString()
            },
            character: {
                basicInfo: {
                    name: character.name,
                    player: this.currentUser?.username || 'Anônimo',
                    experience: character.experience || 0
                },
                attributes: character.attributes || {},
                skills: character.skills || {},
                abilities: character.abilities || {},
                equipment: character.equipment || [],
                background: character.background || '',
                notes: character.notes || ''
            }
        };
    }
    
    getCharacter(characterId) {
        const characters = JSON.parse(localStorage.getItem('userCharacters') || '[]');
        return characters.find(c => c.id === parseInt(characterId));
    }
    
    // Sistema de atualizações
    checkForUpdates() {
        // Verifica por atualizações periodicamente
        setInterval(() => {
            this.checkAppVersion();
        }, 3600000); // A cada hora
    }
    
    checkAppVersion() {
        const currentVersion = '1.0.0';
        // Em produção, buscaria do servidor
        const latestVersion = '1.0.0';
        
        if (currentVersion !== latestVersion) {
            this.showUpdateNotification(latestVersion);
        }
    }
    
    showUpdateNotification(version) {
        const updateDiv = document.createElement('div');
        updateDiv.className = 'update-notification';
        updateDiv.innerHTML = `
            <div class="update-content">
                <i class="fas fa-sync-alt"></i>
                <div>
                    <strong>Atualização disponível!</strong>
                    <p>Versão ${version} está disponível. Atualize para novas funcionalidades.</p>
                </div>
                <button onclick="location.reload()">Atualizar Agora</button>
                <button class="update-later">Depois</button>
            </div>
        `;
        
        document.body.appendChild(updateDiv);
        
        // Remove ao clicar em "Depois"
        updateDiv.querySelector('.update-later').addEventListener('click', () => {
            updateDiv.remove();
        });
    }
    
    // Utilitários
    formatDuration(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    }
    
    getSystemIcon(system) {
        const icons = {
            vampire: 'fas fa-bat',
            werewolf: 'fas fa-paw',
            mage: 'fas fa-hat-wizard',
            tormenta: 'fas fa-scroll',
            dnd: 'fas fa-dragon'
        };
        return icons[system] || 'fas fa-dice-d20';
    }
    
    getSystemColor(system) {
        const colors = {
            vampire: '#8B0000',
            werewolf: '#8B4513',
            mage: '#4B0082',
            tormenta: '#228B22',
            dnd: '#1E90FF'
        };
        return colors[system] || '#666666';
    }
}

// Inicializa a plataforma
window.rpgPlatform = new RPGPlatform();

// Exporta funções globais
window.navigateToRPG = (system) => rpgPlatform.setTheme(system);
window.login = (username, password) => rpgPlatform.login(username, password);
window.logout = () => rpgPlatform.logout();
window.createSession = (data) => rpgPlatform.createSession(data);
window.joinSession = (id, password) => rpgPlatform.joinSession(id, password);