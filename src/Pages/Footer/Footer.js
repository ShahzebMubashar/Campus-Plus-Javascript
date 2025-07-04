import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      {/* Top Section */}
      <div className="footer-top">
        <h2>Join Campus Plus to receive updates, news & events!</h2>
        <div className="footer-subscribe">
          <input
            type="email"
            placeholder="Enter your email address"
            className="footer-input"
          />
          <button className="footer-button">Join</button>
        </div>
      </div>

      {/* Main Section */}
      <div className="footer-main">
        <div className="footer-column">
          <h3 className="footer-heading">Study Toolkit</h3>
          <ul className="footer-list">
            <li>FAST School of Computing</li>
            <li>FAST School of Management</li>
            <li>Department of EE</li>
            <li>Department of CV</li>
            <li>Department of S & H</li>
          </ul>
        </div>
        <div className="footer-column">
          <h3 className="footer-heading">Services</h3>
          <ul className="footer-list">
            <li>Faculty Information</li>
            <li>GPA Calculator</li>
            <li>Student Support</li>
            <li>Time Table Generator</li>
            <li>Course Playlist</li>
          </ul>
        </div>
        <div className="footer-column">
          <h3 className="footer-heading">Blogs</h3>
          <ul className="footer-list">
            <li>Thought Leadership</li>
            <li>Webinars</li>
            <li>Events</li>
            <li>Sponsorships</li>
            <li>Advisors</li>
            <li>Training Program</li>
            <li>Activities & Campaigns</li>
          </ul>
        </div>
        <div className="footer-column">
          <h3 className="footer-heading">About</h3>
          <ul className="footer-list">
            <li>FAQs</li>
            <li>MultiDexters</li>
            <li>About Campus+</li>
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="footer-bottom">
        <div className="footer-links">
          <a href="/faq">FAQ</a>
          <a href="/news">News</a>
          <a href="/contact">Contact Us</a>
        </div>
        <p className="footer-copyright">Copyright © 2024 MultiDexters Inc.</p>
        <div className="footer-icons">
          <a href="/linkedin" aria-label="LinkedIn">
            <FontAwesomeIcon icon={faLinkedin} />
          </a>
          <a href="/facebook" aria-label="Facebook">
            <FontAwesomeIcon icon={faFacebook} />
          </a>
          <a href="/instagram" aria-label="Instagram">
            <FontAwesomeIcon icon={faInstagram} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
