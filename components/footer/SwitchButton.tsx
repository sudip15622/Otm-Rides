"use client";
import Link from "next/link";
import React from "react";
import { HiOutlineSwitchVertical } from "react-icons/hi";

interface SwitchButtonProps {
  isHostPage?: boolean;
}

const SwitchButton = ({ isHostPage = false }: SwitchButtonProps) => {
  return (
    <div className="z-20 shrink-0 max-w-sm w-full fixed bottom-22 left-1/2 -translate-x-1/2 sm:px-8 px-4">
      <Link
        href={isHostPage ? "/" : "/hosting"}
        className="w-fit mx-auto py-3 px-6 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-full flex items-center gap-2 font-medium text-sm"
      >
        <HiOutlineSwitchVertical className="size-5" />
        {isHostPage ? "Switch to travelling" : "Switch to hosting"}
      </Link>
    </div>
  );
};

export default SwitchButton;
