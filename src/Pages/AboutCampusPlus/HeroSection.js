import React from 'react';

const HeroSection = () => {
    return (
        <section id="home" className="bg-cover hero-section" style={{ backgroundImage: 'url(../assets/images/cover_1.webp)' }}>
            <div className="overlay"></div>
            <div className="container text-white text-center">
                <div className="row">
                    <div className="col-12">
                        <h1 className="display-4" data-aos="zoom-in">Campus+ <br /> A oneStop Solution for All Fastians</h1>
                        <p className="my-4" data-aos="fade-up">
                            Empowering every FAST student to navigate their university life with ease and confidence.
                            <br /> Your journey to success begins here.
                        </p>
                        <a href="/" data-aos="fade-up" className="btn btn-main">Get started</a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
