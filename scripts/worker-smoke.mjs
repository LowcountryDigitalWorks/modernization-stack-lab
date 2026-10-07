import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

// Exercise the actual built artifact with runtime dynamic compilation and network denied.
globalThis.Function = new Proxy(globalThis.Function, {
  apply() {
    throw new Error("Runtime dynamic compilation prohibited");
  },
  construct() {
    throw new Error("Runtime dynamic compilation prohibited");
  },
});
globalThis.fetch = async () => {
  throw new Error("Outbound network prohibited in Worker smoke");
};
const { default: worker } = await import("../dist/worker.js");
const env = {
  ASSETS: {
    fetch: async () =>
      new Response(await readFile("dist/web/index.html"), {
        headers: { "Content-Type": "text/html" },
      }),
  },
};
const health = await worker.fetch(
  new Request("https://synthetic.example.invalid/api/health"),
  env,
);
assert.equal(health.status, 200);
assert.equal((await health.json()).execute, false);
const normalized = await worker.fetch(
  new Request("https://synthetic.example.invalid/api/mock/normalize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: '{"fixture_id":"plutusdoc-approval"}',
  }),
  env,
);
assert.equal(normalized.status, 200);
assert.equal(
  (await normalized.json()).normalized.data.human_approval_required,
  true,
);
const asset = await worker.fetch(
  new Request("https://synthetic.example.invalid/"),
  env,
);
assert.match(await asset.text(), /Modernization Stack/);
assert.match(
  asset.headers.get("Content-Security-Policy"),
  /default-src 'none'/,
);
console.log(
  "Built Worker API/assets smoke PASS with dynamic Function and outbound Fetch denied; hosting runtime remains unverified.",
);
