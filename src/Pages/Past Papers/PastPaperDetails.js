import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../Index/components/Navbar.js";
import "./PastPaperDetails.css";
import { FaDownload, FaExternalLinkAlt, FaLock, FaArrowLeft, FaBook, FaStar, FaClock, FaGraduationCap, FaChalkboardTeacher } from 'react-icons/fa';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

const getDifficultyColor = (difficulty) => {
  const difficultyMap = {
    '1': '#4CAF50', // Easy
    '2': '#8BC34A', // Moderate
    '3': '#FF9800', // Intermediate  
    '4': '#F44336', // Hard
    '5': '#D32F2F'  // Very Hard
  };
  return difficultyMap[difficulty] || '#757575';
};

const PastPapersDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [papers, setPapers] = useState({});
  const [courseInfo, setCourseInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/user/profile`, {
          credentials: 'include'
        });
        setIsLoggedIn(response.ok);
      } catch (err) {
        setIsLoggedIn(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch course info
        const courseResponse = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
          credentials: 'include'
        });
        
        if (!courseResponse.ok) {
          if (courseResponse.status === 404) {
            throw new Error('Course not found');
          }
          throw new Error('Failed to fetch course info');
        }
        
        const courseData = await courseResponse.json();
        setCourseInfo(courseData);

        // Fetch papers
        const papersResponse = await fetch(`${API_BASE_URL}/courses/${courseId}/past-papers`, {
          credentials: 'include'
        });

        if (!papersResponse.ok) {
          if (papersResponse.status === 404) {
            setPapers({});
            return;
          }
          throw new Error('Failed to fetch past papers');
        }

        const papersData = await papersResponse.json();
        
        if (!Array.isArray(papersData) || papersData.length === 0) {
          setPapers({});
          return;
        }

        // Group papers by type
        const groupedPapers = papersData.reduce((acc, paper) => {
          const key = paper.paper_type || 'Other';
          if (!acc[key]) acc[key] = [];
          acc[key].push(paper);
          return acc;
        }, {});

        // Sort papers by year within each type
        Object.keys(groupedPapers).forEach(type => {
          groupedPapers[type].sort((a, b) => b.paper_year - a.paper_year);
        });

        setPapers(groupedPapers);
      } catch (err) {
        setError(err.message || "Unable to load content. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchData();
    }
  }, [courseId]);

  const handlePaperClick = (paper) => {
    const link = isLoggedIn && paper.file_link_down ? paper.file_link_down : paper.file_link;
    if (link) {
      window.open(link, '_blank');
    }
  };

  const handleBack = () => {
    navigate('/past-papers');
  };

  if (loading) {
    return (
      <div className="pastpapers-details">
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner" />
          <p>Loading content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pastpapers-details">
        <Navbar />
        <div className="error-container">
          <p>{error}</p>
          <button onClick={handleBack} className="back-button">
            <FaArrowLeft /> Back to Courses
          </button>
        </div>
      </div>
    );
  }

  const hasPapers = Object.keys(papers).length > 0;

  return (
    <div className="pastpapers-details">
      <Navbar />
      
      <div className="course-banner">
        <div className="course-info">
          <button onClick={handleBack} className="back-button">
            <FaArrowLeft /> Back to Courses
          </button>
          <h1>{courseInfo?.coursename}</h1>
          <p className="course-code">{courseInfo?.coursecode}</p>
        </div>
      </div>

      <div className="course-details-card">
        <div className="details-grid">
          <div className="detail-card">
            <div className="detail-icon">
              <FaBook />
            </div>
            <div className="detail-content">
              <h3>Credits</h3>
              <p>{courseInfo?.credits || 'N/A'}</p>
            </div>
          </div>
          <div className="detail-card">
            <div className="detail-icon">
              <FaGraduationCap />
            </div>
            <div className="detail-content">
              <h3>Grading</h3>
              <p>{courseInfo?.grading || 'N/A'}</p>
            </div>
          </div>
          <div className="detail-card">
            <div className="detail-icon">
              <FaClock />
            </div>
            <div className="detail-content">
              <h3>Difficulty</h3>
              <div className="difficulty-badge" style={{ 
                backgroundColor: getDifficultyColor(courseInfo?.difficulty)
              }}>
                {courseInfo?.difficulty || 'N/A'}
              </div>
            </div>
          </div>
          <div className="detail-card">
            <div className="detail-icon">
              <FaStar />
            </div>
            <div className="detail-content">
              <h3>Rating</h3>
              <p>{courseInfo?.rating ? `${Number(courseInfo.rating).toFixed(1)}/5.0` : 'N/A'}</p>
            </div>
          </div>
          <div className="detail-card">
            <div className="detail-icon">
              <FaChalkboardTeacher />
            </div>
            <div className="detail-content">
              <h3>Instructors</h3>
              <p>{courseInfo?.instructors || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      {!isLoggedIn && (
        <div className="signin-banner">
          <FaLock className="lock-icon" />
          <div className="banner-content">
            <h3>Sign in to download past papers</h3>
            <p>You can view all papers now, but sign in to access downloadable versions</p>
            <Link to="/sign-in" className="signin-button">Sign In</Link>
          </div>
        </div>
      )}

      <div className="papers-container">
        {!hasPapers ? (
          <div className="no-papers">
            <h2>No Past Papers Available</h2>
            <p>There are currently no past papers available for this course.</p>
          </div>
        ) : (
          Object.entries(papers).map(([type, typePapers]) => (
            <div key={type} className="paper-section">
              <h2 className="section-title">{type}</h2>
              <div className="papers-grid">
                {typePapers.map((paper) => (
                  <div 
                    key={paper.paperid} 
                    className="paper-card"
                    onClick={() => handlePaperClick(paper)}
                  >
                    <div className="paper-info">
                      <h3>{paper.paper_year} {type}</h3>
                      <p>{paper.description || `${courseInfo?.coursecode} - ${paper.paper_year}`}</p>
                    </div>
                    <div className="paper-actions">
                      {isLoggedIn && paper.file_link_down ? (
                        <FaDownload className="action-icon download" />
                      ) : (
                        <FaExternalLinkAlt className="action-icon external" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PastPapersDetails;

