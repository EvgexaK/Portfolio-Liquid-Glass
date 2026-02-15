/**
 * Neon Flow Loader
 * Simulates a cursor drawing a "Z" shape using threejs-components tubes
 */

(async function initLoader() {
    const canvas = document.getElementById('loader-canvas');
    const loaderOverlay = document.getElementById('loader-overlay');

    if (!canvas || !loaderOverlay) return;

    try {
        // Dynamic import from CDN
        // @ts-ignore
        const module = await import('https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js');
        const TubesCursor = module.default;

        // Initialize effect
        const app = TubesCursor(canvas, {
            tubes: {
                colors: ["#f967fb", "#53bc28", "#6958d5"], // Neon Pink, Green, Purple
                lights: {
                    intensity: 200,
                    colors: ["#83f36e", "#fe8a2e", "#ff008a", "#60aed5"]
                }
            }
        });

        // Simulate "Z" drawing
        // We'll manually trigger mousemove events on the window to guide the cursor effect

        const width = window.innerWidth;
        const height = window.innerHeight;

        // Z shape control points (normalized 0-1)
        // Start top-left -> top-right -> bottom-left -> bottom-right
        const points = [
            { x: 0.3, y: 0.3 }, // Start
            { x: 0.7, y: 0.3 }, // Top bar
            { x: 0.3, y: 0.7 }, // Diagonal
            { x: 0.7, y: 0.7 }  // Bottom bar
        ];

        let startTime = performance.now();
        const duration = 1500; // Duration of drawing in ms

        function animateCursor(time) {
            const elapsed = time - startTime;
            const progress = Math.min(elapsed / duration, 1.0);

            // Interpolate between points
            // Segment 1: 0.0 - 0.33 (Top bar)
            // Segment 2: 0.33 - 0.66 (Diagonal)
            // Segment 3: 0.66 - 1.0 (Bottom bar)

            let x, y;
            if (progress < 0.33) {
                const p = progress / 0.33;
                x = points[0].x + (points[1].x - points[0].x) * p;
                y = points[0].y + (points[1].y - points[0].y) * p;
            } else if (progress < 0.66) {
                const p = (progress - 0.33) / 0.33;
                x = points[1].x + (points[2].x - points[1].x) * p;
                y = points[1].y + (points[2].y - points[1].y) * p;
            } else {
                const p = (progress - 0.66) / 0.34;
                x = points[2].x + (points[3].x - points[2].x) * p;
                y = points[2].y + (points[3].y - points[2].y) * p;
            }

            // Dispatch event
            const event = new MouseEvent('mousemove', {
                clientX: x * width,
                clientY: y * height,
                bubbles: true
            });
            window.dispatchEvent(event);

            if (progress < 1.0) {
                requestAnimationFrame(animateCursor);
            } else {
                // Animation complete - wait a bit then fade out
                setTimeout(() => {
                    loaderOverlay.style.opacity = '0';
                    loaderOverlay.style.pointerEvents = 'none';

                    // Cleanup after fade interaction
                    setTimeout(() => {
                        loaderOverlay.style.display = 'none';
                        // Ideally compile out the WebGL context if possible, 
                        // but simple display:none is fine for now.
                    }, 1000);
                }, 500);
            }
        }

        // Start animation loop
        requestAnimationFrame(animateCursor);

    } catch (error) {
        console.error("Failed to load TubesCursor:", error);
        // Fallback: hide loader immediately
        if (loaderOverlay) loaderOverlay.style.display = 'none';
    }
})();
