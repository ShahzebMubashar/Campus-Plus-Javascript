import React from 'react';
import "../css/Sidebar.css"

export default function Sidebar() {
    return (
        <div className="sidebar">
            <div className="profile">
                <div className="profile-image" />
                <h2>User Name</h2>
            </div>
            <ul className="nav-items">
                <li className="nav-item">Profile</li>
                <li className="nav-item">Settings</li>
                <li className="nav-item">My Groups</li>
                <li className="nav-item">Notifications</li>
            </ul>
        </div>
    )
}

