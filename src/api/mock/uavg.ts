import type { MockWet } from "./mockApi";
import wettekst from "./data/BWBR0040940.json";
import wetlink from "./data/BWBR0040940-passages.json";

/**
 * Uitvoeringswet AVG.
 * Indeling en wettekst: omgezet uit het XML-bestand van wetten.overheid.nl met
 * scripts/bwb_naar_json.py.
 * Passages: uit wetlink (python3 -m wetlink.naar_frontend BWBR0040940). De
 * eigen toelichting en amendementen komen uit de opbouw van de Kamerstukken
 * (score 1,0 en 0,97); de overige passages hebben een score van het model.
 */
export const uavg: MockWet = {
  wet: { ...wettekst.wet, afkorting: "UAVG" },
  structuur: wettekst.structuur as MockWet["structuur"],
  artikelen: wettekst.artikelen as MockWet["artikelen"],
  documenten: wetlink.documenten as MockWet["documenten"],
  passages: wetlink.passages as MockWet["passages"],
};
