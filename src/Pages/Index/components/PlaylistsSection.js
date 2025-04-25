import React from 'react';
import './PlaylistsSection.css';

const playlists = [
    {
        name: 'Programming Fundamentals (PF)',
        shortForm: 'PF',
        watchtime: 'Apna College',
        rating: 4.8,
        views: '1.2M views',
        playlistLink: 'https://youtube.com/playlist?list=PLfqMhTWNBTe0b2nM6JHVCnAkhQRGiZMSJ&feature=shared',
        duration: '45 hours',
        VideoId: 'z9bZufPHFLU',
    },
    {
        name: 'Applied Physics (AP)',
        shortForm: 'AP',
        watchtime: 'JE CLASSES Meerut',
        rating: 4.8,
        views: '850K views',
        playlistLink: 'https://youtube.com/playlist?list=PLY8pCdWSlXrT0w1Yu3jU_lTUCkfFKVOm_&feature=shared',
        duration: '32 hours',
        VideoId: 'AquETg8G0es',
    },
    {
        name: 'Calculus and Analytical Geometry (CAL)',
        shortForm: 'CAL',
        watchtime: 'The Organic Chemistry Tutor',
        rating: 4.8,
        views: '2.1M views',
        playlistLink: 'https://youtube.com/playlist?list=PL0o_zxa4K1BWYThyV4T2Allw6zY0jEumv&feature=shared',
        duration: '68 hours',
        VideoId: 'GiCojsAWRj0',
    }
];

const PlaylistsSection = () => (
    <section className="section course" id="courses" aria-label="course">
        <div className="container">
            <h2 className="section-title">
                Pick A Playlist To <span className="pp-highlighted" style={{ color: '#3b82f6' }}>Get Started</span>
            </h2>
            <div className="grid-list">
                {playlists.map((playlist, index) => (
                    <div key={index} className="playlist-card stylish-card">
                        <a href={playlist.playlistLink} target="_blank" rel="noopener noreferrer">
                            <img
                                src={`https://i.ytimg.com/vi/${playlist.VideoId}/hqdefault.jpg`}
                                alt={`Thumbnail for ${playlist.name}`}
                                className="playlist-thumbnail"
                            />
                            <div className="card-content">
                                <h3>{playlist.name}</h3>
                                <p className="creator">{playlist.watchtime}</p>
                                <p className="rating">{'⭐'.repeat(Math.round(playlist.rating))}</p>
                                <div className="horizontal-info">
                                    <p>⏱️ {playlist.duration}</p>
                                    <p>👥 {playlist.views}</p>
                                </div>
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
