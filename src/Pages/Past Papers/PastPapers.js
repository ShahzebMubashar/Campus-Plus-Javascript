import React, { useState, useEffect } from "react";
import "./PP.css";
import SliderComponent from "./Slider.js";
import SearchForPapers from './SearchforPapers.js';

const PastPapers = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [rating, setRating] = useState({}); // Add state to track ratings

    // Fetch courses from the backend
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch("http://localhost:4000/api/courses");
                console.log("Response Status:", response.status);
                if (!response.ok) {
                    throw new Error(`Failed to fetch courses: ${response.status}`);
                }
                const data = await response.json(); // Parse JSON response
                console.log("Fetched Courses:", data); // Log the data
                setCourses(data);
            } catch (err) {
                console.error("Error fetching courses:", err);
                setError("Unable to load courses at the moment. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const handleRateCourse = async (courseId, rating) => {
        const userId = 1; // Replace with the logged-in user's ID (hardcoded for now)

        try {
            const response = await fetch("http://localhost:4000/api/courses/rate-course", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ courseid: courseId, rating, userid: userId }),
            });

            if (!response.ok) {
                const error = await response.text();
                alert(error);
                return;
            }

            alert("Rating submitted successfully!");
            // Optionally, refresh course data
        } catch (err) {
            console.error("Error rating course:", err);
            alert("An error occurred while submitting your rating. Please try again.");
        }
    };


    return (
        <div className="pastpapers-app">
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
                            <div className="rating">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                        key={star}
                                        className={`star ${rating[course.courseid] === star ? "selected" : ""}`}
                                        onClick={() => {
                                            setRating((prev) => ({ ...prev, [course.courseid]: star }));
                                            handleRateCourse(course.courseid, star);
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
        </div>
    );
};

export default PastPapers;
