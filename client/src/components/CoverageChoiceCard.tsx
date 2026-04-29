/**
 * CoverageChoiceCard
 *
 * Post-ZIP branching card that replaces the freeform
 * "(1) doctor (2) prescriptions (3) budget" prompt.
 *
 * Usage:
 *   <CoverageChoiceCard onChoose={(choice) => ...} />
 *
 * Emits a CoverageChoice value to the parent chat orchestrator,
 * which then routes to the appropriate sub-flow (DoctorSearchFlow,
 * MedicationSearchFlow) in PRs 2 and 3.
 *
 * See Issue #1.
 */
import React from "react";
import type { CoverageChoice } from "../../../shared/coverage";

export type CoverageChoiceCardProps = {
  onChoose: (choice: CoverageChoice) => void;
  disabled?: boolean;
};

type Option = {
  value: CoverageChoice;
  label: string;
  helper: string;
};

const OPTIONS: Option[] = [
  { value: "doctors", label: "My doctors", helper: "Check if your doctor is in network" },
  { value: "prescriptions", label: "My prescriptions", helper: "Check drug coverage and cost" },
  { value: "both", label: "Both", helper: "Doctors and prescriptions" },
  { value: "plans_first", label: "Just show plans first", helper: "I'll narrow down later" },
];

export function CoverageChoiceCard({ onChoose, disabled }: CoverageChoiceCardProps) {
  return (
    <div
      role="group"
      aria-label="What do you want to check first?"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: 8,
        padding: 12,
        border: "1px solid #E5E7EB",
        borderRadius: 12,
        background: "#F9FAFB",
      }}
    >
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          disabled={disabled}
          onClick={() => onChoose(opt.value)}
          style={{
            textAlign: "left",
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid #D1D5DB",
            background: "#FFFFFF",
            cursor: disabled ? "not-allowed" : "pointer",
          }}
        >
          <div style={{ fontWeight: 600, fontSize: 14, color: "#1B365D" }}>{opt.label}</div>
          <div style={{ fontSize: 12, color: "#4B5563", marginTop: 2 }}>{opt.helper}</div>
        </button>
      ))}
    </div>
  );
}

export default CoverageChoiceCard;
