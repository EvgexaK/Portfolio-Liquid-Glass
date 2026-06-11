document.addEventListener('DOMContentLoaded', () => {
    initLanguageSwitcher();
    initThemeFallback();
});

function initLanguageSwitcher() {
    const langBtn = document.querySelector('.lang-btn');
    const langIcon = document.querySelector('.lang-icon');
    if (!langBtn || !langIcon) return;

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

    // Detect browser/system language or saved preference
    const savedLang = localStorage.getItem('app-lang');
    const browserLang = navigator.language || navigator.languages?.[0] || 'en';
    const isRussian = savedLang ? (savedLang === 'ru') : browserLang.toLowerCase().startsWith('ru');

    let currentLang = isRussian ? 'ru' : 'en';

    // Apply initial body language class
    document.body.className = `lang-${currentLang}`;
    
    // Set appropriate flag (the switcher displays the flag of the language we can switch to)
    langIcon.innerHTML = currentLang === 'en' ? ruFlag : enFlag;

    // Translate back button label in header dynamically if needed
    const backLabel = document.querySelector('.back-label');
    if (backLabel) {
        backLabel.textContent = currentLang === 'en' ? 'Back' : 'Назад';
    }

    langBtn.addEventListener('click', () => {
        langBtn.style.transform = 'scale(0.9)';
        setTimeout(() => {
            langBtn.style.transform = 'scale(1)';
            const nextLang = currentLang === 'en' ? 'ru' : 'en';
            currentLang = nextLang;
            
            // Persist choice
            localStorage.setItem('app-lang', currentLang);

            // Update body class
            document.body.className = `lang-${currentLang}`;

            // Update back label
            if (backLabel) {
                backLabel.textContent = currentLang === 'en' ? 'Back' : 'Назад';
            }

            // Animate flag icon change
            langIcon.style.opacity = '0';
            langIcon.style.transform = 'rotate(30deg) scale(0.8)';

            setTimeout(() => {
                const showRuFlag = currentLang === 'en';
                langIcon.innerHTML = showRuFlag ? ruFlag : enFlag;
                langIcon.style.opacity = '1';
                langIcon.style.transform = 'rotate(0) scale(1)';
                langIcon.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
            }, 200);
        }, 100);
    });
}

/**
 * Set theme index on shader background if active
 */
function initThemeFallback() {
    // Dispatch set-theme event for standard theme (index 0) which is deep blue/violet/cyan
    setTimeout(() => {
        window.dispatchEvent(new CustomEvent('set-theme', { detail: { index: 0 } }));
    }, 100);
}
