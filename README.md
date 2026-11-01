# Wetsgeschiedenis zoeker

Interface die per wetsartikel de nuttigste passages uit de parlementaire
geschiedenis toont. Eerste wet: de Uitvoeringswet AVG (BWBR0040940).

## Starten

```bash
npm install
npm run dev        # http://localhost:5173, met voorbeelddata
```

Met de echte backend: kopieer `.env.example` naar `.env.local` en vul `VITE_API_URL` in.

## Opbouw

| Map | Wat |
| --- | --- |
| `src/api/types.ts` | Het datacontract (leidend voor de backend) |
| `src/api/client.ts` | De interface die de schermen gebruiken; kiest tussen backend en voorbeelddata |
| `src/api/http.ts` | Koppeling met de backend |
| `src/api/mock/` | Voorbeelddata: de UAVG met tekst en passages; de andere wetten alleen met hun gegevens |
| `src/pages/` | Schermen: startpagina en de wet als bundel |
| `src/components/` | Onderdelen: zoekveld, keuzepad, artikel, wettekst, passage |
| `docs/API.md` | Endpoints en afspraken voor de backend |

## Een wet inladen uit XML

Download de wet op wetten.overheid.nl als XML en zet het bestand in `data/`. Zet het daarna om:

```bash
python3 scripts/bwb_naar_json.py data/BWBR0040940_2026-09-01_0.xml src/api/mock/data/BWBR0040940.json
```

Het script haalt de indeling (hoofdstukken, paragrafen), de artikelen, leden en onderdelen uit het bestand, in de vorm van `src/api/types.ts`. Het werkt voor elke wet uit het Basiswettenbestand en is ook bruikbaar voor de backend.

## Bouwen

- `npm run build` maakt een gewone site in `dist/` (bijv. voor Vercel).
- `npm run build:preview` maakt één los HTML-bestand in `dist-preview/` om te delen.

Op Vercel met nette URL's: voeg een rewrite toe van alle paden naar `/index.html` (staat in `vercel.json`).
