"use client";
import { useEffect, useRef, useState, type ElementType } from "react";
import {
  LogIn,
  Menu,
  Heart,
  User2,
  HelpCircle,
  Bike,
  Settings,
  LogOut,
  Search,
} from "lucide-react";
import { HiOutlineSwitchVertical } from "react-icons/hi";
import Link from "next/link";
import Image from "next/image";
import { User } from "@/types/types";
import { useAuth } from "@/contexts/AuthContext";

interface DropDownProps {
  user: User | null;
  showSwitch?: boolean;
}

interface DropDownItemProps {
  name: string;
  link: string;
  icon: ElementType;
}

const DropDown = ({ user, showSwitch = true }: DropDownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const { logout } = useAuth(); // ← pull logout from context

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, []);

  const performSignOut = async () => {
    setLoading(true);
    try {
      await logout();
    } finally {
      setLoading(false); // logout() redirects, but just in case
    }
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-label="Open navigation menu"
        className="w-10 h-10 flex items-center justify-center rounded-full cursor-pointer bg-accent/50 hover:bg-accent duration-200 transition-colors ease-in-out"
      >
        <Menu className="size-5" />
      </button>

      {isOpen ? (
        <div className="absolute top-12 right-0 min-w-60 rounded-2xl border border-border/40 bg-background py-2 shadow-xl max-h-[calc(100dvh-6.3rem)] overflow-y-auto">
          {user && (
            <>
              {!user.isHost && showSwitch && (
                <div className="xl:hidden">
                  <DropDownItem
                    name="Switch to hosting"
                    link="/hosting"
                    icon={HiOutlineSwitchVertical}
                  />
                  <div className="w-full h-px bg-border my-2" />
                </div>
              )}
              <DropDownItem name="Trips" link="/trips" icon={Bike} />
              <DropDownItem name="Profile" link="/profile" icon={User2} />
            </>
          )}
          {/* <DropDownItem name="Explore" link="/search" icon={Search} /> */}
          <DropDownItem name="Wishlists" link="/wishlists" icon={Heart} />
          {user && (
            <>
              <div className="w-full h-px bg-border my-2" />
              <DropDownItem
                name="Account Settings"
                link="/account-settings"
                icon={Settings}
              />
            </>
          )}
          <DropDownItem name="Help Center" link="/search" icon={HelpCircle} />
          <div className="w-full h-px bg-border my-2" />
          <Link
            href="/become-a-host"
            className="flex items-center justify-between gap-4 w-full py-2 px-4 hover:bg-accent/50 transition-colors duration-200 ease-in-out"
          >
            <div className="flex flex-col">
              <h2 className="font-medium text-sm">Become a host</h2>
              <p className="text-xs text-muted-foreground">
                It&apos;s easy to start hosting and earn extra income
              </p>
            </div>
            <div className="relative w-6 h-10 overflow-visible">
              <span
                aria-hidden
                className="pointer-events-none absolute bottom-0 left-1/2 h-1 w-4 -translate-x-1/2 rounded-full bg-black/25 blur-[1.5px]"
              />
              <div className="relative w-full h-full overflow-hidden">
                <Image
                  src="/hostgirl.png"
                  alt="become-a-host"
                  fill
                  sizes="30px"
                  priority
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </Link>
          <div className="w-full h-px bg-border my-2" />
          {user ? (
            <button
              onClick={performSignOut}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium hover:bg-accent/50 transition-colors duration-200 ease-in-out w-full cursor-pointer relative disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <LogOut className="size-4 shrink-0" />
              Log out
              {loading && (
                <span className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-border border-t-foreground animate-spin" />
              )}
            </button>
          ) : (
            <DropDownItem
              name="Login / Signup"
              link="/login-signup"
              icon={LogIn}
            />
          )}
        </div>
      ) : null}
    </div>
  );
};

function DropDownItem({ name, link, icon: Icon }: DropDownItemProps) {
  return (
    <Link
      href={link}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium hover:bg-accent/50 transition-colors duration-200 ease-in-out"
    >
      <Icon className="size-4 shrink-0" />
      <span>{name}</span>
    </Link>
  );
}

export default DropDown;
