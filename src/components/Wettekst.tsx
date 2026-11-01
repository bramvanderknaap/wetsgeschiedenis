import type { Artikel, Onderdeel } from "../api/types";

interface Props {
  artikel: Artikel;
  /** Aantal passages per lid (alleen passages die specifiek over dat lid gaan). */
  perLid: Record<string, number>;
  gekozenLid?: string;
  /** Leden die oplichten omdat de lezer een passage aanwijst. */
  oplichten: string[];
  kiesLid: (lid?: string) => void;
  /** Lidnummers zijn knoppen die de wetsgeschiedenis filteren (alleen als die open staat). */
  filterbaar?: boolean;
}

export function Wettekst({ artikel, perLid, gekozenLid, oplichten, kiesLid, filterbaar = true }: Props) {
  if (artikel.leden.length === 0) {
    return (
      <p className="wt-leeg">
        De tekst van dit artikel is nog niet ingeladen. Lees het artikel op{" "}
        <a href={artikel.bronUrl} target="_blank" rel="noreferrer">
          wetten.overheid.nl
        </a>
        .
      </p>
    );
  }
  const zonderLeden = artikel.leden.length === 1 && !artikel.leden[0].nummer;

  return (
    <ol className="wt">
      {artikel.leden.map((lid) => {
        const aantal = perLid[lid.nummer] ?? 0;
        const gekozen = gekozenLid === lid.nummer;
        const licht = oplichten.includes(lid.nummer);
        return (
          <li
            key={lid.nummer || "x"}
            className={`wt-lid${zonderLeden ? " wt-zonder-leden" : ""}${gekozen ? " wt-gekozen" : ""}${licht ? " wt-licht" : ""}`}
          >
            {!zonderLeden && !filterbaar && <span className="wt-lid-knop wt-lid-vast">{lid.nummer}</span>}
            {!zonderLeden && filterbaar && (
              <button
                type="button"
                className="wt-lid-knop"
                aria-pressed={gekozen}
                onClick={() => kiesLid(gekozen ? undefined : lid.nummer)}
                title={gekozen ? "Toon weer alle passages" : `Toon passages over lid ${lid.nummer}`}
              >
                <span className="wt-lid-nr">{lid.nummer}</span>
                <span className="wt-lid-aantal">{aantal > 0 ? aantal : ""}</span>
                <span className="vh">
                  {gekozen ? "Filter op dit lid uitzetten" : `Lid ${lid.nummer}, ${aantal} passages`}
                </span>
              </button>
            )}
            <div className="wt-tekst">
              <p>{lid.tekst}</p>
              {lid.onderdelen && <Onderdelen lijst={lid.onderdelen} />}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function Onderdelen({ lijst }: { lijst: Onderdeel[] }) {
  return (
    <ol className="wt-onderdelen">
      {lijst.map((o, i) => (
        <li key={o.label || i} className={o.label ? undefined : "wt-zonder-label"}>
          {o.label ? (
            <>
              <span className="wt-onderdeel-label">{o.label}.</span> {o.tekst}
            </>
          ) : (
            o.tekst
          )}
          {o.onderdelen && <Onderdelen lijst={o.onderdelen} />}
        </li>
      ))}
    </ol>
  );
}
