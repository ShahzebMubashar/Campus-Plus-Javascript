// src/layouts/MainLayout.js
import React from 'react';
import './MainLayout.css';  // Import MainLayout.css
import Navbar from '../Pages/Index/components/Navbar';
import Articles from '../Pages/Support/components/ArticlesSection'
import Assistant from '../Pages/Support/components/AssistantSection'
import BackToTopButton from '../Pages/Support/components/ArticlesSection'
import FAQSection from '../Pages/Support/components/FAQSection'
import Footer from '../Pages/Support/components/Footer'
import Header from '../Pages/Support/components/Header'
import IntroSection from '../Pages/Support/components/IntroSection'
import Loader from '../Pages/Support/components/Loader';



function MainLayout() {
    return (
        <div>
            <Navbar />  {/* Navbar will be included in MainLayout */}
            <Loader />
            <Header />
            <IntroSection />
            <FAQSection />
            <Assistant />
            <Articles />
            <BackToTopButton />
            <Footer />


        </div>
    );
}

export default MainLayout;
