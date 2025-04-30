"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Heart, Plus, Minus } from "lucide-react";
import Image from "next/image";
import TireOrderModal from "@/components/shared/tyreOrderModal";

export default function TireProductDetail() {
  const [quantity, setQuantity] = useState(8);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderCount, setOrderCount] = useState(0);

  // Product specifications
  const productSpecs = [
    { label: "Размер", value: "315/80R22.5" },
    { label: "Индекс нагрузки", value: "156/153" },
    { label: "Индекс скорости", value: "M" },
    { label: "Ось", value: "Ведущая" },
    { label: "Слойность", value: "20PR" },
    { label: "Глубина протектора", value: "22.5mm" },
    { label: "Сезонность", value: "M+S (Всесезонная)" },
    { label: "Производитель", value: "DRC (Вьетнам)" },
  ];

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleAddToOrder = () => {
    setOrderCount((prev) => prev + 1);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Button
          variant="ghost"
          className="flex items-center text-black hover:bg-gray-100"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Назад
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-12 items-center justify-center">
          <h1 className="text-3xl md:text-4xl font-bold">
            DRC D721 315/80 R22.5
          </h1>
          <div className="w-full max-w-lg">
            <Image
              width={100}
              height={100}
              src="/images/tyre1.png"
              alt="DRC D721 315/80 R22.5 Tire"
              className="w-full object-contain"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-end items-center mb-6 w-full">
            <Button
              variant="outline"
              className={`rounded-full p-2 ${
                isFavorite ? "bg-gray-100" : "bg-gray-100"
              }`}
              onClick={toggleFavorite}
            >
              <Heart
                className={`h-6 w-6 ${
                  isFavorite ? "fill-black stroke-black" : "stroke-black"
                }`}
              />
              <span className="">В Избранное</span>
            </Button>
          </div>

          <div className="mb-8">
            <p className="text-4xl font-bold">32 660 ₽</p>
          </div>

          <div className="mb-8 max-w-lg">
            {productSpecs.map((spec, index) => (
              <div key={index} className="flex justify-between py-3">
                <p className="text-gray-700">{spec.label}</p>
                <p className="font-medium">{spec.value}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Button
              className="w-full rounded-full sm:w-auto bg-red-700 hover:bg-red-800 text-white font-medium py-6 px-16"
              onClick={handleAddToOrder}
            >
              ДОБАВИТЬ В ЗАЯВКУ
            </Button>

            <div className="flex items-center">
              <Button
                variant="outline"
                className="h-12 w-12 rounded-full border-2 border-gray-300"
                onClick={handleDecrease}
              >
                <Minus className="h-4 w-4" />
              </Button>

              <span className="mx-4 text-lg font-medium min-w-12 text-center">
                {quantity}
              </span>

              <Button
                variant="outline"
                className="h-12 w-12 rounded-full border-2 border-gray-300"
                onClick={handleIncrease}
              >
                <Plus className="h-4 w-4" />
              </Button>

              <span className="ml-4 text-lg">шт</span>
            </div>
          </div>
        </div>
      </div>
      <TireOrderModal
        open={isModalOpen}
        onOpenChange={() => setIsModalOpen(!isModalOpen)}
      />
      <div className="fixed bottom-8 right-8">
        <Button
          className="bg-black hover:bg-gray-800 text-white rounded-full px-8 py-3 font-medium text-lg"
          onClick={() => setIsModalOpen(true)}
        >
          ЗАЯВКА
          {orderCount > 0 && (
            <span className="ml-2 bg-red-600 w-4 h-4 rounded-full flex items-center justify-center text-xs">
              {orderCount}
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
