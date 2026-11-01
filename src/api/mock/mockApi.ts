import type { WetsgeschiedenisApi } from "../client";
import { NietGevonden } from "../errors";
import type {
  Artikel,
  ArtikelNummer,
  BwbId,
  Feedback,
  Lid,
  ParlementairDocument,
  Passage,
  PassageFilter,
  StructuurNode,
  StructuurSoort,
  Wet,
  ZoekResultaat,
} from "../types";
import { uavg } from "./uavg";
import { burgerlijkWetboek, energiewet, omgevingswet, wwke } from "./overige-wetten";

/** Vorm van de voorbeelddata per wet. Zo kan er makkelijk een tweede wet bij. */
export interface MockWet {
  wet: Omit<Wet, "aantalArtikelen" | "aantalArtikelenMetPassages">;
  /** Structuur zonder tellingen; die rekent de mock zelf uit. */
  structuur: MockNode[];
  artikelen: Record<ArtikelNummer, { titel?: string; leden: Lid[] }>;
  documenten: Record<string, ParlementairDocument>;
  passages: (Omit<Passage, "document" | "bwbId"> & { document: string })[];
}

export type MockNode =
  | { soort: Exclude<StructuurSoort, never>; nummer: string; titel: string; kinderen: MockNode[] }
  | { soort: "artikel"; nummer: ArtikelNummer; titel?: string };

const WETTEN: MockWet[] = [uavg, omgevingswet, energiewet, wwke, ...burgerlijkWetboek];

const wacht = (ms = 120) => new Promise((r) => setTimeout(r, ms));

export class MockApi implements WetsgeschiedenisApi {
  private vind(bwbId: BwbId): MockWet {
    const w = WETTEN.find((x) => x.wet.bwbId === bwbId);
    if (!w) throw new NietGevonden(`Wet ${bwbId}`);
    return w;
  }

  private passagesVan(w: MockWet, nummer: ArtikelNummer): Passage[] {
    return w.passages
      .filter((p) => p.artikel === nummer)
      .map((p) => ({ ...p, bwbId: w.wet.bwbId, document: w.documenten[p.document] }))
      .sort((a, b) => b.score - a.score);
  }

  private artikelVolgorde(w: MockWet): MockNode[] {
    const uit: MockNode[] = [];
    const loop = (ns: MockNode[]) =>
      ns.forEach((n) => (n.soort === "artikel" ? uit.push(n) : loop(n.kinderen)));
    loop(w.structuur);
    return uit;
  }

  private metTellingen(w: MockWet): Wet {
    const arts = this.artikelVolgorde(w);
    return {
      ...w.wet,
      aantalArtikelen: arts.length,
      aantalArtikelenMetPassages: arts.filter((a) => this.passagesVan(w, a.nummer).length > 0).length,
    };
  }

  async wetten() {
    await wacht();
    return WETTEN.map((w) => this.metTellingen(w));
  }

  async wet(bwbId: BwbId) {
    await wacht();
    return this.metTellingen(this.vind(bwbId));
  }

  async structuur(bwbId: BwbId): Promise<StructuurNode[]> {
    await wacht();
    const w = this.vind(bwbId);
    const zet = (n: MockNode): StructuurNode =>
      n.soort === "artikel"
        ? {
            soort: "artikel",
            nummer: n.nummer,
            titel: n.titel ?? w.artikelen[n.nummer]?.titel,
            aantalPassages: this.passagesVan(w, n.nummer).length,
          }
        : { soort: n.soort, nummer: n.nummer, titel: n.titel, kinderen: n.kinderen.map(zet) };
    return w.structuur.map(zet);
  }

  async artikel(bwbId: BwbId, nummer: ArtikelNummer): Promise<Artikel> {
    await wacht();
    const w = this.vind(bwbId);
    const volgorde = this.artikelVolgorde(w).map((a) => a.nummer);
    const i = volgorde.indexOf(nummer);
    if (i < 0) throw new NietGevonden(`Artikel ${nummer}`);

    // Zoek het pad (hoofdstuk, paragraaf) naar dit artikel.
    const pad: Artikel["pad"] = [];
    const zoek = (ns: MockNode[], stapel: Artikel["pad"]): boolean => {
      for (const n of ns) {
        if (n.soort === "artikel") {
          if (n.nummer === nummer) {
            pad.push(...stapel);
            return true;
          }
        } else if (zoek(n.kinderen, [...stapel, { soort: n.soort, nummer: n.nummer, titel: n.titel }])) {
          return true;
        }
      }
      return false;
    };
    zoek(w.structuur, []);

    const inhoud = w.artikelen[nummer];
    return {
      bwbId,
      nummer,
      titel: inhoud?.titel,
      leden: inhoud?.leden ?? [],
      pad,
      bronUrl: `${w.wet.bronUrl}#Artikel${nummer}`,
      vorige: volgorde[i - 1],
      volgende: volgorde[i + 1],
    };
  }

  async artikelen(bwbId: BwbId): Promise<Artikel[]> {
    const w = this.vind(bwbId);
    const nrs = this.artikelVolgorde(w).map((a) => a.nummer);
    return Promise.all(nrs.map((n) => this.artikel(bwbId, n)));
  }

  async passages(bwbId: BwbId, nummer: ArtikelNummer, filter?: PassageFilter) {
    await wacht(200);
    let ps = this.passagesVan(this.vind(bwbId), nummer);
    if (filter?.lid) ps = ps.filter((p) => p.leden.length === 0 || p.leden.includes(filter.lid!));
    if (filter?.soorten?.length) ps = ps.filter((p) => filter.soorten!.includes(p.document.soort));
    return ps;
  }

  async zoeken(q: string, bwbId?: BwbId): Promise<ZoekResultaat[]> {
    await wacht(80);
    const term = q.trim().toLowerCase();
    if (term.length < 2) return [];
    const uit: ZoekResultaat[] = [];
    for (const w of WETTEN.filter((x) => !bwbId || x.wet.bwbId === bwbId)) {
      const meta = { bwbId: w.wet.bwbId, afkorting: w.wet.afkorting };
      // "art 22", "artikel 22" of alleen "22" springt naar het artikel.
      const nr = term.replace(/^(art(ikel)?\.?\s*)/, "");
      const direct = this.artikelVolgorde(w).find((a) => a.nummer === nr);
      if (direct) {
        const titel = direct.titel ?? w.artikelen[nr]?.titel;
        uit.push({ ...meta, artikel: nr, artikelTitel: titel, fragment: titel ?? "", bron: "wettekst" });
      }
      for (const [n, a] of Object.entries(w.artikelen)) {
        if (n === nr) continue;
        const tekst = [a.titel ?? "", ...a.leden.flatMap((l) => [l.tekst, ...(l.onderdelen ?? []).map((o) => o.tekst)])].join(" ");
        const f = fragment(tekst, term);
        if (f) uit.push({ ...meta, artikel: n, artikelTitel: a.titel, fragment: f, bron: "wettekst" });
      }
      for (const p of w.passages) {
        const f = fragment(p.tekst, term);
        if (f) uit.push({ ...meta, artikel: p.artikel, artikelTitel: w.artikelen[p.artikel]?.titel, fragment: f, bron: "passage" });
      }
    }
    return uit.slice(0, 20);
  }

  async feedback(f: Feedback) {
    await wacht(150);
    // De echte backend slaat dit op als trainingssignaal voor het model.
    console.info("[voorbeelddata] feedback", f);
  }
}

function fragment(tekst: string, term: string): string | null {
  const i = tekst.toLowerCase().indexOf(term);
  if (i < 0) return null;
  const begin = Math.max(0, i - 60);
  const eind = Math.min(tekst.length, i + term.length + 80);
  return (begin > 0 ? "…" : "") + tekst.slice(begin, eind).trim() + (eind < tekst.length ? "…" : "");
}
