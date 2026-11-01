import { useMemo } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { useLaad } from "../lib/useLaad";
import { naarWet } from "../lib/paden";
import { datumNL, dossierNr, staatsbladKort } from "../lib/citeer";
import type { Wet } from "../api/types";
import { Zoekveld } from "../components/Zoekveld";
import { Foutmelding } from "../components/Foutmelding";

export function Home() {
  const wetten = useLaad(() => api.wetten(), []);
  const rijen = useMemo(() => groepeer(wetten.data ?? []), [wetten.data]);
  const bladen = useMemo(() => (wetten.data ?? []).filter((w) => w.staatsblad), [wetten.data]);

  return (
    <div className="home">
      <section className="home-kop">
        <h1>Wetsgeschiedenis zoeker</h1>
        <Zoekveld autoFocus />
      </section>

      <section className="home-wetten" aria-labelledby="wetten-kop">
        <h2 id="wetten-kop">Kies een wet</h2>
        {wetten.status === "fout" && <Foutmelding fout={wetten.fout} />}
        <ul className="wet-lijst">
          {rijen.map((r) =>
            r.soort === "wet" ? (
              <li key={r.wet.bwbId}>
                <Link to={naarWet(r.wet.bwbId)} className="wet-rij">
                  <span className="wet-afkorting">{r.wet.afkorting ?? ""}</span>
                  <span className="wet-naam">{r.wet.citeertitel}</span>
                  <span className="wet-cijfers">{cijfers([r.wet])}</span>
                  <span className="wet-bron">{bron(r.wet)}</span>
                </Link>
              </li>
            ) : (
              <li key={r.naam}>
                <div className="wet-rij wet-rij-groep">
                  <span className="wet-afkorting">{r.afkorting}</span>
                  <span className="wet-naam">{r.naam}</span>
                  <span className="wet-cijfers">{cijfers(r.delen.map((d) => d.wet))}</span>
                  <ul className="wet-delen" aria-label={`Boeken van het ${r.naam}`}>
                    {r.delen.map((d) => (
                      <li key={d.wet.bwbId}>
                        <Link to={naarWet(d.wet.bwbId)} className="wet-deel">
                          {d.deel}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ),
          )}
          {wetten.status === "laden" && !wetten.data && <li className="wet-rij laad-blok" aria-busy="true" />}
        </ul>
      </section>

      {bladen.length > 0 && (
        <section className="home-uitgelicht" aria-labelledby="staatsbladen-kop">
          <h2 id="staatsbladen-kop">Meest voorkomende staatsbladen</h2>
          <ul className="uitgelicht-lijst">
            {bladen.map((w) => (
              <li key={w.bwbId}>
                <Link to={naarWet(w.bwbId)} className="uitgelicht-rij">
                  <span className="uitgelicht-nr">{staatsbladKort(w.staatsblad!)}</span>
                  <span className="uitgelicht-titel">{w.citeertitel}</span>
                  <span className="uitgelicht-meta">
                    {w.staatsblad!.datum && <span>Wet van {datumNL(w.staatsblad!.datum)}</span>}
                    {w.dossiers.length > 0 && <span>Kamerstukken {w.dossiers.map(dossierNr).join(", ")}</span>}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

type Rij =
  | { soort: "wet"; wet: Wet }
  | {
      soort: "groep";
      naam: string;
      afkorting: string;
      delen: { deel: string; wet: Wet }[];
    };

/**
 * Wetboeken die uit losse boeken bestaan (zoals het BW, waar elk boek een eigen
 * BWB-id heeft) komen als één rij met de boeken eronder. Herkend aan de citeertitel
 * zoals wetten.overheid.nl die geeft: "Burgerlijk Wetboek Boek 6".
 */
function groepeer(wetten: Wet[]): Rij[] {
  const rijen: Rij[] = [];
  const groepen = new Map<string, Extract<Rij, { soort: "groep" }>>();
  const gesorteerd = [...wetten].sort((a, b) => a.citeertitel.localeCompare(b.citeertitel, "nl", { numeric: true }));
  for (const w of gesorteerd) {
    const m = w.citeertitel.match(/^(.+?) (Boek \S+)$/);
    if (!m) {
      rijen.push({ soort: "wet", wet: w });
      continue;
    }
    const [, naam, deel] = m;
    let g = groepen.get(naam);
    if (!g) {
      g = {
        soort: "groep",
        naam,
        afkorting: (w.afkorting ?? "").replace(/^Boek \S+\s*/, ""),
        delen: [],
      };
      groepen.set(naam, g);
      rijen.push(g);
    }
    g.delen.push({ deel, wet: w });
  }
  return rijen;
}

function cijfers(ws: Wet[]) {
  const totaal = ws.reduce((t, w) => t + w.aantalArtikelen, 0);
  if (totaal === 0) return "Nog niet ingeladen";
  const met = ws.reduce((t, w) => t + w.aantalArtikelenMetPassages, 0);
  return `${met} van ${totaal} artikelen met passages`;
}

function bron(w: Wet) {
  const delen = [];
  if (w.staatsblad) delen.push(staatsbladKort(w.staatsblad));
  if (w.dossiers.length) delen.push(`Kamerstukken ${w.dossiers.map(dossierNr).join(", ")}`);
  return delen.join(" · ");
}
