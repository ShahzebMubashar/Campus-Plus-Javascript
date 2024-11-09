// components/VideoSection.js
import React from 'react';
import './VideoSection.css';

const VideoSection = () => (
    <section className="video has-bg-image" aria-label="video" style={{ backgroundImage: 'url("assets/images/newbg1.png")' }}>
        <div className="video-container">
            <div className="video-card">
                <div className="video-banner img-holder has-after">
                    <img src="assets/images/video-banner.jpg" width="900" height="500" loading="lazy" alt="video banner" className="img-cover" />
                    <a href="html/comingsoon.html" style={{ textDecoration: 'none', cursor: 'pointer' }}>
                        <button className="play-btn" aria-label="play video">
                            <ion-icon name="play" aria-hidden="true"></ion-icon>
                        </button>
                    </a>
                    <img src="assets/images/video-shape-2.png" width="158" height="174" loading="lazy" alt="" className="shape video-shape-2" />
                </div>
                <img src="assets/images/video-shape-1.png" width="1089" height="605" loading="lazy" alt="" className="shape video-shape-1" />
            </div>
        </div>
    </section>
);

export default VideoSection;
