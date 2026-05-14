"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { IoSearch } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { FaMapMarkerAlt, FaMotorcycle } from "react-icons/fa";
import { IoIosAlarm } from "react-icons/io";
import { GiFullMotorcycleHelmet } from "react-icons/gi";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { useSearchDraft } from "@/contexts/SearchDraftContext";
import { type FilterType } from "@/contexts/NavbarContext";
import { Check, Navigation, Search } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";

// ─── Types ────────────────────────────────────────────────────────────────────

type VehicleType = "Bike" | "Scooter";

// ─── Constants ────────────────────────────────────────────────────────────────

const NEPAL_LOCATIONS = [
  {
    name: "Kathmandu",
    desc: "Widest selection of bikes & scooters",
    bg: "#FEF3C7",
    emoji: "🏛",
  },
  {
    name: "Pokhara",
    desc: "Explore lakeside & mountain trails",
    bg: "#DBEAFE",
    emoji: "⛰",
  },
  {
    name: "Chitwan",
    desc: "Ride through jungle roads & resorts",
    bg: "#D1FAE5",
    emoji: "🌿",
  },
  {
    name: "Lumbini",
    desc: "Cruise the peaceful southern plains",
    bg: "#EDE9FE",
    emoji: "🕌",
  },
  {
    name: "Nagarkot",
    desc: "Hill roads with Himalayan views",
    bg: "#FCE7F3",
    emoji: "🌄",
  },
  {
    name: "Bandipur",
    desc: "Scenic winding roads up the hills",
    bg: "#FEF9C3",
    emoji: "🏘",
  },
  {
    name: "Mustang",
    desc: "Off-road adventure in the high desert",
    bg: "#FFE4E6",
    emoji: "🏜",
  },
  {
    name: "Ilam",
    desc: "Tea garden routes in eastern Nepal",
    bg: "#DCFCE7",
    emoji: "🍃",
  },
];

const VEHICLE_TYPES = [
  {
    value: "Bike" as VehicleType,
    label: "Bike",
    image: "/type_bike.png",
    desc: "Motorcycle & sport bikes",
  },
  {
    value: "Scooter" as VehicleType,
    label: "Scooter",
    image: "/type_scooter.png",
    desc: "Electric & city scooters",
  },
] as const;

// ─── Props ────────────────────────────────────────────────────────────────────

interface SearchPanelProps {
  activeFilter: FilterType;
  onFilterClick: (filter: FilterType) => void;
  onSearchSubmit: () => void;
  openSearch: boolean;
  onOpenSearch: () => void;
  onCloseSearch: () => void;
  showFullNav: boolean;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface LocationContentProps {
  location: string;
  onSelect: (loc: string) => void;
}
function LocationContent({ location, onSelect }: LocationContentProps) {
  return (
    <div className="overflow-y-auto max-h-60 md:max-h-full">
      {/* Search input */}
      <div className="relative mb-4">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          value={location}
          onChange={(e) => onSelect(e.target.value)}
          placeholder="Search locations"
          className="pl-10 h-12 text-sm rounded-xl border-border focus-visible:ring-0 focus-visible:border-foreground"
        />
      </div>

      <div className="h-px bg-border my-2" />

      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2 px-0.5">
        Suggested in Nepal
      </p>

      <ul className="flex flex-col gap-0.5">
        {NEPAL_LOCATIONS.map((loc, index) => (
          <li
            key={`${loc}-${index}`}
            onClick={() => {
              onSelect(loc.name);
            }}
            className="flex items-center gap-3.5 px-3 py-2.5 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
          >
            <div
              className="size-11 rounded-lg flex items-center justify-center shrink-0 text-xl"
              style={{ background: loc.bg }}
            >
              {loc.emoji}
            </div>
            <div>
              <p className="text-sm font-medium">{loc.name}</p>
              <p className="text-xs text-muted-foreground">{loc.desc}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface DateContentProps {
  dateRange?: DateRange;
  onDateChange: (date: Date | undefined) => void;
  numMonths?: number;
}
function DateContent({
  dateRange,
  onDateChange,
  numMonths = 2,
}: DateContentProps) {
  return (
    <div className="flex w-full justify-center overflow-y-auto max-h-60 md:max-h-full">
      <Calendar
        mode="single"
        selected={dateRange?.to ?? dateRange?.from}
        onSelect={onDateChange}
        showOutsideDays={false}
        numberOfMonths={numMonths}
        disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
        modifiers={{
          range_start: dateRange?.from,
          range_end: dateRange?.to,
          range_middle:
            dateRange?.from && dateRange?.to
              ? (d) => d > dateRange.from! && d < dateRange.to!
              : undefined,
        }}
        className="w-full max-w-full rounded-lg p-0"
      />
    </div>
  );
}

interface VehicleContentProps {
  vehicleType: VehicleType | "";
  onSelect: (v: VehicleType) => void;
}
function VehicleContent({ vehicleType, onSelect }: VehicleContentProps) {
  return (
    <div className="py-1 overflow-y-auto max-h-60 md:max-h-full">
      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-3 px-0.5">
        Vehicle type
      </p>
      <div className="grid grid-cols-1 gap-4">
        {VEHICLE_TYPES.map(({ label, image, value, desc }) => {
          const isSelected = vehicleType === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => onSelect(value)}
              aria-pressed={isSelected}
              className={cn(
                "relative flex items-center gap-4 p-3 rounded-lg shadow-sm border transition-colors text-left cursor-pointer focus:outline-none",
                isSelected
                  ? "border-foreground bg-accent/60"
                  : "border-border/50 hover:border-foreground/40 hover:bg-background",
              )}
            >
              <div className="shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-muted-foreground/10 flex items-center justify-center">
                <Image
                  src={image}
                  alt={value}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex flex-col text-left">
                <p className="text-sm font-semibold">{label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface ClearButtonProps {
  onClick: () => void;
  visible: boolean;
  offsetRight?: string;
}
function ClearButton({
  onClick,
  visible,
  offsetRight = "right-4",
}: ClearButtonProps) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        "hidden md:flex absolute top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-background transition-all duration-200 z-10",
        offsetRight,
        visible
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none",
      )}
    >
      <RxCross2 className="size-3.5" />
    </button>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDateRange(dateRange: DateRange | undefined): React.ReactNode {
  if (dateRange?.from && dateRange?.to) {
    return `${format(dateRange.from, "MMM dd")} – ${format(dateRange.to, "MMM dd")}`;
  }
  if (dateRange?.from) return format(dateRange.from, "MMM dd");
  return <span className="text-muted-foreground">Add dates</span>;
}

const PANEL_CLASS: Record<NonNullable<FilterType>, string> = {
  location:
    "absolute top-full mt-3 left-0 w-1/2 bg-card border border-border rounded-2xl p-5 shadow-xl overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden z-50",
  dateRange:
    "absolute top-full mt-3 left-1/2 -translate-x-1/2 w-full bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-xl overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden z-50",
  vehicleType:
    "absolute top-full mt-3 right-0 w-1/2 bg-card border border-border rounded-2xl p-5 shadow-xl overflow-hidden z-50",
};

const PANEL_ORIGIN: Record<NonNullable<FilterType>, string> = {
  location: "top left",
  dateRange: "top center",
  vehicleType: "top right",
};

// ─── Main component ───────────────────────────────────────────────────────────

export default function SearchPanel({
  activeFilter,
  onFilterClick,
  onSearchSubmit,
  openSearch,
  onOpenSearch,
  onCloseSearch,
  showFullNav,
}: SearchPanelProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isSearchPage = pathname === "/search";

  const {
    location,
    setLocation,
    vehicleType,
    setVehicleType,
    dateRange,
    handleDate,
    reset,
    buildUrl,
  } = useSearchDraft();

  const searchUrl = buildUrl(searchParams, isSearchPage);

  // ── Render helpers ──────────────────────────────────────────────────────────

  function renderPanelContent() {
    switch (activeFilter) {
      case "location":
        return <LocationContent location={location} onSelect={setLocation} />;
      case "dateRange":
        return <DateContent dateRange={dateRange} onDateChange={handleDate} />;
      case "vehicleType":
        return (
          <VehicleContent vehicleType={vehicleType} onSelect={setVehicleType} />
        );
      default:
        return null;
    }
  }

  // ── JSX ─────────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Mobile: collapsed button ─────────────────────────────────────── */}
      {!openSearch && (
        <button
          type="button"
          onClick={onOpenSearch}
          className="flex md:hidden items-center justify-center gap-x-2 rounded-full shadow-sm border border-border transition-shadow py-4 px-8 w-full mb-6 bg-card text-sm font-medium"
        >
          <IoSearch className="size-4" />
          Start your search
        </button>
      )}

      {/* ── Mobile: close button ─────────────────────────────────────────── */}
      {mounted && (
        <AnimatePresence>
          {openSearch && (
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.97, y: -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -6 }}
              transition={{ type: "spring", stiffness: 400, damping: 40 }}
              onClick={onCloseSearch}
              className="absolute z-10 md:hidden top-1/2 -translate-y-2/3 right-0 rounded-full p-2.5 bg-card shadow-md border border-border"
            >
              <RxCross2 className="size-5" />
            </motion.button>
          )}
        </AnimatePresence>
      )}

      {/* ── Mobile: search drawer ─────────────────────────────────────────── */}
      {mounted && (
        <AnimatePresence>
          {openSearch && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -6 }}
              transition={{ type: "spring", stiffness: 400, damping: 40 }}
              className="fixed z-10 md:hidden top-20 left-0 w-full"
              style={{ height: "calc(100dvh - 5rem)" }}
            >
              <div className="flex flex-col gap-y-4 h-full">
                {/* Location */}
                <div
                  onClick={() => onFilterClick("location")}
                  className={cn(
                    "flex flex-col gap-y-4 p-4 bg-card rounded-2xl cursor-pointer transition-all duration-200",
                    activeFilter === "location"
                      ? "shadow-xl border border-border flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                      : "shadow-sm shrink-0",
                  )}
                >
                  {activeFilter === "location" ? (
                    <div className="flex flex-col gap-y-2 h-full">
                      <h3 className="text-xl font-bold shrink-0">Where?</h3>
                      <LocationContent
                        location={location}
                        onSelect={setLocation}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-x-5">
                      <span className="text-sm font-medium">Where</span>
                      <span className="text-sm truncate">
                        {location || (
                          <span className="text-muted-foreground">
                            Search location
                          </span>
                        )}
                      </span>
                    </div>
                  )}
                </div>

                {/* Date */}
                <div
                  onClick={() => onFilterClick("dateRange")}
                  className={cn(
                    "flex flex-col gap-y-4 p-4 bg-card rounded-2xl cursor-pointer transition-all duration-200",
                    activeFilter === "dateRange"
                      ? "shadow-xl border border-border flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                      : "shadow-sm shrink-0",
                  )}
                >
                  {activeFilter === "dateRange" ? (
                    <div className="flex flex-col gap-y-2 h-full">
                      <h3 className="text-xl font-bold shrink-0">When?</h3>
                      <DateContent
                        dateRange={dateRange}
                        onDateChange={handleDate}
                        numMonths={1}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-x-5">
                      <span className="text-sm font-medium">When</span>
                      <span className="text-sm truncate">
                        {formatDateRange(dateRange)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Vehicle type */}
                <div
                  onClick={() => onFilterClick("vehicleType")}
                  className={cn(
                    "flex flex-col gap-y-4 p-4 bg-card rounded-2xl cursor-pointer transition-all duration-200",
                    activeFilter === "vehicleType"
                      ? "shadow-xl border border-border flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                      : "shadow-sm shrink-0",
                  )}
                >
                  {activeFilter === "vehicleType" ? (
                    <div className="flex flex-col gap-y-2 h-full">
                      <h3 className="text-xl font-bold shrink-0">Which?</h3>
                      <VehicleContent
                        vehicleType={vehicleType}
                        onSelect={setVehicleType}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-x-5">
                      <span className="text-sm font-medium">Which</span>
                      <span className="text-sm truncate">
                        {vehicleType || (
                          <span className="text-muted-foreground">
                            Select type
                          </span>
                        )}
                      </span>
                    </div>
                  )}
                </div>

                {/* Mobile actions — always pinned to bottom */}
                <div className="flex items-center justify-between px-2 sm:px-4 py-4 shrink-0 mt-auto">
                  <button
                    type="button"
                    onClick={reset}
                    className="text-sm font-medium bg-transparent outline-none"
                  >
                    Reset
                  </button>
                  <Link
                    href={searchUrl}
                    onClick={onSearchSubmit}
                    className="flex items-center gap-x-2 py-2 px-4 bg-primary text-primary-foreground font-medium rounded-full text-sm"
                  >
                    <IoSearch className="size-4" />
                    Search
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* ── Desktop: pill bar ─────────────────────────────────────────────── */}
      <LayoutGroup id="searchbar-layout">
        <motion.div
          initial={false}
          animate={{ height: showFullNav ? 64 : 48 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 40,
            mass: 0.8,
          }}
          className={cn(
            "relative w-full border border-border shadow-sm rounded-full hidden md:grid grid-cols-3 items-center overflow-visible transition-colors duration-200",
            activeFilter ? "bg-border" : "bg-card",
            // showFullNav ? "max-w-"
          )}
        >
          {/* Location pill */}
          <div
            onClick={() => {
              onFilterClick("location");
            }}
            className="relative h-full px-6 flex items-center cursor-pointer hover:bg-border rounded-full transition-colors duration-200"
          >
            {activeFilter === "location" && (
              <motion.span
                layoutId="active-pill"
                className="absolute inset-0 rounded-full bg-card shadow-sm pointer-events-none"
                transition={{ type: "spring", stiffness: 400, damping: 40 }}
              />
            )}
            <div className="relative z-10 w-full">
              {showFullNav && <h4 className="text-xs font-medium">Where</h4>}
              <div className="flex items-center gap-x-1">
                {!showFullNav && (
                  <FaMapMarkerAlt className="text-muted-foreground shrink-0" />
                )}
                <span className="text-sm truncate w-full">
                  {location || (
                    <span className="text-muted-foreground">
                      Search location
                    </span>
                  )}
                </span>
              </div>
            </div>
            <ClearButton
              onClick={() => setLocation("")}
              visible={activeFilter === "location" && !!location}
            />
          </div>

          {/* Date pill */}
          <div
            onClick={() => onFilterClick("dateRange")}
            className="relative h-full px-6 flex items-center cursor-pointer hover:bg-border rounded-full transition-colors duration-200"
          >
            {activeFilter === "dateRange" && (
              <motion.span
                layoutId="active-pill"
                className="absolute inset-0 rounded-full bg-card shadow-sm pointer-events-none"
                transition={{ type: "spring", stiffness: 400, damping: 40 }}
              />
            )}
            <div className="relative z-10 w-full">
              {showFullNav && <h4 className="text-xs font-medium">When</h4>}
              <div className="flex items-center gap-x-1 truncate">
                {!showFullNav && (
                  <IoIosAlarm className="text-muted-foreground shrink-0" />
                )}
                <span className="text-sm truncate w-full">
                  {formatDateRange(dateRange)}
                </span>
              </div>
            </div>
            <ClearButton
              onClick={() => handleDate(undefined)}
              visible={activeFilter === "dateRange" && !!dateRange}
            />
          </div>

          {/* Vehicle type pill */}
          <div
            onClick={() => onFilterClick("vehicleType")}
            className="relative h-full px-6 flex items-center cursor-pointer hover:bg-border rounded-full transition-colors duration-200"
          >
            {activeFilter === "vehicleType" && (
              <motion.span
                layoutId="active-pill"
                className="absolute inset-0 rounded-full bg-card shadow-sm pointer-events-none"
                transition={{ type: "spring", stiffness: 400, damping: 40 }}
              />
            )}
            <div className="relative z-10 w-full">
              {showFullNav && <h4 className="text-xs font-medium">Which</h4>}
              <div className="flex items-center gap-x-1">
                {!showFullNav && (
                  <GiFullMotorcycleHelmet className="text-muted-foreground shrink-0" />
                )}
                <span className="text-sm truncate w-full">
                  {vehicleType || (
                    <span className="text-muted-foreground">Select type</span>
                  )}
                </span>
              </div>
            </div>
            <ClearButton
              onClick={() => setVehicleType("")}
              visible={activeFilter === "vehicleType" && !!vehicleType}
              offsetRight="right-20"
            />
          </div>

          {/* Desktop: dropdown panel */}
          {mounted && (
            <AnimatePresence>
              {activeFilter && (
                <motion.div
                  // ✅ Stable key — same element persists across filter changes
                  key="filter-panel"
                  layout // smoothly animates size/position changes
                  initial={{ opacity: 0, scale: 0.97, y: -6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97, y: -6 }}
                  transition={{
                    layout: { type: "spring", stiffness: 400, damping: 40 },
                    opacity: { duration: 0.15 },
                  }}
                  className={PANEL_CLASS[activeFilter]}
                  style={{
                    transformOrigin: PANEL_ORIGIN[activeFilter],
                    maxHeight:
                      "calc(100dvh - var(--navbar-height, 11.25rem) - 0.75rem)",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Content cross-fades independently */}
                  {renderPanelContent()}
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {/* Desktop: search button */}
          <AnimatePresence>
            {showFullNav && (
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 right-2 z-20"
                initial={false}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
              >
                <Link
                  href={searchUrl}
                  onClick={onSearchSubmit}
                  className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity"
                >
                  <IoSearch className="size-5" />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>
    </>
  );
}
