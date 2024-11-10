import React from 'react';
import './AnnouncementBar.css';

const AnnouncementBar = () => {
    return (
        <div className="announcement-bar" id="announcement-bar">
            🎉 We've launched our Ambassador Program! Apply now to join the team!
            <a href="https://example.com/apply" className="apply-link" target="_blank" rel="noopener noreferrer">
                Apply Here
            </a>
        </div>
    );
};

export default AnnouncementBar;
