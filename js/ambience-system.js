// ambience-system.js - Sistema Avançado de Áudio para RPG

class RPGAmbienceSystem {
    constructor(options = {}) {
        // Configurações
        this.volume = options.volume || 0.5;
        this.crossfadeDuration = options.crossfadeDuration || 2000;
        this.autoplay = options.autoplay !== false;
        this.enable3DAudio = options.enable3DAudio || false;
        
        // Estado
        this.currentTrack = null;
        this.currentSystem = null;
        this.currentMood = 'default';
        this.isPlaying = false;
        this.isMuted = false;
        this.playlist = [];
        this.effectQueue = [];
        this.soundBank = new Map();
        this.dynamicSoundscapes = new Map(); // CORREÇÃO: inicialização adicionada
        this.currentScene = null; // CORREÇÃO: inicialização adicionada
        this.currentAudioSource = null; // CORREÇÃO: inicialização adicionada
        
        // Contexto de áudio
        this.audioContext = null;
        this.gainNode = null;
        this.pannerNode = null;
        
        // Controles de áudio 3D
        this.listenerPosition = { x: 0, y: 0, z: 0 };
        this.audioSources = new Map();
        
        this.init();
    }
    
    async init() {
        try {
            // Inicializa contexto de áudio
            this.setupAudioContext();
            
            // Carrega biblioteca de sons
            await this.loadSoundLibrary();
            
            // Configura controles de áudio
            this.setupAudioControls();
            
            // Carrega preferências salvas
            this.loadPreferences();
            
            console.log('Sistema de áudio inicializado com sucesso');
        } catch (error) {
            console.error('Erro ao inicializar sistema de áudio:', error);
        }
    }
    
    setupAudioContext() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContext();
            
            // Cria nós de áudio
            this.gainNode = this.audioContext.createGain();
            this.gainNode.gain.value = this.volume;
            
            if (this.enable3DAudio) {
                this.pannerNode = this.audioContext.createPanner();
                this.pannerNode.connect(this.gainNode);
                this.setup3DAudio();
            }
            
            // Conecta ao destino
            this.gainNode.connect(this.audioContext.destination);
            
            // Resumo o contexto se estiver suspenso
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
        } catch (error) {
            console.warn('Web Audio API não suportada, usando fallback:', error);
            this.audioContext = null;
        }
    }
    
    setup3DAudio() {
        if (!this.pannerNode) return;
        
        // Configura o ouvinte
        this.pannerNode.panningModel = 'HRTF';
        this.pannerNode.distanceModel = 'inverse';
        this.pannerNode.refDistance = 1;
        this.pannerNode.maxDistance = 10000;
        this.pannerNode.rolloffFactor = 1;
        this.pannerNode.coneInnerAngle = 360;
        this.pannerNode.coneOuterAngle = 0;
        this.pannerNode.coneOuterGain = 0;
        
        // Posição inicial do ouvinte
        this.pannerNode.setPosition(
            this.listenerPosition.x,
            this.listenerPosition.y,
            this.listenerPosition.z
        );
    }
    
    async loadSoundLibrary() {
        // Biblioteca de músicas por sistema e humor
        this.soundLibrary = {
            vampire: {
                background: [
                    { id: 'vampire_gothic', name: 'Música Gótica', url: '/assets/audio/vampire/gothic.mp3', mood: 'gothic' },
                    { id: 'vampire_jazz', name: 'Jazz Noturno', url: '/assets/audio/vampire/jazz.mp3', mood: 'mystery' },
                    { id: 'vampire_elegant', name: 'Elegância Decadente', url: '/assets/audio/vampire/elegant.mp3', mood: 'social' }
                ],
                effects: [
                    { id: 'heartbeat', name: 'Batimento Cardíaco', url: '/assets/audio/vampire/heartbeat.mp3' },
                    { id: 'howl', name: 'Uivo Distante', url: '/assets/audio/vampire/howl.mp3' },
                    { id: 'castle_door', name: 'Portão de Castelo', url: '/assets/audio/vampire/castle_door.mp3' },
                    { id: 'blood_drip', name: 'Gotejamento de Sangue', url: '/assets/audio/vampire/blood_drip.mp3' }
                ]
            },
            
            werewolf: {
                background: [
                    { id: 'werewolf_forest', name: 'Floresta Ancestral', url: '/assets/audio/werewolf/forest.mp3', mood: 'primal' },
                    { id: 'werewolf_tribal', name: 'Tambores Tribais', url: '/assets/audio/werewolf/tribal.mp3', mood: 'epic' },
                    { id: 'werewolf_urban', name: 'Caça Urbana', url: '/assets/audio/werewolf/urban.mp3', mood: 'tense' }
                ],
                effects: [
                    { id: 'wolf_howl', name: 'Uivo de Lobo', url: '/assets/audio/werewolf/wolf_howl.mp3' },
                    { id: 'growl', name: 'Rosnado', url: '/assets/audio/werewolf/growl.mp3' },
                    { id: 'rain_forest', name: 'Chuva na Floresta', url: '/assets/audio/werewolf/rain.mp3' },
                    { id: 'fire_crackle', name: 'Fogueira', url: '/assets/audio/werewolf/fire.mp3' }
                ]
            },
            
            mage: {
                background: [
                    { id: 'mage_mystical', name: 'Mística', url: '/assets/audio/mage/mystical.mp3', mood: 'mystical' },
                    { id: 'mage_ethereal', name: 'Etéreo', url: '/assets/audio/mage/ethereal.mp3', mood: 'calm' },
                    { id: 'mage_tense', name: 'Tensão Arcano', url: '/assets/audio/mage/tense.mp3', mood: 'tense' }
                ],
                effects: [
                    { id: 'spell_cast', name: 'Conjuração', url: '/assets/audio/mage/spell_cast.mp3' },
                    { id: 'magic_aura', name: 'Aura Mágica', url: '/assets/audio/mage/magic_aura.mp3' },
                    { id: 'portal_open', name: 'Portal', url: '/assets/audio/mage/portal.mp3' },
                    { id: 'ancient_whisper', name: 'Sussurro Ancestral', url: '/assets/audio/mage/whisper.mp3' }
                ]
            },
            
            // Efeitos universais
            universal: {
                effects: [
                    { id: 'dice_roll', name: 'Rolagem de Dados', url: '/assets/audio/universal/dice_roll.mp3' },
                    { id: 'door_open', name: 'Porta Abrindo', url: '/assets/audio/universal/door_open.mp3' },
                    { id: 'sword_clash', name: 'Espadas', url: '/assets/audio/universal/sword_clash.mp3' },
                    { id: 'book_close', name: 'Livro Fechando', url: '/assets/audio/universal/book_close.mp3' },
                    { id: 'thunder', name: 'Trovão', url: '/assets/audio/universal/thunder.mp3' },
                    { id: 'rain', name: 'Chuva', url: '/assets/audio/universal/rain.mp3' },
                    { id: 'wind', name: 'Vento', url: '/assets/audio/universal/wind.mp3' },
                    { id: 'crowd', name: 'Multidão', url: '/assets/audio/universal/crowd.mp3' }
                ]
            },
            
            // Humores específicos
            moods: {
                combat: [
                    { id: 'combat_intense', name: 'Combate Intenso', url: '/assets/audio/moods/combat_intense.mp3' },
                    { id: 'combat_epic', name: 'Combate Épico', url: '/assets/audio/moods/combat_epic.mp3' }
                ],
                mystery: [
                    { id: 'mystery_suspense', name: 'Suspense', url: '/assets/audio/moods/mystery_suspense.mp3' },
                    { id: 'mystery_investigation', name: 'Investigação', url: '/assets/audio/moods/mystery_investigation.mp3' }
                ],
                social: [
                    { id: 'social_tavern', name: 'Taberna', url: '/assets/audio/moods/social_tavern.mp3' },
                    { id: 'social_ball', name: 'Baile', url: '/assets/audio/moods/social_ball.mp3' }
                ],
                calm: [
                    { id: 'calm_peaceful', name: 'Paz', url: '/assets/audio/moods/calm_peaceful.mp3' },
                    { id: 'calm_meditation', name: 'Meditação', url: '/assets/audio/moods/calm_meditation.mp3' }
                ]
            }
        };
        
        // Pré-carrega alguns sons essenciais
        await this.preloadEssentialSounds();
    }
    
    async preloadEssentialSounds() {
        const essentialSounds = [
            'dice_roll',
            'heartbeat',
            'wolf_howl',
            'spell_cast',
            'thunder'
        ];
        
        for (const soundId of essentialSounds) {
            await this.loadSoundBuffer(soundId);
        }
    }
    
    async loadSoundBuffer(soundId, forceReload = false) {
        // Verifica se já está carregado
        if (this.soundBank.has(soundId) && !forceReload) {
            return this.soundBank.get(soundId);
        }
        
        // Encontra o som na biblioteca
        let soundUrl = null;
        
        // Procura em todas as categorias
        for (const [category, sounds] of Object.entries(this.soundLibrary)) {
            if (Array.isArray(sounds)) {
                const sound = sounds.find(s => s.id === soundId);
                if (sound) {
                    soundUrl = sound.url;
                    break;
                }
            } else {
                for (const [subcategory, subSounds] of Object.entries(sounds)) {
                    const sound = subSounds.find(s => s.id === soundId);
                    if (sound) {
                        soundUrl = sound.url;
                        break;
                    }
                }
                if (soundUrl) break;
            }
        }
        
        if (!soundUrl) {
            console.warn(`Som não encontrado: ${soundId}`);
            return null;
        }
        
        try {
            const response = await fetch(soundUrl);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const arrayBuffer = await response.arrayBuffer();
            
            if (!this.audioContext) {
                // Fallback para Audio simples
                const audio = new Audio(soundUrl);
                this.soundBank.set(soundId, audio);
                return audio;
            }
            
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
            this.soundBank.set(soundId, audioBuffer);
            
            return audioBuffer;
        } catch (error) {
            console.error(`Erro ao carregar som ${soundId}:`, error);
            return null;
        }
    }
    
    async playBackgroundMusic(system, mood = 'default', options = {}) {
        try {
            this.currentSystem = system;
            this.currentMood = mood;
            
            // Encontra músicas apropriadas
            const systemMusic = this.soundLibrary[system]?.background || [];
            let moodMusic = [];
            
            if (mood !== 'default') {
                moodMusic = this.soundLibrary.moods?.[mood] || [];
            }
            
            // Combina as listas
            const availableTracks = [...systemMusic, ...moodMusic];
            
            if (availableTracks.length === 0) {
                console.warn(`Nenhuma música disponível para ${system} - ${mood}`);
                return false;
            }
            
            // Seleciona uma trilha
            let selectedTrack;
            if (options.trackId) {
                selectedTrack = availableTracks.find(t => t.id === options.trackId);
            }
            
            if (!selectedTrack) {
                // Seleção aleatória, evitando repetir a mesma
                const previousTrackId = this.currentTrack?.id;
                const eligibleTracks = availableTracks.filter(t => t.id !== previousTrackId);
                selectedTrack = eligibleTracks[Math.floor(Math.random() * eligibleTracks.length)] || 
                              availableTracks[0];
            }
            
            // Para a trilha atual com crossfade
            if (this.currentTrack) {
                await this.stopBackgroundMusic(this.crossfadeDuration);
            }
            
            // Toca a nova trilha
            this.currentTrack = selectedTrack;
            await this.playTrack(selectedTrack, options);
            
            // Cria playlist
            this.generatePlaylist(availableTracks, selectedTrack);
            
            // Notifica mudança
            this.dispatchEvent('musicChanged', {
                system: system,
                mood: mood,
                track: selectedTrack
            });
            
            return true;
        } catch (error) {
            console.error('Erro ao tocar música de fundo:', error);
            this.dispatchEvent('playError', { error: error, context: 'backgroundMusic' });
            return false;
        }
    }
    
    async playTrack(track, options = {}) {
        try {
            const buffer = await this.loadSoundBuffer(track.id);
            
            if (!buffer) {
                throw new Error(`Falha ao carregar trilha: ${track.id}`);
            }
            
            if (this.audioContext) {
                // Usa Web Audio API
                const source = this.audioContext.createBufferSource();
                source.buffer = buffer;
                
                // Configura volume
                const gainNode = this.audioContext.createGain();
                
                // Configura panning 3D se habilitado
                if (this.enable3DAudio && this.pannerNode) {
                    source.connect(this.pannerNode);
                    this.pannerNode.connect(gainNode);
                } else {
                    source.connect(gainNode);
                }
                
                gainNode.connect(this.gainNode);
                
                // Fade in - CORREÇÃO: usando cancelScheduledValues
                if (options.fadeIn) {
                    gainNode.gain.cancelScheduledValues(this.audioContext.currentTime);
                    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                    gainNode.gain.linearRampToValueAtTime(
                        this.volume,
                        this.audioContext.currentTime + (options.fadeInDuration || 2000) / 1000
                    );
                } else {
                    gainNode.gain.value = this.volume;
                }
                
                // Configura loop
                source.loop = options.loop !== false;
                
                // Inicia reprodução
                source.start(0);
                
                // Armazena referência
                this.currentAudioSource = {
                    source: source,
                    gain: gainNode,
                    startTime: this.audioContext.currentTime,
                    track: track
                };
                
                source.onended = () => {
                    if (this.currentAudioSource?.source === source) {
                        this.currentAudioSource = null;
                        this.playNextInPlaylist();
                    }
                };
                
            } else {
                // Fallback para HTML5 Audio
                const audio = new Audio();
                audio.src = track.url;
                audio.volume = this.volume;
                audio.loop = options.loop !== false;
                
                // Tenta tocar imediatamente
                try {
                    await audio.play();
                } catch (error) {
                    console.warn('Autoplay bloqueado, aguardando interação do usuário:', error);
                    // Marca para tocar quando o usuário interagir
                    this.pendingAudio = audio;
                }
                
                this.currentAudioSource = { 
                    audio: audio,
                    track: track 
                };
            }
            
            this.isPlaying = true;
            
            // Atualiza UI
            this.updateNowPlayingUI(track);
            
            console.log(`Tocando: ${track.name}`);
            
        } catch (error) {
            console.error('Erro ao tocar trilha:', error);
            this.dispatchEvent('playError', { track: track, error: error });
            throw error;
        }
    }
    
    async stopBackgroundMusic(fadeOutDuration = this.crossfadeDuration) {
        if (!this.currentAudioSource) return;
        
        try {
            if (this.audioContext && fadeOutDuration > 0 && this.currentAudioSource.gain) {
                // Fade out suave
                const gainNode = this.currentAudioSource.gain;
                gainNode.gain.cancelScheduledValues(this.audioContext.currentTime);
                gainNode.gain.setValueAtTime(
                    gainNode.gain.value,
                    this.audioContext.currentTime
                );
                gainNode.gain.linearRampToValueAtTime(
                    0,
                    this.audioContext.currentTime + fadeOutDuration / 1000
                );
                
                // Para a fonte após o fade
                setTimeout(() => {
                    if (this.currentAudioSource?.source) {
                        try {
                            this.currentAudioSource.source.stop();
                        } catch (e) {
                            // Ignora erros se já foi parado
                        }
                    }
                    this.currentAudioSource = null;
                }, fadeOutDuration);
            } else {
                // Para imediatamente
                if (this.currentAudioSource.source) {
                    try {
                        this.currentAudioSource.source.stop();
                    } catch (e) {
                        // Ignora erros se já foi parado
                    }
                } else if (this.currentAudioSource.audio) {
                    this.currentAudioSource.audio.pause();
                    this.currentAudioSource.audio.currentTime = 0;
                }
                this.currentAudioSource = null;
            }
            
            this.isPlaying = false;
            this.currentTrack = null;
            
            this.dispatchEvent('musicStopped');
        } catch (error) {
            console.error('Erro ao parar música:', error);
        }
    }
    
    generatePlaylist(availableTracks, currentTrack) {
        this.playlist = [...availableTracks];
        
        // Move a trilha atual para o início
        const currentIndex = this.playlist.findIndex(t => t.id === currentTrack.id);
        if (currentIndex > 0) {
            const [current] = this.playlist.splice(currentIndex, 1);
            this.playlist.unshift(current);
        }
        
        // Embaralha o restante
        for (let i = 1; i < this.playlist.length; i++) {
            const j = Math.floor(Math.random() * (this.playlist.length - i)) + i;
            [this.playlist[i], this.playlist[j]] = [this.playlist[j], this.playlist[i]];
        }
    }
    
    async playNextInPlaylist() {
        if (this.playlist.length < 2) return;
        
        // Move a primeira trilha para o final
        const nextTrack = this.playlist[1];
        this.playlist.push(this.playlist.shift());
        
        await this.playBackgroundMusic(this.currentSystem, this.currentMood, {
            trackId: nextTrack.id,
            fadeIn: true,
            fadeInDuration: this.crossfadeDuration
        });
    }
    
    async playSoundEffect(effectId, options = {}) {
        const effect = this.findEffect(effectId);
        
        if (!effect) {
            console.warn(`Efeito não encontrado: ${effectId}`);
            return null;
        }
        
        const defaultOptions = {
            volume: options.volume || 1.0,
            loop: options.loop || false,
            position: options.position || { x: 0, y: 0, z: 0 },
            fadeIn: options.fadeIn || 0,
            fadeOut: options.fadeOut || 0,
            delay: options.delay || 0,
            onEnded: options.onEnded
        };
        
        // Adiciona à fila se houver delay
        if (defaultOptions.delay > 0) {
            this.effectQueue.push({
                effect: effect,
                options: defaultOptions,
                scheduledTime: Date.now() + defaultOptions.delay
            });
            
            this.processEffectQueue();
            return null;
        }
        
        return await this.playEffect(effect, defaultOptions);
    }
    
    async playEffect(effect, options) {
        try {
            const buffer = await this.loadSoundBuffer(effect.id);
            
            if (!buffer) {
                throw new Error(`Falha ao carregar efeito: ${effect.id}`);
            }
            
            if (this.audioContext) {
                const source = this.audioContext.createBufferSource();
                source.buffer = buffer;
                
                const gainNode = this.audioContext.createGain();
                gainNode.gain.value = options.volume * this.volume;
                
                // Configura posição 3D
                let panner = null;
                if (this.enable3DAudio && options.position) {
                    panner = this.audioContext.createPanner();
                    panner.setPosition(options.position.x, options.position.y, options.position.z);
                    panner.connect(gainNode);
                    source.connect(panner);
                } else {
                    source.connect(gainNode);
                }
                
                gainNode.connect(this.gainNode);
                
                // Fade in
                if (options.fadeIn > 0) {
                    gainNode.gain.cancelScheduledValues(this.audioContext.currentTime);
                    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                    gainNode.gain.linearRampToValueAtTime(
                        options.volume * this.volume,
                        this.audioContext.currentTime + options.fadeIn / 1000
                    );
                }
                
                // Fade out
                if (options.fadeOut > 0 && !options.loop) {
                    const fadeOutTime = this.audioContext.currentTime + buffer.duration - options.fadeOut / 1000;
                    gainNode.gain.setValueAtTime(
                        options.volume * this.volume,
                        fadeOutTime
                    );
                    gainNode.gain.linearRampToValueAtTime(
                        0,
                        fadeOutTime + options.fadeOut / 1000
                    );
                }
                
                source.loop = options.loop;
                source.start(0);
                
                const audioSource = {
                    source: source,
                    gain: gainNode,
                    panner: panner,
                    effect: effect,
                    options: options
                };
                
                source.onended = () => {
                    if (options.onEnded) {
                        options.onEnded();
                    }
                    this.removeAudioSource(audioSource);
                };
                
                this.audioSources.set(source, audioSource);
                
                // Notifica
                this.dispatchEvent('effectPlayed', {
                    effect: effect,
                    position: options.position
                });
                
                return audioSource;
                
            } else {
                // Fallback HTML5
                const audio = new Audio();
                audio.src = effect.url;
                audio.volume = options.volume * this.volume;
                audio.loop = options.loop;
                
                const playPromise = audio.play();
                if (playPromise !== undefined) {
                    playPromise.catch(e => {
                        console.warn('Autoplay bloqueado para efeito:', e);
                    });
                }
                
                if (options.onEnded) {
                    audio.onended = options.onEnded;
                }
                
                const audioSource = { audio: audio, effect: effect };
                return audioSource;
            }
            
        } catch (error) {
            console.error('Erro ao tocar efeito:', error);
            this.dispatchEvent('playError', { effect: effect, error: error });
            throw error;
        }
    }
    
    processEffectQueue() {
        const now = Date.now();
        
        for (let i = this.effectQueue.length - 1; i >= 0; i--) {
            const queuedEffect = this.effectQueue[i];
            
            if (now >= queuedEffect.scheduledTime) {
                this.playEffect(queuedEffect.effect, queuedEffect.options);
                this.effectQueue.splice(i, 1);
            }
        }
        
        // Continua processando a fila
        if (this.effectQueue.length > 0) {
            setTimeout(() => this.processEffectQueue(), 100);
        }
    }
    
    findEffect(effectId) {
        // Procura em todas as categorias
        for (const [system, categories] of Object.entries(this.soundLibrary)) {
            if (system === 'universal' || system === 'moods') continue;
            
            if (categories.effects) {
                const effect = categories.effects.find(e => e.id === effectId);
                if (effect) return effect;
            }
        }
        
        // Procura em universal
        if (this.soundLibrary.universal?.effects) {
            const effect = this.soundLibrary.universal.effects.find(e => e.id === effectId);
            if (effect) return effect;
        }
        
        // Procura em moods
        for (const moodCategory of Object.values(this.soundLibrary.moods || {})) {
            const effect = moodCategory.find(e => e.id === effectId);
            if (effect) return effect;
        }
        
        return null;
    }
    
    removeAudioSource(audioSource) {
        if (audioSource.source) {
            this.audioSources.delete(audioSource.source);
        }
    }
    
    setMood(mood) {
        if (this.currentMood === mood) return;
        
        this.currentMood = mood;
        
        // Se estiver tocando música, muda para o novo humor
        if (this.isPlaying && this.currentSystem) {
            this.playBackgroundMusic(this.currentSystem, mood, {
                fadeIn: true,
                fadeInDuration: this.crossfadeDuration
            });
        }
        
        this.dispatchEvent('moodChanged', { mood: mood });
    }
    
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        
        if (this.gainNode) {
            this.gainNode.gain.value = this.volume;
        }
        
        if (this.currentAudioSource?.audio) {
            this.currentAudioSource.audio.volume = this.volume;
        }
        
        this.savePreferences();
        this.dispatchEvent('volumeChanged', { volume: this.volume });
    }
    
    toggleMute() {
        this.isMuted = !this.isMuted;
        
        if (this.gainNode) {
            this.gainNode.gain.value = this.isMuted ? 0 : this.volume;
        }
        
        if (this.currentAudioSource?.audio) {
            this.currentAudioSource.audio.muted = this.isMuted;
        }
        
        this.dispatchEvent('muteToggled', { muted: this.isMuted });
        return this.isMuted;
    }
    
    togglePlayback() {
        if (this.isPlaying) {
            this.pauseBackgroundMusic();
        } else {
            this.resumeBackgroundMusic();
        }
        
        return this.isPlaying;
    }
    
    pauseBackgroundMusic() {
        if (!this.isPlaying) return;
        
        if (this.audioContext) {
            this.audioContext.suspend().then(() => {
                this.isPlaying = false;
                this.dispatchEvent('musicPaused');
            }).catch(error => {
                console.error('Erro ao pausar áudio:', error);
            });
        } else if (this.currentAudioSource?.audio) {
            this.currentAudioSource.audio.pause();
            this.isPlaying = false;
            this.dispatchEvent('musicPaused');
        }
    }
    
    resumeBackgroundMusic() {
        if (this.isPlaying) return;
        
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume().then(() => {
                this.isPlaying = true;
                this.dispatchEvent('musicResumed');
            }).catch(error => {
                console.error('Erro ao retomar áudio:', error);
            });
        } else if (this.currentAudioSource?.audio) {
            this.currentAudioSource.audio.play().then(() => {
                this.isPlaying = true;
                this.dispatchEvent('musicResumed');
            }).catch(e => {
                console.warn('Falha ao retomar:', e);
            });
        } else if (this.currentTrack) {
            // Reinicia a trilha atual
            this.playBackgroundMusic(this.currentSystem, this.currentMood, {
                trackId: this.currentTrack.id
            });
        }
    }
    
    set3DAudioPosition(position, sourceId = null) {
        if (!this.enable3DAudio) return;
        
        if (sourceId && this.audioSources.has(sourceId)) {
            // Move uma fonte específica
            const source = this.audioSources.get(sourceId);
            if (source.panner) {
                source.panner.setPosition(position.x, position.y, position.z);
            }
        } else if (this.pannerNode) {
            // Move o ouvinte
            this.listenerPosition = position;
            this.pannerNode.setPosition(position.x, position.y, position.z);
        }
    }
    
    createAudioScene(sceneData) {
        // Cria uma cena de áudio complexa
        const scene = {
            id: sceneData.id || `scene_${Date.now()}`,
            name: sceneData.name || 'Cena de Áudio',
            background: sceneData.background,
            effects: [],
            loops: new Map(),
            ambientLoops: new Map()
        };
        
        // Configura música de fundo
        if (sceneData.background) {
            this.playBackgroundMusic(
                sceneData.background.system,
                sceneData.background.mood,
                sceneData.background.options
            );
        }
        
        // Adiciona efeitos iniciais
        if (sceneData.effects) {
            sceneData.effects.forEach(effect => {
                const audioEffect = this.playSoundEffect(effect.id, effect.options);
                if (audioEffect) {
                    scene.effects.push(audioEffect);
                }
            });
        }
        
        // Configura loops ambientais
        if (sceneData.loops) {
            sceneData.loops.forEach(loop => {
                const loopEffect = this.playSoundEffect(loop.id, {
                    ...loop.options,
                    loop: true
                });
                
                if (loopEffect) {
                    scene.loops.set(loop.id, loopEffect);
                }
            });
        }
        
        this.currentScene = scene;
        this.dispatchEvent('sceneCreated', { scene: scene });
        
        return scene;
    }
    
    stopAudioScene(sceneId) {
        if (!this.currentScene || this.currentScene.id !== sceneId) return;
        
        // Para todos os loops
        this.currentScene.loops.forEach((loop, id) => {
            this.stopSoundEffect(loop);
        });
        
        // Para música de fundo
        this.stopBackgroundMusic();
        
        // Limpa efeitos
        this.currentScene.effects.forEach(effect => {
            this.stopSoundEffect(effect);
        });
        
        this.dispatchEvent('sceneStopped', { sceneId: sceneId });
        this.currentScene = null;
    }
    
    stopSoundEffect(audioSource) {
        if (!audioSource) return;
        
        try {
            if (audioSource.source) {
                audioSource.source.stop();
            } else if (audioSource.audio) {
                audioSource.audio.pause();
                audioSource.audio.currentTime = 0;
            }
            
            this.removeAudioSource(audioSource);
        } catch (error) {
            // Ignora erros se o som já foi parado
        }
    }
    
    setupAudioControls() {
        // Cria interface de controle se não existir
        if (!document.getElementById('audio-controls')) {
            this.createAudioControlsUI();
        }
        
        // Configura eventos do teclado
        this.setupKeyboardControls();
    }
    
    createAudioControlsUI() {
        const controls = document.createElement('div');
        controls.id = 'audio-controls';
        controls.className = 'audio-controls';
        controls.innerHTML = `
            <div class="audio-controls-inner">
                <button class="audio-btn" id="audio-play-pause" title="Play/Pause">
                    <i class="fas fa-play"></i>
                </button>
                
                <button class="audio-btn" id="audio-mute" title="Mute">
                    <i class="fas fa-volume-up"></i>
                </button>
                
                <div class="volume-slider-container">
                    <input type="range" id="audio-volume" min="0" max="100" value="${this.volume * 100}">
                </div>
                
                <div class="now-playing" id="now-playing">
                    <span class="track-name">Nenhuma música tocando</span>
                </div>
                
                <button class="audio-btn" id="audio-prev" title="Anterior">
                    <i class="fas fa-step-backward"></i>
                </button>
                
                <button class="audio-btn" id="audio-next" title="Próxima">
                    <i class="fas fa-step-forward"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(controls);
        
        // Event listeners
        document.getElementById('audio-play-pause').addEventListener('click', () => {
            this.togglePlayback();
        });
        
        document.getElementById('audio-mute').addEventListener('click', () => {
            const isMuted = this.toggleMute();
            const icon = document.querySelector('#audio-mute i');
            icon.className = isMuted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
        });
        
        document.getElementById('audio-volume').addEventListener('input', (e) => {
            this.setVolume(e.target.value / 100);
            this.updateVolumeSlider(e.target.value);
        });
        
        document.getElementById('audio-prev').addEventListener('click', () => {
            // Volta para trilha anterior
            if (this.playlist.length > 1) {
                const prevTrack = this.playlist[this.playlist.length - 1];
                this.playBackgroundMusic(this.currentSystem, this.currentMood, {
                    trackId: prevTrack.id
                });
            }
        });
        
        document.getElementById('audio-next').addEventListener('click', () => {
            this.playNextInPlaylist();
        });
    }
    
    updateNowPlayingUI(track) {
        const nowPlaying = document.getElementById('now-playing');
        if (!nowPlaying) return;
        
        const trackName = document.querySelector('#now-playing .track-name');
        if (trackName) {
            trackName.textContent = track?.name || 'Nenhuma música tocando';
        }
        
        // Atualiza botão play/pause
        const playIcon = document.querySelector('#audio-play-pause i');
        if (playIcon) {
            playIcon.className = this.isPlaying ? 'fas fa-pause' : 'fas fa-play';
        }
    }
    
    updateVolumeSlider(value) {
        const volumeSlider = document.getElementById('audio-volume');
        if (volumeSlider) {
            volumeSlider.value = value;
        }
    }
    
    setupKeyboardControls() {
        // Armazena referência para poder remover depois
        this.keyboardHandler = (e) => {
            // Ignora se estiver em campo de entrada
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            
            switch(e.key) {
                case ' ':
                    // Espaço: Play/Pause
                    if (e.ctrlKey) {
                        e.preventDefault();
                        this.togglePlayback();
                    }
                    break;
                    
                case 'm':
                case 'M':
                    // M: Mute
                    if (e.ctrlKey) {
                        e.preventDefault();
                        this.toggleMute();
                    }
                    break;
                    
                case 'ArrowUp':
                    // Seta para cima: Aumentar volume
                    if (e.ctrlKey) {
                        e.preventDefault();
                        this.setVolume(Math.min(1, this.volume + 0.1));
                    }
                    break;
                    
                case 'ArrowDown':
                    // Seta para baixo: Diminuir volume
                    if (e.ctrlKey) {
                        e.preventDefault();
                        this.setVolume(Math.max(0, this.volume - 0.1));
                    }
                    break;
                    
                case 'ArrowLeft':
                    // Seta esquerda: Trilha anterior
                    if (e.ctrlKey && this.playlist.length > 1) {
                        e.preventDefault();
                        const prevTrack = this.playlist[this.playlist.length - 1];
                        this.playBackgroundMusic(this.currentSystem, this.currentMood, {
                            trackId: prevTrack.id
                        });
                    }
                    break;
                    
                case 'ArrowRight':
                    // Seta direita: Próxima trilha
                    if (e.ctrlKey) {
                        e.preventDefault();
                        this.playNextInPlaylist();
                    }
                    break;
            }
        };
        
        document.addEventListener('keydown', this.keyboardHandler);
    }
    
    loadPreferences() {
        try {
            const saved = localStorage.getItem('rpgAudioPreferences');
            if (saved) {
                const prefs = JSON.parse(saved);
                this.volume = prefs.volume || this.volume;
                this.isMuted = prefs.isMuted || false;
                this.enable3DAudio = prefs.enable3DAudio || false;
                
                // Aplica configurações
                this.setVolume(this.volume);
                if (this.isMuted) {
                    this.toggleMute();
                }
            }
        } catch (error) {
            console.warn('Erro ao carregar preferências de áudio:', error);
        }
    }
    
    savePreferences() {
        const prefs = {
            volume: this.volume,
            isMuted: this.isMuted,
            enable3DAudio: this.enable3DAudio,
            lastSystem: this.currentSystem,
            lastMood: this.currentMood,
            lastTrack: this.currentTrack?.id
        };
        
        localStorage.setItem('rpgAudioPreferences', JSON.stringify(prefs));
    }
    
    dispatchEvent(eventName, detail = {}) {
        const event = new CustomEvent(`audio:${eventName}`, {
            detail: {
                ...detail,
                system: this,
                timestamp: Date.now()
            }
        });
        
        document.dispatchEvent(event);
    }
    
    getAvailableTracks(system, mood = null) {
        const systemTracks = this.soundLibrary[system]?.background || [];
        const moodTracks = mood ? this.soundLibrary.moods?.[mood] || [] : [];
        return [...systemTracks, ...moodTracks];
    }
    
    getAvailableEffects(system = null) {
        const effects = [];
        
        if (system && this.soundLibrary[system]?.effects) {
            effects.push(...this.soundLibrary[system].effects);
        }
        
        // Adiciona efeitos universais
        if (this.soundLibrary.universal?.effects) {
            effects.push(...this.soundLibrary.universal.effects);
        }
        
        // Remove duplicatas
        const seen = new Set();
        return effects.filter(effect => {
            if (seen.has(effect.id)) return false;
            seen.add(effect.id);
            return true;
        });
    }
    
    createMoodPreset(name, settings) {
        const preset = {
            id: `preset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: name,
            settings: settings,
            createdAt: new Date().toISOString(),
            lastActivated: null,
            activated: false
        };
        
        // Salva no localStorage
        this.saveMoodPreset(preset);
        return preset;
    }
    
    saveMoodPreset(preset) {
        try {
            let presets = this.getMoodPresets();
            presets = presets.filter(p => p.id !== preset.id);
            presets.push(preset);
            
            localStorage.setItem('rpgAudioPresets', JSON.stringify(presets));
        } catch (error) {
            console.error('Erro ao salvar preset:', error);
        }
    }
    
    getMoodPresets() {
        try {
            const saved = localStorage.getItem('rpgAudioPresets');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.warn('Erro ao carregar presets:', error);
            return [];
        }
    }
    
    activateMoodPreset(presetId) {
        const presets = this.getMoodPresets();
        const preset = presets.find(p => p.id === presetId);
        
        if (!preset) {
            console.warn(`Preset não encontrado: ${presetId}`);
            return false;
        }
        
        const { settings } = preset;
        
        // Limpa cena atual
        if (this.currentScene) {
            this.stopAudioScene(this.currentScene.id);
        }
        
        // Aplica configurações
        if (settings.background) {
            this.playBackgroundMusic(
                settings.background.system,
                settings.background.mood,
                settings.background.options
            );
        }
        
        if (settings.effects) {
            settings.effects.forEach(effect => {
                this.playSoundEffect(effect.id, effect.options);
            });
        }
        
        if (settings.volume !== undefined) {
            this.setVolume(settings.volume);
        }
        
        preset.activated = true;
        preset.lastActivated = new Date().toISOString();
        this.saveMoodPreset(preset);
        
        this.dispatchEvent('presetActivated', { preset: preset });
        return true;
    }
    
    createDynamicSoundscape(config) {
        const soundscape = {
            id: config.id || `soundscape_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: config.name || 'Soundscape Dinâmico',
            layers: new Map(),
            transitions: config.transitions || {},
            intensity: 0,
            isActive: false
        };
        
        // Inicializa camadas
        config.layers?.forEach(layer => {
            const audioSource = this.playSoundEffect(layer.soundId, {
                ...layer.options,
                loop: true,
                volume: 0 // Começa silencioso
            });
            
            if (audioSource) {
                soundscape.layers.set(layer.id, {
                    ...layer,
                    audioSource: audioSource,
                    currentVolume: 0,
                    targetVolume: layer.baseVolume || 0.5
                });
            }
        });
        
        this.dynamicSoundscapes.set(soundscape.id, soundscape);
        return soundscape;
    }
    
    updateSoundscapeIntensity(soundscapeId, intensity) {
        const soundscape = this.dynamicSoundscapes.get(soundscapeId);
        if (!soundscape || !soundscape.isActive) return;
        
        intensity = Math.max(0, Math.min(1, intensity));
        soundscape.intensity = intensity;
        
        // Atualiza volumes das camadas
        soundscape.layers.forEach(layer => {
            let targetVolume = layer.baseVolume || 0.5;
            
            // Aplica curva de intensidade se definida
            if (layer.intensityCurve) {
                targetVolume = this.calculateIntensityVolume(targetVolume, intensity, layer.intensityCurve);
            }
            
            layer.targetVolume = targetVolume;
            
            // Fade para o volume alvo
            this.fadeLayerVolume(layer, targetVolume, 1000);
        });
        
        this.dispatchEvent('soundscapeIntensityChanged', {
            soundscapeId: soundscapeId,
            intensity: intensity
        });
    }
    
    calculateIntensityVolume(baseVolume, intensity, curve) {
        switch(curve) {
            case 'linear':
                return baseVolume * intensity;
            case 'exponential':
                return baseVolume * (intensity * intensity);
            case 'logarithmic':
                return baseVolume * Math.log10(intensity * 9 + 1);
            case 'threshold':
                return intensity > 0.7 ? baseVolume : baseVolume * 0.3;
            default:
                return baseVolume * intensity;
        }
    }
    
    fadeLayerVolume(layer, targetVolume, duration) {
        if (!layer.audioSource || !this.audioContext) return;
        
        const gainNode = layer.audioSource.gain;
        if (!gainNode) return;
        
        gainNode.gain.cancelScheduledValues(this.audioContext.currentTime);
        gainNode.gain.setValueAtTime(
            layer.currentVolume,
            this.audioContext.currentTime
        );
        gainNode.gain.linearRampToValueAtTime(
            targetVolume * this.volume,
            this.audioContext.currentTime + duration / 1000
        );
        
        layer.currentVolume = targetVolume;
    }
    
    activateSoundscape(soundscapeId) {
        const soundscape = this.dynamicSoundscapes.get(soundscapeId);
        if (!soundscape) return false;
        
        soundscape.isActive = true;
        
        // Fade in das camadas
        soundscape.layers.forEach(layer => {
            this.fadeLayerVolume(layer, layer.targetVolume, 2000);
        });
        
        this.dispatchEvent('soundscapeActivated', { soundscapeId: soundscapeId });
        return true;
    }
    
    deactivateSoundscape(soundscapeId, fadeOutDuration = 2000) {
        const soundscape = this.dynamicSoundscapes.get(soundscapeId);
        if (!soundscape || !soundscape.isActive) return false;
        
        // Fade out das camadas
        soundscape.layers.forEach(layer => {
            this.fadeLayerVolume(layer, 0, fadeOutDuration);
            
            // Para o som após o fade
            setTimeout(() => {
                if (layer.audioSource?.source) {
                    try {
                        layer.audioSource.source.stop();
                    } catch (e) {
                        // Ignora erros se já foi parado
                    }
                }
            }, fadeOutDuration);
        });
        
        soundscape.isActive = false;
        this.dispatchEvent('soundscapeDeactivated', { soundscapeId: soundscapeId });
        return true;
    }
    
    // Métodos utilitários
    async preloadSystemSounds(system) {
        const systemSounds = this.soundLibrary[system];
        if (!systemSounds) return;
        
        const loadPromises = [];
        
        // Pré-carrega músicas de fundo
        if (systemSounds.background) {
            systemSounds.background.forEach(track => {
                loadPromises.push(this.loadSoundBuffer(track.id));
            });
        }
        
        // Pré-carrega efeitos
        if (systemSounds.effects) {
            systemSounds.effects.forEach(effect => {
                loadPromises.push(this.loadSoundBuffer(effect.id));
            });
        }
        
        await Promise.all(loadPromises);
        console.log(`Sons do sistema ${system} pré-carregados`);
    }
    
    getSystemInfo(system) {
        const info = {
            name: system,
            backgroundTracks: this.soundLibrary[system]?.background?.length || 0,
            effects: this.soundLibrary[system]?.effects?.length || 0,
            availableMoods: []
        };
        
        // Determina humores disponíveis para este sistema
        const moods = new Set();
        this.soundLibrary[system]?.background?.forEach(track => {
            if (track.mood) moods.add(track.mood);
        });
        
        info.availableMoods = Array.from(moods);
        return info;
    }
    
    getAudioStatistics() {
        return {
            totalSoundsLoaded: this.soundBank.size,
            currentVolume: this.volume,
            isMuted: this.isMuted,
            isPlaying: this.isPlaying,
            currentTrack: this.currentTrack,
            currentSystem: this.currentSystem,
            currentMood: this.currentMood,
            activeEffects: this.audioSources.size,
            queuedEffects: this.effectQueue.length,
            activeSoundscapes: Array.from(this.dynamicSoundscapes.values())
                .filter(s => s.isActive).length,
            audioContextState: this.audioContext ? this.audioContext.state : 'not_available'
        };
    }
    
    // Métodos de depuração
    debugLog() {
        const stats = this.getAudioStatistics();
        console.group('🎵 Sistema de Áudio - Status Detalhado');
        console.table(stats);
        
        console.group('🎵 Trilha Atual');
        console.log(this.currentTrack);
        console.groupEnd();
        
        console.group('🎵 Efeitos Ativos');
        this.audioSources.forEach((source, key) => {
            console.log(`🔊 ${source.effect?.name || 'Desconhecido'}`, source);
        });
        console.groupEnd();
        
        console.group('🎵 Soundscapes Dinâmicos');
        this.dynamicSoundscapes.forEach((soundscape, id) => {
            console.log(`🎚️ ${soundscape.name} (${id})`, soundscape);
        });
        console.groupEnd();
        
        console.groupEnd();
    }
    
    // Métodos de limpeza
    cleanup() {
        // Para todos os sons
        this.stopBackgroundMusic(0);
        
        // Limpa efeitos
        this.audioSources.forEach(source => {
            this.stopSoundEffect(source);
        });
        this.audioSources.clear();
        
        // Limpa soundscapes
        this.dynamicSoundscapes.forEach(soundscape => {
            this.deactivateSoundscape(soundscape.id, 0);
        });
        this.dynamicSoundscapes.clear();
        
        // Limpa fila
        this.effectQueue = [];
        
        // Limpa cena atual
        this.currentScene = null;
        
        // Limpa contexto de áudio
        if (this.audioContext && this.audioContext.state !== 'closed') {
            this.audioContext.close();
        }
        
        console.log('✅ Sistema de áudio limpo');
    }
    
    // Método para destruir completamente o sistema
    destroy() {
        this.cleanup();
        
        // Remove controles da UI
        const controls = document.getElementById('audio-controls');
        if (controls) {
            controls.remove();
        }
        
        // Remove event listeners do teclado
        if (this.keyboardHandler) {
            document.removeEventListener('keydown', this.keyboardHandler);
        }
        
        // Limpa referências
        this.soundBank.clear();
        this.soundLibrary = null;
        
        console.log('🗑️ Sistema de áudio destruído');
    }
    
    // Métodos de exportação/importação
    exportScene() {
        if (!this.currentScene) return null;
        
        return {
            scene: this.currentScene,
            background: this.currentTrack,
            system: this.currentSystem,
            mood: this.currentMood,
            volume: this.volume,
            timestamp: new Date().toISOString()
        };
    }
    
    importScene(sceneData) {
        if (!sceneData) return false;
        
        this.createAudioScene(sceneData.scene);
        
        if (sceneData.volume) {
            this.setVolume(sceneData.volume);
        }
        
        return true;
    }
    
    // Event listeners
    addEventListener(eventName, callback) {
        document.addEventListener(`audio:${eventName}`, callback);
    }
    
    removeEventListener(eventName, callback) {
        document.removeEventListener(`audio:${eventName}`, callback);
    }
    
    // Verifica se o sistema está inicializado
    isInitialized() {
        return !!(this.audioContext || this.soundBank.size > 0);
    }
    
    // Inicialização automática
    static async create(options = {}) {
        const system = new RPGAmbienceSystem(options);
        
        // Aguarda inicialização completa
        await new Promise((resolve, reject) => {
            let attempts = 0;
            const maxAttempts = 50; // 5 segundos
            
            const checkInit = () => {
                attempts++;
                if (system.isInitialized()) {
                    resolve(system);
                } else if (attempts >= maxAttempts) {
                    reject(new Error('Falha ao inicializar sistema de áudio'));
                } else {
                    setTimeout(checkInit, 100);
                }
            };
            
            checkInit();
        });
        
        return system;
    }
}

// Extensões e utilitários adicionais
RPGAmbienceSystem.Effects = {
    // Efeitos predefinidos
    DICE_ROLL: 'dice_roll',
    HEARTBEAT: 'heartbeat',
    WOLF_HOWL: 'wolf_howl',
    SPELL_CAST: 'spell_cast',
    THUNDER: 'thunder',
    RAIN: 'rain',
    WIND: 'wind',
    CROWD: 'crowd',
    DOOR_OPEN: 'door_open',
    SWORD_CLASH: 'sword_clash'
};

RPGAmbienceSystem.Moods = {
    COMBAT: 'combat',
    MYSTERY: 'mystery',
    SOCIAL: 'social',
    CALM: 'calm',
    TENSE: 'tense',
    EPIC: 'epic',
    GOTHIC: 'gothic',
    PRIMAL: 'primal',
    MYSTICAL: 'mystical',
    DEFAULT: 'default'
};

RPGAmbienceSystem.Systems = {
    VAMPIRE: 'vampire',
    WEREWOLF: 'werewolf',
    MAGE: 'mage'
};

// Plugin system
RPGAmbienceSystem.plugins = new Map();

RPGAmbienceSystem.registerPlugin = function(name, plugin) {
    if (typeof plugin !== 'object' || plugin === null) {
        throw new Error('Plugin deve ser um objeto');
    }
    
    if (typeof plugin.install !== 'function') {
        throw new Error('Plugin deve ter um método install');
    }
    
    this.plugins.set(name, plugin);
    console.log(`Plugin "${name}" registrado`);
};

RPGAmbienceSystem.loadPlugin = async function(name, system) {
    const plugin = this.plugins.get(name);
    if (!plugin) {
        console.warn(`Plugin não encontrado: ${name}`);
        return false;
    }
    
    try {
        await plugin.install(system);
        console.log(`Plugin "${name}" carregado com sucesso`);
        return true;
    } catch (error) {
        console.error(`Erro ao carregar plugin "${name}":`, error);
        return false;
    }
};

// Exportação para diferentes ambientes
if (typeof module !== 'undefined' && module.exports) {
    // Node.js/CommonJS
    module.exports = RPGAmbienceSystem;
} else if (typeof define === 'function' && define.amd) {
    // AMD
    define([], () => RPGAmbienceSystem);
} else {
    // Navegador
    window.RPGAmbienceSystem = RPGAmbienceSystem;
}

// Plugin de exemplo
const ExampleAudioPlugin = {
    name: 'example-plugin',
    version: '1.0.0',
    
    install: async function(system) {
        // Adiciona novos sons
        system.soundLibrary.example = {
            background: [
                { id: 'example_epic', name: 'Música Épica de Exemplo', url: '/assets/audio/example/epic.mp3', mood: 'epic' }
            ],
            effects: [
                { id: 'example_magic', name: 'Magia de Exemplo', url: '/assets/audio/example/magic.mp3' }
            ]
        };
        
        // Adiciona métodos personalizados
        system.playExampleSound = function() {
            return this.playSoundEffect('example_magic');
        };
        
        system.getExampleInfo = function() {
            return {
                name: 'Example Plugin',
                version: '1.0.0',
                soundsCount: 2
            };
        };
        
        console.log('✅ Plugin de exemplo carregado');
    }
};

// Registra o plugin de exemplo
RPGAmbienceSystem.registerPlugin('example', ExampleAudioPlugin);

// Inicialização automática se configurado
document.addEventListener('DOMContentLoaded', () => {
    const autoInit = document.querySelector('[data-audio-init]');
    if (autoInit) {
        try {
            const options = JSON.parse(autoInit.getAttribute('data-audio-options') || '{}');
            window.rpgAudioSystem = new RPGAmbienceSystem(options);
            console.log('✅ Sistema de áudio inicializado automaticamente');
        } catch (error) {
            console.error('❌ Erro ao inicializar sistema de áudio automaticamente:', error);
        }
    }
});

// Adiciona evento para interação do usuário (necessário para autoplay em alguns navegadores)
document.addEventListener('click', function initAudioOnInteraction() {
    if (window.rpgAudioSystem && window.rpgAudioSystem.pendingAudio) {
        window.rpgAudioSystem.pendingAudio.play().then(() => {
            console.log('Áudio iniciado após interação do usuário');
        }).catch(e => {
            console.warn('Falha ao iniciar áudio após interação:', e);
        });
        window.rpgAudioSystem.pendingAudio = null;
    }
    
    // Remove o listener após primeira interação
    document.removeEventListener('click', initAudioOnInteraction);
}, { once: true });