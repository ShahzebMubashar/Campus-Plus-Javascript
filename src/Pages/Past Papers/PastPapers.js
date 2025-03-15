import React, { useState, useEffect } from "react";
import "./PP.css";
import Navbar from "../Index/components/Navbar.js";
import { FaChevronDown, FaChevronUp, FaExternalLinkAlt } from 'react-icons/fa';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

const PastPapers = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [papersData, setPapersData] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/courses`);
        if (!response.ok) throw new Error(`Failed to fetch courses: ${response.status}`);
        const data = await response.json();
        setCourses(data);
        setFilteredCourses(data);
      } catch (err) {
        setError("Unable to load courses at the moment.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const fetchPapers = async (courseId) => {
    if (papersData[courseId]) return; // Don't fetch if we already have the data

    try {
      const response = await fetch(`${API_BASE_URL}/courses/${courseId}/past-papers`);
      if (!response.ok) throw new Error(`Failed to fetch papers: ${response.status}`);
      const data = await response.json();
      
      // Group papers by type
      const groupedPapers = data.reduce((acc, paper) => {
        if (!acc[paper.paper_type]) acc[paper.paper_type] = [];
        acc[paper.paper_type].push(paper);
        return acc;
      }, {});

      setPapersData(prev => ({
        ...prev,
        [courseId]: groupedPapers
      }));
    } catch (err) {
      setError("Failed to fetch past papers.");
    }
  };

  const handleCourseClick = (courseId) => {
    if (expandedCourse === courseId) {
      setExpandedCourse(null);
    } else {
      setExpandedCourse(courseId);
      fetchPapers(courseId);
    }
  };

  const handlePaperClick = (downloadLink) => {
    window.open(downloadLink, '_blank');
  };

  return (
    <div className="pastpapers-app">
      <Navbar />
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="courses-container">
        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          filteredCourses.map((course) => (
            <div 
              key={course.courseid}
              className={`course-card ${expandedCourse === course.courseid ? 'expanded' : ''}`}
            >
              <div 
                className="course-header"
                onClick={() => handleCourseClick(course.courseid)}
              >
                <div className="course-info">
                  <h3>{course.coursename}</h3>
                  <span className="course-code">{course.coursecode}</span>
                </div>
                <div className="course-meta">
                  <span className="difficulty">Difficulty: {course.difficulty}</span>
                  <span className="credits">Credits: {course.credits}</span>
                  {expandedCourse === course.courseid ? <FaChevronUp /> : <FaChevronDown />}
                </div>
              </div>

              {expandedCourse === course.courseid && (
                <div className="papers-section">
                  {papersData[course.courseid] ? (
                    Object.entries(papersData[course.courseid]).map(([type, papers]) => (
                      <div key={type} className="paper-category">
                        <h4>{type}</h4>
                        <div className="papers-list">
                          {papers.map((paper) => (
                            <div 
                              key={paper.paperid}
                              className="paper-item"
                              onClick={() => handlePaperClick(paper.downloadLink)}
                            >
                              <span>{paper.year}</span>
                              <FaExternalLinkAlt className="external-link-icon" />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="loading-papers">Loading papers...</div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PastPapers;