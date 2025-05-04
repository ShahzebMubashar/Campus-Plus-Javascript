import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faInstagram, faLinkedinIn, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faPhone, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
    return (
        <footer className="aboutcp-footer py-5">
            <div className="container">
                <div className="row g-4">
                    <div className="col-lg-6 col-md-6">
                        <h4 className="aboutcp-footer-title">Campus+</h4>
                        <p className="aboutcp-footer-text">Connecting students, faculty, and resources to enhance the university experience and build a stronger campus community. Our platform helps you stay connected with campus events, resources, and opportunities.</p>
                        <div className="aboutcp-social-icons mt-4">
                            <a href="#" className="aboutcp-social-icon"><FontAwesomeIcon icon={faFacebookF} /></a>
                            <a href="#" className="aboutcp-social-icon"><FontAwesomeIcon icon={faTwitter} /></a>
                            <a href="#" className="aboutcp-social-icon"><FontAwesomeIcon icon={faInstagram} /></a>
                            <a href="#" className="aboutcp-social-icon"><FontAwesomeIcon icon={faLinkedinIn} /></a>
                            <a href="#" className="aboutcp-social-icon"><FontAwesomeIcon icon={faGithub} /></a>
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                        <h4 className="aboutcp-footer-title">Contact Us</h4>
                        <div className="aboutcp-contact-info">
                            <p><FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" /> FAST NUCES, Lahore, Pakistan</p>
                            <p><FontAwesomeIcon icon={faPhone} className="me-2" /> +92 000 000 000</p>
                            <p><FontAwesomeIcon icon={faEnvelope} className="me-2" /> productionsbymultidexters@gmail.com</p>
                        </div>
                        <div className="aboutcp-newsletter mt-4">
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
                    <div className="col-12 text-center">
                        <p className="aboutcp-copyright mb-0">Copyright © {new Date().getFullYear()} Campus+ Designed By MultiDexters</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
