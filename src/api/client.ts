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
import { HttpApi } from "./http";
import { MockApi } from "./mock/mockApi";
export { NietGevonden } from "./errors";

/**
 * Alles wat de interface van de backend nodig heeft. De schermen praten
 * alleen met deze interface, nooit rechtstreeks met fetch of met voorbeelddata.
 */
export interface WetsgeschiedenisApi {
  wetten(): Promise<Wet[]>;
  wet(bwbId: BwbId): Promise<Wet>;
  structuur(bwbId: BwbId): Promise<StructuurNode[]>;
  artikel(bwbId: BwbId, nummer: ArtikelNummer): Promise<Artikel>;
  passages(bwbId: BwbId, nummer: ArtikelNummer, filter?: PassageFilter): Promise<Passage[]>;
  zoeken(q: string, bwbId?: BwbId): Promise<ZoekResultaat[]>;
  feedback(f: Feedback): Promise<void>;
}

const apiUrl = import.meta.env.VITE_API_URL as string | undefined;

/** Met VITE_API_URL praat de app met de echte backend, anders met voorbeelddata. */
export const api: WetsgeschiedenisApi = apiUrl ? new HttpApi(apiUrl) : new MockApi();
export const gebruiktVoorbeelddata = !apiUrl;
