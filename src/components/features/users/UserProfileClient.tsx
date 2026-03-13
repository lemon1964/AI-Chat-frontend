// src/components/features/users/UserProfileClient.tsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { AppDispatch } from "@store/store";
import "@styles/starry_sky_styles.css";
import { audioService } from "@services/audioService";
import apiClient from "@services/authClientService";
import Notification from "@features/common/Notification";
import { localizationService } from "@services/localizationService";
import { showNotification } from "@reducers/notificationReducer";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function UserProfileClient() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    audioService.playMusic("/music/track.mp3");
    return () => {
      audioService.stopMusic();
    };
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await apiClient.get(`${baseURL}/api/auth/get-user-data/`);
        setUserData(res.data);
        setName(res.data.name || "");
      } catch (err) {
        dispatch(showNotification(localizationService.get("ErrorFetchingProfile"), "error", 4));
        if (axios.isCancel(err) || (axios.isAxiosError(err) && err.response?.status === 401)) {
          await signOut({ callbackUrl: "/" });
        }
      }
    };

    fetchUserData();
  }, [router, dispatch]);

  useEffect(() => {
    if (userData?.name) {
      const isPromo = userData.name.toLowerCase() === "gudvin";
      localStorage.setItem("isPromoUser", JSON.stringify(isPromo));
    }
  }, [userData]);

  const updateName = async () => {
    if (!name.trim()) return;

    try {
      setSaving(true);
      const res = await apiClient.put(`${baseURL}/api/auth/update-name/`, { name });
      setUserData(prev => (prev ? { ...prev, name: res.data.name } : null));
      setEditingName(false);
    } catch (err) {
      console.error("Error updating name", err);
      if (axios.isCancel(err) || (axios.isAxiosError(err) && err.response?.status === 401)) {
        await signOut({ callbackUrl: "/" });
      }
    } finally {
      setSaving(false);
    }
  };

  if (!userData) {
    return <div className="p-8 bg-black">{localizationService.get("LoadingProfile")}</div>;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      <div id="stars" className="absolute inset-0"></div>
      <div id="stars2" className="absolute inset-0"></div>
      <div id="stars3" className="absolute inset-0"></div>
      <div />

      <div className="relative z-10 px-4 py-6 text-gray-200">
        <Notification />

        <div className="mt-8">
          <Link
            href="/"
            className="inline-block px-4 py-2 bg-indigo-600 bg-opacity-80 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            {localizationService.get("ToHome")}
          </Link>
        </div>

        <h1 className="mt-6 text-4xl font-extrabold text-white drop-shadow-lg">
          {localizationService.get("YourProfile")}
        </h1>

        <div className="mt-4 p-6 bg-opacity-50 rounded-2xl shadow-xl max-w-md">
        {/* <div className="mt-4 bg-gray-900 bg-opacity-50 p-6 rounded-2xl shadow-xl max-w-md"> */}
          <p>
            📧 <strong className="text-gray-100">Email:</strong> {userData.email}
          </p>

          <p className="mt-4">
            🧑 <strong className="text-gray-100">{localizationService.get("Name")}</strong>{" "}
            {editingName ? (
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                onBlur={updateName}
                onKeyDown={e => {
                  if (e.key === "Enter") updateName();
                  if (e.key === "Escape") {
                    setName(userData.name);
                    setEditingName(false);
                  }
                }}
                disabled={saving}
                className="px-2 py-1 border border-gray-700 rounded-lg bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                autoFocus
              />
            ) : (
              <span
                onClick={() => setEditingName(true)}
                className="underline cursor-pointer hover:text-indigo-300 transition"
                title={localizationService.get("ChangeName")}
              >
                {userData.name || localizationService.get("NotSpecified")}
              </span>
            )}
          </p>

          <p className="mt-4">
            🎯{" "}
            <strong className="text-gray-100">{localizationService.get("AskedQuestions")}</strong>{" "}
            {userData.quantity}
          </p>
        </div>
        <Link
          href="/payment"
          className="inline-block px-4 py-2 bg-purple-600 bg-opacity-80 text-white rounded-lg hover:bg-purple-700 transition"
        >
          {localizationService.get("payment")}
        </Link>
      </div>
    </div>
  );
}
