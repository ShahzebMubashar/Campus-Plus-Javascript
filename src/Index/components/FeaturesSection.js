import React, { useEffect } from 'react';
// import { IonIcon } from 'react-ionicons'; // Install this package if necessary or use FontAwesome for icons
import './FeaturesSection.css';
import { IonIcon } from '@ionic/react'; // Import IonIcon from @ionic/react

import { FileTrayFull } from 'react-ionicons'; // instead of IonIcon
import { playCircle, people, calendar, helpCircle, calculator } from 'ionicons/icons';


const FeatureItem = ({ href, icon, title, description }) => (
    <a href={href} className="features-service-box">
        <div className="features-icon">
            <IonIcon name={icon} />
        </div>
        <div className="features-content">
            <h2>{title}</h2>
            <p>{description}</p>
        </div>
    </a>
);

const FeaturesSection = () => {
    useEffect(() => {
        // Dynamically load the Ionicons script
        const script = document.createElement('script');
        script.type = 'module';
        script.src = 'https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js';
        document.body.appendChild(script);

        // Cleanup script when component is unmounted
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <section className="features-parent-services">
            <div className="features-services">
                <h1>From Support to <span className="features-highlighted">Success</span>, We Make You Excel</h1>
                <div className="features-services-grid">
                    <FeatureItem
                        href="/html/pastpapers.html"
                        icon={FileTrayFull}
                        title="Past Papers"
                        description="Practice exams, boost scores, understand concepts, and exam pattern insight."
                    />
                    <FeatureItem
                        href="/html/playlist.html"
                        icon={playCircle}
                        title="Youtube Playlists"
                        description="Organize videos, seamless learning, easy access, curated content, and continuous playback."
                    />
                    <FeatureItem
                        href="/html/faculty.html"
                        icon={people}
                        title="Faculty Information"
                        description="Easily access all the office locations and hours, and faculty contact details."
                    />
                    <FeatureItem
                        href="/html/comingsoon.html"
                        icon={calendar}
                        title="Time Table Generator"
                        description="Create personalized schedules, manage class timings, avoid conflicts, and stay organized."
                    />
                    <FeatureItem
                        href="/html/support.html"
                        icon={helpCircle}
                        title="Student Support"
                        description="Access FAQs, find answers, connect with support, and locate key contacts."
                    />
                    <FeatureItem
                        href="/html/calculator.html"
                        icon={calculator}
                        title="GPA Calculator"
                        description="Calculate CGPA and SGPA, track academic progress, and plan your goals."
                    />
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
