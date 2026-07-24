import FeaturesStep from "@/components/become-a-host/steps/FeaturesStep";
import React from "react";

const page = async ({ params }: { params: Promise<{ vehicleId: string }> }) => {
  const { vehicleId } = await params;
  return <FeaturesStep vehicleId={vehicleId} />;
};

export default page;
