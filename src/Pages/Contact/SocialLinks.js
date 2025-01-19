import React from 'react';

const SocialLinks = () => {
    return (
        <div className="social-media-links">
            <a href="https://github.com/MultiDexters" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-github social-icon"></i>
            </a>
            <a href="https://www.facebook.com/profile.php?id=61560884754001" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook-f social-icon"></i>
            </a>
            <a href="https://www.linkedin.com/in/multidexters/" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-linkedin-in social-icon"></i>
            </a>
            <a href="https://www.instagram.com/multidexters/" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram social-icon"></i>
            </a>
        </div>
    );
}

export default SocialLinks;
