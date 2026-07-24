import BasicInfoForm from "@/components/become-a-host/steps/BasicInfoForm";
import React from "react";

const page = async ({ params }: { params: Promise<{ vehicleId: string }> }) => {
  const { vehicleId } = await params;
  return <BasicInfoForm vehicleId={vehicleId} />;
};

export default page;
