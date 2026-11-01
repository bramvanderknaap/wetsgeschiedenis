import { useEffect, useId, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import type { BwbId, ZoekResultaat } from "../api/types";
import { naarArtikel } from "../lib/paden";

interface Props {
  bwbId?: BwbId;
  compact?: boolean;
  autoFocus?: boolean;
}

export function Zoekveld({ bwbId, compact, autoFocus }: Props) {
  const [q, zetQ] = useState("");
  const [resultaten, zetResultaten] = useState<(ZoekResultaat & { aantal: number })[]>([]);
  const [open, zetOpen] = useState(false);
  const [actief, zetActief] = useState(0);
  const navigate = useNavigate();
  const locatie = useLocation();
  const lijstId = useId();
  const invoer = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let geldig = true;
    const t = setTimeout(() => {
      api.zoeken(q, bwbId).then((r) => geldig && (zetResultaten(groepeer(r)), zetActief(0)));
    }, 90);
    return () => {
      geldig = false;
      clearTimeout(t);
    };
  }, [q, bwbId]);

  // Sluit na navigeren.
  useEffect(() => {
    zetOpen(false);
    zetQ("");
  }, [locatie.pathname]);

  // "/" focust het zoekveld, zoals op veel naslagsites.
  useEffect(() => {
    if (!compact) return;
    const toets = (e: KeyboardEvent) => {
      const doel = e.target as HTMLElement;
      if (e.key === "/" && !["INPUT", "TEXTAREA"].includes(doel.tagName)) {
        e.preventDefault();
        invoer.current?.focus();
      }
    };
    window.addEventListener("keydown", toets);
    return () => window.removeEventListener("keydown", toets);
  }, [compact]);

  const ga = (r: ZoekResultaat) => navigate(naarArtikel(r.bwbId, r.artikel));
  const toon = open && q.trim().length >= 2;

  return (
    <div className={`zoek ${compact ? "zoek-compact" : "zoek-groot"}`}>
      <label className="zoek-veld">
        <span className="vh">Zoek een artikel of begrip</span>
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" className="zoek-icoon">
          <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M15.5 15.5 21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          ref={invoer}
          type="search"
          value={q}
          autoFocus={autoFocus}
          placeholder={compact ? "Zoek artikel of begrip" : "Bijvoorbeeld: artikel 22, toestemming, biometrie"}
          role="combobox"
          aria-expanded={toon}
          aria-controls={lijstId}
          aria-activedescendant={toon && resultaten[actief] ? `${lijstId}-${actief}` : undefined}
          onChange={(e) => {
            zetQ(e.target.value);
            zetOpen(true);
          }}
          onFocus={() => zetOpen(true)}
          onBlur={() => setTimeout(() => zetOpen(false), 120)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              zetActief((a) => Math.min(a + 1, resultaten.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              zetActief((a) => Math.max(a - 1, 0));
            } else if (e.key === "Enter" && resultaten[actief]) {
              ga(resultaten[actief]);
            } else if (e.key === "Escape") {
              zetOpen(false);
            }
          }}
        />
        {compact && <kbd className="zoek-toets" aria-hidden="true">/</kbd>}
      </label>
      {toon && (
        <ul className="zoek-lijst" id={lijstId} role="listbox">
          {resultaten.length === 0 && <li className="zoek-leeg">Geen artikel of passage met “{q.trim()}”.</li>}
          {resultaten.map((r, i) => (
            <li
              key={`${r.artikel}-${r.bron}-${i}`}
              id={`${lijstId}-${i}`}
              role="option"
              aria-selected={i === actief}
              className="zoek-item"
              onMouseDown={(e) => {
                e.preventDefault();
                ga(r);
              }}
              onMouseEnter={() => zetActief(i)}
            >
              <span className="zoek-item-kop">
                <strong>Artikel {r.artikel}</strong>
                {r.artikelTitel && <span className="zoek-item-titel">{r.artikelTitel}</span>}
                {!bwbId && r.afkorting && <span className="zoek-item-wet">{r.afkorting}</span>}
              </span>
              <span className="zoek-item-fragment">
                {r.bron === "passage"
                  ? r.aantal > 1
                    ? `${r.aantal} passages in de wetsgeschiedenis, o.a.: `
                    : "In de wetsgeschiedenis: "
                  : ""}
                <Gemarkeerd tekst={r.fragment} term={q.trim().replace(/^(art(ikel)?\.?\s*)/i, "")} />
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Eén regel per artikel en bron, met het aantal treffers erbij. */
function groepeer(rs: ZoekResultaat[]): (ZoekResultaat & { aantal: number })[] {
  const uit = new Map<string, ZoekResultaat & { aantal: number }>();
  for (const r of rs) {
    const k = `${r.bwbId}|${r.artikel}|${r.bron}`;
    const al = uit.get(k);
    if (al) al.aantal++;
    else uit.set(k, { ...r, aantal: 1 });
  }
  return [...uit.values()];
}

function Gemarkeerd({ tekst, term }: { tekst: string; term: string }) {
  const i = term ? tekst.toLowerCase().indexOf(term.toLowerCase()) : -1;
  if (i < 0) return <>{tekst}</>;
  return (
    <>
      {tekst.slice(0, i)}
      <mark>{tekst.slice(i, i + term.length)}</mark>
      {tekst.slice(i + term.length)}
    </>
  );
}
