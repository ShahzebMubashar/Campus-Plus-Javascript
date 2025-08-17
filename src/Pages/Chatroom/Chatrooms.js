import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar.js";
import RoomList from "./components/RoomList.js";
import RoomView from "./components/RoomView.js";
import Navbar from "../Index/components/Navbar.js";
import BlurLoginPrompt from "../BlurLoginPrompt.js";
import "../Chatroom/css/Chatroom.css";
import { AiOutlineMenu } from "react-icons/ai";
import API_BASE_URL from "../../config/api.js";
import { authenticatedFetch, isAuthenticated as checkAuth } from "../../utils/auth";
import ChatroomMobileBanner from "./components/ChatroomMobileBanner";


export default function Chatrooms() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [joinedRooms, setJoinedRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(true);
  const [pendingBack, setPendingBack] = useState(false); // <-- add this
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);

  useEffect(() => {
    // Check authentication first
    const checkAuthStatus = () => {
      const authStatus = checkAuth();
      setIsAuthenticated(authStatus);
      setLoading(false);

      if (authStatus) {
        // Only fetch data if user is authenticated
        fetchUserInfo();
        fetchAllRooms();
        fetchJoinedRooms();
      }
    };

    checkAuthStatus();
  }, []);

  // Handle roomId parameter from URL
  useEffect(() => {
    // Only select a room if roomId is present, rooms are loaded, user is authenticated,
    // and activeRoom is not null (prevents re-selecting after navigating back)
    if (roomId && rooms.length > 0 && isAuthenticated && activeRoom === null) {
      const room = rooms.find(r => r.roomid === parseInt(roomId));
      if (room) {
        handleRoomSelect(room, false); // false to prevent navigation
      }
    }
  }, [roomId, rooms, isAuthenticated, activeRoom]);

  // Reset activeRoom if URL is /chatroom (no roomId)
  useEffect(() => {
    if (!roomId && activeRoom !== null) {
      setActiveRoom(null);
    }
  }, [roomId]);

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

  useEffect(() => {
    if (pendingBack && activeRoom === null) {
      navigate("/chatroom");
      setPendingBack(false);
    }
  }, [pendingBack, activeRoom, navigate]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = (e) => {
    if (e) e.stopPropagation();
    setIsSidebarOpen((prev) => !prev);
  };

  const fetchUserInfo = async () => {
    try {
      const response = await authenticatedFetch(`${API_BASE_URL}/user/profile`, {
        method: "GET",
      });
      if (response.ok) {
        const data = await response.json();
        setUserInfo(data);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const fetchAllRooms = async () => {
    try {
      const response = await authenticatedFetch(`${API_BASE_URL}/Chatrooms`);
      if (response.ok) {
        const data = await response.json();
        setRooms(data);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const fetchJoinedRooms = async () => {
    try {
      const response = await authenticatedFetch(
        `${API_BASE_URL}/Chatrooms/user/groups`,
      );
      if (response.ok) {
        const data = await response.json();
        setJoinedRooms(data);
      }
    } catch (error) {
      console.error("Error fetching joined rooms:", error);
    }
  };

  const handleRoomSelect = async (room, shouldNavigate = true) => {
    // If room is not joined, join it first
    if (!joinedRooms.find((r) => r.roomid === room.roomid)) {
      try {
        const response = await authenticatedFetch(
          `${API_BASE_URL}/Chatrooms/join/${room.roomid}`,
          {
            method: "POST",
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

    // Navigate to room URL if shouldNavigate is true
    if (shouldNavigate) {
      navigate(`/chatroom/${room.roomid}`);
    }
  };

  // Replace your return with this:
  if (isMobile && !!userInfo) {
    return <ChatroomMobileBanner isLoggedIn={!!userInfo} />;
  }

  return (
    <div className="chatroom-main-top">
      <div className="chatroom-app">

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
                onBack={() => {
                  setActiveRoom(null);
                  setPendingBack(true);
                }}
                onLeave={async () => {
                  await handleLeaveRoom(activeRoom.roomid);
                  setActiveRoom(null);
                  navigate("/chatroom");
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
          <BlurLoginPrompt
            message="Chatroom Access Required"
            subMessage="Please sign in to access the chatroom feature and join conversations."
            buttonText="Sign In"
          />
        )}
      </div>
    </div>
  );
}

// Helper function for leaving a room
async function handleLeaveRoom(roomId) {
  const { authenticatedFetch } = await import("../../utils/auth");
  try {
    const response = await authenticatedFetch(
      `${API_BASE_URL}/Chatrooms/leave/${roomId}`,
      {
        method: "DELETE",
      },
    );
    return response.ok;
  } catch (error) {
    console.error("Error leaving room:", error);
    return false;
  }
}
