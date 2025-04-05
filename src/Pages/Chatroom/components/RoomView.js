import React, { useState, useEffect } from 'react';
import "../css/RoomView.css";

export default function RoomView({ room, onBack }) {
    const [posts, setPosts] = useState([]);
    const [activePost, setActivePost] = useState(null);
    const [newComment, setNewComment] = useState("");
    const [newPost, setNewPost] = useState("");
    const [likeCount, setLikeCount] = useState(0);

    // Fetch posts whenever the room changes
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
                console.log("Fetched posts:", data);

                // Ensure posts data is in the correct format
                if (data && data.messages && Array.isArray(data.messages)) {
                    setPosts(data.messages);  // Set the state with the message data
                } else if (Array.isArray(data)) {
                    setPosts(data);
                } else {
                    console.error("No messages data found or incorrect format");
                    setPosts([]);  // Clear the posts if format is wrong
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
                    setNewPost("");  // Clear post input
                    fetchPosts();  // Refresh posts after creating a new post
                } else {
                    console.error("Failed to create post");
                }
            } catch (error) {
                console.error("Error creating post:", error);
            }
        }
    };


    const handleLike = async (postId) => {
        if (!postId) {
            console.error('Post ID is undefined!');
            return;
        }

        try {
            // Send the like request to the backend
            const response = await fetch(`http://localhost:4000/Chatrooms/like/${postId}`, {
                method: "POST",
                credentials: "include",  // Ensure the session is sent with the request
            });

            if (response.ok) {
                // After liking the post, fetch the updated like count for that post
                const likeCountResponse = await fetch(`http://localhost:4000/Chatrooms/likes/${postId}`, {
                    credentials: "include",  // Include the session cookie with the request
                });

                if (likeCountResponse.ok) {
                    const data = await likeCountResponse.json();
                    // Update the like count for the specific post
                    setPosts((prevPosts) =>
                        prevPosts.map((post) =>
                            post.messageid === postId
                                ? { ...post, likeCount: data.likeCount } // Update the like count for the specific post
                                : post
                        )
                    );
                }
            } else {
                console.error("Failed to like post");
            }
        } catch (error) {
            console.error("Error liking post:", error);
        }
    };




    // Handle adding a comment to a post
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
                    setNewComment("");  // Clear comment input
                    fetchPosts();  // Refresh posts after commenting
                } else {
                    console.error("Failed to add comment");
                }
            } catch (error) {
                console.error("Error adding comment:", error);
            }
        }
    };

    // Handle post sharing (dummy function here)
    const handleShare = (postId) => {
        console.log("Shared post:", postId);
    };

    return (
        <div className="room-view">
            <button className="back-button" onClick={onBack}>← Back to Rooms</button>

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
                                <span className="post-author">{post.author}</span>
                                <span className="post-date">{new Date(post.posted_at).toLocaleString()}</span>
                            </div>

                            <div className="post-content">{post.content}</div>

                            <div className="post-actions">
                                <button onClick={() => handleLike(post.messageid)}>
                                    👍 {post.likeCount || 0}
                                </button>
                                <button onClick={() => setActivePost(post.messageid)}>💬 {post.comments?.length || 0}</button>
                                <button onClick={() => handleShare(post.messageid)}>Share</button>
                            </div>

                            {activePost === post.messageid && (
                                <div className="comments-section">
                                    {post.comments?.length > 0 ? (
                                        post.comments.map((comment) => (
                                            <div key={comment.commentid} className="comment">
                                                <strong>{comment.userid}</strong>
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