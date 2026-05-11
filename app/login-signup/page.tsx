import AppleButton from "@/components/auth/AppleButton";
import GoogleButton from "@/components/auth/GoogleButton";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaArrowLeft } from "react-icons/fa6";

const Page = () => {
  return (
    <main className="relative mx-auto flex min-h-dvh w-full items-center justify-center bg-background/50 px-3 py-4 sm:px-8 sm:py-8 md:px-12 lg:px-16">
      <div className="mx-auto flex w-full max-w-6xl overflow-hidden rounded-3xl border border-border/50 bg-card shadow-xl sm:rounded-4xl sm:flex-row">
        <div className="relative hidden min-h-140 w-1/2 sm:flex lg:w-[60%]">
          <Image
            src="/login_cover.jpg"
            alt="login-cover"
            fill
            className="object-cover w-full h-full"
            sizes="400px"
            priority
          />
        </div>
        <div className="relative flex w-full flex-col items-center justify-start gap-5 px-4 pb-8 pt-14 sm:w-1/2 sm:justify-center sm:gap-6 sm:px-8 sm:py-8 lg:w-[40%] lg:px-16">
          <Link
            href="/"
            title="Go Back"
            className="absolute top-4 left-4 w-fit p-2 flex items-center justify-center rounded-full bg-accent/50 hover:bg-accent transition-colors duration-200 ease-in-out"
          >
            <FaArrowLeft className="size-4 text-foreground/70" />
          </Link>
          <Link
            href="/"
            title="Home"
            className="flex w-fit justify-center items-center"
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
          </Link>

          <div className="flex flex-col text-center gap-1">
            <h1 className="text-2xl font-extrabold">Welcome</h1>
            <p className="text-muted-foreground">Ride anything. Anywhere.</p>
          </div>

          <div className="flex w-full max-w-sm flex-col gap-4 sm:gap-6">
            <GoogleButton />
            <AppleButton />
          </div>

          <p className="max-w-sm text-center text-xs text-muted-foreground">
            By signing in, you agree to the otmrides Terms of Service and
            acknowledge the Privacy Notice.
          </p>
        </div>
      </div>
    </main>
  );
};

export default Page;
