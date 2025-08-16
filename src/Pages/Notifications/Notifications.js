import React, { useEffect, useState } from "react";
import "./Notifications.css";
import Navbar from "../Index/components/Navbar";
import BlurLoginPrompt from "../BlurLoginPrompt.js";
import API_BASE_URL from "../../config/api.js";
import { authenticatedFetch, isAuthenticated as checkAuth } from "../../utils/auth";

function Notifications() {
    const [user, setUser] = useState({
        fullName: "",
        email: "",
        rollNumber: "",
        isAdmin: false,
    });

    const [notifications, setNotifications] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAuthLoading, setIsAuthLoading] = useState(true);
    const [showGenerateForm, setShowGenerateForm] = useState(false);
    const [newNotification, setNewNotification] = useState({
        title: "",
        message: "",
        type: "announcement",
        course: ""
    });

    const fetchUserInfo = async () => {
        try {
            const res = await authenticatedFetch(`${API_BASE_URL}/user/profile`, {
                method: "GET",
            });

            if (!res.ok) {
                throw new Error("Failed to Fetch User Information");
            }

            const data = await res.json();
            setUser({
                ...data,
                isAdmin: data.role === "admin" || data.role === "Admin",
            });
        } catch (error) {
            console.log("Error fetching User Info", error);
        }
    };

    const fetchNotifications = async () => {
        try {
            const res = await authenticatedFetch(`${API_BASE_URL}/notifications`, {
                method: "GET",
            });

            if (!res.ok) {
                throw new Error("Failed to fetch notifications");
            }

            const data = await res.json();
            setNotifications(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching notifications:", error);
            setNotifications([]);
        }
    };

    const deleteNotification = async (notificationId) => {
        console.log("Deleting notification with ID:", notificationId);
        try {
            const res = await authenticatedFetch(
                `${API_BASE_URL}/notifications/delete/${notificationId}`,
                { method: "DELETE" }
            );

            if (!res.ok) throw new Error("Failed to delete notification");

            setNotifications(prevNotifications =>
                prevNotifications.filter(n => n.notificationid !== notificationId)
            );
        } catch (error) {
            console.error("Error deleting notification:", error);
            alert("Failed to delete notification");
        }
    };


    const handleGenerateNotification = async () => {
        try {
            const res = await authenticatedFetch(
                `${API_BASE_URL}/notifications/generate`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        title: newNotification.title,
                        notification: newNotification.message,
                    }),
                }
            );

            if (!res.ok) throw new Error("Failed to generate notification");

            await fetchNotifications();

            setShowGenerateForm(false);
            setNewNotification({
                title: "",
                message: "",
                type: "announcement",
                course: ""
            });
        } catch (error) {
            console.error("Error generating notification:", error);
            alert("Failed to generate notification");
        }
    };



    useEffect(() => {
        const checkAuthAndFetchData = async () => {
            try {
                if (checkAuth()) {
                    setIsAuthenticated(true);
                    await fetchUserInfo();
                    await fetchNotifications();
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error("Auth check error:", error);
                setIsAuthenticated(false);
            } finally {
                setIsAuthLoading(false);
            }
        };

        checkAuthAndFetchData();
    }, []);

    if (isAuthLoading) {
        return <div className="loading">Loading...</div>;
    }

    if (!isAuthenticated) {
        return (
            <>
                <Navbar />
                <BlurLoginPrompt
                    message="Notifications Access Required"
                    subMessage="Please sign in to view your notifications."
                    buttonText="Sign In"
                />
            </>
        );
    }

    return (
        <div className="notifications-page">
            <Navbar />

            <div className="notifications-container">
                <section className="user-profile-section">
                    <div
                        className="profile-picture"
                        style={{
                            backgroundColor: user.isAdmin ? "#8b5cf6" : "#3b82f6",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                            fontSize: "2.5rem",
                            fontWeight: "bold",
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                        }}
                    >
                        {user.fullName
                            ? user.fullName
                                .split(" ")
                                .filter((_, index, array) => index === 0 || index === array.length - 1)
                                .map((name) => name[0])
                                .join("")
                                .toUpperCase()
                            : "U"}
                    </div>
                    <div className="user-info">
                        <h1 className="user-name">
                            {user?.fullName || user?.username || "Loading..."}
                        </h1>
                        <h5 className="user-name-username">
                            @{user?.username || "Loading..."}
                        </h5>
                        <div className="user-details">
                            <div className="user-detail-item">
                                <span className="user-detail-icon">📧</span>
                                <span>{user?.email || "Loading..."}</span>
                            </div>
                            {user?.rollNumber && (
                                <div className="user-detail-item">
                                    <span className="user-detail-icon">🎓</span>
                                    <span>Roll No: {user.rollNumber}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <section className="notifications-section">
                    <div className="section-header">
                        <h2>🔔 Notifications</h2>
                        {user.isAdmin && (
                            <button
                                className="mark-all-read-btn"
                                style={{ backgroundColor: "#10b981" }}
                                onClick={() => setShowGenerateForm(!showGenerateForm)}
                            >
                                {showGenerateForm ? "Cancel" : "Generate Notification"}
                            </button>
                        )}
                    </div>

                    {showGenerateForm && user.isAdmin && (
                        <div className="notification-card" style={{ marginBottom: "20px" }}>
                            <div className="notification-content">
                                <h3 className="notification-title">Create New Notification</h3>
                                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                                    <div>
                                        <label style={{ display: "block", marginBottom: "5px", color: "#4b5563", fontSize: "14px" }}>Title</label>
                                        <input
                                            type="text"
                                            value={newNotification.title}
                                            onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                                            style={{
                                                width: "100%",
                                                padding: "10px",
                                                borderRadius: "8px",
                                                border: "1px solid #e5e7eb",
                                                fontSize: "14px"
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: "block", marginBottom: "5px", color: "#4b5563", fontSize: "14px" }}>Message</label>
                                        <textarea
                                            value={newNotification.message}
                                            onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                                            style={{
                                                width: "100%",
                                                padding: "10px",
                                                borderRadius: "8px",
                                                border: "1px solid #e5e7eb",
                                                fontSize: "14px",
                                                minHeight: "100px"
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: "block", marginBottom: "5px", color: "#4b5563", fontSize: "14px" }}>Type</label>
                                        <select
                                            value={newNotification.type}
                                            onChange={(e) => setNewNotification({ ...newNotification, type: e.target.value })}
                                            style={{
                                                width: "100%",
                                                padding: "10px",
                                                borderRadius: "8px",
                                                border: "1px solid #e5e7eb",
                                                fontSize: "14px"
                                            }}
                                        >
                                            <option value="announcement">Announcement</option>
                                            <option value="deadline">Deadline</option>
                                            <option value="message">Message</option>
                                            <option value="system">System</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: "block", marginBottom: "5px", color: "#4b5563", fontSize: "14px" }}>Course (optional)</label>
                                        <input
                                            type="text"
                                            value={newNotification.course}
                                            onChange={(e) => setNewNotification({ ...newNotification, course: e.target.value })}
                                            style={{
                                                width: "100%",
                                                padding: "10px",
                                                borderRadius: "8px",
                                                border: "1px solid #e5e7eb",
                                                fontSize: "14px"
                                            }}
                                        />
                                    </div>
                                    <button
                                        className="mark-all-read-btn"
                                        onClick={handleGenerateNotification}
                                        disabled={!newNotification.title || !newNotification.message}
                                        style={{ alignSelf: "flex-end" }}
                                    >
                                        Send Notification
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {notifications.length > 0 ? (
                        <div className="notifications-list">
                            {notifications.map((notification, index) => (
                                <div
                                    key={notification.id || index}
                                    className="notification-card"
                                >
                                    <div className="notification-icon">
                                        {notification.type === "announcement" && "📢"}
                                        {notification.type === "deadline" && "⏰"}
                                        {notification.type === "message" && "✉️"}
                                        {notification.type === "system" && "⚙️"}
                                    </div>
                                    <div className="notification-content">
                                        <h3 className="notification-title">{notification.title}</h3>
                                        <p className="notification-message">
                                            {notification.notification || notification.message}
                                        </p>
                                        <div className="notification-meta">
                                            <span className="notification-time">
                                                {new Date(notification.createdAt || notification.posted_at).toLocaleString()}
                                            </span>
                                            {notification.course && (
                                                <span className="notification-course">
                                                    {notification.course}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {user.isAdmin && (
                                        <button
                                            className="delete-notification-btn"
                                            onClick={() => deleteNotification(notification.notificationid)}
                                        >
                                            🗑️
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-notifications">
                            <div className="empty-state-icon">🔕</div>
                            <h3>No notifications yet</h3>
                            <p>When you get notifications, they'll appear here</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

export default Notifications;