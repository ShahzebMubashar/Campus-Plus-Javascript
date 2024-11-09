// src/components/MainContent.js
import React from "react";

const MainContent = () => (
    <div className="content">
        <div className="content-container">
            <div className="text">
                <h1>
                    <span>Empower Your Journey With</span>
                    <span className="highlighted">Campus +</span>
                </h1>
                <p>Enhance learning with an advanced LMS...</p>
                <div className="button-container">
                    <a href="/html/aboutCampusPlus.html" className="get-started-btn">
                        Get started <ion-icon name="paper-plane"></ion-icon>
                    </a>
                </div>
            </div>
        </div>
    </div>
);

export default MainContent;
