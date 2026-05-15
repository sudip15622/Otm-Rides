import ActionFoot from "@/components/footer/ActionFoot";
import Sidebar from "@/components/renting/profile/Sidebar";
import RentingNavbar from "@/components/renting/RentingNavbar";
import { redirect } from "next/navigation";

export default async function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full relative">
      <RentingNavbar />

      <div className="bg-card w-full md:h-[calc(100vh-96px)] lg:overflow-hidden">
        <div className="mx-auto flex h-full w-full">
          <aside className="hidden md:block w-full max-w-xs lg:max-w-md xl:max-w-xl shrink-0 border-r border-border py-12 h-full overflow-y-auto px-12 lg:px-24 xl:px-32">
            <Sidebar />
          </aside>

          <main className="min-w-0 flex-1 pt-24 md:pt-12 px-4 sm:px-8 md:px-12 lg:px-24 xl:px-32 overflow-y-auto md:pb-12 pb-30">
            {children}
          </main>
        </div>
      </div>

      <ActionFoot />
    </div>
  );
}
