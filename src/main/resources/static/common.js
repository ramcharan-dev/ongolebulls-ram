// Function to load header and footer dynamically
document.addEventListener("DOMContentLoaded", function () {
    // Load Header
    fetch("/header.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("header-container").innerHTML = data;
        });

    // Load Footer
    fetch("/footer.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("footer-container").innerHTML = data;
        });
});
document.addEventListener("DOMContentLoaded", () => {
  fetch("/header.html")
    .then(r => r.text())
    .then(html => {
      document.getElementById("header-container").innerHTML = html;
      initNavInteractions();
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

  // Handle each dropdown toggle button
  document.querySelectorAll(".dropdown-toggle").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();  // Prevent redirection or default behavior
      const parent = btn.closest('.dropdown');
      parent.classList.toggle("open");
    });
  });
}

