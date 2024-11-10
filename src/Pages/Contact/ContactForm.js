import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import SocialLinks from './SocialLinks'; // Make sure the path is correct based on your folder structure


const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });

    const [isChecked, setIsChecked] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleCheckboxChange = (e) => {
        setIsChecked(e.target.checked);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isChecked) {
            alert('Please accept the terms and conditions.');
            return;
        }

        emailjs.sendForm('service_mj3k7tm', 'template_3yduvdn', e.target)
            .then(() => {
                alert('Sent!');
            })
            .catch((err) => {
                alert(JSON.stringify(err));
            });
    }

    return (
        <section className="parent-contact">
            <div className="contact_us_8 container-center">
                <form id="contact-form" className="form-box" onSubmit={handleSubmit}>
                    <div className="container-block form-wrapper">
                        <div className="responsive-container-block">
                            <div className="responsive-cell-block wk-tab-12 wk-mobile-12 wk-desk-8 wk-ipadp-12">
                                <input
                                    className="input"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Full Name"
                                    required
                                />
                            </div>
                            <div className="responsive-cell-block wk-tab-12 wk-mobile-12 wk-desk-8 wk-ipadp-12">
                                <input
                                    className="input"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Email"
                                    required
                                />
                            </div>
                            <div className="responsive-cell-block wk-tab-12 wk-mobile-12 wk-desk-8 wk-ipadp-12">
                                <input
                                    className="input"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Phone Number"
                                />
                            </div>
                            <div className="responsive-cell-block wk-tab-12 wk-mobile-12 wk-desk-8 wk-ipadp-12">
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows="4"
                                    placeholder="What’s on your mind?"
                                    required
                                ></textarea>
                            </div>
                        </div>
                        <div className="checkbox-container">
                            <input
                                id="accept"
                                type="checkbox"
                                checked={isChecked}
                                onChange={handleCheckboxChange}
                            />
                            <p className="checkbox-text">
                                I agree to the privacy policy and consent to the processing of my data.
                            </p>
                        </div>
                        <div className="responsive-cell-block wk-tab-12 wk-mobile-12 wk-desk-8 wk-ipadp-12">
                            <button type="submit" className="submit-btn">
                                Submit
                            </button>
                        </div>
                        <div className="right-side-text">
                            <p className="text-blk contactus-head">
                                Aao baat karain!
                            </p>
                            <p className="text-blk contactus-subhead">
                                Feel free to get in touch with us. Our team will be available to you.
                            </p>
                            <SocialLinks />
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
}

export default ContactForm;
