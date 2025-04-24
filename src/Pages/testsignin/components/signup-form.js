import { useState } from "react"
import { motion } from "framer-motion"

function SignupForm({ onPasswordFocus, onPasswordBlur }) {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="form">
            <div className="form-header">
                <h1 className="form-title">Create Account</h1>
                <p className="form-subtitle">Sign up to get started</p>
            </div>

            <form className="form-fields">
                <div className="name-fields">
                    <div className="form-field half-width">
                        <label htmlFor="firstName" className="form-label">First Name</label>
                        <input id="firstName" placeholder="First name" className="form-input" />
                    </div>
                    <div className="form-field half-width">
                        <label htmlFor="lastName" className="form-label">Last Name</label>
                        <input id="lastName" placeholder="Last name" className="form-input" />
                    </div>
                </div>

                <div className="form-field">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input id="email" type="email" placeholder="Enter your email" className="form-input" />
                </div>

                <div className="form-field">
                    <label htmlFor="password" className="form-label">Password</label>
                    <div className="password-input-wrapper">
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a password"
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

                <div className="terms-checkbox">
                    <input type="checkbox" id="terms" className="checkbox" />
                    <label htmlFor="terms" className="checkbox-label">
                        I agree to the{" "}
                        <a href="#" className="link">
                            Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="#" className="link">
                            Privacy Policy
                        </a>
                    </label>
                </div>

                <button type="submit" className="submit-button">
                    Create Account
                </button>
            </form>

            <div className="divider">
                <span className="divider-text">Or sign up with</span>
            </div>

            <div className="social-buttons">
                <button className="social-button">Google</button>
                <button className="social-button">Apple</button>
                <button className="social-button">Facebook</button>
            </div>
        </motion.div>
    )
}

export default SignupForm
