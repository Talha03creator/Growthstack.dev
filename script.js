/* ===================================================================
   Growthstack.dev | AI Systems Engineer Portfolio
   =================================================================== */

// Register GSAP plugins safely
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

// ==========================================
// PRELOADER & INITIALIZATION
// ==========================================
function hidePreloader() {
    const preloader = document.getElementById('preloader');
    if(preloader && !preloader.classList.contains('hidden')) {
        preloader.classList.add('hidden');
        document.body.classList.remove('no-scroll');
        initAnimations();
        initTerminalTyping();
    }
}

window.addEventListener('DOMContentLoaded', () => {
    setTimeout(hidePreloader, 2200);
});
window.addEventListener('load', () => {
    setTimeout(hidePreloader, 1000);
});
// Fallback in case events hang
setTimeout(hidePreloader, 5000);

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
// NAVBAR
// ==========================================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ==========================================
// PARTICLES CANVAS (Background)
// ==========================================
const pCanvas = document.getElementById('particlesCanvas');
const pCtx = pCanvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    pCanvas.width = window.innerWidth;
    pCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
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
        pCtx.beginPath();
        pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        pCtx.fillStyle = 'rgba(0, 240, 255, 0.2)';
        pCtx.fill();
    }
}
for (let i = 0; i < 50; i++) particles.push(new Particle());

function animateParticles() {
    pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
}
animateParticles();

// ==========================================
// NEURAL CANVAS (Hero)
// ==========================================
const nCanvas = document.getElementById('neuralCanvas');
const nCtx = nCanvas.getContext('2d');
let nodes = [];

function resizeNeural() {
    nCanvas.width = nCanvas.parentElement.offsetWidth;
    nCanvas.height = nCanvas.parentElement.offsetHeight;
}
window.addEventListener('resize', resizeNeural);
resizeNeural();

for(let i=0; i<30; i++) {
    nodes.push({
        x: Math.random() * nCanvas.width,
        y: Math.random() * nCanvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5
    });
}

function animateNeural() {
    nCtx.clearRect(0, 0, nCanvas.width, nCanvas.height);
    
    // Connections
    for(let i=0; i<nodes.length; i++) {
        for(let j=i+1; j<nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            if(dist < 150) {
                nCtx.beginPath();
                nCtx.strokeStyle = `rgba(123, 47, 255, ${0.1 * (1 - dist/150)})`;
                nCtx.moveTo(nodes[i].x, nodes[i].y);
                nCtx.lineTo(nodes[j].x, nodes[j].y);
                nCtx.stroke();
            }
        }
    }
    
    // Nodes
    nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;
        if(node.x < 0 || node.x > nCanvas.width) node.vx *= -1;
        if(node.y < 0 || node.y > nCanvas.height) node.vy *= -1;
        
        nCtx.beginPath();
        nCtx.arc(node.x, node.y, 2, 0, Math.PI*2);
        nCtx.fillStyle = 'rgba(0, 240, 255, 0.4)';
        nCtx.fill();
    });
    
    requestAnimationFrame(animateNeural);
}
animateNeural();

// ==========================================
// DATA POPULATION (Services, Projects, etc)
// ==========================================
const services = [
    { icon: 'fa-robot', title: 'AI Chatbots', desc: 'Intelligent conversational agents for customer support and sales.' },
    { icon: 'fa-brain', title: 'AI Agents', desc: 'Autonomous systems capable of executing complex multi-step workflows.' },
    { icon: 'fa-cloud', title: 'AI SaaS Platforms', desc: 'End-to-end scalable web applications powered by LLMs.' },
    { icon: 'fa-cogs', title: 'Automation Systems', desc: 'Streamlining operations by connecting APIs and eliminating manual work.' },
    { icon: 'fa-network-wired', title: 'API Architectures', desc: 'High-performance, secure backend REST/GraphQL APIs.' },
    { icon: 'fa-chart-line', title: 'Dashboard Systems', desc: 'Real-time data visualization and analytics platforms.' },
    { icon: 'fa-server', title: 'Backend Systems', desc: 'Robust server architecture using Python, FastAPI, and Docker.' },
    { icon: 'fa-rocket', title: 'Growth Automation', desc: 'Automated outreach, lead generation, and CRM integrations.' },
    { icon: 'fa-share-nodes', title: 'Social Media Systems', desc: 'Algorithmic content generation and auto-posting pipelines.' },
    { icon: 'fa-ad', title: 'Meta Ads Automation', desc: 'Programmatic ad campaign management and optimization.' }
];

const projects = [
    {
        cat: 'AI Analytics', title: 'MatchAI Resume Analyzer',
        prob: 'Candidates guess what recruiters want and struggle to land interviews.',
        sol: 'Industry-leading AI analyzes resumes against job descriptions to secure offers.',
        impact: 'Trusted by 50,000+ Verified Professionals.',
        tags: ['Next.js', 'Vercel', 'AI Analytics', 'Tailwind'],
        link: 'https://talha-ai-resume-matcher.vercel.app/', github: '#',
        image: 'images/matchai.png'
    },
    {
        cat: 'AI Computer Vision', title: 'Lumina AI',
        prob: 'Low-quality photos require complex tools and hours to enhance.',
        sol: 'Professional AI image enhancement in seconds. Upscale, sharpen, and restore photos with DSLR-level quality.',
        impact: 'Enhance digital memories instantly.',
        tags: ['Next.js', 'Vercel', 'AI Vision', 'Tailwind'],
        link: 'https://talha-ai-image-enhancer.vercel.app/', github: '#',
        image: 'images/lumina.png'
    },
    {
        cat: 'AI Dashboards', title: 'FoundrIQ Platform',
        prob: 'Startup idea validation was slow and subjective.',
        sol: 'Developed an AI platform generating SWOT, risk, and revenue models in seconds.',
        impact: 'Helped 500+ founders validate ideas instantly.',
        tags: ['Next.js', 'Vercel', 'OpenAI', 'Tailwind'],
        link: 'https://foundriq-platform-myvj.vercel.app/', github: '#',
        image: 'images/foundriq.png'
    },
    {
        cat: 'Healthcare AI', title: 'MedAnalyze AI',
        prob: 'Reading medical reports was tedious for patients.',
        sol: 'AI pipeline that extracts entities, detects risks, and simplifies medical jargon.',
        impact: 'Processed 10k+ reports with 99% extraction accuracy.',
        tags: ['FastAPI', 'NLP', 'Docker', 'React'],
        link: 'https://ai-medical-report-analyzer-project.vercel.app/', github: '#',
        image: 'images/medanalyze.png'
    }
];

const workflow = [
    { title: 'Research & Strategy', desc: 'Deep dive into business goals and technical requirements.' },
    { title: 'Architecture Design', desc: 'Planning the database, API endpoints, and AI pipeline.' },
    { title: 'Development', desc: 'Building the backend logic and frontend user experience.' },
    { title: 'Deployment & Scaling', desc: 'Containerizing with Docker and deploying to edge networks.' }
];

const reviews = [
    { name: 'Alex Morgan', rating: 5, text: 'Excellent AI automation work. Delivered beyond expectations.' },
    { name: 'Sarah Chen', rating: 5, text: 'Professional full stack engineering. Highly recommended.' },
    { name: 'David Kumar', rating: 5, text: 'Amazing chatbot development. Clients love the experience.' },
    { name: 'Maria Santos', rating: 5, text: 'Best AI systems engineer I have worked with. 10/10.' }
];

// Populate Services
const sGrid = document.querySelector('.services-grid');
services.forEach(s => {
    sGrid.innerHTML += `
        <div class="service-card" data-tilt>
            <i class="fas ${s.icon} service-icon"></i>
            <h3 class="service-title">${s.title}</h3>
            <p style="font-size: 14px; color: var(--text-secondary);">${s.desc}</p>
        </div>`;
});

// Populate Projects
const pGrid = document.getElementById('projects-grid');
projects.forEach(p => {
    const tags = p.tags.map(t => `<span class="p-tag">${t}</span>`).join('');
    const imageHTML = p.image 
        ? `<img src="${p.image}" alt="${p.title}" style="width: 100%; height: 100%; object-fit: cover; transition: 0.4s;" class="p-img">`
        : `<i class="fas fa-laptop-code"></i>`;

    pGrid.innerHTML += `
        <div class="project-card" ${p.link !== '#' ? `onclick="window.open('${p.link}', '_blank')" style="cursor: pointer;"` : ''}>
            <div class="project-image">
                ${imageHTML}
                <div class="project-overlay">
                    <a href="${p.link}" target="${p.link !== '#' ? '_blank' : '_self'}" class="project-btn magnetic"><i class="fas fa-play"></i></a>
                    <a href="${p.github}" target="${p.github !== '#' ? '_blank' : '_self'}" class="project-btn magnetic"><i class="fab fa-github"></i></a>
                </div>
            </div>
            <div class="project-content">
                <span class="project-cat">${p.cat}</span>
                <h3 class="project-title">${p.title}</h3>
                <div class="project-detail"><span>Problem</span>${p.prob}</div>
                <div class="project-detail"><span>Solution</span>${p.sol}</div>
                <div class="project-detail"><span>Impact</span><strong style="color:var(--cyan);">${p.impact}</strong></div>
                <div class="project-tags">${tags}</div>
            </div>
        </div>`;
});

// Duplicate for infinite scroll
pGrid.innerHTML += pGrid.innerHTML;

// Populate Workflow
const tLine = document.querySelector('.timeline');
workflow.forEach((w, i) => {
    tLine.innerHTML += `
        <div class="timeline-item" data-animate="fade-up" data-delay="${i*100}">
            <div class="timeline-icon">${i+1}</div>
            <div class="timeline-content">
                <h3>${w.title}</h3>
                <p>${w.desc}</p>
            </div>
        </div>`;
});

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
        el.style.transform = `perspective(1000px) rotateY(${x / 20}deg) rotateX(${-y / 20}deg) translateY(-5px)`;
    });
    el.addEventListener('mouseleave', () => {
        el.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) translateY(0)';
    });
});

// ==========================================
// GSAP & SCROLL ANIMATIONS
// ==========================================
function initAnimations() {
    // Reveal animations
    const elements = document.querySelectorAll('[data-animate]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                
                if(entry.target.classList.contains('hero-title')) {
                    if (typeof gsap !== 'undefined') {
                        gsap.fromTo(entry.target, 
                            {y: 50, opacity: 0}, 
                            {y: 0, opacity: 1, duration: 1, delay: delay/1000, ease: "power3.out"}
                        );
                    } else {
                        entry.target.style.opacity = 1;
                    }
                } else {
                    setTimeout(() => {
                        if (typeof gsap !== 'undefined') {
                            gsap.fromTo(entry.target,
                                {y: 30, opacity: 0},
                                {y: 0, opacity: 1, duration: 0.8, ease: "power2.out"}
                            );
                        }
                        entry.target.style.opacity = 1;
                    }, delay);
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach(el => observer.observe(el));

    // Stats Counters
    const counters = document.querySelectorAll('.stat-number');
    const statObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
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

    // Timeline Line Scroll
    const timeline = document.querySelector('.timeline');
    const timelineFill = document.querySelector('.timeline-line-fill');
    if(timeline && timelineFill && typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.create({
            trigger: timeline,
            start: "top 70%",
            end: "bottom 50%",
            onUpdate: self => {
                timelineFill.style.height = (self.progress * 100) + '%';
            }
        });
    }
}

// ==========================================
// TERMINAL TYPING EFFECT
// ==========================================
function initTerminalTyping() {
    const term = document.getElementById('terminal-body');
    if(!term) return;
    
    const lines = [
        "> Initializing Growthstack.dev AI Stack...",
        "> Loading: Python · FastAPI · Docker · Redis",
        "> Connecting: Vector Databases · LLM APIs",
        "> Status: All systems operational <span style='color:#27c93f'>✓</span>"
    ];
    
    let currentLine = 0;
    
    function typeLine() {
        if(currentLine >= lines.length) return;
        
        const div = document.createElement('div');
        div.style.marginBottom = '8px';
        term.appendChild(div);
        
        let text = lines[currentLine];
        let charIndex = 0;
        
        // Quick simulate typing
        div.innerHTML = text; // Just paste it instantly for performance, but stagger lines
        if (typeof gsap !== 'undefined') {
            gsap.from(div, {opacity: 0, x: -10, duration: 0.2});
        }
        
        currentLine++;
        setTimeout(typeLine, 800);
    }
    
    const termObserver = new IntersectionObserver(entries => {
        if(entries[0].isIntersecting) {
            typeLine();
            termObserver.disconnect();
        }
    }, { threshold: 0.5 });
    
    termObserver.observe(document.querySelector('.terminal-ui'));
}

// ==========================================
// CHATBOT WIDGET
// ==========================================
const chatToggle = document.getElementById('chatbotToggle');
const chatWidget = document.getElementById('chatbot');
const chatClose = document.querySelector('.chatbot-close');
const chatBody = document.getElementById('chatbotBody');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const voiceWave = document.querySelector('.voice-wave');
const promptChips = document.querySelectorAll('.chip');

chatToggle.addEventListener('click', () => {
    chatWidget.classList.add('open');
});

chatClose.addEventListener('click', () => {
    chatWidget.classList.remove('open');
});

function addMsg(text, sender) {
    const div = document.createElement('div');
    div.className = `chat-message ${sender}`;
    div.innerHTML = `<p>${text}</p>`;
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function botReply(text) {
    voiceWave.classList.add('active');
    setTimeout(() => {
        voiceWave.classList.remove('active');
        addMsg(text, 'bot');
    }, 1000);
}

function handleSend(text) {
    if(!text) return;
    addMsg(text, 'user');
    chatInput.value = '';
    
    // Simple logic
    const t = text.toLowerCase();
    if(t.includes('build') || t.includes('service')) {
        botReply("I build AI Chatbots, SaaS platforms, Automation engines, and scalable APIs.");
    } else if(t.includes('project') || t.includes('automation')) {
        botReply("Check out the Case Studies section! I've built Enterprise Content Engines and AI Dashboards.");
    } else {
        botReply("That's interesting! I'm an AI assistant. You can use the Contact form to reach the real Growthstack.dev!");
    }
}

chatSend.addEventListener('click', () => handleSend(chatInput.value));
chatInput.addEventListener('keypress', e => {
    if(e.key === 'Enter') handleSend(chatInput.value);
});

promptChips.forEach(chip => {
    chip.addEventListener('click', () => {
        handleSend(chip.innerText);
    });
});

// ==========================================
// REVIEW FORM
// ==========================================
const starRating = document.getElementById('starRating');
let currentRating = 5;

if(starRating) {
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
        stars.forEach(s=>s.classList.add('active'));
        
        setTimeout(() => {
            btn.innerText = origText;
            btn.style.background = "var(--gradient-main)";
        }, 3000);
    }, 1500);
});
