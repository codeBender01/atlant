"use client";

import TyreCard from "@/components/shared/tyreCard";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { TyreCard as TyreCardType } from "@/app/types";

import { useState, useEffect } from "react";

import axios from "axios";

const models = [
  {
    id: 1,
    name: "DRC D721 315/80 R22.5",
    image: "/images/tyre1.png",
  },
  {
    id: 2,
    name: "DRC D721 315/80 R22.5",
    image: "/images/tyre1.png",
  },
  {
    id: 3,
    name: "DRC D721 315/80 R22.5",
    image: "/images/tyre1.png",
  },
  {
    id: 4,
    name: "DRC D721 315/80 R22.5",
    image: "/images/tyre1.png",
  },
  {
    id: 5,
    name: "DRC D721 315/80 R22.5",
    image: "/images/tyre1.png",
  },
  {
    id: 6,
    name: "DRC D721 315/80 R22.5",
    image: "/images/tyre1.png",
  },
];

export default function PopularModels() {
  const [tyres, setTyres] = useState<TyreCardType[]>([]);

  const getCatalog = async () => {
    const res = await axios.get<TyreCardType[]>("/api/proxy/api/tiers/popular");
    return res.data;
  };

  useEffect(() => {
    getCatalog().then((res) => {
      setTyres(res);
    });
  }, []);

  return (
    <section className="py-10 px-4 max-w-screen-xl mx-auto">
      <h2 className="text-xl md:text-2xl font-bold mb-6">Популярные модели</h2>

      <Carousel className="w-full" opts={{ slidesToScroll: 1, loop: true }}>
        <CarouselContent className="-ml-1">
          {tyres.map((model, index) => (
            <CarouselItem
              key={index}
              className="pl-1 md:basis-1/2 lg:basis-1/3"
            >
              <div className="p-1">
                <TyreCard model={model} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
}
