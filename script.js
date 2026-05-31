/* =============================================
   Paras Mahajan — PORTFOLIO JAVASCRIPT
   Handles: Preloader, Navbar, Particles,
            Typed.js, Counters, Skill Bars,
            Contact Form, Scroll effects, AOS
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

    /* ------------------------------------------
       PRELOADER
    ------------------------------------------ */
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
            preloader.addEventListener('transitionend', () => preloader.remove(), { once: true });
        }, 1000);
    });

    /* ------------------------------------------
       AOS ANIMATION INIT
    ------------------------------------------ */
    AOS.init({
        once: true,
        duration: 700,
        offset: 80,
        easing: 'ease-out-cubic'
    });

    /* ------------------------------------------
       DOWNLOAD CV — Open PDF in new tab
    ------------------------------------------ */
    const downloadCvBtn = document.getElementById('downloadCvBtn');
    if (downloadCvBtn) {
        downloadCvBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.open('New_paras_mahajan_resume.pdf', '_blank');
        });
    }

    /* ------------------------------------------
       NAVBAR — SCROLL & ACTIVE LINK
    ------------------------------------------ */
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    const handleScroll = () => {
        // Sticky
        navbar.classList.toggle('scrolled', window.scrollY > 50);

        // Scroll-up button
        const scrollBtn = document.getElementById('scrollUpBtn');
        if (scrollBtn) scrollBtn.classList.toggle('show', window.scrollY > 500);

        // Active nav link
        let current = '';
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 120) {
                current = sec.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    /* ------------------------------------------
       HAMBURGER MENU
    ------------------------------------------ */
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        navMenu.classList.toggle('open');
    });

    // Close on nav link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('open');
            navMenu.classList.remove('open');
        });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target)) {
            hamburger.classList.remove('open');
            navMenu.classList.remove('open');
        }
    });

    /* ------------------------------------------
       SCROLL UP BUTTON
    ------------------------------------------ */
    const scrollUpBtn = document.getElementById('scrollUpBtn');
    if (scrollUpBtn) {
        scrollUpBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ------------------------------------------
       TYPED.JS — Hero & About
    ------------------------------------------ */
    if (typeof Typed !== 'undefined') {
        new Typed('#typingText', {
            strings: [
                'Data Engineer',
                'Python Programmer',
                'Data Analytics',
                'Problem Solver',
                'B.Tech Graduate'
            ],
            typeSpeed: 80,
            backSpeed: 50,
            backDelay: 1800,
            loop: true,
            smartBackspace: true
        });

        new Typed('.typing-about', {
            strings: [
                'passionate coder.',
                'web developer.',
                'DevOps enthusiast.',
                'tech explorer.',
            ],
            typeSpeed: 75,
            backSpeed: 45,
            backDelay: 1500,
            loop: true
        });
    }

    /* ------------------------------------------
       ANIMATED COUNTER — About Stats
    ------------------------------------------ */
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-count'), 10);
                const duration = 1500;
                const step = target / (duration / 16);
                let current = 0;
                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        el.textContent = target + '+';
                        clearInterval(timer);
                    } else {
                        el.textContent = Math.floor(current) + '+';
                    }
                }, 16);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number[data-count]').forEach(el => {
        counterObserver.observe(el);
    });

    /* ------------------------------------------
       SKILL BARS — Animate on View
    ------------------------------------------ */
    const skillBarObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const targetWidth = bar.getAttribute('data-width');
                setTimeout(() => {
                    bar.style.width = targetWidth + '%';
                }, 200);
                skillBarObserver.unobserve(bar);
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.skill-bar-fill').forEach(bar => {
        skillBarObserver.observe(bar);
    });

    /* ------------------------------------------
       TOAST NOTIFICATION SYSTEM
    ------------------------------------------ */
    const toastContainer = document.getElementById('toastContainer');

    function showToast(message, type = 'info', duration = 4000) {
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            info: 'fas fa-info-circle',
            copy: 'fas fa-clipboard-check'
        };
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i class="${icons[type] || icons.info} toast-icon"></i>
            <span class="toast-msg">${message}</span>
            <div class="toast-progress"></div>`;
        toast.addEventListener('click', () => dismissToast(toast));
        toastContainer.appendChild(toast);

        const timer = setTimeout(() => dismissToast(toast), duration);
        toast._timer = timer;
    }

    function dismissToast(toast) {
        clearTimeout(toast._timer);
        toast.style.animation = 'toastOut 0.3s ease forwards';
        toast.addEventListener('animationend', () => toast.remove(), { once: true });
    }

    /* ------------------------------------------
       COPY TO CLIPBOARD — Contact Info Cards
    ------------------------------------------ */
    document.querySelectorAll('.contact-item.copyable').forEach(item => {
        item.addEventListener('click', async () => {
            const text = item.getAttribute('data-copy');
            try {
                await navigator.clipboard.writeText(text);
                item.classList.add('copied');
                showToast(`Copied: <strong>${text}</strong>`, 'copy', 3000);
                setTimeout(() => item.classList.remove('copied'), 2000);
            } catch {
                // Fallback for non-HTTPS or older browsers
                const ta = document.createElement('textarea');
                ta.value = text;
                ta.style.position = 'fixed';
                ta.style.opacity = '0';
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
                item.classList.add('copied');
                showToast(`Copied: <strong>${text}</strong>`, 'copy', 3000);
                setTimeout(() => item.classList.remove('copied'), 2000);
            }
        });
    });

    /* ------------------------------------------
       CONTACT FORM — Full Validation & Submit
    ------------------------------------------ */
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const submitBtn = document.getElementById('submitBtn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        const charCounter = document.getElementById('charCounter');
        const msgField = document.getElementById('cnt-msg');
        const nameField = document.getElementById('cnt-name');
        const emailField = document.getElementById('cnt-email');

        // ── Real-time Character Counter ──
        if (msgField && charCounter) {
            msgField.addEventListener('input', () => {
                const len = msgField.value.length;
                const max = parseInt(msgField.getAttribute('maxlength')) || 1000;
                charCounter.textContent = `${len} / ${max}`;
                charCounter.classList.toggle('warn', len > max * 0.8);
                charCounter.classList.toggle('danger', len > max * 0.95);
            });
        }

        // ── Live Validation Helpers ──
        function setFieldState(group, valid, errorId, msg) {
            const el = document.getElementById(group);
            if (!el) return;
            el.classList.toggle('valid', valid);
            el.classList.toggle('invalid', !valid);
            const err = document.getElementById(errorId);
            if (err) err.textContent = valid ? '' : msg;
        }

        function validateName() {
            const v = nameField.value.trim();
            const ok = v.length >= 2;
            setFieldState('nameGroup', ok, 'nameError', 'Please enter your full name (min 2 chars).');
            return ok;
        }

        function validateEmail() {
            const v = emailField.value.trim();
            const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            setFieldState('emailGroup', ok, 'emailError', 'Please enter a valid email address.');
            return ok;
        }

        function validateMsg() {
            const v = msgField.value.trim();
            const ok = v.length >= 10;
            setFieldState('msgGroup', ok, 'msgError', 'Message must be at least 10 characters.');
            return ok;
        }

        // Attach live blur validation
        nameField && nameField.addEventListener('blur', validateName);
        emailField && emailField.addEventListener('blur', validateEmail);
        msgField && msgField.addEventListener('blur', validateMsg);

        // ── Form Submit ──
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Honeypot check
            const honey = contactForm.querySelector('input[name="_honey"]');
            if (honey && honey.value) return;

            const okName = validateName();
            const okEmail = validateEmail();
            const okMsg = validateMsg();

            if (!okName || !okEmail || !okMsg) {
                shakeEl(contactForm.querySelector('.invalid') || contactForm);
                showToast('Please fix the highlighted fields.', 'error', 4000);
                return;
            }

            // Show loading
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline-flex';
            submitBtn.disabled = true;

            const name = nameField.value.trim();
            const email = emailField.value.trim();
            const subject = (document.getElementById('cnt-subject')?.value || 'Portfolio Contact').trim();
            const message = msgField.value.trim();

            try {
                /* ── EmailJS send (free, no server needed) ──
                   Sign up at emailjs.com, create a service + template,
                   then replace the three IDs below:
                   - YOUR_SERVICE_ID   → e.g. "service_abc123"
                   - YOUR_TEMPLATE_ID  → e.g. "template_xyz789"
                   - YOUR_PUBLIC_KEY   → e.g. "AbCdEfGhIjKlMnOp"
                ----------------------------------------- */
                if (typeof emailjs !== 'undefined') {
                    await emailjs.send(
                        'service_b4hvkb8',
                        'template_87la1ew',
                        { from_name: name, from_email: email, subject, message },
                        'qibg2YrOnGRhtCGgD'
                    );
                    contactForm.reset();
                    resetAllFieldStates();
                    if (charCounter) charCounter.textContent = '0 / 1000';
                    showToast('🎉 Message sent! I\'ll get back to you soon.', 'success', 6000);
                } else {
                    throw new Error('emailjs-not-loaded');
                }
            } catch (err) {
                // Graceful fallback → open native email client
                const subjectEnc = encodeURIComponent(subject);
                const bodyEnc = encodeURIComponent(
                    `Hi Paras,\n\nMy name is ${name}.\n\n${message}\n\nBest,\n${name}\n${email}`
                );
                window.location.href = `mailto:mahajanparas505@gmail.com?subject=${subjectEnc}&body=${bodyEnc}`;
                showToast('Opening your email client…', 'info', 4000);
            } finally {
                btnText.style.display = 'inline-flex';
                btnLoading.style.display = 'none';
                submitBtn.disabled = false;
            }
        });

        function resetAllFieldStates() {
            ['nameGroup', 'emailGroup', 'subjectGroup', 'msgGroup'].forEach(id => {
                const el = document.getElementById(id);
                if (el) { el.classList.remove('valid', 'invalid'); }
            });
            ['nameError', 'emailError', 'msgError'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.textContent = '';
            });
        }
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function shakeEl(el) {
        el.style.animation = 'shake 0.4s ease';
        el.addEventListener('animationend', () => { el.style.animation = ''; }, { once: true });
    }

    function shakeForm(el) { shakeEl(el); }

    /* ------------------------------------------
       SMOOTH SCROLL — All Anchor Links
    ------------------------------------------ */
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    /* ------------------------------------------
       PARTICLES CANVAS
    ------------------------------------------ */
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationId;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize, { passive: true });

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 1.5 + 0.3;
                this.speedX = (Math.random() - 0.5) * 0.35;
                this.speedY = (Math.random() - 0.5) * 0.35;
                this.alpha = Math.random() * 0.5 + 0.1;
                this.color = Math.random() > 0.5 ? '124,58,237' : '236,72,153';
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                    this.reset();
                }
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
                ctx.fill();
            }
        }

        // Init particles
        const PARTICLE_COUNT = Math.min(80, Math.floor(window.innerWidth / 20));
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new Particle());
        }

        // Connect close particles
        const connectParticles = () => {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        const alpha = (1 - dist / 120) * 0.15;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(124,58,237,${alpha})`;
                        ctx.lineWidth = 0.6;
                        ctx.stroke();
                    }
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            connectParticles();
            animationId = requestAnimationFrame(animate);
        };
        animate();
    }

    /* ------------------------------------------
       FOOTER YEAR
    ------------------------------------------ */
    const footerYear = document.getElementById('footerYear');
    if (footerYear) footerYear.textContent = new Date().getFullYear();

});

/* ------------------------------------------
   SHAKE ANIMATION (Injected via JS)
------------------------------------------ */
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%, 60% { transform: translateX(-8px); }
    40%, 80% { transform: translateX(8px); }
}
`;
document.head.appendChild(shakeStyle);
