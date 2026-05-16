import LoginClient from "@/components/auth/LoginClient";
import LoginSkeleton from "@/components/auth/LoginSkeleton";
import { Suspense } from "react";

const Page = () => {
  return (
    <main className="relative mx-auto flex min-h-dvh w-full items-center justify-center bg-background/50 px-3 py-4 sm:px-8 sm:py-8 md:px-12 lg:px-16">
      <Suspense fallback={<LoginSkeleton />}>
        <LoginClient />
      </Suspense>
    </main>
  );
};

export default Page;
