import React from 'react';
import './Dashboard.css';

function AcademicDashboard() {
    return (
        <div className="academic-container">
            <div className="sidebar">
                <div className="logo">
                    <div className="logo-circle">
                        <span className="logo-letter">a</span>
                    </div>
                    <span className="logo-text">cademic</span>
                </div>

                <nav className="nav-menu">
                    <div className="nav-item">
                        <div className="nav-icon">
                            <svg viewBox="0 0 24 24" width="24" height="24">
                                <path d="M4 13h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1zm0 8h6a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1zm10-8h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1zm0 8h6a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1z" />
                            </svg>
                        </div>
                        <span>Dashboard</span>
                    </div>

                    <div className="nav-item">
                        <div className="nav-icon">
                            <svg viewBox="0 0 24 24" width="24" height="24">
                                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
                            </svg>
                        </div>
                        <span>Schedule</span>
                    </div>

                    <div className="nav-item active">
                        <div className="nav-icon">
                            <svg viewBox="0 0 24 24" width="24" height="24">
                                <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z" />
                            </svg>
                        </div>
                        <span>My courses</span>
                    </div>

                    <div className="nav-item">
                        <div className="nav-icon">
                            <svg viewBox="0 0 24 24" width="24" height="24">
                                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z" />
                            </svg>
                        </div>
                        <span>Reports</span>
                    </div>

                    <div className="nav-item">
                        <div className="nav-icon">
                            <svg viewBox="0 0 24 24" width="24" height="24">
                                <path d="M12 12.75c1.63 0 3.07.39 4.24.9 1.08.48 1.76 1.56 1.76 2.73V18H6v-1.61c0-1.18.68-2.26 1.76-2.73 1.17-.52 2.61-.91 4.24-.91zM4 13c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm1.13 1.1c-.37-.06-.74-.1-1.13-.1-.99 0-1.93.21-2.78.58C.48 14.9 0 15.62 0 16.43V18h4.5v-1.61c0-.83.23-1.61.63-2.29zM20 13c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4 3.43c0-.81-.48-1.53-1.22-1.85-.85-.37-1.79-.58-2.78-.58-.39 0-.76.04-1.13.1.4.68.63 1.46.63 2.29V18H24v-1.57zM12 6c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z" />
                            </svg>
                        </div>
                        <span>Teams</span>
                    </div>

                    <div className="nav-item">
                        <div className="nav-icon">
                            <svg viewBox="0 0 24 24" width="24" height="24">
                                <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z" />
                            </svg>
                        </div>
                        <span>Library</span>
                    </div>

                    <div className="nav-item">
                        <div className="nav-icon">
                            <svg viewBox="0 0 24 24" width="24" height="24">
                                <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
                            </svg>
                        </div>
                        <span>Settings</span>
                    </div>
                </nav>
            </div>

            <div className="main-content">
                <div className="content-section">
                    <h2>Live broadcasts</h2>
                    <div className="avatars-container">
                        <div className="avatar-item">
                            <img src="/placeholder.svg?height=50&width=50" alt="User" className="avatar" />
                        </div>
                        <div className="avatar-item">
                            <img src="/placeholder.svg?height=50&width=50" alt="User" className="avatar" />
                        </div>
                        <div className="avatar-item">
                            <img src="/placeholder.svg?height=50&width=50" alt="User" className="avatar" />
                        </div>
                        <div className="avatar-item">
                            <img src="/placeholder.svg?height=50&width=50" alt="User" className="avatar" />
                        </div>
                        <div className="avatar-item">
                            <img src="/placeholder.svg?height=50&width=50" alt="User" className="avatar" />
                        </div>
                        <div className="avatar-item">
                            <img src="/placeholder.svg?height=50&width=50" alt="User" className="avatar" />
                        </div>
                        <button className="more-button">More</button>
                    </div>
                </div>

                <div className="search-section">
                    <h2>Search course</h2>
                    <div className="search-container">
                        <div className="search-input-container">
                            <svg className="search-icon" viewBox="0 0 24 24" width="20" height="20">
                                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                            </svg>
                            <input type="text" placeholder="What do you want to learn?" className="search-input" />
                        </div>
                        <button className="search-button">Search</button>
                    </div>
                </div>

                <div className="courses-section">
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
                            <div className="add-icon">+</div>
                            <div>Add</div>
                        </div>
                    </div>
                </div>

                <div className="bottom-sections">
                    <div className="progress-section">
                        <div className="section-header">
                            <h2>My progress</h2>
                        </div>

                        <div className="progress-card">
                            <div className="hours-section">
                                <h3>Total hours spended</h3>
                                <div className="dropdown">
                                    <span>June 2020</span>
                                    <svg viewBox="0 0 24 24" width="24" height="24">
                                        <path d="M7 10l5 5 5-5z" />
                                    </svg>
                                </div>

                                <div className="circular-progress">
                                    <svg viewBox="0 0 100 100" width="150" height="150">
                                        <circle cx="50" cy="50" r="45" fill="none" stroke="#e6e6fa" strokeWidth="10" />
                                        <circle
                                            cx="50"
                                            cy="50"
                                            r="45"
                                            fill="none"
                                            stroke="#4169e1"
                                            strokeWidth="10"
                                            strokeDasharray="283"
                                            strokeDashoffset="100"
                                            transform="rotate(-90 50 50)"
                                        />
                                        <text x="50" y="55" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#4169e1">134</text>
                                    </svg>
                                </div>

                                <div className="user-info">
                                    <img src="/placeholder.svg?height=40&width=40" alt="User" className="user-avatar" />
                                    <div className="user-details">
                                        <div className="user-name">Bessie</div>
                                        <div className="user-role">Designer</div>
                                    </div>
                                </div>
                            </div>

                            <div className="stats-section">
                                <div className="stat-item">
                                    <div className="stat-bar"></div>
                                    <div className="stat-info">
                                        <div className="stat-numbers">
                                            <span className="stat-value">75</span>
                                            <span className="stat-total">/115</span>
                                        </div>
                                        <div className="stat-label">Visited lectures</div>
                                    </div>
                                </div>

                                <div className="stat-item">
                                    <div className="stat-bar"></div>
                                    <div className="stat-info">
                                        <div className="stat-numbers">
                                            <span className="stat-value">32</span>
                                            <span className="stat-total">/94</span>
                                        </div>
                                        <div className="stat-label">Completed tasks</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lectures-section">
                        <div className="section-header">
                            <h2>Popular lections</h2>
                            <a href="#" className="view-all">View all</a>
                        </div>

                        <div className="lectures-list">
                            <div className="lecture-card">
                                <img src="/placeholder.svg?height=60&width=60" alt="Instructor" className="lecture-avatar" />
                                <div className="lecture-info">
                                    <h3>Human centered design</h3>
                                    <div className="lecture-duration">
                                        <svg viewBox="0 0 24 24" width="16" height="16">
                                            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
                                            <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                                        </svg>
                                        <span>1h 30 min</span>
                                    </div>
                                </div>
                                <button className="play-button">
                                    <svg viewBox="0 0 24 24" width="24" height="24">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </button>
                            </div>

                            <div className="lecture-card">
                                <img src="/placeholder.svg?height=60&width=60" alt="Instructor" className="lecture-avatar" />
                                <div className="lecture-info">
                                    <h3>E-learning & digital cultures</h3>
                                    <div className="lecture-duration">
                                        <svg viewBox="0 0 24 24" width="16" height="16">
                                            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
                                            <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                                        </svg>
                                        <span>45 min</span>
                                    </div>
                                </div>
                                <button className="play-button">
                                    <svg viewBox="0 0 24 24" width="24" height="24">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </button>
                            </div>

                            <div className="lecture-card">
                                <img src="/placeholder.svg?height=60&width=60" alt="Instructor" className="lecture-avatar" />
                                <div className="lecture-info">
                                    <h3>SQL: nothing superfluous</h3>
                                    <div className="lecture-duration">
                                        <svg viewBox="0 0 24 24" width="16" height="16">
                                            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
                                            <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                                        </svg>
                                        <span>1h 15 min</span>
                                    </div>
                                </div>
                                <button className="play-button">
                                    <svg viewBox="0 0 24 24" width="24" height="24">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AcademicDashboard;