# Provider proof gates

CURRENT: All eleven adapters MOCK; provider proof PENDING. Modeled fixture envelope names
are independent examples and do not claim current vendor request/response compatibility.
Status vocabulary: MOCK, CONNECTABLE, LIVE, PROOF PENDING, PROVEN, HOLD. Promotion requires
independently verified evidence; a synthetic PASS does not promote a provider.

PROPOSED: After owning account/authorization gates, add one sanitized readback/import proof
at a time with an exact comparator and cost/entitlement evidence. No provider receives core
authority. Prefer approved connector -> safe MCP -> documented API/webhook -> deterministic
export/import. A file export may avoid creating any credential at all.

ROLLBACK: Remove/disable the adapter candidate and restore MOCK fixture behavior. Revoke only
through the owner's separately approved provider/security process; this lab does not mutate
accounts, revoke creds or change provider systems.

## Required scopes and safe placement

| Provider / reference | Next proof and gate | Credential type/scope if later required |
| --- | --- | --- |
| Google Forms | Compare an approved synthetic PREENGAGE-style export with fixed-form semantics; preserve accepted #477/#516 method | Prefer owner-exported synthetic JSON/CSV; if automated later, approved read-only Form/Sheet OAuth in provider/approved connector store |
| Tally | Synthetic fixed-form readback comparator after publish/Sheets authorization | Existing approved connector or minimum read-only form/result API/OAuth scope; no paid tier inferred |
| Dashform | Fixed-vs-adaptive question provenance, uncertainty, stop-state and human-quality comparison after owner activation | Vendor's documented minimum synthetic readback API/MCP/OAuth scope; actual scope to verify after gate |
| PlutusDoc | Synthetic draft/approval/status readback and duplicate event comparison after owner activation; external send/sign separately owner-approved | Vendor documented read-only document/event API/OAuth scope; separate narrowly scoped mutation credential only after explicit send/sign authorization |
| SuiteDash | Synthetic lifecycle-export comparator against PlutusDoc, no replacement decision | Prefer synthetic export; approved read-only document API/connector capability if actually needed |
| follow.it | Compare feed/noise/change observations through accepted #521 after owner account gate | Public synthetic RSS where permitted; otherwise documented minimum feed/read scope in approved connector store; no new scheduler/webhook created |
| SellSEO reference | Human-reviewed evidence/CTA comprehension comparator, not code/UI reproduction | Prefer sanitized synthetic/public-safe report export; no account/API entitlement assumed |
| WQT | Consume an independently accepted sanitized evidence artifact via a reviewed adapter | None for local approved synthetic artifact; live scanning remains WQT-owned and target-authorized |
| G.A.S. | Consume accepted sanitized observation evidence; no new scoring or evidence store | None for local approved synthetic artifact; service/auth belongs to G.A.S. |
| Atlas Red | Synthetic map export/readback/revision comparison after existing-account/LTD upgrade gate | Approved read/export connector scope; API/OAuth only if documented and required; no map engine |
| OSS ingest | Compare one synthetic file with a maintained parser through CLI/file boundary after adoption evidence | No credential for local OSS; native document-AI integration requires separately approved scopes/cost/data class |

Never request passwords, MFA/recovery, AppSumo login, API/OAuth/client/webhook secrets or
tokens in this chat/repo/issues. Future provider runtime secrets belong only in an approved
connector vault, provider secret store or scoped Worker secret binding after owner approval.
No secret loader or binding is currently implemented. Customer/private config stays outside
this lab in owning systems, not in a second private lab repository.

## Exact next provider proof

First propose an owner-exported **synthetic Google Forms vs Tally fixed-form readback**:
one known answer, one not-sure answer, one unknown answer; map question/answer/provenance/
stopping/qualification fields; run schema + exact replay/conflict tests; compare manual owner
steps. No new purchase, publication, OAuth, webhook or external send. If the export cannot
be obtained through already accepted authority, stop at that owning gate and return to
Portfolio. PlutusDoc/Dashform/follow.it activation remains owner-gated. DigiParser has no
available account; no acquisition action. Parser adoption needs maintained-source/license/
security/performance evidence first, not a heavyweight library import by default.
