import React from 'react';
import './Navbar.css';
import Logo from '../cp_logo.png';
import { Link } from 'react-router-dom';
import { AiOutlineDown, AiOutlineHeart, AiOutlineFileText, AiOutlineHome, AiOutlineLaptop } from 'react-icons/ai';

function Navbar() {
    return (
        <>
            <nav className="navbar">
                <div className="nav-main">
                    <div className="logo">
                        <Link to="/Index">
                            <img src={Logo} alt="Logo" />
                            <span>ampus +</span>
                        </Link>
                    </div>

                    <ul className="nav-links">
                        <li><Link to="/past-papers">Past Papers</Link></li>
                        <li className="navbar-dropdown">
                            <span className="navbar-dropdown-toggle">
                                Services <AiOutlineDown className="navbar-dropdown-arrow" />
                            </span>
                            <div className="navbar-dropdown-menu">
                                <div className="navbar-dropdown-section">
                                    <AiOutlineHeart className="navbar-dropdown-icon" />
                                    <h4>Most Viewed Past Papers</h4>
                                    <p>Data Structures (DS)</p>
                                    <p>Calculus (Cal)</p>
                                    <p>Theory of Automata (TOA)</p>
                                    <p>Assembly Language (COAL)</p>
                                </div>
                                <div className="navbar-dropdown-section">
                                    <AiOutlineFileText className="navbar-dropdown-icon" />
                                    <h4>News & Events</h4>
                                    <p>FDC X</p>
                                    <p>SOFTEC '24</p>
                                    <p>GDSC Hiring Candidates?</p>
                                    <p>Change in HoD</p>
                                </div>
                                <div className="navbar-dropdown-section">
                                    <AiOutlineHome className="navbar-dropdown-icon" />
                                    <h4>Accessibility</h4>
                                    <p>Time Table Generator</p>
                                    <p>Faculty Information</p>
                                    <p>To Do List</p>
                                </div>
                                <div className="navbar-dropdown-section">
                                    <AiOutlineLaptop className="navbar-dropdown-icon" />
                                    <h4>Youtube Playlists</h4>
                                    <p>Abdul Bari (Algorithms)</p>
                                    <p>Neso Academy (DLD)</p>
                                    <p>Code with Harry (PF)</p>
                                    <p>Brain Molder (Database)</p>
                                </div>
                            </div>
                        </li>
                        <li><Link to="/generators">Generators</Link></li>
                        <li><Link to="/chatgpt">ChatGPT</Link></li>
                        <li><Link to="/student-support">Student Support</Link></li>
                        <li><Link to="/sign-in">Sign In</Link></li>
                    </ul>
                </div>
            </nav>
            <main>{/* Your main content */}</main>
        </>
    );
}

export default Navbar;