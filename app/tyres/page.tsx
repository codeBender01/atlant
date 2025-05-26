"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import FilterSelect from "@/components/shared/filterSelect";
import TyreCard from "@/components/shared/tyreCard";

import { TyreCard as TyreCardType } from "../types";

import axios from "axios";

import { useEffect, useState } from "react";

export default function TruckTiresPage() {
  const [tyres, setTyres] = useState<TyreCardType[]>([]);

  const tires = Array(9).fill({
    id: 1,
    name: "DRC D721 315/80 R22.5",
    image: "/images/tyre1.png",
  });

  const getCatalog = async () => {
    const res = await axios.get<TyreCardType[]>("/api/proxy/api/tiers/catalog");
    return res.data;
  };

  useEffect(() => {
    getCatalog().then((res) => {
      setTyres(res);
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Грузовые шины</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <FilterSelect
          label="Ширина"
          options={[
            { label: "Все", value: "all" },
            { label: "295", value: "295" },
            { label: "315", value: "315" },
            { label: "385", value: "385" },
          ]}
        />

        <FilterSelect
          label="Высота"
          options={[
            { label: "Все", value: "all" },
            { label: "70", value: "70" },
            { label: "80", value: "80" },
            { label: "90", value: "90" },
          ]}
        />

        <FilterSelect
          label="Диаметр"
          options={[
            { label: "Все", value: "all" },
            { label: "R22.5", value: "r22.5" },
            { label: "R19.5", value: "r19.5" },
            { label: "R17.5", value: "r17.5" },
          ]}
        />

        <FilterSelect
          label="Ось"
          options={[
            { label: "Все", value: "all" },
            { label: "Ведущая", value: "drive" },
            { label: "Рулевая", value: "steer" },
            { label: "Прицепная", value: "trailer" },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tyres.map((tire, index) => (
          <TyreCard key={index} model={tire} />
        ))}
      </div>

      <div className="fixed bottom-8 right-8">
        <Button className="bg-black hover:bg-gray-800 text-white rounded-full px-6 py-3 font-medium">
          ЗАЯВКА
          <Badge className="ml-2 bg-red-600 w-4 h-4 rounded-full p-0 flex items-center justify-center">
            1
          </Badge>
        </Button>
      </div>
    </div>
  );
}
