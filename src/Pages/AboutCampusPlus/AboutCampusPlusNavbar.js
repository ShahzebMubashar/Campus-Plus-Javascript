import React from 'react';
import { Link } from 'react-scroll'; // Importing Link from react-scroll

const Navbar = () => {
    return (
        <nav className="about-campus-navbar fixed-top navbar-expand-lg bg-white" data-aos="fade-down">
            <div className="about-campus-container">
                <a className="about-campus-brand" href="/">Campus+</a>
                <button className="about-campus-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="about-campus-toggler-icon"></span>
                </button>
                <div className="about-campus-collapse" id="navbarNav">
                    <ul className="about-campus-nav">
                        {['Home', 'About', 'Features', 'Founder', 'Contributors', 'Reviews', 'Contact'].map((section) => (
                            <li className="about-campus-nav-item" key={section}>
                                <Link
                                    className="about-campus-nav-link"
                                    to={section.toLowerCase()}
                                    spy={true}
                                    smooth={true}
                                    offset={-70}
                                    duration={500}
                                >
                                    {section}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
