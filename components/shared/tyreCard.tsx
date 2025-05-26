"use client";

import React from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import Image from "next/image";

import { useRouter } from "next/navigation";

import { TyreCard as TyreCardType } from "@/app/types";

interface TyreCardProps {
  model: TyreCardType;
}

const TyreCard = ({ model }: TyreCardProps) => {
  const router = useRouter();
  return (
    <Card
      className="overflow-hidden border border-gray-200"
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
      <CardFooter className="flex justify-center px-24">
        <Button className="w-full rounded-lg py-2 bg-red-700 hover:bg-red-800 text-white">
          ПОДРОБНЕЕ О МОДЕЛИ
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TyreCard;
