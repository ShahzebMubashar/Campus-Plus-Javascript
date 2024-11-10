// src/routes/AppRoutes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';  // Import MainLayout
import AboutCampusPlus from '../AboutCampusPlus/AboutCampusPlus';  // Import AboutCampusPlus

function AppRoutes() {
    return (
        <Routes>
            {/* Default Route for Home page */}
            <Route path="/" element={<MainLayout />} />

            {/* Route for AboutCampusPlus page (without the Navbar) */}
            <Route path="/about-campus-plus" element={<AboutCampusPlus />} />
        </Routes>
    );
}

export default AppRoutes;
