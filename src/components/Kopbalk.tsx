import { Link, useParams } from "react-router-dom";
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
        {gebruiktVoorbeelddata && (
          <span className="voorbeeld-label" title="De backend is nog niet gekoppeld. Je ziet voorbeelddata.">
            Voorbeelddata
          </span>
        )}
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
