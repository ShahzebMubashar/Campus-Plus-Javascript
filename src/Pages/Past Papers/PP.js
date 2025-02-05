import React, { useState, useEffect } from "react";
import "./PP.css";
import Navbar from '../Index/components/Navbar.js';
import { useNavigate } from "react-router-dom";
import "./PP.css";

const PastPapers = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedCoursePapers, setSelectedCoursePapers] = useState({});
    const navigate = useNavigate(); 

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

    const fetchPastPapers = async (courseId) => {
        try {
            const response = await fetch(`http://localhost:4000/api/courses/${courseId}/past-papers`);
            if (!response.ok) {
                throw new Error(`Failed to fetch past papers: ${response.status}`);
            }
            const data = await response.json();
            setSelectedCoursePapers((prev) => ({ ...prev, [courseId]: data }));
        } catch (err) {
            setError("Unable to fetch past papers.");
        }
    };

    const handlePaperClick = async (paperId) => {
        try {
            const response = await fetch(`http://localhost:4000/api/courses/past-papers/${paperId}/download`);
            if (!response.ok) {
                throw new Error("Failed to download the paper.");
            }

            const fileBlob = await response.blob();
            const fileURL = URL.createObjectURL(fileBlob);

            // Navigate to a new route to display the PDF
            navigate("/view", { state: { fileURL } });
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

                            {/* Fetch Past Papers Button */}
                            <button 
                                className="fetch-papers-button" 
                                onClick={() => fetchPastPapers(course.courseid)}
                            >
                                Fetch Past Papers
                            </button>

                            {/* Display Past Papers for the Course */}
                            {selectedCoursePapers[course.courseid] && (
                                <div className="papers-list">
                                    {selectedCoursePapers[course.courseid].map((paper) => (
                                        <div
                                            key={paper.paper_id}
                                            className="paper-item"
                                            onClick={() => handlePaperClick(paper.paper_id)}
                                        >
                                            <h4>{paper.paper_type}</h4>
                                            <p>Year: {paper.paper_year}</p>
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