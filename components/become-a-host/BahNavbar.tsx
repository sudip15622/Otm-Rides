"use client";
import { cn } from "@/lib/utils";
import { HelpCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const BahNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={cn(
        "flex items-center bg-card sticky z-50 top-0 w-full py-6 px-4 sm:px-8 md:px-12 lg:px-16 transition-colors duration-200 h-24",
        isScrolled && "shadow-sm",
      )}
    >
      <nav className="relative w-full flex items-start justify-between gap-x-10">
        <Link href="/" className="relative w-10 h-10 opacity-80">
          <Image
            src="/otmrides_black-01.png"
            alt="logo"
            fill
            sizes="48px"
            className="object-cover w-full h-full"
            priority
          />
        </Link>

        <div className="flex items-center gap-2">
          {/* <Link
            href="/hosting"
            className="py-2 px-4 rounded-full border border-border hover:border-secondary/80 hover:bg-accent/50 duration-200 transition-colors ease-in-out font-medium text-sm flex items-center gap-2"
          >
            <HelpCircle className="size-4" />
            Get help
          </Link> */}
          <Link
            href="/hosting"
            className="py-2 px-4 rounded-full border border-border hover:border-secondary/80 hover:bg-accent/50 duration-200 transition-colors ease-in-out font-medium text-sm"
          >
            Exit
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default BahNavbar;
