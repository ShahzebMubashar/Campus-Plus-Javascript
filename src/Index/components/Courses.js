// src/components/Courses.js
import React from "react";

const Courses = () => (
    <section className="section course">
        <div className="container">
            <h2 className="section-title">Pick A Playlist To Get Started</h2>
            <ul className="grid-list">
                <CourseCard
                    link="https://www.youtube.com/playlist?list=PLmXKhU9FNesSdCsn6YQqu9DmXRMsYdZ2T"
                    imgSrc="/assets/images/toa.jpg"
                    title="Theory of Automata"
                    videos="112 Videos"
                    rating="5"
                    hours="20 hours"
                    students="20 Students"
                />
                {/* Add more CourseCard components */}
            </ul>
            <a href="/html/playlist.html" className="btn btn-primary1">Browse More Playlists</a>
        </div>
    </section>
);

const CourseCard = ({ link, imgSrc, title, videos, rating, hours, students }) => (
    <li>
        <div className="course-card">
            <figure className="card-banner">
                <a href={link}>
                    <img src={imgSrc} alt={title} className="img-cover" />
                </a>
            </figure>
            <div className="abs-badge">
                <ion-icon name="time-outline"></ion-icon>
                <span>{videos}</span>
            </div>
            <div className="card-content">
                <h3><a href={link}>{title}</a></h3>
                {/* Add additional metadata here */}
            </div>
        </div>
    </li>
);

export default Courses;
