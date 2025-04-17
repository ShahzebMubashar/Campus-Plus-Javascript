import { useState } from "react"
import { motion } from "framer-motion"

function LoginForm({ onPasswordFocus, onPasswordBlur }) {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="form">
            <div className="form-header">
                <h1 className="form-title">Welcome Back</h1>
                <p className="form-subtitle">Please sign in to your account</p>
            </div>

            <form className="form-fields">
                <div className="form-field">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="form-input"
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="password" className="form-label">Password</label>
                    <div className="password-input-wrapper">
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            className="form-input"
                            onFocus={onPasswordFocus}
                            onBlur={onPasswordBlur}
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22m-5-5c.34.3.68.62 1 .92-1.7 1.46-3.85 2.58-7 2.58-7 0-11-8-11-8a18.88 18.88 0 0 1 5.21-5.21"
                                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            ) : (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                <div className="form-options">
                    <div className="remember-me">
                        <input type="checkbox" id="remember" className="checkbox" />
                        <label htmlFor="remember" className="checkbox-label">
                            Remember me
                        </label>
                    </div>
                    <a href="#" className="forgot-password">
                        Forgot password?
                    </a>
                </div>

                <button type="submit" className="submit-button">
                    Sign In
                </button>
            </form>

            <div className="divider">
                <span className="divider-text">Or continue with</span>
            </div>

            <div className="social-buttons">
                <button className="social-button">Google</button>
                <button className="social-button">Apple</button>
                <button className="social-button">Facebook</button>
            </div>
        </motion.div>
    )
}

export default LoginForm
