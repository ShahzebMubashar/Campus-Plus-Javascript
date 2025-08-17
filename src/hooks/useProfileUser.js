import { useState, useEffect } from "react";
import API_BASE_URL from "../config/api.js";
import { authenticatedFetch, isAuthenticated as checkAuth } from "../utils/auth";

export default function useProfileUser() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUserInfo() {
      if (!checkAuth()) return;
      try {
        const res = await authenticatedFetch(`${API_BASE_URL}/user/profile`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error("Failed to fetch user info");
        const data = await res.json();
        setUser(data);
      } catch (e) {
        setUser(null);
      }
    }
    fetchUserInfo();
  }, []);

  return user;
}