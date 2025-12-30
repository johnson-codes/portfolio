/**
 * Milky Way Cursor Trail Effect for Hero Section
 * Creates particle stars that follow the cursor with a galaxy-like effect
 */

(function() {
    const heroSection = document.getElementById('hero');
    const canvas = document.getElementById('hero-canvas');
    
    if (!heroSection || !canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouseX = 0;
    let mouseY = 0;
    let isMouseInHero = false;
    
    // Resize canvas to match hero section
    function resizeCanvas() {
        canvas.width = heroSection.offsetWidth;
        canvas.height = heroSection.offsetHeight;
    }
    
    // Initialize
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Particle class
    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 3 + 1;
            this.speedX = (Math.random() - 0.5) * 2;
            this.speedY = (Math.random() - 0.5) * 2;
            this.opacity = 1;
            this.decay = Math.random() * 0.02 + 0.01;
            
            // Color variations for milky way effect (whites, blues, purples)
            const colorChoice = Math.random();
            if (colorChoice < 0.4) {
                this.color = `rgba(255, 255, 255, ${this.opacity})`;
            } else if (colorChoice < 0.7) {
                this.color = `rgba(97, 218, 251, ${this.opacity})`;
            } else {
                this.color = `rgba(167, 139, 250, ${this.opacity})`;
            }
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.opacity -= this.decay;
            
            // Update color with new opacity
            const colorMatch = this.color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
            if (colorMatch) {
                const [_, r, g, b] = colorMatch;
                this.color = `rgba(${r}, ${g}, ${b}, ${this.opacity})`;
            }
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Add glow effect
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
        }
    }
    
    // Track mouse movement
    heroSection.addEventListener('mousemove', function(e) {
        const rect = heroSection.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
        isMouseInHero = true;
        
        // Create multiple particles per movement for milky way effect
        for (let i = 0; i < 3; i++) {
            particles.push(new Particle(
                mouseX + (Math.random() - 0.5) * 20,
                mouseY + (Math.random() - 0.5) * 20
            ));
        }
        
        // Limit particles for performance
        if (particles.length > 200) {
            particles = particles.slice(-200);
        }
    });
    
    heroSection.addEventListener('mouseenter', function() {
        isMouseInHero = true;
    });
    
    heroSection.addEventListener('mouseleave', function() {
        isMouseInHero = false;
    });
    
    // Animation loop
    function animate() {
        // Clear canvas completely (transparent background)
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw particles
        particles = particles.filter(particle => {
            particle.update();
            if (particle.opacity > 0) {
                particle.draw();
                return true;
            }
            return false;
        });
        
        // Reset shadow
        ctx.shadowBlur = 0;
        
        requestAnimationFrame(animate);
    }
    
    // Start animation
    animate();
    
    // Optional: Add some ambient particles on load
    function createAmbientParticles() {
        if (!isMouseInHero) return;
        
        for (let i = 0; i < 5; i++) {
            particles.push(new Particle(
                Math.random() * canvas.width,
                Math.random() * canvas.height
            ));
        }
        
        setTimeout(createAmbientParticles, 2000);
    }
    
    // Start ambient particles after a short delay
    setTimeout(createAmbientParticles, 1000);
})();
