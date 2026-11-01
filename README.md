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

## Bouwen

- `npm run build` maakt een gewone site in `dist/` (bijv. voor Vercel).
- `npm run build:preview` maakt één los HTML-bestand in `dist-preview/` om te delen.

Op Vercel met nette URL's: voeg een rewrite toe van alle paden naar `/index.html` (staat in `vercel.json`).
