"use client";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function ResetPasswordPage() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    if (urlToken) {
      setToken(urlToken || "");
    }
  }, []);

  useEffect(() => {
    confirmPasswordValidation();
  }, [password, confirmPassword]);

  const confirmPasswordValidation = () => {
    if (password.length < 6) {
      setButtonDisabled(true);
      return false;
    }
    if (password !== confirmPassword) {
      setButtonDisabled(true);
      return false;
    }
    setButtonDisabled(false);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!confirmPasswordValidation()) return;

    try {
      setIsProcessing(true);
      const response = await axios.post("/api/users/resetpassword", {
        token,
        password,
      });
      toast.success("Password reset successful!");
      if (response.data.userType === "faculty") {
        router.push("/login");
      } else if (response.data.userType === "admin") {
        router.push("/adminLogin");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error resetting password");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (id === "password") {
      setPassword(value);
    } else if (id === "confirmPassword") {
      setConfirmPassword(value);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-800 to-gray-700 animate-gradient-x px-4">
      <Toaster position="bottom-center" />
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white"
      >
        <h1 className="mb-6 text-center text-3xl font-bold text-white">
          {isProcessing ? "Processing..." : "Reset Password"}
        </h1>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-white font-semibold mb-1"
          >
            New Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handleChange}
            placeholder="Enter new password"
            className="w-full px-4 py-2 rounded-lg bg-white/80 text-black border border-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-white"
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="confirmPassword"
            className="block text-white font-semibold mb-1"
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={handleChange}
            placeholder="Confirm new password"
            className="w-full px-4 py-2 rounded-lg bg-white/80 text-black border border-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-white"
          />
        </div>
        <button
          type="submit"
          className={`w-full bg-white text-black font-semibold py-3 rounded-lg shadow-md transition-all duration-300 ${
            buttonDisabled
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-black hover:text-white hover:shadow-lg"
          }`}
          disabled={buttonDisabled}
        >
          Reset Password
        </button>
        <div className="text-center mt-4">
          <Link
            href="/login"
            className="text-white underline hover:text-gray-300"
          >
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
}
