// Newsletter Subscription Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = document.getElementById('newsletterEmail');
            const feedback = document.getElementById('newsletterFeedback');
            
            if (emailInput && feedback) {
                // Show success message
                feedback.style.display = 'block';
                feedback.style.color = '#5bc0de';
                
                // Clear the input
                emailInput.value = '';
                
                // Hide feedback after 3 seconds
                setTimeout(() => {
                    feedback.style.display = 'none';
                }, 3000);
            }
        });
    }
});
