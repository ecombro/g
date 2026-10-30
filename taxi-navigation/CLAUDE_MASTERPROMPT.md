# CLAUDE CODE MASTERPROMPT — TaxiRoute NL (Routing-First)
Version 1.0 — 30 October 2026
USE THIS AS THE FIRST MESSAGE TO CLAUDE CODE ON THE USER'S LOCAL DEVELOPMENT MACHINE. MANDATORY: CREATE A NEW PRIVATE GITHUB REPOSITORY FOR TAXI NAVIGATION FIRST. DO NOT BUILD IN `ecombro/g`.
IMPORTANT: Scope is a standalone local proof-of-concept and NEW PRIVATE GitHub source repository. It is NOT permission to deploy, host, publish a road legality map, use paid infrastructure or launch an app.

You are the principal navigation/routing engineer and Android tech lead. Build a credible technical foundation for a commercial TAXI NAVIGATION app targeted at Amsterdam, later the Netherlands.

## 1. Product truth: the must-have feature
This is **NOT** a standard Google Maps navigation app with colored roads on top.
It must calculate a bespoke route in the same way truck navigation calculates routes using vehicle height, weight and prohibited roads — except the constraints here are taxi-specific legally permitted/forbidden OV lanes, TTO status, independent tram/bus-lane permit, direction, entry/exit, time restrictions and closures.

The user can select an applicable taxi profile, choose origin/destination, receive a calculated route with turn-by-turn guidance, drive it, and get an updated taxi-compliant route after a wrong turn. A driver with no permit must NEVER be guided into a special lane merely because a licensed taxi could use it. A verified permit must be able to permit a specifically authorised lane even if ordinary car routing excludes it.

**HARD STOP**: If no stack can safely compute AND navigate a profile-aware route, explicitly report blockers. DO NOT replace the central requirement with a taxi-POI app, vanilla Google routing, a fake route on a map, or a waypoint hack that reverts to normal rerouting.

## 2. FIRST: create a new GitHub repository and work LOCAL-FIRST
1. Do NOT build inside the old `ecombro/g` repository. That remains the TAP learning tool and is READ ONLY for this project.
2. On the user's local development machine create a fresh folder, e.g. `~/Projects/taxi-navigation-nl`, and start a new Git repository (`git init -b main`).
3. Target a COMPLETELY SEPARATE, PRIVATE GitHub repository named `ecombro/taxi-navigation-nl` (working name; if unavailable, choose another unique name under the same authorized GitHub account). This means a new repository, NOT a new GitHub account and NOT a fork of `ecombro/g`.
4. Add README, .gitignore, documentation and initial clean commit. Then use authenticated GitHub CLI, for example `gh repo create ecombro/taxi-navigation-nl --private --source=. --remote=origin --push`. If authentication is missing, keep working locally and ask only for account connection; never falsely claim the remote repo exists.
5. Verify the repository is private, its `origin` points to the NEW repository, the local working folder is independent, no credentials are committed, and the old `ecombro/g` remote is absent.
6. Read the existing architecture docs ONLY as references from the old repository: `taxi-navigation/PRODUCT_SPEC.md`, `taxi-navigation/ROUTING_FIRST_ARCHITECTURE.md`, `taxi-navigation/LOCAL_FIRST_WORKFLOW.md` and this masterprompt. Copy the product-specific documents into the NEW repository under `docs/`; update internal paths to match the new repo.
7. Do NOT copy the old TAP app, 41 unverified warning pins or questionable road permissions. The old `tap-amsterdam/verkeersdatabase-v1/05-vrijgegeven-wegvakken.geojson` remains EMPTY and is for legal research context only.
8. Create feature branch `feature/routing-proof` in the NEW repo. Commit routing proof, tests, Android sample and documentation there. GitHub is for source control and test-only CI, NOT production hosting.
9. LOCAL-FIRST MEANS: run routing backend, graph fixtures, tests and Android emulator/physical-device debugging on the local computer. Bind local development services to localhost by default. Use Docker Compose or simple documented run commands only when useful; provide offline synthetic mode without cloud credentials.
10. ABSOLUTE NO HOSTING BEFORE EXPLICIT OWNER APPROVAL: do not deploy an API, website, DB, tile server, mobile binary, production cloud resources, GitHub Pages, or automatic deployment workflow. Test-only GitHub Actions are allowed. An externally licensed provider API is a separately documented dependency, not deployment of our app.
11. Before implementing features, report the new repository URL (ONLY if successfully created), local folder, git branch, initial commit, and a local start/test command. If blocked by GitHub authorization, produce local commit and disclose blocker.
12. Work must be reproducible from a fresh clone of the NEW repo; do not rely on local files in old `ecombro/g`.
## 3. Provider feasibility study — test in this order
A. HERE SDK for Android Navigate + Routing API v8
- Confirm CURRENT version, exact Kotlin/Java APIs and commercial requirements. Docs show \`TransportMode.TAXI\`, route guidance, \`AvoidanceOptions.segments\`, \`SegmentReference\`, direction-specific avoid in Routing v8. Check beta limitations for taxi mode. Verify whether it actually grants local bus/tram access for an Amsterdam chauffeur with an additional ontheffing. Do not assume it does. Do NOT use \`BUS\` transport mode as a workaround.
- Inspect route section notices and graph link reference IDs. Confirm if adding custom legal rules can both BLOCK and ENABLE the necessary edges.
- HERE \`RoutingEngine.importRoute()\` reconstructs rather than perfectly imports vendor routes; prove whether an external custom path can be followed without deviations. Simulate reroute and check whether profiles/restrictions survive. Cannot claim exact adherence without an edge-by-edge check.

B. If HERE cannot meet the essential criteria, prototype self-hosted/custom road network routing:
- Evaluate Valhalla taxi costing and GraphHopper custom models (and importer modifications if necessary).
- Important: model edge permissions in the graph, not merely in a polyline overlay. Assign legal access to **directed edges**, turns, intermediate connectors, time windows and profile.
- Make an explicit distinction: penalizing a road in a custom model can forbid/dissuade access, but it may not create an allowed edge if the graph importer excludes it. Prove both behavior types.
- For navigation, evaluate a stack that can follow the *exact* route (e.g. independent SDK or own navigation/voice/map matching atop properly licensed maps). TomTom Extended supportingPoints and HERE route reconstruction do not guarantee an identical route, so test and reject mismatches.

C. Google Maps:
- Ordinary Google Navigation SDK does NOT accept arbitrary externally computed route polylines. Routes API token != an arbitrary access-rule override.
- Google map may only be used as separate display component under applicable EEA terms, safety and attribution. No automatic Google turn-by-turn for a custom path, unless a verified supported mechanism is found.
- Do not put Google Maps SDK and Google Navigation SDK in same app binary.
- No Google route/data scraping.

## 4. Deliverables — phase 0 (first implementation milestone)
1) \`taxi-navigation/docs/DECISION_RECORD.md\`: comparison matrix for HERE (taxi+avoids), HERE route import, self-hosted GraphHopper/Valhalla, Mapbox/TomTom and Google. Score on directed-edge ALLOW, DENY, legal time windows, custom access overrides, exact turn-by-turn, reroute integrity, pricing/licensing, SDK availability, GDPR. For every claim cite official current docs; write UNKNOWN if not experimentally verified.
2) \`taxi-navigation/docs/PROVIDER_CAPABILITY_TESTS.md\`: precise API calls, expected/actual responses, credentials needed, restrictions, and technical blockers. Never fabricate a successful online API run if keys are missing.
3) \`taxi-navigation/routing-poc/\` runnable deterministic directed graph with synthetic **fictional** roads only, named Testlaan/Testbusbaan:
   - directed edge data model and route solver,
   - legal-profile constraints, time windows with Europe/Amsterdam DST and validated turns/connections,
   - route verifier independent from the solver (does not trust its own result),
   - route serialization (geometry + directed edge IDs + maneuvers),
   - deterministic reroute from a simulated wrong-turn.
   - tests that fail loudly for unsupported or ambiguous access.
   - Prefer TypeScript/Python for routing proof if self-contained; use a real graph engine when needed and state where functionality is mocked. A synthetic custom graph solver is a logical validation proof, **NOT** verification that HERE/OSM can serve Amsterdam road data. Never conflate them.
4) Android proof of navigation **only after route engine proof**, in \`taxi-navigation/android/\` if SDK licenses/toolchain available:
   - visual map and turn-by-turn along precomputed custom route,
   - test voice instructions and off-route replan,
   - reject any third-party provider reroute violating directed-edge profile constraints.
   - If SDK unavailable, create only a compiling interface/mock demonstration and label as NOT A REAL SDK INTEGRATION.
5) Run tests and build commands; record exact successes/errors in \`taxi-navigation/docs/BUILD_REPORT.md\`.
6) README with quickstart, env vars in \`.env.example\` (NO real keys), Docker setup if required, architecture diagram in Mermaid, deployment/licensing needs.
7) \`taxi-navigation/docs/GO_NO_GO.md\`: candid pass/fail decision. This must explain if the core requirement is proven, partially proven, or not proven; no promotional overstatement.

## 5. Synthetic test matrix — non-negotiable
Given parallel routes from A to B:
T01 NORMAL_TAXI avoids special lane even if faster.
T02 TAXI_WITH_VERIFIED_PERMIT is allowed along the special lane only when explicit **synthetic** access grant is present and time is valid.
T03 TTO status does NOT automatically equal standalone permission; access strictly based on matching explicit profile rules.
T04 AOV exemption only applies on defined synthetic edges and conditions.
T05 All vehicle profiles avoid explicitly forbidden directed edge (unless an expressly modelled legal exception is proven).
T06 Direction: edge legal forward but forbidden backward; reverse routing must not cross it.
T07 Entry/exit: cannot join or leave special lane mid-segment.
T08 Turning restriction: a path using prohibited turning movement fails even if all edges individually allowed.
T09 Time windows: boundary at 01:00 / 06:00 and weekend shifts with \`Europe/Amsterdam\` timezone.
T10 Daylight saving time transitions: spring gap/autumn repeated local hour handled deterministically.
T11 Reroute after wrong turn recalculates same profile with current clock and excludes denied edges.
T12 User switches profile: cached route invalidated and recomputed, no stale permission.
T13 Missing evidence for special-lane access => deny, not assume.
T14 External provider returns route with a forbidden edge => independent verifier rejects and fails safely.
T15 No legal route => explicit no-route result, never silently ignore restriction.
T16 Map-matching ambiguity between adjacent car lane and tram/bus track => cannot mark special lane as safe based on proximity.
T17 Route instructions use same directed-edge itinerary in preview and after reroute.
T18 Graph/rule database version changes => current route invalidated/revalidated.
Record assertion logs and runnable commands.

## 6. Real-world evidence policy
Until formal verified segment acceptance from owner and double-review:
- DO NOT populate \`tap-amsterdam/verkeersdatabase-v1/05-vrijgegeven-wegvakken.geojson\`.
- DO NOT call Damrak, Rokin, Rembrandtplein, Weteringschans or any Amsterdam tram/bus lane a publicly verified new route. Use them as **documentary QA cases**, with status "requires official geometry / current field sign verification".
- DO NOT copy legal restrictions from Waze, Google Maps, Uber, Bolt, HERE or proprietary apps by scraping/redistributing.
- OSM data may be used only according to ODbL and its coverage limitations, and never alone as proof of local exemption.
- Put uncertain claims in an independent uncertainty report. No "green accessible" lane based on an OSM tag.
- Stop or fail closed if primary rules are conflicting, missing, expired or profile is unclear.

## 7. Non-functional requirements
- Security: secrets in env / Android restricted keys; no credentials committed. Backend rate limits and auth if remote endpoints created.
- Privacy: no passenger PII analytics, no always-on GPS history collection by default, encryption and GDPR.
- Robustness: route versioning, offline/poor signal behavior explicitly documented, dependency and network errors displayed clearly.
- Driving safety: no complicated interactions while driving; large controls, speech, road conditions override device instructions.
- Source licensing: vendor tiles, HERE/Google/Mapbox/TomTom SDK terms, OSM/ODbL data and attribution reviewed before commercial rollout.
- Use a single provider or clearly separated compatible UI implementation; don't mix incompatible SDKs.
- Observe owner-controlled costs; avoid automatic paid API loops without limits.

## 8. How to work
- First create the new private GitHub repository and local workspace described in section 2; present a concise plan, then implement it in small auditable steps.
- Favor working code, tests, reproducible commands and honest evidence over attractive mockups.
- If API keys, vendor entitlement, Android SDK, emulator or network are missing, proceed with synthetic graph unit tests, mocks and documentation, but state precisely which integration is untested.
- Local proof-of-concept development is authorized in the NEW repo. Ask for GitHub authentication and external SDK credentials only when blocked; do not host publicly or use paid infrastructure without separate approval.
- Do not create an app sold as taxi-specific navigation until the real-world road data review and provider adherence tests pass.
- Do not change unrelated folders or previous learning tool code.
- End with: code created, commands run, tests passed/failed, provider observations, unresolved blockers, costs/licensing questions, and recommendation GO / NO-GO.

## 9. Acceptance / STOP criteria
The project proceeds to commercial UI implementation only when:
A. the solver enforces the synthetic access/turn/time rules and tests T01–T18 pass;
B. the chosen routing stack can generate a realistic directed-edge route that contains explicitly permitted extra taxi lane access while excluding forbidden ones — not merely visualize it;
C. the actual navigation stack accepts and safely follows that chosen route, with rerouting respecting the exact same restrictions; 
D. official Amsterdam source/geometry verification exists for all lanes claimed in the pilot; and
E. vendor pricing/license and liability/privacy implications are reviewed.

**If A passes but B or C does not: do not ship. Switch engine/SDK and explain clearly. If D isn't ready: no road legality claims or public pilot, even if synthetic tests pass.**

Start with NEW PRIVATE GitHub repository creation and a runnable LOCAL workspace, then provider decision matrix, then IMPLEMENT the synthetic routing engine and its tests. Do not spend time on login screens, subscriptions, branding or generic Google route UI before proving the core route functionality.
