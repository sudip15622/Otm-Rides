import SpecificationForm from "@/components/become-a-host/steps/SpecificationForm";

const page = async ({ params }: { params: Promise<{ vehicleId: string }> }) => {
  const { vehicleId } = await params;
  return <SpecificationForm vehicleId={vehicleId} />;
};

export default page;
