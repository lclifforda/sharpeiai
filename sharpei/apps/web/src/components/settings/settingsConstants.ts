import {
  Building2,
  ListChecks,
  FileText,
  Truck,
  DollarSign,
  Briefcase,
  Users,
  CircleDollarSign,
  MapPin,
  Shield,
  Palette,
  BookOpen,
} from "lucide-react";

// ── Icon maps ──────────────────────────────────────────────────────────

export const APP_TYPE_ICONS: Record<string, React.FC<{ className?: string }>> = {
  Truck, DollarSign, FileText,
};

export const FIELD_CATEGORY_ICONS: Record<string, React.FC<{ className?: string }>> = {
  identity: Briefcase,
  contact: Users,
  financial: CircleDollarSign,
  address: MapPin,
  guarantor: Shield,
};

export const DOC_CATEGORY_ICONS: Record<string, React.FC<{ className?: string }>> = {
  business_info: Briefcase,
  financial: CircleDollarSign,
  equipment: Truck,
  personal: Users,
  security: Shield,
};

export const APP_TYPE_GRADIENTS: Record<string, string> = {
  "equipment-financing": "from-blue-500 to-cyan-400",
  "working-capital": "from-emerald-500 to-teal-400",
  "equipment-leasing": "from-violet-500 to-purple-400",
};

// ── Navigation items ───────────────────────────────────────────────────

export type SectionId = "profile" | "fields" | "documents" | "knowledge" | "branding";

export const NAV_ITEMS: { id: SectionId; label: string; icon: React.FC<{ className?: string }>; description: string }[] = [
  { id: "profile", label: "Profile", icon: Building2, description: "Company identity & AI context" },
  { id: "fields", label: "Applications & Fields", icon: ListChecks, description: "Products, data collection rules" },
  { id: "documents", label: "Applicant Documents", icon: FileText, description: "What to collect from applicants" },
  { id: "knowledge", label: "Knowledge Base", icon: BookOpen, description: "Contracts, rates & guidelines" },
  { id: "branding", label: "Branding", icon: Palette, description: "Colors & welcome message" },
];

// ── Shared helper ──────────────────────────────────────────────────────

export function groupBy<T extends { category: string }>(items: T[]) {
  return items.reduce<Record<string, T[]>>((acc, item) => {
    (acc[item.category] ??= []).push(item);
    return acc;
  }, {});
}
