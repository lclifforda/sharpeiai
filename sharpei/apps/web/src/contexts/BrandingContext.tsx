import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { PlatformBranding } from "@/services/platformConfigMockData";
import { getBranding, saveBranding, resetBranding } from "@/lib/brandingStorage";
import bbvaLogo from "@/assets/bbva-logo.webp";

interface BrandingContextValue {
  branding: PlatformBranding;
  updateBranding: (patch: Partial<PlatformBranding>) => void;
  resetToDefaults: () => void;
  /** Resolved logo src: stored base64 data URL or the BBVA fallback */
  logoSrc: string;
}

const BrandingContext = createContext<BrandingContextValue | null>(null);

export function BrandingProvider({ children }: { children: ReactNode }) {
  const [branding, setBranding] = useState<PlatformBranding>(getBranding);

  const persist = useCallback((next: PlatformBranding) => {
    setBranding(next);
    saveBranding(next);
  }, []);

  const update = useCallback(
    (patch: Partial<PlatformBranding>) => {
      const next = { ...branding, ...patch };
      persist(next);
    },
    [branding, persist]
  );

  const reset = useCallback(() => {
    setBranding(resetBranding());
  }, []);

  const logoSrc = branding.logoUrl || bbvaLogo;

  return (
    <BrandingContext.Provider
      value={{
        branding,
        updateBranding: update,
        resetToDefaults: reset,
        logoSrc,
      }}
    >
      {children}
    </BrandingContext.Provider>
  );
}

export function useBranding() {
  const ctx = useContext(BrandingContext);
  if (!ctx) throw new Error("useBranding must be used within <BrandingProvider>");
  return ctx;
}
