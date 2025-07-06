import React, { useState, useEffect } from "react";
import "./PastPapersSection.css";
import { AiFillStar } from "react-icons/ai"; // Import star icons
import { IoDocumentTextOutline } from "react-icons/io5";

const categories = [
  {
    title: "Object Oriented Programming",
    link: "/html/Papers/ObjectOrientedProgramming.html",
    rating: 4.5, // Example rating
    icon: <IoDocumentTextOutline />,
    description: "Core concepts of OOP and programming paradigms",
  },
  {
    title: "Data Structures",
    link: "/html/Papers/DataStructures.html",
    rating: 4.8,
    icon: <IoDocumentTextOutline />,
    description: "Essential data structures and algorithms",
  },
  {
    title: "Applied Physics",
    link: "/html/Papers/AppliedPhysics.html",
    rating: 4.6,
    icon: <IoDocumentTextOutline />,
    description: "Physics principles and applications",
  },
  {
    title: "Discrete Structures",
    link: "/html/Papers/DiscreteStructures.html",
    rating: 4.2,
    icon: <IoDocumentTextOutline />,
    description: "Mathematical foundations and logic",
  },
  {
    title: "Numerical Computing",
    link: "/html/Papers/NumericalComputing.html",
    rating: 4.0,
    icon: <IoDocumentTextOutline />,
    description: "Computational methods and analysis",
  },
  {
    title: "Islamic Studies/Ethics",
    link: "/html/Papers/IslamicStudies.html",
    rating: 4.3,
    icon: <IoDocumentTextOutline />,
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
          <ul className="pp-grid-list">
            {visibleCategories.map((category, index) => (
              <li key={index}>
                <div className="card category-card">
                  <div className="icon-wrapper">{category.icon}</div>
                  <div className="features-content">
                    <h3 className="title-lg">{category.title}</h3>
                    <div className="view-papers-row">
                      <p className="title-sm1">View Papers</p>
                      <StarRating rating={category.rating} />
                    </div>
                  </div>
                  <a
                    href={category.link}
                    className="layer-link"
                    aria-label={category.title}
                  ></a>
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
