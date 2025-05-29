"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";
import { useAuth } from "@/shared/hooks/useAuth";
import { Cart, TyreCard } from "@/app/types";

import image from "../../public/images/tyre1.png";

const tires = [
  {
    id: 1,
    name: "DRC D733 315/80 R22.5",
    image: "/images/tyre1.png",
  },
  {
    id: 2,
    name: "DRC D733 315/80 R22.5",
    image: "/images/tyre1.png",
  },
  {
    id: 3,
    name: "DRC D733 315/80 R22.5",
    image: "/images/tyre1.png",
  },
];

const StepIndicator = ({ currentStep }: { currentStep: number }) => {
  return (
    <div className="flex items-center justify-center gap-8 mb-8">
      <div className="flex items-center">
        <div
          className={`rounded-full w-8 h-8 flex items-center justify-center text-white ${
            currentStep >= 1 ? "bg-black" : "bg-gray-300"
          }`}
        >
          1
        </div>
        <div className="ml-2 text-sm">Состав заказа</div>
      </div>
      <div className="h-px w-6 bg-gray-300"></div>
      <div className="flex items-center">
        <div
          className={`rounded-full w-8 h-8 flex items-center justify-center text-white ${
            currentStep >= 2 ? "bg-black" : "bg-gray-300"
          }`}
        >
          2
        </div>
        <div className="ml-2 text-sm">Контакты</div>
      </div>
      <div className="h-px w-6 bg-gray-300"></div>
      <div className="flex items-center">
        <div
          className={`rounded-full w-8 h-8 flex items-center justify-center text-white ${
            currentStep >= 3 ? "bg-black" : "bg-gray-300"
          }`}
        >
          3
        </div>
        <div className="ml-2 text-sm">Отправка</div>
      </div>
    </div>
  );
};

const QuantitySelector = ({
  quantity,
  setQuantity,
}: {
  quantity: number;
  setQuantity: (newQuantity: number) => void;
}) => {
  // Add console logs to debug

  const handleDecrease = () => {
    const newQuantity = Math.max(0, quantity - 1);
    setQuantity(newQuantity);
  };

  const handleIncrease = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
  };

  return (
    <div className="flex items-center gap-2 mt-2">
      <Button
        variant="outline"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={handleDecrease}
        type="button" // Add this to prevent form submission
      >
        -
      </Button>
      <div className="text-center min-w-8">{quantity}</div>
      <Button
        variant="outline"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={handleIncrease}
        type="button" // Add this to prevent form submission
      >
        +
      </Button>
    </div>
  );
};

const ProductCard = ({
  tire,
  setSelectedQuantities,
  image,
  cart,
  handleRemoveFromCart,
  refreshCart,
  token,
}: {
  tire: TyreCard;
  setSelectedQuantities: React.Dispatch<React.SetStateAction<Cart>>;
  image: string;
  cart: Cart;
  handleRemoveFromCart: (id: number) => Promise<void>;
  token: string;
  refreshCart: () => void;
}) => {
  // Find the cart item that matches this tire
  const cartItem = cart.items.find((item) => item.tierId === tire.id);

  const updateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity === 0 && cartItem) {
      await handleRemoveFromCart(cartItem?.Tier.id);
      return;
    }

    // Update local state immediately for better UX
    setSelectedQuantities((prevCart) => {
      const updatedItems = prevCart.items.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            quantity: newQuantity,
            subtotal: item.Tier.price * newQuantity,
          };
        }
        return item;
      });

      const newTotal = updatedItems.reduce(
        (sum, item) => sum + item.subtotal,
        0
      );
      const newItemCount = updatedItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      const newCart = {
        items: updatedItems,
        total: newTotal,
        itemCount: newItemCount,
      };

      return newCart;
    });

    try {
      await axios.put(
        `/api/proxy/api/order/cart/${itemId}`,
        {
          quantity: newQuantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Failed to update quantity:", error);
      refreshCart();
    }
  };

  // If there's no cart item for this tire, don't render the component
  if (!cartItem) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border flex flex-col items-center relative">
      <div className="w-24 h-24 relative mb-2">
        <Image src={image} alt={image} fill className="object-contain" />
      </div>
      <Button
        onClick={() => handleRemoveFromCart(cartItem.Tier.id)}
        className=" w-fit rounded-lg py-2 bg-red-700 hover:bg-red-800 text-white absolute right-2"
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
      <div className="text-xs text-center font-medium mb-1">{tire.size}</div>
      <div className="text-xs text-center mb-2">{cartItem.quantity}</div>
      <QuantitySelector
        quantity={cartItem.quantity} // Use the cart item's quantity
        setQuantity={(newQuantity) => {
          updateQuantity(cartItem.id, newQuantity); // Use the cart item's id
        }}
      />
    </div>
  );
};

export type TireOrderModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTireId?: number;
  initialQuantity?: number;
};

export default function TireOrderModal({
  open,
  onOpenChange,
  initialTireId,
  initialQuantity = 1,
}: TireOrderModalProps) {
  const [step, setStep] = useState(1);
  const [selectedQuantities, setSelectedQuantities] = useState<
    Record<number, number>
  >({});
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    region: "",
    message: "",
  });
  const [cart, setCart] = useState<Cart>({
    items: [],
    itemCount: 0,
    total: 0,
  });

  const { token } = useAuth(); // Use destructured token

  const getInCartProducts = async () => {
    if (!token) return { items: [], itemCount: 0, total: 0 };

    try {
      const res = await axios.get<Cart>("/api/proxy/api/order/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      return { items: [], itemCount: 0, total: 0 };
    }
  };

  const refreshCart = async () => {
    const cartData = await getInCartProducts();
    setCart(cartData);
  };

  useEffect(() => {
    if (token) {
      refreshCart();
    }
  }, [token]);

  // Listen for cart updates
  useEffect(() => {
    const handleCartUpdate = () => {
      if (token) {
        refreshCart();
      }
    };

    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, [token]);

  useEffect(() => {
    if (open && initialTireId) {
      setSelectedQuantities((prev) => ({
        ...prev,
        [initialTireId]: initialQuantity,
      }));
    }
  }, [open, initialTireId, initialQuantity]);

  useEffect(() => {
    if (!open) {
      setStep(1);
    }
  }, [open]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNextStep = async () => {
    if (step < 3) {
      if (formData.message === "" && step === 2) {
        return;
      }
      setStep(step + 1);
    } else {
      onOpenChange(false);

      try {
        await axios.post("/api/proxy/api/order/order", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Clear cart after successful order
        window.dispatchEvent(new Event("cartUpdated"));

        setTimeout(() => {
          setStep(1);
          setFormData({
            name: "",
            phone: "",
            email: "",
            region: "",
            message: "",
          });
        }, 300);
      } catch (error) {
        console.error("Order failed:", error);
        // Handle error (show toast, etc.)
      }
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleRemoveLiked = async (id: number) => {
    try {
      await axios.delete(`/api/proxy/api/order/cart/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Refresh cart data
      const updatedCart = await getInCartProducts();
      setCart(updatedCart);

      // Dispatch cart update event to notify layout
      window.dispatchEvent(new Event("cartUpdated"));

      // Close modal if cart becomes empty
      if (updatedCart.items.length === 0) {
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
    }
  };

  const selectedTires = Object.entries(selectedQuantities)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .filter(([_, qty]) => qty > 0)
    .map(([tireId, qty]) => {
      const tire = tires.find((t) => t.id === parseInt(tireId));
      return { tire, quantity: qty };
    });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Оформление заявки
          </DialogTitle>
        </DialogHeader>

        <StepIndicator currentStep={step} />

        {step === 1 && (
          <div className="mt-4">
            <div className="grid grid-cols-3 gap-4 mb-6">
              {cart &&
                cart.items.map((tire) => (
                  <ProductCard
                    handleRemoveFromCart={handleRemoveLiked}
                    key={tire.id}
                    tire={tire.Tier}
                    image={image.src}
                    setSelectedQuantities={setCart}
                    cart={cart}
                    token={token as string}
                    refreshCart={refreshCart}
                  />
                ))}
            </div>
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                ВЕРНУТЬСЯ К ТОВАРАМ
              </Button>
              <Button
                onClick={handleNextStep}
                className="bg-black text-white hover:bg-gray-800"
                disabled={cart.items.length === 0}
              >
                ПРОДОЛЖИТЬ
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="mt-4">
            <div className="grid grid-cols-1 gap-4 mb-6">
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Имя"
                required
              />
              <Input
                name="region"
                value={formData.region}
                onChange={handleInputChange}
                placeholder="Регион"
                required
              />
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Телефон"
                type="tel"
                required
              />
              <Input
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="E-mail"
                type="email"
                required
              />
              <Textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Сообщение"
                className="resize-none h-28"
              />
            </div>
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={handlePrevStep}>
                НАЗАД
              </Button>
              <Button
                onClick={handleNextStep}
                className="bg-black text-white hover:bg-gray-800"
                disabled={
                  !formData.name ||
                  !formData.phone ||
                  !formData.email ||
                  !formData.region
                }
              >
                ПРОДОЛЖИТЬ
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="mt-4">
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">Продукты</h3>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {cart.items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl p-4 shadow-sm border flex flex-col items-center"
                  >
                    <div className="w-24 h-24 relative mb-2">
                      <Image
                        src="/images/tyre1.png" // Use default tire image
                        alt={item.Tier.size}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="text-xs text-center font-medium mb-1">
                      {item.Tier.size}
                    </div>
                    <div className="text-xs text-center mb-2">
                      {item.quantity}шт
                    </div>
                  </div>
                ))}
              </div>

              <h3 className="text-lg font-medium mb-4">
                Контактная информация
              </h3>
              <div className="border rounded-xl p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm mb-2">
                      {formData.name || "Не указано"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm mb-2">
                      {formData.phone || "Не указано"}
                    </p>
                    <p className="text-sm">{formData.email || "Не указано"}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm mb-2">Регион</p>
                  <p className="text-sm mb-2">
                    {formData.region || "Не указано"}
                  </p>
                  <p className="text-sm mb-2">Сообщение</p>
                  <div className="border rounded p-4 h-20">
                    <p className="text-sm">
                      {formData.message || "Нет сообщения"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={handlePrevStep}>
                НАЗАД
              </Button>
              <Button
                onClick={handleNextStep}
                className="bg-black text-white hover:bg-gray-800"
              >
                ОТПРАВИТЬ
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
