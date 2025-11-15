// Main JavaScript functionality for Odyssefs Liagkas Portfolio

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScrollAnimations();
    initializeCounters();
    initializeCarousels();
    initializeParticleBackground();
    initializeHoverEffects();
});

// Smooth scroll navigation
function initializeNavigation() {
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Update active nav item on scroll
    window.addEventListener('scroll', updateActiveNavItem);
}

// Update active navigation item based on scroll position
function updateActiveNavItem() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Scroll-triggered animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Trigger counter animation for stats
                if (entry.target.classList.contains('stats-section')) {
                    animateCounters();
                }
            }
        });
    }, observerOptions);

    // Observe all sections with animation classes
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// Animated counters for statistics
function initializeCounters() {
    // Counter data will be triggered by scroll animation
}

function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.floor(current);
        }, 16);
    });
}

// Initialize image carousels
function initializeCarousels() {
    if (typeof Splide !== 'undefined') {
        // Publications carousel
        const publicationsCarousel = document.querySelector('.publications-carousel');
        if (publicationsCarousel) {
            new Splide(publicationsCarousel, {
                type: 'loop',
                perPage: 3,
                perMove: 1,
                gap: '2rem',
                autoplay: true,
                interval: 4000,
                pauseOnHover: true,
                breakpoints: {
                    768: { perPage: 1 },
                    1024: { perPage: 2 }
                }
            }).mount();
        }

        // Research images carousel
        const researchCarousel = document.querySelector('.research-carousel');
        if (researchCarousel) {
            new Splide(researchCarousel, {
                type: 'fade',
                autoplay: true,
                interval: 5000,
                pauseOnHover: true
            }).mount();
        }
    }
}

// Particle background effect for hero section
function initializeParticleBackground() {
    const heroCanvas = document.getElementById('hero-canvas');
    if (!heroCanvas) return;

    // Simple particle system using canvas
    const ctx = heroCanvas.getContext('2d');
    let particles = [];
    
    function resizeCanvas() {
        heroCanvas.width = heroCanvas.offsetWidth;
        heroCanvas.height = heroCanvas.offsetHeight;
    }
    
    function createParticle() {
        return {
            x: Math.random() * heroCanvas.width,
            y: Math.random() * heroCanvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 1,
            opacity: Math.random() * 0.5 + 0.2
        };
    }
    
    function initParticles() {
        particles = [];
        for (let i = 0; i < 50; i++) {
            particles.push(createParticle());
        }
    }
    
    function updateParticles() {
        particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            if (particle.x < 0 || particle.x > heroCanvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > heroCanvas.height) particle.vy *= -1;
        });
    }
    
    function drawParticles() {
        ctx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
        
        particles.forEach(particle => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(193, 120, 23, ${particle.opacity})`;
            ctx.fill();
        });
        
        // Draw connections
        particles.forEach((particle, i) => {
            particles.slice(i + 1).forEach(other => {
                const distance = Math.sqrt(
                    Math.pow(particle.x - other.x, 2) + 
                    Math.pow(particle.y - other.y, 2)
                );
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(other.x, other.y);
                    ctx.strokeStyle = `rgba(193, 120, 23, ${0.1 * (1 - distance / 100)})`;
                    ctx.stroke();
                }
            });
        });
    }
    
    function animate() {
        updateParticles();
        drawParticles();
        requestAnimationFrame(animate);
    }
    
    resizeCanvas();
    initParticles();
    animate();
    
    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });
}

// Hover effects for interactive elements
function initializeHoverEffects() {
    // 3D tilt effect for cards
    const cards = document.querySelectorAll('.tilt-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });

    // Color cycling text effect
    const colorCycleElements = document.querySelectorAll('.color-cycle');
    
    colorCycleElements.forEach(element => {
        const text = element.textContent;
        element.innerHTML = text.split('').map(char => 
            `<span class="color-char">${char}</span>`
        ).join('');
        
        const chars = element.querySelectorAll('.color-char');
        let hue = 0;
        
        setInterval(() => {
            chars.forEach((char, index) => {
                char.style.color = `hsl(${(hue + index * 10) % 360}, 70%, 50%)`;
            });
            hue = (hue + 1) % 360;
        }, 100);
    });
}

// Utility functions
function debounce(func, wait) {
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

// Contact form handling (if present)
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'Thank you for your message! I will get back to you soon.';
        
        contactForm.appendChild(successMessage);
        contactForm.reset();
        
        setTimeout(() => {
            successMessage.remove();
        }, 5000);
    });
}