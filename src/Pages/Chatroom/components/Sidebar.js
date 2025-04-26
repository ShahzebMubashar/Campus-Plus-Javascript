import React, { useState } from 'react';
import "../css/Sidebar.css";
import Picture from '../../../Assets/images/Shahzeb Mubashar (lesser size).webp';
import { User, Settings, Users, Bell } from "lucide-react";
import MyGroups from './MyGroups';
import AllGroups from './AllGroups';

export default function Sidebar({ username, onNavigate }) {
    const [activeTab, setActiveTab] = useState('all');

    return (
        <div className="sidebar">
            <div className="profile">
                <div className="profile-image">
                    <img src={Picture || "/placeholder.svg"} alt="User Profile" />
                </div>
                <h2>{username}</h2>
            </div>

            <div className="groups-section">
                <div className="tabs">
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`tab ${activeTab === 'all' ? 'active' : ''}`}
                    >
                        All Groups
                    </button>
                    <button
                        onClick={() => setActiveTab('my')}
                        className={`tab ${activeTab === 'my' ? 'active' : ''}`}
                    >
                        My Groups
                    </button>
                </div>

                <div className="groups-content">
                    {activeTab === 'all' ? <AllGroups /> : <MyGroups />}
                </div>
            </div>

            <ul className="chatroom-nav-items">
                <li className="chatroom-nav-item" onClick={() => onNavigate("profile")}>
                    <User size={18} />
                    <span>Profile</span>
                </li>
                <li className="chatroom-nav-item" onClick={() => onNavigate("settings")}>
                    <Settings size={18} />
                    <span>Settings</span>
                </li>
                <li className="chatroom-nav-item" onClick={() => onNavigate("notifications")}>
                    <Bell size={18} />
                    <span>Notifications</span>
                </li>
            </ul>
        </div>
    );
}
