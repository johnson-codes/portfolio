// Custom JavaScript for Digital Marketing Portfolio

document.addEventListener('DOMContentLoaded', function() {
    // Navbar color change on scroll
    const navbar = document.querySelector('.navbar');
    const navbarBrand = document.querySelector('.navbar-brand');

    const initTypewriterText = () => {
        const elements = document.querySelectorAll('[data-typewriter]');
        if (!elements.length) {
            return;
        }

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        elements.forEach(el => {
            const fullText = (el.getAttribute('data-typewriter') || el.textContent || '').trim();
            if (!fullText) {
                return;
            }

            if (reduceMotion) {
                el.textContent = fullText;
                el.classList.add('typewriter-static');
                return;
            }

            el.textContent = '';

            let index = 0;
            const typeNext = () => {
                index += 1;
                el.textContent = fullText.slice(0, index);

                if (index < fullText.length) {
                    setTimeout(typeNext, 140);
                } else {
                    el.classList.add('typewriter-done');
                }
            };

            setTimeout(typeNext, 400);
        });
    };
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
            if (navbarBrand) {
                navbarBrand.classList.add('scrolled');
            }
        } else {
            navbar.classList.remove('scrolled');
            if (navbarBrand) {
                navbarBrand.classList.remove('scrolled');
            }
        }
        
        // Update active nav item based on scroll position
        updateActiveNavItem();
    });
    
    // Smooth scrolling for all navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 70, // Adjust offset for fixed navbar
                    behavior: 'smooth'
                });
            }
        });
    });

    initTypewriterText();
    
    // Function to update active navigation item on scroll
    function updateActiveNavItem() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.navbar-nav a[href="#${sectionId}"]`);
            
            if (navLink && scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                navLink.classList.add('active');
            }
        });
    }
    
    // Initialize Bootstrap tabs
    const triggerTabList = [].slice.call(document.querySelectorAll('#services-tab button, #projects-tab button, #skills-tab button'));
    triggerTabList.forEach(function (triggerEl) {
        const tabTrigger = new bootstrap.Tab(triggerEl);
        triggerEl.addEventListener('click', function (event) {
            event.preventDefault();
            tabTrigger.show();
        });
    });
    
    // Project card hover animation
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const overlay = this.querySelector('.card-img-overlay');
            overlay.style.opacity = '1';
        });
        
        card.addEventListener('mouseleave', function() {
            const overlay = this.querySelector('.card-img-overlay');
            overlay.style.opacity = '0';
        });
    });
    
    // Animated skill bars
    const animateSkillBars = () => {
        document.querySelectorAll('.progress-bar').forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0';
            setTimeout(() => {
                bar.style.transition = 'width 1s ease';
                bar.style.width = width;
            }, 200);
        });
    };
    
    // Animate skill bars when the skills section comes into view
    const skillsSection = document.querySelector('#skills');
    if (skillsSection) {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                animateSkillBars();
                observer.disconnect(); // Only animate once
            }
        }, { threshold: 0.3 });
        
        observer.observe(skillsSection);
    }
    
    // Animate elements on scroll with IntersectionObserver
    const animateOnScroll = (elements, className) => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(className);
                }
            });
        }, { threshold: 0.1 });
        
        elements.forEach(el => {
            observer.observe(el);
            // Set initial state
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });
    };
    
    // Apply animations to various elements
    animateOnScroll(document.querySelectorAll('.service-card'), 'animated');
    animateOnScroll(document.querySelectorAll('.profile-stats'), 'animated');

    const revealRightCards = document.querySelectorAll('.testimonial-card.reveal-right');
    if (revealRightCards.length) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        revealRightCards.forEach(card => observer.observe(card));
    }

    // Style for animated elements
    document.querySelectorAll('.animated').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
    });
    
    // Handle form submission with validation and backend API integration
    const contactForm = document.querySelector('#contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Reset previous validation state
            this.classList.remove('was-validated');
            
            // Form validation
            let isValid = true;
            
            // Validate required fields
            const nameInput = this.querySelector('#name');
            const emailInput = this.querySelector('#email');
            const messageInput = this.querySelector('#message');
            const subjectInput = this.querySelector('#subject');
            
            // Check name field
            if (!nameInput.value.trim()) {
                nameInput.classList.add('is-invalid');
                isValid = false;
            } else {
                nameInput.classList.remove('is-invalid');
                nameInput.classList.add('is-valid');
            }
            
            // Check email field with regex validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
                emailInput.classList.add('is-invalid');
                isValid = false;
            } else {
                emailInput.classList.remove('is-invalid');
                emailInput.classList.add('is-valid');
            }
            
            // Check message field
            if (!messageInput.value.trim()) {
                messageInput.classList.add('is-invalid');
                isValid = false;
            } else {
                messageInput.classList.remove('is-invalid');
                messageInput.classList.add('is-valid');
            }
            
            if (!isValid) {
                return; // Stop submission if validation fails
            }
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';
            
            // Prepare form data for submission
            const formData = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                subject: subjectInput.value.trim() || 'Contact Form Submission',
                message: messageInput.value.trim()
            };
            
            // Send to Cloud Run backend
            fetch('https://form-backend-204921737818.us-central1.run.app/submit-form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                mode: 'cors',
                body: JSON.stringify(formData)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // Success state
                document.getElementById('formSuccess').style.display = 'block';
                document.getElementById('formError').style.display = 'none';
                document.getElementById('formStatus').style.display = 'block';
                
                // Clear form
                contactForm.reset();
                // Remove validation classes
                const formInputs = contactForm.querySelectorAll('.form-control');
                formInputs.forEach(input => {
                    input.classList.remove('is-valid');
                });
                
                // Reset button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
                
                // Scroll to success message
                document.getElementById('formStatus').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            })
            .catch(error => {
                console.error('Error:', error);
                // Error state
                document.getElementById('formSuccess').style.display = 'none';
                document.getElementById('formError').style.display = 'block';
                document.getElementById('formStatus').style.display = 'block';
                
                // Reset button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            });
        });
    }
    
    // Numbers counter animation for stats
    const countUp = (element, target, duration = 2000) => {
        let start = 0;
        const step = timestamp => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const value = Math.floor(progress * target);
            element.textContent = value + (element.dataset.suffix || '');
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                element.textContent = target + (element.dataset.suffix || '');
            }
        };
        window.requestAnimationFrame(step);
    };
    
    // Initialize counters when they come into view
    const statsNumbers = document.querySelectorAll('.stats-number');
    if (statsNumbers.length > 0) {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                statsNumbers.forEach(stat => {
                    const target = parseInt(stat.textContent);
                    stat.textContent = '0';
                    // Check if it has a plus sign
                    const hasPlusSuffix = stat.textContent.includes('+');
                    if (hasPlusSuffix) {
                        stat.dataset.suffix = '+';
                    }
                    countUp(stat, target);
                });
                observer.disconnect(); // Only animate once
            }
        }, { threshold: 0.5 });
        
        observer.observe(document.querySelector('.profile-stats'));
    }
    
    // Initialize the calendar modal functionality
    const calendarModal = new bootstrap.Modal(document.getElementById('calendarModal'));
    const bookBtn = document.getElementById('bookConsultationBtn');
    
    if (bookBtn) {
        bookBtn.addEventListener('click', function() {
            // Initialize the calendar if it hasn't been loaded yet
            if (!window.calendarInitialized) {
                calendar.schedulingButton.load({
                    url: 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ2UepAdeLvc5Ussqr1fNywudjRUDUPdBf-f8G6ctj9CBos4vrM-wdqZLSiYmgdTNpfh57Ze6qAh?gv=true',
                    color: '#ff6b6b',
                    label: 'Book a Consultation',
                    target: document.getElementById('calendarContainer'),
                });
                window.calendarInitialized = true;
            }
            
            // Show the modal
            calendarModal.show();
        });
    }

    // Project Modal Enhancement
    const projectModals = document.querySelectorAll('.project-modal');
    
    projectModals.forEach(modal => {
        modal.addEventListener('shown.bs.modal', function() {
            // Add fade-in animation to modal content
            const modalBody = this.querySelector('.modal-body');
            modalBody.style.opacity = '0';
            modalBody.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                modalBody.style.transition = 'all 0.3s ease';
                modalBody.style.opacity = '1';
                modalBody.style.transform = 'translateY(0)';
            }, 100);
            
            // Animate result metrics
            const metrics = this.querySelectorAll('.result-metric');
            metrics.forEach((metric, index) => {
                setTimeout(() => {
                    metric.style.transform = 'translateY(0) scale(1)';
                    metric.style.opacity = '1';
                }, 200 + (index * 100));
            });
        });
        
        modal.addEventListener('show.bs.modal', function() {
            // Pre-animate metrics for entrance effect
            const metrics = this.querySelectorAll('.result-metric');
            metrics.forEach(metric => {
                metric.style.transform = 'translateY(20px) scale(0.9)';
                metric.style.opacity = '0';
                metric.style.transition = 'all 0.4s ease';
            });
        });
        
        modal.addEventListener('hidden.bs.modal', function() {
            // Reset animations
            const modalBody = this.querySelector('.modal-body');
            modalBody.style.opacity = '';
            modalBody.style.transform = '';
            modalBody.style.transition = '';
            
            const metrics = this.querySelectorAll('.result-metric');
            metrics.forEach(metric => {
                metric.style.transform = '';
                metric.style.opacity = '';
                metric.style.transition = '';
            });
        });
    });

    // Social Sharing Sidebar: holistic positioning/clamping
    (function initSharingSidebar() {
        const sidebar = document.querySelector('.social-sharing-sidebar');
        if (!sidebar) return;

        const getContentEl = () =>
            document.querySelector('.blog-content') ||
            document.querySelector('.col-lg-8.mx-auto') ||
            document.querySelector('main .container');

        const getEndAnchor = () =>
            document.querySelector('.author-bio') ||
            document.querySelector('footer');

        const update = () => {
            const content = getContentEl();
            const endAnchor = getEndAnchor();
            if (!content || !endAnchor) return;

            // Keep sidebar horizontally next to the content column
            const contentRect = content.getBoundingClientRect();
            const sidebarWidth = sidebar.offsetWidth;
            const leftPx = contentRect.left + window.scrollX - sidebarWidth - 16; // 16px gutter
            sidebar.style.left = `${Math.max(16, leftPx)}px`;

            // Clamp vertically so it never overlaps author bio or footer
            const bottomLimit = endAnchor.offsetTop; // document position
            const sidebarHeight = sidebar.offsetHeight;
            const viewportMid = window.scrollY + window.innerHeight / 2;
            const offset = 60; // move up by 60px
            const desiredTop = viewportMid - sidebarHeight / 2 - offset; // centered then shifted up

            if (desiredTop + sidebarHeight + 50 >= bottomLimit) {
                // Switch to absolute at a safe stop point above end anchor
                sidebar.style.position = 'absolute';
                sidebar.style.top = `${bottomLimit - sidebarHeight - 50}px`;
                sidebar.style.transform = 'none';
            } else {
                // Normal fixed centered behaviour
                sidebar.style.position = 'fixed';
                sidebar.style.top = `calc(50% - ${offset}px)`;
                sidebar.style.transform = 'translateY(-50%)';
            }
        };

        // Initialize and keep updated on scroll/resize
        update();
        window.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update);
    })();
});