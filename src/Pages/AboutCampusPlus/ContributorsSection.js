import React from 'react';

const FounderSection = () => {
    return (
        <section id="contributors" className="bg-light">
            <div className="container">
                <div className="row">
                    <div className="col-12 section-intro text-center" data-aos="fade-up">
                        <h1>Campus+ would have been nothing without</h1>
                        <div className="divider"></div>
                    </div>
                </div>
                <div className="row g-4 justify-content-center">
                    {/* Contributor 1 */}
                    <div className="col-md-4 col-lg-3" data-aos="fade-up">
                        <div className="service shadow-lg p-4 rounded text-center">
                            <img
                                src="../assets/images/mujtaba.webp"
                                className="imageround1"
                                alt="Muhammad Mujtaba"
                            />
                            <div className="mt-4">
                                <h5 className="mt-2 mb-2">
                                    <a href="#">Muhammad Mujtaba</a>
                                </h5>
                                <p>
                                    Muhammad Mujtaba's coding expertise and experience played a crucial role in building the robust foundation of Campus+.
                                </p>
                                <a href="https://mmujtabah.vercel.app/" className="visit-profile-link">
                                    Visit Profile
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Contributor 2 */}
                    <div className="col-md-4 col-lg-3" data-aos="fade-up">
                        <div className="service shadow-lg p-4 rounded text-center">
                            <img
                                src="../assets/images/taha.webp"
                                className="imageround1"
                                alt="Taha Iqbal"
                            />
                            <div className="mt-4">
                                <h5 className="mt-2 mb-2">
                                    <a href="#">Taha Iqbal</a>
                                </h5>
                                <p>
                                    Taha Iqbal’s sharp coding skills and strong foundation in logic were essential in building the core features of Campus+.
                                </p>
                                <a href="https://tahaiqbal31.github.io/Personal-Portfolio/" className="visit-profile-link">
                                    Visit Profile
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Contributor 3 */}
                    <div className="col-md-4 col-lg-3" data-aos="fade-up">
                        <div className="service shadow-lg p-4 rounded text-center">
                            <img
                                src="../assets/images/Ammar Profile.webp"
                                className="imageround1"
                                alt="Ammar Zia"
                            />
                            <div className="mt-4">
                                <h5 className="mt-2 mb-2">
                                    <a href="#">Ammar Zia</a>
                                </h5>
                                <p>
                                    Ammar’s creativity, combined with his technical skills, brought fresh ideas that greatly contributed to the development of Campus+.
                                </p>
                                <a href="https://ammarnoorzia.github.io/aammarofficial.github.io/" className="visit-profile-link">
                                    Visit Profile
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Contributor 4 */}
                    <div className="col-md-4 col-lg-3" data-aos="fade-up">
                        <div className="service shadow-lg p-4 rounded text-center">
                            <img
                                src="../assets/images/Harris Profile.webp"
                                className="imageround1"
                                alt="Harris Tabassum"
                            />
                            <div className="mt-4">
                                <h5 className="mt-2 mb-2">
                                    <a href="#">Harris Tabassum</a>
                                </h5>
                                <p>
                                    Harris’s adaptability and deep understanding of tasks, combined with his skills, were key in effectively executing Campus+ features.
                                </p>
                                <a href="https://mharrist.github.io/MyPortfolio/" className="visit-profile-link">
                                    Visit Profile
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FounderSection;
