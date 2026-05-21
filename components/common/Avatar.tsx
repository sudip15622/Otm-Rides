"use client";
import { User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface AvatarProps {
  url: string;
}

const Avatar = ({ url }: AvatarProps) => {
  return (
    <Link
      href="/profile"
      className="relative w-10 h-10 overflow-hidden rounded-full"
    >
      {url ? (
        <Image
          src={url}
          width={40}
          height={40}
          priority
          alt="user-avatar"
          className="object-cover w-auto h-auto"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <User className="size-6" />
        </div>
      )}
    </Link>
  );
};

export default Avatar;
