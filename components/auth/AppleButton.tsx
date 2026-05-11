"use client";
import React from "react";
import { FaApple } from "react-icons/fa";

const AppleButton = () => {
  return (
    <button className="w-full shrink bg-card shadow-sm border border-border/50 rounded-full py-3 px-3 flex items-center justify-center gap-2 text-sm font-medium cursor-pointer hover:bg-accent/20 transition-colors duration-200 ease-in-out">
      <FaApple className="size-6" />
      Continue with Apple
    </button>
  );
};

export default AppleButton;
