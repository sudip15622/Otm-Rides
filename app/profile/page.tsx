// app/profile/page.tsx
import { Suspense } from "react";
import ProfileClient from "@/components/renting/profile/ProfileClient";
import AboutMe from "@/components/renting/profile/AboutMe";
import ActionFoot from "@/components/footer/ActionFoot";

export const metadata = {
  title: "Profile",
};

export default function ProfilePage() {
  return (
    <>
      <div className="md:hidden">
        <Suspense fallback={<div className="animate-pulse">Loading...</div>}>
          <ProfileClient />
        </Suspense>
      </div>
      <div className="hidden md:block">
        <Suspense fallback={<div className="animate-pulse">Loading...</div>}>
          <AboutMe />
        </Suspense>
      </div>
      <ActionFoot />
    </>
  );
}
