import PhotosStep from "@/components/become-a-host/steps/PhotosStep";
import PricingStep from "@/components/become-a-host/steps/PricingStep";

const page = async ({ params }: { params: Promise<{ vehicleId: string }> }) => {
  const { vehicleId } = await params;
  return <PricingStep vehicleId={vehicleId} />;
};

export default page;
