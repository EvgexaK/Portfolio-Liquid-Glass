(function initLoader() {
    const loaderOverlay = document.getElementById('loader-overlay');
    if (!loaderOverlay) return;

    // Minimum time the loader is visible (ms)
    const MIN_DISPLAY = 1800;
    const startTime = Date.now();

    function triggerTransition() {
        loaderOverlay.classList.add('loaded');

        setTimeout(() => {
            document.body.classList.remove('loading-mode');
        }, 1200);

        setTimeout(() => {
            document.body.classList.remove('nav-hidden');
        }, 2000);

        setTimeout(() => {
            loaderOverlay.style.display = 'none';
        }, 1600);
    }

    function onReady() {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, MIN_DISPLAY - elapsed);
        setTimeout(triggerTransition, remaining);
    }

    // Always wait for load event even if already complete,
    // to give the loader time to be visible
    if (document.readyState === 'complete') {
        // Page already loaded (cached / instant), still show loader
        setTimeout(triggerTransition, MIN_DISPLAY);
    } else {
        window.addEventListener('load', onReady);
    }
})();
