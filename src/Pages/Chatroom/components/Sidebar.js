import React from 'react';
import './Sidebar.css';

const Sidebar = ({ userInfo, rooms, joinedRooms, activeRoom, onRoomSelect }) => {
    // Function to get initials from username
    const getInitials = (name) => {
        console.log(userInfo);
        if (!name) return 'U';
        
        const names = name.split(' ');
        if (names.length === 1) return names[0][0];
        
        // Get first letter of first name and first letter of last name
        return `${names[0][0]}${names[names.length - 1][0]}`;
    };

    return (
        <div className="sidebar">
            {/* Profile Section */}
            <div className="profile-section">
                <div className="profile-content">
                    <div className="avatar">
                        {userInfo?.profilepic ? (
                            <img
                                src={userInfo.profilepic}
                                alt="User Avatar"
                            />
                        ) : (
                            <div className="avatar-initials">
                                {getInitials(userInfo?.name)}
                            </div>
                        )}
                    </div>
                    <div className="profile-info">
                        <h3>{userInfo?.name || 'Welcome Back'}</h3>
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


        </div>
    );
};

export default Sidebar;