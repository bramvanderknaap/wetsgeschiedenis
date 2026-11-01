import { Link } from "react-router-dom";
import type { ArtikelNummer, BwbId, StructuurNode } from "../api/types";
import { naarArtikel } from "../lib/paden";

interface Props {
  bwbId: BwbId;
  structuur: StructuurNode[];
  huidig?: ArtikelNummer;
  /** Zijbalk: compacter, en alleen het hoofdstuk van het huidige artikel open. */
  zijbalk?: boolean;
}

const SOORT_NAAM: Record<string, string> = {
  boek: "Boek",
  deel: "Deel",
  hoofdstuk: "Hoofdstuk",
  titel: "Titel",
  afdeling: "Afdeling",
  paragraaf: "Paragraaf",
  subparagraaf: "Subparagraaf",
};

function bevat(n: StructuurNode, nummer?: ArtikelNummer): boolean {
  if (!nummer) return false;
  return n.soort === "artikel" ? n.nummer === nummer : n.kinderen.some((k) => bevat(k, nummer));
}

export function Inhoudsopgave({ bwbId, structuur, huidig, zijbalk }: Props) {
  const knoop = (n: StructuurNode, diepte: number): JSX.Element => {
    if (n.soort === "artikel") {
      const isHuidig = n.nummer === huidig;
      return (
        <li key={`a-${n.nummer}`}>
          <Link
            to={naarArtikel(bwbId, n.nummer)}
            className={`io-artikel${isHuidig ? " io-huidig" : ""}${n.aantalPassages === 0 ? " io-leeg" : ""}`}
            aria-current={isHuidig ? "page" : undefined}
          >
            <span className="io-nr">{n.nummer}</span>
            <span className="io-titel">{n.titel ?? ""}</span>
            <span className="io-aantal" aria-label={`${n.aantalPassages} passages`}>
              {n.aantalPassages > 0 ? n.aantalPassages : "–"}
            </span>
          </Link>
        </li>
      );
    }
    const open = zijbalk ? bevat(n, huidig) : true;
    return (
      <li key={`${n.soort}-${n.nummer}`} className={`io-groep io-diepte-${diepte}`}>
        <details open={open}>
          <summary>
            <span className="io-groep-soort">
              {SOORT_NAAM[n.soort]} {n.nummer}
            </span>
            <span className="io-groep-titel">{n.titel}</span>
          </summary>
          <ul>{n.kinderen.map((k) => knoop(k, diepte + 1))}</ul>
        </details>
      </li>
    );
  };

  return (
    <nav className={`io${zijbalk ? " io-zijbalk" : ""}`} aria-label="Inhoudsopgave">
      <ul>{structuur.map((n) => knoop(n, 0))}</ul>
    </nav>
  );
}
