import { Step2Form } from "@/components/become-a-host/steps/Step2Form";
import React, { Suspense } from "react";

const page = async ({ params }: { params: Promise<{ vehicleId: string }> }) => {
  const { vehicleId } = await params;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Step2Form vehicleId={vehicleId} />
    </Suspense>
  );
};

export default page;
