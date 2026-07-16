/* ===================================================================
   GrowthsStack.Dev | AI Systems Engineer Portfolio
   =================================================================== */

// Register GSAP plugins safely
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true });

    // 🚨 NEW: PREVENT FOUC (Set immediate states for cinematic zoom)
    gsap.set([".hero-title", ".hero-subtitle", ".hero-buttons", ".code-typing-widget", ".hero-stats"], { y: 50, opacity: 0 });
    gsap.set("#services", { scale: 1.1, opacity: 0.3, transformOrigin: "top center" });
}

// 🚨 NEW: Cinematic Entrance Timeline
function initCinematicEntrance() {
    if (typeof gsap === 'undefined') return;
    gsap.to([".hero-title", ".hero-subtitle", ".hero-buttons", ".code-typing-widget", ".hero-stats"], {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.15
    });
}

// 🚨 NEW: Cinematic Scroll Transition (Hero -> Services)
function initCinematicScroll() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    const scrollTl = gsap.timeline({
        scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "bottom top",
            scrub: 0.7
        }
    });
    scrollTl.to(".hero-content", { scale: 0.85, y: -50, opacity: 0, ease: "none" })
        .to("#services", { scale: 1, opacity: 1, ease: "none", clearProps: "transform" }, "<");
}

// ==========================================
// PRELOADER & INITIALIZATION
// ==========================================
function hidePreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader && !preloader.classList.contains('hidden')) {
        preloader.classList.add('hidden');
        document.body.classList.remove('no-scroll');
        initAnimations();
        initTerminalTyping();

        // 🚨 Trigger Cinematic Animations after Preloader hides
        initCinematicEntrance();
        initCinematicScroll();
    }
}

window.addEventListener('DOMContentLoaded', () => {
    initTypewriter();
    setTimeout(hidePreloader, 2200);
});
window.addEventListener('load', () => {
    setTimeout(hidePreloader, 1000);
});
// Fallback in case events hang
setTimeout(hidePreloader, 5000);

// ==========================================
// HERO TYPEWRITER HEADLINE
// ==========================================
function initTypewriter() {
    const el = document.getElementById('typewriter-text');
    if (!el) return;

    const phrases = [
        'Building AI Systems That Automate & Scale Businesses',
        'Architecting Scalable Python Backend Pipelines',
        'Engineering Intelligent Vision & NLP Agents',
        'Developing Clinical AI & Smart Dashboards'
    ];

    const TYPE_SPEED = 80;
    const ERASE_SPEED = 40;
    const PAUSE_FULL = 2000;
    const PAUSE_BEFORE_TYPE = 500;

    let phraseIndex = 0;

    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    async function typePhrase(text) {
        el.textContent = '';
        for (let i = 0; i < text.length; i++) {
            el.textContent += text.charAt(i);
            await wait(TYPE_SPEED);
        }
    }

    async function erasePhrase() {
        while (el.textContent.length > 0) {
            await wait(ERASE_SPEED);
            el.textContent = el.textContent.slice(0, -1);
        }
    }

    async function runTypewriter() {
        while (true) {
            await typePhrase(phrases[phraseIndex]);
            await wait(PAUSE_FULL);
            await erasePhrase();
            phraseIndex = (phraseIndex + 1) % phrases.length;
            await wait(PAUSE_BEFORE_TYPE);
        }
    }

    runTypewriter();
}

// ==========================================
// CURSOR & AMBIENT LIGHT
// ==========================================
const cursorGlow = document.getElementById('cursorGlow');
const ambientLight = document.getElementById('ambientLight');
let mouseX = 0, mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Smooth cursor follow
    gsap.to(cursorGlow, {
        x: mouseX,
        y: mouseY,
        duration: 0.1,
        ease: "power2.out"
    });

    // Ambient light follow
    gsap.to(ambientLight, {
        x: mouseX,
        y: mouseY,
        duration: 0.8,
        ease: "power2.out"
    });
});

if ('ontouchstart' in window) {
    cursorGlow.style.display = 'none';
    ambientLight.style.display = 'none';
}

// ==========================================
// MAGNETIC BUTTONS
// ==========================================
const magneticElements = document.querySelectorAll('.magnetic');
magneticElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        if (typeof gsap !== 'undefined') {
            gsap.to(el, { x: x * 0.4, y: y * 0.4, duration: 0.3, ease: "power2.out" });
        }
    });
    el.addEventListener('mouseleave', () => {
        if (typeof gsap !== 'undefined') {
            gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
        }
    });
});

// ==========================================
// NAVBAR (throttled — no layout thrash)
// ==========================================
const navbar = document.getElementById('navbar');
let navTicking = false;
window.addEventListener('scroll', () => {
    if (navTicking) return;
    navTicking = true;
    requestAnimationFrame(() => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
        navTicking = false;
    });
}, { passive: true });

// ==========================================
// SMOOTH ANCHOR SCROLL (GSAP — no CSS smooth)
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (!targetId || targetId === '#') return;
        const target = document.querySelector(targetId);
        if (!target) return;
        e.preventDefault();
        if (typeof gsap !== 'undefined') {
            const scrollObj = { y: window.scrollY };
            const top = target.getBoundingClientRect().top + window.scrollY - 80;
            gsap.to(scrollObj, {
                y: top,
                duration: 0.55,
                ease: 'power2.out',
                onUpdate: () => window.scrollTo(0, scrollObj.y)
            });
        } else {
            target.scrollIntoView({ behavior: 'auto', block: 'start' });
        }
    });
});

// ==========================================
// CANVAS ENGINE (shared RAF loop, pause on hidden tab)
// ==========================================
const PARTICLE_COUNT = 35;
const NEURAL_NODE_COUNT = 20;
const NEURAL_LINK_DIST = 150;
const NEURAL_LINK_DIST_SQ = NEURAL_LINK_DIST * NEURAL_LINK_DIST;
let canvasActive = !document.hidden;

document.addEventListener('visibilitychange', () => {
    canvasActive = !document.hidden;
    if (canvasActive) startCanvasLoop();
});

const pCanvas = document.getElementById('particlesCanvas');
const pCtx = pCanvas.getContext('2d', { alpha: true });
let particles = [];

function resizeCanvas() {
    pCanvas.width = window.innerWidth;
    pCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas, { passive: true });
resizeCanvas();

class Particle {
    constructor() {
        this.x = Math.random() * pCanvas.width;
        this.y = Math.random() * pCanvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > pCanvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > pCanvas.height) this.vy *= -1;
    }
    draw() {
        pCtx.fillRect(this.x, this.y, this.size, this.size);
    }
}
for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());
pCtx.fillStyle = 'rgba(0, 240, 255, 0.2)';

// ==========================================
// NEURAL CANVAS (Hero — squared-distance, batched strokes)
// ==========================================
const nCanvas = document.getElementById('neuralCanvas');
const nCtx = nCanvas.getContext('2d', { alpha: true });
let nodes = [];

function resizeNeural() {
    nCanvas.width = nCanvas.parentElement.offsetWidth;
    nCanvas.height = nCanvas.parentElement.offsetHeight;
}
window.addEventListener('resize', resizeNeural, { passive: true });
resizeNeural();

for (let i = 0; i < NEURAL_NODE_COUNT; i++) {
    nodes.push({
        x: Math.random() * nCanvas.width,
        y: Math.random() * nCanvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4
    });
}

function drawNeural() {
    nCtx.clearRect(0, 0, nCanvas.width, nCanvas.height);
    nCtx.beginPath();

    for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
            const b = nodes[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const distSq = dx * dx + dy * dy;
            if (distSq < NEURAL_LINK_DIST_SQ) {
                const alpha = 0.1 * (1 - Math.sqrt(distSq) / NEURAL_LINK_DIST);
                nCtx.strokeStyle = `rgba(123, 47, 255, ${alpha})`;
                nCtx.moveTo(a.x, a.y);
                nCtx.lineTo(b.x, b.y);
            }
        }
    }
    nCtx.stroke();

    nCtx.fillStyle = 'rgba(0, 240, 255, 0.4)';
    nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > nCanvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > nCanvas.height) node.vy *= -1;
        nCtx.beginPath();
        nCtx.arc(node.x, node.y, 2, 0, Math.PI * 2);
        nCtx.fill();
    });
}

function drawParticles() {
    pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
}

let canvasRafId = null;
function canvasLoop() {
    if (!canvasActive) {
        canvasRafId = null;
        return;
    }
    drawParticles();
    drawNeural();
    canvasRafId = requestAnimationFrame(canvasLoop);
}
function startCanvasLoop() {
    if (canvasRafId === null) canvasRafId = requestAnimationFrame(canvasLoop);
}
startCanvasLoop();

// ==========================================
// DATA POPULATION (Services - SEO Optimized)
// ==========================================
const services = [
    { slug: 'ai-chatbots', icon: 'fa-robot', title: 'AI Chatbots', desc: 'Intelligent conversational agents for customer support and sales.' },
    { slug: 'ai-agents', icon: 'fa-brain', title: 'AI Agents', desc: 'Autonomous systems capable of executing complex multi-step workflows.' },
    { slug: 'ai-saas-platforms', icon: 'fa-cloud', title: 'AI SaaS Platforms', desc: 'End-to-end scalable web applications powered by LLMs.' },
    { slug: 'automation-systems', icon: 'fa-cogs', title: 'Automation Systems', desc: 'Streamlining operations by connecting APIs and eliminating manual work.' },
    { slug: 'api-architectures', icon: 'fa-network-wired', title: 'API Architectures', desc: 'High-performance, secure backend REST/GraphQL APIs.' },
    { slug: 'dashboard-systems', icon: 'fa-chart-line', title: 'Dashboard Systems', desc: 'Real-time data visualization and analytics platforms.' },
    { slug: 'backend-systems', icon: 'fa-server', title: 'Backend Systems', desc: 'Robust server architecture using Python, FastAPI, and Docker.' },
    { slug: 'growth-automation', icon: 'fa-rocket', title: 'Growth Automation', desc: 'Automated outreach, lead generation, and CRM integrations.' },
    { slug: 'social-media-systems', icon: 'fa-share-nodes', title: 'Social Media Systems', desc: 'Algorithmic content generation and auto-posting pipelines.' },
    { slug: 'meta-ads-automation', icon: 'fa-ad', title: 'Meta Ads Automation', desc: 'Programmatic ad campaign management and optimization.' }
];

const projects = [
    {
        cat: 'AI Analytics', title: 'MatchAI Resume Analyzer',
        prob: 'Candidates guess what recruiters want and struggle to land interviews.',
        sol: 'Industry-leading AI analyzes resumes against job descriptions to secure offers.',
        impact: 'Trusted by 50,000+ Verified Professionals.',
        tags: ['Next.js', 'Vercel', 'AI Analytics', 'Tailwind'],
        link: 'https://talha-ai-resume-matcher.vercel.app/', github: '#',
        image: 'images/matchai.png',
        webp: 'images/matchai.webp'
    },
    {
        cat: 'AI Computer Vision', title: 'Lumina AI',
        prob: 'Low-quality photos require complex tools and hours to enhance.',
        sol: 'Professional AI image enhancement in seconds. Upscale, sharpen, and restore photos with DSLR-level quality.',
        impact: 'Enhance digital memories instantly.',
        tags: ['Next.js', 'Vercel', 'AI Vision', 'Tailwind'],
        link: 'https://talha-ai-image-enhancer.vercel.app/', github: '#',
        image: 'images/lumina.png',
        webp: 'images/lumina.webp'
    },
    {
        cat: 'AI Dashboards', title: 'FoundrIQ Platform',
        prob: 'Startup idea validation was slow and subjective.',
        sol: 'Developed an AI platform generating SWOT, risk, and revenue models in seconds.',
        impact: 'Helped 500+ founders validate ideas instantly.',
        tags: ['Next.js', 'Vercel', 'OpenAI', 'Tailwind'],
        link: 'https://foundriq-platform-myvj.vercel.app/', github: '#',
        image: 'images/foundriq.png',
        webp: 'images/foundriq.webp'
    },
    {
        cat: 'Healthcare AI', title: 'MedAnalyze AI',
        prob: 'Reading medical reports was tedious for patients.',
        sol: 'AI pipeline that extracts entities, detects risks, and simplifies medical jargon.',
        impact: 'Processed 10k+ reports with 99% extraction accuracy.',
        tags: ['FastAPI', 'NLP', 'Docker', 'React'],
        link: 'https://ai-medical-report-analyzer-project.vercel.app/', github: '#',
        image: 'images/medanalyze.png',
        webp: 'images/medanalyze.webp'
    }
];



const reviews = [
    { name: 'Alex Morgan', rating: 5, text: 'Excellent AI automation work. Delivered beyond expectations.' },
    { name: 'Sarah Chen', rating: 5, text: 'Professional full stack engineering. Highly recommended.' },
    { name: 'David Kumar', rating: 5, text: 'Amazing chatbot development. Clients love the experience.' },
    { name: 'Maria Santos', rating: 5, text: 'Best AI systems engineer I have worked with. 10/10.' }
];

// Populate Services
const sGrid = document.querySelector('.services-grid');
if (sGrid) {
    sGrid.innerHTML = ''; // Clear previous content
    services.forEach(s => {
        // Render as SEO-friendly <a> tags pointing to dedicated service pages
        sGrid.innerHTML += `
            <a href="services/${s.slug}.html" class="service-card" data-tilt>
                <i class="fas ${s.icon} service-icon"></i>
                <h3 class="service-title">${s.title}</h3>
                <p>${s.desc}</p>
            </a>`;
    });
}

// Populate Projects
const pGrid = document.getElementById('projects-grid');
projects.forEach(p => {
    const imageHTML = p.image
        ? `<picture>
            <source srcset="${p.webp}" type="image/webp">
            <img src="${p.image}" alt="${p.title}" class="p-img" loading="lazy" decoding="async" width="280" height="150">
           </picture>`
        : `<i class="fas fa-laptop-code"></i>`;

    const href = p.link !== '#' ? p.link : '#';
    const target = p.link !== '#' ? '_blank' : '_self';
    const rel = p.link !== '#' ? ' rel="noopener noreferrer"' : '';

    pGrid.innerHTML += `
        <a href="${href}" target="${target}"${rel} class="project-card magnetic">
            <div class="project-image">${imageHTML}</div>
            <h3 class="project-title">${p.title}</h3>
        </a>`;
});

// Duplicate for infinite scroll
pGrid.innerHTML += pGrid.innerHTML;



// Populate Reviews
const rTrack = document.getElementById('review-track');
reviews.forEach(r => {
    rTrack.innerHTML += `
        <div class="review-card">
            <div class="review-header">
                <div class="avatar">${r.name.charAt(0)}</div>
                <div>
                    <h4 style="font-size:15px;">${r.name}</h4>
                    <div class="stars">★★★★★</div>
                </div>
            </div>
            <p class="review-text">"${r.text}"</p>
        </div>`;
});
// Duplicate for infinite scroll
rTrack.innerHTML += rTrack.innerHTML;

// ==========================================
// 3D TILT EFFECT
// ==========================================
document.querySelectorAll('[data-tilt]').forEach(el => {
    el.addEventListener('mousemove', e => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `perspective(1000px) rotateY(${x / 20}deg) rotateX(${-y / 20}deg) translate3d(0, -5px, 0)`;
    });
    el.addEventListener('mouseleave', () => {
        el.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) translate3d(0, 0, 0)';
    });
});

// ==========================================
// GSAP & SCROLL ANIMATIONS
// ==========================================
function initAnimations() {
    if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
    }

    // Safety: Ignore hero elements if they accidentally have data-animate
    const elements = document.querySelectorAll('[data-animate]:not(.hero-title):not(.hero-subtitle):not(.hero-buttons):not(.hero-stats)');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;

                setTimeout(() => {
                    if (typeof gsap !== 'undefined') {
                        gsap.fromTo(entry.target,
                            { y: 24, opacity: 0 },
                            { y: 0, opacity: 1, duration: 0.5, ease: "power2.out", force3D: true }
                        );
                    }
                    entry.target.style.opacity = 1;
                }, delay);

                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    elements.forEach(el => observer.observe(el));

    // Stats Counters
    const counters = document.querySelectorAll('.stat-number');
    const statObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = +entry.target.getAttribute('data-count');
                if (typeof gsap !== 'undefined') {
                    gsap.to(entry.target, {
                        innerHTML: target,
                        duration: 2,
                        snap: { innerHTML: 1 },
                        ease: "power2.out"
                    });
                } else {
                    entry.target.innerHTML = target;
                }
                statObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(c => statObserver.observe(c));


}

// ==========================================
// TERMINAL TYPING EFFECT
// ==========================================
function initTerminalTyping() {
    const term = document.getElementById('terminal-body');
    if (!term) return;

    const lines = [
        "> Initializing GrowthsStack.Dev AI Stack...",
        "> Loading: Python · FastAPI · Docker · Redis",
        "> Connecting: Vector Databases · LLM APIs",
        "> Status: All systems operational <span style='color:#27c93f'>✓</span>"
    ];

    let currentLine = 0;

    function typeLine() {
        if (currentLine >= lines.length) return;

        const div = document.createElement('div');
        div.style.marginBottom = '8px';
        term.appendChild(div);

        let text = lines[currentLine];
        let charIndex = 0;

        // Quick simulate typing
        div.innerHTML = text; // Just paste it instantly for performance, but stagger lines
        if (typeof gsap !== 'undefined') {
            gsap.from(div, { opacity: 0, x: -10, duration: 0.2 });
        }

        currentLine++;
        setTimeout(typeLine, 800);
    }

    const termObserver = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            typeLine();
            termObserver.disconnect();
        }
    }, { threshold: 0.5 });

    termObserver.observe(document.querySelector('.terminal-ui'));
}

// ==========================================
// SCALABLE LAZY-LOADED RAG ENGINE
// ==========================================
const chatToggleBtn = document.getElementById('chat-toggle-btn');
const closeChatBtn = document.getElementById('close-chat');
const chatWindow = document.getElementById('chat-window');
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const chatSendBtn = document.getElementById('chat-send-btn');

// ==========================================
// ENTERPRISE 25-NODE KNOWLEDGE GRAPH RAG
// ==========================================
let portfolioKB = [];
let isKBLoaded = false;

// Complete 25-File Knowledge Structure
const knowledgeModules = [
    './json/01_about.json', './json/02_services.json', './json/03_ai_chatbots.json',
    './json/04_ai_agents.json', './json/05_ai_saas.json', './json/06_automation.json',
    './json/07_backend.json', './json/08_api.json', './json/09_projects.json',
    './json/10_process.json', './json/11_pricing.json', './json/12_contact.json',
    './json/13_reviews.json', './json/14_faq.json', './json/15_general.json',
    './json/16_intents.json', './json/17_synonyms.json', './json/18_spelling_variations.json',
    './json/19_conversations.json', './json/20_examples.json', './json/21_industries.json',
    './json/22_integrations.json', './json/23_tools.json', './json/24_errors.json',
    './json/25_prompt_rules.json'
];

// ==========================================
// DEEP TEXT OMNI-PARSER & RAG ENGINE
// ==========================================
async function loadKnowledgeBase() {
    if (!isKBLoaded) {
        try {
            const fetchPromises = knowledgeModules.map(modulePath =>
                fetch(modulePath).then(async res => {
                    if (!res.ok) return [];
                    try {
                        const rawData = await res.json();
                        let extracted = [];

                        // 1. Handle Flat Array Structure
                        if (Array.isArray(rawData)) {
                            rawData.forEach(item => {
                                if (item.answer) {
                                    const kws = (item.keywords || []).join(" ") + " " + (item.question || "");
                                    extracted.push({ text: kws.toLowerCase(), answer: item.answer });
                                }
                            });
                        }
                        // 2. Handle Complex Nested Structure (faqs, knowledge, variations)
                        else if (typeof rawData === 'object' && rawData !== null) {

                            // Consolidate global variations and keywords
                            let globalText = "";
                            if (rawData.variations) {
                                globalText += " " + (Array.isArray(rawData.variations) ? rawData.variations.join(" ") : Object.values(rawData.variations).flat().join(" "));
                            }
                            if (rawData.keywords && Array.isArray(rawData.keywords)) {
                                globalText += " " + rawData.keywords.join(" ");
                            }
                            globalText = globalText.toLowerCase().replace(/[^\w\s]/gi, '');

                            // To avoid collision, inject global variations heavily into the primary knowledge node
                            let isFirstNode = true;

                            if (Array.isArray(rawData.knowledge)) {
                                rawData.knowledge.forEach(k => {
                                    if (k.content) {
                                        let text = (k.title || "") + " " + (k.topic || "");
                                        if (isFirstNode) { text += " " + globalText; isFirstNode = false; }
                                        extracted.push({ text: text.toLowerCase(), answer: k.content });
                                    }
                                });
                            }
                            if (Array.isArray(rawData.faqs)) {
                                rawData.faqs.forEach(faq => {
                                    if (faq.answer) {
                                        let text = (faq.question || "");
                                        // If knowledge array was empty, attach globals to the first FAQ
                                        if (isFirstNode) { text += " " + globalText; isFirstNode = false; }
                                        extracted.push({ text: text.toLowerCase(), answer: faq.answer });
                                    }
                                });
                            }
                        }
                        return extracted;
                    } catch (e) { return []; } // Silently skip syntax errors
                }).catch(e => [])
            );

            const results = await Promise.all(fetchPromises);
            portfolioKB = results.flat().filter(item => item && item.answer && item.text);
            isKBLoaded = true;
            console.log(`✅ Deep Parser Active: Loaded ${portfolioKB.length} Context Nodes from 25 files.`);
        } catch (error) {
            console.error("Critical failure.", error);
        }
    }
}

// Toggle Chat Window & Trigger Lazy Load
function toggleChat() {
    chatWindow.classList.toggle('active');
    if (chatWindow.classList.contains('active')) {
        chatInput.focus();
        loadKnowledgeBase(); // Fetches the 2000+ Q&A file only when opened
    }
}
if (chatToggleBtn) chatToggleBtn.addEventListener('click', toggleChat);
if (closeChatBtn) closeChatBtn.addEventListener('click', toggleChat);

// Deep Padded String Retrieval Logic
function retrieveRAGAnswer(query) {
    if (!isKBLoaded || portfolioKB.length === 0) return "My knowledge base is booting up... Please try again in a second!";

    let nQuery = query.toLowerCase().trim().replace(/[?.,!]/g, '');
    if (!nQuery) return "Please ask me something!";

    // Filter out very short words like 'is', 'to' to stop false positive matches
    const queryWords = nQuery.split(' ').filter(w => w.length > 2);

    let bestMatch = "I am the AI built by Muhammad Talha Ansari. I couldn't find an exact match in my data, but you can reach him directly via the contact form!";
    let maxScore = 0;

    for (const doc of portfolioKB) {
        let score = 0;
        // Pad text with spaces for accurate whole-word boundary matching
        const paddedDocText = " " + doc.text.replace(/[^\w\s]/gi, '') + " ";

        // 1. Direct Full Phrase Match (Super High Priority for exact sentences like "ap kon ho")
        if (paddedDocText.includes(" " + nQuery + " ")) {
            score += 50;
        }

        // 2. Cumulative Word-by-Word Scoring
        for (const word of queryWords) {
            if (paddedDocText.includes(" " + word + " ")) {
                score += 5; // Exact word match
            } else if (paddedDocText.includes(word)) {
                score += 1; // Partial/Typo match
            }
        }

        // Require at least a strong match (score >= 5) to override the default fallback
        if (score > maxScore && score >= 5) {
            maxScore = score;
            bestMatch = doc.answer;
        }
    }

    // Strict Hardcoded Fallback for basic greetings
    if (maxScore < 5 && /^(hi|hey|hello|salam|assalam|greetings)$/i.test(nQuery)) {
        return "Hello! Welcome to GrowthsStack.Dev. How can I help you with AI development, SaaS, backend engineering, or software projects today?";
    }

    return bestMatch;
}

function appendMessage(text, sender) {
    if (!chatMessages) return;
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);
    msgDiv.innerHTML = `<div class="message-content">${text}</div>`;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function handleSend() {
    if (!chatInput || !chatMessages) return;
    const text = chatInput.value.trim();
    if (!text) return;

    appendMessage(text, 'user');
    chatInput.value = '';

    const typingId = 'typing-' + Date.now();
    const typingDiv = document.createElement('div');
    typingDiv.classList.add('message', 'bot');
    typingDiv.id = typingId;
    typingDiv.innerHTML = `<div class="message-content" style="background: transparent; border: none; color: var(--cyan); font-style: italic;">Typing...</div>`;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    setTimeout(() => {
        const typingElement = document.getElementById(typingId);
        if (typingElement) typingElement.remove();
        const botReply = retrieveRAGAnswer(text);
        appendMessage(botReply, 'bot');
    }, 400); // Super fast 400ms response time
}

if (chatSendBtn && chatInput) {
    chatSendBtn.addEventListener('click', handleSend);
    chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSend(); });
}

// ==========================================
// REVIEW FORM
// ==========================================
const starRating = document.getElementById('starRating');
let currentRating = 5;

if (starRating) {
    const stars = starRating.querySelectorAll('i');
    stars.forEach(star => {
        star.classList.add('active'); // Default 5
        star.addEventListener('click', () => {
            currentRating = star.getAttribute('data-val');
            stars.forEach(s => {
                s.classList.toggle('active', s.getAttribute('data-val') <= currentRating);
            });
        });
    });
}

document.getElementById('reviewForm').addEventListener('submit', e => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const origText = btn.innerText;

    btn.innerText = "Submitting...";

    setTimeout(() => {
        btn.innerText = "Review Added! ✓";
        btn.style.background = "var(--green)";
        e.target.reset();
        stars.forEach(s => s.classList.add('active'));

        setTimeout(() => {
            btn.innerText = origText;
            btn.style.background = "var(--gradient-main)";
        }, 3000);
    }, 1500);
});

// ==========================================
// ORBIT RADAR LOGIC
// ==========================================
const radarData = [
    "Defining business goals & AI strategy.",
    "Designing scalable backend architectures.",
    "Writing robust & efficient code.",
    "Seamless Docker & Cloud deployments.",
    "24/7 maintenance & system monitoring."
];

const radarBtns = document.querySelectorAll('.radar-btn');
const radarNodes = document.querySelectorAll('.r-node');
const radarDesc = document.getElementById('radar-desc');

function updateRadar(index) {
    // Remove active classes
    radarBtns.forEach(btn => btn.classList.remove('active'));
    radarNodes.forEach(node => node.classList.remove('active'));

    // Add active to current
    document.querySelector(`.radar-btn[data-index="${index}"]`).classList.add('active');
    document.querySelector(`.r-node[data-index="${index}"]`).classList.add('active');

    // Animate Text Change smoothly
    if (typeof gsap !== 'undefined') {
        gsap.to(radarDesc, {
            opacity: 0, y: 10, duration: 0.2,
            onComplete: () => {
                radarDesc.innerText = radarData[index];
                gsap.to(radarDesc, { opacity: 1, y: 0, duration: 0.3 });
            }
        });
    } else {
        radarDesc.innerText = radarData[index];
    }
}

// Add Event Listeners
radarBtns.forEach(btn => {
    btn.addEventListener('mouseenter', () => updateRadar(btn.getAttribute('data-index')));
    btn.addEventListener('click', () => updateRadar(btn.getAttribute('data-index')));
});
radarNodes.forEach(node => {
    node.addEventListener('mouseenter', () => updateRadar(node.getAttribute('data-index')));
    node.addEventListener('click', () => updateRadar(node.getAttribute('data-index')));
});

// ==========================================
// FAQ ACCORDION + GSAP ANIMATION LOGIC
// ==========================================
document.querySelectorAll('.faq-card').forEach(card => {
    card.addEventListener('click', () => {
        const body = card.querySelector('.faq-body');
        const isActive = card.classList.contains('active');

        // Close all active cards first (Accordion Style)
        document.querySelectorAll('.faq-card').forEach(c => {
            c.classList.remove('active');
            c.querySelector('.faq-body').style.maxHeight = null;
        });

        // Toggle current card
        if (!isActive) {
            card.classList.add('active');
            // Explicitly set dynamic max-height for ultra-smooth rendering
            body.style.maxHeight = body.scrollHeight + "px";

            if (typeof gsap !== 'undefined') {
                gsap.fromTo(card.querySelector('.faq-content'),
                    { opacity: 0, y: -10 },
                    { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }
                );
            }
        }
    });
});

// ==========================================
// ULTIMATE SCROLL PERFORMANCE OPTIMIZER
// ==========================================
let scrollTimeout;
window.addEventListener('scroll', function () {
    // Add class when scrolling starts
    if (!document.body.classList.contains('is-scrolling')) {
        document.body.classList.add('is-scrolling');
    }

    // Clear timeout throughout the scroll
    clearTimeout(scrollTimeout);

    // Remove class 150ms after scrolling stops
    scrollTimeout = setTimeout(function () {
        document.body.classList.remove('is-scrolling');
    }, 150);
}, { passive: true }); // 'passive: true' prevents JS from blocking the scroll thread

// ==========================================
// PRELOADER GHOST-KILLER (FAIL-SAFE)
// ==========================================
window.addEventListener('load', function() {
    // Wait 1.5 seconds to allow any existing fade-out animations to finish beautifully
    setTimeout(function() {
        // Target all common preloader class/id names
        const preloaders = document.querySelectorAll('#preloader, .preloader, #loader, .loader, .loader-wrapper, [data-preloader]');
        
        preloaders.forEach(function(loader) {
            loader.style.display = 'none'; // Stop background CSS animations instantly
            loader.remove(); // completely remove from DOM to free CPU/GPU VRAM
        });

        // Ensure body scrolling is forcefully unlocked
        document.body.style.overflowX = 'clip';
        document.body.style.overflowY = 'visible';
        document.body.style.pointerEvents = 'auto';
    }, 1500);
});

setTimeout(() => {
    const preloader = document.querySelector('#preloader, .preloader, .loader-wrapper');
    if(preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => preloader.style.display = 'none', 500);
        document.body.style.overflow = 'auto'; // ensure scrolling is restored
    }
}, 3000);

// ==========================================
// BULLETPROOF SMOOTH SCROLLING
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    try {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                // Ignore dummy links
                if (targetId === '#' || targetId === '') return; 
                
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    e.preventDefault(); // Stop normal jump
                    
                    // Calculate header height if you have a fixed navbar (adjust 80 if needed)
                    const headerOffset = 80; 
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });

// ==========================================
// AI CHATBOT FRONTEND LOGIC
// ==========================================
        const chatToggleBtn = document.getElementById('chat-toggle-btn');
        const chatWidget = document.getElementById('ai-chat-widget');
        const closeChatBtn = document.getElementById('close-chat');
        const sendChatBtn = document.getElementById('send-chat');
        const chatInput = document.getElementById('chat-input');
        const chatMessages = document.getElementById('chat-messages');

        // Persistent Session Memory
        let sessionId = localStorage.getItem('growthsstack_chat_session');
        if (!sessionId) {
            sessionId = Math.random().toString(36).substring(2, 15);
            localStorage.setItem('growthsstack_chat_session', sessionId);
        }
        window.chatSessionId = sessionId;

        if(chatToggleBtn && chatWidget) {
            chatToggleBtn.addEventListener('click', () => {
                chatWidget.classList.remove('chat-hidden');
                chatWidget.classList.add('chat-visible');
            });

            closeChatBtn.addEventListener('click', () => {
                chatWidget.classList.remove('chat-visible');
                chatWidget.classList.add('chat-hidden');
            });
        }

        async function sendMessage() {
            const chatInput = document.getElementById('chat-input');
            const chatMessages = document.getElementById('chat-messages');
            
            if (!chatInput || !chatMessages) return;
            
            const message = chatInput.value.trim();
            if (!message) return;

            // 1. Display user message
            chatMessages.innerHTML += `<div style="text-align: right; margin-bottom: 10px;"><span style="background: rgba(0, 229, 255, 0.15); color: #fff; padding: 10px 14px; border-radius: 12px 12px 0 12px; display: inline-block; max-width: 85%; line-height: 1.4;">${message}</span></div>`;
            chatInput.value = '';
            chatMessages.scrollTop = chatMessages.scrollHeight;

            // 2. Show typing indicator
            const typingId = 'typing-' + Date.now();
            chatMessages.innerHTML += `<div id="${typingId}" style="text-align: left; margin-bottom: 10px;"><span style="background: rgba(255, 255, 255, 0.05); color: #aaa; padding: 10px 14px; border-radius: 12px 12px 12px 0; display: inline-block; font-style: italic;">GrowthsStack AI is thinking...</span></div>`;
            chatMessages.scrollTop = chatMessages.scrollHeight;

            try {
                // 3. Call the Python backend (Groq API)
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ session_id: window.chatSessionId, message: message })
                });

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();

                // 4. Remove typing indicator & show actual AI response
                document.getElementById(typingId).remove();
                chatMessages.innerHTML += `<div style="text-align: left; margin-bottom: 10px;"><span style="background: rgba(255, 255, 255, 0.1); color: #fff; padding: 10px 14px; border-radius: 12px 12px 12px 0; display: inline-block; max-width: 85%; line-height: 1.4; border: 1px solid rgba(0, 229, 255, 0.2);">${data.reply}</span></div>`;
                chatMessages.scrollTop = chatMessages.scrollHeight;

            } catch (error) {
                document.getElementById(typingId).remove();
                chatMessages.innerHTML += `<div style="text-align: left; margin-bottom: 10px;"><span style="color: #ff4a4a; font-size: 0.9em; border: 1px solid rgba(255, 74, 74, 0.3); padding: 8px; border-radius: 8px; display: inline-block;">Backend disconnected. Ensure Python uvicorn is running.</span></div>`;
                console.error("Backend Connection Error:", error);
            }
        }

        // Ensure event listeners are attached only once
        const sendBtn = document.getElementById('send-chat');
        const inputField = document.getElementById('chat-input');

        if (sendBtn) {
            sendBtn.replaceWith(sendBtn.cloneNode(true)); // remove old listeners
            document.getElementById('send-chat').addEventListener('click', sendMessage);
        }
        if (inputField) {
            inputField.replaceWith(inputField.cloneNode(true)); // remove old listeners
            document.getElementById('chat-input').addEventListener('keypress', (e) => {
                if (e.key === 'Enter') sendMessage();
            });
        }

// Quick Questions Logic
const quickBtns = document.querySelectorAll('.quick-btn');
const quickQuestionsContainer = document.getElementById('quick-questions');

quickBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Set input value to the button's text
        const chatInput = document.getElementById('chat-input');
        chatInput.value = btn.innerText;
        
        // Hide the quick questions permanently for this session
        quickQuestionsContainer.style.display = 'none';
        
        // Trigger the send message function
        if(typeof sendMessage === 'function') {
            sendMessage();
        }
    });
});

// Mobile Menu Toggle Logic
const menuBtn = document.querySelector('.mobile-menu-btn');
const navLinksContainer = document.querySelector('.nav-links');

if (menuBtn && navLinksContainer) {
    // Clone to remove previously attached listeners
    const newMenuBtn = menuBtn.cloneNode(true);
    menuBtn.replaceWith(newMenuBtn);
    
    newMenuBtn.addEventListener('click', (e) => {
        e.preventDefault();
        navLinksContainer.classList.toggle('active');
        
        // Optional: Change hamburger to an 'X' when open
        if(navLinksContainer.classList.contains('active')) {
            newMenuBtn.innerHTML = '✖'; 
        } else {
            newMenuBtn.innerHTML = '☰';
        }
    });
}

    } catch (error) {
        console.error("Non-fatal error in injected modules:", error);
    }
});
