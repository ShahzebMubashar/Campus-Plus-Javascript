import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar.js";
import RoomList from "./components/RoomList.js";
import RoomView from "./components/RoomView.js";
import Navbar from "../Index/components/Navbar.js";
import "../Chatroom/css/Chatroom.css";
import { AiOutlineMenu } from "react-icons/ai";
import API_BASE_URL from "../../config/api.js";


export default function Chatrooms() {
  const [rooms, setRooms] = useState([]);
  const [joinedRooms, setJoinedRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(true);

  useEffect(() => {
    fetchUserInfo();
    fetchAllRooms();
    fetchJoinedRooms();
  }, []);

  useEffect(() => {
    if (!isSidebarOpen) return;

    const handleClickOutside = (event) => {
      const sidebar = document.querySelector(".sidebar");
      const toggle = document.querySelector(".mobile-menu-toggle");
      if (
        (sidebar && sidebar.contains(event.target)) ||
        (toggle && toggle.contains(event.target))
      ) {
        return;
      }
      setIsSidebarOpen(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isSidebarOpen]);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      if (window.innerWidth > 768) return;
      if (window.scrollY <= 0) {
        setIsMenuVisible(true);
      } else if (window.scrollY > lastScrollY) {
        setIsMenuVisible(false);
      } else {
        setIsMenuVisible(true);
      }
      lastScrollY = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleSidebar = (e) => {
    if (e) e.stopPropagation();
    setIsSidebarOpen((prev) => !prev);
  };

  const fetchUserInfo = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "apploication/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUserInfo(data);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      setIsAuthenticated(false);
    }
  };

  const fetchAllRooms = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/Chatrooms`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setRooms(data);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchJoinedRooms = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/Chatrooms/user/groups`,
        {
          credentials: "include",
        },
      );
      if (response.ok) {
        const data = await response.json();
        setJoinedRooms(data);
      }
    } catch (error) {
      console.error("Error fetching joined rooms:", error);
    }
  };

  const handleRoomSelect = async (room) => {
    // If room is not joined, join it first
    if (!joinedRooms.find((r) => r.roomid === room.roomid)) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/Chatrooms/join/${room.roomid}`,
          {
            method: "POST",
            credentials: "include",
          },
        );
        if (response.ok) {
          await fetchJoinedRooms(); // Refresh joined rooms list
        }
      } catch (error) {
        console.error("Error joining room:", error);
        return;
      }
    }
    setActiveRoom(room);
  };

  // Login prompt component
  const LoginPrompt = () => (
    <div className="login-prompt">
      <div className="login-prompt-content">
        <div className="login-prompt-icon">🔒</div>
        <h2>Authentication Required</h2>
        <p>You need to log in to access the chatroom feature.</p>
        <p>Please sign in to your account to continue.</p>
        <button
          className="login-prompt-btn"
          onClick={() => (window.location.href = "/sign-in")}
        >
          Sign In
        </button>
      </div>
    </div>
  );

  return (
    <div className="chatroom-main-top">
      <div className="chatroom-app">
        <Navbar />
        {/* Mobile Menu Toggle Button */}
        {!isSidebarOpen && isMenuVisible && (
          <button
            className="mobile-menu-toggle"
            onClick={toggleSidebar}
            aria-label="Open sidebar menu"
          >
            <AiOutlineMenu size={28} />
          </button>
        )}
        <div className="content-wrapper">
          <Sidebar
            userInfo={userInfo}
            rooms={rooms}
            joinedRooms={joinedRooms}
            activeRoom={activeRoom}
            onRoomSelect={handleRoomSelect}
            isOpen={isSidebarOpen}
            onClose={(e) => {
              if (e) e.stopPropagation();
              setIsSidebarOpen(false);
            }}
          />
          <div className="main-content">
            {activeRoom ? (
              <RoomView
                room={activeRoom}
                onBack={() => setActiveRoom(null)}
                onLeave={async () => {
                  await handleLeaveRoom(activeRoom.roomid);
                  setActiveRoom(null);
                  fetchJoinedRooms();
                }}
              />
            ) : (
              <RoomList
                rooms={rooms}
                onJoinRoom={(roomId) => {
                  const room = rooms.find((r) => r.roomid === roomId);
                  if (room) handleRoomSelect(room);
                }}
              />
            )}
          </div>
        </div>
        {/* Login prompt overlay with blurred background */}
        {!isAuthenticated && !loading && (
          <div className="login-overlay">
            <div className="blurred-background"></div>
            <LoginPrompt />
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function for leaving a room
async function handleLeaveRoom(roomId) {
  try {
    const response = await fetch(
        `${API_BASE_URL}/Chatrooms/leave/${roomId}`,
      {
        method: "DELETE",
        credentials: "include",
      },
    );
    return response.ok;
  } catch (error) {
    console.error("Error leaving room:", error);
    return false;
  }
}
