import React from 'react';
import "../css/Sidebar.css"
import Picture from '../../../Assets/images/Shahzeb Mubashar (lesser size).webp'
import { User, Settings, Users, Bell } from "lucide-react"


interface SidebarProps {
    username: string
    onNavigate: (page: string) => void
}

export default function Sidebar({ username, onNavigate }: SidebarProps) {
    return (
        <div className="sidebar">
            <div className="profile">
                <div className="profile-image">
                    <img src={Picture || "/placeholder.svg"} alt="User Profile" />
                </div>
                <h2>{username}</h2>
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
                <li className="chatroom-nav-item" onClick={() => onNavigate("myGroups")}>
                    <Users size={18} />
                    <span>My Groups</span>
                </li>
                <li className="chatroom-nav-item" onClick={() => onNavigate("notifications")}>
                    <Bell size={18} />
                    <span>Notifications</span>
                </li>
            </ul>
        </div>
    )
}

