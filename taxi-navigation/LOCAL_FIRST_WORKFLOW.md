# Local-first development & GitHub workflow
Version: 1.0 — 30 October 2026
Status: MANDATORY for all Taxi Navigation work.

## The three environments (do not confuse them)
1. **Local machine = execution and development**. Claude Code works in a local clone of the GitHub repository. Routing proof, tests, development API, local graph and Android app run on the developer's own machine (Android emulator or physical device). A phone/emulator can connect to a backend on the host via the correct emulator/USB/Wi‑Fi address, not a public server.
2. **GitHub = source control and collaboration**. Create a BRAND-NEW PRIVATE repository `ecombro/taxi-navigation-nl` under the same authorized account. It is independent of the existing `ecombro/g` TAP study repo. Use Git branches, commits, pull requests and optional test-only GitHub Actions. GitHub is NOT application hosting.
3. **Production hosting = later, separately approved**. Cloud API, managed DB, production routing graph, map tiles, user auth, public mobile distribution, paid subscriptions only after technical and data-compliance gates and explicit owner approval. No automated deployment from current work.

## Non-negotiable local-only rule
- **Until the owner explicitly authorizes deployment, do not deploy any API, web app, map service, database, Android app, or container to a public cloud or app store.**
- Do not configure auto-deploy platforms, publish a URL, create production cloud accounts, buy services, activate paid subscriptions, or enable public endpoint access.
- CI may lint/test/build but must not publish APKs as public releases, distribute apps or deploy anything.
- Do not overwrite or reconfigure the current \`tap-amsterdam/\` application.
- "Local-first" doesn't forbid an internet call to a provider's existing API **if licensed, a test key is available, and costs/usage are explicitly bounded**. That is a dependency, not our server hosting. If unavailable, work in synthetic/offline mode and report the dependency accurately.

## Folder layout (target inside NEW repository)
```text
taxi-navigation-nl/                 # brand-new, PRIVATE GitHub repository
  README.md                         # local quickstart
  docs/
    PRODUCT_SPEC.md
    ROUTING_FIRST_ARCHITECTURE.md
    CLAUDE_MASTERPROMPT.md
    LOCAL_FIRST_WORKFLOW.md
    BUILD_REPORT.md
    GO_NO_GO.md
  routing-poc/                      # local executable synthetic routing prototype
  android/                          # Android Kotlin app when SDK selection proves fit
  data/fixtures/                   # fictional graph data, never invented real taxi access
  .env.example                     # placeholder values only
  .gitignore
  .github/workflows/               # automated testing ONLY, no deployment
```

## Development flow
1. On the user's OWN computer create a new independent local folder and initialize Git: `mkdir -p ~/Projects/taxi-navigation-nl && cd ~/Projects/taxi-navigation-nl && git init -b main`.
2. Add README, .gitignore and specs; make initial commit. With authenticated GitHub CLI create new PRIVATE repo: `gh repo create ecombro/taxi-navigation-nl --private --source=. --remote=origin --push`. If GitHub is unavailable, remain local and explain what authorization is needed.
3. Verify new remote points to the NEW repository, is private and old `ecombro/g` is not a remote. Do NOT fork or clone the old TAP repository as the app foundation.
4. Create `feature/routing-proof`; keep all navigation code/tests in the new repo. The old TAP repo and its traffic-evidence database are read-only research references, not production route permissions.
5. First develop synthetic road graph and routing API locally, without hosting, keys or paid services. Create reproducible tests for profiles, turn restrictions, one-way, time windows and rerouting.
6. Run local tests and Android Studio emulator/phone debugging. Document exact commands. Keep backend bound to `127.0.0.1` by default and use only test fixtures.
7. Commit on feature branch and push to new private repo; open pull request for review. GitHub Actions may validate code but MUST NOT deploy or publish binaries.
8. Later, after explicit owner approval and verified real road data, consider separately designed staging and production hosting. No cloud signups, DNS, CI deployment, subscription billing, or public URL are authorized now.
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
