import React, { useState, useEffect } from 'react';

export default function RoomList({ rooms, onJoinRoom }) {
    const [showCreateRoomForm, setShowCreateRoomForm] = useState(false);
    const [newRoomName, setNewRoomName] = useState("");
    const [newRoomDescription, setNewRoomDescription] = useState("");
    const [userRole, setUserRole] = useState("");

    useEffect(() => {
        // Fetch user role when component mounts
        fetchUserRole();
    }, []);

    const fetchUserRole = async () => {
        try {
            const response = await fetch(`http://localhost:4000/auth/user-role`, {
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();
                setUserRole(data.userRole);
            } else {
                console.error("Failed to fetch user role");
            }
        } catch (error) {
            console.error("Error fetching user role:", error);
        }
    };

    const handleCreateRoom = async () => {
        if (newRoomName.trim() && newRoomDescription.trim()) {
            try {
                const response = await fetch(`http://localhost:4000/Chatrooms/create`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        roomName: newRoomName,
                        description: newRoomDescription,
                    }),
                    credentials: "include",
                });

                if (response.ok) {
                    setNewRoomName("");
                    setNewRoomDescription("");
                    setShowCreateRoomForm(false);
                    window.location.reload();
                } else {
                    console.error("Failed to create room");
                }
            } catch (error) {
                console.error("Error creating room:", error);
            }
        }
    };

    return (
        <div style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "20px",
            fontFamily: "Arial, sans-serif"
        }}>
            {/* Create Room Button - Only visible to Admin */}
            {userRole === "Admin" && (
                <button
                    onClick={() => setShowCreateRoomForm(true)}
                    style={{
                        padding: "10px 15px",
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        marginBottom: "20px",
                        fontSize: "16px"
                    }}
                >
                    ➕ Create Room
                </button>
            )}

            {/* Create Room Modal */}
            {showCreateRoomForm && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: "white",
                        padding: "25px",
                        borderRadius: "8px",
                        width: "450px",
                        maxWidth: "90%",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
                    }}>
                        <h2 style={{ marginTop: 0, marginBottom: "20px", color: "#333" }}>
                            Create New Room
                        </h2>
                        <input
                            type="text"
                            placeholder="Room Name"
                            value={newRoomName}
                            onChange={(e) => setNewRoomName(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "12px",
                                marginBottom: "15px",
                                border: "1px solid #ddd",
                                borderRadius: "4px",
                                boxSizing: "border-box",
                                fontSize: "16px"
                            }}
                        />
                        <textarea
                            placeholder="Room Description"
                            value={newRoomDescription}
                            onChange={(e) => setNewRoomDescription(e.target.value)}
                            style={{
                                width: "100%",
                                height: "120px",
                                padding: "12px",
                                marginBottom: "20px",
                                border: "1px solid #ddd",
                                borderRadius: "4px",
                                boxSizing: "border-box",
                                resize: "vertical",
                                fontSize: "16px"
                            }}
                        />
                        <div style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: "10px"
                        }}>
                            <button
                                onClick={() => setShowCreateRoomForm(false)}
                                style={{
                                    padding: "10px 20px",
                                    backgroundColor: "#6c757d",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    fontSize: "16px"
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateRoom}
                                style={{
                                    padding: "10px 20px",
                                    backgroundColor: "#28a745",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    fontSize: "16px"
                                }}
                            >
                                Create Room
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Rooms List */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "20px"
            }}>
                {rooms.map((room) => (
                    <div key={room.roomid} style={{
                        backgroundColor: "white",
                        padding: "20px",
                        borderRadius: "8px",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        display: "flex",
                        flexDirection: "column"
                    }}>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ marginTop: 0, color: "#333" }}>{room.name}</h3>
                            <p style={{ color: "#666", marginBottom: "15px" }}>{room.description}</p>
                        </div>
                        <button
                            onClick={() => onJoinRoom(room.roomid)}
                            style={{
                                padding: "10px 15px",
                                backgroundColor: "#007bff",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                alignSelf: "flex-end"
                            }}
                        >
                            Join
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}