import React, { useState, useEffect } from 'react';
import Sidebar from "./components/Sidebar.js";
import RoomList from "./components/RoomList.js";
import RoomView from "./components/RoomView.js";
import Navbar from '../Index/components/Navbar.js';
import Footer from '../Footer/Footer.js';
import "./css/Chatroom.css";

export default function Chatrooms() {
    const [rooms, setRooms] = useState([]);
    const [activeRoom, setActiveRoom] = useState(null);
    const [userInfo, setUserInfo] = useState(null);

    // Fetch user info and rooms on initial render
    useEffect(() => {
        fetchUserInfo();
        fetchRooms();
    }, []);

    const fetchUserInfo = async () => {
        try {
            const response = await fetch("http://localhost:4000/auth/user-info", {
                credentials: "include",
            });
            if (response.ok) {
                const data = await response.json();
                setUserInfo(data);
            }
        } catch (error) {
            console.error("Error fetching user info:", error);
        }
    };

    const fetchRooms = async () => {
        try {
            const response = await fetch("http://localhost:4000/Chatrooms", {
                credentials: "include",
            });
            if (response.ok) {
                const data = await response.json();
                setRooms(data);
            } else {
                console.error("Failed to fetch rooms");
            }
        } catch (error) {
            console.error("Error fetching rooms:", error);
        }
    };

    // Handles joining a room and activating RoomView
    const handleJoinRoom = async (roomId) => {
        try {
            const response = await fetch(`http://localhost:4000/Chatrooms/join/${roomId}`, {
                method: "POST",
                credentials: "include",
            });
            if (response.ok) {
                const room = rooms.find((r) => r.roomid === roomId);
                if (room) {
                    setActiveRoom(room);
                }
            } else {
                console.error("Failed to join room");
            }
        } catch (error) {
            console.error("Error joining room:", error);
        }
    };

    // Return to the room list
    const handleBackToRooms = () => {
        setActiveRoom(null);
    };

    const handleNavigation = (page) => {
        // Handle navigation to different pages
        switch (page) {
            case 'all-groups':
                setActiveRoom(null);
                break;
            case 'my-groups':
                setActiveRoom(null);
                break;
            default:
                break;
        }
    };

    return (
        <div className="chatroom-main-top">
            <div className="chatroom-app">
                <Navbar />
                <div className="content-wrapper">
                    <Sidebar
                        username={userInfo?.username || ''}
                        onNavigate={handleNavigation}
                        activeRoom={activeRoom}
                        onLeaveRoom={() => setActiveRoom(null)}
                    />
                    <div className="main-content">
                        {activeRoom ? (
                            <RoomView
                                room={activeRoom}
                                onBack={handleBackToRooms}
                                onLeave={() => setActiveRoom(null)}
                            />
                        ) : (
                            <RoomList rooms={rooms} onJoinRoom={handleJoinRoom} />
                        )}
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
}