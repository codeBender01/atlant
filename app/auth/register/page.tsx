"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function AuthRegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("/api/proxy/api/auth/register", {
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
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto px-4 py-8 w-full">
      <h1 className="text-2xl text-center font-semibold mb-5">
        Страница регистрации
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="max-w-8/12 mx-auto space-y-5">
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
          <Input
            type="password"
            placeholder="confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {error && <p className="text-red-500">{error}</p>}
          <Button
            type="submit"
            className="w-full cursor-pointer px-12 py-6 bg-black hover:bg-gray-800 text-white font-medium rounded-full"
            disabled={loading}
          >
            {loading ? "Загрузка..." : "Регистрация"}
          </Button>
        </div>
      </form>
    </div>
  );
}
