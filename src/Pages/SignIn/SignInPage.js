import React, { useState } from "react";
import "./SignInPage.css";
import rocketImg from "./rocket.png"; // Ensure your image path is correct

function SignInPage() {
    const [isSignUp, setIsSignUp] = useState(false);

    const toggleSignUp = () => {
        setIsSignUp((prev) => !prev); // Toggle between Sign In and Sign Up states
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
                <img src={rocketImg} alt="Rocket" className="rocket-image" />
            </div>

            <div className="form-section">
                <div className={`signin-form ${isSignUp ? "hidden" : ""}`}>
                    <h2>Sign In</h2>
                    <form>
                        <input type="email" placeholder="Email" className="form-input" />
                        <input type="password" placeholder="Password" className="form-input" />
                        <button type="submit" className="form-button">Login</button>
                    </form>
                </div>

                <div className={`signup-form ${isSignUp ? "" : "hidden"}`}>
                    <h2>Sign Up</h2>
                    <form>
                        <input type="text" placeholder="Username" className="form-input" />
                        <input type="email" placeholder="Email" className="form-input" />
                        <input type="password" placeholder="Password" className="form-input" />
                        <button type="submit" className="form-button">Register</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SignInPage;
