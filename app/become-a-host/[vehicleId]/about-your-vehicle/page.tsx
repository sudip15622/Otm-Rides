import AboutYourVehicle from "@/components/become-a-host/stepandphases/AboutYourVehicle";
import React from "react";

const page = async ({ params }: { params: Promise<{ vehicleId: string }> }) => {
  const { vehicleId } = await params;
  return <AboutYourVehicle vehicleId={vehicleId} />;
};

export default page;
