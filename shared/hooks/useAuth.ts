// hooks/useAuth.ts
import { useEffect, useState } from "react";

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initial token check
    const storedToken = localStorage.getItem("atoken");
    setToken(storedToken);
    setIsInitialized(true);

    const handleStorageChange = (e?: StorageEvent) => {
      const newToken = localStorage.getItem("atoken");
      setToken(newToken);
    };

    const handleTokenUpdated = () => {
      const newToken = localStorage.getItem("atoken");
      setToken(newToken);
    };

    // Listen for storage changes from other tabs
    window.addEventListener("storage", handleStorageChange);

    // Listen for custom token update events
    window.addEventListener("tokenUpdated", handleTokenUpdated);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("tokenUpdated", handleTokenUpdated);
    };
  }, []);

  return { token, isInitialized };
}
