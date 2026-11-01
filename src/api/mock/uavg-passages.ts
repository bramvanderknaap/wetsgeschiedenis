import type { MockWet } from "./mockApi";

/*
 * Voorbeeldpassages. De teksten zijn letterlijk overgenomen uit de Kamerstukken op
 * officielebekendmakingen.nl (geraadpleegd 1 november 2026). Paginanummers ontbreken
 * omdat de HTML-versie geen paginering toont.
 *
 * LET OP: de scores, de gemarkeerde kernzinnen en de koppeling aan leden zijn met de
 * hand gekozen om de interface te laten zien. Ze komen niet uit het model.
 */

const url = (n: string) => `https://zoek.officielebekendmakingen.nl/kst-34851-${n}.html`;

export const documenten: MockWet["documenten"] = {
  "kst-34851-4": {
    id: "kst-34851-4",
    soort: "advies-raad-van-state",
    kamer: "II",
    vergaderjaar: "2017/18",
    dossier: "34851",
    ondernummer: "4",
    titel: "Advies Afdeling advisering Raad van State en nader rapport",
    datum: "2017-10-10",
    url: url("4"),
  },
  "kst-34851-3": {
    id: "kst-34851-3",
    soort: "memorie-van-toelichting",
    kamer: "II",
    vergaderjaar: "2017/18",
    dossier: "34851",
    ondernummer: "3",
    titel: "Memorie van toelichting",
    datum: "2017-12-12",
    url: url("3"),
  },
  "kst-34851-7": {
    id: "kst-34851-7",
    soort: "nota-naar-aanleiding-van-verslag",
    kamer: "II",
    vergaderjaar: "2017/18",
    dossier: "34851",
    ondernummer: "7",
    titel: "Nota naar aanleiding van het verslag",
    datum: "2018-02-14",
    url: url("7"),
  },
  "kst-34851-8": {
    id: "kst-34851-8",
    soort: "nota-van-wijziging",
    kamer: "II",
    vergaderjaar: "2017/18",
    dossier: "34851",
    ondernummer: "8",
    titel: "Nota van wijziging",
    datum: "2018-02-14",
    url: url("8"),
  },
  "kst-34851-11": {
    id: "kst-34851-11",
    soort: "amendement",
    kamer: "II",
    vergaderjaar: "2017/18",
    dossier: "34851",
    ondernummer: "11",
    titel: "Amendement van het lid Buitenweg over het maximeren van de journalistieke exceptie",
    datum: "2018-03-08",
    url: url("11"),
  },
  "kst-34851-D": {
    id: "kst-34851-D",
    soort: "memorie-van-antwoord",
    kamer: "I",
    vergaderjaar: "2017/18",
    dossier: "34851",
    ondernummer: "D",
    titel: "Memorie van antwoord",
    datum: "2018-04-18",
    url: url("D"),
  },
};

/** Zoekt de tekenposities van kernzinnen op, zodat de data leesbaar blijft. */
function kern(tekst: string, ...zinnen: string[]): [number, number][] {
  return zinnen.map((z) => {
    const i = tekst.indexOf(z);
    if (i < 0) throw new Error(`Kernzin niet gevonden: ${z.slice(0, 40)}`);
    return [i, i + z.length];
  });
}

type P = MockWet["passages"][number];
function passage(p: Omit<P, "kern"> & { kernzinnen?: string[] }): P {
  const { kernzinnen, ...rest } = p;
  return { ...rest, kern: kernzinnen ? kern(p.tekst, ...kernzinnen) : undefined };
}

export const passages: MockWet["passages"] = [
  // ---------- Artikel 5 ----------
  passage({
    id: "uavg-5-nvw-a",
    artikel: "5",
    leden: ["5"],
    document: "kst-34851-8",
    sectie: "Toelichting, onderdeel A",
    score: 0.93,
    tekst:
      "Deze wijziging is toegelicht in de nota naar aanleiding van het verslag in antwoord op vraag 46 en 84 en verduidelijkt dat, indien een minderjarige of onder curatele gestelde contact opneemt met een niet-commerciële hulp- of adviesdienst, deze dienst geen toestemming van de wettelijk vertegenwoordiger behoeft voor het verwerken van de persoonsgegevens van betrokkene. Op deze wijze wordt voor kinderen of onder curatele gestelden geen onnodige drempel opgeworpen om zelfstandig hulp of advies te vragen. Het is niet nodig een gelijkluidende bepaling op te nemen voor die gevallen waarin artikel 8 AVG van toepassing is. Onder diensten van de informatiemaatschappij als bedoeld in artikel 8 AVG vallen immers uitsluitend diensten die gewoonlijk tegen vergoeding worden verricht.",
    kernzinnen: [
      "Op deze wijze wordt voor kinderen of onder curatele gestelden geen onnodige drempel opgeworpen om zelfstandig hulp of advies te vragen.",
    ],
  }),
  passage({
    id: "uavg-5-mva-12a",
    artikel: "5",
    leden: ["1"],
    document: "kst-34851-D",
    sectie: "Antwoord op vraag 12 (SP)",
    score: 0.88,
    tekst:
      "In de AVG is de leeftijdsgrens waaronder kinderen toestemming van hun ouders moeten hebben in verband met «een rechtstreeks aanbod van diensten van de informatiemaatschappij» gesteld op 16 jaar. Lidstaten hebben op grond van artikel 8 AVG de mogelijkheid daarvan af te wijken (met als ondergrens 13 jaar). Gelet op het uitgangspunt van beleidsneutrale implementatie heeft de regering ervoor gekozen om aan te sluiten bij de hoofdregel.",
    kernzinnen: [
      "Gelet op het uitgangspunt van beleidsneutrale implementatie heeft de regering ervoor gekozen om aan te sluiten bij de hoofdregel.",
    ],
  }),
  passage({
    id: "uavg-5-mva-12b",
    artikel: "5",
    leden: ["1"],
    document: "kst-34851-D",
    sectie: "Antwoord op vraag 12 (SP)",
    score: 0.71,
    tekst:
      "Naar het oordeel van de regering is de bepaling dat jongeren onder de zestien jaar alleen met toestemming van hun ouders bijvoorbeeld een online profiel mogen aanmaken niet in strijd met het recht op privacy. Op dit moment is de leeftijdsgrens in artikel 5 Wbp ook op 16 jaar gesteld.",
    kernzinnen: ["Op dit moment is de leeftijdsgrens in artikel 5 Wbp ook op 16 jaar gesteld."],
  }),

  // ---------- Artikel 22 ----------
  passage({
    id: "uavg-22-mva-15",
    artikel: "22",
    leden: ["1", "2"],
    document: "kst-34851-D",
    sectie: "Antwoord op vraag 15 (PvdA)",
    score: 0.9,
    tekst:
      "Zo verbiedt de AVG – zoals gezegd- het verwerken van bijzondere categorieën persoonsgegevens, maar laat zij tevens ruimte om in nationaal recht uitzonderingen te formuleren op dit verbod. In de UAVG is vervolgens die ruimte ingevuld door waar mogelijk de bepalingen uit de Wbp over te nemen die zien op het verwerken van dit type gegevens.",
    kernzinnen: [
      "In de UAVG is vervolgens die ruimte ingevuld door waar mogelijk de bepalingen uit de Wbp over te nemen die zien op het verwerken van dit type gegevens.",
    ],
  }),
  passage({
    id: "uavg-22-mva-1",
    artikel: "22",
    leden: [],
    document: "kst-34851-D",
    sectie: "Antwoord op vraag 1 (VVD)",
    score: 0.84,
    tekst:
      "Van deze beperkte ruimte die de AVG biedt om regels uit de verordening over te nemen in het nationale recht, is gebruik gemaakt, bijvoorbeeld in artikel 22 UAVG. Dit naar aanleiding van het advies van de Afdeling advisering van de Raad van State om van deze mogelijkheid gebruik te maken voor wat betreft de uitvoering van artikel 9 AVG over bijzondere categorieën persoonsgegevens, zulks omwille van de samenhang en de begrijpelijkheid van de bepalingen.",
    kernzinnen: ["zulks omwille van de samenhang en de begrijpelijkheid van de bepalingen."],
  }),
  passage({
    id: "uavg-22-rvs",
    artikel: "22",
    leden: [],
    document: "kst-34851-4",
    sectie: "Advies, inleidende beschouwing",
    score: 0.52,
    tekst:
      "De Uitvoeringswet vult die ruimte op enkele belangrijke onderdelen in. Het gaat dan bijvoorbeeld om de uitzonderingen op het verbod om bijzondere persoonsgegevens te verwerken en de mogelijkheden om beperkingen aan te brengen op de rechten en verplichtingen die voortvloeien uit de AVG.",
  }),

  // ---------- Artikel 30 ----------
  passage({
    id: "uavg-30-rvs-a",
    artikel: "30",
    leden: [],
    document: "kst-34851-4",
    sectie: "Advies, 2c. De afwegingsruimte van de nationale wetgever",
    score: 0.77,
    tekst:
      "Zo is bijvoorbeeld geen gebruik gemaakt van de mogelijkheid om nadere regels vast te stellen over de verwerking van persoonsgegevens in het kader van de arbeidsverhouding. Ook is geen of althans niet uitdrukkelijk invulling gegeven aan de ruimte om – als uitzondering op het wettelijk verbod – bijzondere persoonsgegevens te verwerken in verband met het algemeen belang op het gebied van de volksgezondheid.",
    kernzinnen: [
      "Ook is geen of althans niet uitdrukkelijk invulling gegeven aan de ruimte om – als uitzondering op het wettelijk verbod – bijzondere persoonsgegevens te verwerken in verband met het algemeen belang op het gebied van de volksgezondheid.",
    ],
  }),
  passage({
    id: "uavg-30-rvs-b",
    artikel: "30",
    leden: [],
    document: "kst-34851-4",
    sectie: "Advies, 2c. De afwegingsruimte van de nationale wetgever",
    score: 0.61,
    tekst:
      "Dit geldt bijvoorbeeld ten aanzien van de door de AVG toegekende bevoegdheden aan de lidstaten om over de verwerking van persoonsgegevens in het kader van de arbeidsverhouding en de verwerking van bijzondere persoonsgegevens in verband met het algemeen belang op het gebied van de volksgezondheid, nadere regels te stellen. Zij adviseert met het oog daarop de toelichting aan te vullen en het wetsvoorstel zo nodig aan te passen.",
  }),

  // ---------- Artikel 40 ----------
  passage({
    id: "uavg-40-nnav",
    artikel: "40",
    leden: [],
    document: "kst-34851-7",
    sectie: "1. Inleiding",
    score: 0.86,
    tekst:
      "Krachtens artikel 22 AVG heeft de betrokkene het recht niet te worden onderworpen aan een uitsluitend op geautomatiseerde verwerking gebaseerd besluit. Artikel 40 UAVG voorziet in een uitzondering. Als de UAVG niet op 25 mei 2018 in werking treedt, zal louter geautomatiseerde besluitvorming zonder menselijke tussenkomst vanaf die datum in beginsel niet meer zijn toegestaan. Concreet zou dat bijvoorbeeld betekenen dat bij de Belastingdienst geen geautomatiseerde besluitvorming meer kan plaatsvinden en uitkeringsinstanties geen uitkeringen meer zouden kunnen verstrekken.",
    kernzinnen: ["Artikel 40 UAVG voorziet in een uitzondering."],
  }),

  // ---------- Artikel 43 ----------
  passage({
    id: "uavg-43-mva-6a",
    artikel: "43",
    leden: [],
    document: "kst-34851-D",
    sectie: "Antwoord op vraag 6 (VVD)",
    score: 0.95,
    tekst:
      "Op grond van de zogenoemde journalistieke exceptie zijn de UAVG en de meeste materiële normen van de AVG niet van toepassing op verwerkingen van persoonsgegevens voor uitsluitend journalistieke doeleinden of voor academische, artistieke of literaire uitdrukkingsvormen. Onder gegevensverwerkingen voor voornoemde doelen moeten niet alleen publicaties, maar ook voorbereidingshandelingen voor een publicatie worden begrepen. Zo kan het in voorbereiding op een publicatie nodig zijn om gegevens te vergaren, te registreren en te analyseren. Journalistieke, academische, artistieke of literaire voorbereidingshandelingen voor een publicatie waarbij persoonsgegevens worden verwerkt, vallen alle aldus binnen reikwijdte van de journalistieke exceptie.",
    kernzinnen: [
      "Onder gegevensverwerkingen voor voornoemde doelen moeten niet alleen publicaties, maar ook voorbereidingshandelingen voor een publicatie worden begrepen.",
    ],
  }),
  passage({
    id: "uavg-43-mva-6b",
    artikel: "43",
    leden: [],
    document: "kst-34851-D",
    sectie: "Antwoord op vraag 6 (VVD)",
    score: 0.89,
    tekst:
      "Afhankelijk van de feitelijke omstandigheden zal moeten worden beoordeeld of een verwerking uitsluitend voor een van de genoemde doeleinden plaatsvindt. De verwerkingsverantwoordelijke zal daarbij ook moeten afwegen of de betreffende verwerking voldoet aan de beginselen van proportionaliteit en noodzakelijkheid. De noodzakelijkheidseis strekt daarbij overigens niet zo ver dat verwerking van persoonsgegevens alleen is toegestaan indien vaststaat dat deze uitmondt in een publicatie. In de praktijk is immers vaak niet mogelijk om op voorhand vast te stellen of journalistieke, academische, artistieke of literaire werkzaamheden daadwerkelijk tot een publicatie leiden.",
    kernzinnen: [
      "De noodzakelijkheidseis strekt daarbij overigens niet zo ver dat verwerking van persoonsgegevens alleen is toegestaan indien vaststaat dat deze uitmondt in een publicatie.",
    ],
  }),
  passage({
    id: "uavg-43-mva-11a",
    artikel: "43",
    leden: [],
    document: "kst-34851-D",
    sectie: "Antwoord op vraag 11 (SP)",
    score: 0.82,
    tekst:
      "Op grond van artikel 85 AVG, is in artikel 43 UAVG geregeld dat de UAVG en het grootste deel van de AVG zijn uitgezonderd voor gegevensverwerkingen voor uitsluitend journalistieke doeleinden of ten behoeve van academische, artistieke of literaire uitdrukkingsvormen. Dat betekent feitelijk dat enkel een aantal algemene beginselen en basale verplichtingen voor de verwerkingsverantwoordelijke van toepassingen zijn op gegevensverwerkingen in het kader van de genoemde doelen, zoals het beginsel van proportionaliteit en de verplichting om gegevens op passende wijze te beveiligen.",
    kernzinnen: [
      "Dat betekent feitelijk dat enkel een aantal algemene beginselen en basale verplichtingen voor de verwerkingsverantwoordelijke van toepassingen zijn op gegevensverwerkingen in het kader van de genoemde doelen",
    ],
  }),
  passage({
    id: "uavg-43-mva-11b",
    artikel: "43",
    leden: [],
    document: "kst-34851-D",
    sectie: "Antwoord op vraag 11 (SP)",
    score: 0.74,
    tekst:
      "Een verdere verruiming van de journalistieke exceptie zou op gespannen voet staan met de AVG, omdat de AVG vereist dat het recht van uitingsvrijheid en het recht op privacy met elkaar «in evenwicht» worden gebracht. Daarbij geldt het principe dat tussen deze rechten in beginsel geen rangorde bestaat en dat geen van beide rechten voorrang heeft op de ander.",
    kernzinnen: [
      "Daarbij geldt het principe dat tussen deze rechten in beginsel geen rangorde bestaat en dat geen van beide rechten voorrang heeft op de ander.",
    ],
  }),
  passage({
    id: "uavg-43-am-11",
    artikel: "43",
    leden: [],
    document: "kst-34851-11",
    sectie: "Toelichting",
    score: 0.63,
    tekst:
      "Indiener stelt voor om de in de Algemene verordening gegevensbescherming geboden ruimte voor uitzonderingen inzake journalistieke doeleinden volledig in de Uitvoeringswet Avg over te nemen. Met het oog op het grote belang van vrije nieuwsgaring voor de werking van de democratische rechtstaat valt te verdedigen dat de journalistieke exceptie zoveel mogelijk wordt gehonoreerd. Te vrezen valt dat bij het handhaven van de huidige regeling bronnen en klokkenluiders minder snel geneigd zijn om misstanden via de media naar buiten te brengen. Een «chilling effect» op de media en hun bronnen kan zich uiteindelijk uiten in een ongewenste vorm van zelfcensuur.",
  }),
];
