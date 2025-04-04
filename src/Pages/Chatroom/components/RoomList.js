import React from 'react';
import "../css/RoomList.css";

export default function RoomList({ rooms, onJoinRoom }) {
    return (
        <div className="room-list">
            {rooms.map((room) => (
                <div key={room.roomid} className="room-card">
                    <div className="room-info">
                        <h3 className="room-title">{room.title}</h3>
                        <p className="room-description">{room.description}</p>
                    </div>
                    <button className="join-button" onClick={() => onJoinRoom(room.roomid)}>
                        Join
                    </button>
                </div>
            ))}
        </div>
    );
}
