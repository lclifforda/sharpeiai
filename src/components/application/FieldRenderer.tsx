import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { US_STATES, type EnabledField } from "@/services/platformConfigMockData";
import type { AuthState } from "./types";
import { useMemo } from "react";

const ENTITY_TYPE_OPTIONS = ["LLC", "Corporation", "S-Corporation", "Sole Proprietor", "Partnership", "Non-Profit"];

interface FieldRendererProps {
  field: EnabledField;
  value: string;
  error?: string;
  onChange: (fieldId: string, value: string) => void;
  onBlur?: () => void;
  readOnly?: boolean;
  authState?: AuthState;
  onChangeCompany?: () => void;
}

export default function FieldRenderer({
  field,
  value,
  error,
  onChange,
  onBlur,
  readOnly,
  authState,
  onChangeCompany,
}: FieldRendererProps) {
  const stateOptions = useMemo(() => US_STATES.filter((s) => s !== "Nationwide"), []);

  // Calendar popover for date fields
  if (field.id === "dateEstablished" || (field.type === "date" && field.id === "guarantorDOB")) {
    const dateValue = value ? new Date(value.length === 7 ? `${value}-01` : value) : undefined;
    const isValidDate = dateValue && !isNaN(dateValue.getTime());
    const currentYear = new Date().getFullYear();

    return (
      <div className="space-y-2">
        <Label>{field.label} {field.required && "*"}</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`w-full justify-start text-left font-normal ${!isValidDate ? "text-muted-foreground" : ""}`}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {isValidDate
                ? format(dateValue, field.id === "dateEstablished" ? "MMMM yyyy" : "PPP")
                : `Select ${field.label.toLowerCase()}`}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={isValidDate ? dateValue : undefined}
              onSelect={(date) => {
                if (date) onChange(field.id, format(date, "yyyy-MM-dd"));
              }}
              captionLayout="dropdown-buttons"
              fromYear={currentYear - 80}
              toYear={currentYear}
              defaultMonth={isValidDate ? dateValue : new Date(currentYear - 5, 0)}
              disabled={(date) => date > new Date()}
              classNames={{
                caption_label: "hidden",
                caption_dropdowns: "flex gap-2",
                vhidden: "hidden",
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    );
  }

  // Select fields
  if (field.type === "select") {
    let options: string[] = [];
    if (field.id === "state") options = stateOptions;
    else if (field.id === "entityType") options = ENTITY_TYPE_OPTIONS;
    else if (field.id === "country") options = ["United States", "Canada"];

    return (
      <div className="space-y-2">
        <Label htmlFor={field.id}>
          {field.label} {field.required && "*"}
        </Label>
        <Select
          value={value || ""}
          onValueChange={(v) => onChange(field.id, v)}
        >
          <SelectTrigger id={field.id} className={error ? "border-destructive" : ""}>
            <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={opt} value={opt}>{opt}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  }

  // Default: text/number/email/tel input
  const isVerifiedField = authState?.status === "verified" &&
    ["companyName", "contactName", "contactEmail", "contactPhone"].includes(field.id);
  const isReadOnly = readOnly || isVerifiedField;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={field.id}>
          {field.label} {field.required && "*"}
        </Label>
        {field.id === "companyName" && authState?.status === "verified" && onChangeCompany && (
          <button
            type="button"
            onClick={onChangeCompany}
            className="text-xs text-primary hover:underline"
          >
            change
          </button>
        )}
      </div>
      <Input
        id={field.id}
        type={field.type === "number" ? "number" : field.type === "date" ? "date" : field.type}
        placeholder={field.aiNote || `Enter ${field.label.toLowerCase()}`}
        value={value || ""}
        onChange={(e) => onChange(field.id, e.target.value)}
        onBlur={onBlur}
        readOnly={isReadOnly}
        className={`${error ? "border-destructive" : ""} ${isReadOnly ? "bg-muted" : ""}`}
        min={field.minThreshold}
        max={field.maxThreshold}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
