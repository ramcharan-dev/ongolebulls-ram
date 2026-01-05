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


document.addEventListener("DOMContentLoaded", () => {

    fetch("/api/settings")
        .then(res => res.json())
        .then(settingsList => {

            if (!settingsList || settingsList.length === 0) return;

            // Use first settings row
            const settings = settingsList[0];

            /* ===============================
               SET PAGE TITLE
            =============================== */
            if (settings.siteName) {
                document.title = settings.siteName;

                const titleEl = document.getElementById("dynamicTitle");
                if (titleEl) {
                    titleEl.textContent = settings.siteName;
                }
            }

            /* ===============================
               SET FAVICON (ENV SAFE)
            =============================== */
            if (settings.faviconUrl) {
                let favicon = document.getElementById("dynamicFavicon");

                if (!favicon) {
                    favicon = document.createElement("link");
                    favicon.rel = "icon";
                    favicon.id = "dynamicFavicon";
                    document.head.appendChild(favicon);
                }

                const finalUrl =
                    window.location.origin +
                    settings.faviconUrl +
                    "?v=" + Date.now(); // cache busting

                favicon.href = finalUrl;
            }
        })
        .catch(err => {
            console.error("Failed to load site settings", err);
        });

});


// ===============================
// Subscribe form handler (GLOBAL)
// Works for dynamically loaded footer
// ===============================
document.addEventListener('submit', async function (event) {

    if (event.target.id !== 'subscribeForm') return;

    event.preventDefault();

    const emailInput = document.getElementById('emailInput');
    const subscribeBtn = document.getElementById('subscribeBtn');
    const messageDiv = document.getElementById('subscribeMessage');

    if (!emailInput || !subscribeBtn || !messageDiv) return;

    const email = emailInput.value.trim();

    // Validation
    if (!email) {
        showMessage('Please enter your email address', false);
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showMessage('Please enter a valid email address', false);
        return;
    }

    // Loading state
    subscribeBtn.disabled = true;
    subscribeBtn.textContent = 'Subscribing...';

    try {
        const response = await fetch('/api/subscribers/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (response.ok) {
            showMessage(data.message || 'Subscribed successfully!', true);
            emailInput.value = '';
        } else {
            showMessage(data.message || 'Subscription failed', false);
        }

    } catch (error) {
        console.error('Subscribe error:', error);
        showMessage('Unable to connect to server.', false);
    } finally {
        subscribeBtn.disabled = false;
        subscribeBtn.textContent = 'Subscribe';
    }

    function showMessage(text, success) {
        messageDiv.textContent = text;
        messageDiv.style.display = 'block';
        messageDiv.style.color = success ? '#28a745' : '#dc3545';
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }
});
