// src/components/Header.js
import React, { useEffect } from "react";

const Header = () => {
    useEffect(() => {
        // Load header.html dynamically
        fetch("/html/head-foot/navbar.html")
            .then(response => response.text())
            .then(html => {
                document.getElementById("header").innerHTML = html;
            });
    }, []);

    return <div id="header"></div>;
};

export default Header;
