window.addEventListener("scroll", function () {
  const nav = document.querySelector(".nav");
  if (window.scrollY > 50) {
    // When scrolled 50px down
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
  }
});
