import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { adapters, normalizeFixture } from "./adapters.ts";
import { fixtureIds, getFixture, listFixtures } from "./fixtures.ts";

export const app = new Hono();
app.use("*", async (context, next) => {
  await next();
  context.header(
    "Content-Security-Policy",
    "default-src 'none'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'",
  );
  context.header("X-Content-Type-Options", "nosniff");
  context.header("Referrer-Policy", "no-referrer");
  context.header("Cache-Control", "no-store");
});
app.get("/api/health", (context) =>
  context.json({ status: "ok", lab: "synthetic-only", execute: false }),
);
app.get("/api/capabilities", (context) =>
  context.json({
    schema_version: "ldw.lab-record.v1",
    domains: ["discovery", "ingest", "evidence", "watch", "docs", "maps"],
    adapters,
    adapter_status_vocabulary: [
      "MOCK",
      "CONNECTABLE",
      "LIVE",
      "PROOF PENDING",
      "PROVEN",
      "HOLD",
    ],
    watch_authority: "business-operations#521",
    fixtures: fixtureIds.length,
    vendor_network: false,
    vendor_mutation: false,
    deployment: "OWNER_GATE",
  }),
);
app.get("/api/fixtures", (context) => context.json(listFixtures()));
app.get("/api/fixtures/:id", async (context) => {
  const fixture = getFixture(context.req.param("id"));
  if (!fixture) return context.json({ error: "UNKNOWN_FIXTURE" }, 404);
  return context.json({ fixture, normalized: await normalizeFixture(fixture) });
});
app.use(
  "/api/mock/normalize",
  bodyLimit({
    maxSize: 1024,
    onError: (context) => context.json({ error: "PAYLOAD_TOO_LARGE" }, 413),
  }),
);
app.post("/api/mock/normalize", async (context) => {
  if (
    context.req.header("content-type")?.split(";")[0]?.trim() !==
    "application/json"
  )
    return context.json({ error: "JSON_REQUIRED" }, 415);
  let selector: unknown;
  try {
    selector = await context.req.json();
  } catch {
    return context.json({ error: "INVALID_JSON" }, 400);
  }
  if (
    !selector ||
    typeof selector !== "object" ||
    Array.isArray(selector) ||
    Object.keys(selector).length !== 1 ||
    !("fixture_id" in selector) ||
    typeof selector.fixture_id !== "string"
  )
    return context.json({ error: "FIXTURE_SELECTOR_ONLY" }, 400);
  const fixture = getFixture(selector.fixture_id);
  if (!fixture) return context.json({ error: "UNKNOWN_FIXTURE" }, 404);
  return context.json({
    normalized: await normalizeFixture(fixture),
    proof_class: "SYNTHETIC_ONLY",
    execute: false,
  });
});
app.notFound((context) => context.json({ error: "NOT_FOUND" }, 404));
app.onError((_error, context) =>
  context.json({ error: "LAB_CONTRACT_ERROR" }, 500),
);
