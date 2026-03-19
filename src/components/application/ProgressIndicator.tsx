import type { SectionId, FlowType } from "./types";

interface ProgressIndicatorProps {
  flowType: FlowType;
  activeSections: SectionId[];
  currentSection: SectionId;
  completedSections: Set<SectionId>;
}

const VENDOR_STEP_LABELS: Partial<Record<SectionId, string>> = {
  company_name: "Company",
  prequal: "Pre-Qual",
  info: "Info & Docs",
  offers: "Offers",
  contract: "Sign",
};

export default function ProgressIndicator({
  flowType,
  activeSections,
  currentSection,
  completedSections,
}: ProgressIndicatorProps) {
  if (flowType === "vendor") {
    // Steps mode: numbered circles with labels
    const steps = activeSections.filter((s) => VENDOR_STEP_LABELS[s]);
    return (
      <div className="mb-8 bg-card rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          {steps.map((step, idx) => {
            const isCompleted = completedSections.has(step);
            const currentIdx = steps.indexOf(currentSection);
            const isCurrent = step === currentSection || (
              // info step is "current" for both info and documents sub-states
              step === "info" && (currentSection === "info" || currentSection === "documents")
            );
            const isPast = steps.indexOf(step) < currentIdx;

            return (
              <div key={step} className="flex items-center flex-1">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                      isCompleted || isPast
                        ? "bg-green-500 text-white"
                        : isCurrent
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isCompleted || isPast ? "\u2713" : idx + 1}
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      isCurrent ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {VENDOR_STEP_LABELS[step]}
                  </span>
                </div>
                {idx < steps.length - 1 && <div className="h-px flex-1 bg-border mx-2" />}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Bank mode: dot indicators
  return (
    <div className="mb-8 bg-card rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-center gap-1 max-w-4xl mx-auto">
        {activeSections.map((section, idx) => {
          const isCompleted = completedSections.has(section);
          const isCurrent = section === currentSection;
          return (
            <div key={section} className="flex items-center">
              <div
                className={`w-3 h-3 rounded-full transition-all ${
                  isCompleted
                    ? "bg-green-500"
                    : isCurrent
                    ? "bg-primary scale-125"
                    : "bg-muted"
                }`}
              />
              {idx < activeSections.length - 1 && (
                <div className={`w-6 h-px mx-0.5 ${isCompleted ? "bg-green-500" : "bg-border"}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
