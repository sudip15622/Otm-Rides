"use client";
import React from "react";
import { FcGoogle } from "react-icons/fc";

const GoogleButton = () => {
  return (
    <button className="w-full bg-card shadow-sm border border-border/50 rounded-full py-3 px-6 flex items-center justify-center gap-2 font-semibold cursor-pointer hover:bg-accent/20 transition-colors duration-200 ease-in-out">
      <FcGoogle className="size-6" />
      Continue with Google
    </button>
  );
};

export default GoogleButton;
