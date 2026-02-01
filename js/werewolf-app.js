// ============================================
// APLICAÇÃO PRINCIPAL LOBISOMEM - COMPLETA
// ============================================

const WerewolfApp = {
    // Estado da aplicação
    state: {
        currentUser: null,
        activeHunts: [],
        selectedTribe: null,
        selectedAuspice: null,
        selectedBreed: null,
        selectedAttributes: {},
        selectedGifts: [],
        characterInProgress: null,
        currentStep: 1,
        audioEnabled: true,
        notifications: [],
        mapMode: null
    },

    // Dados do sistema
    data: {
        tribes: {
            shadowlords: {
                name: "Lords das Sombras",
                description: "Líderes natos e estrategistas implacáveis. Acreditam que o fim justifica os meios.",
                gifts: ["Liderança", "Furtividade", "Dominação"],
                totem: "Grifo",
                color: "#2F4F4F",
                icon: "crown"
            },
            getoffenris: {
                name: "Get of Fenris",
                description: "Guerreiros ferozes e tradicionalistas. Valorizam força e honra acima de tudo.",
                gifts: ["Fúria", "Combate", "Resistência"],
                totem: "Fenris",
                color: "#8B0000",
                icon: "fist-raised"
            },
            glasswalkers: {
                name: "Andarilhos Urbanos",
                description: "Mestres da tecnologia e da cidade. Lutam a Wyrm em seu próprio território.",
                gifts: ["Tecnologia", "Adaptação", "Engenharia"],
                totem: "Aranha",
                color: "#4682B4",
                icon: "city"
            },
            blackfuries: {
                name: "Fúrias Negras",
                description: "Matriarcas protetoras da natureza. Guardiãs dos lugares sagrados.",
                gifts: ["Natureza", "Cura", "Proteção"],
                totem: "Pegasus",
                color: "#4B0082",
                icon: "female"
            },
            silverfangs: {
                name: "Presas de Prata",
                description: "A realeza Garou. Liderança por direito de sangue e tradição.",
                gifts: ["Liderança", "Diplomacia", "Nobreza"],
                totem: "Falcão",
                color: "#C0C0C0",
                icon: "crown"
            },
            bonegnawers: {
                name: "Roe Ossos",
                description: "Sobreviventes das ruas. Mestres em viver com pouco e sobreviver a tudo.",
                gifts: ["Sobrevivência", "Furtividade", "Reciclagem"],
                totem: "Rato",
                color: "#8B4513",
                icon: "utensils"
            },
            redtalons: {
                name: "Garras Vermelhas",
                description: "Os mais bestiais. Acreditam que a humanidade é a verdadeira praga.",
                gifts: ["Ferradura", "Caça", "Instinto"],
                totem: "Lobo",
                color: "#DC143C",
                icon: "paw"
            },
            stargazers: {
                name: "Observadores das Estrelas",
                description: "Filósofos e místicos. Buscam equilíbrio e iluminação espiritual.",
                gifts: ["Meditação", "Visão", "Equilíbrio"],
                totem: "Coruja",
                color: "#4169E1",
                icon: "star"
            }
        },

        auspices: {
            ragabash: {
                name: "Ragabash",
                moon: "Lua Nova",
                role: "Trapaceiro, Inovador, Desafiador",
                gifts: ["Furtividade", "Engano", "Percepção"],
                color: "#8A2BE2"
            },
            theurge: {
                name: "Theurge",
                moon: "Lua Crescente",
                role: "Xamã, Médico Espiritual, Comunicador",
                gifts: ["Espiritualidade", "Cura", "Visão"],
                color: "#4682B4"
            },
            philodox: {
                name: "Philodox",
                moon: "Meia Lua",
                role: "Juiz, Diplomata, Guardião da Tradição",
                gifts: ["Sabedoria", "Justiça", "Liderança"],
                color: "#32CD32"
            },
            galliard: {
                name: "Galliard",
                moon: "Lua Gibosa",
                role: "Bardista, Historiador, Inspirador",
                gifts: ["Performance", "Memória", "Inspiração"],
                color: "#FFD700"
            },
            ahroun: {
                name: "Ahroun",
                moon: "Lua Cheia",
                role: "Guerreiro, Herói, Protetor",
                gifts: ["Combate", "Fúria", "Proteção"],
                color: "#DC143C"
            }
        },

        breeds: {
            homid: {
                name: "Homid",
                description: "Nascido entre humanos, criado na sociedade humana.",
                startingTraits: { willpower: 3, rage: 1, gnosis: 1 }
            },
            metis: {
                name: "Metis",
                description: "Filho de dois Garous, nascido deformado mas poderoso.",
                startingTraits: { willpower: 4, rage: 2, gnosis: 2 }
            },
            lupus: {
                name: "Lupus",
                description: "Nascido como lobo, criado na natureza.",
                startingTraits: { willpower: 3, rage: 3, gnosis: 1 }
            }
        },

        forms: {
            homid: {
                name: "Homid",
                description: "Forma humana, socialmente aceita.",
                modifiers: { strength: 0, dexterity: 0, stamina: 0 }
            },
            glabro: {
                name: "Glabro",
                description: "Quase-humano, musculatura exagerada.",
                modifiers: { strength: 2, dexterity: 0, stamina: 2 }
            },
            crinos: {
                name: "Crinos",
                description: "Forma de guerra, a mais temida.",
                modifiers: { strength: 3, dexterity: 1, stamina: 4 }
            },
            hispo: {
                name: "Hispo",
                description: "Lobo gigante, feroz e ágil.",
                modifiers: { strength: 2, dexterity: 3, stamina: 3 }
            },
            lupus: {
                name: "Lupus",
                description: "Lobo verdadeiro, totalmente animal.",
                modifiers: { strength: 1, dexterity: 2, stamina: 3 }
            }
        },

        attributes: {
            physical: ["Força", "Destreza", "Vigor"],
            social: ["Carisma", "Manipulação", "Aparência"],
            mental: ["Percepção", "Inteligência", "Raciocínio"]
        },

        giftsByTribe: {
            shadowlords: ["Sombra do Medo", "Comando Autoritário", "Visão Noturna", "Dominação Mental", "Passo Silencioso"],
            getoffenris: ["Fúria do Lobo", "Pele de Ferro", "Uivo Aterrorizante", "Força Inabalável", "Instinto de Caça"],
            glasswalkers: ["Mãos na Mecânica", "Visão Urbana", "Camuflagem Digital", "Controle Tecnológico", "Percepção da Rede"],
            blackfuries: ["Chamado da Natureza", "Cura dos Ferimentos", "Força da Mãe Terra", "Proteção Ancestral", "Ligação Animal"],
            silverfangs: ["Presença Real", "Liderança Inspiradora", "Sabedoria Ancestral", "Aura de Autoridade", "Elo com os Espíritos"],
            bonegnawers: ["Farejar Perigo", "Passo Silencioso", "Recursos do Lixo", "Adaptação Urbana", "Esquiva Improvável"],
            redtalons: ["Garras Afiadas", "Instinto de Caça", "Fúria Bestial", "Velocidade do Predador", "Sentidos Aguçados"],
            stargazers: ["Visão do Umbral", "Meditação Profunda", "Sabedoria Estelar", "Equilíbrio Interior", "Comunicação Espiritual"]
        }
    },

    // Inicialização
    init: function() {
        console.log('🐺 Inicializando Lobisomem: A Idade das Trevas');
        
        // Carregar estado salvo
        this.loadState();
        
        // Configurar eventos
        this.setupEvents();
        
        // Carregar dados iniciais
        this.loadInitialData();
        
        // Atualizar interface
        this.updateInterface();
        
        console.log('✅ Aplicação inicializada');
    },

    // Configurar eventos
    setupEvents: function() {
        // Navegação
        this.setupNavigation();
        
        // Controles de usuário
        this.setupUserControls();
        
        // Caçadas
        this.setupHunts();
        
        // Criação de personagem
        this.setupCharacterCreation();
        
        // Ferramentas
        this.setupTools();
        
        // IA
        this.setupAI();
        
        // Modal
        this.setupModal();
        
        // Lore
        this.setupLore();
    },

    // Navegação
    setupNavigation: function() {
        // Menu principal
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('href');
                this.navigateTo(target);
                
                // Fechar submenu se aberto
                const submenu = document.getElementById('huntSubmenu');
                if (submenu) {
                    submenu.classList.remove('active');
                }
            });
        });

        // Toggle mobile
        const mobileToggle = document.getElementById('mobileToggle');
        if (mobileToggle) {
            mobileToggle.addEventListener('click', () => {
                const navMenu = document.getElementById('navMenu');
                navMenu.classList.toggle('active');
                
                // Atualizar ícone
                const icon = mobileToggle.querySelector('i');
                if (icon) {
                    if (navMenu.classList.contains('active')) {
                        icon.className = 'fas fa-times';
                    } else {
                        icon.className = 'fas fa-bars';
                    }
                }
            });
        }

        // Submenu de caçadas
        const huntLinks = document.querySelectorAll('a[href="#hunts"]');
        huntLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                const submenu = document.getElementById('huntSubmenu');
                if (submenu && window.innerWidth > 768) {
                    submenu.classList.add('active');
                }
            });
            
            link.addEventListener('mouseleave', () => {
                const submenu = document.getElementById('huntSubmenu');
                if (submenu && window.innerWidth > 768) {
                    setTimeout(() => {
                        if (!submenu.matches(':hover')) {
                            submenu.classList.remove('active');
                        }
                    }, 100);
                }
            });
        });

        // Fechar submenu ao clicar fora
        document.addEventListener('click', (e) => {
            const submenu = document.getElementById('huntSubmenu');
            if (submenu && !e.target.closest('a[href="#hunts"]') && !e.target.closest('.nav-submenu')) {
                submenu.classList.remove('active');
            }
            
            // Fechar menu mobile ao clicar fora
            const navMenu = document.getElementById('navMenu');
            const mobileToggle = document.getElementById('mobileToggle');
            if (navMenu && navMenu.classList.contains('active') && 
                !e.target.closest('.nav-menu') && 
                !e.target.closest('.mobile-toggle')) {
                navMenu.classList.remove('active');
                if (mobileToggle) {
                    const icon = mobileToggle.querySelector('i');
                    if (icon) icon.className = 'fas fa-bars';
                }
            }
        });
    },

    // Controles de usuário
    setupUserControls: function() {
        // Login
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => this.showLoginModal());
        }

        // Criação de personagem
        const createBtn = document.getElementById('createCharacterBtn');
        if (createBtn) {
            createBtn.addEventListener('click', () => this.startCharacterCreation());
        }

        // Controles de áudio
        const audioToggle = document.getElementById('audioToggle');
        const audioMute = document.getElementById('audioMute');
        const volumeSlider = document.getElementById('volumeSlider');

        if (audioToggle) {
            audioToggle.addEventListener('click', () => this.toggleAudio());
        }

        if (audioMute) {
            audioMute.addEventListener('click', () => this.toggleMute());
        }

        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value));
        }

        // Botões do hero
        const joinHuntBtn = document.getElementById('joinHuntBtn');
        const quickStartBtn = document.getElementById('quickStartBtn');
        const learnMoreBtn = document.getElementById('learnMoreBtn');

        if (joinHuntBtn) {
            joinHuntBtn.addEventListener('click', () => this.joinRandomHunt());
        }

        if (quickStartBtn) {
            quickStartBtn.addEventListener('click', () => this.quickStart());
        }

        if (learnMoreBtn) {
            learnMoreBtn.addEventListener('click', () => this.showTutorial());
        }
    },

    // Caçadas
    setupHunts: function() {
        // Filtros
        const applyFiltersBtn = document.getElementById('applyFiltersBtn');
        const clearFiltersBtn = document.getElementById('clearFiltersBtn');
        const createHuntBtn = document.getElementById('createHuntBtn');

        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', () => this.applyHuntFilters());
        }

        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => this.clearHuntFilters());
        }

        if (createHuntBtn) {
            createHuntBtn.addEventListener('click', () => this.createHunt());
        }

        // Carregar caçadas
        this.loadHunts();
    },

    // Criação de personagem
    setupCharacterCreation: function() {
        // Navegação de passos
        const prevStepBtn = document.getElementById('prevStepBtn');
        const nextStepBtn = document.getElementById('nextStepBtn');
        const resetPreviewBtn = document.getElementById('resetPreviewBtn');

        if (prevStepBtn) {
            prevStepBtn.addEventListener('click', () => this.prevStep());
        }

        if (nextStepBtn) {
            nextStepBtn.addEventListener('click', () => this.nextStep());
        }

        if (resetPreviewBtn) {
            resetPreviewBtn.addEventListener('click', () => this.resetCharacter());
        }

        // Carregar seleção de tribos
        this.loadTribesSelection();
    },

    // Ferramentas
    setupTools: function() {
        // Dados
        const rollDiceBtn = document.getElementById('rollDiceBtn');
        if (rollDiceBtn) {
            rollDiceBtn.addEventListener('click', () => WerewolfDice.rollPool());
        }

        // Formas
        const formBtns = document.querySelectorAll('.form-btn');
        formBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const form = btn.getAttribute('data-form');
                this.selectForm(form);
            });
        });

        // NPCs
        const generateNPCBtn = document.getElementById('generateNPCBtn');
        if (generateNPCBtn) {
            generateNPCBtn.addEventListener('click', () => this.generateNPC());
        }

        // Mapa
        const mapBtns = document.querySelectorAll('.map-btn');
        mapBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const type = btn.getAttribute('data-type');
                this.handleMapAction(type);
            });
        });
        
        // Inicializar mapa
        this.initializeMap();
    },

    // IA
    setupAI: function() {
        const startAIGameBtn = document.getElementById('startAIGameBtn');
        const sendAIMessageBtn = document.getElementById('sendAIMessageBtn');
        const generateActionBtn = document.getElementById('generateActionBtn');
        const quickDiceBtn = document.getElementById('quickDiceBtn');
        const clearChatBtn = document.querySelector('.ai-control-btn[title="Limpar conversa"]');
        const saveChatBtn = document.querySelector('.ai-control-btn[title="Salvar sessão"]');

        if (startAIGameBtn) {
            startAIGameBtn.addEventListener('click', () => this.startAIGame());
        }

        if (sendAIMessageBtn) {
            sendAIMessageBtn.addEventListener('click', () => this.sendAIMessage());
        }

        if (generateActionBtn) {
            generateActionBtn.addEventListener('click', () => this.generateActionSuggestion());
        }

        if (quickDiceBtn) {
            quickDiceBtn.addEventListener('click', () => WerewolfDice.quickRoll());
        }
        
        if (clearChatBtn) {
            clearChatBtn.addEventListener('click', () => this.clearAIChat());
        }
        
        if (saveChatBtn) {
            saveChatBtn.addEventListener('click', () => this.saveAIChat());
        }
        
        // Enter para enviar mensagem
        const playerInput = document.getElementById('aiPlayerInput');
        if (playerInput) {
            playerInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendAIMessage();
                }
            });
        }
    },

    // Modal
    setupModal: function() {
        const closeLoginModal = document.getElementById('closeLoginModal');
        if (closeLoginModal) {
            closeLoginModal.addEventListener('click', () => this.hideLoginModal());
        }

        // Fechar modal ao clicar fora
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideLoginModal();
                }
            });
        }
        
        // Fechar com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideLoginModal();
            }
        });
    },
    
    // Lore
    setupLore: function() {
        const loreNavBtns = document.querySelectorAll('.lore-nav-btn');
        loreNavBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const loreSection = btn.getAttribute('data-lore');
                this.showLoreSection(loreSection);
            });
        });
        
        // Inicializar com primeira seção
        this.showLoreSection('litany');
    },

    // Navegação
    navigateTo: function(target) {
        // Atualizar menu ativo
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === target) {
                link.classList.add('active');
            }
        });

        // Scroll suave para a seção
        if (target.startsWith('#')) {
            const element = document.querySelector(target);
            if (element) {
                element.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Adicionar classe de destaque temporário
                element.classList.add('section-highlight');
                setTimeout(() => {
                    element.classList.remove('section-highlight');
                }, 2000);
            }
        }

        // Fechar menu mobile se aberto
        const navMenu = document.getElementById('navMenu');
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            const mobileToggle = document.getElementById('mobileToggle');
            if (mobileToggle) {
                const icon = mobileToggle.querySelector('i');
                if (icon) icon.className = 'fas fa-bars';
            }
        }
        
        // Fechar submenu de caçadas
        const submenu = document.getElementById('huntSubmenu');
        if (submenu) {
            submenu.classList.remove('active');
        }
    },

    // Controles de áudio
    toggleAudio: function() {
        this.state.audioEnabled = !this.state.audioEnabled;
        const icon = document.querySelector('#audioToggle i');
        
        if (this.state.audioEnabled) {
            icon.className = 'fas fa-pause';
            if (WerewolfAudio) {
                WerewolfAudio.playBackground();
            }
            this.showNotification('Áudio ativado', 'success');
        } else {
            icon.className = 'fas fa-play';
            if (WerewolfAudio) {
                WerewolfAudio.pauseBackground();
            }
            this.showNotification('Áudio desativado', 'info');
        }
        
        this.saveState();
    },

    toggleMute: function() {
        const icon = document.querySelector('#audioMute i');
        const isMuted = icon.className.includes('volume-mute');
        
        if (isMuted) {
            icon.className = 'fas fa-volume-up';
            if (WerewolfAudio) {
                WerewolfAudio.unmute();
            }
            this.showNotification('Som ativado', 'success');
        } else {
            icon.className = 'fas fa-volume-mute';
            if (WerewolfAudio) {
                WerewolfAudio.mute();
            }
            this.showNotification('Som desativado', 'info');
        }
    },

    setVolume: function(value) {
        if (WerewolfAudio) {
            WerewolfAudio.setVolume(value / 100);
        }
    },

    // Caçadas
    loadHunts: function() {
        const grid = document.getElementById('huntsGrid');
        const loading = document.getElementById('huntsLoading');
        
        if (!grid) return;
        
        // Mostrar loading
        if (loading) {
            loading.style.display = 'block';
        }
        
        // Simular carregamento
        setTimeout(() => {
            const hunts = this.generateMockHunts();
            grid.innerHTML = hunts;
            
            // Configurar eventos dos botões das caçadas
            this.setupHuntEvents();
            
            // Esconder loading
            if (loading) {
                loading.style.display = 'none';
            }
        }, 1000);
    },

    generateMockHunts: function() {
        const hunts = [
            {
                id: 1,
                title: "Defensores da Amazônia",
                description: "Uma caçada épica na Amazônia brasileira. O Pack deve proteger um antigo Caern da corrupção da Wyrm.",
                tribes: ["shadowlords", "blackfuries"],
                tags: ["featured", "epic"],
                region: "amazonia",
                difficulty: "epic",
                players: { current: 4, max: 5 },
                sessions: 12,
                rage: 92,
                harano: 2
            },
            {
                id: 2,
                title: "Urban Shadows",
                description: "Uma guerra nas sombras de São Paulo contra espíritos poluídos e corporações da Wyrm.",
                tribes: ["glasswalkers", "bonegnawers"],
                tags: ["urban", "recruiting"],
                region: "urban",
                difficulty: "hard",
                players: { current: 3, max: 5 },
                sessions: 8,
                rage: 85,
                harano: 1
            },
            {
                id: 3,
                title: "Ritual da Lua Cheia",
                description: "Um ritual ancestral para fortalecer um Caern moribundo. Negociações com espíritos antigos.",
                tribes: ["silverfangs", "stargazers"],
                tags: ["ritual", "spiritual"],
                region: "atlantic",
                difficulty: "medium",
                players: { current: 2, max: 3 },
                sessions: 6,
                rage: 70,
                harano: 0
            },
            {
                id: 4,
                title: "A Primeira Mudança",
                description: "Viva sua Primeira Mudança. Um Garou recém-descoberto deve sobreviver à transformação.",
                tribes: ["getoffenris", "redtalons"],
                tags: ["ai", "oneshot", "recruiting"],
                region: "spirit",
                difficulty: "easy",
                players: { current: 1, max: 3 },
                sessions: 1,
                rage: 100,
                harano: 0
            },
            {
                id: 5,
                title: "Caçada aos Banes",
                description: "Expurgo de espíritos corruptos no Umbral próximo ao Rio de Janeiro.",
                tribes: ["shadowlords", "glasswalkers", "bonegnawers"],
                tags: ["umbral", "combat"],
                region: "atlantic",
                difficulty: "hard",
                players: { current: 5, max: 6 },
                sessions: 10,
                rage: 88,
                harano: 1
            },
            {
                id: 6,
                title: "O Legado Perdido",
                description: "Busca por artefatos ancestrais Garou nas ruínas de um antigo caern no Cerrado.",
                tribes: ["silverfangs", "stargazers", "blackfuries"],
                tags: ["exploration", "lore"],
                region: "cerrado",
                difficulty: "medium",
                players: { current: 3, max: 4 },
                sessions: 8,
                rage: 65,
                harano: 0
            }
        ];
        
        return hunts.map(hunt => this.createHuntCard(hunt)).join('');
    },

    createHuntCard: function(hunt) {
        const isFeatured = hunt.tags.includes('featured');
        const isAI = hunt.tags.includes('ai');
        const isRecruiting = hunt.tags.includes('recruiting');
        
        return `
            <div class="hunt-card ${isFeatured ? 'featured' : ''}" data-hunt-id="${hunt.id}" 
                data-tribes="${hunt.tribes.join(',')}" 
                data-region="${hunt.region}" 
                data-difficulty="${hunt.difficulty}"
                data-type="${hunt.tags.join(',')}">
                ${isFeatured ? `
                    <div class="hunt-badge badge-featured">
                        <i class="fas fa-crown"></i> Destaque
                    </div>
                ` : ''}
                
                ${isAI ? `
                    <div class="hunt-badge badge-ai">
                        <i class="fas fa-robot"></i> IA
                    </div>
                ` : ''}
                
                ${isRecruiting ? `
                    <div class="hunt-badge badge-recruiting">
                        <i class="fas fa-user-plus"></i> Recrutando
                    </div>
                ` : ''}
                
                <div class="hunt-header">
                    <h3 class="hunt-title">${hunt.title}</h3>
                    <div class="hunt-tags">
                        ${hunt.tribes.map(tribe => `
                            <span class="tribe-tag tag-${tribe}">${this.data.tribes[tribe].name}</span>
                        `).join('')}
                    </div>
                </div>
                
                <div class="hunt-body">
                    <p class="hunt-description">${hunt.description}</p>
                    
                    <div class="hunt-details">
                        <div class="hunt-detail">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${this.getRegionName(hunt.region)}</span>
                        </div>
                        <div class="hunt-detail">
                            <i class="fas fa-skull"></i>
                            <span>${this.getDifficultyName(hunt.difficulty)}</span>
                        </div>
                        <div class="hunt-detail">
                            <i class="fas fa-users"></i>
                            <span>${hunt.players.current}/${hunt.players.max} Garous</span>
                        </div>
                        <div class="hunt-detail">
                            <i class="fas fa-calendar-alt"></i>
                            <span>${hunt.sessions} sessões</span>
                        </div>
                    </div>
                    
                    <div class="hunt-stats">
                        <div class="hunt-stat">
                            <span class="stat-value">${hunt.rage}%</span>
                            <span class="stat-label">Fúria</span>
                        </div>
                        <div class="hunt-stat">
                            <span class="stat-value">${hunt.harano}</span>
                            <span class="stat-label">Harano</span>
                        </div>
                        <div class="hunt-stat">
                            <span class="stat-value">${hunt.players.max - hunt.players.current}</span>
                            <span class="stat-label">Vagas</span>
                        </div>
                        <div class="hunt-stat">
                            <span class="stat-value">${this.getProgressEmoji(hunt.rage)}</span>
                            <span class="stat-label">Progresso</span>
                        </div>
                    </div>
                    
                    <div class="hunt-actions">
                        <button class="btn-hunt btn-hunt-primary" data-action="join" data-hunt-id="${hunt.id}">
                            <i class="fas fa-door-open"></i> Entrar
                        </button>
                        <button class="btn-hunt btn-hunt-secondary" data-action="spectate" data-hunt-id="${hunt.id}">
                            <i class="fas fa-eye"></i> Observar
                        </button>
                        <button class="btn-hunt btn-hunt-secondary" data-action="favorite" data-hunt-id="${hunt.id}">
                            <i class="far fa-star"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    getRegionName: function(region) {
        const regions = {
            'amazonia': 'Amazônia',
            'atlantic': 'Mata Atlântica',
            'cerrado': 'Cerrado',
            'pantanal': 'Pantanal',
            'urban': 'Urbano',
            'spirit': 'Umbral'
        };
        return regions[region] || region;
    },

    getDifficultyName: function(difficulty) {
        const difficulties = {
            'easy': 'Fácil',
            'medium': 'Médio',
            'hard': 'Difícil',
            'epic': 'Épico'
        };
        return difficulties[difficulty] || difficulty;
    },

    getProgressEmoji: function(rage) {
        if (rage >= 80) return '🔥';
        if (rage >= 60) return '⚡';
        if (rage >= 40) return '🌙';
        if (rage >= 20) return '🌑';
        return '💀';
    },

    setupHuntEvents: function() {
        // Botões de ação das caçadas
        const huntActions = document.querySelectorAll('[data-action]');
        huntActions.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = btn.getAttribute('data-action');
                const huntId = btn.getAttribute('data-hunt-id');
                this.handleHuntAction(action, huntId);
                e.stopPropagation();
            });
        });
        
        // Clicks nos cards (para expandir detalhes)
        const huntCards = document.querySelectorAll('.hunt-card');
        huntCards.forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('[data-action]')) {
                    const huntId = card.getAttribute('data-hunt-id');
                    this.showHuntDetails(huntId);
                }
            });
        });
    },

    handleHuntAction: function(action, huntId) {
        switch(action) {
            case 'join':
                this.joinHunt(huntId);
                break;
            case 'spectate':
                this.spectateHunt(huntId);
                break;
            case 'favorite':
                this.toggleFavorite(huntId);
                break;
        }
    },
    
    showHuntDetails: function(huntId) {
        // Em produção, mostraria modal com detalhes completos
        this.showNotification(`Detalhes da caçada ${huntId}`, 'info');
    },

    joinHunt: function(huntId) {
        if (!this.state.currentUser) {
            this.showLoginModal();
            this.showNotification('Faça login para entrar em uma caçada', 'info');
            return;
        }
        
        this.showNotification(`Entrando na caçada ${huntId}...`, 'info');
        
        // Simular carregamento
        setTimeout(() => {
            this.showNotification('Você entrou na caçada!', 'success');
            this.updateRageIndicator(5, 10); // Atualizar Fúria
            
            // Atualizar contador de vagas
            const huntCard = document.querySelector(`[data-hunt-id="${huntId}"]`);
            if (huntCard) {
                const playerCount = huntCard.querySelector('.hunt-detail:nth-child(3) span');
                const vacancyStat = huntCard.querySelector('.hunt-stat:nth-child(3) .stat-value');
                if (playerCount && vacancyStat) {
                    const match = playerCount.textContent.match(/(\d+)\/(\d+)/);
                    if (match) {
                        const current = parseInt(match[1]) + 1;
                        const max = parseInt(match[2]);
                        playerCount.textContent = `${current}/${max} Garous`;
                        vacancyStat.textContent = max - current;
                        
                        // Se estiver cheio, desabilitar botão de entrar
                        if (current >= max) {
                            const joinBtn = huntCard.querySelector('[data-action="join"]');
                            if (joinBtn) {
                                joinBtn.disabled = true;
                                joinBtn.innerHTML = '<i class="fas fa-times"></i> Cheio';
                                joinBtn.classList.remove('btn-hunt-primary');
                                joinBtn.classList.add('btn-hunt-secondary');
                            }
                        }
                    }
                }
            }
        }, 1500);
    },

    spectateHunt: function(huntId) {
        this.showNotification(`Observando caçada ${huntId}...`, 'info');
        
        // Em produção, redirecionaria para a sessão de espectador
        setTimeout(() => {
            this.showNotification('Modo espectador ativado', 'success');
        }, 1000);
    },

    toggleFavorite: function(huntId) {
        const btn = document.querySelector(`[data-hunt-id="${huntId}"][data-action="favorite"] i`);
        if (!btn) return;
        
        const isFavorite = btn.className.includes('fas');
        
        if (isFavorite) {
            btn.className = 'far fa-star';
            this.showNotification('Removido dos favoritos', 'info');
        } else {
            btn.className = 'fas fa-star';
            btn.style.color = 'var(--color-gold)';
            this.showNotification('Adicionado aos favoritos', 'success');
        }
    },

    applyHuntFilters: function() {
        const typeFilter = document.getElementById('huntTypeFilter').value;
        const tribeFilter = document.getElementById('tribeFilter').value;
        const regionFilter = document.getElementById('regionFilter').value;
        const difficultyFilter = document.getElementById('difficultyFilter').value;
        
        const huntCards = document.querySelectorAll('.hunt-card');
        let visibleCount = 0;
        
        huntCards.forEach(card => {
            let showCard = true;
            
            // Filtrar por tipo
            if (typeFilter !== 'all') {
                const cardTypes = card.getAttribute('data-type');
                if (typeFilter === 'active') {
                    // Mostrar apenas caçadas não cheias
                    const playerCount = card.querySelector('.hunt-detail:nth-child(3) span');
                    if (playerCount) {
                        const match = playerCount.textContent.match(/(\d+)\/(\d+)/);
                        if (match && parseInt(match[1]) >= parseInt(match[2])) {
                            showCard = false;
                        }
                    }
                } else if (typeFilter === 'recruiting') {
                    if (!cardTypes.includes('recruiting')) showCard = false;
                } else if (typeFilter === 'featured') {
                    if (!cardTypes.includes('featured')) showCard = false;
                } else if (typeFilter === 'ai') {
                    if (!cardTypes.includes('ai')) showCard = false;
                }
            }
            
            // Filtrar por tribo
            if (tribeFilter !== 'all' && showCard) {
                const cardTribes = card.getAttribute('data-tribes').split(',');
                if (!cardTribes.includes(tribeFilter)) showCard = false;
            }
            
            // Filtrar por região
            if (regionFilter !== 'all' && showCard) {
                if (card.getAttribute('data-region') !== regionFilter) showCard = false;
            }
            
            // Filtrar por dificuldade
            if (difficultyFilter !== 'all' && showCard) {
                if (card.getAttribute('data-difficulty') !== difficultyFilter) showCard = false;
            }
            
            // Aplicar visibilidade
            if (showCard) {
                card.style.display = 'block';
                visibleCount++;
                
                // Animação de entrada
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.transition = 'all 0.3s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 10);
            } else {
                card.style.display = 'none';
            }
        });
        
        if (visibleCount === 0) {
            this.showNotification('Nenhuma caçada encontrada com esses filtros', 'warning');
        } else {
            this.showNotification(`Mostrando ${visibleCount} caçada(s)`, 'success');
        }
    },

    clearHuntFilters: function() {
        document.getElementById('huntTypeFilter').value = 'all';
        document.getElementById('tribeFilter').value = 'all';
        document.getElementById('regionFilter').value = 'all';
        document.getElementById('difficultyFilter').value = 'all';
        
        // Mostrar todas as caçadas
        const huntCards = document.querySelectorAll('.hunt-card');
        huntCards.forEach(card => {
            card.style.display = 'block';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        });
        
        this.showNotification('Filtros limpos', 'info');
    },

    createHunt: function() {
        if (!this.state.currentUser) {
            this.showLoginModal();
            this.showNotification('Faça login para criar uma caçada', 'info');
            return;
        }
        
        // Em produção, abriria um modal de criação
        this.showNotification('Abrindo criador de caçadas...', 'info');
        
        setTimeout(() => {
            this.showNotification('Modo criação de caçada ativado', 'success');
            this.navigateTo('#hunts');
        }, 500);
    },

    joinRandomHunt: function() {
        if (!this.state.currentUser) {
            this.showLoginModal();
            return;
        }
        
        const hunts = document.querySelectorAll('.hunt-card');
        if (hunts.length === 0) {
            this.showNotification('Nenhuma caçada disponível', 'error');
            return;
        }
        
        // Encontrar caçadas com vagas
        const availableHunts = Array.from(hunts).filter(hunt => {
            const statElement = hunt.querySelector('.hunt-stat:nth-child(3) .stat-value');
            return statElement && parseInt(statElement.textContent) > 0;
        });
        
        if (availableHunts.length === 0) {
            this.showNotification('Todas as caçadas estão cheias', 'warning');
            return;
        }
        
        // Selecionar aleatoriamente
        const randomHunt = availableHunts[Math.floor(Math.random() * availableHunts.length)];
        const huntId = randomHunt.getAttribute('data-hunt-id');
        
        this.joinHunt(huntId);
    },

    // Criação de Personagem
    loadTribesSelection: function() {
        const container = document.getElementById('tribesSelection');
        if (!container) return;
        
        let html = '';
        
        for (const [key, tribe] of Object.entries(this.data.tribes)) {
            html += `
                <div class="tribe-option ${this.state.selectedTribe === key ? 'selected' : ''}" data-tribe="${key}">
                    <div class="tribe-icon" style="background: ${tribe.color}">
                        <i class="fas fa-${tribe.icon}"></i>
                    </div>
                    <h4 class="tribe-name">${tribe.name}</h4>
                    <p class="tribe-description">${tribe.description}</p>
                    <div class="tribe-traits">
                        ${tribe.gifts.map(gift => `
                            <span class="tribe-trait">${gift}</span>
                        `).join('')}
                    </div>
                    <div class="tribe-footer">
                        <small><i class="fas fa-paw"></i> Totem: ${tribe.totem}</small>
                    </div>
                </div>
            `;
        }
        
        container.innerHTML = html;
        
        // Adicionar eventos de seleção
        const tribeOptions = document.querySelectorAll('.tribe-option');
        tribeOptions.forEach(option => {
            option.addEventListener('click', () => {
                const tribe = option.getAttribute('data-tribe');
                this.selectTribe(tribe);
            });
        });
    },

    selectTribe: function(tribeKey) {
        this.state.selectedTribe = tribeKey;
        
        // Atualizar seleção visual
        document.querySelectorAll('.tribe-option').forEach(option => {
            option.classList.remove('selected');
            if (option.getAttribute('data-tribe') === tribeKey) {
                option.classList.add('selected');
            }
        });
        
        // Atualizar pré-visualização
        this.updateCharacterPreview();
        
        this.showNotification(`Tribo selecionada: ${this.data.tribes[tribeKey].name}`, 'success');
    },

    updateCharacterPreview: function() {
        // Atualizar tribo
        const tribeElement = document.getElementById('previewTribe');
        if (tribeElement) {
            if (this.state.selectedTribe) {
                tribeElement.textContent = `Tribo: ${this.data.tribes[this.state.selectedTribe].name}`;
                tribeElement.style.display = 'inline-block';
            } else {
                tribeElement.style.display = 'none';
            }
        }
        
        // Atualizar auspício
        const auspiceElement = document.getElementById('previewAuspice');
        if (auspiceElement) {
            if (this.state.selectedAuspice) {
                auspiceElement.textContent = `Auspício: ${this.data.auspices[this.state.selectedAuspice].name}`;
                auspiceElement.style.display = 'inline-block';
            } else {
                auspiceElement.style.display = 'none';
            }
        }
        
        // Atualizar raça
        const breedElement = document.getElementById('previewBreed');
        if (breedElement) {
            if (this.state.selectedBreed) {
                breedElement.textContent = `Raça: ${this.data.breeds[this.state.selectedBreed].name}`;
                breedElement.style.display = 'inline-block';
            } else {
                breedElement.style.display = 'none';
            }
        }
        
        // Atualizar estatísticas
        this.updatePreviewStats();
        
        // Atualizar nome do personagem
        const nameElement = document.getElementById('previewName');
        if (nameElement && (this.state.selectedTribe || this.state.selectedAuspice || this.state.selectedBreed)) {
            nameElement.textContent = this.generateGarouName();
        }
    },

    updatePreviewStats: function() {
        // Calcular estatísticas base
        let rage = 1;
        let gnosis = 1;
        let willpower = 3;
        
        // Aplicar modificadores da raça
        if (this.state.selectedBreed) {
            const breed = this.data.breeds[this.state.selectedBreed];
            rage = breed.startingTraits.rage;
            gnosis = breed.startingTraits.gnosis;
            willpower = breed.startingTraits.willpower;
        }
        
        // Atualizar Fúria
        const rageElement = document.getElementById('previewRage');
        if (rageElement) {
            rageElement.innerHTML = this.createStatDots(rage, 5);
        }
        
        // Atualizar Gnosis
        const gnosisElement = document.getElementById('previewGnosis');
        if (gnosisElement) {
            gnosisElement.innerHTML = this.createStatDots(gnosis, 5);
        }
        
        // Atualizar Vontade
        const willElement = document.getElementById('previewWillpower');
        if (willElement) {
            willElement.innerHTML = this.createStatDots(willpower, 5);
        }
    },

    createStatDots: function(value, max) {
        let html = '';
        for (let i = 0; i < max; i++) {
            html += `<div class="stat-dot ${i < value ? 'filled' : ''}"></div>`;
        }
        return html;
    },

    // Navegação de criação
    prevStep: function() {
        if (this.state.currentStep > 1) {
            this.state.currentStep--;
            this.updateCreationStep();
        }
    },

    nextStep: function() {
        if (this.state.currentStep < 5) {
            // Validar passo atual
            if (this.validateCurrentStep()) {
                this.state.currentStep++;
                this.updateCreationStep();
            }
        } else {
            // Finalizar criação
            this.finishCharacterCreation();
        }
    },

    validateCurrentStep: function() {
        switch(this.state.currentStep) {
            case 1: // Tribo
                if (!this.state.selectedTribe) {
                    this.showNotification('Selecione uma tribo para continuar', 'error');
                    return false;
                }
                break;
            case 2: // Auspício
                if (!this.state.selectedAuspice) {
                    this.showNotification('Selecione um auspício para continuar', 'error');
                    return false;
                }
                break;
            case 3: // Raça
                if (!this.state.selectedBreed) {
                    this.showNotification('Selecione uma raça para continuar', 'error');
                    return false;
                }
                break;
            case 4: // Atributos
                // Verificar se todos os atributos têm pelo menos 1 ponto
                const totalPoints = Object.values(this.state.selectedAttributes).reduce((sum, val) => sum + val, 0);
                if (totalPoints < 9) { // 9 atributos * 1 ponto mínimo
                    this.showNotification('Distribua todos os pontos de atributo', 'error');
                    return false;
                }
                break;
        }
        return true;
    },

    updateCreationStep: function() {
        // Atualizar passos visuais
        document.querySelectorAll('.flow-step').forEach(step => {
            step.classList.remove('active');
            const stepNum = parseInt(step.getAttribute('data-step'));
            
            if (stepNum === this.state.currentStep) {
                step.classList.add('active');
            }
            
            if (stepNum < this.state.currentStep) {
                step.classList.add('completed');
            } else {
                step.classList.remove('completed');
            }
        });
        
        // Atualizar conteúdo do passo
        document.querySelectorAll('.creation-step').forEach(step => {
            step.classList.remove('active');
        });
        
        const currentStep = document.getElementById(`step${this.state.currentStep}`);
        if (currentStep) {
            currentStep.classList.add('active');
        }
        
        // Atualizar controles
        const prevBtn = document.getElementById('prevStepBtn');
        const nextBtn = document.getElementById('nextStepBtn');
        const currentStepSpan = document.getElementById('currentStep');
        const progressFill = document.getElementById('creationProgress');
        
        if (prevBtn) {
            prevBtn.disabled = this.state.currentStep === 1;
            prevBtn.style.opacity = this.state.currentStep === 1 ? '0.5' : '1';
        }
        
        if (nextBtn) {
            const nextText = this.state.currentStep === 5 ? 'Finalizar' : 'Próximo';
            nextBtn.innerHTML = `${nextText} <i class="fas fa-arrow-right"></i>`;
        }
        
        if (currentStepSpan) {
            currentStepSpan.textContent = this.state.currentStep;
        }
        
        if (progressFill) {
            const progress = (this.state.currentStep / 5) * 100;
            progressFill.style.width = `${progress}%`;
        }
        
        // Carregar conteúdo do passo atual
        this.loadStepContent();
    },

    loadStepContent: function() {
        switch(this.state.currentStep) {
            case 1: // Tribo (já carregado)
                break;
            case 2: // Auspício
                this.loadAuspicesSelection();
                break;
            case 3: // Raça
                this.loadBreedsSelection();
                break;
            case 4: // Atributos
                this.loadAttributesSelection();
                break;
            case 5: // Dons
                this.loadGiftsSelection();
                break;
        }
    },

    loadAuspicesSelection: function() {
        const stepContent = document.getElementById('step2');
        if (!stepContent) return;
        
        let html = `
            <h3>Escolha seu Auspício</h3>
            <p>Sua lua de nascimento define seu papel na sociedade Garou</p>
            <div class="auspices-selection" id="auspicesSelection">
        `;
        
        for (const [key, auspice] of Object.entries(this.data.auspices)) {
            const isSelected = this.state.selectedAuspice === key;
            html += `
                <div class="auspice-option ${isSelected ? 'selected' : ''}" data-auspice="${key}">
                    <div class="auspice-header" style="border-left-color: ${auspice.color}">
                        <h4>${auspice.name}</h4>
                        <span class="auspice-moon">${auspice.moon}</span>
                    </div>
                    <div class="auspice-body">
                        <p><strong>Função:</strong> ${auspice.role}</p>
                        <div class="auspice-gifts">
                            <strong>Dons:</strong>
                            ${auspice.gifts.map(gift => `<span class="gift-tag">${gift}</span>`).join('')}
                        </div>
                    </div>
                </div>
            `;
        }
        
        html += `</div>`;
        stepContent.innerHTML = html;
        
        // Adicionar eventos
        const auspiceOptions = document.querySelectorAll('.auspice-option');
        auspiceOptions.forEach(option => {
            option.addEventListener('click', () => {
                const auspice = option.getAttribute('data-auspice');
                this.selectAuspice(auspice);
            });
        });
    },

    selectAuspice: function(auspiceKey) {
        this.state.selectedAuspice = auspiceKey;
        
        // Atualizar seleção visual
        document.querySelectorAll('.auspice-option').forEach(option => {
            option.classList.remove('selected');
            if (option.getAttribute('data-auspice') === auspiceKey) {
                option.classList.add('selected');
            }
        });
        
        this.updateCharacterPreview();
        this.showNotification(`Auspício selecionado: ${this.data.auspices[auspiceKey].name}`, 'success');
    },

    loadBreedsSelection: function() {
        const stepContent = document.getElementById('step3');
        if (!stepContent) return;
        
        let html = `
            <h3>Escolha sua Raça</h3>
            <p>Sua origem define suas habilidades iniciais</p>
            <div class="breeds-selection" id="breedsSelection">
        `;
        
        for (const [key, breed] of Object.entries(this.data.breeds)) {
            const isSelected = this.state.selectedBreed === key;
            const icon = key === 'homid' ? 'user' : key === 'metis' ? 'dna' : 'paw';
            
            html += `
                <div class="breed-option ${isSelected ? 'selected' : ''}" data-breed="${key}">
                    <div class="breed-icon">
                        <i class="fas fa-${icon}"></i>
                    </div>
                    <h4>${breed.name}</h4>
                    <p class="breed-description">${breed.description}</p>
                    <div class="breed-traits">
                        <div class="trait">
                            <span>Vontade:</span>
                            <span class="trait-value">${breed.startingTraits.willpower}</span>
                        </div>
                        <div class="trait">
                            <span>Fúria:</span>
                            <span class="trait-value">${breed.startingTraits.rage}</span>
                        </div>
                        <div class="trait">
                            <span>Gnosis:</span>
                            <span class="trait-value">${breed.startingTraits.gnosis}</span>
                        </div>
                    </div>
                </div>
            `;
        }
        
        html += `</div>`;
        stepContent.innerHTML = html;
        
        // Adicionar eventos
        const breedOptions = document.querySelectorAll('.breed-option');
        breedOptions.forEach(option => {
            option.addEventListener('click', () => {
                const breed = option.getAttribute('data-breed');
                this.selectBreed(breed);
            });
        });
    },

    selectBreed: function(breedKey) {
        this.state.selectedBreed = breedKey;
        
        // Atualizar seleção visual
        document.querySelectorAll('.breed-option').forEach(option => {
            option.classList.remove('selected');
            if (option.getAttribute('data-breed') === breedKey) {
                option.classList.add('selected');
            }
        });
        
        this.updateCharacterPreview();
        this.showNotification(`Raça selecionada: ${this.data.breeds[breedKey].name}`, 'success');
    },

    loadAttributesSelection: function() {
        const stepContent = document.getElementById('step4');
        if (!stepContent) return;
        
        // Inicializar atributos se não existirem
        if (Object.keys(this.state.selectedAttributes).length === 0) {
            for (const category of Object.values(this.data.attributes)) {
                for (const attr of category) {
                    this.state.selectedAttributes[attr] = 1;
                }
            }
        }
        
        let html = `
            <h3>Distribua seus Atributos</h3>
            <p>Você tem <span class="points-remaining" id="pointsRemaining">7</span> pontos para distribuir</p>
            <div class="attributes-grid">
        `;
        
        for (const [categoryName, attributes] of Object.entries(this.data.attributes)) {
            const categoryDisplay = {
                physical: "Físicos",
                social: "Sociais", 
                mental: "Mentais"
            }[categoryName] || categoryName;
            
            html += `
                <div class="attribute-category">
                    <h4>${categoryDisplay}</h4>
                    ${attributes.map(attr => {
                        const currentValue = this.state.selectedAttributes[attr] || 1;
                        return `
                            <div class="attribute-control">
                                <label>${attr}</label>
                                <div class="attribute-counter" data-attribute="${attr}">
                                    <button class="attr-btn decrease" data-attribute="${attr}">-</button>
                                    <span class="attr-value">${currentValue}</span>
                                    <button class="attr-btn increase" data-attribute="${attr}">+</button>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
        }
        
        html += `</div>`;
        stepContent.innerHTML = html;
        
        // Configurar eventos dos atributos
        this.setupAttributesEvents();
    },

    setupAttributesEvents: function() {
        const pointsElement = document.getElementById('pointsRemaining');
        let availablePoints = 7;
        
        // Calcular pontos já usados
        Object.values(this.state.selectedAttributes).forEach(value => {
            availablePoints -= (value - 1); // Cada atributo começa com 1
        });
        
        if (pointsElement) {
            pointsElement.textContent = availablePoints;
            pointsElement.style.color = availablePoints < 0 ? 'var(--color-blood)' : 'var(--color-gold)';
        }
        
        const attrButtons = document.querySelectorAll('.attr-btn');
        
        attrButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = btn.classList.contains('increase') ? 'increase' : 'decrease';
                const attribute = btn.getAttribute('data-attribute');
                const valueElement = btn.parentElement.querySelector('.attr-value');
                let value = parseInt(valueElement.textContent);
                
                if (action === 'increase') {
                    if (availablePoints > 0 && value < 5) {
                        value++;
                        availablePoints--;
                    }
                } else {
                    if (value > 1) {
                        value--;
                        availablePoints++;
                    }
                }
                
                // Atualizar display
                valueElement.textContent = value;
                if (pointsElement) {
                    pointsElement.textContent = availablePoints;
                    pointsElement.style.color = availablePoints < 0 ? 'var(--color-blood)' : 'var(--color-gold)';
                }
                
                // Atualizar estado
                this.state.selectedAttributes[attribute] = value;
                
                // Feedback visual
                valueElement.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    valueElement.style.transform = 'scale(1)';
                }, 200);
                
                // Atualizar pré-visualização
                this.updateAttributesPreview();
            });
        });
    },

    updateAttributesPreview: function() {
        // Em produção, atualizaria uma ficha mais detalhada
        // Por enquanto, apenas log
        console.log('Atributos atualizados:', this.state.selectedAttributes);
    },

    loadGiftsSelection: function() {
        const stepContent = document.getElementById('step5');
        if (!stepContent) return;
        
        if (!this.state.selectedTribe) {
            stepContent.innerHTML = '<p>Selecione uma tribo primeiro</p>';
            return;
        }
        
        const tribeGifts = this.data.giftsByTribe[this.state.selectedTribe] || 
                         ["Dom Básico", "Instinto Animal", "Força da Natureza"];
        
        // Inicializar gifts selecionados se não existirem
        if (this.state.selectedGifts.length === 0) {
            this.state.selectedGifts = [];
        }
        
        let html = `
            <h3>Escolha seus Dons Iniciais</h3>
            <p>Selecione 3 dons iniciais para seu Garou</p>
            <div class="gifts-selection">
                <p><strong>Tribo:</strong> ${this.data.tribes[this.state.selectedTribe].name}</p>
                <div class="selected-count">
                    Selecionados: <span id="selectedGiftsCount">${this.state.selectedGifts.length}</span>/3
                </div>
                <div class="gifts-grid">
        `;
        
        tribeGifts.forEach((gift, index) => {
            const isSelected = this.state.selectedGifts.includes(gift);
            html += `
                <div class="gift-option ${isSelected ? 'selected' : ''}" data-gift="${gift}">
                    <div class="gift-checkbox">
                        <input type="checkbox" id="gift${index}" ${isSelected ? 'checked' : ''}>
                        <label for="gift${index}"></label>
                    </div>
                    <label for="gift${index}" class="gift-label">${gift}</label>
                    <p class="gift-description">Um dom essencial para um Garou da tribo ${this.data.tribes[this.state.selectedTribe].name}.</p>
                </div>
            `;
        });
        
        html += `
                </div>
                <div class="gifts-info">
                    <p><i class="fas fa-info-circle"></i> Você aprenderá mais dons conforme ganha Renome.</p>
                </div>
            </div>
        `;
        
        stepContent.innerHTML = html;
        
        // Configurar eventos dos gifts
        this.setupGiftsEvents();
    },

    setupGiftsEvents: function() {
        const checkboxes = document.querySelectorAll('.gift-option input[type="checkbox"]');
        const countElement = document.getElementById('selectedGiftsCount');
        
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const giftOption = e.target.closest('.gift-option');
                const gift = giftOption.getAttribute('data-gift');
                
                if (e.target.checked) {
                    if (this.state.selectedGifts.length >= 3) {
                        e.target.checked = false;
                        this.showNotification('Selecione no máximo 3 dons', 'warning');
                        return;
                    }
                    this.state.selectedGifts.push(gift);
                    giftOption.classList.add('selected');
                } else {
                    const index = this.state.selectedGifts.indexOf(gift);
                    if (index > -1) {
                        this.state.selectedGifts.splice(index, 1);
                    }
                    giftOption.classList.remove('selected');
                }
                
                // Atualizar contador
                if (countElement) {
                    countElement.textContent = this.state.selectedGifts.length;
                    countElement.style.color = this.state.selectedGifts.length > 3 ? 'var(--color-blood)' : 'var(--color-gold)';
                }
                
                // Feedback visual
                giftOption.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    giftOption.style.transform = 'scale(1)';
                }, 150);
            });
        });
        
        // Também permitir seleção clicando em qualquer lugar do card
        const giftOptions = document.querySelectorAll('.gift-option');
        giftOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                if (!e.target.closest('input') && !e.target.closest('label')) {
                    const checkbox = option.querySelector('input[type="checkbox"]');
                    if (checkbox) {
                        checkbox.checked = !checkbox.checked;
                        checkbox.dispatchEvent(new Event('change'));
                    }
                }
            });
        });
    },

    finishCharacterCreation: function() {
        // Validar seleções finais
        if (!this.state.selectedTribe || !this.state.selectedAuspice || !this.state.selectedBreed) {
            this.showNotification('Complete todas as seleções obrigatórias', 'error');
            return;
        }
        
        if (this.state.selectedGifts.length !== 3) {
            this.showNotification('Selecione exatamente 3 dons', 'error');
            return;
        }
        
        // Criar objeto do personagem
        const character = {
            id: Date.now().toString(),
            tribe: this.state.selectedTribe,
            auspice: this.state.selectedAuspice,
            breed: this.state.selectedBreed,
            attributes: {...this.state.selectedAttributes},
            gifts: [...this.state.selectedGifts],
            name: this.generateGarouName(),
            rage: this.data.breeds[this.state.selectedBreed].startingTraits.rage,
            gnosis: this.data.breeds[this.state.selectedBreed].startingTraits.gnosis,
            willpower: this.data.breeds[this.state.selectedBreed].startingTraits.willpower,
            creationDate: new Date().toISOString(),
            experience: 0,
            renown: {
                glory: 0,
                honor: 0,
                wisdom: 0
            }
        };
        
        this.state.characterInProgress = character;
        
        // Mostrar resumo
        this.showCharacterSummary(character);
    },

    generateGarouName: function() {
        if (!this.state.selectedTribe || !this.state.selectedAuspice) {
            return "Garou Sem Nome";
        }
        
        const tribe = this.data.tribes[this.state.selectedTribe];
        const auspice = this.data.auspices[this.state.selectedAuspice];
        
        const prefixes = {
            shadowlords: ["Sombra", "Corvo", "Noite", "Estratégia", "Poder"],
            getoffenris: ["Fúria", "Guerra", "Martelo", "Honra", "Força"],
            glasswalkers: ["Tecno", "Urbano", "Rede", "Mecânico", "Digital"],
            blackfuries: ["Natureza", "Mãe", "Proteção", "Lua", "Floresta"],
            silverfangs: ["Prata", "Nobre", "Rei", "Antigo", "Sangue"],
            bonegnawers: ["Rua", "Sobrevivente", "Lixo", "Esperto", "Rato"],
            redtalons: ["Garra", "Caça", "Fera", "Sangue", "Predador"],
            stargazers: ["Estrela", "Sábio", "Equilíbrio", "Visão", "Espírito"]
        };
        
        const suffixes = {
            ragabash: ["Trapaceiro", "Inovador", "Desafiador", "Astuto"],
            theurge: ["Xamã", "Espiritual", "Visionário", "Sagrado"],
            philodox: ["Juiz", "Sábio", "Justo", "Diplomata"],
            galliard: ["Bardo", "Historiador", "Inspirador", "Contador"],
            ahroun: ["Guerreiro", "Protetor", "Herói", "Campeão"]
        };
        
        const tribePrefixes = prefixes[this.state.selectedTribe] || ["Lobo", "Garou"];
        const auspiceSuffixes = suffixes[this.state.selectedAuspice] || ["Poderoso"];
        
        const randomPrefix = tribePrefixes[Math.floor(Math.random() * tribePrefixes.length)];
        const randomSuffix = auspiceSuffixes[Math.floor(Math.random() * auspiceSuffixes.length)];
        
        return `${randomPrefix} ${randomSuffix}`;
    },

    showCharacterSummary: function(character) {
        const tribe = this.data.tribes[character.tribe];
        const auspice = this.data.auspices[character.auspice];
        const breed = this.data.breeds[character.breed];
        
        // Calcular atributos totais
        const physicalTotal = this.data.attributes.physical.reduce((sum, attr) => sum + (character.attributes[attr] || 1), 0);
        const socialTotal = this.data.attributes.social.reduce((sum, attr) => sum + (character.attributes[attr] || 1), 0);
        const mentalTotal = this.data.attributes.mental.reduce((sum, attr) => sum + (character.attributes[attr] || 1), 0);
        
        const summary = `
            <div class="character-summary">
                <h3><i class="fas fa-check-circle"></i> Seu Garou está Pronto!</h3>
                <div class="summary-details">
                    <div class="summary-header">
                        <div class="summary-avatar">
                            <div class="avatar-large" style="background: ${tribe.color}">
                                <i class="fas fa-${tribe.icon}"></i>
                            </div>
                        </div>
                        <div class="summary-info">
                            <h4>${character.name}</h4>
                            <div class="summary-traits">
                                <span class="trait-badge" style="background: ${tribe.color}">${tribe.name}</span>
                                <span class="trait-badge" style="background: ${auspice.color}">${auspice.name}</span>
                                <span class="trait-badge">${breed.name}</span>
                            </div>
                            <p class="summary-description">Um ${breed.name.toLowerCase()} ${auspice.name.toLowerCase()} da tribo ${tribe.name}, pronto para a guerra por Gaia.</p>
                        </div>
                    </div>
                    
                    <div class="summary-stats">
                        <h5>Atributos</h5>
                        <div class="stats-grid">
                            <div class="stat-category">
                                <h6>Físicos: ${physicalTotal}</h6>
                                ${this.data.attributes.physical.map(attr => `
                                    <div class="stat-row">
                                        <span>${attr}:</span>
                                        <span class="stat-value">${character.attributes[attr] || 1}</span>
                                    </div>
                                `).join('')}
                            </div>
                            <div class="stat-category">
                                <h6>Sociais: ${socialTotal}</h6>
                                ${this.data.attributes.social.map(attr => `
                                    <div class="stat-row">
                                        <span>${attr}:</span>
                                        <span class="stat-value">${character.attributes[attr] || 1}</span>
                                    </div>
                                `).join('')}
                            </div>
                            <div class="stat-category">
                                <h6>Mentais: ${mentalTotal}</h6>
                                ${this.data.attributes.mental.map(attr => `
                                    <div class="stat-row">
                                        <span>${attr}:</span>
                                        <span class="stat-value">${character.attributes[attr] || 1}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        
                        <h5>Recursos</h5>
                        <div class="resource-stats">
                            <div class="stat-row">
                                <span>Fúria:</span>
                                <div class="stat-dots">${this.createStatDots(character.rage, 5)}</div>
                            </div>
                            <div class="stat-row">
                                <span>Gnosis:</span>
                                <div class="stat-dots">${this.createStatDots(character.gnosis, 5)}</div>
                            </div>
                            <div class="stat-row">
                                <span>Vontade:</span>
                                <div class="stat-dots">${this.createStatDots(character.willpower, 5)}</div>
                            </div>
                        </div>
                        
                        <h5>Dons Iniciais</h5>
                        <div class="gifts-list">
                            ${character.gifts.map(gift => `
                                <span class="gift-item">${gift}</span>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="summary-actions">
                        <button id="saveCharacterBtn" class="btn-control">
                            <i class="fas fa-save"></i> Salvar Personagem
                        </button>
                        <button id="startWithCharacterBtn" class="btn-control btn-control-next">
                            <i class="fas fa-play"></i> Começar a Jogar
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Substituir conteúdo do passo 5
        const stepContent = document.getElementById('step5');
        if (stepContent) {
            stepContent.innerHTML = summary;
            
            // Adicionar eventos dos botões
            document.getElementById('saveCharacterBtn').addEventListener('click', () => this.saveCharacter(character));
            document.getElementById('startWithCharacterBtn').addEventListener('click', () => this.startWithCharacter(character));
        }
    },

    saveCharacter: function(character) {
        // Salvar usando o sistema de personagens
        if (window.WerewolfCharacters) {
            const success = WerewolfCharacters.saveCharacter(character);
            if (success) {
                this.showNotification(`Personagem "${character.name}" salvo com sucesso!`, 'success');
                this.resetCharacter();
            } else {
                this.showNotification('Erro ao salvar personagem', 'error');
            }
        } else {
            // Fallback para localStorage
            const savedCharacters = JSON.parse(localStorage.getItem('werewolf_characters') || '[]');
            savedCharacters.push(character);
            localStorage.setItem('werewolf_characters', JSON.stringify(savedCharacters));
            
            this.showNotification('Personagem salvo com sucesso!', 'success');
            this.resetCharacter();
        }
    },

    startWithCharacter: function(character) {
        this.state.characterInProgress = character;
        
        // Definir como personagem atual
        if (window.WerewolfCharacters) {
            WerewolfCharacters.setCurrentCharacter(character);
        }
        
        this.showNotification(`Bem-vindo, ${character.name}! Que Gaia guie seus passos.`, 'success');
        
        // Redirecionar para caçadas
        this.navigateTo('#hunts');
        
        // Atualizar interface
        this.updateRageIndicator(character.rage, 10);
        
        // Atualizar botão de login para mostrar nome do personagem
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.innerHTML = `<i class="fas fa-user"></i> ${character.name}`;
            loginBtn.title = `Jogando como ${character.name}`;
        }
    },

    resetCharacter: function() {
        this.state.selectedTribe = null;
        this.state.selectedAuspice = null;
        this.state.selectedBreed = null;
        this.state.selectedAttributes = {};
        this.state.selectedGifts = [];
        this.state.characterInProgress = null;
        this.state.currentStep = 1;
        
        // Resetar interface
        this.updateCreationStep();
        this.loadTribesSelection();
        this.updateCharacterPreview();
        
        this.showNotification('Criação reiniciada', 'info');
    },

    startCharacterCreation: function() {
        if (!this.state.currentUser) {
            this.showLoginModal();
            this.showNotification('Faça login para criar um personagem', 'info');
            return;
        }
        
        this.navigateTo('#characters');
        this.resetCharacter();
    },

    // Ferramentas
    selectForm: function(formKey) {
        const form = this.data.forms[formKey];
        if (!form) return;
        
        // Atualizar botões ativos
        document.querySelectorAll('.form-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-form') === formKey) {
                btn.classList.add('active');
            }
        });
        
        // Atualizar informações
        document.getElementById('formName').textContent = form.name;
        document.getElementById('formDescription').textContent = form.description;
        document.getElementById('strMod').textContent = form.modifiers.strength >= 0 ? `+${form.modifiers.strength}` : form.modifiers.strength;
        document.getElementById('dexMod').textContent = form.modifiers.dexterity >= 0 ? `+${form.modifiers.dexterity}` : form.modifiers.dexterity;
        document.getElementById('staMod').textContent = form.modifiers.stamina >= 0 ? `+${form.modifiers.stamina}` : form.modifiers.stamina;
        
        // Adicionar animação
        const formDisplay = document.querySelector('.form-display');
        if (formDisplay) {
            formDisplay.style.opacity = '0';
            formDisplay.style.transform = 'translateX(-10px)';
            setTimeout(() => {
                formDisplay.style.transition = 'all 0.3s ease';
                formDisplay.style.opacity = '1';
                formDisplay.style.transform = 'translateX(0)';
            }, 10);
        }
    },

    generateNPC: function() {
        const type = document.getElementById('npcTypeSelect').value;
        const rank = document.getElementById('npcRankSelect').value;
        
        const npc = this.createNPC(type, rank);
        this.displayNPC(npc);
        
        // Tocar som
        if (window.WerewolfAudio) {
            WerewolfAudio.playSound('dice');
        }
    },

    createNPC: function(type, rank) {
        const tribes = Object.keys(this.data.tribes);
        const randomTribe = tribes[Math.floor(Math.random() * tribes.length)];
        const tribe = this.data.tribes[randomTribe];
        
        const auspices = Object.keys(this.data.auspices);
        const randomAuspice = auspices[Math.floor(Math.random() * auspices.length)];
        const auspice = this.data.auspices[randomAuspice];
        
        const names = {
            garou: ["Caminhante Silencioso", "Lua de Sangue", "Garra de Prata", "Uivo Noturno", "Olho da Tempestade", "Sombra da Floresta"],
            spirit: ["Espírito do Rio", "Guardião da Floresta", "Sombra Ancestral", "Vento do Leste", "Chama Eterna", "Raiz Profunda"],
            kinfolk: ["Mateus Silva", "Isabela Santos", "Rafael Oliveira", "Ana Costa", "Carlos Mendes", "Fernanda Lima"],
            villain: ["Devorador de Almas", "Corruptor", "Mestre das Trevas", "Wyrm Encarnada", "Peste Negra", "Serpente Venenosa"]
        };
        
        const descriptions = {
            garou: `Um ${rank} da tribo ${tribe.name}, nascido sob a ${auspice.moon}. ${this.getRankDescription(rank)}`,
            spirit: `Um espírito ${this.getSpiritType()} que habita os lugares sagrados da floresta. ${this.getSpiritDescription()}`,
            kinfolk: `Um humano com sangue Garou, ligado à tribo ${tribe.name} por laços familiares. Conhece os segredos do mundo sobrenatural.`,
            villain: `Uma criatura da Wyrm que busca corromper tudo ao seu redor. ${this.getVillainDescription()}`
        };
        
        return {
            name: names[type][Math.floor(Math.random() * names[type].length)],
            type: type,
            rank: rank,
            tribe: tribe.name,
            auspice: auspice.name,
            description: descriptions[type],
            traits: this.generateNPCTraits(type, rank),
            stats: this.generateNPCStats(type, rank)
        };
    },
    
    getRankDescription: function(rank) {
        const descriptions = {
            cub: "Apenas começando sua jornada como Garou.",
            cliate: "Ainda aprendendo os caminhos de sua tribo.",
            fostern: "Já provou seu valor em algumas caçadas.",
            adren: "Experiente e respeitado por seus pares.",
            athro: "Um veterano com muitas histórias para contar.",
            elder: "Sábio e poderoso, um líder natural."
        };
        return descriptions[rank] || "Um Garou em busca de seu destino.";
    },
    
    getSpiritType: function() {
        const types = ["antigo", "sábio", "poderoso", "misterioso", "brincalhão", "protetor"];
        return types[Math.floor(Math.random() * types.length)];
    },
    
    getSpiritDescription: function() {
        const descriptions = [
            "Oferece sabedoria àqueles que sabem ouvir.",
            "Protege um lugar sagrado há séculos.",
            "Comunica-se através de sonhos e visões.",
            "Testa aqueles que buscam seu conhecimento.",
            "Guarda segredos ancestrais da terra."
        ];
        return descriptions[Math.floor(Math.random() * descriptions.length)];
    },
    
    getVillainDescription: function() {
        const descriptions = [
            "Corrompe tudo o que toca com seu toque venenoso.",
            "Manipula os fracos para servir à Wyrm.",
            "Espalha doença e desespero por onde passa.",
            "Coleta almas para alimentar seu poder sombrio.",
            "Destrói lugares sagrados por puro prazer."
        ];
        return descriptions[Math.floor(Math.random() * descriptions.length)];
    },

    generateNPCTraits: function(type, rank) {
        const traits = {
            garou: ["Feroz", "Leal", "Espiritual", "Protetor", "Honrado", "Sábio", "Corajoso", "Determinado"],
            spirit: ["Místico", "Antigo", "Sábio", "Poderoso", "Paciente", "Enigmático", "Justo", "Natural"],
            kinfolk: ["Corajoso", "Leal", "Resiliente", "Protetor", "Observador", "Discreto", "Útil", "Confiável"],
            villain: ["Traiçoeiro", "Corrupto", "Poderoso", "Maldoso", "Manipulador", "Cruel", "Egoísta", "Destrutivo"]
        };
        
        // Selecionar 3-4 traços aleatórios
        const typeTraits = traits[type] || ["Misterioso", "Complexo", "Interessante"];
        const selectedTraits = [];
        const numTraits = Math.floor(Math.random() * 2) + 3; // 3-4 traços
        
        for (let i = 0; i < numTraits; i++) {
            const randomIndex = Math.floor(Math.random() * typeTraits.length);
            selectedTraits.push(typeTraits[randomIndex]);
            typeTraits.splice(randomIndex, 1); // Evitar duplicatas
        }
        
        return selectedTraits;
    },
    
    generateNPCStats: function(type, rank) {
        const rankModifiers = {
            cub: { min: 1, max: 2 },
            cliate: { min: 2, max: 3 },
            fostern: { min: 3, max: 4 },
            adren: { min: 4, max: 5 },
            athro: { min: 5, max: 6 },
            elder: { min: 6, max: 7 }
        };
        
        const modifier = rankModifiers[rank] || { min: 2, max: 4 };
        
        return {
            strength: this.generateStatValue(modifier.min, modifier.max),
            agility: this.generateStatValue(modifier.min, modifier.max),
            stamina: this.generateStatValue(modifier.min, modifier.max),
            perception: this.generateStatValue(modifier.min, modifier.max),
            intelligence: this.generateStatValue(modifier.min, modifier.max),
            wits: this.generateStatValue(modifier.min, modifier.max)
        };
    },

    displayNPC: function(npc) {
        const output = document.getElementById('npcOutput');
        if (!output) return;
        
        output.innerHTML = `
            <div class="npc-display">
                <h4>${npc.name}</h4>
                <div class="npc-subtitle">${this.capitalizeFirst(npc.type)} • ${this.capitalizeFirst(npc.rank)}</div>
                <div class="npc-traits">
                    ${npc.traits.map(trait => `<span class="npc-trait">${trait}</span>`).join('')}
                </div>
                <p class="npc-description">${npc.description}</p>
                
                ${npc.tribe ? `<p><strong>Tribo:</strong> ${npc.tribe}</p>` : ''}
                ${npc.auspice ? `<p><strong>Auspício:</strong> ${npc.auspice}</p>` : ''}
                
                <div class="npc-stats">
                    <div class="npc-stat">
                        <span class="npc-stat-value">${npc.stats.strength}</span>
                        <span class="npc-stat-label">Força</span>
                    </div>
                    <div class="npc-stat">
                        <span class="npc-stat-value">${npc.stats.agility}</span>
                        <span class="npc-stat-label">Agilidade</span>
                    </div>
                    <div class="npc-stat">
                        <span class="npc-stat-value">${npc.stats.stamina}</span>
                        <span class="npc-stat-label">Resistência</span>
                    </div>
                    <div class="npc-stat">
                        <span class="npc-stat-value">${npc.stats.perception}</span>
                        <span class="npc-stat-label">Percepção</span>
                    </div>
                    <div class="npc-stat">
                        <span class="npc-stat-value">${npc.stats.intelligence}</span>
                        <span class="npc-stat-label">Inteligência</span>
                    </div>
                    <div class="npc-stat">
                        <span class="npc-stat-value">${npc.stats.wits}</span>
                        <span class="npc-stat-label">Raciocínio</span>
                    </div>
                </div>
                
                <div class="npc-actions">
                    <button class="btn-tool btn-tool-secondary" onclick="WerewolfApp.saveNPC()">
                        <i class="fas fa-save"></i> Salvar NPC
                    </button>
                    <button class="btn-tool" onclick="WerewolfApp.generateNPC()">
                        <i class="fas fa-redo"></i> Gerar Outro
                    </button>
                </div>
            </div>
        `;
        
        // Animação de entrada
        output.style.opacity = '0';
        output.style.transform = 'translateY(20px)';
        setTimeout(() => {
            output.style.transition = 'all 0.3s ease';
            output.style.opacity = '1';
            output.style.transform = 'translateY(0)';
        }, 10);
    },
    
    capitalizeFirst: function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },

    generateStatValue: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    saveNPC: function() {
        this.showNotification('NPC salvo para uso futuro', 'success');
    },

    initializeMap: function() {
        const grid = document.getElementById('caernMapGrid');
        if (!grid) return;
        
        let html = '';
        for (let i = 0; i < 25; i++) {
            html += `<div class="map-cell" data-cell="${i}"></div>`;
        }
        grid.innerHTML = html;
        
        // Adicionar alguns elementos iniciais
        const cells = grid.querySelectorAll('.map-cell');
        if (cells[12]) {
            cells[12].classList.add('caern');
            cells[12].innerHTML = '🌳';
            cells[12].title = 'Caern Antigo';
        }
        if (cells[6]) {
            cells[6].classList.add('lair');
            cells[6].innerHTML = '🏠';
            cells[6].title = 'Covil do Pack';
        }
        if (cells[18]) {
            cells[18].classList.add('wyrm');
            cells[18].innerHTML = '☠️';
            cells[18].title = 'Área da Wyrm';
        }
        
        // Adicionar eventos de clique
        cells.forEach(cell => {
            cell.addEventListener('click', () => {
                this.handleMapCellClick(cell);
            });
        });
    },
    
    handleMapCellClick: function(cell) {
        if (!this.state.mapMode) {
            this.showNotification('Selecione um tipo de elemento primeiro', 'info');
            return;
        }
        
        // Limpar célula
        cell.className = 'map-cell';
        cell.innerHTML = '';
        cell.title = '';
        
        // Adicionar novo elemento baseado no modo
        switch(this.state.mapMode) {
            case 'caern':
                cell.classList.add('caern');
                cell.innerHTML = '🌳';
                cell.title = 'Caern';
                this.showNotification('Caern adicionado', 'success');
                break;
            case 'lair':
                cell.classList.add('lair');
                cell.innerHTML = '🏠';
                cell.title = 'Covil';
                this.showNotification('Covil adicionado', 'success');
                break;
            case 'wyrm':
                cell.classList.add('wyrm');
                cell.innerHTML = '☠️';
                cell.title = 'Área da Wyrm';
                this.showNotification('Área da Wyrm marcada', 'warning');
                break;
        }
        
        // Feedback visual
        cell.style.transform = 'scale(0.8)';
        setTimeout(() => {
            cell.style.transition = 'transform 0.2s ease';
            cell.style.transform = 'scale(1)';
        }, 10);
    },

    handleMapAction: function(type) {
        switch(type) {
            case 'caern':
                this.state.mapMode = 'caern';
                this.showNotification('Modo: Adicionar Caern. Clique em uma célula.', 'info');
                break;
            case 'lair':
                this.state.mapMode = 'lair';
                this.showNotification('Modo: Adicionar Covil. Clique em uma célula.', 'info');
                break;
            case 'wyrm':
                this.state.mapMode = 'wyrm';
                this.showNotification('Modo: Marcar área da Wyrm. Clique em uma célula.', 'warning');
                break;
            case 'clear':
                this.clearMap();
                this.state.mapMode = null;
                break;
        }
        
        // Atualizar botões ativos
        document.querySelectorAll('.map-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-type') === type) {
                btn.classList.add('active');
            }
        });
    },

    clearMap: function() {
        const cells = document.querySelectorAll('.map-cell');
        cells.forEach(cell => {
            cell.className = 'map-cell';
            cell.innerHTML = '';
            cell.title = '';
        });
        this.showNotification('Mapa limpo', 'success');
    },

    // IA Narrativa
    startAIGame: function() {
        const style = document.getElementById('aiStyleSelect').value;
        const theme = document.getElementById('aiThemeSelect').value;
        const setting = document.getElementById('aiSettingSelect').value;
        const complexity = document.getElementById('aiComplexity').value;
        
        const settings = {
            style: style,
            theme: theme,
            setting: setting,
            complexity: complexity
        };
        
        this.showNotification('Iniciando jogo com Narrador IA...', 'info');
        
        // Limpar chat anterior
        this.clearAIChat();
        
        // Simular inicialização
        setTimeout(() => {
            this.showAIOpeningMessage(settings);
            this.updateAIMood(style);
            this.showNotification('Narrador IA pronto! Faça sua primeira ação.', 'success');
        }, 2000);
    },
    
    clearAIChat: function() {
        const chatMessages = document.getElementById('aiChatMessages');
        if (chatMessages) {
            chatMessages.innerHTML = '';
            this.showNotification('Conversa limpa', 'info');
        }
    },
    
    saveAIChat: function() {
        this.showNotification('Sessão salva no histórico', 'success');
        // Em produção, salvaria no localStorage ou backend
    },

    showAIOpeningMessage: function(settings) {
        const messages = {
            primal: "A floresta respira ao seu redor. O cheiro de terra molhada e sangue fresco enche seus pulmões. Sua fúria desperta. Gaia chama seus filhos. Qual é seu primeiro uivo?",
            spiritual: "Os espíritos sussurram em seus ouvidos. O Umbral está próximo, uma cortina fina entre os mundos. Você sente a presença ancestral. Como você responde ao chamado?",
            epic: "Uma lenda está prestes a ser escrita. O destino de Gaia pende na balança. Você é o herói que o mundo precisa. Qual é seu primeiro ato de bravura?",
            gothic: "As sombras se alongam, e a corrupção espreita. A cidade adormece, ignorante dos horrores que a cercam. A escuridão chama. Você atende?"
        };
        
        const chatMessages = document.getElementById('aiChatMessages');
        if (chatMessages) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'ai-message';
            messageDiv.innerHTML = `
                <div class="message-content">
                    <p>${messages[settings.style] || messages.primal}</p>
                </div>
                <div class="message-timestamp">
                    <i class="fas fa-clock"></i> Agora
                </div>
            `;
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    },

    updateAIMood: function(style) {
        const moods = {
            primal: "Primal",
            spiritual: "Espiritual",
            epic: "Épico",
            gothic: "Gótico"
        };
        
        const moodElement = document.getElementById('aiMood');
        if (moodElement) {
            moodElement.textContent = moods[style] || "Neutro";
            moodElement.style.color = this.getMoodColor(style);
        }
    },
    
    getMoodColor: function(style) {
        const colors = {
            primal: "var(--color-earth)",
            spiritual: "var(--color-spirit)",
            epic: "var(--color-gold)",
            gothic: "var(--color-night)"
        };
        return colors[style] || "var(--color-moon)";
    },

    sendAIMessage: function() {
        const input = document.getElementById('aiPlayerInput');
        const message = input.value.trim();
        const actionType = document.getElementById('actionTypeSelect').value;
        
        if (!message) {
            this.showNotification('Digite uma mensagem', 'warning');
            input.focus();
            return;
        }
        
        // Adicionar mensagem do jogador
        this.addPlayerMessage(message, actionType);
        
        // Simular resposta da IA
        setTimeout(() => {
            this.generateAIResponse(message, actionType);
        }, 1000);
        
        // Limpar input
        input.value = '';
        input.focus();
    },

    addPlayerMessage: function(message, actionType) {
        const chatMessages = document.getElementById('aiChatMessages');
        if (!chatMessages) return;
        
        const actionIcons = {
            hunt: '🔪',
            investigate: '🔍',
            ritual: '🕯️',
            gift: '🌟',
            transform: '🐺'
        };
        
        const actionNames = {
            hunt: 'Caçar',
            investigate: 'Investigar',
            ritual: 'Ritual',
            gift: 'Usar Dom',
            transform: 'Transformar'
        };
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'ai-message player-message';
        messageDiv.innerHTML = `
            <div class="message-content">
                <p><strong>${actionIcons[actionType] || '💬'} ${actionNames[actionType] || 'Ação'}:</strong> ${message}</p>
            </div>
            <div class="message-timestamp">
                <i class="fas fa-clock"></i> Agora
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    },

    generateAIResponse: function(playerMessage, actionType) {
        const responses = {
            hunt: [
                "Sua presa sente sua aproximação. O instinto de caça toma conta. Rolagem de Percepção?",
                "O cheiro de medo enche o ar. A Wyrm sabe que você está perto. Prepare-se para o confronto.",
                "A floresta se cala em respeito à caçada. Cada passo é calculado. O que você faz a seguir?",
                "Os rastros levam a uma clareira sombria. Algo observa das sombras."
            ],
            investigate: [
                "Os sinais estão lá, mas são sutis. O que os olhos não veem, o instinto percebe.",
                "Cada detalhe conta uma história. A Wyrm deixa rastros, mas disfarça bem suas pegadas.",
                "O espírito do lugar sussurra segredos. Você está pronto para ouvir a verdade?",
                "Sua investigação revela marcas estranhas no chão. Parecem frescas."
            ],
            ritual: [
                "Os elementos respondem ao seu chamado. O poder ancestral flui através de você.",
                "O círculo está formado. Os espíritos observam. O ritual começa.",
                "Palavras antigas ecoam no ar. O Umbral se abre. O que você busca invocar?",
                "A energia espiritual se concentra no ponto do ritual. O ar fica pesado."
            ],
            gift: [
                "O poder do seu dom desperta. Gaia concede seu favor aos filhos leais.",
                "A energia espiritual corre em suas veias. O presente ancestral se manifesta.",
                "Sua conexão com os espíritos se fortalece. O dom responde ao seu chamado.",
                "Você sente o dom fluindo através de você. O efeito é imediato."
            ],
            transform: [
                "Os ossos estalam, os músculos se rearranjam. A besta dentro de você se liberta.",
                "A transformação é dolorosa, mas necessária. Sua forma verdadeira emerge.",
                "Entre a humanidade e a besta, você encontra o equilíbrio do Crinos.",
                "A mudança acontece. Sua percepção do mundo se altera completamente."
            ]
        };
        
        const randomResponses = responses[actionType] || [
            "O vento traz novas informações. O cenário muda. Como você responde?",
            "Gaia observa suas ações. A guerra continua. Qual é seu próximo movimento?",
            "Os espíritos aguardam sua decisão. O destino de muitos está em suas mãos.",
            "Sua ação tem consequências. O que você faz agora?"
        ];
        
        const response = randomResponses[Math.floor(Math.random() * randomResponses.length)];
        
        const chatMessages = document.getElementById('aiChatMessages');
        if (chatMessages) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'ai-message';
            messageDiv.innerHTML = `
                <div class="message-content">
                    <p><strong>Narrador IA:</strong> ${response}</p>
                </div>
                <div class="message-timestamp">
                    <i class="fas fa-clock"></i> Agora
                </div>
            `;
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    },

    generateActionSuggestion: function() {
        const actionType = document.getElementById('actionTypeSelect').value;
        
        const suggestions = {
            hunt: ["Investigar ruídos estranhos na floresta", "Seguir rastros de corrupção", "Preparar uma emboscada para a presa", "Farejar o ar em busca de pistas"],
            investigate: ["Examinar marcas estranhas no chão", "Conversar com espíritos locais", "Pesquisar em registros antigos", "Analisar amostras do ambiente"],
            ritual: ["Realizar ritual de purificação", "Invocar espíritos protetores", "Fortificar o Caern", "Comunicar-se com ancestrais"],
            gift: ["Usar dom de percepção aumentada", "Ativar fúria controlada", "Comunicar-se com espíritos animais", "Curar ferimentos leves"],
            transform: ["Mudar para forma Crinos para combate", "Assumir forma Lupus para rastrear", "Manter forma Glabro para discrição", "Testar os limites da transformação"]
        };
        
        const typeSuggestions = suggestions[actionType] || ["Explorar a área", "Interagir com NPCs", "Preparar para perigos", "Descansar e se recuperar"];
        const suggestion = typeSuggestions[Math.floor(Math.random() * typeSuggestions.length)];
        
        const input = document.getElementById('aiPlayerInput');
        input.value = suggestion;
        input.focus();
        
        this.showNotification('Sugestão gerada!', 'info');
    },

    // Lore
    showLoreSection: function(section) {
        // Atualizar botões ativos
        document.querySelectorAll('.lore-nav-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-lore') === section) {
                btn.classList.add('active');
            }
        });
        
        // Mostrar seção correspondente
        document.querySelectorAll('.lore-section').forEach(sectionElement => {
            sectionElement.classList.remove('active');
        });
        
        const targetSection = document.getElementById(`${section}Content`);
        if (targetSection) {
            targetSection.classList.add('active');
            
            // Animação de entrada
            targetSection.style.opacity = '0';
            targetSection.style.transform = 'translateY(20px)';
            setTimeout(() => {
                targetSection.style.transition = 'all 0.3s ease';
                targetSection.style.opacity = '1';
                targetSection.style.transform = 'translateY(0)';
            }, 10);
        }
    },

    // Sistema de Notificações
    showNotification: function(message, type = 'info') {
        const container = document.getElementById('notificationsContainer');
        if (!container) {
            // Criar container se não existir
            container = document.createElement('div');
            container.id = 'notificationsContainer';
            container.className = 'notifications-container';
            document.body.appendChild(container);
        }
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            info: 'info-circle',
            warning: 'exclamation-triangle'
        };
        
        notification.innerHTML = `
            <i class="fas fa-${icons[type] || 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;
        
        container.appendChild(notification);
        
        // Fechar com botão
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            this.removeNotification(notification);
        });
        
        // Fechar automaticamente após 5 segundos
        const autoClose = setTimeout(() => {
            this.removeNotification(notification);
        }, 5000);
        
        // Manter referência para poder cancelar
        notification._autoClose = autoClose;
        
        // Adicionar ao estado
        this.state.notifications.push({ 
            message, 
            type, 
            timestamp: new Date(),
            element: notification 
        });
        
        // Limitar histórico
        if (this.state.notifications.length > 50) {
            const oldNotification = this.state.notifications.shift();
            if (oldNotification.element && oldNotification.element.parentNode) {
                this.removeNotification(oldNotification.element);
            }
        }
    },
    
    removeNotification: function(notification) {
        if (notification._autoClose) {
            clearTimeout(notification._autoClose);
        }
        
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    },

    // Gerenciamento de Estado
    saveState: function() {
        try {
            localStorage.setItem('werewolf_app_state', JSON.stringify({
                audioEnabled: this.state.audioEnabled,
                currentStep: this.state.currentStep,
                selectedTribe: this.state.selectedTribe,
                selectedAuspice: this.state.selectedAuspice,
                selectedBreed: this.state.selectedBreed,
                selectedAttributes: this.state.selectedAttributes,
                selectedGifts: this.state.selectedGifts,
                characterInProgress: this.state.characterInProgress,
                currentUser: this.state.currentUser
            }));
        } catch (e) {
            console.error('Erro ao salvar estado:', e);
        }
    },

    loadState: function() {
        try {
            const saved = JSON.parse(localStorage.getItem('werewolf_app_state'));
            if (saved) {
                this.state.audioEnabled = saved.audioEnabled !== undefined ? saved.audioEnabled : true;
                this.state.currentStep = saved.currentStep || 1;
                this.state.selectedTribe = saved.selectedTribe || null;
                this.state.selectedAuspice = saved.selectedAuspice || null;
                this.state.selectedBreed = saved.selectedBreed || null;
                this.state.selectedAttributes = saved.selectedAttributes || {};
                this.state.selectedGifts = saved.selectedGifts || [];
                this.state.characterInProgress = saved.characterInProgress || null;
                this.state.currentUser = saved.currentUser || null;
            }
        } catch (e) {
            console.error('Erro ao carregar estado:', e);
        }
    },

    // Utilitários
    loadInitialData: function() {
        // Atualizar contadores
        this.updateOnlineCounters();
        
        // Inicializar mapa (já feito no setupTools)
        
        // Atualizar fase lunar
        this.updateMoonPhase();
        
        // Inicializar estatísticas da comunidade
        this.initializeCommunityStats();
    },
    
    initializeCommunityStats: function() {
        // Garous online (número aleatório entre 250-350)
        const garouElement = document.getElementById('onlineGarou');
        if (garouElement) {
            garouElement.textContent = Math.floor(Math.random() * 100) + 250;
        }
        
        // Caçadas ativas (número aleatório entre 50-80)
        const huntsElement = document.getElementById('activeHunts');
        if (huntsElement) {
            huntsElement.textContent = Math.floor(Math.random() * 30) + 50;
        }
        
        // Anciões ativos (número aleatório entre 15-25)
        const eldersElement = document.getElementById('activeElders');
        if (eldersElement) {
            eldersElement.textContent = Math.floor(Math.random() * 10) + 15;
        }
    },

    updateOnlineCounters: function() {
        // Atualizar contadores periodicamente (a cada 30 segundos)
        setInterval(() => {
            const garouElement = document.getElementById('onlineGarou');
            const huntsElement = document.getElementById('activeHunts');
            const eldersElement = document.getElementById('activeElders');
            
            if (garouElement) {
                const current = parseInt(garouElement.textContent);
                const change = Math.floor(Math.random() * 11) - 5; // -5 a +5
                garouElement.textContent = Math.max(100, current + change);
            }
            
            if (huntsElement) {
                const current = parseInt(huntsElement.textContent);
                const change = Math.floor(Math.random() * 5) - 2; // -2 a +2
                huntsElement.textContent = Math.max(10, current + change);
            }
            
            if (eldersElement) {
                const current = parseInt(eldersElement.textContent);
                const change = Math.floor(Math.random() * 3) - 1; // -1 a +1
                eldersElement.textContent = Math.max(5, current + change);
            }
        }, 30000);
    },

    updateMoonPhase: function() {
        const phases = [
            { name: 'Nova', icon: '🌑', days: 0 },
            { name: 'Crescente', icon: '🌒', days: 3 },
            { name: 'Meia Lua', icon: '🌓', days: 7 },
            { name: 'Gibosa', icon: '🌔', days: 11 },
            { name: 'Cheia', icon: '🌕', days: 14 },
            { name: 'Minguante', icon: '🌖', days: 18 },
            { name: 'Quarto Minguante', icon: '🌗', days: 22 },
            { name: 'Balsâmica', icon: '🌘', days: 26 }
        ];
        
        // Simular ciclo lunar (baseado na data atual)
        const now = new Date();
        const cycleDay = (now.getDate() + now.getMonth()) % 29; // Ciclo lunar ~29 dias
        const currentPhaseIndex = Math.floor((cycleDay / 29) * phases.length);
        const currentPhase = phases[currentPhaseIndex % phases.length];
        const nextFullMoon = (14 - (cycleDay % 29) + 29) % 29;
        
        // Atualizar elementos
        const phaseElement = document.getElementById('moonPhase');
        const moonIconElement = document.getElementById('footerMoonIcon');
        const moonTextElement = document.getElementById('footerMoonText');
        const nextFullMoonElement = document.getElementById('nextFullMoon');
        
        if (phaseElement) phaseElement.textContent = currentPhase.name;
        if (moonTextElement) moonTextElement.textContent = `Lua ${currentPhase.name}`;
        if (moonIconElement) moonIconElement.textContent = currentPhase.icon;
        if (nextFullMoonElement) {
            nextFullMoonElement.textContent = `Próxima cheia: ${nextFullMoon} dia${nextFullMoon !== 1 ? 's' : ''}`;
        }
        
        // Atualizar periodicamente
        setTimeout(() => this.updateMoonPhase(), 60000); // A cada minuto
    },

    updateRageIndicator: function(current, max) {
        const rageFill = document.getElementById('rageFill');
        const rageCount = document.getElementById('rageCount');
        
        if (rageFill) {
            const percentage = (current / max) * 100;
            rageFill.style.width = `${percentage}%`;
            
            // Mudar cor baseado no nível
            if (percentage > 80) {
                rageFill.style.background = 'linear-gradient(135deg, #FF0000, #8B0000)';
                rageFill.style.boxShadow = '0 0 10px rgba(255, 0, 0, 0.5)';
            } else if (percentage > 50) {
                rageFill.style.background = 'linear-gradient(135deg, #FF4500, #8B4513)';
                rageFill.style.boxShadow = '0 0 5px rgba(255, 69, 0, 0.3)';
            } else {
                rageFill.style.background = 'var(--gradient-primal)';
                rageFill.style.boxShadow = 'none';
            }
        }
        
        if (rageCount) {
            rageCount.textContent = `${current}/${max}`;
            rageCount.style.color = current > max * 0.8 ? 'var(--color-blood)' : 'var(--color-moon)';
        }
    },

    updateInterface: function() {
        // Atualizar indicador de Fúria
        this.updateRageIndicator(5, 10);
        
        // Atualizar fase lunar no rodapé
        this.updateMoonPhase();
        
        // Atualizar estatísticas da comunidade
        this.initializeCommunityStats();
        
        // Atualizar usuário atual se logado
        if (this.state.currentUser) {
            const loginBtn = document.getElementById('loginBtn');
            if (loginBtn) {
                loginBtn.innerHTML = `<i class="fas fa-user"></i> ${this.state.currentUser.name}`;
            }
        }
        
        // Atualizar personagem em progresso se existir
        if (this.state.characterInProgress) {
            this.updateCharacterPreview();
        }
    },

    quickStart: function() {
        this.showNotification('Início Rápido ativado. Criando personagem básico...', 'info');
        
        // Selecionar opções aleatórias para início rápido
        const tribes = Object.keys(this.data.tribes);
        const auspices = Object.keys(this.data.auspices);
        const breeds = Object.keys(this.data.breeds);
        
        this.state.selectedTribe = tribes[Math.floor(Math.random() * tribes.length)];
        this.state.selectedAuspice = auspices[Math.floor(Math.random() * auspices.length)];
        this.state.selectedBreed = breeds[Math.floor(Math.random() * breeds.length)];
        
        // Gerar atributos aleatórios
        this.state.selectedAttributes = {};
        for (const category of Object.values(this.data.attributes)) {
            for (const attr of category) {
                this.state.selectedAttributes[attr] = Math.floor(Math.random() * 3) + 1; // 1-4
            }
        }
        
        // Selecionar 3 gifts aleatórios da tribo
        const tribeGifts = this.data.giftsByTribe[this.state.selectedTribe];
        this.state.selectedGifts = [];
        for (let i = 0; i < 3 && i < tribeGifts.length; i++) {
            this.state.selectedGifts.push(tribeGifts[i]);
        }
        
        this.state.currentStep = 5; // Ir para finalização
        
        this.navigateTo('#characters');
        this.updateCreationStep();
        this.updateCharacterPreview();
        
        setTimeout(() => {
            this.finishCharacterCreation();
        }, 1000);
    },

    showTutorial: function() {
        // Em produção, abriria um modal ou guia interativo
        this.showNotification('Abrindo tutorial...', 'info');
        
        const tutorialHTML = `
            <div class="tutorial-modal">
                <h3><i class="fas fa-graduation-cap"></i> Tutorial: Primeiros Passos</h3>
                <div class="tutorial-steps">
                    <div class="tutorial-step">
                        <h4>1. Crie seu Garou</h4>
                        <p>Use a criação de personagem para definir sua tribo, auspício e raça.</p>
                    </div>
                    <div class="tutorial-step">
                        <h4>2. Entre em uma Caçada</h4>
                        <p>Junte-se a outros Garous para lutar contra a Wyrm.</p>
                    </div>
                    <div class="tutorial-step">
                        <h4>3. Use as Ferramentas</h4>
                        <p>Rolador de dados, calculadora de formas e gerador de NPCs estão à sua disposição.</p>
                    </div>
                    <div class="tutorial-step">
                        <h4>4. Explore o Lore</h4>
                        <p>Aprenda sobre a Litania, a Triat e as tradições Garou.</p>
                    </div>
                </div>
                <button class="btn-control" onclick="WerewolfApp.hideTutorial()">
                    <i class="fas fa-check"></i> Entendi
                </button>
            </div>
        `;
        
        // Em produção, mostraria em um modal
        setTimeout(() => {
            this.showNotification('Tutorial disponível na seção "Aprenda a Jogar"', 'info');
        }, 500);
    },
    
    hideTutorial: function() {
        // Fechar modal do tutorial
        this.showNotification('Tutorial fechado', 'info');
    },

    showLoginModal: function() {
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevenir scroll
            
            // Adicionar conteúdo do modal
            const modalBody = modal.querySelector('.modal-body');
            if (modalBody) {
                modalBody.innerHTML = `
                    <div class="login-content">
                        <h4><i class="fas fa-paw"></i> Abraçar Gaia</h4>
                        <p>Entre na guerra por Gaia ou crie sua conta Garou.</p>
                        
                        <div class="login-form">
                            <div class="form-group">
                                <label for="loginEmail"><i class="fas fa-envelope"></i> Email</label>
                                <input type="email" id="loginEmail" placeholder="seu@email.com" autofocus>
                            </div>
                            
                            <div class="form-group">
                                <label for="loginPassword"><i class="fas fa-key"></i> Senha</label>
                                <input type="password" id="loginPassword" placeholder="Sua senha">
                            </div>
                            
                            <div class="form-options">
                                <label class="checkbox-label">
                                    <input type="checkbox" id="rememberMe">
                                    <span class="checkbox-custom"></span>
                                    Lembrar-me
                                </label>
                                <a href="#" class="forgot-link">Esqueceu a senha?</a>
                            </div>
                            
                            <button class="btn-control" id="doLoginBtn">
                                <i class="fas fa-sign-in-alt"></i> Entrar
                            </button>
                            
                            <div class="divider">
                                <span>ou</span>
                            </div>
                            
                            <button class="btn-control btn-control-secondary" id="doRegisterBtn">
                                <i class="fas fa-user-plus"></i> Criar Conta
                            </button>
                            
                            <p class="login-disclaimer">
                                <small><i class="fas fa-exclamation-triangle"></i> Entrar significa aceitar a Litania e jurar proteger Gaia.</small>
                            </p>
                        </div>
                    </div>
                `;
                
                // Adicionar eventos
                document.getElementById('doLoginBtn').addEventListener('click', () => this.doLogin());
                document.getElementById('doRegisterBtn').addEventListener('click', () => this.doRegister());
                
                // Enter para submit
                const emailInput = document.getElementById('loginEmail');
                const passwordInput = document.getElementById('loginPassword');
                
                const handleEnter = (e) => {
                    if (e.key === 'Enter') {
                        this.doLogin();
                    }
                };
                
                emailInput.addEventListener('keypress', handleEnter);
                passwordInput.addEventListener('keypress', handleEnter);
            }
        }
    },

    hideLoginModal: function() {
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = ''; // Restaurar scroll
        }
    },

    doLogin: function() {
        const email = document.getElementById('loginEmail')?.value;
        const password = document.getElementById('loginPassword')?.value;
        
        if (!email || !password) {
            this.showNotification('Preencha todos os campos', 'error');
            return;
        }
        
        if (!this.validateEmail(email)) {
            this.showNotification('Email inválido', 'error');
            return;
        }
        
        // Simular login
        this.showNotification('Autenticando...', 'info');
        
        setTimeout(() => {
            this.state.currentUser = {
                email: email,
                name: this.generateGarouName(),
                joined: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            };
            
            this.hideLoginModal();
            this.showNotification(`Bem-vindo de volta, ${this.state.currentUser.name}! Que Gaia te abençoe.`, 'success');
            
            // Atualizar interface
            const loginBtn = document.getElementById('loginBtn');
            if (loginBtn) {
                loginBtn.innerHTML = `<i class="fas fa-user"></i> ${this.state.currentUser.name}`;
                loginBtn.title = `Conectado como ${this.state.currentUser.name}`;
            }
            
            // Salvar estado
            this.saveState();
            
            // Atualizar Rage com base no personagem atual
            if (this.state.characterInProgress) {
                this.updateRageIndicator(this.state.characterInProgress.rage, 10);
            }
        }, 1500);
    },
    
    validateEmail: function(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    doRegister: function() {
        const email = document.getElementById('loginEmail')?.value;
        const password = document.getElementById('loginPassword')?.value;
        
        if (!email || !password) {
            this.showNotification('Preencha todos os campos', 'error');
            return;
        }
        
        if (!this.validateEmail(email)) {
            this.showNotification('Email inválido', 'error');
            return;
        }
        
        if (password.length < 6) {
            this.showNotification('A senha deve ter pelo menos 6 caracteres', 'error');
            return;
        }
        
        this.showNotification('Criando conta...', 'info');
        
        setTimeout(() => {
            this.state.currentUser = {
                email: email,
                name: `Novo Garou`,
                joined: new Date().toISOString(),
                isNew: true
            };
            
            this.hideLoginModal();
            this.showNotification(`Conta criada com sucesso! Bem-vindo à guerra, ${this.state.currentUser.name}.`, 'success');
            
            // Redirecionar para criação de personagem
            setTimeout(() => {
                this.startCharacterCreation();
            }, 1000);
        }, 2000);
    }
};

// Exportar para uso global
window.WerewolfApp = WerewolfApp;

// Inicialização automática quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        WerewolfApp.init();
    });
} else {
    // DOM já carregado
    WerewolfApp.init();
}

console.log('🐺 Lobisomem: A Idade das Trevas - Sistema RPG Online carregado!');