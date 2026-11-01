export type Thema = "licht" | "donker";

const SLEUTEL = "wetsgeschiedenis-thema";

/** Gekozen thema, standaard licht. Opgeslagen per browser; werkt ook als opslaan niet mag. */
export function leesThema(): Thema {
  try {
    return localStorage.getItem(SLEUTEL) === "donker" ? "donker" : "licht";
  } catch {
    return "licht";
  }
}

export function zetThema(t: Thema) {
  document.documentElement.dataset.theme = t === "donker" ? "dark" : "light";
  try {
    localStorage.setItem(SLEUTEL, t);
  } catch {
    /* opslaan niet toegestaan: keuze geldt alleen voor deze sessie */
  }
}
