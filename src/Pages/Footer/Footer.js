import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faLinkedin,
  faTwitter,
  faYoutube,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="modern-footer">
      {/* Newsletter Section */}
      <div className="footer-newsletter">
        <div className="newsletter-container">
          <div className="newsletter-content">
            <h2 className="newsletter-title">
              Stay Updated with{" "}
              <span className="newsletter-highlight">Campus Plus</span>
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
                <a
                  href="https://www.linkedin.com/company/multidexters/"
                  className="social-link"
                  aria-label="LinkedIn"
                >
                  <FontAwesomeIcon icon={faLinkedin} />
                </a>
                <a
                  href="https://www.multidexters.live"
                  className="social-link"
                  aria-label="Website"
                >
                  <FontAwesomeIcon icon={faGlobe} />
                </a>
                <a
                  href="https://www.instagram.com/multidexters/"
                  className="social-link"
                  aria-label="Instagram"
                >
                  <FontAwesomeIcon icon={faInstagram} />
                </a>
                <a
                  href="https://wa.me/923060999229"
                  className="social-link"
                  aria-label="WhatsApp"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="+92 306 0999229"
                >
                  <FontAwesomeIcon icon={faWhatsapp} />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links-grid">
            <div className="footer-column">
              <h4 className="footer-heading">Study Resources</h4>
              <ul className="footer-list">
                <li>
                  <a href="/past-papers">Past Papers</a>
                </li>
                <li>
                  <a href="/playlists">Video Playlists</a>
                </li>
                <li>
                  <a href="/faculty">Faculty Directory</a>
                </li>
                <li>
                  <a href="/timetable">Timetable Generator</a>
                </li>
                <li>
                  <a href="/calculator">GPA Calculator</a>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-heading">Departments</h4>
              <ul className="footer-list">
                <li>
                  <a href="https://lhr.nu.edu.pk/fsc/">School of Computing</a>
                </li>
                <li>
                  <a href="https://lhr.nu.edu.pk/fsm/">School of Management</a>
                </li>
                <li>
                  <a href="https://lhr.nu.edu.pk/ee/">Electrical Engineering</a>
                </li>
                <li>
                  <a href="https://lhr.nu.edu.pk/cv/">Civil Engineering</a>
                </li>
                <li>
                  <a href="https://lhr.nu.edu.pk/ss/">Sciences & Humanities</a>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-heading">Support</h4>
              <ul className="footer-list">
                <li>
                  <a href="/support">Student Support</a>
                </li>
                <li>
                  <a href="/faq">FAQs</a>
                </li>
                <li>
                  <a href="/contact">Contact Us</a>
                </li>
                <li>
                  <a href="/news">News & Events</a>
                </li>
                <li>
                  <a href="/blog">Blog</a>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-heading">About</h4>
              <ul className="footer-list">
                <li>
                  <a href="/about">About Campus Plus</a>
                </li>
                <li>
                  <a href="/team">Our Team</a>
                </li>
                <li>
                  <a href="/privacy">Privacy Policy</a>
                </li>
                <li>
                  <a href="/terms">Terms of Service</a>
                </li>
                <li>
                  <a href="/multidexters">MultiDexters</a>
                </li>
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
              © 2024{" "}
              <span className="copyright-highlight">MultiDexters Inc.</span> All rights
              reserved.
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
