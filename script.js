/**
 * Neumorphic Header Controller
 * Handles language switching, mobile menu, active link highlighting, and accessibility
 */

// Translation data for multi-language support
const translations = {
    en: {
        home: 'Home',
        about: 'About',
        services: 'Services',
        projects: 'Projects',
        reviews: 'Reviews',
        contact: 'Contact Us'
    },
    es: {
        home: 'Inicio',
        about: 'Acerca de',
        services: 'Servicios',
        projects: 'Proyectos',
        reviews: 'Reseñas',
        contact: 'Contáctanos'
    },
    ur: {
        home: 'ہوم',
        about: 'کے بارے میں',
        services: 'خدمات',
        projects: 'پروجیکٹس',
        reviews: 'جائزے',
        contact: 'رابطہ کریں'
    }
};

/**
 * Services Section Controller
 * Handles service card interactions, tilt effects, and animations
 */
class ServicesController {
    constructor() {
        this.serviceCards = document.querySelectorAll('.service-card');
        this.servicesSection = document.querySelector('.services');
        
        this.init();
    }

    /**
     * Initialize services section functionality
     */
    init() {
        this.setupCardInteractions();
        this.setupTiltEffects();
        this.setupScrollAnimations();
        this.setupKeyboardNavigation();
        
        console.log('Services controller initialized successfully');
    }

    /**
     * Set up service card click interactions
     */
    setupCardInteractions() {
        this.serviceCards.forEach((card, index) => {
            card.addEventListener('click', (e) => {
                // Don't trigger card click if CTA button was clicked
                if (!e.target.classList.contains('card-cta')) {
                    this.handleCardClick(card, index);
                }
            });
        });
        
        // Handle CTA button clicks separately
        const ctaButtons = document.querySelectorAll('.card-cta');
        ctaButtons.forEach((button, index) => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleCTAClick(button, index);
            });
        });
    }

    /**
     * Set up hover tilt effects for service cards
     */
    setupTiltEffects() {
        this.serviceCards.forEach(card => {
            if (!card.hasAttribute('data-tilt')) return;
            
            card.addEventListener('mouseenter', () => {
                card.style.transition = 'transform 0.1s ease-out';
            });
            
            card.addEventListener('mousemove', (e) => {
                if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
                this.applyTiltEffect(card, e);
            });
            
            card.addEventListener('mouseleave', () => {
                this.resetTilt(card);
            });
        });
    }

    /**
     * Apply tilt effect based on mouse position
     * @param {HTMLElement} card - Service card element
     * @param {MouseEvent} e - Mouse event
     */
    applyTiltEffect(card, e) {
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;
        
        // Limit tilt to 6-8 degrees as specified
        const maxTilt = 7;
        const tiltX = (mouseY / (rect.height / 2)) * maxTilt;
        const tiltY = (mouseX / (rect.width / 2)) * maxTilt;
        
        // Clamp values
        const clampedTiltX = Math.max(-maxTilt, Math.min(maxTilt, -tiltX));
        const clampedTiltY = Math.max(-maxTilt, Math.min(maxTilt, tiltY));
        
        card.style.transform = `perspective(1000px) rotateX(${clampedTiltX}deg) rotateY(${clampedTiltY}deg) translateY(-8px) scale(1.02)`;
    }

    /**
     * Reset tilt effect to normal state
     * @param {HTMLElement} card - Service card element
     */
    resetTilt(card) {
        card.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        card.style.transform = '';
    }

    /**
     * Set up scroll animations with staggered reveal
     */
    setupScrollAnimations() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        // Staggered animation delay
                        setTimeout(() => {
                            entry.target.classList.add('animate-in');
                        }, index * 100);
                    }
                });
            }, {
                threshold: 0.2,
                rootMargin: '0px 0px -50px 0px'
            });

            // Observe service cards
            this.serviceCards.forEach(card => {
                observer.observe(card);
            });
            
            // Observe services header
            const servicesHeader = document.querySelector('.services-header');
            if (servicesHeader) {
                observer.observe(servicesHeader);
            }
        }
    }

    /**
     * Set up keyboard navigation for service cards
     */
    setupKeyboardNavigation() {
        this.serviceCards.forEach((card, index) => {
            // Make cards focusable
            card.setAttribute('tabindex', '0');
            
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleCardClick(card, index);
                }
                
                // Arrow key navigation
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    this.focusNextCard(index);
                }
                
                if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    this.focusPreviousCard(index);
                }
            });
        });
        
        // Setup keyboard navigation for CTA buttons
        const ctaButtons = document.querySelectorAll('.card-cta');
        ctaButtons.forEach((button, index) => {
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleCTAClick(button, index);
                }
            });
        });
    }

    /**
     * Handle service card click/activation
     * @param {HTMLElement} card - Clicked card
     * @param {number} index - Card index
     */
    handleCardClick(card, index) {
        const cardTitle = card.querySelector('.card-title').textContent;
        
        // Add active class for visual feedback
        card.classList.add('active');
        
        setTimeout(() => {
            card.classList.remove('active');
        }, 200);
        
        // In a real application, this would navigate or show more details
        console.log(`Service card clicked: ${cardTitle}`);
        
        // For demo, show notification
        this.showServiceNotification(cardTitle);
        
        // Announce to screen readers
        this.announceToScreenReader(`Selected ${cardTitle} service`);
    }

    /**
     * Handle CTA button click
     * @param {HTMLElement} button - Clicked CTA button
     * @param {number} index - Button index
     */
    handleCTAClick(button, index) {
        const card = button.closest('.service-card');
        const cardTitle = card.querySelector('.card-title').textContent;
        const ctaText = button.textContent.trim();
        
        // Add active class for visual feedback
        button.classList.add('active');
        card.classList.add('active');
        
        setTimeout(() => {
            button.classList.remove('active');
            card.classList.remove('active');
        }, 200);
        
        // In a real application, this would open contact form or service page
        console.log(`CTA clicked: ${ctaText} for ${cardTitle}`);
        
        // For demo, show specific CTA notification
        this.showCTANotification(cardTitle, ctaText);
        
        // Announce to screen readers
        this.announceToScreenReader(`${ctaText} for ${cardTitle} service`);
    }

    /**
     * Focus next service card
     * @param {number} currentIndex - Current card index
     */
    focusNextCard(currentIndex) {
        const nextIndex = (currentIndex + 1) % this.serviceCards.length;
        this.serviceCards[nextIndex].focus();
    }

    /**
     * Focus previous service card
     * @param {number} currentIndex - Current card index
     */
    focusPreviousCard(currentIndex) {
        const prevIndex = currentIndex === 0 ? this.serviceCards.length - 1 : currentIndex - 1;
        this.serviceCards[prevIndex].focus();
    }

    /**
     * Show service-specific notification
     * @param {string} serviceName - Name of the service
     */
    showServiceNotification(serviceName) {
        const notification = document.createElement('div');
        notification.className = 'service-notification';
        notification.textContent = `Learn more about our ${serviceName} service`;
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(91, 42, 224, 0.95);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--border-radius);
            backdrop-filter: blur(10px);
            box-shadow: 
                8px 8px 16px var(--shadow-dark),
                -8px -8px 16px var(--shadow-light);
            z-index: 10000;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease;
            max-width: 300px;
            font-size: 0.9rem;
            font-weight: 500;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    /**
     * Show CTA-specific notification
     * @param {string} serviceName - Name of the service
     * @param {string} ctaText - CTA button text
     */
    showCTANotification(serviceName, ctaText) {
        const notification = document.createElement('div');
        notification.className = 'cta-notification';
        notification.textContent = `Ready to ${ctaText.toLowerCase()}? Let's get started!`;
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, var(--accent-color), var(--accent-secondary));
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--border-radius);
            backdrop-filter: blur(10px);
            box-shadow: 
                8px 8px 16px var(--shadow-dark),
                -8px -8px 16px var(--shadow-light);
            z-index: 10000;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease;
            max-width: 320px;
            font-size: 0.9rem;
            font-weight: 600;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 4000);
    }

    /**
     * Announce messages to screen readers
     * @param {string} message - Message to announce
     */
    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.classList.add('sr-only');
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
}

/**
 * Hero Section Controller
 * Handles hero section interactions and accessibility
 */
class HeroController {
    constructor() {
        this.primaryBtn = document.querySelector('.btn-primary');
        this.secondaryBtn = document.querySelector('.btn-secondary');
        this.heroSection = document.querySelector('.hero');
        
        this.init();
    }

    /**
     * Initialize hero section functionality
     */
    init() {
        this.setupButtonInteractions();
        this.setupKeyboardNavigation();
        this.setupScrollAnimations();
        
        console.log('Hero controller initialized successfully');
    }

    /**
     * Set up button click and interaction handlers
     */
    setupButtonInteractions() {
        // Primary button (Read More) click handler
        if (this.primaryBtn) {
            this.primaryBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleReadMoreClick();
            });
        }

        // Secondary button (Contact Us) click handler
        if (this.secondaryBtn) {
            this.secondaryBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleContactClick();
            });
        }

        // Add ripple effect to buttons
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', (e) => {
                this.createRippleEffect(e, button);
            });
        });
    }

    /**
     * Set up keyboard navigation for buttons
     */
    setupKeyboardNavigation() {
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    button.click();
                }
            });
        });
    }

    /**
     * Set up scroll animations for hero section
     */
    setupScrollAnimations() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                    }
                });
            }, {
                threshold: 0.2,
                rootMargin: '0px 0px -50px 0px'
            });

            // Observe hero content elements
            const heroElements = document.querySelectorAll(
                '.hero-heading, .hero-subheading, .hero-description, .hero-buttons, .hero-image'
            );
            heroElements.forEach(el => observer.observe(el));
        }
    }

    /**
     * Handle Read More button click
     */
    handleReadMoreClick() {
        // In a real application, this would navigate to a services or about page
        console.log('Read More clicked');
        
        // For demo purposes, scroll to demo content
        const demoContent = document.querySelector('.demo-content');
        if (demoContent) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = demoContent.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
        
        // Announce to screen readers
        this.announceToScreenReader('Scrolling to more information');
    }

    /**
     * Handle Contact Us button click
     */
    handleContactClick() {
        // In a real application, this would open a contact form or navigate to contact page
        console.log('Contact Us clicked');
        
        // For demo purposes, show a notification
        this.showNotification('Contact form would open here!');
        
        // Announce to screen readers
        this.announceToScreenReader('Contact form activated');
    }

    /**
     * Create ripple effect on button click
     * @param {Event} e - Click event
     * @param {HTMLElement} button - Button element
     */
    createRippleEffect(e, button) {
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        // Add ripple animation keyframes if not already added
        if (!document.querySelector('#ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        button.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    /**
     * Show a temporary notification
     * @param {string} message - Notification message
     */
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: var(--bg-primary);
            color: var(--text-primary);
            padding: 1rem 1.5rem;
            border-radius: var(--border-radius);
            box-shadow: 
                8px 8px 16px var(--shadow-dark),
                -8px -8px 16px var(--shadow-light);
            z-index: 10000;
            opacity: 0;
            transform: translateY(-20px);
            transition: all 0.3s ease;
            max-width: 300px;
            font-size: 0.9rem;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    /**
     * Announce messages to screen readers
     * @param {string} message - Message to announce
     */
    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.classList.add('sr-only');
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        // Remove the announcement after a short delay
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
}

/**
 * Main Header Controller Class
 * Manages all header functionality including navigation, language switching, and mobile menu
 */
class HeaderController {
    constructor() {
        // DOM element references
        this.mobileToggle = document.getElementById('mobile-toggle');
        this.nav = document.querySelector('.nav');
        this.languageBtn = document.getElementById('language-toggle');
        this.languageDropdown = document.getElementById('language-dropdown');
        this.languageOptions = document.querySelectorAll('.language-option');
        this.currentLanguageSpan = document.getElementById('current-language');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        // State management
        this.isLanguageDropdownOpen = false;
        this.isMobileMenuOpen = false;
        this.currentLanguage = 'en';
        
        // Initialize the controller
        this.init();
    }

    /**
     * Initialize all functionality
     */
    init() {
        this.setupEventListeners();
        this.loadSavedLanguage();
        this.setupKeyboardNavigation();
        this.setupActiveLinks();
        this.setupAccessibility();
        
        console.log('Header controller initialized successfully');
    }

    /**
     * Set up all event listeners for user interactions
     */
    setupEventListeners() {
        // Mobile menu toggle
        if (this.mobileToggle) {
            this.mobileToggle.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Language switcher button
        if (this.languageBtn) {
            this.languageBtn.addEventListener('click', () => this.toggleLanguageDropdown());
        }
        
        // Language option selection
        this.languageOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                this.changeLanguage(e.target.dataset.lang);
            });
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => this.handleOutsideClick(e));

        // Handle window resize
        window.addEventListener('resize', this.debounce(() => this.handleResize(), 250));

        // Escape key handler for accessibility
        document.addEventListener('keydown', (e) => this.handleEscapeKey(e));

        // Prevent body scroll when mobile menu is open
        document.addEventListener('touchmove', (e) => {
            if (this.isMobileMenuOpen) {
                e.preventDefault();
            }
        }, { passive: false });
    }

    /**
     * Set up keyboard navigation for accessibility
     */
    setupKeyboardNavigation() {
        // Language button keyboard navigation
        if (this.languageBtn) {
            this.languageBtn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleLanguageDropdown();
                }
                // Arrow down to open dropdown and focus first option
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    if (!this.isLanguageDropdownOpen) {
                        this.toggleLanguageDropdown();
                    }
                    this.focusFirstLanguageOption();
                }
            });
        }

        // Language options keyboard navigation
        this.languageOptions.forEach((option, index) => {
            option.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.changeLanguage(option.dataset.lang);
                }
                // Arrow navigation within dropdown
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    this.focusNextLanguageOption(index);
                }
                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    this.focusPreviousLanguageOption(index);
                }
                // Tab to close dropdown
                if (e.key === 'Tab' && !e.shiftKey) {
                    this.closeLanguageDropdown();
                }
            });
        });

        // Mobile toggle keyboard navigation
        if (this.mobileToggle) {
            this.mobileToggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleMobileMenu();
                }
            });
        }
    }

    /**
     * Set up active link highlighting functionality
     */
    setupActiveLinks() {
        this.navLinks.forEach(link => {
            // Skip language links from active link behavior
            if (link.classList.contains('language-link')) {
                return;
            }
            
            link.addEventListener('click', (e) => {
                // In a real application, remove preventDefault to allow navigation
                e.preventDefault();
                
                // Remove active class from all links
                this.navLinks.forEach(l => {
                    if (!l.classList.contains('language-link')) {
                        l.classList.remove('active');
                    }
                });
                
                // Add active class to clicked link
                link.classList.add('active');
                
                // Close mobile menu if open
                if (this.isMobileMenuOpen) {
                    this.toggleMobileMenu();
                }
                
                // Announce to screen readers
                this.announceToScreenReader(`Navigated to ${link.textContent}`);
            });
        });

        // Set initial active link (home page)
        const homeLink = document.querySelector('.home-link');
        if (homeLink) {
            homeLink.addEventListener('click', (e) => {
                e.preventDefault(); // Remove in production
                this.navLinks.forEach(l => {
                    if (!l.classList.contains('language-link')) {
                        l.classList.remove('active');
                    }
                });
                if (this.isMobileMenuOpen) {
                    this.toggleMobileMenu();
                }
            });
        }
        
        // Handle language links separately - allow normal navigation
        const languageLinks = document.querySelectorAll('.language-link');
        languageLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Allow normal navigation for language links
                // Close mobile menu if open
                if (this.isMobileMenuOpen) {
                    this.toggleMobileMenu();
                }
            });
        });
    }

    /**
     * Set up additional accessibility features
     */
    setupAccessibility() {
        // Manage focus trap in mobile menu
        if (this.nav) {
            this.nav.addEventListener('keydown', (e) => {
                if (this.isMobileMenuOpen && e.key === 'Tab') {
                    this.handleMobileMenuTabbing(e);
                }
            });
        }

        // Add skip link functionality (if skip link exists)
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
            skipLink.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(skipLink.getAttribute('href'));
                if (target) {
                    target.focus();
                }
            });
        }
    }

    /**
     * Toggle mobile menu with proper state management
     */
    toggleMobileMenu() {
        this.isMobileMenuOpen = !this.isMobileMenuOpen;
        
        // Update DOM classes and attributes
        this.nav.classList.toggle('active', this.isMobileMenuOpen);
        this.mobileToggle.classList.toggle('active', this.isMobileMenuOpen);
        this.mobileToggle.setAttribute('aria-expanded', this.isMobileMenuOpen.toString());

        // Prevent body scroll when mobile menu is open
        document.body.style.overflow = this.isMobileMenuOpen ? 'hidden' : '';

        // Focus management for accessibility
        if (this.isMobileMenuOpen) {
            // Focus first nav link when menu opens
            const firstNavLink = this.nav.querySelector('.nav-link');
            if (firstNavLink) {
                setTimeout(() => firstNavLink.focus(), 100);
            }
        } else {
            // Return focus to toggle button when menu closes
            this.mobileToggle.focus();
        }

        // Announce state change to screen readers
        const state = this.isMobileMenuOpen ? 'opened' : 'closed';
        this.announceToScreenReader(`Mobile menu ${state}`);
    }

    /**
     * Toggle language dropdown with proper state management
     */
    toggleLanguageDropdown() {
        this.isLanguageDropdownOpen = !this.isLanguageDropdownOpen;
        
        // Update DOM classes and attributes
        this.languageDropdown.classList.toggle('active', this.isLanguageDropdownOpen);
        this.languageBtn.setAttribute('aria-expanded', this.isLanguageDropdownOpen.toString());

        // Focus management
        if (this.isLanguageDropdownOpen) {
            this.focusFirstLanguageOption();
            // Set tabindex for keyboard navigation
            this.languageOptions.forEach(option => option.setAttribute('tabindex', '0'));
        } else {
            // Remove from tab order when closed
            this.languageOptions.forEach(option => option.setAttribute('tabindex', '-1'));
        }
    }

    /**
     * Close language dropdown
     */
    closeLanguageDropdown() {
        this.isLanguageDropdownOpen = false;
        this.languageDropdown.classList.remove('active');
        this.languageBtn.setAttribute('aria-expanded', 'false');
        this.languageOptions.forEach(option => option.setAttribute('tabindex', '-1'));
    }

    /**
     * Change the current language
     * @param {string} langCode - Language code (en, es, ur)
     */
    changeLanguage(langCode) {
        if (!translations[langCode]) {
            console.warn(`Language ${langCode} not supported`);
            return;
        }

        this.currentLanguage = langCode;
        
        // Update UI display
        this.updateLanguageDisplay(langCode);
        
        // Save to localStorage for persistence
        try {
            localStorage.setItem('selectedLanguage', langCode);
        } catch (error) {
            console.warn('Could not save language to localStorage:', error);
        }
        
        // Update all translations in the document
        this.updateTranslations(langCode);
        
        // Close dropdown
        this.closeLanguageDropdown();
        
        // Update selected option styling
        this.languageOptions.forEach(option => {
            option.classList.toggle('selected', option.dataset.lang === langCode);
        });

        // Return focus to language button
        this.languageBtn.focus();
        
        // Announce language change to screen readers
        const languageNames = {
            'en': 'English',
            'es': 'Spanish',
            'ur': 'Urdu'
        };
        this.announceToScreenReader(`Language changed to ${languageNames[langCode]}`);
    }

    /**
     * Update the language display in the button
     * @param {string} langCode - Language code
     */
    updateLanguageDisplay(langCode) {
        const langMap = {
            'en': 'EN',
            'es': 'ES',
            'ur': 'UR'
        };
        if (this.currentLanguageSpan) {
            this.currentLanguageSpan.textContent = langMap[langCode] || 'EN';
        }
    }

    /**
     * Update all text content based on selected language
     * @param {string} langCode - Language code
     */
    updateTranslations(langCode) {
        const translation = translations[langCode] || translations.en;
        
        // Update all elements with data-translate attribute
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translation[key]) {
                element.textContent = translation[key];
            }
        });

        // Update document language attribute for screen readers
        document.documentElement.lang = langCode;
    }

    /**
     * Load saved language from localStorage
     */
    loadSavedLanguage() {
        try {
            const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
            this.changeLanguage(savedLanguage);
        } catch (error) {
            console.warn('Could not load language from localStorage:', error);
            this.changeLanguage('en'); // Fallback to English
        }
    }

    /**
     * Focus management for language options
     */
    focusFirstLanguageOption() {
        const firstOption = this.languageOptions[0];
        if (firstOption) {
            firstOption.focus();
        }
    }

    focusNextLanguageOption(currentIndex) {
        const nextIndex = (currentIndex + 1) % this.languageOptions.length;
        this.languageOptions[nextIndex].focus();
    }

    focusPreviousLanguageOption(currentIndex) {
        const prevIndex = currentIndex === 0 ? this.languageOptions.length - 1 : currentIndex - 1;
        this.languageOptions[prevIndex].focus();
    }

    /**
     * Handle clicks outside dropdowns to close them
     * @param {Event} e - Click event
     */
    handleOutsideClick(e) {
        // Close language dropdown if clicking outside
        if (this.languageBtn && this.languageDropdown && 
            !this.languageBtn.contains(e.target) && 
            !this.languageDropdown.contains(e.target)) {
            if (this.isLanguageDropdownOpen) {
                this.closeLanguageDropdown();
            }
        }

        // Close mobile menu if clicking outside (on mobile)
        if (window.innerWidth <= 768 && 
            this.nav && this.mobileToggle &&
            !this.nav.contains(e.target) && 
            !this.mobileToggle.contains(e.target)) {
            if (this.isMobileMenuOpen) {
                this.toggleMobileMenu();
            }
        }
    }

    /**
     * Handle window resize events
     */
    handleResize() {
        // Close mobile menu when resizing to desktop
        if (window.innerWidth > 768 && this.isMobileMenuOpen) {
            this.toggleMobileMenu();
        }

        // Close language dropdown on resize
        if (this.isLanguageDropdownOpen) {
            this.closeLanguageDropdown();
        }
    }

    /**
     * Handle escape key for accessibility
     * @param {KeyboardEvent} e - Keyboard event
     */
    handleEscapeKey(e) {
        if (e.key === 'Escape') {
            if (this.isLanguageDropdownOpen) {
                this.closeLanguageDropdown();
                this.languageBtn.focus();
            }
            if (this.isMobileMenuOpen) {
                this.toggleMobileMenu();
            }
        }
    }

    /**
     * Handle tab navigation in mobile menu for focus trapping
     * @param {KeyboardEvent} e - Keyboard event
     */
    handleMobileMenuTabbing(e) {
        const focusableElements = this.nav.querySelectorAll(
            'a, button, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstFocusable) {
                e.preventDefault();
                lastFocusable.focus();
            }
        } else {
            // Tab
            if (document.activeElement === lastFocusable) {
                e.preventDefault();
                firstFocusable.focus();
            }
        }
    }

    /**
     * Announce messages to screen readers
     * @param {string} message - Message to announce
     */
    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.classList.add('sr-only');
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        // Remove the announcement after a short delay
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    /**
     * Debounce utility function for performance optimization
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

class TestimonialsController {
    /**
     * @param {string} carouselId The ID of the main carousel container.
     */
    constructor(carouselId) {
        this.carouselId = carouselId;
        this.initialized = false;
        this.retryCount = 0;
        this.maxRetries = 5;

        // Defer initialization until the DOM is fully loaded.
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initialize());
        } else {
            // Use a small timeout to ensure all elements are rendered.
            setTimeout(() => this.initialize(), 100);
        }
    }

    initialize() {
        if (this.initialized) return;

        // Select elements within the specific carousel container
        this.carousel = document.getElementById(this.carouselId);
        if (!this.carousel) {
            console.error(`Testimonials carousel: Container with id "${this.carouselId}" not found.`);
            return;
        }

        this.track = this.carousel.querySelector('.carousel-track');
        this.prevBtn = this.carousel.querySelector('.carousel-btn[id*="prev"]');
        this.nextBtn = this.carousel.querySelector('.carousel-btn[id*="next"]');
        this.indicatorsContainer = this.carousel.querySelector('.carousel-indicators');
        this.liveRegion = this.carousel.querySelector('[aria-live="polite"]');
        this.testimonials = this.carousel.querySelectorAll('.testimonial-slide');

        // Check if all required elements are present before proceeding
        const requiredElements = this.track && this.prevBtn && this.nextBtn && this.testimonials.length > 0;

        if (!requiredElements && this.retryCount < this.maxRetries) {
            this.retryCount++;
            console.warn(`Testimonials carousel (${this.carouselId}): Required elements not found. Retrying...`);
            setTimeout(() => this.initialize(), 200);
            return;
        }

        if (requiredElements) {
            console.log(`TestimonialsController (${this.carouselId}): Initializing...`);
            this.initialized = true;
            this.setupState();
            this.init();
        } else {
            console.error(`Testimonials carousel (${this.carouselId}): Could not find required elements after retries.`);
        }
    }

    setupState() {
        this.currentIndex = 0;
        this.totalSlides = this.testimonials.length;
        this.slidesVisible = 3;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 6000;
        this.isAutoPlaying = true;
        this.isPaused = false;
    }

    init() {
        this.calculateDimensions();
        this.createIndicators();
        this.setupEventListeners();
        this.updateCarousel(false); // Initial update without transition
        this.setupAutoPlay();
    }

    calculateDimensions() {
        if (window.innerWidth <= 768) this.slidesVisible = 1;
        else if (window.innerWidth <= 1024) this.slidesVisible = 2;
        else this.slidesVisible = 3;

        this.maxIndex = Math.max(0, this.totalSlides - this.slidesVisible);
        if (this.currentIndex > this.maxIndex) {
            this.currentIndex = this.maxIndex;
        }
    }

    createIndicators() {
        if (!this.indicatorsContainer) return;
        this.indicatorsContainer.innerHTML = '';
        for (let i = 0; i <= this.maxIndex; i++) {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot';
            dot.setAttribute('aria-label', `Go to testimonial group ${i + 1}`);
            dot.addEventListener('click', () => this.goToSlide(i));
            this.indicatorsContainer.appendChild(dot);
        }
        this.updateIndicators();
    }

    setupEventListeners() {
        this.prevBtn.addEventListener('click', () => this.handleControlClick(this.previousSlide));
        this.nextBtn.addEventListener('click', () => this.handleControlClick(this.nextSlide));

        this.carousel.addEventListener('mouseenter', () => this.pauseAutoPlay());
        this.carousel.addEventListener('mouseleave', () => this.resumeAutoPlayAfterDelay());
        this.carousel.addEventListener('focusin', () => this.pauseAutoPlay());
        this.carousel.addEventListener('focusout', (e) => {
            if (!this.carousel.contains(e.relatedTarget)) {
                this.resumeAutoPlayAfterDelay();
            }
        });

        // Touch support
        let startX = 0;
        this.track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
        this.track.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            if (Math.abs(startX - endX) > 50) {
                this.handleControlClick(startX > endX ? this.nextSlide : this.previousSlide);
            }
        }, { passive: true });

        // Resize handler
        window.addEventListener('resize', this.debounce(() => {
            this.calculateDimensions();
            this.createIndicators();
            this.updateCarousel(false);
        }, 250));
    }

    handleControlClick(action) {
        this.pauseAutoPlay();
        action.call(this);
        this.resumeAutoPlayAfterDelay();
    }

    // --- Core Logic ---
    goToSlide(index) {
        if (index >= 0 && index <= this.maxIndex) {
            this.currentIndex = index;
            this.updateCarousel();
        }
    }

    nextSlide() {
        this.currentIndex = (this.currentIndex + 1 > this.maxIndex) ? 0 : this.currentIndex + 1;
        this.updateCarousel();
    }

    previousSlide() {
        this.currentIndex = (this.currentIndex - 1 < 0) ? this.maxIndex : this.currentIndex - 1;
        this.updateCarousel();
    }

    updateCarousel(enableTransition = true) {
        if (!this.track || !this.testimonials[this.currentIndex]) return;
        
        // Use offsetLeft for precise pixel-based positioning
        const targetSlide = this.testimonials[this.currentIndex];
        const offset = -targetSlide.offsetLeft;

        // Temporarily disable transition for instant updates (e.g., on resize)
        this.track.style.transition = enableTransition ? 'transform 0.5s ease' : 'none';
        this.track.style.transform = `translateX(${offset}px)`;

        this.updateIndicators();
        this.updateControlStates();
        this.announceSlideChange();
    }

    updateIndicators() {
        if (!this.indicatorsContainer) return;
        const dots = this.indicatorsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }

    updateControlStates() {
        const showControls = this.totalSlides > this.slidesVisible;
        this.prevBtn.style.display = showControls ? 'flex' : 'none';
        this.nextBtn.style.display = showControls ? 'flex' : 'none';
    }

    announceSlideChange() {
        if (this.liveRegion) {
            const message = `Showing testimonial group ${this.currentIndex + 1} of ${this.maxIndex + 1}`;
            this.liveRegion.textContent = message;
        }
    }

    // --- Autoplay ---
    setupAutoPlay() {
        if (this.totalSlides <= this.slidesVisible) {
            this.isAutoPlaying = false;
            return;
        }
        this.startAutoPlay();
    }

    startAutoPlay() {
        if (!this.isAutoPlaying || this.autoPlayInterval) return;
        this.autoPlayInterval = setInterval(() => this.nextSlide(), this.autoPlayDelay);
    }

    pauseAutoPlay() {
        clearInterval(this.autoPlayInterval);
        this.autoPlayInterval = null;
    }



    resumeAutoPlayAfterDelay() {
        if (this.isAutoPlaying && !this.isPaused) {
            // Wait a moment before resuming to avoid accidental rapid changes
            setTimeout(() => this.startAutoPlay(), 1000);
        }
    }

    // --- Utility ---
    debounce(func, wait) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    }
}

// Instantiate controllers for each carousel on the page
const englishCarousel = new TestimonialsController('testimonials-carousel');
const spanishCarousel = new TestimonialsController('testimonials-carousel-es');

/**
 * FAQ Controller
 * Handles FAQ accordion functionality
 */
 document.addEventListener('DOMContentLoaded', () => {
            // Get all FAQ question buttons
            const faqQuestions = document.querySelectorAll('.faq-question');

            faqQuestions.forEach(question => {
                question.addEventListener('click', () => {
                    // Find the parent item and the answer element
                    const faqItem = question.parentElement;
                    const faqAnswer = faqItem.querySelector('.faq-answer');

                    // Find all other open answers to close them
                    const openAnswers = document.querySelectorAll('.faq-answer.open');
                    openAnswers.forEach(otherAnswer => {
                        // Do not close the currently clicked item
                        if (otherAnswer !== faqAnswer) {
                            otherAnswer.classList.remove('open');
                            otherAnswer.style.maxHeight = '0';
                            otherAnswer.style.opacity = '0';
                            const otherQuestion = otherAnswer.previousElementSibling;
                            otherQuestion.setAttribute('aria-expanded', 'false');
                        }
                    });

                    // Toggle the clicked FAQ item
                    const isExpanded = question.getAttribute('aria-expanded') === 'true';

                    if (isExpanded) {
                        question.setAttribute('aria-expanded', 'false');
                        faqAnswer.classList.remove('open');
                        faqAnswer.style.maxHeight = '0';
                        faqAnswer.style.opacity = '0';
                    } else {
                        question.setAttribute('aria-expanded', 'true');
                        faqAnswer.classList.add('open');
                        faqAnswer.style.maxHeight = faqAnswer.scrollHeight + 'px';
                        faqAnswer.style.opacity = '1';
                    }
                });
            });
        });


/**
 * Global utility functions
 */
function scrollToContact() {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = contactSection.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

function openWhatsApp(service = '') {
    const baseUrl = 'https://wa.me/447429917026';
    let message = 'Hi Grow Nest, I\'d like a free consultation.';
    
    if (service) {
        message = `Hi Grow Nest, I'm interested in your ${service} services. I'd like a free consultation.`;
    }
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `${baseUrl}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
}

/**
 * Enhanced smooth scrolling for anchor links
 */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Performance optimization: Intersection Observer for animations
 */
function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, observerOptions);

    // Observe demo cards for subtle animations
    document.querySelectorAll('.demo-card').forEach(card => {
        observer.observe(card);
    });
}

/**
 * Initialize all functionality when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main header controller
    const headerController = new HeaderController();
    
    // Initialize hero section controller
    const heroController = new HeroController();
    
    // Initialize services section controller
    const servicesController = new ServicesController();
    
    // Initialize testimonials controller
    const testimonialsController = new TestimonialsController();
    
    // Ensure testimonials controller is globally accessible for debugging
    window.testimonialsController = testimonialsController;
    
    // Initialize FAQ controller
    const faqController = new FAQController();
    
    // Make FAQ controller globally accessible for debugging
    window.faqController = faqController;
    
    // Initialize additional features
    initSmoothScrolling();
    
    // Initialize intersection observer if supported
    if ('IntersectionObserver' in window) {
        initIntersectionObserver();
    }
    
    // Add performance monitoring in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('Application performance metrics:', {
            domContentLoaded: performance.now(),
            memoryUsage: performance.memory ? performance.memory.usedJSHeapSize : 'Not available'
        });
    }
});

/**
 * Handle page visibility change for performance optimization
 */
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden, pause any non-essential operations
        console.log('Page hidden - pausing non-essential operations');
    } else {
        // Page is visible again
        console.log('Page visible - resuming operations');
    }
});

/**
 * Service Worker registration for PWA support (optional)
 */
if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        HeaderController, 
        HeroController, 
        ServicesController, 
        TestimonialsController, 
        FAQController
    };
}

/**
 * Debug functions for troubleshooting carousel and FAQ issues
 * Run these from browser console if sections are not working
 */
window.debugTestimonials = function() {
    console.log('=== TESTIMONIALS DEBUG ===');
    
    // Check if controller exists
    const controller = window.testimonialsController;
    console.log('Controller instance:', !!controller);
    
    if (controller) {
        console.log('Controller initialized:', controller.initialized);
        console.log('Retry count:', controller.retryCount);
        console.log('Total slides:', controller.totalSlides);
        console.log('Current index:', controller.currentIndex);
        console.log('Max index:', controller.maxIndex);
    }
    
    // Check DOM elements
    const carousel = document.getElementById('testimonials-carousel');
    const track = document.getElementById('carousel-track');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const indicators = document.getElementById('carousel-indicators');
    const slides = document.querySelectorAll('.testimonial-slide');
    
    console.log('DOM Elements:');
    console.log('- Carousel container:', !!carousel);
    console.log('- Track:', !!track);
    console.log('- Previous button:', !!prevBtn);
    console.log('- Next button:', !!nextBtn);
    console.log('- Indicators container:', !!indicators);
    console.log('- Slides found:', slides.length);
    
    if (prevBtn) {
        console.log('- Prev button disabled:', prevBtn.disabled);
        console.log('- Prev button pointer events:', getComputedStyle(prevBtn).pointerEvents);
    }
    
    if (nextBtn) {
        console.log('- Next button disabled:', nextBtn.disabled);
        console.log('- Next button pointer events:', getComputedStyle(nextBtn).pointerEvents);
    }
    
    if (indicators) {
        console.log('- Indicator dots:', indicators.children.length);
    }
    
    console.log('=== END TESTIMONIALS DEBUG ===');
};

window.debugFAQ = function() {
    console.log('=== FAQ DEBUG ===');
    
    // Check if controller exists
    const controller = window.faqController;
    console.log('Controller instance:', !!controller);
    
    if (controller) {
        console.log('Controller initialized:', controller.initialized);
        console.log('Retry count:', controller.retryCount);
    }
    
    // Check DOM elements
    const faqItems = document.querySelectorAll('.faq-item');
    console.log('FAQ items found:', faqItems.length);
    
    faqItems.forEach((item, index) => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        console.log(`FAQ ${index + 1}:`);
        console.log('- Question element:', !!question);
        console.log('- Answer element:', !!answer);
        
        if (question) {
            console.log('- Question text:', question.textContent.trim().substring(0, 50) + '...');
            console.log('- ARIA expanded:', question.getAttribute('aria-expanded'));
            console.log('- Tabindex:', question.getAttribute('tabindex'));
            console.log('- Cursor style:', getComputedStyle(question).cursor);
            console.log('- Disabled:', question.disabled);
        }
        
        if (answer) {
            console.log('- Answer max height:', getComputedStyle(answer).maxHeight);
            console.log('- Answer opacity:', getComputedStyle(answer).opacity);
            console.log('- Answer classes:', answer.className);
        }
    });
    
    console.log('=== END FAQ DEBUG ===');
};

window.testCarouselButtons = function() {
    console.log('=== TESTING CAROUSEL BUTTONS ===');
    
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    
    if (prevBtn) {
        console.log('Clicking previous button...');
        prevBtn.click();
    }
    
    setTimeout(() => {
        if (nextBtn) {
            console.log('Clicking next button...');
            nextBtn.click();
        }
    }, 1000);
    
    console.log('=== END BUTTON TEST ===');
};

window.testFAQClicks = function() {
    console.log('=== TESTING FAQ CLICKS ===');
    
    const questions = document.querySelectorAll('.faq-question');
    
    questions.forEach((question, index) => {
        setTimeout(() => {
            console.log(`Clicking FAQ ${index + 1}...`);
            question.click();
        }, index * 1000);
    });
    
    console.log('=== END FAQ TEST ===');
};

// Auto-run debug if there are console errors
window.addEventListener('error', (event) => {
    if (event.message.includes('testimonials') || event.message.includes('carousel')) {
        console.log('Error detected related to testimonials - running debug:');
        setTimeout(() => window.debugTestimonials(), 100);
    }
    
    if (event.message.includes('faq') || event.message.includes('accordion')) {
        console.log('Error detected related to FAQ - running debug:');
        setTimeout(() => window.debugFAQ(), 100);
    }
});