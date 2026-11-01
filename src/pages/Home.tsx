import { Link } from "react-router-dom";
import { api } from "../api/client";
import { useLaad } from "../lib/useLaad";
import { naarWet } from "../lib/paden";
import { Zoekveld } from "../components/Zoekveld";
import { Foutmelding } from "../components/Foutmelding";

export function Home() {
  const wetten = useLaad(() => api.wetten(), []);

  return (
    <div className="home">
      <section className="home-kop">
        <h1>Wat bedoelde de wetgever?</h1>
        <p className="home-intro">
          Kies een artikel en lees de passages uit de parlementaire geschiedenis die er het meest over
          zeggen, met vindplaats en link naar het Kamerstuk.
        </p>
        <Zoekveld autoFocus />
      </section>

      <section className="home-wetten" aria-labelledby="wetten-kop">
        <h2 id="wetten-kop">Wetten</h2>
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
    </div>
  );
}
