/* ===========================
   BioTech AI - Main Script
   GSAP + Lenis + Canvas Particles
   =========================== */

// Initialize Lenis Smooth Scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    smoothTouch: false,
    touchMultiplier: 2,
});

// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

// Sync Lenis with GSAP ticker (single source of truth)
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// Update ScrollTrigger on Lenis scroll
lenis.on('scroll', ScrollTrigger.update);

/* ===========================
   Particle Canvas Animation
   =========================== */
class ParticleNetwork {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 150 };
        this.particleCount = 80;
        this.connectionDistance = 150;
        this.colors = {
            particle: '#22d3ee',
            connection: 'rgba(34, 211, 238, 0.15)',
        };

        this.init();
        this.animate();
        this.addEventListeners();
    }

    init() {
        this.resize();

        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(new Particle(this));
        }
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    addEventListeners() {
        window.addEventListener('resize', () => {
            this.resize();
        });

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw particles
        this.particles.forEach((particle) => {
            particle.update();
            particle.draw();
        });

        // Draw connections
        this.drawConnections();

        requestAnimationFrame(() => this.animate());
    }

    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.connectionDistance) {
                    const opacity = 1 - distance / this.connectionDistance;
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(34, 211, 238, ${opacity * 0.2})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }
}

class Particle {
    constructor(network) {
        this.network = network;
        this.x = Math.random() * network.canvas.width;
        this.y = Math.random() * network.canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
        this.baseRadius = this.radius;
    }

    update() {
        // Mouse interaction
        if (this.network.mouse.x !== null && this.network.mouse.y !== null) {
            const dx = this.network.mouse.x - this.x;
            const dy = this.network.mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.network.mouse.radius) {
                const force = (this.network.mouse.radius - distance) / this.network.mouse.radius;
                const angle = Math.atan2(dy, dx);
                this.vx -= Math.cos(angle) * force * 0.02;
                this.vy -= Math.sin(angle) * force * 0.02;
                this.radius = this.baseRadius + force * 2;
            } else {
                this.radius = this.baseRadius;
            }
        }

        // Update position
        this.x += this.vx;
        this.y += this.vy;

        // Boundary check
        if (this.x < 0 || this.x > this.network.canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > this.network.canvas.height) this.vy *= -1;

        // Friction
        this.vx *= 0.99;
        this.vy *= 0.99;

        // Keep minimum velocity
        if (Math.abs(this.vx) < 0.1) this.vx = (Math.random() - 0.5) * 0.5;
        if (Math.abs(this.vy) < 0.1) this.vy = (Math.random() - 0.5) * 0.5;
    }

    draw() {
        this.network.ctx.beginPath();
        this.network.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        this.network.ctx.fillStyle = this.network.colors.particle;
        this.network.ctx.globalAlpha = 0.6;
        this.network.ctx.fill();
        this.network.ctx.globalAlpha = 1;
    }
}

// Initialize Particle Network
const canvas = document.getElementById('particle-canvas');
if (canvas) {
    new ParticleNetwork(canvas);
}

/* ===========================
   Navigation Scroll Effect
   =========================== */
const nav = document.querySelector('.nav');

ScrollTrigger.create({
    start: 'top -100',
    onUpdate: (self) => {
        if (self.direction === 1 && self.scroll() > 100) {
            nav.classList.add('scrolled');
        } else if (self.scroll() < 100) {
            nav.classList.remove('scrolled');
        }
    },
});

/* ===========================
   Hero Animations
   =========================== */
const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

heroTimeline
    .to('.hero-badge', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: 0.3,
    })
    .to(
        '.title-line',
        {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.15,
        },
        '-=0.4'
    )
    .to(
        '.hero-description',
        {
            opacity: 1,
            y: 0,
            duration: 0.8,
        },
        '-=0.6'
    )
    .to(
        '.hero-cta-group',
        {
            opacity: 1,
            y: 0,
            duration: 0.8,
        },
        '-=0.5'
    )
    .to(
        '.scroll-indicator',
        {
            opacity: 1,
            duration: 0.8,
        },
        '-=0.3'
    );

/* ===========================
   DNA Helix Animation
   =========================== */
const dnaTl = gsap.timeline({ delay: 1 });

dnaTl
    .to('.dna-strand', {
        strokeDashoffset: 0,
        duration: 2,
        ease: 'power2.inOut',
        stagger: 0.3,
    })
    .to(
        '.dna-connection',
        {
            strokeDashoffset: 0,
            duration: 0.5,
            ease: 'power2.out',
            stagger: 0.1,
        },
        '-=1.5'
    )
    .to(
        '.dna-node',
        {
            opacity: 1,
            duration: 0.3,
            stagger: 0.05,
        },
        '-=1'
    );

// DNA Rotation on scroll
gsap.to('.dna-helix', {
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
    },
    y: 100,
    rotation: 30,
    opacity: 0.2,
});

/* ===========================
   Stats Counter Animation
   =========================== */
const statCards = document.querySelectorAll('.stat-card');

statCards.forEach((card, index) => {
    // Changed: removed reverse, animations only play once
    gsap.to(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none',
        },
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: index * 0.1,
        ease: 'power3.out',
    });

    const numberEl = card.querySelector('.stat-number');
    const targetValue = parseFloat(numberEl.dataset.target);
    const isDecimal = targetValue % 1 !== 0;

    ScrollTrigger.create({
        trigger: card,
        start: 'top 85%',
        onEnter: () => {
            gsap.to(
                { value: 0 },
                {
                    value: targetValue,
                    duration: 2,
                    ease: 'power2.out',
                    onUpdate: function () {
                        if (targetValue >= 1000000) {
                            numberEl.textContent = (this.targets()[0].value / 1000000).toFixed(1) + 'M';
                        } else if (targetValue >= 1000) {
                            numberEl.textContent = Math.floor(this.targets()[0].value).toLocaleString();
                        } else if (isDecimal) {
                            numberEl.textContent = this.targets()[0].value.toFixed(1);
                        } else {
                            numberEl.textContent = Math.floor(this.targets()[0].value);
                        }
                    },
                }
            );
        },
        once: true,
    });
});

/* ===========================
   Blur Reveal Animation
   =========================== */
const blurElements = document.querySelectorAll('.blur-reveal');

blurElements.forEach((el) => {
    // Changed: removed reverse, animations only play once
    gsap.to(el, {
        scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
        },
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        duration: 1,
        ease: 'power3.out',
    });
});

/* ===========================
   Platform Cards Animation
   =========================== */
const platformCards = document.querySelectorAll('.platform-card');

platformCards.forEach((card, index) => {
    // Changed: removed reverse, animations only play once
    gsap.to(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none',
        },
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: index * 0.1,
        ease: 'power3.out',
    });
});

/* ===========================
   Network Visualization Animation
   =========================== */
const networkLines = document.querySelectorAll('.network-line');
const networkNodes = document.querySelectorAll('.network-node');

gsap.set(networkNodes, { scale: 0, opacity: 0 });

ScrollTrigger.create({
    trigger: '.network-visualization',
    start: 'top 70%',
    onEnter: () => {
        // Animate lines
        gsap.to(networkLines, {
            strokeDashoffset: 0,
            duration: 1,
            stagger: 0.05,
            ease: 'power2.out',
        });

        // Animate nodes
        gsap.to(networkNodes, {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            stagger: 0.08,
            delay: 0.3,
            ease: 'back.out(1.7)',
        });
    },
    once: true,
});

/* ===========================
   Research Cards Animation
   =========================== */
const researchCards = document.querySelectorAll('.research-card');

researchCards.forEach((card, index) => {
    // Changed: removed reverse, animations only play once
    gsap.to(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none',
        },
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: index * 0.15,
        ease: 'power3.out',
    });
});

/* ===========================
   Data Dashboard Animation
   =========================== */
// Update current time
function updateTime() {
    const timeEl = document.getElementById('current-time');
    if (timeEl) {
        const now = new Date();
        timeEl.textContent = now.toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    }
}

setInterval(updateTime, 1000);
updateTime();

// Animate stream rates
const streamRates = document.querySelectorAll('.stream-rate');

ScrollTrigger.create({
    trigger: '.data-dashboard',
    start: 'top 70%',
    onEnter: () => {
        streamRates.forEach((rateEl) => {
            const targetRate = parseInt(rateEl.dataset.rate);
            const unit = rateEl.textContent.split(' ')[1] || 'seq/s';

            gsap.to(
                { value: 0 },
                {
                    value: targetRate,
                    duration: 2,
                    ease: 'power2.out',
                    onUpdate: function () {
                        rateEl.textContent = Math.floor(this.targets()[0].value).toLocaleString() + ' ' + unit;
                    },
                }
            );
        });

        // Animate graph
        gsap.to('.graph-line', {
            strokeDashoffset: 0,
            duration: 2,
            ease: 'power2.out',
        });

        gsap.to('.graph-area', {
            opacity: 1,
            duration: 1,
            delay: 0.5,
        });
    },
    once: true,
});

// Simulate progress bar animation
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.stream-progress');

    progressBars.forEach((bar) => {
        const baseProgress = parseFloat(bar.style.getPropertyValue('--progress'));
        const randomOffset = (Math.random() - 0.5) * 10;
        const newProgress = Math.max(20, Math.min(95, baseProgress + randomOffset));
        bar.style.setProperty('--progress', `${newProgress}%`);
    });
}

setInterval(animateProgressBars, 2000);

/* ===========================
   Smooth Scroll Links
   =========================== */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            lenis.scrollTo(target, {
                offset: -100,
                duration: 1.2,
            });
        }
    });
});

/* ===========================
   Form Interaction
   =========================== */
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Simple form validation feedback
        const btn = contactForm.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;

        btn.innerHTML = `
            <span>전송 중...</span>
            <svg class="animate-spin" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2" stroke-dasharray="25 75" stroke-linecap="round"/>
            </svg>
        `;
        btn.disabled = true;

        // Simulate submission
        setTimeout(() => {
            btn.innerHTML = `
                <span>전송 완료!</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M5 10L9 14L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
                contactForm.reset();
            }, 2000);
        }, 1500);
    });
}

/* ===========================
   Mobile Menu Toggle
   =========================== */
const mobileToggle = document.querySelector('.nav-mobile-toggle');
const navLinks = document.querySelector('.nav-links');

if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        // Add mobile menu logic here if needed
    });
}

/* ===========================
   Parallax Effects
   =========================== */
gsap.to('.molecule-3d', {
    scrollTrigger: {
        trigger: '.about',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
    },
    y: -50,
    rotation: 180,
});

/* ===========================
   Preloader (Optional)
   =========================== */
window.addEventListener('load', () => {
    document.body.classList.add('loaded');

    // Refresh ScrollTrigger after page load
    ScrollTrigger.refresh();
});

/* ===========================
   Console Easter Egg
   =========================== */
console.log(
    '%c🧬 BioTech AI',
    'font-size: 24px; font-weight: bold; color: #22d3ee;'
);
console.log(
    '%c생명과학과 AI의 융합으로 인류의 건강한 미래를 열어갑니다.',
    'font-size: 14px; color: #4ade80;'
);
