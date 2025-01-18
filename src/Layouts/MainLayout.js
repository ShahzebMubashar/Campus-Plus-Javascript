// src/layouts/MainLayout.js
import React from 'react';
import './MainLayout.css';  // Import MainLayout.css
import Navbar from '../Pages/Index/components/Navbar.js';  // Import Navbar
import Loader from '../Pages/Index/components/Loader.js';
import Header from '../Pages/Index/components/Header.js';
import CookieBanner from '../Pages/Index/components/CookieBanner.js';
import MainContent from '../Pages/Index/components/MainContent.js';
import FeaturesSection from '../Pages/Index/components/FeaturesSection.js';
import PastPapersSection from '../Pages/Index/components/PastPapersSection.js';
import PlaylistsSection from '../Pages/Index/components/PlaylistsSection.js';
import VideoSection from '../Pages/Index/components/VideoSection.js';
import NewsAndEventsSection from '../Pages/Index/components/NewsAndEventsSection.js';
import BackToTopButton from '../Pages/Index/components/BackToTop.js';
import TestimonialSection from '../Pages/Index/components/TestimonialSection.js';
import BlogSection from '../Pages/Index/components/Blog.js';
import FAQ from '../Pages/Support/faq.js'
import faqData from '../Pages/Support/faqData.js'

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
            <FAQ faqData={faqData} />

        </div>
    );
}

export default MainLayout;
