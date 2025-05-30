"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, Heart, Plus, Minus } from "lucide-react";
import Image from "next/image";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { toast } from "react-toastify";

import { TyreCard } from "@/app/types";

import { useRouter } from "next/navigation";

import axios from "axios";

import { useAuth } from "@/shared/hooks/useAuth";

export default function TireProductDetail() {
  const [quantity, setQuantity] = useState(1); // Changed default to 1
  const [isFavorite, setIsFavorite] = useState(false);
  const [price, setPrice] = useState(0);
  const [products, setProducts] = useState([
    { label: "Размер", value: "" },
    { label: "Индекс нагрузки", value: "" },
    { label: "Индекс скорости", value: "" },
    { label: "Ось", value: "" },
    { label: "Слойность", value: "" },
    { label: "Глубина протектора", value: "" },
    { label: "Сезонность", value: "" },
    { label: "Производитель", value: "" },
  ]);

  const params = useParams();
  const { token } = useAuth(); // Use destructured token
  const router = useRouter();

  const getOneTier = async () => {
    const res = await axios.get<TyreCard>(`/api/proxy/api/tiers/${params.id}`);
    return res.data;
  };

  const addToCart = async () => {
    if (quantity === 0) {
      toast.error("Выберите количество товара");
      return;
    }

    try {
      const response = await axios.post(
        "/api/proxy/api/order/cart",
        {
          tierId: params.id,
          quantity: quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Добавлено в корзину!");

      // Dispatch cart update event
      window.dispatchEvent(new Event("cartUpdated"));

      return response.data;
    } catch (error: any) {
      toast.error("Авторизуйтесь для добавления товаров в корзину");
      throw error;
    }
  };

  const handleAddToFavorites = async () => {
    if (!token) {
      toast.error("Авторизуйтесь для добавления в избранное");
      return;
    }

    try {
      setIsFavorite(!isFavorite);
      await axios.post(
        "/api/proxy/api/liked",
        {
          tierId: params.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Добавлено в избранное!");
    } catch (error) {
      setIsFavorite(isFavorite); // Revert on error
      toast.error("Ошибка при добавлении в избранное");
    }
  };

  useEffect(() => {
    getOneTier().then((res) => {
      setPrice(res.price);
      setProducts([
        { label: "Размер", value: res.size },
        { label: "Индекс нагрузки", value: res.load_index.toString() },
        { label: "Индекс скорости", value: res.speed_index },
        { label: "Ось", value: res.axis },
        { label: "Слойность", value: res.layers.toString() },
        { label: "Глубина протектора", value: res.tread_depth.toString() },
        {
          label: "Сезонность",
          value: res.Category.name,
        },
        { label: "Производитель", value: res.manufacturer },
      ]);
    });
  }, [params]);

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => {
            router.back();
          }}
          className="flex items-center cursor-pointer text-black hover:bg-gray-100"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Назад
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-12 items-center justify-center">
          <h1 className="text-3xl md:text-4xl font-bold">
            {products[0].value}
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
              className={`rounded-full cursor-pointer p-2 ${
                isFavorite ? "bg-gray-100" : "bg-gray-100"
              }`}
              onClick={handleAddToFavorites}
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
            <p className="text-4xl font-bold">{price} ₽</p>
          </div>

          <div className="mb-8 max-w-lg">
            {products.map((product, index) => (
              <div key={index} className="flex justify-between py-3">
                <p className="text-gray-700">{product.label}</p>
                <p className="font-medium">{product.value}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Button
              className="w-full rounded-full sm:w-auto bg-red-700 hover:bg-red-800 text-white font-medium py-6 px-16"
              onClick={addToCart}
              disabled={!token || quantity === 0}
            >
              ДОБАВИТЬ В ЗАЯВКУ
            </Button>

            <div className="flex items-center">
              <Button
                variant="outline"
                className="h-12 w-12 rounded-full border-2 border-gray-300"
                onClick={handleDecrease}
                disabled={quantity <= 1}
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
    </div>
  );
}
