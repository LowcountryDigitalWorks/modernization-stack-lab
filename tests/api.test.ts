import assert from "node:assert/strict";
import { test } from "node:test";
import { app } from "../src/app.ts";
import { fixtureIds } from "../src/fixtures.ts";

// Any accidental runtime outbound Fetch in API/core tests fails, instead of contacting vendors.
globalThis.fetch = async () => {
  throw new Error("Outbound network prohibited in tests");
};
test("health/capabilities and security headers", async () => {
  const response = await app.request("/api/health");
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    status: "ok",
    lab: "synthetic-only",
    execute: false,
  });
  assert.match(
    response.headers.get("content-security-policy") ?? "",
    /default-src 'none'/,
  );
  assert.equal(response.headers.get("cache-control"), "no-store");
  const capabilities = await (await app.request("/api/capabilities")).json();
  assert.equal(capabilities.vendor_network, false);
  assert.equal(capabilities.watch_authority, "business-operations#521");
});
test("all API fixtures read back and replay deterministically", async () => {
  const fixtures = await (await app.request("/api/fixtures")).json();
  assert.equal(fixtures.length, 11);
  for (const id of fixtureIds) {
    const readback = await (await app.request(`/api/fixtures/${id}`)).json();
    const normalize = () =>
      app.request("/api/mock/normalize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fixture_id: id }),
      });
    const first = await normalize();
    const second = await normalize();
    assert.equal(first.status, 200);
    const firstBody = await first.json();
    assert.deepEqual(firstBody, await second.json());
    assert.deepEqual(firstBody.normalized, readback.normalized);
  }
});
test("POST rejects arbitrary, mixed, malformed and oversized payloads", async () => {
  const send = (body: string, type = "application/json") =>
    app.request("/api/mock/normalize", {
      method: "POST",
      headers: { "Content-Type": type },
      body,
    });
  assert.equal(
    (await send('{"fixture_id":"tally-discovery","customer":"not-allowed"}'))
      .status,
    400,
  );
  assert.equal((await send('{"url":"https://example.invalid"}')).status, 400);
  assert.equal((await send("[]")).status, 400);
  assert.equal((await send("null")).status, 400);
  assert.equal((await send("{broken")).status, 400);
  assert.equal((await send("{}", "text/plain")).status, 415);
  assert.equal((await send('{"fixture_id":"unknown"}')).status, 404);
  assert.equal((await send("x".repeat(1025))).status, 413);
  assert.equal((await app.request("/api/fixtures/unknown")).status, 404);
  assert.equal((await app.request("/api/vendor/proxy")).status, 404);
});
