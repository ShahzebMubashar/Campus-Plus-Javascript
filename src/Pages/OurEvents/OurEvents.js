import React from "react";
import Navbar from "../Index/components/Navbar";
import Footer from "../Footer/Footer";
import "./OurEvents.css";

const events = [
  {
    title: "AI Symposium 2024",
    description:
      "A gathering of AI enthusiasts, researchers, and industry leaders to discuss the latest trends in artificial intelligence.",
    date: "2024-06-15",
    day: "Saturday",
    mode: "Online",
    registrationLink: "https://zoom.us/j/123456789",
    registrationOpen: true,
    time: "10:00 AM - 2:00 PM",
    organizer: "FAST School of Computing",
    location: "Zoom",
    extra: "Open to all students and faculty.",
  },
  {
    title: "Hackathon: Code for Change",
    description:
      "24-hour hackathon focused on building solutions for social good. Teams will compete for exciting prizes.",
    date: "2024-07-01",
    day: "Monday",
    mode: "On-Campus",
    registrationLink: "",
    registrationOpen: false,
    time: "9:00 AM - 9:00 PM",
    organizer: "MultiDexters",
    location: "Main Auditorium",
    extra: "Register by June 20th. Meals provided.",
  },
  {
    title: "Career Counseling Session",
    description:
      "Expert panel to guide students on career choices, internships, and higher studies.",
    date: "2024-06-20",
    day: "Thursday",
    mode: "Online",
    registrationLink: "https://meet.google.com/xyz-abcw-pqr",
    registrationOpen: true,
    time: "4:00 PM - 6:00 PM",
    organizer: "Student Affairs",
    location: "Google Meet",
    extra: "Q&A session at the end.",
  },
  // Add more events as needed
];

const OurEvents = () => {
  return (
    <div className="our-events-page">
      <Navbar />
      <header className="events-header">
        <h1>Our Events</h1>
        <p>
          Stay updated with the latest happenings, workshops, and seminars at
          Campus Plus!
        </p>
      </header>
      <div className="events-container">
        {events.map((event, idx) => (
          <div className="event-card" key={idx}>
            <div className="event-main-info">
              <h2 className="event-title">{event.title}</h2>
              <p className="event-desc">{event.description}</p>
            </div>
            <div className="event-details">
              <div className="event-detail-row">
                <span className="event-label">Date:</span>
                <span className="event-value">
                  {event.date} ({event.day})
                </span>
              </div>
              <div className="event-detail-row">
                <span className="event-label">Time:</span>
                <span className="event-value">{event.time}</span>
              </div>
              <div className="event-detail-row">
                <span className="event-label">Mode:</span>
                <span className="event-value">{event.mode}</span>
              </div>
              <div className="event-detail-row">
                <span className="event-label">Location:</span>
                <span className="event-value">{event.location}</span>
              </div>
              <div className="event-detail-row">
                <span className="event-label">Registration:</span>
                {event.registrationOpen && event.registrationLink ? (
                  <a
                    className="event-register-btn"
                    href={event.registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Register
                  </a>
                ) : (
                  <span className="event-closed">Closed</span>
                )}
              </div>
              <div className="event-detail-row">
                <span className="event-label">Organizer:</span>
                <span className="event-value">{event.organizer}</span>
              </div>
              {event.extra && (
                <div className="event-detail-row">
                  <span className="event-label">Note:</span>
                  <span className="event-value">{event.extra}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default OurEvents;
