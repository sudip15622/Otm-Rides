import { HostingShell } from "@/components/become-a-host/HostingShell";

export default async function DraftLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ vehicleId: string }>;
}) {
  const { vehicleId } = await params;

  return <HostingShell vehicleId={vehicleId}>{children}</HostingShell>;
}
