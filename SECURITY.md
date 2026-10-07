# Security and data boundary

Report suspected vulnerabilities privately through the owning LDW security contact or
GitHub private vulnerability reporting when available. Do not open public issues containing
credentials or private data. Organization SECURITY.md supplies the reporting contact.

This is a public, synthetic-only lab. No request payload is persisted or logged. The POST
API accepts an exact fixture selector, not arbitrary vendor objects, files, URLs or prose.
There is no credential loader, vendor client, outbound fetch, database, telemetry or auth.
Responses have a restrictive CSP, nosniff, no-referrer and no-store headers.
All external UI links are authoritative references; the app does not fetch them.
Fixtures use reserved example.invalid addresses and synthetic:// references.

Dependency and source scans are independent controls, not a proof that arbitrary data is
safe. Schema rejection prevents extra input fields; synthetic selectors are the primary
data boundary. Future live adapters require separately approved placement/scopes/readback.
No even-test secret belongs in Git, examples, issue text or CI output.
