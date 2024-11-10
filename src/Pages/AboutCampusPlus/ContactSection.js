import React from 'react';

const FounderSection = () => {
    return (
        <section id="contact" className="bg-cover text-white" style={{ backgroundImage: 'url(img/cover_3.jpg)' }}>
            <div className="overlay"></div>
            <div className="container">
                <div className="row">
                    <div className="col-12 section-intro text-center" data-aos="fade-up">
                        <h1>Get in touch</h1>
                        <div className="divider"></div>
                        <p>Have questions or need assistance? Reach out to us anytime, and <br /> our team will be happy to help you navigate your Campus+ experience.</p>
                        <a href="contact.html" data-aos="fade-up" className="btn btn-main">Contact Us</a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FounderSection;
