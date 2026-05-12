import LoginClient from "@/components/auth/LoginClient";

const Page = () => {
  return (
    <main className="relative mx-auto flex min-h-dvh w-full items-center justify-center bg-background/50 px-3 py-4 sm:px-8 sm:py-8 md:px-12 lg:px-16">
      <LoginClient />
    </main>
  );
};

export default Page;
