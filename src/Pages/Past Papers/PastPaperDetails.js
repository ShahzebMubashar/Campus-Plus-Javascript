import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../Index/components/Navbar.js";
import "./PP.css";

const PastPapersDetails = () => {
  const { courseId } = useParams(); // Get course ID from URL params
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const response = await fetch(`http://localhost:4000/courses/${courseId}/past-papers`);
        if (!response.ok) {
          throw new Error(`Failed to fetch past papers: ${response.status}`);
        }
        const data = await response.json();
        // Sort papers by type
        const sortedPapers = data.sort((a, b) => a.type.localeCompare(b.type));
        setPapers(sortedPapers);
      } catch (err) {
        setError("Unable to load past papers at the moment. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, [courseId]);

  return (
    <div className="pastpapers-details-app">
      <Navbar />

      <header className="pastpapers-header">
        <h1 className="header-title">Past Papers</h1>
        <p className="header-subtitle">Explore past papers for the course.</p>
      </header>

      <div className="container">
        {loading ? (
          <p className="loading-text">Loading past papers...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : (
          <div className="papers-grid">
            {papers.length === 0 ? (
              <p className="no-papers-text">No past papers available for this course.</p>
            ) : (
              papers.map((paper) => (
                <div key={paper.paperid} className="paper-card">
                  <h3 className="paper-type">{paper.type}</h3>
                  <p className="paper-year">Year: {paper.year}</p>
                  <a
                    href={paper.downloadLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="download-link"
                  >
                    Download
                  </a>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PastPapersDetails;
