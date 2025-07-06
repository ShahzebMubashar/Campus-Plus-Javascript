import React, { useState, useEffect } from "react";
import "./TestimonialSection.css";

const TestimonialSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [startY, setStartY] = useState(0);
  const [endY, setEndY] = useState(0);
  const [isTouching, setIsTouching] = useState(false);

  const testimonials = [
    {
      text: "Campus Plus is an excellent tool for managing my coursework. The platform is easy to navigate and keeps all my study materials organized. Highly recommended!",
      name: "Sarah Ahmed, Lahore",
      date: "06/08/2024",
    },
    {
      text: "Using campus Plus has made accessing my lecture notes and assignments much simpler. The interface is sleek and user-friendly. Great job on this platform!",
      name: "Ali Khan, Karachi",
      date: "13/8/2024",
    },
    {
      text: "I love how campus Plus consolidates all my academic resources in one place. It's incredibly efficient and has helped me stay on top of my studies.",
      name: "Ayesha Malik, Islamabad",
      date: "21/7/2024",
    },
    {
      text: "The design of campus Plus is modern and intuitive. It makes tracking my grades and deadlines effortless. A fantastic resource for any FAST University student.",
      name: "Bilal Qureshi, Faisalabad",
      date: "01/08/2024",
    },
    // Add other testimonials as needed
  ];

  const changeSlide = (index) => {
    setCurrentSlide(index);
  };

  // Auto slide every 3 seconds
  useEffect(() => {
    const autoSlide = () => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    };
    const interval = setInterval(autoSlide, 3000); // Auto change every 3 seconds

    return () => clearInterval(interval); // Clean up on unmount
  }, []);

  // Handle touchstart and touchend for swipe functionality
  const handleTouchStart = (e) => {
    setIsTouching(true);
    setStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e) => {
    if (!isTouching) return;

    setEndY(e.changedTouches[0].clientY);
    const swipeDistance = startY - endY;

    if (swipeDistance > 50) {
      // Swipe up, go to the next slide
      changeSlide((currentSlide + 1) % testimonials.length);
    } else if (swipeDistance < -50) {
      // Swipe down, go to the previous slide
      changeSlide(
        (currentSlide - 1 + testimonials.length) % testimonials.length,
      );
    }

    setIsTouching(false);
  };

  useEffect(() => {
    if (testimonials.length > 0) {
      setCurrentSlide(0);
    }
  }, [testimonials.length]);

  return (
    <section className="quotes">
      <div className="testimonial-section">
        <div
          className="slideshow-container"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {testimonials.map((testimonial, index) => (
            <div
              className={`testimonial-slide ${currentSlide === index ? "active" : ""}`}
              key={index}
            >
              <p>{testimonial.text}</p>
              <span>
                {testimonial.name}
                <br />
                {testimonial.date}
              </span>
            </div>
          ))}
        </div>

        <div className="slideshow-controls">
          <span
            className="prev"
            onClick={() =>
              changeSlide(
                (currentSlide - 1 + testimonials.length) % testimonials.length,
              )
            }
          >
            &#10094;
          </span>
          <span
            className="next"
            onClick={() =>
              changeSlide((currentSlide + 1) % testimonials.length)
            }
          >
            &#10095;
          </span>

          <div className="slide-indicators">
            {testimonials.map((_, index) => (
              <span
                key={index}
                className={`slide-indicator ${currentSlide === index ? "active" : ""}`}
                onClick={() => changeSlide(index)}
              ></span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
