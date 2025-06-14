import React from "react";
import "./NewsAndEventsSection.css";

const NewsAndEventsSection = () => {
    const testimonials = [
        {
            title: "Societies Orientation 2024",
            type: "News",
            description:
                "Our university recently held its annual Societies Orientation, where students were introduced to various campus organizations. The event showcased opportunities in debating, sports, media, and cultural societies, encouraging new members to engage in extracurricular activities and contribute to a vibrant campus community.",
        },
        {
            title: "Mid 1 Dates Announced?",
            type: "News",
            description:
                "Mid 1 term exams are tentatively scheduled to begin on 21st September at our university. Students are advised to prepare accordingly and stay updated for any changes in the exam timetable. Good luck with your preparations! Use Campus Plus to get an A =)",
        },
        {
            title: "Campus Fest Starts Next Week",
            type: "Event",
            description:
                "Get ready for the Campus Fest starting next week! Join us for a week full of exciting activities, competitions, and performances by student clubs. Don't miss out on the fun!",
        },
        {
            title: "Societies Orientation 2024",
            type: "News",
            description:
                "Our university recently held its annual Societies Orientation, where students were introduced to various campus organizations. The event showcased opportunities in debating, sports, media, and cultural societies, encouraging new members to engage in extracurricular activities and contribute to a vibrant campus community.",
        },
        {
            title: "Mid 1 Dates Announced?",
            type: "News",
            description:
                "Mid 1 term exams are tentatively scheduled to begin on 21st September at our university. Students are advised to prepare accordingly and stay updated for any changes in the exam timetable. Good luck with your preparations! Use Campus Plus to get an A =)",
        },
        {
            title: "Campus Fest Starts Next Week",
            type: "Event",
            description:
                "Get ready for the Campus Fest starting next week! Join us for a week full of exciting activities, competitions, and performances by student clubs. Don't miss out on the fun!",
        },
        {
            title: "FAST Care's Book Drive",
            type: "Event",
            description:
                "FastCare recently organized a book drive encouraging students and staff to donate gently used books.",
        },
        {
            title: "GDSC Lead Selection",
            type: "News",
            description:
                "The GDSC is set to announce its new lead. Students are eagerly awaiting the reveal.",
        },
    ];

    return (
        <section className="parent-testimonials-section" id="newsandeventspage">
            <div className="testimonials-section">
                <h2>
                    News & <span className="pp-highlighted" style={{ color: "#3b82f6", fontSize: "3.5rem" }}> Events</span>
                </h2>
                <div className="slider-container">
                    <div className="testimonials-slider">
                        {testimonials.map((item, index) => (
                            <div className="testimonial" key={index}>
                                <h3>{item.title}</h3>
                                <p>{item.type}</p>
                                <p>{item.description}</p>
                            </div>
                        ))}
                        {/* Duplicate testimonials for infinite loop effect */}
                        {testimonials.map((item, index) => (
                            <div className="testimonial" key={`duplicate-${index}`}>
                                <h3>{item.title}</h3>
                                <p>{item.type}</p>
                                <p>{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NewsAndEventsSection;
