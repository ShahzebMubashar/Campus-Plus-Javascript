// sticky-button.js

const stickyButton = document.getElementById('sticky-btn');
const popup = document.getElementById('popup');
const thoughtBubble = document.getElementById('thought-bubble');

// Toggle Popup visibility on button click
stickyButton.addEventListener('click', function () {
    // Toggle the popup visibility
    if (popup.style.display === 'none' || popup.style.display === '') {
        popup.style.display = 'block';
    } else {
        popup.style.display = 'none';
    }

    // Hide the thought bubble on first click
    thoughtBubble.classList.add('hidden');
});

// Redirect to Testimonial Form
document.getElementById('testimonial-tab').addEventListener('click', function () {
    window.location.href = 'https://forms.fillout.com/t/6tYtMgEkqdus';
});

// Redirect to Bug Report Form
document.getElementById('bug-tab').addEventListener('click', function () {
    window.location.href = 'https://forms.fillout.com/t/tEzb8ykiM7us';
});
