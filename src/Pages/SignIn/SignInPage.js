"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import "./SignInPage.css"
import rocketImg from "./rocket.png"
import humanImg from "./human.png"
import Navbar from "../Index/components/Navbar"
// import Footer from "../Footer/Footer";

function SignInPage() {
    const [isSignUp, setIsSignUp] = useState(false)
    const [isAnimating, setIsAnimating] = useState(false)
    const [signInData, setSignInData] = useState({ email: "", password: "" })
    const [signUpData, setSignUpData] = useState({ username: "", email: "", password: "", rollnumber: "" })
    const [message, setMessage] = useState("")
    const [activeField, setActiveField] = useState(null)
    const [eyePosition, setEyePosition] = useState({ x: 50, y: 50 })
    const [isPasswordField, setIsPasswordField] = useState(false)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

    const leftEyeRef = useRef(null)
    const rightEyeRef = useRef(null)
    const characterRef = useRef(null)
    const characterCircleRef = useRef(null)

    const navigate = useNavigate()

    // Track mouse movement for eye tracking
    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY })
        }

        window.addEventListener('mousemove', handleMouseMove)

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
        }
    }, [])

    // Update eye position based on mouse position
    useEffect(() => {
        if (isPasswordField) {
            // Hide eyes when typing password
            return
        }

        if (characterCircleRef.current && !activeField) {
            const rect = characterCircleRef.current.getBoundingClientRect()
            const centerX = rect.left + rect.width / 2
            const centerY = rect.top + rect.height / 2

            // Calculate angle between mouse and character center
            const deltaX = mousePosition.x - centerX
            const deltaY = mousePosition.y - centerY

            // Limit eye movement range (0-100%)
            const maxDistance = 30
            const distance = Math.min(Math.sqrt(deltaX * deltaX + deltaY * deltaY), maxDistance)
            const angle = Math.atan2(deltaY, deltaX)

            // Convert to percentage (0-100)
            const moveX = 50 + (Math.cos(angle) * distance / maxDistance) * 30
            const moveY = 50 + (Math.sin(angle) * distance / maxDistance) * 30

            setEyePosition({ x: moveX, y: moveY })
        } else if (activeField) {
            // Different positions based on which field is active
            const positions = {
                email: { x: 70, y: 40 },
                username: { x: 30, y: 40 },
                rollnumber: { x: 60, y: 60 },
            }

            if (positions[activeField]) {
                setEyePosition(positions[activeField])
            }
        }
    }, [mousePosition, activeField, isPasswordField])

    // Smooth transition between sign-in and sign-up modes
    const toggleSignUp = () => {
        setIsAnimating(true)

        // Delay the actual state change to allow for smooth animation
        setTimeout(() => {
            setIsSignUp((prev) => !prev)
        }, 300)

        // Reset animation state after transition completes
        setTimeout(() => {
            setIsAnimating(false)
        }, 1000)
    }

    const handleFocus = (fieldName) => {
        setActiveField(fieldName)
        setIsPasswordField(fieldName === "password")
    }

    const handleBlur = () => {
        setActiveField(null)
        setIsPasswordField(false)
    }

    const handleSignInChange = (e) => {
        const { name, value } = e.target
        setSignInData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSignUpChange = (e) => {
        const { name, value } = e.target
        setSignUpData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSignInSubmit = async (e) => {
        e.preventDefault()
        console.log("Attempting login with:", signInData)
        try {
            const response = await fetch("http://localhost:4000/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(signInData),
            })

            console.log("Login response status:", response.status)
            const data = await response.json()
            console.log("Login response data:", data)

            if (response.ok) {
                setMessage("Sign in successful!")
                localStorage.setItem("user", JSON.stringify(data.user))
                // Animate button before redirect
                const button = e.target.querySelector(".form-button")
                button.classList.add("success")
                // Redirect after animation completes
                setTimeout(() => navigate("/"), 1000)
            } else {
                setMessage(data.error || "Sign in failed. Please try again.")
                const button = e.target.querySelector(".form-button")
                button.classList.add("error")
                setTimeout(() => {
                    button.classList.remove("error")
                }, 1000)
            }
        } catch (error) {
            console.error("Sign in error:", error)
            setMessage("An error occurred. Please try again later.")
            const button = e.target.querySelector(".form-button")
            button.classList.add("error")
            setTimeout(() => {
                button.classList.remove("error")
            }, 1000)
        }
    }

    const handleSignUpSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch("http://localhost:4000/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(signUpData),
            })

            const data = await response.json()

            if (response.ok) {
                setMessage(data.message)
                // Animate button on success
                const button = e.target.querySelector(".form-button")
                button.classList.add("success")

                // Switch to sign in after successful registration
                setTimeout(() => {
                    button.classList.remove("success")
                    toggleSignUp()
                }, 1000)
            } else {
                setMessage(data.error || "Sign up failed. Please try again.")
                const button = e.target.querySelector(".form-button")
                button.classList.add("error")
                setTimeout(() => {
                    button.classList.remove("error")
                }, 1000)
            }
        } catch (error) {
            console.error("Sign up error:", error)
            setMessage("An error occurred. Please try again later.")
            const button = e.target.querySelector(".form-button")
            button.classList.add("error")
            setTimeout(() => {
                button.classList.remove("error")
            }, 1000)
        }
    }


    return (
        <div className="signincontainerfull">
            {/* Navbar stays outside the wrapper */}
            <Navbar />

            {/* New wrapper div at 80% of screen size */}
            <div className="auth-wrapper">
                <div className={`signin-container ${isSignUp ? "sign-up-mode" : ""} ${isAnimating ? "animating" : ""}`}>
                    <div className="left-section">
                        <div className="background-circle"></div>
                        <h1 className={`animated-text ${isSignUp ? "member-text" : "fresher-text"}`}>
                            {isSignUp ? "Already a Member?" : "Fresher Ho?"}
                        </h1>

                        <p className={`animated-text ${isSignUp ? "member-para" : "fresher-para"}`}>
                            {isSignUp
                                ? "Sign in to access your account and continue your journey with us."
                                : "Join us to explore amazing opportunities and resources. Don't have an accout?"}
                        </p>

                        <button className={`toggle-button ${isSignUp ? "sign-in-btn" : "sign-up-btn"}`}
                            onClick={toggleSignUp}>
                            <span className="button-text">{isSignUp ? "Sign In" : "Sign Up"}</span>
                            <span className="button-icon"></span>
                        </button>
                        <img src={isSignUp ? humanImg : rocketImg}
                            alt={isSignUp ? "Human" : "Rocket"}
                            className={`dynamic-image ${isSignUp ? "human-img" : "rocket-img"}`} />
                    </div>

                    <div className="form-section">
                        <div className={`form-container ${isAnimating ? "fade" : ""}`}>
                            {/* Character Circle Container */}
                            <div className="character-circle-container">
                                <div
                                    className={`character-circle ${isPasswordField ? "hiding-eyes" : ""}`}
                                    ref={characterCircleRef}
                                >
                                    {/* Animated Character */}
                                    <div className={`animated-character ${isPasswordField ? "hiding-eyes" : ""}`} ref={characterRef}>
                                        <div className="graduation-cap">
                                            <div className="cap-top"></div>
                                            <div className="cap-tassel"></div>
                                        </div>
                                        <div className="character-head">
                                            <div className="character-face">
                                                <div className="character-eyes">
                                                    <div className="eye left-eye" ref={leftEyeRef}>
                                                        <div
                                                            className="eyeball"
                                                            style={{
                                                                transform: `translate(${eyePosition.x - 50}%, ${eyePosition.y - 50}%)`,
                                                            }}
                                                        ></div>
                                                    </div>
                                                    <div className="eye right-eye" ref={rightEyeRef}>
                                                        <div
                                                            className="eyeball"
                                                            style={{
                                                                transform: `translate(${eyePosition.x - 50}%, ${eyePosition.y - 50}%)`,
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                                <div className="eyebrows"></div>
                                                <div className="character-nose"></div>
                                                <div className="character-mouth"></div>
                                            </div>
                                        </div>
                                        <div className="character-body">
                                            <div className="character-tie"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={`signin-form ${isSignUp ? "hidden" : ""}`}>
                                <h2 className="form-title">Sign In</h2>
                                <form onSubmit={handleSignInSubmit}>
                                    <div className="input-group">
                                        <input
                                            type="email"
                                            name="email"
                                            value={signInData.email}
                                            onChange={handleSignInChange}
                                            onFocus={() => handleFocus("email")}
                                            onBlur={handleBlur}
                                            placeholder="Email"
                                            className="form-input"
                                            required
                                        />
                                    </div>
                                    <div className="input-group">
                                        <input
                                            type="password"
                                            name="password"
                                            value={signInData.password}
                                            onChange={handleSignInChange}
                                            onFocus={() => handleFocus("password")}
                                            onBlur={handleBlur}
                                            placeholder="Password"
                                            className="form-input"
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="form-button">
                                        <span className="button-text">Login</span>
                                        <span className="button-icon"></span>
                                    </button>
                                </form>
                                <p className="message">{message}</p>
                            </div>

                            <div className={`signup-form ${isSignUp ? "" : "hidden"}`}>
                                <h2 className="form-title">Sign Up</h2>
                                <form onSubmit={handleSignUpSubmit}>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            name="username"
                                            value={signUpData.username}
                                            onChange={handleSignUpChange}
                                            onFocus={() => handleFocus("username")}
                                            onBlur={handleBlur}
                                            placeholder="Username"
                                            className="form-input"
                                            required
                                        />
                                    </div>
                                    <div className="input-group">
                                        <input
                                            type="email"
                                            name="email"
                                            value={signUpData.email}
                                            onChange={handleSignUpChange}
                                            onFocus={() => handleFocus("email")}
                                            onBlur={handleBlur}
                                            placeholder="Email"
                                            className="form-input"
                                            required
                                        />

                                    </div>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            name="rollnumber"
                                            value={signUpData.rollnumber || ""}
                                            onChange={handleSignUpChange}
                                            onFocus={() => handleFocus("rollnumber")}
                                            onBlur={handleBlur}
                                            placeholder="Roll Number"
                                            className="form-input"
                                            required
                                        />

                                    </div>
                                    <div className="input-group">
                                        <input
                                            type="password"
                                            name="password"
                                            value={signUpData.password}
                                            onChange={handleSignUpChange}
                                            onFocus={() => handleFocus("password")}
                                            onBlur={handleBlur}
                                            placeholder="Password"
                                            className="form-input"
                                            required
                                        />

                                    </div>
                                    <button type="submit" className="form-button">
                                        <span className="button-text">Register</span>
                                        <span className="button-icon"></span>
                                    </button>
                                </form>
                                <p className="message">{message}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignInPage
