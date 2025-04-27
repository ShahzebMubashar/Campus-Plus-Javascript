import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import "./RoomView.css";

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
    <div className="room-view-container">
      <Sidebar room={room} onBack={onBack} onLeave={handleLeaveRoom} />
      <div className="main-content">
        <div className="room-header">
          <div className="room-info">
            <h1>{room.roomname}</h1>
            <p>{room.description}</p>
          </div>
          <div className="room-actions">
            {userRole === "Admin" && (
              <>
                <button className="edit-button" onClick={() => setIsEditingRoom(true)}>
                  Edit Room
                </button>
                <button className="delete-button" onClick={handleDeleteRoom}>
                  Delete Room
                </button>
              </>
            )}
          </div>
        </div>

        <div className="search-section">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <input
            type="text"
            placeholder="Search by username..."
            value={searchUsername}
            onChange={(e) => setSearchUsername(e.target.value)}
            className="search-input"
          />
          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            className="search-input"
          />
          <button className="search-button" onClick={handleSearch}>
            Search
          </button>
        </div>

        <div className="create-post-section">
          <textarea
            placeholder="Write a post..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            className="post-input"
          />
          <button className="post-button" onClick={handleCreatePost}>
            Post
          </button>
        </div>

        <div className="posts-container">
          {posts.length === 0 ? (
            <div className="no-posts">
              <p>No posts yet. Be the first to post!</p>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.messageid} className="post-card">
                <div className="post-header">
                  <div className="post-user">
                    <img
                      src={`https://ui-avatars.com/api/?name=${post.username}&background=2196f3&color=fff`}
                      alt="User Avatar"
                      className="user-avatar"
                    />
                    <span className="username">{post.username}</span>
                  </div>
                  <div className="post-actions">
                    {userRole === "Admin" && (
                      <button
                        className="pin-button"
                        onClick={() => handlePinPost(post.messageid)}
                      >
                        {post.is_pinned ? "Unpin" : "Pin"}
                      </button>
                    )}
                    {userRole === "Admin" && (
                      <button
                        className="delete-button"
                        onClick={() => handleDeletePost(post.messageid)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
                <div className="post-content">{post.content}</div>
                <div className="post-footer">
                  <button
                    className="like-button"
                    onClick={() => handleLike(post.messageid)}
                  >
                    Like ({post.likes || 0})
                  </button>
                  <button
                    className="comment-button"
                    onClick={() => handleComment(post.messageid)}
                  >
                    Comment
                  </button>
                  <button
                    className="share-button"
                    onClick={() => handleSharePost(post)}
                  >
                    Share
                  </button>
                </div>
                {activePost === post.messageid && (
                  <div className="comment-section">
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="comment-input"
                    />
                    <button
                      className="comment-submit"
                      onClick={() => handleComment(post.messageid)}
                    >
                      Post Comment
                    </button>
                    {post.comments?.map((comment) => (
                      <Comment
                        key={comment.commentid}
                        comment={comment}
                        room={room}
                        fetchPosts={fetchPosts}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}