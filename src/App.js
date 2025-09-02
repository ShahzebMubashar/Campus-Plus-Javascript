// src/App.js
import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react"; // Add this import

// import Navbar from './Pages/Index/components/Navbar.js';
import AppRoutes from "./Routes/AppRoutes.js";
import AboutCampusPlus from "./Pages/AboutCampusPlus/AboutCampusPlus.js"; // Import the AboutCampusPlus component
import ComingSoon from "./Pages/Coming Soon/ComingSoon.js"; // Import the ComingSoon component
import Contact from "./Pages/Contact/ContactPage.js"; // Import the Contact component
import Error404 from "./Pages/Error404/Error404.js";
import FacultySection from "./Pages/Faculty/Faculty.js";
import PastPapers from "./Pages/Past Papers/PastPapers.js";
import Notifications from "./Pages/Notifications/Notifications.js";
import OTPVerification from "./Pages/OTPVerification/OTPVerification.js"; // Import the OTPVerification component
import ForgotPasswordPage from "./Pages/ForgotPassword/ForgotPassword.js";

function App() {
  return (
    <div>
      <Router>
        <div className="App">
          <Routes>
            {/* Default Route for Home page */}
            <Route
              path="*"
              element={
                <>
                  <AppRoutes />
                </>
              }
            />

            {/* Route for AboutCampusPlus page (without Navbar) */}
            <Route path="/about-campus-plus" element={<AboutCampusPlus />} />
            <Route path="/coming-soon" element={<ComingSoon />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/error404" element={<Error404 />} />
            <Route path="/faculty" element={<FacultySection />} />
            <Route path="/past-papers" element={<PastPapers />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/otp-verification" element={<OTPVerification />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Catch-all route for 404 errors */}
          </Routes>
        </div>
      </Router>
      <Analytics />
      <SpeedInsights /> {/* Add this here */}
    </div>
  );
}

export default App;
