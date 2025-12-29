// 6C TOC Agency Codes - Updated February 17, 2021
// Source: http://www.6c-toc.com/sites/default/files/6C Coalition Agency Codes Feb 17 2021.pdf
// Format: agency_code -> [acronym, name, state/region]
export const AGENCY_CODES: Record<number, [string, string, string]> = {
  0: ["Reserved", "Reserved", "N/A"],
  17: ["SC", "Southern Connector", "SC"],
  33: ["NCTA", "North Carolina Toll Authority", "NC"],
  35: ["FTE", "Florida's Turnpike Enterprise", "FL"],
  55: ["OTA", "Oklahoma Turnpike Authority", "OK"],
  61: ["HDBC", "Halifax Dartmouth Bridge Commission", "NS"],
  64: ["FTE", "Florida's Turnpike Enterprise", "FL"],
  65: ["FTE", "Florida's Turnpike Enterprise", "FL"],
  70: ["AR", "American Roads", "US"],
  71: ["DWT", "Detroit Windsor Tunnel", "MI"],
  77: ["WSDOT", "Washington State Department of Transportation", "WA"],
  78: ["WSDOT", "Washington State Department of Transportation (Legacy)", "WA"],
  79: ["PlusPass", "PlusPass", "US"],
  99: ["CFX", "Central Florida Expressway", "FL"],
  101: ["BATA", "Bay Area Toll Authority", "CA"],
  102: ["Cobequid", "Cobequid Pass - Western Alignment Corporation", "NS"],
  103: ["TCA", "Transportation Corridor Agencies", "CA"],
  104: ["Caltrans", "California Department of Transportation", "CA"],
  105: ["GGBHTD", "Golden Gate Bridge, Highway and Tunnel District", "CA"],
  106: ["LACMTA", "Los Angeles County Metropolitan Transportation Authority", "CA"],
  107: ["SR91", "SR 91 Express Lanes", "CA"],
  108: ["RCTC", "Riverside County Transportation Commission", "CA"],
  109: ["SANDAG", "San Diego Association of Governments", "CA"],
  110: ["VTA", "Santa Clara Valley Transportation Authority", "CA"],
  111: ["SBX", "South Bay Expressway, LLC", "CA"],
  112: ["Sunol JPA", "Sunol SMART Carpool Lanes Joint Powers Authority", "CA"],
  113: ["SFCTA", "San Francisco County Transportation Authority", "CA"],
  114: ["SANBAG", "San Bernardino Associated Governments", "CA"],
  115: ["A25", "Concession A25 sec", "QC"],
  116: ["POHR", "Port of Hood River", "OR"],
  117: ["Neology", "Neology", "US"],
  118: ["MHAB", "McAllen-Hidalgo & Anzalduas Bridges", "TX"],
  119: ["PRIB", "Pharr-Reynosa International Bridge", "TX"],
  120: ["TransCore", "TransCore", "US"],
  121: ["CCRMA", "Cameron County Regional Mobility Authority", "TX"],
  122: ["Starr", "Starr County International Bridge", "TX"],
  124: ["MBA", "Mackinac Bridge Authority", "MI"],
  125: ["BestPass", "BestPass", "US"],
  126: ["Kapsch", "Kapsch", "US"],
  140: ["LAWA", "Los Angeles World Airports", "CA"],
  194: ["E-470", "E-470 Public Highway Authority", "CO"],
  321: ["SRTA", "State Road & Tollway Authority", "GA"],
  448: ["PRHTA", "Puerto Rico Highway and Transportation Authority", "PR"],
  449: ["LSIORB", "Ohio River Bridges (Louisville)", "KY"],
  450: ["LADOTD", "Louisiana Department of Transportation and Development", "LA"],
  451: ["GNOEC", "Greater New Orleans Expressway Commission", "LA"],
  1409: ["UDOT", "Utah Department of Transportation", "UT"],
  2305: ["TI Corp", "Transportation Investment Corporation", "BC"],
  2306: ["Merseyflow", "Merseyflow", "UK"],
  4000: ["ATL", "Hartsfield-Jackson Atlanta International Airport", "GA"],
};

// Vehicle Classification from EZPass spec (Appendix C)
export const VEHICLE_TYPES: Record<number, string> = {
  0: "Undefined",
  1: "Automobile",
  2: "Motorcycle",
  3: "Pickup Truck",
  4: "Van (seats 1-9)",
  5: "Minibus (seats 10-15)",
  6: "Bus (seats 16+)",
  7: "Recreational Vehicle",
  8: "Truck",
  9: "Auto Transporter (≤65')",
  10: "Auto Transporter (>65')",
  11: "Tractor & Trailer (≤48')",
  12: "Tractor & Trailer (>48')",
  13: "Tractor & Dual Trailers (each ≤28.5')",
  14: "Tractor & Dual Trailers (each >28.5')",
  15: "Tractor & Dual Trailers (mixed)",
  16: "Undefined",
  17: "Tractor/Mobile Home Combination",
};

// HOV Declaration values
export const HOV_DECLARATIONS: Record<number, string> = {
  0: "Single Mode (default)",
  1: "SOV (non-carpool)",
  2: "HOV 2+",
  3: "HOV 3+",
  4: "Carpool (as defined by roadway)",
  5: "Reserved",
  6: "Reserved",
  7: "Reserved",
};

// Programming Version
export const VERSIONS: Record<number, string> = {
  0: "Unassigned",
  1: "Version 1.0",
  2: "Version 2.0",
  3: "Version 3.0",
};

// Sample tags for testing
export const SAMPLE_TAGS = [
  { hex: "31B03E9400000407500001561F98", expected: "117 0000000342 0" },
  { hex: "31B03E000000230750000129227E", expected: "117 0000000297 6" },
];
