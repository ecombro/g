# Local-first development & GitHub workflow
Version: 1.0 — 30 October 2026
Status: MANDATORY for all Taxi Navigation work.

## The three environments (do not confuse them)
1. **Local machine = execution and development**. Claude Code works in a local clone of the GitHub repository. Routing proof, tests, development API, local graph and Android app run on the developer's own machine (Android emulator or physical device). A phone/emulator can connect to a backend on the host via the correct emulator/USB/Wi‑Fi address, not a public server.
2. **GitHub = source control and collaboration**. Repository \`ecombro/g\`; navigation project under \`taxi-navigation/\`. Use Git branches, commits, pull requests, code review and optional GitHub Actions that only run checks. GitHub is NOT where the app/backend is hosted for public users. Do not confuse GitHub Pages or raw.githack with backend hosting.
3. **Production hosting = later, separately approved**. Cloud API, managed DB, production routing graph, map tiles, user auth, public mobile distribution, paid subscriptions only after technical and data-compliance gates and explicit owner approval. No automated deployment from current work.

## Non-negotiable local-only rule
- **Until the owner explicitly authorizes deployment, do not deploy any API, web app, map service, database, Android app, or container to a public cloud or app store.**
- Do not configure auto-deploy platforms, publish a URL, create production cloud accounts, buy services, activate paid subscriptions, or enable public endpoint access.
- CI may lint/test/build but must not publish APKs as public releases, distribute apps or deploy anything.
- Do not overwrite or reconfigure the current \`tap-amsterdam/\` application.
- "Local-first" doesn't forbid an internet call to a provider's existing API **if licensed, a test key is available, and costs/usage are explicitly bounded**. That is a dependency, not our server hosting. If unavailable, work in synthetic/offline mode and report the dependency accurately.

## Folder layout (target, create only when useful)
\`\`\`text
ecombro/g/                           # existing GitHub repo, locally cloned
  tap-amsterdam/                    # existing study tool, do not modify
  taxi-navigation/
    PRODUCT_SPEC.md
    ROUTING_FIRST_ARCHITECTURE.md
    CLAUDE_MASTERPROMPT.md
    LOCAL_FIRST_WORKFLOW.md
    README.md                        # quickstart to create
    routing-poc/                     # synthetic directed graph, tests, local server
    android/                         # Android Studio Kotlin app when feasible
    data/
      fixtures/                      # fictional test street graph, no real permissions
    docs/
      BUILD_REPORT.md
      GO_NO_GO.md
      PROVIDER_CAPABILITY_TESTS.md
    .env.example                     # placeholders only
  .github/workflows/                 # optional test-only CI
\`\`\`
Do not create empty skeleton folders just for appearance; deliver actual runnable artifacts and their commands.

## Development flow
1. Clone \`ecombro/g\` on the user's machine; \`git pull\` on default branch. Never assume Claude has GitHub permissions: local work/commits can proceed without remote push.
2. Create feature branch, e.g. \`feature/taxi-navigation-routing-poc\`. Keep unrelated files untouched.
3. First create synthetic directed graph proof with zero proprietary API keys and no server hosting. Add deterministic automated tests including profiles, one-way, time windows, turns and rerouting.
4. Run and document local checks (commands, expected outputs, exact versions). Provide one-command start for the local graph API if needed (e.g. script, or Docker Compose for development). Bind local backend to \`127.0.0.1\` by default and use sample data only.
5. Next build Android proof (Android Studio on machine): emulate GPS and wrong turns, and verify exact prescribed custom route; external SDK key stays in untracked developer-local configuration.
6. Save code/tests/docs as Git commits on feature branch. Request PR review before merging. GitHub Actions can run lint/unit tests/build offline; no deployment workflow.
7. Only after routing GO decision, official street segment verification, explicit user approval: plan a **separate** staging environment and later production. Hosting/platform selection is its own design decision and cost estimate, not a hidden prerequisite.

## First runnable milestone acceptance
- New developer can clone repo and run routing proof on a laptop using documented commands; no cloud database/API and no account required.
- No local route fixtures claim real Amsterdam access. All special-lane examples are fictional.
- Unit tests show the algorithm actually changes routes by driver profile, directed lane, time, turns and reroute.
- At least one automated check verifies the approved real-world lane dataset is intentionally empty.
- Android demonstration may use an emulator/physical phone but must report honestly when real SDK or provider accounts are missing.
- No public URL, production cloud resources, app-store app or production costs are created.
- GitHub contains complete source, setup guide, tests and reproducible run instructions.

## Future hosting / release decision (NOT APPROVED)
Only after approval evaluate:
- staging vs production isolation, API/routing deployment, road graph tile hosting, geocoding, licensed traffic feeds;
- database backups/migrations, TLS, monitoring, key management, rate limits, DDoS controls, uptime;
- production GDPR/privacy/consent and liability/traffic-data validity;
- app distribution, user accounts, billing and merchant policy;
- costs per navigation session and operational break-even.
Deployment should be a separate PR/change and an explicit GO decision, not a side effect of a build.
