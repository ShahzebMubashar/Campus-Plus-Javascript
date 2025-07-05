import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../Index/components/Navbar.js";
import "./PastPaperDetails.css";
import {
  FaDownload,
  FaExternalLinkAlt,
  FaLock,
  FaArrowLeft,
  FaBook,
  FaStar,
  FaClock,
  FaGraduationCap,
  FaChalkboardTeacher,
} from "react-icons/fa";
import { BsCircleFill } from "react-icons/bs";
import API_BASE_URL from "../../config/api.js";

const getDifficultyColor = (difficulty) => {
  const difficultyMap = {
    1: "#4CAF50", // Easy
    2: "#8BC34A", // Moderate
    3: "#FF9800", // Intermediate
    4: "#F44336", // Hard
    5: "#D32F2F", // Very Hard
  };
  return difficultyMap[difficulty] || "#757575";
};

const Rating = ({ courseId, currentRating, difficulty, onRate }) => {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);

  useEffect(() => {
    // Initialize with difficulty if no rating exists
    if (!currentRating && difficulty) {
      setSelectedRating(Number(difficulty));
    } else if (currentRating) {
      setSelectedRating(Number(currentRating));
    }
  }, [currentRating, difficulty]);

  const handleRatingSubmit = async (rating) => {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/rate-course`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseid: courseId,
          rating: rating,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      // Handle text response instead of JSON
      const message = await response.text();
      console.log("Rating response:", message);

      // Fetch updated course data
      const courseResponse = await fetch(
        `${API_BASE_URL}/courses/${courseId}`,
        {
          credentials: "include",
        },
      );

      if (!courseResponse.ok) {
        throw new Error("Failed to fetch updated course info");
      }

      const courseData = await courseResponse.json();
      setSelectedRating(rating);
      onRate(rating);
    } catch (error) {
      console.error("Error submitting rating:", error);
      alert(error.message || "Failed to submit rating. Please try again.");
    }
  };

  const getBarFill = (index) => {
    const barValue = index + 1;
    const rating = hoveredRating || selectedRating;

    if (!rating) return 0;

    if (barValue <= Math.floor(rating)) return 1;
    if (barValue > Math.ceil(rating)) return 0;

    return rating - Math.floor(rating);
  };

  return (
    <div className="rating">
      <div className="rating-bars">
        {[1, 2, 3, 4, 5].map((level, index) => (
          <div
            key={level}
            className="rating-bar"
            onMouseEnter={() => setHoveredRating(level)}
            onMouseLeave={() => setHoveredRating(0)}
            onClick={() => handleRatingSubmit(level)}
          >
            <div
              className="rating-bar-fill"
              style={{ transform: `scaleX(${getBarFill(index)})` }}
            />
          </div>
        ))}
      </div>
      <div className="rating-info">
        <span className="average-rating">
          {selectedRating ? Number(selectedRating).toFixed(1) : "0.0"}
        </span>
      </div>
    </div>
  );
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
        console.log("API_BASE_URL", API_BASE_URL);
        const response = await fetch(`${API_BASE_URL}/user/profile`, {
          credentials: "include",
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
        const courseResponse = await fetch(
          `${API_BASE_URL}/courses/${courseId}`,
          {
            credentials: "include",
          },
        );

        if (!courseResponse.ok) {
          if (courseResponse.status === 404) {
            throw new Error("Course not found");
          }
          throw new Error("Failed to fetch course info");
        }

        const courseData = await courseResponse.json();
        setCourseInfo(courseData);
        // Fetch papers
        const papersResponse = await fetch(
          `${API_BASE_URL}/courses/${courseId}/past-papers`,
          {
            credentials: "include",
          },
        );

        if (!papersResponse.ok) {
          if (papersResponse.status === 404) {
            setPapers({});
            return;
          }
          throw new Error("Failed to fetch past papers");
        }

        const papersData = await papersResponse.json();

        if (!Array.isArray(papersData) || papersData.length === 0) {
          setPapers({});
          return;
        }

        // Group papers by type
        const groupedPapers = papersData.reduce((acc, paper) => {
          const key = paper.paper_type || "Other";
          if (!acc[key]) acc[key] = [];
          acc[key].push(paper);
          return acc;
        }, {});

        // Sort papers by year within each type
        Object.keys(groupedPapers).forEach((type) => {
          groupedPapers[type].sort((a, b) => b.paper_year - a.paper_year);
        });

        setPapers(groupedPapers);
      } catch (err) {
        setError(
          err.message || "Unable to load content. Please try again later.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchData();
    }
  }, [courseId]);

  const handlePaperClick = (paper) => {
    const link =
      isLoggedIn && paper.file_link_down
        ? paper.file_link_down
        : paper.file_link;
    if (link) {
      window.open(link, "_blank");
    }
  };

  const handleBack = () => {
    navigate("/past-papers");
  };

  const handleRatingUpdate = (newRating) => {
    if (courseInfo) {
      setCourseInfo({
        ...courseInfo,
        rating: newRating,
      });
    }
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
              <p>{courseInfo?.credits || "N/A"}</p>
            </div>
          </div>
          <div className="detail-card">
            <div className="detail-icon">
              <FaGraduationCap />
            </div>
            <div className="detail-content">
              <h3>Grading</h3>
              <p>{courseInfo?.grading || "N/A"}</p>
            </div>
          </div>
          <div className="detail-card">
            <div className="detail-icon">
              <FaClock />
            </div>
            <div className="detail-content">
              <h3>Difficulty</h3>
              <Rating
                courseId={courseId}
                currentRating={courseInfo?.rating}
                difficulty={courseInfo?.difficulty}
                onRate={handleRatingUpdate}
              />
            </div>
          </div>
          <div className="detail-card">
            <div className="detail-icon">
              <FaChalkboardTeacher />
            </div>
            <div className="detail-content">
              <h3>Instructors</h3>
              <p>{courseInfo?.instructors || "N/A"}</p>
            </div>
          </div>
        </div>
      </div>

      {!isLoggedIn && (
        <div className="signin-banner">
          <FaLock className="lock-icon" />
          <div className="banner-content">
            <h3>Sign in to download past papers</h3>
            <p>
              You can view all papers now, but sign in to access downloadable
              versions
            </p>
            <Link to="/sign-in" className="signin-button">
              Sign In
            </Link>
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
          Object.entries(papers).map(([type, typePapers]) => {
            // Group papers by year within each type
            const papersByYear = typePapers.reduce((acc, paper) => {
              const year = paper.paper_year || "Unknown Year";
              if (!acc[year]) acc[year] = [];
              acc[year].push(paper);
              return acc;
            }, {});

            return (
              <div key={type} className="paper-section">
                <h2 className="section-title">{type}</h2>
                {Object.entries(papersByYear).map(([year, yearPapers]) => (
                  <div key={year}>
                    <h3 className="year-title">{year}</h3>
                    <div className="papers-grid">
                      {yearPapers.map((paper) => (
                        <div
                          key={paper.paperid}
                          className="paper-card"
                          onClick={() => handlePaperClick(paper)}
                        >
                          <div className="paper-info">
                            <p>{paper.file_name}</p>
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
                ))}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default PastPapersDetails;
