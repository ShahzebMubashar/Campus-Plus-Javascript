import React, { useRef, useEffect, useState } from 'react';
import './NewsAndEventsSection.css';

const NewsAndEventsSection = () => {
    const sliderRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [totalTestimonials, setTotalTestimonials] = useState(0);

    useEffect(() => {
        const testimonials = document.querySelectorAll('.testimonial');
        setTotalTestimonials(testimonials.length);

        // Auto-slide every 8 seconds
        const interval = setInterval(moveToNextSlide, 8000);

        // Recalculate layout on window resize
        window.addEventListener('resize', showTestimonial);

        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', showTestimonial);
        };
    }, []);

    const showTestimonial = () => {
        const slider = sliderRef.current;
        const translateXValue = window.innerWidth <= 768 ? -currentIndex * 100 : -currentIndex * 33.33;
        if (slider) slider.style.transform = `translateX(${translateXValue}%)`;
    };

    const moveToPreviousSlide = () => {
        setCurrentIndex(prevIndex => {
            const newIndex = prevIndex - 1 < 0
                ? (window.innerWidth <= 768 ? totalTestimonials - 1 : totalTestimonials - 3)
                : prevIndex - 1;
            return newIndex;
        });
        showTestimonial();
    };

    const moveToNextSlide = () => {
        setCurrentIndex(prevIndex => {
            const maxIndex = window.innerWidth <= 768 ? totalTestimonials - 1 : totalTestimonials - 3;
            const newIndex = prevIndex + 1 > maxIndex ? 0 : prevIndex + 1;
            return newIndex;
        });
        showTestimonial();
    };

    // Handle swipe functionality for mobile devices
    useEffect(() => {
        let startX = 0;
        const slider = sliderRef.current;

        const handleTouchStart = (e) => {
            startX = e.touches[0].clientX;
        };

        const handleTouchEnd = (e) => {
            const endX = e.changedTouches[0].clientX;
            const swipeDistance = startX - endX;

            if (swipeDistance > 50) {
                moveToNextSlide();
            } else if (swipeDistance < -50) {
                moveToPreviousSlide();
            }
        };

        if (slider) {
            slider.addEventListener('touchstart', handleTouchStart);
            slider.addEventListener('touchend', handleTouchEnd);
        }

        return () => {
            if (slider) {
                slider.removeEventListener('touchstart', handleTouchStart);
                slider.removeEventListener('touchend', handleTouchEnd);
            }
        };
    }, [sliderRef, currentIndex, totalTestimonials]);

    return (
        <section className="parent-testimonials-section" id="newsandeventspage">
            <div className="testimonials-section">
                <h2>News &<span className="pp-highlighted" style={{ color: '#3b82f6' }}> Events</span></h2>
                <div className="slider-container">
                    <div className="testimonials-slider" ref={sliderRef}>
                        {/* Example News Item */}
                        <div className="testimonial">
                            <h3>Societies Orientation 2024</h3>
                            <p>News</p>
                            <p>Our university recently held its annual Societies Orientation, where students were introduced to various campus organizations. The event showcased opportunities in debating, sports, media, and cultural societies, encouraging new members to engage in extracurricular activities and contribute to a vibrant campus community.</p>
                        </div>
                        <div className="testimonial">
                            <h3>Mid 1 Dates Announced?</h3>
                            <p>News</p>
                            <p>Mid 1 term exams are tentatively scheduled to begin on 21st September at our university. Students are advised to prepare accordingly and stay updated for any changes in the exam timetable. Good luck with your preparations!<br /> Use <strong>Campus Plus</strong> to get an A =)</p>
                        </div>
                        <div className="testimonial">
                            <h3>Campus Fest Starts Next Week</h3>
                            <p>News</p>
                            <p>Get ready for the Campus Fest starting next week! Join us for a week full of exciting activities, competitions, and performances by student clubs. Don't miss out on the fun!</p>
                        </div>
                        <div className="testimonial">
                            <h3>Campus Fest Starts Next Week</h3>
                            <p>News</p>
                            <p>Get ready for the Campus Fest starting next week! Join us for a week full of exciting activities, competitions, and performances by student clubs. Don't miss out on the fun!</p>
                        </div>
                        {/* Add more testimonials as needed */}
                    </div>
                </div>
                <div className="slider-controls">
                    <button className="slider-button prev" onClick={moveToPreviousSlide}>&#10094;</button>
                    <button className="slider-button next" onClick={moveToNextSlide}>&#10095;</button>
                </div>
            </div>
        </section>
    );
};

export default NewsAndEventsSection;
