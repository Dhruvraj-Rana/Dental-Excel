// Console log to debug loading
console.log("Script loading...");

// Main document ready function
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded");
    
    // Initialize particles.js if element and function exist
    if (document.getElementById('particles-js')) {
        if (typeof particlesJS === 'function') { // Check if the function exists
            console.log("Particles.js element and function found, initializing...");
            particlesJS('particles-js', {
                "particles": {
                    "number": {
                        "value": 80,
                        "density": {
                            "enable": true,
                            "value_area": 800
                        }
                    },
                    "color": {
                        "value": "#6366f1"
                    },
                    "shape": {
                        "type": "circle",
                        "stroke": {
                            "width": 0,
                            "color": "#000000"
                        },
                        "polygon": {
                            "nb_sides": 5
                        }
                    },
                    "opacity": {
                        "value": 0.5,
                        "random": false,
                        "anim": {
                            "enable": false,
                            "speed": 1,
                            "opacity_min": 0.1,
                            "sync": false
                        }
                    },
                    "size": {
                        "value": 3,
                        "random": true,
                        "anim": {
                            "enable": false,
                            "speed": 40,
                            "size_min": 0.1,
                            "sync": false
                        }
                    },
                    "line_linked": {
                        "enable": true,
                        "distance": 150,
                        "color": "#6366f1",
                        "opacity": 0.4,
                        "width": 1
                    },
                    "move": {
                        "enable": true,
                        "speed": 2,
                        "direction": "none",
                        "random": false,
                        "straight": false,
                        "out_mode": "out",
                        "bounce": false,
                        "attract": {
                            "enable": false,
                            "rotateX": 600,
                            "rotateY": 1200
                        }
                    }
                },
                "interactivity": {
                    "detect_on": "canvas",
                    "events": {
                        "onhover": {
                            "enable": true,
                            "mode": "grab"
                        },
                        "onclick": {
                            "enable": true,
                            "mode": "push"
                        },
                        "resize": true
                    },
                    "modes": {
                        "grab": {
                            "distance": 140,
                            "line_linked": {
                                "opacity": 1
                            }
                        },
                        "bubble": {
                            "distance": 400,
                            "size": 40,
                            "duration": 2,
                            "opacity": 8,
                            "speed": 3
                        },
                        "repulse": {
                            "distance": 200,
                            "duration": 0.4
                        },
                        "push": {
                            "particles_nb": 4
                        },
                        "remove": {
                            "particles_nb": 2
                        }
                    }
                },
                "retina_detect": true
            });
        } else {
            console.error("particlesJS function not found! Library might not have loaded.");
        }
    } else {
        console.log("Particles.js element not found.");
    }
    
    // Handle preloader
    window.addEventListener('load', function() {
        console.log("Window fully loaded, hiding preloader...");
        const preloader = document.getElementById('preloader');
        if (preloader) {
            console.log("Preloader found, hiding now");
            // Remove delays: hide immediately on load
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
            preloader.style.display = 'none'; 
            console.log("Preloader should be hidden now");
        } else {
            console.log("Preloader element not found!");
        }
    });

    // Mobile menu toggle
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenu) {
        mobileMenu.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            
            // Transform hamburger to X
            const bars = this.querySelectorAll('.bar');
            bars.forEach(bar => bar.classList.toggle('change'));
        });
    }

    // Header scroll effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu if open
            if (navLinks && navLinks.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                navLinks.classList.remove('active');
                
                // Reset hamburger
                const bars = mobileMenu.querySelectorAll('.bar');
                bars.forEach(bar => bar.classList.remove('change'));
            }
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Offset for header
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Scroll animations for elements with enhanced options
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.fade-in, .scale-in, .slide-in-left, .slide-in-right, .animate-on-scroll, .reveal-up, .reveal-left, .reveal-right, .reveal-down, .reveal-zoom');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = parseInt(element.dataset.offset || 150); // Allow custom offset via data-attribute
            
            if (elementTop < window.innerHeight - elementVisible) {
                // Add visible class which triggers the animation
                element.classList.add('visible');
                
                // If element has a data-delay attribute, set the animation delay
                if (element.dataset.delay) {
                    element.style.animationDelay = element.dataset.delay + 's';
                }
                
                // If element has a data-duration attribute, set the animation duration
                if (element.dataset.duration) {
                    element.style.animationDuration = element.dataset.duration + 's';
                }
            } else if (element.dataset.repeat === 'true') {
                // If the element has data-repeat="true", remove the visible class when it's out of viewport
                element.classList.remove('visible');
            }
        });
    };
    
    // Run animation check on load and scroll
    window.addEventListener('scroll', animateOnScroll);
    window.addEventListener('load', function() {
        // Small delay to ensure all elements are properly rendered before checking for animations
        setTimeout(animateOnScroll, 300);
    });
    
    // Initialize parallax effect for hero section
    const heroSection = document.querySelector('.hero-section');
    const heroParallax = document.querySelector('.parallax-bg');
    
    if (heroParallax) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.pageYOffset;
            // Move the background at a slower rate than the scrolling
            heroParallax.style.transform = `translateY(${scrollPosition * 0.4}px)`;
        });
    }

    // Animated Counter
    function animateCounters() {
        const counters = document.querySelectorAll('.counter-number');
        
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2000; // 2 seconds duration
            const startTime = performance.now();
            
            function updateCounter(currentTime) {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / duration, 1);
                
                // Easing function for smoother counting
                const easedProgress = 1 - Math.pow(1 - progress, 3);
                
                const currentValue = Math.floor(easedProgress * target);
                counter.textContent = currentValue.toLocaleString();
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target.toLocaleString();
                }
            }
            
            requestAnimationFrame(updateCounter);
        });
    }

    // Initialize counters when they come into view
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(statsSection);
    }

    // Testimonial Slider
    const testimonialSlider = document.querySelector('.testimonial-slider');
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;

    // Function to show a specific slide
    function showSlide(index) {
        // Hide all testimonials
        testimonials.forEach(testimonial => {
            testimonial.style.opacity = '0';
            testimonial.style.transform = 'translateX(20px)';
        });
        
        // Show the current testimonial
        testimonials[index].style.opacity = '1';
        testimonials[index].style.transform = 'translateX(0)';
        
        // Update dots
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');
    }

    // Initialize slider
    if (testimonials.length > 0 && dots.length > 0) {
        // Set initial slide
        showSlide(currentSlide);
        
        // Set up dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide = index;
                showSlide(currentSlide);
            });
        });
        
        // Auto-rotate slides
        setInterval(() => {
            currentSlide = (currentSlide + 1) % testimonials.length;
            showSlide(currentSlide);
        }, 5000);
    }

    // Form Validation
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            const formInputs = this.querySelectorAll('input, select, textarea');
            
            formInputs.forEach(input => {
                if (input.hasAttribute('required') && !input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                    
                    // Create error message if doesn't exist
                    let errorMsg = input.nextElementSibling;
                    if (!errorMsg || !errorMsg.classList.contains('error-message')) {
                        errorMsg = document.createElement('div');
                        errorMsg.classList.add('error-message');
                        errorMsg.textContent = 'This field is required';
                        input.parentNode.insertBefore(errorMsg, input.nextSibling);
                    }
                } else {
                    input.classList.remove('error');
                    const errorMsg = input.nextElementSibling;
                    if (errorMsg && errorMsg.classList.contains('error-message')) {
                        errorMsg.remove();
                    }
                }
            });
            
            if (isValid) {
                // Show success message
                const successMsg = document.createElement('div');
                successMsg.classList.add('success-message');
                successMsg.textContent = 'Form submitted successfully!';
                
                form.appendChild(successMsg);
                
                // Reset form
                form.reset();
                
                // Remove success message after 3 seconds
                setTimeout(() => {
                    successMsg.remove();
                }, 3000);
            }
        });
    });

    // Service Card Animation
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('hover');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('hover');
        });
    });

    // Doctor Image Tilt Effect
    const doctorImages = document.querySelectorAll('.doctor-image');
    
    doctorImages.forEach(image => {
        image.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            
            const rotateX = 10 * (0.5 - y);
            const rotateY = -10 * (0.5 - x);
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        image.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });

    // Add scroll to top button
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '&uarr;';
    scrollTopBtn.className = 'scroll-top-btn';
    scrollTopBtn.style.display = 'none';
    document.body.appendChild(scrollTopBtn);
    
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Show/hide scroll to top button
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.style.display = 'block';
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
            setTimeout(() => {
                if (!scrollTopBtn.classList.contains('show')) {
                    scrollTopBtn.style.display = 'none';
                }
            }, 300);
        }
    });

    console.log("All initialization complete");
});

// Add styles for scrollToTop button and other dynamic styles
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    /* Scroll to top button */
    .scroll-top-btn {
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: var(--primary-color);
        color: white;
        border: none;
        font-size: 24px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        z-index: 99;
        transition: all 0.3s;
        opacity: 0;
        transform: translateY(20px);
    }
    
    .scroll-top-btn.show {
        opacity: 1;
        transform: translateY(0);
    }
    
    .scroll-top-btn:hover {
        background-color: var(--primary-dark);
        transform: translateY(-5px);
    }
    
    /* Form validation styles */
    .error-message {
        color: #e53e3e;
        font-size: 0.875rem;
        margin-top: 0.25rem;
        transition: all 0.3s;
    }
    
    .success-message {
        background-color: #48bb78;
        color: white;
        padding: 0.75rem;
        border-radius: 0.25rem;
        margin-top: 1rem;
        transition: all 0.3s;
    }
    
    input.error, textarea.error {
        border-color: #e53e3e;
    }
    
    /* Mobile menu styles */
    @media (max-width: 768px) {
        .nav-links {
            position: fixed;
            top: 70px;
            left: 0;
            background-color: white;
            width: 100%;
            height: 0;
            flex-direction: column;
            align-items: center;
            overflow: hidden;
            transition: height 0.3s ease;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            z-index: 99;
        }
        
        .nav-links.active {
            height: 250px;
            padding: 20px 0;
        }
        
        .nav-links li {
            margin: 10px 0;
            opacity: 0;
            transform: translateY(10px);
            transition: opacity 0.3s ease, transform 0.3s ease;
            transition-delay: var(--delay);
        }
        
        .nav-links.active li {
            opacity: 1;
            transform: translateY(0);
        }
        
        .nav-links li:nth-child(1) { --delay: 0.1s; }
        .nav-links li:nth-child(2) { --delay: 0.2s; }
        .nav-links li:nth-child(3) { --delay: 0.3s; }
        .nav-links li:nth-child(4) { --delay: 0.4s; }
        .nav-links li:nth-child(5) { --delay: 0.5s; }
        
        .mobile-menu .bar.change:nth-child(1) {
            transform: rotate(-45deg) translate(-5px, 6px);
        }
        
        .mobile-menu .bar.change:nth-child(2) {
            opacity: 0;
        }
        
        .mobile-menu .bar.change:nth-child(3) {
            transform: rotate(45deg) translate(-5px, -6px);
        }
    }
`;
document.head.appendChild(additionalStyles); 

// Add this to the end of your script.js file

document.addEventListener('DOMContentLoaded', function() {
    // Get the appointment buttons
    const bookBtn = document.querySelector('header .primary-btn');
    const scheduleBtn = document.querySelector('.hero-buttons .primary-btn');
    
    // Add click event listeners
    if(bookBtn) {
        bookBtn.addEventListener('click', scrollToAppointment);
    }
    
    if(scheduleBtn) {
        scheduleBtn.addEventListener('click', scrollToAppointment);
    }
    
    // Function to scroll to appointment section
    function scrollToAppointment() {
        const appointmentSection = document.getElementById('appointment');
        if(appointmentSection) {
            appointmentSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
});