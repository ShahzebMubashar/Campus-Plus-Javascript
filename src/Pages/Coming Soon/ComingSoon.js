import React from 'react';
import './ComingSoon.css'; // Import the CSS file for styling

const ComingSoon = () => {
    return (
        <section className="coming-soon">
            <div className="coming-soon">
                <img src="/assets/images/cp_logo.png" alt="Website Logo" className="logo" />
                <div className="coming-soon-inner">
                    <div className="heading">Coming Soon</div>
                    <div className="small-heading">Stay tuned for updates</div>
                </div>
            </div>
        </section>
    );
};

export default ComingSoon;
