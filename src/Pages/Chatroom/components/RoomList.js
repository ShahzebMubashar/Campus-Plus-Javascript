import React, { useState } from 'react';

export default function RoomList({ rooms, onJoinRoom }) {
    const [searchQuery, setSearchQuery] = useState("");

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
                        <h1 className="room-list-title">Available Rooms</h1>
                        <p className="room-list-subtitle">
                            Browse and join chat rooms to start discussing
                        </p>
                    </div>
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