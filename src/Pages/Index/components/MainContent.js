import React, { useEffect, useState } from "react";
import "./MainContent.css";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../../../utils/auth";

const MainContent = () => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(isAuthenticated());
    // Listen for auth state changes (e.g., login/logout elsewhere)
    const handler = () => setLoggedIn(isAuthenticated());
    window.addEventListener("authStateChanged", handler);
    return () => window.removeEventListener("authStateChanged", handler);
  }, []);

  const handleButtonClick = () => {
    if (loggedIn) {
      navigate("/dashboard");
    } else {
      navigate("/sign-in");
    }
  };

  return (
    <div className="content">
      <div className="content-container">
        <div className="text">
          <h1 style={{ color: "#0e1320" }}>
            <span>Empower Your Journey With</span>
            <span className="highlighted"> Campus +</span>
          </h1>
          <p style={{ color: "#576074", maxWidth: "80%" }}>
            Enhance learning with an advanced LMS featuring robust tools like Past
            Papers, Teachers info, Chatting Forums, GPA Calculators, and
            everything you need for seamless university life.
          </p>
          <div className="button-container">
            <button className="get-started-btn" onClick={handleButtonClick}>
              {loggedIn ? "Dashboard" : "Get started"} <i className="fas fa-paper-plane" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
