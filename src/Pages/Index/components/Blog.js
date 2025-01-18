import React from 'react';
import './Blog.css';

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
                            <img src="assets/images/blog-1.jpg" alt="Blog Image" style={{ height: '270px' }} />
                            <div className="blog-content">
                                <div className="blog-hover-arrow">
                                    <i className="fas fa-arrow-right"></i>
                                </div>
                            </div>
                        </a>
                        <p>3 MINS</p>
                        <h3>Beyond the Hype: Understanding the Realities of the Crypto Crash</h3>
                        <div className="blog-footer">
                            <span><i className="fas fa-calendar-alt"></i> Aug 25, 2023</span>
                            <span><i className="fas fa-comments"></i> Com 09</span>
                        </div>
                        <p style={{ padding: '10px 0' }}>In an era where digital fortunes and blockchain breakthroughs dominate...</p>
                    </div>

                    <div className="blog-card">
                        <a href="https://thebrainbytes.blogspot.com/2023/08/data-science-vs-statistics-unraveling.html">
                            <img src="assets/images/blog-2.jpg" alt="Blog Image" style={{ height: '270px' }} />
                            <div className="blog-content">
                                <div className="blog-hover-arrow">
                                    <i className="fas fa-arrow-right"></i>
                                </div>
                            </div>
                        </a>
                        <p>2 MINS</p>
                        <h3>Data Science vs. Statistics: Unraveling the Mysteries of Modern Analytics</h3>
                        <div className="blog-footer">
                            <span><i className="fas fa-calendar-alt"></i> Aug 24, 2023</span>
                            <span><i className="fas fa-comments"></i> Com 09</span>
                        </div>
                        <p style={{ padding: '10px 0' }}>Introduction: Embracing the Era of Data-Driven Insights...</p>
                    </div>

                    <div className="blog-card">
                        <a href="https://thebrainbytes.blogspot.com/2023/07/will-quantum-computing-take-over.html">
                            <img src="assets/images/blog-3.jpg" alt="Blog Image" style={{ height: '270px' }} />
                            <div className="blog-content">
                                <div className="blog-hover-arrow">
                                    <i className="fas fa-arrow-right"></i>
                                </div>
                            </div>
                        </a>
                        <p>2 MINS</p>
                        <h3>Will Quantum Computing Take Over?</h3>
                        <div className="blog-footer">
                            <span><i className="fas fa-calendar-alt"></i> Jul 10, 2023</span>
                            <span><i className="fas fa-comments"></i> Com 09</span>
                        </div>
                        <p style={{ padding: '10px 0' }}>What is Quantum Computers? Quantum computers deal with the theory of quantum...</p>
                    </div>
                </div>

                <a href="https://thebrainbytes.blogspot.com/" className="btn btn-primary1">
                    <span className="span">View More Blogs</span>
                </a>
            </div>
        </section>
    );
};

export default BlogSection;
