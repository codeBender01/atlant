"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";

export default function AuthLoginPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("/api/proxy/api/auth/login", {
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem("atoken", response.data.token);

        // Dispatch custom event to notify other components
        window.dispatchEvent(new Event("tokenUpdated"));

        // Small delay to ensure the event is processed
        setTimeout(() => {
          router.push("/");
        }, 100);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 w-full">
      <h1 className="text-2xl text-center font-semibold mb-5">
        Страница входа
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="max-w-3/12 mx-auto space-y-5">
          <Input
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-red-500">{error}</p>}
          <Button
            type="submit"
            className="w-full cursor-pointer px-12 py-6 bg-black hover:bg-gray-800 text-white font-medium rounded-full"
            disabled={loading}
          >
            {loading ? "Загрузка..." : "Вход"}
          </Button>
        </div>
      </form>
    </div>
  );
}
