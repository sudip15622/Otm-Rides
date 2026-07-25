import PhotosStep from "@/components/become-a-host/steps/PhotosStep";

const page = async ({ params }: { params: Promise<{ vehicleId: string }> }) => {
  const { vehicleId } = await params;
  return <div>This is pricing page.</div>;
};

export default page;
