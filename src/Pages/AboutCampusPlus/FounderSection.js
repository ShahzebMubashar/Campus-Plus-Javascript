import React from 'react';

const FounderSection = () => {
    return (
        <section id="founder" className="text-center">
            <div className="container">
                <div className="row">
                    <div className="col-12 section-intro text-center" data-aos="fade-up">
                        <h1>Campus+ was a Dream of</h1>
                        <div className="divider"></div>
                    </div>
                </div>
                <div className="row g-4 justify-content-center">
                    <div className="col-md-4" data-aos="zoom-in">
                        <div className="service shadow-lg p-3 mb-5 bg-white rounded">
                            <div className="service-img">
                                <img src="../assets/images/Shahzeb Mubashar (lesser size).webp" alt="Shahzeb Mubashar" className="imageround" />
                            </div>
                            <h5 className="mt-5 pt-4">Shahzeb Mubashar</h5>
                            <p>As the Co-Founder of Campus+, I've always believed in the power of creativity to transform ideas into impactful solutions. Campus+ reflects my vision to enhance the student experience at FAST.</p>
                        </div>
                    </div>
                    <div className="col-md-4" data-aos="zoom-in">
                        <div className="service shadow-lg p-3 mb-5 bg-white rounded">
                            <div className="service-img">
                                <img src="../assets/images/Shahzeb Mubashar (lesser size).webp" alt="Shahzeb Mubashar" className="imageround" />
                            </div>
                            <h5 className="mt-5 pt-4">Ghazanfar Raza Sheikh</h5>
                            <p>As the Co-Founder, my focus has been on turning creative concepts into practical, working solutions. Bringing Shahzeb's vision to life has been an exciting journey, one that I’m proud to be part of.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FounderSection;
