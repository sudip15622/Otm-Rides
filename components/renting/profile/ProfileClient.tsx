"use client";

import SummarySection from "./SummarySection";
import { FaRegBell } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { Hand, HelpCircle, LogOut, Settings, User2 } from "lucide-react";
import { FiChevronRight } from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import SwitchButton from "@/components/footer/SwitchButton";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";
import ProfileClientSkeleton from "./ProfileClientSkeleton";

const ACCOUNT_NAV_LINKS = [
  {
    name: "View Profile",
    link: "/profile/about",
    icon: User2,
  },
  {
    name: "Account Settings",
    link: "/account-settings",
    icon: Settings,
  },
  {
    name: "Privacy",
    link: "/account-settings/privacy",
    icon: Hand,
  },
  {
    name: "Get Help",
    link: "/help",
    icon: HelpCircle,
  },
];

export default function ProfileClient() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [logoutLoading, setlogoutLoading] = useState(false);

  if (loading) {
    return <ProfileClientSkeleton />;
  }

  if (!user) {
    router.push(`/login-signup?returnTo-${encodeURIComponent("/profile")}`);
    router.refresh();
    return <ProfileClientSkeleton />;
  }

  const performSignOut = async () => {
    setlogoutLoading(true);
    try {
      await logout();
    } finally {
      setlogoutLoading(false); // logout() redirects, but just in case
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6 w-full max-w-sm mx-auto pt-10 pb-30">
        {/* //fixed navigation with notification icon */}
        <SwitchButton />
        <div className="fixed z-10 w-full top-0 left-0 bg-card py-6 flex items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center justify-center md:hidden rounded-full bg-accent/50 p-3"
          >
            <FaArrowLeft className="size-4 text-foreground/80" />
          </Link>
          <button className="p-3 rounded-full bg-accent/50">
            <FaRegBell className="size-4 text-foreground/80" />
          </button>
        </div>
        <div className="flex items-center justify-between gapx-10">
          <h1 className="text-3xl font-bold">Profile</h1>
        </div>
        <div className="flex flex-col gap-4">
          {user && (
            <Link href="/profile/about">
              <SummarySection user={user} />
            </Link>
          )}

          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            <NavigationCard
              name="Past trips"
              link="/profile/past-trips"
              image="/past_trips.png"
            />
            <NavigationCard
              name="Reviews"
              link="/profile/reviews"
              image="/reviews_written.png"
            />
          </div>

          <Link
            href="/become-a-host"
            className="shrink-0 flex items-center rounded-2xl gap-4 w-full bg-card shadow-md border border-border/50 p-4"
          >
            <div className="relative w-12 h-15">
              <Image
                src="/hostgirl_profile.png"
                alt="become-a-host"
                fill
                sizes="48px"
                priority
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex flex-col">
              <h2 className="sm:text-lg text-base font-semibold">
                Become a host
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                It&apos;s easy to start hosting and earn extra income
              </p>
            </div>
          </Link>
        </div>

        <div className="flex flex-col gap-2">
          {ACCOUNT_NAV_LINKS.map((navlink, index) => {
            const { name, link, icon: Icon } = navlink;
            return (
              <Link
                key={`${name}-${index}`}
                href={link}
                className="flex items-center gap-5 justify-between my-2"
              >
                <div className="flex items-center gap-5 text-base text-foreground/80 font-medium">
                  <Icon className="size-5" />
                  {name}
                </div>
                <FiChevronRight className="size-5 text-muted-foreground" />
              </Link>
            );
          })}
        </div>

        <div className="w-full h-px bg-border" />

        <button
          onClick={performSignOut}
          disabled={loading}
          className="relative flex items-center gap-5 text-base text-foreground/80 font-medium cursor-pointer"
        >
          <LogOut className="size-5" />
          Log Out
          {logoutLoading && (
            <span className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-border border-t-foreground animate-spin" />
          )}
        </button>
      </div>
    </>
  );
}

interface NavigationCardProps {
  name: string;
  link: string;
  image: string;
}

function NavigationCard({ name, link, image }: NavigationCardProps) {
  return (
    <Link
      href={link}
      className="bg-card shrink-0 w-full border border-border/50 shadow-md rounded-2xl sm:p-6 p-3 flex flex-col items-center justify-center sm:gap-4 gap-2 text-center"
    >
      <div className="relative w-fit h-fit">
        <Image
          src={image}
          alt={name}
          width={80}
          height={80}
          loading="eager"
          className="w-12 h-12 sm:w-20 sm:h-20 object-cover"
        />
      </div>
      <div className="sm:text-lg text-base font-semibold">{name}</div>
    </Link>
  );
}
