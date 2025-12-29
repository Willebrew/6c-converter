import {
  AGENCY_CODES,
  VEHICLE_TYPES,
  HOV_DECLARATIONS,
  VERSIONS,
} from "./constants";

export interface Classification {
  assigned: boolean;
  vehicleTypeCode: number;
  vehicleType: string;
  axles: number | string;
  weight: string;
  rearTires: string;
}

export interface Decoded6CTOC {
  rawHex: string;
  pcBits: string | null;
  uii: string;

  // Header info
  dsfid: number;
  is6ctoc: boolean;

  // Decoded fields
  agencyUse: number;
  classification: Classification;
  hovDeclaration: number;
  hovDescription: string;
  version: number;
  versionDescription: string;
  agencyCode: number;
  agencyInfo: [string, string, string]; // [acronym, name, state]
  transponderSerialNumber: number;
  uiiValidationHash: number;

  // Computed values
  checkDigit: number;
  printedNumber: string;
  barcodeContent: string;
}

/**
 * Convert hex string to binary string.
 */
function hexToBits(hexStr: string): string {
  const num = BigInt("0x" + hexStr);
  return num.toString(2).padStart(hexStr.length * 4, "0");
}

/**
 * Extract bits from a binary string (0-indexed).
 */
function extractBits(bits: string, start: number, length: number): number {
  if (length === 0) return 0;
  return parseInt(bits.slice(start, start + length), 2);
}

/**
 * Calculate Luhn (mod10) check digit.
 * Per 6C TOC spec: calculated on last 2 digits of 4-digit agency + all 10 TSN digits
 *
 * Note: 6C TOC uses a Luhn variant that doubles ODD positions from LEFT (0-indexed),
 * not the standard algorithm that doubles from the right.
 */
function calculateLuhnCheckDigit(digits: string): number {
  let total = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = parseInt(digits[i], 10);
    if (i % 2 === 1) {
      // Double odd positions (1, 3, 5, ...) from left
      d *= 2;
      if (d > 9) {
        d -= 9; // Sum digits (same as subtract 9 for single digit doubling)
      }
    }
    total += d;
  }
  return (10 - (total % 10)) % 10;
}

/**
 * Clean and validate hex input.
 * Returns [pcBits, uii] tuple.
 */
function cleanHexInput(hexString: string): [string | null, string] {
  const cleaned = hexString.trim().replace(/^#/, "").toUpperCase();

  if (cleaned.length === 28) {
    // Includes PC (Protocol Control) bits - 4 hex chars
    return [cleaned.slice(0, 4), cleaned.slice(4)];
  } else if (cleaned.length === 24) {
    // UII only (96 bits)
    return [null, cleaned];
  } else {
    throw new Error(
      `Invalid hex length: ${cleaned.length}. Expected 24 (UII only) or 28 (PC + UII).`
    );
  }
}

/**
 * Check if a tag is a 6C TOC toll tag (DSFID = 0x3E).
 */
export function is6ctocTag(hexString: string): boolean {
  try {
    const [, uii] = cleanHexInput(hexString);
    const dsfid = parseInt(uii.slice(0, 2), 16);
    return dsfid === 0x3e;
  } catch {
    return false;
  }
}

/**
 * Decode a 6C TOC toll transponder tag.
 *
 * Memory Map (96-bit UII):
 * - Bits 0-7:   DSFID (0x3E for 6C TOC)
 * - Bits 8-20:  Agency Use (13 bits)
 * - Bits 21-32: Classification (12 bits)
 * - Bits 33-35: HOV Declaration (3 bits)
 * - Bits 36-39: Version (4 bits)
 * - Bits 40-51: Agency Code (12 bits)
 * - Bits 52-79: Transponder Serial Number (28 bits)
 * - Bits 80-95: UII Validation Hash (16 bits)
 */
export function decode6ctoc(hexString: string): Decoded6CTOC {
  const [pcBits, uii] = cleanHexInput(hexString);

  // Convert UII to binary
  const uiiBits = hexToBits(uii);

  if (uiiBits.length !== 96) {
    throw new Error(`UII must be 96 bits, got ${uiiBits.length}`);
  }

  // Extract DSFID (Data Storage Format Identifier)
  const dsfid = extractBits(uiiBits, 0, 8);
  const is6ctoc = dsfid === 0x3e;

  if (!is6ctoc) {
    throw new Error(
      `Not a 6C TOC tag. DSFID is 0x${dsfid.toString(16).toUpperCase()}, expected 0x3E`
    );
  }

  // Extract Agency Use (13 bits) - for agency-specific info
  const agencyUse = extractBits(uiiBits, 8, 13);

  // Extract Classification (12 bits)
  const classAssigned = extractBits(uiiBits, 21, 1);
  const vehicleType = extractBits(uiiBits, 22, 5);
  const vehicleAxles = extractBits(uiiBits, 27, 4);
  const vehicleWeight = extractBits(uiiBits, 31, 1);
  const rearTires = extractBits(uiiBits, 32, 1);

  const classification: Classification = {
    assigned: Boolean(classAssigned),
    vehicleTypeCode: vehicleType,
    vehicleType: VEHICLE_TYPES[vehicleType] || `Unknown (${vehicleType})`,
    axles: vehicleAxles >= 2 ? vehicleAxles : "Undefined",
    weight: vehicleWeight ? "> 7,000 lbs" : "≤ 7,000 lbs",
    rearTires: rearTires ? "Dual" : "Single",
  };

  // Extract HOV Declaration (3 bits)
  const hovDeclaration = extractBits(uiiBits, 33, 3);
  const hovDescription =
    HOV_DECLARATIONS[hovDeclaration] || `Unknown (${hovDeclaration})`;

  // Extract Version (4 bits)
  const version = extractBits(uiiBits, 36, 4);
  const versionDescription = VERSIONS[version] || `Unknown (${version})`;

  // Extract Agency Code (12 bits)
  const agencyCode = extractBits(uiiBits, 40, 12);
  const agencyInfo: [string, string, string] = AGENCY_CODES[agencyCode] || [
    "Unknown",
    `Agency ${agencyCode}`,
    "??",
  ];

  // Extract Transponder Serial Number (28 bits)
  const tsn = extractBits(uiiBits, 52, 28);

  // Extract UII Validation Hash (16 bits)
  const uiiHash = extractBits(uiiBits, 80, 16);

  // Calculate check digit using Luhn algorithm
  // Per spec: last 2 digits of 4-digit agency code + all 10 digits of TSN
  const agency4digit = agencyCode.toString().padStart(4, "0");
  const tsn10digit = tsn.toString().padStart(10, "0");
  const luhnInput = agency4digit.slice(2, 4) + tsn10digit; // Last 2 digits of agency + TSN
  const checkDigit = calculateLuhnCheckDigit(luhnInput);

  // Format printed number (per spec section 3.3)
  // Format: <AA>AA  TTTTTTTTTT  L (agency without leading zeros, TSN with leading zeros)
  const printedNumber = `${agencyCode} ${tsn10digit} ${checkDigit}`;

  // Barcode content (per spec): AAAATTTTTTTTTTL
  const barcodeContent = `${agency4digit}${tsn10digit}${checkDigit}`;

  return {
    rawHex: hexString.toUpperCase(),
    pcBits,
    uii,
    dsfid,
    is6ctoc,
    agencyUse,
    classification,
    hovDeclaration,
    hovDescription,
    version,
    versionDescription,
    agencyCode,
    agencyInfo,
    transponderSerialNumber: tsn,
    uiiValidationHash: uiiHash,
    checkDigit,
    printedNumber,
    barcodeContent,
  };
}
