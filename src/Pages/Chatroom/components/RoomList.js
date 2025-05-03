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
        room.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );


    return (
        <div className="room-list-container">
            {/* Header Section */}
            <div className="room-list-header">
                <div className="room-list-header-content">
                    <div>
                        <h1 className="room-list-title">Chat Rooms</h1>
                        <p className="room-list-subtitle">
                            Browse and join chat rooms to start discussing
                        </p>
                    </div>
                    {userRole === "Admin" && (
                        <button
                            className="create-room-button"
                            onClick={() => setShowCreateRoomForm(true)}
                        >
                            <span>➕</span> Create Room
                        </button>
                    )}
                </div>
                <div className="room-list-search">
                    <input
                        type="text"
                        placeholder="Search rooms..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <span className="room-list-search-icon">🔍</span>
                </div>
            </div>


            {/* Create Room Modal */}
            {showCreateRoomForm && (
                <div className="create-room-modal">
                    <div className="create-room-modal-content">
                        <h2 className="create-room-modal-title">Create New Room</h2>
                        <input
                            className="create-room-input"
                            type="text"
                            placeholder="Room Name"
                            value={newRoomName}
                            onChange={(e) => setNewRoomName(e.target.value)}
                        />
                        <textarea
                            className="create-room-textarea"
                            placeholder="Room Description"
                            value={newRoomDescription}
                            onChange={(e) => setNewRoomDescription(e.target.value)}
                        />
                        <div className="modal-buttons">
                            <button
                                className="modal-button modal-button-cancel"
                                onClick={() => setShowCreateRoomForm(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="modal-button modal-button-create"
                                onClick={handleCreateRoom}
                            >
                                Create Room
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* Rooms Grid */}
            <div className="room-grid">
                {filteredRooms.length > 0 ? (
                    filteredRooms.map((room) => (
                        <div key={room.roomid} className="room-card">
                            <div className="room-card-content">
                                <h3 className="room-card-title">{room.name || room.roomname}</h3>
                                <p className="room-card-description">{room.description}</p>
                            </div>
                            <button
                                className="join-room-button"
                                onClick={() => onJoinRoom(room.roomid)}
                            >
                                Join Room
                            </button>
                        </div>
                    ))
                ) : (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: '#666' }}>
                        No rooms found matching your search.
                    </div>
                )}
            </div>
        </div>
    );
}