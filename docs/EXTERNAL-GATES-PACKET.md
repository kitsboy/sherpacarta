# External gates packet

**Status:** all eleven gates are explicitly tracked; none is falsely marked complete.

## Status vocabulary

- **REQUIRES ACTION:** a responsible person must perform or authorize work.
- **REQUIRES EXTERNAL AUTHORITY:** only a government, organization, counsel, or independent provider can supply evidence.
- **DECISION REQUIRED:** the project owner must choose a policy or authority model.
- **HUMAN REVIEW REQUIRED:** software cannot substitute for qualified human approval.

## Gate register

| Gate | Evidence needed | Owner/action |
|---|---|---|
| Independent legal counsel | Signed counsel memo naming scope, jurisdiction, date, and limitations | Retain qualified counsel |
| Canada/UK/EU review | Separate jurisdiction memos; no “EU-wide” shortcut | Select priority jurisdictions |
| Independent security audit | Rules of engagement, signed report, remediation retest | Engage independent firm |
| Deployed endpoint/browser tests | Authorized staging URL, test credentials, reports, remediation results | Provide safe test target |
| Formal approval authority | Adopted charter/bylaws and named signatories | Decide maintainer vs council vs organization |
| MP sponsorship/e-### | Parliament-hosted petition URL and official identifier | Obtain MP sponsorship |
| Organizational endorsements | Direct confirmation from each organization and statement scope | Contact organizations |
| Treasury custody/multisig | Custody policy, signer quorum, recovery plan, separation of duties | Authorized custodians decide |
| Nostr operations | Secret-management, rotation, deployment, incident runbook | THOR/HQ operator executes |
| Human translation approval | Reviewer identity, language, coverage, date, change record | Qualified language reviewers |
| Independent archive/recovery | External archive URL, checksum, restore transcript, recovery owner | Archive operator executes |

## Show-off rule

When demonstrating the site, point to `/data/external-gates.json` and the disclosure bar. Demo records and unverified statuses are intentionally visible so lawyers, friends, organizations, and operators can see exactly what must be replaced with evidence.

## Prohibited shortcuts

Do not invent counsel names, audit firms, MP numbers, endorsements, custody signers, Nostr secrets, translation approvals, or archive confirmations. Do not call a technical repository check an independent review.
