import React, { useState, useEffect, useRef } from "react";
import "./SignInPage.css";
import Navbar from "../Index/components/Navbar";
import Footer from "../../Pages/Footer/Footer";
import logo from "../Index/cp_logo.png";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  // Backend logic/state from SignInPage.js
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // For animated character (if you want to add it later)
  // const [activeField, setActiveField] = useState(null);
  // const [isPasswordField, setIsPasswordField] = useState(false);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Backend: Sign In
  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage("Sign in successful!");
        localStorage.setItem("user", JSON.stringify(data.user));

        // Dispatch custom event to notify navbar of authentication change
        window.dispatchEvent(new CustomEvent('authStateChanged', {
          detail: { isAuthenticated: true, user: data.user }
        }));

        setTimeout(() => navigate("/"), 2000);
      } else {
        setMessage(data.error || "Sign in failed. Please try again.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again later.");
    }
  };

  // Backend: Sign Up
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:4000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: formData.lastName,
          fullName: formData.firstName,
          email: formData.email,
          password: formData.confirmPassword,
          rollnumber: formData.password,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message || "Sign up successful!");
        setTimeout(() => {
          setIsLogin(true);
          setFormData({
            email: "",
            password: "",
            confirmPassword: "",
            firstName: "",
            lastName: "",
          });
        }, 1000);
      } else {
        setMessage(data.error || "Sign up failed. Please try again.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again later.");
    }
  };

  // OAuth handlers
  const handleGoogleAuth = () => {
    window.location.href = "http://localhost:4000/auth/google";
  };

  const handleGitHubAuth = () => {
    window.location.href = "http://localhost:4000/auth/github";
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
    });
    setMessage("");
  };

  return (
    <>
      <Navbar />
      <div className="auth-container">
        {/* Animated Background */}


        {/* Main Content */}
        <div className="auth-wrapper">
          <div className="auth-card">
            {/* Header Section */}
            <div className="auth-header">
              <div
                className="logo-section"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                }}
              >
                <img
                  src={logo}
                  alt="Campus Plus Logo"
                  style={{ height: 38, width: 38, marginRight: 8 }}
                />
                <span
                  className="brand-name"
                  style={{
                    fontWeight: 700,
                    fontSize: "2rem",
                    color: "#1e293b",
                    letterSpacing: 0,
                  }}
                >
                  Campus{" "}
                  <span style={{ color: "#3b82f6", fontWeight: 700 }}>
                    Plus
                  </span>
                </span>
              </div>
              <p className="welcome-text">
                {isLogin
                  ? "Welcome back! Please sign in to your account."
                  : "Create your account to get started."}
              </p>
            </div>

            {/* Toggle Section */}
            <div className="toggle-section">
              <div className="toggle-container">
                <div
                  className={`toggle-background ${isLogin ? "login" : "signup"}`}
                >
                  <div className="moving-indicator"></div>
                </div>
                <button
                  type="button"
                  className={`toggle-option ${isLogin ? "active" : ""}`}
                  onClick={() => setIsLogin(true)}
                >
                  <span className="toggle-text">Sign In</span>
                </button>
                <button
                  type="button"
                  className={`toggle-option ${!isLogin ? "active" : ""}`}
                  onClick={() => setIsLogin(false)}
                >
                  <span className="toggle-text">Sign Up</span>
                </button>
              </div>
            </div>

            {/* Form Section */}
            <div className="form-wrapper">
              <form
                onSubmit={isLogin ? handleSignInSubmit : handleSignUpSubmit}
                className="auth-form"
              >
                <div
                  className={`form-content ${isLogin ? "login-mode" : "signup-mode"}`}
                >
                  {!isLogin && (
                    <div className="name-fields">
                      <div className="input-wrapper">
                        <input
                          type="text"
                          id="fullName"
                          value={formData.firstName}
                          onChange={(e) =>
                            handleInputChange("firstName", e.target.value)
                          }
                          required={!isLogin}
                          className="modern-input"
                          placeholder=" "
                        />
                        <label htmlFor="fullName" className="modern-label">
                          Full Name
                        </label>
                        <div className="input-border"></div>
                      </div>
                      <div className="input-wrapper">
                        <input
                          type="text"
                          id="username"
                          value={formData.lastName}
                          onChange={(e) =>
                            handleInputChange("lastName", e.target.value)
                          }
                          required={!isLogin}
                          className="modern-input"
                          placeholder=" "
                        />
                        <label htmlFor="username" className="modern-label">
                          Username
                        </label>
                        <div className="input-border"></div>
                      </div>
                    </div>
                  )}

                  <div className="input-wrapper">
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      required
                      className="modern-input"
                      placeholder=" "
                    />
                    <label htmlFor="email" className="modern-label">
                      Email Address
                    </label>
                    <div className="input-border"></div>
                  </div>

                  <div className="input-wrapper">
                    <input
                      type={isLogin ? "password" : "text"}
                      id={isLogin ? "password" : "rollNumber"}
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      required
                      className="modern-input"
                      placeholder=" "
                    />
                    <label
                      htmlFor={isLogin ? "password" : "rollNumber"}
                      className="modern-label"
                    >
                      {isLogin ? "Password" : "Roll Number"}
                    </label>
                    <div className="input-border"></div>
                  </div>

                  {!isLogin && (
                    <div className="input-wrapper">
                      <input
                        type="password"
                        id="password"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          handleInputChange("confirmPassword", e.target.value)
                        }
                        required={!isLogin}
                        className="modern-input"
                        placeholder=" "
                      />
                      <label htmlFor="password" className="modern-label">
                        Password
                      </label>
                      <div className="input-border"></div>
                    </div>
                  )}

                  {isLogin && (
                    <div className="forgot-section">
                      <button type="button" className="forgot-link">
                        Forgot your password?
                      </button>
                    </div>
                  )}

                  <button type="submit" className="submit-button">
                    <span className="button-content">
                      <span className="button-text">
                        {isLogin ? "Sign In" : "Create Account"}
                      </span>
                      <div className="button-icon">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M5 12H19M19 12L12 5M19 12L12 19"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </span>
                    <div className="button-shine"></div>
                  </button>
                  {message && (
                    <div
                      style={{
                        color: "#e11d48",
                        marginTop: 12,
                        textAlign: "center",
                      }}
                    >
                      {message}
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="auth-footer">
              <div className="divider">
                <span className="divider-text">or</span>
              </div>
              <div className="social-buttons">
                <button type="button" className="social-button google" onClick={handleGoogleAuth}>
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </button>
                <button type="button" className="social-button github" onClick={handleGitHubAuth}>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  Continue with GitHub
                </button>
              </div>
              <p className="switch-prompt">
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="switch-link"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
