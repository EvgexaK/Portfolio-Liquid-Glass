/**
 * Loader Logic
 * Handles fade-out of the AI Loader
 */

(function initLoader() {
    const loaderOverlay = document.getElementById('loader-overlay');
    if (!loaderOverlay) return;

    // Minimum display time for the animation (2 seconds)
    const minDisplayTime = 2000;
    const startTime = performance.now();

    window.addEventListener('load', () => {
        const elapsed = performance.now() - startTime;
        const remaining = Math.max(0, minDisplayTime - elapsed);

        setTimeout(() => {
            // Fade out
            loaderOverlay.style.opacity = '0';
            loaderOverlay.style.pointerEvents = 'none';

            // Remove from DOM after transition
            setTimeout(() => {
                loaderOverlay.style.display = 'none';
            }, 1200); // Match CSS transition duration
        }, remaining);
    });
})();
