import React from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import Image from "next/image";

interface TyreCardProps {
  model: {
    name: string;
    image: string;
    id: number;
  };
}

const TyreCard = ({ model }: TyreCardProps) => {
  return (
    <Card className="overflow-hidden border border-gray-200">
      <CardContent className="p-6 flex flex-col items-center">
        <div className="w-full h-48 relative mb-4">
          <Image
            width={100}
            height={100}
            src={model.image}
            alt={model.name}
            className="w-full h-full object-contain"
          />
        </div>
        <h3 className="text-lg font-bold text-center">{model.name}</h3>
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
