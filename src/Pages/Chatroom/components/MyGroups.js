import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MyGroups = () => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserGroups();
    }, []);

    const fetchUserGroups = async () => {
        try {
            const response = await fetch('http://localhost:4000/Chatrooms/user/groups', {
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to fetch groups');
            }

            const data = await response.json();
            setGroups(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGroupClick = (roomid) => {
        navigate(`/chatroom/${roomid}`);
    };

    if (loading) {
        return (
            <div className="loading-skeleton">
                <div className="group-card animate-pulse">
                    <div className="h-4 bg-white bg-opacity-10 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-white bg-opacity-10 rounded w-1/2"></div>
                </div>
                <div className="group-card animate-pulse">
                    <div className="h-4 bg-white bg-opacity-10 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-white bg-opacity-10 rounded w-1/2"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-message">
                Error: {error}
            </div>
        );
    }

    return (
        <div className="groups-list">
            {groups.length === 0 ? (
                <div className="empty-state">
                    No groups joined yet
                </div>
            ) : (
                groups.map((group) => (
                    <div
                        key={group.roomid}
                        className="group-card"
                        onClick={() => handleGroupClick(group.roomid)}
                    >
                        <h3>{group.roomname}</h3>
                        <p>{group.description}</p>
                        <div className="group-stats">
                            <span>{group.member_count} members</span>
                            <span>•</span>
                            <span>{group.post_count} posts</span>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default MyGroups; 