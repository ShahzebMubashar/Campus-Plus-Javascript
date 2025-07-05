import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthSuccess.css';

const AuthSuccess = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await fetch('http://localhost:4000/auth/current-user', {
                    credentials: 'include'
                });

                if (response.ok) {
                    const data = await response.json();

                    if (data.isAuthenticated) {
                        // Store user data in localStorage
                        localStorage.setItem('user', JSON.stringify({
                            userid: data.userid,
                            email: data.email,
                            username: data.username,
                            fullName: data.fullName
                        }));

                        // Dispatch custom event to notify navbar of authentication change
                        window.dispatchEvent(new CustomEvent('authStateChanged', {
                            detail: { isAuthenticated: true, user: data }
                        }));

                        // Check if profile is complete
                        if (data.isProfileComplete) {
                            // Show success message briefly
                            setTimeout(() => {
                                navigate('/', { replace: true });
                            }, 2000);
                        } else {
                            // Profile incomplete, redirect to complete profile page
                            setTimeout(() => {
                                navigate('/complete-profile', { replace: true });
                            }, 1000);
                        }
                    } else {
                        setError('Authentication failed. Please try again.');
                    }
                } else {
                    setError('Failed to verify authentication. Please try again.');
                }
            } catch (error) {
                console.error('Auth check error:', error);
                setError('Network error. Please check your connection and try again.');
            } finally {
                setLoading(false);
            }
        };

        checkAuthStatus();
    }, [navigate]);

    if (loading) {
        return (
            <div className="auth-success-container">
                <div className="auth-success-card">
                    <div className="loading-spinner"></div>
                    <h2>Authenticating...</h2>
                    <p>Please wait while we complete your authentication.</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="auth-success-container">
                <div className="auth-success-card error">
                    <div className="error-icon">⚠️</div>
                    <h2>Authentication Error</h2>
                    <p>{error}</p>
                    <button
                        onClick={() => navigate('/signin')}
                        className="retry-button"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-success-container">
            <div className="auth-success-card success">
                <div className="success-icon">✅</div>
                <h2>Authentication Successful!</h2>
                <p>Welcome to Campus Plus. Checking your profile...</p>
            </div>
        </div>
    );
};

export default AuthSuccess; 