/**
 * Portfolio Website - Apple Liquid Glass Style
 * Interactive Gradient & Smooth Animations
 */

document.addEventListener('DOMContentLoaded', () => {
    initLiquidGlassNav();
    initSectionNavigation();
    initLanguageSwitcher();
    initLanguageSwitcher(); // Note: duplicate in original code, leaving it
    initTimeline();
    initCategoryAnimations();
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
    // Set initial language based on browser preference
    let currentLang = isRussian ? 'ru' : 'en';

    // ... (rest of language switcher logic moved down or preserved) ...

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

    // ─── Constants & Config ──────────────────────────────────────────
    const translations = {
        en: {
            "hero.line1": "Digital",
            "hero.line2": "creative",
            "hero.line3": "technologist",
            "hero.role": "CYBERSECURITY / DEVELOPMENT / DESIGN",
            "hero.status": "AVAILABLE FOR WORK WORLDWIDE",
            "hero.based.label": "BASED",
            "hero.based.city": "CHEREPOVETS, RUSSIA",
            "works.title": "Categories",
            "works.cat1.title": "3D Projects",
            "works.cat1.desc": "Photorealistic modeling, animation, and character design for games and visual effects.",
            "works.cat2.title": "Design Works",
            "works.cat2.desc": "Brand identity creation, UI/UX design, and print media for diverse clients.",
            "works.cat3.title": "IT Solutions",
            "works.cat3.desc": "Full-stack development, cloud architecture, and scalable software applications.",
            "works.explore": "Explore Category \u2192",
            "about.title": "About Me",
            "about.text": "Motivated IT specialist with a degree in Business Information Technology, fluent technical English, and hands-on experience in network & system administration. Over a year of practical Linux server hardening, web infrastructure deployment, network protocol analysis, and log monitoring. Passionate about cybersecurity, troubleshooting, and building secure systems.",
            "skills.1": "Linux Administration",
            "skills.2": "Network Security",
            "skills.3": "TCP/IP & DNS",
            "skills.4": "Bash & Python",
            "skills.5": "3D & Graphic Design",
            "skills.6": "Branding",
            "skills.7": "Firewall & SSH",
            "skills.8": "English C1",
            "timeline.title": "Changelog from my journey",
            "timeline.subtitle": "My professional path from university to IT security — design, servers, and everything in between.",
            "timeline.2025.text": "Continuing to administer my private VPN service (20+ users) and personal web server. Finishing the Selectel Linux System Administrator course. Actively developing in cybersecurity — reading Habr, studying protocols, hardening servers.",
            "timeline.2025.check1": "🔒 VPN service (VLESS + Reality) — 20+ users, ongoing monitoring",
            "timeline.2025.check2": "📜 Selectel — Linux Sysadmin course (completing)",
            "timeline.2025.check3": "🌐 Personal website on own server with SSL & DNS",
            "timeline.2025.check4": "🛡️ Server hardening: SSH keys, firewall, port management",
            "timeline.2024.text": "Launched private VPN service and streaming platform. Developed a custom whitelist bypass protocol in Python. Went self-employed — 3D modeling & design freelancing while building out IT infrastructure.",
            "timeline.2024.check1": "🚀 Deployed VLESS + Reality VPN server from scratch",
            "timeline.2024.check2": "📡 Built streaming platform (gRPC + Nginx) with IP filtering & auth",
            "timeline.2024.check3": "🐍 Developed whitelist bypass protocol (Python)",
            "timeline.2024.check4": "🎨 Self-employed: 3D modeling & design freelancing",
            "timeline.2024.check5": "🔍 Network auditing with Nmap",
            "timeline.2021.text": "Designer at Telesett LLC (PhosAgro subsidiary). Entrusted with the most high-profile projects from major clients. Created information security awareness posters for PhosAgro employees.",
            "timeline.2021.check1": "🏔️ BigWood ski resort — trail map design",
            "timeline.2021.check2": "✈️ Khibiny Airport — complete brandbook development",
            "timeline.2021.check3": "🏕️ Sosnovka recreation base — map design",
            "timeline.2021.check4": "🛡️ InfoSec awareness posters for PhosAgro",
            "timeline.2021.check5": "🖨️ Print design, advertising, banners, merchandise",
            "timeline.2020.text": "Teacher at GAUDO \"Laplandia\" — Industrial Design & Hi-Tech. Set up a local network and file server in the classroom. Configured all workstations, internet access, and connected 3D printers and CNC machines.",
            "timeline.2020.check1": "🖧 Built local LAN & file server for the classroom",
            "timeline.2020.check2": "💻 Configured all laptops, internet access & network policies",
            "timeline.2020.check3": "🎓 Duke University — Data Science Math Skills (Jan 2020)",
            "timeline.2020.check4": "🎓 University of Minnesota — Analysis for Business Systems (May 2020)",
            "timeline.2020.check5": "🖨️ Taught CAD, Blender, 3D printing, photogrammetry",
            "timeline.uni.text": "Graduated from Lapland University of Applied Sciences (Finland). Bachelor of Business Administration — Business Information Technology specialization. All coursework in English. Thesis on Artificial Intelligence.",
            "timeline.uni.check1": "🎓 Lapland UAS — BBA, Business Information Technology",
            "timeline.uni.check2": "🤖 Thesis on AI technologies (academic English)",
            "timeline.uni.check3": "🌍 Full English-language instruction",
            "contact.title": "Get in Touch",
            "contact.text": "Interested in working together or have a project in mind? Let's talk.",
            "contact.phone": "+7 (953) 302-32-52",
            "nav.home": "Home",
            "nav.works": "Works",
            "nav.about": "About",
            "nav.contact": "Contact",
            "hero.name": "Evgenii Zhdanov"
        },
        ru: {
            "hero.line1": "Цифровой",
            "hero.line2": "креативный",
            "hero.line3": "технолог",
            "hero.role": "КИБЕРБЕЗОПАСНОСТЬ / РАЗРАБОТКА / ДИЗАЙН",
            "hero.status": "ДОСТУПЕН ДЛЯ РАБОТЫ ПО ВСЕМУ МИРУ",
            "hero.based.label": "ЛОКАЦИЯ",
            "hero.based.city": "ЧЕРЕПОВЕЦ, РОССИЯ",
            "works.title": "Категории",
            "works.cat1.title": "3D Проекты",
            "works.cat1.desc": "Фотореалистичное моделирование, анимация и дизайн персонажей для игр и визуальных эффектов.",
            "works.cat2.title": "Дизайн",
            "works.cat2.desc": "Создание фирменного стиля, UI/UX дизайн и полиграфия для различных клиентов.",
            "works.cat3.title": "IT Решения",
            "works.cat3.desc": "Full-stack разработка, облачная архитектура и масштабируемые программные приложения.",
            "works.explore": "Смотреть проекты \u2192",
            "about.title": "Обо мне",
            "about.text": "Мотивированный ИТ-специалист с профильным высшим образованием (Business Information Technology), свободным владением техническим английским и практическим опытом сетевого и системного администрирования. Более года глубокого практического опыта настройки и защиты Linux-серверов, развертывания веб-инфраструктуры, анализа сетевых протоколов и логов. Увлечён кибербезопасностью и траблшутингом.",
            "skills.1": "Администрирование Linux",
            "skills.2": "Сетевая безопасность",
            "skills.3": "TCP/IP и DNS",
            "skills.4": "Bash и Python",
            "skills.5": "3D и графический дизайн",
            "skills.6": "Брендинг",
            "skills.7": "Файрволл и SSH",
            "skills.8": "Английский C1",
            "timeline.title": "Changelog моего пути",
            "timeline.subtitle": "Мой профессиональный путь от университета до ИБ — дизайн, серверы и всё между ними.",
            "timeline.2025.text": "Продолжаю администрировать приватный VPN-сервис (20+ пользователей) и личный веб-сервер. Завершаю курс системного администратора Linux от Selectel. Активно развиваюсь в кибербезопасности — читаю Хабр, изучаю протоколы, харденю серверы.",
            "timeline.2025.check1": "🔒 VPN-сервис (VLESS + Reality) — 20+ пользователей, постоянный мониторинг",
            "timeline.2025.check2": "📜 Selectel — курс сисадмина Linux (завершаю)",
            "timeline.2025.check3": "🌐 Личный сайт на собственном сервере с SSL и DNS",
            "timeline.2025.check4": "🛡️ Харденинг серверов: SSH-ключи, файрволл, управление портами",
            "timeline.2024.text": "Запустил приватный VPN-сервис и стриминг-платформу. Разработал собственный протокол обхода белых списков на Python. Перешёл на самозанятость — фриланс по 3D-моделированию и дизайну, параллельно строю ИТ-инфраструктуру.",
            "timeline.2024.check1": "🚀 Развернул VPN-сервер VLESS + Reality с нуля",
            "timeline.2024.check2": "📡 Построил стриминг-платформу (gRPC + Nginx) с IP-фильтрацией и аутентификацией",
            "timeline.2024.check3": "🐍 Разработал протокол обхода белых списков (Python)",
            "timeline.2024.check4": "🎨 Самозанятость: фриланс 3D-моделирования и дизайна",
            "timeline.2024.check5": "🔍 Аудит сетей с помощью Nmap",
            "timeline.2021.text": "Дизайнер в ООО «Телесеть» (дочерняя компания «ФосАгро»). Доверяли самые масштабные проекты от крупных заказчиков. Разрабатывал плакаты по информационной безопасности для сотрудников «ФосАгро».",
            "timeline.2021.check1": "🏔️ ГК «Большой Вудъявр» — дизайн карты трасс",
            "timeline.2021.check2": "✈️ Аэропорт «Хибины» — разработка брендбука",
            "timeline.2021.check3": "🏕️ База «Сосновка» — дизайн карты",
            "timeline.2021.check4": "🛡️ Плакаты по ИБ для «ФосАгро»",
            "timeline.2021.check5": "🖨️ Полиграфия, реклама, баннеры, сувенирная продукция",
            "timeline.2020.text": "Преподаватель в ГАУДО «Лапландия» — Промышленный дизайн и Хай-тек. Развернул локальную сеть и файловый сервер в классе. Настроил все рабочие станции, доступ в интернет, подключил 3D-принтеры и станки ЧПУ.",
            "timeline.2020.check1": "🖧 Развернул LAN и файловый сервер для класса",
            "timeline.2020.check2": "💻 Настроил все ноутбуки, доступ в интернет и сетевые политики",
            "timeline.2020.check3": "🎓 Duke University — Data Science Math Skills (Январь 2020)",
            "timeline.2020.check4": "🎓 University of Minnesota — Analysis for Business Systems (Май 2020)",
            "timeline.2020.check5": "🖨️ Преподавание CAD, Blender, 3D-печать, фотограмметрия",
            "timeline.uni.text": "Окончил Lapland University of Applied Sciences (Финляндия). Бакалавр делового администрирования — специализация Business Information Technology. Всё обучение на английском. Дипломная работа по искусственному интеллекту.",
            "timeline.uni.check1": "🎓 Lapland UAS — BBA, Business Information Technology",
            "timeline.uni.check2": "🤖 Дипломная работа по ИИ (академический английский)",
            "timeline.uni.check3": "🌍 Полностью англоязычное обучение",
            "contact.title": "Связаться",
            "contact.text": "Заинтересованы в сотрудничестве или есть проект? Давайте обсудим.",
            "contact.phone": "+7 (953) 302-32-52",
            "nav.home": "Главная",
            "nav.works": "Работы",
            "nav.about": "Инфо",
            "nav.contact": "Контакты",
            "hero.name": "Евгений Жданов"
        }
    };
}

// ─── Custom Inertial Smooth Scroll ──────────────────────────────
class SmoothScroll {
    constructor() {
        this.targetScroll = 0;
        this.currentScroll = 0;
        this.isScrolling = false;
        this.ease = 0.08;

        // Cache the active container
        this.activeContainer = null;

        // Bind methods
        this.onWheel = this.onWheel.bind(this);
        this.update = this.update.bind(this);
        this.onSectionChange = this.onSectionChange.bind(this);

        this.init();
    }

    init() {
        // Initial setup
        this.updateActiveContainer();

        // Listen for wheel on window (to capture all scrolls)
        window.addEventListener('wheel', this.onWheel, { passive: false });

        // Listen for navigation changes to switch containers
        // The nav uses creating/removing 'active' class, so we might need to hook into that or listen to a custom event if exists
        // Looking at code, initLiquidGlassNav dispatches 'set-theme'. We can use that or a MutationObserver.
        // Or simply poll/check in the loop? MutationObserver is better.

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.target.classList.contains('active')) {
                    this.updateActiveContainer();
                }
            });
        });

        // Observe sections for attribute changes (class)
        document.querySelectorAll('.section').forEach(section => {
            observer.observe(section, { attributes: true, attributeFilter: ['class'] });
        });

        requestAnimationFrame(this.update);
    }

    updateActiveContainer() {
        const newContainer = document.querySelector('.section.active');
        if (newContainer !== this.activeContainer) {
            this.activeContainer = newContainer;
            if (this.activeContainer) {
                this.targetScroll = this.activeContainer.scrollTop;
                this.currentScroll = this.activeContainer.scrollTop;
            }
        }
    }

    onSectionChange() {
        this.updateActiveContainer();
    }

    getMaxScroll() {
        if (!this.activeContainer) return 0;
        return this.activeContainer.scrollHeight - this.activeContainer.clientHeight;
    }

    onWheel(e) {
        if (!this.activeContainer) return;

        // Check if content overflows; if not, don't hijack scroll (unless we want to prevent default anyway)
        const maxScroll = this.getMaxScroll();
        if (maxScroll <= 0) return;

        e.preventDefault();

        this.targetScroll += e.deltaY;
        this.targetScroll = Math.max(0, Math.min(this.targetScroll, maxScroll));

        this.isScrolling = true;
    }

    update() {
        if (!this.activeContainer) {
            requestAnimationFrame(this.update);
            return;
        }

        // Linear interpolation
        const diff = this.targetScroll - this.currentScroll;
        const delta = diff * this.ease;

        this.currentScroll += delta;

        if (Math.abs(diff) < 0.5) {
            this.currentScroll = this.targetScroll;
            this.isScrolling = false;
        } else {
            this.isScrolling = true;
        }

        if (this.isScrolling) {
            this.activeContainer.scrollTop = this.currentScroll;
        } else {
            // Sync with native scroll if user dragged scrollbar
            // (Use a larger threshold to avoid fighting our own scroll updates)
            if (this.activeContainer && Math.abs(this.activeContainer.scrollTop - this.currentScroll) > 10) {
                this.targetScroll = this.activeContainer.scrollTop;
                this.currentScroll = this.activeContainer.scrollTop;
            }
        }

        // Expose scroll position for Shader
        window.liquidScrollY = this.currentScroll;

        requestAnimationFrame(this.update);
    }
}

// Initialize SmoothScroll
if (window.matchMedia("(min-width: 768px)").matches) {
    // Run immediately since DOMContentLoaded handles initLanguageSwitcher call structure
    // But to be safe, we can just instantiate it here as script.js is likely deferred or at bottom
    new SmoothScroll();
}

/* initInteractiveGradient removed — replaced by shader-bg.js WebGL shader */

/**
 * Liquid Glass Navigation
 * Apple-style navigation with smooth spring animations
 */
function initLiquidGlassNav() {
    const navBtns = document.querySelectorAll('.nav-btn');
    const indicator = document.querySelector('.nav-indicator');
    const navContainer = document.querySelector('.nav-container');
    const navWrapper = document.querySelector('.liquid-glass-nav');

    // navBtns.forEach(b => b.classList.remove('active')); // REMOVE THIS LINE to respect HTML default
    indicator.style.opacity = '0';

    navBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (btn.classList.contains('animating')) return;

            const isAlreadyActive = btn.classList.contains('active');

            if (isAlreadyActive && btn.dataset.section === 'hero') {
                return; // Do nothing if clicking active home
            }

            navBtns.forEach(b => b.classList.remove('active'));

            if (isAlreadyActive) {
                // If clicking an active button that isn't Home, go to Home
                // Find Home button
                const homeBtn = document.querySelector('.nav-btn[data-section="hero"]');
                if (homeBtn) {
                    homeBtn.click(); // Trigger click on home button
                }
            } else {
                btn.classList.add('active');
                btn.classList.add('animating');
                const sectionId = btn.dataset.section;
                const isCurrentlyTopMode = navWrapper.classList.contains('nav-top-mode');
                const willBeTopMode = sectionId === 'about';

                // If mode is changing, hide indicator during transition
                if (isCurrentlyTopMode !== willBeTopMode) {
                    indicator.style.opacity = '0';

                    if (willBeTopMode) {
                        navWrapper.classList.add('nav-top-mode');
                    } else {
                        navWrapper.classList.remove('nav-top-mode');
                    }

                    // After CSS transition completes, show indicator at correct position
                    setTimeout(() => {
                        updateIndicator(btn, false);
                        indicator.style.transition = 'opacity 0.3s ease';
                        indicator.style.opacity = '1';
                        setTimeout(() => { indicator.style.transition = ''; }, 300);
                    }, 1200);
                } else {
                    // Same mode — normal animated indicator
                    indicator.style.opacity = '1';
                    updateIndicator(btn, true);
                }

                navigateToSection(sectionId);

                // Trigger Background Theme Change (Color & Pan)
                const themeIndex = Array.from(navBtns).indexOf(btn);
                window.dispatchEvent(new CustomEvent('set-theme', { detail: { index: themeIndex } }));

                addRippleEffect(btn);

                // Track indicator position during layout transition
                startIndicatorTracking(btn);

                setTimeout(() => {
                    btn.classList.remove('animating');
                }, 500);
            }
        });
    });

    // Re-update indicator after profile section layout shift completes
    function startIndicatorTracking(targetBtn) {
        // After the profile section finishes collapsing/expanding (~600ms),
        // silently re-position the indicator (no animation) to account
        // for shifted button positions. The stretch animation already
        // played on the initial click — this is just a position correction.
        setTimeout(() => {
            updateIndicator(targetBtn, false);
        }, 650);
    }

    // Initialize state from default active button in HTML
    const activeBtn = document.querySelector('.nav-btn.active');
    if (activeBtn) {
        // Wait for layout
        setTimeout(() => {
            indicator.style.opacity = '1';
            updateIndicator(activeBtn, false); // No animation for initial set
        }, 100);
    }

    function updateIndicator(btn, animate = true) {
        const rect = btn.getBoundingClientRect();
        const containerRect = navContainer.getBoundingClientRect();
        const targetLeft = rect.left - containerRect.left;
        const isTopMode = navWrapper.classList.contains('nav-top-mode');

        if (isTopMode) {
            // Top mode: position circle centered on button
            const circleSize = 36;
            const btnCenter = targetLeft + (rect.width / 2);
            const circleLeft = btnCenter - (circleSize / 2);

            if (animate) {
                indicator.style.transition = 'all 0.35s cubic-bezier(0.25, 1.5, 0.5, 1), opacity 0.3s ease';
            } else {
                indicator.style.transition = 'none';
            }
            indicator.style.left = `${circleLeft}px`;
            // Width/height/border-radius handled by CSS
            if (!animate) {
                indicator.offsetHeight;
                indicator.style.transition = '';
            }
        } else if (animate) {
            const stretchAmount = 20;
            const stretchHeight = 8;
            const hExtend = 4;

            indicator.style.transition = 'all 0.35s cubic-bezier(0.25, 1.5, 0.5, 1), opacity 0.3s ease';

            // Width stretch (extended beyond button)
            indicator.style.width = `${rect.width + stretchAmount + (hExtend * 2)}px`;
            indicator.style.left = `${targetLeft - (stretchAmount / 2) - hExtend}px`;

            // Height stretch (make it taller)
            indicator.style.height = `calc(100% - ${12 - stretchHeight}px)`;
            indicator.style.top = `${6 - (stretchHeight / 2)}px`;

            setTimeout(() => {
                indicator.style.transition = 'all 0.3s cubic-bezier(0.5, 0, 0.3, 1), opacity 0.3s ease';
                // Reset width (still extended)
                indicator.style.width = `${rect.width + (hExtend * 2)}px`;
                indicator.style.left = `${targetLeft - hExtend}px`;

                // Reset height
                indicator.style.height = 'calc(100% - 12px)';
                indicator.style.top = '6px';
            }, 250);
        } else {
            const hExtend = 4;
            indicator.style.transition = 'none';
            indicator.style.left = `${targetLeft - hExtend}px`;
            indicator.style.width = `${rect.width + (hExtend * 2)}px`;
            indicator.style.height = 'calc(100% - 12px)';
            indicator.style.top = '6px';
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
let exitTimeouts = {}; // Track exit timeouts by section ID

function navigateToSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    const targetSection = document.getElementById(sectionId);

    if (!targetSection) return;

    // Clear pending entry for any other section
    if (navigationTimeout) {
        clearTimeout(navigationTimeout);
        navigationTimeout = null;
    }

    // Handle re-activation of a section that might be exiting
    if (targetSection.classList.contains('active')) {
        // If it was in the process of exiting, revive it
        if (exitTimeouts[sectionId]) {
            clearTimeout(exitTimeouts[sectionId]);
            delete exitTimeouts[sectionId];

            // Restore visual state immediately
            targetSection.style.display = 'flex';
            targetSection.style.opacity = '1';
            targetSection.style.transform = 'translateY(0) scale(1)';
        }
        return;
    }

    sections.forEach(section => {
        // If a section is active (visible or exiting), start/reset its exit
        if (section !== targetSection && section.classList.contains('active')) {
            section.style.transition = 'opacity 0.35s ease-out, transform 0.35s ease-out';
            section.style.opacity = '0';
            section.style.transform = 'translateY(-25px) scale(0.98)';

            // Restart exit timer if it exists, to ensure sync with new entry
            if (exitTimeouts[section.id]) {
                clearTimeout(exitTimeouts[section.id]);
            }

            exitTimeouts[section.id] = setTimeout(() => {
                section.classList.remove('active');
                section.style.display = 'none';
                delete exitTimeouts[section.id];
            }, 300);
        } else if (section !== targetSection) {
            // Force hide any dormant or stuck sections
            section.style.display = 'none';
            section.classList.remove('active');
            section.style.opacity = '0';

            if (exitTimeouts[section.id]) {
                clearTimeout(exitTimeouts[section.id]);
                delete exitTimeouts[section.id];
            }
        }
    });

    // Schedule entry for target
    navigationTimeout = setTimeout(() => {
        targetSection.style.display = 'flex';
        targetSection.style.opacity = '0';
        targetSection.style.transform = 'translateY(25px) scale(0.98)';
        targetSection.style.transition = 'none';
        targetSection.offsetHeight; // Force reflow

        targetSection.style.transition = 'opacity 0.45s ease-out, transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)';
        targetSection.classList.add('active');
        targetSection.style.opacity = '1';
        targetSection.style.transform = 'translateY(0) scale(1)';

        // Ensure we don't accidentally handle it as exiting later
        if (exitTimeouts[sectionId]) {
            clearTimeout(exitTimeouts[sectionId]);
            delete exitTimeouts[sectionId];
        }
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

/**
 * Timeline Scroll Animation
 * Animates the vertical progress line based on scroll position within the timeline container
 * Ported from Framer Motion logic to Vanilla JS IntersectionObserver & Scroll
 */
function initTimeline() {
    const timelineContainer = document.querySelector('.timeline-wrapper');
    const progressLine = document.querySelector('.timeline-line-progress');
    const section = document.querySelector('#about'); // The scroll container

    if (!timelineContainer || !progressLine || !section) return;

    // We need to calculate progress based on how much of the timeline container
    // has passed a certain viewport threshold (e.g. top of screen).

    function updateProgress() {
        const containerRect = timelineContainer.getBoundingClientRect();

        // Calculate the total scrollable height of the timeline
        const totalHeight = containerRect.height;

        // Calculate progress height: Distance from top of container to center of viewport
        // This makes the "beam" end exactly at the center of the screen
        const viewportCenter = window.innerHeight / 2;
        let currentHeight = viewportCenter - containerRect.top;

        // Clamp values
        if (currentHeight < 0) currentHeight = 0;
        if (currentHeight > totalHeight) currentHeight = totalHeight;

        const progressPercent = (currentHeight / totalHeight) * 100;

        // Apply height
        progressLine.style.height = `${progressPercent}%`;

        // --- Dot Animation Logic ---
        const dots = document.querySelectorAll('.timeline-dot');

        dots.forEach(dot => {
            const dotRect = dot.getBoundingClientRect();
            // Calculate center of the dot relative to viewport
            const dotCenterY = dotRect.top + (dotRect.height / 2);

            // Activate if the dot's center has crossed the viewport center (with a small buffer)
            if (dotCenterY < viewportCenter + 10) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // Since the .section container has overflow-y: auto, we listen to scroll on IT, not window
    section.addEventListener('scroll', () => {
        requestAnimationFrame(updateProgress);
    });

    // Also update on resize
    window.addEventListener('resize', () => {
        requestAnimationFrame(updateProgress);
    });

    // Initial calculation
    updateProgress();
}

/**
 * Works Category Animations
 * 1. 3D Wireframe Sphere
 * 2. Liquid Gradient Design
 * 3. Matrix/Typing Code IT Solutions
 */
function initCategoryAnimations() {
    init3DCategory();
    initDesignCategory();
    initITCategory();
}

// --- 1. 3D Projects: Wireframe Sphere ---
function init3DCategory() {
    const canvas = document.getElementById('canvas-3d');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;

    const nodes = [];
    const edges = [];
    const sphereRadius = 160;
    const numNodes = 70;

    function resize() {
        const w = canvas.parentElement.clientWidth;
        const h = canvas.parentElement.clientHeight;
        if (w === 0 || h === 0) return; // Ignore if hidden
        width = canvas.width = w;
        height = canvas.height = h;
    }

    const observer = new ResizeObserver(debounce(resize, 100));
    observer.observe(canvas.parentElement);
    window.addEventListener('resize', debounce(resize, 150));
    resize();

    // Generate points on a sphere
    for (let i = 0; i < numNodes; i++) {
        const phi = Math.acos(-1 + (2 * i) / numNodes);
        const theta = Math.sqrt(numNodes * Math.PI) * phi;
        nodes.push({
            x: sphereRadius * Math.cos(theta) * Math.sin(phi),
            y: sphereRadius * Math.sin(theta) * Math.sin(phi),
            z: sphereRadius * Math.cos(phi)
        });
    }

    // Connect close nodes
    for (let i = 0; i < numNodes; i++) {
        for (let j = i + 1; j < numNodes; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const dz = nodes[i].z - nodes[j].z;
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
            if (dist < sphereRadius * 0.8) {
                edges.push([i, j, dist]);
            }
        }
    }

    let angleX = 0;
    let angleY = 0;

    function draw() {
        ctx.clearRect(0, 0, width, height);
        // Center the sphere in the middle of the card
        const cx = width * 0.5;
        const cy = height * 0.42;

        angleY += 0.001;
        angleX += 0.0005;

        const cosX = Math.cos(angleX);
        const sinX = Math.sin(angleX);
        const cosY = Math.cos(angleY);
        const sinY = Math.sin(angleY);

        const projected = [];

        nodes.forEach(node => {
            // Rotate Y
            let x = node.x * cosY - node.z * sinY;
            let z = node.z * cosY + node.x * sinY;

            // Rotate X
            let y = node.y * cosX - z * sinX;
            let z2 = z * cosX + node.y * sinX;

            // Projection (perspective)
            const fov = 350;
            const scale = fov / (fov + z2);

            projected.push({
                x: x * scale + cx,
                y: y * scale + cy,
                z: z2,
                scale: scale
            });
        });

        // Draw edges
        edges.forEach(edge => {
            const p1 = projected[edge[0]];
            const p2 = projected[edge[1]];

            // Fade edges based on z-depth
            const zAvg = (p1.z + p2.z) / 2;
            const alpha = Math.max(0.05, 1 - (zAvg + sphereRadius) / (sphereRadius * 2));

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 150, 50, ${alpha * 0.4})`; // Warmer orange tint
            ctx.lineWidth = 1;
            ctx.stroke();
        });

        // Draw nodes
        projected.forEach(p => {
            const alpha = Math.max(0.1, 1 - (p.z + sphereRadius) / (sphereRadius * 2));
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.scale * 2.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 190, 90, ${alpha * 0.85})`; // Warmer gold tint
            ctx.fill();
        });

        requestAnimationFrame(draw);
    }

    // Only animate if section is visible (Intersection Observer could go here for performance)
    draw();
}

// --- 2. Design Works: Design Tool Animation ---
function initDesignCategory() {
    const canvas = document.getElementById('canvas-design');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;

    function resize() {
        const w = canvas.parentElement.clientWidth;
        const h = canvas.parentElement.clientHeight;
        if (w === 0 || h === 0) return;
        width = canvas.width = w;
        height = canvas.height = h;
    }

    const observer = new ResizeObserver(debounce(resize, 100));
    observer.observe(canvas.parentElement);
    window.addEventListener('resize', debounce(resize, 150));
    resize();

    // Design shapes on the canvas
    const shapes = [
        { type: 'rect', x: 0.15, y: 0.12, w: 0.25, h: 0.18, color: 'rgba(200, 120, 60, 0.6)', rotation: 0.1 },
        { type: 'circle', x: 0.65, y: 0.25, r: 0.09, color: 'rgba(180, 80, 120, 0.55)' },
        { type: 'roundRect', x: 0.35, y: 0.38, w: 0.3, h: 0.15, radius: 12, color: 'rgba(220, 160, 50, 0.5)' },
        { type: 'triangle', x: 0.7, y: 0.55, size: 0.12, color: 'rgba(160, 70, 100, 0.5)', rotation: 0 },
        { type: 'rect', x: 0.1, y: 0.6, w: 0.2, h: 0.22, color: 'rgba(140, 90, 70, 0.45)', rotation: -0.05 },
        { type: 'circle', x: 0.45, y: 0.7, r: 0.065, color: 'rgba(210, 140, 40, 0.5)' },
        { type: 'bezier', x: 0.2, y: 0.42, color: 'rgba(200, 100, 80, 0.6)' },
        { type: 'line', x1: 0.55, y1: 0.1, x2: 0.85, y2: 0.45, color: 'rgba(180, 130, 60, 0.4)', width: 2 },
    ];

    // Cursor animation state
    let cursorX = 0.5, cursorY = 0.5;
    let targetX = 0.5, targetY = 0.5;
    let selectedShape = -1;
    let showBounding = false;
    let actionTimer = 0;
    let actionPhase = 0; // 0=moving to shape, 1=selecting, 2=dragging, 3=deselecting
    let currentTarget = 0;
    let dragOffsetX = 0, dragOffsetY = 0;
    let dragStartX = 0, dragStartY = 0;

    // Sequence of actions the cursor performs
    const actions = [
        { target: 0, drag: { dx: 0.05, dy: 0.03 } },
        { target: 2, drag: { dx: -0.03, dy: 0.04 } },
        { target: 1, drag: { dx: 0.04, dy: -0.02 } },
        { target: 4, drag: { dx: 0.06, dy: -0.03 } },
        { target: 3, drag: { dx: -0.04, dy: 0.05 } },
        { target: 5, drag: { dx: 0.03, dy: -0.04 } },
    ];
    let actionIndex = 0;

    function getShapeCenter(s) {
        if (s.type === 'circle') return { x: s.x, y: s.y };
        if (s.type === 'triangle') return { x: s.x, y: s.y };
        if (s.type === 'bezier') return { x: s.x + 0.1, y: s.y + 0.05 };
        if (s.type === 'line') return { x: (s.x1 + s.x2) / 2, y: (s.y1 + s.y2) / 2 };
        return { x: s.x + (s.w || 0) / 2, y: s.y + (s.h || 0) / 2 };
    }

    function drawShape(s, w, h) {
        ctx.save();
        const px = s.x * w;
        const py = s.y * h;

        if (s.type === 'rect') {
            ctx.translate(px + s.w * w / 2, py + s.h * h / 2);
            if (s.rotation) ctx.rotate(s.rotation);
            ctx.fillStyle = s.color;
            ctx.fillRect(-s.w * w / 2, -s.h * h / 2, s.w * w, s.h * h);
            ctx.strokeStyle = 'rgba(255, 200, 120, 0.25)';
            ctx.lineWidth = 1;
            ctx.strokeRect(-s.w * w / 2, -s.h * h / 2, s.w * w, s.h * h);
        } else if (s.type === 'circle') {
            ctx.fillStyle = s.color;
            ctx.beginPath();
            ctx.arc(px, py, s.r * Math.min(w, h), 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = 'rgba(255, 200, 120, 0.25)';
            ctx.lineWidth = 1;
            ctx.stroke();
        } else if (s.type === 'roundRect') {
            const rw = s.w * w, rh = s.h * h, r = s.radius;
            ctx.fillStyle = s.color;
            ctx.beginPath();
            ctx.roundRect(px, py, rw, rh, r);
            ctx.fill();
            ctx.strokeStyle = 'rgba(255, 200, 120, 0.25)';
            ctx.lineWidth = 1;
            ctx.stroke();
        } else if (s.type === 'triangle') {
            const sz = s.size * Math.min(w, h);
            ctx.translate(px, py);
            if (s.rotation) ctx.rotate(s.rotation);
            ctx.fillStyle = s.color;
            ctx.beginPath();
            ctx.moveTo(0, -sz);
            ctx.lineTo(sz * 0.866, sz * 0.5);
            ctx.lineTo(-sz * 0.866, sz * 0.5);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = 'rgba(255, 200, 120, 0.25)';
            ctx.lineWidth = 1;
            ctx.stroke();
        } else if (s.type === 'bezier') {
            ctx.strokeStyle = s.color;
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.bezierCurveTo(px + w * 0.08, py - h * 0.08, px + w * 0.15, py + h * 0.1, px + w * 0.2, py + h * 0.02);
            ctx.stroke();
        } else if (s.type === 'line') {
            ctx.strokeStyle = s.color;
            ctx.lineWidth = s.width || 1.5;
            ctx.beginPath();
            ctx.moveTo(s.x1 * w, s.y1 * h);
            ctx.lineTo(s.x2 * w, s.y2 * h);
            ctx.stroke();
        }
        ctx.restore();
    }

    function drawBoundingBox(s, w, h) {
        ctx.save();
        ctx.strokeStyle = 'rgba(100, 180, 255, 0.8)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 3]);

        let bx, by, bw, bh;
        if (s.type === 'circle') {
            const r = s.r * Math.min(w, h);
            bx = s.x * w - r; by = s.y * h - r;
            bw = r * 2; bh = r * 2;
        } else if (s.type === 'triangle') {
            const sz = s.size * Math.min(w, h);
            bx = s.x * w - sz; by = s.y * h - sz;
            bw = sz * 2; bh = sz * 1.5;
        } else if (s.type === 'bezier') {
            bx = s.x * w - 4; by = s.y * h - h * 0.1;
            bw = w * 0.22; bh = h * 0.2;
        } else if (s.type === 'line') {
            bx = Math.min(s.x1, s.x2) * w - 4;
            by = Math.min(s.y1, s.y2) * h - 4;
            bw = Math.abs(s.x2 - s.x1) * w + 8;
            bh = Math.abs(s.y2 - s.y1) * h + 8;
        } else {
            bx = s.x * w; by = s.y * h;
            bw = (s.w || 0) * w; bh = (s.h || 0) * h;
        }

        ctx.strokeRect(bx - 4, by - 4, bw + 8, bh + 8);
        ctx.setLineDash([]);

        // Draw corner handles
        const handleSize = 5;
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = 'rgba(100, 180, 255, 0.9)';
        ctx.lineWidth = 1.5;
        const corners = [
            [bx - 4, by - 4], [bx + bw + 4, by - 4],
            [bx - 4, by + bh + 4], [bx + bw + 4, by + bh + 4]
        ];
        corners.forEach(([cx, cy]) => {
            ctx.fillRect(cx - handleSize / 2, cy - handleSize / 2, handleSize, handleSize);
            ctx.strokeRect(cx - handleSize / 2, cy - handleSize / 2, handleSize, handleSize);
        });
        ctx.restore();
    }

    function drawCursor(x, y, w, h, clicking) {
        const px = x * w, py = y * h;
        ctx.save();
        ctx.translate(px, py);
        ctx.beginPath();
        // Arrow cursor shape
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 16);
        ctx.lineTo(4.5, 12);
        ctx.lineTo(8, 19);
        ctx.lineTo(10.5, 18);
        ctx.lineTo(7, 11);
        ctx.lineTo(12, 11);
        ctx.closePath();
        ctx.fillStyle = clicking ? 'rgba(255, 200, 100, 0.95)' : '#fff';
        ctx.fill();
        ctx.strokeStyle = '#111';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
    }

    function drawGrid(w, h) {
        ctx.strokeStyle = 'rgba(255, 200, 120, 0.04)';
        ctx.lineWidth = 0.5;
        const step = 30;
        for (let x = 0; x < w; x += step) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
        }
        for (let y = 0; y < h; y += step) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
        }
    }

    function easeInOut(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

    function draw() {
        if (!width || !height) { requestAnimationFrame(draw); return; }
        ctx.clearRect(0, 0, width, height);

        // Dark design-tool background
        ctx.fillStyle = '#0c0809';
        ctx.fillRect(0, 0, width, height);

        // Subtle grid
        drawGrid(width, height);

        // Update cursor animation
        actionTimer += 0.004;

        const action = actions[actionIndex];
        const s = shapes[action.target];
        const center = getShapeCenter(s);

        if (actionPhase === 0) {
            // Move cursor to target shape
            targetX = center.x;
            targetY = center.y;
            const t = easeInOut(Math.min(actionTimer, 1));
            cursorX += (targetX - cursorX) * 0.04;
            cursorY += (targetY - cursorY) * 0.04;
            if (actionTimer > 1.2) {
                actionPhase = 1;
                actionTimer = 0;
                selectedShape = action.target;
                showBounding = true;
                dragStartX = s.x !== undefined ? s.x : (s.x1 || 0);
                dragStartY = s.y !== undefined ? s.y : (s.y1 || 0);
            }
        } else if (actionPhase === 1) {
            // Pause (selected)
            if (actionTimer > 0.4) {
                actionPhase = 2;
                actionTimer = 0;
                dragOffsetX = 0;
                dragOffsetY = 0;
            }
        } else if (actionPhase === 2) {
            // Drag
            const t = easeInOut(Math.min(actionTimer / 1.5, 1));
            dragOffsetX = action.drag.dx * t;
            dragOffsetY = action.drag.dy * t;
            cursorX = center.x + dragOffsetX;
            cursorY = center.y + dragOffsetY;

            // Actually move the shape
            if (s.type === 'line') {
                s.x1 = dragStartX + dragOffsetX;
                s.y1 = dragStartY + dragOffsetY;
                s.x2 = s.x1 + 0.3;
                s.y2 = s.y1 + 0.35;
            } else {
                s.x = dragStartX + dragOffsetX;
                s.y = dragStartY + dragOffsetY;
            }

            if (actionTimer > 1.5) {
                actionPhase = 3;
                actionTimer = 0;
            }
        } else if (actionPhase === 3) {
            // Deselect + move to next
            if (actionTimer > 0.5) {
                showBounding = false;
                selectedShape = -1;
                actionPhase = 0;
                actionTimer = 0;
                actionIndex = (actionIndex + 1) % actions.length;
            }
        }

        // Draw all shapes
        shapes.forEach((s, i) => {
            drawShape(s, width, height);
        });

        // Draw bounding box on selected shape
        if (showBounding && selectedShape >= 0) {
            drawBoundingBox(shapes[selectedShape], width, height);
        }

        // Draw cursor
        drawCursor(cursorX, cursorY, width, height, actionPhase === 2);

        requestAnimationFrame(draw);
    }

    draw();
}

// --- 3. IT Solutions: Typing Code ---
function initITCategory() {
    const container = document.getElementById('code-bg-container');
    if (!container) return;

    const codeSnippets = [
        "const server = http.createServer((req, res) => {\\n    res.writeHead(200, {'Content-Type': 'text/plain'});\\n    res.end('System Online\\n');\\n});",
        "function hashPassword(password) {\\n    const salt = crypto.randomBytes(16);\\n    return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');\\n}",
        "class SecureVPN {\\n    constructor(config) {\\n        this.port = config.port;\\n        this.protocol = 'vless';\\n    }\\n    init() {\\n        console.log(`Starting on ${this.port}`);\\n    }\\n}",
        "// Connecting to Database...\\nasync function connectDB() {\\n    try {\\n        await mongoose.connect(process.env.DB_URL);\\n        console.log('MongoDB Connected');\\n    } catch(err) {\\n        console.error(err);\\n    }\\n}",
        "export const deployConfig = {\\n    target: 'production',\\n    region: 'eu-central',\\n    replicas: 3,\\n    autoscaling: true\\n};"
    ];

    let currentText = "";
    let targetText = "";
    let snippetIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let delay = 50;

    // Fill screen with some static dim code first
    const bgLines = Array(12).fill(0).map(() => codeSnippets[Math.floor(Math.random() * codeSnippets.length)]);
    container.innerHTML = `<div style="opacity:0.25; position:absolute; top:10px; left:10px; right:10px; bottom: 60px; overflow:hidden; pointer-events:none; color: #7ac4ff;">${bgLines.join('\\n\\n').replace(/\\n/g, '<br>')}</div><div id="typing-cursor" style="position:relative; z-index:1; color: #8dd0ff;"></div>`;

    const typingElement = container.querySelector('#typing-cursor');

    function type() {
        const fullTxt = codeSnippets[snippetIndex];

        if (isDeleting) {
            currentText = fullTxt.substring(0, charIndex - 1);
            charIndex--;
            delay = 20; // Delete faster
        } else {
            currentText = fullTxt.substring(0, charIndex + 1);
            charIndex++;
            delay = 30 + Math.random() * 50; // Variable typing speed
        }

        typingElement.innerHTML = currentText.replace(/\\n/g, '<br>') + '<span style="border-right: 2px solid #5ab0ff; animation: blink 1s step-end infinite;">&nbsp;</span>';

        if (!isDeleting && charIndex === fullTxt.length) {
            delay = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            snippetIndex = (snippetIndex + 1) % codeSnippets.length;
            delay = 500; // Pause before next string
        }

        setTimeout(type, delay);
    }

    // Auto-scroll logic if container grows
    setInterval(() => {
        container.scrollTop = container.scrollHeight;
    }, 100);

    // CSS for cursor blink just in case it doesn't exist
    if (!document.getElementById('code-blink-style')) {
        const style = document.createElement('style');
        style.id = 'code-blink-style';
        style.textContent = `@keyframes blink { 0%, 100% { border-color: transparent } 50% { border-color: #5ab0ff } }`;
        document.head.appendChild(style);
    }

    type();
}
