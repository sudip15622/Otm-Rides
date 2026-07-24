import Overview from "@/components/become-a-host/stepandphases/Overview";
import React from "react";

const page = async ({ params }: { params: Promise<{ vehicleId: string }> }) => {
  const { vehicleId } = await params;
  return <Overview vehicleId={vehicleId} />;
};

export default page;
