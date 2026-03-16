import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react";

/**
 * Shared context that form pages write to and the floating AI assistant reads from.
 * This lets the assistant know what the user is doing without tight coupling.
 */

export interface AssistantPageContext {
  /** Which page / section the user is on */
  page?: string;
  /** Application type (equipment-financing, lease-financing, working-capital) */
  applicationType?: string;
  /** Current step in a multi-step form */
  currentStep?: string;
  /** Company info if entered */
  companyName?: string;
  /** Equipment items if any */
  equipmentSummary?: string;
  /** Total equipment value */
  equipmentTotal?: number;
  /** Revenue / income if entered */
  revenue?: number;
  /** Selected offer summary */
  selectedOffer?: { lender: string; rate: number; term: number; monthly: number };
  /** Available offers count */
  offersCount?: number;
  /** Form completion progress (0-1) */
  formProgress?: number;
  /** View mode (merchant or bank) */
  viewMode?: string;
  /** Any extra key-value pairs pages want to share */
  [key: string]: unknown;
}

interface AssistantContextValue {
  pageContext: AssistantPageContext;
  /** Merge partial updates into the current context */
  updateContext: (partial: Partial<AssistantPageContext>) => void;
  /** Replace the entire context (e.g. when navigating away) */
  resetContext: () => void;
}

const AssistantContext = createContext<AssistantContextValue>({
  pageContext: {},
  updateContext: () => {},
  resetContext: () => {},
});

export const AssistantProvider = ({ children }: { children: ReactNode }) => {
  const [pageContext, setPageContext] = useState<AssistantPageContext>({});

  const updateContext = useCallback((partial: Partial<AssistantPageContext>) => {
    setPageContext(prev => ({ ...prev, ...partial }));
  }, []);

  const resetContext = useCallback(() => {
    setPageContext({});
  }, []);

  const contextValue = useMemo(
    () => ({ pageContext, updateContext, resetContext }),
    [pageContext, updateContext, resetContext]
  );

  return (
    <AssistantContext.Provider value={contextValue}>
      {children}
    </AssistantContext.Provider>
  );
};

export const useAssistantContext = () => useContext(AssistantContext);
