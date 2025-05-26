// hooks/useAuth.js
import { useEffect, useState } from "react";

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Get initial token
    const storedToken = localStorage.getItem("atoken");
    setToken(storedToken);

    // Listen for storage changes
    const handleStorageChange = () => {
      const newToken = localStorage.getItem("atoken");
      setToken(newToken);
    };

    window.addEventListener("storage", handleStorageChange);

    // Custom event for same-tab updates
    window.addEventListener("tokenUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("tokenUpdated", handleStorageChange);
    };
  }, []);

  return token;
}
