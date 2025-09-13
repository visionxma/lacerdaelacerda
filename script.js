// Script otimizado para performance e responsividade
(function() {
    'use strict';

    // Configurações de performance
    const PERFORMANCE_CONFIG = {
        THROTTLE_DELAY: 16, // ~60fps
        DEBOUNCE_DELAY: 250,
        INTERSECTION_THRESHOLD: 0.1,
        INTERSECTION_ROOT_MARGIN: '50px'
    };

    // Utilitários de performance
    const throttle = (func, delay) => {
        let timeoutId;
        let lastExecTime = 0;
        return function (...args) {
            const currentTime = Date.now();
            if (currentTime - lastExecTime > delay) {
                func.apply(this, args);
                lastExecTime = currentTime;
            } else {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func.apply(this, args);
                    lastExecTime = Date.now();
                }, delay - (currentTime - lastExecTime));
            }
        };
    };

    const debounce = (func, delay) => {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    };

    // Mobile Menu com animações suaves
    class MobileMenu {
        constructor() {
            this.menuBtn = document.getElementById('mobile-menu-btn');
            this.nav = document.getElementById('nav');
            this.navLinks = document.querySelectorAll('.nav-link');
            this.isOpen = false;
            
            this.init();
        }

        init() {
            if (!this.menuBtn || !this.nav) return;
            
            this.menuBtn.addEventListener('click', this.toggle.bind(this));
            this.navLinks.forEach(link => {
                link.addEventListener('click', this.close.bind(this));
            });
            
            // Fechar menu ao clicar fora
            document.addEventListener('click', (e) => {
                if (this.isOpen && !this.nav.contains(e.target) && !this.menuBtn.contains(e.target)) {
                    this.close();
                }
            });

            // Fechar menu com ESC
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.close();
                }
            });
        }

        toggle() {
            this.isOpen ? this.close() : this.open();
        }

        open() {
            this.nav.classList.add('active');
            this.menuBtn.classList.add('active');
            this.menuBtn.setAttribute('aria-expanded', 'true');
            this.isOpen = true;
            
            // Prevenir scroll do body
            document.body.style.overflow = 'hidden';
        }

        close() {
            this.nav.classList.remove('active');
            this.menuBtn.classList.remove('active');
            this.menuBtn.setAttribute('aria-expanded', 'false');
            this.isOpen = false;
            
            // Restaurar scroll do body
            document.body.style.overflow = '';
        }
    }

    // Header com efeito de scroll otimizado
    class HeaderController {
        constructor() {
            this.header = document.getElementById('header');
            this.lastScrollY = 0;
            this.ticking = false;
            
            this.init();
        }

        init() {
            if (!this.header) return;
            
            const handleScroll = throttle(() => {
                this.updateHeader();
            }, PERFORMANCE_CONFIG.THROTTLE_DELAY);

            window.addEventListener('scroll', handleScroll, { passive: true });
        }

        updateHeader() {
            const scrollY = window.pageYOffset;
            
            if (scrollY > 100) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }

            this.lastScrollY = scrollY;
        }
    }

    // Smooth Scrolling otimizado
    class SmoothScroller {
        constructor() {
            this.init();
        }

        init() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', this.handleClick.bind(this));
            });
        }

        handleClick(e) {
            e.preventDefault();
            
            const targetId = e.currentTarget.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (!target) return;
            
            const header = document.getElementById('header');
            const headerHeight = header ? header.offsetHeight : 0;
            const targetPosition = target.offsetTop - headerHeight - 20;
            
            // Usar requestAnimationFrame para smooth scrolling
            this.smoothScrollTo(targetPosition);
        }

        smoothScrollTo(targetPosition) {
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            const duration = Math.min(Math.abs(distance) / 2, 1000); // Max 1s
            let start = null;

            const animation = (currentTime) => {
                if (start === null) start = currentTime;
                const timeElapsed = currentTime - start;
                const progress = Math.min(timeElapsed / duration, 1);
                
                // Easing function (ease-in-out)
                const ease = progress < 0.5 
                    ? 2 * progress * progress 
                    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
                
                window.scrollTo(0, startPosition + distance * ease);
                
                if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                }
            };

            requestAnimationFrame(animation);
        }
    }

    // Intersection Observer para animações
    class AnimationController {
        constructor() {
            this.observerOptions = {
                threshold: PERFORMANCE_CONFIG.INTERSECTION_THRESHOLD,
                rootMargin: PERFORMANCE_CONFIG.INTERSECTION_ROOT_MARGIN
            };
            
            this.init();
        }

        init() {
            // Observer para elementos que aparecem
            this.createObserver('.area-card, .credential-item, .info-item, .equipe-card', 'animate');
        }

        createObserver(selector, className) {
            const elements = document.querySelectorAll(selector);
            if (elements.length === 0) return;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add(className);
                        observer.unobserve(entry.target);
                    }
                });
            }, this.observerOptions);

            elements.forEach(el => {
                observer.observe(el);
            });
        }
    }

    // Active Navigation Link
    class NavigationController {
        constructor() {
            this.sections = document.querySelectorAll('section[id]');
            this.navLinks = document.querySelectorAll('.nav-link');
            this.header = document.getElementById('header');
            
            this.init();
        }

        init() {
            if (this.sections.length === 0 || this.navLinks.length === 0) return;
            
            const handleScroll = throttle(() => {
                this.updateActiveLink();
            }, PERFORMANCE_CONFIG.THROTTLE_DELAY);

            window.addEventListener('scroll', handleScroll, { passive: true });
        }

        updateActiveLink() {
            const headerHeight = this.header ? this.header.offsetHeight : 0;
            const scrollPosition = window.scrollY + headerHeight + 100;
            
            let current = '';
            
            this.sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            
            this.navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }
    }

    // Form Handler otimizado
    class FormHandler {
        constructor() {
            this.form = document.getElementById('contato-form');
            this.init();
        }

        init() {
            if (!this.form) return;
            
            this.form.addEventListener('submit', this.handleSubmit.bind(this));
            
            // Validação em tempo real
            const inputs = this.form.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', this.validateField.bind(this));
                input.addEventListener('input', debounce(this.validateField.bind(this), 300));
            });

            // Navegação com Enter
            inputs.forEach((input, index) => {
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter' && input.tagName !== 'TEXTAREA') {
                        e.preventDefault();
                        const nextInput = inputs[index + 1];
                        if (nextInput) {
                            nextInput.focus();
                        } else {
                            this.form.querySelector('button[type="submit"]').click();
                        }
                    }
                });
            });
        }

        validateField(e) {
            const field = e.target;
            const value = field.value.trim();
            
            // Remove classes de validação anteriores
            field.classList.remove('valid', 'invalid');
            
            // Validação básica
            let isValid = true;
            
            if (field.hasAttribute('required') && !value) {
                isValid = false;
            }
            
            if (field.type === 'email' && value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                isValid = emailRegex.test(value);
            }
            
            // Adiciona classe de validação
            field.classList.add(isValid ? 'valid' : 'invalid');
            
            return isValid;
        }

        handleSubmit(e) {
            e.preventDefault();
            
            // Validar todos os campos
            const inputs = this.form.querySelectorAll('input, textarea');
            let isFormValid = true;
            
            inputs.forEach(input => {
                if (!this.validateField({ target: input })) {
                    isFormValid = false;
                }
            });
            
            if (!isFormValid) {
                this.showMessage('Por favor, corrija os campos em vermelho.', 'error');
                return;
            }
            
            // Coletar dados do formulário
            const formData = new FormData(this.form);
            const data = {
                nome: formData.get('nome'),
                email: formData.get('email'),
                assunto: formData.get('assunto'),
                mensagem: formData.get('mensagem')
            };
            
            // Criar mensagem para WhatsApp
            const whatsappMessage = this.createWhatsAppMessage(data);
            
            // Abrir WhatsApp
            window.open(`https://wa.me/5599981983630?text=${whatsappMessage}`, '_blank');
            
            // Mostrar mensagem de sucesso
            this.showMessage('Redirecionando para o WhatsApp...', 'success');
            
            // Reset do formulário
            this.form.reset();
            inputs.forEach(input => input.classList.remove('valid', 'invalid'));
        }

        createWhatsAppMessage(data) {
            const message = `Olá! Meu nome é ${data.nome}.\n\n*Assunto:* ${data.assunto}\n\n*Mensagem:* ${data.mensagem}\n\n*E-mail para contato:* ${data.email}`;
            return encodeURIComponent(message);
        }

        showMessage(text, type) {
            // Criar elemento de mensagem
            const messageEl = document.createElement('div');
            messageEl.className = `form-message form-message--${type}`;
            messageEl.textContent = text;
            
            // Estilos inline para a mensagem
            Object.assign(messageEl.style, {
                position: 'fixed',
                top: '20px',
                right: '20px',
                padding: '1rem 1.5rem',
                borderRadius: '8px',
                color: '#ffffff',
                fontWeight: '600',
                zIndex: '10000',
                transform: 'translateX(100%)',
                transition: 'transform 0.3s ease',
                backgroundColor: type === 'success' ? '#DC2626' : '#B91C1C'
            });
            
            document.body.appendChild(messageEl);
            
            // Animar entrada
            requestAnimationFrame(() => {
                messageEl.style.transform = 'translateX(0)';
            });
            
            // Remover após 3 segundos
            setTimeout(() => {
                messageEl.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (messageEl.parentNode) {
                        messageEl.parentNode.removeChild(messageEl);
                    }
                }, 300);
            }, 3000);
        }
    }

    // Performance Monitor
    class PerformanceMonitor {
        constructor() {
            this.metrics = {
                loadTime: 0,
                domContentLoaded: 0,
                firstPaint: 0,
                firstContentfulPaint: 0
            };
            
            this.init();
        }

        init() {
            // Medir tempo de carregamento
            window.addEventListener('load', () => {
                this.measurePerformance();
            });
        }

        measurePerformance() {
            if ('performance' in window) {
                const navigation = performance.getEntriesByType('navigation')[0];
                const paint = performance.getEntriesByType('paint');
                
                this.metrics.loadTime = navigation.loadEventEnd - navigation.fetchStart;
                this.metrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart;
                
                paint.forEach(entry => {
                    if (entry.name === 'first-paint') {
                        this.metrics.firstPaint = entry.startTime;
                    }
                    if (entry.name === 'first-contentful-paint') {
                        this.metrics.firstContentfulPaint = entry.startTime;
                    }
                });
                
                // Log das métricas (apenas em desenvolvimento)
                if (window.location.hostname === 'localhost') {
                    console.log('Performance Metrics:', this.metrics);
                }
            }
        }
    }

    // Fraud Alert Controller
    class FraudAlertController {
        constructor() {
            this.alert = document.getElementById('fraud-alert');
            this.closeBtn = document.getElementById('fraud-alert-close');
            this.isMinimized = false;
            this.isHidden = false;
            
            this.init();
        }

        init() {
            if (!this.alert || !this.closeBtn) return;
            
            // Verificar se o usuário já fechou o alerta (localStorage)
            const alertClosed = localStorage.getItem('fraudAlertClosed');
            const alertClosedTime = localStorage.getItem('fraudAlertClosedTime');
            
            // Mostrar alerta novamente após 7 dias
            if (alertClosed && alertClosedTime) {
                const daysSinceClosed = (Date.now() - parseInt(alertClosedTime)) / (1000 * 60 * 60 * 24);
                if (daysSinceClosed < 7) {
                    this.hide();
                    return;
                }
            }
            
            // Event listeners
            this.closeBtn.addEventListener('click', this.handleClose.bind(this));
            this.alert.addEventListener('click', this.handleClick.bind(this));
            
            // Auto-minimizar após 10 segundos
            setTimeout(() => {
                if (!this.isHidden) {
                    this.minimize();
                }
            }, 10000);
            
            // Mostrar alerta com animação após 3 segundos
            setTimeout(() => {
                this.show();
            }, 3000);
        }

        show() {
            if (this.alert) {
                this.alert.style.opacity = '0';
                this.alert.style.transform = 'translateX(-100%)';
                this.alert.style.display = 'block';
                
                requestAnimationFrame(() => {
                    this.alert.style.transition = 'all 0.5s ease-out';
                    this.alert.style.opacity = '1';
                    this.alert.style.transform = 'translateX(0)';
                });
            }
        }

        minimize() {
            if (this.alert && !this.isMinimized && !this.isHidden) {
                this.alert.classList.add('minimized');
                this.isMinimized = true;
            }
        }

        expand() {
            if (this.alert && this.isMinimized) {
                this.alert.classList.remove('minimized');
                this.isMinimized = false;
                
                // Auto-minimizar novamente após 8 segundos
                setTimeout(() => {
                    if (!this.isHidden) {
                        this.minimize();
                    }
                }, 8000);
            }
        }

        hide() {
            if (this.alert) {
                this.alert.classList.add('hidden');
                this.isHidden = true;
                
                // Salvar no localStorage
                localStorage.setItem('fraudAlertClosed', 'true');
                localStorage.setItem('fraudAlertClosedTime', Date.now().toString());
            }
        }

        handleClose(e) {
            e.stopPropagation();
            this.hide();
        }

        handleClick(e) {
            if (this.isMinimized && !e.target.closest('.fraud-alert-close')) {
                e.preventDefault();
                this.expand();
            }
        }
    }

    // Inicialização quando DOM estiver pronto
    const initializeApp = () => {
        // Verificar se elementos críticos existem
        const criticalElements = ['header', 'mobile-menu-btn'];
        const elementsExist = criticalElements.every(id => document.getElementById(id));
        
        if (!elementsExist) {
            console.warn('Alguns elementos críticos não foram encontrados');
        }

        // Inicializar componentes
        new MobileMenu();
        new HeaderController();
        new SmoothScroller();
        new AnimationController();
        new NavigationController();
        new FormHandler();
        new PerformanceMonitor();
        new FraudAlertController();
        
        // Adicionar classe de carregamento completo
        document.body.classList.add('loaded');
        
        // Remover loading screen
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    };

    // Event Listeners
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeApp);
    } else {
        initializeApp();
    }

    // Adicionar estilos de validação de formulário
    const addFormValidationStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            .form-group input.valid,
            .form-group textarea.valid {
                border-color: #10B981;
                box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
            }
            
            .form-group input.invalid,
            .form-group textarea.invalid {
                border-color: #DC2626;
                box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
            }
            
            .nav-link.active {
                color: var(--primary-color);
            }
            
            .nav-link.active::after {
                width: 100%;
            }
            
            body.loaded * {
                animation-play-state: running;
            }
            
            /* Otimizações de performance */
            .hero-background {
                transform: translateZ(0);
                backface-visibility: hidden;
            }
            
            .area-card,
            .credential-item,
            .info-item,
            .equipe-card {
                transform: translateZ(0);
                backface-visibility: hidden;
            }
        `;
        document.head.appendChild(style);
    };

    // Adicionar estilos quando DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addFormValidationStyles);
    } else {
        addFormValidationStyles();
    }

})();