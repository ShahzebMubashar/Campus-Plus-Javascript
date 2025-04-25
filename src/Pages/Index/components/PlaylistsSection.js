import React from 'react';
import './PlaylistsSection.css';

const playlists = [
    {
        title: 'Theory of Automata',
        link: 'https://youtube.com/playlist?list=PLmXKhU9FNesSdCsn6YQqu9DmXRMsYdZ2T&feature=shared',
        videoId: '9kuynHcM3UA',
        videos: 112,
        rating: '5/5',
        duration: '112 Videos',
        students: '20K Views',
    },
    {
        title: 'Object Oriented Programming',
        link: 'https://youtube.com/playlist?list=PLISTUNloqsz0z9JJJke7g7PxRLvy6How9&feature=shared',
        videoId: 'nGJTWaaFdjc',
        videos: 37,
        rating: '4.8/5',
        duration: '37 Videos',
        students: '35K Views',
    },
    {
        title: 'Digital Logic Design',
        link: 'https://youtube.com/playlist?list=PLBlnK6fEyqRjMH3mWf6kwqiTbT798eAOm&feature=shared',
        videoId: 'M0mx8S05v60',
        videos: 202,
        rating: '4.9/5',
        duration: '202 Videos',
        students: '18K Views',
    },
];

const PlaylistsSection = () => (
    <section className="section course" id="courses" aria-label="course">
        <div className="container">
            <h2 className="section-title">
                Pick A Playlist To <span className="pp-highlighted" style={{ color: '#3b82f6' }}>Get Started</span>
            </h2>
            <div className="grid-list">
                {playlists.map((playlist, index) => (
                    <div key={index} className="course-card">
                        <a href={playlist.link} target="_blank" rel="noopener noreferrer">
                            <div className="card-banner">
                                <img
                                    src={`https://i.ytimg.com/vi/${playlist.videoId}/hqdefault.jpg`}
                                    alt={playlist.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    onError={(e) => {
                                        console.error('Error loading thumbnail for video:', playlist.videoId);
                                        e.target.onerror = null;
                                        e.target.src = 'https://via.placeholder.com/400x225?text=Thumbnail+Not+Available';
                                    }}
                                />
                                <div className="abs-badge">
                                    <ion-icon name="time-outline" aria-hidden="true"></ion-icon>
                                    <span className="span">{playlist.videos} Videos</span>
                                </div>
                            </div>
                            <div className="card-content">
                                <h3 className="h3 card-title">{playlist.title}</h3>
                                <div className="wrapper">
                                    <div className="rating-wrapper">
                                        <ion-icon name="star"></ion-icon>
                                        <ion-icon name="star"></ion-icon>
                                        <ion-icon name="star"></ion-icon>
                                        <ion-icon name="star"></ion-icon>
                                        <ion-icon name="star"></ion-icon>
                                    </div>
                                    <p className="rating-text">({playlist.rating} Rating)</p>
                                </div>
                                <ul className="card-meta-list">
                                    <li className="card-meta-item">
                                        <ion-icon name="library-outline" aria-hidden="true"></ion-icon>
                                        <span className="span">{playlist.duration}</span>
                                    </li>
                                    <li className="card-meta-item">
                                        <ion-icon name="people-outline" aria-hidden="true"></ion-icon>
                                        <span className="span">{playlist.students}</span>
                                    </li>
                                </ul>
                            </div>
                        </a>
                    </div>
                ))}
            </div>
            <a href="/html/playlist.html" className="btn btn-primary">
                <span className="span">Browse More Playlists</span>
            </a>
        </div>
    </section>
);

export default PlaylistsSection;
