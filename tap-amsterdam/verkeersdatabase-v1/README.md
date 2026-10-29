# Verkeersdatabase V1 — uitsluitend officiële bronfeiten
**Onderzoekspeildatum:** 29 oktober 2026  
**Toepassing:** TAP Amsterdam Academy, voorbereiding voor erkende rijscholen  
**Status:** gecontroleerde bronregistratie, **niet vrijgegeven voor verkeersadvies**  
**Bronnen:** officiële Amsterdamse besluiten / gemeentelijke voorwaarden.

> **Stopregel:** Documenteren wat de gemeente expliciet heeft vastgesteld is toegestaan. Onbevestigde verkeerssituaties, huidige toegang, rijrichting en kaartgeometrie worden **niet** ingevoerd. \`05-vrijgegeven-wegvakken.geojson\` heeft daarom 0 features. In de GitHub-controle staat vooralsnog een harde blokkade op elke niet-lege versie.

## Inhoud

| Bestand | Inhoud | Aantal |
|---|---|---:|
| \`01-officiele-bronnen.json\` | Gemeentelijke officiële bronnen, publicatiedatum en link | 6 |
| \`02-bronfeiten-2018.json\` | Specifiek in de tekst van voorschrift 10 genoemde uitsluitingen | 41 |
| \`02-bronfeiten-2018.json\` | Ontheffings-/gedragsvoorwaarden, naar voorschriftnummer | 10 |
| \`03-officiele-besluitpunten-2021-2026.json\` | Weteringschans 2021: besluitpunten | 2 |
| Idem | Centrum april 2026: bord-/markeringbesluitpunten | 43 |
| Idem | Pampuslaan april 2026: besluitpunten | 3 |
| Idem | Holendrecht augustus 2026: besluitpunten | 4 |
| \`04-gemeentelijke-ontheffingsfeiten.json\` | Actuele informatie op de website van de gemeente | 6 |
| \`05-vrijgegeven-wegvakken.geojson\` | Voor rijschoolgebruik goedgekeurde geometrische taxiwegvakken | **0** |

**Opgelet:** 41 verwijzingen uit een besluit in 2018 zijn **geen** 41 in 2026 opnieuw geverifieerde actuele verboden wegvakken. Hetzelfde geldt voor de 43 verkeersmaatregelen in april 2026: dit zijn geen 43 voor taxi's toegestane straten.

## Bewijs- en publicatieregels

Bronfeit: record met \`source_id\`, een specifiek voorschrift of besluitnummer, bronlocatieomschrijving en alleen wat expliciet staat vastgelegd.

Niet toegestaan:
- \`taxi_toegestaan=true\` op basis van een tramspoor, F17 of de aanwezigheid van een ander soort lijnbusstrook.
- \`taxi_verboden=true\` voor een complete straat als alleen een genoemd OV-wegvak is uitgesloten.
- Een gebiedspolygon, polyline of rijrichting gokken uit een halte, kruispunt, straatnaam, geocoder of OpenStreetMap.
- Verkeersbesluit als bewijs behandelen dat een bord al geplaatst is.
- 2018-tijdvensters toepassen als zij nadien zijn gewijzigd (zoals Weteringschans).
- Bronfeiten gebruiken als route-engine-vergunning.

Vereiste volgende verificatiestappen, pas na toestemming van projecthouder:
1. Kies één afzonderlijke rijbaan, een rijrichting en een gebruikersprofiel (reguliere taxi/TTO/AOV/TAP-cursus).
2. Alle relevante verkeersbesluiten en wijzigingen na het gekozen uitgangsbesluit nalopen.
3. Officiële situatietekening aan wegennet/rijbaan koppelen.
4. Borden en onderborden controleren via gemeente, NDW en actuele veldfoto's.
5. Regel laten tekenen door juridisch reviewer en lokale TAP-instructeur met datum.
6. Dan pas als actuele geo-segmenten invoeren en routeringsregels testen.

## Besluitvoorbeelden

- **Weteringschans:** voorschrift uit 2018 had nachttijden; gemeenteblad 2021-291618 heeft een specifiek F15-/D5-regime en uitzondering voor AOV bepaald. Bronfeiten uit beide documenten staan in verschillende records. Geen automatisch oordeel over de gewone rijbaan.
- **Rokin / Damrak / Utrechtsestraat:** 2018 uitsluitingen, 2026 gewijzigde bord- en LIJNBUS-markeringbesluiten. De bronfeiten bewijzen níet dat taxi's inmiddels mogen rijden op de afzonderlijke OV-vakken.
- **Pampuslaan:** 2026-187433 wijst F15-trambaan en F17-bus-/trambaan aan op onderdelen van Centrumeiland/Haveneiland. Geen actuele toestemming uit afgeleid.
- **Holendrecht:** 2026-376185 vervangt C1-uitzonderingen die taxi's expliciet noemden door een busuitzondering; tevens lokale aanpassingen aan E8, D6 en de LIJNBUS-markering. Geen algemene conclusie over alle aanrijroutes.
  
## Gescheiden dossier onzekerheden

Zie [FASE1_ONZEKERHEDEN_NIET_INGEVOERD.md](../FASE1_ONZEKERHEDEN_NIET_INGEVOERD.md). Dat staat **buiten** de feitendatabase; er zijn geen toestemmingsrecords aangemaakt voor die vragen.

## Bronnen (officieel)

- [Gemeenteblad 2018-38595](https://zoek.officielebekendmakingen.nl/gmb-2018-38595.html)
- [Gemeenteblad 2021-291618](https://zoek.officielebekendmakingen.nl/gmb-2021-291618.html)
- [Gemeenteblad 2026-174698](https://zoek.officielebekendmakingen.nl/gmb-2026-174698.html)
- [Gemeenteblad 2026-187433](https://zoek.officielebekendmakingen.nl/gmb-2026-187433.html)
- [Gemeenteblad 2026-376185](https://zoek.officielebekendmakingen.nl/gmb-2026-376185.html)
- [Gemeente Amsterdam: lijnbusbaanontheffing aanvragen](https://www.amsterdam.nl/ondernemen/taxichauffeurs/ontheffing-lijnbusbaan-aanvragen/)

## Datatest

\`node scripts/validate-tap-evidence-v1.cjs\`

De GitHub-workflow \`tap-traffic-facts-validation.yml\` start automatisch op updates van de feitenbestanden. De controle weigert elke ingreep waarbij uit bronfeiten zonder verificatie actuele juridische toegang wordt afgeleid, of waarin er één of meer goedgekeurde wegsegmenten worden gepubliceerd voordat de expliciete gebruikersgoedkeuring binnen is.

**De live oefenkaart is niet aangepast.** Oude geobserveerde rode markerpunten zijn geen bewijs voor actuele rijbaanverboden; daarvoor is het aparte brononderzoek noodzakelijk.

## Uitgevoerde onderzoeksronde 29 oktober 2026 (centrum)

- **Damrak:** 2018 voorschrift 10 vermeldt Damrak in beide richtingen; in 2026 onder besluitpunt 33 F17 vervangen door LIJNBUS-markering. Niet vastgesteld dat daarmee taxitoegang verandert.
- **Rokin:** 2018 voorschrift 10 vermeldt Rokin in beide richtingen; in 2026 punten 9, 10 en 11 wijziging F17/LIJNBUS. Geen taxitoestemming uit afgeleid.
- **Utrechtsestraat:** 2018 voorschrift 10 noemt gehele lengte en beide rijrichtingen; 2026 punten 12–20 geven uitzonderingen voor tram en (nacht)lijnbus op benoemde plekken. Hieruit is geen taxi-ontheffingsrecht afgeleid.
- **Rembrandtplein:** 2018 verkeersbesluit stcrt-2018-29822 bevat specifieke C1-zonering en een gelimiteerd historisch taxi-venster voor één locatie; verkeersbesluit stcrt-2019-13250 bevat vervolgens aanvullende uitzonderingsborden op specifieke toegangen die de lijnbusbaanontheffing uitsluiten. De 2019 PDF verwijst naar een tekening die niet in de geraadpleegde versie zit; daarom geen exacte kaartbegrenzing gemaakt.
- **Weteringschans:** 2021 gmb-2021-291618 is leidend bij lezen van de historische tijdsuitsluiting van 2018, specifiek voor het trambaanonderdeel en Kleine-Gartmanplantsoen. Reguliere autoweg ernaast niet met het OV-wegvak verwarren.

Alle meldingen hierboven zijn **gedateerde documentfeiten**, geen actuele routeinstructies. De review van latere niet-gevonden besluiten en de daadwerkelijke borden/tekeningen blijft open. **De live kaart blijft onveranderd en de goedgekeurde taxi-wegsegmenten blijven op nul.**
