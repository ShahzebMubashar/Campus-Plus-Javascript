"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import LoginForm from "./components/login-form"
import SignupForm from "./components/signup-form"
import Character from "./components/character"
import "./styles.css"

// Utility function to conditionally join classNames
function cn(...classes) {
    return classes.filter(Boolean).join(" ")
}

function AuthPage() {
    const [isLogin, setIsLogin] = useState(true)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const [isTypingPassword, setIsTypingPassword] = useState(false)
    const containerRef = useRef(null)

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

    return (
        <div className="testsignincontainer">
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
                                className={cn("blue-shape-text", !isLogin && "hidden")}
                            >
                                <h2 className="blue-shape-title">New Here?</h2>
                                <p className="blue-shape-description">Sign up and discover a great amount of new opportunities!</p>
                                <button
                                    onClick={() => setIsLogin(false)}
                                    className="blue-shape-button"
                                >
                                    Sign Up
                                </button>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.3 }}
                                className={cn("blue-shape-text", isLogin && "hidden")}
                            >
                                <h2 className="blue-shape-title">One of Us?</h2>
                                <p className="blue-shape-description">If you already have an account, just sign in!</p>
                                <button
                                    onClick={() => setIsLogin(true)}
                                    className="blue-shape-button"
                                >
                                    Sign In
                                </button>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Character - positioned above the form */}
                    <motion.div
                        className="character-container"
                        initial={{ top: "5%" }}
                        animate={{
                            left: isLogin ? "65%" : "25%",
                            top: "5%",
                        }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                    >
                        <Character mouseX={mousePosition.x} mouseY={mousePosition.y} isTypingPassword={isTypingPassword} />
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
                                <LoginForm
                                    onPasswordFocus={() => setIsTypingPassword(true)}
                                    onPasswordBlur={() => setIsTypingPassword(false)}
                                />
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
                                <SignupForm
                                    onPasswordFocus={() => setIsTypingPassword(true)}
                                    onPasswordBlur={() => setIsTypingPassword(false)}
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuthPage
