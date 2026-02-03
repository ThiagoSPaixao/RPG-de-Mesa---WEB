/* ============================================
   HOME.JS - lógica do portal
   ============================================ */

(function () {
    const registry = window.RPG?.registry;

    // ============================================
    // NAVEGAÇÃO POR SISTEMA
    // ============================================

    function goToSystem(systemId) {
        if (!registry || !registry.systems[systemId]) {
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

    // Expor atalhos globais usados no HTML
    window.goToVampirePage = () => goToSystem('vampire');
    window.goToWerewolfPage = () => goToSystem('werewolf');

    window.navigateToRPG = function (systemId) {
        goToSystem(systemId);
    };

    // ============================================
    // SLIDESHOW
    // ============================================

    function initSlideshow() {
        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.dot');
        const prevBtn = document.querySelector('.slide-prev');
        const nextBtn = document.querySelector('.slide-next');

        if (!slides.length) return;

        let currentSlide = 0;

        function showSlide(index) {
            slides.forEach(s => s.classList.remove('active'));
            dots.forEach(d => d.classList.remove('active'));

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

        dots.forEach((dot, i) =>
            dot.addEventListener('click', () => showSlide(i))
        );
    }

    // ============================================
    // IA DEMO
    // ============================================

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

        response.textContent =
            `(${system.toUpperCase()} - ${style}) Ação recebida: "${input.value}"`;

        input.value = '';
    };

    // ============================================
    // MODAL
    // ============================================

    window.openCustomSystemModal = () =>
        document.getElementById('customSystemModal').style.display = 'flex';

    window.closeCustomSystemModal = () =>
        document.getElementById('customSystemModal').style.display = 'none';

    // ============================================
    // INIT
    // ============================================

    document.addEventListener('DOMContentLoaded', function () {
        initSlideshow();
    });
})();