import React from 'react';

const FounderSection = () => {
    return (
        <section id="reviews" className="text-center">
            <div className="container">
                <div className="row">
                    <div className="col-12 section-intro text-center">
                        <h1>What People Say About Us?</h1>
                        <div className="divider"></div>
                    </div>
                </div>
                <div className="row g-4 text-start">
                    {/* Review 1 */}
                    <div className="col-md-4" data-aos="fade-up">
                        <div className="review p-4">
                            <div className="person">
                                <img src="../assets/images/icon.webp" alt="" />
                                <div className="text ms-3">
                                    <h6 className="mb-0">Ali Iqbal</h6>
                                    <small>FAST(CFD)</small>
                                </div>
                            </div>
                            <p className="pt-4">
                                I've been using the Campus Plus website for my studies at FAST University, and it’s been a game-changer. The platform is user-friendly and provides easy access to all academic resources, including course materials, lecture notes, and past papers.
                            </p>
                            <div className="stars">
                                <i className="bx bxs-star"></i>
                                <i className="bx bxs-star"></i>
                                <i className="bx bxs-star"></i>
                                <i className="bx bxs-star"></i>
                                <i className="bx bxs-star"></i>
                            </div>
                        </div>
                    </div>

                    {/* Review 2 */}
                    <div className="col-md-4" data-aos="fade-up">
                        <div className="review p-4">
                            <div className="person">
                                <img src="../assets/images/icon.webp" alt="" />
                                <div className="text ms-3">
                                    <h6 className="mb-0">Salman Kashif</h6>
                                    <small>FAST(LHR)</small>
                                </div>
                            </div>
                            <p className="pt-4">
                                Campus+ is an excellent resource for FAST University students. The website is well-organized and offers a range of materials, from lecture slides to additional reading resources. I particularly appreciate the search functionality, which allows me to quickly find specific materials.
                            </p>
                            <div className="stars">
                                <i className="bx bxs-star"></i>
                                <i className="bx bxs-star"></i>
                                <i className="bx bxs-star"></i>
                                <i className="bx bxs-star"></i>
                                <i className="bx bxs-star"></i>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4" data-aos="fade-up">
                        <div className="review p-4">
                            <div className="person">
                                <img src="../assets/images/icon.webp" alt="" />
                                <div className="text ms-3">
                                    <h6 className="mb-0">Musa Faisal</h6>
                                    <small>FAST(LHR)</small>
                                </div>
                            </div>
                            <p className="pt-4">
                                As a student at FAST University, I find eCampus Plus to be an invaluable resource. The website consolidates all the essential academic resources in one place, making it incredibly convenient.
                            </p>
                            <div className="stars">
                                <i className="bx bxs-star"></i>
                                <i className="bx bxs-star"></i>
                                <i className="bx bxs-star"></i>
                                <i className="bx bxs-star"></i>
                                <i className="bx bxs-star"></i>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4" data-aos="fade-up">
                        <div className="review p-4">
                            <div className="person">
                                <img src="../assets/images/icon.webp" alt="" />
                                <div className="text ms-3">
                                    <h6 className="mb-0">Ismaeel</h6>
                                    <small>FAST(ISB)</small>
                                </div>
                            </div>
                            <p className="pt-4">
                                Campus Plus is fantastic for FAST University students! It’s intuitive, fast, and keeps all my resources in one place
                            </p>
                            <div className="stars">
                                <i className="bx bxs-star"></i>
                                <i className="bx bxs-star"></i>
                                <i className="bx bxs-star"></i>
                                <i className="bx bxs-star"></i>
                                <i className="bx bxs-star"></i>
                            </div>
                        </div>
                    </div>

                    {/* Review 2 */}
                    <div className="col-md-4" data-aos="fade-up">
                        <div className="review p-4">
                            <div className="person">
                                <img src="../assets/images/icon.webp" alt="" />
                                <div className="text ms-3">
                                    <h6 className="mb-0">Harris Amir</h6>
                                    <small>FAST(LHR)</small>
                                </div>
                            </div>
                            <p className="pt-4">
                                Campus Plus makes accessing lecture notes and past papers so easy. A must-have tool for any FAST University student.
                            </p>
                            <div className="stars">
                                <i className="bx bxs-star"></i>
                                <i className="bx bxs-star"></i>
                                <i className="bx bxs-star"></i>
                                <i className="bx bxs-star"></i>
                                <i className="bx bxs-star"></i>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4" data-aos="fade-up">
                        <div className="review p-4">
                            <div className="person">
                                <img src="../assets/images/icon.webp" alt="" />
                                <div className="text ms-3">
                                    <h6 className="mb-0">Awwab Ahmed</h6>
                                    <small>FAST(KHI)</small>
                                </div>
                            </div>
                            <p className="pt-4">
                                Campus Plus simplifies my academic life. The layout is clear, and the resources are easy to find. Great job!
                            </p>
                            <div className="stars">
                                <i className="bx bxs-star"></i>
                                <i className="bx bxs-star"></i>
                                <i className="bx bxs-star"></i>
                                <i className="bx bxs-star"></i>
                                <i className="bx bxs-star"></i>
                            </div>
                        </div>
                    </div>

                    {/* Add more reviews here in a similar fashion */}
                </div>
            </div>
        </section>
    );
};

export default FounderSection;
