import React, { useState, useEffect } from "react";
import "./NewsAndEventsSection.css";

const NewsAndEventsSection = () => {
  const newsItems = [
    {
      title: "Societies Orientation 2024",
      type: "News",
      description:
        "Our university recently held its annual Societies Orientation, where students were introduced to various campus organizations. The event showcased opportunities in debating, sports, media, and cultural societies, encouraging new members to engage in extracurricular activities and contribute to a vibrant campus community.",
    },
    {
      title: "Mid 1 Dates Announced?",
      type: "News",
      description:
        "Mid 1 term exams are tentatively scheduled to begin on 21st September at our university. Students are advised to prepare accordingly and stay updated for any changes in the exam timetable. Good luck with your preparations! Use Campus Plus to get an A =)",
    },
    {
      title: "Campus Fest Starts Next Week",
      type: "Event",
      description:
        "Get ready for the Campus Fest starting next week! Join us for a week full of exciting activities, competitions, and performances by student clubs. Don't miss out on the fun!",
    },
    {
      title: "Societies Orientation 2024",
      type: "News",
      description:
        "Our university recently held its annual Societies Orientation, where students were introduced to various campus organizations. The event showcased opportunities in debating, sports, media, and cultural societies, encouraging new members to engage in extracurricular activities and contribute to a vibrant campus community.",
    },
    {
      title: "Mid 1 Dates Announced?",
      type: "News",
      description:
        "Mid 1 term exams are tentatively scheduled to begin on 21st September at our university. Students are advised to prepare accordingly and stay updated for any changes in the exam timetable. Good luck with your preparations! Use Campus Plus to get an A =)",
    },
    {
      title: "Campus Fest Starts Next Week",
      type: "Event",
      description:
        "Get ready for the Campus Fest starting next week! Join us for a week full of exciting activities, competitions, and performances by student clubs. Don't miss out on the fun!",
    },
    {
      title: "FAST Care's Book Drive",
      type: "Event",
      description:
        "FastCare recently organized a book drive encouraging students and staff to donate gently used books.",
    },
    {
      title: "GDSC Lead Selection",
      type: "News",
      description:
        "The GDSC is set to announce its new lead. Students are eagerly awaiting the reveal.",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTouching, setIsTouching] = useState(false);
  const [startX, setStartX] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto slide for mobile
  useEffect(() => {
    if (!isMobile) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % newsItems.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isMobile, newsItems.length]);

  // Touch handlers for swipe
  const handleTouchStart = (e) => {
    setIsTouching(true);
    setStartX(e.touches[0].clientX);
  };
  const handleTouchEnd = (e) => {
    if (!isTouching) return;
    const swipeDistance = startX - e.changedTouches[0].clientX;
    if (swipeDistance > 50) {
      // Swipe left
      setCurrentSlide((prev) => (prev + 1) % newsItems.length);
    } else if (swipeDistance < -50) {
      // Swipe right
      setCurrentSlide(
        (prev) => (prev - 1 + newsItems.length) % newsItems.length,
      );
    }
    setIsTouching(false);
  };

  const goToSlide = (idx) => setCurrentSlide(idx);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + newsItems.length) % newsItems.length);
  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % newsItems.length);

  return (
    <section className="parent-testimonials-section" id="newsandeventspage">
      <div className="testimonials-section">
        <h2>
          News &{" "}
          <span
            className="pp-highlighted"
            style={{ color: "#3b82f6", fontSize: "3.5rem" }}
          >
            {" "}
            Events
          </span>
        </h2>
        <div className="slider-container-news">
          <div
            className={isMobile ? "news-slider-mobile" : "testimonials-slider"}
            onTouchStart={isMobile ? handleTouchStart : undefined}
            onTouchEnd={isMobile ? handleTouchEnd : undefined}
          >
            {isMobile ? (
              <div className="news-card-slide active">
                <div className="news-title-row">
                  <h3>{newsItems[currentSlide].title}</h3>
                </div>
                <div className="news-category-row">
                  <p className="news-category">
                    {newsItems[currentSlide].type}
                  </p>
                </div>
                <div className="news-card-content">
                  <p>{newsItems[currentSlide].description}</p>
                </div>
              </div>
            ) : (
              newsItems.map((item, index) => (
                <div className="testimonial" key={index}>
                  <h3>{item.title}</h3>
                  <p className="news-category">{item.type}</p>
                  <p>{item.description}</p>
                </div>
              ))
            )}
          </div>
          {isMobile && (
            <div className="news-slideshow-controls">
              <div className="slide-indicators">
                {newsItems.map((_, idx) => (
                  <span
                    key={idx}
                    className={`slide-indicator ${currentSlide === idx ? "active" : ""}`}
                    onClick={() => goToSlide(idx)}
                  ></span>
                ))}
              </div>
              <div className="arrows-row">
                <span className="prev" onClick={prevSlide}>
                  &#10094;
                </span>
                <span className="next" onClick={nextSlide}>
                  &#10095;
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsAndEventsSection;
