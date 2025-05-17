"use client";
import { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function LeaveApplication() {
  const [email, setEmail] = useState("");
  const [days, setDays] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !days || !message) {
      toast.error("Please fill all fields");
      return;
    }
    setIsSubmitting(true);
    try {
      await axios.post("/api/faculty/leaveApplication", {
        email,
        days,
        message,
      });
      toast.success("Leave application sent to admin!");
      setEmail("");
      setDays("");
      setMessage("");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to send leave application"
      );
    } finally {
      setIsSubmitting(false);
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
          Leave Application
        </h1>
        <div className="mb-4">
          <label
            className="block text-white font-semibold mb-1"
            htmlFor="email"
          >
            Your Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-2 rounded-lg bg-white/80 text-black border border-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-white"
          />
        </div>
        <div className="mb-4">
          <label className="block text-white font-semibold mb-1" htmlFor="days">
            Number of Days
          </label>
          <input
            type="number"
            id="days"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            min={1}
            placeholder="Enter number of leave days"
            className="w-full px-4 py-2 rounded-lg bg-white/80 text-black border border-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-white"
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-white font-semibold mb-1"
            htmlFor="message"
          >
            Compose Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            placeholder="Write your leave reason/message..."
            className="w-full px-4 py-2 rounded-lg bg-white/80 text-black border border-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-white resize-none"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-white text-black font-semibold py-3 rounded-lg shadow-md transition-all duration-300 ${
            isSubmitting
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-black hover:text-white hover:shadow-lg"
          }`}
        >
          {isSubmitting ? "Sending..." : "Submit Leave Application"}
        </button>
      </form>
    </div>
  );
}
