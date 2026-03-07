export interface WiegandFormat {
  name: string;
  totalBits: number;
  facilityBits: number;
  idBits: number;
  facilityCode: number;
  idNumber: number;
  facilityOverflow: boolean;
  idOverflow: boolean;
  binary: string;
  hex: string;
}

export interface WiegandResult {
  formats: WiegandFormat[];
}

function evenParity(bits: string): number {
  const ones = bits.split("").filter((b) => b === "1").length;
  return ones % 2 === 0 ? 0 : 1;
}

function oddParity(bits: string): number {
  return evenParity(bits) === 0 ? 1 : 0;
}

function buildWiegandBinary(
  facilityCode: number,
  facilityBits: number,
  idNumber: number,
  idBits: number
): string {
  const facilityBin = facilityCode.toString(2).padStart(facilityBits, "0");
  const idBin = idNumber.toString(2).padStart(idBits, "0");
  const dataBits = facilityBin + idBin;
  const halfLen = Math.floor(dataBits.length / 2);
  const firstHalf = dataBits.slice(0, halfLen);
  const secondHalf = dataBits.slice(halfLen);
  const leadParity = evenParity(firstHalf);
  const trailParity = oddParity(secondHalf);
  return `${leadParity}${dataBits}${trailParity}`;
}

function checkOverflow(value: number, bits: number): boolean {
  return value >= 1 << bits;
}

function truncateToFit(value: number, bits: number): number {
  return value & ((1 << bits) - 1);
}

export function convertToWiegand(
  agencyCode: number,
  transponderSerialNumber: number
): WiegandResult {
  const formatDefs = [
    { name: "26-bit", totalBits: 26, facilityBits: 8, idBits: 16 },
    { name: "34-bit", totalBits: 34, facilityBits: 16, idBits: 16 },
    { name: "37-bit", totalBits: 37, facilityBits: 17, idBits: 18 },
  ];

  const formats: WiegandFormat[] = formatDefs.map((def) => {
    const facilityOverflow = checkOverflow(agencyCode, def.facilityBits);
    const idOverflow = checkOverflow(transponderSerialNumber, def.idBits);
    const facilityCode = truncateToFit(agencyCode, def.facilityBits);
    const idNumber = truncateToFit(transponderSerialNumber, def.idBits);
    const binary = buildWiegandBinary(
      facilityCode,
      def.facilityBits,
      idNumber,
      def.idBits
    );
    const hex = parseInt(binary, 2)
      .toString(16)
      .toUpperCase()
      .padStart(Math.ceil(def.totalBits / 4), "0");

    return {
      name: def.name,
      totalBits: def.totalBits,
      facilityBits: def.facilityBits,
      idBits: def.idBits,
      facilityCode,
      idNumber,
      facilityOverflow,
      idOverflow,
      binary,
      hex,
    };
  });

  return { formats };
}
