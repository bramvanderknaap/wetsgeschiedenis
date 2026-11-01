import type { MockNode } from "./mockApi";

const a = (nummer: string, titel?: string): MockNode => ({ soort: "artikel", nummer, titel });

/** Indeling en opschriften volgens wetten.overheid.nl, versie geldig vanaf 1 juli 2021. */
export const structuur: MockNode[] = [
  {
    soort: "hoofdstuk",
    nummer: "1",
    titel: "Algemene bepalingen",
    kinderen: [
      a("1", "Definities"),
      a("2", "Materiële reikwijdte"),
      a("2a", "Inachtneming behoeften kleine, middelgrote en micro-ondernemingen"),
      a("3", "Schakelbepaling verwerkingen buiten werkingssfeer verordening"),
      a("4", "Territoriale reikwijdte"),
      a("5", "Toestemming van wettelijk vertegenwoordiger"),
    ],
  },
  {
    soort: "hoofdstuk",
    nummer: "2",
    titel: "De Autoriteit persoonsgegevens",
    kinderen: [
      {
        soort: "paragraaf",
        nummer: "2.1",
        titel: "Oprichting en inrichting van de Autoriteit persoonsgegevens",
        kinderen: [
          a("6", "Oprichting en aanwijzing als toezichthoudende autoriteit"),
          a("7", "Samenstelling"),
          a("8", "Disciplinaire maatregelen voorzitter en andere leden"),
          a("9", "Rechtspositie voorzitter, andere leden en buitengewone leden"),
          a("10", "Secretariaat"),
          a("11", "Begroting, verantwoording en vertegenwoordigingsbevoegdheid"),
          a("12", "Beperking inlichtingenplicht jegens minister"),
          a("13", "Uitzonderingen bevoegdheden inzake beleidsregels, vernietiging en taakverwaarlozing"),
        ],
      },
      {
        soort: "paragraaf",
        nummer: "2.2",
        titel: "De uitoefening van de taken en bevoegdheden van de Autoriteit persoonsgegevens",
        kinderen: [
          a("14", "Taken en bevoegdheden"),
          a("15", "Toezicht op de naleving"),
          a("16", "Last onder bestuursdwang"),
          a("17", "Boete bij onrechtmatige verwerking persoonsgegevens strafrechtelijke aard"),
          a("18", "Bestuurlijke boete aan overheden"),
          a("19", "Samenwerking met andere toezichthouders"),
          a("20", "In rechte optreden tegen inbreuken op verordening inzake doorgifte naar derde land"),
          a("21", "Aanwijzing accrediterende instantie"),
          a("21a"),
        ],
      },
    ],
  },
  {
    soort: "hoofdstuk",
    nummer: "3",
    titel: "Bepalingen ter uitvoering van de verordening",
    kinderen: [
      {
        soort: "paragraaf",
        nummer: "3.1",
        titel: "Bijzondere categorieën van persoonsgegevens",
        kinderen: [
          a("22", "Verwerkingsverbod bijzondere categorieën persoonsgegevens en algemene uitzonderingen uit verordening"),
          a("23", "Nationaalrechtelijke algemene uitzonderingen"),
          a("24", "Uitzonderingen voor wetenschappelijk of historisch onderzoek of statistische doeleinden"),
          a("25", "Uitzonderingen inzake verwerking persoonsgegevens waaruit ras of etnische afkomst blijkt"),
          a("26", "Uitzonderingen inzake verwerking persoonsgegevens waaruit politieke opvattingen blijken voor vervulling openbare functies"),
          a("27", "Uitzonderingen inzake verwerking persoonsgegevens waaruit religieuze of levensbeschouwelijke overtuigingen blijken voor geestelijke verzorging"),
          a("28", "Uitzonderingen inzake genetische gegevens"),
          a("29", "Uitzonderingen inzake biometrische gegevens"),
          a("30", "Uitzonderingen inzake gegevens over gezondheid"),
        ],
      },
      {
        soort: "paragraaf",
        nummer: "3.2",
        titel: "Persoonsgegevens van strafrechtelijke aard",
        kinderen: [a("31", "Uitzonderingen op de verplichting tot verwerking onder overheidstoezicht"), a("32"), a("33")],
      },
      { soort: "paragraaf", nummer: "3.3", titel: "Rechtsbescherming", kinderen: [a("34"), a("35"), a("36"), a("37"), a("38")] },
      { soort: "paragraaf", nummer: "3.4", titel: "De functionaris voor gegevensbescherming", kinderen: [a("39")] },
    ],
  },
  {
    soort: "hoofdstuk",
    nummer: "4",
    titel: "Uitzonderingen en beperkingen",
    kinderen: ["40", "41", "42", "43", "44", "45", "46", "47"].map((n) => a(n)),
  },
  {
    soort: "hoofdstuk",
    nummer: "5",
    titel: "Overgangs- en slotbepalingen",
    kinderen: ["48", "49", "50", "51", "52", "53", "54"].map((n) => a(n)),
  },
];
