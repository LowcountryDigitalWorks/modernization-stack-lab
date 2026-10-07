import type { Domain, Fixture, Json, LabRecord } from "./contracts.ts";
import { validateRecord } from "./validate.ts";

interface Adapter {
  provider: string;
  domain: Domain;
  payload_key: string;
  status: "MOCK";
  provider_proof: "PENDING";
}
export const adapters: readonly Adapter[] = [
  {
    provider: "google-forms",
    domain: "discovery",
    payload_key: "responses",
    status: "MOCK",
    provider_proof: "PENDING",
  },
  {
    provider: "tally",
    domain: "discovery",
    payload_key: "answers",
    status: "MOCK",
    provider_proof: "PENDING",
  },
  {
    provider: "dashform",
    domain: "discovery",
    payload_key: "interview",
    status: "MOCK",
    provider_proof: "PENDING",
  },
  {
    provider: "plutusdoc",
    domain: "docs",
    payload_key: "document",
    status: "MOCK",
    provider_proof: "PENDING",
  },
  {
    provider: "suitedash",
    domain: "docs",
    payload_key: "document",
    status: "MOCK",
    provider_proof: "PENDING",
  },
  {
    provider: "follow-it",
    domain: "watch",
    payload_key: "item",
    status: "MOCK",
    provider_proof: "PENDING",
  },
  {
    provider: "sellseo-reference",
    domain: "evidence",
    payload_key: "finding",
    status: "MOCK",
    provider_proof: "PENDING",
  },
  {
    provider: "wqt",
    domain: "evidence",
    payload_key: "finding",
    status: "MOCK",
    provider_proof: "PENDING",
  },
  {
    provider: "gas",
    domain: "evidence",
    payload_key: "finding",
    status: "MOCK",
    provider_proof: "PENDING",
  },
  {
    provider: "atlas",
    domain: "maps",
    payload_key: "map",
    status: "MOCK",
    provider_proof: "PENDING",
  },
  {
    provider: "oss-ingest",
    domain: "ingest",
    payload_key: "extraction",
    status: "MOCK",
    provider_proof: "PENDING",
  },
];

export function canonical(value: Json): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  return `{${Object.keys(value)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${canonical(value[key] ?? null)}`)
    .join(",")}}`;
}
async function digest(value: Json): Promise<string> {
  const bytes = new TextEncoder().encode(canonical(value));
  const hash = new Uint8Array(await crypto.subtle.digest("SHA-256", bytes));
  return Array.from(hash, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}
function requiredText(value: Json | undefined): string {
  if (
    typeof value !== "string" ||
    (!value.startsWith("synthetic-") && !/^\d{4}-/.test(value))
  )
    throw new Error("Invalid synthetic source metadata");
  return value;
}

// This seam maps modeled fixture envelopes; it does not claim vendor API compatibility.
export async function normalizeFixture(fixture: Fixture): Promise<LabRecord> {
  const adapter = adapters.find(
    (candidate) =>
      candidate.provider === fixture.provider &&
      candidate.domain === fixture.domain,
  );
  if (!adapter) throw new Error("Unsupported adapter");
  if (!/^[a-z0-9-]+$/.test(fixture.fixture_id))
    throw new Error("Invalid fixture identifier");
  const source = fixture.source_record;
  const payload = source[adapter.payload_key];
  if (!payload || typeof payload !== "object" || Array.isArray(payload))
    throw new Error("Invalid modeled provider payload");
  const providerId = requiredText(source.id);
  const createdAt = requiredText(source.created_at);
  const observedAt = requiredText(source.observed_at);
  const revision = requiredText(source.revision);
  const data = structuredClone(payload);
  const identity = {
    domain: fixture.domain,
    provider: fixture.provider,
    record: providerId,
    revision,
  };
  const record: LabRecord = {
    schema_version: "ldw.lab-record.v1",
    domain: fixture.domain,
    provider: fixture.provider,
    provider_record_id: providerId,
    ldw_id: `ldw_${await digest({ ...identity, data })}`,
    created_at: createdAt,
    observed_at: observedAt,
    source_ref: `synthetic://${fixture.provider}/${providerId}`,
    provenance: {
      method: "MOCK_FIXTURE",
      fixture_id: fixture.fixture_id,
      adapter_revision: "lab-001.v1",
    },
    freshness: { state: "FIXTURE", as_of: observedAt },
    raw_ref: `fixture://${fixture.fixture_id}`,
    normalized_state: "REFERENCE_ONLY",
    status: "NORMALIZED",
    failure: { code: "NONE", reason: "" },
    idempotency_key: `replay_${await digest(identity)}`,
    human_review_required: true,
    data_classification: "SYNTHETIC",
    execute: false,
    data,
  };
  if (!validateRecord(record).valid)
    throw new Error("Normalized contract rejected");
  return record;
}

// Stateless classification against caller-supplied prior lab evidence; no durable ledger.
export function compareReplay(
  current: LabRecord,
  previous: LabRecord,
): "DUPLICATE" | "NEW" | "CONFLICT" {
  if (current.idempotency_key !== previous.idempotency_key) return "NEW";
  return canonical(current as unknown as Json) ===
    canonical(previous as unknown as Json)
    ? "DUPLICATE"
    : "CONFLICT";
}

export const documentStates = [
  "DRAFT",
  "READY_FOR_APPROVAL",
  "APPROVED",
  "SENT",
  "VIEWED",
  "SIGNED_PARTIAL",
  "COMPLETED",
  "DECLINED",
  "VOIDED",
  "FAILED",
] as const;
// Readback acceptance of lifecycle names creates no transition/send/sign authority.
