import { useState } from "react";
import { api } from "../api/client";
import type { Oordeel, Passage } from "../api/types";
import { datumNL, kernDelen, soortNaam, vindplaats } from "../lib/citeer";

interface Props {
  passage: Passage;
  wijsAan: (leden: string[]) => void;
  kiesLid: (lid: string) => void;
  meld: (tekst: string) => void;
}

/** Score van het model vertaald naar woorden: een jurist leest "zeer relevant" sneller dan "0,93". */
export function relevantie(score: number): { label: string; stappen: number } {
  if (score >= 0.85) return { label: "Zeer relevant", stappen: 3 };
  if (score >= 0.7) return { label: "Relevant", stappen: 2 };
  return { label: "Mogelijk relevant", stappen: 1 };
}

export function PassageKaart({ passage: p, wijsAan, kiesLid, meld }: Props) {
  const [oordeel, zetOordeel] = useState<Oordeel | null>(null);
  const plaats = vindplaats(p);
  const rel = relevantie(p.score);
  const scoreTekst = p.score.toLocaleString("nl-NL", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

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
    const nieuw = oordeel === o ? null : o;
    zetOordeel(nieuw);
    if (!nieuw) return;
    try {
      await api.feedback({ passageId: p.id, oordeel: nieuw });
      meld(nieuw === "nuttig" ? "Opgeslagen als nuttig" : "Opgeslagen als niet nuttig");
    } catch {
      zetOordeel(vorige);
      meld("Je beoordeling is niet opgeslagen. Probeer het opnieuw.");
    }
  };

  return (
    <article
      className="pk"
      aria-labelledby={`${p.id}-kop`}
      onMouseEnter={() => wijsAan(p.leden)}
      onMouseLeave={() => wijsAan([])}
      onFocus={() => wijsAan(p.leden)}
      onBlur={() => wijsAan([])}
    >
      <header className="pk-kop">
        <h3 id={`${p.id}-kop`} className="pk-soort">
          {soortNaam(p.document.soort)}
        </h3>
        <span className={`rel rel-${rel.stappen}`} title={`Relevantiescore van het model: ${scoreTekst}`}>
          <span className="rel-stippen" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          {rel.label}
        </span>
        <p className="pk-meta">
          <time dateTime={p.document.datum}>{datumNL(p.document.datum)}</time>
          {p.sectie && <span>{p.sectie}</span>}
        </p>
      </header>

      <blockquote className="pk-tekst" cite={p.document.url}>
        <p>
          {kernDelen(p.tekst, p.kern).map((d, i) =>
            d.kern ? <mark key={i}>{d.tekst}</mark> : <span key={i}>{d.tekst}</span>,
          )}
        </p>
      </blockquote>

      <footer className="pk-voet">
        <div className="pk-bronregel">
          <cite className="pk-vindplaats">{plaats}</cite>
          <button type="button" className="icoonknop" onClick={kopieer} aria-label={`Kopieer vindplaats: ${plaats}`} title="Kopieer vindplaats">
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
              <rect x="8" y="8" width="12" height="12" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
              <path d="M16 8V6.5A2.5 2.5 0 0 0 13.5 4h-7A2.5 2.5 0 0 0 4 6.5v7A2.5 2.5 0 0 0 6.5 16H8" fill="none" stroke="currentColor" strokeWidth="1.8" />
            </svg>
          </button>
          <a className="pk-open" href={p.document.url} target="_blank" rel="noreferrer">
            Open Kamerstuk<span className="vh"> (opent in nieuw tabblad)</span>
          </a>
        </div>

        <div className="pk-actieregel">
          <div className="pk-leden">
            {p.leden.length > 0 ? (
              p.leden.map((l) => (
                <button key={l} type="button" className="pk-lid" onClick={() => kiesLid(l)} aria-label={`Toon alleen passages over lid ${l}`}>
                  Lid {l}
                </button>
              ))
            ) : (
              <span className="pk-heel">Gaat over het hele artikel</span>
            )}
          </div>
          <div className="pk-oordeel" role="group" aria-label="Is deze passage nuttig bij dit artikel?">
            <button
              type="button"
              className="icoonknop"
              aria-pressed={oordeel === "nuttig"}
              aria-label="Nuttig"
              title="Nuttig bij dit artikel"
              onClick={() => geefOordeel("nuttig")}
            >
              <Duim />
            </button>
            <button
              type="button"
              className="icoonknop duim-omlaag"
              aria-pressed={oordeel === "niet-nuttig"}
              aria-label="Niet nuttig"
              title="Niet nuttig bij dit artikel"
              onClick={() => geefOordeel("niet-nuttig")}
            >
              <Duim />
            </button>
          </div>
        </div>
      </footer>
    </article>
  );
}

function Duim() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M7 10.5V20H4.5A1.5 1.5 0 0 1 3 18.5v-6.5A1.5 1.5 0 0 1 4.5 10.5H7Zm0 0 3.6-6.3a1.6 1.6 0 0 1 3 .9l-.6 4H18a2 2 0 0 1 2 2.3l-1.1 6.8A2 2 0 0 1 16.9 20H7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}
