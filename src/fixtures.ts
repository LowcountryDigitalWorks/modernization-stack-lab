import atlas from "../fixtures/synthetic/atlas-map.json" with { type: "json" };
import dashform from "../fixtures/synthetic/dashform-discovery.json" with {
  type: "json",
};
import followIt from "../fixtures/synthetic/follow-it-observation.json" with {
  type: "json",
};
import forms from "../fixtures/synthetic/forms-discovery.json" with {
  type: "json",
};
import gas from "../fixtures/synthetic/gas-evidence.json" with { type: "json" };
import ingest from "../fixtures/synthetic/oss-ingest-document.json" with {
  type: "json",
};
import plutusdoc from "../fixtures/synthetic/plutusdoc-approval.json" with {
  type: "json",
};
import sellseo from "../fixtures/synthetic/sellseo-evidence.json" with {
  type: "json",
};
import suitedash from "../fixtures/synthetic/suitedash-draft.json" with {
  type: "json",
};
import tally from "../fixtures/synthetic/tally-discovery.json" with {
  type: "json",
};
import wqt from "../fixtures/synthetic/wqt-evidence.json" with { type: "json" };
import type { Fixture } from "./contracts.ts";

// The type boundary is checked against strict normalized schemas in validation/tests.
const fixtures = [
  forms,
  tally,
  dashform,
  plutusdoc,
  suitedash,
  followIt,
  sellseo,
  wqt,
  gas,
  atlas,
  ingest,
] as Fixture[];
export const fixtureIds = fixtures.map((fixture) => fixture.fixture_id);
export function listFixtures() {
  return fixtures.map(({ fixture_id, domain, provider, scenario }) => ({
    fixture_id,
    domain,
    provider,
    scenario,
  }));
}
export function getFixture(id: string): Fixture | undefined {
  const fixture = fixtures.find((candidate) => candidate.fixture_id === id);
  return fixture ? structuredClone(fixture) : undefined;
}
