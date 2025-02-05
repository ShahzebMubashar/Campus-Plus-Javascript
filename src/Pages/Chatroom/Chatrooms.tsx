import React, { useState } from 'react';
import Sidebar from "./components/Sidebar.tsx"
import RoomList from "./components/RoomList.tsx"
import RoomView from "./components/RoomView.tsx"
import "./css/Chatroom.css"
import type { Room } from "./types/types"

const MOCK_ROOMS: Room[] = [
    {
        id: "1",
        title: "Room 1",
        description: "Welcome to Room 1 - A place for general discussion",
        rules: ["Be respectful to others", "No spam or self-promotion", "Keep discussions on topic"],
        memberCount: 150,
        createdAt: "2024-01-01",
    },
    {
        id: "2",
        title: "Room 2",
        description: "Technical discussions and coding help",
        memberCount: 89,
        createdAt: "2024-01-15",
    },
    {
        id: "3",
        title: "Room 3",
        description: "Share your projects and get feedback",
        memberCount: 234,
        createdAt: "2024-01-10",
    },
]

export default function App() {
    const [rooms] = useState<Room[]>(MOCK_ROOMS)
    const [activeRoom, setActiveRoom] = useState<Room | null>(null)

    const handleJoinRoom = (roomId: string) => {
        const room = rooms.find((r) => r.id === roomId)
        if (room) {
            setActiveRoom(room)
        }
    }

    const handleBackToRooms = () => {
        setActiveRoom(null)
    }

    return (
        <div className="chatroom-app">
            <Sidebar />
            <div className="chatroom-main-content">
                <header className="chatroom-header">
                    <h1>{activeRoom ? activeRoom.title : "Chatrooms"}</h1>
                </header>

                {activeRoom ? (
                    <RoomView room={activeRoom} onBack={handleBackToRooms} />
                ) : (
                    <RoomList rooms={rooms} onJoinRoom={handleJoinRoom} />
                )}

                <footer className="chatroom-footer">
                    <p>Contact us etc. (Footer)</p>
                </footer>
            </div>
        </div>
    )
}

