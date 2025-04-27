import React, { useState, useEffect } from "react";
import Sidebar from './Sidebar';
import './Sidebar.css';

const Comment = ({ comment, level = 0, room, fetchPosts }) => {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleReply = async () => {
    if (replyText.trim()) {
      try {
        const response = await fetch(
          `http://localhost:4000/Chatrooms/reply/${room.roomid}/${comment.messageid || comment.commentid}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: replyText }),
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
        padding: "10px",
        marginBottom: "10px",
        backgroundColor: "#f9f9f9",
        borderRadius: "6px",
        marginLeft: `${level * 20}px`,
        borderLeft: "3px solid #e0e0e0",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <strong style={{ color: "#333" }}>{comment.username}</strong>
        <span style={{ color: "#666", fontSize: "12px" }}>
          {new Date(comment.posted_at).toLocaleString()}
        </span>
      </div>
      <p style={{ margin: "5px 0 0", color: "#555" }}>{comment.content}</p>
      <div style={{ marginTop: "5px" }}>
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
  const [editedRoomName, setEditedRoomName] = useState(room.roomname);
  const [editedRoomDescription, setEditedRoomDescription] = useState(
    room.description
  );
  const [userRole, setUserRole] = useState("");
  const [userid, setUserid] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchUsername, setSearchUsername] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchUserInfo();
    fetchPosts();
  }, [room.roomid]);

  const fetchUserInfo = async () => {
    try {
      const response = await fetch("http://localhost:4000/auth/user-info", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setUserid(data.userid);
        setUserRole(data.role);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const trackPostView = async (messageid) => {
    try {
      await fetch(
        `http://localhost:4000/Chatrooms/posts/${messageid}/view`,
        {
          method: "POST",
          credentials: "include",
        }
      );
    } catch (error) {
      console.error("Error tracking post view:", error);
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
      navigator.share({
        title: `Post by ${post.username}`,
        text: post.content,
        url: shareUrl,
      }).catch((error) => {
        console.error('Error sharing:', error);
        // Fallback to copying to clipboard
        copyToClipboard(shareUrl);
      });
    } else {
      // Fallback to copying to clipboard
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Link copied to clipboard!');
    }).catch((error) => {
      console.error('Error copying to clipboard:', error);
      alert('Failed to copy link. Please try again.');
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
      if (searchQuery) params.append('keyword', searchQuery);
      if (searchUsername) params.append('username', searchUsername);
      if (searchDate) params.append('date', searchDate);

      const response = await fetch(
        `http://localhost:4000/Chatrooms/search/${room.roomid}?${params.toString()}`,
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
    const regex = new RegExp(`(${query})`, 'gi');
    return text.split(regex).map((part, i) =>
      regex.test(part) ? <mark key={i}>{part}</mark> : part
    );
  };

  useEffect(() => {
    if (activePost) {
      trackPostView(activePost);
    }
  }, [activePost]);

  return (
    <div style={{
      display: "flex",
      minHeight: "calc(100vh - 90px)",
      backgroundColor: "#f8fafc",
      position: "relative",
      paddingLeft: "280px",
      marginTop: "90px"
    }}>
      <Sidebar room={room} onBack={onBack} onLeave={onLeave} />

      {/* Main Content */}
      <div style={{
        flex: 1,
        padding: "30px",
        maxWidth: "1200px",
        margin: "0 auto",
        width: "100%"
      }}>
        {/* Room Header */}
        <div style={{
          background: "white",
          padding: "25px",
          borderRadius: "20px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          marginBottom: "25px"
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "20px"
          }}>
            <div style={{
              flex: 1,
              display: "flex",
              alignItems: "flex-start",
              gap: "20px"
            }}>
              <div style={{
                width: "70px",
                height: "70px",
                borderRadius: "18px",
                overflow: "hidden",
                flexShrink: 0,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
              }}>
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(room.roomname)}&background=2196f3&color=fff`}
                  alt={room.roomname}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              {isEditingRoom ? (
                <div style={{ flex: 1 }}>
                  <input
                    type="text"
                    value={editedRoomName}
                    onChange={(e) => setEditedRoomName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      fontSize: "1.5rem",
                      fontWeight: "600",
                      border: "1px solid #e3e8f8",
                      borderRadius: "12px",
                      marginBottom: "10px",
                      color: "#1a237e"
                    }}
                  />
                  <textarea
                    value={editedRoomDescription}
                    onChange={(e) => setEditedRoomDescription(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      fontSize: "1rem",
                      border: "1px solid #e3e8f8",
                      borderRadius: "12px",
                      minHeight: "80px",
                      resize: "vertical",
                      color: "#64748b",
                      lineHeight: "1.5"
                    }}
                  />
                </div>
              ) : (
                <div style={{ flex: 1 }}>
                  <h1 style={{
                    margin: "0 0 10px 0",
                    color: "#1a237e",
                    fontSize: "1.8rem",
                    fontWeight: "600",
                    lineHeight: "1.3"
                  }}>{room.roomname}</h1>
                  <p style={{
                    margin: "0",
                    color: "#64748b",
                    fontSize: "1rem",
                    lineHeight: "1.5"
                  }}>{room.description}</p>
                </div>
              )}
            </div>
            <div style={{
              display: "flex",
              gap: "10px",
              marginLeft: "20px"
            }}>
              <button
                onClick={onBack}
                style={{
                  padding: "10px 20px",
                  background: "#f8faff",
                  border: "1px solid #e3e8f8",
                  borderRadius: "12px",
                  color: "#1a237e",
                  cursor: "pointer",
                  fontSize: "0.95rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  transition: "all 0.2s ease"
                }}
              >
                ← Back to Rooms
              </button>
              {userRole === "Admin" && (
                <>
                  {isEditingRoom ? (
                    <>
                      <button
                        onClick={handleUpdateRoom}
                        style={{
                          padding: "10px 20px",
                          background: "#2196f3",
                          border: "none",
                          borderRadius: "12px",
                          color: "white",
                          cursor: "pointer",
                          fontSize: "0.95rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px"
                        }}
                      >
                        💾 Save Changes
                      </button>
                      <button
                        onClick={() => setIsEditingRoom(false)}
                        style={{
                          padding: "10px 20px",
                          background: "#f8faff",
                          border: "1px solid #e3e8f8",
                          borderRadius: "12px",
                          color: "#666",
                          cursor: "pointer",
                          fontSize: "0.95rem"
                        }}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setIsEditingRoom(true)}
                        style={{
                          padding: "10px 20px",
                          background: "#f8faff",
                          border: "1px solid #e3e8f8",
                          borderRadius: "12px",
                          color: "#1a237e",
                          cursor: "pointer",
                          fontSize: "0.95rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px"
                        }}
                      >
                        ✏️ Edit Room
                      </button>
                      <button
                        onClick={handleDeleteRoom}
                        style={{
                          padding: "10px 20px",
                          background: "#fff2f2",
                          border: "1px solid #ffcdd2",
                          borderRadius: "12px",
                          color: "#d32f2f",
                          cursor: "pointer",
                          fontSize: "0.95rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px"
                        }}
                      >
                        🗑️ Delete Room
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            color: "#64748b",
            fontSize: "0.9rem",
            borderTop: "1px solid #e3e8f8",
            paddingTop: "15px",
            marginTop: "5px"
          }}>
            <span>{room.member_count || 0} members</span>
          </div>
        </div>

        {/* Search Section */}
        <div className="search-section" style={{
          background: "white",
          padding: "25px",
          borderRadius: "20px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          marginBottom: "25px"
        }}>
          <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 2,
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
            <input
              type="text"
              placeholder="Filter by username..."
              value={searchUsername}
              onChange={(e) => setSearchUsername(e.target.value)}
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
            <input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              style={{
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
            <button
              onClick={handleSearch}
              disabled={isSearching}
              style={{
                padding: "15px 30px",
                background: "#2196f3",
                color: "white",
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                fontSize: "0.95rem",
                transition: "all 0.2s ease",
                opacity: isSearching ? 0.7 : 1,
                ':hover': {
                  background: "#1976d2"
                }
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
                padding: "15px 30px",
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
              Clear
            </button>
          </div>
        </div>

        {/* Create Post Section */}
        <div style={{
          background: "white",
          padding: "25px",
          borderRadius: "20px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          marginBottom: "25px"
        }}>
          <div style={{ display: "flex", gap: "15px" }}>
            <input
              type="text"
              placeholder="What's on your mind?"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
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
            <button
              onClick={handleCreatePost}
              style={{
                padding: "15px 30px",
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
                  background: "white",
                  padding: "25px",
                  borderRadius: "20px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                  marginBottom: "25px",
                  border: post.is_pinned ? "2px solid #2196f3" : "none",
                  position: "relative"
                }}
              >
                <div style={{ marginBottom: "15px" }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "15px"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "12px",
                        overflow: "hidden"
                      }}>
                        <img
                          src={`https://ui-avatars.com/api/?name=${post.username}&background=2196f3&color=fff`}
                          alt="User Avatar"
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                      <div>
                        <span style={{ fontWeight: "600", color: "#1a237e" }}>
                          {post.username}
                        </span>
                        {post.is_pinned && (
                          <span style={{
                            marginLeft: "10px",
                            padding: "4px 10px",
                            background: "#e3f2fd",
                            color: "#2196f3",
                            borderRadius: "8px",
                            fontSize: "0.8rem",
                            fontWeight: "500"
                          }}>
                            📌 Pinned
                          </span>
                        )}
                        {post.status === "Pending" && (
                          <span style={{
                            marginLeft: "10px",
                            padding: "4px 10px",
                            background: "#fff3e0",
                            color: "#ff9800",
                            borderRadius: "8px",
                            fontSize: "0.8rem",
                            fontWeight: "500"
                          }}>
                            Pending
                          </span>
                        )}
                      </div>
                    </div>
                    <span style={{ color: "#666", fontSize: "0.9rem" }}>
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
                  <div style={{
                    color: "#333",
                    fontSize: "0.95rem",
                    lineHeight: "1.6",
                    marginTop: "10px"
                  }}>
                    {highlightText(post.content, searchQuery)}
                  </div>
                </div>

                <div style={{
                  display: "flex",
                  gap: "12px",
                  borderTop: "1px solid #e3e8f8",
                  paddingTop: "20px"
                }}>
                  <button
                    onClick={() => handleLike(post.messageid)}
                    style={{
                      padding: "10px 20px",
                      background: "#f8faff",
                      border: "1px solid #e3e8f8",
                      borderRadius: "10px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      transition: "all 0.2s ease",
                      ':hover': {
                        background: "#e3e8f8"
                      }
                    }}
                  >
                    👍 {post.likeCount || 0}
                  </button>
                  <button
                    onClick={() => setActivePost(activePost === post.messageid ? null : post.messageid)}
                    style={{
                      padding: "10px 20px",
                      background: "#f8faff",
                      border: "1px solid #e3e8f8",
                      borderRadius: "10px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      transition: "all 0.2s ease",
                      ':hover': {
                        background: "#e3e8f8"
                      }
                    }}
                  >
                    💬 {post.comments?.length || 0}
                  </button>
                  {post.status === "Approved" && (
                    <button
                      onClick={() => handleSharePost(post)}
                      style={{
                        padding: "10px 20px",
                        background: "#f8faff",
                        border: "1px solid #e3e8f8",
                        borderRadius: "10px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        transition: "all 0.2s ease",
                        ':hover': {
                          background: "#e3e8f8"
                        }
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                        <polyline points="16 6 12 2 8 6"></polyline>
                        <line x1="12" y1="2" x2="12" y2="15"></line>
                      </svg>
                      Share
                    </button>
                  )}

                  {post.status === "Approved" && (
                    <div style={{
                      marginLeft: "auto",
                      display: "flex",
                      gap: "8px"
                    }}>
                      {(userRole === "Admin" || post.userid === userid) && (
                        <button
                          onClick={() => handleEditPost(post.messageid, post.content)}
                          style={{
                            padding: "10px 20px",
                            background: "#f8faff",
                            border: "1px solid #e3e8f8",
                            borderRadius: "10px",
                            cursor: "pointer",
                            fontSize: "0.9rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            transition: "all 0.2s ease",
                            ':hover': {
                              background: "#e3e8f8"
                            }
                          }}
                        >
                          ✏️ Edit
                        </button>
                      )}
                      {(userRole === "Admin" || userRole === "Moderator") && (
                        <button
                          onClick={() => handlePinPost(post.messageid)}
                          style={{
                            padding: "10px 20px",
                            background: post.is_pinned ? "#e3f2fd" : "#f8faff",
                            border: `1px solid ${post.is_pinned ? "#2196f3" : "#e3e8f8"}`,
                            color: post.is_pinned ? "#2196f3" : "inherit",
                            borderRadius: "10px",
                            cursor: "pointer",
                            fontSize: "0.9rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            transition: "all 0.2s ease",
                            ':hover': {
                              background: post.is_pinned ? "#bbdefb" : "#e3e8f8"
                            }
                          }}
                        >
                          📌 {post.is_pinned ? "Unpin" : "Pin"}
                        </button>
                      )}
                      <button
                        onClick={() => handleReportPost(post.messageid)}
                        style={{
                          padding: "10px 20px",
                          background: "#f8faff",
                          border: "1px solid #e3e8f8",
                          borderRadius: "10px",
                          cursor: "pointer",
                          fontSize: "0.9rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          transition: "all 0.2s ease",
                          ':hover': {
                            background: "#e3e8f8"
                          }
                        }}
                      >
                        ⚠️ Report
                      </button>
                    </div>
                  )}
                </div>

                {activePost === post.messageid && (
                  <div style={{
                    marginTop: "20px",
                    borderTop: "1px solid #e3e8f8",
                    paddingTop: "20px"
                  }}>
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
                      <p style={{
                        color: "#666",
                        textAlign: "center",
                        fontSize: "0.9rem",
                        margin: "20px 0"
                      }}>
                        No comments yet
                      </p>
                    )}
                    <div style={{
                      display: "flex",
                      gap: "12px",
                      marginTop: "20px"
                    }}>
                      <input
                        type="text"
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        style={{
                          flex: 1,
                          padding: "12px 20px",
                          border: "1px solid #e3e8f8",
                          borderRadius: "10px",
                          fontSize: "0.95rem",
                          backgroundColor: "#f8faff",
                          transition: "all 0.2s ease",
                          ':focus': {
                            borderColor: "#2196f3",
                            boxShadow: "0 0 0 3px rgba(33,150,243,0.1)"
                          }
                        }}
                      />
                      <button
                        onClick={() => handleComment(post.messageid)}
                        style={{
                          padding: "12px 25px",
                          background: "#2196f3",
                          color: "white",
                          border: "none",
                          borderRadius: "10px",
                          cursor: "pointer",
                          fontSize: "0.95rem",
                          transition: "all 0.2s ease",
                          ':hover': {
                            background: "#1976d2"
                          }
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
            <div style={{
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
                📝
              </div>
              <h3 style={{
                color: "#1a237e",
                fontSize: "1.2rem",
                marginBottom: "10px"
              }}>
                {isSearching ? "No matching posts found" : "No posts yet"}
              </h3>
              <p style={{
                color: "#666",
                fontSize: "0.95rem"
              }}>
                {isSearching ? "Try adjusting your search criteria" : "Be the first to post something!"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}