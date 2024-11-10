// src/layouts/MainLayout.js
import React from 'react';
import Navbar from '../Index/components/Navbar';  // Import Navbar
import Loader from '../Index/components/Loader';
import Header from '../Index/components/Header';
import CookieBanner from '../Index/components/CookieBanner';
import MainContent from '../Index/components/MainContent';
import FeaturesSection from '../Index/components/FeaturesSection';
import PastPapersSection from '../Index/components/PastPapersSection';
import PlaylistsSection from '../Index/components/PlaylistsSection';
import VideoSection from '../Index/components/VideoSection';
import NewsAndEventsSection from '../Index/components/NewsAndEventsSection';
import BackToTopButton from '../Index/components/BackToTop';
import TestimonialSection from '../Index/components/TestimonialSection';
import BlogSection from '../Index/components/Blog';
import FAQSection from '../Index/components/FAQSection';

function MainLayout() {
    return (
        <div>
            <Navbar />  {/* Navbar will be included in MainLayout */}
            <Loader />
            <Header />
            <CookieBanner />
            <MainContent />
            <FeaturesSection />
            <PastPapersSection />
            <PlaylistsSection />
            <VideoSection />
            <NewsAndEventsSection />
            <BackToTopButton />
            <BlogSection />
            <TestimonialSection />
            <FAQSection />
        </div>
    );
}

export default MainLayout;
