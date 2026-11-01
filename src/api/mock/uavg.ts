import type { MockWet } from "./mockApi";
import wettekst from "./data/BWBR0040940.json";
import { documenten, passages } from "./uavg-passages";

/**
 * Voorbeelddata Uitvoeringswet AVG.
 * Indeling en wettekst zijn omgezet uit het XML-bestand van wetten.overheid.nl
 * (data/BWBR0040940_2026-09-01_0.xml, versie geldig vanaf 1 september 2026) met
 * scripts/bwb_naar_json.py. De passages staan in uavg-passages.ts.
 */
export const uavg: MockWet = {
  wet: { ...wettekst.wet, afkorting: "UAVG" },
  structuur: wettekst.structuur as MockWet["structuur"],
  artikelen: wettekst.artikelen as MockWet["artikelen"],
  documenten,
  passages,
};
