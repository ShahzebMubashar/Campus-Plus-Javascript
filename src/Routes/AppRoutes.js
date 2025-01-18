// src/routes/AppRoutes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../Layouts/MainLayout.js';  // Import MainLayout
import AboutCampusPlus from '../Pages/AboutCampusPlus/AboutCampusPlus.js';  // Import AboutCampusPlus
import ComingSoon from '../Pages/Coming Soon/ComingSoon.js';  // Import ComingSoon
import Contact from '../Pages/Contact/Contact.js';  // Import Contact
import Error404 from '../Pages/Error404/Error404.js';  // Import Error404
import FacultySection from '../Pages/Faculty/Faculty.js';  // Import FacultySection
import PastPapers from '../Pages/Past Papers/PastPapers.js';
import SignInPage from '../Pages/SignIn/SignInPage.js';
import PlaylistsPage from '../Pages/Playlists/PlaylistsPage.js'
import EmailGenerator from '../Pages/EmailGenerator/EmailGenerator.jsx';
import ApplicationGenerator from '../Pages/ApplicationGenerator/ApplicationGenerator.js';
import Support from '../Pages/Support/support.js'
import Timetable from "../Pages/Timetable/Timetable.js"
import News from '../Pages/Index/components/NewsAndEventsSection.js'


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
            <Route path="/timetable" element={<Timetable />} />
            <Route path="/email-generator" element={<EmailGenerator />} />
            <Route path="/application-generator" element={<ApplicationGenerator />} />
            <Route path="/support" element={<Support />} />
            <Route path="/news" element={<News />} />

        </Routes>
    );
}

export default AppRoutes;
