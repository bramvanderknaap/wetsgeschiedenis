import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../api/client";
import type { Artikel, ArtikelNummer, StructuurElement, StructuurNode } from "../api/types";
import { useLaad } from "../lib/useLaad";
import { naarArtikel, naarWet } from "../lib/paden";
import { groepSleutel, Navigator, SOORT_NAAM } from "../components/Navigator";
import { ArtikelBlok } from "../components/ArtikelBlok";
import { Foutmelding } from "../components/Foutmelding";
import { bronNaam, datumNL, dossierNr, staatsbladKort, staatsbladUrl } from "../lib/citeer";

/**
 * De wet als bundel: links het keuzepad (hoofdstuk, paragraaf, artikel),
 * rechts de doorlopende wettekst met onder elk artikel de wetsgeschiedenis.
 */
export function Bundel() {
  const { bwbId = "", nummer } = useParams();
  const navigate = useNavigate();

  const wet = useLaad(() => api.wet(bwbId), [bwbId]);
  const structuur = useLaad(() => api.structuur(bwbId), [bwbId]);
  const artikelen = useLaad(() => api.artikelen(bwbId), [bwbId]);

  const [open, zetOpen] = useState<Set<string>>(() => new Set(nummer ? [nummer] : []));
  const [alleOpen, zetAlleOpen] = useState(false);
  const [huidig, zetHuidig] = useState<ArtikelNummer | undefined>(nummer);
  const [navOpen, zetNavOpen] = useState(false);
  const [melding, zetMelding] = useState<string | null>(null);
  const meldTimer = useRef<number>();
  const navKnop = useRef<HTMLButtonElement>(null);
  const navPaneel = useRef<HTMLElement>(null);

  const meld = useCallback((t: string) => {
    zetMelding(t);
    window.clearTimeout(meldTimer.current);
    meldTimer.current = window.setTimeout(() => zetMelding(null), 2600);
  }, []);

  const wissel = useCallback((n: string, forceer?: boolean) => {
    zetOpen((s) => {
      const nieuw = new Set(s);
      const nuOpen = forceer ?? !nieuw.has(n);
      if (nuOpen) nieuw.add(n);
      else nieuw.delete(n);
      return nieuw;
    });
  }, []);

  const perNummer = useMemo(() => {
    const m = new Map<string, Artikel>();
    artikelen.data?.forEach((a) => m.set(a.nummer, a));
    return m;
  }, [artikelen.data]);

  const telling = useMemo(() => {
    const m = new Map<string, number>();
    const loop = (ns: StructuurNode[]) =>
      ns.forEach((n) => (n.soort === "artikel" ? m.set(n.nummer, n.aantalPassages) : loop(n.kinderen)));
    if (structuur.data) loop(structuur.data);
    return m;
  }, [structuur.data]);

  const gereed = !!(structuur.data && artikelen.data);
  const leeg = gereed && artikelen.data!.length === 0;

  // Naar het gevraagde artikel springen (bij openen van een link, zoekresultaat of keuze in het keuzepad).
  useEffect(() => {
    if (!gereed || !nummer) return;
    zetOpen((s) => (s.has(nummer) ? s : new Set(s).add(nummer)));
    requestAnimationFrame(() => document.getElementById(`art-${nummer}`)?.scrollIntoView({ block: "start" }));
    zetHuidig(nummer);
  }, [gereed, nummer]);

  // Meelezen: welk artikel staat bovenaan in beeld?
  useEffect(() => {
    if (!gereed) return;
    const zichtbaar = new Map<string, number>();
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const n = (e.target as HTMLElement).dataset.artikel!;
          if (e.isIntersecting) zichtbaar.set(n, e.boundingClientRect.top);
          else zichtbaar.delete(n);
        });
        const boven = [...zichtbaar.entries()].sort((x, y) => x[1] - y[1])[0];
        if (boven) zetHuidig(boven[0]);
      },
      { rootMargin: "-120px 0px -55% 0px" },
    );
    document.querySelectorAll<HTMLElement>("[data-artikel]").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [gereed]);

  const sluitNav = useCallback(() => {
    zetNavOpen(false);
    navKnop.current?.focus();
  }, []);

  useEffect(() => {
    if (!navOpen) return;
    (
      navPaneel.current?.querySelector<HTMLElement>(".nav [aria-current=location]") ??
      navPaneel.current?.querySelector<HTMLElement>(".nav button")
    )?.focus();
    const toets = (e: KeyboardEvent) => e.key === "Escape" && sluitNav();
    window.addEventListener("keydown", toets);
    return () => window.removeEventListener("keydown", toets);
  }, [navOpen, sluitNav]);

  const gaNaarArtikel = useCallback(
    (n: ArtikelNummer) => {
      zetNavOpen(false);
      if (n === nummer) {
        document.getElementById(`art-${n}`)?.scrollIntoView({ block: "start" });
        wissel(n, true);
      } else
        navigate(naarArtikel(bwbId, n), {
          replace: true,
          preventScrollReset: true,
        });
    },
    [bwbId, navigate, nummer, wissel],
  );

  const gaNaarGroep = useCallback((sleutel: string) => {
    document.getElementById(`kop-${sleutel}`)?.scrollIntoView({ block: "start" });
  }, []);

  // Kruimelpad bij het artikel dat in beeld is.
  const kruimels = useMemo(() => {
    if (!structuur.data || !huidig) return [];
    const zoek = (ns: StructuurNode[], stapel: StructuurElement[]): StructuurElement[] | null => {
      for (const n of ns) {
        if (n.soort === "artikel") {
          if (n.nummer === huidig) return stapel;
        } else {
          const r = zoek(n.kinderen, [...stapel, n]);
          if (r) return r;
        }
      }
      return null;
    };
    return zoek(structuur.data, []) ?? [];
  }, [structuur.data, huidig]);

  if (wet.status === "fout")
    return (
      <div className="smal">
        <Foutmelding fout={wet.fout} />
      </div>
    );
  const naam = wet.data?.afkorting ?? wet.data?.citeertitel ?? "";

  const tekst = (ns: StructuurNode[], diepte: number): JSX.Element[] =>
    ns.map((n) => {
      if (n.soort === "artikel") {
        const a = perNummer.get(n.nummer);
        if (!a) return <Fragment key={`a-${n.nummer}`} />;
        return (
          <ArtikelBlok
            key={`a-${n.nummer}`}
            artikel={a}
            aantalPassages={telling.get(n.nummer) ?? 0}
            open={alleOpen || open.has(n.nummer)}
            wissel={wissel}
            meld={meld}
          />
        );
      }
      const Kop = diepte === 0 ? "h2" : "h3";
      return (
        <section key={groepSleutel(n)} className={`bg bg-diepte-${diepte}`} aria-labelledby={`kop-${groepSleutel(n)}`}>
          <Kop className="bg-kop" id={`kop-${groepSleutel(n)}`}>
            <span className="bg-soort">
              {SOORT_NAAM[n.soort]} {n.nummer}
            </span>
            <span className="bg-titel">{n.titel}</span>
          </Kop>
          {tekst(n.kinderen, diepte + 1)}
        </section>
      );
    });

  return (
    <div className={`bundel${leeg ? " bundel-leeg" : ""}`}>
      <div className="kruimelbalk">
        <div className="kruimelbalk-binnen">
          {!leeg && (
            <button
              ref={navKnop}
              type="button"
              className="kruimel-inhoud"
              aria-expanded={navOpen}
              onClick={() => zetNavOpen(true)}
            >
              Inhoud
            </button>
          )}
          <nav className="kruimels" aria-label="Je bent hier">
            <ol>
              <li>
                <Link to="/">Wetten</Link>
              </li>
              <li>
                <Link to={naarWet(bwbId)} onClick={() => window.scrollTo({ top: 0 })}>
                  {naam}
                </Link>
              </li>
              {kruimels.map((k) => (
                <li key={groepSleutel(k)} className="kruimel-groep">
                  <button type="button" onClick={() => gaNaarGroep(groepSleutel(k))} title={k.titel}>
                    {k.soort === "hoofdstuk" ? "H" : k.soort === "paragraaf" ? "§ " : `${SOORT_NAAM[k.soort]} `}
                    {k.nummer}
                  </button>
                </li>
              ))}
              {huidig && (
                <li aria-current="location">
                  <span>Art. {huidig}</span>
                </li>
              )}
            </ol>
          </nav>
          {!leeg && (
            <label className="schakel">
              <input
                type="checkbox"
                aria-label="Alle parlementaire geschiedenis uitklappen"
                checked={alleOpen}
                onChange={(e) => zetAlleOpen(e.target.checked)}
              />
              <span className="schakel-baan" aria-hidden="true" />
              <span className="schakel-tekst">
                <span className="schakel-lang">Alles uitklappen</span>
                <span className="schakel-kort" aria-hidden="true">
                  Alles open
                </span>
              </span>
            </label>
          )}
        </div>
      </div>

      <div className="bundel-raster">
        <aside ref={navPaneel} className={`bundel-nav${navOpen ? " bundel-nav-open" : ""}`}>
          <div className="bundel-nav-sluit">
            <button type="button" className="knop-tekst" onClick={sluitNav}>
              Sluiten
            </button>
          </div>
          {structuur.data && !leeg && (
            <Navigator
              wetNaam={naam}
              structuur={structuur.data}
              huidig={huidig}
              naarArtikel={gaNaarArtikel}
              naarGroep={(s) => {
                gaNaarGroep(s);
              }}
            />
          )}
        </aside>
        {navOpen && <div className="bundel-scherm" onClick={sluitNav} aria-hidden="true" />}

        <div className="bundel-tekst">
          <header className="bundel-kop">
            <h1>{wet.data?.citeertitel ?? " "}</h1>
            {wet.data && (
              <p className="bundel-meta">
                {wet.data.geldigVanaf && <span>Tekst geldig vanaf {datumNL(wet.data.geldigVanaf)}</span>}
                {wet.data.staatsblad && (
                  <a href={staatsbladUrl(wet.data.staatsblad)} target="_blank" rel="noreferrer">
                    {staatsbladKort(wet.data.staatsblad)}
                  </a>
                )}
                {wet.data.dossiers.length > 0 && (
                  <span>Kamerstukken {wet.data.dossiers.map(dossierNr).join(", ")}</span>
                )}
                <a href={wet.data.bronUrl} target="_blank" rel="noreferrer">
                  Bron: {bronNaam(wet.data.bronUrl)}
                </a>
              </p>
            )}
          </header>
          {(structuur.status === "fout" || artikelen.status === "fout") && (
            <Foutmelding
              fout={
                structuur.status === "fout"
                  ? structuur.fout
                  : artikelen.status === "fout"
                    ? artikelen.fout
                    : new Error()
              }
            />
          )}
          {!gereed && <div className="laad-blok laad-tekst" aria-busy="true" />}
          {gereed && !leeg && tekst(structuur.data!, 0)}
          {leeg && wet.data && (
            <div className="bundel-leeg-melding">
              <p>De tekst en de wetsgeschiedenis van deze wet zijn nog niet ingeladen.</p>
              <p>
                <a href={wet.data.bronUrl} target="_blank" rel="noreferrer">
                  Lees de wet op {bronNaam(wet.data.bronUrl)}
                </a>
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="toast" role="status" aria-live="polite">
        {melding && <span className="toast-tekst">{melding}</span>}
      </div>
    </div>
  );
}
