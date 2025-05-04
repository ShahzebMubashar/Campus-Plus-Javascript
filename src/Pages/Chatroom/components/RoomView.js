import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./RoomView.css";
import Sidebar from "./Sidebar";

// Modern blue theme color constants
const colors = {
  primary: "#1976d2",
  primaryLight: "#42a5f5",
  primaryDark: "#0d47a1",
  secondary: "#e3f2fd",
  accent: "#2196f3",
  textPrimary: "#263238",
  textSecondary: "#546e7a",
  background: "#f5f9fc",
  cardBg: "#ffffff",
  border: "#e1e8ed",
  success: "#4caf50",
  danger: "#f44336",
  warning: "#ff9800",
  pending: "#78909c",
  pinned: "#bbdefb",
};

const Comment = ({ comment, level = 0, room, fetchPosts }) => {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleReply = async () => {
    if (replyText.trim()) {
      try {
        console.log(room.roomid, comment.messageid, comment.commentid);
        const response = await fetch(
          `http://localhost:4000/Chatrooms/reply/${room.roomid}/${comment.commentid}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ content: replyText }),
            credentials: "include",
          }
        );

        if (response.ok) {
          setReplyText("");
          setShowReplyBox(false);
          fetchPosts();
        } else {
          console.error("Failed to add reply");
        }
      } catch (error) {
        console.error("Error adding reply:", error);
      }
    }
  };

  return (
    <div
      style={{
        padding: "14px",
        marginBottom: "12px",
        backgroundColor: colors.cardBg,
        borderRadius: "8px",
        marginLeft: `20px`,
        borderLeft: `3px solid ${colors.primaryLight}`,
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <strong style={{ color: colors.textPrimary }}>
          {comment.username}
        </strong>
        <span style={{ color: colors.textSecondary, fontSize: "12px" }}>
          {new Date(comment.posted_at).toLocaleString()}
        </span>
      </div>
      <p style={{ margin: "8px 0 0", color: colors.textPrimary }}>
        {comment.content}
      </p>
      <div style={{ marginTop: "8px" }}>
        <button
          onClick={() => setShowReplyBox(!showReplyBox)}
          style={{
            padding: "2px 8px",
            backgroundColor: "#f0f0f0",
            border: "1px solid #ddd",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "12px",
          }}
        >
          Reply
        </button>
      </div>
      {showReplyBox && (
        <div style={{ marginTop: "10px" }}>
          <input
            type="text"
            placeholder="Write a reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              marginBottom: "5px",
            }}
          />
          <button
            onClick={handleReply}
            style={{
              padding: "5px 10px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            Post Reply
          </button>
        </div>
      )}
      {comment.replies?.map((reply) => (
        <Comment
          key={reply.commentid}
          comment={reply}
          level={level + 1}
          room={room}
          fetchPosts={fetchPosts}
        />
      ))}
    </div>
  );
};

export default function RoomView({ room, onBack, onLeave }) {
  const [posts, setPosts] = useState([]);
  const [activePost, setActivePost] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [newPost, setNewPost] = useState("");
  const [isEditingRoom, setIsEditingRoom] = useState(false);
  const [editedRoomName, setEditedRoomName] = useState(room.name);
  const [editedRoomDescription, setEditedRoomDescription] = useState(
    room.description
  );
  const [userRole, setUserRole] = useState("");
  const [userid, setUserid] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchUsername, setSearchUsername] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [joinedRooms, setJoinedRooms] = useState([]);

  // Button styles for reusability
  const buttonStyles = {
    primary: {
      padding: "10px 16px",
      backgroundColor: colors.primary,
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "500",
      transition: "background-color 0.2s, transform 0.1s",
      boxShadow: "0 2px 4px rgba(25, 118, 210, 0.2)",
    },
    secondary: {
      padding: "10px 16px",
      backgroundColor: colors.secondary,
      color: colors.primary,
      border: `1px solid ${colors.border}`,
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "500",
      transition: "background-color 0.2s, transform 0.1s",
    },
    danger: {
      padding: "10px 16px",
      backgroundColor: colors.danger,
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "500",
      transition: "background-color 0.2s, transform 0.1s",
      boxShadow: "0 2px 4px rgba(244, 67, 54, 0.2)",
    },
    success: {
      padding: "10px 16px",
      backgroundColor: colors.success,
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "500",
      transition: "background-color 0.2s, transform 0.1s",
      boxShadow: "0 2px 4px rgba(76, 175, 80, 0.2)",
    },
    iconBtn: {
      padding: "8px 12px",
      backgroundColor: "transparent",
      color: colors.textSecondary,
      border: `1px solid ${colors.border}`,
      borderRadius: "6px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      fontSize: "14px",
      transition: "background-color 0.2s, color 0.2s",
    },
  };

  // Card container styles
  const cardStyles = {
    container: {
      backgroundColor: colors.cardBg,
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      marginBottom: "20px",
      border: `1px solid ${colors.border}`,
    },
  };

  // Input styles
  const inputStyles = {
    standard: {
      width: "100%",
      padding: "12px 14px",
      border: `1px solid ${colors.border}`,
      borderRadius: "6px",
      fontSize: "15px",
      transition: "border-color 0.2s, box-shadow 0.2s",
      outline: "none",
    },
  };

  useEffect(() => {
    fetchUserInfo();
    fetchJoinedRooms();
    fetchPosts();
  }, [room.roomid]);

  const fetchUserInfo = async () => {
    try {
      const response = await fetch("http://localhost:4000/auth/user-info", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setUserInfo(data);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const fetchJoinedRooms = async () => {
    try {
      const response = await fetch(
        "http://localhost:4000/Chatrooms/user/groups",
        {
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setJoinedRooms(data);
      }
    } catch (error) {
      console.error("Error fetching joined rooms:", error);
    }
  };

  const handleRoomSelect = async (room) => {
    // If room is not joined, join it first
    if (!joinedRooms.find((r) => r.roomid === room.roomid)) {
      try {
        const response = await fetch(
          `http://localhost:4000/Chatrooms/join/${room.roomid}`,
          {
            method: "POST",
            credentials: "include",
          }
        );
        if (response.ok) {
          await fetchJoinedRooms(); // Refresh joined rooms list
        }
      } catch (error) {
        console.error("Error joining room:", error);
        return;
      }
    }

  };

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
          // Sort posts: pinned posts first, then by posted_at
          const sortedPosts = data.messages.sort((a, b) => {
            if (a.is_pinned && !b.is_pinned) return -1;
            if (!a.is_pinned && b.is_pinned) return 1;
            return new Date(b.posted_at) - new Date(a.posted_at);
          });
          setPosts(sortedPosts);
        } else if (Array.isArray(data)) {
          // Sort posts: pinned posts first, then by posted_at
          const sortedPosts = data.sort((a, b) => {
            if (a.is_pinned && !b.is_pinned) return -1;
            if (!a.is_pinned && b.is_pinned) return 1;
            return new Date(b.posted_at) - new Date(a.posted_at);
          });
          setPosts(sortedPosts);
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

  const handleComment = async (postId, parentReplyId = null) => {
    console.log(postId);
    if (newComment.trim()) {
      try {
        const response = await fetch(
          `http://localhost:4000/Chatrooms/reply1/${room.roomid}/${postId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: newComment,
              parentReplyId: parentReplyId, // can be null or an integer
            }),
            credentials: "include",
          }
        );

        if (response.ok) {
          setNewComment("");
          fetchPosts(); // reload the posts and replies
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

  const handleProcessPost = async (messageid, status) => {
    try {
      const response = await fetch(
        `http://localhost:4000/Chatrooms/process/${room.roomid}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ messageid, status }),
          credentials: "include",
        }
      );

      if (response.ok) {
        fetchPosts();
      } else {
        console.error("Failed to process post");
      }
    } catch (error) {
      console.error("Error processing post:", error);
    }
  };

  const handleDeletePost = async (messageid) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        const response = await fetch(
          `http://localhost:4000/Chatrooms/${room.roomid}/messages/${messageid}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );

        if (response.ok) {
          fetchPosts();
        } else {
          const data = await response.json();
          alert(data.error || "Failed to delete post");
        }
      } catch (error) {
        console.error("Error deleting post:", error);
        alert("Error deleting post");
      }
    }
  };

  const handleSharePost = (post) => {
    const shareUrl = `${window.location.origin}/chatroom/${room.roomid}/messages/${post.messageid}`;

    if (navigator.share) {
      // Use Web Share API if available
      navigator
        .share({
          title: `Post by ${post.username}`,
          text: post.content,
          url: shareUrl,
        })
        .catch((error) => {
          console.error("Error sharing:", error);
          // Fallback to copying to clipboard
          copyToClipboard(shareUrl);
        });
    } else {
      // Fallback to copying to clipboard
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Link copied to clipboard!");
      })
      .catch((error) => {
        console.error("Error copying to clipboard:", error);
        alert("Failed to copy link. Please try again.");
      });
  };

  const handleEditPost = async (messageid, currentContent) => {
    const newContent = prompt("Edit your post:", currentContent);
    if (newContent && newContent !== currentContent) {
      try {
        const response = await fetch(
          `http://localhost:4000/Chatrooms/${room.roomid}/posts/${messageid}/edit`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ content: newContent }),
            credentials: "include",
          }
        );

        if (response.ok) {
          fetchPosts();
        } else {
          const data = await response.json();
          alert(data.error || "Failed to edit post");
        }
      } catch (error) {
        console.error("Error editing post:", error);
        alert("Error editing post");
      }
    }
  };

  const handlePinPost = async (messageid) => {
    try {
      const response = await fetch(
        `http://localhost:4000/Chatrooms/${room.roomid}/posts/${messageid}/pin`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.ok) {
        fetchPosts();
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to pin/unpin post");
      }
    } catch (error) {
      console.error("Error pinning post:", error);
      alert("Error pinning post. Please try again.");
    }
  };

  const handleReportPost = async (messageid) => {
    const reason = prompt("Please enter the reason for reporting this post:");
    if (reason) {
      try {
        const response = await fetch(
          `http://localhost:4000/Chatrooms/posts/${messageid}/report`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ reason }),
            credentials: "include",
          }
        );

        if (response.ok) {
          alert("Post reported successfully");
        } else {
          const data = await response.json();
          alert(data.error || "Failed to report post");
        }
      } catch (error) {
        console.error("Error reporting post:", error);
        alert("Error reporting post");
      }
    }
  };

  const handleSearch = async () => {
    if (!searchQuery && !searchUsername && !searchDate) {
      fetchPosts();
      return;
    }

    setIsSearching(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("keyword", searchQuery);
      if (searchUsername) params.append("username", searchUsername);
      if (searchDate) params.append("date", searchDate);

      const response = await fetch(
        `http://localhost:4000/Chatrooms/search/${
          room.roomid
        }?${params.toString()}`,
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPosts(data.messages);
      } else {
        console.error("Search failed");
      }
    } catch (error) {
      console.error("Error searching posts:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const highlightText = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text.split(regex).map((part, i) =>
      regex.test(part) ? (
        <mark
          key={i}
          style={{
            backgroundColor: colors.primaryLight,
            color: colors.primaryDark,
            padding: "2px 0",
          }}
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: colors.background,
        position: "relative",
        paddingLeft: "280px",
      }}
    >
      <Sidebar
        room={room}
        onBack={onBack}
        onLeave={onLeave}
        userInfo={userInfo}
        rooms={rooms}
        joinedRooms={joinedRooms}
        onRoomSelect={handleRoomSelect}
      />
      {/* Main content */}
      <div
        style={{
          flex: 1,
          padding: "24px",
          backgroundColor: colors.background,
          position: "relative",
          marginLeft: "-220px",
        }}
      >
        {/* Room Header */}
        <div
          style={{
            ...cardStyles.container,
            borderTop: `4px solid ${colors.primary}`,
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h1
              style={{
                margin: 0,
                fontSize: "26px",
                color: colors.primary,
                fontWeight: "600",
              }}
            >
              {room.roomname}
            </h1>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={onBack}
                style={{
                  ...buttonStyles.secondary,
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                Back to Rooms
              </button>
              {userRole === "Admin" && (
                <button
                  onClick={() => setIsEditingRoom(true)}
                  style={{
                    ...buttonStyles.primary,
                  }}
                >
                  Edit Room Info
                </button>
              )}
              <button
                onClick={onLeave}
                style={{
                  ...buttonStyles.danger,
                }}
              >
                Leave Room
              </button>
            </div>
          </div>
          {room.name && (
            <h1
              style={{
                margin: "10px 0 0",
                color: colors.textPrimary,
                fontSize: "24px",
              }}
            >
              {room.name}
            </h1>
          )}
          {room.description && (
            <p
              style={{
                margin: "12px 0 0",
                color: colors.textSecondary,
                lineHeight: "1.5",
              }}
            >
              {room.description}
            </p>
          )}
        </div>

        {/* Add Edit Room Modal */}
        {isEditingRoom && (
          <div
            className="modal-overlay"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 9999,
              backdropFilter: "blur(3px)",
            }}
          >
            <div
              style={{
                backgroundColor: colors.cardBg,
                padding: "28px",
                borderRadius: "12px",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
                width: "90%",
                maxWidth: "500px",
                position: "relative",
                zIndex: 10000,
                border: `1px solid ${colors.border}`,
                borderTop: `4px solid ${colors.primary}`,
              }}
            >
              <h2
                style={{
                  marginTop: 0,
                  marginBottom: "24px",
                  color: colors.primary,
                }}
              >
                Edit Room Information
              </h2>
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    color: colors.textPrimary,
                    fontWeight: "500",
                  }}
                >
                  Room Name
                </label>
                <input
                  type="text"
                  value={editedRoomName}
                  onChange={(e) => setEditedRoomName(e.target.value)}
                  style={{
                    ...inputStyles.standard,
                    marginBottom: "8px",
                  }}
                />
              </div>
              <div style={{ marginBottom: "24px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    color: colors.textPrimary,
                    fontWeight: "500",
                  }}
                >
                  Description
                </label>
                <textarea
                  value={editedRoomDescription}
                  onChange={(e) => setEditedRoomDescription(e.target.value)}
                  style={{
                    ...inputStyles.standard,
                    minHeight: "120px",
                    resize: "vertical",
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  onClick={() => setIsEditingRoom(false)}
                  style={{
                    ...buttonStyles.secondary,
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateRoom}
                  style={{
                    ...buttonStyles.primary,
                  }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search Section */}
        <div
          className="search-section"
          style={{
            ...cardStyles.container,
            marginBottom: "24px",
          }}
        >
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 2,
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "16px"
              }}
            />
            <input
              type="text"
              placeholder="Filter by username..."
              value={searchUsername}
              onChange={(e) => setSearchUsername(e.target.value)}
              style={{
                flex: 1,
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "16px"
              }}
            />
            <input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              style={{
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "16px"
              }}
            />
            <button
              onClick={handleSearch}
              disabled={isSearching}
              style={{
                ...buttonStyles.primary,
                opacity: isSearching ? 0.7 : 1,
              }}
            >
              {isSearching ? "Searching..." : "Search"}
            </button>
            <button
              onClick={() => {
                setSearchQuery("");
                setSearchUsername("");
                setSearchDate("");
                fetchPosts();
              }}
              style={{
                ...buttonStyles.secondary,
              }}
            >
              Clear
            </button>
          </div>
        </div>

        {/* Create Post Section */}
        <div
          style={{
            ...cardStyles.container,
            marginBottom: "24px",
            borderLeft: `4px solid ${colors.primary}`,
          }}
        >
          <div style={{ display: "flex", gap: "12px" }}>
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
                ...buttonStyles.primary,
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span style={{ fontSize: "18px" }}>+</span> Post
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
                  ...cardStyles.container,
                  backgroundColor:
                    post.status === "Pending" ? "#f8fafc" : colors.cardBg,
                  marginBottom: "24px",
                  borderLeft:
                    post.status === "Pending"
                      ? `4px solid ${colors.pending}`
                      : post.is_pinned
                      ? `4px solid ${colors.primary}`
                      : `1px solid ${colors.border}`,
                  position: "relative",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
              >
                <div style={{ marginBottom: "10px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: "600",
                          color: colors.primary,
                          fontSize: "16px",
                        }}
                      >
                        {post.username}
                      </span>
                      {post.is_pinned && (
                        <span
                          style={{
                            backgroundColor: colors.pinned,
                            color: colors.primaryDark,
                            padding: "4px 10px",
                            borderRadius: "12px",
                            fontSize: "12px",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            fontWeight: "500",
                          }}
                        >
                          📌 Pinned
                        </span>
                      )}
                      {post.status === "Pending" && (
                        <span
                          style={{
                            backgroundColor: colors.pending,
                            color: "white",
                            padding: "4px 10px",
                            borderRadius: "12px",
                            fontSize: "12px",
                            fontWeight: "500",
                          }}
                        >
                          Pending
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "12px",
                        alignItems: "center",
                      }}
                    >
                      {post.status === "Pending" &&
                        (userRole === "Admin" || userRole === "Moderator") && (
                          <div style={{ display: "flex", gap: "8px" }}>
                            <button
                              onClick={() =>
                                handleProcessPost(post.messageid, "Approved")
                              }
                              style={{
                                ...buttonStyles.success,
                                padding: "6px 12px",
                                fontSize: "13px",
                              }}
                            >
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                handleProcessPost(post.messageid, "Rejected")
                              }
                              style={{
                                ...buttonStyles.danger,
                                padding: "6px 12px",
                                fontSize: "13px",
                              }}
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      {post.status === "Approved" && userRole === "Admin" && (
                        <button
                          onClick={() => handleDeletePost(post.messageid)}
                          style={{
                            ...buttonStyles.danger,
                            padding: "6px 12px",
                            fontSize: "13px",
                          }}
                        >
                          Delete
                        </button>
                      )}
                      <span
                        style={{
                          color: colors.textSecondary,
                          fontSize: "14px",
                        }}
                      >
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
                  </div>
                  <div
                    style={{
                      marginTop: "12px",
                      color: colors.textPrimary,
                      fontSize: "15px",
                      lineHeight: "1.5",
                    }}
                  >
                    {highlightText(post.content, searchQuery)}
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
                      ...buttonStyles.iconBtn,
                      backgroundColor:
                        activePost === post.messageid
                          ? colors.secondary
                          : "transparent",
                      color:
                        activePost === post.messageid
                          ? colors.primary
                          : colors.textSecondary,
                    }}
                  >
                    💬 {post.comments?.length || 0}
                  </button>
                  {post.status === "Approved" && (
                    <button
                      onClick={() => handleSharePost(post)}
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
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                        <polyline points="16 6 12 2 8 6"></polyline>
                        <line x1="12" y1="2" x2="12" y2="15"></line>
                      </svg>
                      Share
                    </button>
                  )}
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
                        <Comment
                          key={comment.commentid}
                          comment={comment}
                          room={room}
                          fetchPosts={fetchPosts}
                        />
                      ))
                    ) : (
                      <p
                        style={{
                          color: colors.textSecondary,
                          textAlign: "center",
                          padding: "16px",
                        }}
                      >
                        No comments yet
                      </p>
                    )}
                    <div
                      style={{
                        display: "flex",
                        gap: "12px",
                        marginTop: "16px",
                      }}
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
                          ...buttonStyles.primary,
                        }}
                      >
                        Add Comment
                      </button>
                    </div>
                  </div>
                )}

                {post.status === "Approved" && (
                  <div
                    style={{ display: "flex", gap: "10px", marginTop: "16px" }}
                  >
                    {(userRole === "Admin" || post.userid === userid) && (
                      <button
                        onClick={() =>
                          handleEditPost(post.messageid, post.content)
                        }
                        style={{
                          padding: "5px 10px",
                          backgroundColor: "#f8f9fa",
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
                      >
                        ✏️ Edit
                      </button>
                    )}
                    {(userRole === "Admin" || userRole === "Moderator") && (
                      <button
                        onClick={() => handlePinPost(post.messageid)}
                        style={{
                          ...buttonStyles.iconBtn,
                          padding: "4px 10px",
                          fontSize: "13px",
                          backgroundColor: post.is_pinned
                            ? colors.pinned
                            : "transparent",
                          color: post.is_pinned
                            ? colors.primaryDark
                            : colors.textSecondary,
                        }}
                      >
                        📌 {post.is_pinned ? "Unpin" : "Pin"}
                      </button>
                    )}
                    <button
                      onClick={() => handleReportPost(post.messageid)}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#f8f9fa",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "12px",
                      }}
                    >
                      ⚠️ Report
                    </button>
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
              {isSearching ? (
                <p style={{ fontSize: "16px" }}>No matching posts found</p>
              ) : (
                <div>
                  <p
                    style={{
                      fontSize: "18px",
                      marginBottom: "12px",
                      color: colors.primary,
                    }}
                  >
                    No posts yet
                  </p>
                  <p style={{ fontSize: "16px" }}>
                    Be the first to post something!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
