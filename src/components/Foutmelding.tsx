import { Link } from "react-router-dom";
import { NietGevonden } from "../api/client";

export function Foutmelding({ fout }: { fout: Error }) {
  if (fout instanceof NietGevonden) {
    return (
      <div className="melding" role="alert">
        <p>Dit onderdeel staat niet in de database. Controleer het artikelnummer of kies het via de inhoudsopgave.</p>
        <Link to="/">Naar alle wetten</Link>
      </div>
    );
  }
  return (
    <div className="melding" role="alert">
      <p>De gegevens konden niet worden geladen. Controleer je verbinding en laad de pagina opnieuw.</p>
      <p className="melding-detail">{fout.message}</p>
    </div>
  );
}
