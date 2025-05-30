"use client";

import Link from "next/link";
import Image from "next/image";
import ProfileAvatar from "@/components/shared/profileAvatar";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { User } from "@/app/types";
import { handleAuthError } from "../app/utils/auth";
import { useAuth } from "@/shared/hooks/useAuth";

const navLinks = [
  { name: "Главная", href: "/" },
  { name: "Каталог", href: "/tyres" },
  { name: "Дилерство", href: "/dealership" },
  { name: "Контакты", href: "/contacts" },
];

export default function Header() {
  const { token, isInitialized } = useAuth();
  const [user, setUser] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const getUserProfile = async () => {
    if (!token) return null;

    try {
      setIsLoading(true);
      const res = await axios.get<User>("/api/proxy/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (error: any) {
      if (
        error.response?.status === 401 ||
        error.response?.data?.shouldLogout
      ) {
        handleAuthError(router);
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isInitialized && token) {
      getUserProfile()
        .then((res) => {
          if (res) {
            setUser(res);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch user profile:", error);
        });
    } else if (isInitialized && !token) {
      setUser({});
    }
  }, [token, isInitialized]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="w-full bg-white relative">
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

        {/* Desktop Navigation */}
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

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex">
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

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span
            className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 ${
              isMobileMenuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          ></span>
          <span
            className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 ${
              isMobileMenuOpen ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 ${
              isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          ></span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-[#000000] opacity-40 bg-opacity-50 z-40"
          onClick={closeMobileMenu}
        ></div>
      )}

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed top-0 right-0 h-full w-80 bg-white z-50 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6">
          {/* Close Button */}
          <button
            onClick={closeMobileMenu}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center"
            aria-label="Close mobile menu"
          >
            <span className="w-6 h-0.5 bg-gray-700 rotate-45 absolute"></span>
            <span className="w-6 h-0.5 bg-gray-700 -rotate-45 absolute"></span>
          </button>

          {/* Mobile Navigation Links */}
          <nav className="mt-12 space-y-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-lg font-bold text-gray-700 hover:text-red-600 transition-colors py-2"
                onClick={closeMobileMenu}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Auth Section */}
          <div className="mt-12 pt-6 border-t border-gray-200">
            {token && token !== "" ? (
              <div onClick={closeMobileMenu}>
                <ProfileAvatar user={user} />
              </div>
            ) : (
              <div className="space-y-4">
                <Link href={"/auth/login"} onClick={closeMobileMenu}>
                  <Button
                    type="button"
                    className="w-full cursor-pointer px-6 py-4 bg-black hover:bg-gray-800 text-white font-medium rounded-full"
                  >
                    Войти
                  </Button>
                </Link>
                <Link href={"/auth/register"} onClick={closeMobileMenu}>
                  <Button
                    type="button"
                    className="w-full cursor-pointer px-6 py-4 bg-white hover:bg-gray-800 border border-black text-black font-medium rounded-full hover:text-white"
                  >
                    Регистрация
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
