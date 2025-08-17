import React from "react";
import "./Sidebar.css";
import cplogo from "../../../Assets/images/cp_logo.png";
import useProfileUser from "../../../hooks/useProfileUser";
import { Link } from "react-router-dom";

const Sidebar = ({
  rooms,
  joinedRooms,
  activeRoom,
  onRoomSelect,
  isOpen,
  onClose,
  notificationCount = 0, // <-- add this prop
}) => {
  const user = useProfileUser();

  const getUserInitials = () => {
    const displayName = user?.name || user?.username;
    if (!displayName) return "U";
    return displayName
      .split(" ")
      .filter((_, idx, arr) => idx === 0 || idx === arr.length - 1)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getAvatarColor = () => {
    const name = user?.name || user?.username || "";
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
    <div className={`cp-sidebar ${isOpen ? "open" : ""}`}>
      <div className="cp-sidebar-content">
        {/* Brand Section */}
        <div className="brand-section">
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
            }}
          >
            <div className="brand-logo">
              <img src={cplogo} alt="Campus Plus logo" />
            </div>
            <h2
              className="brand-title"
              style={{ marginLeft: 8, color: "#1976d2" }}
            >
              Campus Plus
            </h2>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="sidebar-nav-links">
          <a href="/" className="sidebar-nav-link">
            Home
          </a>
          <a href="/dashboard" className="sidebar-nav-link">
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
            <span className="nav-badge notification-badge">{notificationCount}</span>
          </a>
        </nav>

        {/* Joined Rooms Section */}
        <div className="rooms-section">
          <h3>My Rooms ({joinedRooms?.length || 0})</h3>
          <div className="rooms-list">
            {joinedRooms?.map((room) => (
              <button
                key={room.roomid}
                className={`room-button ${activeRoom?.roomid === room.roomid ? "active" : ""}`}
                onClick={() => {
                  onRoomSelect(room);
                  if (window.innerWidth <= 768 && onClose) {
                    onClose();
                  }
                }}
              >
                {room.roomname}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* User Profile Section at Bottom */}
      <div className="cp-sidebar-user-profile">
        <div className="cp-sidebar-user-profile-content">
          <div
            className="cp-sidebar-user-avatar"
            style={{
              backgroundColor: getAvatarColor(),
              color: "#fff", // <-- ensure initials are white
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              fontSize: "1.0rem",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "1px",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              cursor: "default",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
              border: "3px solid white",
            }}
          >
            {getUserInitials()}
          </div>
          <div className="cp-sidebar-user-info">
            <span className="cp-sidebar-username">
              {user?.name || user?.username || "Guest"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
