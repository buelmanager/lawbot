/* ===========================
   법률AI - Main Script
   법제처 공식 데이터 기반 AI 법률 정보 서비스
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

// Sync Lenis with GSAP ticker
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
        this.particleCount = 50;
        this.connectionDistance = 100;
        this.colors = {
            particle: '#3b82f6',
            connection: 'rgba(59, 130, 246, 0.08)',
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

        this.particles.forEach((particle) => {
            particle.update();
            particle.draw();
        });

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
                    this.ctx.strokeStyle = `rgba(59, 130, 246, ${opacity * 0.12})`;
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
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.radius = Math.random() * 2 + 1;
        this.baseRadius = this.radius;
    }

    update() {
        if (this.network.mouse.x !== null && this.network.mouse.y !== null) {
            const dx = this.network.mouse.x - this.x;
            const dy = this.network.mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.network.mouse.radius) {
                const force = (this.network.mouse.radius - distance) / this.network.mouse.radius;
                const angle = Math.atan2(dy, dx);
                this.vx -= Math.cos(angle) * force * 0.015;
                this.vy -= Math.sin(angle) * force * 0.015;
                this.radius = this.baseRadius + force * 1.5;
            } else {
                this.radius = this.baseRadius;
            }
        }

        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > this.network.canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > this.network.canvas.height) this.vy *= -1;

        this.vx *= 0.995;
        this.vy *= 0.995;

        if (Math.abs(this.vx) < 0.05) this.vx = (Math.random() - 0.5) * 0.3;
        if (Math.abs(this.vy) < 0.05) this.vy = (Math.random() - 0.5) * 0.3;
    }

    draw() {
        this.network.ctx.beginPath();
        this.network.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        this.network.ctx.fillStyle = this.network.colors.particle;
        this.network.ctx.globalAlpha = 0.3;
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
        '.hero-values',
        {
            opacity: 1,
            y: 0,
            duration: 0.8,
        },
        '-=0.5'
    )
    .to(
        '.hero-ai-notice',
        {
            opacity: 1,
            y: 0,
            duration: 0.8,
        },
        '-=0.5'
    )
    .to(
        '.hero-chat',
        {
            opacity: 1,
            y: 0,
            duration: 1,
        },
        '-=0.6'
    );

/* ===========================
   Blur Reveal Animation
   =========================== */
const blurElements = document.querySelectorAll('.blur-reveal');

blurElements.forEach((el) => {
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
   Trust Cards Animation
   =========================== */
const trustCards = document.querySelectorAll('.trust-card');

trustCards.forEach((card, index) => {
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
   RAG Steps Animation
   =========================== */
const ragSteps = document.querySelectorAll('.rag-step');
const ragArrows = document.querySelectorAll('.rag-arrow');

ragSteps.forEach((step, index) => {
    gsap.to(step, {
        scrollTrigger: {
            trigger: step,
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

ragArrows.forEach((arrow, index) => {
    gsap.to(arrow, {
        scrollTrigger: {
            trigger: arrow,
            start: 'top 85%',
            toggleActions: 'play none none none',
        },
        opacity: 1,
        duration: 0.6,
        delay: 0.3 + index * 0.15,
        ease: 'power3.out',
    });
});

/* ===========================
   Consultation Cards Animation
   =========================== */
const consultCards = document.querySelectorAll('.consult-card');

consultCards.forEach((card, index) => {
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
   Chat Functionality
   =========================== */
const chatInput = document.getElementById('chat-input');
const chatSubmit = document.getElementById('chat-submit');
const chatMessages = document.getElementById('chat-messages');
const exampleBtns = document.querySelectorAll('.example-btn');

// Enable/disable submit button based on input
if (chatInput && chatSubmit) {
    chatInput.addEventListener('input', () => {
        chatSubmit.disabled = chatInput.value.trim().length === 0;

        // Auto-resize textarea
        chatInput.style.height = 'auto';
        chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
    });

    // Handle Enter key (Shift+Enter for new line)
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!chatSubmit.disabled) {
                sendMessage();
            }
        }
    });

    chatSubmit.addEventListener('click', sendMessage);
}

// Example button click handlers
exampleBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
        const question = btn.dataset.question;
        if (chatInput) {
            chatInput.value = question;
            chatInput.dispatchEvent(new Event('input'));

            // Focus input and send
            chatInput.focus();
            setTimeout(() => {
                sendMessage();
            }, 300);
        }
    });
});

function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    // Expand chat container when conversation starts
    const chatContainer = document.querySelector('.hero-chat .chat-container');
    if (chatContainer && !chatContainer.classList.contains('chat-expanded')) {
        chatContainer.classList.add('chat-expanded');
    }

    // Hide welcome message
    const welcomeEl = chatMessages.querySelector('.chat-welcome');
    if (welcomeEl) {
        welcomeEl.style.display = 'none';
    }

    // Add user message
    addMessage(message, 'user');

    // Clear input
    chatInput.value = '';
    chatInput.style.height = 'auto';
    chatSubmit.disabled = true;

    // Show typing indicator
    const typingId = showTypingIndicator();

    // Simulate AI response (in production, this would call the actual API)
    setTimeout(() => {
        removeTypingIndicator(typingId);

        // Demo response
        const demoResponse = getDemoResponse(message);
        addMessage(demoResponse, 'ai');
    }, 1500 + Math.random() * 1000);
}

function addMessage(content, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = type === 'user' ? '나' : 'AI';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.innerHTML = content;

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(contentDiv);

    chatMessages.appendChild(messageDiv);

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
    const id = 'typing-' + Date.now();
    const typingDiv = document.createElement('div');
    typingDiv.id = id;
    typingDiv.className = 'message message-ai';
    typingDiv.innerHTML = `
        <div class="message-avatar">AI</div>
        <div class="message-content" style="display: flex; gap: 4px; padding: 16px 20px;">
            <span class="typing-dot" style="animation: typingDot 1.4s infinite; animation-delay: 0s;"></span>
            <span class="typing-dot" style="animation: typingDot 1.4s infinite; animation-delay: 0.2s;"></span>
            <span class="typing-dot" style="animation: typingDot 1.4s infinite; animation-delay: 0.4s;"></span>
        </div>
    `;

    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    return id;
}

function removeTypingIndicator(id) {
    const typingEl = document.getElementById(id);
    if (typingEl) {
        typingEl.remove();
    }
}

// Add typing animation styles
const typingStyles = document.createElement('style');
typingStyles.textContent = `
    .typing-dot {
        width: 8px;
        height: 8px;
        background: var(--color-primary, #3b82f6);
        border-radius: 50%;
        opacity: 0.3;
    }

    @keyframes typingDot {
        0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
        30% { opacity: 1; transform: translateY(-4px); }
    }
`;
document.head.appendChild(typingStyles);

// Demo responses (for demonstration purposes)
function getDemoResponse(question) {
    const q = question.toLowerCase();

    if (q.includes('퇴직금') && q.includes('계산')) {
        return `
            <p><strong>퇴직금 계산 방법</strong></p>
            <p>퇴직금은 다음 공식으로 계산됩니다:</p>
            <p style="background: rgba(59, 130, 246, 0.1); padding: 12px; border-radius: 8px; margin: 12px 0; font-family: monospace;">
                <strong>퇴직금 = 1일 평균임금 × 30일 × (재직일수 ÷ 365)</strong>
            </p>
            <p style="background: rgba(245, 158, 11, 0.1); padding: 12px; border-left: 3px solid #f59e0b; border-radius: 0 8px 8px 0; margin-top: 16px;">
                <span style="color: #f59e0b; font-size: 0.75rem;">📖 근거 법령</span><br>
                <strong>근로자퇴직급여 보장법 제8조</strong> (퇴직금제도의 설정)
            </p>
            <p style="font-size: 0.8rem; color: rgba(255,255,255,0.5); margin-top: 16px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.1);">
                ⚠️ 위 정보는 일반적인 법률 정보이며, 정확성을 보장하지 않습니다. 구체적인 사안은 변호사와 상담하세요.
            </p>
        `;
    }

    if (q.includes('부당해고')) {
        return `
            <p><strong>부당해고 대응 방법</strong></p>
            <p>부당해고를 당했을 경우 다음과 같이 대응할 수 있습니다:</p>
            <ol style="margin: 12px 0; padding-left: 20px;">
                <li style="margin-bottom: 8px;">해고 사유와 날짜가 명시된 <strong>해고통지서</strong>를 요청하세요.</li>
                <li style="margin-bottom: 8px;">해고일로부터 <strong>3개월 이내</strong>에 노동위원회에 구제신청을 할 수 있습니다.</li>
                <li style="margin-bottom: 8px;">사업장 관할 <strong>지방노동위원회</strong>에 부당해고 구제신청서를 제출하세요.</li>
            </ol>
            <p style="background: rgba(245, 158, 11, 0.1); padding: 12px; border-left: 3px solid #f59e0b; border-radius: 0 8px 8px 0; margin-top: 16px;">
                <span style="color: #f59e0b; font-size: 0.75rem;">📖 근거 법령</span><br>
                <strong>근로기준법 제23조</strong> (해고 등의 제한), <strong>제28조</strong> (부당해고등의 구제신청)
            </p>
            <p style="font-size: 0.8rem; color: rgba(255,255,255,0.5); margin-top: 16px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.1);">
                ⚠️ 위 정보는 일반적인 법률 정보이며, 정확성을 보장하지 않습니다. 구체적인 사안은 변호사와 상담하세요.
            </p>
        `;
    }

    if (q.includes('연차') && q.includes('휴가')) {
        return `
            <p><strong>연차휴가 일수</strong></p>
            <p>연차휴가는 근속기간에 따라 다음과 같이 부여됩니다:</p>
            <ul style="margin: 12px 0; padding-left: 20px;">
                <li style="margin-bottom: 8px;"><strong>1년 미만 근무:</strong> 1개월 개근 시 1일씩 (최대 11일)</li>
                <li style="margin-bottom: 8px;"><strong>1년 이상 근무:</strong> 15일</li>
                <li style="margin-bottom: 8px;"><strong>3년 이상 근무:</strong> 2년마다 1일씩 추가 (최대 25일)</li>
            </ul>
            <p style="background: rgba(245, 158, 11, 0.1); padding: 12px; border-left: 3px solid #f59e0b; border-radius: 0 8px 8px 0; margin-top: 16px;">
                <span style="color: #f59e0b; font-size: 0.75rem;">📖 근거 법령</span><br>
                <strong>근로기준법 제60조</strong> (연차 유급휴가)
            </p>
            <p style="font-size: 0.8rem; color: rgba(255,255,255,0.5); margin-top: 16px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.1);">
                ⚠️ 위 정보는 일반적인 법률 정보이며, 정확성을 보장하지 않습니다. 구체적인 사안은 변호사와 상담하세요.
            </p>
        `;
    }

    // Default response
    return `
        <p>질문해 주셔서 감사합니다.</p>
        <p>현재 데모 버전에서는 제한된 응답만 제공됩니다. 실제 서비스에서는 법제처 국가법령정보 API와 대법원 판례를 기반으로 <strong>조문 번호와 판례를 명시한 근거 있는 답변</strong>을 받으실 수 있습니다.</p>
        <p><strong>지원되는 예시 질문:</strong></p>
        <ul style="margin: 12px 0; padding-left: 20px;">
            <li>퇴직금은 어떻게 계산하나요?</li>
            <li>부당해고를 당했을 때 어떻게 해야 하나요?</li>
            <li>연차휴가는 며칠이 주어지나요?</li>
        </ul>
        <p style="font-size: 0.8rem; color: rgba(255,255,255,0.5); margin-top: 16px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.1);">
            ⚠️ 위 정보는 일반적인 법률 정보이며, 정확성을 보장하지 않습니다. 구체적인 사안은 변호사와 상담하세요.
        </p>
    `;
}

/* ===========================
   Mobile Menu Toggle
   =========================== */
const mobileToggle = document.querySelector('.nav-mobile-toggle');
const navLinks = document.querySelector('.nav-links');

if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
    });
}

/* ===========================
   Preloader
   =========================== */
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    ScrollTrigger.refresh();
});

/* ===========================
   Console Message
   =========================== */
console.log(
    '%c⚖️ 법률AI',
    'font-size: 24px; font-weight: bold; color: #3b82f6;'
);
console.log(
    '%c법제처 공식 데이터 기반 AI 법률 정보 서비스',
    'font-size: 14px; color: #60a5fa;'
);
console.log(
    '%c본 서비스는 법률 정보 제공 목적이며, 법률 자문이 아닙니다.',
    'font-size: 12px; color: #888;'
);
