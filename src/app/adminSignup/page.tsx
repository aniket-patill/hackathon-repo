"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function adminSignupPage() {
  const [user, setUser] = React.useState({
    username: "",
    email: "",
    password: "",
  });
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [buttonText, setButtonText] = React.useState(false);

  useEffect(() => {
    if (
      user.username.length > 0 &&
      user.email.length > 0 &&
      user.password.length > 0
    ) {
      setButtonText(true);
    } else {
      setButtonText(false);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user.username || !user.email || !user.password) {
      toast.error("All fields are required");
      return;
    }

    if (!user.email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }

    if (user.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    try {
      setIsLoading(true);
      const response = await axios.post("/api/users/adminSignup", user);
      // console.log("signup response", response.data);
      toast.success("Signup successful!");
      router.push("/adminLogin");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Signup failed");
      // console.log("signup failed", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-800 to-gray-700 animate-gradient-x px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white"
        >
          <h1 className="text-3xl font-bold text-white text-center mb-6">
            {isLoading ? "Processing..." : "Admin Signup"}
          </h1>

          <label
            htmlFor="username"
            className="block text-white font-semibold mb-1"
          >
            Username
          </label>
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Enter your username"
            value={user.username}
            onChange={handleChange}
            className="w-full mb-4 px-4 py-2 rounded-lg bg-white/80 text-black placeholder-gray-600 border border-white focus:outline-none focus:ring-2 focus:ring-white"
          />

          <label
            htmlFor="email"
            className="block text-white font-semibold mb-1"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="you@example.com"
            value={user.email}
            onChange={handleChange}
            className="w-full mb-4 px-4 py-2 rounded-lg bg-white/80 text-black placeholder-gray-600 border border-white focus:outline-none focus:ring-2 focus:ring-white"
          />

          <label
            htmlFor="password"
            className="block text-white font-semibold mb-1"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Enter your password"
            value={user.password}
            onChange={handleChange}
            className="w-full mb-6 px-4 py-2 rounded-lg bg-white/80 text-black placeholder-gray-600 border border-white focus:outline-none focus:ring-2 focus:ring-white"
          />

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-white text-black font-semibold py-3 rounded-lg shadow-md transition-all duration-300 ${
              isLoading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-black hover:text-white hover:shadow-lg"
            }`}
          >
            {buttonText ? "Signup" : "Fill Values Please"}
          </button>

          <p className="text-center text-white mt-4">
            Already have an account?{" "}
            <Link href="/adminLogin" className="underline hover:text-gray-300">
              Login here
            </Link>
          </p>
        </form>
      </div>

      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        }}
      />
    </>
  );
}
