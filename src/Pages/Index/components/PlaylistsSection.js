import React from 'react';
import './PlaylistsSection.css';

const playlists = [
    {
        title: 'Theory of Automata',
        link: 'https://youtube.com/playlist?list=PLmXKhU9FNesSdCsn6YQqu9DmXRMsYdZ2T&feature=shared',
        thumbnail: `https://img.youtube.com/vi/9kuynHcM3UA/maxresdefault.jpg`,
        videos: 112,
        rating: '5/5',
        duration: '112 Videos',
        students: '20K Views',
    },
    {
        title: 'Object Oriented Programming',
        link: 'https://youtube.com/playlist?list=PLISTUNloqsz0z9JJJke7g7PxRLvy6How9&feature=shared',
        thumbnail: `https://img.youtube.com/vi/nGJTWaaFdjc/maxresdefault.jpg`,
        videos: 37,
        rating: '4.8/5',
        duration: '37 Videos',
        students: '35K Views',
    },
    {
        title: 'Digital Logic Design',
        link: 'https://youtube.com/playlist?list=PLBlnK6fEyqRjMH3mWf6kwqiTbT798eAOm&feature=shared',
        thumbnail: `https://img.youtube.com/vi/M0mx8S05v60/maxresdefault.jpg`,
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
                            <figure className="card-banner">
                                <img src={playlist.thumbnail} alt={playlist.title} />
                            </figure>
                            <div className="abs-badge">
                                <ion-icon name="time-outline" aria-hidden="true"></ion-icon>
                                <span className="span">{playlist.videos} Videos</span>
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
