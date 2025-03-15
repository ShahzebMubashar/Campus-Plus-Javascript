import React, { useState, useEffect } from 'react';
import './Navbar.css';
import Logo from '../cp_logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineDown, AiOutlineHeart, AiOutlineFileText, AiOutlineHome, AiOutlineLaptop } from 'react-icons/ai';

function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    const checkSession = async () => {
        try {
            const response = await fetch("http://localhost:4000/user/profile", {
                credentials: "include"
            });
            setIsLoggedIn(response.ok);
            if (!response.ok) {
                localStorage.removeItem("user");
            }
        } catch (error) {
            console.error("Session check failed:", error);
            setIsLoggedIn(false);
            localStorage.removeItem("user");
        }
    };

    useEffect(() => {
        checkSession();
        // Check session every 5 minutes
        const interval = setInterval(checkSession, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const handleLogout = async () => {
        try {
            const response = await fetch("http://localhost:4000/logout", {
                method: "POST",
                credentials: "include",
            });

            if (response.ok) {
                localStorage.removeItem("user");
                setIsLoggedIn(false);
                navigate("/sign-in");
            } else {
                console.error("Logout failed:", response.statusText);
            }
        } catch (error) {
            console.error("Logout error:", error);
        }
    };


    return (
        <>
            <nav className="navbar">
                <div className="nav-main">
                    <div className="logo">
                        <Link to="/">
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
                                    <h4><Link to="/past-papers">Most Viewed Past Papers</Link></h4>
                                    <p><Link to="/past-papers">Data Structures (DS)</Link></p>
                                    <p><Link to="/past-papers">Calculus (Cal)</Link></p>
                                    <p><Link to="/past-papers">Theory of Automata (TOA)</Link></p>
                                    <p><Link to="/past-papers">Assembly Language (COAL)</Link></p>
                                </div>
                                <div className="navbar-dropdown-section">
                                    <AiOutlineFileText className="navbar-dropdown-icon" />
                                    <h4><Link to="/news">News & Events</Link></h4>
                                    <p><Link to="/news">FDC X</Link></p>
                                    <p><Link to="/news">SOFTEC '24</Link></p>
                                    <p><Link to="/news">GDSC Hiring Candidates?</Link></p>
                                    <p><Link to="/news">Change in HoD</Link></p>
                                </div>
                                <div className="navbar-dropdown-section">
                                    <AiOutlineHome className="navbar-dropdown-icon" />
                                    <h4>Accessibility</h4>
                                    <p><Link to="/timetable">Time Table Generator</Link></p>
                                    <p><Link to="/faculty">Faculty Information</Link></p>
                                    <p>To Do List</p>
                                </div>
                                <div className="navbar-dropdown-section">
                                    <AiOutlineLaptop className="navbar-dropdown-icon" />
                                    <h4><Link to="/playlists">Youtube Playlists</Link></h4>
                                    <p><Link to="/playlists">Abdul Bari (Algorithms)</Link></p>
                                    <p><Link to="/playlists">Neso Academy (DLD)</Link></p>
                                    <p><Link to="/playlists">Code with Harry (PF)</Link></p>
                                    <p><Link to="/playlists"> Molder (Database)</Link></p>
                                </div>
                            </div>
                        </li>

                        <li className="navbar-dropdown">
                            <span className="navbar-dropdown-toggle">
                                Generators <AiOutlineDown className="navbar-dropdown-arrow" />
                            </span>
                            <div className="navbar-dropdown-menu">
                                <div className="navbar-dropdown-section">
                                    <AiOutlineHeart className="navbar-dropdown-icon" />
                                    <h4>Calculators</h4>
                                    <p><Link to="/calculator">Aggregate Calculator</Link></p>
                                    <p><Link to="/calculator">SGPA Calculator</Link></p>
                                    <p><Link to="/calculator">CGPA Calculator</Link></p>
                                </div>
                                <div className="navbar-dropdown-section">
                                    <AiOutlineFileText className="navbar-dropdown-icon" />
                                    <h4>Email Support</h4>
                                    <p><Link to="/email-generator">Email Generator</Link></p>
                                    <p><Link to="/faculty">Faculty Emails</Link></p>
                                </div>
                                <div className="navbar-dropdown-section">
                                    <AiOutlineHome className="navbar-dropdown-icon" />
                                    <h4>Application Support</h4>
                                    <p><Link to="/application-generator">Application Generator</Link></p>
                                    <p><Link to="/support">General Queries</Link></p>
                                </div>
                                <div className="navbar-dropdown-section">
                                    <AiOutlineHome className="navbar-dropdown-icon" />
                                    <h4>Time Table Support</h4>
                                    <p><Link to="/timetable">Time Table Generator</Link></p>
                                    <p><Link to="/past-papers">Courses List</Link></p>
                                </div>
                            </div>
                        </li>

                        <li><Link to="/chatroom">Chatrooms</Link></li>
                        <li className="navbar-dropdown">
                            <span className="navbar-dropdown-toggle">
                                Student Support <AiOutlineDown className="navbar-dropdown-arrow" />
                            </span>
                            <div className="navbar-dropdown-menu">
                                <div className="navbar-dropdown-section">
                                    <AiOutlineHeart className="navbar-dropdown-icon" />
                                    <h4><Link to="https://thebrainbytes.blogspot.com/">Blogs</Link></h4>
                                    <p><Link to="https://thebrainbytesquantum.blogspot.com/">Quantum Computing</Link></p>
                                    <p><Link to="https://thebrainbytespsychology.blogspot.com/">Psychology</Link></p>
                                    <p><Link to="https://thebrainbytessports.blogspot.com/">Sports</Link></p>
                                    <p><Link to="https://thebrainbytesdatascience.blogspot.com/">Data Science</Link></p>
                                    <p><Link to="https://thebrainbytestechnology.blogspot.com/">Technology</Link></p>
                                </div>
                                <div className="navbar-dropdown-section">
                                    <AiOutlineFileText className="navbar-dropdown-icon" />
                                    <h4><Link to="/support">Frequently Asked Questions</Link></h4>
                                    <p><Link to="/support">General Queries</Link></p>
                                    <p><Link to="/support">Admission Related Queries</Link></p>
                                    <p><Link to="/support">Finding Go-To Person</Link></p>
                                    <p><Link to="/support">Technical Queries</Link></p>
                                    <p><Link to="/support">Others</Link></p>
                                </div>
                                <div className="navbar-dropdown-section">
                                    <AiOutlineHome className="navbar-dropdown-icon" />
                                    <h4>About Us</h4>
                                    <p><Link to="/about-campus-plus">About Campus +</Link></p>
                                    <p><Link to="https://www.multidexters.live/">About MultiDexters</Link></p>
                                    <p><Link to="/contact">Contact Us</Link></p>

                                </div>

                            </div>

                        </li>
                        {isLoggedIn ? (
                            // Show "Logout" if the user is logged in
                            <li onClick={handleLogout} style={{ cursor: "pointer" }}>
                                Logout
                            </li>
                        ) : (
                            // Show "Sign In" if the user is not logged in
                            <li><Link to="/sign-in">Sign In</Link></li>
                        )}

                    </ul>
                </div>
            </nav>
            <main>{/* Your main content */}</main>
        </>
    );
}

export default Navbar;
