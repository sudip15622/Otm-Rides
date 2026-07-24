import * as LucideIcons from "lucide-react";
import { Sparkles, type LucideIcon } from "lucide-react";

export function getFeatureIcon(iconKey: string | null): LucideIcon {
  if (!iconKey) return Sparkles;
  const Icon = (LucideIcons as unknown as Record<string, LucideIcon>)[iconKey];
  return Icon ?? Sparkles;
}
