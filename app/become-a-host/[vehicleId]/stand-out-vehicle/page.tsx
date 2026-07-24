import StandOutVehicle from "@/components/become-a-host/stepandphases/StandOutVehicle";
import React from "react";

const page = async ({ params }: { params: Promise<{ vehicleId: string }> }) => {
  const { vehicleId } = await params;
  return <StandOutVehicle vehicleId={vehicleId} />;
};

export default page;
