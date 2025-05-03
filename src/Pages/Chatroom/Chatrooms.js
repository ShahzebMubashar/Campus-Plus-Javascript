import React, { useState, useEffect } from 'react';
import Sidebar from "./components/Sidebar.js";
import RoomList from "./components/RoomList.js";
import RoomView from "./components/RoomView.js";
import Navbar from '../Index/components/Navbar.js';
import Footer from '../Footer/Footer.js';
import "../Chatroom/css/Chatroom.css";

export default function Chatrooms() {
    const [rooms, setRooms] = useState([]);
    const [joinedRooms, setJoinedRooms] = useState([]);
    const [activeRoom, setActiveRoom] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserInfo();
        fetchAllRooms();
        fetchJoinedRooms();
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

    const fetchAllRooms = async () => {
        try {
            const response = await fetch("http://localhost:4000/Chatrooms", {
                credentials: "include",
            });
            if (response.ok) {
                const data = await response.json();
                setRooms(data);
            }
        } catch (error) {
            console.error("Error fetching rooms:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchJoinedRooms = async () => {
        try {
            const response = await fetch("http://localhost:4000/Chatrooms/user/groups", {
                credentials: "include",
            });
            if (response.ok) {
                const data = await response.json();
                setJoinedRooms(data);
            }
        } catch (error) {
            console.error("Error fetching joined rooms:", error);
        }
    };

    const handleRoomSelect = async (room) => {
        // If room is not joined, join it first
        if (!joinedRooms.find(r => r.roomid === room.roomid)) {
            try {
                const response = await fetch(`http://localhost:4000/Chatrooms/join/${room.roomid}`, {
                    method: "POST",
                    credentials: "include",
                });
                if (response.ok) {
                    await fetchJoinedRooms(); // Refresh joined rooms list
                }
            } catch (error) {
                console.error("Error joining room:", error);
                return;
            }
        }
        setActiveRoom(room);
    };

    return (
        <div className="chatroom-main-top">
            <div className="chatroom-app">
                <Navbar />
                <div className="content-wrapper">
                    <Sidebar
                        userInfo={userInfo}
                        rooms={rooms}
                        joinedRooms={joinedRooms}
                        activeRoom={activeRoom}
                        onRoomSelect={handleRoomSelect}
                    />
                    <div className="main-content">
                        {activeRoom ? (
                            <RoomView
                                room={activeRoom}
                                onBack={() => setActiveRoom(null)}
                                onLeave={async () => {
                                    await handleLeaveRoom(activeRoom.roomid);
                                    setActiveRoom(null);
                                    fetchJoinedRooms();
                                }}
                            />
                        ) : (
                            <RoomList
                                rooms={rooms}
                                onJoinRoom={(roomId) => {
                                    const room = rooms.find(r => r.roomid === roomId);
                                    if (room) handleRoomSelect(room);
                                }}
                            />
                        )}
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
}

// Helper function for leaving a room
async function handleLeaveRoom(roomId) {
    try {
        const response = await fetch(`http://localhost:4000/Chatrooms/leave/${roomId}`, {
            method: "DELETE",
            credentials: "include",
        });
        return response.ok;
    } catch (error) {
        console.error("Error leaving room:", error);
        return false;
    }
}