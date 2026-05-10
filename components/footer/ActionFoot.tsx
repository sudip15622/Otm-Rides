"use client";
import { useEffect, useRef, useState } from "react";
import { CircleHelp, User2, Bike, Settings } from "lucide-react";
import { IoSearch } from "react-icons/io5";
import Link from "next/link";
import { FaPerson } from "react-icons/fa6";
import { MdOutlineCameraswitch } from "react-icons/md";
import { User } from "@/lib/types/types";

interface ActionFootProps {
  user: User | null;
}

const ActionFoot = ({ user }: ActionFootProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollYRef = useRef(0);

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

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 flex md:hidden items-center border-t bg-card px-2 py-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] will-change-transform transition-transform duration-320 ease-out ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <Link
        href="/search"
        className="flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-md py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <IoSearch className="size-5 text-muted-foreground" />
        <span>Explore</span>
      </Link>

      {user ? (
        <Link
          href="/trips"
          className="flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-md py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <Bike className="size-5 text-muted-foreground" />
          <span>Trips</span>
        </Link>
      ) : (
        <Link
          href="/help"
          className="flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-md py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <CircleHelp className="size-5 text-muted-foreground" />
          <span>Help</span>
        </Link>
      )}

      {user?.isHost ? (
        <Link
          href="/hosting"
          className="flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-md py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <MdOutlineCameraswitch className="size-5 text-muted-foreground" />
          <span>Switch</span>
        </Link>
      ) : (
        <Link
          href="/become-a-host"
          className="flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-md py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <FaPerson className="size-5 text-muted-foreground" />
          <span>Host</span>
        </Link>
      )}

      {user ? (
        <Link
          href="/profile"
          className="flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-md py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <User2 className="size-5 text-muted-foreground" />
          <span>Profile</span>
        </Link>
      ) : (
        <Link
          href="/login-signup"
          className="flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-md py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <User2 className="size-5 text-muted-foreground" />
          <span>Login</span>
        </Link>
      )}
    </div>
  );
};

export default ActionFoot;
