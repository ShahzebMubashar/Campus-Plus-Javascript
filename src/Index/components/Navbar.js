import React, { useState } from 'react';
import './Navbar.css';
import logo from '../../../src/assets/images/cp_logo.png';
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
                            <li>Service 1</li>
                            <li><Link to="/about-campus-plus">Service 2</Link></li>
                            <li>Service 3</li>
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
