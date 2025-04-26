import React, { useState, useEffect } from 'react';

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
            minHeight: "100vh",
            backgroundColor: "#f5f8ff",
            padding: "30px",
            fontFamily: "Arial, sans-serif"
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
                        padding: "15px 20px",
                        border: "1px solid #e3e8f8",
                        borderRadius: "12px",
                        fontSize: "0.95rem",
                        backgroundColor: "#f8faff",
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
                            padding: "15px 30px",
                            background: "#2196f3",
                            color: "white",
                            border: "none",
                            borderRadius: "12px",
                            cursor: "pointer",
                            fontSize: "0.95rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            transition: "all 0.2s ease",
                            ':hover': {
                                background: "#1976d2"
                            }
                        }}
                    >
                        <span style={{ fontSize: "1.2rem" }}>➕</span> Create Room
                    </button>
                )}
            </div>

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
                    zIndex: 1000,
                    backdropFilter: "blur(5px)"
                }}>
                    <div style={{
                        background: "white",
                        padding: "30px",
                        borderRadius: "20px",
                        width: "500px",
                        maxWidth: "90%",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
                    }}>
                        <h2 style={{
                            margin: "0 0 25px 0",
                            color: "#1a237e",
                            fontSize: "1.5rem",
                            fontWeight: "600"
                        }}>
                            Create New Room
                        </h2>
                        <input
                            type="text"
                            placeholder="Room Name"
                            value={newRoomName}
                            onChange={(e) => setNewRoomName(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "15px 20px",
                                marginBottom: "15px",
                                border: "1px solid #e3e8f8",
                                borderRadius: "12px",
                                boxSizing: "border-box",
                                fontSize: "0.95rem",
                                backgroundColor: "#f8faff",
                                transition: "all 0.2s ease",
                                ':focus': {
                                    borderColor: "#2196f3",
                                    boxShadow: "0 0 0 3px rgba(33,150,243,0.1)"
                                }
                            }}
                        />
                        <textarea
                            placeholder="Room Description"
                            value={newRoomDescription}
                            onChange={(e) => setNewRoomDescription(e.target.value)}
                            style={{
                                width: "100%",
                                height: "120px",
                                padding: "15px 20px",
                                marginBottom: "25px",
                                border: "1px solid #e3e8f8",
                                borderRadius: "12px",
                                boxSizing: "border-box",
                                resize: "vertical",
                                fontSize: "0.95rem",
                                backgroundColor: "#f8faff",
                                transition: "all 0.2s ease",
                                ':focus': {
                                    borderColor: "#2196f3",
                                    boxShadow: "0 0 0 3px rgba(33,150,243,0.1)"
                                }
                            }}
                        />
                        <div style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: "12px"
                        }}>
                            <button
                                onClick={() => setShowCreateRoomForm(false)}
                                style={{
                                    padding: "12px 25px",
                                    background: "#e3e8f8",
                                    color: "#1a237e",
                                    border: "none",
                                    borderRadius: "12px",
                                    cursor: "pointer",
                                    fontSize: "0.95rem",
                                    transition: "all 0.2s ease",
                                    ':hover': {
                                        background: "#d1d8f0"
                                    }
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateRoom}
                                style={{
                                    padding: "12px 25px",
                                    background: "#2196f3",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "12px",
                                    cursor: "pointer",
                                    fontSize: "0.95rem",
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

            {/* Rooms Grid */}
            <div style={{
                maxWidth: "1200px",
                margin: "0 auto",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
                gap: "25px"
            }}>
                {filteredRooms.length > 0 ? (
                    filteredRooms.map((room) => (
                        <div key={room.roomid} style={{
                            background: "white",
                            padding: "25px",
                            borderRadius: "20px",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                            display: "flex",
                            flexDirection: "column",
                            gap: "15px",
                            transition: "transform 0.2s ease, box-shadow 0.2s ease",
                            ':hover': {
                                transform: "translateY(-5px)",
                                boxShadow: "0 6px 25px rgba(0,0,0,0.1)"
                            }
                        }}>
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "15px"
                            }}>
                                <div style={{
                                    width: "60px",
                                    height: "60px",
                                    borderRadius: "16px",
                                    overflow: "hidden",
                                    flexShrink: 0
                                }}>
                                    <img
                                        src={`https://ui-avatars.com/api/?name=${room.name}&background=2196f3&color=fff`}
                                        alt="Room Avatar"
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{
                                        margin: "0 0 5px 0",
                                        color: "#1a237e",
                                        fontSize: "1.2rem",
                                        fontWeight: "600"
                                    }}>{room.name}</h3>
                                    <p style={{
                                        margin: 0,
                                        color: "#666",
                                        fontSize: "0.9rem"
                                    }}>Created {new Date(room.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <p style={{
                                margin: 0,
                                color: "#444",
                                fontSize: "0.95rem",
                                lineHeight: "1.5"
                            }}>{room.description}</p>
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginTop: "10px"
                            }}>
                                <div style={{
                                    display: "flex",
                                    gap: "15px"
                                }}>
                                    <span style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "5px",
                                        color: "#666",
                                        fontSize: "0.9rem"
                                    }}>
                                        👥 {room.member_count || 0} members
                                    </span>
                                    <span style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "5px",
                                        color: "#666",
                                        fontSize: "0.9rem"
                                    }}>
                                        💬 {room.message_count || 0} messages
                                    </span>
                                </div>
                                <button
                                    onClick={() => onJoinRoom(room.roomid)}
                                    style={{
                                        padding: "12px 25px",
                                        background: "#2196f3",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "12px",
                                        cursor: "pointer",
                                        fontSize: "0.95rem",
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
                                    Join Room
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{
                        gridColumn: "1 / -1",
                        background: "white",
                        padding: "40px",
                        borderRadius: "20px",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                        textAlign: "center"
                    }}>
                        <div style={{
                            width: "80px",
                            height: "80px",
                            margin: "0 auto 20px",
                            opacity: 0.5
                        }}>
                            🔍
                        </div>
                        <h3 style={{
                            color: "#1a237e",
                            fontSize: "1.2rem",
                            marginBottom: "10px"
                        }}>
                            No rooms found
                        </h3>
                        <p style={{
                            color: "#666",
                            fontSize: "0.95rem"
                        }}>
                            Try adjusting your search criteria
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}