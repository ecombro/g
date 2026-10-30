# ROUTING-FIRST ARCHITECTURE — Taxi Navigation NL
Version: 1.0 / 30 October 2026
Priority: prove **real permit-aware route computation + turn-by-turn adherence** before polishing UI.
Status: feasibility specification; no provider integration or public release is yet verified.

## 1. Hard product requirement
A standard Google car route with color-coded restricted roads is **NOT the product**. Our output must be a path over a directed road graph constrained by:
- vehicle/access profile, as legally applicable (ordinary taxi, independently permitted taxi, TTO, AOV);
- specific validated lane type and (only where applicable) allowed medegebruik;
- direction, turn and entry/exit restrictions;
- date, day of week, clock-time, temporary restrictions, start/end validity;
- permitted/forbidden entry to taxi stands and pickup/dropoff locations;
- road closure status and restricted links with human-reviewed provenance.
Unknown is NOT legal permission. An OSRM/Google/OSM "taxi" tag is not proof of Amsterdam's special ontheffing.

A driver must be able to select an entitled profile, compute a route, see why it was selected (and rejected alternatives), receive spoken guidance and reroute without the engine forgetting the permit constraints. If that cannot be demonstrated we must STOP (do not ship a generic Google navigation substitute).

## 2. Provider feasibility scorecard (verify in code, not marketing)
A) **HERE SDK (Android Navigate) and HERE Routing API v8** — FIRST engineering candidate.
- Official docs show \`TransportMode.TAXI\` for taxi-restricted and exclusive taxi-access roads, but some HERE SDK API references label TAXI BETA: do not assume complete/accurate Amsterdam coverage.
- Official docs show \`AvoidanceOptions.segments\` / \`avoid[segments]\` with segment references and direction support in API.
- Official docs show \`VisualNavigator\` route guidance, navigation, rerouting, traffic awareness.
- **Limitation:** avoidance can BLOCK known edges but does not magically UNLOCK bus/tram lanes classified as prohibited to taxi by HERE. Check special permission compatibility directly. Do NOT use BUS transport profile for a taxi as a hack.
- Official docs support \`importRoute\` but the route is reconstructed, may differ from intended edge sequence; reroutes may differ too. Inspect every segment span/notice and reject if restricted/access rules violated. Import is NOT guaranteed to preserve an externally validated route.
- Feature and paid SDK entitlement and license need confirmation directly from HERE; no keys presently provided.

B) **Independent directed routing graph** — required fallback if HERE cannot enforce both exclusion AND positive permission.
- Evaluate Valhalla with taxi costing and OSM-based (licensed) graph, or GraphHopper self-hosted custom models.
- Critical: custom edge weights/avoid polygons do NOT grant access to edges absent or not routable in the graph. Designing graph importer / access overrides is a separate engineering task. Need explicit \`taxi_ontheffing_eligible\` edge model, directed lanes, turn restrictions, connection points, time restrictions, statuses.
- A usable external engine must output a map-matched, fully specified directed edge sequence plus maneuver and leg info. Avoid "nearest rail/polyline" as a substitute for lane topology.
- Navigator choices: own guidance/map stack (licensed vector tiles / MapLibre or suitable provider), or another SDK that demonstrably accepts the EXACT route. Provider route reconstruction without exact preservation is NOT adequate by itself.
- Use real-time traffic only if correctly licensed/integrated; do not claim Google's live traffic applies to own routes automatically.

C) **Google Maps Platform** — NOT a first-choice routing/navigation host.
- Navigation SDK cannot accept arbitrary, externally calculated custom route polylines. Route token and waypoint shaping are Google-calculated routes, not arbitrary graph access overrides.
- Google EEA terms may permit third-party routing overlays with attribution and extra safety duties; this does not solve custom turn-by-turn guidance. Its Google Navigation SDK cannot be quietly reused as a third-party-route guidance engine.
- Google could provide a map display only if EEA license/security/safety constraints for external routing are verified. Google Maps SDK and Navigation SDK cannot be combined in one binary. Do not assume permission extends to all account regions or all APIs.

D) **TomTom / Mapbox** — alternatives to test if HERE route import does not guarantee compliance.
- TomTom Maps & Navigation SDK offers supportingPoints/custom polyline reconstruction in Extended flavor upon request (separate availability/cost).
- Mapbox has docs for custom route/map matching; verify currently maintained SDK version and exact guarantees for route adherence and rerouting before selecting.
- Reconstructed path is not automatically identical to the submitted original; strict graph verification remains mandatory.

## 3. Actual system boundaries
Drivers Android native app (Kotlin + Compose, navigation SDK/map renderer chosen **AFTER** feasibility) <-> backend routing gateway <-> directed edge graph + restrictions + evidence registry.
- Routing API: \`POST /routes\` origin/destination, permitProfile ID, departureTime ISO 8601 with Europe/Amsterdam DST, vehicle, avoidance preferences.
- Output: validated edge sequence (directed edge IDs), polyline, route maneuvers, per-edge legal-rule provenance, time windows, engine version, graph dataset version and explicit \`verificationStatus\`.
- Unverified or unmapped access: no taxi-approved route; optionally provide *labelled* unverified standard driving alternative in testing only, without "approved" claim.
- Navigation session: activeRouteId, current matched edge and direction, warnings, reroute request. Reroute MUST call exact same permit profile / rule version / time context; invalidate route on relevant time window or network changes.
- Permission profile is a declared setting, **NOT verification of legal possession**; if a user claims privileges, UI must not say the developer has verified their license. For production require legal assessment of which data can be verified and how.
- Back office stores official legal source ID, relevant clause, regulatory effective date, reviewed lane geometry direction, signed-field-check evidence, reviewer and date. The legacy TAP 2018/2021/2026 source registry is documentary only, not route authority.

## 4. Candidate data schema
\`\`\`
type DriverAccessProfile = "NORMAL_TAXI" | "STANDALONE_LIJNBUSBAAN" | "TTO" | "AOV";
type EvidenceStatus = "PUBLISHED_VERIFIED" | "RESEARCH_ONLY" | "REVOKED";
type DirectedAccessRule = {
  id: string,
  directedEdgeId: string,
  direction: "FORWARD" | "BACKWARD",
  profile: DriverAccessProfile,
  effect: "ALLOW" | "DENY",  // only if positive and negative legal proofs are complete
  timeWindow: {daysOfWeek:number[], startLocal:string, endLocal:string, timezone:"Europe/Amsterdam"} | null,
  validFrom:string, validUntil:string|null,
  sourceId:string, sourceClause:string, sourceUrl:string,
  fieldEvidenceRef:string, reviewerId:string, independentlyReviewedBy:string,
  status: EvidenceStatus
};
\`\`\`
NOTE: Multiple rules can overlap or conflict; precedence cannot be a simple yes/no flag. Restrictions for C-/F-/D-borden and conditional access vary by lane, direction and profile; design a deterministic, tested conflict resolver. The code sample is conceptual, not enough as a full legal model.

## 5. Route compliance guardrail
1. Build original route ONLY on graph where all edge/turn access restrictions are resolved and dated.
2. If no verified positive grant to a special lane, do not use it by virtue of the taxi permit. Existing public road driving legality is assumed from a dedicated base road graph, but unknown special-lane access is denied.
3. Calculate candidate paths; evaluate every directed edge, turn, entry/exit connector and time-dependent rule for the predicted traversal time (not just departure).
4. If a provider returns \`SectionNotice\` violation or deviation from expected edge sequence, REJECT the route. Never use a waypoint to force a forbidden shortcut.
5. Reroute from location + bearing with the identical legal profile and updated clock; reject provider reroutes that ignore external restrictions.
6. Fail closed to no taxiroute, not quietly to a route using unknown or denied lane. Can display "Nog geen gevalideerde taxiroute beschikbaar" with option to use **separately labelled** regular car navigation, after safety and legal review.
7. No driver interaction needed mid-driving; safe voice instruction, large controls.

## 6. Development phases
G0: Research provider SDK/API exact methods, license, availability for Dutch use (and beta limits). Create decision log with citations and minimal API prototypes.
G1: **Synthetic deterministic directed graph** including an ordinary road route and a special bus/tram link in parallel. Configure profile ALLOW and DENY, one-way, turn, time window and no-route; pass entire test matrix. This is NOT a claim about real Amsterdam roads.
G2: Demonstrate live navigation (SDK simulator + at least one Android physical device) along **the preselected graph route**, then simulate wrong turns/route deviation and verify rerouting preserves restrictions; compare every edge and instruction.
G3: Test against a few specifically verified Amsterdam road segments AFTER legal + field approvals. Until then there are ZERO real-world approved lane edges in the project.
G4: UX, paid app viability, privacy, costs, scalability and Dutch traffic change monitoring. No launch without G1-G3.

## 7. Official engineering sources consulted
- HERE Android taxi and truck routing: https://docs.here.com/here-sdk/docs/android-routing-options
- HERE navigation: https://docs.here.com/here-sdk/docs/android-navigation
- HERE direction-specific avoid segments: https://docs.here.com/routing/docs/routing-v8-avoid-segments
- HERE SDK reconstructed route caveat: https://docs.here.com/here-sdk/docs/android-routing-advanced
- Google FAQ cannot specify routes: https://developers.google.com/maps/documentation/navigation/android-sdk/faq
- Google EEA safety/licensing: https://cloud.google.com/terms/maps-platform/eea-safety-requirements
- GraphHopper custom model mechanics and limits: https://github.com/graphhopper/graphhopper/blob/master/docs/core/custom-models.md
- TomTom route import SDK Extended: https://docs.tomtom.com/navigation/android/guides/routing/custom-routes
- Official Amsterdam primary legal sources are in \`tap-amsterdam/verkeersdatabase-v1/\`.

## 8. Non-negotiable acceptance tests
- Profile A (verified eligible permit) uses whitelisted synthetic lane; NORMAL_TAXI never does.
- Explicit ban overrides any positive lane allowance according to tested priority.
- Time-window edge opens/closes at proper Amsterdam time, handles DST boundaries.
- Directed lane cannot be used wrong-way, cannot be entered/exited at arbitrary intermediate coordinates.
- Turn restrictions applied, not only edge access.
- Rerouting after wrong turn NEVER introduces forbidden edge; revalidates every traversed segment.
- Inconclusive evidence never permits a special lane.
- Navigation instructions align with validated route geometry and map road lanes; ambiguity triggers fail-safe.
- Route pricing/ETA/usefulness measured separately, with no fabricated live traffic or costs.
