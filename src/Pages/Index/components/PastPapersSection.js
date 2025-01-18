import React from 'react';
import './PastPapersSection.css';
import { AiFillStar } from 'react-icons/ai'; // Import star icons

const categories = [
    {
        title: 'Object Oriented Programming',
        link: '/html/Papers/ObjectOrientedProgramming.html',
        rating: 4.5, // Example rating
    },
    {
        title: 'Discrete Structures',
        link: '/html/Papers/DiscreteStructures.html',
        rating: 4.2,
    },
    {
        title: 'Data Structures',
        link: '/html/Papers/DataStructures.html',
        rating: 4.8,
    },
    {
        title: 'Numerical Computing',
        link: '/html/Papers/NumericalComputing.html',
        rating: 4.0,
    },
    {
        title: 'Islamic Studies/Ethics',
        link: '/html/Papers/IslamicStudies.html',
        rating: 4.3,
    },
    {
        title: 'Applied Physics',
        link: '/html/Papers/AppliedPhysics.html',
        rating: 4.6,
    },
];

const StarRating = ({ rating }) => {
    const stars = Array.from({ length: 5 }, (_, index) => (
        <AiFillStar
            key={index}
            className={index < Math.round(rating) ? 'star-filled' : 'star-empty'}
        />
    ));
    return <div className="stars">{stars}</div>;
};

const PastPapersSection = () => (
    <section className="section category has-bg-image" aria-labelledby="category-label">
        <div className="pp-category-wrapper">
            <div className="pp-container">
                <h2 className="headline-md text-center section-title" style={{ marginTop: '2%' }}>
                    Browse Top <span className="pp-highlighted">Past Papers</span>
                </h2>
                <ul className="pp-grid-list">
                    {categories.map((category, index) => (
                        <li key={index}>
                            <div className="card category-card">
                                <div className="features-content">
                                    <h3 className="title-lg">{category.title}</h3>
                                    <div className="view-papers-row">
                                        <p className="title-sm1">View Papers</p>
                                        <StarRating rating={category.rating} />
                                    </div>
                                </div>
                                <a href={category.link} className="layer-link" aria-label={category.title}></a>
                            </div>
                        </li>
                    ))}
                </ul>
                <a href="/html/pastpapers.html" className="btn btn-primary">
                    View All Past Papers
                </a>
            </div>
        </div>
    </section>
);

export default PastPapersSection;
