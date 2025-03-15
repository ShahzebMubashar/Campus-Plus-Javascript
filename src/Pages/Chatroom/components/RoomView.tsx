import React, { useState } from 'react';
import type { Room, Post } from "../types/types"
import "../css/RoomView.css"
import { useEffect } from "react"

interface RoomViewProps {
    room: Room
    onBack: () => void
}

export default function RoomView({ room, onBack }: RoomViewProps) {
    const [posts, setPosts] = useState<Post[]>([])
    const [activePost, setActivePost] = useState<string | null>(null)
    const [newComment, setNewComment] = useState<string>("")
    const [newPost, setNewPost] = useState<string>("")

    useEffect(() => {
        fetchPosts()
    }, []) // Updated dependency

    const fetchPosts = async () => {
        try {
            const response = await fetch(`http://localhost:4000/Chatrooms/messages/${room.roomid}`, {
                credentials: "include",
            })
            if (response.ok) {
                const data = await response.json()
                if (Array.isArray(data)) {
                    setPosts(data)
                } else {
                    console.error("Unexpected data format:", data)
                    setPosts([]) // Fallback to empty array
                }
            } else {
                console.error("Failed to fetch posts")
            }
        } catch (error) {
            console.error("Error fetching posts:", error)
        }
    }


    const handleCreatePost = async () => {
        if (newPost.trim()) {
            try {
                const response = await fetch(`http://localhost:4000/Chatrooms/send-message/${room.roomid}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ message: newPost }),
                    credentials: "include",
                })
                if (response.ok) {
                    setNewPost("")
                    fetchPosts()
                } else {
                    console.error("Failed to create post")
                }
            } catch (error) {
                console.error("Error creating post:", error)
            }
        }
    }

    const handleLike = async (postId: string) => {
        try {
            const response = await fetch(`http://localhost:4000/Chatrooms/like/${postId}`, {
                method: "POST",
                credentials: "include",
            })
            if (response.ok) {
                fetchPosts()
            } else {
                console.error("Failed to like post")
            }
        } catch (error) {
            console.error("Error liking post:", error)
        }
    }

    const handleComment = async (postId: string) => {
        if (newComment.trim()) {
            try {
                const response = await fetch(`http://localhost:4000/Chatrooms/comment/${postId}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ content: newComment })
                })
                if (response.ok) {
                    setNewComment("")
                    fetchPosts()
                } else {
                    console.error("Failed to add comment")
                }
            } catch (error) {
                console.error("Error adding comment:", error)
            }
        }
    }

    const handleShare = (postId: string) => {
        // Implement share functionality (e.g., copy link to clipboard)
        console.log("Shared post:", postId)
    }

    return (
        <div className="room-view">
            <button className="back-button" onClick={onBack}>
                ← Back to Rooms
            </button>

            <div className="room-header">
                <h1>{room.name}</h1>
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

            <div className="posts-section">
                <div className="create-post">
                    <textarea
                        placeholder="Write a post..."
                        className="post-input"
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                    />
                    <button className="post-button" onClick={handleCreatePost}>
                        Post
                    </button>
                </div>

                {posts && posts.length > 0 ? (
                    posts.map((post) => (
                        <div key={post.messageid} className="post-card">
                            <div className="post-header">
                                <span className="post-author">{post.userid}</span>
                                <span className="post-date">{new Date(post.posted_at).toLocaleString()}</span>
                            </div>

                            <div className="post-content">{post.content}</div>

                            <div className="post-actions">
                                <button onClick={() => handleLike(post.messageid)}>👍 {post.likes}</button>
                                <button onClick={() => setActivePost(post.messageid)}>💬 {post.comments?.length || 0}</button>
                                <button onClick={() => handleShare(post.messageid)}>Share</button>
                            </div>

                            {activePost === post.messageid && (
                                <div className="comments-section">
                                    {post.comments && post.comments.length > 0 ? (
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
                                        <button onClick={() => handleComment(post.messageid)}>Comment</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No posts available</p>
                )}

            </div>
        </div>
    )
}

