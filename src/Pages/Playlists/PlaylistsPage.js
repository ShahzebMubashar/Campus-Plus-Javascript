import React from 'react';
import './PlaylistsPage.css';

const PlaylistsPage = () => {
    const playlists = [
        {
            name: 'Programming Fundamentals (PF)',
            watchtime: 'Apna College',
            rating: 4.8,
            students: '20 Students',
            playlistLink: 'https://youtube.com/playlist?list=PLfqMhTWNBTe0b2nM6JHVCnAkhQRGiZMSJ&feature=shared',
            duration: '226 Videos',
            VideoId: 'z9bZufPHFLU',
        },
        {
            name: 'Applied Physics (AP)',
            watchtime: 'JE CLASSES Meerut',
            rating: 4.8,
            students: '20 Students',
            playlistLink: 'https://youtube.com/playlist?list=PLY8pCdWSlXrT0w1Yu3jU_lTUCkfFKVOm_&feature=shared',
            duration: '86 Videos',
            VideoId: 'AquETg8G0es',
        },
        {
            name: 'Calculus and Analytical Geometry (CAL)',
            watchtime: 'The Organic Chemistry Tutor',
            rating: 4.8,
            students: '20 Students',
            playlistLink: 'https://youtube.com/playlist?list=PL0o_zxa4K1BWYThyV4T2Allw6zY0jEumv&feature=shared',
            duration: '332 Videos',
            VideoId: 'GiCojsAWRj0',
        },
        {
            name: 'Object Oriented Programming (OOP)',
            watchtime: 'Duration: 20 Hours',
            rating: 4.8,
            students: '20 Students',
            playlistLink: 'https://youtube.com/playlist?list=PLISTUNloqsz0z9JJJke7g7PxRLvy6How9&feature=shared',
            duration: '37 Videos',
            VideoId: 'nGJTWaaFdjc',
        },
        {
            name: 'Digital Logic Design (DLD)',
            watchtime: 'Duration: 20 Hours',
            rating: 4.8,
            students: '20 Students',
            playlistLink: 'https://youtube.com/playlist?list=PLBlnK6fEyqRjMH3mWf6kwqiTbT798eAOm&feature=shared',
            duration: '202 Videos',
            VideoId: 'M0mx8S05v60',
        },
        {
            name: 'Multivariable Calculus (MVC)',
            watchtime: 'Duration: 20 Hours',
            rating: 4.8,
            students: '20 Students',
            playlistLink: 'https://youtube.com/playlist?list=PLSQl0a2vh4HC5feHa6Rc5c0wbRTx56nF7&feature=shared',
            duration: '175 Videos',
            VideoId: 'TrcCbdWwCBc',
        },
    ];

    const handleCardClick = (link) => {
        window.open(link, '_blank');
    };

    return (
        <div className="playlists-page">
            {/* Header Section */}
            <div className="header">
                <h1>All Playlists</h1>
                <p>Class mein samajh nahi ayi ya teacher se vibe nahi mili? No worries, we got your back!</p>
            </div>

            {/* Playlists Section */}
            <div className="playlists-container">
                <div className="playlists">
                    {playlists.map((course, index) => (
                        <div
                            key={index}
                            className="playlist-card stylish-card"
                            onClick={() => handleCardClick(course.playlistLink)}
                        >
                            <img
                                src={`https://i.ytimg.com/vi/${course.VideoId}/hqdefault.jpg`}
                                alt={`Thumbnail for ${course.name}`}
                                className="playlist-thumbnail"
                            />
                            <div className="card-content">
                                <h3>{course.name}</h3>
                                <p className="creator">{course.watchtime}</p>
                                <p className="rating">{'⭐'.repeat(Math.round(course.rating))}</p>
                                <div className="horizontal-info">
                                    <p>🎥 {course.duration}</p>
                                    <p>👥 {course.students}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PlaylistsPage;
