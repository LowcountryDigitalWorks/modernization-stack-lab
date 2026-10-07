# Agent contract — modernization-stack-lab

This public repository is a synthetic-only reference lab owned by Lowcountry Digital Works.
Read README.md, SECURITY.md, docs/ARCHITECTURE.md and docs/PROVIDER_GATES.md before changing code.
Live repository state overrides handoffs. Use a focused branch and PR; do not merge without
independent exact-head review and owning-workstream acceptance.

No customer/private/regulated data, credentials, real vendor calls or writes, purchases,
model API, database, authentication, analytics, scheduler, queue, production domain or DNS.
POST normalization accepts only repository-owned fixture identifiers. Do not broaden it into
arbitrary payload ingestion or a vendor proxy. Never log request bodies.
Watch normalization/routing belongs to business-operations #521; preserve its ownership.
Do not copy private operating documents into this public repository.

Required checks: npm ci, npm run validate, npm run browser:smoke, npm run audit:runtime,
npm run audit:all. Browser installation is test tooling, not a runtime dependency.
All tests use local synthetic fixtures and forbid external network access.
Deployments and credentials require the gates in docs/PROVIDER_GATES.md and docs/DEPLOYMENT.md.
No license grant is selected; do not add one without owner direction.
