import React from 'react';
import './Sidebar.css';

const Sidebar = ({ userInfo, rooms, joinedRooms, activeRoom, onRoomSelect }) => {
    return (
        <div className="sidebar">
            {/* Profile Section */}
            <div className="profile-section">
                <div className="profile-content">
                    <div className="avatar">
                        <img
                            src={userInfo?.profilepic || `https://ui-avatars.com/api/?name=${userInfo?.username || 'User'}&background=2196f3&color=fff`}
                            alt="User Avatar"
                        />
                    </div>
                    <div className="profile-info">
                        <h3>{userInfo?.username || 'Welcome Back'}</h3>
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

            {/* Joined Rooms Section */}
            <div className="rooms-section">
                <h3>My Rooms ({joinedRooms?.length || 0})</h3>
                <div className="rooms-list">
                    {joinedRooms?.map(room => (
                        <button
                            key={room.roomid}
                            className={`room-button ${activeRoom?.roomid === room.roomid ? 'active' : ''}`}
                            onClick={() => onRoomSelect(room)}
                        >
                            <span className="room-icon">💬</span>
                            {room.roomname}
                        </button>
                    ))}
                </div>
            </div>

            {/* All Rooms Section */}
            <div className="rooms-section">
                <h3>All Rooms ({rooms?.length || 0})</h3>
                <div className="rooms-list">
                    {rooms?.map(room => (
                        <button
                            key={room.roomid}
                            className={`room-button ${activeRoom?.roomid === room.roomid ? 'active' : ''}`}
                            onClick={() => onRoomSelect(room)}
                        >
                            <span className="room-icon">🌐</span>
                            {room.roomname || 'Unnamed Room'}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;