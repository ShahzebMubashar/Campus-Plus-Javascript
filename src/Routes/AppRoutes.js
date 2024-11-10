// src/routes/AppRoutes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../Layouts/MainLayout';  // Import MainLayout
import AboutCampusPlus from '../Pages/AboutCampusPlus/AboutCampusPlus';  // Import AboutCampusPlus
import ComingSoon from '../Pages/Coming Soon/ComingSoon';  // Import ComingSoon
import Contact from '../Pages/Contact/Contact';  // Import Contact
import Error404 from '../Pages/Error404/Error404';  // Import Error404
import FacultySection from '../Pages/Faculty/Faculty';  // Import FacultySection
import PastPapers from '../Pages/Past Papers/PastPapers';

function AppRoutes() {
    return (
        <Routes>
            {/* Default Route for Home page */}
            <Route path="/" element={<MainLayout />} />

            {/* Route for AboutCampusPlus page (without the Navbar) */}
            <Route path="/about-campus-plus" element={<AboutCampusPlus />} />
            <Route path="/coming-soon" element={<ComingSoon />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/error404' element={<Error404 />} />
            <Route path='/faculty' element={<FacultySection />} />
            <Route path='/past-papers' element={<PastPapers />} />

        </Routes>
    );
}

export default AppRoutes;
