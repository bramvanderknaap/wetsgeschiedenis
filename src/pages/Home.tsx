import { Link } from "react-router-dom";
import { api } from "../api/client";
import { useLaad } from "../lib/useLaad";
import { naarArtikel, naarWet } from "../lib/paden";
import type { ArtikelVerwijzing, StructuurNode } from "../api/types";
import { Zoekveld } from "../components/Zoekveld";
import { Foutmelding } from "../components/Foutmelding";

export function Home() {
  const wetten = useLaad(() => api.wetten(), []);
  const eerste = wetten.data?.[0];
  const uitgelicht = useLaad(
    async () => (eerste ? meesteWetsgeschiedenis(await api.structuur(eerste.bwbId)) : []),
    [eerste?.bwbId],
  );

  return (
    <div className="home">
      <section className="home-kop">
        <h1>Wat bedoelde de wetgever?</h1>
        <p className="home-intro">
          Lees de wet artikel voor artikel, met onder elk artikel de passages uit de parlementaire
          geschiedenis die er het meest over zeggen.
        </p>
        <Zoekveld autoFocus />
      </section>

      <section className="home-wetten" aria-labelledby="wetten-kop">
        <h2 id="wetten-kop">Kies een wet</h2>
        {wetten.status === "fout" && <Foutmelding fout={wetten.fout} />}
        <ul className="wet-lijst">
          {wetten.data?.map((w) => (
            <li key={w.bwbId}>
              <Link to={naarWet(w.bwbId)} className="wet-rij">
                <span className="wet-afkorting">{w.afkorting ?? w.bwbId}</span>
                <span className="wet-naam">{w.citeertitel}</span>
                <span className="wet-cijfers">
                  {w.aantalArtikelenMetPassages} van {w.aantalArtikelen} artikelen met passages
                </span>
                <span className="wet-bron">
                  Kamerstukken {w.dossiers.map((d) => d.replace(/^(\d{2})(\d{3})$/, "$1 $2")).join(", ")}
                </span>
              </Link>
            </li>
          ))}
          {wetten.status === "laden" && !wetten.data && <li className="wet-rij laad-blok" aria-busy="true" />}
        </ul>
      </section>
      {eerste && uitgelicht.data && uitgelicht.data.length > 0 && (
        <section className="home-uitgelicht" aria-labelledby="uitgelicht-kop">
          <h2 id="uitgelicht-kop">Meeste wetsgeschiedenis in de {eerste.afkorting ?? eerste.citeertitel}</h2>
          <ul className="uitgelicht-lijst">
            {uitgelicht.data.map((a) => (
              <li key={a.nummer}>
                <Link to={naarArtikel(eerste.bwbId, a.nummer)} className="uitgelicht-rij">
                  <span className="uitgelicht-nr">Artikel {a.nummer}</span>
                  <span className="uitgelicht-titel">{a.titel ?? ""}</span>
                  <span className="uitgelicht-aantal">
                    {a.aantalPassages} {a.aantalPassages === 1 ? "passage" : "passages"}
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

function meesteWetsgeschiedenis(structuur: StructuurNode[]): ArtikelVerwijzing[] {
  const arts: ArtikelVerwijzing[] = [];
  const loop = (ns: StructuurNode[]) => ns.forEach((n) => (n.soort === "artikel" ? arts.push(n) : loop(n.kinderen)));
  loop(structuur);
  return arts
    .filter((a) => a.aantalPassages > 0)
    .sort((a, b) => b.aantalPassages - a.aantalPassages)
    .slice(0, 4);
}
