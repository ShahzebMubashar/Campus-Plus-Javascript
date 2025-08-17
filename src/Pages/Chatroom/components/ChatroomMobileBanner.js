import React, { useEffect, useState } from "react";

const ChatroomMobileBanner = ({ isLoggedIn }) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);

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
                        marginBottom: "0.5rem",
                        lineHeight: 1.5,
                    }}
                >
                    The chatroom feature is not available on mobile devices yet.
                    <br />
                    Please use a desktop or tablet to access chatrooms.
                </div>
            </div>
        </div>
    );
};

export default ChatroomMobileBanner;