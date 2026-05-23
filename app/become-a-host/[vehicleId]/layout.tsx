// app/become-a-host/[vehicleId]/layout.tsx
// import { HostingShell } from '@/components/become-a-host/hosting-shell'

export default function DraftLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { vehicleId: string };
}) {
  return (
    // <HostingShell vehicleId={params.vehicleId}>
    { children }
    // </HostingShell>
  );
}
