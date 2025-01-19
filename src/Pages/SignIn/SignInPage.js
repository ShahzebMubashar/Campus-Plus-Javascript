import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./SignInPage.css";
import rocketImg from "./rocket.png";
import humanImg from "./human.png";

function SignInPage() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [signInData, setSignInData] = useState({ email: "", password: "" });
    const [signUpData, setSignUpData] = useState({ username: "", email: "", password: "", rollnumber: "" });
    const [message, setMessage] = useState("");

    const navigate = useNavigate(); // React Router's navigate function

    const toggleSignUp = () => {
        setIsSignUp((prev) => !prev);
    };

    const handleSignInChange = (e) => {
        const { name, value } = e.target;
        setSignInData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSignUpChange = (e) => {
        const { name, value } = e.target;
        setSignUpData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSignInSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        try {
            const response = await fetch("http://localhost:4000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(signInData),
            });

            console.log("Response Status:", response.status); // Log response status
            console.log("Response Headers:", response.headers); // Log response headers

            const data = await response.json();
            console.log("Response Data:", data); // Log response body

            if (response.ok) {
                setMessage("Sign in successful!");
                localStorage.setItem("user", JSON.stringify(data));
                navigate("/support"); // Use React Router's navigate for routing
            } else {
                setMessage(data.message || "Sign in failed. Please try again.");
            }
        } catch (error) {
            console.error("Sign in error:", error); // Log any errors
            setMessage("An error occurred. Please try again later.");
        }
    };


    const handleSignUpSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        try {
            const response = await fetch("http://localhost:4000/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(signUpData),
            });

            console.log("Response Status:", response.status); // Log response status
            console.log("Response Headers:", response.headers); // Log response headers

            const data = await response.json();
            console.log("Response Data:", data); // Log the response data

            if (response.ok) {
                setMessage(data.message); // Show success message
                setIsSignUp(false); // Switch to sign-in mode
            } else {
                setMessage(data.message || "Sign up failed. Please try again.");
            }
        } catch (error) {
            console.error("Sign up error:", error); // Log any errors
            setMessage("An error occurred. Please try again later.");
        }
    };


    return (
        <div className={`signin-container ${isSignUp ? "sign-up-mode" : ""}`}>
            <div className="left-section">
                <div className="background-circle"></div> {/* Rotating background */}
                <h1>{isSignUp ? "Already a Member?" : "Fresher Ho?"}</h1>
                <p>
                    {isSignUp
                        ? "Sign in to access your account and continue your journey with us."
                        : "Join us to explore amazing opportunities and resources!"}
                </p>
                <button className="toggle-button" onClick={toggleSignUp}>
                    {isSignUp ? "Sign In" : "Sign Up"}
                </button>
                {/* Dynamically render image */}
                <img
                    src={isSignUp ? humanImg : rocketImg}
                    alt={isSignUp ? "Human" : "Rocket"}
                    className="dynamic-image"
                />
            </div>

            <div className="form-section">
                <div className={`signin-form ${isSignUp ? "hidden" : ""}`}>
                    <h2>Sign In</h2>
                    <form onSubmit={handleSignInSubmit}>
                        <input
                            type="email"
                            name="email"
                            value={signInData.email}
                            onChange={handleSignInChange}
                            placeholder="Email"
                            className="form-input"
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            value={signInData.password}
                            onChange={handleSignInChange}
                            placeholder="Password"
                            className="form-input"
                            required
                        />
                        <button type="submit" className="form-button">
                            Login
                        </button>
                    </form>
                    <p>{message}</p>
                </div>

                <div className={`signup-form ${isSignUp ? "" : "hidden"}`}>
                    <h2>Sign Up</h2>
                    <form onSubmit={handleSignUpSubmit}>
                        <input
                            type="text"
                            name="username"
                            value={signUpData.username}
                            onChange={handleSignUpChange}
                            placeholder="Username"
                            className="form-input"
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            value={signUpData.email}
                            onChange={handleSignUpChange}
                            placeholder="Email"
                            className="form-input"
                            required
                        />
                        <input
                            type="text"
                            name="rollnumber"
                            value={signUpData.rollnumber || ""}
                            onChange={handleSignUpChange}
                            placeholder="Roll Number"
                            className="form-input"
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            value={signUpData.password}
                            onChange={handleSignUpChange}
                            placeholder="Password"
                            className="form-input"
                            required
                        />
                        <button type="submit" className="form-button">
                            Register
                        </button>
                    </form>
                    <p>{message}</p>
                </div>
            </div>
        </div>
    );
}

export default SignInPage;
