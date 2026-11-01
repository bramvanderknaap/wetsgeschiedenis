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
      "artikelen": { "<nummer>": { titel, leden: [ { nummer, tekst, onderdelen, slot } ], nogNietInWerking, vervallen } }
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


def inhoud(e):
    """
    Tekst, opsomming en slottekst van een lid, onderdeel of artikel, in de volgorde
    van de wet: alinea's voor de opsomming (gescheiden door een regeleinde), de
    opsomming zelf, en alinea's die na de opsomming komen.
    """
    voor, na, lijst = [], [], None
    for k in e:
        if k.tag == "al":
            t = tekst_van(k)
            if t:
                (na if lijst is not None else voor).append(t)
        elif k.tag == "lijst" and lijst is None:
            lijst = k
    uit = {"tekst": "\n".join(voor)}
    if lijst is not None:
        uit["onderdelen"] = onderdelen(lijst)
    if na:
        uit["slot"] = "\n".join(na)
    return uit


def onderdelen(lijst):
    uit = []
    for li in lijst.findall("li"):
        nr = li.find("li.nr")
        label = schoon(nr.text or "").rstrip(".") if nr is not None else ""
        o = {"label": label, **inhoud(li)}
        if "slot" in o:  # komt in onderdelen niet voor; voeg samen met de tekst
            o["tekst"] = "\n".join([o["tekst"], o.pop("slot")])
        uit.append(o)
    return uit


def lid_van(e, nummer):
    return {"nummer": nummer, **inhoud(e)}


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
    a = {"titel": titel} if titel else {}
    if e.get("status") == "vervallen":
        # Op wetten.overheid.nl: "Artikel 20h [Vervallen]". Geen tekst meer.
        return nummer, {**a, "leden": [], "vervallen": True}
    leden = [lid_van(l, schoon(l.findtext("lidnr") or "").rstrip(".")) for l in e.findall("lid")]
    los = inhoud(e)  # tekst direct onder het artikel (zonder leden, of als aanloop voor de leden)
    if los["tekst"] or "onderdelen" in los:
        leden = [{"nummer": "", **los}] + leden
    a["leden"] = leden
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
                if a.get("vervallen"):
                    node["vervallen"] = True
                uit.append(node)
            elif k.tag in GROEPEN:
                nummer, titel = kop(k)
                kinderen = structuur(k)
                if kinderen:  # een onderdeel zonder artikelen (bijv. nog niet in werking) laten we weg
                    uit.append({"soort": GROEPEN[k.tag], "nummer": nummer, "titel": titel or "", "kinderen": kinderen})
            elif k.tag in ("wettekst", "wet-besluit", "regeling-tekst", "circulaire-tekst"):
                uit.extend(structuur(k))
        return uit

    wettekst = root.find(".//wettekst")
    if wettekst is None:
        wettekst = root.find(".//regeling-tekst")
    boom = structuur(wettekst)
    # Een boek van het BW staat in zijn geheel in één <boek>; dat niveau is de wet zelf.
    if len(boom) == 1 and boom[0]["soort"] == "boek":
        boom = boom[0]["kinderen"]

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
        if pub.get("urlidentifier"):
            wet["staatsblad"]["url"] = f"https://zoek.officielebekendmakingen.nl/{pub.get('urlidentifier')}.html"
        wet["dossiers"] = [d.get("dossier") for d in pub.findall("dossierref")]

    with open(doel, "w", encoding="utf-8") as f:
        json.dump({"wet": wet, "structuur": boom, "artikelen": artikelen}, f, ensure_ascii=False, indent=1)
        f.write("\n")
    print(f"{wet['citeertitel']} ({bwb_id}, versie {versie}): {len(artikelen)} artikelen -> {doel}")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2])
