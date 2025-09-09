import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatroomMobileBanner = ({ isLoggedIn }) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);
    const navigate = useNavigate();

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 900);
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    if (!isLoggedIn || !isMobile) return null;

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 99999,
                background: "rgba(240,245,250,0.95)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                minWidth: "100vw",
            }}
        >
            <div
                style={{
                    background: "#fff",
                    borderRadius: 18,
                    boxShadow: "0 8px 32px rgba(20,66,114,0.13)",
                    padding: "2.5rem 2rem 2rem 2rem",
                    maxWidth: 350,
                    width: "90vw",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <div
                    style={{
                        fontSize: "2.5rem",
                        marginBottom: "1rem",
                        color: "#1976d2",
                        lineHeight: 1,
                    }}
                >
                    📱
                </div>
                <div
                    style={{
                        fontWeight: 700,
                        fontSize: "1.35rem",
                        color: "#22223b",
                        marginBottom: "0.7rem",
                        letterSpacing: "-0.01em",
                    }}
                >
                    Chatroom Not Available
                </div>
                <div
                    style={{
                        color: "#4a5568",
                        fontSize: "1.05rem",
                        fontWeight: 500,
                        marginBottom: "1.2rem",
                        lineHeight: 1.5,
                    }}
                >
                    The chatroom feature is not available on mobile devices yet.<br />
                    Please use a desktop or tablet to access chatrooms.
                </div>
                <button
                    onClick={() => navigate("/")}
                    style={{
                        marginTop: "0.5rem",
                        background: "#2563eb",
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        padding: "0.7rem 1.5rem",
                        fontWeight: 600,
                        fontSize: "1rem",
                        cursor: "pointer",
                        boxShadow: "0 2px 8px rgba(37,99,235,0.08)",
                        transition: "background 0.2s",
                    }}
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
};

export default ChatroomMobileBanner;