import { useState } from "react";
import { api } from "../api/client";
import type { Oordeel, Passage } from "../api/types";
import { datumNL, kernDelen, soortNaam, vindplaats } from "../lib/citeer";

interface Props {
  passage: Passage;
  /** Positie in de lijst, voor schermlezers. */
  positie: number;
  totaal: number;
  wijsAan: (leden: string[]) => void;
  kiesLid: (lid: string) => void;
  meld: (tekst: string) => void;
}

export function PassageKaart({ passage: p, positie, totaal, wijsAan, kiesLid, meld }: Props) {
  const [oordeel, zetOordeel] = useState<Oordeel | null>(null);
  const plaats = vindplaats(p);

  const kopieer = async () => {
    try {
      await navigator.clipboard.writeText(`${plaats}.`);
      meld("Vindplaats gekopieerd");
    } catch {
      meld("Kopiëren lukte niet. Selecteer de vindplaats en kopieer hem zelf.");
    }
  };

  const geefOordeel = async (o: Oordeel) => {
    const vorige = oordeel;
    zetOordeel(o);
    try {
      await api.feedback({ passageId: p.id, oordeel: o });
    } catch {
      zetOordeel(vorige);
      meld("Je beoordeling is niet opgeslagen. Probeer het opnieuw.");
    }
  };

  return (
    <article
      className={`pk pk-${p.document.soort}`}
      aria-label={`Passage ${positie} van ${totaal}: ${soortNaam(p.document.soort)}`}
      onMouseEnter={() => wijsAan(p.leden)}
      onMouseLeave={() => wijsAan([])}
      onFocus={() => wijsAan(p.leden)}
      onBlur={() => wijsAan([])}
    >
      <header className="pk-kop">
        <div className="pk-bron">
          <span className="pk-soort">{soortNaam(p.document.soort)}</span>
          <span className="pk-datum">{datumNL(p.document.datum)}</span>
        </div>
        <Relevantie score={p.score} />
      </header>

      {p.sectie && <p className="pk-sectie">{p.sectie}</p>}

      <blockquote className="pk-tekst" cite={p.document.url}>
        <p>
          {kernDelen(p.tekst, p.kern).map((d, i) =>
            d.kern ? <mark key={i}>{d.tekst}</mark> : <span key={i}>{d.tekst}</span>,
          )}
        </p>
      </blockquote>

      <footer className="pk-voet">
        <p className="pk-vindplaats">
          <cite>{plaats}</cite>
        </p>
        <div className="pk-acties">
          {p.leden.length > 0 ? (
            p.leden.map((l) => (
              <button key={l} type="button" className="pk-lid" onClick={() => kiesLid(l)} title={`Toon alleen passages over lid ${l}`}>
                Lid {l}
              </button>
            ))
          ) : (
            <span className="pk-lid pk-lid-heel">Hele artikel</span>
          )}
          <span className="pk-ruimte" />
          <button type="button" className="knop-tekst" onClick={kopieer}>
            Kopieer vindplaats
          </button>
          <a className="knop-tekst" href={p.document.url} target="_blank" rel="noreferrer">
            Open Kamerstuk
          </a>
        </div>
        <div className="pk-oordeel" role="group" aria-label="Is deze passage nuttig bij dit artikel?">
          <span className="pk-oordeel-vraag">
            {oordeel ? "Bedankt, je oordeel helpt het model." : "Nuttig bij dit artikel?"}
          </span>
          <button
            type="button"
            className="pk-duim"
            aria-pressed={oordeel === "nuttig"}
            onClick={() => geefOordeel("nuttig")}
          >
            Ja
          </button>
          <button
            type="button"
            className="pk-duim"
            aria-pressed={oordeel === "niet-nuttig"}
            onClick={() => geefOordeel("niet-nuttig")}
          >
            Nee
          </button>
        </div>
      </footer>
    </article>
  );
}

function Relevantie({ score }: { score: number }) {
  const stappen = 5;
  const vol = Math.max(1, Math.round(score * stappen));
  const tekst = score.toLocaleString("nl-NL", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return (
    <span className="rel" title={`Relevantiescore van het model: ${tekst}`}>
      <span className="vh">Relevantiescore {tekst}</span>
      {Array.from({ length: stappen }, (_, i) => (
        <span key={i} className={`rel-streep${i < vol ? " rel-vol" : ""}`} aria-hidden="true" />
      ))}
    </span>
  );
}
