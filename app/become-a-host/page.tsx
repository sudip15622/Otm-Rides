import BahClient from "@/components/become-a-host/BahClient";
import BahNavbar from "@/components/become-a-host/BahNavbar";
import React, { Suspense } from "react";

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="w-full relative">
        <BahNavbar />
        <main className="w-full bg-card min-h-[calc(100dvh-96px)] mx-auto px-4 pb-12 sm:px-8 md:px-12 lg:px-16">
          <BahClient />
        </main>
      </div>
    </Suspense>
  );
};

export default page;
