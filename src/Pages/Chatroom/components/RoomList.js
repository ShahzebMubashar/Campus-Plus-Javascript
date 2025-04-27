import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';

export default function RoomList({ rooms, onJoinRoom }) {
    const [showCreateRoomForm, setShowCreateRoomForm] = useState(false);
    const [newRoomName, setNewRoomName] = useState("");
    const [newRoomDescription, setNewRoomDescription] = useState("");
    const [userRole, setUserRole] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

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

    const filteredRooms = rooms.filter(room =>
        room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div style={{
            display: "flex",
            minHeight: "calc(100vh - 64px)",
            backgroundColor: "#fff",
            position: "relative",
            paddingLeft: "300px",
            marginTop: "64px"
        }}>
            <Sidebar />

            {/* Main Content */}
            <div style={{
                flex: 1,
                padding: "30px",
                width: "100%"
            }}>
                {/* Header Section */}
                <div style={{
                    maxWidth: "1200px",
                    margin: "0 auto 30px",
                    textAlign: "center"
                }}>
                    <h1 style={{
                        color: "#1a237e",
                        fontSize: "2.5rem",
                        marginBottom: "15px",
                        fontWeight: "600"
                    }}>Campus+ Chatrooms</h1>
                    <p style={{
                        color: "#666",
                        fontSize: "1.1rem",
                        maxWidth: "600px",
                        margin: "0 auto"
                    }}>Join discussions, share knowledge, and connect with your peers</p>
                </div>

                {/* Search and Create Section */}
                <div style={{
                    maxWidth: "1200px",
                    margin: "0 auto 30px",
                    display: "flex",
                    gap: "15px",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "white",
                    padding: "20px",
                    borderRadius: "20px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
                }}>
                    <input
                        type="text"
                        placeholder="Search rooms..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            flex: 1,
                            padding: "12px 20px",
                            border: "1px solid #e0e0e0",
                            borderRadius: "12px",
                            fontSize: "0.95rem",
                            outline: "none",
                            transition: "all 0.2s ease",
                            ':focus': {
                                borderColor: "#2196f3",
                                boxShadow: "0 0 0 3px rgba(33,150,243,0.1)"
                            }
                        }}
                    />
                    {userRole === "Admin" && (
                        <button
                            onClick={() => setShowCreateRoomForm(true)}
                            style={{
                                padding: "12px 25px",
                                background: "#2196f3",
                                color: "white",
                                border: "none",
                                borderRadius: "12px",
                                cursor: "pointer",
                                fontSize: "0.95rem",
                                fontWeight: "500",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                transition: "all 0.2s ease",
                                ':hover': {
                                    background: "#1976d2",
                                    transform: "translateY(-2px)"
                                }
                            }}
                        >
                            ➕ Create Room
                        </button>
                    )}
                </div>

                {/* Room Grid */}
                <div style={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                    gap: "20px",
                    padding: "20px 0"
                }}>
                    {filteredRooms.length > 0 ? (
                        filteredRooms.map((room) => (
                            <div
                                key={room.roomid}
                                style={{
                                    background: "white",
                                    borderRadius: "20px",
                                    padding: "25px",
                                    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                                    transition: "all 0.2s ease",
                                    ':hover': {
                                        transform: "translateY(-5px)",
                                        boxShadow: "0 8px 30px rgba(0,0,0,0.1)"
                                    }
                                }}
                            >
                                <div style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: "15px",
                                    marginBottom: "20px"
                                }}>
                                    <div style={{
                                        width: "60px",
                                        height: "60px",
                                        borderRadius: "16px",
                                        overflow: "hidden",
                                        flexShrink: 0,
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                                    }}>
                                        <img
                                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(room.roomname)}&background=2196f3&color=fff`}
                                            alt={room.roomname}
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{
                                            margin: "0 0 8px 0",
                                            fontSize: "1.25rem",
                                            fontWeight: "600",
                                            color: "#1a237e",
                                            lineHeight: "1.3"
                                        }}>{room.roomname}</h3>
                                        <p style={{
                                            margin: "0",
                                            fontSize: "0.95rem",
                                            color: "#64748b",
                                            lineHeight: "1.5",
                                            display: "-webkit-box",
                                            WebkitLineClamp: "2",
                                            WebkitBoxOrient: "vertical",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis"
                                        }}>{room.description}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => onJoinRoom(room.roomid)}
                                    style={{
                                        width: "100%",
                                        padding: "12px",
                                        background: "#2196f3",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "12px",
                                        cursor: "pointer",
                                        fontSize: "0.95rem",
                                        fontWeight: "500",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "8px",
                                        transition: "all 0.2s ease",
                                        ':hover': {
                                            background: "#1976d2",
                                            transform: "translateY(-2px)"
                                        }
                                    }}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                                        <polyline points="10 17 15 12 10 7" />
                                        <line x1="15" y1="12" x2="3" y2="12" />
                                    </svg>
                                    Join Room
                                </button>
                            </div>
                        ))
                    ) : (
                        <div style={{
                            gridColumn: "1 / -1",
                            textAlign: "center",
                            padding: "50px 20px",
                            background: "white",
                            borderRadius: "20px",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
                        }}>
                            <h3 style={{
                                margin: "0 0 10px 0",
                                color: "#1a237e",
                                fontSize: "1.2rem"
                            }}>No Rooms Found</h3>
                            <p style={{
                                margin: "0",
                                color: "#666",
                                fontSize: "0.95rem"
                            }}>Try adjusting your search or create a new room</p>
                        </div>
                    )}
                </div>

                {/* Create Room Modal */}
                {showCreateRoomForm && (
                    <div style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "rgba(0,0,0,0.5)",
                        backdropFilter: "blur(5px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1100
                    }}>
                        <div style={{
                            background: "white",
                            borderRadius: "20px",
                            padding: "30px",
                            width: "90%",
                            maxWidth: "500px",
                            boxShadow: "0 10px 40px rgba(0,0,0,0.2)"
                        }}>
                            <h2 style={{
                                margin: "0 0 20px 0",
                                color: "#1a237e",
                                fontSize: "1.5rem",
                                textAlign: "center"
                            }}>Create New Room</h2>
                            <div style={{
                                marginBottom: "20px"
                            }}>
                                <label style={{
                                    display: "block",
                                    marginBottom: "8px",
                                    color: "#444",
                                    fontSize: "0.95rem",
                                    fontWeight: "500"
                                }}>Room Name</label>
                                <input
                                    type="text"
                                    value={newRoomName}
                                    onChange={(e) => setNewRoomName(e.target.value)}
                                    style={{
                                        width: "100%",
                                        padding: "12px",
                                        border: "1px solid #e0e0e0",
                                        borderRadius: "12px",
                                        fontSize: "0.95rem",
                                        outline: "none",
                                        transition: "all 0.2s ease",
                                        ':focus': {
                                            borderColor: "#2196f3",
                                            boxShadow: "0 0 0 3px rgba(33,150,243,0.1)"
                                        }
                                    }}
                                />
                            </div>
                            <div style={{
                                marginBottom: "25px"
                            }}>
                                <label style={{
                                    display: "block",
                                    marginBottom: "8px",
                                    color: "#444",
                                    fontSize: "0.95rem",
                                    fontWeight: "500"
                                }}>Description</label>
                                <textarea
                                    value={newRoomDescription}
                                    onChange={(e) => setNewRoomDescription(e.target.value)}
                                    style={{
                                        width: "100%",
                                        padding: "12px",
                                        border: "1px solid #e0e0e0",
                                        borderRadius: "12px",
                                        fontSize: "0.95rem",
                                        minHeight: "100px",
                                        resize: "vertical",
                                        outline: "none",
                                        transition: "all 0.2s ease",
                                        ':focus': {
                                            borderColor: "#2196f3",
                                            boxShadow: "0 0 0 3px rgba(33,150,243,0.1)"
                                        }
                                    }}
                                />
                            </div>
                            <div style={{
                                display: "flex",
                                gap: "15px"
                            }}>
                                <button
                                    onClick={() => setShowCreateRoomForm(false)}
                                    style={{
                                        flex: 1,
                                        padding: "12px",
                                        background: "#f5f5f5",
                                        color: "#444",
                                        border: "none",
                                        borderRadius: "12px",
                                        cursor: "pointer",
                                        fontSize: "0.95rem",
                                        fontWeight: "500",
                                        transition: "all 0.2s ease",
                                        ':hover': {
                                            background: "#e0e0e0"
                                        }
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateRoom}
                                    style={{
                                        flex: 1,
                                        padding: "12px",
                                        background: "#2196f3",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "12px",
                                        cursor: "pointer",
                                        fontSize: "0.95rem",
                                        fontWeight: "500",
                                        transition: "all 0.2s ease",
                                        ':hover': {
                                            background: "#1976d2"
                                        }
                                    }}
                                >
                                    Create Room
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}