/* ============================================
   REGISTRY.JS
   Fonte única da verdade da plataforma
   ============================================ */

window.RPG = window.RPG || {};

window.RPG.registry = {
    systems: {
        vampire: {
            id: 'vampire',
            name: 'Vampiro: A Máscara',
            dice: 'd10',
            theme: 'vampire',
            icon: 'fas fa-bat',
            color: '#8B0000',
            page: 'vampire.html',
            tags: ['Horror Pessoal', 'Drama Político', 'Mundo das Trevas'],
            enabled: true
        },

        werewolf: {
            id: 'werewolf',
            name: 'Lobisomem: Idade das Trevas',
            dice: 'd10',
            theme: 'werewolf',
            icon: 'fas fa-paw',
            color: '#8B4513',
            page: 'werewolf.html',
            tags: ['Tribal', 'Ecologia', 'Combate'],
            enabled: true
        },

        mage: {
            id: 'mage',
            name: 'Mago: A Ascensão',
            dice: 'd10',
            theme: 'mage',
            icon: 'fas fa-hat-wizard',
            color: '#4B0082',
            page: null,
            tags: ['Magia', 'Filosofia', 'Paradoxo'],
            enabled: false
        },

        tormenta: {
            id: 'tormenta',
            name: 'Tormenta',
            dice: 'd20',
            theme: 'fantasy',
            icon: 'fas fa-scroll',
            color: '#B22222',
            page: null,
            tags: ['Fantasia Épica', 'Arton'],
            enabled: false
        },

        dnd: {
            id: 'dnd',
            name: 'Dungeons & Dragons 5E',
            dice: 'd20',
            theme: 'fantasy',
            icon: 'fas fa-dragon',
            color: '#7B0000',
            page: null,
            tags: ['Fantasia Medieval', 'Classes'],
            enabled: false
        }
    },

    modes: {
        fantasy: {
            id: 'fantasy',
            name: 'Fantasia',
            description: 'Aventuras épicas e mundos mágicos'
        },
        horror: {
            id: 'horror',
            name: 'Terror',
            description: 'Medo, tensão e sobrevivência'
        },
        romance: {
            id: 'romance',
            name: 'Romance',
            description: 'Relações, drama e emoção'
        },
        scifi: {
            id: 'scifi',
            name: 'Ficção Científica',
            description: 'Tecnologia, futuro e exploração'
        }
    }
};
