# Modernization Stack reference lab

Lowcountry Digital Works owns this public, provider-neutral, synthetic-only integration lab.
It compares normalized reference evidence across Discovery, Ingest, Evidence, Watch, Docs
and Maps. It is lab architecture, not a customer product, source of truth or production system.

All eleven provider adapters are **MOCK / live proof PENDING**. A passing fixture replay
proves only the local contract/mapping. It does not prove provider API compatibility,
account entitlement, vendor operability or customer value.

## Run locally

Use Node.js 24 and the committed lockfile:

```sh
npm ci
npm run validate
npx playwright install chromium
npm run browser:smoke
npm run audit:runtime
npm run audit:all
npm run dev
```

The lab binds only to `http://127.0.0.1:4173`. Build before starting. Press Ctrl+C to stop.
Browser tooling may download Chromium; deterministic tests and browser requests themselves
use local fixtures only. Audit/install operations contact package/tool registries.

## Scope and authority

- Strict TypeScript, Node.js 24, thin Hono Fetch API, static semantic HTML/CSS/TypeScript.
- JSON Schema 2020-12 common/domain contracts and deterministic fixture readback/replay.
- No database, auth, analytics, model API, vendor fetch/write, scheduler or provider secrets.
- Docs approval remains mandatory; all normalized records and actions have `execute=false`.
- Watch exposes a reference seam; business-operations #521 owns the observation/routing contract.
- Source `main` is approved truth; meaningful changes use a focused PR and independent review.
  Foundation PR acceptance is still pending. No product release is selected.

Governing references: business-operations #519, #520, #521 and lab issue #1.
Private issue references require authorized access; their private contents are not published here.

## API

| Route | Behavior |
| --- | --- |
| `GET /api/health` | Synthetic-only health and non-execution declaration |
| `GET /api/capabilities` | Six domains, eleven MOCK adapters and upstream Watch ownership |
| `GET /api/fixtures` | Repository-owned fixture index |
| `GET /api/fixtures/:id` | Synthetic modeled source plus normalized readback |
| `POST /api/mock/normalize` | Exact JSON `{ "fixture_id": "tally-discovery" }` selector |

POST rejects extra keys, arbitrary data, URLs, unknown fixtures, non-JSON and bodies over 1 KiB.
There is no public proxy, arbitrary file parser or vendor mutation endpoint.

## Structure

`contracts/` defines the metadata and six domain schemas; `fixtures/synthetic/` contains modeled
provider envelopes; `src/adapters.ts` keeps edge mappings outside contracts. `web/` is the
small review surface, `src/app.ts` the API, and `src/worker.ts` the portable Worker entry.
Static validators are generated at build/development time and drift-checked in CI; runtime
validation does not compile code. `scripts/` and `tests/` produce deterministic evidence.

See [architecture](docs/ARCHITECTURE.md), [provider gates](docs/PROVIDER_GATES.md),
[dependency review](docs/DEPENDENCIES.md), [deployment/rollback](docs/DEPLOYMENT.md),
[validation evidence](docs/VALIDATION.md) and [security](SECURITY.md).
Public visibility grants no selected software license; owner license direction remains pending.
