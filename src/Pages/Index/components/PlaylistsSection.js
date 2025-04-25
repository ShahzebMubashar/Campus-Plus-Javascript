import React from 'react';
import './PlaylistsSection.css';

const playlists = [
    {
        title: 'Theory of Automata',
        link: 'https://www.youtube.com/playlist?list=PLmXKhU9FNesSdCsn6YQqu9DmXRMsYdZ2T',
        thumbnail: 'assets/images/toa.jpg',
        videos: 112,
        rating: '5/5',
        duration: '20 hours',
        students: 20,
    },
    {
        title: 'Object Oriented Programming',
        link: 'https://www.youtube.com/playlist?list=PLISTUNloqsz0z9JJJke7g7PxRLvy6How9',
        thumbnail: 'assets/images/oop.jpg',
        videos: 37,
        rating: '4.8/5',
        duration: '20 hours',
        students: 35,
    },
    {
        title: 'Digital Logic Design',
        link: 'https://www.youtube.com/playlist?list=PLBlnK6fEyqRjMH3mWf6kwqiTbT798eAOm',
        thumbnail: 'assets/images/dld.jpg',
        videos: 202,
        rating: '4.9/5',
        duration: '20 hours',
        students: 18,
    },
];

const PlaylistsSection = () => (
    <section className="section course" id="courses" aria-label="course">
        <div className="container">
            <h2 className="section-title">
                Pick A Playlist To <span className="pp-highlighted" style={{ color: '#3b82f6' }}>Get Started</span>
            </h2>
            <ul className="grid-list">
                {playlists.map((playlist, index) => (
                    <li key={index}>
                        <div className="course-card">
                            {/* Background Image */}
                            <figure
                                className="card-banner img-holder"
                                style={{ backgroundImage: `url(${playlist.thumbnail})` }}
                            >
                                <a href={playlist.link}></a>
                            </figure>
                            <div className="abs-badge">
                                <ion-icon name="time-outline" aria-hidden="true"></ion-icon>
                                <span className="span">{playlist.videos} Videos</span>
                            </div>
                            <div className="card-content">
                                <h3 className="h3">
                                    <a href={playlist.link} className="card-title">{playlist.title}</a>
                                </h3>
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
                                        <span className="span">{playlist.students} Students</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
            <a href="/html/playlist.html" className="btn btn-primary">
                <span className="span">Browse More Playlists</span>
            </a>
        </div>
    </section>
);

export default PlaylistsSection;
