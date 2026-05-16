"use client";
import Image from "next/image";
import Link from "next/link";
import DropDown from "./DropDown";
import { useNavbar } from "@/contexts/NavbarContext";
import NavCenter from "./NavCenter";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import NavbarSkeleton from "./NavbarSkeleton";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const nav = useNavbar();
  const { user, loading } = useAuth();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || loading) {
    return <NavbarSkeleton />;
  }

  // return <NavbarSkeleton />;

  return (
    <>
      <AnimatePresence>
        {nav.activeFilter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/25 pointer-events-none"
          />
        )}
      </AnimatePresence>
      <div
        ref={nav.wrapperRef}
        onMouseDown={(e) => e.stopPropagation()}
        // suppressHydrationWarning
        className={cn(
          "sticky z-50 top-0 w-full flex py-6 px-4 sm:px-8 md:px-12 lg:px-16 transition-all duration-300 shadow-sm",
          nav.openSearch
            ? "bg-background"
            : nav.activeFilter
              ? "bg-card"
              : "bg-card md:bg-background",
          nav.showFullNav ? (nav.openSearch ? "h-screen" : "h-44") : "h-24",
        )}
      >
        <nav className="relative w-full flex items-start justify-between gap-x-10">
          <Link
            href="/"
            className="hidden md:flex w-fit items-center gap-1 h-12"
          >
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
            <div className="hidden xl:flex font-semibold text-[22px] opacity-90 text-primary">
              otmrides
            </div>
          </Link>
          <NavCenter nav={nav} />
          <div className="hidden md:flex items-center gap-2 h-12">
            <Link
              href="/become-a-host"
              className="hidden xl:flex font-semibold text-sm py-2 px-4 rounded-full hover:bg-accent/50 transition-colors duration-200 ease-in-out"
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
                  width={40}
                  height={40}
                  loading="eager"
                  // priority
                  alt="user-avatar"
                  className="object-cover w-full h-full"
                />
              </Link>
            )}
            <DropDown user={user} />
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
