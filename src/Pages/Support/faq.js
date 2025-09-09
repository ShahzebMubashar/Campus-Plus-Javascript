// src/components/FAQ/FAQ.js

import React, { useState } from "react";
import "../Index/components/FAQSection.css";

const FAQ = ({ faqData }) => {
  const [openCategory, setOpenCategory] = useState(null);
  const [openQuestion, setOpenQuestion] = useState({});

  const handleCategoryClick = (idx) => {
    setOpenCategory(openCategory === idx ? null : idx);
    setOpenQuestion({}); // Close all questions when switching category
  };

  const handleQuestionClick = (catIdx, qIdx) => {
    setOpenQuestion((prev) => ({
      ...prev,
      [catIdx]: prev[catIdx] === qIdx ? null : qIdx,
    }));
  };

  return (
    <section className="faq">
      <h2>Frequently Asked Questions (FAQs)</h2>
      {faqData.map((cat, catIdx) => (
        <div
          className={`faq-item ${openCategory === catIdx ? "active" : ""}`}
          key={cat.category}
        >
          <button
            className="faq-question"
            onClick={() => handleCategoryClick(catIdx)}
            style={{ fontWeight: 700, fontSize: "1.1rem" }}
          >
            {cat.category}
            <span className="arrow">
              {openCategory === catIdx ? "−" : "+"}
            </span>
          </button>
          <div
            className="faq-answer"
            style={{
              maxHeight: openCategory === catIdx ? "1000px" : "0",
              padding: openCategory === catIdx ? "10px" : "0 10px",
              backgroundColor: "transparent",
              overflow: "hidden",
              transition: "all 0.3s",
            }}
          >
            {openCategory === catIdx &&
              cat.questions.map((q, qIdx) => (
                <div
                  className={`faq-item ${openQuestion[catIdx] === qIdx ? "active" : ""}`}
                  key={q.question}
                  style={{ marginBottom: "0.5rem" }}
                >
                  <button
                    className="faq-question"
                    onClick={() => handleQuestionClick(catIdx, qIdx)}
                    style={{
                      fontWeight: 500,
                      fontSize: "1rem",
                      background: "#f8fafc",
                      borderRadius: 6,
                      margin: "6px 0",
                    }}
                  >
                    {q.question}
                    <span className="arrow">{openQuestion[catIdx] === qIdx ? "−" : "+"}</span>
                  </button>
                  <div
                    className="faq-answer"
                    style={{
                      maxHeight: openQuestion[catIdx] === qIdx ? "300px" : "0",
                      padding: openQuestion[catIdx] === qIdx ? "10px" : "0 10px",
                      backgroundColor: "#f1f5fa",
                      color: "#205295",
                      borderRadius: 8,
                      overflow: "hidden",
                      transition: "all 0.3s",
                    }}
                  >
                    {openQuestion[catIdx] === qIdx && (
                      <div dangerouslySetInnerHTML={{ __html: q.answer }} />
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </section>
  );
};

export default FAQ;
