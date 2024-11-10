// src/App.js
import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './Pages/Index/components/Navbar';
import AppRoutes from './Routes/AppRoutes';
import AboutCampusPlus from './Pages/AboutCampusPlus/AboutCampusPlus'; // Import the AboutCampusPlus component
import ComingSoon from './Pages/Coming Soon/ComingSoon'; // Import the ComingSoon component
import Contact from './Pages/Contact/Contact'; // Import the Contact component
import Error404 from './Pages/Error404/Error404';
import FacultySection from './Pages/Faculty/Faculty';
import PastPapers from './Pages/Past Papers/PastPapers';

function App() {
  return (
    <div>
      <Router>
        {/* Conditionally render Navbar only if the route is not '/about-campus-plus' */}
        <Routes>
          {/* Default Route for Home page */}
          <Route
            path="/"
            element={
              <>
                <Navbar /> {/* Render Navbar only on the home page */}
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
        </Routes>
      </Router>
    </div>
  );
}

export default App;
