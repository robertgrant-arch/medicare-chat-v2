/**
 * coverageChips - parses quick-reply chips emitted by the LLM in assistant messages.
 *
 * Convention: lines starting with "> " at the END of a message are treated as chips.
 * Example STEP 2 output:
 *   What do you want to check first?
 *   > My doctors
 *   > My prescriptions
 *   > Both
 *   > Just show plans first
 *
 * Used by ChatWidget when VITE_COVERAGE_CHIPS=1. Pure function, no side effects.
 */

export interface Chip {
  label: string;
  value: string;
}

export interface ParsedChips {
  body: string;
  chips: Chip[];
}

const CHIP_LINE = /^>\s+(.+)$/;

export function parseCoverageChips(text: string): ParsedChips {
  if (!text) return { body: '', chips: [] };
  const lines = text.split('\n');
  const chips: Chip[] = [];

  // Walk from the end; collect contiguous trailing chip lines (allowing blank lines).
  let cut = lines.length;
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i].trim();
    if (!line) {
      // Allow trailing blank lines between body and chips.
      if (chips.length === 0) { cut = i; continue; }
      cut = i;
      continue;
    }
    const m = line.match(CHIP_LINE);
    if (!m) break;
    chips.unshift({ label: m[1].trim(), value: m[1].trim() });
    cut = i;
  }

  if (chips.length === 0) return { body: text, chips: [] };
  const body = lines.slice(0, cut).join('\n').trimEnd();
  return { body, chips };
}

export function coverageChipsEnabled(): boolean {
  try {
    // @ts-ignore - import.meta typing varies by tsconfig
    return (import.meta as any)?.env?.VITE_COVERAGE_CHIPS === '1';
  } catch {
    return false;
  }
}
