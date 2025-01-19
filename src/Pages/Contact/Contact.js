import React, { useState } from 'react';
import './ContactPage.css';
import Navbar from '../Index/components/Navbar';
import Footer from '../Footer/Footer';

const ContactPage = () => {
    const [focusedField, setFocusedField] = useState(null);

    const handleFocus = (fieldName) => {
        setFocusedField(fieldName);
    };

    const handleBlur = () => {
        setFocusedField(null);
    };

    return (
        <div className='contact-main-container'>
            <div className="contact-page-container">
                <Navbar />
                <header className="contact-header">
                    <h1>Contact Us</h1>
                    <p>Your direct line to answers, assistance, and more!</p>
                </header>

                {/* Contact Form */}
                <div className="contact-card">
                    <h2>Contact Us</h2>
                    <p>We’d love to hear from you. Send us a message, and our team will respond promptly!</p>
                    <form className="contact-form">
                        <div className="form-group">
                            <span className={`icon ${focusedField === 'name' ? 'hide' : ''}`}>
                                <i className="fas fa-user"></i>
                            </span>
                            <input
                                type="text"
                                placeholder="Full Name"
                                onFocus={() => handleFocus('name')}
                                onBlur={handleBlur}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <span className={`icon ${focusedField === 'email' ? 'hide' : ''}`}>
                                <i className="fas fa-envelope"></i>
                            </span>
                            <input
                                type="email"
                                placeholder="Email"
                                onFocus={() => handleFocus('email')}
                                onBlur={handleBlur}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <span className={`icon ${focusedField === 'phone' ? 'hide' : ''}`}>
                                <i className="fas fa-phone"></i>
                            </span>
                            <input
                                type="tel"
                                placeholder="Phone Number"
                                onFocus={() => handleFocus('phone')}
                                onBlur={handleBlur}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <span className={`icon ${focusedField === 'message' ? 'hide' : ''}`}>
                                <i className="fas fa-comment"></i>
                            </span>
                            <textarea
                                placeholder="What's on your mind?"
                                onFocus={() => handleFocus('message')}
                                onBlur={handleBlur}
                                rows="4"
                                required
                            ></textarea>
                        </div>
                        <div className="form-group-checkbox">
                            <input type="checkbox" id="policy" required />
                            <label htmlFor="policy">
                                I agree to the privacy policy and consent to the processing of my data.
                            </label>
                        </div>
                        <button type="submit" className="submit-btn">Send Message</button>
                    </form>
                </div>

                {/* Social Media Links */}
                <div className="social-media">
                    <h3>Follow Us</h3>
                    <div className="social-icons">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-facebook-f"></i>
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-twitter"></i>
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-instagram"></i>
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-linkedin-in"></i>
                        </a>
                    </div>
                </div>

            </div>
            <Footer />
        </div>
    );
};

export default ContactPage;
