import FinishAndPublish from "@/components/become-a-host/stepandphases/FinishAndPublish";
import React from "react";

const page = async ({ params }: { params: Promise<{ vehicleId: string }> }) => {
  const { vehicleId } = await params;
  return <FinishAndPublish vehicleId={vehicleId} />;
};

export default page;
