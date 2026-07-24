import PhotosStep from "@/components/become-a-host/steps/PhotosStep";

const page = async ({ params }: { params: Promise<{ vehicleId: string }> }) => {
  const { vehicleId } = await params;
  return <PhotosStep vehicleId={vehicleId} />;
};

export default page;
