const slider = document.querySelector('.testimonials-slider');
let currentIndex01 = 0;
const totalTestimonials = document.querySelectorAll('.testimonial').length;

function showTestimonial() {
    const translateXValue = window.innerWidth <= 768 ? -currentIndex01 * 100 : -currentIndex01 * 33.33;
    slider.style.transform = `translateX(${translateXValue}%)`;
}

function moveToPreviousSlide() {
    currentIndex01--;
    if (currentIndex01 < 0) {
        currentIndex01 = window.innerWidth <= 768 ? totalTestimonials - 1 : totalTestimonials - 3;
    }
    showTestimonial();
}

function moveToNextSlide() {
    currentIndex01++;
    const maxIndex = window.innerWidth <= 768 ? totalTestimonials - 1 : totalTestimonials - 3;
    if (currentIndex01 > maxIndex) {
        currentIndex01 = 0;
    }
    showTestimonial();
}

setInterval(moveToNextSlide, 8000); // Auto-slide every 8 seconds

window.addEventListener('resize', showTestimonial);

// Swipe functionality for mobile devices
let startX = 0;
let endX = 0;
const threshold = 50; // Minimum swipe distance to trigger the slide

slider.addEventListener('touchstart', function (e) {
    startX = e.touches[0].clientX;
});

slider.addEventListener('touchend', function (e) {
    endX = e.changedTouches[0].clientX;
    let swipeDistance = startX - endX;

    if (swipeDistance > threshold) {
        // Swipe left, move to next slide
        moveToNextSlide();
    } else if (swipeDistance < -threshold) {
        // Swipe right, move to previous slide
        moveToPreviousSlide();
    }
});
