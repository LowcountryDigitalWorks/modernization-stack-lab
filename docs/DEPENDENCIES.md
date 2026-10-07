# Dependency review — 2026-10-06

Exact versions and transitive integrity are in package-lock.json. Installation uses `npm ci`.
No package install scripts are required for application runtime. Build binaries are test/build
inputs; there is no automatic deployment or provider token in CI.

| Direct package | Role | Measurable purpose |
| --- | --- | --- |
| hono 4.13.13 | Runtime | Thin portable Fetch router and 1 KiB request limit |
| ajv 8.20.0 | Build/test | Strict JSON Schema 2020-12 compilation and static standalone code; compiler absent from Worker runtime |
| typescript 7.0.2 | Build/validation | Strict typecheck across API/core/UI/tests |
| @types/node 24.19.1 | Build/validation | Node 24 server/tests type surfaces |
| esbuild 0.28.2 | Build | Deterministic static-validator and Worker/UI bundling |
| @biomejs/biome 2.5.15 | Validation | Formatting, imports, recommended lint/accessibility rules |
| @playwright/test 1.63.0 | Test | Local Chromium UI/API/replay/mobile smoke |
| @axe-core/playwright 4.13.0 | Test | Desktop/mobile WCAG A/AA accessibility smoke |

`npm run audit:runtime` and `npm run audit:all` both report zero vulnerabilities at local
verification. CI repeats both with HIGH/CRITICAL blocking; no exceptions accepted.
Build/test dependencies are included in the full-tree gate, not dismissed as dev-only.
Audit is time-sensitive and is rechecked by CI, not a permanent security certification.
No actual Docling/Tika/Unstructured/DigiParser/OCR, React, DB, auth, analytics, model SDK or
deployment CLI dependency is adopted. No software license is selected for this LDW repo;
future distribution/adoption licensing decisions remain owner-gated.
