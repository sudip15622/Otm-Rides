"use client";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "@/contexts/AuthContext";

interface GoogleButtonProps {
  returnTo?: string;
}

const GoogleButton = ({ returnTo = "/" }: GoogleButtonProps) => {
  const { loginWithGoogle } = useAuth();

  return (
    <button
      onClick={() => loginWithGoogle(returnTo)}
      className="w-full shrink bg-card shadow-sm border border-border/50 rounded-2xl py-3 px-3 md:px-6 flex items-center justify-center gap-2 text-sm font-medium cursor-pointer hover:bg-accent/20 transition-colors duration-200 ease-in-out"
    >
      <FcGoogle className="size-6" />
      Continue with Google
    </button>
  );
};

export default GoogleButton;
