"use client";
import React from "react";
import { FaFacebook } from "react-icons/fa";

const FacebookButton = () => {
  return (
    <button className="w-full bg-card shadow-sm border border-border/50 rounded-full py-3 px-6 flex items-center justify-center gap-2 font-semibold cursor-pointer hover:bg-accent/20 transition-colors duration-200 ease-in-out">
      <FaFacebook className="size-6" />
      Continue with Facebook
    </button>
  );
};

export default FacebookButton;
