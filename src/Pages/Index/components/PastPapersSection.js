import React from 'react';
import './PastPapersSection.css';

const categories = [
    {
        title: 'Object Oriented Programming',
        link: '/html/Papers/ObjectOrientedProgramming.html',
        image: '../../../Assets/images/category-1.svg',
        alt: 'Object Oriented Programming icon',
    },
    {
        title: 'Discrete Structures',
        link: '/html/Papers/DiscreteStructures.html',
        image: 'assets/images/category-2.svg',
        alt: 'Discrete Structures icon',
    },
    {
        title: 'Data Structures',
        link: '/html/Papers/DataStructures.html',
        image: 'assets/images/category-3.svg',
        alt: 'Data Structures icon',
    },
    {
        title: 'Numerical Computing',
        link: '/html/Papers/NumericalComputing.html',
        image: 'assets/images/category-4.svg',
        alt: 'Numerical Computing icon',
    },
    {
        title: 'Islamic Studies/Ethics',
        link: '/html/Papers/IslamicStudies.html',
        image: 'assets/images/category-5.svg',
        alt: 'Islamic Studies/Ethics icon',
    },
    {
        title: 'Applied Physics',
        link: '/html/Papers/AppliedPhysics.html',
        image: 'assets/images/category-6.svg',
        alt: 'Applied Physics icon',
    },
];

const PastPapersSection = () => (
    <section className="section category has-bg-image" aria-labelledby="category-label">
        <div className="category-wrapper">
            <div className="container">
                <h2 className="headline-md text-center section-title" style={{ marginTop: '2%' }}>
                    Browse Top <span className="pp-highlighted">Past Papers</span>
                </h2>
                <ul className="grid-list">
                    {categories.map((category, index) => (
                        <li key={index}>
                            <div className="card category-card">
                                <div className="card-icon">
                                    <img
                                        src={category.image}
                                        width="65"
                                        height="65"
                                        loading="lazy"
                                        alt={category.alt}
                                    />
                                </div>
                                <div>
                                    <h3 className="title-lg">{category.title}</h3>
                                    <p className="title-sm">View Papers</p>
                                </div>
                                <a href={category.link} className="layer-link" aria-label={category.title}></a>
                            </div>
                        </li>
                    ))}
                </ul>
                <a href="/html/pastpapers.html" className="btn btn-primary">View All Past Papers</a>
            </div>
        </div>
    </section>
);

export default PastPapersSection;
