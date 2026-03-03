/**
 * Portfolio Showcase — Single Page Application Logic
 * Handles the overlay animation, fetches projects from API, and renders slides.
 */

let showcaseProjects = [];
let showcaseActiveProject = null;
let showcaseSlides = [];
let showcaseCurrentSlide = 0;
let showcaseIsLoading = false;
let currentCategory = null;
let currentLoadId = 0; // Incremental ID to track and cancel stale async loads
let showcasePreloadedSlides = {}; // Cache for pre-rendered slides: { "category/folder": slides[] }

// The overlay element
const overlay = document.getElementById('showcase-overlay');
const projectList = document.getElementById('project-list');
const showcaseTitle = document.getElementById('showcase-title');
const viewerEmpty = document.getElementById('viewer-empty');
const viewerSlides = document.getElementById('viewer-slides');
const viewerControls = document.getElementById('viewer-controls');
const slideDisplay = document.getElementById('slide-display');
const slideIndicators = document.getElementById('slide-indicators');
const slideCounter = document.getElementById('slide-counter');
const btnPrev = document.getElementById('slide-prev');
const btnNext = document.getElementById('slide-next');

const categoryTitles = {
    '3d': '3D Projects',
    'design': 'Design Works',
    'it': 'IT Solutions'
};

// ─── Open / Close Overlay ────────────────────────────────────────

function openShowcase(category, event) {
    if (event) event.preventDefault();
    currentCategory = category;

    // Update UI title
    showcaseTitle.textContent = categoryTitles[category] || 'Showcase';

    // Dispatch custom event to tell shader to change colors
    const themeIndexMap = { '3d': 4, 'design': 5, 'it': 6 }; // We'll add these to shader-bg.js
    window.dispatchEvent(new CustomEvent('set-theme', {
        detail: { index: themeIndexMap[category] || 0, isCategory: true }
    }));

    // Update and Sync Navbar
    const navWorksBtn = document.querySelector('.nav-btn[data-section="works"]');
    if (navWorksBtn) {
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        navWorksBtn.classList.add('active');
    }

    // Show overlay and fade out main content
    overlay.classList.add('active');
    document.body.classList.add('showcase-active');
    document.querySelector('.liquid-glass-nav').classList.add('nav-top-mode');

    // Trigger indicator update after layout shift starts
    setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
    }, 100);
    setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
    }, 600); // And after the profile expands

    // Load data from PHP api
    loadProjects(category);
}

function closeShowcase() {
    overlay.classList.remove('active');
    document.body.classList.remove('showcase-active');
    document.querySelector('.liquid-glass-nav').classList.remove('nav-top-mode');

    currentCategory = null;
    showcaseActiveProject = null;

    // Close viewer state
    viewerSlides.style.display = 'none';
    if (viewerControls) viewerControls.style.display = 'none';
    viewerEmpty.style.display = 'flex';
    slideDisplay.innerHTML = '';

    // Null out cached element references so they get recreated fresh next time
    Object.values(showcasePreloadedSlides).forEach(slides => {
        slides.forEach(s => { s.element = null; });
    });

    // Tell shader to revert to current section (Works = 1 format)
    window.dispatchEvent(new CustomEvent('set-theme', {
        detail: { index: 1 } // Return to 'Works' theme
    }));

    // Trigger indicator update so it snaps back to bottom menu position
    setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
    }, 10);
    setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
    }, 500); // Caught after layout transition
}

// ─── Data Loading ─────────────────────────────────────────────

async function loadProjects(category) {
    // Reset selection state when loading a new category
    showcaseActiveProject = null;
    viewerSlides.style.display = 'none';
    if (viewerControls) viewerControls.style.display = 'none';
    viewerEmpty.style.display = 'flex';

    // Clear stale slide cache for this category so changed files are picked up
    Object.keys(showcasePreloadedSlides).forEach(key => {
        if (key.startsWith(category + '/')) delete showcasePreloadedSlides[key];
    });

    projectList.innerHTML = '<div class="project-list-empty">Loading projects...</div>';

    try {
        const resp = await fetch(`api/projects.php?category=${category}&t=${Date.now()}`);
        if (!resp.ok) throw new Error('API failed');

        const text = await resp.text();

        // If the server returned the raw PHP file (unexecuted), fallback to static JSON
        if (text.trim().startsWith('<?php') || text.trim().startsWith('<')) {
            console.log('PHP not executed. Falling back to static JSON...');
            const fallbackResp = await fetch(`api/projects-fallback.json?t=${Date.now()}`);
            const fallbackData = await fallbackResp.json();
            showcaseProjects = fallbackData[category] || [];
        } else {
            showcaseProjects = JSON.parse(text);
        }
    } catch (e) {
        console.warn('Failed to load projects:', e);
        showcaseProjects = [];
    }

    renderProjectList(category);
}

function getTranslatedProjectName(folderName) {
    // Check global scope (set by script.js)
    const lang = window.currentAppLanguage || 'en';
    // Access global translations
    if (window.translations && window.translations[lang]) {
        // We look for key "project.foldername_in_lowercase"
        const key = 'project.' + folderName.toLowerCase();
        if (window.translations[lang][key]) {
            return window.translations[lang][key];
        }
    }
    // Fallback to exactly what the folder is named
    return folderName;
}

async function renderProjectList(category) {
    projectList.innerHTML = '';

    if (!showcaseProjects || showcaseProjects.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'project-list-empty';
        empty.textContent = 'No projects yet in ' + (categoryTitles[category] || 'this category') + '.';
        projectList.appendChild(empty);
        return;
    }

    showcaseProjects.forEach((project, i) => {
        const item = document.createElement('div');
        item.className = 'project-item';
        // Translate the name dynamically
        item.textContent = getTranslatedProjectName(project.folder);
        // Store the original folder name if we ever need it
        item.dataset.folder = project.folder;
        item.addEventListener('click', () => selectProject(i, category));
        projectList.appendChild(item);
    });

    // Auto-select first project
    await selectProject(0, category);

    // Pre-load the SECOND project after first one is done
    if (showcaseProjects.length > 1) {
        preloadProjectSlides(showcaseProjects[1], category);
    }
}

// Listen for global language changes so we re-translate instantly
window.addEventListener('language-changed', () => {
    if (currentCategory && showcaseProjects) {
        // Re-render the side list
        renderProjectList(currentCategory);
        // Ensure the active state is restored since we wiped the DOM list
        if (showcaseActiveProject !== null) {
            document.querySelectorAll('#showcase-overlay .project-item').forEach((el, i) => {
                el.classList.toggle('active', i === showcaseActiveProject);
            });
        }
    }
});

// ─── Select Project ───────────────────────────────────────────

async function selectProject(index, category) {
    showcaseActiveProject = index;

    const project = showcaseProjects[index];
    if (!project) {
        console.warn('selectProject: invalid index', index);
        return;
    }

    // Update active state in list
    document.querySelectorAll('#showcase-overlay .project-item').forEach((el, i) => {
        el.classList.toggle('active', i === index);
    });

    // Load slides (will use cache if pre-loaded)
    try {
        await loadSlides(project, category);
    } catch (err) {
        console.error('Error loading slides for', project.folder, err);
    }

    // Pre-load the NEXT project in background silently
    const nextIdx = (index + 1) % showcaseProjects.length;
    if (nextIdx !== index) {
        preloadProjectSlides(showcaseProjects[nextIdx], category);
    }
}

// ─── Load Slides ──────────────────────────────────────────────

async function loadSlides(project, category) {
    const myLoadId = ++currentLoadId;
    showcaseIsLoading = true;
    showcaseSlides = [];
    showcaseCurrentSlide = 0;

    const cacheKey = `${category}/${project.folder}`;
    let firstSlideShown = false; // Tracks if slide 1 was already displayed during progressive loading

    // Always set up the viewer UI first
    slideDisplay.innerHTML = '<div class="slide-loading"></div>';
    viewerEmpty.style.display = 'none';
    viewerSlides.style.display = 'flex';
    if (viewerControls) viewerControls.style.display = 'flex';

    // 1. Check if we ALREADY have these slides in cache
    if (showcasePreloadedSlides[cacheKey]) {
        showcaseSlides = showcasePreloadedSlides[cacheKey];
        // Clear stale DOM element references so they get recreated
        showcaseSlides.forEach(s => { s.element = null; });
    } else {
        // 2. Otherwise, load them progressively
        const folderMap = { '3d': '3D', 'design': 'Design', 'it': 'IT' };
        const folderName = folderMap[category] || '3D';
        const basePath = `Projects/${folderName}/${project.folder}/`;

        for (const file of project.files) {
            if (currentLoadId !== myLoadId) return;
            const ext = file.split('.').pop().toLowerCase();
            const fileUrl = basePath + encodeURIComponent(file);

            if (ext === 'pdf') {
                // Load PDF document but store LAZY page references
                if (typeof pdfjsLib !== 'undefined') {
                    try {
                        const pdf = await pdfjsLib.getDocument(fileUrl).promise;
                        if (currentLoadId !== myLoadId) return;

                        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                            // Store lazy reference — page is rendered on-demand
                            showcaseSlides.push({
                                type: 'pdf',
                                pdfDoc: pdf,
                                pageNum: pageNum,
                                src: null,     // Filled when rendered
                                element: null,
                                rendered: false
                            });

                            // Progressive: show first slide immediately
                            if (!firstSlideShown && showcaseSlides.length === 1) {
                                firstSlideShown = true;
                                // Eagerly render page 1 right now
                                await renderPDFPage(showcaseSlides[0]);
                                if (currentLoadId !== myLoadId) return;
                                renderSlide(0);
                                renderIndicators();
                                updateCounter();
                            }
                        }
                        // Live-update indicators as pages are discovered
                        if (firstSlideShown) {
                            renderIndicators();
                            updateCounter();
                            updateArrows();
                        }
                    } catch (err) {
                        console.error('Error loading PDF:', err);
                    }
                }
            } else if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)) {
                showcaseSlides.push({ type: 'img', src: fileUrl, element: null, rendered: true });

                // Progressive: show first slide immediately
                if (!firstSlideShown && showcaseSlides.length === 1) {
                    firstSlideShown = true;
                    renderSlide(0);
                    renderIndicators();
                    updateCounter();
                }
            }
        }
        // Save to cache for future clicks
        showcasePreloadedSlides[cacheKey] = showcaseSlides.map(s => {
            // For cache, keep the pdfDoc reference but clear DOM elements
            return { ...s, element: null };
        });
    }

    // Final check before rendering
    if (currentLoadId !== myLoadId) return;

    if (showcaseSlides.length === 0) {
        slideDisplay.innerHTML = '';
        viewerEmpty.style.display = 'flex';
        viewerSlides.style.display = 'none';
    } else if (!firstSlideShown) {
        // Only render if progressive loading didn't already show slide 1
        renderSlide(0);
        renderIndicators();
        updateCounter();
    } else {
        // First slide already visible — just update indicators for any new pages found
        renderIndicators();
        updateCounter();
        updateArrows();
    }

    showcaseIsLoading = false;
}

// ─── Lazy PDF Page Renderer ──────────────────────────────────

/**
 * Renders a single PDF page on-demand. Converts to JPEG data URL.
 * Only called when the user navigates to an unrendered page.
 */
async function renderPDFPage(slide) {
    if (slide.rendered || slide.type !== 'pdf') return;
    try {
        const page = await slide.pdfDoc.getPage(slide.pageNum);
        const scale = 1.5;
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
        slide.src = canvas.toDataURL('image/jpeg', 0.90);
        slide.rendered = true;
    } catch (err) {
        console.error('Error rendering PDF page:', err);
    }
}

// ─── Background Pre-loader ──────────────────────────────────

/**
 * Pre-loads only page 1 of the next project (lightweight).
 * Full pages are rendered lazily when user navigates to them.
 */
async function preloadProjectSlides(project, category) {
    const cacheKey = `${category}/${project.folder}`;
    if (showcasePreloadedSlides[cacheKey]) return;

    const folderMap = { '3d': '3D', 'design': 'Design', 'it': 'IT' };
    const folderName = folderMap[category] || '3D';
    const basePath = `Projects/${folderName}/${project.folder}/`;
    const tempSlides = [];

    for (const file of project.files) {
        const ext = file.split('.').pop().toLowerCase();
        const fileUrl = basePath + encodeURIComponent(file);

        if (ext === 'pdf') {
            if (typeof pdfjsLib !== 'undefined') {
                try {
                    const pdf = await pdfjsLib.getDocument(fileUrl).promise;
                    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                        const slide = {
                            type: 'pdf',
                            pdfDoc: pdf,
                            pageNum: pageNum,
                            src: null,
                            element: null,
                            rendered: false
                        };
                        // Only eagerly render page 1 for instant display
                        if (pageNum === 1) {
                            await renderPDFPage(slide);
                        }
                        tempSlides.push(slide);
                    }
                } catch (e) { }
            }
        } else if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)) {
            tempSlides.push({ type: 'img', src: fileUrl, element: null, rendered: true });
        }
    }
    showcasePreloadedSlides[cacheKey] = tempSlides;
    console.log(`Pre-loaded project: ${project.folder} (${tempSlides.length} slides, page 1 rendered)`);
}


// ─── Render Slide ─────────────────────────────────────────────

function renderSlide(index) {
    if (index < 0 || index >= showcaseSlides.length) return;
    showcaseCurrentSlide = index;

    const slide = showcaseSlides[index];

    // If this is an unrendered PDF page, show spinner and render it
    if (slide.type === 'pdf' && !slide.rendered) {
        // Show a mini loading state
        const loader = slideDisplay.querySelector('.slide-loading');
        if (!loader) {
            slideDisplay.insertAdjacentHTML('beforeend', '<div class="slide-loading"></div>');
        }
        renderPDFPage(slide).then(() => {
            // Only render if user hasn't navigated away
            if (showcaseCurrentSlide === index) {
                renderSlideElement(slide, index);
            }
            // Pre-render adjacent pages in background
            preRenderAdjacent(index);
        });
        return;
    }

    renderSlideElement(slide, index);
    // Pre-render adjacent pages in background
    preRenderAdjacent(index);
}

/**
 * Actually puts the slide element into the DOM with transitions.
 */
function renderSlideElement(slide, index) {
    // Remove active state from current slide
    const existing = slideDisplay.querySelectorAll('.slide-item');
    existing.forEach(el => {
        if (el.classList.contains('slide-visible')) {
            el.classList.remove('slide-visible');
            setTimeout(() => {
                if (el.parentNode === slideDisplay) el.remove();
            }, 550);
        }
    });

    if (!slide.element) {
        const img = document.createElement('img');
        img.src = slide.src;
        img.className = 'slide-item';
        img.alt = `Slide ${index + 1}`;
        img.draggable = false;
        slide.element = img;
    }

    const loader = slideDisplay.querySelector('.slide-loading');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 400);
    }

    slideDisplay.appendChild(slide.element);

    // Initial state before transition
    slide.element.classList.remove('slide-visible');
    slide.element.offsetHeight; // Force reflow

    requestAnimationFrame(() => {
        slide.element.classList.add('slide-visible');
    });

    updateIndicators();
    updateCounter();
    updateArrows();
}

/**
 * Pre-renders the slides adjacent to the current one (±1)
 * so they're instant when the user navigates.
 */
function preRenderAdjacent(currentIndex) {
    const neighbors = [currentIndex - 1, currentIndex + 1];
    for (const idx of neighbors) {
        if (idx >= 0 && idx < showcaseSlides.length) {
            const s = showcaseSlides[idx];
            if (s.type === 'pdf' && !s.rendered) {
                renderPDFPage(s); // Fire and forget
            }
        }
    }
}

// ─── Navigation ───────────────────────────────────────────────

function goToSlide(index) {
    if (index < 0 || index >= showcaseSlides.length) return;
    renderSlide(index);
}

document.addEventListener('keydown', (e) => {
    // Only handle keys if overlay is open
    if (!overlay.classList.contains('active')) return;

    if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToSlide(showcaseCurrentSlide - 1);
    } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToSlide(showcaseCurrentSlide + 1);
    } else if (e.key === 'Escape') {
        e.preventDefault();
        closeShowcase();
    }
});

btnPrev.addEventListener('click', () => goToSlide(showcaseCurrentSlide - 1));
btnNext.addEventListener('click', () => goToSlide(showcaseCurrentSlide + 1));

// ─── Indicators & Counter ─────────────────────────────────────

function renderIndicators() {
    slideIndicators.innerHTML = '';
    showcaseSlides.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = 'slide-dot' + (i === showcaseCurrentSlide ? ' active' : '');
        dot.addEventListener('click', () => goToSlide(i));
        slideIndicators.appendChild(dot);
    });
}

function updateIndicators() {
    slideIndicators.querySelectorAll('.slide-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === showcaseCurrentSlide);
    });
}

function updateCounter() {
    if (showcaseSlides.length === 0) {
        slideCounter.textContent = '';
        return;
    }
    const curr = String(showcaseCurrentSlide + 1).padStart(2, '0');
    const total = String(showcaseSlides.length).padStart(2, '0');
    slideCounter.textContent = curr + ' / ' + total;
}

function updateArrows() {
    btnPrev.disabled = showcaseCurrentSlide === 0;
    btnNext.disabled = showcaseCurrentSlide === showcaseSlides.length - 1;
}

// Ensure clicking main nav buttons closes the overlay first if open

// ─── Pre-loading ──────────────────────────────────────────────

let showcasePreloadedData = {};

/**
 * Pre-load all project lists in background
 */
async function preloadShowcase() {
    const categories = ['3d', 'design', 'it'];
    for (const cat of categories) {
        try {
            const resp = await fetch(`api/projects.php?category=${cat}&t=${Date.now()}`);
            if (resp.ok) {
                const data = await resp.json();
                showcasePreloadedData[cat] = data;
                console.log(`Preloaded ${cat} projects list.`);
            }
        } catch (e) {
            // Ignore pre-loading errors
        }
    }
}

// Global initialization - run pre-loader when page is ready
if ('requestIdleCallback' in window) {
    requestIdleCallback(() => preloadShowcase(), { timeout: 5000 });
} else {
    setTimeout(preloadShowcase, 3000);
}
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        // If it's an internal link (#something)
        if (overlay.classList.contains('active')) {
            closeShowcase();
        }
    });
});
