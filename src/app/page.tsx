"use client"; // needed if using hooks or Link in app router

import Link from "next/link";
import React from "react"; // <-- make sure this is imported

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-800 to-gray-700 animate-gradient-x text-white px-4">
      <style jsx global>{`
        @keyframes gradient-x {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient-x {
          background-size: 400% 400%;
          animation: gradient-x 10s ease infinite;
        }
      `}</style>

      <div className="text-center backdrop-blur-lg bg-white/10 p-10 rounded-3xl shadow-2xl border border-white space-y-8 w-full max-w-2xl">
        <h1 className="text-5xl md:text-6xl font-bold drop-shadow-lg">
          AGMR WORK DIARY
        </h1>

        <div className="flex flex-col md:flex-row justify-center gap-6">
          <Link href="/adminSignup">
            <button className="px-6 py-3 text-xl font-semibold rounded-xl bg-white text-black hover:bg-black hover:text-white transition-all duration-300 shadow-lg w-full md:w-auto">
              Admin
            </button>
          </Link>
          <Link href="/signup">
            <button className="px-6 py-3 text-xl font-semibold rounded-xl bg-white text-black hover:bg-black hover:text-white transition-all duration-300 shadow-lg w-full md:w-auto">
              Faculty
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
