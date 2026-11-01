import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { leesThema, zetThema, type Thema } from "../lib/thema";
import { gebruiktVoorbeelddata } from "../api/client";
import { Zoekveld } from "./Zoekveld";

export function Kopbalk() {
  const { bwbId } = useParams();
  return (
    <header className="kopbalk">
      <div className="kopbalk-binnen">
        <Link to="/" className="merk" aria-label="Wetsgeschiedenis, naar het begin">
          <Beeldmerk />
          <span>Wetsgeschiedenis</span>
        </Link>
        <Zoekveld bwbId={bwbId} compact />
        <span className="kopbalk-rechts">
        {gebruiktVoorbeelddata && (
          <span className="voorbeeld-label" title="De backend is nog niet gekoppeld. Je ziet voorbeelddata.">
            Voorbeelddata
          </span>
        )}
        <ThemaKnop />
        </span>
      </div>
    </header>
  );
}

function Beeldmerk() {
  return (
    <svg width="22" height="22" viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="7" fill="#23408E" />
      <rect x="8" y="8.5" width="16" height="2.2" rx="1.1" fill="#fff" opacity="0.55" />
      <rect x="7" y="13.4" width="18" height="5.2" rx="1.4" fill="#FBE79A" />
      <rect x="8" y="15" width="13" height="2.2" rx="1.1" fill="#23408E" />
      <rect x="8" y="21.3" width="11" height="2.2" rx="1.1" fill="#fff" opacity="0.55" />
    </svg>
  );
}

function ThemaKnop() {
  const [thema, zet] = useState<Thema>(leesThema);
  const ander: Thema = thema === "licht" ? "donker" : "licht";
  return (
    <button
      type="button"
      className="icoonknop thema-knop"
      aria-label={`Schakel naar ${ander} thema`}
      title={`Schakel naar ${ander} thema`}
      onClick={() => {
        zetThema(ander);
        zet(ander);
      }}
    >
      {thema === "licht" ? (
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )}
    </button>
  );
}
