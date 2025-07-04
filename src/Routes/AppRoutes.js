import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Loader from '../Pages/Index/components/Loader.js'; // Import Loader component
import MainLayout from '../Layouts/MainLayout.js';
import AboutCampusPlus from '../Pages/AboutCampusPlus/AboutCampusPlus.js';
import ComingSoon from '../Pages/Coming Soon/ComingSoon.js';
import Contact from '../Pages/Contact/ContactPage.js';
import Error404 from '../Pages/Error404/Error404.js';
import FacultySection from '../Pages/Faculty/Faculty.js';
import PastPapers from '../Pages/Past Papers/PastPapers.js';
import SignInPage from '../Pages/SignIn/SignInPage.js';
import PlaylistsPage from '../Pages/Playlists/PlaylistsPage.js';
import EmailGenerator from '../Pages/EmailGenerator/EmailGenerator.js';
import ApplicationGenerator from '../Pages/ApplicationGenerator/ApplicationGenerator.js';
import Support from '../Pages/Support/support.js';
import Timetable from '../Pages/Timetable/Timetable.js';
import Footer from '../Pages/Footer/Footer.js';
import News from '../Pages/NewsEvents/News.js';
import Map from '../Pages/Map/Map.js';
import Calculator from '../Pages/Calculators/Calculator.js';
import Chatroom from '../Pages/Chatroom/Chatrooms.js'
import PastPapersDetails from '../Pages/Past Papers/PastPaperDetails.js';
import Datesheet from '../Pages/Datesheet/Datesheet.js';
import Dashboard from '../Pages/Dashboard/Dashboard.js'
import ToDo from '../Pages/ToDoList/ToDo.js'
import Profile from '../Pages/Profile/ProfilePage.js'
import Transcript from '../Pages/Transcripts/Transcripts.js'
import Navbar from '../Pages/Index/components/Navbar.js';
import OurEvents from '../Pages/OurEvents/OurEvents.js';


function AppRoutes() {
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();

    useEffect(() => {
        // Show loader on location change
        setIsLoading(true);

        // Simulate loading delay (adjust to actual logic if needed)
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer); // Cleanup timeout on component unmount or location change
    }, [location]);

    return (
        <>
            <Loader isLoading={isLoading} />
            <Routes>
                {/* Default Route for Home page */}
                <Route path="*" element={<MainLayout />} />

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
                <Route path="/footer" element={<Footer />} />
                <Route path="/map" element={<Map />} />
                <Route path="/calculator" element={<Calculator />} />
                <Route path="/chatroom" element={<Chatroom />} />
                <Route path="/past-papers/:courseId" element={<PastPapersDetails />} />
                <Route path="/datesheet" element={<Datesheet />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/todo" element={<ToDo />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/transcript" element={<Transcript />} />
                <Route path="/navbar" element={<Navbar />} />
                <Route path="/ourevents" element={<OurEvents />} />
            </Routes>
        </>
    );
}

export default AppRoutes;
