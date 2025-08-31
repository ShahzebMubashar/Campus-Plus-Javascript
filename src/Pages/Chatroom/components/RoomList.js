import React, { useState, useEffect } from "react";
import API_BASE_URL from "../../../config/api.js";
import { authenticatedFetch } from "../../../utils/auth";
import { FaUsers, FaPlus, FaCheck, FaTimes, FaEdit } from "react-icons/fa";
import "./RoomList.css";

export default function RoomList({ rooms, onJoinRoom }) {
  const [showCreateRoomForm, setShowCreateRoomForm] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomDescription, setNewRoomDescription] = useState("");
  const [userRole, setUserRole] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestRoomForm, setShowSuggestRoomForm] = useState(false);
  const [suggestRoomName, setSuggestRoomName] = useState("");
  const [suggestRoomDescription, setSuggestRoomDescription] = useState("");
  const [suggestionMessage, setSuggestionMessage] = useState("");
  const [suggestedRooms, setSuggestedRooms] = useState([]);
  const [editSuggestionId, setEditSuggestionId] = useState(null);
  const [editRoomName, setEditRoomName] = useState("");
  const [editRoomDescription, setEditRoomDescription] = useState("");
  const [showSuggestedRooms, setShowSuggestedRooms] = useState(false);

  useEffect(() => {
    // Fetch user role and suggested rooms when component mounts
    fetchUserRole();
    fetchSuggestedRooms();
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

  const fetchSuggestedRooms = async () => {
    try {
      const response = await authenticatedFetch(`${API_BASE_URL}/Chatrooms/suggestions`);
      if (response.ok) {
        const data = await response.json();
        setSuggestedRooms(data.filter(s => s.status === "pending"));
      }
    } catch (error) {
      // Only log for admin, or ignore for non-admins
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

  const handleSuggestRoom = async () => {
    if (suggestRoomName.trim() && suggestRoomDescription.trim()) {
      try {
        const response = await authenticatedFetch(`${API_BASE_URL}/Chatrooms/suggest`, {
          method: "POST",
          body: JSON.stringify({
            roomName: suggestRoomName,
            description: suggestRoomDescription,
          }),
        });

        if (response.ok) {
          setSuggestionMessage("Thank you for your suggestion!");
          setSuggestRoomName("");
          setSuggestRoomDescription("");
          setTimeout(() => {
            setShowSuggestRoomForm(false);
            setSuggestionMessage("");
          }, 1500);
        } else {
          setSuggestionMessage("Failed to submit suggestion.");
        }
      } catch (error) {
        setSuggestionMessage("Error submitting suggestion.");
      }
    }
  };

  // Admin: Approve or Reject a suggestion
  const handleReviewSuggestion = async (id, status) => {
    try {
      const response = await authenticatedFetch(`${API_BASE_URL}/Chatrooms/suggestions/${id}/review`, {
        method: "POST",
        body: JSON.stringify({ status }),
      });
      if (response.ok) {
        fetchSuggestedRooms();
      }
    } catch (error) {
      // handle error
    }
  };

  // Admin: Edit a suggestion
  const handleEditSuggestion = (room) => {
    setEditSuggestionId(room.id);
    setEditRoomName(room.room_name);
    setEditRoomDescription(room.description);
  };

  const handleSaveEditSuggestion = async () => {
    try {
      const response = await authenticatedFetch(`${API_BASE_URL}/Chatrooms/suggestions/${editSuggestionId}/edit`, {
        method: "POST",
        body: JSON.stringify({
          roomName: editRoomName,
          description: editRoomDescription,
        }),
      });
      if (response.ok) {
        setEditSuggestionId(null);
        fetchSuggestedRooms();
      }
    } catch (error) {
      // handle error
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
            <button
              className="suggest-room-button"
              onClick={() => setShowSuggestRoomForm(true)}
            >
              <FaPlus className="suggest-room-button-icon" /> Suggest Room
            </button>
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

      {/* Suggest Room Modal */}
      {showSuggestRoomForm && (
        <>
          <div
            className="chatroom-modal-overlay"
            onClick={() => setShowSuggestRoomForm(false)}
          ></div>
          <div className="chatroom-create-room-modal">
            <div className="chatroom-create-room-modal-content">
              <h2 className="chatroom-create-room-modal-title">Suggest a Room</h2>
              <input
                className="chatroom-modal-input"
                type="text"
                placeholder="Room Name"
                value={suggestRoomName}
                onChange={(e) => setSuggestRoomName(e.target.value)}
              />
              <textarea
                className="chatroom-modal-textarea"
                placeholder="Room Description"
                value={suggestRoomDescription}
                onChange={(e) => setSuggestRoomDescription(e.target.value)}
              />
              {suggestionMessage && (
                <div className="suggestion-message">{suggestionMessage}</div>
              )}
              <div className="chatroom-modal-buttons">
                <button
                  className="chatroom-modal-button chatroom-modal-button-cancel"
                  onClick={() => setShowSuggestRoomForm(false)}
                >
                  Cancel
                </button>
                <button
                  className="chatroom-modal-button chatroom-modal-button-create"
                  onClick={handleSuggestRoom}
                >
                  Submit Suggestion
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Rooms Grid (ordinary + suggested) */}
      <div className="room-grid">
        {/* Show suggested rooms only if toggled */}
        {showSuggestedRooms
          ? suggestedRooms.map((room) =>
            editSuggestionId === room.id ? (
              <div key={`suggested-${room.id}`} className="room-card">
                <div className="room-card-content">
                  <input
                    className="chatroom-modal-input"
                    type="text"
                    value={editRoomName}
                    onChange={e => setEditRoomName(e.target.value)}
                  />
                  <textarea
                    className="chatroom-modal-textarea"
                    value={editRoomDescription}
                    onChange={e => setEditRoomDescription(e.target.value)}
                  />
                  <div className="room-card-suggester">
                    Suggested by: <strong>{room.suggested_by_username || "Unknown"}</strong>
                  </div>
                  <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                    <button className="modal-button modal-button-create" onClick={handleSaveEditSuggestion}>Save</button>
                    <button className="modal-button modal-button-cancel" onClick={() => setEditSuggestionId(null)}>Cancel</button>
                  </div>
                </div>
              </div>
            ) : (
              <div key={`suggested-${room.id}`} className="room-card">
                <div className="room-card-content">
                  <h3 className="room-card-title">
                    {room.room_name}
                    <span className="pending-badge">Pending</span>
                  </h3>
                  <p className="room-card-description">{room.description}</p>
                  <div className="room-card-suggester">
                    Suggested by: <strong>{room.suggested_by_username || "Unknown"}</strong>
                  </div>
                  {userRole === "Admin" && (
                    <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                      <button
                        className="modal-button modal-button-create"
                        title="Approve"
                        onClick={() => handleReviewSuggestion(room.id, "approved")}
                      >
                        <FaCheck /> Approve
                      </button>
                      <button
                        className="modal-button modal-button-cancel"
                        title="Reject"
                        onClick={() => handleReviewSuggestion(room.id, "rejected")}
                      >
                        <FaTimes /> Reject
                      </button>
                      <button
                        className="modal-button"
                        title="Edit"
                        onClick={() => handleEditSuggestion(room)}
                      >
                        <FaEdit /> Edit
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          )
          : (
            // Ordinary Rooms
            filteredRooms.length > 0 ? (
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
            )
          )
        }
      </div>

      {/* Suggested Rooms Toggle Button (Admin only) */}
      {userRole === "Admin" && (
        <button
          className={`suggested-rooms-toggle${showSuggestedRooms ? " active" : ""}`}
          onClick={() => setShowSuggestedRooms((prev) => !prev)}
          style={{
            marginLeft: 12,
            background: showSuggestedRooms ? "#1976d2" : "#f1f5fa",
            color: showSuggestedRooms ? "#fff" : "#2563eb",
            border: "1px solid #2563eb",
            borderRadius: 8,
            padding: "8px 18px",
            fontWeight: 600,
            fontSize: "1rem",
            cursor: "pointer",
            transition: "background 0.2s, color 0.2s",
          }}
        >
          Suggested Rooms
        </button>
      )}
    </div>
  );
}
