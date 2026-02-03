    /* ============================================
    HOME.JS - portal (cliques, slideshow, menu mobile)
    ============================================ */

    (function () {
    const registry = window.RPG?.registry;

    // =========================
    // Navegação por sistema
    // =========================
    function goToSystem(systemId) {
        if (!registry || !registry.systems || !registry.systems[systemId]) {
        alert('Sistema não encontrado.');
        return;
        }

        const system = registry.systems[systemId];

        if (!system.enabled || !system.page) {
        alert(`${system.name} será implementado em breve!`);
        return;
        }

        window.location.href = system.page;
    }

    // Mantém compatibilidade com onclicks antigos (se existirem)
    window.goToVampirePage = () => goToSystem('vampire');
    window.goToWerewolfPage = () => goToSystem('werewolf');
    window.navigateToRPG = (id) => goToSystem(id);

    // =========================
    // Delegação de clique (padronização)
    // =========================
    function initSystemLinkDelegation() {
        document.addEventListener('click', (e) => {
        const el = e.target.closest('.system-link[data-system]');
        if (!el) return;

        e.preventDefault();
        const systemId = el.getAttribute('data-system');
        goToSystem(systemId);
        });
    }

    // =========================
    // Slideshow
    // =========================
    function initSlideshow() {
        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.dot');
        const prevBtn = document.querySelector('.slide-prev');
        const nextBtn = document.querySelector('.slide-next');

        if (!slides.length) return;

        let currentSlide = 0;

        function showSlide(index) {
        slides.forEach((s) => s.classList.remove('active'));
        dots.forEach((d) => d.classList.remove('active'));

        slides[index].classList.add('active');
        if (dots[index]) dots[index].classList.add('active');

        currentSlide = index;
        }

        setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
        }, 5000);

        prevBtn?.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
        });

        nextBtn?.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
        });

        dots.forEach((dot, i) => dot.addEventListener('click', () => showSlide(i)));
    }

    // =========================
    // Menu Mobile (funcionando)
    // =========================
    function initMobileMenu() {
        const btn = document.getElementById('mobileMenuBtn');
        const menu = document.getElementById('mainNavMenu');

        if (!btn || !menu) return;

        btn.addEventListener('click', () => {
        menu.classList.toggle('is-open');
        });

        // Fecha ao clicar em algum link do menu
        menu.addEventListener('click', (e) => {
        const isLink = e.target.closest('a');
        if (!isLink) return;
        menu.classList.remove('is-open');
        });

        // Fecha ao clicar fora
        document.addEventListener('click', (e) => {
        const clickedInsideMenu = e.target.closest('#mainNavMenu');
        const clickedButton = e.target.closest('#mobileMenuBtn');
        if (!clickedInsideMenu && !clickedButton) {
            menu.classList.remove('is-open');
        }
        });

        // Segurança: se redimensionar pra desktop, remove estado aberto
        window.addEventListener('resize', () => {
        if (window.innerWidth > 900) menu.classList.remove('is-open');
        });
    }

    // =========================
    // Navegação geral (mantido)
    // =========================
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

    // =========================
    // IA DEMO (mantido)
    // =========================
    window.tryAIDemo = function () {
        document.getElementById('ai-demo')?.scrollIntoView({ behavior: 'smooth' });
    };

    window.startAIDemo = function () {
        alert('Demo IA iniciada! (Simulação)');
    };

    window.sendToAI = function () {
        const input = document.getElementById('player-input');
        const response = document.getElementById('ai-response');
        const system = document.getElementById('ai-system')?.value;
        const style = document.getElementById('ai-style')?.value;

        if (!input || !response || !system || !style) return;
        if (!input.value.trim()) return;

        response.textContent = `(${system.toUpperCase()} - ${style}) Ação recebida: "${input.value}"`;
        input.value = '';
    };

    // =========================
    // Modal (mantido)
    // =========================
    window.openCustomSystemModal = function () {
        const modal = document.getElementById('customSystemModal');
        if (modal) modal.style.display = 'flex';
    };

    window.closeCustomSystemModal = function () {
        const modal = document.getElementById('customSystemModal');
        if (modal) modal.style.display = 'none';
    };

    // =========================
    // Placeholders de sessão (mantido)
    // =========================
    window.joinVampireSession = (id) => alert(`Entrando na sessão de Vampiro #${id} (em desenvolvimento)`);
    window.spectateVampireSession = (id) => alert(`Assistindo a sessão de Vampiro #${id} (em desenvolvimento)`);
    window.joinWerewolfSession = (id) => alert(`Entrando na sessão de Lobisomem #${id} (em desenvolvimento)`);
    window.spectateWerewolfSession = (id) => alert(`Assistindo a sessão de Lobisomem #${id} (em desenvolvimento)`);
    window.joinSession = (id) => alert(`Entrando na sessão #${id} (em desenvolvimento)`);
    window.spectateSession = (id) => alert(`Assistindo a sessão #${id} (em desenvolvimento)`);

    // =========================
    // Comunidade (mantido)
    // =========================
    window.viewEvents = () => alert('Abrindo eventos.');
    window.viewWorkshops = () => alert('Abrindo workshops.');
    window.viewRankings = () => alert('Abrindo rankings.');
    window.viewMarket = () => alert('Abrindo mercado.');

    // =========================
    // INIT
    // =========================
    document.addEventListener('DOMContentLoaded', function () {
        initSystemLinkDelegation();
        initSlideshow();
        initMobileMenu();
    });
    })();