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
import SignInPage from '../Pages/SignIn/SignInPage';
import PlaylistsPage from '../Pages/Playlists/PlaylistsPage'
import EmailGenerator from '../Pages/EmailGenerator/EmailGenerator';
import ApplicationGenerator from '../Pages/ApplicationGenerator/ApplicationGenerator';
import Support from '../Pages/Support/support'


function AppRoutes() {
    return (
        <Routes>
            {/* Default Route for Home page */}
            <Route path="*" element={<MainLayout />} /> {/* Updated path from "/" to "*" */}

            {/* Other Routes */}
            <Route path="/about-campus-plus" element={<AboutCampusPlus />} />
            <Route path="/coming-soon" element={<ComingSoon />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/error404" element={<Error404 />} />
            <Route path="/faculty" element={<FacultySection />} />
            <Route path="/past-papers" element={<PastPapers />} />
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/playlists" element={<PlaylistsPage />} />
            <Route path="/email-generator" element={<EmailGenerator />} />
            <Route path="/application-generator" element={<ApplicationGenerator />} />
            <Route path="/support" element={<Support />} />

        </Routes>
    );
}

export default AppRoutes;
