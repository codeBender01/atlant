// hooks/useAuth.js
import { useEffect, useState } from "react";

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("atoken");
    setToken(storedToken);

    const handleStorageChange = () => {
      const newToken = localStorage.getItem("atoken");
      setToken(newToken);
    };

    window.addEventListener("storage", handleStorageChange);

    window.addEventListener("tokenUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("tokenUpdated", handleStorageChange);
    };
  }, []);

  return token;
}
