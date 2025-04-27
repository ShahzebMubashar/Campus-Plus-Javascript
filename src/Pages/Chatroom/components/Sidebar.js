import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ room, onBack, onLeave }) => {
    const navigate = useNavigate();

    const handleLeaveRoom = () => {
        if (onLeave) {
            onLeave();
        }
    };

    return (
        <div className="sidebar">
            {/* Profile Section */}
            <div className="profile-section">
                <div className="profile-content">
                    <div className="avatar">
                        <img
                            src={`https://ui-avatars.com/api/?name=User&background=2196f3&color=fff`}
                            alt="User Avatar"
                        />
                    </div>
                    <div className="profile-info">
                        <h3>Welcome Back</h3>
                        <p>Campus+ Member</p>
                    </div>
                </div>
            </div>

            {/* Navigation Links */}
            <div className="sidebar-nav-links">
                <a href="/profile" className="sidebar-nav-link">
                    👤 Profile
                </a>
                <a href="/settings" className="sidebar-nav-link">
                    ⚙️ Settings
                </a>
                <a href="/notifications" className="sidebar-nav-link">
                    🔔 Notifications
                </a>
            </div>

            {/* Groups Navigation */}
            <div className="groups-section">
                <h3>Groups</h3>
                <div className="groups-buttons">
                    <button
                        onClick={() => navigate('/chatroom')}
                        className="group-button"
                    >
                        🌐 All Groups
                    </button>
                    <button
                        onClick={() => navigate('/chatroom/my-groups')}
                        className="group-button"
                    >
                        👥 My Groups
                    </button>
                </div>
            </div>

            {/* Room Info */}
            {room && (
                <div className="room-info">
                    <div className="room-avatar">
                        <img
                            src={`https://ui-avatars.com/api/?name=${room.roomname}&background=2196f3&color=fff`}
                            alt="Room Avatar"
                        />
                    </div>
                    <h2>{room.roomname}</h2>
                    <p>Created {new Date(room.created_at).toLocaleDateString()}</p>
                    <div className="room-buttons">
                        <button onClick={onBack} className="back-button">
                            ← Back to Rooms
                        </button>
                        <button onClick={handleLeaveRoom} className="leave-button">
                            🚪 Leave Room
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sidebar; 