import React, { useState } from 'react';
import './ProfilePage.css';

function ProfilePage() {
    // Sample user data - in a real app, this would come from an API
    const [user, setUser] = useState({
        fullName: 'John Doe',
        email: 'john.doe@university.edu',
        rollNumber: 'UNI2023001',
        program: 'Computer Science',
        semester: '3rd Semester',
        gpa: '3.8',
        enrolledCourses: [
            { id: 1, name: 'Data Structures', code: 'CS201' },
            { id: 2, name: 'Database Systems', code: 'CS202' },
            { id: 3, name: 'Web Development', code: 'CS203' }
        ],
        notifications: [
            { id: 1, message: 'Assignment due for CS201', date: '2023-10-15' },
            { id: 2, message: 'Midterm exam schedule published', date: '2023-10-10' }
        ]
    });

    // State for modal visibility
    const [showEditModal, setShowEditModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);

    // Form state for edit profile
    const [editForm, setEditForm] = useState({ ...user });

    // Handle edit profile form changes
    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditForm({
            ...editForm,
            [name]: value
        });
    };

    // Handle edit profile form submission
    const handleEditFormSubmit = (e) => {
        e.preventDefault();
        setUser({ ...editForm });
        setShowEditModal(false);
    };

    // Handle password change (simplified)
    const handlePasswordChange = (e) => {
        e.preventDefault();
        // In a real app, this would call an API to change the password
        alert('Password changed successfully!');
        setShowPasswordModal(false);
    };

    // Handle settings change (simplified)
    const handleSettingsChange = (e) => {
        e.preventDefault();
        // In a real app, this would update user settings
        alert('Settings updated successfully!');
        setShowSettingsModal(false);
    };

    return (
        <div className="lms-profile-root">
            <div className="lms-profile-container">
                <div className="lms-profile-header">
                    <h1>Student Profile</h1>
                    <div className="lms-action-buttons">
                        <button className="lms-btn lms-primary" onClick={() => setShowEditModal(true)}>Edit Profile</button>
                        <button className="lms-btn lms-secondary" onClick={() => setShowPasswordModal(true)}>Change Password</button>
                        <button className="lms-btn lms-secondary" onClick={() => setShowSettingsModal(true)}>Settings</button>
                    </div>
                </div>

                <div className="lms-profile-content">
                    <div className="lms-profile-card lms-main-info">
                        <div className="lms-profile-avatar-container">
                            <div className="lms-profile-avatar">
                                {user.fullName.split(' ').map(name => name[0]).join('')}
                            </div>
                        </div>
                        <div className="lms-user-details">
                            <h2>{user.fullName}</h2>
                            <p><span className="lms-label">Email:</span> {user.email}</p>
                            <p><span className="lms-label">Roll Number:</span> {user.rollNumber}</p>
                            <p><span className="lms-label">Program:</span> {user.program}</p>
                            <p><span className="lms-label">Semester:</span> {user.semester}</p>
                            <p><span className="lms-label">GPA:</span> {user.gpa}</p>
                        </div>
                    </div>

                    <div className="lms-profile-card lms-enrolled-courses">
                        <h3>Enrolled Courses</h3>
                        <ul className="lms-course-list">
                            {user.enrolledCourses.map(course => (
                                <li key={course.id} className="lms-course-item">
                                    <span className="lms-course-code">{course.code}</span>
                                    <span className="lms-course-name">{course.name}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lms-profile-card lms-notifications">
                        <h3>Notifications</h3>
                        <ul className="lms-notification-list">
                            {user.notifications.map(notification => (
                                <li key={notification.id} className="lms-notification-item">
                                    <p className="lms-notification-message">{notification.message}</p>
                                    <p className="lms-notification-date">{notification.date}</p>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lms-profile-card lms-quick-links">
                        <h3>Quick Links</h3>
                        <div className="lms-links-grid">
                            <div className="lms-link-item">
                                <span className="lms-link-icon">📚</span>
                                <span className="lms-link-text">My Courses</span>
                            </div>
                            <div className="lms-link-item">
                                <span className="lms-link-icon">📝</span>
                                <span className="lms-link-text">Assignments</span>
                            </div>
                            <div className="lms-link-item">
                                <span className="lms-link-icon">📊</span>
                                <span className="lms-link-text">Grades</span>
                            </div>
                            <div className="lms-link-item">
                                <span className="lms-link-icon">📅</span>
                                <span className="lms-link-text">Calendar</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Profile Modal */}
                {showEditModal && (
                    <div className="lms-modal-overlay">
                        <div className="lms-modal">
                            <h2>Edit Profile</h2>
                            <form onSubmit={handleEditFormSubmit}>
                                <div className="lms-form-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={editForm.fullName}
                                        onChange={handleEditFormChange}
                                    />
                                </div>
                                <div className="lms-form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={editForm.email}
                                        onChange={handleEditFormChange}
                                    />
                                </div>
                                <div className="lms-form-group">
                                    <label>Program</label>
                                    <input
                                        type="text"
                                        name="program"
                                        value={editForm.program}
                                        onChange={handleEditFormChange}
                                    />
                                </div>
                                <div className="lms-form-group">
                                    <label>Semester</label>
                                    <input
                                        type="text"
                                        name="semester"
                                        value={editForm.semester}
                                        onChange={handleEditFormChange}
                                    />
                                </div>
                                <div className="lms-modal-actions">
                                    <button type="submit" className="lms-btn lms-primary">Save Changes</button>
                                    <button type="button" className="lms-btn lms-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Change Password Modal */}
                {showPasswordModal && (
                    <div className="lms-modal-overlay">
                        <div className="lms-modal">
                            <h2>Change Password</h2>
                            <form onSubmit={handlePasswordChange}>
                                <div className="lms-form-group">
                                    <label>Current Password</label>
                                    <input type="password" name="currentPassword" />
                                </div>
                                <div className="lms-form-group">
                                    <label>New Password</label>
                                    <input type="password" name="newPassword" />
                                </div>
                                <div className="lms-form-group">
                                    <label>Confirm New Password</label>
                                    <input type="password" name="confirmPassword" />
                                </div>
                                <div className="lms-modal-actions">
                                    <button type="submit" className="lms-btn lms-primary">Change Password</button>
                                    <button type="button" className="lms-btn lms-secondary" onClick={() => setShowPasswordModal(false)}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Settings Modal */}
                {showSettingsModal && (
                    <div className="lms-modal-overlay">
                        <div className="lms-modal">
                            <h2>Settings</h2>
                            <form onSubmit={handleSettingsChange}>
                                <div className="lms-form-group">
                                    <label>Email Notifications</label>
                                    <div className="lms-toggle-switch">
                                        <input type="checkbox" id="email-notifications" defaultChecked />
                                        <label htmlFor="email-notifications"></label>
                                    </div>
                                </div>
                                <div className="lms-form-group">
                                    <label>SMS Notifications</label>
                                    <div className="lms-toggle-switch">
                                        <input type="checkbox" id="sms-notifications" />
                                        <label htmlFor="sms-notifications"></label>
                                    </div>
                                </div>
                                <div className="lms-form-group">
                                    <label>Language</label>
                                    <select defaultValue="english">
                                        <option value="english">English</option>
                                        <option value="spanish">Spanish</option>
                                        <option value="french">French</option>
                                    </select>
                                </div>
                                <div className="lms-modal-actions">
                                    <button type="submit" className="lms-btn lms-primary">Save Settings</button>
                                    <button type="button" className="lms-btn lms-secondary" onClick={() => setShowSettingsModal(false)}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProfilePage;