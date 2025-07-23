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
