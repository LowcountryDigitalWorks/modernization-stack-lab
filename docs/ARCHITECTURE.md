# Architecture and ownership

## Lab invariant

Repository-owned synthetic fixture -> modeled edge adapter -> provider-neutral record ->
JSON Schema/timestamp validation -> deterministic readback/replay -> human review.

No durable state exists. Fixtures, generated validators and source are immutable deployment
inputs. Provider systems and owning GitHub workstreams remain authoritative.

## Live ownership reconciliation — 2026-10-06 America/New_York

Checked the organization's fifteen repositories, their purpose summaries, private #519/#520,
the organization public standards/checklists and the private owning agent/security/handoff
instructions. WQT/G.A.S. own sensing/evidence engines; document-control/secure-exchange are
separate products; existing security/trading/cruise labs have different purposes. No repository
owned this exact cross-component reference lab. Owner bootstrap authorizes this new PUBLIC
repository and one LAB-001 implementation issue.

Live #519 introduced #521 WATCH-EVENT-001 before foundation work. Its candidate PR #523
owns the provider-neutral observation validator/dedupe/routing implementation in
business-operations. This lab deliberately exposes `DEFER_TO_WATCH_EVENT_001` and an upstream
reference rather than implementing another router. Once independently accepted, a bounded
adapter can consume that public-safe contract under the owning workstream's gates.
No private implementation or governance document is copied into this repository.

## Contracts

Common metadata: schema version; provider/source record; deterministic LDW identity;
created/observed time; source/provenance/raw fixture reference; freshness; normalized/status/
failure state; replay key; human-review flag; synthetic classification; non-execution.
Each domain has a closed schema and a domain-specific provider allowlist.

| Domain | Provider-neutral data | Boundary |
| --- | --- | --- |
| Discovery | Question, answer, KNOWN/UNKNOWN/NOT_SURE, fixed/adaptive source kind, follow-up reason, provenance, guard result, stopping state, field mapping | No adaptive engine; human qualification mandatory |
| Ingest | Input/media classification, extraction adapter, fields/tables/confidence, source location/provenance, validation, destination candidate | Interfaces/fixtures only; no OCR or heavyweight parser |
| Evidence | Finding, independent fixture reference/verifier, confidence, explanation, why it matters, action/CTA, verification/recheck | No copied vendor UI or revenue-loss claims |
| Watch | Source, observation/change/importance, dedupe reference, owner-reasoning flag, upstream routing recommendation | #521 remains canonical; no schedule, queue or writer |
| Docs | Document/provider identity, all ten requested lifecycle event states, evidence time, synthetic recipients, audit/readback, external-action candidate | Human approval always required; no send/sign execution |
| Maps | Topics/relationships/source, provider identity/revision, portable export format/readback | Minimal JSON shape; Markdown/OPML vocabulary is future capability, not implemented serializer |

Reference URLs currently accept only `synthetic://` and `fixture://` so the foundation cannot
silently admit real evidence. A future safe-public-reference extension needs reviewed schema
and provider proof, not arbitrary URL ingestion. Fixture freshness is explicitly FIXTURE,
never an assertion of fresh provider data. Failure metadata in successful records is NONE;
API failures use bounded error codes without logging input or serializing exception contents.

## Identity and replay

SHA-256 over canonical provider/domain/source-record/revision/data gives the LDW identity.
Provider/domain/source-record/revision gives the replay key. Unmapped provider envelope noise
is excluded. Exact identical readback is DUPLICATE. Reusing a key with changed normalized
content or metadata is CONFLICT. A new source revision is NEW. Timestamp coherence is checked.
`compareReplay` is a pure caller-supplied evidence comparison, not a persisted dedupe service.
Conflicts confer no action authority. No identity is a credential or authorization token.

## Runtime and portability

Hono supplies a single Fetch boundary and bounded HTTP routing. Node adapts local HTTP without
a server package; Cloudflare adapts the same Fetch API plus static ASSETS. JSON Schemas are
compiled by Ajv during generation, bundled into committed static validators, drift-checked
and then consumed without `eval`/`new Function` at runtime. The built Worker smoke disables
Function and outbound Fetch. That local smoke does not establish deployed-platform behavior.

## Security and cost

POST accepts only exact known fixture identifiers. All responses use restrictive headers.
UI uses DOM text/value assignment rather than HTML injection. No provider creds, runtime
network client, persistence, auth, analytics, model CI call or external action exists.
No incremental infrastructure/API cash spend. GitHub public CI and existing included local
execution only; no paid capacity or customer/production state changes.
