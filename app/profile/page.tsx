"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import axios from "axios";
import { User } from "../types";

export default function ProfileSettings() {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };
  const formData = new FormData();
  const [token, setToken] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<User>({
    avatar: "",
    company: "",
    createdAt: "",
    email: "",
    id: 0,
    lastname: "",
    name: "",
    password: "",
    phone_number: "",
    region: "",
    updatedAt: "",
  });

  const handleSave = async () => {
    formData.append("avatar", selectedFile);
    formData.append("name", user.name);
    formData.append("lastname", user.lastname);
    formData.append("email", user.email);
    formData.append("password", user.password);
    formData.append("phone_number", user.phone_number);
    formData.append("region", user.region);
    formData.append("company", user.company);

    const res = await axios
      .put<User>("/api/proxy/api/profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data) {
          setUser(res.data);
        }
      });
  };

  const getUserProfile = async () => {
    if (!token) return;

    const res = await axios.get<User>("/api/proxy/api/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  };

  useEffect(() => {
    const token = localStorage.getItem("atoken");
    setToken(token);
  }, [user]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file) {
        if (!file.type.startsWith("image/")) {
          alert("Пожалуйста, выберите изображение");
          return;
        }

        // Validate file size (e.g., max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert("Размер файла не должен превышать 5MB");
          return;
        }

        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
        setSelectedFile(file);
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Function to delete photo
  const handleDeletePhoto = () => {
    setImagePreview("https://github.com/shadcn.png");
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    getUserProfile().then((res) => {
      if (res) {
        setUser({
          avatar: res.avatar ? res.avatar : "",
          company: res.company ? res.company : "",
          createdAt: "",
          email: res.email,
          id: 0,
          lastname: res.lastname ? res.lastname : "",
          name: res.name ? res.name : "",
          password: "",
          phone_number: res.phone_number ? res.phone_number : "",
          region: res.region ? res.region : "",
          updatedAt: "",
        });
        setImagePreview(res.avatar);
      }
    });
  }, [token]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-10">Настройки профиля</h1>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex flex-col items-center">
          <div className="w-64 h-64 rounded-full bg-gray-300 mb-6 overflow-hidden">
            <div className="w-full h-full">
              <img
                src={imagePreview}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />

          <Button
            onClick={triggerFileInput}
            className="w-full mb-3 bg-black hover:bg-gray-800 text-white font-medium py-3"
          >
            ЗАГРУЗИТЬ ФОТО
          </Button>
        </div>

        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Input
              type="text"
              name="name"
              placeholder="Имя"
              value={user.name}
              onChange={handleChange}
              className="py-6 bg-gray-100 rounded-md"
            />

            <Input
              type="text"
              name="lastname"
              placeholder="Фамилия"
              value={user.lastname}
              onChange={handleChange}
              className="py-6 bg-gray-100 rounded-md"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Input
              type="tel"
              name="phone_number"
              placeholder="+79999999999"
              value={user.phone_number}
              onChange={handleChange}
              className="py-6 bg-gray-100 rounded-md"
            />

            <Input
              type="email"
              name="email"
              placeholder="gennady@mail.ru"
              value={user.email}
              onChange={handleChange}
              className="py-6 bg-gray-100 rounded-md"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            <Input
              type="text"
              name="region"
              placeholder="Москва"
              value={user.region}
              onChange={handleChange}
              className="py-6 bg-gray-100 rounded-md"
            />

            <Input
              type="text"
              name="company"
              placeholder="Название компании"
              value={user.company}
              onChange={handleChange}
              className="py-6 bg-gray-100 rounded-md"
            />
          </div>

          <h2 className="text-2xl font-bold mb-4">Сменить пароль</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            <div>
              <p className="block mb-2">Новый пароль</p>
              <Input
                type="password"
                name="password"
                placeholder=""
                onChange={handleChange}
                className="py-6 bg-gray-100 rounded-md"
              />
            </div>

            <div>
              <p className="block mb-2">Повторите пароль</p>
              <Input
                type="password"
                name="confirmPassword"
                placeholder=""
                className="py-6 bg-gray-100 rounded-md"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              onClick={handleSave}
              className="px-12 py-6 bg-black hover:bg-gray-800 text-white font-medium rounded-full"
            >
              СОХРАНИТЬ ИЗМЕНЕНИЯ
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
