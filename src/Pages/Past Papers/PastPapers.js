import React, { useState, useEffect } from "react";
import "./PastPapers.css";
import Navbar from "../Index/components/Navbar.js";
import "../Chatroom/css/Chatroom.css";
import NoteBanner from "../NoteBanner";
import { useNavigate } from "react-router-dom";
import { FaBook, FaStar, FaSearch } from "react-icons/fa";
import API_BASE_URL from "../../config/api.js";

const Star = ({ fill = 1, size = 28, ...props }) => {
  // fill: 1 = full, 0.5 = half, 0.25 = quarter, 0 = empty
  let gradientId = `star-gradient-${Math.random()}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#144272" />
          <stop offset={fill === 1 ? "100%" : fill === 0.5 ? "50%" : fill === 0.25 ? "25%" : "0%"} stopColor="#205295" />
          <stop offset={fill === 1 ? "100%" : fill === 0.5 ? "50%" : fill === 0.25 ? "25%" : "0%"} stopColor="#e4e5e9" />
        </linearGradient>
      </defs>
      <path
        d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
        fill={`url(#${gradientId})`}
        stroke="#144272"
        strokeWidth="0.5"
      />
    </svg>
  );
};

const LoginPrompt = ({ onClose }) => (
  <div className="login-overlay">
    <div className="blurred-background" onClick={onClose}></div>
    <div className="login-prompt">
      <div className="login-prompt-content">
        <div className="login-prompt-icon">🔒</div>
        <h2>Authentication Required</h2>
        <p>You need to log in to use the rating feature.</p>
        <p>Please sign in to your account to continue.</p>
        <button
          className="login-prompt-btn"
          onClick={() => (window.location.href = "/sign-in")}
        >
          Sign In
        </button>
      </div>
    </div>
  </div>
);

const Rating = ({ courseId, currentRating, difficulty, onRate, onRequireLogin }) => {
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
    // Check login state
    if (!localStorage.getItem("user")) {
      if (onRequireLogin) onRequireLogin();
      return;
    }
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

  // Helper to determine fill for each star (1, 0.5, 0.25, 0)
  const getStarFill = (starIndex) => {
    const rating = hoveredRating || selectedRating;
    const diff = rating - starIndex;
    if (diff >= 1) return 1;
    if (diff >= 0.75) return 1;
    if (diff >= 0.5) return 0.5;
    if (diff >= 0.25) return 0.25;
    return 0;
  };

  return (
    <div className="rating">
      <div className="rating-bars">
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} onMouseEnter={() => setHoveredRating(i + 1)} onMouseLeave={() => setHoveredRating(0)} onClick={() => handleRatingSubmit(i + 1)} style={{ cursor: "pointer" }}>
            <Star fill={getStarFill(i)} size={28} data-testid={`star-${i + 1}`} />
          </span>
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

const PastPapers = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/Courses`, {
          credentials: "include",
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
    setFilteredCourses(filtered);
  }, [searchQuery, courses]);

  const handleCourseClick = (courseId) => {
    navigate(`/past-papers/${courseId}`);
  };

  const handleRatingUpdate = (courseId, newRating) => {
    setCourses((prevCourses) =>
      prevCourses.map((course) =>
        course.courseid === courseId
          ? { ...course, rating: newRating }
          : course,
      ),
    );
  };

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

  // Pass this to Rating so it can trigger the modal
  const handleShowLoginPrompt = () => setShowLoginPrompt(true);

  const renderCourseCard = (course) => (
    <div
      key={course.courseid}
      className="course-card"
      onClick={(e) => {
        // Don't navigate if clicking on rating component
        if (e.target.closest(".rating")) {
          return;
        }
        handleCourseClick(course.courseid);
      }}
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
        <div className="detail-item">
          <span className="label">Rating:</span>
          <Rating
            courseId={course.courseid}
            currentRating={course.rating}
            difficulty={course.difficulty}
            onRate={(rating) => handleRatingUpdate(course.courseid, rating)}
            onRequireLogin={handleShowLoginPrompt}
          />
        </div>
      </div>
    </div>
  );

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
        <h1>Course Repository</h1>
        <p>Access past papers and course materials</p>
        <NoteBanner>
          Note: A lower rating may reflect a higher perceived difficulty or a less favorable course experience. Please note that difficulty and experience can vary based on individual preferences and learning styles.
        </NoteBanner>
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
      </div>

      <div className="courses-grid">
        {filteredCourses.map(renderCourseCard)}
      </div>

      {showLoginPrompt && <LoginPrompt onClose={() => setShowLoginPrompt(false)} />}
    </div>
  );
};

export default PastPapers;
