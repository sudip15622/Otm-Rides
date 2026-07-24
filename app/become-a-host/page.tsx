import DraftSkeleton from "@/components/become-a-host/DraftSkeleton";
import LandingPage from "@/components/become-a-host/LandingPage";
import Image from "next/image";
import Link from "next/link";
import React, { Suspense } from "react";

const page = () => {
  return (
    <>
      <div className="w-full relative">
        {/* navbar */}
        <div className="flex items-center bg-card sticky z-50 top-0 w-full py-6 px-4 sm:px-8 md:px-12 lg:px-16 transition-colors duration-200 h-24">
          <nav className="relative w-full flex items-center justify-between gap-x-10">
            {/* logo with homepage link  */}
            <Link href="/" className="relative w-10 h-10 opacity-80">
              <Image
                src="/otmrides_black-01.png"
                alt="logo"
                fill
                sizes="48px"
                className="object-cover w-full h-full"
                priority
              />
            </Link>

            {/* exit button  */}
            <Link
              href="/hosting"
              className="py-2 px-4 rounded-full border border-border hover:border-secondary/80 hover:bg-accent/50 duration-200 transition-colors ease-in-out font-medium text-sm"
            >
              Exit
            </Link>
          </nav>
        </div>

        <Suspense fallback={<DraftSkeleton />}>
          <main className="w-full bg-card min-h-[calc(100dvh-96px)] mx-auto px-4 pb-12 sm:px-8 md:px-12 lg:px-16">
            <LandingPage />
          </main>
        </Suspense>
      </div>
    </>
  );
};

export default page;
