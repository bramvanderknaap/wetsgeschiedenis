import { useParams } from "react-router-dom";
import { api } from "../api/client";
import { useLaad } from "../lib/useLaad";
import { Inhoudsopgave } from "../components/Inhoudsopgave";
import { Foutmelding } from "../components/Foutmelding";
import { Zoekveld } from "../components/Zoekveld";
import { datumNL } from "../lib/citeer";

export function WetPagina() {
  const { bwbId = "" } = useParams();
  const wet = useLaad(() => api.wet(bwbId), [bwbId]);
  const structuur = useLaad(() => api.structuur(bwbId), [bwbId]);

  if (wet.status === "fout") return <div className="smal"><Foutmelding fout={wet.fout} /></div>;
  const w = wet.data;

  return (
    <div className="wet-pagina">
      <header className="wet-kop">
        {w ? (
          <>
            <p className="wet-kop-afk">{w.afkorting}</p>
            <h1>{w.citeertitel}</h1>
            <dl className="wet-meta">
              <div>
                <dt>Artikelen met passages</dt>
                <dd>
                  {w.aantalArtikelenMetPassages} van {w.aantalArtikelen}
                </dd>
              </div>
              <div>
                <dt>Kamerstukken</dt>
                <dd>{w.dossiers.join(", ")}</dd>
              </div>
              {w.geldigVanaf && (
                <div>
                  <dt>Geldende versie sinds</dt>
                  <dd>{datumNL(w.geldigVanaf)}</dd>
                </div>
              )}
              <div>
                <dt>Bron</dt>
                <dd>
                  <a href={w.bronUrl} target="_blank" rel="noreferrer">
                    wetten.overheid.nl
                  </a>
                </dd>
              </div>
            </dl>
            <Zoekveld bwbId={bwbId} />
          </>
        ) : (
          <div className="laad-blok laad-kop" aria-busy="true" />
        )}
      </header>
      {structuur.status === "fout" && <Foutmelding fout={structuur.fout} />}
      {structuur.data && <Inhoudsopgave bwbId={bwbId} structuur={structuur.data} />}
    </div>
  );
}
