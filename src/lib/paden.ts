import type { ArtikelNummer, BwbId } from "../api/types";

export const naarWet = (bwbId: BwbId) => `/wet/${bwbId}`;
export const naarArtikel = (bwbId: BwbId, nummer: ArtikelNummer, lid?: string) =>
  `/wet/${bwbId}/artikel/${encodeURIComponent(nummer)}${lid ? `?lid=${encodeURIComponent(lid)}` : ""}`;
