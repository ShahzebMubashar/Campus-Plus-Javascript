import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Navbar from './AboutCampusPlusNavbar';
import HeroSection from './HeroSection';
import AboutSection from './AboutSection';
import FeaturesSection from './FeaturesSection';
import CountersSection from './CountersSection';
import FounderSection from './FounderSection';
import ContributorsSection from './ContributorsSection';
import ReviewsSection from './ReviewsSection';
import ContactSection from './ContactSection';
import Footer from './CampusPlusFooter';
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
