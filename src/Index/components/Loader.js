import React, { useEffect } from 'react';
import './Loader.css'; // Add Loader styles here or import from App.css

const Loader = () => {
    useEffect(() => {
        window.addEventListener('load', () => {
            document.querySelector('.loader-wrapper').style.display = 'none';
        });
    }, []);

    return (
        <div className="loader-wrapper">
            <div className="loader">
                <img src="/assets/images/cp_logo.png" alt="Logo" className="loader-logo" />
            </div>
        </div>
    );
};

export default Loader;
