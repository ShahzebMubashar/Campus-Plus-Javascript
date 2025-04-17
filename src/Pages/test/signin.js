"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import "./styles.css"

function AuthPage() {
    const [isLogin, setIsLogin] = useState(true)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const [isTypingPassword, setIsTypingPassword] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const containerRef = useRef(null)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect()
                setMousePosition({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top,
                })
            }
        }

        window.addEventListener("mousemove", handleMouseMove)
        return () => {
            window.removeEventListener("mousemove", handleMouseMove)
        }
    }, [])

    const handlePasswordFocus = () => {
        setIsTypingPassword(true)
    }

    const handlePasswordBlur = () => {
        setIsTypingPassword(false)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("Login attempt with:", { email, password })
        // Add your authentication logic here
    }

    return (
        <div ref={containerRef} className="auth-container">
            <div className="auth-card">
                {/* Blue curved shape */}
                <motion.div
                    className="blue-shape"
                    initial={{ left: 0, borderRadius: "0 100px 100px 0" }}
                    animate={{
                        left: isLogin ? 0 : "55%",
                        borderRadius: isLogin ? "0 100px 100px 0" : "100px 0 0 100px",
                    }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                    <div className="blue-shape-content">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.3 }}
                            className={isLogin ? "blue-shape-text" : "blue-shape-text hidden"}
                        >
                            <h2 className="blue-shape-title">New Here?</h2>
                            <p className="blue-shape-description">Sign up and discover a great amount of new opportunities!</p>
                            <button onClick={() => setIsLogin(false)} className="blue-shape-button">
                                Sign Up
                            </button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.3 }}
                            className={!isLogin ? "blue-shape-text" : "blue-shape-text hidden"}
                        >
                            <h2 className="blue-shape-title">One of Us?</h2>
                            <p className="blue-shape-description">If you already have an account, just sign in!</p>
                            <button onClick={() => setIsLogin(true)} className="blue-shape-button">
                                Sign In
                            </button>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Character - positioned above the form */}
                <motion.div
                    className="character-container"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                    <RealisticCharacter mouseX={mousePosition.x} mouseY={mousePosition.y} isTypingPassword={isTypingPassword} />
                </motion.div>

                {/* Forms Container */}
                <div className="forms-container">
                    {/* Login Form - right side when isLogin is true */}
                    <motion.div
                        className="form-wrapper form-right"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{
                            opacity: isLogin ? 1 : 0,
                            x: isLogin ? 0 : 50,
                            pointerEvents: isLogin ? "auto" : "none",
                        }}
                        transition={{ duration: 0.3, delay: isLogin ? 0.3 : 0 }}
                    >
                        <div className="form-content">
                            <div className="form-header">
                                <h1 className="form-title">Welcome Back</h1>
                                <p className="form-subtitle">Please sign in to your account</p>
                            </div>

                            <form className="form">
                                <div className="form-field">
                                    <label className="form-label" htmlFor="email">
                                        Email
                                    </label>
                                    <input className="form-input" id="email" type="email" placeholder="Enter your email" />
                                </div>

                                <div className="form-field">
                                    <label className="form-label" htmlFor="password">
                                        Password
                                    </label>
                                    <div className="password-input-wrapper">
                                        <input
                                            className="form-input"
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your password"
                                            onFocus={handlePasswordFocus}
                                            onBlur={handlePasswordBlur}
                                        />
                                        <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? (
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22m-5-5c-.29.13-.6.24-.9.33-1.6.55-3.29.67-5.1.67-7 0-11-8-11-8a18.66 18.66 0 0 1 5.63-5.63"
                                                        stroke="#6B7280"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            ) : (
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                                                        stroke="#6B7280"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                    <path
                                                        d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
                                                        stroke="#6B7280"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
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
                        </div>
                    </motion.div>

                    {/* Signup Form - left side when isLogin is false */}
                    <motion.div
                        className="form-wrapper form-left"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{
                            opacity: !isLogin ? 1 : 0,
                            x: !isLogin ? 0 : -50,
                            pointerEvents: !isLogin ? "auto" : "none",
                        }}
                        transition={{ duration: 0.3, delay: !isLogin ? 0.3 : 0 }}
                    >
                        <div className="form-content">
                            <div className="form-header">
                                <h1 className="form-title">Create Account</h1>
                                <p className="form-subtitle">Sign up to get started</p>
                            </div>

                            <form className="form">
                                <div className="name-fields">
                                    <div className="form-field half-width">
                                        <label className="form-label" htmlFor="firstName">
                                            First Name
                                        </label>
                                        <input className="form-input" id="firstName" placeholder="First name" />
                                    </div>
                                    <div className="form-field half-width">
                                        <label className="form-label" htmlFor="lastName">
                                            Last Name
                                        </label>
                                        <input className="form-input" id="lastName" placeholder="Last name" />
                                    </div>
                                </div>

                                <div className="form-field">
                                    <label className="form-label" htmlFor="signup-email">
                                        Email
                                    </label>
                                    <input className="form-input" id="signup-email" type="email" placeholder="Enter your email" />
                                </div>

                                <div className="form-field">
                                    <label className="form-label" htmlFor="signup-password">
                                        Password
                                    </label>
                                    <div className="password-input-wrapper">
                                        <input
                                            className="form-input"
                                            id="signup-password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Create a password"
                                            onFocus={handlePasswordFocus}
                                            onBlur={handlePasswordBlur}
                                        />
                                        <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? (
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22m-5-5c-.29.13-.6.24-.9.33-1.6.55-3.29.67-5.1.67-7 0-11-8-11-8a18.66 18.66 0 0 1 5.63-5.63"
                                                        stroke="#6B7280"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            ) : (
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                                                        stroke="#6B7280"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                    <path
                                                        d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
                                                        stroke="#6B7280"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
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
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

function RealisticCharacter({ mouseX, mouseY, isTypingPassword }) {
    // Calculate eye movement based on mouse position
    const calculateEyePosition = (baseX, baseY) => {
        if (isTypingPassword) return { x: baseX, y: baseY }

        // Limit eye movement range
        const maxMove = 2
        const eyeX = baseX + Math.min(Math.max((mouseX / window.innerWidth - 0.5) * 10, -maxMove), maxMove)
        const eyeY = baseY + Math.min(Math.max((mouseY / window.innerHeight - 0.5) * 10, -maxMove), maxMove)

        return { x: eyeX, y: eyeY }
    }

    const leftEyePosition = calculateEyePosition(85, 100)
    const rightEyePosition = calculateEyePosition(115, 100)

    return (
        <div className="realistic-character">
            <svg width="200" height="220" viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Graduation Hat */}
                <g className="graduation-hat">
                    {/* Hat base */}
                    <rect x="40" y="30" width="120" height="10" fill="#222222" />

                    {/* Hat top */}
                    <rect x="60" y="0" width="80" height="30" fill="#222222" />

                    {/* Tassel */}
                    <rect x="130" y="0" width="4" height="40" fill="#FFD700" />
                    <circle cx="134" cy="45" r="5" fill="#FFD700" />

                    {/* Hat button */}
                    <circle cx="100" cy="15" r="4" fill="#FFD700" />
                </g>

                {/* Neck */}
                <path d="M90 170 C90 180, 110 180, 110 170 L110 160 L90 160 Z" fill="#F2C4A1" />

                {/* Shirt/Body */}
                <path d="M75 170 L90 160 L110 160 L125 170 L125 220 L75 220 Z" fill="#4299e1" />
                <path d="M90 170 L100 180 L110 170" stroke="white" strokeWidth="1.5" fill="transparent" />

                {/* Face - more realistic */}
                <ellipse cx="100" cy="115" rx="40" ry="45" fill="#F2C4A1" />

                {/* Ears */}
                <path d="M60 115 Q55 125 60 135 Q65 140 70 135 Q75 125 70 115 Z" fill="#F2C4A1" />
                <path d="M140 115 Q145 125 140 135 Q135 140 130 135 Q125 125 130 115 Z" fill="#F2C4A1" />

                {/* Hair */}
                <path
                    d="M60 100 C60 80, 75 60, 100 60 C125 60, 140 80, 140 100 C140 90, 130 85, 125 85 C115 65, 85 65, 75 85 C70 85, 60 90, 60 100 Z"
                    fill="#663300"
                />
                <path d="M60 100 C60 90, 70 80, 75 80 C80 80, 75 90, 75 100 Z" fill="#663300" />
                <path d="M140 100 C140 90, 130 80, 125 80 C120 80, 125 90, 125 100 Z" fill="#663300" />

                {/* Eyebrows */}
                <path d="M75 90 Q85 85 95 90" stroke="#663300" strokeWidth="2" fill="transparent" />
                <path d="M105 90 Q115 85 125 90" stroke="#663300" strokeWidth="2" fill="transparent" />

                {/* Eyes */}
                <g>
                    {isTypingPassword ? (
                        <>
                            {/* Hands covering eyes when typing password */}
                            <motion.path
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                d="M70 100 Q85 90 100 100 Q115 90 130 100 Q115 110 100 100 Q85 110 70 100"
                                fill="#F2C4A1"
                                stroke="#222222"
                                strokeWidth="1.5"
                            />
                            <motion.path
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                d="M65 105 Q75 95 70 100 Q65 105 65 105"
                                fill="#F2C4A1"
                                stroke="#222222"
                                strokeWidth="1.5"
                            />
                            <motion.path
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                d="M135 105 Q125 95 130 100 Q135 105 135 105"
                                fill="#F2C4A1"
                                stroke="#222222"
                                strokeWidth="1.5"
                            />
                        </>
                    ) : (
                        <>
                            {/* Eye whites - more human-like */}
                            <ellipse cx="85" cy="100" rx="10" ry="7" fill="white" stroke="#222222" strokeWidth="0.5" />
                            <ellipse cx="115" cy="100" rx="10" ry="7" fill="white" stroke="#222222" strokeWidth="0.5" />

                            {/* Pupils that follow mouse */}
                            <motion.circle
                                cx={leftEyePosition.x}
                                cy={leftEyePosition.y}
                                r="3.5"
                                fill="#222222"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                            <motion.circle
                                cx={rightEyePosition.x}
                                cy={rightEyePosition.y}
                                r="3.5"
                                fill="#222222"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />

                            {/* Eye highlights */}
                            <circle cx={leftEyePosition.x + 1.5} cy={leftEyePosition.y - 1.5} r="1" fill="white" />
                            <circle cx={rightEyePosition.x + 1.5} cy={rightEyePosition.y - 1.5} r="1" fill="white" />

                            {/* Eyelids */}
                            <path d="M75 97 Q85 94 95 97" stroke="#222222" strokeWidth="0.5" fill="transparent" />
                            <path d="M105 97 Q115 94 125 97" stroke="#222222" strokeWidth="0.5" fill="transparent" />

                            {/* Lower eyelids */}
                            <path d="M75 103 Q85 106 95 103" stroke="#222222" strokeWidth="0.5" fill="transparent" />
                            <path d="M105 103 Q115 106 125 103" stroke="#222222" strokeWidth="0.5" fill="transparent" />
                        </>
                    )}
                </g>

                {/* Nose - more realistic */}
                <path d="M95 105 Q100 115 105 105" stroke="#E5B293" strokeWidth="1" fill="#E5B293" />
                <path d="M100 105 L100 115" stroke="#E5B293" strokeWidth="0.5" fill="transparent" />

                {/* Mouth - more realistic */}
                <path d="M85 130 Q100 140 115 130" stroke="#222222" strokeWidth="1.5" fill="transparent" />

                {/* Cheeks */}
                <circle cx="80" cy="120" r="7" fill="#E5A293" opacity="0.3" />
                <circle cx="120" cy="120" r="7" fill="#E5A293" opacity="0.3" />

                {/* Chin definition */}
                <path d="M85 145 Q100 155 115 145" stroke="#E5B293" strokeWidth="0.5" fill="transparent" />
            </svg>
        </div>
    )
}

export default AuthPage
