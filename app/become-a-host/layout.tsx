import BahNavbar from "@/components/become-a-host/BahNavbar";

export default async function BahLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full relative">
      <BahNavbar />
      <main className="w-full bg-card min-h-[calc(100dvh-96px)] mx-auto px-4 pb-12 sm:px-8 md:px-12 lg:px-16">
        {children}
      </main>
    </div>
  );
}
