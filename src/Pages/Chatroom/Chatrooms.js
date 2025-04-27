import React, { useState, useEffect } from 'react';

import RoomList from "./components/RoomList.js";
import RoomView from "./components/RoomView.js";
import Navbar from '../Index/components/Navbar.js';
import Footer from '../Footer/Footer.js';
import "./css/Chatroom.css";

export default function Chatrooms() {
    const [rooms, setRooms] = useState([]);
    const [activeRoom, setActiveRoom] = useState(null);

    // Fetch rooms on initial render
    useEffect(() => {
        fetchRooms();
    }, []);

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

    return (
        <div className="chatroom-main-top">
            <div className="chatroom-app">
                <Navbar />
                <div className="content-wrapper">

                    <div className="main-content">


                        {activeRoom ? (
                            <RoomView room={activeRoom} onBack={handleBackToRooms} />
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
