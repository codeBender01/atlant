"use client";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/sections/Footer";
import Header from "@/sections/Header";
import ToastProvider from "@/components/shared/Toast";

import { Button } from "@/components/ui/button";
import TireOrderModal from "@/components/shared/tyreOrderModal";

import { useEffect, useState } from "react";
import { useAuth } from "@/shared/hooks/useAuth";

import { Cart } from "./types";

import axios from "axios";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderCount, setOrderCount] = useState(0);
  const { token } = useAuth();

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

  const updateCartCount = async () => {
    const cartData = await getInCartProducts();
    // Use itemCount if available, otherwise use items.length
    const count = cartData.itemCount || cartData.items.length;
    setOrderCount(count);
  };

  // Initial cart load when token changes
  useEffect(() => {
    if (token) {
      updateCartCount();
    } else {
      setOrderCount(0);
    }
  }, [token]);

  // Listen for cart updates
  useEffect(() => {
    const handleCartUpdate = async () => {
      if (token) {
        await updateCartCount();
        // Only open modal if there are items in cart
        const cartData = await getInCartProducts();
        if (cartData.items.length > 0) {
          setIsModalOpen(true);
        }
      }
    };

    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, [token]);

  // Close modal when cart becomes empty
  useEffect(() => {
    if (orderCount === 0 && isModalOpen) {
      setIsModalOpen(false);
    }
  }, [orderCount, isModalOpen]);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col h-auto min-h-screen`}
      >
        <Header />
        {children}
        <Footer />

        {/* Only show button when there are items in cart */}
        {orderCount > 0 && (
          <div className="fixed bottom-8 right-8">
            <Button
              className="bg-black hover:bg-gray-800 text-white rounded-full px-8 py-3 font-medium text-lg"
              onClick={() => setIsModalOpen(true)}
            >
              ЗАЯВКА
              <span className="ml-2 bg-red-600 w-4 h-4 rounded-full flex items-center justify-center text-xs">
                {orderCount}
              </span>
            </Button>
          </div>
        )}

        <TireOrderModal open={isModalOpen} onOpenChange={setIsModalOpen} />

        <ToastProvider />
      </body>
    </html>
  );
}
