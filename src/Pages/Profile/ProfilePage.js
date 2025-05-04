import React, { useEffect, useState } from "react";
import "./ProfilePage.css";
import Navbar from "../Index/components/Navbar";

function ProfilePage() {
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    rollNumber: "",
    program: "",
    batch: "",
    gpa: "",
    enrolledCourses: [],
    notifications: [],
  });

  const [currentCourses, setCurrentCourses] = useState({});

  const fetchCurrentCourses = async () => {
    try {
      const res = await fetch("http://localhost:4000/user/current-courses", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to Fetch Current Courses");
      }

      const data = await res.json();

      setUser((prevUser) => ({
        ...prevUser,
        enrolledCourses: data,
      }));
    } catch (error) {
      console.log("Error: Failed to fetch current COurses");
    }
  };

  const fetchUserInfo = async () => {
    try {
      const res = await fetch("http://localhost:4000/user/profile", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to Fetch User Information");
      }

      const data = await res.json();
      setUser(data);
    } catch (error) {
      console.log("Error fetching User Info", error);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  useEffect(() => {
    fetchCurrentCourses();
  }, [user?.userid]);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [editForm, setEditForm] = useState({ ...user });
  const [passwordForm, setPasswordForm] = useState({
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Update editForm when user data changes
  useEffect(() => {
    setEditForm({ ...user });
  }, [user]);

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: value,
    });
  };

  const handleEditFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:4000/user/profile", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editForm.name,
          degree: editForm.degree,
          batch: editForm.batch,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      fetchUserInfo();
      setShowEditModal(false);
    } catch (error) {
      console.error("Update error:", error);
      alert(error.message || "Failed to update profile");
    }
  };

  const handlePasswordFormChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({
      ...passwordForm,
      [name]: value,
    });
  };

  const triggerForgotPassword = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:4000/auth/forgot", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        alert("OTP has been sent to your email!");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Error requesting OTP:", error);
      alert("An error occurred while requesting OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:4000/auth/reset", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          OTP: passwordForm.otp,
          newPassword: passwordForm.newPassword,
        }),
      });

      if (response.ok) {
        alert("Password changed successfully!");
        setShowPasswordModal(false);
        setPasswordForm({
          otp: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to change password");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      alert("An error occurred while changing password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingsChange = (e) => {
    e.preventDefault();
    alert("Settings updated successfully!");
    setShowSettingsModal(false);
  };

  return (
    <div className="lms-profile-root">
      <Navbar />
      <div className="lms-profile-container">
        <div className="lms-profile-header">
          <h1>Student Profile</h1>
          <div className="lms-action-buttons">
            <button
              className="lms-btn lms-primary"
              onClick={() => setShowEditModal(true)}
            >
              Edit Profile
            </button>
            <button
              className="lms-btn lms-secondary"
              onClick={() => setShowPasswordModal(true)}
            >
              Change Password
            </button>
            <button
              className="lms-btn lms-secondary"
              onClick={() => (window.location.href = "/transcript")}
            >
              View Transcript
            </button>
            <button
              className="lms-btn lms-secondary"
              onClick={() => setShowSettingsModal(true)}
            >
              Settings
            </button>
          </div>
        </div>

        <div className="lms-profile-content">
          <div className="lms-profile-card lms-main-info">
            <div className="lms-profile-avatar-container">
              <div className="lms-profile-avatar">
                <div className="lms-profile-avatar">
                  {user.name
                    ? user.name
                        .split(" ")
                        .filter(
                          (_, index, array) =>
                            index === 0 || index === array.length - 1
                        ) // Take first and last
                        .map((name) => name[0])
                        .join("")
                    : "U"}
                </div>
              </div>
            </div>
            <div className="lms-user-details">
              <h2>{user.name || "Loading..."}</h2>
              <p>
                <span className="lms-label">Email:</span> {user.email || "N/A"}
              </p>
              <p>
                <span className="lms-label">Roll Number:</span>{" "}
                {user.rollnumber || "N/A"}
              </p>
              <p>
                <span className="lms-label">Program:</span>{" "}
                {user.degree || "N/A"}
              </p>
              <p>
                <span className="lms-label">Batch:</span>{" "}
                {user.batch || "N/A"}
              </p>
              <p>
                <span className="lms-label">GPA:</span> {user.gpa || "N/A"}
              </p>
            </div>
          </div>

          <div className="lms-profile-card lms-enrolled-courses">
            <h3>Enrolled Courses</h3>
            {user.enrolledCourses && user.enrolledCourses.length > 0 ? (
              <ul className="lms-course-list">
                {user.enrolledCourses.map((course) => (
                  <li key={course.id} className="lms-course-item">
                    <span className="lms-course-code">{course.coursecode}</span>
                    <span className="lms-course-name">{course.coursename}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No courses enrolled</p>
            )}
          </div>

          <div className="lms-profile-card lms-notifications">
            <h3>Notifications</h3>
            {user.notifications && user.notifications.length > 0 ? (
              <ul className="lms-notification-list">
                {user.notifications.map((notification) => (
                  <li key={notification.id} className="lms-notification-item">
                    <p className="lms-notification-message">
                      {notification.message}
                    </p>
                    <p className="lms-notification-date">{notification.date}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No notifications</p>
            )}
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
                    name="name"
                    value={editForm.name || ""}
                    onChange={handleEditFormChange}
                  />
                </div>
                <div className="lms-form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editForm.email || ""}
                    onChange={handleEditFormChange}
                  />
                </div>
                <div className="lms-form-group">
                  <label>Program</label>
                  <input
                    type="text"
                    name="degree"
                    value={editForm.degree || ""}
                    onChange={handleEditFormChange}
                  />
                </div>
                <div className="lms-form-group">
                  <label>Batch</label>
                  <input
                    type="text"
                    name="batch"
                    value={editForm.batch || ""}
                    onChange={handleEditFormChange}
                  />
                </div>
                <div className="lms-modal-actions">
                  <button type="submit" className="lms-btn lms-primary">
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="lms-btn lms-secondary"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </button>
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
                  <label>OTP</label>
                  <input
                    type="number"
                    name="otp"
                    value={passwordForm.otp}
                    onChange={handlePasswordFormChange}
                    placeholder="123456"
                  />
                  <button
                    type="button"
                    className="lms-btn lms-secondary lms-small-btn"
                    onClick={triggerForgotPassword}
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending..." : "Request OTP"}
                  </button>
                </div>
                <div className="lms-form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordFormChange}
                  />
                </div>
                <div className="lms-form-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordFormChange}
                  />
                </div>
                <div className="lms-modal-actions">
                  <button
                    type="submit"
                    className="lms-btn lms-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? "Processing..." : "Change Password"}
                  </button>
                  <button
                    type="button"
                    className="lms-btn lms-secondary"
                    onClick={() => setShowPasswordModal(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
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
                    <input
                      type="checkbox"
                      id="email-notifications"
                      defaultChecked
                    />
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
                  <button type="submit" className="lms-btn lms-primary">
                    Save Settings
                  </button>
                  <button
                    type="button"
                    className="lms-btn lms-secondary"
                    onClick={() => setShowSettingsModal(false)}
                  >
                    Cancel
                  </button>
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
