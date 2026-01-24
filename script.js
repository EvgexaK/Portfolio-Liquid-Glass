/**
 * Portfolio Website - Apple Liquid Glass Style
 * Interactive Gradient & Smooth Animations
 */

document.addEventListener('DOMContentLoaded', () => {
    initInteractiveGradient();
    initLiquidGlassNav();
    initSectionNavigation();
    initLanguageSwitcher();
});

/**
 * Language Switcher
 * Toggles between RU and EN flags
 */
function initLanguageSwitcher() {
    const langBtn = document.querySelector('.lang-btn');
    const langIcon = document.querySelector('.lang-icon');
    let currentLang = 'en'; // Start in English (so we show RU switch option)

    // Translation Dictionary
    const translations = {
        en: {
            "hero.line1": "Creative",
            "hero.line2": "visual",
            "hero.line3": "designer",
            "hero.role": "WEB & MOBILE / UX&UI / BRANDING",
            "hero.status": "CURRENTLY AVAILABLE FOR FREELANCE WORLDWIDE",
            "hero.based.label": "BASED",
            "hero.based.city": "IN LONDON",
            "works.title": "Selected Works",
            "works.1.title": "Brand Identity",
            "works.1.desc": "Complete visual identity for tech startup",
            "works.2.title": "Mobile App",
            "works.2.desc": "iOS & Android wellness application",
            "works.3.title": "Web Platform",
            "works.3.desc": "E-commerce experience redesign",
            "about.title": "About Me",
            "about.text": "I'm a creative visual designer with over 8 years of experience crafting digital experiences that blend aesthetics with functionality. My passion lies in creating designs that not only look beautiful but also tell compelling stories.",
            "skills.1": "UI/UX Design",
            "skills.2": "Brand Identity",
            "skills.3": "Motion Design",
            "skills.4": "Prototyping",
            "skills.5": "Design Systems",
            "contact.title": "Get in Touch",
            "contact.text": "Ready to bring your vision to life? Let's create something amazing together.",
            "nav.works": "Works",
            "nav.about": "About",
            "nav.contact": "Contact"
        },
        ru: {
            "hero.line1": "Креативный",
            "hero.line2": "визуальный",
            "hero.line3": "дизайнер",
            "hero.role": "ВЕБ & МОБАЙЛ / UX&UI / БРЕНДИНГ",
            "hero.status": "ДОСТУПЕН ДЛЯ ПРОЕКТОВ ПО ВСЕМУ МИРУ",
            "hero.based.label": "ЛОКАЦИЯ",
            "hero.based.city": "ЛОНДОН",
            "works.title": "Избранные проекты",
            "works.1.title": "Айдентика бренда",
            "works.1.desc": "Полный визуальный стиль для стартапа",
            "works.2.title": "Мобильное приложение",
            "works.2.desc": "iOS & Android приложение для здоровья",
            "works.3.title": "Веб-платформа",
            "works.3.desc": "Редизайн e-commerce опыта",
            "about.title": "Обо мне",
            "about.text": "Я креативный дизайнер с более чем 8-летним опытом создания цифровых продуктов, сочетающих эстетику и функциональность. Моя страсть — создавать дизайн, который не только красив, но и рассказывает историю.",
            "skills.1": "UI/UX Дизайн",
            "skills.2": "Брендинг",
            "skills.3": "Моушн-дизайн",
            "skills.4": "Прототипирование",
            "skills.5": "Дизайн-системы",
            "contact.title": "Связаться",
            "contact.text": "Готовы воплотить идеи в жизнь? Давайте создадим что-то удивительное вместе.",
            "nav.works": "Работы",
            "nav.about": "Инфо",
            "nav.contact": "Контакты"
        }
    };

    const ruFlag = `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="24" height="24" rx="12" fill="#F5F5F5"/>
            <path d="M24 16C24 20.4183 20.4183 24 16 24H8C3.58172 24 0 20.4183 0 16V16H24V16Z" fill="#D52B1E"/>
            <path d="M24 8H0V16H24V8Z" fill="#0039A6"/>
            <path d="M0 8C0 3.58172 3.58172 0 8 0H16C20.4183 0 24 3.58172 24 8V8H0V8Z" fill="white"/>
        </svg>
    `;

    const enFlag = `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="border-radius: 50%;">
            <defs>
                <clipPath id="circle-clip">
                    <rect width="24" height="24" rx="12"/>
                </clipPath>
            </defs>
            <g clip-path="url(#circle-clip)">
                <rect width="24" height="24" fill="#012169"/>
                <path d="M0 0L24 24M24 0L0 24" stroke="white" stroke-width="4"/>
                <path d="M0 0L24 24M24 0L0 24" stroke="#C8102E" stroke-width="2"/>
                <path d="M12 0V24M0 12H24" stroke="white" stroke-width="6"/>
                <path d="M12 0V24M0 12H24" stroke="#C8102E" stroke-width="3"/>
            </g>
        </svg>
    `;

    if (langBtn && langIcon) {
        langBtn.addEventListener('click', () => {
            // Add ripple/press effect
            langBtn.style.transform = 'scale(0.9)';

            setTimeout(() => {
                langBtn.style.transform = 'scale(1)';

                // Toggle Language
                const nextLang = currentLang === 'en' ? 'ru' : 'en';
                currentLang = nextLang;

                // Switch Icon with fade
                langIcon.style.opacity = '0';
                langIcon.style.transform = 'rotate(30deg) scale(0.8)';

                setTimeout(() => {
                    // If we are now in RU, show EN flag (to switch back)
                    // If we are now in EN, show RU flag (to switch to)
                    const showRuFlag = currentLang === 'en';
                    langIcon.innerHTML = showRuFlag ? ruFlag : enFlag;

                    langIcon.style.opacity = '1';
                    langIcon.style.transform = 'rotate(0) scale(1)';
                    langIcon.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
                }, 200);

                // Translate Page Content
                translateContent(currentLang);

            }, 100);
        });
    }

    function translateContent(lang) {
        document.querySelectorAll('[data-i18n]').forEach((el, index) => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang][key]) {
                // Stagger animations slightly for organic feel
                const delay = index * 10;

                setTimeout(() => {
                    // Start Dissolve: Blur out, fade out, drift down slightly
                    el.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                    el.style.filter = 'blur(10px)';
                    el.style.opacity = '0';
                    el.style.transform = 'translateY(4px) scale(0.95)';

                    setTimeout(() => {
                        // Swap Content
                        el.textContent = translations[lang][key];

                        // Re-materialize: Sharpen, fade in, settle
                        el.style.filter = 'blur(0px)';
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0) scale(1)';

                        // Force navigation indicator update
                        if (key.startsWith('nav.')) {
                            requestAnimationFrame(() => {
                                window.dispatchEvent(new Event('resize'));
                            });
                        }
                    }, 400);
                }, delay);
            }
        });
    }
}

/**
 * Interactive Gradient Background
 * Orbs react to mouse position by changing size/pattern - no cursor-following light
 * Performance optimized for Chrome on Windows
 */
function initInteractiveGradient() {
    const orbs = document.querySelectorAll('.gradient-orb');
    const gradientBg = document.querySelector('.gradient-bg');

    // Performance: Detect Chrome on Windows for throttling
    const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    const isWindows = navigator.platform.indexOf('Win') > -1;
    const needsThrottling = isChrome && isWindows;

    // Performance: Frame rate throttling for Chrome on Windows
    let lastFrameTime = 0;
    const targetFPS = needsThrottling ? 30 : 60; // Reduce to 30fps on Chrome/Windows
    const frameInterval = 1000 / targetFPS;

    // Mouse position tracking
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let targetX = mouseX;
    let targetY = mouseY;
    let isMouseInside = false;

    // Performance: Cache orb positions (update on resize instead of every frame)
    let orbPositions = [];
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;

    function cacheOrbPositions() {
        windowWidth = window.innerWidth;
        windowHeight = window.innerHeight;
        orbPositions = Array.from(orbs).map(orb => {
            const rect = orb.getBoundingClientRect();
            return {
                centerX: (rect.left + rect.width / 2) / windowWidth,
                centerY: (rect.top + rect.height / 2) / windowHeight
            };
        });
    }

    // Initial cache
    cacheOrbPositions();

    // Update cache on resize (debounced)
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(cacheOrbPositions, 150);
    });

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
        targetX = windowWidth / 2;
        targetY = windowHeight / 2;
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
        targetX = windowWidth / 2;
        targetY = windowHeight / 2;
    });

    // Animation loop - orbs react to mouse
    function animate(currentTime) {
        requestAnimationFrame(animate);

        // Performance: Frame rate throttling
        if (needsThrottling) {
            const elapsed = currentTime - lastFrameTime;
            if (elapsed < frameInterval) return;
            lastFrameTime = currentTime - (elapsed % frameInterval);
        }

        time += 0.008;

        // Smooth mouse following
        const lerpFactor = 0.03;
        mouseX += (targetX - mouseX) * lerpFactor;
        mouseY += (targetY - mouseY) * lerpFactor;

        // Calculate mouse position relative to center
        const centerX = windowWidth / 2;
        const centerY = windowHeight / 2;
        const offsetX = (mouseX - centerX) / centerX; // -1 to 1
        const offsetY = (mouseY - centerY) / centerY; // -1 to 1

        // Update each orb based on mouse position
        orbs.forEach((orb, index) => {
            const config = orbConfigs[index] || orbConfigs[0];

            // Performance: Use cached positions instead of getBoundingClientRect every frame
            const orbPos = orbPositions[index] || { centerX: 0.5, centerY: 0.5 };

            // Direction from orb to mouse
            const toMouseX = (mouseX / windowWidth) - orbPos.centerX;
            const toMouseY = (mouseY / windowHeight) - orbPos.centerY;
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

            // Apply transform (translateZ(0) added in CSS for GPU acceleration)
            orb.style.transform = `translate3d(${totalX}px, ${totalY}px, 0) scale(${totalScale})`;
            orb.style.opacity = opacity;
        });
    }

    // Start animation
    requestAnimationFrame(animate);
}

/**
 * Liquid Glass Navigation
 * Apple-style navigation with smooth spring animations
 */
function initLiquidGlassNav() {
    const navBtns = document.querySelectorAll('.nav-btn');
    const indicator = document.querySelector('.nav-indicator');
    const navContainer = document.querySelector('.nav-container');

    // INITIALIZATION:
    // User wants slider hidden initially. content should be Hero (Main Page).
    // Ensure no buttons are active visually initially, and indicator is hidden.
    navBtns.forEach(b => b.classList.remove('active'));
    indicator.style.opacity = '0';

    navBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Prevent rapid clicking
            if (btn.classList.contains('animating')) return;

            const isAlreadyActive = btn.classList.contains('active');

            // 1. Reset all buttons
            navBtns.forEach(b => b.classList.remove('active'));

            // 2. Logic: Toggle
            if (isAlreadyActive) {
                // Return to Main Page (Hero)
                indicator.style.opacity = '0'; // Hide slider
                navigateToSection('hero');
            } else {
                // Activate new section
                btn.classList.add('active');
                btn.classList.add('animating');

                // Show slider and move to button
                indicator.style.opacity = '1';
                updateIndicator(btn, true);

                // Navigate
                const sectionId = btn.dataset.section;
                navigateToSection(sectionId);

                // Add ripple
                addRippleEffect(btn);

                // Cleanup animation flag
                setTimeout(() => {
                    btn.classList.remove('animating');
                }, 500);
            }
        });
    });

    function updateIndicator(btn, animate = true) {
        const rect = btn.getBoundingClientRect();
        const containerRect = navContainer.getBoundingClientRect();
        const targetLeft = rect.left - containerRect.left;

        if (animate) {
            // STRETCH EFFECT
            const stretchAmount = 20;

            // Step 1: Move & Stretch
            indicator.style.transition = 'all 0.35s cubic-bezier(0.25, 1.5, 0.5, 1), opacity 0.3s ease';
            indicator.style.width = `${rect.width + stretchAmount}px`;
            indicator.style.left = `${targetLeft - (stretchAmount / 2)}px`;

            // Step 2: Settle
            setTimeout(() => {
                indicator.style.transition = 'all 0.3s cubic-bezier(0.5, 0, 0.3, 1), opacity 0.3s ease';
                indicator.style.width = `${rect.width}px`;
                indicator.style.left = `${targetLeft}px`;
            }, 250);

        } else {
            // Instant
            indicator.style.transition = 'none';
            indicator.style.left = `${targetLeft}px`;
            indicator.style.width = `${rect.width}px`;
            indicator.offsetHeight;
            indicator.style.transition = '';
        }

        // Ensure visibility
        indicator.style.opacity = '1';
    }

    function addRippleEffect(btn) {
        // Remove existing ripple class
        btn.classList.remove('ripple');
        btn.offsetHeight; // Force reflow
        btn.classList.add('ripple');

        // Haptic-like bounce effect on icon
        const icon = btn.querySelector('.nav-icon');
        if (icon) {
            const svg = icon.querySelector('svg');
            icon.style.transition = 'transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)';
            icon.style.transform = 'scale(0.85)';

            setTimeout(() => {
                icon.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
                icon.style.transform = 'scale(1.15)'; // Pop up
            }, 80);

            setTimeout(() => {
                icon.style.transform = 'scale(1.1)'; // Settle slightly larger while active
            }, 300);
        }

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
