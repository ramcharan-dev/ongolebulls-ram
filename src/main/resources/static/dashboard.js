// dashboard.js

window.onload = function() {
    const username = sessionStorage.getItem('username');
    if (!username) {
        // If no session found, redirect back to login
        window.location.href = "login.html"; // Change to your login page
        return;
    }

    document.getElementById('welcome-message').innerText = `Hello, ${username}!`;

    // Example Profile details
    document.getElementById('profile-info').innerHTML = `
        <h2>Welcome to Ongolebulls Dashboard</h2>
        <p><strong>Username:</strong> ${username}</p>
        <p><strong>Mobile:</strong> 9876543210</p> <!-- you can dynamically add mobile later -->
        <p><strong>Member Since:</strong> April 2025</p>
    `;
};

function logoutUser() {
    sessionStorage.clear(); // clear user session
    window.location.href = "login.html"; // redirect back to login
}
