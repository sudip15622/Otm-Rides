"use client";
import React from "react";
import { FcGoogle } from "react-icons/fc";

interface GoogleButtonProps {
  returnTo?: string;
}

const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const GoogleButton = ({ returnTo = "/" }: GoogleButtonProps) => {
  const handleGoogleLogin = () => {
    // Build URL with store query parameter if returnTo is provided
    const url = new URL(`${BACKEND_API_URL}/auth/google/login`);
    if (returnTo) {
      url.searchParams.set("state", returnTo);
    }
    window.location.href = url.toString();
  };
  return (
    <button
      onClick={handleGoogleLogin}
      className="w-full shrink bg-card shadow-sm border border-border/50 rounded-full py-3 px-3 md:px-6 flex items-center justify-center gap-2 text-sm font-medium cursor-pointer hover:bg-accent/20 transition-colors duration-200 ease-in-out"
    >
      <FcGoogle className="size-6" />
      Continue with Google
    </button>
  );
};

export default GoogleButton;
