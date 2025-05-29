"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import FilterSelect from "@/components/shared/filterSelect";
import TyreCard from "@/components/shared/tyreCard";

import { Liked, TyreCard as TyreCardType } from "../types";

import axios from "axios";

import { useEffect, useState } from "react";

import { useAuth } from "@/shared/hooks/useAuth";

export default function TruckTiresPage() {
  const [tyres, setTyres] = useState<TyreCardType[]>([]);

  const token = useAuth();

  const getCatalog = async () => {
    console.log(token);
    if (!token) return;
    const res = await axios.get<Liked[]>("/api/proxy/api/liked", {
      headers: {
        Authorization: `Bearer ${token.token}`,
      },
    });
    return res.data;
  };

  const handleRemoveLiked = async (id: number) => {
    await axios
      .delete(`/api/proxy/api/liked/${id}`, {
        headers: {
          Authorization: `Bearer ${token.token}`,
        },
      })
      .then(() => {
        getCatalog();
      });
  };

  useEffect(() => {
    getCatalog().then((res) => {
      if (res) {
        setTyres(res.map((t) => t.Tier));
      }
    });
  }, [token]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Избранное</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tyres.map((tire, index) => (
          <TyreCard
            handleRemoveLiked={handleRemoveLiked}
            isLiked={true}
            key={index}
            model={tire}
          />
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
