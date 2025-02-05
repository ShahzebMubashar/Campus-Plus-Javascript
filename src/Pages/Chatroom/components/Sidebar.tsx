import React from 'react';
import "../css/Sidebar.css"
import Picture from '../../../Assets/images/Shahzeb Mubashar (lesser size).webp'

export default function Sidebar() {
    return (
        <div className="sidebar">
            <div className="profile">
                <div className="profile-image">
                    <img src={Picture} alt="User Profile" />
                </div>
                <h2>User Name</h2>
            </div>
            <ul className="chatroom-nav-items">
                <li className="chatroom-nav-item">Profile</li>
                <li className="chatroom-nav-item">Settings</li>
                <li className="chatroom-nav-item">My Groups</li>
                <li className="chatroom-nav-item">Notifications</li>
            </ul>
        </div>
    )
}

