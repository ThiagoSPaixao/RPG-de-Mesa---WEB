createHuntCard: function(hunt) {
    const isFeatured = hunt.tags.includes('featured');
    const isAI = hunt.tags.includes('ai');
    const isRecruiting = hunt.tags.includes('recruiting');
    
    return `
        <div class="hunt-card ${isFeatured ? 'featured' : ''}" data-hunt-id="${hunt.id}">
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
                        <i class="fas fa-star"></i>
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
    const isFavorite = btn.className.includes('fas');
    
    if (isFavorite) {
        btn.className = 'far fa-star';
        this.showNotification('Removido dos favoritos', 'info');
    } else {
        btn.className = 'fas fa-star';
        this.showNotification('Adicionado aos favoritos', 'success');
    }
},

applyHuntFilters: function() {
    const typeFilter = document.getElementById('huntTypeFilter').value;
    const tribeFilter = document.getElementById('tribeFilter').value;
    const regionFilter = document.getElementById('regionFilter').value;
    const difficultyFilter = document.getElementById('difficultyFilter').value;
    
    this.showNotification('Filtros aplicados', 'success');
    
    // Em produção, aqui faria uma requisição à API
    // Por enquanto, apenas recarrega as caçadas
    this.loadHunts();
},

clearHuntFilters: function() {
    document.getElementById('huntTypeFilter').value = 'all';
    document.getElementById('tribeFilter').value = 'all';
    document.getElementById('regionFilter').value = 'all';
    document.getElementById('difficultyFilter').value = 'all';
    
    this.showNotification('Filtros limpos', 'info');
    this.loadHunts();
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
            <div class="tribe-option" data-tribe="${key}">
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
    if (tribeElement && this.state.selectedTribe) {
        tribeElement.textContent = `Tribo: ${this.data.tribes[this.state.selectedTribe].name}`;
    }
    
    // Atualizar auspício
    const auspiceElement = document.getElementById('previewAuspice');
    if (auspiceElement && this.state.selectedAuspice) {
        auspiceElement.textContent = `Auspício: ${this.data.auspices[this.state.selectedAuspice].name}`;
    }
    
    // Atualizar raça
    const breedElement = document.getElementById('previewBreed');
    if (breedElement && this.state.selectedBreed) {
        breedElement.textContent = `Raça: ${this.data.breeds[this.state.selectedBreed].name}`;
    }
    
    // Atualizar estatísticas
    this.updatePreviewStats();
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
        html += `
            <div class="auspice-option" data-auspice="${key}">
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
        html += `
            <div class="breed-option" data-breed="${key}">
                <div class="breed-icon">
                    <i class="fas fa-${key === 'homid' ? 'user' : key === 'metis' ? 'dna' : 'paw'}"></i>
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
    
    // Sistema de pontos de atributos
    const attributes = {
        physical: {
            name: "Físicos",
            attributes: ["Força", "Destreza", "Vigor"]
        },
        social: {
            name: "Sociais",
            attributes: ["Carisma", "Manipulação", "Aparência"]
        },
        mental: {
            name: "Mentais",
            attributes: ["Percepção", "Inteligência", "Raciocínio"]
        }
    };
    
    let html = `
        <h3>Distribua seus Atributos</h3>
        <p>Você tem <span class="points-remaining" id="pointsRemaining">7</span> pontos para distribuir</p>
        <div class="attributes-grid">
    `;
    
    for (const [category, data] of Object.entries(attributes)) {
        html += `
            <div class="attribute-category">
                <h4>${data.name}</h4>
                ${data.attributes.map(attr => `
                    <div class="attribute-control">
                        <label>${attr}</label>
                        <div class="attribute-counter" data-attribute="${category}-${attr.toLowerCase()}">
                            <button class="attr-btn decrease" data-attribute="${category}-${attr.toLowerCase()}">-</button>
                            <span class="attr-value">1</span>
                            <button class="attr-btn increase" data-attribute="${category}-${attr.toLowerCase()}">+</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    html += `</div>`;
    stepContent.innerHTML = html;
    
    // Configurar eventos dos atributos
    this.setupAttributesEvents();
},

setupAttributesEvents: function() {
    const attrButtons = document.querySelectorAll('.attr-btn');
    const pointsElement = document.getElementById('pointsRemaining');
    let points = 7;
    
    attrButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.classList.contains('increase') ? 'increase' : 'decrease';
            const attribute = btn.getAttribute('data-attribute');
            const valueElement = btn.parentElement.querySelector('.attr-value');
            let value = parseInt(valueElement.textContent);
            
            if (action === 'increase') {
                if (points > 0 && value < 5) {
                    value++;
                    points--;
                }
            } else {
                if (value > 1) {
                    value--;
                    points++;
                }
            }
            
            valueElement.textContent = value;
            pointsElement.textContent = points;
            
            // Atualizar pré-visualização com atributos
            this.updateAttributesPreview();
        });
    });
},

updateAttributesPreview: function() {
    // Em produção, atualizaria uma ficha mais detalhada
    console.log('Atributos atualizados');
},

loadGiftsSelection: function() {
    const stepContent = document.getElementById('step5');
    if (!stepContent) return;
    
    // Dons por tribo (exemplo simplificado)
    const tribeGifts = {
        shadowlords: ["Sombra do Medo", "Comando Autoritário", "Visão Noturna"],
        getoffenris: ["Fúria do Lobo", "Pele de Ferro", "Uivo Aterrorizante"],
        glasswalkers: ["Mãos na Mecânica", "Visão Urbana", "Camuflagem Digital"],
        blackfuries: ["Chamado da Natureza", "Cura dos Ferimentos", "Força da Mãe Terra"],
        silverfangs: ["Presença Real", "Liderança Inspiradora", "Sabedoria Ancestral"],
        bonegnawers: ["Farejar Perigo", "Passo Silencioso", "Recursos do Lixo"],
        redtalons: ["Garras Afiadas", "Instinto de Caça", "Fúria Bestial"],
        stargazers: ["Visão do Umbral", "Meditação Profunda", "Sabedoria Estelar"]
    };
    
    const selectedTribe = this.state.selectedTribe;
    const gifts = tribeGifts[selectedTribe] || ["Dom Básico", "Instinto Animal", "Força da Natureza"];
    
    let html = `
        <h3>Escolha seus Dons Iniciais</h3>
        <p>Selecione 3 dons iniciais para seu Garou</p>
        <div class="gifts-selection">
            <p><strong>Tribo:</strong> ${this.data.tribes[selectedTribe].name}</p>
            <div class="gifts-grid">
    `;
    
    gifts.forEach((gift, index) => {
        html += `
            <div class="gift-option" data-gift-index="${index}">
                <div class="gift-checkbox">
                    <input type="checkbox" id="gift${index}" name="gift" value="${gift}">
                    <label for="gift${index}"></label>
                </div>
                <label for="gift${index}" class="gift-label">${gift}</label>
                <p class="gift-description">Um dom essencial para um Garou da tribo ${this.data.tribes[selectedTribe].name}.</p>
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
    
    // Limitar seleção a 3 dons
    const checkboxes = stepContent.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const checked = stepContent.querySelectorAll('input[type="checkbox"]:checked');
            if (checked.length > 3) {
                checkbox.checked = false;
                this.showNotification('Selecione no máximo 3 dons', 'warning');
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
    
    // Criar objeto do personagem
    const character = {
        tribe: this.state.selectedTribe,
        auspice: this.state.selectedAuspice,
        breed: this.state.selectedBreed,
        name: this.generateGarouName(),
        rage: this.data.breeds[this.state.selectedBreed].startingTraits.rage,
        gnosis: this.data.breeds[this.state.selectedBreed].startingTraits.gnosis,
        willpower: this.data.breeds[this.state.selectedBreed].startingTraits.willpower,
        creationDate: new Date().toISOString()
    };
    
    this.state.characterInProgress = character;
    
    // Mostrar resumo
    this.showCharacterSummary(character);
},

generateGarouName: function() {
    const tribe = this.data.tribes[this.state.selectedTribe];
    const auspice = this.data.auspices[this.state.selectedAuspice];
    
    const prefixes = ["Lobo", "Uivo", "Garra", "Sombras", "Lua"];
    const suffixes = ["Sanguinário", "Prata", "Noturno", "da Floresta", "Sagrado"];
    
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    
    return `${randomPrefix} ${randomSuffix}`;
},

showCharacterSummary: function(character) {
    const tribe = this.data.tribes[character.tribe];
    const auspice = this.data.auspices[character.auspice];
    const breed = this.data.breeds[character.breed];
    
    const summary = `
        <div class="character-summary">
            <h3>Seu Garou está Pronto!</h3>
            <div class="summary-details">
                <div class="summary-section">
                    <h4>${character.name}</h4>
                    <div class="summary-traits">
                        <span class="trait-badge" style="background: ${tribe.color}">${tribe.name}</span>
                        <span class="trait-badge" style="background: ${auspice.color}">${auspice.name}</span>
                        <span class="trait-badge">${breed.name}</span>
                    </div>
                </div>
                
                <div class="summary-stats">
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
    // Em produção, salvaria no backend
    // Por enquanto, salva no localStorage
    const savedCharacters = JSON.parse(localStorage.getItem('werewolf_characters') || '[]');
    savedCharacters.push(character);
    localStorage.setItem('werewolf_characters', JSON.stringify(savedCharacters));
    
    this.showNotification('Personagem salvo com sucesso!', 'success');
    this.resetCharacter();
},

startWithCharacter: function(character) {
    this.state.characterInProgress = character;
    this.showNotification(`Bem-vindo, ${character.name}!`, 'success');
    
    // Redirecionar para caçadas
    this.navigateTo('#hunts');
    
    // Atualizar interface
    this.updateRageIndicator(character.rage, 10);
},

resetCharacter: function() {
    this.state.selectedTribe = null;
    this.state.selectedAuspice = null;
    this.state.selectedBreed = null;
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
},

generateNPC: function() {
    const type = document.getElementById('npcTypeSelect').value;
    const rank = document.getElementById('npcRankSelect').value;
    
    const npc = this.createNPC(type, rank);
    this.displayNPC(npc);
},

createNPC: function(type, rank) {
    const tribes = Object.keys(this.data.tribes);
    const randomTribe = tribes[Math.floor(Math.random() * tribes.length)];
    const tribe = this.data.tribes[randomTribe];
    
    const auspices = Object.keys(this.data.auspices);
    const randomAuspice = auspices[Math.floor(Math.random() * auspices.length)];
    const auspice = this.data.auspices[randomAuspice];
    
    const names = {
        garou: ["Caminhante Silencioso", "Lua de Sangue", "Garra de Prata", "Uivo Noturno"],
        spirit: ["Espírito do Rio", "Guardião da Floresta", "Sombra Ancestral", "Vento do Leste"],
        kinfolk: ["Mateus Silva", "Isabela Santos", "Rafael Oliveira", "Ana Costa"],
        villain: ["Devorador de Almas", "Corruptor", "Mestre das Trevas", "Wyrm Encarnada"]
    };
    
    const descriptions = {
        garou: `Um ${rank} da tribo ${tribe.name}, nascido sob a ${auspice.moon}.`,
        spirit: `Um espírito antigo que habita os lugares sagrados da floresta.`,
        kinfolk: `Um humano com sangue Garou, ligado a uma tribo por laços familiares.`,
        villain: `Uma criatura da Wyrm que busca corromper tudo ao seu redor.`
    };
    
    return {
        name: names[type][Math.floor(Math.random() * names[type].length)],
        type: type,
        rank: rank,
        tribe: tribe.name,
        auspice: auspice.name,
        description: descriptions[type],
        traits: this.generateNPCTraits(type, rank)
    };
},

generateNPCTraits: function(type, rank) {
    const traits = {
        garou: ["Feroz", "Leal", "Espiritual", "Protetor"],
        spirit: ["Místico", "Antigo", "Sábio", "Poderoso"],
        kinfolk: ["Corajoso", "Leal", "Resiliente", "Protetor"],
        villain: ["Traiçoeiro", "Corrupto", "Poderoso", "Maldoso"]
    };
    
    return traits[type] || ["Misterioso", "Complexo", "Interessante"];
},

displayNPC: function(npc) {
    const output = document.getElementById('npcOutput');
    if (!output) return;
    
    output.innerHTML = `
        <div class="npc-display">
            <h4>${npc.name}</h4>
            <div class="npc-traits">
                <span class="npc-trait">${npc.type}</span>
                <span class="npc-trait">${npc.rank}</span>
                ${npc.tribe ? `<span class="npc-trait">${npc.tribe}</span>` : ''}
                ${npc.auspice ? `<span class="npc-trait">${npc.auspice}</span>` : ''}
            </div>
            <p class="npc-description">${npc.description}</p>
            <div class="npc-stats">
                <div class="npc-stat">
                    <span class="npc-stat-value">${this.generateStatValue(3, 5)}</span>
                    <span class="npc-stat-label">Força</span>
                </div>
                <div class="npc-stat">
                    <span class="npc-stat-value">${this.generateStatValue(2, 5)}</span>
                    <span class="npc-stat-label">Agilidade</span>
                </div>
                <div class="npc-stat">
                    <span class="npc-stat-value">${this.generateStatValue(3, 5)}</span>
                    <span class="npc-stat-label">Resistência</span>
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
},

generateStatValue: function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
},

saveNPC: function() {
    this.showNotification('NPC salvo para uso futuro', 'success');
},

handleMapAction: function(type) {
    const grid = document.getElementById('caernMapGrid');
    if (!grid) return;
    
    switch(type) {
        case 'caern':
            this.showNotification('Clique em uma célula para adicionar um Caern', 'info');
            this.setMapMode('caern');
            break;
        case 'lair':
            this.showNotification('Clique em uma célula para adicionar um Covil', 'info');
            this.setMapMode('lair');
            break;
        case 'wyrm':
            this.showNotification('Clique em uma célula para marcar área da Wyrm', 'info');
            this.setMapMode('wyrm');
            break;
        case 'clear':
            this.clearMap();
            break;
    }
},

setMapMode: function(mode) {
    // Em produção, implementaria lógica de edição de mapa
    this.showNotification(`Modo ${mode} ativado`, 'info');
},

clearMap: function() {
    const cells = document.querySelectorAll('.map-cell');
    cells.forEach(cell => {
        cell.className = 'map-cell';
        cell.innerHTML = '';
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
    
    // Simular inicialização
    setTimeout(() => {
        this.showAIOpeningMessage(settings);
        this.updateAIMood(style);
        this.showNotification('Narrador IA pronto! Faça sua primeira ação.', 'success');
    }, 2000);
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
    }
},

sendAIMessage: function() {
    const input = document.getElementById('aiPlayerInput');
    const message = input.value.trim();
    const actionType = document.getElementById('actionTypeSelect').value;
    
    if (!message) {
        this.showNotification('Digite uma mensagem', 'warning');
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
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'ai-message player-message';
    messageDiv.innerHTML = `
        <div class="message-content">
            <p><strong>${actionIcons[actionType] || '💬'} ${this.getActionName(actionType)}:</strong> ${message}</p>
        </div>
        <div class="message-timestamp">
            <i class="fas fa-clock"></i> Agora
        </div>
    `;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
},

getActionName: function(actionType) {
    const names = {
        hunt: 'Caçar',
        investigate: 'Investigar',
        ritual: 'Ritual',
        gift: 'Dom',
        transform: 'Transformar'
    };
    return names[actionType] || 'Ação';
},

generateAIResponse: function(playerMessage, actionType) {
    const responses = {
        hunt: [
            "Sua presa sente sua aproximação. O instinto de caça toma conta. Rolagem de Percepção?",
            "O cheiro de medo enche o ar. A Wyrm sabe que você está perto. Prepare-se para o confronto.",
            "A floresta se cala em respeito à caçada. Cada passo é calculado. O que você faz a seguir?"
        ],
        investigate: [
            "Os sinais estão lá, mas são sutis. O que os olhos não veem, o instinto percebe.",
            "Cada detalhe conta uma história. A Wyrm deixa rastros, mas disfarça bem suas pegadas.",
            "O espírito do lugar sussurra segredos. Você está pronto para ouvir a verdade?"
        ],
        ritual: [
            "Os elementos respondem ao seu chamado. O poder ancestral flui através de você.",
            "O círculo está formado. Os espíritos observam. O ritual começa.",
            "Palavras antigas ecoam no ar. O Umbral se abre. O que você busca invocar?"
        ],
        gift: [
            "O poder do seu dom desperta. Gaia concede seu favor aos filhos leais.",
            "A energia espiritual corre em suas veias. O presente ancestral se manifesta.",
            "Sua conexão com os espíritos se fortalece. O dom responde ao seu chamado."
        ],
        transform: [
            "Os ossos estalam, os músculos se rearranjam. A besta dentro de você se liberta.",
            "A transformação é dolorosa, mas necessária. Sua forma verdadeira emerge.",
            "Entre a humanidade e a besta, você encontra o equilíbrio do Crinos."
        ]
    };
    
    const randomResponses = responses[actionType] || [
        "O vento traz novas informações. O cenário muda. Como você responde?",
        "Gaia observa suas ações. A guerra continua. Qual é seu próximo movimento?",
        "Os espíritos aguardam sua decisão. O destino de muitos está em suas mãos."
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
        hunt: ["Investigar ruídos estranhos na floresta", "Seguir rastros de corrupção", "Preparar uma emboscada para a presa"],
        investigate: ["Examinar marcas estranhas", "Conversar com espíritos locais", "Pesquisar em registros antigos"],
        ritual: ["Realizar ritual de purificação", "Invocar espíritos protetores", "Fortificar o Caern"],
        gift: ["Usar dom de percepção aumentada", "Ativar fúria controlada", "Comunicar-se com espíritos animais"],
        transform: ["Mudar para forma Crinos para combate", "Assumir forma Lupus para rastrear", "Manter forma Glabro para discrição"]
    };
    
    const typeSuggestions = suggestions[actionType] || ["Explorar a área", "Interagir com NPCs", "Preparar para perigos"];
    const suggestion = typeSuggestions[Math.floor(Math.random() * typeSuggestions.length)];
    
    const input = document.getElementById('aiPlayerInput');
    input.value = suggestion;
    input.focus();
    
    this.showNotification('Sugestão gerada!', 'info');
},

// Sistema de Notificações
showNotification: function(message, type = 'info') {
    const container = document.getElementById('notificationsContainer');
    if (!container) return;
    
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
    `;
    
    container.appendChild(notification);
    
    // Remover após 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => {
                if (notification.parentNode) {
                    container.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
    
    // Adicionar ao estado
    this.state.notifications.push({ message, type, timestamp: new Date() });
    if (this.state.notifications.length > 50) {
        this.state.notifications.shift();
    }
},

// Gerenciamento de Estado
saveState: function() {
    try {
        localStorage.setItem('werewolf_app_state', JSON.stringify({
            audioEnabled: this.state.audioEnabled,
            currentStep: this.state.currentStep,
            selectedTribe: this.state.selectedTribe,
            selectedAuspice: this.state.selectedAuspice,
            selectedBreed: this.state.selectedBreed
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
        }
    } catch (e) {
        console.error('Erro ao carregar estado:', e);
    }
},

// Utilitários
loadInitialData: function() {
    // Atualizar contadores
    this.updateOnlineCounters();
    
    // Inicializar mapa
    this.initializeMap();
    
    // Atualizar fase lunar
    this.updateMoonPhase();
},

updateOnlineCounters: function() {
    // Simular contadores online
    setInterval(() => {
        const garouElement = document.getElementById('onlineGarou');
        const huntsElement = document.getElementById('activeHunts');
        const eldersElement = document.getElementById('activeElders');
        
        if (garouElement) {
            const current = parseInt(garouElement.textContent);
            garouElement.textContent = Math.max(100, current + Math.floor(Math.random() * 10) - 5);
        }
        
        if (huntsElement) {
            const current = parseInt(huntsElement.textContent);
            huntsElement.textContent = Math.max(10, current + Math.floor(Math.random() * 3) - 1);
        }
        
        if (eldersElement) {
            const current = parseInt(eldersElement.textContent);
            eldersElement.textContent = Math.max(5, current + Math.floor(Math.random() * 2) - 1);
        }
    }, 30000);
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
    }
    if (cells[6]) {
        cells[6].classList.add('lair');
        cells[6].innerHTML = '🏠';
    }
    if (cells[18]) {
        cells[18].classList.add('wyrm');
        cells[18].innerHTML = '☠️';
    }
},

updateMoonPhase: function() {
    const phases = ['Nova', 'Crescente', 'Meia Lua', 'Gibosa', 'Cheia', 'Minguante'];
    const currentPhase = phases[Math.floor(Math.random() * phases.length)];
    
    const phaseElement = document.getElementById('moonPhase');
    const moonIconElement = document.getElementById('footerMoonIcon');
    const moonTextElement = document.getElementById('footerMoonText');
    
    if (phaseElement) phaseElement.textContent = currentPhase;
    if (moonTextElement) moonTextElement.textContent = `Lua ${currentPhase}`;
    
    // Atualizar ícone
    if (moonIconElement) {
        const icons = {
            'Nova': '🌑',
            'Crescente': '🌒',
            'Meia Lua': '🌓',
            'Gibosa': '🌔',
            'Cheia': '🌕',
            'Minguante': '🌖'
        };
        moonIconElement.textContent = icons[currentPhase] || '🌕';
    }
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
        } else if (percentage > 50) {
            rageFill.style.background = 'linear-gradient(135deg, #FF4500, #8B4513)';
        } else {
            rageFill.style.background = 'var(--gradient-primal)';
        }
    }
    
    if (rageCount) {
        rageCount.textContent = `${current}/${max}`;
    }
},

updateInterface: function() {
    // Atualizar indicador de Fúria
    this.updateRageIndicator(5, 10);
    
    // Atualizar fase lunar no rodapé
    this.updateMoonPhase();
    
    // Atualizar estatísticas da comunidade
    this.updateOnlineCounters();
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
    
    this.state.currentStep = 5; // Ir para finalização
    
    this.navigateTo('#characters');
    this.updateCreationStep();
    this.updateCharacterPreview();
    
    setTimeout(() => {
        this.finishCharacterCreation();
    }, 1000);
},

showTutorial: function() {
    this.showNotification('Abrindo tutorial...', 'info');
    // Em produção, abriria um modal ou guia interativo
},

showLoginModal: function() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.add('active');
        
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
                            <input type="email" id="loginEmail" placeholder="seu@email.com">
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
                            <small>Entrar significa aceitar a Litania e jurar proteger Gaia.</small>
                        </p>
                    </div>
                </div>
            `;
            
            // Adicionar eventos
            document.getElementById('doLoginBtn').addEventListener('click', () => this.doLogin());
            document.getElementById('doRegisterBtn').addEventListener('click', () => this.doRegister());
        }
    }
},

hideLoginModal: function() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.remove('active');
    }
},

doLogin: function() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        this.showNotification('Preencha todos os campos', 'error');
        return;
    }
    
    // Simular login
    this.showNotification('Autenticando...', 'info');
    
    setTimeout(() => {
        this.state.currentUser = {
            email: email,
            name: this.generateGarouName(),
            joined: new Date().toISOString()
        };
        
        this.hideLoginModal();
        this.showNotification(`Bem-vindo de volta, ${this.state.currentUser.name}!`, 'success');
        
        // Atualizar interface
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.innerHTML = `<i class="fas fa-user"></i> ${this.state.currentUser.name}`;
        }
    }, 1500);
},

doRegister: function() {
    this.showNotification('Sistema de registro em desenvolvimento', 'info');
    // Em produção, implementaria registro completo
}
};

// ============================================
// SISTEMA DE ÁUDIO
// ============================================

const WerewolfAudio = {
    audioContext: null,
    backgroundMusic: null,
    isPlaying: false,
    isMuted: false,
    volume: 0.7,
    
    init: function() {
        console.log('🎵 Inicializando sistema de áudio');
        
        // Criar contexto de áudio
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API não suportada:', e);
            return;
        }
        
        // Carregar configurações salvas
        this.loadSettings();
        
        // Iniciar música de fundo
        this.playBackground();
        
        console.log('✅ Áudio inicializado');
    },
    
    loadSettings: function() {
        const savedVolume = localStorage.getItem('werewolf_audio_volume');
        const savedMuted = localStorage.getItem('werewolf_audio_muted');
        
        if (savedVolume) {
            this.volume = parseFloat(savedVolume);
        }
        
        if (savedMuted) {
            this.isMuted = savedMuted === 'true';
        }
    },
    
    saveSettings: function() {
        localStorage.setItem('werewolf_audio_volume', this.volume);
        localStorage.setItem('werewolf_audio_muted', this.isMuted);
    },
    
    playBackground: function() {
        if (!this.audioContext || this.isPlaying || this.isMuted) return;
        
        // Em produção, carregaria um arquivo de áudio real
        // Por enquanto, criamos um sintetizador simples
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.type = 'sine';
            oscillator.frequency.value = 130.81; // C3
            
            gainNode.gain.value = this.volume * 0.1;
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.start();
            
            // Parar após 0.5 segundos (apenas demonstração)
            setTimeout(() => {
                oscillator.stop();
            }, 500);
            
            this.isPlaying = true;
        } catch (e) {
            console.warn('Erro ao tocar áudio:', e);
        }
    },
    
    pauseBackground: function() {
        this.isPlaying = false;
        // Em produção, pausaria a música
    },
    
    setVolume: function(value) {
        this.volume = Math.max(0, Math.min(1, value));
        this.saveSettings();
        
        // Atualizar slider visual
        const slider = document.getElementById('volumeSlider');
        if (slider) {
            slider.value = this.volume * 100;
        }
    },
    
    mute: function() {
        this.isMuted = true;
        this.pauseBackground();
        this.saveSettings();
    },
    
    unmute: function() {
        this.isMuted = false;
        this.saveSettings();
        if (WerewolfApp.state.audioEnabled) {
            this.playBackground();
        }
    },
    
    playSound: function(type) {
        if (!this.audioContext || this.isMuted) return;
        
        const sounds = {
            dice: { freq: 200, duration: 0.1 },
            success: { freq: 523.25, duration: 0.2 }, // C5
            failure: { freq: 261.63, duration: 0.3 }, // C4
            transform: { freq: 329.63, duration: 0.5 } // E4
        };
        
        const sound = sounds[type] || sounds.dice;
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.type = 'sine';
            oscillator.frequency.value = sound.freq;
            
            gainNode.gain.value = this.volume * 0.3;
            
            // Envelope
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.volume * 0.3, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + sound.duration);
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + sound.duration);
        } catch (e) {
            console.warn('Erro ao tocar som:', e);
        }
    }
};

// ============================================
// SISTEMA DE DADOS
// ============================================

const WerewolfDice = {
    pool: 6,
    difficulty: 6,
    specialty: false,
    rage: false,
    willpower: false,
    
    init: function() {
        console.log('🎲 Inicializando sistema de dados');
        
        // Configurar controles
        this.setupControls();
        
        // Carregar configurações salvas
        this.loadSettings();
        
        console.log('✅ Dados inicializados');
    },
    
    setupControls: function() {
        // Controles do pool
        const decreaseBtn = document.getElementById('decreasePool');
        const increaseBtn = document.getElementById('increasePool');
        const poolValue = document.getElementById('poolValue');
        
        if (decreaseBtn) {
            decreaseBtn.addEventListener('click', () => this.adjustPool(-1));
        }
        
        if (increaseBtn) {
            increaseBtn.addEventListener('click', () => this.adjustPool(1));
        }
        
        // Dificuldade
        const difficultySelect = document.getElementById('difficultySelect');
        if (difficultySelect) {
            difficultySelect.addEventListener('change', (e) => {
                this.difficulty = parseInt(e.target.value);
                this.saveSettings();
            });
        }
        
        // Modificadores
        const specialtyCheck = document.getElementById('specialtyCheck');
        const rageCheck = document.getElementById('rageCheck');
        const willpowerCheck = document.getElementById('willpowerCheck');
        
        if (specialtyCheck) {
            specialtyCheck.addEventListener('change', (e) => {
                this.specialty = e.target.checked;
                this.saveSettings();
            });
        }
        
        if (rageCheck) {
            rageCheck.addEventListener('change', (e) => {
                this.rage = e.target.checked;
                this.saveSettings();
            });
        }
        
        if (willpowerCheck) {
            willpowerCheck.addEventListener('change', (e) => {
                this.willpower = e.target.checked;
                this.saveSettings();
            });
        }
    },
    
    loadSettings: function() {
        const saved = JSON.parse(localStorage.getItem('werewolf_dice_settings') || '{}');
        
        this.pool = saved.pool || 6;
        this.difficulty = saved.difficulty || 6;
        this.specialty = saved.specialty || false;
        this.rage = saved.rage || false;
        this.willpower = saved.willpower || false;
        
        // Atualizar interface
        this.updateInterface();
    },
    
    saveSettings: function() {
        const settings = {
            pool: this.pool,
            difficulty: this.difficulty,
            specialty: this.specialty,
            rage: this.rage,
            willpower: this.willpower
        };
        
        localStorage.setItem('werewolf_dice_settings', JSON.stringify(settings));
    },
    
    updateInterface: function() {
        const poolValue = document.getElementById('poolValue');
        const difficultySelect = document.getElementById('difficultySelect');
        const specialtyCheck = document.getElementById('specialtyCheck');
        const rageCheck = document.getElementById('rageCheck');
        const willpowerCheck = document.getElementById('willpowerCheck');
        
        if (poolValue) poolValue.textContent = this.pool;
        if (difficultySelect) difficultySelect.value = this.difficulty;
        if (specialtyCheck) specialtyCheck.checked = this.specialty;
        if (rageCheck) rageCheck.checked = this.rage;
        if (willpowerCheck) willpowerCheck.checked = this.willpower;
    },
    
    adjustPool: function(amount) {
        this.pool = Math.max(1, Math.min(20, this.pool + amount));
        
        // Atualizar display
        const poolValue = document.getElementById('poolValue');
        if (poolValue) {
            poolValue.textContent = this.pool;
            
            // Animação
            poolValue.style.transform = 'scale(1.2)';
            setTimeout(() => {
                poolValue.style.transform = 'scale(1)';
            }, 200);
        }
        
        this.saveSettings();
        
        // Tocar som
        if (WerewolfAudio) {
            WerewolfAudio.playSound('dice');
        }
    },
    
    rollPool: function() {
        const results = [];
        let successes = 0;
        let ones = 0;
        
        // Rolagem base
        for (let i = 0; i < this.pool; i++) {
            const roll = Math.floor(Math.random() * 10) + 1;
            results.push(roll);
            
            if (roll >= this.difficulty) {
                successes++;
                
                // Especialidade: 10 conta como 2 sucessos
                if (this.specialty && roll === 10) {
                    successes++;
                }
            }
            
            if (roll === 1) {
                ones++;
            }
        }
        
        // Modificadores
        if (this.rage) {
            successes = Math.max(successes, 1); // Fúria garante pelo menos 1 sucesso
        }
        
        if (this.willpower) {
            // Vontade rerrola falhas
            const failures = results.filter(r => r < this.difficulty && r !== 1);
            const rerolls = Math.min(3, failures.length);
            
            for (let i = 0; i < rerolls; i++) {
                const reroll = Math.floor(Math.random() * 10) + 1;
                if (reroll >= this.difficulty) {
                    successes++;
                }
                results.push(reroll); // Adicionar rerolls aos resultados
            }
        }
        
        // Verificar botch
        let isBotch = false;
        if (successes === 0 && ones > 0) {
            isBotch = true;
            successes = -ones; // Botch negativo
        }
        
        // Exibir resultados
        this.displayResults(results, successes, isBotch);
        
        // Tocar som apropriado
        if (WerewolfAudio) {
            if (isBotch) {
                WerewolfAudio.playSound('failure');
            } else if (successes > 0) {
                WerewolfAudio.playSound('success');
            } else {
                WerewolfAudio.playSound('dice');
            }
        }
    },
    
    displayResults: function(results, successes, isBotch) {
        const resultsDiv = document.getElementById('rollResults');
        if (!resultsDiv) return;
        
        let resultClass = 'neutral';
        let resultText = 'Falha';
        
        if (isBotch) {
            resultClass = 'botch';
            resultText = `BOTCH! (-${Math.abs(successes)})`;
        } else if (successes > 0) {
            resultClass = 'success';
            resultText = `${successes} sucesso${successes !== 1 ? 's' : ''}`;
        }
        
        // Criar display de dados
        let diceHTML = '';
        results.forEach((roll, index) => {
            let diceClass = 'dice-result';
            
            if (roll === 10 && this.specialty) {
                diceClass += ' critical';
            } else if (roll === 1) {
                diceClass += ' botch';
            } else if (roll >= this.difficulty) {
                diceClass += ' success';
            }
            
            diceHTML += `<div class="${diceClass}">${roll}</div>`;
        });
        
        // Estatísticas
        const totalOnes = results.filter(r => r === 1).length;
        const totalSuccesses = results.filter(r => r >= this.difficulty).length;
        const totalFailures = results.length - totalSuccesses - totalOnes;
        
        resultsDiv.innerHTML = `
            <div class="roll-result-display">
                <h4>Resultado: <span class="result-${resultClass}">${resultText}</span></h4>
                <div class="roll-dice">
                    ${diceHTML}
                </div>
                
                <div class="roll-summary">
                    <h4>Estatísticas da Rolagem</h4>
                    <div class="roll-stats">
                        <div class="roll-stat">
                            <span class="roll-stat-value">${results.length}</span>
                            <span class="roll-stat-label">Dados</span>
                        </div>
                        <div class="roll-stat">
                            <span class="roll-stat-value">${this.difficulty}+</span>
                            <span class="roll-stat-label">Dificuldade</span>
                        </div>
                        <div class="roll-stat">
                            <span class="roll-stat-value">${totalSuccesses}</span>
                            <span class="roll-stat-label">Sucessos</span>
                        </div>
                        <div class="roll-stat">
                            <span class="roll-stat-value">${totalOnes}</span>
                            <span class="roll-stat-label">Uns</span>
                        </div>
                        <div class="roll-stat">
                            <span class="roll-stat-value">${totalFailures}</span>
                            <span class="roll-stat-label">Falhas</span>
                        </div>
                        <div class="roll-stat">
                            <span class="roll-stat-value">${isBotch ? 'SIM' : 'NÃO'}</span>
                            <span class="roll-stat-label">Botch</span>
                        </div>
                    </div>
                </div>
                
                <div class="roll-modifiers">
                    <p>
                        <small>
                            <i class="fas fa-info-circle"></i>
                            Modificadores: 
                            ${this.specialty ? '<span class="mod-active">Especialidade</span>' : ''}
                            ${this.rage ? '<span class="mod-active">Fúria</span>' : ''}
                            ${this.willpower ? '<span class="mod-active">Vontade</span>' : ''}
                            ${!this.specialty && !this.rage && !this.willpower ? 'Nenhum' : ''}
                        </small>
                    </p>
                </div>
            </div>
        `;
        
        // Animação
        resultsDiv.style.opacity = '0';
        resultsDiv.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            resultsDiv.style.transition = 'all 0.3s ease';
            resultsDiv.style.opacity = '1';
            resultsDiv.style.transform = 'translateY(0)';
        }, 10);
    },
    
    quickRoll: function() {
        // Rolar dados rápidos para o chat IA
        const roll = Math.floor(Math.random() * 10) + 1;
        const difficulty = 6; // Dificuldade padrão
        
        let result = 'Falha';
        if (roll === 1) {
            result = 'Botch!';
        } else if (roll >= difficulty) {
            result = 'Sucesso';
            if (roll === 10) {
                result = 'Sucesso Crítico!';
            }
        }
        
        // Adicionar ao chat
        const chatMessages = document.getElementById('aiChatMessages');
        if (chatMessages) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'ai-message system-message';
            messageDiv.innerHTML = `
                <div class="message-content">
                    <p><strong>🎲 Rolagem Rápida:</strong> <span class="dice-inline">${roll}</span> = ${result}</p>
                </div>
                <div class="message-timestamp">
                    <i class="fas fa-clock"></i> Agora
                </div>
            `;
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
        
        // Tocar som
        if (WerewolfAudio) {
            WerewolfAudio.playSound('dice');
        }
        
        return { roll, result };
    }
};

// ============================================
// SISTEMA DE PERSONAGENS
// ============================================

const WerewolfCharacters = {
    characters: [],
    currentCharacter: null,
    
    init: function() {
        console.log('👤 Inicializando sistema de personagens');
        
        // Carregar personagens salvos
        this.loadCharacters();
        
        // Configurar eventos
        this.setupEvents();
        
        console.log('✅ Personagens inicializados');
    },
    
    loadCharacters: function() {
        try {
            const saved = JSON.parse(localStorage.getItem('werewolf_characters') || '[]');
            this.characters = saved;
            
            console.log(`📁 Carregados ${this.characters.length} personagens`);
        } catch (e) {
            console.error('Erro ao carregar personagens:', e);
            this.characters = [];
        }
    },
    
    setupEvents: function() {
        // Em produção, adicionaria mais eventos específicos de personagens
    },
    
    saveCharacter: function(character) {
        // Verificar se personagem já existe
        const existingIndex = this.characters.findIndex(c => 
            c.name === character.name && 
            c.creationDate === character.creationDate
        );
        
        if (existingIndex >= 0) {
            // Atualizar existente
            this.characters[existingIndex] = character;
        } else {
            // Adicionar novo
            this.characters.push(character);
        }
        
        // Salvar no localStorage
        localStorage.setItem('werewolf_characters', JSON.stringify(this.characters));
        
        console.log(`💾 Personagem "${character.name}" salvo`);
        return true;
    },
    
    deleteCharacter: function(characterName) {
        const initialLength = this.characters.length;
        this.characters = this.characters.filter(c => c.name !== characterName);
        
        if (this.characters.length < initialLength) {
            localStorage.setItem('werewolf_characters', JSON.stringify(this.characters));
            console.log(`🗑️ Personagem "${characterName}" removido`);
            return true;
        }
        
        return false;
    },
    
    getCharacter: function(name) {
        return this.characters.find(c => c.name === name);
    },
    
    getAllCharacters: function() {
        return [...this.characters]; // Retorna cópia
    },
    
    setCurrentCharacter: function(character) {
        this.currentCharacter = character;
        
        // Em produção, atualizaria a interface completa
        if (character) {
            console.log(`🎭 Personagem atual: ${character.name}`);
            
            // Atualizar indicador de Fúria
            if (WerewolfApp && WerewolfApp.updateRageIndicator) {
                WerewolfApp.updateRageIndicator(character.rage || 5, 10);
            }
        }
    }
};

// ============================================
// INICIALIZAÇÃO
// ============================================

// Exportar para uso global
window.WerewolfApp = WerewolfApp;
window.WerewolfAudio = WerewolfAudio;
window.WerewolfDice = WerewolfDice;
window.WerewolfCharacters = WerewolfCharacters;

// Inicialização automática quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        WerewolfApp.init();
        WerewolfAudio.init();
        WerewolfDice.init();
        WerewolfCharacters.init();
    });
} else {
    // DOM já carregado
    WerewolfApp.init();
    WerewolfAudio.init();
    WerewolfDice.init();
    WerewolfCharacters.init();
}

// ============================================
// UTILITÁRIOS GLOBAIS
// ============================================

// Funções utilitárias globais
window.WerewolfUtils = {
    // Formatar data
    formatDate: function(date) {
        return new Date(date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },
    
    // Gerar ID único
    generateId: function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },
    
    // Clonar objeto (shallow)
    clone: function(obj) {
        return JSON.parse(JSON.stringify(obj));
    },
    
    // Debounce para eventos
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Throttle para eventos
    throttle: function(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

console.log('🐺 Lobisomem: A Idade das Trevas - Sistema RPG Online carregado!');