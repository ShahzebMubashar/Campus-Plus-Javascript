import React, { useState, useEffect } from "react";
import API_BASE_URL from "../../../config/api.js";
import { authenticatedFetch } from "../../../utils/auth";
import { FaUsers, FaPlus } from "react-icons/fa";
import "./RoomList.css";

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
      const response = await authenticatedFetch(`${API_BASE_URL}/auth/user-role`);

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
        const response = await authenticatedFetch(`${API_BASE_URL}/Chatrooms/create`, {
          method: "POST",
          body: JSON.stringify({
            roomName: newRoomName,
            description: newRoomDescription,
          }),
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

  const filteredRooms = rooms.filter(
    (room) =>
      room.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="room-list-container">
      {/* Header Section */}
      <div className="room-list-header">
        <div className="room-list-header-content">
          <div className="room-list-header-left">
            <FaUsers className="room-list-header-icon" />
            <h1 className="room-list-title">Rooms</h1>
            <span className="room-list-count-badge">{filteredRooms.length}</span>
          </div>
          <div className="room-list-header-right">
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
        </div>
        <div className="room-list-description">
          <div className="room-list-description-content">
            <p>Connect with your peers and join study groups, project discussions, or general conversations. Select a room below to start chatting!</p>
            {userRole === "Admin" && (
              <button
                className="create-room-button"
                onClick={() => setShowCreateRoomForm(true)}
              >
                <FaPlus className="create-room-button-icon" /> Start new chat
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Create Room Modal */}
      {showCreateRoomForm && (
        <>
          <div
            className="chatroom-modal-overlay"
            onClick={() => setShowCreateRoomForm(false)}
          ></div>
          <div className="chatroom-create-room-modal">
            <div className="chatroom-create-room-modal-content">
              <h2 className="chatroom-create-room-modal-title">Create New Room</h2>
              <input
                className="chatroom-modal-input"
                type="text"
                placeholder="Room Name"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
              />
              <textarea
                className="chatroom-modal-textarea"
                placeholder="Room Description"
                value={newRoomDescription}
                onChange={(e) => setNewRoomDescription(e.target.value)}
              />
              <div className="chatroom-modal-buttons">
                <button
                  className="chatroom-modal-button chatroom-modal-button-cancel"
                  onClick={() => setShowCreateRoomForm(false)}
                >
                  Cancel
                </button>
                <button
                  className="chatroom-modal-button chatroom-modal-button-create"
                  onClick={handleCreateRoom}
                >
                  Create Room
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Rooms Grid */}
      <div className="room-grid">
        {filteredRooms.length > 0 ? (
          filteredRooms.map((room) => (
            <div key={room.roomid} className="room-card">
              <div className="room-card-content">
                <h3 className="room-card-title">
                  {room.name || room.roomname}
                </h3>
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
          <div className="no-rooms-message">
            No rooms found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
