document.addEventListener('DOMContentLoaded', function() {
  const sliderContainer = document.getElementById('banner-slider');
  
  if (!sliderContainer) {
    console.error("Slider container not found!");
    return;
  } else {
    console.log("Found slider container:", sliderContainer);
  }
  
  // Parse the images from the data attribute.
  let images;
  try {
    images = JSON.parse(sliderContainer.getAttribute('data-images'));
    console.log("Parsed images array:", images);
  } catch (error) {
    console.error("Error parsing data-images:", error);
    return;
  }
  
  let currentIndex = 0;
  
  // Create image elements dynamically based on provided URLs.
  images.forEach((imgUrl, index) => {
    const imgElement = document.createElement('img');
    imgElement.src = imgUrl;
    imgElement.alt = "Slide " + (index + 1);
    // Check when the image loads.
    imgElement.onload = () => console.log(`Image loaded: ${imgUrl}`);
    imgElement.onerror = () => console.error(`Failed to load image: ${imgUrl}`);
    
    // Set the first image as active.
    if (index === currentIndex) {
      imgElement.classList.add('active');
    }
    sliderContainer.appendChild(imgElement);
  });
  
  // Select all the created images.
  const imgElements = sliderContainer.querySelectorAll('img');
  console.log("Total images added:", imgElements.length);
  
  // Function to update the active image.
  function showImage(index) {
    imgElements.forEach(img => img.classList.remove('active'));
    imgElements[index].classList.add('active');
    console.log("Showing image index:", index);
  }
  
  // Set up navigation buttons.
  const btnLeft = sliderContainer.querySelector('.slider-btn.left');
  const btnRight = sliderContainer.querySelector('.slider-btn.right');
  
  if (!btnLeft || !btnRight) {
    console.error("Navigation buttons not found.");
    return;
  }
  
  btnLeft.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage(currentIndex);
  });
  
  btnRight.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
  });
  
  console.log("Slider initialized successfully.");
  
  // Auto-slide functionality
  let currentSlide = 0;
  let slideInterval;
  const slides = document.querySelectorAll('#banner-slider img');
  const intervalTime = 3000; // Time between slides in milliseconds

  function startSlideShow() {
      slideInterval = setInterval(() => {
          nextSlide();
      }, intervalTime);
  }

  function stopSlideShow() {
      clearInterval(slideInterval);
  }

  function nextSlide() {
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('active');
  }

  function prevSlide() {
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      slides[currentSlide].classList.add('active');
  }

  // Event listeners for manual navigation
  document.querySelector('.slider-btn.left').addEventListener('click', () => {
      stopSlideShow();
      prevSlide();
      startSlideShow();
  });

  document.querySelector('.slider-btn.right').addEventListener('click', () => {
      stopSlideShow();
      nextSlide();
      startSlideShow();
  });

  // Start the slideshow when the page loads
  document.addEventListener('DOMContentLoaded', startSlideShow);

  // Optional: Pause on hover
  document.querySelector('#banner-slider').addEventListener('mouseenter', stopSlideShow);
  document.querySelector('#banner-slider').addEventListener('mouseleave', startSlideShow);
});
