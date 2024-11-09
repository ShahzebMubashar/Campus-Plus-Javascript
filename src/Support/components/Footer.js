import React, { useEffect } from 'react';

const Footer = () => {
    useEffect(() => {
        // Load footer content dynamically
        fetch('head-foot/footer.html')
            .then(response => response.text())
            .then(html => {
                document.getElementById('footer').innerHTML = html;
            });
    }, []);

    return <div id="footer" />;
};

export default Footer;
