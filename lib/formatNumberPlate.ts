// formatNepaliTwoWheelerPlate.ts

/**
 * OLD format (pre-2020, zone-based):
 *   BA 2 PA 1234   — ZoneCode(2-3L) SetNum(1-2N) TypeCode(PA|PHA|BA) Serial(4N)
 *   Can also appear with province number replacing zone letters, e.g.:
 *   03 003 PA 3293  — Province(2N) SetNum(1-3N) TypeCode Serial(4N)
 *   Devanagari input accepted and normalised automatically.
 *
 * NEW embossed format (2020+, province-based):
 *   03 A AA 1234   — Province(2N) VehicleClass(A) AgeCode(AA-ZZ) Serial(1-4N)
 *   Wikipedia / Grokipedia confirmed: "1 B AA 1234" is the canonical example.
 */

// ─── Devanagari helpers ────────────────────────────────────────────────────

const devDigitToAscii = (ch: string): string => {
  const cp = ch.codePointAt(0)!;
  return cp >= 0x0966 && cp <= 0x096f ? String(cp - 0x0966) : ch;
};

const DEVA_ZONE: Record<string, string> = {
  मे: "ME",
  को: "KO",
  स: "SA",
  ज: "JA",
  बा: "BA",
  ना: "NA",
  ग: "GA",
  लु: "LU",
  ध: "DH",
  रा: "RA",
  भे: "BHE",
  क: "KA",
  से: "SE",
  म: "MA",
};

function normaliseDevanagari(raw: string): string {
  let s = raw.replace(/[\u0966-\u096f]/g, devDigitToAscii);
  // Replace longest Devanagari zone codes first
  for (const [dev, lat] of Object.entries(DEVA_ZONE)) {
    s = s.replace(new RegExp(dev, "g"), lat);
  }
  return s;
}

// ─── Detection ─────────────────────────────────────────────────────────────

/**
 * New embossed format starts with a 1-2 digit province number (1-7 or 01-07),
 * then a SINGLE LETTER vehicle class (A-K), then a 2-letter age code, then serial.
 *
 * Old format starts with 2-3 Latin letters (zone code like BA, KO, BHE...)
 * OR a province number followed by a longer set-number and PA/PHA/BA type code.
 *
 * Key distinguisher: after the province digits comes either
 *   - a single letter then 2 more letters (new: class + age code)
 *   - a multi-digit set number then PA/PHA/BA (old province-number variant)
 */
function detectFormat(normalised: string): "new" | "old" {
  const upper = normalised.toUpperCase().trim();

  // If it starts with letters it's definitely old
  if (/^[A-Z]/.test(upper)) return "old";

  // Starts with digits — is the letter block that follows a single class letter
  // (new format) or a type code like PA/PHA/BA (old format)?
  // New format: digits → space/nothing → single letter A-K → letters (age code)
  // Old format: digits → more digits → PA/PHA/BA
  const tokens = upper.match(/[A-Z]+|[0-9]+/g) ?? [];
  // tokens[0] = province digits
  // tokens[1] = either single class letter (new) or multi-digit set num (old)
  // tokens[2] = age code 2L (new) or type code PA/PHA/BA (old)

  if (tokens.length >= 3) {
    const maybeClass = tokens[1];
    const maybeAge = tokens[2];
    // New format: single letter class (A-K) + 2-letter age code
    if (
      /^[A-K]$/.test(maybeClass) &&
      /^[A-Z]{2}$/.test(maybeAge) &&
      !["PA", "BA"].includes(maybeAge) // age codes don't overlap with type codes
    ) {
      return "new";
    }
  }

  return "old";
}

// ─── Old format formatter → BA 2 PA 1234  or  03 003 PA 3293 ──────────────

function formatOld(input: string): string {
  const clean = normaliseDevanagari(input)
    .replace(/[^A-Za-z0-9 ]/g, "")
    .toUpperCase()
    .trim();

  const tokens = clean.match(/[A-Z]+|[0-9]+/g) ?? [];
  const parts: string[] = [];

  if (tokens[0]) {
    // FIX 1: province digits capped at 2, zone letters capped at 3
    parts.push(
      /^\d+$/.test(tokens[0])
        ? tokens[0].slice(0, 2) // "03" not "03X"
        : tokens[0].slice(0, 3), // "BHE" zone letters
    );
  }

  if (tokens[1]) {
    if (/^\d+$/.test(tokens[1])) {
      // FIX 2: set number — no artificial cap that was swallowing "003"
      parts.push(tokens[1].slice(0, 3)); // "003" fits fine
      if (tokens[2]) parts.push(tokens[2].slice(0, 3)); // PA / PHA / BA
      if (tokens[3]) parts.push(tokens[3].slice(0, 4)); // serial
    } else {
      parts.push(tokens[1].slice(0, 3));
      if (tokens[2]) parts.push(tokens[2].slice(0, 4));
    }
  }

  return parts.join(" ");
}

// ─── New format formatter → 03 A AA 1234 ──────────────────────────────────

function formatNew(input: string): string {
  const s = input
    .replace(/[^A-Za-z0-9 ]/g, "")
    .toUpperCase()
    .trim();
  const tokens = s.match(/[A-Z]+|[0-9]+/g) ?? [];

  //   [0] province  : 1-2 digits  (pad to "03" on display? No — keep as typed)
  //   [1] class     : 1 letter A-K
  //   [2] age code  : 2 letters
  //   [3] serial    : 1-4 digits
  const parts: string[] = [];

  if (tokens[0]) parts.push(tokens[0].slice(0, 2)); // province (max 2 digits)
  if (tokens[1]) parts.push(tokens[1].slice(0, 1)); // vehicle class (1 letter)
  if (tokens[2]) parts.push(tokens[2].slice(0, 2)); // age code (2 letters)
  if (tokens[3]) parts.push(tokens[3].slice(0, 4)); // serial (max 4 digits)

  return parts.join(" ");
}

// ─── Public API ────────────────────────────────────────────────────────────

export interface PlateResult {
  formatted: string;
  format: "new" | "old" | "empty";
  isComplete: boolean;
}

export function formatNepaliTwoWheelerPlate(raw: string): PlateResult {
  const trimmed = raw.trim();
  if (!trimmed) return { formatted: "", format: "empty", isComplete: false };

  const normalised = normaliseDevanagari(trimmed);
  const format = detectFormat(normalised);

  if (format === "new") {
    const formatted = formatNew(normalised);
    // Complete: 1-2N + 1L(A-K) + 2L + 1-4N
    const isComplete = /^\d{1,2} [A-K] [A-Z]{2} \d{1,4}$/.test(formatted);
    return { formatted, format: "new", isComplete };
  }

  const formatted = formatOld(normalised);
  // Complete old format — either letter-zone or number-province variant
  const isComplete =
    /^[A-Z]{2,3} \d{1,3} (PA|PHA|BA|PH) \d{4}$/.test(formatted) ||
    /^\d{1,2} \d{1,3} (PA|PHA|BA|PH) \d{4}$/.test(formatted);

  return { formatted, format: "old", isComplete };
}

/** Drop-in replacement — returns just the formatted string */
export function formatNepaliPlate(raw: string): string {
  return formatNepaliTwoWheelerPlate(raw).formatted;
}
