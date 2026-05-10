import FacebookButton from "@/components/auth/FacebookButton";
import GoogleButton from "@/components/auth/GoogleButton";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <main className="relative w-full min-h-screen mx-auto px-4 sm:px-8 md:px-12 lg:px-16">
      <Image
        src="/login_cover.png"
        alt="login-cover"
        fill
        className="object-cover"
        sizes="1400px"
        priority
      />

      <div className="relative z-10 pt-24 w-1/2 h-screen ml-auto">
        {/* Page content goes here (overlayed above the background image) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm m-auto bg-card rounded-4xl border border-border p-8 flex flex-col items-center gap-8">
          <Link href="/" className="flex w-fit justify-center items-center">
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

          <div className="flex flex-col gap-6 w-full">
            <GoogleButton />
            <FacebookButton />
          </div>

          <p className="text-muted-foreground text-xs text-center">
            By clicking the Sign In buttons above, you agree to the otmrides
            Terms of Service and acknowledge the Privacy Notice.
          </p>
        </div>
      </div>
    </main>
  );
};

export default page;
