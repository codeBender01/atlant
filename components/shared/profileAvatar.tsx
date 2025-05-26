"use client";

import React, { FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { User } from "@/app/types";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface ProfileProps {
  user?: User;
}

const ProfileAvatar: FC<ProfileProps> = ({ user }) => {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  console.log(user);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      localStorage.removeItem("atoken");

      window.dispatchEvent(new Event("tokenUpdated"));

      router.push("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
      localStorage.removeItem("atoken");
      window.dispatchEvent(new Event("tokenUpdated"));
      router.push("/auth/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar>
            <AvatarImage src={user?.avatar ? user.avatar : ""} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel className="font-bold">
            {user && user.name
              ? user.name
              : user && user.email
              ? user.email
              : ""}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuLabel onClick={() => router.push("/favorite")}>
            Избранное
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuLabel onClick={() => router.push("/profile")}>
            Настройки профиля
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="font-bold" onClick={handleLogout}>
            Выйти
          </DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default ProfileAvatar;
