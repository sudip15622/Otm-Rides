import BahClient from "@/components/become-a-host/BahClient";
import React, { Suspense } from "react";

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BahClient />
    </Suspense>
  );
};

export default page;
