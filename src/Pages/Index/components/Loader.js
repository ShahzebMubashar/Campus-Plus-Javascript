import React, { useState, useEffect } from "react";
import "./Loader.css";
import logo from "../cp_logo.png";

const Loader = ({ isLoading }) => {
  const [forceHide, setForceHide] = useState(false);

  // Auto-hide loader after 3 seconds as a safety measure
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setForceHide(true);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setForceHide(false);
    }
  }, [isLoading]);

  // Hide loader if forceHide is true or if isLoading is false
  if (!isLoading || forceHide) {
    return null;
  }

  return (
    <div className="loader-wrapper" onClick={() => setForceHide(true)} style={{ cursor: 'pointer' }}>
      <div className="loader">
        <img src={logo} alt="Logo" className="loader-logo" />
      </div>
      <div style={{
        position: 'absolute',
        bottom: '20px',
        color: 'white',
        fontSize: '14px',
        textAlign: 'center',
        width: '100%'
      }}>
        Click anywhere to continue...
      </div>
    </div>
  );
};

export default Loader;
