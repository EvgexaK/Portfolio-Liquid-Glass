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

    // Show disclaimer only for design works
    const disclaimer = document.getElementById('design-disclaimer');
    if (disclaimer) {
        disclaimer.style.display = category === 'design' ? 'block' : 'none';
    }

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

// ─── Open Gallery Mode (No Sidebar) ──────────────────────────
function openGallery(images, startIndex, title) {
    currentCategory = null;
    showcaseActiveProject = null;
    showcaseSlides = [];
    showcaseCurrentSlide = startIndex || 0;

    showcaseTitle.textContent = title || 'Gallery';
    const disclaimer = document.getElementById('design-disclaimer');
    if (disclaimer) disclaimer.style.display = 'none';

    images.forEach(imgUrl => {
        showcaseSlides.push({ type: 'img', src: imgUrl, element: null, rendered: true });
    });

    slideDisplay.innerHTML = '';
    viewerEmpty.style.display = 'none';
    viewerSlides.style.display = 'flex';
    if (viewerControls) viewerControls.style.display = 'flex';

    renderSlide(showcaseCurrentSlide);
    renderIndicators();
    updateCounter();
    updateArrows();

    overlay.classList.add('active');
    overlay.classList.add('gallery-mode');
    document.body.classList.add('showcase-active');
    document.querySelector('.liquid-glass-nav').classList.add('nav-top-mode');

    // Trigger indicator update after layout shift starts
    setTimeout(() => { window.dispatchEvent(new Event('resize')); }, 100);
    setTimeout(() => { window.dispatchEvent(new Event('resize')); }, 600);
}

function closeShowcase() {
    overlay.classList.remove('active');

    // Only revert shader to 'Works' if we weren't in gallery mode
    if (!overlay.classList.contains('gallery-mode')) {
        // Tell shader to revert to current section (Works = 1 format)
        window.dispatchEvent(new CustomEvent('set-theme', {
            detail: { index: 1 } // Return to 'Works' theme
        }));
    }

    overlay.classList.remove('gallery-mode');
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
        // Use preloaded data if available
        if (showcasePreloadedData[category]) {
            showcaseProjects = showcasePreloadedData[category];
        } else {
            // Try live PHP API first (production), fall back to static JSON (local dev)
            let data = null;
            try {
                const resp = await fetch(`api/projects.php?category=${category}&t=${Date.now()}`);
                const ct = resp.headers.get('content-type') || '';
                if (resp.ok && ct.includes('application/json')) {
                    data = await resp.json();
                }
            } catch (_) { /* PHP not available */ }

            if (!data) {
                // Fallback: load from static JSON
                const resp2 = await fetch(`api/projects-fallback.json?t=${Date.now()}`);
                if (resp2.ok) {
                    const all = await resp2.json();
                    data = all[category] || [];
                }
            }
            showcaseProjects = data || [];
        }
    } catch (e) {
        console.warn('Failed to load projects:', e);
        showcaseProjects = [];
    }

    renderProjectList(category);
}

function getTranslatedProjectName(folderName) {
    // Strip leading sorting numbers, spaces, and hyphens (e.g. "01 Muffin" -> "Muffin")
    const cleanName = folderName.replace(/^\d+[\s-]?/, '').trim();

    // Check global scope (set by script.js)
    const lang = window.currentAppLanguage || 'en';
    // Access global translations
    if (window.translations && window.translations[lang]) {
        // We look for key "project.clean_name_in_lowercase"
        const key = 'project.' + cleanName.toLowerCase();
        if (window.translations[lang][key]) {
            return window.translations[lang][key];
        }
    }
    // Fallback to exactly what the clean folder name is
    return cleanName;
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

        // Sort files by numerical prefix (e.g., "1 file.jpg" comes before "2 file.mp4")
        const sortedFiles = [...project.files].sort((a, b) => {
            const numA = parseInt(a.match(/^\d+/)) || 9999;
            const numB = parseInt(b.match(/^\d+/)) || 9999;
            return numA - numB;
        });

        for (const file of sortedFiles) {
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
            } else if (['mp4', 'webm'].includes(ext)) {
                showcaseSlides.push({ type: 'video', src: fileUrl, element: null, rendered: true });

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

    // Eagerly render all remaining PDF pages in background
    preRenderAllPages();
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
        const MAX_DIM = 2048; // Cap at 2K to keep transitions snappy
        const native = page.getViewport({ scale: 1 });
        const scale = Math.min(1.5, MAX_DIM / Math.max(native.width, native.height));
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
        slide.src = canvas.toDataURL('image/jpeg', 0.85);
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

    // Sort files by numerical prefix (e.g., "1 file.jpg" comes before "2 file.mp4")
    const sortedFiles = [...project.files].sort((a, b) => {
        const numA = parseInt(a.match(/^\d+/)) || 9999;
        const numB = parseInt(b.match(/^\d+/)) || 9999;
        return numA - numB;
    });

    for (const file of sortedFiles) {
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
        } else if (['mp4', 'webm'].includes(ext)) {
            tempSlides.push({ type: 'video', src: fileUrl, element: null, rendered: true });
        }
    }
    showcasePreloadedSlides[cacheKey] = tempSlides;
    console.log(`Pre-loaded project: ${project.folder} (${tempSlides.length} slides, page 1 rendered)`);
}


// ─── Render Slide ─────────────────────────────────────────────

function renderSlide(index) {
    if (index < 0 || index >= showcaseSlides.length) return;
    showcaseCurrentSlide = index;
    if (typeof resetZoom === 'function') resetZoom();

    const slide = showcaseSlides[index];

    // If this is an unrendered PDF page, keep current slide visible
    // while rendering the new one silently in the background
    if (slide.type === 'pdf' && !slide.rendered) {
        // Update UI immediately so user sees feedback
        updateIndicators();
        updateCounter();
        updateArrows();

        renderPDFPage(slide).then(() => {
            // Only transition if user hasn't navigated away
            if (showcaseCurrentSlide === index) {
                renderSlideElement(slide, index);
            }
            // Pre-render adjacent pages in background
            preRenderAdjacent(index);
        });
        return;
    }

    renderSlideElement(slide, index);
    // Background render continues via preRenderAllPages()
}

/**
 * Actually puts the slide element into the DOM with transitions.
 */
function renderSlideElement(slide, index) {
    // Remove active state from current slide, pause any videos
    const existing = slideDisplay.querySelectorAll('.slide-item');
    existing.forEach(el => {
        if (el.classList.contains('slide-visible')) {
            el.classList.remove('slide-visible');
            if (el.tagName === 'VIDEO') {
                el.pause();
                el.currentTime = 0;
            }
            setTimeout(() => {
                if (el.parentNode === slideDisplay) el.remove();
            }, 300);
        }
    });

    if (!slide.element) {
        if (slide.type === 'video') {
            const video = document.createElement('video');
            video.src = slide.src;
            video.className = 'slide-item';
            video.autoplay = true;
            video.loop = true;
            video.muted = true;
            video.playsInline = true;
            video.draggable = false;
            video.preload = 'auto';
            slide.element = video;
        } else {
            const img = document.createElement('img');
            img.src = slide.src;
            img.className = 'slide-item';
            img.alt = `Slide ${index + 1}`;
            img.draggable = false;
            slide.element = img;
        }
    } else if (slide.type === 'video') {
        // Re-entering a cached video slide — restart playback
        slide.element.currentTime = 0;
        slide.element.play().catch(() => { });
    }

    const loader = slideDisplay.querySelector('.slide-loading');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 200);
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
 * Eagerly renders ALL unrendered PDF pages in the background.
 * Called once after the first slide is displayed so all pages
 * are ready by the time the user navigates to them.
 */
async function preRenderAllPages() {
    const loadId = currentLoadId; // Snapshot to detect stale renders
    const BATCH = 3; // Render 3 pages in parallel for speed
    for (let i = 0; i < showcaseSlides.length; i += BATCH) {
        if (currentLoadId !== loadId) return;
        const batch = [];
        for (let j = i; j < Math.min(i + BATCH, showcaseSlides.length); j++) {
            const s = showcaseSlides[j];
            if (s.type === 'pdf' && !s.rendered) {
                batch.push(renderPDFPage(s));
            }
        }
        if (batch.length > 0) await Promise.all(batch);
    }
}

/**
 * Pre-renders ±2 adjacent PDF pages around the current index.
 * Called after navigating to a lazy-rendered page so the next
 * slides the user visits are already ready.
 */
async function preRenderAdjacent(index) {
    const loadId = currentLoadId;
    const offsets = [-2, -1, 1, 2];
    for (const offset of offsets) {
        const i = index + offset;
        if (i < 0 || i >= showcaseSlides.length) continue;
        if (currentLoadId !== loadId) return;
        const s = showcaseSlides[i];
        if (s.type === 'pdf' && !s.rendered) {
            await renderPDFPage(s);
        }
    }
}

// ─── Navigation ───────────────────────────────────────────────

function goToSlide(index) {
    if (index < 0 || index >= showcaseSlides.length) return;
    if (index === showcaseCurrentSlide) return; // Already on this slide
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
        const isActive = i === showcaseCurrentSlide;
        dot.classList.toggle('active', isActive);
        if (isActive) {
            dot.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
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
 * Pre-load project list JSON in background for browser cache
 */
async function preloadShowcase() {
    const categories = ['3d', 'design', 'it'];
    let usedPhp = false;

    // Try PHP API first (production)
    for (const cat of categories) {
        try {
            const resp = await fetch(`api/projects.php?category=${cat}`);
            const ct = resp.headers.get('content-type') || '';
            if (resp.ok && ct.includes('application/json')) {
                showcasePreloadedData[cat] = await resp.json();
                usedPhp = true;
            }
        } catch (e) { /* PHP not available */ }
    }

    // Fallback to static JSON (local dev without PHP)
    if (!usedPhp) {
        try {
            const resp = await fetch(`api/projects-fallback.json?t=${Date.now()}`);
            if (resp.ok) {
                const all = await resp.json();
                for (const cat of categories) {
                    showcasePreloadedData[cat] = all[cat] || [];
                }
            }
        } catch (e) { /* ignore */ }
    }

    console.log(`Preloaded projects list (${usedPhp ? 'PHP API' : 'static JSON'}).`);
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

// ─── Zoom & Pan Module ────────────────────────────────────────

(function () {
    let zoomLevel = 1;
    let panX = 0, panY = 0;
    let isDragging = false;
    let dragStartX = 0, dragStartY = 0;
    let startPanX = 0, startPanY = 0;

    // Pinch state
    let lastPinchDist = 0;
    let pinchStartZoom = 1;

    // Swipe state (mobile slide nav)
    let touchStartX = 0;
    let touchStartY = 0;
    let isSwiping = false;

    // Video Scrubbing state
    let isVideoScrubbing = false;
    let videoScrubStartX = 0;
    let videoStartOriginTime = 0;
    let scrubbedVideo = null;

    const MIN_ZOOM = 1;
    const MAX_ZOOM = 5;
    const ZOOM_STEP = 0.15;
    const SWIPE_THRESHOLD = 50; // px

    // ── Expose resetZoom globally so renderSlide can call it ──
    window.resetZoom = function () {
        zoomLevel = 1;
        panX = 0;
        panY = 0;
        applyZoom();
        slideDisplay.classList.remove('zoomed');
    };

    function applyZoom() {
        const slide = slideDisplay.querySelector('.slide-visible');
        if (!slide) return;
        if (zoomLevel <= 1) {
            slide.style.transform = 'scale(1)';
            slideDisplay.classList.remove('zoomed');
        } else {
            slide.style.transform = `scale(${zoomLevel}) translate(${panX}px, ${panY}px)`;
            slideDisplay.classList.add('zoomed');
        }
    }

    function clampPan() {
        // Constrain pan so the image doesn't go too far off-screen
        const maxPan = (zoomLevel - 1) / zoomLevel * 50; // % of half-size
        const rect = slideDisplay.getBoundingClientRect();
        const maxPanX = rect.width * (zoomLevel - 1) / (2 * zoomLevel);
        const maxPanY = rect.height * (zoomLevel - 1) / (2 * zoomLevel);
        panX = Math.max(-maxPanX, Math.min(maxPanX, panX));
        panY = Math.max(-maxPanY, Math.min(maxPanY, panY));
    }

    // ── Mouse Wheel Zoom (PC) ──
    slideDisplay.addEventListener('wheel', (e) => {
        if (!overlay.classList.contains('active')) return;
        e.preventDefault();
        e.stopPropagation();

        const delta = e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP;
        const prevZoom = zoomLevel;
        zoomLevel = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoomLevel + delta));

        if (zoomLevel === MIN_ZOOM) {
            panX = 0;
            panY = 0;
        } else {
            // Adjust pan to keep zoom centered on cursor
            const rect = slideDisplay.getBoundingClientRect();
            const cursorX = (e.clientX - rect.left) / rect.width - 0.5;
            const cursorY = (e.clientY - rect.top) / rect.height - 0.5;
            const zoomDelta = zoomLevel - prevZoom;
            panX -= cursorX * rect.width * zoomDelta / (zoomLevel * zoomLevel) * 0.5;
            panY -= cursorY * rect.height * zoomDelta / (zoomLevel * zoomLevel) * 0.5;
            clampPan();
        }

        applyZoom();
    }, { passive: false });

    // ── Mouse Drag Pan & Scrubbing (PC) ──
    slideDisplay.addEventListener('mousedown', (e) => {
        if (zoomLevel <= 1) {
            // Check if we are clicking on a video for scrubbing
            const slide = slideDisplay.querySelector('.slide-visible');
            if (slide && slide.tagName === 'VIDEO') {
                e.preventDefault();
                isVideoScrubbing = true;
                videoScrubStartX = e.clientX;
                videoStartOriginTime = slide.currentTime;
                scrubbedVideo = slide;
                slide.pause(); // Pause while scrubbing
            }
            return;
        }
        e.preventDefault();
        isDragging = true;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        startPanX = panX;
        startPanY = panY;
    });

    window.addEventListener('mousemove', (e) => {
        if (isVideoScrubbing && scrubbedVideo) {
            e.preventDefault();
            const dx = e.clientX - videoScrubStartX;
            // 1 full window width drag = 1 full rotation (video duration)
            const duration = scrubbedVideo.duration || 1;
            const timeDelta = (dx / window.innerWidth) * duration;
            let newTime = videoStartOriginTime + timeDelta;

            // Loop the video wrapping
            if (newTime < 0) {
                newTime = duration + (newTime % duration);
            } else if (newTime > duration) {
                newTime = newTime % duration;
            }

            scrubbedVideo.currentTime = newTime;
            return;
        }

        if (!isDragging) return;
        const dx = (e.clientX - dragStartX) / zoomLevel;
        const dy = (e.clientY - dragStartY) / zoomLevel;
        panX = startPanX + dx;
        panY = startPanY + dy;
        clampPan();
        applyZoom();
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
        if (isVideoScrubbing && scrubbedVideo) {
            isVideoScrubbing = false;
            scrubbedVideo = null;
        }
    });

    // ── Double-click to reset (PC) ──
    slideDisplay.addEventListener('dblclick', (e) => {
        if (!overlay.classList.contains('active')) return;
        e.preventDefault();
        resetZoom();
    });

    // ── Touch: Pinch Zoom + Pan + Swipe + Scrub ──
    slideDisplay.addEventListener('touchstart', (e) => {
        if (!overlay.classList.contains('active')) return;

        if (e.touches.length === 2) {
            // Pinch start
            e.preventDefault();
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            lastPinchDist = Math.hypot(dx, dy);
            pinchStartZoom = zoomLevel;
            isSwiping = false;
            isVideoScrubbing = false;
        } else if (e.touches.length === 1) {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;

            if (zoomLevel > 1) {
                // Pan start
                e.preventDefault();
                isDragging = true;
                dragStartX = e.touches[0].clientX;
                dragStartY = e.touches[0].clientY;
                startPanX = panX;
                startPanY = panY;
                isSwiping = false;
                isVideoScrubbing = false;
            } else {
                // Potential swipe or scrub
                const slide = slideDisplay.querySelector('.slide-visible');
                if (slide && slide.tagName === 'VIDEO') {
                    // Start scrub instead of swipe
                    isVideoScrubbing = true;
                    videoScrubStartX = e.touches[0].clientX;
                    videoStartOriginTime = slide.currentTime;
                    scrubbedVideo = slide;
                    slide.pause(); // Pause while scrubbing
                    isSwiping = false; // Disable swipe
                } else {
                    isSwiping = true;
                    isVideoScrubbing = false;
                }
            }
        }
    }, { passive: false });

    slideDisplay.addEventListener('touchmove', (e) => {
        if (!overlay.classList.contains('active')) return;

        if (e.touches.length === 2) {
            // Pinch zoom
            e.preventDefault();
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            const dist = Math.hypot(dx, dy);
            const scale = dist / lastPinchDist;
            zoomLevel = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, pinchStartZoom * scale));

            if (zoomLevel === MIN_ZOOM) {
                panX = 0;
                panY = 0;
            }
            clampPan();
            applyZoom();
        } else if (e.touches.length === 1) {
            if (isVideoScrubbing && scrubbedVideo) {
                // Prevent scrolling while scrubbing
                e.preventDefault();
                const dx = e.touches[0].clientX - videoScrubStartX;
                const duration = scrubbedVideo.duration || 1;
                // Double sensitivity for touch feels better
                const timeDelta = (dx / window.innerWidth) * duration * 1.5;
                let newTime = videoStartOriginTime + timeDelta;

                if (newTime < 0) {
                    newTime = duration + (newTime % duration);
                } else if (newTime > duration) {
                    newTime = newTime % duration;
                }

                scrubbedVideo.currentTime = newTime;
            } else if (isDragging && zoomLevel > 1) {
                // Touch pan
                e.preventDefault();
                const dx = (e.touches[0].clientX - dragStartX) / zoomLevel;
                const dy = (e.touches[0].clientY - dragStartY) / zoomLevel;
                panX = startPanX + dx;
                panY = startPanY + dy;
                clampPan();
                applyZoom();
            }
        }
    }, { passive: false });

    slideDisplay.addEventListener('touchend', (e) => {
        isDragging = false;

        if (isVideoScrubbing && scrubbedVideo) {
            isVideoScrubbing = false;
            scrubbedVideo = null;
            // Prevent swipe logic from triggering
            isSwiping = false;
        }

        // Swipe detection (when not zoomed)
        if (isSwiping && e.changedTouches.length === 1 && zoomLevel <= 1) {
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = endX - touchStartX;
            const diffY = endY - touchStartY;

            // Only count horizontal swipes
            if (Math.abs(diffX) > SWIPE_THRESHOLD && Math.abs(diffX) > Math.abs(diffY)) {
                if (diffX < 0) {
                    goToSlide(showcaseCurrentSlide + 1); // Swipe left → next
                } else {
                    goToSlide(showcaseCurrentSlide - 1); // Swipe right → prev
                }
            }
        }
        isSwiping = false;

        // Snap back to 1× if zoomed very slightly
        if (zoomLevel < 1.05) {
            resetZoom();
        }
    });

    // ── Double-tap to reset (mobile) ──
    let lastTapTime = 0;
    slideDisplay.addEventListener('touchend', (e) => {
        if (e.touches.length > 0) return; // Ignore if fingers still down
        const now = Date.now();
        if (now - lastTapTime < 300) {
            e.preventDefault();
            if (zoomLevel > 1) {
                resetZoom();
            } else {
                // Double-tap to zoom in to 2.5×
                zoomLevel = 2.5;
                panX = 0;
                panY = 0;
                applyZoom();
            }
        }
        lastTapTime = now;
    });
})();
