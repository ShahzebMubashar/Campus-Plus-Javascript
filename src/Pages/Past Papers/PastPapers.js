import React, { useState, useEffect } from "react";
import "./PastPapers.css";
import Navbar from "../Index/components/Navbar.js";
import "../Chatroom/css/Chatroom.css";
import NoteBanner from "../NoteBanner";
import { useNavigate } from "react-router-dom";
import { FaBook, FaSearch, FaTimes } from "react-icons/fa";
import API_BASE_URL from "../../config/api.js";

const PastPapers = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNote, setShowNote] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has previously dismissed the note
    const noteDismissed = localStorage.getItem('pastPapersNoteDismissed');
    if (noteDismissed === 'true') {
      setShowNote(false);
    }
  }, []);

  const handleDismissNote = () => {
    setShowNote(false);
    localStorage.setItem('pastPapersNoteDismissed', 'true');
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Fetch courses without authentication - public access
        const response = await fetch(`${API_BASE_URL}/Courses`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }
        const data = await response.json();
        // Sort courses with past papers to the top
        const sortedData = data.sort((a, b) => {
          if (a.past_papers_count && !b.past_papers_count) return -1;
          if (!a.past_papers_count && b.past_papers_count) return 1;
          return 0;
        });
        setCourses(sortedData);
        setFilteredCourses(sortedData);
      } catch (err) {
        setError("Unable to load courses at the moment.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const filtered = courses.filter((course) => {
      const courseName = course.coursename || "";
      const courseCode = course.coursecode || "";
      const query = searchQuery.toLowerCase();

      return (
        courseName.toLowerCase().includes(query) ||
        courseCode.toLowerCase().includes(query)
      );
    });

    // Sort courses: Available papers first, then by rating count, then by rating
    const sorted = filtered.sort((a, b) => {
      // First priority: Available papers
      const aHasPapers = a.past_papers_count > 0;
      const bHasPapers = b.past_papers_count > 0;

      if (aHasPapers && !bHasPapers) return -1;
      if (!aHasPapers && bHasPapers) return 1;

      // Second priority: Rating count (more ratings = higher priority)
      const aRatingCount = a.rating_count || 0;
      const bRatingCount = b.rating_count || 0;

      if (aRatingCount !== bRatingCount) {
        return bRatingCount - aRatingCount; // Descending order
      }

      // Third priority: Rating value (higher rating = higher priority)
      const aRating = a.rating || 0;
      const bRating = b.rating || 0;

      return bRating - aRating; // Descending order
    });

    setFilteredCourses(sorted);
  }, [searchQuery, courses]);

  const handleCourseClick = (courseId) => {
    navigate(`/past-papers/${courseId}`);
  };

  const renderCourseCard = (course) => (
    <div
      key={course.courseid}
      className="course-card"
      onClick={() => handleCourseClick(course.courseid)}
    >
      {course.past_papers_count > 0 && (
        <div className="papers-available-tag">Available</div>
      )}
      <div className="course-header">
        <div className="course-icon">
          <FaBook />
        </div>
        <div className="course-title">
          <h3>{course.coursename}</h3>
          <span className="course-code">{course.coursecode}</span>
        </div>
      </div>

      <div className="course-details">
        <div className="detail-item">
          <span className="label">Credits:</span>
          <span className="value">{course.credits}</span>
        </div>
        <div className="detail-item">
          <span className="label">Grading:</span>
          <span className="value">{course.grading}</span>
        </div>
        {course.rating && (
          <div className="detail-item difficulty-item">
            <span className="label">Difficulty:</span>
            <div className="difficulty-display">
              <div className="difficulty-meter">
                <div className="difficulty-fill" style={{ width: `${(course.rating / 5) * 100}%` }}>
                  <div className="difficulty-glow"></div>
                </div>
                <div className="difficulty-markers">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div key={level} className={`difficulty-marker ${level <= course.rating ? 'active' : ''}`}></div>
                  ))}
                </div>
              </div>
              <div className="difficulty-info">
                <span className="difficulty-level">{getDifficultyLevel(course.rating)}</span>
                <div className="difficulty-score-display">
                  <div className="difficulty-number">
                    {Number(course.rating) % 1 === 0 ? Number(course.rating).toFixed(0) : Number(course.rating).toFixed(1)}
                  </div>
                  <div className="difficulty-scale">/5</div>
                </div>
                {course.rating_count > 0 && (
                  <span className="rating-count">({course.rating_count} ratings)</span>
                )}
              </div>
            </div>
          </div>
        )}
        {!course.rating && (
          <div className="detail-item difficulty-item">
            <span className="label">Difficulty:</span>
            <div className="difficulty-display no-rating">
              <div className="no-rating-indicator">
                <span className="no-rating-text">No Rating</span>
              </div>
              <div className="no-rating-info">
                <span className="no-rating-subtitle">Be the first to rate</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const getDifficultyLevel = (rating) => {
    if (rating <= 1.5) return "Beginner";
    if (rating <= 2.5) return "Easy";
    if (rating <= 3.5) return "Moderate";
    if (rating <= 4.5) return "Challenging";
    return "Advanced";
  };

  if (loading) {
    return (
      <div className="pastpapers-app">
        <div className="navbar-wrapper">
          <Navbar />
        </div>
        <div className="loading-container">
          <div className="loading-spinner" />
          <p>Loading courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pastpapers-app">
        <div className="navbar-wrapper">
          <Navbar />
        </div>
        <div className="error-message">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pastpapers-app">
      <div className="navbar-wrapper">
        <Navbar />
      </div>

      <div className="pastpapers-header">
        <div className="header-main">
          <h1>Course Repository</h1>
          <p>Access past papers and course materials to enhance your learning experience</p>
        </div>

        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon">
              <FaBook />
            </div>
            <div className="stat-content">
              <span className="stat-number">{filteredCourses.length}</span>
              <span className="stat-label">Total Courses</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon available">
              <FaBook />
            </div>
            <div className="stat-content">
              <span className="stat-number">
                {filteredCourses.filter(c => c.past_papers_count > 0).length}
              </span>
              <span className="stat-label">With Papers</span>
            </div>
          </div>
        </div>

        <div className="search-container">
          <div className="search-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search courses by name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {showNote && (
          <div className="note-banner-wrapper">
            <div className="info-note">
              <div className="note-icon">ℹ️</div>
              <div className="note-content">
                <h4>Course Difficulty Guide</h4>
                <p>Difficulty ratings are based on student feedback and course complexity. Your experience may vary based on preparation and learning style.</p>
              </div>
              <button className="note-close-btn" onClick={handleDismissNote} aria-label="Dismiss note">
                <FaTimes />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="courses-grid">
        {filteredCourses.map(renderCourseCard)}
      </div>

    </div>
  );
};

export default PastPapers;
