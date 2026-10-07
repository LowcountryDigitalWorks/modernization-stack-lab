# Deployment-ready candidate; hosting gate remains closed

CURRENT: No lab deployment, URL, Worker resource, DNS change, custom domain, provider secret
or cloud credential is created. Existing historical LDW Cloudflare proof tooling does not
automatically authorize a new resource. No existing local Wrangler command or direct
Cloudflare deployment connector was available in this session. Do not repurpose retired
proof resources or the production website's pipeline/account bindings.

PROPOSED: After acceptance and owner verification of an already-approved Cloudflare Free
deployment path, use the same tested `dist/worker.js` and `dist/web/` artifacts with the
checked-in wrangler.jsonc. `workers.dev` only; no route/custom domain/DNS, DB, auth, analytics,
observability log collection or paid service. No account identifier is committed.
Use a deployment CLI only through accepted tooling/version and approved existing auth.
The JSONC file is a candidate config; its Wrangler schema reference requires that future
tooling. Do not run automatic `npx wrangler` installation/login or `wrangler deploy` now.

Exact build/readiness commands:

```sh
npm ci
npm run validate
npx playwright install chromium
npm run browser:smoke
npm run audit:runtime
npm run audit:all
```

After the auth/resource gate, the owning deployment workstream can execute its approved
equivalent of `wrangler deploy --config wrangler.jsonc` using a minimum single-Worker
deployment scope. Confirm account/free plan, overage posture, Worker name/resource ownership,
synthetic-only artifact, no production bindings and no new/broad token before execution.
That is a future instruction, not current authority.

Validate actual endpoint health/capabilities/fixture selector, UI security headers, desktop/
mobile/axe and exact replays. Record deployment version, source commit/tree, artifact digest,
runtime schema behavior and URL. Node Fetch/Function-denial smoke is not hosted-platform proof.

ROLLBACK: Before any approved deployment record the prior version/resource state. A new
disposable lab resource should be retired/deleted under the same owner's authorization;
an existing lab resource can revert to its recorded prior deployment version. Source rollback
uses a reviewed revert PR. Do not change the website, shared services, DNS or unrelated resources.

Acceptance gate is review/merge before lab hosting. Branch protection and any additional
organization app/security settings are owner-admin follow-ups; this bootstrap does not
change repository rulesets, Actions secrets, billing or app installations.
