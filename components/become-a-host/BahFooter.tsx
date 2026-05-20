"use client";
import Link from "next/link";
import React from "react";

const BahFooter = () => {
  return (
    <footer className="fixed z-50 left-0 bottom-0 bg-card border-t border-border w-full py-6 px-4 sm:px-8 md:px-12 lg:px-16 flex sm:justify-end justify-center items-center">
      <Link
        href="/become-a-host"
        className="py-3 px-8 flex items-center justify-center w-full sm:w-fit text-base font-medium rounded-xl bg-primary text-primary-foreground hover:bg-primary/80 transition-colors duration-200 ease-in-out"
      >
        Get started
      </Link>
    </footer>
  );
};

export default BahFooter;
