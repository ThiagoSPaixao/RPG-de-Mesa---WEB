// Dados específicos para Vampiro: A Máscara
const vampireData = {
    clans: {
        ventrue: {
            name: "Ventrue",
            nicknames: ["Os Reis", "Os Azuis-Sangue"],
            disciplines: ["Dominate", "Fortitude", "Presence"],
            bane: "Só podem se alimentar de um tipo específico de presa",
            compulsion: "Arrogância",
            description: "Líderes natos e aristocratas da sociedade vampírica."
        },
        // ... outros clãs
    },
    
    disciplines: {
        dominate: {
            name: "Dominate",
            levels: {
                1: "Comando",
                2: "Esquecer",
                3: "Possessão",
                4: "Mass Hypnosis",
                5: "Terminal Decree"
            },
            description: "Controle mental direto sobre vítimas"
        },
        // ... outras disciplinas
    },
    
    cities: {
        "sao-paulo": {
            name: "São Paulo",
            prince: "Eduardo Ventrue",
            population: "~200 vampiros",
            factions: {
                camarilla: "Forte",
                anarch: "Moderado",
                sabbat: "Fraco"
            },
            districts: {
                "Jardins": "Domínio Ventrue",
                "Centro": "Elisio",
                "Liberdade": "Tremere Chantry"
            }
        }
    },
    
    // Geradores
    generateNPC: function(clan = null) {
        const clans = clan ? [clan] : Object.keys(this.clans);
        const randomClan = clans[Math.floor(Math.random() * clans.length)];
        const clanData = this.clans[randomClan];
        
        return {
            name: `NPC ${Math.floor(Math.random() * 1000)}`,
            clan: randomClan,
            generation: Math.floor(Math.random() * 3) + 10,
            humanity: Math.floor(Math.random() * 4) + 4,
            disciplines: this.getRandomDisciplines(randomClan, 2),
            title: this.getRandomTitle(randomClan),
            description: this.getRandomDescription(randomClan)
        };
    },
    
    getRandomDisciplines: function(clan, count = 2) {
        const clanDisciplines = this.clans[clan]?.disciplines || [];
        const shuffled = [...clanDisciplines].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    },
    
    getRandomTitle: function(clan) {
        const titles = {
            ventrue: ["Príncipe", "Primogênito", "Alastor", "Harpi"],
            brujah: ["Barão", "Radical", "Filósofo", "Revolucionário"],
            toreador: ["Artista", "Crítico", "Mecenas", "Degenerado"],
            tremere: ["Regente", "Adepto", "Pesquisador", "Arquimago"],
            nosferatu: ["Informante", "Espião", "Arquivista", "Morcego"],
            gangrel: ["Rastreador", "Sobrevivente", "Caçador", "Bestial"],
            malkavian: ["Vidente", "Oráculo", "Tolo Sábio", "Cassandra"]
        };
        
        const clanTitles = titles[clan] || ["Vampiro"];
        return clanTitles[Math.floor(Math.random() * clanTitles.length)];
    }
};

// Exporta para uso global
window.vampireData = vampireData;