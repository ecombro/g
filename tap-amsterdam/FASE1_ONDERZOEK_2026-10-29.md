# Fase 1 — Onderzoek en datakwaliteitsplan TAP Amsterdam Academy
**Onderzoeksdatum:** 29 oktober 2026  
**Status:** onderzoeksbasis, géén juridisch gecertificeerde wegkaart  
**Scope:** objecten, adressen/ingangen, tram-/busbaaninfrastructuur, uitzonderingen, exameninhoud, databronnen en productiecriteria.

## Managementsamenvatting

De huidige repository \`ecombro/g/tap-amsterdam\` is een werkend oefenprototype maar nog geen betrouwbaar/commercieel publiceerbare OV-toegangskaart. Het grootste risico is niet de kaartweergave maar het door elkaar halen van vijf verschillende vragen:
1. **Waar** ligt het tramspoor of de busbaan?
2. **Welk wegvak en welke rijrichting** betreft het precies?
3. **Wat zegt de actuele juridische regeling** (inclusief onderborden, tijdvakken en bijzondere voertuigen)?
4. **Wat is er feitelijk op straat** (markering, rijbaan, bord, tijdelijke afsluiting, veilige aanrijroute)?
5. **Wat moet een kandidaat kennen** voor TAP en TAT op diens examendatum?

Een lijn op basis van OSM \`railway=tram\` of \`busway\` beantwoordt alleen (een deel van) vraag 1. De datum van een verkeersbesluit bepaalt niet automatisch de datum waarop een nieuwe situatie ter plaatse gerealiseerd is. Alle 'toegestaan'-claims moeten daarom per gericht wegsegment worden beoordeeld, met meerdere bronnen en menselijke revisie. De oude 41 rode markeringen zijn indicatief, NIET exact 41 unieke permanent gesloten taxibanen.

## 1. Officiële examenbasis

### TAP praktijk (CBR)
- Officiële objectenlijst: 40 objecten, **versie 23 april 2025**. De originele 40 namen/adressen in onze oefenlijst sluiten aan op deze lijst. De landelijke reguliere objectenlijst verviel in 2024; dit is een **andere** specifieke TAP-lijst en is nog gepubliceerd op de CBR-site.
- **Let op CBR-instructie:** als voor het object niet geparkeerd kan worden, moet de kandidaat kunnen aangeven waar de ingang is.
- Praktijkexamen: **85 minuten; 3 rijopdrachten**: adres/locatie mét hulpmiddelen; bekend object zonder hulpmiddelen; terugrijden op aanwijzingen examinator. Tevens toepasselijke OV-regels, veilige verkeersdeelname, professioneel handelen, voertuigcontrole, storingen, klantgedrag, ongevallen en efficiënte routekeuze.
- Bij praktijktraining (CBR): indien chauffeurspas reeds aanwezig 4 uur zelf rijden, anders 8 uur; gecertificeerde opleider registreert opleiding; theorie vóór praktijk.
- Exameneisen bevatten negen eindtermen. Binnen fase 1 zijn relevant: eindterm 1 bestemmingen, 2 veilige deelname, 3 OV-banen, 4 OV-haltes, 7 routes/rijtijd. De volledige software mag de overige niet negeren voor latere examenoefeningen.

Bronnen:
- CBR TAP: https://www.cbr.nl/nl/beroepsexamens/taxi/bus-en-trambaan-tto-amsterdam/tap
- CBR objectenlijst: https://www.cbr.nl/nl/service/nl/artikel/objectenlijst-taxi-amsterdam-praktijk-tap-1
- CBR exameneisen: https://www.cbr.nl/nl/service/nl/breed/exameneisen-taxi-amsterdam-praktijk-tap
- CBR gecertificeerde opleiders: https://www.cbr.nl/nl/beroepsexamens/taxi/informatie-en-tips/bus-en-trambaan-tto-amsterdam/gecertificeerde-opleiders-bus-en-trambaan-tto-amsterdam-1

### TAT theorie (belangrijk voor roadmap)
- Tot 31-12-2026 mondeling (35 min, cesuur 60/100 punten).
- Vanaf **01-01-2027** nieuw theorie-examen: **50 vragen, 60 minuten, minimaal 40 goed**. Nieuwe CBR-eisen en voorbeeldvragen beschikbaar; behoud syllabusversies op basis van examendatum.
- 2026-pilot mogelijk, niet als standaard 2026 voorstellen.

Bronnen:
- CBR TAT 2026: https://www.cbr.nl/nl/beroepsexamens/taxi/bus-en-trambaan-tto-amsterdam/tat-mondeling
- CBR TAT 2027: https://www.cbr.nl/nl/beroepsexamens/taxi/bus-en-trambaan-tto-amsterdam/tath
- Examenvereisten 2026: https://www.cbr.nl/nl/service/nl/breed/exameneisen-taxi-amsterdam-theorie-tat-tot-en-met-31-december-2026

## 2. Juridische regels medegebruik

### Primair beleid en ontheffing
Gemeenteblad **2018-38595**, herziening voorschriften vanaf 1 januari 2018:
- Vrijliggende verharde bus-/trambanen; markeringen BUS/LIJNBUS en F13, F15, F17, F19 (niet elke willekeurige tramrail).
- De persoonlijke ontheffing met chauffeurspas en tijdens werk-/diensttijd. TAP-instructeur/examinator kan tijdens opleiding/examen de ontheffing voor de kandidaat beschikbaar stellen volgens de regeling.
- Negenoog op OV-baan; maximaal 20 km/u langs haltes; niet halteren/in- en uitstappen; niet inhalen; niet halverwege op-/afrijden; volg de rijrichting van het OV.
- Uitsluitingslijst bevat wegvakken, bruggen en stations, soms slechts één richting of een bepaald gedeelte. Niet alle straten zijn geheel verboden; geen 'straatnaam = alle segmenten verboden'-interpretatie.

Bron: https://zoek.officielebekendmakingen.nl/gmb-2018-38595.html

Gemeente verstrekt zelfstandige lijnbusbaanontheffing aan niet-TTO-leden en gecertificeerde opleiders; voor TTO-chauffeurs is de toestemming onderdeel van de taxivergunning. Volgens gemeentepagina 3 jaar geldig, vereiste CBR-certificering.

Bron: https://www.amsterdam.nl/ondernemen/taxichauffeurs/ontheffing-lijnbusbaan-aanvragen/

### Latere bijzondere besluiten
- **Weteringschans 2021-291618**: het eerder genoemde nachtelijke medegebruik voor taxi's is niet meer geldig op de aangewezen trambaan Museumbrug/Spiegelgracht – Kleine-Gartmanplantsoen, uitgezonderd AOV. Leg het besluit als gerichte OV-baanregel vast, niet als verbod op elke gewone rijbaan van de hele Weteringschans.
  https://zoek.officielebekendmakingen.nl/gmb-2021-291618.html
- **Centrum 2026-174698 (14 april 2026)**: 43 aanpassingen van bord-/markeringssituaties onder meer op Rokin, Damrak, Utrechtsestraat, Leidsestraat, Hobbemastraat, Marnixstraat, Reguliersbreestraat en Weteringschans. Onderborden en vervanging F17 door LIJNBUS-markering zijn relevant voor de modellering. **Niet afleiden dat deze wijzigingen automatisch taxitoegang verlenen.** Per specifiek punt vaststellen of het de taxi-ontheffing raakt én of bebording is uitgevoerd.
  https://zoek.officielebekendmakingen.nl/gmb-2026-174698.html
- Rembrandtplein/Amstelstraat/Reguliersbreestraat: aparte gebieds- en rijrichtingsbesluiten bestaan. Behandel als apart 'policy overlay' met t/m tijdstippen, voertuigtype en rijrichting; nooit uitsluitend afleiden uit de algemene 2018-lijst.

### Tien prioritaire deelgebieden voor juridische controle
1. **Damrak & Rokin** — oude uitsluiting; bordwijzigingen 2026; kaart moet gehele segment en richting apart tonen.
2. **Utrechtsestraat / Rembrandtplein / Amstelstraat / Reguliersbreestraat** — OV-aanwijzingen, oude uitsluitingen en specifieke gebiedsmaatregelen.
3. **Weteringschans / Museumbrug / Kleine-Gartmanplantsoen / Leidseplein** — wijziging 2021, AOV uitzondering, aanrijroutes.
4. **Leidsestraat / Vijzelstraat** — onderborden, richtingen en overgang tram-/voetgangersgebied.
5. **Ferdinand Bolstraat / Albert Cuypstraat / Ceintuurbaan** — gedeeltelijke richtingsgebonden uitsluitingen.
6. **Marnixstraat / Elandsgracht / Raadhuisstraat / Westermarkt** — busstation en gedeeltelijke routeverboden.
7. **Prins Hendrikkade / Centraal Station** — bus-/tramstations, IJzijde, voorzijde stationsgebied.
8. **Czaar Peterstraat / Muiderstraat / Hortusbrug / Waterlooplein** — oude uitzonderingen, bruggen.
9. **Station RAI / Station Amstel / Station Sloterdijk / Lelylaan / Noord** — stationsperrons en busbaanverkeer onderscheiden.
10. **Noord busbaan Twiske, West Molenwerf en overige geïsoleerde trajecten** — geometrie, begin/eindpunt en richtingen exact.

Dit is een **onderzoeksprioriteit**, niet een complete of geverifieerde lijst van de toegestane routes.

## 3. Audit huidige GitHub-kaart

Bestanden in \`tap-amsterdam/\` (gecontroleerd 29-10-2026):
- \`kaart-punten-gecheckt-v4.geojson\`: 40 TAP-pins en 41 waarschuwingspunten. BAG/PDOK-geocodeerde adressen: 38, OSM-stationspunten: 2. Opgelet: BAG-adrespositie kan tientallen tot honderden meters afwijken van de taxi-aanrijplek; 41 rode punten zijn géén exact juridische lijngeometrie.
- \`tramsporen.geojson\`: **1.558 OSM-tram-waysegmenten**, geen 1.558 banen of routes. Tramspoor heeft veelal geen straatnaam en geldt niet als taxi-ontheffingslaag.
- \`busbanen-osm.geojson\`: **1.876 OSM-wegsegmenten met busbaan-gerelateerde tags**, deels in een ruimere bounding box (dus niet alleen Amsterdam). Busbaan-tag zegt niets definitiefs over juridische toegang.
- \`hoofdaders.json\`: **50 vergrote labels** met handmatig gekoppelde tramcorridors en OSM-wegnamen. Voor oriëntatie; geen normatieve segmentlabeling.
- \`app-adressen-v4.js\`: gewone OSRM-autoroutes en Google Maps; niet taxi-geprofileerd en dus onbruikbaar als bewering over rechtmatig medegebruik.
- Zoekfilter heeft handmatige gebiedsindeling; meerdere objecten uit Nieuw-West zijn als 'West' gelabeld. Aparte gemeentelijke stadsdelenbron en tests nodig.
- 41 uitsluitingsmarkers mengen 2018-voorschriften, 2021-veranderingen en 2019-bijzonderheden. Oude labels 'permanent' zijn onbetrouwbaar. Herbouw deze set vanuit *regel per wegvak*.
- Niet vastgelegd: exacte voertuigrijrichting, begin-/eindcoördinaat, bebording, ter plaatse controles, ingangsdatum verkeersbesluit, ontheffingtype en reviewer; dus GEEN groene legale routes.

### Objectmodel: twee of drie posities, niet één
Per TAP-object bewaren:
- \`cbr_object_number\`, \`cbr_object_name\`, \`cbr_object_address\`, \`cbr_list_version\` (=2025-04-23);
- \`visitor_address_current\`, \`visitor_entrance_point\`, \`safe_dropoff_point\`, \`recommended_approach_direction\`;
- \`bag_address_point\`, \`external_source_url\`, \`checked_at\`, \`reviewer\`, \`status\`.
Voorbeelden waar oude lijst en bezoekadres kunnen afwijken: Reade, Van Gogh Museum, Anne Frank Huis, De Hallen. Voor deze objecten moeten *bezoekadres*, *feitelijke publieke entree* én *legale taxi-stopplek* nog gescheiden worden gevalideerd. Het toevoegen van actueel bezoekadres vervangt het historische CBR-objectadres **niet**.

## 4. Betrouwbare databronnen en hun beperkingen

| Bron | Toepassing | Beperking |
|---|---|---|
| CBR objectenlijst TAP (23-04-2025) | Examenobject-ID en bekend object | Niet de actuele taxi-ingang; herpublicatie/bronvermelding juridisch controleren |
| PDOK Locatieserver / BAG | Officieel adrespunt, postcode | Geen taxi-aanrijpunt, busbaantoegang of entree |
| OpenStreetMap \`railway=tram\` | Railgeometrie | Rail ≠ verharde OV-baan of taxitoestemming |
| OpenStreetMap busway/tags | Kandidaat-busbaan-geometrie | Onvolledig en soms alleen busstrook/tags, wegbeheerder niet bevestigd |
| NDW verkeersborden / George | Locatie, RVV-type, onderbord, verificatiestatus | Niet alle verkeersborden geregistreerd, onderbord richting/werking controleren |
| Amsterdam Gemeenteblad | Formele regels, uitzonderingen, verkeersbesluiten | Kaarttekening en feitelijke uitvoering soms apart; vervangende besluiten checken |
| Amsterdam 'Bereikbaarheid' / gemeentelijke wegendatabase | Wegvakken, verbodsborden, tijdvensters | Publieke beta, niet specifiek taxi-ontheffingen; schema en dekking toetsen |
| Melvin / NDW geplande afsluitingen | Tijdelijke maatregelen | Niet alle maatregelen en camera-/taxibepalingen volledig |
| GVB en instructeur-/veldcontrole | Feitelijke haltes, vrije baan en veilige toegang | Geen juridische vrijwaring zonder verkeersbesluit en borden |

Bronnen:
- PDOK: https://api.pdok.nl/bzk/locatieserver/search/v3_1/ui/
- NDW verkeersborden: https://docs.ndw.nu/data-uitwisseling/interface-beschrijvingen/verkeersborden-api/
- NDW George beperkingen: https://docs.ndw.nu/handleidingen/George/verkeersborden/
- Amsterdam bereikbaarheid: https://bereikbaarheid.amsterdam.nl/data
- NDW opendata en werk/afsluitingen: https://opendata.ndw.nu/

## 5. Voorstel database wegvakken

In plaats van een marker \`UITGESLOTEN: hele straat\`, maak per **gericht segment** één record:
\`\`\`json
{
  "segment_id": "AMS-LBX-0001",
  "road_name": "Weteringschans",
  "from_junction": "Museumbrug / Spiegelgracht",
  "to_junction": "Kleine-Gartmanplantsoen",
  "geometry": null,
  "direction": "afzonderlijk per rijrichting te bepalen",
  "infrastructure_type": "tram",
  "permitted_profiles": [],
  "taxi_access_status": "not_verified",
  "permit_type": "lijnbusbaanontheffing",
  "vehicle_scope": "reguliere taxi / afzonderlijk AOV",
  "exception_window": null,
  "official_decisions": ["https://zoek.officielebekendmakingen.nl/gmb-2021-291618.html"],
  "traffic_sign_codes": ["F15"],
  "observed_signs": [],
  "field_photo_refs": [],
  "last_reviewed": null,
  "reviewed_by": null,
  "juridical_reviewed": false,
  "valid_from": null,
  "valid_to": null
}
\`\`\`
NB: \`geometry:null\` is opzettelijk: we hebben nog geen verantwoord geverifieerde lijngeometrie. Niet invullen met een arbitrair punt of straatbreed segment.

### Juridische statussemantiek
- **confirmed_excluded**: één of meer officiële bronnen, exacte rijrichting en baanbegrenzing, datum, controles op uitzonderingen.
- **confirmed_conditional**: positief getoetste ontheffingregel met geldigheidsvoorwaarden (type ontheffing, uren, activiteit, instructeur/examinator/AOV waar relevant) en exacte geometry.
- **not_verified**: bron onvoldoende of tegenstrijdig; enige veilige standaard.
- **superseded**: achterhaald verkeersbesluit/regel, auditspoor blijft bestaan.
- **temporarily_closed**: tijdelijke beperking met datum/tijd en bron.

Zelfs \`confirmed_conditional\` geeft geen toestemming voor een gebruiker zonder geldige relevante ontheffing. De software mag niet suggereren dat een groen deel voor elke taxi altijd toegankelijk is.

## 6. Productie- en licentierisico's

- **OpenStreetMap**: open data onder ODbL; vereiste bronvermelding. Als eigen gegevens worden afgeleid van OSM, kan doorlevering/share-alike verplicht worden. Houd juridisch eigen onderzoeken en OSM-extracten waar mogelijk als aparte datasets.
  https://www.openstreetmap.org/copyright ; https://osmfoundation.org/wiki/Licence/Licence_and_Legal_FAQ
- **OSM rastertegels**: openbare servers zonder SLA, beperken bulkladen/offline. Voor betaald rijschoolproduct een betaalde of zelfgehoste tile-provider gebruiken en juiste bronvermelding.
  https://operations.osmfoundation.org/policies/tiles/
- **OSRM demo**: niet als betaalde/gesloten routevoorziening inzetten; geen professionele garanties. Voor productie routing op eigen graph of gecontracteerde routingdienst. Zelfs eigen graph vereist door deskundigen gevalideerde toegangsprofielen.
  https://github-wiki-see.page/m/Project-OSRM/osrm-backend/wiki/Demo-server
- **CBR-materiaal**: exameneisen en objectenlijst als bron met versie tonen; geen CBR-merk/keurmerk of auteursrechtelijk beschermde examenopgaven zonder toestemming overnemen. Zet 'onafhankelijke oefentool'.
- **Privacy**: leerlingaccounts hebben doelbinding, minimale gegevens, retentie, inzage/verwijdering. Geen GPS of ritgeschiedenis standaard opslaan; opt-in alleen voor expliciete educatieve noodzaak, bewaartermijnen en verwerkersafspraken.

## 7. Actieplan / prioriteit

### P0 — correctness before marketing
1. CBR 40 bron-dataset opnemen als ongewijzigde versie 2025-04-23; huidige bezoekersadressen apart. Naam/ID/adres verschillen expliciet naast elkaar.
2. 40 fysieke ingangen/aanrijpunten laten beoordelen door TAP-instructeur of officiële locatiebron; BAG-centroids blijven alleen fallback-adressen.
3. Alle huidige 41 rode markers labelen als 'indicatieve onderzoekswaarschuwingen' en uit automatische legale routebeslissingen weren.
4. Verkeersbesluit 2018, Weteringschans 2021 en Centrum 2026 in gedateerd, bronverwijzend regelsregister importeren.
5. Per gericht wegvak de afbakening, richting, verkeersborden en uitzonderingen vastleggen; geen 'straat volledig toegestaan' op basis van één punt.
6. Twee onafhankelijke goedkeuringen vóór een toestemming zichtbaar wordt: juridische broncontrole + veld/instructeurscontrole.

### P1 — data-engineering
7. NDW borden F13/F15/F17/F19, C- en D-borden en onderborden Amsterdam per stadsdeel inlezen, met bron/cachestatus en onderscheid 'waargenomen / overheidsregistratie'.
8. OSM-tram/OV-infrastructuur knippen op kruisingen, haltes en veranderingen van bord/richting en koppelen aan bron-ID's; geen inferentie dat taxi mag.
9. Nieuwe gemeentelijke verkeersbesluiten opvolgen, detecteren, als 'hercontrole vereist' markeren; handmatige goedkeuring voor publicatie.
10. Overlays: rail (paars), bus-taggerelateerd (oranje), juridisch bevestigd uitgesloten (rood *segment*), voorwaardelijk toegestaan (groen *segment* + voorwaarden), onbekend (grijs).
11. Stadsdeelgebieden uit officiële gemeentegrenzen afleiden in plaats van handmatige tabellen. Controle van locatie- en routefouten automatiseren.

### P2 — objecttrainer gereed voor pilot
12. Per object drie posities zichtbaar maken (officieel CBR-adres; ingang; veilige taxi-afzetplek), met bron en reviewstatus.
13. Routeopdrachten zonder hulpmiddelen, plus uitleg waarom OV-banen al dan niet bruikbaar zijn; docentfeedback zichtbaar.
14. 10–20 routes van gecertificeerde TAP-instructeur verzamelen en tegen geverifieerde wegvakken controleren. Tot die tijd gewone OSRM-route nadrukkelijk géén 'examenroute'.
15. Pilot bij 2–3 gecertificeerde opleiders (CBR-lijst) met gestructureerde foutenrapportage en nieuw contact voor gegevensveranderingen.

## 8. Acceptatiecriteria fase 1

- **40/40** CBR-objecten exact uit officiële lijst genummerd met bronversie; *extra actuele bezoekersinformatie is apart*.
- **40/40** objecten met gecontroleerde bestemming en expliciet label als de ingang/taxi-afzetplaats nog onzeker is. Geen gefingeerde zekerheid.
- **100% van de verkeerssegmenten die juridisch 'toegestaan' of 'uitgesloten' getoond worden** hebben: geometry, rijrichting, ontheffingprofiel, bronbesluit, datum en reviewpersoon; alles daarbuiten 'onbekend'.
- **100% van de 2018 uitzonderingen en 2021/2026 wijzigingen** in het regelsregister opgenomen als verifieerbare tekststukken; conversie naar geometrie pas na controle.
- **Geen automatische routering over taxibanen** tot toegangsregels per rijrichting getest zijn op proefroutes.
- Automatisch: schema- en topologie-validatie, regressietests voor de 40 objecten, changelog bij besluiten, CI die de kaart niet publiceert als valideerbare velden ontbreken.
- Vergelijking met straatfoto's en twee instructeurs per risicovol knooppunt; voor versie 1 minimaal de 10 prioritaire corridors.
- Onafhankelijk karakter en OSM/licentievoorwaarden zichtbaar.

## 9. Open vragen vóór een betaalde release
1. Welke actueel gepubliceerde of nog niet ontsloten Amsterdamse taxi-/OV-bereikbaarheidsdata mag de gemeente aan opleiders leveren?
2. Kan de gemeente/CBR recente TAP-objectlijsten en het fysieke aanrijcriterium bevestigen bij afwijkend bezoekersadres?
3. Welke tijdelijke omleidingsbesluiten/tijdvakvensters moeten minimaal worden bijgewerkt?
4. Wat is de contractuele/licentiestatus van de gecombineerde OSM+PDOK+eigen route-instructeurdata?
5. Kan een gecertificeerde instructeur per stadsdeel twee richtingafhankelijke routes in de pilot beoordelen?

**Besluitadvies:** eerst bron- en wegvakaudit. Huidige GitHub-kaart mag als zichtbare oefendemonstratie blijven bestaan, maar niet als route- of toestemmingsautoriteit worden gepromoot.
