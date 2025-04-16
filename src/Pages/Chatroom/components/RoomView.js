import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

export default function RoomView({ room, onBack, onLeave }) {
  const [posts, setPosts] = useState([]);
  const [activePost, setActivePost] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [newPost, setNewPost] = useState("");
  const [showCreateRoomForm, setShowCreateRoomForm] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomDescription, setNewRoomDescription] = useState("");

  useEffect(() => {
    fetchPosts();
  }, [room.roomid]);

  const fetchPosts = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/Chatrooms/messages/${room.roomid}`,
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data && data.messages && Array.isArray(data.messages)) {
          setPosts(data.messages);
        } else if (Array.isArray(data)) {
          setPosts(data);
        } else {
          setPosts([]);
          console.error("Unexpected post data format");
        }
      } else {
        console.error("Failed to fetch posts");
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
            onClick={() => setShowCreateRoomForm(true)}
            style={{
              padding: "10px 15px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              marginRight: "10px",
              fontSize: "16px",
            }}
          >
            ➕ Create Room
          </button>

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

      {/* Create Room Modal */}
      {showCreateRoomForm && (
        <div
          style={{
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
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "25px",
              borderRadius: "8px",
              width: "450px",
              maxWidth: "90%",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            }}
          >
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
                fontSize: "16px",
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
                fontSize: "16px",
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <button
                onClick={() => setShowCreateRoomForm(false)}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "16px",
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
                  fontSize: "16px",
                }}
              >
                Create Room
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Room Info Section */}
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          marginBottom: "20px",
        }}
      >
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
          <p style={{ color: "#555", lineHeight: "1.5" }}>{room.description}</p>
        </div>
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
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <span style={{ fontWeight: "bold", color: "#333" }}>
                  {post.username}
                </span>
                <span style={{ color: "#666" }}>
                  {new Date(post.posted_at).toLocaleString()}
                </span>
              </div>

              <div
                style={{
                  marginBottom: "15px",
                  color: "#444",
                  lineHeight: "1.5",
                }}
              >
                {post.content}
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
