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

    // Detect browser/system language - check if Russian
    const browserLang = navigator.language || navigator.languages?.[0] || 'en';
    const isRussian = browserLang.toLowerCase().startsWith('ru');

    // Set initial language based on browser preference
    let currentLang = isRussian ? 'ru' : 'en';

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
        langIcon.innerHTML = currentLang === 'en' ? ruFlag : enFlag;

        if (isRussian) {
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (translations.ru[key]) {
                    el.textContent = translations.ru[key];
                }
            });
        }

        langBtn.addEventListener('click', () => {
            langBtn.style.transform = 'scale(0.9)';
            setTimeout(() => {
                langBtn.style.transform = 'scale(1)';
                const nextLang = currentLang === 'en' ? 'ru' : 'en';
                currentLang = nextLang;
                window.dispatchEvent(new Event('toggle-theme'));
                langIcon.style.opacity = '0';
                langIcon.style.transform = 'rotate(30deg) scale(0.8)';

                setTimeout(() => {
                    const showRuFlag = currentLang === 'en';
                    langIcon.innerHTML = showRuFlag ? ruFlag : enFlag;
                    langIcon.style.opacity = '1';
                    langIcon.style.transform = 'rotate(0) scale(1)';
                    langIcon.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
                }, 200);

                translateContent(currentLang);
            }, 100);
        });
    }

    function translateContent(lang) {
        document.querySelectorAll('[data-i18n]').forEach((el, index) => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang][key]) {
                const delay = index * 10;
                setTimeout(() => {
                    el.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                    el.style.filter = 'blur(10px)';
                    el.style.opacity = '0';
                    el.style.transform = 'translateY(4px) scale(0.95)';

                    setTimeout(() => {
                        el.textContent = translations[lang][key];
                        el.style.filter = 'blur(0px)';
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0) scale(1)';

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
 * Interactive Gradient Background - Robust Version
 * Directly calculates transform to ensure responsiveness
 */
function initInteractiveGradient() {
    const orbs = document.querySelectorAll('.gradient-orb');

    // State tracking
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;

    // Direct event listener
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Touch support
    window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            mouseX = e.touches[0].clientX;
            mouseY = e.touches[0].clientY;
        }
    }, { passive: true });

    // Configuration for parallax layers
    const configs = [
        { s: 1.5 },   // Front layer (moves opposite to mouse)
        { s: -0.8 },  // Mid layer (follows mouse)
        { s: 1.2 },   // Front layer
        { s: -1.8 }   // Back layer (follows mouse strongly)
    ];

    // Theme & Navigation Logic
    let targetPan = 0;
    let currentPan = 0;
    let targetHue = 0;
    let currentHue = 0;

    window.addEventListener('set-theme', (e) => {
        const idx = e.detail.index || 0;
        // Map index to Theme Properties
        // 0 (Works): Default Blue/Purple
        // 1 (About): Teal/Green (Hue 90) + Pan Right
        // 2 (Contact): Gold/Warm (Hue 210) + Pan Further Right

        targetHue = idx === 1 ? 90 : (idx === 2 ? 210 : 0);
        targetPan = idx * 100; // Shift 0, 100, 200px
    });

    function animate() {
        // Smooth lerp
        currentX += (mouseX - currentX) * 0.05;
        currentY += (mouseY - currentY) * 0.05;

        // Smooth transition for Theme props
        currentPan += (targetPan - currentPan) * 0.05;
        currentHue += (targetHue - currentHue) * 0.05;

        // Calculate offset from center (-1 to 1)
        const w = window.innerWidth || 1;
        const h = window.innerHeight || 1;
        const xPct = (currentX - w / 2) / (w / 2);
        const yPct = (currentY - h / 2) / (h / 2);

        orbs.forEach((orb, i) => {
            const s = configs[i] ? configs[i].s : 1.0;

            // Movement Range: Minimal (5% of previous) -> ~10px range
            const mouseTx = xPct * s * 10 * -1;
            const mouseTy = yPct * s * 5 * -1;

            // Apply Pan (Carousel effect) - opposite direction for depth
            const panTx = currentPan * s * -0.5;

            const tx = mouseTx + panTx;
            const ty = mouseTy;

            // Simple Rotation
            const rot = xPct * s * 5;

            // Apply transform directly (including hue-rotate)
            orb.style.cssText = `
                display: block; 
                position: absolute; 
                transform: translate3d(${tx}px, ${ty}px, 0) rotate(${rot}deg) scale(1) !important;
                filter: blur(80px) hue-rotate(${currentHue}deg) saturate(1.2);
                transition: opacity 1s ease;
                will-change: transform, filter;
            `;
        });

        requestAnimationFrame(animate);
    }

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

    navBtns.forEach(b => b.classList.remove('active'));
    indicator.style.opacity = '0';

    navBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (btn.classList.contains('animating')) return;

            const isAlreadyActive = btn.classList.contains('active');
            navBtns.forEach(b => b.classList.remove('active'));

            if (isAlreadyActive) {
                indicator.style.opacity = '0';
                navigateToSection('hero');
            } else {
                btn.classList.add('active');
                btn.classList.add('animating');
                indicator.style.opacity = '1';
                updateIndicator(btn, true);
                const sectionId = btn.dataset.section;
                navigateToSection(sectionId);

                // Trigger Background Theme Change (Color & Pan)
                const themeIndex = Array.from(navBtns).indexOf(btn);
                window.dispatchEvent(new CustomEvent('set-theme', { detail: { index: themeIndex } }));

                addRippleEffect(btn);
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
            const stretchAmount = 20;
            indicator.style.transition = 'all 0.35s cubic-bezier(0.25, 1.5, 0.5, 1), opacity 0.3s ease';
            indicator.style.width = `${rect.width + stretchAmount}px`;
            indicator.style.left = `${targetLeft - (stretchAmount / 2)}px`;

            setTimeout(() => {
                indicator.style.transition = 'all 0.3s cubic-bezier(0.5, 0, 0.3, 1), opacity 0.3s ease';
                indicator.style.width = `${rect.width}px`;
                indicator.style.left = `${targetLeft}px`;
            }, 250);

        } else {
            indicator.style.transition = 'none';
            indicator.style.left = `${targetLeft}px`;
            indicator.style.width = `${rect.width}px`;
            indicator.offsetHeight;
            indicator.style.transition = '';
        }

        indicator.style.opacity = '1';
    }

    function addRippleEffect(btn) {
        btn.classList.remove('ripple');
        btn.offsetHeight;
        btn.classList.add('ripple');

        const icon = btn.querySelector('.nav-icon');
        if (icon) {
            icon.style.transition = 'transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)';
            icon.style.transform = 'scale(0.85)';

            setTimeout(() => {
                icon.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
                icon.style.transform = 'scale(1.15)';
            }, 80);

            setTimeout(() => {
                icon.style.transform = 'scale(1.1)';
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
    const initialSection = document.querySelector('.section.active');
    if (initialSection) {
        initialSection.style.display = 'flex';
        initialSection.style.opacity = '1';
        initialSection.style.transform = 'translateY(0)';
    }
}

let navigationTimeout;

function navigateToSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    const targetSection = document.getElementById(sectionId);

    if (!targetSection) return;
    if (targetSection.classList.contains('active')) return;

    // Clear any pending section display from rapid clicks
    if (navigationTimeout) {
        clearTimeout(navigationTimeout);
        navigationTimeout = null;
    }

    sections.forEach(section => {
        if (section.classList.contains('active')) {
            section.style.transition = 'opacity 0.35s ease-out, transform 0.35s ease-out';
            section.style.opacity = '0';
            section.style.transform = 'translateY(-25px) scale(0.98)';

            setTimeout(() => {
                section.classList.remove('active');
                section.style.display = 'none';
            }, 300);
        } else {
            // Ensure hidden state for any section that might have been pending
            if (section !== targetSection) {
                section.style.display = 'none';
                section.classList.remove('active');
                section.style.opacity = '0';
            }
        }
    });

    navigationTimeout = setTimeout(() => {
        targetSection.style.display = 'flex';
        targetSection.style.opacity = '0';
        targetSection.style.transform = 'translateY(25px) scale(0.98)';
        targetSection.style.transition = 'none';
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
