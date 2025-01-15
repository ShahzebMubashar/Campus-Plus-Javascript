import React from "react";
import "./SearchforPapers.css";
import { FaSearch, FaFileAlt, FaYoutube } from "react-icons/fa";

const papers = [
    {
        title: "Accounting and Finance",
        code: "AF",
        description:
            "Accounting and finance involve recording and analyzing financial transactions to ensure accurate records, regulatory compliance, and informed business decisions, essential for growth and financial health.",
        difficulty: "EASY",
    },
    {
        title: "Advanced Computer Architecture",
        code: "ACA",
        description:
            "Advanced Computer Architecture (ACA) focuses on optimizing computer systems for enhanced performance through efficient hardware and software integration. It includes parallel processing and memory hierarchy concepts.",
        difficulty: "MEDIUM",
    },
    {
        title: "Advanced Database Concepts",
        code: "ADC",
        description:
            "Advanced Database Concepts cover topics like database optimization, distributed databases, data warehousing, and advanced querying techniques for efficient data management.",
        difficulty: "HARD",
    },
];

const SearchForPapers = () => {
    return (
        <section className="search-for-papers">
            <h2>
                Search for <span className="highlighted">Papers</span>
            </h2>
            <div className="search-bar">
                <input type="text" placeholder="Search Here" />
                <button>
                    <FaSearch />
                </button>
            </div>
            <div className="papers-grid">
                {papers.map((paper, index) => (
                    <div key={index} className="paper-card">
                        <div className="difficulty-tag">{paper.difficulty}</div>
                        <h3>
                            {paper.title} <span>({paper.code})</span>
                        </h3>
                        <p>{paper.description}</p>
                        <div className="icons">
                            <FaFileAlt className="icon" />
                            <FaYoutube className="icon" />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default SearchForPapers;
