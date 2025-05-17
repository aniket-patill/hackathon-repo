"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function adminLoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user.email || !user.password) {
      toast.error("All fields are required");
      return;
    }

    try {
      setIsLoading(true);

      const response = await axios.post("/api/users/adminLogin", user);
      // console.log("login response", response.data);

      toast.success("Login successful!");
      // router.push(/profile/${response.data.user.username});
      router.push("/adminDashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-800 to-gray-700 animate-gradient-x px-4">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white">
          <h1 className="mb-6 text-center text-3xl font-bold text-white">
            {isLoading ? "Processing..." : "ADMIN LOGIN"}
          </h1>

          <form onSubmit={onLogin} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={user.email}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full rounded-lg border border-white bg-white/80 text-black px-4 py-2 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-white"
                placeholder="Enter your email"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white"
              >
                Password
              </label>
              <Link
                href="/forgotPassMail"
                className="text-sm text-gray-300 hover:underline transition duration-300"
              >
                <span className="hover:text-white">Forgot Password?</span>
              </Link>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={user.password}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full rounded-lg border border-white bg-white/80 text-black px-4 py-2 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-white"
                placeholder="Enter your password"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-white text-black font-semibold px-4 py-2 transition-colors hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>

            {/* Link to Signup */}
            <div className="text-center">
              <Link
                href="/signup"
                className="text-sm text-white hover:underline"
              >
                Don&apos;t have an account? Sign up
              </Link>
            </div>
          </form>
        </div>

        {/* Toast */}
        <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#333",
              color: "#fff",
              borderRadius: "10px",
            },
          }}
        />
      </div>
    </>
  );
}
