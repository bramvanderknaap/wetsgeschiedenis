#!/usr/bin/env python3
"""
Zet een wet in het XML-formaat van wetten.overheid.nl (BWB-toestand) om naar JSON
in de vorm van het datacontract (src/api/types.ts).

Gebruik:
    python3 scripts/bwb_naar_json.py data/BWBR0040940_2026-09-01_0.xml src/api/mock/data/BWBR0040940.json

Het XML-bestand download je op wetten.overheid.nl bij de wet (kies XML). Werkt voor
elke wet in het Basiswettenbestand: hoofdstukken, titels, afdelingen, paragrafen,
artikelen, leden en (geneste) onderdelen. Alleen de standaardbibliotheek van Python.

Uitvoer:
    {
      "wet": { bwbId, citeertitel, geldigVanaf, staatsblad, dossiers, bronUrl },
      "structuur": [ { soort, nummer, titel, kinderen: [...] } | { soort: "artikel", nummer, titel } ],
      "artikelen": { "<nummer>": { titel, leden: [ { nummer, tekst, onderdelen } ], nogNietInWerking } }
    }
"""
import json
import re
import sys
import xml.etree.ElementTree as ET

# Elementnaam in het BWB-XML -> StructuurSoort in het datacontract.
GROEPEN = {
    "boek": "boek",
    "deel": "deel",
    "hoofdstuk": "hoofdstuk",
    "titeldeel": "titel",
    "afdeling": "afdeling",
    "paragraaf": "paragraaf",
    "sub-paragraaf": "subparagraaf",
}

def schoon(tekst):
    return re.sub(r"\s+", " ", tekst).strip()


def tekst_van(e):
    """Lopende tekst van een element, zonder metadata. Redactionele noten zoals op wetten.overheid.nl: [Red: …]."""
    delen = []

    def loop(x):
        if x.tag == "meta-data":
            return
        if x.tag == "redactie":
            delen.append(f"[Red: {schoon(''.join(x.itertext()))}]")
        else:
            if x.text:
                delen.append(x.text)
            for k in x:
                loop(k)
                if k.tail:
                    delen.append(k.tail)

    loop(e)
    return schoon("".join(delen))


def alineas(e):
    """De alinea's (al) direct onder een element, samengevoegd."""
    return " ".join(t for t in (tekst_van(al) for al in e.findall("al")) if t)


def onderdelen(lijst):
    uit = []
    for li in lijst.findall("li"):
        nr = li.find("li.nr")
        label = schoon(nr.text or "").rstrip(".") if nr is not None else ""
        o = {"label": label, "tekst": alineas(li)}
        sub = li.find("lijst")
        if sub is not None:
            o["onderdelen"] = onderdelen(sub)
        uit.append(o)
    return uit


def lid_van(e, nummer):
    lid = {"nummer": nummer, "tekst": alineas(e)}
    lijst = e.find("lijst")
    if lijst is not None:
        lid["onderdelen"] = onderdelen(lijst)
    return lid


def kop(e):
    k = e.find("kop")
    if k is None:
        return "", None
    nr = k.find("nr")
    titel = k.find("titel")
    return (
        schoon(nr.text or "") if nr is not None else "",
        tekst_van(titel) if titel is not None and tekst_van(titel) else None,
    )


def artikel(e):
    nummer, titel = kop(e)
    leden = [lid_van(l, schoon(l.findtext("lidnr") or "").rstrip(".")) for l in e.findall("lid")]
    if not leden and (e.find("al") is not None or e.find("lijst") is not None):
        leden = [lid_van(e, "")]
    a = {"titel": titel, "leden": leden} if titel else {"leden": leden}
    if e.get("status") == "nogniet":
        a["nogNietInWerking"] = True
    return nummer, a


def main(bron, doel):
    root = ET.parse(bron).getroot()
    bwb_id = root.get("bwb-id")
    versie = root.get("inwerkingtreding")

    artikelen = {}

    def structuur(e):
        uit = []
        for k in e:
            if k.tag == "artikel":
                nummer, a = artikel(k)
                artikelen[nummer] = a
                node = {"soort": "artikel", "nummer": nummer}
                if a.get("titel"):
                    node["titel"] = a["titel"]
                uit.append(node)
            elif k.tag in GROEPEN:
                nummer, titel = kop(k)
                uit.append({"soort": GROEPEN[k.tag], "nummer": nummer, "titel": titel or "", "kinderen": structuur(k)})
            elif k.tag in ("wettekst", "wet-besluit", "regeling-tekst", "circulaire-tekst"):
                uit.extend(structuur(k))
        return uit

    wettekst = root.find(".//wettekst")
    if wettekst is None:
        wettekst = root.find(".//regeling-tekst")
    boom = structuur(wettekst)

    citeertitel = root.find(".//citeertitel")
    pub = root.find("./wetgeving/intitule/meta-data/brondata/oorspronkelijk/publicatie")
    wet = {
        "bwbId": bwb_id,
        "citeertitel": tekst_van(citeertitel) if citeertitel is not None else bwb_id,
        "geldigVanaf": versie,
        "dossiers": [],
        "bronUrl": f"https://wetten.overheid.nl/{bwb_id}/{versie}",
    }
    if pub is not None and pub.get("soort") == "Stb":
        wet["staatsblad"] = {
            "jaar": int(pub.findtext("publicatiejaar")),
            "nummer": int(pub.findtext("publicatienr")),
            "datum": pub.find("ondertekeningsdatum").get("isodatum"),
        }
        wet["dossiers"] = [d.get("dossier") for d in pub.findall("dossierref")]

    with open(doel, "w", encoding="utf-8") as f:
        json.dump({"wet": wet, "structuur": boom, "artikelen": artikelen}, f, ensure_ascii=False, indent=1)
        f.write("\n")
    print(f"{wet['citeertitel']} ({bwb_id}, versie {versie}): {len(artikelen)} artikelen -> {doel}")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2])
