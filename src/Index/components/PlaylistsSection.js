// components/PlaylistsSection.js
import React from 'react';
import './PlaylistsSection.css';

const PlaylistsSection = () => (
    <section className="section course" id="courses" aria-label="course">
        <div className="container">
            <h2 className="section-title">Pick A Playlist To <span className="pp-highlighted" style={{ color: '#3b82f6' }}> Get Started</span></h2>
            <ul className="grid-list">
                {/* Course Card 1 */}
                <li>
                    <div className="course-card">
                        <figure className="card-banner img-holder">
                            <a href="https://www.youtube.com/playlist?list=PLmXKhU9FNesSdCsn6YQqu9DmXRMsYdZ2T">
                                <img src="assets/images/toa.jpg" width="370" height="220" loading="lazy" alt="Theory of Automata" className="img-cover" />
                            </a>
                        </figure>
                        <div className="abs-badge">
                            <ion-icon name="time-outline" aria-hidden="true"></ion-icon>
                            <span className="span">112 Videos</span>
                        </div>
                        <div className="card-content">
                            <h3 className="h3">
                                <a href="https://www.youtube.com/playlist?list=PLmXKhU9FNesSdCsn6YQqu9DmXRMsYdZ2T" className="card-title">Theory of Automata</a>
                            </h3>
                            <div className="wrapper">
                                <div className="rating-wrapper">
                                    <ion-icon name="star"></ion-icon>
                                    <ion-icon name="star"></ion-icon>
                                    <ion-icon name="star"></ion-icon>
                                    <ion-icon name="star"></ion-icon>
                                    <ion-icon name="star"></ion-icon>
                                </div>
                                <p className="rating-text">(5/5 Rating)</p>
                            </div>
                            <ul className="card-meta-list">
                                <li className="card-meta-item">
                                    <ion-icon name="library-outline" aria-hidden="true"></ion-icon>
                                    <span className="span">20 hours</span>
                                </li>
                                <li className="card-meta-item">
                                    <ion-icon name="people-outline" aria-hidden="true"></ion-icon>
                                    <span className="span">20 Students</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </li>

                {/* Course Card 2 */}
                <li>
                    <div className="course-card">
                        <figure className="card-banner img-holder">
                            <a href="https://www.youtube.com/playlist?list=PLISTUNloqsz0z9JJJke7g7PxRLvy6How9">
                                <img src="assets/images/oop.jpg" width="370" height="220" loading="lazy" alt="Object Oriented Programming" className="img-cover" />
                            </a>
                        </figure>
                        <div className="abs-badge">
                            <ion-icon name="time-outline" aria-hidden="true"></ion-icon>
                            <span className="span">37 Videos</span>
                        </div>
                        <div className="card-content">
                            <h3 className="h3">
                                <a href="https://www.youtube.com/playlist?list=PLISTUNloqsz0z9JJJke7g7PxRLvy6How9" className="card-title">Object Oriented Programming</a>
                            </h3>
                            <div className="wrapper">
                                <div className="rating-wrapper">
                                    <ion-icon name="star"></ion-icon>
                                    <ion-icon name="star"></ion-icon>
                                    <ion-icon name="star"></ion-icon>
                                    <ion-icon name="star"></ion-icon>
                                    <ion-icon name="star"></ion-icon>
                                </div>
                                <p className="rating-text">(4.8/5 Rating)</p>
                            </div>
                            <ul className="card-meta-list">
                                <li className="card-meta-item">
                                    <ion-icon name="library-outline" aria-hidden="true"></ion-icon>
                                    <span className="span">20 hours</span>
                                </li>
                                <li className="card-meta-item" style={{ textAlign: 'right' }}>
                                    <ion-icon name="people-outline" aria-hidden="true"></ion-icon>
                                    <span className="span">35 Students</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </li>

                {/* Course Card 3 */}
                <li>
                    <div className="course-card">
                        <figure className="card-banner img-holder">
                            <a href="https://www.youtube.com/playlist?list=PLBlnK6fEyqRjMH3mWf6kwqiTbT798eAOm">
                                <img src="assets/images/dld.jpg" width="370" height="220" loading="lazy" alt="Digital Logic Design" className="img-cover" />
                            </a>
                        </figure>
                        <div className="abs-badge">
                            <ion-icon name="time-outline" aria-hidden="true"></ion-icon>
                            <span className="span">202 Videos</span>
                        </div>
                        <div className="card-content">
                            <h3 className="h3">
                                <a href="https://www.youtube.com/playlist?list=PLBlnK6fEyqRjMH3mWf6kwqiTbT798eAOm" className="card-title">Digital Logic Design</a>
                            </h3>
                            <div className="wrapper">
                                <div className="rating-wrapper">
                                    <ion-icon name="star"></ion-icon>
                                    <ion-icon name="star"></ion-icon>
                                    <ion-icon name="star"></ion-icon>
                                    <ion-icon name="star"></ion-icon>
                                    <ion-icon name="star"></ion-icon>
                                </div>
                                <p className="rating-text">(4.9/5 Rating)</p>
                            </div>
                            <ul className="card-meta-list">
                                <li className="card-meta-item">
                                    <ion-icon name="library-outline" aria-hidden="true"></ion-icon>
                                    <span className="span">20 hours</span>
                                </li>
                                <li className="card-meta-item">
                                    <ion-icon name="people-outline" aria-hidden="true"></ion-icon>
                                    <span className="span">18 Students</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </li>
            </ul>
            <a href="/html/playlist.html" className="btn btn-primary1">
                <span className="span">Browse More Playlists</span>
            </a>
        </div>
    </section>
);

export default PlaylistsSection;
