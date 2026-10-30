# Taxi Navigation — Product Requirements v1.0
Date: 30 October 2026
Owner: product team
Status: DEVELOPMENT BRIEF, not navigation/routing approval
Language: Dutch user interface; English internal code/docs where useful.
Scope: independent Android taxi-driver navigation app; initial Netherlands / Amsterdam pilot.

## 0. Executive decision
Build a reliable, useful **taxi-driver companion and standard driving-navigation app** using Google Navigation SDK for Android first. Maintain independently sourced, licensed, human-reviewed taxi points of interest and regulatory evidence. **DO NOT claim lane-legal taxi routing until a separate corridor and routing-engine validation gate passes.**

Intended product edge is taxi-specific pick-up/drop-off guidance, curated taxi stands, verified road/zone information, and driver workflow. Generic navigation by itself is not a viable paid differentiator against free navigation apps. Price and paywall only after pilot value validation; payment is not in first technical milestone.

## 1. Market and audience
Primary: independent licensed Dutch taxi chauffeurs who work in Amsterdam, including app-platform drivers and pre-booked passenger work.
Next: TTO chauffeurs, chauffeurs with standalone lijnbusbaanontheffing, airport and executive chauffeurs, fleet managers.
Excluded: public driving instructions claiming entitlement to use tram/bus lanes without verified applicable permit. Do not turn TAP training into the primary product.

## 2. Core promise (two tiers, never conflate)
Tier A, AVAILABLE FOR MVP: "Duidelijke standaardnavigatie met gecontroleerde taxi-locaties en chauffeurinformatie."
Tier B, NOT AVAILABLE UNTIL GATE: "Navigeer over legaal toegestane Amsterdamse taxi-/OV-banen" — requires verified directed road graph and an appropriate navigation/routing host.
Do not market Tier B at launch. Copy must distinguish ordinary car routing from permit-specific routing.

## 3. User journeys
J1. Driver launches app, handles location permission and Google navigation Terms, sees map in Amsterdam.
J2. Search address/location via licensed provider, preview usual driving route, start turn-by-turn voice navigation, arrive and finish.
J3. From destination nearby, driver opens verified taxi stand / pickup / dropoff detail with data provenance, last review and directions to the general address. If the stop position has not been validated, it MUST NOT be promoted as safe/legal.
J4. Driver saves favorites (home address? optional, local-first), recent destinations (local only, delete control).
J5. User selects profile "gewone taxi zonder speciale OV-ontheffing", "taxi met zelfstandige lijnbusbaanontheffing", "TTO" or "AOV" for informational display ONLY. These profiles NEVER unlock lanes through Google route engine in MVP.
J6. Driver flags inaccurate stand / restricted road *when parked*: moderator queue, evidence/photo only with clear consent, no automatic publication.
J7. In-app transparent panel: "Standaard autoroute van Google — geen toetsing aan Amsterdamse taxiontheffing".
J8. Driving: non-essential menus disabled, no editing/reports while moving, clear auditory commands, large touch targets.

## 4. Feature tiers
### P0 Technical proof of concept (must pass before anything else)
- Working Kotlin Android app on a physical device; Google Navigation SDK installed (not together with Google Maps SDK), permissions, SDK Terms, route search, voice turn-by-turn, arrival, background/foreground transitions and simulated routes.
- Can render sample **verified independent** POI on nav map with clearly visible third-party source attribution.
- Provide test harness / simulator and metrics count of navigation requests, errors, GPS unavailable.
- Explicit license/legal and product feasibility review before scaling.

### P1 Pilot MVP
- Address search, route preview, launch/pause/end guidance, basic navigation settings.
- Favorites and recently searched destinations local-first; no tracking by default.
- Independent taxi stand/pickup point directory seeded ONLY with manually checked, versioned entries; start with 5–15 quality examples, not thousands of unverified points.
- POI detail: address vs actual pickup point vs vehicle approach details, every detail with separate confidence and source. Only verified fields shown as fact; otherwise "Niet bevestigd" and hide dangerous advice.
- Driver feedback form (only while stationary) and server-side moderator review.
- Admin audit: evidence status, reviewer ID, published_at, source, rule validity dates, mandatory reason.
- Provider usage analytics aggregated, no continuous trip logging by default.
- Feature flags and remote config; route safety notices in Dutch.

### P2 Commercial validation
- Invite-only 10–20 Amsterdam taxi drivers, real-trip QA in mixed conditions.
- KPI: repeat weekly use, percentage valid pickup points, route errors, reports, support cost, navigation spend per active driver, willingness to pay. Interview users not only clicks.
- Paid trial only for demonstrably differentiated reviewed POI/features. Pricing experiments €9.99 / €14.99 / €19.99 per month are hypotheses, not commitments; implement payment only after store-policy review and margins.

### P3 Taxi-specific routing (separate high-stakes release)
- Independent traffic-law source register with per-direction lane segment geometries, current applicability, permit profile and field-signed evidence.
- Routing provider choice gated by actual ability to enforce constraints and rerouting. Google Navigation SDK cannot accept arbitrary custom polylines; separate external-route/navigation architecture may be required.
- Route compliance checks must match road lanes/directions, not naive line intersection between tram track and a road polyline. Unknown never counts as allowed; prevent false confidence and provide standard-road fallback only when normal driving route remains valid.
- Different user roles and conditions (TTO / standalone permit / AOV / TAP instruction, clock restrictions) properly modelled; change log and emergency kill switch.
- Explicit user go/no-go authorization after evidence/field review and legal signoff.

## 5. UX and screens
1. Onboarding, disclaimer, provider attribution, permit-profile information and permission.
2. Main map with one dominant "Waarheen?" search, profile indicator, taxi POI overlays toggle.
3. Search results with source and street vs entrance distinction, exact side-of-road only where known.
4. Standard route preview (ETA, distance, toll optional), label "Standaard autoroute".
5. Navigation HUD native Google guidance; no unrequested popups while driving.
6. POI details: coordinate source + access confidence, access notes, review date.
7. Favorites and recent; opt-out/delete.
8. Submit correction (when parked), choose type, photo optional, consent.
9. Settings/privacy/legal/feedback.
10. Admin dashboard (internal only, no in-drive access).

## 6. Brand & commercial hypotheses
Working name: TaxiRoute NL (placeholder; perform trademark/domain check before publication).
Tone: professional and high contrast; taxi/driver oriented, no unsupported "CBR-approved", "gemeentelijk gecertificeerd", "altijd legaal".
Payment: avoid depending on premium road access that has not been validated; first pilot free.
Primary ROI hypothesis: faster locating legitimate pickup/taxi-stand entrances, reduced confusion; this must be validated with measured pilot responses.

## 7. Non-goals / prohibited shortcuts
- NO scraping or copying Google Maps, Waze, Uber, Bolt, HERE or proprietary app datasets; only independently licensed feeds, official city publications, OSM with correct ODbL treatment, field studies and user reports after review.
- NO API token or private user credentials committed.
- NO promise that Google Routes API can inject road-specific taxi permissions or exclusions.
- NO automated "legal" status based only on OSM railway/busway tags, a distance-to-polyline heuristic, or a traffic sign lacking direction/validity.
- NO scraping and storing Google road names/route polylines or places into an independent street network.
- NO free public OSM tile server as production SLA; no demo OSRM endpoint in paid product.
- NO background tracking without specific consent; no passenger addresses in analytics.
- NO paid release without legal/licensing, driver safety, Play Store billing, and actual route functionality validation.
- NO Apple CarPlay, Android Auto, iOS, fleet dispatch, booking/payment processing, Uber/Bolt integration or auto-detection of trip requests in initial MVP.

## 8. Release gates
G0: Android SDK proven; Google license/EEA requirements reviewed; API cost controlled. If failing, stop architecture and produce alternative decision.
G1: Standard navigation reliable in physical-device tests, GPS and network transitions; in-app disclosure that taxi-specific restriction enforcement is NOT available.
G2: POI published entries all reviewed with source, coordinate type and permitted reuse; admin corrections and kill switch working.
G3: Driver pilot (10–20), feedback, request costs, incident review, acceptance criteria met.
G4: Only after legal/field validations, separate taxi-specific routing launch with human-in-loop QA and explicit go/no-go.
G5: Revenue launch: store billing/legal approval, price test, customer support and refund process, unit economics.

## 9. Owner-controlled assets and work division
The previous Amsterdam TAP map, official legal source records and OSM data in this repo are RESEARCH INPUT ONLY. Treat as untrusted for traffic routing. Do not alter or publish the current TAP map, its 41 warning points, source-only legal database, or its fail-closed CI gate as part of navigation MVP.
All new code and specs under /taxi-navigation/. Ask for external accounts/keys only when a concrete blocked step requires them; provide mock mode and honest partial completion otherwise.
