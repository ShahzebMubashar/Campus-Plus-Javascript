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
    const [username, setUsername] = useState<string>("User Name")
    const [activePage, setActivePage] = useState<string>("rooms")
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchRooms()
        fetchUserData()
    }, [])

    const fetchRooms = async () => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await fetch("http://localhost:4000/Chatrooms/getRooms", {
                credentials: "include",
            })
            if (response.ok) {
                const data = await response.json()
                setRooms(data)
            } else {
                setError("Failed to fetch rooms")
            }
        } catch (error) {
            setError("Error fetching rooms")
            console.error("Error fetching rooms:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const fetchUserData = async () => {
        // Implement this function to fetch user data from your backend
        // For now, we'll use a placeholder
        setUsername("John Doe")
    }

    const handleJoinRoom = async (roomId: string) => {
        console.log("Joining Room with ID:", roomId) // Debugging log

        if (!roomId) {
            console.error("Error: Room ID is undefined")
            return
        }

        try {
            const response = await fetch(`http://localhost:4000/Chatrooms/joinRoom/${roomId}`, {
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
        setActivePage("rooms")
    }

    const handleNavigate = (page: string) => {
        setActivePage(page)
        setActiveRoom(null)
    }

    const renderContent = () => {
        if (isLoading) {
            return <div>Loading...</div>
        }

        if (error) {
            return <div>Error: {error}</div>
        }

        switch (activePage) {
            case "rooms":
                return activeRoom ? (
                    <RoomView room={activeRoom} onBack={handleBackToRooms} />
                ) : (
                    <RoomList rooms={rooms} onJoinRoom={handleJoinRoom} />
                )
            case "profile":
                return <div>Profile Page (To be implemented)</div>
            case "settings":
                return <div>Settings Page (To be implemented)</div>
            case "myGroups":
                return <div>My Groups Page (To be implemented)</div>
            case "notifications":
                return <div>Notifications Page (To be implemented)</div>
            default:
                return <RoomList rooms={rooms} onJoinRoom={handleJoinRoom} />
        }
    }

    return (
        <div className="chatroom-main-top">
            <div className="chatroom-app">
                <Navbar />
                <div className="content-wrapper">
                    <Sidebar username={username} onNavigate={handleNavigate} />
                    <div className="main-content">
                        <header className="chatroom-header">
                            <h1>{activeRoom ? activeRoom.name : activePage.charAt(0).toUpperCase() + activePage.slice(1)}</h1>
                        </header>
                        {renderContent()}
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    )
}

