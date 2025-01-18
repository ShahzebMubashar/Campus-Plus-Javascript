import React from 'react';
import { Link } from 'react-scroll'; // Importing Link from react-scroll

const Navbar = () => {
    return (
        <nav className="navbar fixed-top navbar-expand-lg navbar-light bg-white" data-aos="fade-down">
            <div className="container">
                <a className="navbar-brand" href="/">Campus+</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        {['Home', 'About', 'Features', 'Founder', 'Contributors', 'Reviews', 'Contact'].map((section) => (
                            <li className="nav-item" key={section}>
                                {/* Use Link from react-scroll for smooth scrolling */}
                                <Link
                                    className="nav-link"
                                    to={section.toLowerCase()} // Linking to the ID of the section
                                    spy={true} // Spy on scroll
                                    smooth={true} // Enable smooth scrolling
                                    offset={-70} // Adjust the offset to avoid covering the section with fixed navbar
                                    duration={500} // Scroll duration (in milliseconds)
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
