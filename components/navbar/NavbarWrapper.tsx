import { NavbarProvider } from "@/contexts/NavbarContext";
import { SearchDraftProvider } from "@/contexts/SearchDraftContext";
import React, { Suspense } from "react";
import Link from "next/link";
import Navbar from "./Navbar";

const NavbarWrapper = () => {
  return (
    <NavbarProvider>
      <Suspense>
        <SearchDraftProvider>
          <Navbar />
        </SearchDraftProvider>
      </Suspense>
    </NavbarProvider>
  );
};

export default NavbarWrapper;
