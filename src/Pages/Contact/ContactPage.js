import React, { useState } from 'react';
import './ContactPage.css';
import Navbar from '../Index/components/Navbar';
import Footer from '../Footer/Footer';

const ContactPage = () => {
    const [focusedField, setFocusedField] = useState(null)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
        policy: false,
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitMessage, setSubmitMessage] = useState("")

    const handleFocus = (fieldName) => {
        setFocusedField(fieldName)
    }

    const handleBlur = () => {
        setFocusedField(null)
    }

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === "checkbox" ? checked : value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        setSubmitMessage("")

        try {
            const response = await fetch("http://localhost:4000/api/email/send-email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                setSubmitMessage("Message sent successfully!")
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    message: "",
                    policy: false,
                })
            } else {
                setSubmitMessage("Failed to send message. Please try again.")
            }
        } catch (error) {
            console.error("Error:", error)
            setSubmitMessage("An error occurred. Please try again later.")
        }

        setIsSubmitting(false)
    }

    return (
        <div className="contact-main-container">
            <div className="contact-page-container">
                <Navbar />
                <header className="contact-header">
                    <h1>Contact Us</h1>
                    <p>Your direct line to answers, assistance, and more!</p>
                </header>

                {/* Contact Form */}
                <div className="contact-card">
                    <h2>Contact Us</h2>
                    <p>We'd love to hear from you. Send us a message, and our team will respond promptly!</p>
                    <form className="contact-form" onSubmit={handleSubmit}>
                        <div className="form-group">

                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleInputChange}
                                onFocus={() => handleFocus("name")}
                                onBlur={handleBlur}
                                required
                            />
                        </div>
                        <div className="form-group">

                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleInputChange}
                                onFocus={() => handleFocus("email")}
                                onBlur={handleBlur}
                                required
                            />
                        </div>
                        <div className="form-group">

                            <input
                                type="tel"
                                name="phone"
                                placeholder="Phone Number"
                                value={formData.phone}
                                onChange={handleInputChange}
                                onFocus={() => handleFocus("phone")}
                                onBlur={handleBlur}
                                required
                            />
                        </div>
                        <div className="form-group">

                            <textarea
                                name="message"
                                placeholder="What's on your mind?"
                                value={formData.message}
                                onChange={handleInputChange}
                                onFocus={() => handleFocus("message")}
                                onBlur={handleBlur}
                                rows="4"
                                required
                            ></textarea>
                        </div>
                        <div className="form-group-checkbox">
                            <input
                                type="checkbox"
                                id="policy"
                                name="policy"
                                checked={formData.policy}
                                onChange={handleInputChange}
                                required
                            />
                            <label htmlFor="policy">I agree to the privacy policy and consent to the processing of my data.</label>
                        </div>
                        <button type="submit" className="submit-btn" disabled={isSubmitting}>
                            {isSubmitting ? "Sending..." : "Send Message"}
                        </button>
                        {submitMessage && <p className="submit-message">{submitMessage}</p>}
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
    )
}

export default ContactPage

