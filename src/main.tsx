import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./fonts.css";
import "./styles.css";
import { leesThema, zetThema } from "./lib/thema";

// Thema zetten vóór de eerste weergave, zodat de pagina niet eerst in het verkeerde thema flitst.
zetThema(leesThema());

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
