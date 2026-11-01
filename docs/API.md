# API-contract Wetsgeschiedenis

Dit document is voor wie de backend bouwt. De frontend praat alleen met de
endpoints hieronder. De vormen van alle objecten staan als TypeScript-types in
[`src/api/types.ts`](../src/api/types.ts); dat bestand is leidend.

## Koppelen

1. Zet de backend-URL in `.env.local`: `VITE_API_URL=https://api.voorbeeld.nl/v1`
2. `npm run dev` of `npm run build`. Zonder `VITE_API_URL` draait de app op de voorbeelddata in `src/api/mock/`.
3. De backend moet CORS toestaan voor het domein van de frontend.

## Identifiers

Alles volgt de officiële bronnen, zodat elke wet erbij kan zonder dat het contract verandert.

| Wat | Vorm | Voorbeeld | Bron |
| --- | --- | --- | --- |
| Wet | BWB-id | `BWBR0040940` | wetten.overheid.nl |
| Artikel | nummer als string, precies zoals in de wet | `5`, `2a`, `7:17` | wetten.overheid.nl |
| Lid | nummer als string; `""` als het artikel geen leden heeft | `1`, `2` | wetten.overheid.nl |
| Kamerstuk | id van officielebekendmakingen.nl | `kst-34851-3` | officielebekendmakingen.nl |
| Handelingen | id van officielebekendmakingen.nl | `h-tk-20172018-83-11` | officielebekendmakingen.nl |

Artikelnummers kunnen een `:` of letters bevatten. De frontend URL-encodeert ze.

## Endpoints

Alle antwoorden zijn JSON. Een onbekende wet of een onbekend artikel geeft `404`.

| Methode | Pad | Antwoord |
| --- | --- | --- |
| GET | `/wetten` | `Wet[]` |
| GET | `/wetten/{bwbId}` | `Wet` |
| GET | `/wetten/{bwbId}/structuur` | `StructuurNode[]` (boom van hoofdstukken, paragrafen en artikelen, in wetsvolgorde) |
| GET | `/wetten/{bwbId}/artikelen` | `Artikel[]`: alle artikelen in wetsvolgorde, voor de doorlopende leesweergave (zoals een wetbundel) |
| GET | `/wetten/{bwbId}/artikelen/{nummer}` | `Artikel` (wettekst per lid, plus `vorige`/`volgende` voor bladeren) |
| GET | `/wetten/{bwbId}/artikelen/{nummer}/passages` | `Passage[]`, gesorteerd op `score`, hoogste eerst |
| GET | `/zoeken?q=…&wet={bwbId}` | `ZoekResultaat[]`, maximaal 20 |
| POST | `/passages/{id}/feedback` | body `{ "oordeel": "nuttig" \| "niet-nuttig" }`, antwoord `204` |

Optionele filters op `/passages`: `?lid=2` (passages over lid 2 plus passages over het hele artikel) en `?soort=memorie-van-toelichting&soort=amendement`. De huidige frontend haalt alle passages van een artikel op en filtert zelf, zodat hij per lid kan tellen. Filters in de backend zijn dus pas nodig bij heel veel passages.

## Wat de frontend van een passage verwacht

```json
{
  "id": "p-5-1",
  "bwbId": "BWBR0040940",
  "artikel": "5",
  "leden": ["1"],
  "document": {
    "id": "kst-34851-3",
    "soort": "memorie-van-toelichting",
    "kamer": "II",
    "vergaderjaar": "2017/18",
    "dossier": "34851",
    "ondernummer": "3",
    "titel": "Memorie van toelichting",
    "datum": "2017-12-12",
    "url": "https://zoek.officielebekendmakingen.nl/kst-34851-3.html"
  },
  "pagina": "92",
  "sectie": "Artikel 5",
  "tekst": "Letterlijke tekst uit het Kamerstuk …",
  "kern": [[0, 120]],
  "score": 0.91
}
```

- `leden` leeg betekent: de passage gaat over het artikel als geheel.
- `kern` zijn tekenposities `[begin, eind)` in `tekst`. De frontend zet daar een markering op. Weglaten mag.
- `score` loopt van 0 tot 1. De frontend toont hem als vijf streepjes en sorteert erop.
- `tekst` moet letterlijk uit het stuk komen. De frontend maakt de vindplaats zelf: *Kamerstukken II 2017/18, 34851, 3, p. 92.*
- `pagina` is de pagina in het Kamerstuk zoals gedrukt (dus niet de PDF-pagina).

## Documentsoorten

`memorie-van-toelichting`, `advies-raad-van-state`, `nader-rapport`, `verslag`,
`nota-naar-aanleiding-van-verslag`, `nota-van-wijziging`, `amendement`, `motie`,
`handelingen`, `memorie-van-antwoord`, `brief`, `overig`.

Een nieuwe soort toevoegen: zet hem in `DocumentSoort` in `types.ts` en geef hem een naam in `src/lib/citeer.ts`. Onbekende soorten toont de frontend als "Overig".

## Een nieuwe wet toevoegen

Voor de backend: lever de wet in `/wetten` en zorg dat de andere endpoints hem kennen. De frontend hoeft niet te veranderen.

Voor de voorbeelddata: zet de wet om met `scripts/bwb_naar_json.py` (zie README), maak een bestand naast `src/api/mock/uavg.ts` en zet het in de lijst `WETTEN` in `src/api/mock/mockApi.ts`.

`scripts/bwb_naar_json.py` laat zien hoe het XML van wetten.overheid.nl op dit contract past: `hoofdstuk`, `titeldeel`, `afdeling` en `paragraaf` worden `StructuurNode`; `artikel` met `lid`, `al` en `lijst`/`li` wordt `Artikel` met `Lid` en (geneste) `Onderdeel`. Een artikel met `status="nogniet"` krijgt `nogNietInWerking: true`.

## Wetten met boeken en titels (zoals het BW)

`StructuurSoort` kent `boek`, `deel`, `hoofdstuk`, `titel`, `afdeling`, `paragraaf` en `subparagraaf`. Een artikel als `7:17` kan dus gewoon onder Boek 7, Titel 1, Afdeling 3 staan.

Op wetten.overheid.nl heeft elk boek van het BW een eigen BWB-id (Boek 6 is `BWBR0005289`, Boek 7 is `BWBR0005290`). Lever ze dus als losse wetten in `/wetten`, met de citeertitel zoals wetten.overheid.nl die geeft ("Burgerlijk Wetboek Boek 6"). De startpagina zet alle boeken van één wetboek dan zelf in één rij.

## Staatsblad

`Wet.staatsblad` is de publicatie van de oorspronkelijke wet: `{ "jaar": 2018, "nummer": 144, "datum": "2018-05-16" }`. De frontend maakt daar "Stb. 2018, 144" en de link naar officielebekendmakingen.nl van. Mag ontbreken (bijvoorbeeld bij het BW).

De startpagina toont onder "Meest voorkomende staatsbladen" de wetten met een staatsblad, in de volgorde van `/wetten`. Wil je ze sorteren op hoe vaak ze worden geraadpleegd, zet de meest geraadpleegde dan vooraan.

## Wetten zonder inhoud

Een wet mag in `/wetten` staan voordat de tekst en de passages klaar zijn. Geef dan `aantalArtikelen: 0` en een lege lijst bij `/structuur` en `/artikelen`. De frontend toont "Nog niet ingeladen" en verwijst naar wetten.overheid.nl.

## Grote wetten

De leesweergave haalt alle artikelen van een wet in één keer op. Voor de UAVG (ruim 50 artikelen) is dat geen probleem. Voor een wet als het BW wordt dat te veel; dan kan er een parameter `?hoofdstuk=…` (of `?boek=…&titel=…`) bij die alleen dat deel levert. Laat het weten als je die bouwt, dan laadt de frontend per hoofdstuk.

## Versies van een wet

De geldende tekst verandert soms (de UAVG heeft een versie vanaf 1 september 2026). `Wet.geldigVanaf` geeft aan welke versie de backend levert. Wil je later oudere versies tonen, dan kan er een parameter `?peildatum=2021-07-01` bij; de frontend ondersteunt dat nog niet.
