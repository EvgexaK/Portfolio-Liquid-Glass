/**
 * Portfolio Website - Apple Liquid Glass Style
 * Interactive Gradient & Smooth Animations
 */

document.addEventListener('DOMContentLoaded', () => {
    initInteractiveGradient();
    initLiquidGlassNav();
    initSectionNavigation();
});

/**
 * Interactive Gradient Background
 * Orbs react to mouse position by changing size/pattern - no cursor-following light
 */
function initInteractiveGradient() {
    const orbs = document.querySelectorAll('.gradient-orb');
    const gradientBg = document.querySelector('.gradient-bg');

    // Mouse position tracking
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let targetX = mouseX;
    let targetY = mouseY;
    let isMouseInside = false;

    // Base orb configurations
    const orbConfigs = [
        { baseScale: 1, sensitivity: 0.15, phaseOffset: 0 },
        { baseScale: 1, sensitivity: 0.12, phaseOffset: Math.PI * 0.5 },
        { baseScale: 1, sensitivity: 0.18, phaseOffset: Math.PI },
        { baseScale: 1, sensitivity: 0.1, phaseOffset: Math.PI * 1.5 }
    ];

    let time = 0;

    // Track mouse entering viewport
    document.addEventListener('mouseenter', () => {
        isMouseInside = true;
    });

    document.addEventListener('mouseleave', () => {
        isMouseInside = false;
        targetX = window.innerWidth / 2;
        targetY = window.innerHeight / 2;
    });

    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
    });

    // Touch support
    document.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            targetX = e.touches[0].clientX;
            targetY = e.touches[0].clientY;
            isMouseInside = true;
        }
    }, { passive: true });

    document.addEventListener('touchend', () => {
        isMouseInside = false;
        targetX = window.innerWidth / 2;
        targetY = window.innerHeight / 2;
    });

    // Animation loop - orbs react to mouse
    function animate() {
        time += 0.008;

        // Smooth mouse following
        const lerpFactor = 0.03;
        mouseX += (targetX - mouseX) * lerpFactor;
        mouseY += (targetY - mouseY) * lerpFactor;

        // Calculate mouse position relative to center
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const offsetX = (mouseX - centerX) / centerX; // -1 to 1
        const offsetY = (mouseY - centerY) / centerY; // -1 to 1

        // Update each orb based on mouse position
        orbs.forEach((orb, index) => {
            const config = orbConfigs[index] || orbConfigs[0];

            // Get orb position
            const orbRect = orb.getBoundingClientRect();
            const orbCenterX = (orbRect.left + orbRect.width / 2) / window.innerWidth;
            const orbCenterY = (orbRect.top + orbRect.height / 2) / window.innerHeight;

            // Direction from orb to mouse
            const toMouseX = (mouseX / window.innerWidth) - orbCenterX;
            const toMouseY = (mouseY / window.innerHeight) - orbCenterY;
            const distToMouse = Math.sqrt(toMouseX * toMouseX + toMouseY * toMouseY);

            // Proximity factor - closer orbs react more
            const proximityFactor = Math.max(0, 1 - distToMouse * 1.5);

            // Scale based on mouse proximity
            let scaleMultiplier = 1;
            if (isMouseInside) {
                scaleMultiplier = 1 + proximityFactor * 0.35 - (1 - proximityFactor) * 0.08;
            }

            // Organic pulsing animation
            const pulsePhase = time + config.phaseOffset;
            const pulse = 1 + Math.sin(pulsePhase) * 0.1;

            // Movement - orbs push/pull based on mouse
            const pushX = -offsetX * config.sensitivity * 100;
            const pushY = -offsetY * config.sensitivity * 100;

            // Organic floating movement
            const floatX = Math.sin(time * 0.5 + config.phaseOffset) * 40;
            const floatY = Math.cos(time * 0.4 + config.phaseOffset) * 35;

            // Combine movements
            const totalX = pushX + floatX;
            const totalY = pushY + floatY;
            const totalScale = scaleMultiplier * pulse;

            // Opacity variation
            let opacity = 0.75;
            if (isMouseInside) {
                opacity = 0.5 + proximityFactor * 0.5;
            }

            // Apply transform
            orb.style.transform = `translate(${totalX}px, ${totalY}px) scale(${totalScale})`;
            orb.style.opacity = opacity;
        });

        requestAnimationFrame(animate);
    }

    // Start animation
    animate();
}

/**
 * Liquid Glass Navigation
 * Apple-style navigation with smooth spring animations
 */
function initLiquidGlassNav() {
    const navBtns = document.querySelectorAll('.nav-btn');
    const indicator = document.querySelector('.nav-indicator');
    const navContainer = document.querySelector('.nav-container');

    // Position indicator on initial active button
    const activeBtn = document.querySelector('.nav-btn.active');
    if (activeBtn) {
        requestAnimationFrame(() => {
            updateIndicator(activeBtn, false);
        });
    }

    navBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Prevent rapid clicking
            if (btn.classList.contains('animating')) return;

            // Remove active class from all buttons
            navBtns.forEach(b => b.classList.remove('active'));

            // Add active class to clicked button
            btn.classList.add('active');
            btn.classList.add('animating');

            // Animate indicator with spring physics
            updateIndicator(btn, true);

            // Add ripple effect
            addRippleEffect(btn);

            // Navigate to section
            const sectionId = btn.dataset.section;
            navigateToSection(sectionId);

            // Remove animating class after animation completes
            setTimeout(() => {
                btn.classList.remove('animating');
            }, 500);
        });

        // Hover effect - subtle indicator preview
        btn.addEventListener('mouseenter', () => {
            if (!btn.classList.contains('active')) {
                const rect = btn.getBoundingClientRect();
                const containerRect = navContainer.getBoundingClientRect();

                // Subtle movement toward hovered button
                indicator.style.opacity = '0.4';

                // Slight width expansion on hover
                const activeBtn = document.querySelector('.nav-btn.active');
                if (activeBtn) {
                    const activeRect = activeBtn.getBoundingClientRect();
                    const hoverInfluence = 0.15;
                    const newLeft = (activeRect.left - containerRect.left) +
                        ((rect.left - activeRect.left) * hoverInfluence);

                    indicator.style.left = `${newLeft}px`;
                }
            }
        });

        btn.addEventListener('mouseleave', () => {
            const activeBtn = document.querySelector('.nav-btn.active');
            if (activeBtn) {
                updateIndicator(activeBtn, false);
                indicator.style.opacity = '1';
            }
        });
    });

    function updateIndicator(btn, animate = true) {
        const rect = btn.getBoundingClientRect();
        const containerRect = navContainer.getBoundingClientRect();
        const targetLeft = rect.left - containerRect.left;

        if (animate) {
            // STRETCH EFFECT: Widen the bubble while moving
            const stretchAmount = 20;
            const stretchDamping = 0.5; // Controls how "loose" the stretch feels

            // Step 1: Move to target with a "stretch" state
            // We widen the bubble and offset 'left' to keep it centered on the target
            indicator.style.transition = 'all 0.35s cubic-bezier(0.25, 1.5, 0.5, 1)';
            indicator.style.width = `${rect.width + stretchAmount}px`;
            indicator.style.left = `${targetLeft - (stretchAmount / 2)}px`;

            // Step 2: Settle back to normal size
            setTimeout(() => {
                indicator.style.transition = 'all 0.3s cubic-bezier(0.5, 0, 0.3, 1)';
                indicator.style.width = `${rect.width}px`;
                indicator.style.left = `${targetLeft}px`;
            }, 250); // Delay matches the main part of the movement

        } else {
            // Instant update (no animation)
            indicator.style.transition = 'none';
            indicator.style.left = `${targetLeft}px`;
            indicator.style.width = `${rect.width}px`;
            // Force reflow then restore default transition behavior if needed
            indicator.offsetHeight;
            indicator.style.transition = '';
        }

        indicator.style.opacity = '1';
    }

    function addRippleEffect(btn) {
        // Remove existing ripple class
        btn.classList.remove('ripple');

        // Force reflow
        btn.offsetHeight;

        // Add ripple class
        btn.classList.add('ripple');

        // Haptic-like bounce effect on icon
        const icon = btn.querySelector('.nav-icon');
        if (icon) {
            icon.style.transition = 'transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)';
            icon.style.transform = 'scale(0.85)';

            setTimeout(() => {
                icon.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
                icon.style.transform = 'scale(1.15)';
            }, 80);

            setTimeout(() => {
                icon.style.transform = 'scale(1.15)';
            }, 300);
        }

        // Remove ripple class after animation
        setTimeout(() => {
            btn.classList.remove('ripple');
        }, 600);
    }
}

/**
 * Section Navigation
 * Smooth transitions between portfolio sections
 */
function initSectionNavigation() {
    // Show initial section
    const initialSection = document.querySelector('.section.active');
    if (initialSection) {
        initialSection.style.display = 'flex';
        initialSection.style.opacity = '1';
        initialSection.style.transform = 'translateY(0)';
    }
}

function navigateToSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    const targetSection = document.getElementById(sectionId);

    if (!targetSection) return;

    // Check if already on this section
    if (targetSection.classList.contains('active')) return;

    // Hide all sections with smooth animation
    sections.forEach(section => {
        if (section.classList.contains('active')) {
            section.style.transition = 'opacity 0.35s ease-out, transform 0.35s ease-out';
            section.style.opacity = '0';
            section.style.transform = 'translateY(-25px) scale(0.98)';

            setTimeout(() => {
                section.classList.remove('active');
                section.style.display = 'none';
            }, 300);
        }
    });

    // Show target section with smooth animation
    setTimeout(() => {
        targetSection.style.display = 'flex';
        targetSection.style.opacity = '0';
        targetSection.style.transform = 'translateY(25px) scale(0.98)';
        targetSection.style.transition = 'none';

        // Trigger reflow for animation
        targetSection.offsetHeight;

        targetSection.style.transition = 'opacity 0.45s ease-out, transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)';
        targetSection.classList.add('active');
        targetSection.style.opacity = '1';
        targetSection.style.transform = 'translateY(0) scale(1)';
    }, 320);
}

/**
 * Utility: Debounce function for performance
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Handle window resize - update indicator position
 */
window.addEventListener('resize', debounce(() => {
    const activeBtn = document.querySelector('.nav-btn.active');
    const indicator = document.querySelector('.nav-indicator');
    const navContainer = document.querySelector('.nav-container');

    if (activeBtn && indicator && navContainer) {
        const rect = activeBtn.getBoundingClientRect();
        const containerRect = navContainer.getBoundingClientRect();

        indicator.style.transition = 'none';
        indicator.style.left = `${rect.left - containerRect.left}px`;
        indicator.style.width = `${rect.width}px`;
        indicator.offsetHeight;
        indicator.style.transition = '';
    }
}, 100));

/**
 * Prefers reduced motion support
 */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--transition-bounce', '0.3s ease');
    document.documentElement.style.setProperty('--transition-spring', '0.3s ease');
}
