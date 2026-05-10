"use client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

interface MainPagesProps {
  showFullNav: boolean;
  openSearch?: boolean;
}

const NavigationBar = ({ showFullNav, openSearch }: MainPagesProps) => {
  const hasMounted = useRef(false);
  const pathname = usePathname();

  useEffect(() => {
    hasMounted.current = true;
  }, []);

  const mainPages = [
    {
      name: "Vehicles",
      link: "/",
      url: "/scooter_logo.png",
    },
    {
      name: "About",
      link: "/about",
      url: "/about_logo.png",
    },
    {
      name: "Contact",
      link: "/contact",
      url: "/contact_logo.png",
    },
  ];
  return (
    <AnimatePresence>
      {showFullNav && (
        <motion.div
          className={cn(
            "flex items-center w-full sm:gap-x-10 md:w-auto sm:px-8 md:px-0",
            !openSearch
              ? "justify-between gap-x-5 px-4"
              : "gap-x-10 px-0 justify-start",
          )}
          initial={
            hasMounted.current
              ? { opacity: 0, height: 0, marginBottom: 0, y: -8 }
              : false
          }
          animate={{
            opacity: 1,
            height: 48,
            marginBottom: 20,
            y: 0,
          }}
          exit={{ opacity: 0, height: 0, marginBottom: 0, y: -8 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            mass: 0.8,
          }}
        >
          {mainPages.map((page, index) => {
            const isActive = pathname === page.link;
            return (
              <Link
                key={index}
                href={page.link}
                className={cn(
                  "flex flex-col sm:flex-row gap-x-2 items-center text-xs sm:text-sm font-medium sm:font-semibold transition-colors duration-200 ease-in-out group",
                  isActive
                    ? "border-b-2 border-secondary text-foreground"
                    : "text-foreground/80 hover:text-foreground",
                )}
              >
                <div className="relative w-8 h-8 sm:w-10 sm:h-10">
                  <Image
                    className={cn(
                      "object-cover w-full h-full",
                      !isActive &&
                        "group-hover:scale-105 transition-all duration-200 ease-in-out",
                    )}
                    src={page.url}
                    alt={page.name}
                    fill
                    sizes="40px"
                    priority
                  />
                </div>
                {page.name}
              </Link>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NavigationBar;
