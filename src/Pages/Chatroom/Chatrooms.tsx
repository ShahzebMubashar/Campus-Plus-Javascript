import React, { useState, useEffect } from 'react';
import Sidebar from "./components/Sidebar.tsx"
import RoomList from "./components/RoomList.tsx"
import RoomView from "./components/RoomView.tsx"
import Navbar from '../Index/components/Navbar.js';
import Footer from '../Footer/Footer.js';
import "./css/Chatroom.css"
import type { Room } from "./types/types"

export default function App() {
    const [rooms, setRooms] = useState<Room[]>([])
    const [activeRoom, setActiveRoom] = useState<Room | null>(null)

    useEffect(() => {
        fetchRooms()
    }, [])

    const fetchRooms = async () => {
        try {
            const response = await fetch("http://localhost:4000/Chatrooms", {
                credentials: "include",
            })
            if (response.ok) {
                const data = await response.json()
                setRooms(data)
            } else {
                console.error("Failed to fetch rooms")
            }
        } catch (error) {
            console.error("Error fetching rooms:", error)
        }
    }


    const handleJoinRoom = async (roomId: string) => {
        try {
            const response = await fetch(`http://localhost:4000/Chatrooms/join/${roomId}`, {
                method: "POST",
                credentials: "include",
            })
            if (response.ok) {
                const room = rooms.find((r) => r.roomid === roomId)
                if (room) {
                    setActiveRoom(room)
                }
            } else {
                console.error("Failed to join room")
            }
        } catch (error) {
            console.error("Error joining room:", error)
        }
    }

    const handleBackToRooms = () => {
        setActiveRoom(null)
    }

    return (
        <div className="chatroom-main-top">
            <div className="chatroom-app">
                <Navbar />
                <div className="content-wrapper">
                    <Sidebar username={''} onNavigate={function (page: string): void {
                        throw new Error('Function not implemented.');
                    }} />
                    <div className="main-content">
                        <header className="chatroom-header">
                            <h1>{activeRoom ? activeRoom.name : "Chatrooms"}</h1>
                        </header>

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
    )
}


