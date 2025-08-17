import React, { useState, useEffect } from "react";
import "./PastPapersSection.css";
import { AiFillStar } from "react-icons/ai"; // Import star icons

const categories = [
  {
    title: "Object Oriented Programming",
    link: "/past-papers/10",
    rating: 4.5, // Example rating
    description: "Core concepts of OOP and programming paradigms",
  },
  {
    title: "Data Structures",
    link: "/past-papers/19",
    rating: 4.8,
    description: "Essential data structures and algorithms",
  },
  {
    title: "Applied Physics",
    link: "/past-papers/5",
    rating: 4.6,
    description: "Physics principles and applications",
  },
  {
    title: "Discrete Structures",
    link: "/past-papers/18",
    rating: 4.2,
    description: "Mathematical foundations and logic",
  },
  {
    title: "Numerical Computing",
    link: "/past-papers/32",
    rating: 4.0,
    description: "Computational methods and analysis",
  },
  {
    title: "Islamic Studies/Ethics",
    link: "/past-papers/15",
    rating: 4.3,
    description: "Ethical principles and Islamic studies",
  },
];

const StarRating = ({ rating }) => {
  const stars = Array.from({ length: 5 }, (_, index) => (
    <AiFillStar
      key={index}
      className={index < Math.round(rating) ? "star-filled" : "star-empty"}
    />
  ));
  return <div className="stars">{stars}</div>;
};

const PastPapersSection = () => {
  const [visibleCategories, setVisibleCategories] = useState(
    categories.slice(0, 3),
  );

  useEffect(() => {
    const handleResize = () => {
      setVisibleCategories(window.innerWidth <= 768 ? categories.slice(0, 3) : categories);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section
      className="section category has-bg-image"
      aria-labelledby="category-label"
    >
      <div className="pp-category-wrapper">
        <div className="pp-container">
          <h2
            className="headline-md text-center section-title"
            style={{ marginTop: "2%" }}
          >
            Browse Top <span className="pp-highlighted">Past Papers</span>
          </h2>
          <ul className="pp-grid-list modern-pastpapers-grid">
            {visibleCategories.map((category, index) => (
              <li key={index}>
                <div className="modern-pastpaper-card">
                  <div className="modern-pastpaper-content">
                    <h3 className="modern-pastpaper-title">{category.title}</h3>
                    <p className="modern-pastpaper-desc">{category.description}</p>
                  </div>
                  <div className="modern-pastpaper-bottom">
                    <a href={category.link} className="modern-pastpaper-btn" target="_blank" rel="noopener noreferrer">
                      View Papers
                    </a>
                    <StarRating rating={category.rating} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <a href="/past-papers" className="btn btn-primary">
            View All Past Papers
          </a>
        </div>
      </div>
    </section>
  );
};

export default PastPapersSection;
