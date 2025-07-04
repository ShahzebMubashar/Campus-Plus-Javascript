import React from "react";
import "./Error404.css"; // Assuming this file is located in the same directory
// import logo from '../assets/images/cp_logo.png';
// import errorImage from '../assets/images/error-404.png';

const Error404 = () => {
  return (
    <div className="error-page">
      <div className="video-overlay"></div>
      <div className="container1">
        <div className="text-container1">
          <h2 className="fade-in">Oops! Page not found.</h2>
          <p className="fade-in-delay">
            We can't find the page you're looking for. Let's get you back on
            track!
          </p>
          <a href="/index.html" className="btn-hover">
            Go back home
          </a>
        </div>
        <div className="svg-container">
          <img className="img-background" src={""} alt="Error 404" />
        </div>
      </div>
    </div>
  );
};

export default Error404;
