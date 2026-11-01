import type { MockWet } from "./mockApi";
import { structuur } from "./uavg-structuur";
import { documenten, passages } from "./uavg-passages";

/**
 * Voorbeelddata Uitvoeringswet AVG.
 * Wettekst letterlijk overgenomen van wetten.overheid.nl, versie geldig 1 juli 2021
 * t/m 31 augustus 2026 (geraadpleegd 1 november 2026). Artikelen zonder tekst
 * zijn nog niet overgenomen; de echte backend levert alle artikelen.
 */
export const uavg: MockWet = {
  wet: {
    bwbId: "BWBR0040940",
    citeertitel: "Uitvoeringswet Algemene verordening gegevensbescherming",
    afkorting: "UAVG",
    dossiers: ["34851"],
    geldigVanaf: "2021-07-01",
    bronUrl: "https://wetten.overheid.nl/BWBR0040940/2021-07-01",
  },
  structuur,
  documenten,
  passages,
  artikelen: {
    "1": {
      titel: "Definities",
      leden: [
        {
          nummer: "",
          tekst: "In deze wet en de daarop berustende bepalingen wordt verstaan onder:",
          onderdelen: [
            {
              label: "",
              tekst:
                "bijzondere categorieën van persoonsgegevens: de categorieën van persoonsgegevens, bedoeld in artikel 9, eerste lid, van de verordening",
            },
            { label: "", tekst: "Onze Minister: Onze Minister voor Rechtsbescherming;" },
            {
              label: "",
              tekst:
                "persoonsgegevens van strafrechtelijke aard: persoonsgegevens betreffende strafrechtelijke veroordelingen en strafbare feiten of daarmee verband houdende veiligheidsmaatregelen als bedoeld in artikel 10 van de verordening, alsmede persoonsgegevens betreffende een door de rechter opgelegd verbod naar aanleiding van onrechtmatig of hinderlijk gedrag;",
            },
            {
              label: "",
              tekst:
                "verordening: verordening (EU) 2016/679 van het Europees Parlement en de Raad van 27 april 2016 betreffende de bescherming van natuurlijke personen in verband met verwerking van persoonsgegevens en betreffende het vrije verkeer van die gegevens en tot intrekking van Richtlijn 95/46/EG (algemene verordening gegevensbescherming) (PbEU 2016, L 119).",
            },
          ],
        },
      ],
    },
    "23": {
      titel: "Nationaalrechtelijke algemene uitzonderingen",
      leden: [
        {
          nummer: "",
          tekst:
            "Gelet op artikel 9, tweede lid, onderdeel g, van de verordening, is het verbod om bijzondere categorieën van persoonsgegevens te verwerken niet van toepassing, indien:",
          onderdelen: [
            { label: "a", tekst: "de verwerking noodzakelijk is ter voldoening aan een volkenrechtelijke verplichting;" },
            {
              label: "b",
              tekst:
                "de gegevens worden verwerkt door de Autoriteit persoonsgegevens of een ombudsman als bedoeld in artikel 9:17 van de Algemene wet bestuursrecht, en voor zover de verwerking noodzakelijk is voor de uitvoering van de hun wettelijk opgedragen taken, onder voorwaarde dat bij die uitvoering is voorzien in zodanige waarborgen dat de persoonlijke levenssfeer van de betrokkene niet onevenredig wordt geschaad; of",
            },
            {
              label: "c",
              tekst:
                "de verwerking noodzakelijk is in aanvulling op de verwerking van persoonsgegevens van strafrechtelijke aard voor de doeleinden waarvoor deze gegevens worden verwerkt.",
            },
          ],
        },
      ],
    },
    "24": {
      titel: "Uitzonderingen voor wetenschappelijk of historisch onderzoek of statistische doeleinden",
      leden: [
        {
          nummer: "",
          tekst:
            "Gelet op artikel 9, tweede lid, onderdeel j, van de verordening, is het verbod om bijzondere categorieën van persoonsgegevens te verwerken niet van toepassing, indien:",
          onderdelen: [
            {
              label: "a",
              tekst:
                "de verwerking noodzakelijk is met het oog op wetenschappelijk of historisch onderzoek of statistische doeleinden overeenkomstig artikel 89, eerste lid, van de verordening;",
            },
            { label: "b", tekst: "het onderzoek, bedoeld in onderdeel a, een algemeen belang dient;" },
            { label: "c", tekst: "het vragen van uitdrukkelijke toestemming onmogelijk blijkt of een onevenredige inspanning kost; en" },
            {
              label: "d",
              tekst:
                "bij de uitvoering is voorzien in zodanige waarborgen dat de persoonlijke levenssfeer van de betrokkene niet onevenredig wordt geschaad.",
            },
          ],
        },
      ],
    },
    "5": {
      titel: "Toestemming van wettelijk vertegenwoordiger",
      leden: [
        {
          nummer: "1",
          tekst:
            "Indien artikel 8 van de verordening niet van toepassing is, is in de plaats van de toestemming van de betrokkene die van zijn wettelijk vertegenwoordiger vereist indien de betrokkene de leeftijd van zestien jaren nog niet heeft bereikt.",
        },
        {
          nummer: "2",
          tekst:
            "Indien de betrokkene onder curatele is gesteld, dan wel ten behoeve van de betrokkene een bewind of mentorschap is ingesteld, is, voor zover het een aangelegenheid betreft waarvoor de betrokkene onbekwaam dan wel onbevoegd is, in de plaats van de toestemming van de betrokkene die van zijn wettelijk vertegenwoordiger vereist.",
        },
        {
          nummer: "3",
          tekst: "Toestemming kan door de wettelijk vertegenwoordiger van de betrokkene te allen tijde worden ingetrokken.",
        },
        {
          nummer: "4",
          tekst:
            "De rechten van de betrokkene, bedoeld in hoofdstuk III van de verordening, worden ten aanzien van betrokkenen die de leeftijd van zestien jaren nog niet hebben bereikt, ten aanzien van onder curatele gestelden en ten aanzien van betrokkenen ten behoeve van wie een bewind of mentorschap is ingesteld, uitgeoefend door hun wettelijk vertegenwoordigers, voor zover het een aangelegenheid betreft waarvoor de betrokkene onbekwaam dan wel onbevoegd is.",
        },
        {
          nummer: "5",
          tekst:
            "Dit artikel is niet van toepassing op hulp- en adviesdiensten die rechtstreeks en kosteloos aan een minderjarige of een onder curatele gestelde worden aangeboden.",
        },
      ],
    },
    "2": {
      titel: "Materiële reikwijdte",
      leden: [
        { nummer: "1", tekst: "Deze wet en de daarop berustende bepalingen zijn van toepassing op de geheel of gedeeltelijk geautomatiseerde verwerking van persoonsgegevens, alsmede op de verwerking van persoonsgegevens die in een bestand zijn opgenomen of die bestemd zijn om daarin te worden opgenomen." },
        { nummer: "2", tekst: "In afwijking van het eerste lid, is deze wet niet van toepassing op de verwerking van persoonsgegevens voor zover daarop de Wet basisregistratie personen, de Kieswet of de Wet raadgevend referendum van toepassing is." },
        { nummer: "3", tekst: "Behoudens het bepaalde in artikel 3, is deze wet niet van toepassing op de verwerking van persoonsgegevens, bedoeld in artikel 2, tweede lid, van de verordening." },
      ],
    },
    "2a": {
      titel: "Inachtneming behoeften kleine, middelgrote en micro-ondernemingen",
      leden: [
        { nummer: "", tekst: "De Autoriteit persoonsgegevens neemt bij de toepassing van de verordening de specifieke behoeften van kleine, middelgrote en micro-ondernemingen als bedoeld in artikel 2 van de bijlage bij Aanbeveling 2003/361/EG van de Commissie van 6 mei 2003 betreffende de definitie van kleine, middelgrote en micro-ondernemingen (PbEU 2003 L124) in aanmerking." },
      ],
    },
    "3": {
      titel: "Schakelbepaling verwerkingen buiten werkingssfeer verordening",
      leden: [
        {
          nummer: "1",
          tekst: "Deze wet en de daarop berustende bepalingen zijn mede van toepassing op de verwerking van persoonsgegevens:",
          onderdelen: [
            { label: "a", tekst: "in het kader van activiteiten die buiten de werkingssfeer van het Unierecht vallen;" },
            { label: "b", tekst: "door de krijgsmacht bij de uitvoering van activiteiten die binnen de werkingssfeer van titel V, hoofdstuk 2, van het Verdrag betreffende de Europese Unie vallen." },
          ],
        },
        { nummer: "2", tekst: "De verordening is van overeenkomstige toepassing op de verwerking van persoonsgegevens, bedoeld in het eerste lid." },
        {
          nummer: "3",
          tekst: "Het eerste en het tweede lid zijn niet van toepassing op:",
          onderdelen: [
            { label: "a", tekst: "de verwerking van persoonsgegevens door de krijgsmacht, voor zover Onze Minister van Defensie daartoe beslist met het oog op de inzet of het ter beschikking stellen van de krijgsmacht ter uitvoering van de in artikel 97 van de Grondwet omschreven taken;" },
            { label: "b", tekst: "de verwerking van persoonsgegevens voor zover daarop de Wet op de inlichtingen- en veiligheidsdiensten 2017 van toepassing is." },
          ],
        },
        { nummer: "4", tekst: "Van een besluit als bedoeld in het derde lid, onderdeel a, wordt zo spoedig mogelijk mededeling gedaan aan de Autoriteit persoonsgegevens." },
      ],
    },
    "4": {
      titel: "Territoriale reikwijdte",
      leden: [
        { nummer: "1", tekst: "Deze wet en de daarop berustende bepalingen zijn van toepassing op de verwerking van persoonsgegevens in het kader van activiteiten van een vestiging van een verwerkingsverantwoordelijke of een verwerker in Nederland." },
        {
          nummer: "2",
          tekst: "Deze wet en de daarop berustende bepalingen zijn van toepassing op verwerking van persoonsgegevens van betrokkenen die zich in Nederland bevinden door een niet in de Europese Unie gevestigde verwerkingsverantwoordelijke of verwerker, wanneer de verwerking verband houdt met:",
          onderdelen: [
            { label: "a", tekst: "het aanbieden van goederen of diensten aan deze betrokkenen in Nederland, ongeacht of een betaling door de betrokkenen is vereist; of" },
            { label: "b", tekst: "het monitoren van hun gedrag, voor zover dit gedrag in Nederland plaatsvindt." },
          ],
        },
      ],
    },
    "25": {
      titel: "Uitzonderingen inzake verwerking persoonsgegevens waaruit ras of etnische afkomst blijkt",
      leden: [
        {
          nummer: "",
          tekst: "Gelet op artikel 9, tweede lid, onderdeel g, van de verordening, is het verbod om persoonsgegevens te verwerken waaruit ras of etnische afkomst blijkt, niet van toepassing, indien de verwerking geschiedt:",
          onderdelen: [
            { label: "a", tekst: "met het oog op de identificatie van de betrokkene, en slechts voor zover de verwerking voor dat doel onvermijdelijk is; of" },
            { label: "b", tekst: "met het doel personen van een bepaalde etnische of culturele minderheidsgroep een bevoorrechte positie toe te kennen teneinde feitelijke nadelen, verband houdende met de grond ras of etnische afkomst, op te heffen of te verminderen, en slechts voor zover: 1°. de verwerking voor dat doel noodzakelijk is; 2°. de gegevens betrekking hebben op het geboorteland van de betrokkene, diens ouders of diens grootouders, dan wel op andere, bij wet vastgestelde criteria op grond waarvan op objectieve wijze vastgesteld kan worden of iemand tot een bepaalde etnische of culturele minderheidsgroep behoort; en 3°. de betrokkene tegen de verwerking geen schriftelijk bezwaar heeft gemaakt." },
          ],
        },
      ],
    },
    "26": {
      titel: "Uitzonderingen inzake verwerking persoonsgegevens waaruit politieke opvattingen blijken voor vervulling openbare functies",
      leden: [
        { nummer: "", tekst: "Gelet op artikel 9, tweede lid, onderdeel g, van de verordening, is het verbod om persoonsgegevens te verwerken waaruit politieke opvattingen blijken, niet van toepassing, indien de verwerking geschiedt met het oog op de eisen die met betrekking tot politieke opvattingen in redelijkheid kunnen worden gesteld in verband met de vervulling van functies in bestuursorganen en adviescolleges." },
      ],
    },
    "27": {
      titel: "Uitzonderingen inzake verwerking persoonsgegevens waaruit religieuze of levensbeschouwelijke overtuigingen blijken voor geestelijke verzorging",
      leden: [
        { nummer: "1", tekst: "Gelet op artikel 9, tweede lid, onderdeel g, van de verordening, is het verbod om persoonsgegevens te verwerken waaruit religieuze of levensbeschouwelijke overtuigingen blijken, niet van toepassing, indien de verwerking geschiedt door andere instellingen dan de instellingen, bedoeld in artikel 22, tweede lid, onderdeel c, en voor zover de verwerking noodzakelijk is met het oog op de geestelijke verzorging van de betrokkene, tenzij deze daartegen schriftelijk bezwaar heeft gemaakt." },
        { nummer: "2", tekst: "In de gevallen, bedoeld in het eerste lid, worden geen persoonsgegevens aan derden verstrekt zonder toestemming van de betrokkene." },
      ],
    },
    "28": {
      titel: "Uitzonderingen inzake genetische gegevens",
      leden: [
        { nummer: "1", tekst: "Gelet op artikel 9, tweede lid, onderdeel g, van de verordening, is het verbod om genetische gegevens te verwerken niet van toepassing, indien deze verwerking plaatsvindt met betrekking tot de betrokkene bij wie de desbetreffende gegevens zijn verkregen." },
        {
          nummer: "2",
          tekst: "In andere gevallen dan bedoeld in het eerste lid, is het verbod om genetische gegevens te verwerken uitsluitend niet van toepassing, indien:",
          onderdelen: [
            { label: "a", tekst: "een zwaarwegend geneeskundig belang prevaleert; of" },
            { label: "b", tekst: "de verwerking noodzakelijk is ten behoeve van wetenschappelijk onderzoek dat een algemeen belang dient of ten behoeve van statistiek, indien: 1°. de betrokkene uitdrukkelijke toestemming heeft gegeven; en 2°. bij de uitvoering is voorzien in zodanige waarborgen dat de persoonlijke levenssfeer van de betrokkene niet onevenredig wordt geschaad." },
          ],
        },
        { nummer: "3", tekst: "Toestemming als bedoeld in het tweede lid, onderdeel b, is niet vereist, indien het vragen van uitdrukkelijke toestemming onmogelijk blijkt of een onevenredige inspanning vergt." },
      ],
    },
    "22": {
      titel: "Verwerkingsverbod bijzondere categorieën persoonsgegevens en algemene uitzonderingen uit verordening",
      leden: [
        {
          nummer: "1",
          tekst:
            "Overeenkomstig artikel 9, eerste lid, van de verordening zijn verwerking van persoonsgegevens waaruit ras of etnische afkomst, politieke opvattingen, religieuze of levensbeschouwelijke overtuigingen, of het lidmaatschap van een vakbond blijken, en verwerking van genetische gegevens, biometrische gegevens met het oog op de unieke identificatie van een persoon, of gegevens over gezondheid, of gegevens met betrekking tot iemands seksueel gedrag of seksuele gerichtheid verboden.",
        },
        {
          nummer: "2",
          tekst:
            "Overeenkomstig artikel 9, tweede lid, onderdelen a, c, d, e en f, van de verordening is het verbod om bijzondere categorieën van persoonsgegevens te verwerken niet van toepassing, indien:",
          onderdelen: [
            {
              label: "a",
              tekst:
                "de betrokkene uitdrukkelijke toestemming heeft gegeven voor de verwerking van die persoonsgegevens voor een of meer welbepaalde doeleinden;",
            },
            {
              label: "b",
              tekst:
                "de verwerking noodzakelijk is ter bescherming van de vitale belangen van de betrokkene of van een andere natuurlijke persoon, indien de betrokkene fysiek of juridisch niet in staat is zijn toestemming te geven;",
            },
            {
              label: "c",
              tekst:
                "de verwerking wordt verricht door een stichting, een vereniging of een andere instantie zonder winstoogmerk die op politiek, levensbeschouwelijk, godsdienstig of vakbondsgebied werkzaam is, in het kader van haar gerechtvaardigde activiteiten en met passende waarborgen, mits de verwerking uitsluitend betrekking heeft op de leden of de voormalige leden van de instantie of op personen die in verband met haar doeleinden regelmatig contact met haar onderhouden, en de persoonsgegevens niet zonder de toestemming van de betrokkenen buiten die instantie worden verstrekt;",
            },
            {
              label: "d",
              tekst: "de verwerking betrekking heeft op persoonsgegevens die kennelijk door de betrokkene openbaar zijn gemaakt; of",
            },
            {
              label: "e",
              tekst:
                "de verwerking noodzakelijk is voor de instelling, uitoefening of onderbouwing van een rechtsvordering, of wanneer gerechten handelen in het kader van hun rechtsbevoegdheid.",
            },
          ],
        },
      ],
    },
    "29": {
      titel: "Uitzonderingen inzake biometrische gegevens",
      leden: [
        {
          nummer: "",
          tekst:
            "Gelet op artikel 9, tweede lid, onderdeel g, van de verordening, is het verbod om biometrische gegevens met het oog op de unieke identificatie van een persoon te verwerken niet van toepassing, indien de verwerking noodzakelijk is voor authenticatie of beveiligingsdoeleinden.",
        },
      ],
    },
    "30": {
      titel: "Uitzonderingen inzake gegevens over gezondheid",
      leden: [
        {
          nummer: "1",
          tekst:
            "Gelet op artikel 9, tweede lid, onderdeel b, van de verordening, is het verbod om gegevens over gezondheid te verwerken niet van toepassing, indien de verwerking geschiedt door bestuursorganen, pensioenfondsen, werkgevers of instellingen die te hunnen behoeve werkzaam zijn, en voor zover de verwerking noodzakelijk is voor:",
          onderdelen: [
            {
              label: "a",
              tekst:
                "een goede uitvoering van wettelijke voorschriften, pensioenregelingen of collectieve arbeidsovereenkomsten die voorzien in aanspraken die afhankelijk zijn van de gezondheidstoestand van de betrokkene; of",
            },
            { label: "b", tekst: "de re-integratie of begeleiding van werknemers of uitkeringsgerechtigden in verband met ziekte of arbeidsongeschiktheid." },
          ],
        },
        {
          nummer: "2",
          tekst:
            "Gelet op artikel 9, tweede lid, onderdeel g, van de verordening, is het verbod om gegevens over gezondheid te verwerken niet van toepassing, indien de verwerking geschiedt door:",
          onderdelen: [
            {
              label: "a",
              tekst:
                "scholen, voor zover de verwerking met het oog op de speciale begeleiding van leerlingen of het treffen van bijzondere voorzieningen in verband met hun gezondheidstoestand noodzakelijk is;",
            },
            {
              label: "b",
              tekst:
                "een reclasseringsinstelling, een bijzondere reclasseringsambtenaar, de raad voor de kinderbescherming, de gecertificeerde instelling, bedoeld in artikel 1.1 van de Jeugdwet, of de rechtspersoon, bedoeld in artikel 256, eerste lid, of artikel 302, tweede lid, van Boek 1 van het Burgerlijk Wetboek, voor zover de verwerking noodzakelijk is voor de uitvoering van de aan hen opgedragen wettelijke taken; of",
            },
            {
              label: "c",
              tekst:
                "Onze Minister en Onze Minister van Justitie en Veiligheid voor zover de verwerking in verband met de tenuitvoerlegging van vrijheidsbenemende maatregelen noodzakelijk is.",
            },
          ],
        },
        {
          nummer: "3",
          tekst:
            "Gelet op artikel 9, tweede lid, onderdeel h, van de verordening, is het verbod om gegevens over gezondheid te verwerken niet van toepassing indien de verwerking geschiedt door:",
          onderdelen: [
            {
              label: "a",
              tekst:
                "hulpverleners, instellingen of voorzieningen voor gezondheidszorg of maatschappelijke dienstverlening, voor zover de verwerking noodzakelijk is met het oog op een goede behandeling of verzorging van de betrokkene dan wel het beheer van de betreffende instelling of beroepspraktijk; of",
            },
            {
              label: "b",
              tekst:
                "verzekeraars als bedoeld in artikel 1:1 van de Wet op het financieel toezicht of financiële dienstverleners die bemiddelen in verzekeringen als bedoeld in artikel 1:1 van die wet, voor zover de verwerking noodzakelijk is voor: 1°. de beoordeling van het door de verzekeraar te verzekeren risico en de betrokkene geen bezwaar heeft gemaakt; of 2°. de uitvoering van de overeenkomst van verzekering dan wel het assisteren bij het beheer en de uitvoering van de verzekering.",
            },
          ],
        },
        {
          nummer: "4",
          tekst:
            "Indien toepassing wordt gegeven aan het eerste, tweede of derde lid, worden de gegevens alleen verwerkt door personen die uit hoofde van ambt, beroep of wettelijk voorschrift dan wel krachtens een overeenkomst tot geheimhouding zijn verplicht. Indien de verwerkingsverantwoordelijke persoonlijk gegevens verwerkt en op hem niet reeds uit hoofde van ambt, beroep of wettelijk voorschrift een geheimhoudingsplicht rust, is hij verplicht tot geheimhouding van de gegevens, behoudens voor zover de wet hem tot mededeling verplicht of uit zijn taak de noodzaak voortvloeit dat de gegevens worden meegedeeld aan anderen die krachtens het eerste, tweede of derde lid bevoegd zijn tot verwerking daarvan.",
        },
        {
          nummer: "5",
          tekst:
            "Het verbod om andere bijzondere categorieën van persoonsgegevens te verwerken is niet van toepassing, indien de verwerking noodzakelijk is in aanvulling op de verwerking van gegevens over gezondheid, bedoeld in het derde lid, aanhef en onderdeel a, met het oog op een goede behandeling of verzorging van de betrokkene.",
        },
        {
          nummer: "6",
          tekst:
            "Bij algemene maatregel van bestuur kunnen omtrent de toepassing van het eerste lid en het derde lid, aanhef en onderdeel b, nadere regels worden gesteld.",
        },
      ],
    },
  },
};
