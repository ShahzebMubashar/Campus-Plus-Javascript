import React from "react";
import { Link } from "react-scroll"; // Importing Link from react-scroll

const Navbar = () => {
  return (
    <nav
      className="aboutcp-navbar fixed-top navbar-expand-lg navbar-light bg-white"
      data-aos="fade-down"
    >
      <div className="container">
        <div className="aboutcp-navbar-wrapper d-flex justify-content-between align-items-center w-100">
          <a className="aboutcp-navbar-brand navbar-brand" href="/">
            Campus+
          </a>

          <button
            className="aboutcp-navbar-toggler navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#aboutCpNavbarNav"
            aria-controls="aboutCpNavbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="aboutcp-navbar-toggler-icon navbar-toggler-icon"></span>
          </button>

          <div
            className="aboutcp-navbar-collapse collapse navbar-collapse"
            id="aboutCpNavbarNav"
          >
            <ul className="aboutcp-navbar-nav navbar-nav ms-auto">
              {[
                "Home",
                "About",
                "Features",
                "Founder",
                "Contributors",
                "Reviews",
                "Contact",
              ].map((section) => (
                <li className="aboutcp-nav-item nav-item" key={section}>
                  {/* Use Link from react-scroll for smooth scrolling */}
                  <Link
                    className="aboutcp-nav-link nav-link"
                    to={section.toLowerCase()} // Linking to the ID of the section
                    spy={true} // Spy on scroll
                    smooth={true} // Enable smooth scrolling
                    offset={-60} // Adjusted offset from -70 to -60 due to smaller navbar height
                    duration={500} // Scroll duration (in milliseconds)
                  >
                    {section}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
