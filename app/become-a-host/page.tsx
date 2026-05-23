import BahClient from "@/components/become-a-host/BahClient";
import BahClientSkeleton from "@/components/become-a-host/BahClientSkeleton";
import BahNavbar from "@/components/become-a-host/BahNavbar";
import React, { Suspense } from "react";

const page = () => {
  return (
    <div className="w-full relative">
      <BahNavbar />
      <main className="w-full bg-card min-h-[calc(100dvh-96px)] mx-auto px-4 pb-12 sm:px-8 md:px-12 lg:px-16">
        <Suspense fallback={<BahClientSkeleton />}></Suspense>
        <BahClient />
      </main>
    </div>
  );
};

export default page;
