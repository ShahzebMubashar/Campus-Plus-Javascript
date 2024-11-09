// src/components/Footer.js
import React, { useEffect } from "react";

const Footer = () => {
    useEffect(() => {
        fetch("/html/head-foot/footer.html")
            .then(response => response.text())
            .then(html => {
                document.getElementById("footer").innerHTML = html;
            });
    }, []);

    return <div id="footer"></div>;
};

export default Footer;
