// src/App.js
import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './Index/components/Navbar';
import AppRoutes from './Routes/AppRoutes';
import AboutCampusPlus from './AboutCampusPlus/AboutCampusPlus'; // Import the AboutCampusPlus component

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
        </Routes>
      </Router>
    </div>
  );
}

export default App;
