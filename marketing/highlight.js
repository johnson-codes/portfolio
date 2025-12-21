document.addEventListener('DOMContentLoaded', () => {
    const keywords = document.querySelectorAll('.highlight-keyword');
  
    function isInViewport(element) {
      const rect = element.getBoundingClientRect();
      return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0
      );
    }
  
    function handleScroll() {
      keywords.forEach(keyword => {
        if (isInViewport(keyword) && !keyword.classList.contains('animate')) {
          keyword.classList.add('animate');
        }
      });
    }
  
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
  });
  