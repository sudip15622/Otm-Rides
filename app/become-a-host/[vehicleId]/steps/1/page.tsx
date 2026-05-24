import { Step1Form } from "@/components/become-a-host/steps/Step1Form";
import React, { Suspense } from "react";

const page = async ({ params }: { params: Promise<{ vehicleId: string }> }) => {
  const { vehicleId } = await params;

  return (
    <Suspense>
      <Step1Form vehicleId={vehicleId} />
    </Suspense>
  );
};

export default page;
