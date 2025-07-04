import React, { useEffect } from "react";
import "./FeaturesSection.css";
// Import icons from react-icons
import {
  IoFileTrayFull,
  IoPlayCircle,
  IoPeople,
  IoCalendar,
  IoHelpCircle,
  IoCalculator,
} from "react-icons/io5";

const FeatureItem = ({ href, icon: Icon, title, description }) => (
  <a href={href} className="features-service-box">
    <div className="features-icon">
      <Icon size="2em" /> {/* Use the icon as a React component */}
    </div>
    <div className="features-content">
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  </a>
);

const FeaturesSection = () => {
  return (
    <section className="features-parent-services">
      <div className="features-services">
        <h1>
          From Support to <span className="features-highlighted">Success</span>,
          We Make You Excel
        </h1>
        <div className="features-services-grid">
          <FeatureItem
            href="/html/pastpapers.html"
            icon={IoFileTrayFull}
            title="Past Papers"
            description="Practice exams, boost scores, understand concepts, and exam pattern insight."
          />
          <FeatureItem
            href="/html/playlist.html"
            icon={IoPlayCircle}
            title="Youtube Playlists"
            description="Organize videos, seamless learning, easy access, curated content, and continuous playback."
          />
          <FeatureItem
            href="/html/faculty.html"
            icon={IoPeople}
            title="Faculty Information"
            description="Easily access all the office locations and hours, and faculty contact details."
          />
          <FeatureItem
            href="/html/comingsoon.html"
            icon={IoCalendar}
            title="Time Table Generator"
            description="Create personalized schedules, manage class timings, avoid conflicts, and stay organized."
          />
          <FeatureItem
            href="/html/support.html"
            icon={IoHelpCircle}
            title="Student Support"
            description="Access FAQs, find answers, connect with support, and locate key contacts."
          />
          <FeatureItem
            href="/html/calculator.html"
            icon={IoCalculator}
            title="GPA Calculator"
            description="Calculate CGPA and SGPA, track academic progress, and plan your goals."
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
