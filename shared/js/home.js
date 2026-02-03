/* ============================================
   HOME.JS - lógica do portal
   (antes estava inline no index.html)
   ============================================ */

(function () {
    // ============================================
    // NAVEGAÇÃO PARA RPG ESPECÍFICOS
    // ============================================

    window.goToVampirePage = function () {
        window.location.href = 'vampire.html';
    };

    window.goToWerewolfPage = function () {
        window.location.href = 'werewolf.html';
    };

    window.goToVampireAIPage = function () {
        alert('Página de IA Vampírica Avançada em desenvolvimento! Em breve...');
    };

    window.goToWerewolfAIPage = function () {
        alert('Página de IA Garou Avançada em desenvolvimento! Em breve...');
    };

    window.navigateToRPG = function (rpg) {
        const messages = {
            mage: 'Mago: A Ascensão será implementado em breve!',
            tormenta: 'Tormenta será implementado em breve!',
            dnd: 'D&D 5E será implementado em breve!'
        };
        alert(messages[rpg] || 'Sistema em desenvolvimento!');
    };

    // ============================================
    // SLIDESHOW
    // ============================================

    function initSlideshow() {
        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.dot');
        const prevBtn = document.querySelector('.slide-prev');
        const nextBtn = document.querySelector('.slide-next');

        if (!slides.length || !dots.length) return;

        let currentSlide = 0;

        function showSlide(index) {
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));

            slides[index].classList.add('active');
            dots[index].classList.add('active');
            currentSlide = index;
        }

        // Auto-play
        setInterval(() => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }, 5000);

        // Controls
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentSlide = (currentSlide - 1 + slides.length) % slides.length;
                showSlide(currentSlide);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentSlide = (currentSlide + 1) % slides.length;
                showSlide(currentSlide);
            });
        }

        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => showSlide(index));
        });
    }

    // ============================================
    // NAVEGAÇÃO GERAL
    // ============================================

    window.navigateTo = function (page) {
        if (page === 'create-session') {
            window.location.href = 'create-session.html';
            return;
        }
        if (page === 'find-session') {
            alert('Sistema de busca de sessões em desenvolvimento!');
            return;
        }
    };

    window.viewAllSessions = function () {
        alert('Lista completa de sessões em desenvolvimento!');
    };

    // ============================================
    // IA DEMO
    // ============================================

    window.tryAIDemo = function () {
        const section = document.getElementById('ai-demo');
        if (section) section.scrollIntoView({ behavior: 'smooth' });
    };

    window.startAIDemo = function () {
        alert('Demo IA iniciada! (Simulação)');
    };

    window.sendToAI = function () {
        const input = document.getElementById('player-input');
        const response = document.getElementById('ai-response');
        const systemSelect = document.getElementById('ai-system');
        const styleSelect = document.getElementById('ai-style');

        if (!input || !response || !systemSelect || !styleSelect) return;

        if (input.value.trim() === '') return;

        const system = systemSelect.value;
        const style = styleSelect.value;

        response.textContent = `(${system.toUpperCase()} - ${style}) Ação recebida: "${input.value}". A IA responderá aqui...`;
        input.value = '';
    };

    // ============================================
    // MODAL SISTEMA PERSONALIZADO
    // ============================================

    window.openCustomSystemModal = function () {
        const modal = document.getElementById('customSystemModal');
        if (modal) modal.style.display = 'flex';
    };

    window.closeCustomSystemModal = function () {
        const modal = document.getElementById('customSystemModal');
        if (modal) modal.style.display = 'none';
    };

    // ============================================
    // NOTIFICAÇÕES
    // ============================================

    window.showNotification = function (message, type = 'info') {
        const container = document.getElementById('notificationsContainer');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        container.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 3000);
        }, 3000);
    };

    // ============================================
    // FUNÇÕES DA COMUNIDADE
    // ============================================

    window.viewEvents = function () {
        alert('Abrindo eventos.');
    };

    window.viewWorkshops = function () {
        alert('Abrindo workshops.');
    };

    window.viewRankings = function () {
        alert('Abrindo rankings.');
    };

    window.viewMarket = function () {
        alert('Abrindo mercado.');
    };

    // ============================================
    // Sessões específicas (placeholders atuais)
    // ============================================

    window.joinVampireSession = function (id) {
        alert(`Entrando na sessão de Vampiro #${id} (em desenvolvimento)`);
    };

    window.spectateVampireSession = function (id) {
        alert(`Assistindo a sessão de Vampiro #${id} (em desenvolvimento)`);
    };

    window.joinWerewolfSession = function (id) {
        alert(`Entrando na sessão de Lobisomem #${id} (em desenvolvimento)`);
    };

    window.spectateWerewolfSession = function (id) {
        alert(`Assistindo a sessão de Lobisomem #${id} (em desenvolvimento)`);
    };

    window.joinSession = function (id) {
        alert(`Entrando na sessão #${id} (em desenvolvimento)`);
    };

    window.spectateSession = function (id) {
        alert(`Assistindo a sessão #${id} (em desenvolvimento)`);
    };

    // ============================================
    // DETECÇÃO DE CLIQUE EM ELEMENTOS (delegação)
    // ============================================

    function initClickDelegation() {
        document.addEventListener('click', function (e) {
            // Badge Vampiro
            if (e.target.closest('.vampire-badge')) {
                e.preventDefault();
                window.goToVampirePage();
                return;
            }

            // Badge Lobisomem
            if (e.target.closest('.werewolf-badge')) {
                e.preventDefault();
                window.goToWerewolfPage();
                return;
            }

            // Tags relacionadas a Vampiro
            const tagEl = e.target.closest('.tag');
            if (tagEl && tagEl.textContent.includes('Vamp')) {
                e.preventDefault();
                window.goToVampirePage();
                return;
            }

            // Tags relacionadas a Lobisomem / Garou / Tribo
            if (tagEl && (tagEl.textContent.includes('Lobis') || tagEl.textContent.includes('Garou') || tagEl.textContent.includes('Tribo'))) {
                e.preventDefault();
                window.goToWerewolfPage();
                return;
            }
        });
    }

    // ============================================
    // INIT
    // ============================================

    document.addEventListener('DOMContentLoaded', function () {
        initSlideshow();
        initClickDelegation();
    });
})();
