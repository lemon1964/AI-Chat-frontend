import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    // NEXTAUTH_URL: "https://1cf6-68-183-33-71.ngrok-free.app", // или ваш домен
    // NEXTAUTH_URL: "http://localhost:3000", // или ваш домен
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
  images: {
    domains: ['localhost', 'api.together.ai', 'res.cloudinary.com', 'cloudinary.com', 'ai-chat-backend-3cba.onrender.com'],
  },
  reactStrictMode: false,
};

export default nextConfig;
