import React, { useState, useEffect } from "react";
import "./Loader.css";
import logo from "../cp_logo.png";

const Loader = ({ isLoading }) => {
  return (
    isLoading && (
      <div className="loader-wrapper">
        <div className="loader">
          <img src={logo} alt="Logo" className="loader-logo" />
        </div>
      </div>
    )
  );
};

export default Loader;
