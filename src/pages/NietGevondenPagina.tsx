import { Link } from "react-router-dom";

export function NietGevondenPagina() {
  return (
    <div className="smal">
      <h1>Deze pagina bestaat niet</h1>
      <p>Zoek het artikel bovenin, of begin bij het overzicht van wetten.</p>
      <Link to="/">Naar alle wetten</Link>
    </div>
  );
}
