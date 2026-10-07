import assert from "node:assert/strict";
import { test } from "node:test";
import {
  adapters,
  canonical,
  compareReplay,
  documentStates,
  normalizeFixture,
} from "../src/adapters.ts";
import type { Json } from "../src/contracts.ts";
import { fixtureIds, getFixture } from "../src/fixtures.ts";
import { validateRecord } from "../src/validate.ts";

function fixture(id: string) {
  const result = getFixture(id);
  assert.ok(result);
  return result;
}
for (const id of fixtureIds) {
  test(`2020-12 contract and deterministic replay: ${id}`, async () => {
    const first = await normalizeFixture(fixture(id));
    const second = await normalizeFixture(fixture(id));
    assert.deepEqual(first, second);
    assert.equal(validateRecord(first).valid, true);
    assert.equal(compareReplay(first, second), "DUPLICATE");
    assert.equal(first.execute, false);
    assert.equal(first.human_review_required, true);
    assert.equal(first.data_classification, "SYNTHETIC");
  });
}
test("canonical identity ignores provider envelope noise and property ordering", async () => {
  const source = fixture("forms-discovery");
  const first = await normalizeFixture(source);
  source.source_record.irrelevant_vendor_metadata = "ignored synthetic noise";
  assert.deepEqual(await normalizeFixture(source), first);
  assert.equal(canonical({ z: 1, a: 2 }), '{"a":2,"z":1}');
});
test("conflicting reuse fails classification; changed source revision has new identity", async () => {
  const source = fixture("tally-discovery");
  const first = await normalizeFixture(source);
  const answers = source.source_record.answers as Record<string, Json>;
  answers.answer = "Synthetic changed outcome";
  const conflict = await normalizeFixture(source);
  assert.notEqual(first.ldw_id, conflict.ldw_id);
  assert.equal(compareReplay(conflict, first), "CONFLICT");
  source.source_record.revision = "synthetic-revision-002";
  assert.equal(compareReplay(await normalizeFixture(source), first), "NEW");
});
test("reject unknown schemas, extra fields, bad confidence, impossible dates and execute authority", async () => {
  const record = await normalizeFixture(fixture("sellseo-evidence"));
  for (const changed of [
    { ...record, schema_version: "unknown" },
    { ...record, credential: "synthetic disallowed field" },
    { ...record, execute: true },
    { ...record, human_review_required: false },
    { ...record, data: { ...record.data, confidence: 1.1 } },
    { ...record, data: { ...record.data, revenue_loss: 1000 } },
    { ...record, observed_at: "2026-02-30T12:00:00Z" },
    { ...record, observed_at: "2026-10-05T12:00:00Z" },
    { ...record, data_classification: "CUSTOMER" },
  ])
    assert.equal(validateRecord(changed).valid, false);
  assert.equal(validateRecord({ domain: "toString" }).valid, false);
});
test("provider/domain adapter pairing is bounded", async () => {
  const source = fixture("forms-discovery");
  source.provider = "unknown";
  await assert.rejects(normalizeFixture(source), /Unsupported adapter/);
  source.provider = "atlas";
  await assert.rejects(normalizeFixture(source), /Unsupported adapter/);
  assert.equal(adapters.length, 11);
});
test("discovery retains not-sure/unknown and does not generate adaptive interviews", async () => {
  const fixed = await normalizeFixture(fixture("forms-discovery"));
  const adaptive = await normalizeFixture(fixture("dashform-discovery"));
  assert.equal(fixed.data.answer_state, "NOT_SURE");
  assert.equal(adaptive.data.answer_state, "UNKNOWN");
  assert.equal(adaptive.data.question_kind, "ADAPTIVE_FOLLOW_UP");
  assert.equal(adaptive.data.human_qualification_required, true);
});
test("all document readback states retain human approval and cannot execute send/sign", async () => {
  for (const state of documentStates) {
    const source = fixture("plutusdoc-approval");
    const data = source.source_record.document as Record<string, Json>;
    data.lifecycle_event = state;
    const result = await normalizeFixture(source);
    assert.equal(result.data.lifecycle_event, state);
    assert.equal(result.data.human_approval_required, true);
    assert.equal(result.data.execute, false);
    data.human_approval_required = false;
    await assert.rejects(normalizeFixture(source), /contract rejected/);
  }
});
test("Watch remains upstream-owned, classification-only, with no routing executor", async () => {
  const record = await normalizeFixture(fixture("follow-it-observation"));
  assert.equal(record.data.upstream_contract_ref, "business-operations#521");
  assert.equal(record.data.routing_recommendation, "DEFER_TO_WATCH_EVENT_001");
  assert.equal(record.data.execute, false);
  assert.equal(
    validateRecord({
      ...record,
      data: { ...record.data, command: "synthetic-disallowed-command" },
    }).valid,
    false,
  );
});
test("ingest retains source provenance, tables and human validation", async () => {
  const record = await normalizeFixture(fixture("oss-ingest-document"));
  assert.equal(record.data.validation_required, true);
  assert.deepEqual((record.data.tables as Json[])[0], {
    name: "Synthetic effort",
    columns: ["task", "units"],
    rows: [["Fixture review", "1"]],
  });
});
