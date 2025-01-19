import React, { useState } from 'react';
import './News.css'; // Import a CSS file for styling
import NewsAndEventsSection from '../Index/components/NewsAndEventsSection'; // Adjust the import path as needed
import Footer from '../Footer/Footer'; // Adjust the import path as needed
import Navbar from '../Index/components/Navbar';
import NewsForm from './NewsForm';

const NewsPage = () => {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="news-page">
            <Navbar />
            <header className="support-header">
                <h1>FAST News Center</h1>
                <p>Your Gateway to Events, Updates, and All Things FAST!</p>
            </header>

            {/* Search Bar */}
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search Here"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button>
                    <i className="fas fa-search"></i>
                </button>
            </div>

            {/* News and Events Section */}
            <div className="news-and-events">
                <NewsAndEventsSection searchQuery={searchQuery} />
            </div>
            <NewsForm />

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default NewsPage;
