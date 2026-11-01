import type { DocumentSoort, Passage } from "../api/types";

export const SOORT_NAAM: Record<DocumentSoort, string> = {
  "memorie-van-toelichting": "Memorie van toelichting",
  "advies-raad-van-state": "Advies Raad van State",
  "nader-rapport": "Nader rapport",
  verslag: "Verslag",
  "nota-naar-aanleiding-van-verslag": "Nota naar aanleiding van het verslag",
  "nota-van-wijziging": "Nota van wijziging",
  amendement: "Amendement",
  motie: "Motie",
  handelingen: "Handelingen",
  "memorie-van-antwoord": "Memorie van antwoord",
  brief: "Brief",
  overig: "Overig",
};

/** Kort label voor filters. */
export const SOORT_KORT: Record<DocumentSoort, string> = {
  "memorie-van-toelichting": "MvT",
  "advies-raad-van-state": "Raad van State",
  "nader-rapport": "Nader rapport",
  verslag: "Verslag",
  "nota-naar-aanleiding-van-verslag": "Nota n.a.v. verslag",
  "nota-van-wijziging": "Nota van wijziging",
  amendement: "Amendement",
  motie: "Motie",
  handelingen: "Handelingen",
  "memorie-van-antwoord": "MvA",
  brief: "Brief",
  overig: "Overig",
};

export function soortNaam(s: string) {
  return SOORT_NAAM[s as DocumentSoort] ?? SOORT_NAAM.overig;
}

/**
 * Vindplaats volgens de Leidraad voor juridische auteurs:
 * "Kamerstukken II 2017/18, 34851, 3, p. 101."
 */
export function vindplaats(p: Pick<Passage, "document" | "pagina">): string {
  const d = p.document;
  const pagina = p.pagina ? `, p. ${p.pagina}` : "";
  if (d.soort === "handelingen") {
    return `Handelingen ${d.kamer} ${d.vergaderjaar}${d.ondernummer ? `, nr. ${d.ondernummer}` : ""}${pagina}`;
  }
  return `Kamerstukken ${d.kamer} ${d.vergaderjaar}, ${d.dossier}, ${d.ondernummer}${pagina}`;
}

export function datumNL(iso: string) {
  return new Date(iso).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });
}

/** Verdeelt tekst in gewone stukken en kernstukken (die gemarkeerd worden). */
export function kernDelen(tekst: string, kern?: [number, number][]) {
  if (!kern?.length) return [{ tekst, kern: false }];
  const delen: { tekst: string; kern: boolean }[] = [];
  let pos = 0;
  for (const [b, e] of [...kern].sort((a, z) => a[0] - z[0])) {
    if (b > pos) delen.push({ tekst: tekst.slice(pos, b), kern: false });
    delen.push({ tekst: tekst.slice(b, e), kern: true });
    pos = e;
  }
  if (pos < tekst.length) delen.push({ tekst: tekst.slice(pos), kern: false });
  return delen;
}
