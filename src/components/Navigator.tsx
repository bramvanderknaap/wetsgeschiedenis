import { useEffect, useMemo, useRef, useState } from "react";
import type { ArtikelNummer, StructuurElement, StructuurNode } from "../api/types";

/**
 * Keuzepad door de wet, zoals de inhoudsopgave van een wetbundel:
 * eerst het hoofdstuk, dan de paragraaf, dan het artikel. Schuift mee met wat
 * de lezer in de tekst ziet, tenzij de lezer zelf net in het keuzepad bezig is.
 */

export const SOORT_NAAM: Record<string, string> = {
  boek: "Boek",
  deel: "Deel",
  hoofdstuk: "Hoofdstuk",
  titel: "Titel",
  afdeling: "Afdeling",
  paragraaf: "Paragraaf",
  subparagraaf: "Subparagraaf",
};

/**
 * Sleutel van een hoofdstuk, titel, afdeling of paragraaf, als pad vanaf de wet.
 * Nummers herhalen zich (het BW heeft in elke titel een "Afdeling 1"), dus het pad
 * maakt de sleutel uniek: "titel-4_afdeling-1".
 */
export const padSleutel = (pad: Pick<StructuurElement, "soort" | "nummer">[]) =>
  pad.map((n) => `${n.soort}-${n.nummer || "0"}`).join("_");

/** "Titel 5", "Afdeling 1"; zonder nummer alleen de soort. */
export const groepLabel = (n: Pick<StructuurElement, "soort" | "nummer">) =>
  n.nummer ? `${SOORT_NAAM[n.soort]} ${n.nummer}` : SOORT_NAAM[n.soort];

interface Props {
  wetNaam: string;
  structuur: StructuurNode[];
  huidig?: ArtikelNummer;
  naarArtikel: (nummer: ArtikelNummer) => void;
  naarGroep: (sleutel: string) => void;
}

export function telPassages(n: StructuurNode): number {
  return n.soort === "artikel" ? n.aantalPassages : n.kinderen.reduce((t, k) => t + telPassages(k), 0);
}

function padNaar(structuur: StructuurNode[], nummer: ArtikelNummer): StructuurElement[] | null {
  for (const n of structuur) {
    if (n.soort === "artikel") {
      if (n.nummer === nummer) return [];
    } else {
      const sub = padNaar(n.kinderen, nummer);
      if (sub) return [n, ...sub];
    }
  }
  return null;
}

export function Navigator({ wetNaam, structuur, huidig, naarArtikel, naarGroep }: Props) {
  const [pad, zetPad] = useState<StructuurElement[]>([]);
  const laatsteKlik = useRef(0);
  const lijst = useRef<HTMLUListElement>(null);

  // Meeschuiven met de tekst.
  useEffect(() => {
    if (!huidig || Date.now() - laatsteKlik.current < 1500) return;
    const p = padNaar(structuur, huidig);
    if (p) zetPad(p);
  }, [huidig, structuur]);

  // Het huidige artikel in beeld houden in de lijst.
  useEffect(() => {
    lijst.current?.querySelector<HTMLElement>("[aria-current=location]")?.scrollIntoView({ block: "nearest" });
  }, [huidig, pad]);

  const niveau = pad.length ? pad[pad.length - 1].kinderen : structuur;
  const ouder = pad.length > 1 ? pad[pad.length - 2] : undefined;
  const huidigeGroep = pad[pad.length - 1];

  const kies = (actie: () => void) => {
    laatsteKlik.current = Date.now();
    actie();
  };

  const terugLabel = useMemo(() => (ouder ? groepLabel(ouder) : wetNaam), [ouder, wetNaam]);

  return (
    <nav className="nav" aria-label={`Inhoud van de ${wetNaam}`}>
      <div className="nav-kop">
        {huidigeGroep ? (
          <>
            <button type="button" className="nav-terug" onClick={() => kies(() => zetPad(pad.slice(0, -1)))}>
              <span aria-hidden="true">‹</span> {terugLabel}
            </button>
            <button type="button" className="nav-titel" onClick={() => kies(() => naarGroep(padSleutel(pad)))}>
              <span className="nav-titel-soort">{groepLabel(huidigeGroep)}</span>
              <span className="nav-titel-naam">{huidigeGroep.titel}</span>
            </button>
          </>
        ) : (
          <p className="nav-titel nav-titel-wet">
            <span className="nav-titel-soort">Inhoud</span>
            <span className="nav-titel-naam">{wetNaam}</span>
          </p>
        )}
      </div>

      <ul className="nav-lijst" ref={lijst}>
        {niveau.map((n) =>
          n.soort === "artikel" ? (
            <li key={`a-${n.nummer}`}>
              <button
                type="button"
                className={`nav-item nav-artikel${n.aantalPassages ? "" : " nav-leeg"}`}
                aria-current={n.nummer === huidig ? "location" : undefined}
                onClick={() => kies(() => naarArtikel(n.nummer))}
              >
                <span className="nav-nr">Art. {n.nummer}</span>
                <span className="nav-naam">{n.vervallen ? <em>Vervallen</em> : (n.titel ?? "")}</span>
                <span className="nav-aantal" aria-label={`${n.aantalPassages} passages`}>
                  {n.aantalPassages || ""}
                </span>
              </button>
            </li>
          ) : (
            <li key={padSleutel([...pad, n])}>
              <button
                type="button"
                className="nav-item nav-groep"
                aria-current={huidig && padNaar([n], huidig) ? "true" : undefined}
                onClick={() =>
                  kies(() => {
                    zetPad([...pad, n]);
                    naarGroep(padSleutel([...pad, n]));
                  })
                }
              >
                <span className="nav-groep-soort">{groepLabel(n)}</span>
                <span className="nav-naam">{n.titel}</span>
                <span className="nav-aantal" aria-label={`${telPassages(n)} passages`}>
                  {telPassages(n) || ""}
                </span>
                <span className="nav-pijl" aria-hidden="true">
                  ›
                </span>
              </button>
            </li>
          ),
        )}
      </ul>
    </nav>
  );
}
