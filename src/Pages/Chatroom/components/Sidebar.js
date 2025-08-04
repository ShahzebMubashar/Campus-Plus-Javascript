import React from "react";
import "./Sidebar.css";
import cplogo from "../../../Assets/images/cp_logo.png"; // Adjust the path as necessary

const Sidebar = ({
  userInfo,
  rooms,
  joinedRooms,
  activeRoom,
  onRoomSelect,
  isOpen,
  onClose,
}) => {
  // Debug log
  console.log("Sidebar isOpen:", isOpen);
  // Function to get initials from username
  const getInitials = (name) => {
    if (!name) return "U";

    return name
      .split(" ")
      .filter((_, index, array) => index === 0 || index === array.length - 1)
      .map((name) => name[0])
      .join("")
      .toUpperCase();
  };

  // Function to generate a background color based on the name
  const getAvatarColor = (name) => {
    if (!name) return "#1a73e8"; // Default color

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

    // Sum the character codes to get a deterministic but unique color
    const charSum = name
      .split("")
      .reduce((sum, char) => sum + char.charCodeAt(0), 0);

    return colors[charSum % colors.length];
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      {/* Brand Section */}
      <div className="brand-section">
        <div className="brand-logo"><img src={cplogo} alt="Campus Plus logo"></img></div>
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
              className={`room-button ${activeRoom?.roomid === room.roomid ? "active" : ""}`}
              onClick={() => {
                onRoomSelect(room);
                // Close sidebar on mobile after room selection
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

      {/* User Profile Section at Bottom */}
      <div className="user-profile-section">
        <div className="user-profile-content">
          <div
            className="user-avatar"
            style={{ backgroundColor: getAvatarColor(userInfo?.username) }}
          >
            {getInitials(userInfo?.username)}
          </div>
          <div className="user-info">
            <span className="username">{userInfo?.username || "Guest"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
