export type Domain =
  | "discovery"
  | "ingest"
  | "evidence"
  | "watch"
  | "docs"
  | "maps";
export type Json =
  | null
  | boolean
  | number
  | string
  | Json[]
  | { [key: string]: Json };
export interface Fixture {
  fixture_id: string;
  domain: Domain;
  provider: string;
  scenario: string;
  source_record: { [key: string]: Json };
}
export interface LabRecord {
  schema_version: "ldw.lab-record.v1";
  domain: Domain;
  provider: string;
  provider_record_id: string;
  ldw_id: string;
  created_at: string;
  observed_at: string;
  source_ref: string;
  provenance: {
    method: "MOCK_FIXTURE";
    fixture_id: string;
    adapter_revision: "lab-001.v1";
  };
  freshness: { state: "FIXTURE"; as_of: string };
  raw_ref: string;
  normalized_state: "REFERENCE_ONLY";
  status: "NORMALIZED";
  failure: { code: "NONE"; reason: "" };
  idempotency_key: string;
  human_review_required: true;
  data_classification: "SYNTHETIC";
  execute: false;
  data: { [key: string]: Json };
}
