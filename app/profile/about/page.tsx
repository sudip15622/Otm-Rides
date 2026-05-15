// app/profile/page.tsx
import { Suspense } from "react";
import ProfileClient from "@/components/renting/profile/ProfileClient";

export const metadata = {
  title: "About Me",
};

export default function ProfilePage() {
  return (
    <div className="z-100 bg-card">
      <Suspense fallback={<div className="animate-pulse">Loading...</div>}>
        <ProfileClient />
      </Suspense>
    </div>
  );
}
