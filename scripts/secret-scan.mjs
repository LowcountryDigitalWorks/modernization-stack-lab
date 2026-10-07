import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

// Offline defense in depth. Does not print matches or replace owner data classification.
const patterns = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /\bgh[pousr]_[A-Za-z0-9]{30,}\b/,
  /\bgithub_pat_[A-Za-z0-9_]{40,}\b/,
  /\bAKIA[A-Z0-9]{16}\b/,
  /\bsk-(?:proj-)?[A-Za-z0-9_-]{30,}\b/,
  /(?:api[_-]?key|client[_-]?secret|password|access[_-]?token)\s*[:=]\s*["'][^"'\s]{12,}["']/i,
];
const excluded = new Set([
  ".git",
  "node_modules",
  "dist",
  "work",
  ".wrangler",
  "test-results",
  "playwright-report",
]);
let checked = 0;
async function scan(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (excluded.has(entry.name)) continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await scan(path);
    else {
      const text = await readFile(path, "utf8");
      checked++;
      if (patterns.some((pattern) => pattern.test(text)))
        throw new Error(
          `Potential credential material: ${path}; content suppressed`,
        );
    }
  }
}
await scan(".");
console.log(
  `Offline credential-pattern scan PASS: ${checked} source files. Pattern coverage is bounded.`,
);
