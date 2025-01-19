// src/components/FAQ/FAQ.js

import React, { useState } from "react";

const FAQ = ({ faqData }) => {
    const [expandedCategory, setExpandedCategory] = useState(null);
    const [expandedFaq, setExpandedFaq] = useState(null);

    const toggleCategory = (index) => {
        setExpandedCategory(expandedCategory === index ? null : index);
    };

    const toggleFaq = (index) => {
        setExpandedFaq(expandedFaq === index ? null : index);
    };

    return (
        <section className="faq container my-4">
            <h2>
                Frequently Asked <span style={{ color: "#3b82f6", fontWeight: "bolder" }}>Questions</span>
            </h2>
            <div className="accordion" id="accordionExample">
                {faqData.map((category, categoryIndex) => (
                    <div key={categoryIndex} className="accordion-item">
                        <h2 className="accordion-header">
                            <button
                                className={`accordion-button ${expandedCategory === categoryIndex ? "" : "collapsed"}`}
                                type="button"
                                onClick={() => toggleCategory(categoryIndex)}
                            >
                                {category.category}
                            </button>
                        </h2>
                        <div
                            className={`accordion-collapse collapse ${expandedCategory === categoryIndex ? "show" : ""
                                }`}
                        >
                            <div className="accordion-body">
                                {category.questions.map((question, questionIndex) => (
                                    <div key={questionIndex} className="accordion-item sub-question">
                                        <h2 className="accordion-header">
                                            <button
                                                className={`accordion-button collapsed ${expandedFaq === `${categoryIndex}-${questionIndex}` ? "" : ""
                                                    }`}
                                                type="button"
                                                onClick={() => toggleFaq(`${categoryIndex}-${questionIndex}`)}
                                            >
                                                {question.question}
                                            </button>
                                        </h2>
                                        <div
                                            className={`accordion-collapse collapse ${expandedFaq === `${categoryIndex}-${questionIndex}` ? "show" : ""
                                                }`}
                                        >
                                            <div className="accordion-body">{question.answer}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FAQ;
