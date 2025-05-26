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

  const token = useAuth();

  const getInCartProducts = async () => {
    const res = await axios.get<Cart>("/api/proxy/api/order/cart", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  };

  useEffect(() => {
    getInCartProducts().then((res) => {
      setOrderCount(res.items.length);
    });
  }, [token]);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col h-auto min-h-screen`}
      >
        <Header />
        {children}
        <Footer />
        <div className="fixed bottom-8 right-8">
          {orderCount > 0 && (
            <Button
              className="bg-black hover:bg-gray-800 text-white rounded-full px-8 py-3 font-medium text-lg"
              onClick={() => setIsModalOpen(true)}
            >
              ЗАЯВКА
              <span className="ml-2 bg-red-600 w-4 h-4 rounded-full flex items-center justify-center text-xs">
                {orderCount}
              </span>
            </Button>
          )}

          <TireOrderModal
            open={isModalOpen}
            onOpenChange={() => setIsModalOpen(!isModalOpen)}
          />
        </div>
        <ToastProvider />
      </body>
    </html>
  );
}
