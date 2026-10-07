interface FixtureSummary {
  fixture_id: string;
  domain: string;
  provider: string;
  scenario: string;
}
interface AdapterSummary {
  provider: string;
  domain: string;
  status: string;
  provider_proof: string;
}
function element<T extends HTMLElement>(id: string): T {
  const result = document.getElementById(id);
  if (!result) throw new Error("Missing lab element");
  return result as T;
}
async function json(path: string, init?: RequestInit): Promise<unknown> {
  const response = await fetch(path, init);
  if (!response.ok) throw new Error("Local fixture API failed");
  return response.json();
}
const descriptions: Record<string, string> = {
  discovery: "Question, answer, uncertainty and human qualification.",
  ingest: "Extraction provenance and validation; no OCR or parser engine.",
  evidence: "Verifiable finding, explanation and an action candidate.",
  watch: "Observation seam; routing authority stays with #521.",
  docs: "Lifecycle readback; every external action requires human approval.",
  maps: "Portable topics, relationships and revision readback.",
};
const proof = element("proof-status");
const replay = element<HTMLButtonElement>("replay");
const select = element<HTMLSelectElement>("fixture");
const readback = element<HTMLTextAreaElement>("readback");
const fixtureStatus = element("fixture-status");
let fixtures: FixtureSummary[] = [];
async function runReplay(): Promise<void> {
  replay.disabled = true;
  proof.textContent = "Replaying synthetic fixture contracts…";
  try {
    for (const fixture of fixtures) {
      const first = await json("/api/mock/normalize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fixture_id: fixture.fixture_id }),
      });
      const second = await json("/api/mock/normalize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fixture_id: fixture.fixture_id }),
      });
      if (JSON.stringify(first) !== JSON.stringify(second))
        throw new Error("Replay mismatch");
    }
    proof.textContent = `PASS · ${fixtures.length}/${fixtures.length} synthetic fixture schemas and exact replays · ${new Date().toLocaleTimeString()} this session`;
  } catch {
    proof.textContent =
      "FAIL · Local synthetic replay could not be verified. Inspect the API and tests.";
  } finally {
    replay.disabled = false;
  }
}
select.addEventListener("change", async () => {
  const id = select.value;
  if (!id) {
    readback.value = "No fixture selected.";
    fixtureStatus.textContent =
      "Select a fixture to read the normalized contract.";
    return;
  }
  fixtureStatus.textContent = "Reading local synthetic evidence…";
  try {
    const result = (await json(`/api/fixtures/${encodeURIComponent(id)}`)) as {
      normalized: unknown;
    };
    if (select.value !== id) return;
    readback.value = JSON.stringify(result.normalized, null, 2);
    fixtureStatus.textContent = `Synthetic readback · ${id} · No vendor action`;
  } catch {
    fixtureStatus.textContent = "Local fixture readback failed.";
  }
});
replay.addEventListener("click", () => {
  void runReplay();
});
async function start(): Promise<void> {
  try {
    fixtures = (await json("/api/fixtures")) as FixtureSummary[];
    const capabilities = (await json("/api/capabilities")) as {
      domains: string[];
      adapters: AdapterSummary[];
    };
    for (const domain of capabilities.domains) {
      const article = document.createElement("article");
      article.className = "domain";
      const title = document.createElement("h3");
      title.textContent = domain;
      const description = document.createElement("p");
      description.textContent = descriptions[domain] ?? "Reference contract";
      const list = document.createElement("ul");
      for (const adapter of capabilities.adapters.filter(
        (candidate) => candidate.domain === domain,
      )) {
        const li = document.createElement("li");
        li.append(document.createTextNode(`${adapter.provider} · `));
        const badge = document.createElement("span");
        badge.className = "badge";
        badge.textContent = `${adapter.status} / proof ${adapter.provider_proof}`;
        li.append(badge);
        list.append(li);
      }
      article.append(title, description, list);
      element("domains").append(article);
    }
    for (const fixture of fixtures) {
      const option = document.createElement("option");
      option.value = fixture.fixture_id;
      option.textContent = `${fixture.domain} / ${fixture.provider} / ${fixture.fixture_id}`;
      select.append(option);
    }
    await runReplay();
  } catch {
    proof.textContent =
      "FAIL · Local lab API unavailable. Build and start the lab first.";
  }
}
void start();
