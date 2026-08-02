// lib/become-a-host/routes.ts

export type RouteKind = "info" | "step";

export interface RouteConfig {
  slug: string; // URL segment
  kind: RouteKind;
  stepNumber?: number; // only present for kind: "step" — maps to backend draftStep
  phaseLabel?: string; // for grouping in StepFooter progress bar (display only)
}

// Single source of truth for order. Add/reorder pages here only.
export const ROUTES: RouteConfig[] = [
  { slug: "overview", kind: "info" },
  { slug: "about-your-vehicle", kind: "info" },
  {
    slug: "basic-info",
    kind: "step",
    stepNumber: 1,
    phaseLabel: "About your vehicle",
  },
  {
    slug: "specifications",
    kind: "step",
    stepNumber: 2,
    phaseLabel: "About your vehicle",
  },
  {
    slug: "location",
    kind: "step",
    stepNumber: 3,
    phaseLabel: "About your vehicle",
  },
  { slug: "stand-out-vehicle", kind: "info" },
  {
    slug: "photos",
    kind: "step",
    stepNumber: 4,
    phaseLabel: "Make it stand out",
  },
  {
    slug: "features",
    kind: "step",
    stepNumber: 5,
    phaseLabel: "Make it stand out",
  },

  { slug: "finish-and-publish", kind: "info" },
  {
    slug: "pricing",
    kind: "step",
    stepNumber: 6,
    phaseLabel: "Pricing & policies",
  },
  {
    slug: "review",
    kind: "step",
    stepNumber: 7,
    phaseLabel: "Review & submit",
  },
];

// Derived lookups — computed once, used everywhere
export const sequenceIndexBySlug = new Map(ROUTES.map((r, i) => [r.slug, i]));
export const routeBySlug = new Map(ROUTES.map((r) => [r.slug, r]));

export function getRoute(slug: string): RouteConfig {
  const route = routeBySlug.get(slug);
  if (!route) throw new Error(`Unknown route slug: ${slug}`);
  return route;
}

// Given a backend draftStep, find which sequenceIndex that corresponds to —
// i.e. the route the user should land on when "resuming"
export function sequenceIndexForDraftStep(draftStep: number): number {
  const route = ROUTES.find((r) => r.stepNumber === draftStep);
  return route ? sequenceIndexBySlug.get(route.slug)! : 0;
}

export function maxReachableIndex(draftStep: number): number {
  // The route matching the user's current working step —
  // this is the actual ceiling. Nothing past it is reachable,
  // including info pages that sit between it and the next step.
  const currentStepRoute = ROUTES.find(
    (r) => r.kind === "step" && r.stepNumber === draftStep,
  );

  if (currentStepRoute) {
    return sequenceIndexBySlug.get(currentStepRoute.slug)!;
  }

  // draftStep is past the last defined step (e.g. all steps done) —
  // everything is reachable, including trailing info pages.
  return ROUTES.length - 1;
}

export function getResumeSlug(draftStep: number): string {
  // Resume at the last reachable route, not just the matching step slug —
  // this correctly skips over info pages using the same logic as the guard.
  const targetIndex = maxReachableIndex(draftStep);
  return ROUTES[targetIndex]?.slug ?? "overview";
}
