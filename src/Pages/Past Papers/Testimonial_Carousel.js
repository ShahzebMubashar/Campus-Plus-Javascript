import React, { useState, useEffect } from 'react';


const TestimonialCarousel = ({ testimonials }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((currentIndex + 1) % testimonials.length);
    };

    const prevSlide = () => {
        setCurrentIndex((currentIndex - 1 + testimonials.length) % testimonials.length);
    };

    useEffect(() => {
        const autoSlide = setInterval(nextSlide, 3000);
        return () => clearInterval(autoSlide);
    }, [currentIndex]);

    return (
        <div className="testimonial-carousel">
            {testimonials.map((testimonial, index) => (
                <div
                    key={index}
                    className={`testimonial-slide ${index === currentIndex ? "active" : ""}`}
                >
                    {testimonial.content}
                </div>
            ))}
            <button onClick={prevSlide}>Previous</button>
            <button onClick={nextSlide}>Next</button>
        </div>
    );
};

export default TestimonialCarousel;