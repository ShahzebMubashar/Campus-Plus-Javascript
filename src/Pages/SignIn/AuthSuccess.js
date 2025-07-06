import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthSuccess.css';
import { extractTokensFromURL, loginWithTokens, authenticatedFetch } from '../../utils/auth';
import API_BASE_URL from '../../config/api.js';  

const AuthSuccess = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleOAuthCallback = async () => {
            try {
                console.log('AuthSuccess: Starting OAuth callback handling');
                
                // Extract tokens from URL (OAuth callback)
                const tokens = extractTokensFromURL();
                console.log('AuthSuccess: Extracted tokens:', tokens ? 'EXISTS' : 'NULL');
                
                if (tokens) {
                    console.log('AuthSuccess: Token structure:', {
                        accessToken: tokens.accessToken ? 'EXISTS' : 'MISSING',
                        refreshToken: tokens.refreshToken ? 'EXISTS' : 'MISSING'
                    });
                    
                    // Get user info using the token
                    const response = await fetch(`${API_BASE_URL}/auth/current-user`, {
                        headers: {
                            'Authorization': `Bearer ${tokens.accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    console.log('AuthSuccess: Current user response status:', response.status);
                    
                    if (response.ok) {
                        const data = await response.json();
                        console.log('AuthSuccess: Current user data:', data);

                        if (data.isAuthenticated) {
                            console.log('AuthSuccess: User is authenticated, storing tokens and user data');
                            
                            // Store tokens and user data
                            loginWithTokens(tokens, {
                                userid: data.userid,
                                email: data.email,
                                username: data.username,
                                fullName: data.fullName,
                                role: data.role
                            });

                            // Check if profile is complete
                            if (data.isProfileComplete) {
                                console.log('AuthSuccess: Profile complete, redirecting to home');
                                // Show success message briefly
                                setTimeout(() => {
                                    navigate('/', { replace: true });
                                }, 2000);
                            } else {
                                console.log('AuthSuccess: Profile incomplete, redirecting to complete profile');
                                // Profile incomplete, redirect to complete profile page
                                setTimeout(() => {
                                    navigate('/complete-profile', { replace: true });
                                }, 1000);
                            }
                        } else {
                            console.log('AuthSuccess: User not authenticated');
                            setError('Authentication failed. Please try again.');
                        }
                    } else {
                        console.log('AuthSuccess: Failed to get current user');
                        setError('Failed to verify authentication. Please try again.');
                    }
                } else {
                    console.log('AuthSuccess: No tokens found in URL');
                    setError('No authentication tokens found. Please try again.');
                }
            } catch (error) {
                console.error('OAuth callback error:', error);
                setError('Network error. Please check your connection and try again.');
            } finally {
                setLoading(false);
            }
        };

        handleOAuthCallback();
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