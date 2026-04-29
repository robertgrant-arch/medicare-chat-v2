/**
 * Shared coverage workflow types.
 *
 * Used by the guided doctor + drug lookup flow that replaces the
 * legacy freeform "(1) doctor (2) prescriptions (3) budget" prompt.
 *
 * See Issue #1 for the full spec.
 */

export type ProviderMatchStatus =
  | "in_network"
  | "likely_in_network"
  | "needs_office_verification"
  | "not_found";

export type Provider = {
  /** Internal stable ID for this provider entity (e.g. NPI when known). */
  id: string;
  npi?: string;
  name: string;
  specialty?: string;
  facilityName?: string;
  address?: {
    line1?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  distanceMiles?: number;
  acceptingNewPatients?: boolean;
  telehealth?: boolean;
  languages?: string[];
};

export type Medication = {
  /** Internal stable ID (RxNorm RXCUI when known). */
  id: string;
  displayName: string;
  genericName?: string;
  rxNormId?: string;
  strength?: string;
  form?: string;
  frequency?: string;
  quantityPerFill?: number;
  preferredPharmacyId?: string;
};

export type CoveragePreferences = {
  zip: string;
  providers: Provider[];
  medications: Medication[];
  monthlyBudget?: number;
};

export type CoverageChoice =
  | "doctors"
  | "prescriptions"
  | "both"
  | "plans_first";

export type ProviderMatch = {
  providerId: string;
  status: ProviderMatchStatus;
  evidence?: string;
};

export type DrugMatch = {
  medicationId: string;
  onFormulary: boolean;
  tier?: number;
  priorAuth?: boolean;
  stepTherapy?: boolean;
  quantityLimit?: boolean;
  estMonthlyCost?: number;
  estAnnualCost?: number;
};

export type CoverageSummary = {
  doctorSummary?: string;
  drugSummary?: string;
  confidenceLevel: "high" | "medium" | "low";
  providerMatches?: ProviderMatch[];
  drugMatches?: DrugMatch[];
};
