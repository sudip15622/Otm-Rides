"use client";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import RentingNavbarSkeleton from "./RentingNavbarSkeleton";
import DropDown from "../navbar/DropDown";

const RentingNavbar = () => {
  const { user, loading } = useAuth();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || loading) {
    return <RentingNavbarSkeleton />;
  }
  return (
    <div className="hidden md:flex sticky z-50 top-0 w-full py-6 px-4 sm:px-8 md:px-12 lg:px-16 transition-all duration-300 shadow-sm h-24">
      <nav className="relative w-full flex items-start justify-between gap-x-10">
        <Link href="/" className="flex w-fit items-center gap-1 h-12">
          <div className="relative w-10 h-10">
            <Image
              src="/otmrides1.png"
              alt="logo"
              fill
              sizes="48px"
              className="object-cover w-full h-full"
              priority
            />
          </div>
          <div className="flex font-semibold text-[22px] opacity-90 text-primary">
            otmrides
          </div>
        </Link>

        <div className="flex items-center gap-2 h-12">
          <Link
            href="/become-a-host"
            className="flex font-semibold text-sm py-2 px-4 rounded-full hover:bg-accent/50 transition-colors duration-200 ease-in-out"
          >
            Become a host
          </Link>
          {user && (
            <Link
              href="/profile"
              className="relative w-10 h-10 overflow-hidden rounded-full"
            >
              <Image
                src={user.avatar}
                fill
                sizes="40px"
                priority
                alt="user-avatar"
                className="object-cover w-full h-full"
              />
            </Link>
          )}
          <DropDown user={user} showSwitch={false} />
        </div>
      </nav>
    </div>
  );
};

export default RentingNavbar;
