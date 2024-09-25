// const { getJson } = require("serpapi");

// getJson({
//   engine: "google_scholar",
//   q: "biology",
//   api_key: "d2916117f08364276db8184cad30209e1d56623f7e1445aa8df2d1fc27f0e759"
// }, (json) => {
//   console.log(json["organic_results"]);
// });

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
  if (Date.now() - lastInteractionTime > 10000) {
    nextSlide(); // Go to the next slide if no interaction for 8 seconds
  }
}

// Show the first slide initially
showSlide(currentSlide);

// Start auto-advance timer
setInterval(autoAdvance, 1000); // Check every second for user interaction


//SCROLLING FOR THE NAVBAR STUFF
window.addEventListener('scroll', function() {
  const navbar = document.querySelector('.nav');
  
  if (window.scrollY > 700) {
      navbar.classList.add('navbar-scrolled');
  } else {
      navbar.classList.remove('navbar-scrolled');
  }
});



