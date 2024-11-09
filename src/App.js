import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './Index/components/Navbar';
import Loader from './Index/components/Loader';
import Header from './Index/components/Header';
import CookieBanner from './Index/components/CookieBanner';
import MainContent from './Index/components/MainContent';
import FeaturesSection from './Index/components/FeaturesSection';
import PastPapersSection from './Index/components/PastPapersSection';
import PlaylistsSection from './Index/components/PlaylistsSection';
import VideoSection from './Index/components/VideoSection';
import NewsAndEventsSection from './Index/components/NewsAndEventsSection';
import BackToTopButton from './Index/components/BackToTop';
import TestimonialSection from './Index/components/TestimonialSection';
import BlogSection from './Index/components/Blog';
import FAQSection from './Index/components/FAQSection';
import AnnouncementBar from './Index/components/AnnouncementBar';
import { Nav } from 'react-bootstrap';

function App() {
  return (
    <div>
      <Navbar />
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
      < AnnouncementBar />

    </div>
  );
}

export default App;
