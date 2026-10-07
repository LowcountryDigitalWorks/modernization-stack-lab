import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import Ajv2020 from "ajv/dist/2020.js";
import standaloneCode from "ajv/dist/standalone/index.js";
import { build } from "esbuild";

const ajv = new Ajv2020({
  strict: true,
  allErrors: true,
  ownProperties: true,
  code: { source: true },
});
const domains = ["discovery", "ingest", "evidence", "watch", "docs", "maps"];
const exports = {};
for (const domain of domains) {
  const schema = JSON.parse(
    await readFile(`contracts/${domain}.schema.json`, "utf8"),
  );
  ajv.addSchema(schema);
  exports[domain] = schema.$id;
}
await mkdir("work", { recursive: true });
await writeFile("work/validators.cjs", standaloneCode(ajv, exports));
const result = await build({
  entryPoints: ["work/validators.cjs"],
  bundle: true,
  format: "esm",
  platform: "browser",
  target: "es2023",
  minify: true,
  write: false,
});
const output = `// Generated from JSON Schema 2020-12. Run npm run schema:generate. No runtime eval.\n${result.outputFiles[0].text}`;
const destination = "src/generated-validators.js";
if (process.argv.includes("--check")) {
  const committed = await readFile(destination, "utf8");
  if (committed !== output)
    throw new Error(
      "Generated schema validators differ; regenerate and review",
    );
  console.log(
    `Static schema validator drift check PASS: ${createHash("sha256").update(output).digest("hex")}`,
  );
} else {
  await writeFile(destination, output);
  console.log("Static no-eval schema validators generated.");
}
