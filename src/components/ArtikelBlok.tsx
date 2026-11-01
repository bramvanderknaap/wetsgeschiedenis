import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import type { Artikel, DocumentSoort, Passage } from "../api/types";
import { SOORT_NAAM } from "../lib/citeer";
import { Wettekst } from "./Wettekst";
import { PassageKaart } from "./PassageKaart";

interface Props {
  artikel: Artikel;
  aantalPassages: number;
  open: boolean;
  wissel: (nummer: string, open?: boolean) => void;
  meld: (tekst: string) => void;
}

type Volgorde = "relevant" | "behandeling";

/**
 * Eén artikel zoals in een wetbundel: nummer in de kantlijn, de tekst, en
 * daaronder (inklapbaar) de wetsgeschiedenis, zoals commentaar onder een artikel.
 */
export const ArtikelBlok = memo(function ArtikelBlok({ artikel: a, aantalPassages, open, wissel, meld }: Props) {
  const [passages, zetPassages] = useState<Passage[] | null>(null);
  const [fout, zetFout] = useState(false);
  const [lid, zetLid] = useState<string | undefined>();
  const [soorten, zetSoorten] = useState<DocumentSoort[]>([]);
  const [volgorde, zetVolgorde] = useState<Volgorde>("relevant");
  const [aangewezen, wijsAan] = useState<string[]>([]);

  useEffect(() => {
    if (!open || passages || aantalPassages === 0) return;
    let actief = true;
    api.passages(a.bwbId, a.nummer).then(
      (ps) => actief && zetPassages(ps),
      () => actief && zetFout(true),
    );
    return () => {
      actief = false;
    };
  }, [open, passages, aantalPassages, a.bwbId, a.nummer]);

  const perLid = useMemo(() => {
    const t: Record<string, number> = {};
    passages?.forEach((p) => p.leden.forEach((l) => (t[l] = (t[l] ?? 0) + 1)));
    return t;
  }, [passages]);

  const soortenAanwezig = useMemo(() => [...new Set((passages ?? []).map((p) => p.document.soort))], [passages]);

  const zichtbaar = useMemo(() => {
    let ps = passages ?? [];
    if (lid) ps = ps.filter((p) => p.leden.length === 0 || p.leden.includes(lid));
    if (soorten.length) ps = ps.filter((p) => soorten.includes(p.document.soort));
    if (volgorde === "behandeling") {
      ps = [...ps].sort(
        (x, y) =>
          x.document.datum.localeCompare(y.document.datum) ||
          Number(x.pagina ?? 0) - Number(y.pagina ?? 0),
      );
    }
    return ps;
  }, [passages, lid, soorten, volgorde]);

  const kiesLid = useCallback(
    (l?: string) => {
      zetLid(l);
      if (l) wissel(a.nummer, true);
    },
    [a.nummer, wissel],
  );

  const annotatieId = `ann-${a.nummer}`;

  return (
    <article className={`ab${open ? " ab-open" : ""}${a.leden.length === 0 ? " ab-zonder-tekst" : ""}`} id={`art-${a.nummer}`} data-artikel={a.nummer} aria-labelledby={`kop-art-${a.nummer}`}>
      <div className="ab-kantlijn" aria-hidden="true">
        {a.titel}
      </div>
      <div className="ab-inhoud">
        <h3 className="ab-kop" id={`kop-art-${a.nummer}`}>
          <span className="ab-nr">Artikel {a.nummer}</span>
          {a.titel && <span className="ab-titel">{a.titel}</span>}
        </h3>

        <Wettekst
          artikel={a}
          perLid={perLid}
          gekozenLid={lid}
          oplichten={aangewezen}
          kiesLid={kiesLid}
          filterbaar={open && !!passages && passages.some((p) => p.leden.length > 0)}
        />

        {aantalPassages > 0 && (
          <div className="ab-annotatie">
            <button
              type="button"
              className="ab-wissel"
              aria-expanded={open}
              aria-controls={annotatieId}
              onClick={() => wissel(a.nummer)}
            >
              <span className="ab-wissel-pijl" aria-hidden="true" />
              Wetsgeschiedenis
              <span className="ab-wissel-aantal">
                {aantalPassages} {aantalPassages === 1 ? "passage" : "passages"}
              </span>
            </button>

            {open && (
              <div className="ab-passages" id={annotatieId}>
                {fout && <p className="ab-melding">De passages konden niet worden geladen. Klap de wetsgeschiedenis dicht en weer open om het opnieuw te proberen.</p>}
                {!passages && !fout && <div className="laad-blok laad-kaart" aria-busy="true" />}
                {passages && (
                  <>
                    <div className="ab-gereedschap">
                      <div className="ab-filters" role="group" aria-label="Filters">
                        {lid && (
                          <button type="button" className="filter filter-lid" onClick={() => zetLid(undefined)}>
                            Lid {lid}
                            <span className="filter-x" aria-hidden="true">×</span>
                            <span className="vh">, filter weghalen</span>
                          </button>
                        )}
                        {soortenAanwezig.length > 1 &&
                          soortenAanwezig.map((s) => (
                            <button
                              key={s}
                              type="button"
                              className={`filter${soorten.includes(s) ? " filter-aan" : ""}`}
                              aria-pressed={soorten.includes(s)}
                              onClick={() =>
                                zetSoorten((h) => (h.includes(s) ? h.filter((x) => x !== s) : [...h, s]))
                              }
                            >
                              {SOORT_NAAM[s] ?? s}
                            </button>
                          ))}
                      </div>
                      {passages.length > 1 && (
                        <label className="ab-volgorde">
                          <span className="vh">Volgorde</span>
                          <select value={volgorde} onChange={(e) => zetVolgorde(e.target.value as Volgorde)}>
                            <option value="relevant">Meest relevant eerst</option>
                            <option value="behandeling">Volgorde van behandeling</option>
                          </select>
                        </label>
                      )}
                    </div>
                    {zichtbaar.length === 0 && (
                      <p className="ab-melding">
                        Geen passages die bij deze filters passen.{" "}
                        <button
                          type="button"
                          className="knop-tekst"
                          onClick={() => {
                            zetLid(undefined);
                            zetSoorten([]);
                          }}
                        >
                          Filters weghalen
                        </button>
                      </p>
                    )}
                    <div className="ab-lijst">
                      {zichtbaar.map((p) => (
                        <PassageKaart key={p.id} passage={p} wijsAan={wijsAan} kiesLid={kiesLid} meld={meld} />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
});
