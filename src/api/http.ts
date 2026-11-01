import type { WetsgeschiedenisApi } from "./client";
import { NietGevonden } from "./errors";
import type {
  Artikel,
  ArtikelNummer,
  BwbId,
  Feedback,
  Passage,
  PassageFilter,
  StructuurNode,
  Wet,
  ZoekResultaat,
} from "./types";

/** Koppeling met de echte backend. Endpoints staan in docs/API.md. */
export class HttpApi implements WetsgeschiedenisApi {
  constructor(private readonly base: string) {
    this.base = base.replace(/\/$/, "");
  }

  private async get<T>(pad: string, params?: Record<string, string | string[] | undefined>): Promise<T> {
    const url = new URL(this.base + pad);
    for (const [k, v] of Object.entries(params ?? {})) {
      if (v === undefined || v === "") continue;
      if (Array.isArray(v)) v.forEach((x) => url.searchParams.append(k, x));
      else url.searchParams.set(k, v);
    }
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (res.status === 404) throw new NietGevonden(pad);
    if (!res.ok) throw new Error(`Backend gaf ${res.status} op ${pad}`);
    return res.json() as Promise<T>;
  }

  wetten() {
    return this.get<Wet[]>("/wetten");
  }
  wet(bwbId: BwbId) {
    return this.get<Wet>(`/wetten/${enc(bwbId)}`);
  }
  structuur(bwbId: BwbId) {
    return this.get<StructuurNode[]>(`/wetten/${enc(bwbId)}/structuur`);
  }
  artikel(bwbId: BwbId, nummer: ArtikelNummer) {
    return this.get<Artikel>(`/wetten/${enc(bwbId)}/artikelen/${enc(nummer)}`);
  }
  artikelen(bwbId: BwbId) {
    return this.get<Artikel[]>(`/wetten/${enc(bwbId)}/artikelen`);
  }
  passages(bwbId: BwbId, nummer: ArtikelNummer, filter?: PassageFilter) {
    return this.get<Passage[]>(`/wetten/${enc(bwbId)}/artikelen/${enc(nummer)}/passages`, {
      lid: filter?.lid,
      soort: filter?.soorten,
    });
  }
  zoeken(q: string, bwbId?: BwbId) {
    return this.get<ZoekResultaat[]>("/zoeken", { q, wet: bwbId });
  }
  async feedback(f: Feedback) {
    const res = await fetch(`${this.base}/passages/${enc(f.passageId)}/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oordeel: f.oordeel }),
    });
    if (!res.ok) throw new Error(`Feedback niet opgeslagen (${res.status})`);
  }
}

const enc = encodeURIComponent;
