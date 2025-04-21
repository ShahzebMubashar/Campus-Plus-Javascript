import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

export default function RoomView({ room, onBack, onLeave }) {
  const [posts, setPosts] = useState([]);
  const [activePost, setActivePost] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [newPost, setNewPost] = useState("");
  const [isEditingRoom, setIsEditingRoom] = useState(false);
  const [editedRoomName, setEditedRoomName] = useState(room.roomname);
  const [editedRoomDescription, setEditedRoomDescription] = useState(
    room.description
  );
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    fetchPosts();
  }, [room.roomid]);

  const fetchPosts = async () => {
    console.log(`Fetching Posts...`);

    try {
      const response = await fetch(
        `http://localhost:4000/Chatrooms/messages/${room.roomid}`,
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        console.log("Full API response:", responseData);

        const data = responseData.data || responseData;
        const role = responseData.userRole || "";

        console.log(`User Role: ${role}`);
        setUserRole(role);

        if (data?.messages && Array.isArray(data.messages)) {
          setPosts(data.messages);
        } else if (Array.isArray(data)) {
          setPosts(data);
        } else {
          setPosts([]);
          console.error("Unexpected post data format:", data);
        }
      } else {
        const responseData = await response.json();
        const role = responseData.userRole;
        setUserRole(role);

        console.error("Failed to fetch posts. Status:", response.status);
        const errorData = await response.json().catch(() => ({}));
        console.error("Error details:", errorData);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleCreatePost = async () => {
    if (newPost.trim()) {
      try {
        const response = await fetch(
          `http://localhost:4000/Chatrooms/${room.roomid}/messages`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: newPost }),
            credentials: "include",
          }
        );
        if (response.ok) {
          setNewPost("");
          fetchPosts();
        } else {
          console.error("Failed to create post");
        }
      } catch (error) {
        console.error("Error creating post:", error);
      }
    }
  };

  const handleDeleteRoom = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this room? This action cannot be undone."
    );
    if (confirmDelete) {
      try {
        const response = await fetch(
          `http://localhost:4000/Chatrooms/delete/${room.roomid}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );

        if (response.ok) {
          console.log("Room deleted successfully");
          window.location.reload();
        } else {
          console.error("Failed to delete room");
        }
      } catch (error) {
        console.error("Error deleting room:", error);
      }
    }
  };

  const handleUpdateRoom = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/Chatrooms/change-room-name/${room.roomid}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newName: editedRoomName,
            description: editedRoomDescription,
          }),
          credentials: "include",
        }
      );

      if (response.ok) {
        room.roomname = editedRoomName;
        room.description = editedRoomDescription;
        setIsEditingRoom(false);
        window.location.reload();
      } else {
        console.error("Failed to update room");
      }
    } catch (error) {
      console.error("Error updating room:", error);
    }
  };

  const handleLike = async (postId) => {
    if (!postId) return;

    try {
      const response = await fetch(
        `http://localhost:4000/Chatrooms/like/${postId}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.ok) {
        const likeCountResponse = await fetch(
          `http://localhost:4000/Chatrooms/likes/${postId}`,
          {
            credentials: "include",
          }
        );

        if (likeCountResponse.ok) {
          const data = await likeCountResponse.json();
          setPosts((prev) =>
            prev.map((post) =>
              post.messageid === postId
                ? { ...post, likeCount: data.likeCount }
                : post
            )
          );
        }
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleComment = async (postId) => {
    if (newComment.trim()) {
      try {
        const response = await fetch(
          `http://localhost:4000/Chatrooms/reply/${room.roomid}/${postId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: newComment }),
            credentials: "include",
          }
        );

        if (response.ok) {
          setNewComment("");
          fetchPosts();
        } else {
          console.error("Failed to add comment");
        }
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    }
  };

  const handleLeaveRoom = async () => {
    const confirmLeave = window.confirm(
      "Are you sure you want to leave this room?"
    );
    if (confirmLeave) {
      const response = await fetch(
        `http://localhost:4000/Chatrooms/leave/${room.roomid}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        console.log("Left room successfully");
        window.location.reload();
      } else {
        console.error("Failed to leave room");
      }
    }
  };

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Header with buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px",
          backgroundColor: "#f5f5f5",
          borderBottom: "1px solid #ddd",
          marginBottom: "20px",
          borderRadius: "8px",
        }}
      >
        <button
          onClick={onBack}
          style={{
            padding: "10px 15px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          ← Back to Rooms
        </button>

        <div>
          <button
            onClick={handleLeaveRoom}
            style={{
              padding: "10px 15px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            🚪 Leave Room
          </button>
        </div>
      </div>

      {/* Room Info Section */}
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          marginBottom: "20px",
          position: "relative",
        }}
      >
        {userRole === "Admin" && !isEditingRoom && (
          <div
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              display: "flex",
              gap: "10px",
            }}
          >
            <button
              onClick={() => setIsEditingRoom(true)}
              style={{
                padding: "8px 15px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              ✏️ Edit Room
            </button>
            <button
              onClick={handleDeleteRoom}
              style={{
                padding: "8px 15px",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              🗑️ Delete Room
            </button>
          </div>
        )}

        {isEditingRoom ? (
          <div>
            <input
              type="text"
              value={editedRoomName}
              onChange={(e) => setEditedRoomName(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "15px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "20px",
                fontWeight: "bold",
              }}
            />
            <textarea
              value={editedRoomDescription}
              onChange={(e) => setEditedRoomDescription(e.target.value)}
              style={{
                width: "100%",
                height: "120px",
                padding: "12px",
                marginBottom: "20px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                resize: "vertical",
                fontSize: "16px",
              }}
            />
            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => {
                  setIsEditingRoom(false);
                  setEditedRoomName(room.roomname);
                  setEditedRoomDescription(room.description);
                }}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateRoom}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <>
            <h1 style={{ marginTop: 0, color: "#333" }}>{room.roomname}</h1>
            <div style={{ color: "#666", marginBottom: "15px" }}>
              Created {new Date(room.created_at).toLocaleDateString()}
            </div>
            <div
              style={{
                backgroundColor: "#f9f9f9",
                padding: "15px",
                borderRadius: "6px",
                borderLeft: "4px solid #28a745",
              }}
            >
              <h2 style={{ marginTop: 0, color: "#444" }}>About</h2>
              <p style={{ color: "#555", lineHeight: "1.5" }}>
                {room.description}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Create Post Section */}
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          marginBottom: "20px",
        }}
      >
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            placeholder="What's on your mind?"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            style={{
              flex: 1,
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "16px",
            }}
          />
          <button
            onClick={handleCreatePost}
            style={{
              padding: "12px 20px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Post
          </button>
        </div>
      </div>

      {/* Posts Section */}
      <div>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post.messageid}
              style={{
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                marginBottom: "20px",
              }}
            >
              <div style={{ marginBottom: "10px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ fontWeight: "bold", color: "#333" }}>
                    {post.username}
                  </span>
                  <span style={{ color: "#666" }}>
                    {(() => {
                      const postDate = new Date(post.posted_at);
                      const today = new Date();
                      const yesterday = new Date();
                      yesterday.setDate(yesterday.getDate() - 1);

                      if (
                        postDate.getDate() === today.getDate() &&
                        postDate.getMonth() === today.getMonth() &&
                        postDate.getFullYear() === today.getFullYear()
                      ) {
                        return `Today, ${postDate.toLocaleTimeString()}`;
                      } else if (
                        postDate.getDate() === yesterday.getDate() &&
                        postDate.getMonth() === yesterday.getMonth() &&
                        postDate.getFullYear() === yesterday.getFullYear()
                      ) {
                        return "Yesterday";
                      }
                      return postDate.toLocaleDateString();
                    })()}
                  </span>
                </div>
                <div style={{ marginTop: "5px", color: "#444" }}>
                  {post.content}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  borderTop: "1px solid #eee",
                  paddingTop: "15px",
                }}
              >
                <button
                  onClick={() => handleLike(post.messageid)}
                  style={{
                    padding: "8px 15px",
                    backgroundColor: "#f8f9fa",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  👍 {post.likeCount || 0}
                </button>
                <button
                  onClick={() =>
                    setActivePost(
                      activePost === post.messageid ? null : post.messageid
                    )
                  }
                  style={{
                    padding: "8px 15px",
                    backgroundColor: "#f8f9fa",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  💬 {post.comments?.length || 0}
                </button>
              </div>

              {activePost === post.messageid && (
                <div
                  style={{
                    marginTop: "15px",
                    borderTop: "1px solid #eee",
                    paddingTop: "15px",
                  }}
                >
                  {post.comments?.length > 0 ? (
                    post.comments.map((comment) => (
                      <div
                        key={comment.commentid}
                        style={{
                          padding: "10px",
                          marginBottom: "10px",
                          backgroundColor: "#f9f9f9",
                          borderRadius: "6px",
                        }}
                      >
                        <strong style={{ color: "#333" }}>
                          {comment.username}
                        </strong>
                        <p style={{ margin: "5px 0 0", color: "#555" }}>
                          {comment.content}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: "#666", textAlign: "center" }}>
                      No comments yet
                    </p>
                  )}
                  <div
                    style={{ display: "flex", gap: "10px", marginTop: "15px" }}
                  >
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      style={{
                        flex: 1,
                        padding: "10px",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                      }}
                    />
                    <button
                      onClick={() => handleComment(post.messageid)}
                      style={{
                        padding: "10px 15px",
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Add Comment
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div
            style={{
              backgroundColor: "white",
              padding: "40px 20px",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              textAlign: "center",
              color: "#666",
            }}
          >
            No posts yet. Be the first to post something!
          </div>
        )}
      </div>
    </div>
  );
}