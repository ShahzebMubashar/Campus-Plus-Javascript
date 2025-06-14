import React from 'react';
import './Blog.css';
import Pic1 from '../../../Assets/images/blog-1.jpg';
import Pic2 from '../../../Assets/images/blog-2.jpg';
import Pic3 from '../../../Assets/images/blog-3.jpg';

const BlogSection = () => {
    return (
        <section className="blog-section">
            <div className="blog-container">
                <div className="blog-heading">
                    <h1>
                        Get Blogs with <span className="pp-highlighted" style={{ color: '#3b82f6' }}>Campus +</span>
                    </h1>
                </div>

                <div className="blog-section">
                    <div className="blog-card">
                        <a href="https://thebrainbytes.blogspot.com/2023/08/beyond-hype-understanding-realities-of.html">
                            <img src={Pic1} alt="Blog Image" />
                        </a>
                        <div className="blog-content-overlay">
                            <div className="blog-arrow">
                                <i className="fas fa-arrow-right"></i>
                            </div>

                            <h3>Beyond the Hype: Understanding the Realities of the Crypto Crash</h3>
                            <div className="blog-footer">
                                <span><i className="fas fa-calendar-alt"></i> Aug 25, 2023</span>
                                <span><i className="fas fa-comments"></i> Com 09</span>
                            </div>
                            <p className="blog-desc">In an era where digital fortunes and blockchain breakthroughs dominate...</p>
                        </div>
                    </div>

                    <div className="blog-card">
                        <a href="https://thebrainbytes.blogspot.com/2023/08/data-science-vs-statistics-unraveling.html">
                            <img src={Pic2} alt="Blog Image" />
                        </a>
                        <div className="blog-content-overlay">
                            <div className="blog-arrow">
                                <i className="fas fa-arrow-right"></i>
                            </div>

                            <h3>Data Science vs. Statistics: Unraveling the Mysteries of Modern Analytics</h3>
                            <div className="blog-footer">
                                <span><i className="fas fa-calendar-alt"></i> Aug 24, 2023</span>
                                <span><i className="fas fa-comments"></i> Com 09</span>
                            </div>
                            <p className="blog-desc">Introduction: Embracing the Era of Data-Driven Insights...</p>
                        </div>
                    </div>

                    <div className="blog-card">
                        <a href="https://thebrainbytes.blogspot.com/2023/07/will-quantum-computing-take-over.html">
                            <img src={Pic3} alt="Blog Image" />
                        </a>
                        <div className="blog-content-overlay">
                            <div className="blog-arrow">
                                <i className="fas fa-arrow-right"></i>
                            </div>

                            <h3>Will Quantum Computing Take Over? A Comprehensive Guide</h3>
                            <div className="blog-footer">
                                <span><i className="fas fa-calendar-alt"></i> Jul 10, 2023</span>
                                <span><i className="fas fa-comments"></i> Com 09</span>
                            </div>
                            <p className="blog-desc">What is Quantum Computers? Quantum computers deal with the theory of quantum...</p>
                        </div>
                    </div>
                </div>

                <a href="https://thebrainbytes.blogspot.com/" className="btn btn-primary">
                    <span className="span">View More Blogs</span>
                </a>
            </div>
        </section>
    );
};

export default BlogSection;
