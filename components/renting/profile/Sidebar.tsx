"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const profileLinks = [
  {
    name: "About Me",
    link: "/profile",
    image: "/about_mee.png",
  },
  {
    name: "Past Trips",
    link: "/profile/past-trips",
    image: "/past_trips.png",
  },
  {
    name: "Reviews written",
    link: "/profile/reviews",
    image: "/reviews_written.png",
  },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-3xl font-bold tracking-tight mb-4">Profile</h1>

      {profileLinks.map(({ name, link, image }, index) => {
        const isActive = pathname === link;

        return (
          <Link
            href={link}
            key={`${name}-${index}`}
            aria-current={isActive ? "page" : undefined}
            className={`flex items-center font-medium gap-3 rounded-xl px-4 py-3 transition-colors ${
              isActive
                ? "bg-accent/50 text-accent-foreground"
                : "text-foreground hover:bg-background"
            }`}
          >
            <div className="relative w-8 h-8 overflow-hidden">
              <Image
                src={image}
                alt={name}
                width={32}
                height={32}
                className="object-cover w-full h-full"
              />
            </div>
            {name}
          </Link>
        );
      })}
    </div>
  );
};

export default Sidebar;
