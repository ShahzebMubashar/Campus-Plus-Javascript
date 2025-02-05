import React from 'react';
import "../css/RoomList.css"

interface Room {
    id: string
    title: string
    description: string
}

interface RoomListProps {
    rooms: Room[]
    onJoinRoom: (roomId: string) => void
}

export default function RoomList({ rooms, onJoinRoom }: RoomListProps) {
    return (
        <div className="room-list">
            {rooms.map((room) => (
                <div key={room.id} className="room-card">
                    <div className="room-info">
                        <h3 className="room-title">{room.title}</h3>
                        <p className="room-description">{room.description}</p>
                    </div>
                    <button className="join-button" onClick={() => onJoinRoom(room.id)}>
                        Join
                    </button>
                </div>
            ))}
        </div>
    )
}

