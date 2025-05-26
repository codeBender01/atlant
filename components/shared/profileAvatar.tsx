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

interface ProfileProps {
  user?: User;
}

const ProfileAvatar: FC<ProfileProps> = ({ user }) => {
  const router = useRouter();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
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
          <DropdownMenuLabel>Избранное</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuLabel onClick={() => router.push("/profile")}>
            Настройки профиля
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="font-bold">Выйти</DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default ProfileAvatar;
