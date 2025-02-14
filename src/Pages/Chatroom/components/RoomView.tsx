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
    }, [room]) // Updated dependency

    const fetchPosts = async () => {
        try {
            const response = await fetch(`http://localhost:4000/Chatrooms/${room.roomid}/messages`, {
                credentials: "include",
            })
            if (response.ok) {
                const data = await response.json()
                setPosts(data)
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
                const response = await fetch(`http://localhost:4000/Chatrooms/${room.roomid}/sendMessage`, {
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

    const handleComment = async (postId: string) => {
        if (newComment.trim()) {
            // Implement comment functionality (you'll need to add this to your backend)
            console.log("New comment on post:", postId, newComment)
            setNewComment("")
        }
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

                {posts.map((post) => (
                    <div key={post.messageid} className="post-card">
                        <div className="post-header">
                            <span className="post-author">{post.username}</span>
                            <span className="post-date">{new Date(post.posted_at).toLocaleString()}</span>
                        </div>

                        <div className="post-content">{post.content}</div>

                        <div className="post-actions">
                            <button onClick={() => setActivePost(post.messageid)}>💬 Comment</button>
                        </div>

                        {activePost === post.messageid && (
                            <div className="comments-section">
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
                ))}
            </div>
        </div>
    )
}

