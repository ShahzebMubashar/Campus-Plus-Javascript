import React from 'react';
import './MainContent.css';

const MainContent = () => (
    <div className="content">
        <div className="content-container">
            <div className="text">
                <h1 style={{ color: '#0e1320' }}>
                    <span>Empower Your Journey With</span>
                    <span className="highlighted"> Campus +</span>
                </h1>
                <p style={{ color: '#576074', maxWidth: '80%' }}>
                    Enhance learning with an advanced LMS featuring robust tools like Past Papers, Teachers info,
                    Chatting Forums, GPA Calculators, and everything you need for seamless university life.
                </p>
                <div className="button-container">
                    <a href="/sign-in" className="get-started-btn">
                        Get started <i className="fas fa-paper-plane" />
                    </a>
                </div>
            </div>
        </div>
    </div>
);

export default MainContent;
