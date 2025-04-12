import React, { useState, useEffect } from 'react';
import "../css/RoomView.css";
import { Navigate, redirect } from 'react-router-dom';

export default function RoomView({ room, onBack, onLeave }) {
    const [posts, setPosts] = useState([]);
    const [activePost, setActivePost] = useState(null);
    const [newComment, setNewComment] = useState("");
    const [newPost, setNewPost] = useState("");
    const [likeCount, setLikeCount] = useState(0);

    useEffect(() => {
        fetchPosts();
    }, [room.roomid]);

    const fetchPosts = async () => {
        try {
            const response = await fetch(`http://localhost:4000/Chatrooms/messages/${room.roomid}`, {
                credentials: "include",
            });

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
                const response = await fetch(`http://localhost:4000/Chatrooms/${room.roomid}/messages`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ message: newPost }),
                    credentials: "include",
                });
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

    const handleLike = async (postId) => {
        if (!postId) return;

        try {
            const response = await fetch(`http://localhost:4000/Chatrooms/like/${postId}`, {
                method: "POST",
                credentials: "include",
            });

            if (response.ok) {
                const likeCountResponse = await fetch(`http://localhost:4000/Chatrooms/likes/${postId}`, {
                    credentials: "include",
                });

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
                const response = await fetch(`http://localhost:4000/Chatrooms/reply/${room.roomid}/${postId}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ message: newComment }),
                    credentials: "include",
                });

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

    const handleShare = (postId) => {
        console.log("Shared post:", postId);
    };

    const handleLeaveRoom = async () => {
        const confirmLeave = window.confirm("Are you sure you want to leave this room?");
        if (confirmLeave) {
            const response = await fetch(`http://localhost:4000/Chatrooms/leave/${room.roomid}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (response.ok) {
                console.log("Left room successfully");
                window.location.reload();
            }else {
                console.error("Failed to leave room");
            }
        }
    };

    return (
        <div className="room-view">
            <div className="room-view-header">
                <button className="back-button" onClick={onBack}>← Back to Rooms</button>
                <button className="leave-button" onClick={handleLeaveRoom}>🚪 Leave Room</button>
            </div>

            <div className="room-header">
                <h1>{room.roomname}</h1>
                <div className="room-stats">
                    <span>Created {new Date(room.created_at).toLocaleDateString()}</span>
                </div>
            </div>

            <div className="room-info-section">
                <div className="room-description-box">
                    <h2>About</h2>
                    <p>{room.description}</p>
                </div>
            </div>

            <div className="create-post-section">
                <input
                    type="text"
                    placeholder="What's on your mind?"
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                />
                <button onClick={handleCreatePost}>Post</button>
            </div>

            <div className="posts-section">
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <div key={post.messageid} className="post-card">
                            <div className="post-header">
                                <span className="post-author">{post.username}</span>
                                <span className="post-date">{new Date(post.posted_at).toLocaleString()}</span>
                            </div>

                            <div className="post-content">{post.content}</div>

                            <div className="post-actions">
                                <button onClick={() => handleLike(post.messageid)}>👍 {post.likeCount || 0}</button>
                                <button onClick={() => setActivePost(post.messageid)}>💬 {post.comments?.length || 0}</button>
                                <button onClick={() => handleShare(post.messageid)}>Share</button>
                            </div>

                            {activePost === post.messageid && (
                                <div className="comments-section">
                                    {post.comments?.length > 0 ? (
                                        post.comments.map((comment) => (
                                            <div key={comment.commentid} className="comment">
                                                <strong>{comment.username}</strong>
                                                <p>{comment.content}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No comments yet</p>
                                    )}
                                    <div className="add-comment">
                                        <input
                                            type="text"
                                            placeholder="Write a comment..."
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                        />
                                        <button onClick={() => handleComment(post.messageid)}>Add Comment</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No posts yet.</p>
                )}
            </div>
        </div>
    );
}
