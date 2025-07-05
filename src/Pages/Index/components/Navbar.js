import React, { useState, useEffect } from "react";
import "./Navbar.css";
import Logo from "../cp_logo.png";
import { Link, useNavigate } from "react-router-dom";
import {
  AiOutlineDown,
  AiOutlineHeart,
  AiOutlineFileText,
  AiOutlineHome,
  AiOutlineLaptop,
  AiOutlineMenu,
  AiOutlineClose,
} from "react-icons/ai";
import support from "../../../Assets/images/support.png";
import message from "../../../Assets/images/conversation.png";
import settings from "../../../Assets/images/setting.png";
import profile from "../../../Assets/images/user.png";
import notifications from "../../../Assets/images/active.png";
import logout from "../../../Assets/images/logout.png";
import transcript from "../../../Assets/images/transcript.png";
// import bell from "../../../Assets/images/bell.png"
// import { FaUserCircle } from 'react-icons/fa';

// const [showUserMenu, setShowUserMenu] = useState(false);

// const toggleUserMenu = () => {
//     setShowUserMenu(!showUserMenu);
// };

// Helper function to get user initials from username
const getUserInitials = (username) => {
  if (!username) return "U";

  // Split the username by spaces to get first and last name
  const nameParts = username.split(" ");

  // If there are multiple parts, use first letter of first and last part
  if (nameParts.length > 1) {
    return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
  }

  // If no spaces (single name), check for other separators like underscore, dots, etc.
  const parts = username.split(/[._-]/);
  if (parts.length > 1) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  // If single word with no separators, use first two letters
  return username.substring(0, 2).toUpperCase();
};

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const navigate = useNavigate();

  const checkSession = async () => {
    try {
      // First try the regular user profile endpoint
      const response = await fetch("http://localhost:4000/user/profile", {
        credentials: "include",
      });

      if (response.ok) {
        setIsLoggedIn(true);
        const data = await response.json();
        setUserData(data);
        localStorage.setItem("user", JSON.stringify(data));
        return;
      }

      // If that fails, try the OAuth current-user endpoint
      const oauthResponse = await fetch("http://localhost:4000/auth/current-user", {
        credentials: "include",
      });

      if (oauthResponse.ok) {
        const oauthData = await oauthResponse.json();
        if (oauthData.isAuthenticated) {
          setIsLoggedIn(true);
          setUserData(oauthData);
          localStorage.setItem("user", JSON.stringify(oauthData));
          return;
        }
      }

      // If both fail, user is not logged in
      setIsLoggedIn(false);
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Session check failed:", error);
      setIsLoggedIn(false);
      localStorage.removeItem("user");
    }
  };

  useEffect(() => {
    checkSession();

    // Try to get user data from localStorage if available
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUserData(JSON.parse(storedUser));
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Error parsing stored user data:", error);
      }
    }

    // Listen for authentication state changes
    const handleAuthStateChange = (event) => {
      if (event.detail.isAuthenticated) {
        setIsLoggedIn(true);
        setUserData(event.detail.user);
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
    };

    window.addEventListener('authStateChanged', handleAuthStateChange);

    // Check session every 5 minutes
    const interval = setInterval(checkSession, 5 * 60 * 1000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('authStateChanged', handleAuthStateChange);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:4000/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        setUserData(null);

        // Dispatch custom event to notify other components of logout
        window.dispatchEvent(new CustomEvent('authStateChanged', {
          detail: { isAuthenticated: false, user: null }
        }));

        navigate("/sign-in");
      } else {
        console.error("Logout failed:", response.statusText);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Helper to determine if mobile
  const isMobile = () => window.innerWidth <= 1024;

  // Dropdown toggle handler
  const handleDropdownToggle = (dropdownName) => {
    if (!isMobile()) return; // Only apply on mobile
    setOpenDropdown((prev) => (prev === dropdownName ? null : dropdownName));
  };

  // Close dropdown on link click (mobile only)
  const handleDropdownLinkClick = () => {
    if (isMobile()) setOpenDropdown(null);
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
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

          <button
            className={`mobile-menu-button ${isMobileMenuOpen ? "menu-open" : ""}`}
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
          </button>

          <ul
            className={`nav-links ${isMobileMenuOpen ? "mobile-menu-open" : ""}`}
          >
            <li>
              <Link to="/past-papers" onClick={handleDropdownLinkClick}>
                Past Papers
              </Link>
            </li>

            <li className="navbar-dropdown">
              <span
                className="navbar-dropdown-toggle"
                onClick={() => handleDropdownToggle("services")}
              >
                Services <AiOutlineDown className="navbar-dropdown-arrow" />
              </span>
              <div
                className="navbar-dropdown-menu"
                style={{
                  display: isMobile()
                    ? openDropdown === "services"
                      ? "block"
                      : "none"
                    : undefined,
                }}
              >
                <div className="navbar-dropdown-section">
                  <AiOutlineHeart className="navbar-dropdown-icon" />
                  <h4>
                    <Link to="/past-papers" onClick={handleDropdownLinkClick}>
                      Most Viewed Past Papers
                    </Link>
                  </h4>
                  <p>
                    <Link to="/past-papers" onClick={handleDropdownLinkClick}>
                      Data Structures (DS)
                    </Link>
                  </p>
                  <p>
                    <Link to="/past-papers" onClick={handleDropdownLinkClick}>
                      Calculus (Cal)
                    </Link>
                  </p>
                  <p>
                    <Link to="/past-papers" onClick={handleDropdownLinkClick}>
                      Theory of Automata (TOA)
                    </Link>
                  </p>
                  <p>
                    <Link to="/past-papers" onClick={handleDropdownLinkClick}>
                      Assembly Language (COAL)
                    </Link>
                  </p>
                </div>
                <div className="navbar-dropdown-section">
                  <AiOutlineFileText className="navbar-dropdown-icon" />
                  <h4>
                    <Link to="/news" onClick={handleDropdownLinkClick}>
                      News & Events
                    </Link>
                  </h4>
                  <p>
                    <Link to="/news" onClick={handleDropdownLinkClick}>
                      FDC X
                    </Link>
                  </p>
                  <p>
                    <Link to="/news" onClick={handleDropdownLinkClick}>
                      SOFTEC '24
                    </Link>
                  </p>
                  <p>
                    <Link to="/news" onClick={handleDropdownLinkClick}>
                      GDSC Hiring Candidates?
                    </Link>
                  </p>
                  <p>
                    <Link to="/news" onClick={handleDropdownLinkClick}>
                      Change in HoD
                    </Link>
                  </p>
                </div>
                <div className="navbar-dropdown-section">
                  <AiOutlineHome className="navbar-dropdown-icon" />
                  <h4>Accessibility</h4>
                  <p>
                    <Link to="/timetable" onClick={handleDropdownLinkClick}>
                      Time Table Generator
                    </Link>
                  </p>
                  <p>
                    <Link to="/faculty" onClick={handleDropdownLinkClick}>
                      Faculty Information
                    </Link>
                  </p>
                  <p>
                    <Link to="/todo" onClick={handleDropdownLinkClick}>
                      To Do List
                    </Link>
                  </p>
                </div>
                <div className="navbar-dropdown-section">
                  <AiOutlineLaptop className="navbar-dropdown-icon" />
                  <h4>
                    <Link to="/playlists" onClick={handleDropdownLinkClick}>
                      Youtube Playlists
                    </Link>
                  </h4>
                  <p>
                    <Link to="/playlists" onClick={handleDropdownLinkClick}>
                      Abdul Bari (Algorithms)
                    </Link>
                  </p>
                  <p>
                    <Link to="/playlists" onClick={handleDropdownLinkClick}>
                      Neso Academy (DLD)
                    </Link>
                  </p>
                  <p>
                    <Link to="/playlists" onClick={handleDropdownLinkClick}>
                      Code with Harry (PF)
                    </Link>
                  </p>
                  <p>
                    <Link to="/playlists" onClick={handleDropdownLinkClick}>
                      {" "}
                      Molder (Database)
                    </Link>
                  </p>
                </div>
              </div>
            </li>

            <li className="navbar-dropdown">
              <span
                className="navbar-dropdown-toggle"
                onClick={() => handleDropdownToggle("generators")}
              >
                Generators <AiOutlineDown className="navbar-dropdown-arrow" />
              </span>
              <div
                className="navbar-dropdown-menu"
                style={{
                  display: isMobile()
                    ? openDropdown === "generators"
                      ? "block"
                      : "none"
                    : undefined,
                }}
              >
                <div className="navbar-dropdown-section">
                  <AiOutlineHeart className="navbar-dropdown-icon" />
                  <h4>Calculators</h4>
                  <p>
                    <Link to="/calculator" onClick={handleDropdownLinkClick}>
                      Aggregate Calculator
                    </Link>
                  </p>
                  <p>
                    <Link to="/calculator" onClick={handleDropdownLinkClick}>
                      SGPA Calculator
                    </Link>
                  </p>
                  <p>
                    <Link to="/calculator" onClick={handleDropdownLinkClick}>
                      CGPA Calculator
                    </Link>
                  </p>
                </div>
                <div className="navbar-dropdown-section">
                  <AiOutlineFileText className="navbar-dropdown-icon" />
                  <h4>Email Support</h4>
                  <p>
                    <Link
                      to="/email-generator"
                      onClick={handleDropdownLinkClick}
                    >
                      Email Generator
                    </Link>
                  </p>
                  <p>
                    <Link to="/faculty" onClick={handleDropdownLinkClick}>
                      Faculty Emails
                    </Link>
                  </p>
                </div>
                <div className="navbar-dropdown-section">
                  <AiOutlineHome className="navbar-dropdown-icon" />
                  <h4>Application Support</h4>
                  <p>
                    <Link
                      to="/application-generator"
                      onClick={handleDropdownLinkClick}
                    >
                      Application Generator
                    </Link>
                  </p>
                  <p>
                    <Link to="/support" onClick={handleDropdownLinkClick}>
                      General Queries
                    </Link>
                  </p>
                </div>
                <div className="navbar-dropdown-section">
                  <AiOutlineHome className="navbar-dropdown-icon" />
                  <h4>Time Table & Date Sheet</h4>
                  <p>
                    <Link to="/datesheet" onClick={handleDropdownLinkClick}>
                      Date Sheet Generator
                    </Link>
                  </p>
                  <p>
                    <Link to="/timetable" onClick={handleDropdownLinkClick}>
                      Time Table Generator
                    </Link>
                  </p>
                  <p>
                    <Link to="/past-papers" onClick={handleDropdownLinkClick}>
                      Courses List
                    </Link>
                  </p>
                </div>
              </div>
            </li>

            <li>
              <Link to="/chatroom" onClick={handleDropdownLinkClick}>
                Chatrooms
              </Link>
            </li>

            <li className="navbar-dropdown">
              <span
                className="navbar-dropdown-toggle"
                onClick={() => handleDropdownToggle("support")}
              >
                Student Support{" "}
                <AiOutlineDown className="navbar-dropdown-arrow" />
              </span>
              <div
                className="navbar-dropdown-menu"
                style={{
                  display: isMobile()
                    ? openDropdown === "support"
                      ? "block"
                      : "none"
                    : undefined,
                }}
              >
                <div className="navbar-dropdown-section">
                  <AiOutlineHeart className="navbar-dropdown-icon" />
                  <h4>
                    <Link
                      to="https://thebrainbytes.blogspot.com/"
                      onClick={handleDropdownLinkClick}
                    >
                      Blogs
                    </Link>
                  </h4>
                  <p>
                    <Link
                      to="https://thebrainbytesquantum.blogspot.com/"
                      onClick={handleDropdownLinkClick}
                    >
                      Quantum Computing
                    </Link>
                  </p>
                  <p>
                    <Link
                      to="https://thebrainbytespsychology.blogspot.com/"
                      onClick={handleDropdownLinkClick}
                    >
                      Psychology
                    </Link>
                  </p>
                  <p>
                    <Link
                      to="https://thebrainbytessports.blogspot.com/"
                      onClick={handleDropdownLinkClick}
                    >
                      Sports
                    </Link>
                  </p>
                  <p>
                    <Link
                      to="https://thebrainbytesdatascience.blogspot.com/"
                      onClick={handleDropdownLinkClick}
                    >
                      Data Science
                    </Link>
                  </p>
                  <p>
                    <Link
                      to="https://thebrainbytestechnology.blogspot.com/"
                      onClick={handleDropdownLinkClick}
                    >
                      Technology
                    </Link>
                  </p>
                </div>
                <div className="navbar-dropdown-section">
                  <AiOutlineFileText className="navbar-dropdown-icon" />
                  <h4>
                    <Link to="/support" onClick={handleDropdownLinkClick}>
                      Frequently Asked Questions
                    </Link>
                  </h4>
                  <p>
                    <Link to="/support" onClick={handleDropdownLinkClick}>
                      General Queries
                    </Link>
                  </p>
                  <p>
                    <Link to="/support" onClick={handleDropdownLinkClick}>
                      Admission Related Queries
                    </Link>
                  </p>
                  <p>
                    <Link to="/support" onClick={handleDropdownLinkClick}>
                      Finding Go-To Person
                    </Link>
                  </p>
                  <p>
                    <Link to="/support" onClick={handleDropdownLinkClick}>
                      Technical Queries
                    </Link>
                  </p>
                  <p>
                    <Link to="/support" onClick={handleDropdownLinkClick}>
                      Others
                    </Link>
                  </p>
                </div>
                <div className="navbar-dropdown-section">
                  <AiOutlineHome className="navbar-dropdown-icon" />
                  <h4>About Us</h4>
                  <p>
                    <Link to="/ourevents" onClick={handleDropdownLinkClick}>
                      Our Events
                    </Link>
                  </p>
                  <p>
                    <Link
                      to="/about-campus-plus"
                      onClick={handleDropdownLinkClick}
                    >
                      About Campus +
                    </Link>
                  </p>
                  <p>
                    <Link
                      to="https://www.multidexters.live/"
                      onClick={handleDropdownLinkClick}
                    >
                      About MultiDexters
                    </Link>
                  </p>
                  <p>
                    <Link to="/contact" onClick={handleDropdownLinkClick}>
                      Contact Us
                    </Link>
                  </p>
                </div>
              </div>
            </li>
            {isLoggedIn ? (
              <>
                <li>
                  <Link to="/dashboard" onClick={handleDropdownLinkClick}>
                    Dashboard
                  </Link>
                </li>
                <li className="navbaruser-dropdown">
                  <div className="navbaruser-icon">
                    <div className="navbar-profile-avatar">
                      {userData?.profilePic ? (
                        <img src={userData.profilePic} alt="Profile" />
                      ) : (
                        <span>
                          {userData?.name
                            ? getUserInitials(userData.name)
                            : userData?.username
                              ? getUserInitials(userData.username)
                              : "U"}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="navbaruser-dropdown-menu">
                    {/* Section 1 */}
                    <Link to="/profile">
                      <img
                        src={profile}
                        alt="Profile"
                        style={{ width: "18px", marginRight: "8px" }}
                      />
                      My Profile
                    </Link>
                    <Link to="/transcript">
                      <img
                        src={transcript}
                        alt="Transcript"
                        style={{ width: "18px", marginRight: "8px" }}
                      />
                      Transcript
                    </Link>

                    <Link to="/support">
                      <img
                        src={support}
                        alt="Help"
                        style={{ width: "20px", marginRight: "8px" }}
                      />
                      Help
                    </Link>

                    <hr className="dropdown-divider" />

                    {/* Section 2 */}
                    <Link to="/notifications">
                      <img
                        src={notifications}
                        alt="Notifications"
                        style={{ width: "18px", marginRight: "8px" }}
                      />
                      Notifications
                    </Link>
                    <Link to="/chatroom">
                      <img
                        src={message}
                        alt="Messages"
                        style={{ width: "18px", marginRight: "8px" }}
                      />
                      Messages
                    </Link>

                    <hr className="dropdown-divider" />

                    {/* Section 3 */}
                    <Link to="/settings">
                      <img
                        src={settings}
                        alt="Settings"
                        style={{ width: "18px", marginRight: "8px" }}
                      />
                      Settings
                    </Link>
                    <span onClick={handleLogout} style={{ cursor: "pointer" }}>
                      <img
                        src={logout}
                        alt="Logout"
                        style={{ width: "18px", marginRight: "8px" }}
                      />
                      Log out
                    </span>
                  </div>
                </li>
              </>
            ) : (
              <li>
                <Link to="/sign-in" onClick={handleDropdownLinkClick}>
                  Sign In
                </Link>
              </li>
            )}
          </ul>
        </div>
      </nav>
      <main>{/* Your main content */}</main>
    </>
  );
}

export default Navbar;
