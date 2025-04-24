import React, { useState } from 'react';
import './Dashboard.css';
import Navbar from '../Index/components/Navbar';

function AcademicDashboard() {
    const [courses, setCourses] = useState([
        { name: 'Course 1', credits: 3, grade: 'A' },
        { name: 'Course 2', credits: 4, grade: 'B+' },
        { name: 'Course 3', credits: 3, grade: 'A-' }
    ]);
    const [newCourse, setNewCourse] = useState({ name: '', credits: 3, grade: 'A' });

    const gradePoints = {
        'A+': 4.0, 'A': 4.0, 'A-': 3.7,
        'B+': 3.3, 'B': 3.0, 'B-': 2.7,
        'C+': 2.3, 'C': 2.0, 'C-': 1.7,
        'D+': 1.3, 'D': 1.0, 'D-': 0.7,
        'F': 0.0
    };

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

    const addCourse = () => {
        if (newCourse.name.trim()) {
            setCourses([...courses, { ...newCourse }]);
            setNewCourse({ name: '', credits: 3, grade: 'A' });
        }
    };

    const removeCourse = (index) => {
        const updatedCourses = [...courses];
        updatedCourses.splice(index, 1);
        setCourses(updatedCourses);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCourse({ ...newCourse, [name]: name === 'credits' ? parseInt(value) || 0 : value });
    };

    return (
        <div className="academic-dashboard">
            <Navbar />
            <div className="container">
                {/* Top Header */}
                <header className="header">
                    <section className="header live-broadcasts-header">
                        <h2>Live broadcasts</h2>
                        <div className="live-broadcasts">
                            {['p1', 'p2', 'p3', 'p4', 'p5', 'p6'].map((person, i) => (
                                <div key={i} className="avatar-wrapper">
                                    <img
                                        src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? 'women' : 'men'}/${i + 10}.jpg`}
                                        alt="live"
                                        className="avatar-image"
                                    />
                                </div>
                            ))}
                            <button className="more-button">More</button>
                        </div>
                    </section>

                    <div className="search-wrapper">
                        <div className="search-input-wrapper">
                            <span className="search-icon">🔍</span>
                            <input
                                type="text"
                                className="pretty-search-input"
                                placeholder="What do you want to learn?"
                            />
                        </div>
                        <button className="pretty-search-button">Search</button>
                    </div>

                </header>

                <div className="divider"></div>

                {/* My Courses */}
                <section className="courses-section">
                    <div className="section-header">
                        <h2>📘 My Courses</h2>
                        <a href="#" className="view-all">View all</a>
                    </div>

                    <div className="courses-grid">
                        {[
                            { title: 'Cinema 4D', desc: 'Elements design for websites and apps', progress: '08/12', percent: 66 },
                            { title: 'UI/UX Design', desc: 'From concept to prototype', progress: '04/15', percent: 27 },
                            { title: 'Graphic Design', desc: 'Digital computer graphics', progress: '01/10', percent: 10 }
                        ].map((course, i) => (
                            <div className="course-card" key={i}>
                                <div className="course-content">
                                    <h3>{course.title}</h3>
                                    <p>{course.desc}</p>
                                    <div className="progress-container">
                                        <div className="progress-text">{course.progress}</div>
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{ width: `${course.percent}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="course-arrow">
                                    <svg viewBox="0 0 24 24">
                                        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                                    </svg>
                                </div>
                            </div>
                        ))}

                        <div className="course-card add-card">
                            <div className="add-content">
                                <div className="add-icon">+</div>
                                <div>Add</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Bottom Sections */}
                <div className="bottom-sections">
                    {/* GPA Section */}
                    <div className="gpa-calculator-section">
                        <div className="section-header">
                            <h2>🎓 GPA Calculator</h2>
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
                                            <button className="remove-course" onClick={() => removeCourse(index)}>×</button>
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

                    {/* Chatrooms Section */}
                    <div className="chatrooms-section">
                        <div className="section-header">
                            <h2>💬 Chatrooms Joined</h2>
                            <a href="#" className="view-all">View all</a>
                        </div>

                        <div className="chatrooms-list">
                            {[
                                { title: "UI/UX Design Group", members: 32, online: 5, active: true },
                                { title: "Cinema 4D Beginners", members: 18, online: 2, active: false },
                                { title: "Graphic Design Portfolio", members: 45, online: 8, active: true }
                            ].map((room, i) => (
                                <div className="chatroom-card" key={i}>
                                    <div className="chatroom-icon">
                                        <svg viewBox="0 0 24 24">
                                            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
                                        </svg>
                                    </div>
                                    <div className="chatroom-info">
                                        <h3>{room.title}</h3>
                                        <p>{room.members} members • {room.online} online</p>
                                    </div>
                                    <div className={`chatroom-status ${room.active ? 'active' : ''}`}></div>
                                </div>
                            ))}

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
