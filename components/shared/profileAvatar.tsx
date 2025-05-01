import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const ProfileAvatar = () => {
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
            Геннадий Тарханян
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Избранное</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Настройки профиля</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="font-bold">Выйти</DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default ProfileAvatar;
