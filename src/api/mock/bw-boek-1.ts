import type { MockWet } from "./mockApi";
import wettekst from "./data/BWBR0002656.json";

/**
 * Burgerlijk Wetboek Boek 1 (Personen- en familierecht).
 * Indeling en wettekst zijn omgezet uit het XML-bestand van wetten.overheid.nl
 * (data/BWBR0002656_2025-07-05_0.xml, versie geldig vanaf 5 juli 2025) met
 * scripts/bwb_naar_json.py. Nog geen passages.
 */
export const bwBoek1: MockWet = {
  wet: { ...wettekst.wet, afkorting: "Boek 1 BW" },
  structuur: wettekst.structuur as MockWet["structuur"],
  artikelen: wettekst.artikelen as MockWet["artikelen"],
  documenten: {},
  passages: [],
};
