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
    const [signUpData, setSignUpData] = useState({ username: "", fullName: "", email: "", password: "", rollnumber: "" })
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

        window.addEventListener("mousemove", handleMouseMove)

        return () => {
            window.removeEventListener("mousemove", handleMouseMove)
        }
    }, [])

    // Update eye position based on mouse position
    useEffect(() => {
        if (isPasswordField) {
            // Hide eyes when typing password
            return
        }

        const handleEyeMovement = () => {
            if (characterCircleRef.current) {
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
                const moveX = 50 + ((Math.cos(angle) * distance) / maxDistance) * 30
                const moveY = 50 + ((Math.sin(angle) * distance) / maxDistance) * 30

                setEyePosition({ x: moveX, y: moveY })
            }
        }

        handleEyeMovement()

        // Add window resize listener to recalculate eye position
        window.addEventListener("resize", handleEyeMovement)
        return () => {
            window.removeEventListener("resize", handleEyeMovement)
        }
    }, [mousePosition, activeField, isPasswordField])

    // Add a useEffect hook to handle responsive layout adjustments
    useEffect(() => {
        const handleResize = () => {
            // Recalculate eye position on resize
            if (characterCircleRef.current && !isPasswordField) {
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
                const moveX = 50 + ((Math.cos(angle) * distance) / maxDistance) * 30
                const moveY = 50 + ((Math.sin(angle) * distance) / maxDistance) * 30

                setEyePosition({ x: moveX, y: moveY })
            }
        }

        window.addEventListener("resize", handleResize)
        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [mousePosition, isPasswordField])

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

    // Update the handleSignInSubmit function to add proper null checks
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

                // Animate character and show party poppers on success
                if (characterRef.current) {
                    characterRef.current.classList.add("success")

                    // Create and animate party poppers
                    createPartyPoppers()

                    setTimeout(() => {
                        // Check if the ref is still valid before removing the class
                        if (characterRef.current) {
                            characterRef.current.classList.remove("success")
                        }
                    }, 1000)
                }

                // Animate button before redirect
                const button = e.target.querySelector(".form-button")
                if (button) {
                    button.classList.add("success")
                }

                // Redirect after animation completes
                setTimeout(() => navigate("/"), 2000)
            } else {
                setMessage(data.error || "Sign in failed. Please try again.")
                const button = e.target.querySelector(".form-button")
                if (button) {
                    button.classList.add("error")
                    setTimeout(() => {
                        if (button) {
                            button.classList.remove("error")
                        }
                    }, 1000)
                }
            }
        } catch (error) {
            console.error("Sign in error:", error)
            setMessage("An error occurred. Please try again later.")
            const button = e.target.querySelector(".form-button")
            if (button) {
                button.classList.add("error")
                setTimeout(() => {
                    if (button) {
                        button.classList.remove("error")
                    }
                }, 1000)
            }
        }
    }

    // Update the handleSignUpSubmit function to add proper null checks
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
                if (button) {
                    button.classList.add("success")

                    // Switch to sign in after successful registration
                    setTimeout(() => {
                        if (button) {
                            button.classList.remove("success")
                        }
                        toggleSignUp()
                    }, 1000)
                }
            } else {
                setMessage(data.error || "Sign up failed. Please try again.")
                const button = e.target.querySelector(".form-button")
                if (button) {
                    button.classList.add("error")
                    setTimeout(() => {
                        if (button) {
                            button.classList.remove("error")
                        }
                    }, 1000)
                }
            }
        } catch (error) {
            console.error("Sign up error:", error)
            setMessage("An error occurred. Please try again later.")
            const button = e.target.querySelector(".form-button")
            if (button) {
                button.classList.add("error")
                setTimeout(() => {
                    if (button) {
                        button.classList.remove("error")
                    }
                }, 1000)
            }
        }
    }

    // Update the createPartyPoppers function to add proper null checks
    const createPartyPoppers = () => {
        const container = document.querySelector(".auth-wrapper")
        const characterCircle = characterCircleRef.current

        if (!container || !characterCircle) return

        try {
            const characterRect = characterCircle.getBoundingClientRect()
            const centerX = characterRect.left + characterRect.width / 2
            const centerY = characterRect.top

            // Create multiple confetti pieces
            for (let i = 0; i < 50; i++) {
                const confetti = document.createElement("div")
                confetti.className = "confetti"

                // Random confetti properties
                const size = Math.random() * 10 + 5
                const color = `hsl(${Math.random() * 360}, 80%, 60%)`

                confetti.style.width = `${size}px`
                confetti.style.height = `${size}px`
                confetti.style.backgroundColor = color

                // Position confetti at character's position
                confetti.style.left = `${centerX}px`
                confetti.style.top = `${centerY}px`

                // Random rotation
                confetti.style.transform = `rotate(${Math.random() * 360}deg)`

                // Random direction and distance
                const angle = Math.random() * Math.PI * 2
                const distance = Math.random() * 200 + 50
                const duration = Math.random() * 1 + 1 // 1-2 seconds

                // Calculate end position
                const endX = centerX + Math.cos(angle) * distance
                const endY = centerY + Math.sin(angle) * distance - 100 // Upward bias

                // Apply animation
                confetti.animate(
                    [
                        { transform: `translate(0, 0) rotate(0deg)`, opacity: 1 },
                        {
                            transform: `translate(${endX - centerX}px, ${endY - centerY}px) rotate(${Math.random() * 720}deg)`,
                            opacity: 0,
                        },
                    ],
                    {
                        duration: duration * 1000,
                        easing: "cubic-bezier(0.1, 0.8, 0.2, 1)",
                    },
                )

                // Add to DOM and remove after animation
                container.appendChild(confetti)
                setTimeout(() => {
                    if (confetti && confetti.parentNode) {
                        confetti.remove()
                    }
                }, duration * 1000)
            }
        } catch (error) {
            console.error("Error creating party poppers:", error)
        }
    }

    // Update the blinking animation effect to add proper null checks
    useEffect(() => {
        let blinkInterval

        if (characterRef.current) {
            blinkInterval = setInterval(() => {
                if (characterRef.current) {
                    characterRef.current.classList.add("blinking")
                    setTimeout(() => {
                        if (characterRef.current) {
                            characterRef.current.classList.remove("blinking")
                        }
                    }, 300)
                }
            }, 3000)
        }

        return () => {
            if (blinkInterval) {
                clearInterval(blinkInterval)
            }
        }
    }, [])

    // Update the password validation animation to add proper null checks
    useEffect(() => {
        if (activeField === "password" && characterRef.current) {
            const passwordValue = isSignUp ? signUpData.password : signInData.password

            if (passwordValue.length > 0) {
                if (passwordValue.length < 6) {
                    characterRef.current.classList.add("error")
                    setTimeout(() => {
                        if (characterRef.current) {
                            characterRef.current.classList.remove("error")
                        }
                    }, 500)
                } else {
                    characterRef.current.classList.add("success")
                    setTimeout(() => {
                        if (characterRef.current) {
                            characterRef.current.classList.remove("success")
                        }
                    }, 500)
                }
            }
        }
    }, [isSignUp ? signUpData.password : signInData.password, activeField, isSignUp])

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

                        <button className={`toggle-button ${isSignUp ? "sign-in-btn" : "sign-up-btn"}`} onClick={toggleSignUp}>
                            <span className="button-text">{isSignUp ? "Sign In" : "Sign Up"}</span>
                            <span className="button-icon"></span>
                        </button>
                        <img
                            src={isSignUp ? humanImg : rocketImg}
                            alt={isSignUp ? "Human" : "Rocket"}
                            className={`dynamic-image ${isSignUp ? "human-img" : "rocket-img"}`}
                        />
                    </div>

                    <div className="form-section">
                        <div className={`form-container ${isAnimating ? "fade" : ""}`}>
                            {/* Character Circle Container */}
                            <div className={`character-circle-container ${isSignUp ? "sign-up-char" : "sign-in-char"}`}>
                                <div className={`character-circle ${isPasswordField ? "hiding-eyes" : ""}`} ref={characterCircleRef}>
                                    {/* Animated Character */}
                                    <div className={`animated-character ${isPasswordField ? "hiding-eyes" : ""} `} ref={characterRef}>
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
                                            type="text"
                                            name="fullName"
                                            value={signUpData.fullName}
                                            onChange={handleSignUpChange}
                                            onFocus={() => handleFocus("fullName")}
                                            onBlur={handleBlur}
                                            placeholder="Full Name"
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
