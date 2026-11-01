/**
 * Datacontract tussen frontend en backend.
 *
 * Alle identifiers volgen de officiële bronnen, zodat elke wet erbij kan
 * zonder het contract te wijzigen:
 *  - wetten:      BWB-id van wetten.overheid.nl (bijv. "BWBR0040940")
 *  - artikelen:   artikelnummer als string, zoals op wetten.overheid.nl ("5", "7:17", "22a")
 *  - Kamerstukken: id van officielebekendmakingen.nl (bijv. "kst-34851-3")
 *  - Handelingen:  id van officielebekendmakingen.nl (bijv. "h-tk-20172018-83-11")
 *
 * Zie docs/API.md voor de endpoints.
 */

export type BwbId = string;
export type ArtikelNummer = string;

/** Vindplaats in het Staatsblad. De frontend maakt er "Stb. 2018, 144" en de link naar officielebekendmakingen.nl van. */
export interface Staatsblad {
  jaar: number;
  nummer: number;
  /** Datum van de wet ("Wet van 16 mei 2018"), ISO 8601. */
  datum?: string;
  /** Link naar de publicatie. Zonder link maakt de frontend er zelf een (alleen vanaf 1995, eerder staat niet op officielebekendmakingen.nl). */
  url?: string;
}

/** Eén wet in de catalogus. */
export interface Wet {
  bwbId: BwbId;
  /** Officiële citeertitel, bijv. "Uitvoeringswet Algemene verordening gegevensbescherming". */
  citeertitel: string;
  /** Gangbare afkorting, bijv. "UAVG". */
  afkorting?: string;
  /** Kamerstukdossiers van het wetsvoorstel, bijv. ["34851"]. Een wet kan er meer hebben. */
  dossiers: string[];
  /** Datum van inwerkingtreding van de geldende versie (ISO 8601). */
  geldigVanaf?: string;
  /** Link naar de wet op wetten.overheid.nl. */
  bronUrl: string;
  /** Publicatie van de oorspronkelijke wet in het Staatsblad, bijv. Stb. 2018, 144. */
  staatsblad?: Staatsblad;
  aantalArtikelen: number;
  /** Aantal artikelen waarvoor passages beschikbaar zijn. */
  aantalArtikelenMetPassages: number;
}

/** Indeling van een wet. Volgt de BWB-structuur (hoofdstuk, titel, afdeling, paragraaf, ...). */
export type StructuurSoort = "boek" | "deel" | "hoofdstuk" | "titel" | "afdeling" | "paragraaf" | "subparagraaf";

export interface StructuurElement {
  soort: StructuurSoort;
  /** Nummer zoals in de wet: "1", "3", "3.1", "2A". */
  nummer: string;
  titel: string;
  kinderen: StructuurNode[];
}

export interface ArtikelVerwijzing {
  soort: "artikel";
  nummer: ArtikelNummer;
  titel?: string;
  /** Aantal passages dat het model aan dit artikel koppelt. 0 = nog niets. */
  aantalPassages: number;
  /** Artikel is vervallen of nog niet in werking. */
  vervallen?: boolean;
}

export type StructuurNode = StructuurElement | ArtikelVerwijzing;

export interface Onderdeel {
  /** "a", "b", "1°". Leeg bij een opsomming zonder letters, zoals definities. */
  label: string;
  tekst: string;
  /** Onderdelen binnen een onderdeel, zoals 1°, 2° onder b. */
  onderdelen?: Onderdeel[];
}

export interface Lid {
  /** "1", "2", ... Leeg bij een artikel zonder leden. */
  nummer: string;
  /** Alinea's zijn gescheiden door een regeleinde ("\n"). */
  tekst: string;
  onderdelen?: Onderdeel[];
  /** Tekst die na de opsomming komt. */
  slot?: string;
}

export interface Artikel {
  bwbId: BwbId;
  nummer: ArtikelNummer;
  titel?: string;
  leden: Lid[];
  /** Artikel staat al in de wet, maar is nog niet in werking getreden. */
  nogNietInWerking?: boolean;
  /** Artikel is vervallen; er is geen tekst meer. */
  vervallen?: boolean;
  /** Waar het artikel in de wet staat, van buiten naar binnen. */
  pad: { soort: StructuurSoort; nummer: string; titel: string }[];
  /** Link naar dit artikel op wetten.overheid.nl. */
  bronUrl: string;
  /** Vorige en volgende artikel, voor bladeren. */
  vorige?: ArtikelNummer;
  volgende?: ArtikelNummer;
}

/** Soort parlementair stuk. Uitbreidbaar; de frontend toont onbekende soorten als "Overig". */
export type DocumentSoort =
  | "memorie-van-toelichting"
  | "advies-raad-van-state"
  | "nader-rapport"
  | "verslag"
  | "nota-naar-aanleiding-van-verslag"
  | "nota-van-wijziging"
  | "amendement"
  | "motie"
  | "handelingen"
  | "memorie-van-antwoord"
  | "brief"
  | "overig";

export interface ParlementairDocument {
  /** Id op officielebekendmakingen.nl, bijv. "kst-34851-3". */
  id: string;
  soort: DocumentSoort;
  /** "II" (Tweede Kamer) of "I" (Eerste Kamer). */
  kamer: "I" | "II";
  /** Vergaderjaar, bijv. "2017/18". */
  vergaderjaar: string;
  /** Dossiernummer, bijv. "34851". */
  dossier: string;
  /** Ondernummer, bijv. "3". Leeg bij Handelingen. */
  ondernummer?: string;
  titel: string;
  /** ISO 8601. */
  datum: string;
  /** Link naar het stuk op officielebekendmakingen.nl. */
  url: string;
}

export interface Passage {
  id: string;
  bwbId: BwbId;
  artikel: ArtikelNummer;
  /** Leden waar de passage over gaat. Leeg = het artikel als geheel. */
  leden: string[];
  document: ParlementairDocument;
  /** Pagina in het stuk, als die bekend is. */
  pagina?: string;
  /** Kopje of paragraaf in het stuk waar de passage onder staat. */
  sectie?: string;
  /** Letterlijke tekst uit het stuk. */
  tekst: string;
  /**
   * De zin(nen) die volgens het model de kern zijn: tekenposities [begin, eind)
   * in `tekst`. De frontend markeert deze.
   */
  kern?: [number, number][];
  /** Hoe nuttig het model de passage vindt, 0 tot 1. Bepaalt de volgorde. */
  score: number;
}

export interface PassageFilter {
  /** Alleen passages over dit lid (passages over het hele artikel blijven zichtbaar). */
  lid?: string;
  soorten?: DocumentSoort[];
}

export interface ZoekResultaat {
  bwbId: BwbId;
  afkorting?: string;
  artikel: ArtikelNummer;
  artikelTitel?: string;
  /** Stukje tekst rond de treffer. */
  fragment: string;
  /** Waar de treffer zit. */
  bron: "wettekst" | "passage";
}

export type Oordeel = "nuttig" | "niet-nuttig";

export interface Feedback {
  passageId: string;
  oordeel: Oordeel;
}
