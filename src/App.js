// src/App.js
import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// import Navbar from './Pages/Index/components/Navbar.js';
import AppRoutes from "./Routes/AppRoutes.js";
import AboutCampusPlus from "./Pages/AboutCampusPlus/AboutCampusPlus.js"; // Import the AboutCampusPlus component
import ComingSoon from "./Pages/Coming Soon/ComingSoon.js"; // Import the ComingSoon component
import Contact from "./Pages/Contact/ContactPage.js"; // Import the Contact component
import Error404 from "./Pages/Error404/Error404.js";
import FacultySection from "./Pages/Faculty/Faculty.js";
import PastPapers from "./Pages/Past Papers/PastPapers.js";
import Notifications from "./Pages/Notifications/Notifications.js";

function App() {
  return (
    <div>
      <Router>
        {/* Conditionally render Navbar only if the route is not '/about-campus-plus' */}
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
        </Routes>
    </div>
      </Router >
    </div >
  );
}

export default App;
