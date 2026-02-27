/* ============================================
   PORTFOLIO — INTERACTIVITY & ANIMATIONS
   ============================================ */

// === PARTICLE SYSTEM ===
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.resize();
        this.init();

        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        const count = Math.min(80, Math.floor(window.innerWidth / 20));
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                size: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.5 + 0.1,
            });
        }
        this.animate();
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;

            // Wrap around
            if (p.x < 0) p.x = this.canvas.width;
            if (p.x > this.canvas.width) p.x = 0;
            if (p.y < 0) p.y = this.canvas.height;
            if (p.y > this.canvas.height) p.y = 0;

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(99, 102, 241, ${p.opacity})`;
            this.ctx.fill();

            // Connect nearby particles
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = `rgba(99, 102, 241, ${0.06 * (1 - dist / 120)})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
        });

        requestAnimationFrame(() => this.animate());
    }
}

// === TYPING ANIMATION ===
class TypeWriter {
    constructor(element, words, wait = 2000) {
        this.element = element;
        this.words = words;
        this.wait = wait;
        this.wordIndex = 0;
        this.txt = '';
        this.isDeleting = false;
        this.type();
    }

    type() {
        const current = this.wordIndex % this.words.length;
        const fullTxt = this.words[current];

        if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        this.element.textContent = this.txt;

        let typeSpeed = 80;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        if (!this.isDeleting && this.txt === fullTxt) {
            typeSpeed = this.wait;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.wordIndex++;
            typeSpeed = 400;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// === CURSOR GLOW ===
function initCursorGlow() {
    const glow = document.getElementById('cursorGlow');
    if (!glow) return;

    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;

    document.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
    });

    function updateGlow() {
        currentX += (targetX - currentX) * 0.08;
        currentY += (targetY - currentY) * 0.08;
        glow.style.left = currentX + 'px';
        glow.style.top = currentY + 'px';
        requestAnimationFrame(updateGlow);
    }
    updateGlow();
}

// === SCROLL ANIMATIONS ===
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.animate-in').forEach(el => {
        observer.observe(el);
    });
}

// === NAV SCROLL EFFECT ===
function initNavScroll() {
    const nav = document.getElementById('mainNav');
    const sections = document.querySelectorAll('.section, .hero');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        // Toggle scrolled class
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        // Active section tracking
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === current) {
                link.classList.add('active');
            }
        });
    });
}

// === MOBILE NAV TOGGLE ===
function initMobileNav() {
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');

    if (toggle && links) {
        toggle.addEventListener('click', () => {
            links.classList.toggle('open');
            toggle.classList.toggle('active');
        });

        // Close menu on link click
        links.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                links.classList.remove('open');
                toggle.classList.remove('active');
            });
        });
    }
}

// === PROJECT FILTERS ===
function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach((card, i) => {
                const categories = card.getAttribute('data-category').split(' ');
                if (filter === 'all' || categories.includes(filter)) {
                    card.classList.remove('hidden');
                    card.style.animation = `fadeInUp 0.4s ease ${i * 0.05}s forwards`;
                } else {
                    card.classList.add('hidden');
                    card.style.animation = '';
                }
            });
        });
    });
}

// === COUNTER ANIMATION ===
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-count'));
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 40;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 40);
}

// === SMOOTH SCROLL ===
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// === CONTACT FORM (Web3Forms) ===
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = document.getElementById('submitBtn');
        const result = document.getElementById('formResult');
        const originalContent = btn.innerHTML;

        // Show loading state
        btn.innerHTML = `<span>Sending...</span>`;
        btn.disabled = true;
        btn.style.opacity = '0.7';
        result.textContent = '';
        result.className = 'form-result';

        try {
            const formData = new FormData(form);
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();

            if (data.success) {
                result.textContent = '✨ Message sent successfully! I\'ll get back to you soon.';
                result.className = 'form-result success';
                btn.innerHTML = `<span>Sent! ✨</span>`;
                btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                form.reset();

                setTimeout(() => {
                    btn.innerHTML = originalContent;
                    btn.style.background = '';
                    btn.style.opacity = '';
                    result.textContent = '';
                    result.className = 'form-result';
                }, 4000);
            } else {
                throw new Error(data.message || 'Something went wrong');
            }
        } catch (error) {
            result.textContent = '❌ Failed to send. Please email me directly at waniaruu@gmail.com';
            result.className = 'form-result error';
            btn.innerHTML = originalContent;

            setTimeout(() => {
                result.textContent = '';
                result.className = 'form-result';
            }, 5000);
        }

        btn.disabled = false;
        btn.style.opacity = '';
    });
}

// === PROJECT DETAIL MODAL ===
// Category label mapping
const categoryLabels = {
    'proptech': 'PropTech',
    'ai': 'AI / ML',
    'scraping': 'Web Scraping',
    'fullstack': 'Full-Stack',
    'mobile': 'Mobile',
    'desktop': 'Desktop',
    'fintech': 'FinTech'
};

function openModal(card) {
    const modal = document.getElementById('projectModal');
    const header = document.getElementById('modalHeader');
    const icon = document.getElementById('modalIcon');
    const title = document.getElementById('modalTitle');
    const tags = document.getElementById('modalTags');
    const status = document.getElementById('modalStatus');
    const category = document.getElementById('modalCategory');
    const desc = document.getElementById('modalDesc');
    const features = document.getElementById('modalFeatures');
    const tech = document.getElementById('modalTech');

    // Extract data from the card
    const cardImage = card.querySelector('.project-image');
    const gradient = cardImage.style.background;
    const svgIcon = cardImage.querySelector('svg');
    const cardTitle = card.querySelector('.project-title').textContent;
    const cardDesc = card.querySelector('.project-desc').textContent;
    const cardStatus = card.querySelector('.project-status');
    const cardTags = card.querySelectorAll('.project-tags .tag');
    const cardFeatures = card.querySelectorAll('.project-features span');
    const cardCategories = card.getAttribute('data-category').split(' ');

    // Set modal gradient header
    header.style.background = gradient;

    // Set icon
    if (svgIcon) {
        icon.innerHTML = svgIcon.outerHTML;
    }

    // Set title
    title.textContent = cardTitle;

    // Set description
    desc.textContent = cardDesc;

    // Set status badge
    const statusClass = cardStatus.classList.contains('live') ? 'live' :
        cardStatus.classList.contains('complete') ? 'complete' : 'active';
    status.textContent = cardStatus.textContent;
    status.className = 'modal-status project-status ' + statusClass;

    // Set category labels
    const catLabels = cardCategories.map(c => categoryLabels[c] || c).join(' · ');
    category.textContent = catLabels;

    // Set tags
    tags.innerHTML = '';
    cardTags.forEach(tag => {
        const clone = tag.cloneNode(true);
        tags.appendChild(clone);
    });

    // Set features
    features.innerHTML = '';
    cardFeatures.forEach(feat => {
        const span = document.createElement('span');
        span.textContent = feat.textContent;
        features.appendChild(span);
    });

    // Set tech stack (same as tags but bigger format)
    tech.innerHTML = '';
    cardTags.forEach(tag => {
        const clone = tag.cloneNode(true);
        clone.style.fontSize = '0.78rem';
        clone.style.padding = '5px 14px';
        tech.appendChild(clone);
    });

    // Open modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('projectModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function initModal() {
    const modal = document.getElementById('projectModal');
    const closeBtn = document.getElementById('modalClose');

    // Close on X button
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Close on overlay click
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    // Attach click handler to all "View Details" links
    document.querySelectorAll('.project-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const card = link.closest('.project-card');
            if (card) openModal(card);
        });
    });

    // Also allow clicking on the project image to open modal
    document.querySelectorAll('.project-image').forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', (e) => {
            const card = img.closest('.project-card');
            if (card) openModal(card);
        });
    });
}

// === TILT EFFECT ON CARDS ===
function initTiltEffect() {
    const cards = document.querySelectorAll('.project-card, .code-window');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -3;
            const rotateY = ((x - centerX) / centerX) * 3;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// === CSS ANIMATION KEYFRAME INJECTION ===
function injectAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
}

// === INITIALIZE ===
document.addEventListener('DOMContentLoaded', () => {
    // Particles
    const canvas = document.getElementById('particles');
    if (canvas) new ParticleSystem(canvas);

    // Typing
    const typedEl = document.getElementById('typedText');
    if (typedEl) {
        new TypeWriter(typedEl, [
            'AI Systems',
            'Web Scrapers',
            'PropTech Platforms',
            'Mobile Apps',
            'Desktop Apps',
            'Full-Stack Products',
            'Data Pipelines',
            'FinTech Tools'
        ], 2000);
    }

    // All init functions
    initCursorGlow();
    initScrollAnimations();
    initNavScroll();
    initMobileNav();
    initProjectFilters();
    initCounters();
    initSmoothScroll();
    initContactForm();
    initTiltEffect();
    initModal();
    injectAnimations();

    // Trigger hero animations immediately
    setTimeout(() => {
        document.querySelectorAll('.hero .animate-in').forEach((el, i) => {
            setTimeout(() => el.classList.add('visible'), i * 150);
        });
    }, 200);
});
