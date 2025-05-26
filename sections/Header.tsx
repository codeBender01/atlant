"use client";

import Link from "next/link";
import Image from "next/image";
import ProfileAvatar from "@/components/shared/profileAvatar";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { User } from "@/app/types";
import { clearAuthData, handleAuthError } from "../app/utils/auth";

const navLinks = [
  { name: "Главная", href: "/" },
  { name: "Каталог", href: "/tyres" },
  { name: "Дилерство", href: "/dealership" },
  { name: "Контакты", href: "/contacts" },
];

// Custom hook for authentication
function useAuth() {
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
    window.addEventListener("tokenUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("tokenUpdated", handleStorageChange);
    };
  }, []);

  return token;
}

export default function Header() {
  const token = useAuth();
  const [user, setUser] = useState<any>({});
  const router = useRouter();

  const getUserProfile = async () => {
    if (!token) return;

    try {
      const res = await axios.get<User>("/api/proxy/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (error: any) {
      // Handle 401 or shouldLogout flag
      if (
        error.response?.status === 401 ||
        error.response?.data?.shouldLogout
      ) {
        handleAuthError(router);
      }
      throw error;
    }
  };

  useEffect(() => {
    if (token) {
      getUserProfile()
        .then((res) => {
          if (res) {
            setUser(res);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch user profile:", error);
        });
    } else {
      setUser({});
    }
  }, [token]);

  return (
    <header className="w-full bg-white">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/">
          <div className="flex items-center gap-2">
            <Image
              src="/images/atlant-trade-logo.png"
              alt="ATLANTTRADE Logo"
              width={120}
              className="cursor-pointer"
              height={120}
            />
          </div>
        </Link>

        <nav className="hidden md:flex space-x-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-700 hover:text-red-600 font-bold transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {token && token !== "" ? (
          <ProfileAvatar user={user} />
        ) : (
          <div className="flex items-center gap-3">
            <Link href={"/auth/login"}>
              <Button
                type="button"
                className="cursor-pointer px-6 py-4 bg-black hover:bg-gray-800 text-white font-medium rounded-full"
              >
                Sign in
              </Button>
            </Link>
            <Link href={"/auth/register"}>
              <Button
                type="button"
                className="cursor-pointer px-6 py-4 bg-white hover:bg-gray-800 border border-black text-black font-medium rounded-full hover:text-white"
              >
                Sign up
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
