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
  // const pathname = usePathname();

  useEffect(() => {
    hasMounted.current = true;
  }, []);

  const mainPages = [
    {
      name: "Vehicles",
      link: "/vehicles",
      url: "/nav_vehicles.png",
    },
    {
      name: "About",
      link: "/about",
      url: "/nav_about1.png",
    },
    {
      name: "Contact",
      link: "/contact",
      url: "/nav_contact2.png",
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
            const isActive = page.link === "/vehicles";
            return (
              <Link
                key={index}
                href={page.link}
                className={cn(
                  "relative flex flex-col sm:flex-row gap-x-2 items-center text-xs sm:text-sm font-medium sm:font-semibold transition-colors duration-200 ease-in-out group",
                  isActive
                    ? "text-foreground"
                    : "text-foreground/80 hover:text-foreground",
                )}
              >
                <motion.div
                  className="relative w-10 h-10"
                  style={{ perspective: 700 }}
                  initial={{
                    rotateY: -90,
                    rotateX: 18,
                    opacity: 0,
                    scale: 0.9,
                  }}
                  animate={{ rotateY: 0, rotateX: 0, opacity: 1, scale: 1 }}
                  transition={{
                    delay: hasMounted.current ? 0 : 0.08 * index,
                    duration: 1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
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
                    loading="eager"
                    priority
                  />
                </motion.div>
                {page.name}
                {isActive && (
                  <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-secondary" />
                )}
              </Link>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NavigationBar;
