// ai-narrator.js - Sistema de Narração com IA

class RPG_AI_Narrator {
    constructor(system = 'vampire', style = 'gothic') {
        this.system = system;
        this.style = style;
        this.context = [];
        this.players = [];
        this.memory = new Map();
        this.isEnabled = false;
        this.apiKey = null;
        
        this.systemPrompts = {
            vampire: {
                gothic: `Você é o narrador de Vampiro: A Máscara. Seu estilo é gótico e dramático, com foco em horror pessoal, intrigas políticas vampíricas, sedução e traição. Descreva cenas com tons sombrios, metáforas de sangue e noite, e um senso de decadência urbana.`,
                neutral: `Você é o narrador de Vampiro: A Máscara. Seu estilo é neutro e descritivo, focando nos fatos da cena, regras do jogo e consequências lógicas das ações dos jogadores.`,
                humorous: `Você é o narrador de Vampiro: A Máscara. Seu estilo é humorístico e irônico, trazendo leveza às situações sombrias. Use sarcasmo e referências pop-cultura apropriadas.`
            },
            werewolf: {
                primal: `Você é o narrador de Lobisomem: A Idade das Trevas. Seu estilo é visceral e primal, com foco em fúria, instinto, espiritualidade e a batalha contra a Wyrm. Descreva com intensidade física e conexão com a natureza.`,
                epic: `Você é o narrador de Lobisomem: A Idade das Trevas. Seu estilo é épico e mitológico, tratando cada cena como parte de uma saga ancestral. Use linguagem grandiosa e referências mitológicas.`
            },
            mage: {
                mystical: `Você é o narrador de Mago: A Ascensão. Seu estilo é filosófico e místico, explorando a natureza da realidade, paradoxos e a busca por iluminação. Use linguagem poética e conceitos abstratos.`,
                conspiratorial: `Você é o narrador de Mago: A Ascensão. Seu estilo é conspiratório e paranoico, revelando camadas de segredos e manipulação por trás da realidade aparente.`
            }
        };
        
        this.init();
    }
    
    async init() {
        // Tenta carregar API key do localStorage
        this.apiKey = localStorage.getItem('deepseek_api_key');
        
        if (this.apiKey) {
            this.isEnabled = true;
            console.log('IA Narradora inicializada com sucesso');
        } else {
            console.log('IA Narradora em modo demo - API key não configurada');
        }
        
        // Carrega memória salva
        this.loadMemory();
    }
    
    async generateNarration(prompt, options = {}) {
        if (!this.isEnabled && !options.forceDemo) {
            return this.getFallbackResponse();
        }
        
        const systemPrompt = this.getSystemPrompt();
        const playerContext = this.getPlayerContext();
        const sceneMemory = this.getSceneMemory();
        
        const fullPrompt = `
${systemPrompt}

${playerContext}

${sceneMemory}

Histórico recente (últimas 5 interações):
${this.context.slice(-5).map(c => `${c.role}: ${c.content}`).join('\n')}

Ação atual do jogador: ${prompt}

Instruções:
1. Responda como narrador, descrevendo consequências e desenvolvendo a cena
2. Mantenha a consistência com o sistema ${this.system} e estilo ${this.style}
3. Inclua detalhes sensoriais (visuais, sonoros, olfativos)
4. Se apropriado, faça uma pergunta para engajar os jogadores
5. Limite a resposta a 3-4 parágrafos
6. Se a ação exigir rolagem de dados, indique qual teste seria necessário

Narração:
        `.trim();
        
        try {
            if (this.apiKey && this.isEnabled) {
                return await this.callDeepSeekAPI(fullPrompt);
            } else {
                return await this.generateDemoResponse(prompt);
            }
        } catch (error) {
            console.error('Erro na geração de narração:', error);
            return this.getFallbackResponse();
        }
    }
    
    async callDeepSeekAPI(prompt) {
        try {
            const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'deepseek-chat',
                    messages: [
                        { role: 'system', content: 'Você é um narrador experiente de RPG de mesa.' },
                        { role: 'user', content: prompt }
                    ],
                    temperature: 0.8,
                    max_tokens: 800,
                    top_p: 0.9
                })
            });
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            
            const data = await response.json();
            const narration = data.choices[0].message.content;
            
            // Salva no contexto
            this.saveToContext(prompt, narration);
            this.updateMemory(narration);
            
            return narration;
            
        } catch (error) {
            console.error('Erro na API DeepSeek:', error);
            throw error;
        }
    }
    
    async generateDemoResponse(prompt) {
        // Respostas pré-definidas para modo demo
        const demoResponses = {
            vampire: {
                gothic: [
                    `A noite envolve a cena como um manto de veludo negro. ${prompt.toLowerCase()} - suas palavras ecoam nas paredes úmidas do lugar, despertando atenção indesejada. Nas sombras, algo se move. O cheiro de sangue envelhecido se intensifica. O que mais você percebe neste momento?`,
                    `Seus sentidos vampíricos captam cada detalhe. ${prompt.toLowerCase()} Cada movimento seu é observado por olhos invisíveis. O ar fica pesado com presságios. Como seus instintos reagem a esta atmosfera carregada?`
                ],
                neutral: [
                    `Você realiza a ação: ${prompt}. As consequências imediatas são... Considere fazer um teste de Percepção + Prontidão para notar detalhes adicionais.`
                ]
            },
            werewolf: {
                primal: [
                    `Gaia sussurra através das folhas. ${prompt.toLowerCase()} - sua ação desperta os espíritos da floresta. O cheiro de Wyrm está no ar, distante mas presente. Suas garras coçam ante a promessa de caça. O que sua forma Lupus sente?`
                ]
            }
        };
        
        const responses = demoResponses[this.system]?.[this.style] || demoResponses.vampire.gothic;
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        // Adiciona dados aleatórios
        const diceRoll = Math.floor(Math.random() * 10) + 1;
        const success = diceRoll >= 6;
        
        const enhancedResponse = `${randomResponse}

🎲 **Teste Sugerido:** Dificuldade 6
📊 **Rolagem de Exemplo:** D10 = ${diceRoll} ${success ? '✅ Sucesso!' : '❌ Falha'}

${success ? 'Sua ação tem o efeito desejado.' : 'Algo interfere em seus planos...'}`;
        
        this.saveToContext(prompt, enhancedResponse);
        
        return enhancedResponse;
    }
    
    getSystemPrompt() {
        return this.systemPrompts[this.system]?.[this.style] || 
               this.systemPrompts.vampire.gothic;
    }
    
    getPlayerContext() {
        if (this.players.length === 0) return '';
        
        return `Jogadores na cena:
${this.players.map(p => `- ${p.name} (${p.clan || p.tribe || p.tradition}): ${p.description || 'Sem descrição'}`).join('\n')}`;
    }
    
    getSceneMemory() {
        if (this.memory.size === 0) return '';
        
        let memoryText = 'Memória da cena:\n';
        for (let [key, value] of this.memory) {
            memoryText += `- ${key}: ${value}\n`;
        }
        
        return memoryText;
    }
    
    saveToContext(prompt, response) {
        this.context.push(
            { role: 'user', content: prompt },
            { role: 'assistant', content: response }
        );
        
        // Limita contexto aos últimos 20 trocas
        if (this.context.length > 40) {
            this.context = this.context.slice(-40);
        }
        
        this.saveContext();
    }
    
    updateMemory(narration) {
        // Extrai informações importantes da narração
        const importantInfo = this.extractImportantInfo(narration);
        
        importantInfo.forEach(info => {
            this.memory.set(info.key, info.value);
        });
        
        this.saveMemory();
    }
    
    extractImportantInfo(text) {
        const info = [];
        
        // Procura por nomes de NPCs
        const npcMatches = text.match(/([A-Z][a-z]+(?: [A-Z][a-z]+)?)(?=, o|, a| diz| responde| observa)/g);
        if (npcMatches) {
            npcMatches.forEach(npc => {
                info.push({ key: `NPC: ${npc}`, value: 'Presente na cena' });
            });
        }
        
        // Procura por locais
        const locationMatches = text.match(/(na|no|em) ([A-Z][a-z]+(?: [A-Z][a-z]+)*)/g);
        if (locationMatches) {
            locationMatches.forEach(loc => {
                info.push({ key: 'Localização', value: loc });
            });
        }
        
        // Procura por objetos importantes
        if (text.includes('chave') || text.includes('documento') || text.includes('arte fato')) {
            info.push({ key: 'Objeto Importante', value: 'Mencionado na cena' });
        }
        
        return info;
    }
    
    getFallbackResponse() {
        const fallbacks = [
            "A cena se desenrola diante de vocês. O que fazem a seguir?",
            "Seus atos ecoam no silêncio que se segue. Algo está prestes a acontecer.",
            "O destino aguarda sua próxima decisão. Como procedem?",
            "Nas sombras, segredos aguardam para serem revelados. Suas ações os trarão à luz?"
        ];
        
        return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }
    
    saveContext() {
        try {
            localStorage.setItem('ai_narrator_context', JSON.stringify(this.context));
        } catch (e) {
            console.warn('Não foi possível salvar contexto:', e);
        }
    }
    
    loadContext() {
        try {
            const saved = localStorage.getItem('ai_narrator_context');
            if (saved) {
                this.context = JSON.parse(saved);
            }
        } catch (e) {
            console.warn('Não foi possível carregar contexto:', e);
        }
    }
    
    saveMemory() {
        try {
            const memoryObj = Object.fromEntries(this.memory);
            localStorage.setItem('ai_narrator_memory', JSON.stringify(memoryObj));
        } catch (e) {
            console.warn('Não foi possível salvar memória:', e);
        }
    }
    
    loadMemory() {
        try {
            const saved = localStorage.getItem('ai_narrator_memory');
            if (saved) {
                const memoryObj = JSON.parse(saved);
                this.memory = new Map(Object.entries(memoryObj));
            }
        } catch (e) {
            console.warn('Não foi possível carregar memória:', e);
        }
    }
    
    clearContext() {
        this.context = [];
        localStorage.removeItem('ai_narrator_context');
    }
    
    clearMemory() {
        this.memory.clear();
        localStorage.removeItem('ai_narrator_memory');
    }
    
    setAPIKey(key) {
        this.apiKey = key;
        this.isEnabled = true;
        localStorage.setItem('deepseek_api_key', key);
    }
    
    removeAPIKey() {
        this.apiKey = null;
        this.isEnabled = false;
        localStorage.removeItem('deepseek_api_key');
    }
    
    // Métodos para integração com a sala
    setupForSession(sessionData) {
        this.system = sessionData.system || 'vampire';
        this.style = sessionData.aiStyle || 'gothic';
        this.players = sessionData.players || [];
        
        // Limpa contexto antigo se for uma nova sessão
        if (sessionData.isNewSession) {
            this.clearContext();
            this.clearMemory();
        }
        
        console.log(`IA configurada para: ${this.system} - ${this.style}`);
    }
    
    async processPlayerAction(playerName, action, characterInfo = null) {
        const prompt = `${playerName} ${action}`;
        
        if (characterInfo) {
            // Atualiza informações do jogador
            const playerIndex = this.players.findIndex(p => p.name === playerName);
            if (playerIndex !== -1) {
                this.players[playerIndex] = { ...this.players[playerIndex], ...characterInfo };
            }
        }
        
        return await this.generateNarration(prompt);
    }
    
    async generateSceneSetup(sceneDescription) {
        const prompt = `Configurar cena inicial: ${sceneDescription}`;
        return await this.generateNarration(prompt, { forceDemo: true });
    }
    
    async generateNPCResponse(npcName, playerAction) {
        const prompt = `${npcName} responde a: ${playerAction}`;
        return await this.generateNarration(prompt);
    }
    
    // Sistema de emoções e tom
    setTone(tone) {
        const tones = {
            tense: 'A tensão está alta. Use linguagem urgente e descrições detalhadas de perigo iminente.',
            calm: 'O momento é calmo. Use linguagem suave e descrições relaxantes.',
            mysterious: 'Há mistério no ar. Use linguagem ambígua e sugestiva.',
            epic: 'Este é um momento épico. Use linguagem grandiosa e descrições impressionantes.',
            intimate: 'Este é um momento pessoal. Use linguagem próxima e focada em emoções.'
        };
        
        if (tones[tone]) {
            // Adiciona instrução de tom ao contexto
            this.context.push({
                role: 'system',
                content: `Tom atual da cena: ${tones[tone]}`
            });
        }
    }
    
    // Geração de descrições ambientais
    async generateAmbienceDescription() {
        const ambiencePrompts = {
            vampire: [
                "Descreva uma noite chuvosa em uma cidade gótica",
                "Descreva o interior de uma mansão vampírica abandonada",
                "Descreva um beco escuro onde vampiros se encontram"
            ],
            werewolf: [
                "Descreva uma floresta à noite, sob a lua cheia",
                "Descreva um local de caça urbano dos Garou",
                "Descreva um caern, o local sagrado dos lobisomens"
            ],
            mage: [
                "Descreva um laboratório alquímico moderno",
                "Descreva um nodo de Quintessência",
                "Descreva um local onde a realidade é fina"
            ]
        };
        
        const prompts = ambiencePrompts[this.system] || ambiencePrompts.vampire;
        const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
        
        return await this.generateNarration(randomPrompt, { forceDemo: true });
    }
}

// Exporta para uso global
window.RPG_AI_Narrator = RPG_AI_Narrator;

// Instância global
window.aiNarrator = new RPG_AI_Narrator();

// Funções de utilidade para a interface
function setupAINarratorForRoom(roomData) {
    if (window.aiNarrator) {
        window.aiNarrator.setupForSession(roomData);
        return true;
    }
    return false;
}

async function getAINarration(action) {
    if (window.aiNarrator) {
        try {
            const narration = await window.aiNarrator.generateNarration(action);
            return narration;
        } catch (error) {
            console.error('Falha ao obter narração IA:', error);
            return "A narração IA está temporariamente indisponível. Continue com a cena.";
        }
    }
    return "Sistema IA não disponível.";
}

function configureAI(apiKey, system, style) {
    if (window.aiNarrator) {
        if (apiKey) {
            window.aiNarrator.setAPIKey(apiKey);
        }
        
        window.aiNarrator.system = system || 'vampire';
        window.aiNarrator.style = style || 'gothic';
        
        return true;
    }
    return false;
}