import { useMemo } from "react";
import type { FlowConfig, FlowType, OrderDetails } from "./types";

interface UseFlowConfigParams {
  embedded?: boolean;
  orderDetails: OrderDetails | null;
}

export function useFlowConfig({ embedded, orderDetails }: UseFlowConfigParams): FlowConfig {
  return useMemo(() => {
    // If product context exists (quantity, term, etc.) → vendor flow
    // If embedded with no product context → bank flow
    const flowType: FlowType = orderDetails ? "vendor" : "bank";

    if (flowType === "vendor") {
      return {
        flowType: "vendor",
        embedded: !!embedded,
        features: {
          splitSections: false,       // vendor keeps combined info+docs step
          enableOCR: true,            // OCR verification on upload
          enableOffers: true,         // offer generation after form
          enableContract: true,       // contract signature
          enableEquipmentChat: false, // equipment from checkout context
          enablePreQual: true,        // pre-qual added to vendor flow
          enableLightweightDocs: false,
          enableOrderSummary: true,   // right sidebar
        },
      };
    }

    // Bank flow
    return {
      flowType: "bank",
      embedded: !!embedded,
      features: {
        splitSections: true,          // progressive section-by-section
        enableOCR: true,              // OCR verification
        enableOffers: false,
        enableContract: false,
        enableEquipmentChat: true,    // equipment chat
        enablePreQual: true,          // pre-qualification gate
        enableLightweightDocs: true,  // lightweight docs before full form
        enableOrderSummary: false,
      },
    };
  }, [embedded, orderDetails]);
}
