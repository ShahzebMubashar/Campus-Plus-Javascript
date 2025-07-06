import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Index/components/Navbar';
import Footer from '../Footer/Footer';
import logo from '../Index/cp_logo.png';
import './CompleteProfile.css';
import API_BASE_URL from '../../config/api.js'; 
import { authenticatedFetch } from '../../utils/auth'; 

const CompleteProfile = () => {
    const [formData, setFormData] = useState({
        username: '',
        rollnumber: ''
    });
    const [message, setMessage] = useState('');
    const [rollNumberError, setRollNumberError] = useState('');
    const [loading, setLoading] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate();

    // Roll number validation function
    const validateRollNumber = (rollNumber) => {
        // Remove any dashes first
        const cleanRollNumber = rollNumber.replace(/-/g, '');

        // Check if it starts with 2 digits
        if (!/^\d{2}/.test(cleanRollNumber)) {
            return "Roll number must start with 2 digits (e.g., 22, 23, 24)";
        }

        // Check if it has the correct format: 2 digits + L/I/P/M/F + 4 digits
        const rollNumberPattern = /^\d{2}[LIPMFliplmf]\d{4}$/;
        if (!rollNumberPattern.test(cleanRollNumber)) {
            return "Roll Number Format: 22L1234";
        }

        return ""; // Valid
    };

    useEffect(() => {
        // Check if user is authenticated
        const checkAuth = async () => {
            try {
                const response = await authenticatedFetch(`${API_BASE_URL}/auth/current-user`);

                if (response.ok) {
                    const data = await response.json();
                    if (data.isAuthenticated) {
                        setUserInfo(data);
                        // If profile is already complete, redirect to dashboard
                        if (data.isProfileComplete) {
                            navigate('/', { replace: true });
                        }
                    } else {
                        // Not authenticated, redirect to sign in
                        navigate('/signin', { replace: true });
                    }
                } else {
                    navigate('/signin', { replace: true });
                }
            } catch (error) {
                console.error('Auth check error:', error);
                navigate('/signin', { replace: true });
            }
        };

        checkAuth();
    }, [navigate]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Validate roll number if it's the roll number field
        if (field === 'rollnumber') {
            const error = validateRollNumber(value);
            setRollNumberError(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate roll number before submitting
        const rollNumberError = validateRollNumber(formData.rollnumber);
        if (rollNumberError) {
            setMessage(rollNumberError);
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const response = await authenticatedFetch(`${API_BASE_URL}/auth/complete-profile`, {
                method: 'POST',
                body: JSON.stringify({
                    ...formData,
                    rollnumber: formData.rollnumber.replace(/-/g, '') // Remove dashes before sending
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Profile completed successfully! Redirecting...');
                // Store updated user info
                localStorage.setItem('user', JSON.stringify(data.user));

                // Dispatch custom event to notify navbar of authentication change
                window.dispatchEvent(new CustomEvent('authStateChanged', {
                    detail: { isAuthenticated: true, user: data.user }
                }));

                setTimeout(() => {
                    navigate('/', { replace: true });
                }, 2000);
            } else {
                setMessage(data.error || 'Failed to complete profile. Please try again.');
            }
        } catch (error) {
            setMessage('An error occurred. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    if (!userInfo) {
        return (
            <div className="complete-profile-container">
                <div className="loading-spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="complete-profile-container">
                {/* Animated Background */}


                {/* Main Content */}
                <div className="complete-profile-wrapper">
                    <div className="complete-profile-card">
                        {/* Header Section */}
                        <div className="complete-profile-header">
                            <div className="logo-section">
                                <img
                                    src={logo}
                                    alt="Campus Plus Logo"
                                    style={{ height: 38, width: 38, marginRight: 8 }}
                                />
                                <span className="brand-name">
                                    Campus <span style={{ color: "#3b82f6" }}>Plus</span>
                                </span>
                            </div>
                            <h1>Complete Your Profile</h1>
                            <p className="welcome-text">
                                Welcome, {userInfo.email || 'User'}! Please provide the following information to complete your account setup.
                            </p>
                        </div>

                        {/* Form Section */}
                        <div className="form-wrapper">
                            <form onSubmit={handleSubmit} className="complete-profile-form">
                                <div className="user-info-display">
                                    <div className="info-item">
                                        <label>Email:</label>
                                        <span>{userInfo.email}</span>
                                    </div>

                                </div>

                                <div className="input-wrapper">
                                    <input
                                        type="text"
                                        id="username"
                                        value={formData.username}
                                        onChange={(e) => handleInputChange("username", e.target.value)}
                                        required
                                        className="modern-input"
                                        placeholder=" "
                                        minLength={3}
                                        maxLength={20}
                                    />
                                    <label htmlFor="username" className="modern-label">
                                        Username
                                    </label>
                                    <div className="input-border"></div>
                                </div>

                                <div className="input-wrapper">
                                    <input
                                        type="text"
                                        id="rollnumber"
                                        value={formData.rollnumber}
                                        onChange={(e) => handleInputChange("rollnumber", e.target.value)}
                                        required
                                        className={`modern-input ${rollNumberError ? 'error' : ''}`}
                                        placeholder="22L1234"
                                        maxLength={9}
                                    />
                                    <label htmlFor="rollnumber" className="modern-label">
                                        Roll Number
                                    </label>
                                    <div className="input-border"></div>
                                    {rollNumberError && (
                                        <div className="error-message" style={{ color: '#e11d48', fontSize: '0.875rem', marginTop: '4px' }}>
                                            {rollNumberError}
                                        </div>
                                    )}
                                </div>

                                <button type="submit" className="submit-button" disabled={loading}>
                                    <span className="button-content">
                                        <span className="button-text">
                                            {loading ? "Completing Profile..." : "Complete Profile"}
                                        </span>
                                        {!loading && (
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
                                        )}
                                    </span>
                                    <div className="button-shine"></div>
                                </button>

                                {message && (
                                    <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
                                        {message}
                                    </div>
                                )}
                            </form>
                        </div>

                        {/* Footer */}
                        <div className="complete-profile-footer">
                            <p className="info-text">
                                <strong>Note:</strong> Your username and roll number will be used to identify you in the system.
                                Make sure to choose a unique username and provide your correct roll number.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default CompleteProfile; 