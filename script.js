class PortfolioApp {
            constructor() {
                this.init();
                this.bindEvents();
                this.startAnimations();
            }

            init() {

                        
                document.body.classList.add('loading');
    
    // Hide loading screen after page load with proper animation
    window.addEventListener('load', () => {
        setTimeout(() => {
            this.loadingScreen.style.opacity = '0';
            this.loadingScreen.style.pointerEvents = 'none';
            document.body.classList.remove('loading');
            this.startPageAnimations();
        }, 1500);
    });

                        
                this.navbar = document.getElementById('navbar');
                this.progressBar = document.getElementById('progressBar');
                this.themeToggle = document.getElementById('themeToggle');
                this.mobileMenuToggle = document.getElementById('mobileMenuToggle');
                this.navLinks = document.getElementById('navLinks');
                this.loadingScreen = document.getElementById('loadingScreen');
                
                // Theme initialization
                this.initTheme();
                
                // Hide loading screen after page load
                window.addEventListener('load', () => {
                    setTimeout(() => {
                        this.loadingScreen.classList.add('hidden');
                        this.startPageAnimations();
                    }, 1500);
                });
            }

            bindEvents() {
                // Scroll events
                window.addEventListener('scroll', () => {
                    this.updateScrollProgress();
                    this.updateNavbarStyle();
                    this.updateActiveNavLink();
                    this.animateOnScroll();
                });

                // Theme toggle
                this.themeToggle.addEventListener('click', () => this.toggleTheme());

                // Mobile menu
                this.mobileMenuToggle.addEventListener('click', () => this.toggleMobileMenu());

                // Smooth scrolling for nav links
                document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                    anchor.addEventListener('click', (e) => this.smoothScroll(e));
                });

                // Contact form
                document.getElementById('contactForm').addEventListener('submit', (e) => this.handleContactForm(e));

                // Project filter
                document.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => this.filterProjects(e));
                });

                // Typing effect
                this.typewriterEffect();

                // Particle system
                this.createParticleSystem();

                // Stats counter animation
                this.animateCounters();

                // Skill progress bars
                this.animateSkillBars();
            }

            initTheme() {
                const savedTheme = localStorage.getItem('theme') || 'light';
                document.body.setAttribute('data-theme', savedTheme);
                this.updateThemeIcon(savedTheme);
            }

            toggleTheme() {
                const currentTheme = document.body.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                
                document.body.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                this.updateThemeIcon(newTheme);
            }

            updateThemeIcon(theme) {
                const icon = this.themeToggle.querySelector('i');
                icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }

            toggleMobileMenu() {
                this.mobileMenuToggle.classList.toggle('active');
                this.navLinks.classList.toggle('active');
            }

            smoothScroll(e) {
                e.preventDefault();
                const target = document.querySelector(e.target.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Close mobile menu
                    this.navLinks.classList.remove('active');
                    this.mobileMenuToggle.classList.remove('active');
                }
            }

            updateScrollProgress() {
                const scrollTop = window.pageYOffset;
                const docHeight = document.body.scrollHeight - window.innerHeight;
                const scrollPercent = (scrollTop / docHeight) * 100;
                this.progressBar.style.width = scrollPercent + '%';
            }

            updateNavbarStyle() {
                if (window.scrollY > 100) {
                    this.navbar.classList.add('scrolled');
                } else {
                    this.navbar.classList.remove('scrolled');
                }
            }

            updateActiveNavLink() {
                const sections = document.querySelectorAll('section[id]');
                const navLinks = document.querySelectorAll('.nav-link');
                
                let current = '';
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.clientHeight;
                    if (pageYOffset >= sectionTop - 200) {
                        current = section.getAttribute('id');
                    }
                });

                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${current}`) {
                        link.classList.add('active');
                    }
                });
            }

            animateOnScroll() {
                const elements = document.querySelectorAll('.animate-on-scroll');
                const windowHeight = window.innerHeight;
                
                elements.forEach(element => {
                    const elementTop = element.getBoundingClientRect().top;
                    const elementVisible = 150;
                    
                    if (elementTop < windowHeight - elementVisible) {
                        element.classList.add('animated');
                    }
                });
            }

            typewriterEffect() {
                const heroName = document.getElementById('heroName');
                const text = 'Kaiser Mohiuddin';
                heroName.innerHTML = '';
                
                let i = 0;
                const typeWriter = () => {
                    if (i < text.length) {
                        heroName.innerHTML += text.charAt(i);
                        i++;
                        setTimeout(typeWriter, 200);
                    } else {
                        // Add cursor blink effect
                        heroName.innerHTML += '<span class="cursor"></span>';
                        setTimeout(() => {
                            heroName.querySelector('.cursor').style.animation = 'blink 1s infinite';
                        }, 500);
                    }
                };
                
                setTimeout(typeWriter, 2000);
            }

            animateCounters() {
                const counters = document.querySelectorAll('[data-count]');
                const speed = 300;

                counters.forEach(counter => {
                    const updateCount = () => {
                        const target = +counter.getAttribute('data-count');
                        const count = +counter.innerText;
                        const inc = target / speed;

                        if (count < target) {
                            counter.innerText = Math.ceil(count + inc);
                            setTimeout(updateCount, 1);
                        } else {
                            counter.innerText = target;
                        }
                    };

                    // Trigger animation when element is visible
                    const observer = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                updateCount();
                                observer.unobserve(entry.target);
                            }
                        });
                    });

                    observer.observe(counter);
                });
            }

            animateSkillBars() {
                const skillBars = document.querySelectorAll('.skill-progress');
                
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const progress = entry.target.getAttribute('data-progress');
                            entry.target.style.width = progress + '%';
                            observer.unobserve(entry.target);
                        }
                    });
                });

                skillBars.forEach(bar => {
                    observer.observe(bar);
                });
            }

            filterProjects(e) {
                const filter = e.target.getAttribute('data-filter');
                const projects = document.querySelectorAll('.project-card');
                const filterBtns = document.querySelectorAll('.filter-btn');

                // Update active filter button
                filterBtns.forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');

                // Filter projects
                projects.forEach(project => {
                    if (filter === 'all' || project.getAttribute('data-category').includes(filter)) {
                        project.style.display = 'block';
                        project.style.animation = 'fadeInUp 0.6s ease forwards';
                    } else {
                        project.style.display = 'none';
                    }
                });
            }

            createParticleSystem() {
                const particlesContainer = document.getElementById('particles');
                const particleCount = 50;

                for (let i = 0; i < particleCount; i++) {
                    setTimeout(() => {
                        this.createParticle(particlesContainer);
                    }, i * 100);
                }

                // Continuously create particles
                setInterval(() => {
                    this.createParticle(particlesContainer);
                }, 3000);
            }

            createParticle(container) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = '100%';
                particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
                particle.style.animationDelay = Math.random() * 2 + 's';
                
                const keyframes = `
                    @keyframes particleFloat${Date.now()} {
                        0% {
                            transform: translateY(0) rotate(0deg);
                            opacity: 0;
                        }
                        10% {
                            opacity: 1;
                        }
                        90% {
                            opacity: 1;
                        }
                        100% {
                            transform: translateY(-100vh) rotate(360deg);
                            opacity: 0;
                        }
                    }
                `;
                
                const style = document.createElement('style');
                style.textContent = keyframes;
                document.head.appendChild(style);
                
                particle.style.animation = `particleFloat${Date.now()} ${particle.style.animationDuration} linear forwards`;
                
                container.appendChild(particle);
                
                setTimeout(() => {
                    particle.remove();
                    style.remove();
                }, 20000);
            }

            handleContactForm(e) {
                e.preventDefault();
                
                const form = e.target;
                const formData = new FormData(form);
                const submitBtn = form.querySelector('button[type="submit"]');
                const btnText = submitBtn.innerHTML;
                const btnLoading = submitBtn.querySelector('.btn-loading');
                
                // Show loading state
                submitBtn.disabled = true;
                submitBtn.querySelector('i').style.display = 'none';
                submitBtn.querySelector('span') && (submitBtn.querySelector('span').style.display = 'none');
                btnLoading.style.display = 'inline-flex';
                
                // Simulate form submission
                setTimeout(() => {
                    // Show success message
                    this.showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                    
                    // Reset form
                    form.reset();
                    
                    // Reset button
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = btnText;
                    btnLoading.style.display = 'none';
                }, 2000);
            }

            showNotification(message, type = 'info') {
                const notification = document.createElement('div');
                notification.className = `notification notification-${type}`;
                notification.innerHTML = `
                    <div class="notification-content">
                        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                        <span>${message}</span>
                    </div>
                    <button class="notification-close">&times;</button>
                `;
                
                document.body.appendChild(notification);
                
                // Auto remove after 5 seconds
                setTimeout(() => {
                    notification.remove();
                }, 5000);
                
                // Manual close
                notification.querySelector('.notification-close').addEventListener('click', () => {
                    notification.remove();
                });
            }

            startAnimations() {
                // Initial scroll animation
                this.animateOnScroll();
                
                // Add CSS for animations
                const animationStyles = `
                    .cursor {
                        animation: blink 1s infinite;
                    }
                    
                    @keyframes blink {
                        0%, 50% { opacity: 1; }
                        51%, 100% { opacity: 0; }
                    }
                    
                    .notification {
                        position: fixed;
                        top: 100px;
                        right: 20px;
                        background: var(--bg-surface);
                        border: 1px solid var(--border-primary);
                        border-radius: var(--radius-lg);
                        padding: var(--space-lg);
                        box-shadow: var(--shadow-xl);
                        z-index: 10000;
                        display: flex;
                        align-items: center;
                        gap: var(--space-md);
                        min-width: 300px;
                        animation: slideInRight 0.3s ease;
                    }
                    
                    .notification-success {
                        border-left: 4px solid var(--success);
                    }
                    
                    .notification-content {
                        display: flex;
                        align-items: center;
                        gap: var(--space-sm);
                        flex: 1;
                    }
                    
                    .notification-close {
                        background: none;
                        border: none;
                        font-size: 1.2rem;
                        cursor: pointer;
                        color: var(--text-secondary);
                    }
                    
                    @keyframes slideInRight {
                        from {
                            transform: translateX(100%);
                            opacity: 0;
                        }
                        to {
                            transform: translateX(0);
                            opacity: 1;
                        }
                    }
                    
                    .footer-links {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                        gap: var(--space-2xl);
                        margin: var(--space-3xl) 0;
                        text-align: left;
                    }
                    
                    .footer-section h3 {
                        color: var(--text-primary);
                        margin-bottom: var(--space-lg);
                        font-size: 1.125rem;
                        font-weight: 600;
                    }
                    
                    .footer-section ul {
                        list-style: none;
                    }
                    
                    .footer-section ul li {
                        margin-bottom: var(--space-sm);
                    }
                    
                    .footer-section ul li a {
                        color: var(--text-secondary);
                        text-decoration: none;
                        transition: var(--transition-normal);
                    }
                    
                    .footer-section ul li a:hover {
                        color: var(--primary);
                    }
                    
                    .checkbox-group {
                        display: flex;
                        align-items: center;
                        gap: var(--space-sm);
                    }
                    
                    .checkbox-group input[type="checkbox"] {
                        width: 18px;
                        height: 18px;
                    }
                    
                    .checkbox-group label {
                        font-size: 0.875rem;
                        color: var(--text-secondary);
                    }
                `;
                
                const style = document.createElement('style');
                style.textContent = animationStyles;
                document.head.appendChild(style);
            }

            startPageAnimations() {
                // Trigger initial animations
                setTimeout(() => {
                    this.animateOnScroll();
                }, 500);
            }
        }

        // Initialize the portfolio app
        document.addEventListener('DOMContentLoaded', () => {
            new PortfolioApp();
        });

        // Preloader optimization
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
        });

        // Service Worker for performance (optional)
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .catch(() => console.log('Service Worker registration failed'));
            });

        }
