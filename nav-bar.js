window.addEventListener("scroll", function () {
  const nav = document.querySelector(".nav");
  if (window.scrollY > 1) {
    // When scrolled 1px down
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
  }
});
