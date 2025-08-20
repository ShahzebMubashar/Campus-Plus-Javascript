import React, { useState, useEffect } from "react";
import "./OTPVerification.css";
import Navbar from "../Index/components/Navbar";
import Footer from "../../Pages/Footer/Footer";
import logo from "../Index/cp_logo.png";
import { useNavigate, useLocation } from "react-router-dom";
import API_BASE_URL from "../../config/api";
import { loginWithTokens } from "../../utils/auth";

export default function OTPVerification() {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");
    const [isSuccessMessage, setIsSuccessMessage] = useState(false);
    const [countdown, setCountdown] = useState(5);
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [rollnumber, setRollnumber] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();
    const location = useLocation();

    // Check if we have email data from the registration process
    useEffect(() => {
        if (location.state && location.state.email) {
            setEmail(location.state.email);
            setUsername(location.state.username || ""); // Use username from state or empty
            setRollnumber(location.state.rollnumber || ""); // Use rollnumber from state or empty
            setPassword(location.state.password || ""); // Use password from state or empty
        } else {
            // If no email is provided, redirect back to sign up
            navigate("/sign-in");
        }
    }, [location, navigate]);

    // Handle OTP input changes
    const handleOtpChange = (element, index) => {
        if (isNaN(element.value)) return false;

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        // Focus next input
        if (element.nextSibling && element.value !== "") {
            element.nextSibling.focus();
        }
    };

    // Handle key events for OTP inputs
    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !e.target.value && index > 0) {
            // Focus previous input on backspace
            const prevInput = e.target.form[`otp-${index - 1}`];
            if (prevInput) prevInput.focus();
        }
    };

    // Handle OTP verification
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const otpValue = otp.join("");

        if (otpValue.length !== 6) {
            setMessage("Please enter a valid 6-digit OTP");
            setIsSuccessMessage(false);
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    otp: otpValue,
                    username: location.state?.username || "", // Use username from state or empty
                    rollnumber: location.state?.rollnumber || "", // Use rollnumber from state or empty
                    password: location.state?.password || "", // Use password from state or empty
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("OTP verified successfully! Your account has been created.");
                setIsSuccessMessage(true);

                // Store JWT tokens and user data for new user
                loginWithTokens(
                    {
                        accessToken: data.accessToken,
                        refreshToken: data.refreshToken,
                    },
                    data.user
                );

                setTimeout(() => navigate("/dashboard"), 2000);
            } else {
                setMessage(data.error || "OTP verification failed. Please try again.");
                setIsSuccessMessage(false);
            }
        } catch (error) {
            setMessage("An error occurred. Please try again later.");
            setIsSuccessMessage(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle resend OTP
    const handleResendOtp = async () => {
        if (countdown > 0) return;

        try {
            const response = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("New OTP sent to your email!");
                setIsSuccessMessage(true);
                setCountdown(60); // 60 seconds countdown
            } else {
                setMessage(data.error || "Failed to resend OTP. Please try again.");
                setIsSuccessMessage(false);
            }
        } catch (error) {
            setMessage("An error occurred. Please try again later.");
            setIsSuccessMessage(false);
        }
    };

    // Countdown timer effect
    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [countdown]);

    return (
        <>
            <Navbar />
            <div className="auth-container">
                {/* Loading overlay for OTP verification */}
                {isSubmitting && (
                    <div className="signing-in-overlay">
                        <div className="signing-in-spinner"></div>
                        <div className="signing-in-message">
                            Verifying OTP...
                        </div>
                    </div>
                )}

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
                                Verify your email address
                            </p>
                            <p className="otp-instructions">
                                We've sent a 6-digit verification code to <strong>{email}</strong>.
                                Enter the code below to continue.
                            </p>
                        </div>

                        {/* Form Section */}
                        <div className="form-wrapper">
                            <form onSubmit={handleVerifyOtp} className="auth-form">
                                <div className="form-content">
                                    <div className="otp-input-container">
                                        {otp.map((data, index) => (
                                            <input
                                                key={index}
                                                type="text"
                                                name={`otp-${index}`}
                                                maxLength="1"
                                                value={data}
                                                onChange={e => handleOtpChange(e.target, index)}
                                                onKeyDown={e => handleKeyDown(e, index)}
                                                className="otp-input"
                                                autoFocus={index === 0}
                                            />
                                        ))}
                                    </div>

                                    <button type="submit" className="submit-button" disabled={isSubmitting}>
                                        <span className="button-content">
                                            <span className="button-text">
                                                Verify OTP
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
                                        <div className={`message-container ${isSuccessMessage ? 'success' : 'error'}`}>
                                            {isSuccessMessage ? (
                                                <div className="success-message">
                                                    <div className="success-icon">
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                            <path
                                                                d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                    </div>
                                                    <span className="message-text">{message}</span>
                                                </div>
                                            ) : (
                                                <div className="error-message">
                                                    <div className="error-icon">
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                            <path
                                                                d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                    </div>
                                                    <span className="message-text">{message}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* Footer */}
                        <div className="auth-footer">
                            <div className="resend-otp-section">
                                <p>Didn't receive the code?</p>
                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    className="resend-link"
                                    disabled={countdown > 0}
                                >
                                    {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
                                </button>
                            </div>
                            <p className="switch-prompt">
                                Need to change your email?
                                <button
                                    type="button"
                                    onClick={() => navigate("/auth")}
                                    className="switch-link"
                                >
                                    Go back
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