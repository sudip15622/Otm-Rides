// app/profile/page.tsx
import { Suspense } from "react";
import ProfileClient from "@/components/renting/profile/ProfileClient";

export const metadata = {
  title: "Profile",
};

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="animate-pulse">Loading...</div>}>
      <ProfileClient />
    </Suspense>
  );
}
