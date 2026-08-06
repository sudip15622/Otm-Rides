import SubmittedStep from "@/components/become-a-host/stepandphases/SubmittedStep";
import React from "react";

const page = async ({ params }: { params: Promise<{ vehicleId: string }> }) => {
  const { vehicleId } = await params;
  return <SubmittedStep vehicleId={vehicleId} />;
};

export default page;
