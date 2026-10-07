# Foundation verification

## Local evidence — 2026-10-06 America/New_York

Environment: Windows owner-controlled workspace, Node v24.19.0, npm 11.17.0.

| Command | Result |
| --- | --- |
| `npm ci` | Exact committed lockfile; fresh installation verified before return |
| `npm run lint` | Biome formatting/import/recommended-rule checks pass |
| `npm run typecheck` | Strict TypeScript pass |
| `npm run schema:check` | Committed static validators reproduce exactly from six closed 2020-12 schemas |
| `npm test` | 22/22 tests pass: eleven fixture replays, schema negatives, timestamp coherence, identity/noise/revision/conflict, qualification, ten Docs states, Watch ownership, ingest tables, HTTP boundaries |
| `npm run secret:scan` | Offline credential-pattern scan passes; bounded coverage, no logged content |
| `npm run build` | Worker bundle and static UI build |
| `npm run worker:smoke` | Actual bundle health/normalize/assets pass with dynamic Function and outbound Fetch denied |
| `npm run browser:smoke` | Chromium desktop + 390px mobile; fixture inspection/replay/API passes; zero WCAG A/AA axe violations, page errors, overflow or outbound browser requests |
| `npm run audit:runtime` | Zero reported vulnerabilities |
| `npm run audit:all` | Zero reported vulnerabilities; full dev/build/test graph included |

`npm run validate` composes lint, typecheck, schema drift, tests, secret scan, build and built
Worker smoke. Browser evidence is created in ignored `work/evidence/` and returned as local
artifacts, not mixed with source or presented as live provider proof. API tests use Hono's
local Request boundary; browser smoke exercises the actual local HTTP adapter. No vendor
account/network call occurs in tests. Dependency install/audit/browser-download operations
use their public registries separately from deterministic tests.

## Hosted/independent acceptance

One read-only public-repository workflow runs on PRs/main/manual dispatch, without model
invocation, paid service, vendor credential or deployment. Exact-head CI links and reviewer
disposition are returned with the foundation PR. Review/CI are required before acceptance;
this document alone does not establish that a PR has merged or a hosted lab exists.

## Limits

- Zero automated accessibility violations is a bounded smoke, not comprehensive certification.
- Offline credential patterns do not replace manual data review or organization secret controls.
- Modeled fixtures do not establish actual vendor response compatibility or live entitlement.
- Replay is stateless; no ledger/state writer/scheduler exists.
- Cloudflare configuration is prepared, but live Workers runtime and deployment are gated.
- Maps export-format vocabulary does not implement all exporters.
- Failure and stopping states are evidence metadata; no autonomous action engine exists.
