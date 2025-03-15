import React, { useState, useEffect } from "react";
import "./PP.css";
import Navbar from '../Index/components/Navbar.js';
import { useNavigate } from "react-router-dom";
import { FaBook, FaStar, FaDownload, FaChevronDown, FaExternalLinkAlt, FaSearch } from 'react-icons/fa';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

const PastPapers = () => {
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedCoursePapers, setSelectedCoursePapers] = useState({});
    const [expandedCourse, setExpandedCourse] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in by checking session
        const checkAuth = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/user/profile`, {
                    credentials: 'include' // Important for sending cookies
                });
                setIsLoggedIn(response.ok);
            } catch (err) {
                console.error('Auth check failed:', err);
                setIsLoggedIn(false);
            }
        };

        checkAuth();
    }, []);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/Courses`, {
                    credentials: 'include' // Important for sending cookies
                });
                if (!response.ok) {
                    throw new Error(`Failed to fetch courses: ${response.status}`);
                }
                const data = await response.json();
                console.log('Fetched courses:', data); // Debug log
                
                // Fetch past papers for all courses
                const coursesWithPapers = await Promise.all(
                    data.map(async (course) => {
                        try {
                            const papersResponse = await fetch(`${API_BASE_URL}/Courses/${course.courseid}/past-papers`, {
                                credentials: 'include' // Important for sending cookies
                            });
                            
                            if (papersResponse.status === 404) {
                                console.log(`No papers found for course ${course.courseid}`); // Debug log
                                return { ...course, hasPapers: false };
                            }
                            
                            if (!papersResponse.ok) {
                                console.error(`Error fetching papers for course ${course.courseid}: ${papersResponse.status}`);
                                return { ...course, hasPapers: false };
                            }
                            
                            const papers = await papersResponse.json();
                            console.log(`Papers for course ${course.courseid}:`, papers); // Debug log
                            return { ...course, hasPapers: papers.length > 0 };
                        } catch (err) {
                            console.error(`Error fetching papers for course ${course.courseid}:`, err);
                            return { ...course, hasPapers: false };
                        }
                    })
                );

                // Sort courses - ones with papers first
                const sortedCourses = coursesWithPapers.sort((a, b) => {
                    if (a.hasPapers === b.hasPapers) return 0;
                    return a.hasPapers ? -1 : 1;
                });

                console.log('Sorted courses:', sortedCourses); // Debug log
                setCourses(sortedCourses);
                setFilteredCourses(sortedCourses);
            } catch (err) {
                setError("Unable to load courses at the moment.");
                console.error("Fetch courses error:", err);
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

    const fetchPastPapers = async (courseId) => {
        if (selectedCoursePapers[courseId]) {
            setExpandedCourse(expandedCourse === courseId ? null : courseId);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/Courses/${courseId}/past-papers`, {
                credentials: 'include' // Important for sending cookies
            });
            if (!response.ok) {
                throw new Error(`Failed to fetch past papers: ${response.status}`);
            }
            const data = await response.json();
            console.log("Fetched papers:", data);
            
            if (!Array.isArray(data) || data.length === 0) {
                setError("No past papers available for this course.");
                return;
            }
            
            // Group papers by type and year
            const groupedPapers = data.reduce((acc, paper) => {
                const key = paper.paper_type;
                if (!acc[key]) acc[key] = [];
                acc[key].push(paper);
                return acc;
            }, {});

            // Sort papers by year within each type
            Object.keys(groupedPapers).forEach(type => {
                groupedPapers[type].sort((a, b) => b.paper_year - a.paper_year);
            });

            setSelectedCoursePapers((prev) => ({ ...prev, [courseId]: groupedPapers }));
            setExpandedCourse(courseId);
        } catch (err) {
            setError("Unable to fetch past papers.");
            console.error("Fetch papers error:", err);
        }
    };

    const handlePaperClick = (paper) => {
        const link = isLoggedIn && paper.file_link_down ? paper.file_link_down : paper.file_link;
        window.open(link, '_blank');
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

            {loading ? (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading courses...</p>
                </div>
            ) : error ? (
                <div className="error-message">
                    <p>{error}</p>
                </div>
            ) : (
                <div className="courses-grid">
                    {filteredCourses.map((course) => (
                        <div 
                            key={course.courseid}
                            className={`course-card ${course.hasPapers ? 'has-papers' : ''} ${expandedCourse === course.courseid ? 'expanded' : ''}`}
                        >
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
                                        {course.rating ? course.rating.toFixed(1) : "N/A"}
                                    </span>
                                </div>
                            </div>

                            {course.hasPapers && (
                                <button 
                                    className="fetch-papers-button"
                                    onClick={() => fetchPastPapers(course.courseid)}
                                >
                                    <FaChevronDown 
                                        className={`chevron-icon ${expandedCourse === course.courseid ? 'rotated' : ''}`}
                                    />
                                    View Past Papers
                                </button>
                            )}

                            {expandedCourse === course.courseid && selectedCoursePapers[course.courseid] && (
                                <div className="papers-section">
                                    {Object.entries(selectedCoursePapers[course.courseid]).map(([type, papers]) => (
                                        <div key={type} className="paper-category">
                                            <h4>{type}</h4>
                                            <div className="papers-list">
                                                {papers.map((paper) => (
                                                    <div
                                                        key={paper.paper_id}
                                                        className="paper-item"
                                                        onClick={() => handlePaperClick(paper)}
                                                    >
                                                        <div className="paper-info">
                                                            <span className="paper-year">{paper.paper_year}</span>
                                                        </div>
                                                        <FaExternalLinkAlt className="external-link-icon" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PastPapers;