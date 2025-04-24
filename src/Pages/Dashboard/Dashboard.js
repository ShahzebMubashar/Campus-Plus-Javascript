import React, { useState } from 'react';
import './Dashboard.css';

function AcademicDashboard() {
    // State for GPA calculator
    const [courses, setCourses] = useState([
        { name: 'Course 1', credits: 3, grade: 'A' },
        { name: 'Course 2', credits: 4, grade: 'B+' },
        { name: 'Course 3', credits: 3, grade: 'A-' }
    ]);
    const [newCourse, setNewCourse] = useState({ name: '', credits: 3, grade: 'A' });

    // Grade point values
    const gradePoints = {
        'A+': 4.0, 'A': 4.0, 'A-': 3.7,
        'B+': 3.3, 'B': 3.0, 'B-': 2.7,
        'C+': 2.3, 'C': 2.0, 'C-': 1.7,
        'D+': 1.3, 'D': 1.0, 'D-': 0.7,
        'F': 0.0
    };

    // Calculate GPA
    const calculateGPA = () => {
        if (courses.length === 0) return 0;

        let totalPoints = 0;
        let totalCredits = 0;

        courses.forEach(course => {
            totalPoints += course.credits * gradePoints[course.grade];
            totalCredits += course.credits;
        });

        return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
    };

    // Add new course
    const addCourse = () => {
        if (newCourse.name.trim()) {
            setCourses([...courses, { ...newCourse }]);
            setNewCourse({ name: '', credits: 3, grade: 'A' });
        }
    };

    // Remove course
    const removeCourse = (index) => {
        const updatedCourses = [...courses];
        updatedCourses.splice(index, 1);
        setCourses(updatedCourses);
    };

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCourse({ ...newCourse, [name]: name === 'credits' ? parseInt(value) || 0 : value });
    };

    return (
        <div className="academic-dashboard">
            <div className="container">
                <header className="header">
                    <h1>My Dashboard</h1>
                    <div className="search-container">
                        <input type="text" placeholder="Search..." className="search-input" />
                        <button className="search-button"></button>
                    </div>
                </header>

                <div className="divider"></div>

                <section className="courses-section">
                    <div className="section-header">
                        <h2>My courses</h2>
                        <a href="#" className="view-all">View all</a>
                    </div>

                    <div className="courses-grid">
                        <div className="course-card">
                            <div className="course-content">
                                <h3>Cinema 4D</h3>
                                <p>Elements design for web sites and mobile apps</p>
                                <div className="progress-container">
                                    <div className="progress-text">08/12</div>
                                    <div className="progress-bar">
                                        <div className="progress-fill" style={{ width: '66%' }}></div>
                                    </div>
                                </div>
                            </div>
                            <div className="course-arrow">
                                <svg viewBox="0 0 24 24" width="24" height="24">
                                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                                </svg>
                            </div>
                        </div>

                        <div className="course-card">
                            <div className="course-content">
                                <h3>UI/UX Design</h3>
                                <p>From concept to prototype</p>
                                <div className="progress-container">
                                    <div className="progress-text">04/15</div>
                                    <div className="progress-bar">
                                        <div className="progress-fill" style={{ width: '27%' }}></div>
                                    </div>
                                </div>
                            </div>
                            <div className="course-arrow">
                                <svg viewBox="0 0 24 24" width="24" height="24">
                                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                                </svg>
                            </div>
                        </div>

                        <div className="course-card">
                            <div className="course-content">
                                <h3>Graphic design</h3>
                                <p>Digital computer graphics</p>
                                <div className="progress-container">
                                    <div className="progress-text">01/10</div>
                                    <div className="progress-bar">
                                        <div className="progress-fill" style={{ width: '10%' }}></div>
                                    </div>
                                </div>
                            </div>
                            <div className="course-arrow">
                                <svg viewBox="0 0 24 24" width="24" height="24">
                                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                                </svg>
                            </div>
                        </div>

                        <div className="course-card add-card">
                            <div className="add-content">
                                <div className="add-icon">+</div>
                                <div>Add</div>
                            </div>
                        </div>
                    </div>
                </section>
                <div className="bottom-sections">
                    <div className="gpa-calculator-section">
                        <div className="section-header">
                            <h2>GPA Calculator</h2>
                        </div>

                        <div className="gpa-card">
                            <div className="gpa-display">
                                <div className="gpa-circle">
                                    <span className="gpa-value">{calculateGPA()}</span>
                                    <span className="gpa-label">GPA</span>
                                </div>
                            </div>

                            <div className="gpa-courses">
                                <div className="course-list">
                                    {courses.map((course, index) => (
                                        <div key={index} className="course-item">
                                            <div className="course-details">
                                                <span className="course-name">{course.name}</span>
                                                <div className="course-meta">
                                                    <span>{course.credits} credits</span>
                                                    <span className="course-grade">{course.grade}</span>
                                                </div>
                                            </div>
                                            <button
                                                className="remove-course"
                                                onClick={() => removeCourse(index)}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="add-course-form">
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Course name"
                                        value={newCourse.name}
                                        onChange={handleInputChange}
                                        className="course-input"
                                    />
                                    <div className="course-form-row">
                                        <select
                                            name="credits"
                                            value={newCourse.credits}
                                            onChange={handleInputChange}
                                            className="credits-select"
                                        >
                                            {[1, 2, 3, 4, 5].map(credit => (
                                                <option key={credit} value={credit}>{credit} credits</option>
                                            ))}
                                        </select>
                                        <select
                                            name="grade"
                                            value={newCourse.grade}
                                            onChange={handleInputChange}
                                            className="grade-select"
                                        >
                                            {Object.keys(gradePoints).map(grade => (
                                                <option key={grade} value={grade}>{grade}</option>
                                            ))}
                                        </select>
                                        <button className="add-course-btn" onClick={addCourse}>Add</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="chatrooms-section">
                        <div className="section-header">
                            <h2>Chatrooms Joined</h2>
                            <a href="#" className="view-all">View all</a>
                        </div>

                        <div className="chatrooms-list">
                            <div className="chatroom-card">
                                <div className="chatroom-icon">
                                    <svg viewBox="0 0 24 24" width="24" height="24">
                                        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
                                    </svg>
                                </div>
                                <div className="chatroom-info">
                                    <h3>UI/UX Design Group</h3>
                                    <p>32 members • 5 online</p>
                                </div>
                                <div className="chatroom-status active"></div>
                            </div>

                            <div className="chatroom-card">
                                <div className="chatroom-icon">
                                    <svg viewBox="0 0 24 24" width="24" height="24">
                                        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
                                    </svg>
                                </div>
                                <div className="chatroom-info">
                                    <h3>Cinema 4D Beginners</h3>
                                    <p>18 members • 2 online</p>
                                </div>
                                <div className="chatroom-status"></div>
                            </div>

                            <div className="chatroom-card">
                                <div className="chatroom-icon">
                                    <svg viewBox="0 0 24 24" width="24" height="24">
                                        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
                                    </svg>
                                </div>
                                <div className="chatroom-info">
                                    <h3>Graphic Design Portfolio</h3>
                                    <p>45 members • 8 online</p>
                                </div>
                                <div className="chatroom-status active"></div>
                            </div>

                            <div className="chatroom-card add-chatroom">
                                <div className="add-icon">+</div>
                                <span>Join new chatroom</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AcademicDashboard;