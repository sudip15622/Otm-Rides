import LocationStep from "@/components/become-a-host/steps/LocationStep";
import React from "react";

const page = async ({ params }: { params: Promise<{ vehicleId: string }> }) => {
  const { vehicleId } = await params;
  return <LocationStep vehicleId={vehicleId} />;
};

export default page;
