"use client";

import React from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import Image from "next/image";

import { useRouter } from "next/navigation";

import { TyreCard as TyreCardType } from "@/app/types";

interface TyreCardProps {
  model: TyreCardType;
  isLiked?: boolean;
  handleRemoveLiked?: (id: number) => Promise<void>;
}

const TyreCard = ({ model, isLiked, handleRemoveLiked }: TyreCardProps) => {
  const router = useRouter();

  return (
    <Card
      className="overflow-hidden border border-gray-200 relative"
      onClick={() => {
        router.push(`/tyres/${model.id}`);
      }}
    >
      <CardContent className="p-6 flex flex-col items-center">
        <div className="w-full h-48 relative mb-4">
          <Image
            width={100}
            height={100}
            src={"/images/tyre1.png"}
            alt={model.size}
            className="w-full h-full object-contain"
          />
        </div>
        <h3 className="text-lg font-bold text-center">{model.size}</h3>
      </CardContent>
      {isLiked && handleRemoveLiked ? (
        <Button
          onClick={() => handleRemoveLiked(model.id)}
          className=" w-fit rounded-lg py-2 bg-red-700 hover:bg-red-800 text-white absolute right-5"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM9 17h2V8H9zm4 0h2V8h-2zM7 6v13z"
            />
          </svg>
        </Button>
      ) : null}
      <CardFooter className="flex justify-center px-24">
        <Button className="w-full rounded-lg py-2 bg-red-700 hover:bg-red-800 text-white">
          ПОДРОБНЕЕ О МОДЕЛИ
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TyreCard;
