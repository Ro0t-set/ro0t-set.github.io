/**
 * Tommaso Patriti Portfolio
 * Theme, Language & Modal functionality
 */

(function() {
    'use strict';

    // ==========================================================================
    // Theme Toggle
    // ==========================================================================
    
    const THEME_KEY = 'portfolio-theme';
    
    function getInitialTheme() {
        const saved = localStorage.getItem(THEME_KEY);
        if (saved && ['light', 'dark'].includes(saved)) {
            return saved;
        }
        return 'light';
    }
    
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(THEME_KEY, theme);
    }
    
    function initTheme() {
        const initialTheme = getInitialTheme();
        setTheme(initialTheme);
        
        const toggle = document.getElementById('themeToggle');
        if (toggle) {
            toggle.addEventListener('click', () => {
                const current = document.documentElement.getAttribute('data-theme');
                setTheme(current === 'dark' ? 'light' : 'dark');
                lucide.createIcons();
            });
        }
    }

    // ==========================================================================
    // Language Switcher
    // ==========================================================================
    
    const LANG_KEY = 'portfolio-lang';
    const DEFAULT_LANG = 'it';
    
    function getInitialLanguage() {
        const saved = localStorage.getItem(LANG_KEY);
        if (saved && ['it', 'en'].includes(saved)) {
            return saved;
        }
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang && browserLang.startsWith('en')) {
            return 'en';
        }
        return DEFAULT_LANG;
    }
    
    function applyLanguage(lang) {
        document.querySelectorAll('[data-it][data-en]').forEach(el => {
            const text = el.getAttribute(`data-${lang}`);
            if (text) {
                el.textContent = text;
            }
        });
        
        document.documentElement.lang = lang;
        updateMetaTags(lang);
        
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
        
        localStorage.setItem(LANG_KEY, lang);
    }
    
    function updateMetaTags(lang) {
        const meta = {
            it: {
                title: 'Tommaso Patriti | Software Engineer Freelance Bologna - Microservizi & Cloud',
                description: 'Tommaso Patriti, Software Engineer Freelance a Bologna. Specializzato in sistemi distribuiti, microservizi, architetture cloud-native e clean code. P.IVA 04291431205'
            },
            en: {
                title: 'Tommaso Patriti | Freelance Software Engineer Bologna - Microservices & Cloud',
                description: 'Tommaso Patriti, Freelance Software Engineer based in Bologna. Specialized in distributed systems, microservices, cloud-native architectures and clean code. VAT 04291431205'
            }
        };
        
        const m = meta[lang];
        document.title = m.title;
        
        const descMeta = document.querySelector('meta[name="description"]');
        if (descMeta) descMeta.content = m.description;
    }
    
    function initLanguage() {
        const initialLang = getInitialLanguage();
        applyLanguage(initialLang);
        
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.dataset.lang;
                if (lang) {
                    applyLanguage(lang);
                }
            });
        });
    }

    // ==========================================================================
    // Modals
    // ==========================================================================
    
    function initModals() {
        const privacyLink = document.getElementById('privacyLink');
        const termsLink = document.getElementById('termsLink');
        const privacyModal = document.getElementById('privacyModal');
        const termsModal = document.getElementById('termsModal');
        const closePrivacy = document.getElementById('closePrivacy');
        const closeTerms = document.getElementById('closeTerms');
        
        function openModal(modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            lucide.createIcons();
        }
        
        function closeModal(modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        if (privacyLink && privacyModal) {
            privacyLink.addEventListener('click', (e) => {
                e.preventDefault();
                openModal(privacyModal);
            });
        }
        
        if (termsLink && termsModal) {
            termsLink.addEventListener('click', (e) => {
                e.preventDefault();
                openModal(termsModal);
            });
        }
        
        if (closePrivacy && privacyModal) {
            closePrivacy.addEventListener('click', () => closeModal(privacyModal));
        }
        
        if (closeTerms && termsModal) {
            closeTerms.addEventListener('click', () => closeModal(termsModal));
        }
        
        // Close on backdrop click
        [privacyModal, termsModal].forEach(modal => {
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        closeModal(modal);
                    }
                });
            }
        });
        
        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                [privacyModal, termsModal].forEach(modal => {
                    if (modal && modal.classList.contains('active')) {
                        closeModal(modal);
                    }
                });
            }
        });
    }

    // ==========================================================================
    // Interactive Terminal Animation
    // ==========================================================================

    const terminalCommands = [
        {
            cmd: 'whoami',
            output: '<span class="info">tommaso.patriti</span> — Software Engineer'
        },
        {
            cmd: 'cat skills.json | jq',
            output: '<span class="highlight">{</span> microservices, cloud, clean-code <span class="highlight">}</span>'
        },
        {
            cmd: 'docker ps --filter "status=running"',
            output: '<span class="success">3 services running</span> — API, Auth, Gateway'
        },
        {
            cmd: 'git log --oneline -1',
            output: '<span class="info">feat:</span> simplify over-engineered architecture'
        },
        {
            cmd: 'kubectl get pods -n production',
            output: '<span class="success">All pods healthy</span> — 99.9% uptime'
        }
    ];

    function initTerminal() {
        const commandEl = document.getElementById('terminalCommand');
        const outputEl = document.getElementById('terminalOutput');

        if (!commandEl || !outputEl) return;

        let currentIndex = 0;

        function typeCommand(text, callback) {
            let i = 0;
            commandEl.textContent = '';
            outputEl.classList.remove('visible');
            outputEl.innerHTML = '';

            function type() {
                if (i < text.length) {
                    commandEl.textContent += text.charAt(i);
                    i++;
                    setTimeout(type, 50 + Math.random() * 50);
                } else {
                    setTimeout(callback, 400);
                }
            }
            type();
        }

        function showOutput(html) {
            outputEl.innerHTML = html;
            outputEl.classList.add('visible');
        }

        function runSequence() {
            const current = terminalCommands[currentIndex];

            typeCommand(current.cmd, () => {
                showOutput(current.output);
                currentIndex = (currentIndex + 1) % terminalCommands.length;
                setTimeout(runSequence, 3000);
            });
        }

        setTimeout(runSequence, 1000);
    }

    // ==========================================================================
    // Scroll Reveal Animations
    // ==========================================================================

    function initScrollReveal() {
        const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-stagger');

        if (!revealElements.length) return;

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -80px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        revealElements.forEach(el => observer.observe(el));
    }

    // ==========================================================================
    // Initialize
    // ==========================================================================

    function init() {
        initTheme();
        initLanguage();
        initModals();
        initTerminal();
        initScrollReveal();

        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
