import { NavbarProvider } from "@/contexts/NavbarContext";
import { SearchDraftProvider } from "@/contexts/SearchDraftContext";
import React, { Suspense } from "react";
import Link from "next/link";
import Navbar from "./Navbar";
import NavbarSkeleton from "./NavbarSkeleton";

const NavbarWrapper = () => {
  return (
    <NavbarProvider>
      <Suspense fallback={<NavbarSkeleton />}>
        <SearchDraftProvider>
          <Navbar />
        </SearchDraftProvider>
      </Suspense>
    </NavbarProvider>
  );
};

export default NavbarWrapper;
