"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [user, setUser] = React.useState({
    email: "",
    department: "",
    password: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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

      const response = await axios.post("/api/users/login", user);
      // console.log("login response", response.data);

      toast.success("Login successful!");
      // router.push(/profile/${response.data.user.username});
      router.push("/facultyDashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-800 to-gray-700 animate-gradient-x px-4">
      <div className="w-full max-w-md rounded-2xl bg-white/10 backdrop-blur-lg p-8 shadow-2xl border border-white">
        <h1 className="mb-6 text-center text-3xl font-bold text-white">
          {isLoading ? "Processing..." : "Faculty Login"}
        </h1>

        <form onSubmit={onLogin} className="space-y-6">
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
              className="w-full rounded-lg border border-white bg-white/80 p-2 text-black placeholder-gray-600 focus:border-white focus:outline-none"
              placeholder="Enter your email"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="department"
              className="block text-sm font-medium text-white"
            >
              Department
            </label>
            <select
              name="department"
              id="department"
              value={user.department}
              onChange={handleChange}
              className="w-full rounded-lg border border-white bg-white/80 p-2 text-black placeholder-gray-600 focus:border-white focus:outline-none"
            >
              <option value="">Select Department</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Electronics">Electronics</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Civil">Civil</option>
              <option value="Electrical">Electrical</option>
            </select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white"
            >
              Password
            </label>
            <div className="flex justify-between items-center">
              <Link
                href="/forgotPassMail"
                className="text-sm text-gray-300 hover:text-white hover:underline transition duration-300"
              >
                Forgot Password?
              </Link>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={user.password}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full rounded-lg border border-white bg-white/80 p-2 text-black placeholder-gray-600 focus:border-white focus:outline-none"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-white text-black font-semibold py-2 rounded-lg shadow-md transition-all duration-300 ${
              isLoading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-black hover:text-white hover:shadow-lg"
            }`}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>

          <div className="text-center">
            <Link href="/signup" className="text-sm text-white hover:underline">
              Don&apos;t have an account? Sign up
            </Link>
          </div>
        </form>
      </div>

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
  );
}
