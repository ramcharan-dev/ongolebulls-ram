// Unsubscribe page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    const statusIcon = document.getElementById('statusIcon');
    const statusTitle = document.getElementById('statusTitle');
    const statusMessage = document.getElementById('statusMessage');
    const backLink = document.getElementById('backLink');

    if (!token) {
        showError('Invalid unsubscribe link. No token provided.');
        return;
    }


    // Call unsubscribe API
    unsubscribe(token);

    async function unsubscribe(token) {
        try {
            const response = await fetch(`/api/subscribers/unsubscribe?token=${encodeURIComponent(token)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (response.ok && data.success) {
                showSuccess(data.message || 'You have been successfully unsubscribed from our mailing list.');
            } else {
                showError(data.message || 'Invalid or expired unsubscribe link. Please contact support if you continue to receive emails.');
            }
        } catch (error) {
            console.error('Unsubscribe error:', error);
            showError('An error occurred while processing your request. Please try again later or contact support.');
        }
    }

    function showSuccess(message) {
        statusIcon.className = 'unsubscribe-icon success';
        statusIcon.innerHTML = '<i class="bi bi-check-circle"></i>';
        statusTitle.textContent = 'Successfully Unsubscribed';
        statusMessage.className = 'message success';
        statusMessage.textContent = message;
        backLink.style.display = 'inline-block';
    }

    function showError(message) {
        statusIcon.className = 'unsubscribe-icon error';
        statusIcon.innerHTML = '<i class="bi bi-x-circle"></i>';
        statusTitle.textContent = 'Unsubscribe Failed';
        statusMessage.className = 'message error';
        statusMessage.textContent = message;
        backLink.style.display = 'inline-block';
    }
});


