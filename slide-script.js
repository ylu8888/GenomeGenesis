let slides = document.querySelectorAll(".slide");
let currentSlide = 0;
let lastInteractionTime = Date.now();

function showSlide(n) {
  slides[currentSlide].style.opacity = "0";
  setTimeout(function () {
    slides[currentSlide].style.display = "none";
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].style.display = "flex";
    setTimeout(function () {
      slides[currentSlide].style.opacity = "1";
    }, 50);
  }, 500);
}

function nextSlide() {
  showSlide(currentSlide + 1);
  lastInteractionTime = Date.now(); // Update last interaction time
}

function prevSlide() {
  showSlide(currentSlide - 1);
  lastInteractionTime = Date.now(); // Update last interaction time
}

function autoAdvance() {
  if (Date.now() - lastInteractionTime > 8000) {
    nextSlide(); // Go to the next slide if no interaction for 8 seconds
  }
}

// Show the first slide initially
showSlide(currentSlide);

// Start auto-advance timer
setInterval(autoAdvance, 1000); // Check every second for user interaction
