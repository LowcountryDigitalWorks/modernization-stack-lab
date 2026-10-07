import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { resolve } from "node:path";
import { app } from "./app.ts";

const files: Record<string, [string, string]> = {
  "/": ["dist/web/index.html", "text/html; charset=utf-8"],
  "/styles.css": ["dist/web/styles.css", "text/css; charset=utf-8"],
  "/app.js": ["dist/web/app.js", "text/javascript; charset=utf-8"],
};
const port = Number(process.env.PORT ?? 4173);
export const server = createServer(async (incoming, outgoing) => {
  const url = new URL(incoming.url ?? "/", "http://127.0.0.1");
  try {
    const file = files[url.pathname];
    if (file && incoming.method === "GET") {
      const content = await readFile(resolve(file[0]));
      outgoing.writeHead(200, {
        "Content-Type": file[1],
        "Content-Security-Policy":
          "default-src 'none'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'",
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "no-referrer",
        "Cache-Control": "no-store",
      });
      outgoing.end(content);
      return;
    }
    const chunks: Buffer[] = [];
    let length = 0;
    for await (const chunk of incoming) {
      const buffer = Buffer.from(chunk);
      length += buffer.length;
      if (length > 1024) {
        outgoing.writeHead(413);
        outgoing.end('{"error":"PAYLOAD_TOO_LARGE"}');
        return;
      }
      chunks.push(buffer);
    }
    const method = incoming.method ?? "GET";
    const headers = new Headers();
    for (const [name, value] of Object.entries(incoming.headers))
      if (typeof value === "string") headers.set(name, value);
    const response = await app.fetch(
      new Request(url, {
        method,
        headers,
        ...(method === "GET" || method === "HEAD"
          ? {}
          : { body: Buffer.concat(chunks) }),
      }),
    );
    outgoing.writeHead(response.status, Object.fromEntries(response.headers));
    outgoing.end(Buffer.from(await response.arrayBuffer()));
  } catch {
    outgoing.writeHead(500);
    outgoing.end('{"error":"LOCAL_SERVER_ERROR"}');
  }
});
server.listen(port, "127.0.0.1", () =>
  console.log(`Synthetic lab: http://127.0.0.1:${port}`),
);
