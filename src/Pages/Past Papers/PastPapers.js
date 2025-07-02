import React, { useState, useEffect } from "react";
import "./PastPapers.css";
import Navbar from '../Index/components/Navbar.js';
import { useNavigate } from "react-router-dom";
import { FaBook, FaStar, FaSearch } from 'react-icons/fa';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

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
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    courseid: courseId,
                    rating: rating
                }),
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(error);
            }

            // Handle text response instead of JSON
            const message = await response.text();
            console.log('Rating response:', message);

            // Fetch updated course data
            const courseResponse = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
                credentials: 'include'
            });

            if (!courseResponse.ok) {
                throw new Error('Failed to fetch updated course info');
            }

            const courseData = await courseResponse.json();
            setSelectedRating(rating);
            onRate(rating);
        } catch (error) {
            console.error('Error submitting rating:', error);
            alert(error.message || 'Failed to submit rating. Please try again.');
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
                    {selectedRating ? Number(selectedRating).toFixed(1) : '0.0'}
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
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/Courses`, {
                    credentials: 'include'
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch courses');
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
        const filtered = courses.filter(course => {
            const courseName = course.coursename || '';
            const courseCode = course.coursecode || '';
            const query = searchQuery.toLowerCase();

            return courseName.toLowerCase().includes(query) ||
                courseCode.toLowerCase().includes(query);
        });
        setFilteredCourses(filtered);
    }, [searchQuery, courses]);

    const handleCourseClick = (courseId) => {
        navigate(`/past-papers/${courseId}`);
    };

    const handleRatingUpdate = (courseId, newRating) => {
        setCourses(prevCourses =>
            prevCourses.map(course =>
                course.courseid === courseId
                    ? { ...course, rating: newRating }
                    : course
            )
        );
    };

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

    const renderCourseCard = (course) => (
        <div
            key={course.courseid}
            className="course-card"
            onClick={(e) => {
                // Don't navigate if clicking on rating component
                if (e.target.closest('.rating')) {
                    return;
                }
                handleCourseClick(course.courseid);
            }}
        >
            {course.past_papers_count > 0 && (
                <div className="papers-available-tag">
                    Available
                </div>
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
                    <span className="label">Difficulty:</span>
                    <Rating
                        courseId={course.courseid}
                        currentRating={course.rating}
                        difficulty={course.difficulty}
                        onRate={(rating) => handleRatingUpdate(course.courseid, rating)}
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
        </div>
    );
};

export default PastPapers;