"use client";
// NavCenter.tsx — owns activeFilter, delegates search draft to SearchBar
import { cn } from "@/lib/utils";
import { useNavbar } from "@/contexts/NavbarContext";
import NavigationBar from "./NavigationBar";
import SearchPanel from "./SearchPanel";

interface NavCenterProps {
  nav: ReturnType<typeof useNavbar>;
}

export default function NavCenter({ nav }: NavCenterProps) {
  return (
    <div
      //   suppressHydrationWarning
      className={cn(
        "absolute top-0 left-1/2 -translate-x-1/2 w-full flex flex-col items-center transition-all duration-300",
        nav.showFullNav ? "max-w-4xl" : "lg:max-w-md md:max-w-sm",
      )}
    >
      <NavigationBar
        showFullNav={nav.showFullNav}
        openSearch={nav.openSearch}
      />
      <SearchPanel
        activeFilter={nav.activeFilter}
        onFilterClick={nav.openFilter}
        onSearchSubmit={nav.closeAll}
        openSearch={nav.openSearch}
        onOpenSearch={nav.openMobileSearch}
        onCloseSearch={nav.closeAll}
        showFullNav={nav.showFullNav}
      />
    </div>
  );
}
