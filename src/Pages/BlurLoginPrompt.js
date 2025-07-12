import React from "react";

const BlurLoginPrompt = ({
    message = "Authentication Required",
    subMessage = "You need to log in to use this feature.",
    buttonText = "Sign In",
    onClose,
}) => (
    <div className="login-overlay">
        <div className="blurred-background" onClick={onClose}></div>
        <div className="login-prompt">
            <div className="login-prompt-content">
                <div className="login-prompt-icon">🔒</div>
                <h2>{message}</h2>
                <p>{subMessage}</p>
                <button
                    className="login-prompt-btn"
                    onClick={() => (window.location.href = "/sign-in")}
                >
                    {buttonText}
                </button>
            </div>
        </div>
    </div>
);

export default BlurLoginPrompt; 