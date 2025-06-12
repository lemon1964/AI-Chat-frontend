import React, { useState } from "react";
import axios from "axios";
// import apiClient from "@/utils/authClient";
import { signIn } from "next-auth/react";

type BaseFormProps = {
  type: "login" | "register";
  onClose: () => void;
};

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

const BaseForm: React.FC<BaseFormProps> = ({ type, onClose }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [resetMode, setResetMode] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (resetMode) {
      try {
        await axios.post(`${baseURL}/api/auth/password/reset/`, { email });
        alert("Password reset link sent to your email.");
        setResetMode(false);
      } catch {
        setError("Error sending password reset link.");
      }
      return;
    }

    if (type === "register" && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      if (type === "register") {
        await axios.post(`${baseURL}/api/auth/registration/`, {
          email,
          name,
          password1: password,
          password2: confirmPassword,
        });
        alert("Registration successful.");
      } else {
        const result = await signIn("credentials", { email, password, redirect: false });
        if (result?.error) {
          setError("Invalid email or password");
          return;
        }
      }
      onClose();
    } catch {
      setError(`Error during ${type}`);
    }
  };

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">
        {resetMode ? "Reset Password" : type === "register" ? "Register" : "Login"}
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-gray-500"
          />
        </div>
        {!resetMode && (
          <>
            <div>
              <label className="block text-sm font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-gray-500"
              />
            </div>
            {type === "register" && (
              <>
                <div>
                  <label className="block text-sm font-medium">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-gray-500"
                  />
                </div>
              </>
            )}
          </>
        )}
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {resetMode ? "Send Reset Link" : type === "register" ? "Register" : "Login"}
        </button>
      </form>
      {!resetMode && (
        <button
          onClick={() => setResetMode(true)}
          className="text-blue-500 hover:underline"
        >
          Forgot Password?
        </button>
      )}
      <button
        onClick={handleGoogleLogin}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Login with Google
      </button>
      <button
        onClick={onClose}
        className="text-gray-500 hover:underline"
      >
        Close
      </button>
    </div>
  );
};

export default BaseForm;
