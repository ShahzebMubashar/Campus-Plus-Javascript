import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PP.css";
import Navbar from "../Index/components/Navbar.js";

const PastPapers = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rating, setRating] = useState({});
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:4000/courses");
        if (!response.ok) {
          throw new Error(`Failed to fetch courses: ${response.status}`);
        }
        const data = await response.json();
        setCourses(data);
        setFilteredCourses(data); // Initially show all courses
      } catch (err) {
        setError("Unable to load courses at the moment. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    // Filter courses based on search query
    if (searchQuery === "") {
      setFilteredCourses(courses); // Show all courses if search is empty
    } else {
      const filtered = courses.filter((course) =>
        course.coursename.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCourses(filtered); // Update filtered courses based on search
    }
  }, [searchQuery, courses]);

  const handleRateCourse = async (courseId, rating) => {
    try {
      const response = await fetch(
        "http://localhost:4000/courses/rate-course",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ courseid: courseId, rating }),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        alert(error);
        return;
      }

      alert("Rating submitted successfully!");
    } catch (err) {
      alert("An error occurred while submitting your rating. Please try again.");
    }
  };

  const navigateToPapers = (courseId) => {
    navigate(`/past-papers/${courseId}`);
  };

  return (
    <div className="pastpapers-app">
      <Navbar />

      <header className="pastpapers-header">
        <h1 className="header-title">All Courses</h1>
        <p className="header-subtitle">Rate the courses you love to help others!</p>
      </header>

      <div className="container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for a course..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Update search query
          />
        </div>

        {loading ? (
          <p className="loading-text">Loading courses...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : (
          <div className="courses-grid">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <div key={course.courseid} className="course-card">
                  <div className="card-header">
                    <h3 className="course-title">{course.coursename}</h3>
                    <p className="course-credits">Credits: {course.credits}</p>
                  </div>
                  <div className="card-details">
                    <p>Grading: {course.grading}</p>
                    <p>Difficulty: {course.difficulty}</p>
                    <p>
                      Rating: {course.rating ? course.rating.toFixed(2) : "No ratings yet"}
                    </p>
                  </div>
                  <div className="rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`star ${rating[course.courseid] === star ? "selected" : ""}`}
                        onClick={() => {
                          setRating((prev) => ({
                            ...prev,
                            [course.courseid]: star,
                          }));
                          handleRateCourse(course.courseid, star);
                        }}
                        style={{ display: "inline-block", margin: "0 5px" }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <button
                    className="view-papers-button"
                    onClick={() => navigateToPapers(course.courseid)}
                  >
                    View Past Papers
                  </button>
                </div>
              ))
            ) : (
              <p className="no-results">No courses found for your search.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PastPapers;
