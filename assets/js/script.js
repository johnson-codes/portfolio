// Custom JavaScript for Digital Marketing Portfolio

document.addEventListener('DOMContentLoaded', function() {
    // Navbar color change on scroll
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
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
    animateOnScroll(document.querySelectorAll('.testimonial-card'), 'animated');
    animateOnScroll(document.querySelectorAll('.profile-stats'), 'animated');
    
    // Style for animated elements
    document.querySelectorAll('.animated').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
    });
    
    // Handle form submission
    const contactForm = document.querySelector('#contact form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form inputs
            const name = this.querySelector('input[type="text"]').value;
            
            // Show success message (in a real implementation, you would send the form data to a server)
            const formContainer = this.closest('.contact-form');
            const originalContent = formContainer.innerHTML;
            
            formContainer.innerHTML = `
                <div class="text-center py-5">
                    <i class="fas fa-check-circle text-primary" style="font-size: 4rem;"></i>
                    <h3 class="mt-4">Thank you, ${name}!</h3>
                    <p class="mb-4">Your message has been sent successfully. I'll get back to you shortly.</p>
                    <button class="btn btn-primary reset-form">Send Another Message</button>
                </div>
            `;
            
            // Add event listener to reset button
            const resetButton = formContainer.querySelector('.reset-form');
            if (resetButton) {
                resetButton.addEventListener('click', () => {
                    formContainer.innerHTML = originalContent;
                    
                    // Re-attach form submission handler to the new form
                    const newForm = formContainer.querySelector('form');
                    if (newForm) {
                        newForm.addEventListener('submit', arguments.callee);
                    }
                });
            }
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
});