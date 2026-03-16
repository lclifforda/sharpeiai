// Thin re-export wrapper — the real implementation is in UnifiedApplicationForm.
// This file exists for backward compatibility with direct imports.
// TODO: Delete this file once all imports point to UnifiedApplicationForm.
import UnifiedApplicationForm from "./UnifiedApplicationForm";

const BankApplicationForm = (props: { applicationType?: string }) => (
  <UnifiedApplicationForm embedded applicationType={props.applicationType} />
);

export default BankApplicationForm;
