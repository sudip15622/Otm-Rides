"use client";
import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { usePathname } from "next/navigation";

export type FilterType = "location" | "dateRange" | "vehicleType" | null;

interface NavbarContextValue {
  wrapperRef: React.RefObject<HTMLDivElement | null>;
  isScrolled: boolean;
  isExpanded: boolean;
  activeFilter: FilterType;
  openSearch: boolean;
  showFullNav: boolean;
  isSVPage: boolean;
  openFilter: (filter: FilterType) => void;
  closeAll: () => void;
  openMobileSearch: () => void;
}

const NavbarContext = createContext<NavbarContextValue | null>(null);

export function NavbarProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>(null);
  const [openSearch, setOpenSearch] = useState(false);

  const isSVPage = pathname === "/search" || pathname.startsWith("/vehicles");

  useEffect(() => {
    setActiveFilter(null);
    setIsExpanded(false);
    setOpenSearch(false);
  }, [pathname]);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const scrolled = window.scrollY > 0;
      setIsScrolled((p) => (p === scrolled ? p : scrolled));
      if (!scrolled && !isSVPage) setIsExpanded((p) => (p ? false : p));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [isSVPage]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setActiveFilter(null);
        setIsExpanded(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const openFilter = useCallback((filter: FilterType) => {
    setIsExpanded(true);
    setActiveFilter(filter);
  }, []);

  const closeAll = useCallback(() => {
    setActiveFilter(null);
    setIsExpanded(false);
    setOpenSearch(false);
  }, []);

  const openMobileSearch = useCallback(() => {
    setIsExpanded(true);
    setOpenSearch(true);
    setActiveFilter("location");
  }, []);

  const showFullNav = isSVPage
    ? isExpanded || activeFilter !== null
    : !isScrolled || isExpanded || activeFilter !== null;

  return (
    <NavbarContext.Provider
      value={{
        wrapperRef,
        isScrolled,
        isExpanded,
        activeFilter,
        openSearch,
        showFullNav,
        isSVPage,
        openFilter,
        closeAll,
        openMobileSearch,
      }}
    >
      {children}
    </NavbarContext.Provider>
  );
}

export function useNavbar() {
  const ctx = useContext(NavbarContext);
  if (!ctx) throw new Error("useNavbar must be used inside NavbarProvider");
  return ctx;
}
