import React, { useState } from "react";
import "./SignInPage.css";
import rocketImg from "./rocket.png";
import humanImg from "./human.png";
import { useNavigate } from "react-router-dom";

function SignInPage() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const toggleSignUp = () => {
        setIsSignUp((prev) => !prev);
        setMessage("");
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, email, password }),
            });

            // Check if the response is successful
            if (response.ok) {
                const data = await response.text(); // Get the response text
                setMessage("Sign-up successful! Please log in."); // Show success message
                console.log(data); // Log success message
                setIsSignUp(false); // Switch to login form
            } else {
                // If response is not OK, show error message
                const error = await response.text();
                setMessage(error || "An error occurred. Please try again later.");
            }
        } catch (err) {
            console.error("Error during sign-up:", err.message);
            setMessage("An error occurred. Please try again later.");
        }
    };


    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, email, password }),
            });

            // Check if the response is successful
            if (response.ok) {
                const data = await response.text();
                setMessage(data); // Display success message
                console.log(data); // Log success message
                navigate("/support"); // Navigate to another page
            } else {
                const error = await response.text();
                setMessage(error || "An error occurred. Please try again later.");
            }
        } catch (err) {
            console.error(err.message);
            setMessage("An error occurred. Please try again later.");
        }
    };


    return (
        <div className={`signin-container ${isSignUp ? "sign-up-mode" : ""}`}>
            <div className="left-section">

                <div className="background-circle"></div>
                <h1>{isSignUp ? "Already a Member?" : "New Here?"}</h1>
                <p>{isSignUp ? "Sign in to access your account." : "Join us today!"}</p>
                <button className="toggle-button" onClick={toggleSignUp}>
                    {isSignUp ? "Sign In" : "Sign Up"}
                </button>
                <img
                    src={isSignUp ? humanImg : rocketImg}
                    alt={isSignUp ? "Human" : "Rocket"}
                />
            </div>

            <div className="form-section">
                {message && <div className="message">{message}</div>}


                <form onSubmit={isSignUp ? handleSignUp : handleSignIn}>
                    {isSignUp && (
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    )}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">{isSignUp ? "Register" : "Login"}</button>
                </form>
            </div>
        </div>
    );
}

export default SignInPage;
