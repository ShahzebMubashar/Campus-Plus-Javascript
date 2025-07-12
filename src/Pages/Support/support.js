import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./support1.css";
import image1 from "./1.svg";
import image2 from "./2.svg";
import FAQ from "./faq.js";
import faqData from "./faqData.js";
import Navbar from "../Index/components/Navbar.js";
import Footer from "../Footer/Footer.js";

const Support = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter FAQ data based on search query
  const filteredFaqData = faqData
    .map((category) => {
      // Filter questions in this category
      const filteredQuestions = category.questions.filter((q) => {
        const query = searchQuery.toLowerCase();
        return (
          q.question.toLowerCase().includes(query) ||
          q.answer.toLowerCase().includes(query) ||
          category.category.toLowerCase().includes(query)
        );
      });
      if (filteredQuestions.length > 0) {
        return { ...category, questions: filteredQuestions };
      }
      return null;
    })
    .filter(Boolean);

  return (
    <div className="support-page">
      <Navbar />
      <header className="support-header">
        <h1>FAST Help Center</h1>
        <p>Answers, Assistance, and Everything You Need</p>
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
      {searchQuery && filteredFaqData.length === 0 ? (
        <div style={{ textAlign: "center", margin: "2rem 0", color: "#888" }}>
          No results found for "{searchQuery}".
        </div>
      ) : (
        <FAQ faqData={searchQuery ? filteredFaqData : faqData} />
      )}

      {/* Personal Assistant Section */}
      <section className="personal-assistant my-5">
        <h2 className="text-center mb-4">
          Your Personal{" "}
          <span style={{ color: "#3b82f6", fontWeight: "bolder" }}>
            Assistant
          </span>
        </h2>
        <div className="assistant-cards">
          <div className="card">
            <img src={image1} alt="Email Generator" className="card-img-top" />
            <div className="card-body">
              <a
                href="/email-generator"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  fontWeight: "normal",
                }}
              >
                <h3 className="card-title">Email Generator</h3>
                <p className="card-text">
                  Create predefined email templates quickly and easily.
                </p>
              </a>
            </div>
          </div>
          <div className="card">
            <img
              src={image2}
              alt="Application Generator"
              className="card-img-top"
            />
            <div className="card-body">
              <a
                href="/application-generator"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  fontWeight: "normal",
                }}
              >
                <h3 className="card-title"> Application Generator</h3>
                <p className="card-text">
                  Generate application forms and documents effortlessly.
                </p>
              </a>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Support;
