/**
 * /api/coverage/* - read-only search endpoints for the guided
 * doctor + drug lookup workflow.
 *
 * Endpoints (PR 1, slice):
 *   GET /api/coverage/providers/search?q=&zip=&specialty=
 *   GET /api/coverage/medications/search?q=
 *
 * NOTE: This router is intentionally NOT mounted in this PR. It is
 * additive only and ships behind a follow-up PR that wires it into
 * `routers.ts` after we verify behavior in the Vercel preview build.
 * See Issue #1.
 */
import { Router, type Request, type Response } from "express";
import { z } from "zod";
import type { Provider, Medication } from "../shared/coverage";

const router = Router();

const ProviderSearchQuery = z.object({
  q: z.string().min(1).max(120),
  zip: z.string().regex(/^\d{5}$/).optional(),
  specialty: z.string().max(80).optional(),
  limit: z.coerce.number().int().min(1).max(25).optional(),
});

const MedicationSearchQuery = z.object({
  q: z.string().min(1).max(120),
  limit: z.coerce.number().int().min(1).max(25).optional(),
});

/**
 * GET /api/coverage/providers/search
 *
 * Returns candidate providers for an autocomplete / disambiguation UI.
 * Backed (in a follow-up PR) by `server/providerNetwork.ts`.
 */
router.get("/providers/search", async (req: Request, res: Response) => {
  const parsed = ProviderSearchQuery.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: "invalid_query", details: parsed.error.flatten() });
  }
  const { q, zip, specialty, limit = 10 } = parsed.data;

  // PR 1 stub: deterministic placeholder candidates so the client UI can
  // be wired and reviewed in a Vercel preview without external deps.
  // PR 2 swaps this for a real lookup against providerNetwork.ts.
  const stub: Provider[] = [
    {
      id: `stub-${q.toLowerCase().replace(/\s+/g, "-")}-1`,
      name: q,
      specialty: specialty ?? "Internal Medicine",
      facilityName: "Sample Clinic",
      address: { city: "Overland Park", state: "KS", zip: zip ?? "66208" },
      distanceMiles: 1.2,
      acceptingNewPatients: true,
    },
  ].slice(0, limit);

  res.json({ results: stub, source: "stub" });
});

/**
 * GET /api/coverage/medications/search
 *
 * Returns candidate medications for autocomplete. Backed (in a
 * follow-up PR) by `server/formularyCalculator.ts` plus an RxNorm
 * normalizer.
 */
router.get("/medications/search", async (req: Request, res: Response) => {
  const parsed = MedicationSearchQuery.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: "invalid_query", details: parsed.error.flatten() });
  }
  const { q, limit = 10 } = parsed.data;

  // PR 1 stub.
  const stub: Medication[] = [
    {
      id: `stub-rx-${q.toLowerCase().replace(/\s+/g, "-")}`,
      displayName: q,
      genericName: q.toLowerCase(),
    },
  ].slice(0, limit);

  res.json({ results: stub, source: "stub" });
});

export default router;
