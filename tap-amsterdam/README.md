# TAP Amsterdam — Oefenkaart (studiemiddel)

**Open de actuele kaart (BAG-gecontroleerde punten):** https://raw.githack.com/ecombro/g/main/tap-amsterdam/tap-gecorrigeerd.html

Deze pagina is een studietool voor het **CBR Taxi Amsterdam Praktijk (TAP)** examen en Amsterdamse lijnbusbaanregels. Het is **geen juridische routeplanner** en niet geschikt als bewijs dat een rijbaan toegankelijk is voor taxi's.

## Functies
- 40 TAP-oefenobjecten (historische objectenlijst), met nummers, namen, adres, zoeken en kaartmarkeringen.
- 41 **indicatieve waarschuwingen** bij uitgesloten trajecten en bijzondere verkeersregels. Geen exacte wegvakgeometrie en niet noodzakelijk 41 unieke permanent verboden banen.
- **Tramsporen** als paarse OpenStreetMap-laag en busbaan-gerelateerde OSM-wegen in oranje. Tramrails en busbaan-tags zijn **geen bewijs van taxitoegang**.
- **Hoofdaders**: 50 groot weergegeven straatnamen uit een combinatie van OSM-wegnamen en indicatieve locatiepunten langs tramsporen; schaalbaar met `Straatnamen A+`, automatisch meer labels bij inzoomen en minder bij uitzoomen. Paarse namen = tramcorridors, oranje = OSM-busbaanindicator. Namen zijn geen juridische begrenzingen of bevoegdheden.
- Gewone autoroute tussen twee oefenobjecten, via openbare OSRM-router, met Google Maps als alternatief. Geen validatie van de Amsterdamse taxi-ontheffing.
- Oefenvragen met verwijzing naar officiële besluiten.

## Basisregels voor de opleiding
- Controleer of de baan een verharde vrijliggende tram-/busbaan is en welke F-borden/LIJNBUS-aanduidingen gelden.
- Een geldige, toepasselijke ontheffing is persoonsgebonden en geldt tijdens werk- of diensttijd.
- Tijdens TAP-opleiding/examen kan volgens het besluit de ontheffing van de instructeur/examinator gelden.
- Negenoog volgen; maximaal 20 km/u langs haltes; geen inhalen, niet stilstaan, niet tussentijds op-/afrijden.
- Een speciale toestemming voor een OV-baan is geen algemene toestemming om rijrichtingen, andere verkeersborden of verkeersbesluiten te negeren.
- **Weteringschans:** de verouderde tijdregel uit 2018 mag niet los worden gebruikt; zie wijziging 2021.

## Officiële bronnen
- [Amsterdam: voorschriften medegebruik lijnbusbanen en permanente uitsluitingen (2018)](https://zoek.officielebekendmakingen.nl/gmb-2018-38595.html)
- [Amsterdam: verkeersbesluit Weteringschans (2021)](https://zoek.officielebekendmakingen.nl/gmb-2021-291618.html)
- [Amsterdam: verkeersbesluit Rembrandtplein / Amstelstraat (2018)](https://zoek.officielebekendmakingen.nl/stcrt-2018-29822.html)
- [Staatscourant: wijziging landelijke taxipraktijkexamen (2024)](https://zoek.officielebekendmakingen.nl/stcrt-2024-15122.html)
- [Tarieven 2026: TAP is een afzonderlijk examen](https://wetten.overheid.nl/BWBR0051913/2026-01-01/0/BijlageV)

## Datakwaliteit en openstaande werkzaamheden
1. Alle waarschuwingspunten en handmatig gekoppelde hoofdader-namen zijn **indicatief**. Vervangen door exact begrensde wegvakken met formele bron, richting en datum.
2. Alle TAP-locaties/entrees geografisch controleren.
3. Toegestane banen nog **niet** in groen tekenen; eerst per wegvak actuele bebording, rijrichting en ontheffing controleren.
4. Routes niet als juridisch toegestane taxiroutes presenteren tot een geverifieerde toegangsdataset en route-engine bestaan.
5. Wijzigingen in verkeersbesluiten na de gebruikte bronnen periodiek onderzoeken.

## Locatiecontrole — 26 oktober 2026
- 38 van de 40 TAP-objecten gegeocodeerd op exact bijbehorend BAG-huisnummer via [PDOK Locatieserver](https://api.pdok.nl/bzk/locatieserver/search/v3_1/ui/).
- Station Postjesweg en Metrostation De Vlugtlaan zijn gegeocodeerd als OSM-stationspunt, **niet** als exacte reizigers- of taxi-ingang.
- Reade: het verouderde adres Dr. Jan van Breemenstraat 2 is vervangen door het actuele bezoekadres Admiraal Helfrichstraat 1, zoals [Reade zelf aangeeft](https://reade.nl/over-ons/locaties/jan-van-breemen).
- Per-object oude en nieuwe coördinaten en verplaatsingen zijn te vinden in [tap-coordinates-audit.json](./tap-coordinates-audit.json).
- BAG-adrespunten beschrijven een officieel adres, niet per se de taxistandplaats, juiste aanrijrichting of gebouwtoegang.
- De oorspronkelijke 40 oefenobjectenlijst blijft historisch; deze revisie verifieert de **coördinaten**, niet dat elk object in 2026 nog als TAP-examenobject geldt.

De algemene landelijke CBR-objectenlijst is per 1 juli 2024 vervallen. Het **Amsterdamse TAP-examen** is een andere kwalificatie; de oefenobjecten in deze repository worden niet gepresenteerd als een door het CBR nieuw bevestigde verplichte lijst (2026).
