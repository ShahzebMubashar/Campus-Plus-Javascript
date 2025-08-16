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
      const res = await authenticatedFetch(`${API_BASE_URL}/user/notifications`, {
        method: "GET",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch notifications");
      }

      const data = await res.json();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const res = await authenticatedFetch(
        `${API_BASE_URL}/user/notifications/${notificationId}/read`,
        {
          method: "PUT",
        }
      );

      if (!res.ok) {
        throw new Error("Failed to mark notification as read");
      }

      // Update local state to reflect the read status
      setNotifications(notifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true } 
          : notification
      ));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const res = await authenticatedFetch(
        `${API_BASE_URL}/user/notifications/mark-all-read`,
        {
          method: "PUT",
        }
      );

      if (!res.ok) {
        throw new Error("Failed to mark all notifications as read");
      }

      // Update local state to reflect all notifications as read
      setNotifications(notifications.map(notification => ({
        ...notification,
        isRead: true
      })));
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
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
            {notifications.length > 0 && (
              <button 
                className="mark-all-read-btn"
                onClick={markAllAsRead}
              >
                Mark all as read
              </button>
            )}
          </div>

          {notifications.length > 0 ? (
            <div className="notifications-list">
              {notifications.map((notification, index) => (
                <div
                  key={notification.id || index}
                  className={`notification-card ${notification.isRead ? "read" : "unread"}`}
                  onClick={() => !notification.isRead && markAsRead(notification.id)}
                >
                  <div className="notification-icon">
                    {notification.type === "announcement" && "📢"}
                    {notification.type === "deadline" && "⏰"}
                    {notification.type === "message" && "✉️"}
                    {notification.type === "system" && "⚙️"}
                  </div>
                  <div className="notification-content">
                    <h3 className="notification-title">{notification.title}</h3>
                    <p className="notification-message">{notification.message}</p>
                    <div className="notification-meta">
                      <span className="notification-time">
                        {new Date(notification.createdAt).toLocaleString()}
                      </span>
                      {notification.course && (
                        <span className="notification-course">
                          {notification.course}
                        </span>
                      )}
                    </div>
                  </div>
                  {!notification.isRead && (
                    <div className="unread-indicator"></div>
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