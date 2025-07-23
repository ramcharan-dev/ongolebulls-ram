document.addEventListener("DOMContentLoaded", function () {
    const contactForm = document.getElementById("contactForm");

    contactForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent default form submission

        const formData = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            message: document.getElementById("message").value
        };

        try {
                const response = await fetch("https://www.ongolebullsinvest.com/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                alert("Contact form submitted successfully!");
                contactForm.reset(); // Clear the form after submission
            } else {
                alert("Error: " + result.error);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("An unexpected error occurred. Please try again.");
        }
    });
});
