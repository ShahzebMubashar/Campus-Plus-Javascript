import React, { useState, useEffect } from 'react';

const CookieBanner = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!localStorage.getItem('cookieConsent')) {
            setVisible(true);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem('cookieConsent', 'true');
        setVisible(false);
    };

    return (
        visible && (
            <div className="cookie-banner">
                <p>
                    We use cookies to ensure you get the best experience on our website. By continuing, you agree to
                    our <a href="/html/comingsoon.html">Privacy Policy</a> and <a href="/html/comingsoon.html">Cookie
                        Policy</a>.
                </p>
                <button onClick={acceptCookies} className="cookie-btn">
                    Accept
                </button>
            </div>
        )
    );
};

export default CookieBanner;
