import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";
import Navbar from "../Index/components/Navbar";
import Footer from "../../Pages/Footer/Footer";
import logo from "../Index/cp_logo.png";
import API_BASE_URL from "../../config/api";

export default function ForgotPasswordPage() {
    const [step, setStep] = useState(1); // 1: email/rollnumber, 2: OTP verification, 3: new password, 4: success
    const [formData, setFormData] = useState({
        email: "",
        rollNumber: "",
        otp: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [message, setMessage] = useState("");
    const [isSuccessMessage, setIsSuccessMessage] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const navigate = useNavigate();

    // Handle input changes
    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    // Validate roll number format
    const validateRollNumber = (rollNumber) => {
        const cleanRollNumber = rollNumber.replace(/-/g, '');
        const rollNumberPattern = /^\d{2}[LIPMFliplmf]\d{4}$/;
        return rollNumberPattern.test(cleanRollNumber);
    };

    // Start countdown timer for OTP resend
    const startCountdown = () => {
        setCountdown(60); // 60 seconds countdown
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    // Step 1: Verify identity with email and roll number
    const handleVerifyIdentity = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Validate inputs
        if (!formData.email || !formData.rollNumber) {
            setMessage("Please fill in all fields");
            setIsSuccessMessage(false);
            setIsSubmitting(false);
            return;
        }

        if (!validateRollNumber(formData.rollNumber)) {
            setMessage("Invalid roll number format. Expected format: 22L1234");
            setIsSuccessMessage(false);
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/auth/verify-identity`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: formData.email,
                    rollnumber: formData.rollNumber.replace(/-/g, ''),
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("OTP sent to your email address");
                setIsSuccessMessage(true);
                setOtpSent(true);
                startCountdown();
                setTimeout(() => {
                    setStep(2);
                    setMessage("");
                }, 2000);
            } else {
                setMessage(data.error || "Verification failed. Please check your information.");
                setIsSuccessMessage(false);
            }
        } catch (error) {
            setMessage("An error occurred. Please try again later.");
            setIsSuccessMessage(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Validate OTP
        if (!formData.otp || formData.otp.length !== 6) {
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
                    email: formData.email,
                    otp: formData.otp,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setStep(3);
                setMessage("");
            } else {
                setMessage(data.error || "Invalid OTP. Please try again.");
                setIsSuccessMessage(false);
            }
        } catch (error) {
            setMessage("An error occurred. Please try again later.");
            setIsSuccessMessage(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Resend OTP
    const handleResendOtp = async () => {
        if (countdown > 0) return;

        setIsSubmitting(true);
        try {
            const response = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: formData.email,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("OTP resent to your email address");
                setIsSuccessMessage(true);
                startCountdown();
                setTimeout(() => setMessage(""), 3000);
            } else {
                setMessage(data.error || "Failed to resend OTP. Please try again.");
                setIsSuccessMessage(false);
            }
        } catch (error) {
            setMessage("An error occurred. Please try again later.");
            setIsSuccessMessage(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Step 3: Reset password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Validate inputs
        if (!formData.newPassword || !formData.confirmPassword) {
            setMessage("Please fill in all fields");
            setIsSuccessMessage(false);
            setIsSubmitting(false);
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setMessage("Passwords do not match");
            setIsSuccessMessage(false);
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: formData.email,
                    rollnumber: formData.rollNumber.replace(/-/g, ''),
                    password: formData.newPassword,
                    otp: formData.otp,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setStep(4); // Success step
                setMessage("");
            } else {
                setMessage(data.error || "Password reset failed. Please try again.");
                setIsSuccessMessage(false);
            }
        } catch (error) {
            setMessage("An error occurred. Please try again later.");
            setIsSuccessMessage(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle back to login
    const handleBackToLogin = () => {
        navigate("/signin");
    };

    return (
        <>
            <Navbar />
            <div className="auth-container">
                {/* Loading overlay */}
                {isSubmitting && (
                    <div className="signing-in-overlay">
                        <div className="signing-in-spinner"></div>
                        <div className="signing-in-message">
                            {step === 1 ? "Verifying identity..." :
                                step === 2 ? "Verifying OTP..." :
                                    "Resetting password..."}
                        </div>
                    </div>
                )}

                <div className="auth-wrapper">
                    <div className="auth-card">
                        {/* Header Section */}
                        <div className="auth-header">
                            <div className="logo-section">
                                <img
                                    src={logo}
                                    alt="Campus Plus Logo"
                                    style={{ height: 38, width: 38, marginRight: 8 }}
                                />
                                <span className="brand-name">
                                    Campus <span style={{ color: "#3b82f6", fontWeight: 700 }}>Plus</span>
                                </span>
                            </div>
                            <p className="welcome-text">
                                {step === 1 && "Reset your password by verifying your identity"}
                                {step === 2 && "Enter the 6-digit OTP sent to your email"}
                                {step === 3 && "Create a new password for your account"}
                                {step === 4 && "Password reset successful!"}
                            </p>
                        </div>

                        {/* Progress Indicator */}
                        <div className="progress-indicator">
                            <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
                                <div className="step-number">1</div>
                                <div className="step-label">Verify Identity</div>
                            </div>
                            <div className="progress-line"></div>
                            <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
                                <div className="step-number">2</div>
                                <div className="step-label">OTP Verification</div>
                            </div>
                            <div className="progress-line"></div>
                            <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
                                <div className="step-number">3</div>
                                <div className="step-label">New Password</div>
                            </div>
                            <div className="progress-line"></div>
                            <div className={`progress-step ${step >= 4 ? 'active' : ''}`}>
                                <div className="step-number">4</div>
                                <div className="step-label">Complete</div>
                            </div>
                        </div>

                        {/* Step 1: Verify Identity */}
                        {step === 1 && (
                            <form onSubmit={handleVerifyIdentity} className="auth-form">
                                <div className="form-content">
                                    <div className="input-wrapper">
                                        <input
                                            type="email"
                                            id="email"
                                            value={formData.email}
                                            onChange={(e) => handleInputChange("email", e.target.value)}
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
                                            type="text"
                                            id="rollNumber"
                                            value={formData.rollNumber}
                                            onChange={(e) => handleInputChange("rollNumber", e.target.value)}
                                            required
                                            className="modern-input"
                                            placeholder="22L1234"
                                        />
                                        <label htmlFor="rollNumber" className="modern-label">
                                            Roll Number
                                        </label>
                                        <div className="input-border"></div>
                                    </div>

                                    <button type="submit" className="submit-button">
                                        <span className="button-content">
                                            <span className="button-text">Send OTP</span>
                                            <div className="button-icon">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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
                                            <div className={isSuccessMessage ? 'success-message' : 'error-message'}>
                                                <div className={isSuccessMessage ? 'success-icon' : 'error-icon'}>
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                        {isSuccessMessage ? (
                                                            <path
                                                                d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        ) : (
                                                            <path
                                                                d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        )}
                                                    </svg>
                                                </div>
                                                <span className="message-text">{message}</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="back-to-login">
                                        <button type="button" onClick={handleBackToLogin} className="switch-link">
                                            Back to Sign In
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}

                        {/* Step 2: OTP Verification */}
                        {step === 2 && (
                            <form onSubmit={handleVerifyOtp} className="auth-form">
                                <div className="form-content">
                                    <div className="otp-instructions">
                                        <p>We've sent a 6-digit verification code to <strong>{formData.email}</strong></p>
                                    </div>

                                    <div className="otp-input-container">
                                        {[0, 1, 2, 3, 4, 5].map((index) => (
                                            <input
                                                key={index}
                                                type="text"
                                                inputMode="numeric"
                                                pattern="[0-9]*"
                                                maxLength="1"
                                                value={formData.otp[index] || ''}
                                                onChange={(e) => {
                                                    // Allow only numbers
                                                    const value = e.target.value.replace(/\D/g, '');

                                                    if (value) {
                                                        // Update the OTP value
                                                        const newOtp = formData.otp.split('');
                                                        newOtp[index] = value;
                                                        const joinedOtp = newOtp.join('');
                                                        handleInputChange("otp", joinedOtp.slice(0, 6));

                                                        // Auto-focus to next input
                                                        if (index < 5) {
                                                            document.getElementById(`otp-${index + 1}`).focus();
                                                        }
                                                    } else {
                                                        // Handle backspace/delete
                                                        const newOtp = formData.otp.split('');
                                                        newOtp[index] = '';
                                                        handleInputChange("otp", newOtp.join(''));

                                                        // Auto-focus to previous input
                                                        if (index > 0) {
                                                            document.getElementById(`otp-${index - 1}`).focus();
                                                        }
                                                    }
                                                }}
                                                onKeyDown={(e) => {
                                                    // Handle backspace key
                                                    if (e.key === 'Backspace' && !formData.otp[index] && index > 0) {
                                                        document.getElementById(`otp-${index - 1}`).focus();
                                                    }

                                                    // Handle arrow keys for navigation
                                                    if (e.key === 'ArrowLeft' && index > 0) {
                                                        document.getElementById(`otp-${index - 1}`).focus();
                                                    }
                                                    if (e.key === 'ArrowRight' && index < 5) {
                                                        document.getElementById(`otp-${index + 1}`).focus();
                                                    }
                                                }}
                                                onPaste={(e) => {
                                                    // Handle paste event
                                                    e.preventDefault();
                                                    const pastedData = e.clipboardData.getData('text/plain').replace(/\D/g, '').slice(0, 6);
                                                    if (pastedData) {
                                                        handleInputChange("otp", pastedData);

                                                        // Auto-focus to the next empty input or the last one
                                                        const nextFocusIndex = Math.min(pastedData.length, 5);
                                                        document.getElementById(`otp-${nextFocusIndex}`).focus();
                                                    }
                                                }}
                                                className="otp-input"
                                                id={`otp-${index}`}
                                                autoFocus={index === 0}
                                            />
                                        ))}
                                    </div>

                                    <div className="otp-resend">
                                        <p>Didn't receive the code? </p>
                                        {countdown > 0 ? (
                                            <span className="countdown">Resend in {countdown}s</span>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={handleResendOtp}
                                                className="resend-link"
                                            >
                                                Resend OTP
                                            </button>
                                        )}
                                    </div>

                                    <button type="submit" className="submit-button">
                                        <span className="button-content">
                                            <span className="button-text">Verify OTP</span>
                                            <div className="button-icon">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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
                                            <div className={isSuccessMessage ? 'success-message' : 'error-message'}>
                                                <div className={isSuccessMessage ? 'success-icon' : 'error-icon'}>
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                        {isSuccessMessage ? (
                                                            <path
                                                                d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        ) : (
                                                            <path
                                                                d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        )}
                                                    </svg>
                                                </div>
                                                <span className="message-text">{message}</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="back-to-login">
                                        <button type="button" onClick={() => setStep(1)} className="switch-link">
                                            Back to Previous Step
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}

                        {/* Step 3: New Password */}
                        {step === 3 && (
                            <form onSubmit={handleResetPassword} className="auth-form">
                                <div className="form-content">
                                    <div className="input-wrapper">
                                        <input
                                            type="password"
                                            id="newPassword"
                                            value={formData.newPassword}
                                            onChange={(e) => handleInputChange("newPassword", e.target.value)}
                                            required
                                            className="modern-input"
                                            placeholder=" "
                                        />
                                        <label htmlFor="newPassword" className="modern-label">
                                            New Password
                                        </label>
                                        <div className="input-border"></div>
                                    </div>

                                    <div className="input-wrapper">
                                        <input
                                            type="password"
                                            id="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                                            required
                                            className="modern-input"
                                            placeholder=" "
                                        />
                                        <label htmlFor="confirmPassword" className="modern-label">
                                            Confirm Password
                                        </label>
                                        <div className="input-border"></div>
                                    </div>

                                    <button type="submit" className="submit-button">
                                        <span className="button-content">
                                            <span className="button-text">Reset Password</span>
                                            <div className="button-icon">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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
                                            <div className={isSuccessMessage ? 'success-message' : 'error-message'}>
                                                <div className={isSuccessMessage ? 'success-icon' : 'error-icon'}>
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                        {isSuccessMessage ? (
                                                            <path
                                                                d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        ) : (
                                                            <path
                                                                d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        )}
                                                    </svg>
                                                </div>
                                                <span className="message-text">{message}</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="back-to-login">
                                        <button type="button" onClick={() => setStep(2)} className="switch-link">
                                            Back to OTP Verification
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}

                        {/* Step 4: Success */}
                        {step === 4 && (
                            <div className="success-content">
                                <div className="success-icon-large">
                                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                                        <path
                                            d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                            stroke="#22c55e"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                                <h2>Password Reset Successful!</h2>
                                <p>Your password has been successfully reset. You can now sign in with your new password.</p>
                                <button onClick={handleBackToLogin} className="submit-button">
                                    <span className="button-content">
                                        <span className="button-text">Sign In Now</span>
                                    </span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}