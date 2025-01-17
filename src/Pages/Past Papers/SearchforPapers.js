import React from "react";
import "./SearchforPapers.css";
import { FaSearch, FaFileAlt, FaYoutube } from "react-icons/fa";

const SearchForPapers = ({ courses }) => {
    return (
        <section className="search-for-papers">
            <h2>
                Search for <span className="highlighted">Courses</span>
            </h2>
            <div className="search-bar">
                <input type="text" placeholder="Search Here" />
                <button>
                    <FaSearch />
                </button>
            </div>
            <div className="papers-grid">
                {courses.map((course, index) => (
                    <div key={index} className="paper-card">
                        <div className="difficulty-tag">Difficulty: {course.difficulty}</div>
                        <h3>
                            {course.coursename} <span>({course.coursecode})</span>
                        </h3>
                        <p>Credits: {course.credits}</p>
                        <p>Grading: {course.grading}</p>
                        <p>Rating: {course.rating ? course.rating.toFixed(2) : "No ratings yet"}</p>
                        <div className="icons">
                            <FaFileAlt className="icon" />
                            <FaYoutube className="icon" />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default SearchForPapers;
