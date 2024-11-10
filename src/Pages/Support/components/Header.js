import React, { useEffect } from 'react';

const Header = () => {
    useEffect(() => {
        // Load external navbar
        fetch('head-foot/navbar.html')
            .then(response => response.text())
            .then(html => {
                document.getElementById('header').innerHTML = html;
            });
    }, []);

    return <div id="header" />;
};

export default Header;
