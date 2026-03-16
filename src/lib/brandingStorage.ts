import type { PlatformBranding } from "@/services/platformConfigMockData";
import { DEFAULT_PLATFORM_CONFIG } from "@/services/platformConfigMockData";

const STORAGE_KEY = "sharpei_branding";

function getDefaultBranding(): PlatformBranding {
  return { ...DEFAULT_PLATFORM_CONFIG.branding };
}

export function getBranding(): PlatformBranding {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultBranding();
    return JSON.parse(raw) as PlatformBranding;
  } catch {
    return getDefaultBranding();
  }
}

export function saveBranding(branding: PlatformBranding): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(branding));
}

export function resetBranding(): PlatformBranding {
  const branding = getDefaultBranding();
  saveBranding(branding);
  return branding;
}
