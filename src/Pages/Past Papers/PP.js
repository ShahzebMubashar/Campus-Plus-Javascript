import React, { useState, useEffect } from "react";
import "./PP.css";
import Navbar from '../Index/components/Navbar.js';
import SliderComponent from "./Slider.js";
import SearchForPapers from './SearchforPapers.js';

const PastPapers = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedPaper, setSelectedPaper] = useState(null); // Track selected paper for viewing
    const [rating, setRating] = useState({});

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch("http://localhost:4000/api/courses");
                if (!response.ok) {
                    throw new Error(`Failed to fetch courses: ${response.status}`);
                }
                const data = await response.json();
                setCourses(data);
            } catch (err) {
                setError("Unable to load courses at the moment.");
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const handlePaperClick = async (paperId) => {
        try {
            const response = await fetch(`http://localhost:4000/api/past-papers/${paperId}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch paper: ${response.status}`);
            }
            const fileBlob = await response.blob();
            const fileURL = URL.createObjectURL(fileBlob); // Create an object URL to view the PDF

            setSelectedPaper(fileURL); // Set the selected paper to be viewed
        } catch (err) {
            setError("Failed to load the paper.");
        }
    };

    return (
        <div className="pastpapers-app">
            <div className="navbar-wrapper">
                <Navbar />
            </div>

            <header className="pastpapers-header">
                <h1>All Courses</h1>
                <p>Rate the courses you love to help others!</p>
            </header>

            {loading ? (
                <p>Loading courses...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <div className="courses-grid">
                    {courses.map((course) => (
                        <div key={course.courseid} className="course-card">
                            <h3>{course.coursename}</h3>
                            <p>Credits: {course.credits}</p>
                            <p>Grading: {course.grading}</p>
                            <p>Difficulty: {course.difficulty}</p>
                            <p>Rating: {course.rating ? course.rating.toFixed(2) : "No ratings yet"}</p>

                            {/* List all past papers for the course */}
                            <div className="papers-list">
                                {course.past_papers && course.past_papers.map((paper) => (
                                    <div
                                        key={paper.id}
                                        className="paper-item"
                                        onClick={() => handlePaperClick(paper.id)} // Handle paper click
                                    >
                                        <h4>{paper.paper_type}</h4>
                                        <p>{paper.subject}</p>
                                        <p>{paper.year}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="rating">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                        key={star}
                                        className={`star ${rating[course.courseid] === star ? "selected" : ""}`}
                                        onClick={() => {
                                            setRating((prev) => ({ ...prev, [course.courseid]: star }));
                                            // handleRateCourse(course.courseid, star);
                                        }}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Display selected paper PDF */}
            {selectedPaper && (
                <div className="pdf-viewer">
                    <iframe
                        src={selectedPaper}
                        width="100%"
                        height="600px"
                        title="Past Paper"
                    />
                </div>
            )}
        </div>
    );
};

export default PastPapers;
