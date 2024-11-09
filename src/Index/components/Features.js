// src/components/Features.js
import React from "react";

const Features = () => (
    <section className="features-parent-services">
        <div className="features-services">
            <h1>From Support to <span className="features-highlighted">Success</span></h1>
            <div className="features-services-grid">
                <FeatureCard
                    href="/html/pastpapers.html"
                    icon="document"
                    title="Past Papers"
                    description="Practice exams, boost scores..."
                />
                {/* Add other feature cards */}
            </div>
        </div>
    </section>
);

const FeatureCard = ({ href, icon, title, description }) => (
    <a href={href} className="features-service-box">
        <div className="features-icon">
            <ion-icon name={icon}></ion-icon>
        </div>
        <div className="features-content">
            <h2>{title}</h2>
            <p>{description}</p>
        </div>
    </a>
);

export default Features;
