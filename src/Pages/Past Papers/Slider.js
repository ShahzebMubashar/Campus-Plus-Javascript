import React, { useRef, useEffect, useState } from "react";
import "./PP.css";

const SliderComponent = ({ items }) => {
    const sliderRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const totalItems = items.length;

    useEffect(() => {
        const interval = setInterval(() => moveToNextSlide(), 5000);

        window.addEventListener("resize", updateCarousel);

        return () => {
            clearInterval(interval);
            window.removeEventListener("resize", updateCarousel);
        };
    }, [currentIndex]);

    const updateCarousel = () => {
        const slider = sliderRef.current;
        const translateXValue =
            window.innerWidth <= 768 ? -currentIndex * 100 : -currentIndex * 33.33;
        if (slider) slider.style.transform = `translateX(${translateXValue}%)`;
    };

    const moveToPreviousSlide = () => {
        setCurrentIndex((prevIndex) => {
            const newIndex =
                prevIndex - 1 < 0
                    ? window.innerWidth <= 768
                        ? totalItems - 1
                        : totalItems - 3
                    : prevIndex - 1;
            return newIndex;
        });
        updateCarousel();
    };

    const moveToNextSlide = () => {
        setCurrentIndex((prevIndex) => {
            const maxIndex =
                window.innerWidth <= 768 ? totalItems - 1 : totalItems - 3;
            const newIndex = prevIndex + 1 > maxIndex ? 0 : prevIndex + 1;
            return newIndex;
        });
        updateCarousel();
    };

    return (
        <div className="slider-container">
            <div className="testimonials-slider" ref={sliderRef}>
                {items.map((item, index) => (
                    <div key={index} className="pastpapers-card">
                        <h3>{item.title}</h3>
                        <h4>({item.code})</h4>
                        <p>{item.description}</p>
                    </div>
                ))}
            </div>
            <div className="slider-controls">
                <button className="slider-button prev" onClick={moveToPreviousSlide}>
                    &#10094;
                </button>
                <button className="slider-button next" onClick={moveToNextSlide}>
                    &#10095;
                </button>
            </div>
        </div>
    );
};

export default SliderComponent;
