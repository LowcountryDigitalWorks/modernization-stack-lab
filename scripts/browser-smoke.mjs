import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import AxeBuilder from "@axe-core/playwright";
import { chromium } from "@playwright/test";

const origin = "http://127.0.0.1:4174";
const child = spawn(process.execPath, ["src/server.ts"], {
  env: { ...process.env, PORT: "4174" },
  stdio: ["ignore", "pipe", "pipe"],
});
let browser;
try {
  await new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error("Local server startup timeout")),
      10000,
    );
    child.once("error", reject);
    child.once("exit", (code) =>
      reject(new Error(`Local server exited: ${code}`)),
    );
    child.stdout.on("data", (data) => {
      if (String(data).includes("Synthetic lab:")) {
        clearTimeout(timer);
        resolve();
      }
    });
  });
  browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 1000 },
  });
  const page = await context.newPage();
  const errors = [];
  const outbound = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.route("**/*", (route) => {
    if (new URL(route.request().url()).origin !== origin) {
      outbound.push(route.request().url());
      return route.abort();
    }
    return route.continue();
  });
  await page.goto(origin);
  await page.getByRole("status").filter({ hasText: "PASS · 11/11" }).waitFor();
  assert.equal(await page.getByRole("heading", { level: 3 }).count(), 6);
  await page.getByLabel("Reference fixture").selectOption("plutusdoc-approval");
  await page
    .getByRole("status")
    .filter({ hasText: "Synthetic readback · plutusdoc-approval" })
    .waitFor();
  const value = JSON.parse(
    await page
      .getByRole("textbox", { name: "Normalized synthetic evidence" })
      .inputValue(),
  );
  assert.equal(value.data.human_approval_required, true);
  assert.equal(value.execute, false);
  const accessibility = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  assert.deepEqual(
    accessibility.violations.map(({ id }) => id),
    [],
  );
  await page.getByRole("button", { name: "Replay synthetic fixtures" }).click();
  await page.getByRole("status").filter({ hasText: "PASS · 11/11" }).waitFor();
  await mkdir("work/evidence", { recursive: true });
  await page.screenshot({
    path: "work/evidence/lab-desktop.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
    true,
  );
  const mobile = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  assert.deepEqual(
    mobile.violations.map(({ id }) => id),
    [],
  );
  await page.screenshot({
    path: "work/evidence/lab-mobile.png",
    fullPage: true,
  });
  await page.keyboard.press("Tab");
  assert.equal(
    await page.evaluate(() => document.activeElement !== document.body),
    true,
  );
  assert.deepEqual(errors, []);
  assert.deepEqual(outbound, []);
  console.log(
    "Browser/API readback/replay PASS; desktop + mobile axe WCAG A/AA smoke: 0 violations; no overflow, page errors or outbound browser requests.",
  );
} finally {
  await browser?.close();
  child.kill();
}
