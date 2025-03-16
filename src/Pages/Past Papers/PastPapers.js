import React, { useState, useEffect } from "react";
import "./PastPapers.css";
import Navbar from '../Index/components/Navbar.js';
import { useNavigate } from "react-router-dom";
import { FaBook, FaStar, FaSearch } from 'react-icons/fa';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

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
            onClick={() => handleCourseClick(course.courseid)}
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
                    <span 
                        className="value difficulty-badge"
                        style={{ backgroundColor: getDifficultyColor(course.difficulty) }}
                    >
                        {course.difficulty}
                    </span>
                </div>
                <div className="detail-item">
                    <span className="label">Rating:</span>
                    <span className="value rating">
                        <FaStar className="star-icon" />
                        {course.rating ? Number(course.rating).toFixed(1) : "N/A"}
                    </span>
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