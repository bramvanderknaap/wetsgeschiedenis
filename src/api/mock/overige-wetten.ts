import type { MockWet } from "./mockApi";
import { bwBoek1 } from "./bw-boek-1";

/**
 * Wetten die al in de lijst staan, maar waarvan de tekst en de wetsgeschiedenis
 * pas met de backend komen. Alleen de gegevens zijn ingevuld, elk met bron
 * (geraadpleegd 1 november 2026):
 * - BWB-id en titel: wetten.overheid.nl/<BWB-id>
 * - Staatsblad en datum van de wet: zoek.officielebekendmakingen.nl/stb-<jaar>-<nummer>
 *   (Omgevingswet), njb.nl/wetgeving/staatsbladen (Energiewet, Wwke)
 * - Kamerstukken: officielebekendmakingen.nl en eerstekamer.nl
 */
type Gegevens = MockWet["wet"];

const nogNietIngeladen = (wet: Gegevens): MockWet => ({
  wet,
  structuur: [],
  artikelen: {},
  documenten: {},
  passages: [],
});

export const omgevingswet = nogNietIngeladen({
  bwbId: "BWBR0037885",
  citeertitel: "Omgevingswet",
  afkorting: "Ow",
  dossiers: ["33962"],
  staatsblad: { jaar: 2016, nummer: 156, datum: "2016-03-23" },
  bronUrl: "https://wetten.overheid.nl/BWBR0037885",
});

export const energiewet = nogNietIngeladen({
  bwbId: "BWBR0050714",
  citeertitel: "Energiewet",
  dossiers: ["36378"],
  staatsblad: { jaar: 2025, nummer: 12, datum: "2024-12-11" },
  bronUrl: "https://wetten.overheid.nl/BWBR0050714",
});

/**
 * Het BWB-id van de Wwke kon nog niet worden opgezocht (wetten.overheid.nl laat
 * geen geautomatiseerd zoeken toe). Tot de backend het levert, dient de
 * Staatsblad-id als sleutel en verwijst de bron naar het Staatsblad.
 * Inwerkingtreding 15 augustus 2026: njb.nl en rijksoverheid.nl (nieuwsbericht 15-08-2026).
 */
export const wwke = nogNietIngeladen({
  bwbId: "stb-2026-188",
  citeertitel: "Wet weerbaarheid kritieke entiteiten",
  afkorting: "Wwke",
  dossiers: ["36765"],
  geldigVanaf: "2026-08-15",
  staatsblad: { jaar: 2026, nummer: 188, datum: "2026-07-08" },
  bronUrl: "https://zoek.officielebekendmakingen.nl/stb-2026-188.html",
});

const bwBoek = (boek: string, bwbId: string) =>
  nogNietIngeladen({
    bwbId,
    citeertitel: `Burgerlijk Wetboek Boek ${boek}`,
    afkorting: `Boek ${boek} BW`,
    dossiers: [],
    bronUrl: `https://wetten.overheid.nl/${bwbId}`,
  });

/** Boek 1 komt uit het XML-bestand (zie bw-boek-1.ts); de andere boeken alleen met hun gegevens. */
export const burgerlijkWetboek = [
  bwBoek1,
  bwBoek("2", "BWBR0003045"),
  bwBoek("3", "BWBR0005291"),
  bwBoek("4", "BWBR0002761"),
  bwBoek("5", "BWBR0005288"),
  bwBoek("6", "BWBR0005289"),
  bwBoek("7", "BWBR0005290"),
];
