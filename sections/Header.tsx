"use client";

import Link from "next/link";
import Image from "next/image";
import ProfileAvatar from "@/components/shared/profileAvatar";

import axios from "axios";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { User } from "@/app/types";

const navLinks = [
  { name: "Главная", href: "/" },
  { name: "Каталог", href: "/tyres" },
  { name: "Дилерство", href: "/dealership" },
  { name: "Контакты", href: "/contacts" },
];

export default function Header() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>({});

  const getUserProfile = async () => {
    if (!token) return;

    const res = await axios.get<User>("/api/proxy/api/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  };

  useEffect(() => {
    const token = localStorage.getItem("atoken");
    setToken(token);
  }, []);

  useEffect(() => {
    getUserProfile().then((res) => {
      setUser(res);
    });
  }, [token]);

  return (
    <header className="w-full bg-white">
      <div className="max-w-screen-xl  mx-auto flex items-center justify-between px-4 py-3">
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
                className=" cursor-pointer px-6 py-4 bg-black hover:bg-gray-800 text-white font-medium rounded-full"
              >
                Sign in
              </Button>
            </Link>
            <Link href={"/auth/register"}>
              <Button
                type="button"
                className=" cursor-pointer px-6 py-4 bg-white hover:bg-gray-800 border border-black  text-black font-medium rounded-full hover:text-white"
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
