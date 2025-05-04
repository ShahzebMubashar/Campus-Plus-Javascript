import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faInstagram, faLinkedinIn, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faPhone, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
    return (
        <footer className="aboutcp-footer py-5">
            <div className="container">
                <div className="row g-4">
                    <div className="col-lg-4 col-md-6">
                        <h4 className="aboutcp-footer-title">Campus+</h4>
                        <p className="aboutcp-footer-text">Connecting students, faculty, and resources to enhance the university experience and build a stronger campus community.</p>
                        <div className="aboutcp-social-icons mt-4">
                            <a href="#" className="aboutcp-social-icon"><FontAwesomeIcon icon={faFacebookF} /></a>
                            <a href="#" className="aboutcp-social-icon"><FontAwesomeIcon icon={faTwitter} /></a>
                            <a href="#" className="aboutcp-social-icon"><FontAwesomeIcon icon={faInstagram} /></a>
                            <a href="#" className="aboutcp-social-icon"><FontAwesomeIcon icon={faLinkedinIn} /></a>
                            <a href="#" className="aboutcp-social-icon"><FontAwesomeIcon icon={faGithub} /></a>
                        </div>
                    </div>
                    <div className="col-lg-2 col-md-6">
                        <h4 className="aboutcp-footer-title">Quick Links</h4>
                        <ul className="aboutcp-footer-links">
                            <li><a href="#">Home</a></li>
                            <li><a href="#">About Us</a></li>
                            <li><a href="#">Features</a></li>
                            <li><a href="#">Team</a></li>
                            <li><a href="#">FAQ</a></li>
                        </ul>
                    </div>
                    <div className="col-lg-2 col-md-6">
                        <h4 className="aboutcp-footer-title">Resources</h4>
                        <ul className="aboutcp-footer-links">
                            <li><a href="#">Documentation</a></li>
                            <li><a href="#">Support</a></li>
                            <li><a href="#">Privacy Policy</a></li>
                            <li><a href="#">Terms of Service</a></li>
                            <li><a href="#">Sitemap</a></li>
                        </ul>
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <h4 className="aboutcp-footer-title">Contact Us</h4>
                        <div className="aboutcp-contact-info">
                            <p><FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" /> University Campus, Main Street, City</p>
                            <p><FontAwesomeIcon icon={faPhone} className="me-2" /> +1 (123) 456-7890</p>
                            <p><FontAwesomeIcon icon={faEnvelope} className="me-2" /> info@campusplus.com</p>
                        </div>
                        <div className="aboutcp-newsletter mt-3">
                            <h5 className="aboutcp-footer-subtitle">Subscribe to our newsletter</h5>
                            <div className="aboutcp-newsletter-form">
                                <input type="email" placeholder="Your email address" className="aboutcp-form-input" />
                                <button className="aboutcp-form-button">Subscribe</button>
                            </div>
                        </div>
                    </div>
                </div>
                <hr className="aboutcp-footer-divider" />
                <div className="row">
                    <div className="col-md-6">
                        <p className="aboutcp-copyright mb-0">Copyright © {new Date().getFullYear()} Campus+. All rights reserved.</p>
                    </div>
                    <div className="col-md-6 text-md-end">
                        <div className="aboutcp-footer-bottom-links">
                            <a href="#">Privacy Policy</a>
                            <a href="#">Terms & Conditions</a>
                            <a href="#">Cookies</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
