import React from "react";
import "./SignInPage.css";

function SignInPage() {
    return (
        <div className="signin-container">
            <div className="left-section">
                <h1>Fresher Ho ?</h1>
                <p>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Debitis, ex
                    ratione. Aliquid!
                </p>
                <button className="signup-button">Sign Up</button>
            </div>
            <div className="right-section">
                <h2>Sign in</h2>
                <form className="signin-form">
                    <input type="email" placeholder="Email" className="form-input" />
                    <input type="password" placeholder="Password" className="form-input" />
                    <button type="submit" className="login-button">
                        Login
                    </button>
                </form>
                <p>Or Sign in with</p>
                <div className="signin-alternate">
                    <div className="circle"></div>
                </div>
            </div>
        </div>
    );
}

export default SignInPage;
