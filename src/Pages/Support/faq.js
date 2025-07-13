// src/components/FAQ/FAQ.js

import React, { useState } from "react";
import "../Index/components/FAQSection.css";

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
    <section className="modern-faq-section">
      <div className="modern-faq-container">
        <h2 className="modern-faq-title">
          Frequently Asked{" "}
          <span className="modern-faq-highlighted">Questions</span>
        </h2>
        
        <div className="modern-faq-accordion">
          {faqData.map((category, categoryIndex) => (
            <div key={categoryIndex} className="modern-faq-category">
              <button
                className={`modern-faq-category-button ${
                  expandedCategory === categoryIndex ? "expanded" : ""
                }`}
                onClick={() => toggleCategory(categoryIndex)}
              >
                <span>{category.category}</span>
                <svg
                  className={`modern-faq-arrow ${
                    expandedCategory === categoryIndex ? "rotated" : ""
                  }`}
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 9L12 15L18 9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              
              <div
                className={`modern-faq-category-content ${
                  expandedCategory === categoryIndex ? "expanded" : ""
                }`}
              >
                {category.questions.map((question, questionIndex) => (
                  <div
                    key={questionIndex}
                    className="modern-faq-item"
                  >
                    <button
                      className={`modern-faq-question-button ${
                        expandedFaq === `${categoryIndex}-${questionIndex}` ? "expanded" : ""
                      }`}
                      onClick={() =>
                        toggleFaq(`${categoryIndex}-${questionIndex}`)
                      }
                    >
                      <span>{question.question}</span>
                      <svg
                        className={`modern-faq-arrow ${
                          expandedFaq === `${categoryIndex}-${questionIndex}` ? "rotated" : ""
                        }`}
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6 9L12 15L18 9"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    
                    <div
                      className={`modern-faq-answer ${
                        expandedFaq === `${categoryIndex}-${questionIndex}` ? "expanded" : ""
                      }`}
                    >
                      <p>{question.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
