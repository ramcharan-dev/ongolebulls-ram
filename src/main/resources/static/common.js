document.addEventListener("DOMContentLoaded", () => {

  // Load Header once
  fetch("/header.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("header-container").innerHTML = html;
      initNavInteractions();  // Call only after header loads
    });

  // Load Footer once
  fetch("/footer.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("footer-container").innerHTML = html;
    });
});

function initNavInteractions() {
  const toggleButton = document.querySelector(".menu-toggle");
  const navLinks = document.getElementById("navLinks");

  if (toggleButton && navLinks) {
    toggleButton.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }

  // Dropdown toggle
  document.querySelectorAll(".dropdown-toggle").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      btn.closest('.dropdown').classList.toggle("open");
    });
  });
}
