import React, { useState } from 'react';
import './Navbar.css';
import logo from '../../../Assets/images/cp_logo.png';
import { Link } from 'react-router-dom';


function Navbar() {
    return (
        <>
            <nav className="navbar">
                <div className="logo"><Link to="/">< img src={logo} /></Link></div>
                <ul className="nav-links">
                    <li>Past Papers</li>
                    <li className="dropdown">
                        <span>Services ▼</span>
                        <ul className="dropdown-menu">
                            <li><Link to={"/contact"}>Contact</Link></li>
                            <li><Link to="/about-campus-plus">About Campus Plus</Link></li>
                            <li><Link to={"/coming-soon"}>Coming Soon</Link></li>
                            <li><Link to={"/error404"}>Error 404</Link></li>
                        </ul>
                    </li>
                    <li className="dropdown">
                        <span>Generators ▼</span>
                        <ul className="dropdown-menu">
                            <li>Generator 1</li>
                            <li>Generator 2</li>
                        </ul>
                    </li>
                    <li>ChatGPT</li>
                    <li className="dropdown">
                        <span>Student Support ▼</span>
                        <ul className="dropdown-menu">
                            <li>Support 1</li>
                            <li>Support 2</li>
                        </ul>
                    </li>
                </ul>
            </nav>
        </>
    );
}

export default Navbar;
