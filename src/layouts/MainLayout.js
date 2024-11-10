// src/layouts/MainLayout.js
import React from 'react';
import './MainLayout.css';  // Import MainLayout.css
import Navbar from '../Pages/Index/components/Navbar';  // Import Navbar
import Loader from '../Pages/Index/components/Loader';
import Header from '../Pages/Index/components/Header';
import CookieBanner from '../Pages/Index/components/CookieBanner';
import MainContent from '../Pages/Index/components/MainContent';
import FeaturesSection from '../Pages/Index/components/FeaturesSection';
import PastPapersSection from '../Pages/Index/components/PastPapersSection';
import PlaylistsSection from '../Pages/Index/components/PlaylistsSection';
import VideoSection from '../Pages/Index/components/VideoSection';
import NewsAndEventsSection from '../Pages/Index/components/NewsAndEventsSection';
import BackToTopButton from '../Pages/Index/components/BackToTop';
import TestimonialSection from '../Pages/Index/components/TestimonialSection';
import BlogSection from '../Pages/Index/components/Blog';
import FAQSection from '../Pages/Index/components/FAQSection';

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
