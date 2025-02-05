import React, { useState } from 'react';
import type { Room, Post } from "../types/types"
import "../css/RoomView.css"

interface RoomViewProps {
    room: Room
    onBack: () => void
}

const MOCK_POSTS: Post[] = [
    {
        id: "1",
        roomId: "1",
        author: "John Doe",
        content: "Welcome to our group! Let's make this a great community.",
        likes: 15,
        comments: [
            {
                id: "1",
                author: "Jane Smith",
                content: "Excited to be here!",
                createdAt: "2024-01-24T12:00:00Z",
            },
        ],
        createdAt: "2024-01-24T10:00:00Z",
    },
    {
        id: "2",
        roomId: "1",
        author: "Alice Johnson",
        content: "Just shared my first project. Looking forward to your feedback!",
        likes: 8,
        comments: [],
        createdAt: "2024-01-24T11:30:00Z",
    },
]

export default function RoomView({ room, onBack }: RoomViewProps) {
    const [posts] = useState<Post[]>(MOCK_POSTS)
    const [activePost, setActivePost] = useState<string | null>(null)
    const [newComment, setNewComment] = useState<string>("")

    const handleLike = (postId: string) => {
        // Implement like functionality
        console.log("Liked post:", postId)
    }

    const handleComment = (postId: string) => {
        if (newComment.trim()) {
            // Implement comment functionality
            console.log("New comment on post:", postId, newComment)
            setNewComment("")
        }
    }

    const handleShare = (postId: string) => {
        // Implement share functionality
        console.log("Shared post:", postId)
    }

    return (
        <div className="room-view">
            <button className="back-button" onClick={onBack}>
                ← Back to Rooms
            </button>

            <div className="room-header">
                <h1>{room.title}</h1>
                <div className="room-stats">
                    <span>{room.memberCount || 0} members</span>
                    <span>Created {room.createdAt || "recently"}</span>
                </div>
            </div>

            <div className="room-info-section">
                <div className="room-description-box">
                    <h2>About</h2>
                    <p>{room.description}</p>
                </div>

                <div className="room-rules-box">
                    <h2>Rules</h2>
                    <ul>
                        {room.rules?.map((rule, index) => <li key={index}>{rule}</li>) || <li>Be respectful and kind to others</li>}
                    </ul>
                </div>
            </div>

            <div className="posts-section">
                <div className="create-post">
                    <textarea placeholder="Write a post..." className="post-input" />
                    <button className="post-button">Post</button>
                </div>

                {posts.map((post) => (
                    <div key={post.id} className="post-card">
                        <div className="post-header">
                            <span className="post-author">{post.author}</span>
                            <span className="post-date">{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>

                        <div className="post-content">{post.content}</div>

                        <div className="post-actions">
                            <button onClick={() => handleLike(post.id)}>👍 {post.likes}</button>
                            <button onClick={() => setActivePost(post.id)}>💬 {post.comments.length}</button>
                            <button onClick={() => handleShare(post.id)}>Share</button>
                        </div>

                        {activePost === post.id && (
                            <div className="comments-section">
                                {post.comments.map((comment) => (
                                    <div key={comment.id} className="comment">
                                        <strong>{comment.author}</strong>
                                        <p>{comment.content}</p>
                                    </div>
                                ))}
                                <div className="add-comment">
                                    <input
                                        type="text"
                                        placeholder="Write a comment..."
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                    />
                                    <button onClick={() => handleComment(post.id)}>Comment</button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

