// import { Suspense } from "react";
import { Suspense } from "react";
import Navbar from "@/components/navbar/Navbar";
import NavbarWrapper from "@/components/navbar/NavbarWrapper";
import ActionFoot from "@/components/footer/ActionFoot";
import ActionFootSkeleton from "@/components/footer/ActionFootSkeleton";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full relative">
      <NavbarWrapper />
      <main className="w-full bg-card min-h-screen pt-12 mx-auto px-4 pb-30 md:pb-12 sm:px-8 md:px-12 lg:px-16">
        {children}
      </main>
      <Suspense fallback={<ActionFootSkeleton />}>
        <ActionFoot />
      </Suspense>
    </div>
  );
}
