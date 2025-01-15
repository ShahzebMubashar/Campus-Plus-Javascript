import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./support1.css";
import image1 from "./1.svg";
import image2 from "./2.svg";
import FAQ from "./faq";

const Support = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    const faqData = [
        {
            category: "University Life",
            questions: [
                {
                    question: "What are the best study habits for FAST University students?",
                    answer:
                        "To excel at FAST University, consider establishing a consistent study schedule, joining study groups, utilizing campus resources, and staying organized.",
                },
                {
                    question: "How can I balance academics and extracurricular activities?",
                    answer:
                        "Prioritize your tasks, manage your time effectively, and set clear goals. Participate in extracurricular activities that align with your academic interests.",
                },
                {
                    question: "What are some tips for managing stress during exams?",
                    answer:
                        "Practice mindfulness, maintain a healthy lifestyle, take regular breaks, and seek support from friends, family, or counseling services.",
                },
                {
                    question: "What are some popular student organizations at FAST University?",
                    answer:
                        "FAST University has various student organizations including the Voice Debating Society, Programming Clubs, Business Society, and much more.",
                },
            ],
        },
        {
            category: "How to Survive FAST",
            questions: [
                {
                    question: "What are the most challenging courses at FAST University?",
                    answer:
                        "Courses like Algorithms and Analysis, and COAL (Computer Organization and Assembly Language) are often challenging.",
                },
                {
                    question: "How can I get help if I’m struggling with a subject?",
                    answer:
                        "Stay engaged during lectures, seek assistance from instructors, participate in study groups, and utilize online resources.",
                },
            ],
        },
        {
            category: "Campus Resources",
            questions: [
                {
                    question: "Where can I find academic advising on campus?",
                    answer: "Academic advising is typically available in the Student Services office or through academic advisors.",
                },
                {
                    question: "What resources are available for career development?",
                    answer:
                        "The Career Services office offers counseling, resume reviews, job search assistance, and career fairs.",
                },
            ],
        },
    ];

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 2000); // Simulates loader
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div className="loader-wrapper">
                <div className="loader">
                    <img src="/assets/images/cp_logo.png" alt="Logo" className="loader-logo" />
                </div>
            </div>
        );
    }

    return (
        <div className="support-page">
            <header className="support-header">
                <h1>FAST Help Center</h1>
                <p>Far better than FAST Student Facilitation Centre</p>
            </header>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search Here"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button>
                    <i className="fas fa-search"></i>
                </button>
            </div>

            {/* FAQ Section */}
            <FAQ faqData={faqData} />

            {/* Personal Assistant Section */}
            <section className="personal-assistant my-5">
                <h2 className="text-center mb-4">
                    Your Personal <span style={{ color: "#3b82f6", fontWeight: "bolder" }}>Assistant</span>
                </h2>
                <div className="assistant-cards">
                    <div className="card">
                        <img src={image1} alt="Email Generator" className="card-img-top" />
                        <div className="card-body">
                            <h3 className="card-title">Email Generator</h3>
                            <p className="card-text">Create predefined email templates quickly and easily.</p>
                        </div>
                    </div>
                    <div className="card">
                        <img src={image2} alt="Application Generator" className="card-img-top" />
                        <div className="card-body">
                            <h3 className="card-title">Application Generator</h3>
                            <p className="card-text">
                                Generate application forms and documents effortlessly.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Recommended Articles Section */}
            <section className="recommended-articles my-5">
                <h2 className="text-center mb-4">
                    Recommended <span style={{ color: "#3b82f6", fontWeight: "bolder" }}>Articles</span>
                </h2>
                <div className="articles-container">
                    <div className="article-card">
                        <img
                            src="/assets/images/data_science.png"
                            alt="Data Science vs. Statistics"
                            className="article-img"
                        />
                        <div className="article-content">
                            <h3 className="article-title">Data Science vs. Statistics: Unraveling the Mysteries</h3>
                            <p className="article-description">
                                Discover the key differences between data science and statistics and how they influence
                                modern analytics.
                            </p>
                        </div>
                    </div>
                    <div className="article-card">
                        <img
                            src="/assets/images/gig_economy.png"
                            alt="Navigating the Gig Economy"
                            className="article-img"
                        />
                        <div className="article-content">
                            <h3 className="article-title">Navigating the Gig Economy: Opportunities and Challenges</h3>
                            <p className="article-description">
                                Explore the dynamics of the gig economy and strategies to thrive in a rapidly changing
                                job market.
                            </p>
                        </div>
                    </div>
                    <div className="article-card">
                        <img
                            src="/assets/images/chatgpt_impact.png"
                            alt="The Impact of ChatGPT"
                            className="article-img"
                        />
                        <div className="article-content">
                            <h3 className="article-title">The Impact of ChatGPT on Modern Life</h3>
                            <p className="article-description">
                                Learn about how ChatGPT is transforming our daily interactions and the future of AI.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Support;
