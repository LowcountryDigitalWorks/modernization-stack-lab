import type { Domain } from "./contracts.ts";
import validators from "./generated-validators.js";

function validTimestamp(value: unknown): boolean {
  return (
    typeof value === "string" &&
    Number.isFinite(Date.parse(value)) &&
    new Date(value).toISOString().replace(".000", "") === value
  );
}
export function validateRecord(value: unknown): {
  valid: boolean;
  reason: string;
} {
  if (
    !value ||
    typeof value !== "object" ||
    !("domain" in value) ||
    typeof value.domain !== "string" ||
    !Object.hasOwn(validators, value.domain)
  )
    return { valid: false, reason: "Unknown domain" };
  const validator = validators[value.domain as Domain];
  if (!validator(value))
    return { valid: false, reason: "JSON Schema rejected record" };
  const record = value as unknown as {
    created_at: string;
    observed_at: string;
    freshness: { as_of: string };
    data: { evidence_timestamp?: string };
  };
  if (
    ![
      record.created_at,
      record.observed_at,
      record.freshness.as_of,
      ...(record.data.evidence_timestamp
        ? [record.data.evidence_timestamp]
        : []),
    ].every(validTimestamp)
  )
    return { valid: false, reason: "Invalid evidence timestamp" };
  if (
    record.observed_at < record.created_at ||
    record.freshness.as_of !== record.observed_at
  )
    return { valid: false, reason: "Incoherent evidence timestamps" };
  return {
    valid: true,
    reason: "JSON Schema 2020-12 + timestamp checks passed",
  };
}
