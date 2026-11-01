import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { api } from "../api/client";
import type { DocumentSoort, Passage } from "../api/types";
import { useLaad } from "../lib/useLaad";
import { naarArtikel, naarWet } from "../lib/paden";
import { SOORT_NAAM } from "../lib/citeer";
import { Inhoudsopgave } from "../components/Inhoudsopgave";
import { Wettekst } from "../components/Wettekst";
import { PassageKaart } from "../components/PassageKaart";
import { Foutmelding } from "../components/Foutmelding";

type Volgorde = "nuttig" | "chronologisch";

export function ArtikelPagina() {
  const { bwbId = "", nummer = "" } = useParams();
  const [zoekParams, zetZoekParams] = useSearchParams();
  const lid = zoekParams.get("lid") ?? undefined;

  const wet = useLaad(() => api.wet(bwbId), [bwbId]);
  const structuur = useLaad(() => api.structuur(bwbId), [bwbId]);
  const artikel = useLaad(() => api.artikel(bwbId, nummer), [bwbId, nummer]);
  const passages = useLaad(() => api.passages(bwbId, nummer), [bwbId, nummer]);

  const [soorten, zetSoorten] = useState<DocumentSoort[]>([]);
  const [volgorde, zetVolgorde] = useState<Volgorde>("nuttig");
  const [aangewezen, wijsAan] = useState<string[]>([]);
  const [melding, zetMelding] = useState<string | null>(null);
  const [inhoudOpen, zetInhoudOpen] = useState(false);
  /** Alleen op de telefoon: welke kolom zichtbaar is. */
  const [tab, zetTab] = useState<"wet" | "gesch">("wet");
  const meldTimer = useRef<number>();
  const zijRef = useRef<HTMLElement>(null);
  const ioKnopRef = useRef<HTMLButtonElement>(null);

  const sluitInhoud = useCallback(() => {
    zetInhoudOpen(false);
    ioKnopRef.current?.focus();
  }, []);

  // Paneel met inhoudsopgave (tablet en telefoon): focus erin, Escape sluit.
  useEffect(() => {
    if (!inhoudOpen) return;
    const huidig = zijRef.current?.querySelector<HTMLElement>("[aria-current=page]") ?? zijRef.current?.querySelector<HTMLElement>("a");
    huidig?.focus();
    const toets = (e: KeyboardEvent) => e.key === "Escape" && sluitInhoud();
    window.addEventListener("keydown", toets);
    return () => window.removeEventListener("keydown", toets);
  }, [inhoudOpen, sluitInhoud]);

  useEffect(() => {
    zetSoorten([]);
    wijsAan([]);
    zetInhoudOpen(false);
    zetTab("wet");
  }, [bwbId, nummer]);

  const meld = useCallback((t: string) => {
    zetMelding(t);
    window.clearTimeout(meldTimer.current);
    meldTimer.current = window.setTimeout(() => zetMelding(null), 2600);
  }, []);

  const kiesLid = useCallback(
    (l?: string) => {
      const p = new URLSearchParams(zoekParams);
      if (l) {
        p.set("lid", l);
        zetTab("gesch");
        if (window.matchMedia("(max-width: 760px)").matches) {
          requestAnimationFrame(() => document.querySelector(".ap-gesch")?.scrollIntoView({ block: "start" }));
        }
      } else p.delete("lid");
      zetZoekParams(p, { replace: true });
    },
    [zoekParams, zetZoekParams],
  );

  const alle = passages.data ?? [];
  const perLid = useMemo(() => {
    const t: Record<string, number> = {};
    alle.forEach((p) => p.leden.forEach((l) => (t[l] = (t[l] ?? 0) + 1)));
    return t;
  }, [alle]);
  const beschikbareSoorten = useMemo(
    () => [...new Set(alle.map((p) => p.document.soort))],
    [alle],
  );

  const zichtbaar = useMemo(() => {
    let ps: Passage[] = alle;
    if (lid) ps = ps.filter((p) => p.leden.length === 0 || p.leden.includes(lid));
    if (soorten.length) ps = ps.filter((p) => soorten.includes(p.document.soort));
    if (volgorde === "chronologisch") {
      ps = [...ps].sort(
        (a, b) =>
          a.document.datum.localeCompare(b.document.datum) ||
          Number(a.document.ondernummer ?? 0) - Number(b.document.ondernummer ?? 0) ||
          Number(a.pagina ?? 0) - Number(b.pagina ?? 0),
      );
    }
    return ps;
  }, [alle, lid, soorten, volgorde]);

  if (artikel.status === "fout") {
    return (
      <div className="smal">
        <Foutmelding fout={artikel.fout} />
      </div>
    );
  }
  const a = artikel.data;
  const wisselSoort = (s: DocumentSoort) =>
    zetSoorten((huidig) => (huidig.includes(s) ? huidig.filter((x) => x !== s) : [...huidig, s]));

  return (
    <div className={`ap ap-toon-${tab}`}>
      <aside ref={zijRef} className={`ap-zij${inhoudOpen ? " ap-zij-open" : ""}`} aria-label="Inhoudsopgave van de wet">
        <div className="ap-zij-kop">
          <Link to={naarWet(bwbId)} className="ap-wetnaam">
            {wet.data?.afkorting ?? wet.data?.citeertitel ?? " "}
          </Link>
          <button type="button" className="knop-tekst ap-zij-sluit" onClick={sluitInhoud}>
            Sluiten
          </button>
        </div>
        {structuur.data && <Inhoudsopgave bwbId={bwbId} structuur={structuur.data} huidig={nummer} zijbalk />}
      </aside>
      {inhoudOpen && <div className="ap-scherm" onClick={sluitInhoud} aria-hidden="true" />}

      <header className="ap-kop">
        <div className="ap-plek">
          <button ref={ioKnopRef} type="button" className="knop-tekst ap-io-knop" aria-expanded={inhoudOpen} onClick={() => zetInhoudOpen(true)}>
            Inhoudsopgave
          </button>
          {a?.pad.map((p) => (
            <span key={`${p.soort}${p.nummer}`} className="ap-pad">
              {p.soort === "hoofdstuk" ? "H" : p.soort === "paragraaf" ? "§" : ""}
              {p.nummer} {p.titel}
            </span>
          ))}
        </div>
        <h1 id="artikel-kop" className="ap-titel">
          <span className="ap-nr">Artikel {nummer}</span>
          {a?.titel && <span className="ap-opschrift">{a.titel}</span>}
        </h1>
      </header>

      <div className="ap-tabs" role="group" aria-label="Weergave">
        <button type="button" aria-pressed={tab === "wet"} className="ap-tab" onClick={() => zetTab("wet")}>
          Wettekst
        </button>
        <button type="button" aria-pressed={tab === "gesch"} className="ap-tab" onClick={() => zetTab("gesch")}>
          Wetsgeschiedenis{passages.data ? ` (${alle.length})` : ""}
        </button>
      </div>

      <section className="ap-wet" aria-label="Wettekst">
        {a ? (
          <>
            <Wettekst artikel={a} perLid={perLid} gekozenLid={lid} oplichten={aangewezen} kiesLid={kiesLid} />
            <p className="ap-bron">
              Tekst volgens{" "}
              <a href={a.bronUrl} target="_blank" rel="noreferrer">
                wetten.overheid.nl
              </a>
            </p>
            <nav className="ap-blader" aria-label="Bladeren">
              {a.vorige ? (
                <Link to={naarArtikel(bwbId, a.vorige)} rel="prev">
                  <span aria-hidden="true">‹</span> Artikel {a.vorige}
                </Link>
              ) : (
                <span />
              )}
              {a.volgende && (
                <Link to={naarArtikel(bwbId, a.volgende)} rel="next">
                  Artikel {a.volgende} <span aria-hidden="true">›</span>
                </Link>
              )}
            </nav>
          </>
        ) : (
          <div className="laad-blok laad-tekst" aria-busy="true" />
        )}
      </section>

      <section className="ap-gesch" aria-labelledby="gesch-kop">
        <div className="ap-gesch-kop">
          <h2 id="gesch-kop">
            <span className="ap-gesch-woord">Wetsgeschiedenis</span>
            {passages.data && (
              <span className="ap-teller">
                {zichtbaar.length === alle.length
                  ? `${alle.length} ${alle.length === 1 ? "passage" : "passages"}`
                  : `${zichtbaar.length} van ${alle.length}`}
              </span>
            )}
          </h2>
          <label className="ap-volgorde">
            <span className="vh">Volgorde</span>
            <select value={volgorde} onChange={(e) => zetVolgorde(e.target.value as Volgorde)}>
              <option value="nuttig">Meest relevant eerst</option>
              <option value="chronologisch">Volgorde van behandeling</option>
            </select>
          </label>
        </div>
        {alle.length > 0 && (
          <p className="ap-uitleg">
            {volgorde === "nuttig"
              ? "Gesorteerd op hoe relevant het model de passage vindt voor dit artikel."
              : "Gesorteerd van wetsvoorstel tot behandeling in de Eerste Kamer."}
          </p>
        )}

        {(lid || beschikbareSoorten.length > 1) && (
          <div className="ap-filters" role="group" aria-label="Filters">
            {lid && (
              <button type="button" className="filter filter-aan filter-lid" onClick={() => kiesLid(undefined)}>
                Lid {lid}
                <span className="filter-x" aria-label="filter weghalen">×</span>
              </button>
            )}
            {beschikbareSoorten.length > 1 &&
              beschikbareSoorten.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`filter${soorten.includes(s) ? " filter-aan" : ""}`}
                  aria-pressed={soorten.includes(s)}
                  onClick={() => wisselSoort(s)}
                >
                  {SOORT_NAAM[s] ?? s}
                </button>
              ))}
          </div>
        )}

        {passages.status === "fout" && <Foutmelding fout={passages.fout} />}
        {passages.status === "laden" && !passages.data && (
          <>
            <div className="laad-blok laad-kaart" aria-busy="true" />
            <div className="laad-blok laad-kaart" aria-busy="true" />
          </>
        )}

        {passages.data && alle.length === 0 && (
          <div className="ap-leeg">
            <p>Bij dit artikel zijn nog geen passages gevonden.</p>
            <p>
              Zoek zelf in de{" "}
              <a
                href={`https://zoek.officielebekendmakingen.nl/dossier/${wet.data?.dossiers[0] ?? ""}`}
                target="_blank"
                rel="noreferrer"
              >
                Kamerstukken bij deze wet
              </a>
              {a?.volgende && (
                <>
                  {" "}of ga verder met <Link to={naarArtikel(bwbId, a.volgende)}>artikel {a.volgende}</Link>
                </>
              )}
              .
            </p>
          </div>
        )}

        {passages.data && alle.length > 0 && zichtbaar.length === 0 && (
          <div className="ap-leeg">
            <p>Geen passages die bij deze filters passen.</p>
            <button
              type="button"
              className="knop-tekst"
              onClick={() => {
                zetSoorten([]);
                kiesLid(undefined);
              }}
            >
              Filters weghalen
            </button>
          </div>
        )}

        <div className="ap-lijst">
          {zichtbaar.map((p) => (
            <PassageKaart
              key={p.id}
              passage={p}
              wijsAan={wijsAan}
              kiesLid={kiesLid}
              meld={meld}
            />
          ))}
        </div>
      </section>

      <div className="toast" role="status" aria-live="polite">
        {melding && <span className="toast-tekst">{melding}</span>}
      </div>
    </div>
  );
}
