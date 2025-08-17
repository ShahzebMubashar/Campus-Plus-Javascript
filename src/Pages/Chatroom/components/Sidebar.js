import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import cplogo from "../../../Assets/images/cp_logo.png";
import API_BASE_URL from "../../../config/api.js";
import { authenticatedFetch } from "../../../utils/auth";

const Sidebar = ({
  rooms,
  joinedRooms,
  activeRoom,
  onRoomSelect,
  isOpen,
  onClose,
}) => {
  // Always fetch latest user info on mount
  const [finalUserInfo, setFinalUserInfo] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await authenticatedFetch(
          `${API_BASE_URL}/user/profile`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch user info");
        const data = await res.json();
        setFinalUserInfo(data);
        localStorage.setItem("user", JSON.stringify(data));
      } catch (error) {
        // fallback to localStorage if fetch fails
      }
    };
    fetchUserInfo();
  }, []);

  // Get initials (same as ProfilePage)
  const getUserInitials = () => {
    const displayName = finalUserInfo?.name || finalUserInfo?.username;
    if (!displayName) return "U";
    return displayName
      .split(" ")
      .filter((_, idx, arr) => idx === 0 || idx === arr.length - 1)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Get avatar color (same as ProfilePage)
  const getAvatarColor = () => {
    const name = finalUserInfo?.name || finalUserInfo?.username || "";
    if (!name) return "#1a73e8";
    const colors = [
      "#1a73e8",
      "#4285f4",
      "#0d47a1",
      "#3367d6",
      "#4e6cef",
      "#3742fa",
      "#1e3799",
      "#0077c2",
      "#0097e6",
      "#00a8ff",
    ];
    const charSum = name.split("").reduce((sum, c) => sum + c.charCodeAt(0), 0);
    return colors[charSum % colors.length];
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      {/* Brand Section */}
      <div className="brand-section">
        <div className="brand-logo">
          <img src={cplogo} alt="Campus Plus logo" />
        </div>
        <h2 className="brand-title">Campus Plus</h2>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav-links">
        <a href="/" className="sidebar-nav-link">
          Dashboard
        </a>
        <a href="/chatroom" className="sidebar-nav-link active">
          Chatrooms
          <span className="nav-badge">{joinedRooms?.length || 0}</span>
        </a>
        <a href="/profile" className="sidebar-nav-link">
          Profile
        </a>
        <a href="/notifications" className="sidebar-nav-link">
          Notifications
          <span className="nav-badge notification-badge">3</span>
        </a>
      </nav>

      {/* Joined Rooms Section */}
      <div className="rooms-section">
        <h3>My Rooms ({joinedRooms?.length || 0})</h3>
        <div className="rooms-list">
          {joinedRooms?.map((room) => (
            <button
              key={room.roomid}
              className={`room-button ${activeRoom?.roomid === room.roomid ? "active" : ""
                }`}
              onClick={() => {
                onRoomSelect(room);
                if (window.innerWidth <= 768 && onClose) onClose();
              }}
            >
              {room.roomname}
            </button>
          ))}
        </div>
      </div>

      {/* User Profile Section */}
      <div className="user-profile-section">
        <div className="user-profile-content">
          <div
            className="user-avatar"
            style={{
              backgroundColor: getAvatarColor(),
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              fontSize: "1.0rem",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "1px",
              transition: "transform 0.3s ease, boxShadow 0.3s ease",
              cursor: "default",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
              border: "3px solid white",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.2)";
            }}
          >
            {getUserInitials()}
          </div>
          <div className="user-info">
            <span className="username">
              {finalUserInfo?.name || finalUserInfo?.username || "Guest"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
