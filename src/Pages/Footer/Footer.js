import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faLinkedin,
  faTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="modern-footer">
      {/* Newsletter Section */}
      <div className="footer-newsletter">
        <div className="newsletter-container">
          <div className="newsletter-content">
            <h2 className="newsletter-title">
              Stay Updated with <span className="newsletter-highlight">Campus Plus</span>
            </h2>
            <p className="newsletter-description">
              Get the latest updates, news, and events delivered to your inbox
            </p>
            <div className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email address"
                className="newsletter-input"
              />
              <button className="newsletter-button">
                <span>Subscribe</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="footer-main">
        <div className="footer-container">
          {/* Brand Section */}
          <div className="footer-brand">
            <div className="brand-info">
              <h3 className="brand-title">Campus Plus</h3>
              <p className="brand-description">
                Your comprehensive academic companion for success at FAST University.
                From past papers to faculty information, we've got you covered.
              </p>
              <div className="social-links">
                <a href="/linkedin" className="social-link" aria-label="LinkedIn">
                  <FontAwesomeIcon icon={faLinkedin} />
                </a>
                <a href="/facebook" className="social-link" aria-label="Facebook">
                  <FontAwesomeIcon icon={faFacebook} />
                </a>
                <a href="/instagram" className="social-link" aria-label="Instagram">
                  <FontAwesomeIcon icon={faInstagram} />
                </a>
                <a href="/twitter" className="social-link" aria-label="Twitter">
                  <FontAwesomeIcon icon={faTwitter} />
                </a>
                <a href="/youtube" className="social-link" aria-label="YouTube">
                  <FontAwesomeIcon icon={faYoutube} />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links-grid">
            <div className="footer-column">
              <h4 className="footer-heading">Study Resources</h4>
              <ul className="footer-list">
                <li><a href="/past-papers">Past Papers</a></li>
                <li><a href="/playlists">Video Playlists</a></li>
                <li><a href="/faculty">Faculty Directory</a></li>
                <li><a href="/timetable">Timetable Generator</a></li>
                <li><a href="/calculator">GPA Calculator</a></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h4 className="footer-heading">Departments</h4>
              <ul className="footer-list">
                <li><a href="/computing">School of Computing</a></li>
                <li><a href="/management">School of Management</a></li>
                <li><a href="/electrical">Electrical Engineering</a></li>
                <li><a href="/civil">Civil Engineering</a></li>
                <li><a href="/sciences">Sciences & Humanities</a></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h4 className="footer-heading">Support</h4>
              <ul className="footer-list">
                <li><a href="/support">Student Support</a></li>
                <li><a href="/faq">FAQs</a></li>
                <li><a href="/contact">Contact Us</a></li>
                <li><a href="/news">News & Events</a></li>
                <li><a href="/blog">Blog</a></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h4 className="footer-heading">About</h4>
              <ul className="footer-list">
                <li><a href="/about">About Campus Plus</a></li>
                <li><a href="/team">Our Team</a></li>
                <li><a href="/privacy">Privacy Policy</a></li>
                <li><a href="/terms">Terms of Service</a></li>
                <li><a href="/multidexters">MultiDexters</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <div className="footer-bottom-content">
            <p className="footer-copyright">
              © 2024 <span className="copyright-highlight">MultiDexters Inc.</span> All rights reserved.
            </p>
            <div className="footer-bottom-links">
              <a href="/privacy">Privacy</a>
              <span className="separator">•</span>
              <a href="/terms">Terms</a>
              <span className="separator">•</span>
              <a href="/cookies">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
