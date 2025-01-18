import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Navbar from './AboutCampusPlusNavbar.js';
import HeroSection from './HeroSection.js';
import AboutSection from './AboutSection.js';
import FeaturesSection from './FeaturesSection.js';
import CountersSection from './CountersSection.js';
import FounderSection from './FounderSection.js';
import ContributorsSection from './ContributorsSection.js';
import ReviewsSection from './ReviewsSection.js';
import ContactSection from './ContactSection.js';
import Footer from './CampusPlusFooter.js';
import './AboutCampusPlus.css';
import './lineIcons.css';

const AboutCampusPlus = () => {
    useEffect(() => {
        AOS.init({ duration: 1200 });
    }, []);

    return (
        <div>
            <Navbar />
            <HeroSection />
            <AboutSection />
            <FeaturesSection />
            <CountersSection />
            <FounderSection />
            <ContributorsSection />
            <ReviewsSection />
            <ContactSection />
            <Footer />
        </div>
    );
};

export default AboutCampusPlus;
