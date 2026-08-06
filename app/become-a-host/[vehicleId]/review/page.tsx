import ReviewStep from "@/components/become-a-host/steps/ReviewStep";

const page = async ({ params }: { params: Promise<{ vehicleId: string }> }) => {
  const { vehicleId } = await params;
  return <ReviewStep vehicleId={vehicleId} />;
};

export default page;
