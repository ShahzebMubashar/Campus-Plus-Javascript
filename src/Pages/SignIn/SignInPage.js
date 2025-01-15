import React, { useState } from "react";
import "./SignInPage.css";
import rocketImg from "./rocket.png";
import humanImg from "./human.png";
import { useNavigate } from "react-router-dom"; // For navigation after login

function SignInPage() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState(""); // For sign-up
    const [message, setMessage] = useState(""); // For success/error messages
    const navigate = useNavigate();

    const toggleSignUp = () => {
        setIsSignUp((prev) => !prev);
        setMessage(""); // Clear any previous messages
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage("Sign-up successful! Please log in.");
                setIsSignUp(false); // Switch to log-in mode
            } else {
                setMessage(data.message || "Error during sign-up.");
            }
        } catch (error) {
            setMessage("An error occurred. Please try again later.");
        }
    };

    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage("Login successful!");
                navigate("/index"); // Redirect to the main index page
            } else {
                setMessage(data.message || "Invalid email or password.");
            }
        } catch (error) {
            setMessage("An error occurred. Please try again later.");
        }
    };

    return (
        <div className={`signin-container ${isSignUp ? "sign-up-mode" : ""}`}>
            <div className="left-section">
                <div className="background-circle"></div>
                <h1>{isSignUp ? "Already a Member?" : "Fresher Ho?"}</h1>
                <p>
                    {isSignUp
                        ? "Sign in to access your account and continue your journey with us."
                        : "Join us to explore amazing opportunities and resources!"}
                </p>
                <button className="toggle-button" onClick={toggleSignUp}>
                    {isSignUp ? "Sign In" : "Sign Up"}
                </button>
                <img
                    src={isSignUp ? humanImg : rocketImg}
                    alt={isSignUp ? "Human" : "Rocket"}
                    className="dynamic-image"
                />
            </div>

            <div className="form-section">
                {message && <div className="message">{message}</div>}

                {/* Sign-In Form */}
                <div className={`signin-form ${isSignUp ? "hidden" : ""}`}>
                    <h2>Sign In</h2>
                    <form onSubmit={handleSignIn}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-input"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-input"
                            required
                        />
                        <button type="submit" className="form-button">Login</button>
                    </form>
                </div>

                {/* Sign-Up Form */}
                <div className={`signup-form ${isSignUp ? "" : "hidden"}`}>
                    <h2>Sign Up</h2>
                    <form onSubmit={handleSignUp}>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="form-input"
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-input"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-input"
                            required
                        />
                        <button type="submit" className="form-button">Register</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SignInPage;
