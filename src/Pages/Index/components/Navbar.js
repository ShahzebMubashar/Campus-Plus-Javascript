import React from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';
import { AiOutlineDown, AiOutlineHeart, AiOutlineFileText, AiOutlineHome, AiOutlineLaptop } from 'react-icons/ai';

function Navbar() {
    return (
        <nav className="navbar">
            <div className="logo">
                <Link to="/log-in">Campus<span className="plus">+</span></Link>
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
                            <div>
                                <h4>Most Viewed Past Papers</h4>
                                <p>Data Structures (DS)</p>
                                <p>Calculus (Cal)</p>
                                <p>Theory of Automata (TOA)</p>
                                <p>Assembly Language (COAL)</p>
                            </div>
                        </div>
                        <div className="navbar-dropdown-section">
                            <AiOutlineFileText className="navbar-dropdown-icon" />
                            <div>
                                <h4>News & Events</h4>
                                <p>FDC X</p>
                                <p>SOFTEC '24</p>
                                <p>GDSC Hiring Candidates?</p>
                                <p>Change in HoD</p>
                            </div>
                        </div>
                        <div className="navbar-dropdown-section">
                            <AiOutlineHome className="navbar-dropdown-icon" />
                            <div>
                                <h4>Accessibility</h4>
                                <p>Faculty Info</p>
                                <p>Time Table Generator</p>
                                <p>Faculty Information</p>
                                <p>To Do List</p>
                            </div>
                        </div>
                        <div className="navbar-dropdown-section">
                            <AiOutlineLaptop className="navbar-dropdown-icon" />
                            <div>
                                <h4>Youtube Playlists</h4>
                                <p>Abdul Bari (Algorithms)</p>
                                <p>Neso Academy (DLD)</p>
                                <p>Code with Harry (PF)</p>
                                <p>Brain Molder (Database)</p>
                            </div>
                        </div>
                    </div>
                </li>
                <li><Link to="/generators">Generators</Link></li>
                <li><Link to="/chatgpt">ChatGPT</Link></li>
                <li><Link to="/student-support">Student Support</Link></li>
                <li><Link to="/sign-in">Sign In</Link></li> {/* Add this link */}
            </ul>
        </nav>
    );
}

export default Navbar;
