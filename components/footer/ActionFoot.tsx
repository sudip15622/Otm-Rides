"use client";
import { ElementType, useEffect, useRef, useState } from "react";
import { User2, Bike, LogIn, Heart, MessageCircle, Search } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import ActionFootSkeleton from "./ActionFootSkeleton";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const ActionFoot = () => {
  const { user, loading } = useAuth();
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollYRef = useRef(0);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const threshold = 8;

    const onScroll = () => {
      const currentY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;

      const atTop = currentY <= threshold;
      const atBottom = currentY + viewportHeight >= fullHeight - threshold;

      if (atTop || atBottom) {
        setIsVisible(true);
      } else if (currentY > lastScrollYRef.current + 2) {
        setIsVisible(false);
      } else if (currentY < lastScrollYRef.current - 2) {
        setIsVisible(true);
      }

      lastScrollYRef.current = currentY;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  if (!mounted || loading) {
    return <ActionFootSkeleton />;
  }

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 flex md:hidden items-center border-t bg-card px-2 py-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] will-change-transform transition-transform duration-320 ease-out ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <FootItem name="Explore" link="/" icon={Search} />
      <FootItem name="Wishlists" link="/wishlists" icon={Heart} />

      {user ? (
        <>
          <FootItem name="Trips" link="/trips" icon={Bike} />
          <FootItem
            name="Messages"
            link="/hosting/messages"
            icon={MessageCircle}
          />
          <FootItem name="Profile" link="/profile" icon={User2} />
        </>
      ) : (
        <FootItem name="Log in" link="/login-signup" icon={User2} />
      )}
    </div>
  );
};

interface FootItemInterface {
  name: string;
  link: string;
  icon: ElementType;
}

function FootItem({ name, link, icon: Icon }: FootItemInterface) {
  const pathname = usePathname();

  const isActive = pathname === link;
  return (
    <Link
      href={link}
      className={cn(
        "flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-md py-1 text-[10px] sm:text-[12px] transition-colors",
        isActive ? "text-primary" : "text-foreground/80",
      )}
    >
      <Icon className="size-5" />
      <span>{name}</span>
    </Link>
  );
}

export default ActionFoot;
