# JSM Prototype Build Specification — TD-01 & TD-02
### App Onboarding Redesign | Test (Enterprise) | 2026-04-08

---

## Before you start — JSM prerequisites

Confirm these before opening any configuration screens:

- [ ] JSM project created (project type: **Service Management**, not Software or Business)
- [ ] Customer portal enabled on the project
- [ ] At least one agent account and one customer account available for testing
- [ ] Automation rules enabled on the project (Project settings → Automation)
- [ ] Email notifications enabled (Project settings → Notifications)
- [ ] You have **Project Administrator** permission on the JSM project

---

## Phase 1 — TD-01: App Discovery

**What we are building:** A customer portal page that allows requesters to search a catalogue of approved apps and determine their next step before touching the intake form.

**JSM mechanism:** Knowledge Base articles used as app catalogue entries, surfaced through the portal's article search. This is the lightest configuration that delivers the required behaviour in JSM without custom development.

---

### Step 1.1 — Configure the customer portal landing page

Navigate to: **Project settings → Customer portal**

**Portal name:** `App Onboarding Service`
**Portal description:** `Request a new application for your team, or find out whether a tool you need is already approved.`
**Welcome message:**
```
Before you submit a request, check whether the app you need is already approved.
Search the catalogue below — if you find a match, you can request access directly
without starting the onboarding process.
```

**Portal logo:** Upload the organisation logo or leave as default for prototype.

---

### Step 1.2 — Create the App Catalogue knowledge base

Navigate to: **Project settings → Knowledge base**

If Knowledge Base is not enabled: enable Confluence integration, or use JSM's native knowledge base if available on your tier. For the prototype, native JSM knowledge base articles are sufficient.

**Knowledge base space name:** `App Catalogue`
**Space description:** `Approved, in-review, and retired applications. Search by name, function, or team.`

Enable: **Allow customers to search the knowledge base from the portal** — ON

---

### Step 1.3 — Create app catalogue article template

Each app in the catalogue is a knowledge base article. Use this structure for all 10 placeholder entries:

```
ARTICLE TITLE: [App name] — [One-line function description]

STATUS: [Approved / In Review / Rejected / Retired]

WHAT IT DOES
[2–3 sentences in plain language. Written for a non-technical requester.
What problem does it solve? Who typically uses it?]

APPROVED FOR USE BY
[Teams or roles that can request access]

WHAT TO DO NEXT
[If Approved]:
  → Request access: [link to access request form or contact]
  → This app has already been through onboarding. You do not need to submit
    a new onboarding request.

[If In Review]:
  → An onboarding request for this app is already in progress.
    Contact the service team to explore whether your need can be added
    to the existing request: [service team email placeholder]
  → Do not submit a new onboarding request for this app.

[If Rejected]:
  → This app was reviewed and not approved for use at [organisation name].
    Reason: [plain-language reason — e.g. "Does not meet our data residency
    requirements." Do not include technical risk detail.]
  → If you believe your use case is different, contact: [service team email]

[If Retired]:
  → This app was previously approved but is no longer available.
    [Optional: "Consider [alternative app name] as an alternative."]

CATEGORY
[e.g. Collaboration / Project Management / Analytics / Security / HR / Finance]

LAST REVIEWED
[Month Year]

QUESTIONS?
Contact the App Onboarding team: [placeholder email]
```

---

### Step 1.4 — Create the 10 placeholder app catalogue entries

Create one knowledge base article per app, using the template above. Use these entries — they are designed to cover a range of statuses, categories, and risk profiles to support Hypothesis H1 and the adversarial triage test (H4).

---

**APP 01 — Zoom**
- Status: **Approved**
- What it does: Video conferencing and webinar platform. Used for internal meetings, external client calls, and all-hands presentations. Works on desktop and mobile.
- Approved for: All teams
- Category: Collaboration
- Last reviewed: January 2026
- Next step: Request access via IT helpdesk [placeholder link]

---

**APP 02 — Slack**
- Status: **Approved**
- What it does: Team messaging and file sharing. Connects with most common business tools. Used for day-to-day team communication and project channels.
- Approved for: All teams
- Category: Collaboration
- Last reviewed: November 2025
- Next step: Request access via IT helpdesk [placeholder link]

---

**APP 03 — Monday.com**
- Status: **Approved**
- What it does: Project and work management. Teams use it to plan, track, and report on work — especially useful for non-technical project managers. Does not process personal or financial data.
- Approved for: All teams (read/write); Finance and HR teams (restricted — contact service team before requesting)
- Category: Project Management
- Last reviewed: February 2026
- Next step: Request access via IT helpdesk [placeholder link]

---

**APP 04 — Miro**
- Status: **Approved**
- What it does: Online whiteboard for collaborative workshops, diagramming, and planning. No personal data storage. Data hosted in EU.
- Approved for: All teams
- Category: Collaboration / Design
- Last reviewed: December 2025
- Next step: Request access via IT helpdesk [placeholder link]

---

**APP 05 — Adobe Acrobat Pro**
- Status: **Approved**
- What it does: PDF creation, editing, and e-signature. Standard tool for document-heavy teams.
- Approved for: All teams. Licences are limited — contact Licence Management before requesting.
- Category: Document Management
- Last reviewed: October 2025
- Next step: Request access via IT helpdesk [placeholder link]

---

**APP 06 — Tableau**
- Status: **Approved**
- What it does: Data visualisation and business intelligence. Connects to internal databases and data warehouses. **Requires IT integration setup.**
- Approved for: Analytics, Finance, and Operations teams only
- Category: Analytics
- Last reviewed: March 2026
- Note: Integration with data warehouse requires a separate technical onboarding with App Packaging. Allow additional time.
- Next step: Request access via IT helpdesk [placeholder link] — note your team and intended data sources

---

**APP 07 — DocuSign**
- Status: **In Review**
- What it does: Electronic signature platform for contracts, NDAs, and approvals.
- An onboarding request for DocuSign is currently in review. Do not submit a new request.
- Contact the service team to explore whether your need can be added: [placeholder email]

---

**APP 08 — Notion**
- Status: **Rejected**
- What it does: Notes, wikis, and project management.
- Reason not approved: Data residency requirements not met — data is processed outside the UK/EU without adequate contractual controls.
- Alternative: Consider Confluence (approved) for team wikis and documentation.
- If you believe your use case is different, contact: [placeholder email]

---

**APP 09 — Workday** *(high-risk profile — used in H4 adversarial test)*
- Status: **Approved**
- What it does: HR and payroll management platform. Processes employee personal data, compensation data, and performance records.
- Approved for: HR and People Operations only. **All other teams must submit a new onboarding request — do not request access through this entry.**
- Category: HR / Finance
- Last reviewed: January 2026
- Security note: This app processes sensitive employee data. Any expansion of access beyond HR requires a new onboarding request with full Cybersecurity and Legal review.
- Next step (HR/People Ops only): Request access via IT helpdesk [placeholder link]

---

**APP 10 — Canva** *(fast-track eligible profile — used in H4 adversarial test)*
- Status: **Approved**
- What it does: Online design tool for creating presentations, social media graphics, and internal communications. No personal data stored. EU-hosted. SOC2 certified.
- Approved for: All teams
- Category: Design / Marketing
- Last reviewed: February 2026
- Next step: Request access via IT helpdesk [placeholder link]

---

### Step 1.5 — Configure portal article search prominence

Navigate to: **Portal → Featured articles** (or equivalent in your JSM version)

Pin these articles to the portal home page:
1. "How to check whether your app is already approved" (create this as a short guide article)
2. The most recently added catalogue entry (to signal the catalogue is current)

---

### Step 1.6 — Create the "App not found" call to action

When a requester searches and finds no match, the portal must make the next step obvious. Configure the portal's empty-search state:

Navigate to: **Project settings → Customer portal → Portal groups**

Create a portal group named: `Request a new app`
Description: `Couldn't find what you need? Start the onboarding process here.`

Add to this group: the intake request type (created in Phase 2 — return here after Step 2.1).

---

### Step 1.7 — Phase 1 archaeology check

Before building TD-02, answer these questions. If any answer is "no" or "unsure," resolve it before proceeding.

| Check | Question | Answer before proceeding |
|---|---|---|
| A1 | Is the knowledge base searchable from the portal home page without the requester navigating away first? | Confirm in portal preview |
| A2 | Do search results show article titles (app names) and a snippet — enough to assess relevance without clicking? | Confirm in portal preview |
| A3 | Is the status (Approved / In Review / Rejected) visible in the article snippet, not only inside the article? | Confirm — add status as first line of article body if not |
| A4 | Is the "Request new app" portal group visible below the search bar on the home page? | Confirm in portal preview |
| A5 | Can a requester search by function (e.g. "whiteboard") and find Miro without knowing its name? | Test in portal preview — if not, review article content keywords |
| A6 | Is the Workday entry (APP 09) clearly restricted to HR — would a non-HR requester know NOT to request access? | Read the article as a non-HR user |

---

## Phase 2 — TD-02: Intake Submission

**What we are building:** A JSM request type that captures the full provisional field set, applies 5-criterion triage logic at submission, classifies the request, routes it to reviewing team queues, and sends a confirmation.

---

### Step 2.1 — Create the request type

Navigate to: **Project settings → Request types → Add request type**

**Request type name:** `Request a new application`
**Description shown to customer:** `Submit a request to onboard a new application for your team. Before you start, check the app catalogue to confirm the tool you need hasn't already been approved.`
**Icon:** Choose "Computer" or "Plus" icon
**Portal group:** `Request a new app` (created in Step 1.6)

---

### Step 2.2 — Build the intake form

Add fields to the request type in this order. For each field, the configuration is specified below.

**Form section — Requester identity**

| Field | JSM field type | Label shown to customer | Help text | Required | Conditional |
|---|---|---|---|---|---|
| Summary (system) | Short text | Application name and vendor | e.g. "Figma — Figma Inc." | Yes | No |
| Name, department, team | Short text | Your name, department, and team | We use this to route your request and record accountability | Yes | No |
| Line manager | Short text | Your line manager's name and email | Your line manager may be contacted for approval. | Yes | No |
| Business sponsor | Short text | Business sponsor (if applicable) | Required for applications needing Director-level endorsement. Leave blank if not applicable. | No | No |

**Form section — About the application**

| Field | JSM field type | Label shown to customer | Help text | Required | Conditional |
|---|---|---|---|---|---|
| Business problem | Paragraph | What problem does this application solve? | In 2–3 sentences, describe the business need this tool will address. | Yes | No |
| Vendor website | Short text | Vendor website or product page URL | Paste the URL of the vendor's main product page. | Yes | No |
| Intended users | Short text | How many people will use this, and which teams? | e.g. "12 people in the Finance team" | Yes | No |

**Form section — Data and systems**

| Field | JSM field type | Label shown to customer | Help text | Required | Conditional |
|---|---|---|---|---|---|
| Personal data | Single select | Will this application process or store personal data? | Options: Yes / No / I don't know | Yes | No |
| Data type | Checkboxes | What type of personal data? | Employee data / Customer data / Financial data / Health data / Other. Appears only if personal data = Yes. | Yes | If personal data = Yes |
| System integrations | Single select | Will this application need to connect to other systems? | e.g. HR systems, finance systems, identity/SSO. Options: Yes / No / I don't know | Yes | No |
| Systems list | Paragraph | Which systems will it connect to? | List the systems this application needs to integrate with. Appears only if integrations = Yes. | Yes | If integrations = Yes |
| Data hosting location | Single select | Where is data stored and processed? | Options: UK only / EU (including UK) / United States / Other / I don't know | Yes | No |

**Form section — Commercial**

| Field | JSM field type | Label shown to customer | Help text | Required | Conditional |
|---|---|---|---|---|---|
| Annual licence cost | Short text | Estimated annual licence cost (£) | Your best estimate is fine. e.g. "£2,400" or "£12,000 + setup". | Yes | No |
| Procurement route | Single select | How will this be procured? | Options: New contract with vendor / Existing contract (expanding licences) / Open source / I don't know | Yes | No |

**Form section — Vendor**

| Field | JSM field type | Label shown to customer | Help text | Required | Conditional |
|---|---|---|---|---|---|
| Vendor in org | Single select | Is this vendor already used elsewhere in the organisation? | Options: Yes / No / I don't know | Yes | No |
| Security certifications | Checkboxes | Which security certifications does this vendor hold? | SOC 2 / ISO 27001 / Neither / I don't know. Check the vendor's security or trust page. | Yes | No |

**Form section — Timeline**

| Field | JSM field type | Label shown to customer | Help text | Required | Conditional |
|---|---|---|---|---|---|
| Target go-live date | Date | When do you need this application to be available? | Give us your target — we cannot guarantee it, but it helps us prioritise. | Yes | No |
| Urgency reason | Paragraph | If urgent, why? | Leave blank if there is no specific deadline driver. | No | No |

---

### Step 2.3 — Configure conditional field logic

Navigate to: **Request type → Edit form → Field conditions**

**Condition 1:**
- Trigger field: `Will this application process or store personal data?`
- Trigger value: `Yes`
- Show field: `What type of personal data?`
- Hide field when value is `No` or `I don't know`

**Condition 2:**
- Trigger field: `Will this application need to connect to other systems?`
- Trigger value: `Yes`
- Show field: `Which systems will it connect to?`
- Hide field when value is `No` or `I don't know`

---

### Step 2.4 — Configure duplicate detection

Navigate to: **Project settings → Automation → Create rule**

**Rule name:** `Duplicate detection check`
**Trigger:** Issue created
**Condition:** JQL — `project = [your project key] AND summary ~ "{{issue.summary}}" AND status != Done AND issue != {{issue.key}}`
**Action:** Add comment (internal, not visible to customer):
```
⚠️ Potential duplicate detected. Another open request with a similar application name exists:
[link to matched issue]
Please review before assigning to review queues.
```
**Action:** Apply label `potential-duplicate` to the new request

*Note: This is a fuzzy match on the Summary field (application name + vendor). It will not catch all duplicates — exact name variations will miss. Sufficient for prototype.*

---

### Step 2.5 — Configure triage automation (C1–C5)

This automation evaluates the 5 fast-track criteria at submission and classifies the request. The classification is stored internally — **it is never displayed to the requester as "fast-track" or "standard."** The requester sees only the SLA estimate.

Navigate to: **Project settings → Automation → Create rule**

**Rule name:** `Triage classification — fast-track vs standard`
**Trigger:** Issue created
**Conditions (ALL must be true for fast-track):**

```
C1 — Vendor already used in org:
  Field: "Is this vendor already used elsewhere in the organisation?"
  Value = "Yes"

C2 — No financial/HR/identity system integrations:
  Field: "Will this application need to connect to other systems?"
  Value = "No"
  AND (if "Yes") Systems list does not contain: HR / Workday / payroll /
  finance / SAP / identity / Active Directory / SSO / Okta

C3 — No personal data:
  Field: "Will this application process or store personal data?"
  Value = "No"

C4 — SOC2 or ISO27001 certified:
  Field: "Which security certifications does this vendor hold?"
  Value includes "SOC 2" OR "ISO 27001"

C5 — Licence cost under £5,000:
  Field: "Estimated annual licence cost (£)"
  Value is numeric AND less than 5000
  (For prototype: if value contains "£" strip symbol; if range given, use lower bound)
```

**If ALL five conditions are true → fast-track:**
- Set custom field `Triage classification` = `Fast-track`
- Add internal label: `fast-track`
- Add internal comment:
  ```
  ✅ TRIAGE: Fast-track classification applied.
  All 5 criteria met: C1 vendor known ✓ C2 no high-risk integrations ✓
  C3 no personal data ✓ C4 certified ✓ C5 cost under threshold ✓
  SLA estimate shown to requester: [PLACEHOLDER: 7–10 business days]
  ```

**If ANY condition is false or "I don't know" → standard:**
- Set custom field `Triage classification` = `Standard`
- Add internal label: `standard-review`
- Add internal comment noting which criterion triggered standard routing:
  ```
  📋 TRIAGE: Standard review classification applied.
  Criterion failed or unknown: [list which of C1–C5 were not met]
  SLA estimate shown to requester: [PLACEHOLDER: 7–30 business days]
  ```

*JSM automation limitation: JSM automation does not support complex arithmetic on free-text fields (licence cost). For the prototype, use a single-select field for cost bracket instead of free text — see alternative below.*

**Alternative for C5 (simpler to automate):**
Replace free-text cost field with a single-select:
- Under £2,000 / £2,000–£5,000 / £5,001–£25,000 / Over £25,000 / I don't know

Triage rule: C5 passes if value = `Under £2,000` or `£2,000–£5,000`.

---

### Step 2.6 — Configure team queue routing

Navigate to: **Project settings → Queues**

Create the following queues. Each is visible only to agents (internal). Requesters do not see queue assignments.

| Queue name | JQL filter | Assigned to |
|---|---|---|
| 🔵 App Packaging | `project = [key] AND labels = "routed-app-packaging" AND status != Done` | App Packaging agents |
| 🟣 Supplier Governance | `project = [key] AND labels = "routed-supplier-gov" AND status != Done` | Supplier Gov agents |
| 🔴 Legal | `project = [key] AND labels = "routed-legal" AND status != Done` | Legal agents |
| 🟠 Cybersecurity | `project = [key] AND labels = "routed-cybersecurity" AND status != Done` | Cybersecurity agents |
| 🟡 Licence Management | `project = [key] AND labels = "routed-licence-mgmt" AND status != Done` | Licence Mgmt agents |
| 🟢 SSO | `project = [key] AND labels = "routed-sso" AND status != Done` | SSO agents |
| ⭐ Fast-track | `project = [key] AND labels = "fast-track" AND status != Done` | Service owner |
| ⚠️ Potential duplicates | `project = [key] AND labels = "potential-duplicate" AND status != Done` | Service owner |

**Routing automation — label all submitted requests:**

Create automation rule: `Route request to review queues`
Trigger: Issue created
Actions:
- Add label `routed-app-packaging` to ALL requests
- Add label `routed-supplier-gov` to ALL requests
- Add label `routed-cybersecurity` to ALL requests
- Add label `routed-licence-mgmt` to ALL requests
- Condition: If `System integrations = Yes` → add label `routed-sso`
- Condition: If `Procurement route = New contract` → add label `routed-legal`

*Note for prototype: All requests route to App Packaging, Supplier Gov, Cybersecurity, and Licence Management by default. SSO is conditional on integrations. Legal is conditional on new contracts. App Packaging, SSO, and Legal SLAs are team-specific — to be confirmed in D-01/D-02.*

---

### Step 2.7 — Configure the workflow

Navigate to: **Project settings → Workflows**

Use the default JSM workflow or create a custom one with these statuses:

| Status | Visible to customer as | Internal meaning |
|---|---|---|
| `Submitted` | Submitted — being triaged | Automation running, not yet assigned |
| `In Review` | In review | Routed to team queues, review underway |
| `Information Required` | Action needed — please check your request | RFI sent to requester |
| `Decision Made` | Decision reached | All teams have returned decisions |
| `Complete` | Complete | Access provisioned or rejection communicated |
| `On Hold` | On hold — we will contact you | Blocked pending external input |

**Status transitions (internal only):**
- Submitted → In Review (auto, triggered by routing automation)
- In Review → Information Required (agent action — triggers RFI notification)
- Information Required → In Review (auto, triggered when requester responds)
- In Review → Decision Made (agent action — requires all team decisions recorded)
- Decision Made → Complete (agent action — confirms provisioning or rejection communicated)

---

### Step 2.8 — Configure the confirmation screen

JSM does not have a native customisable confirmation screen beyond a standard "your request has been submitted" message. Use the following approach for the prototype:

**Option A (native — simpler):**
Navigate to: **Project settings → Customer portal → Success message**

Set the success message to:
```
Your request has been submitted.

Reference number: [auto-populated by JSM — {{issue.key}}]

What happens next:
Your request is being reviewed by our team. We will send you an
email within one business day confirming which teams are reviewing
your request and your estimated timeframe.

You can track your request at any time by logging in to this portal.

Questions? Contact: [placeholder service team email]
```

**Option B (richer — recommended for prototype testing):**
Use a JSM automation to send a richly formatted confirmation email within 2 minutes of submission (see Step 2.9). Reference this email in the success message: "Check your inbox — a full confirmation is on its way."

---

### Step 2.9 — Confirmation email template

Navigate to: **Project settings → Automation → Create rule**

**Rule name:** `Send submission confirmation email`
**Trigger:** Issue created
**Delay:** 1 minute (allows triage classification to run first)
**Action:** Send email to reporter

**Subject:** `Your app onboarding request has been received — {{issue.key}}`

**Body:**
```
Hello {{issue.reporter.displayName}},

Your request to onboard {{issue.summary}} has been received.

─────────────────────────────────────────
REFERENCE NUMBER
{{issue.key}}
Keep this for your records.
─────────────────────────────────────────

WHAT HAPPENS NEXT

Your request is being reviewed by the following teams:
  • App Packaging
  • Supplier Governance
  • Cybersecurity
  [If integrations = Yes: • SSO Team]
  [If new contract: • Legal]
  • Licence Management

Each team will review your request in parallel — you will not need
to contact them individually.

─────────────────────────────────────────
ESTIMATED TIMEFRAME

[If fast-track classification]:
  Your request has been assessed as straightforward.
  Estimated timeframe: [PLACEHOLDER: 7–10 business days],
  subject to review.

[If standard classification]:
  Estimated timeframe: [PLACEHOLDER: 7–30 business days]
  depending on the complexity of the review.

These are estimates only and may change. You will be notified
if your request is likely to take longer than expected.
─────────────────────────────────────────

IF WE NEED MORE INFORMATION

If any reviewing team needs additional information from you,
you will receive a notification from this portal. Please respond
through the portal — not by emailing the reviewing team directly.

─────────────────────────────────────────
TRACK YOUR REQUEST

Log in to the portal at any time to check your request status:
[portal URL placeholder]

─────────────────────────────────────────
Questions? Contact the App Onboarding service team:
[placeholder email]

This is an automated message. Please do not reply to this email.
```

*Note: JSM automation has limited conditional logic in email bodies. For the prototype, create two separate email rules — one for fast-track classification and one for standard — each sending the appropriate timeframe paragraph. Use JQL condition: `labels = "fast-track"` for the fast-track email.*

---

### Step 2.10 — Constraints verification

Before marking TD-02 as built, confirm each constraint from the design spec and prototype brief:

| Constraint | How verified |
|---|---|
| No field asks the requester to assess their own risk level | Review every field label and help text — search for words: "risk", "sensitivity", "low", "high", "level". None should appear. |
| Triage classification is never shown to the requester | Check customer portal view (log in as a customer account) — "fast-track" and "standard" labels must not be visible |
| Fast-track label does not appear in customer-facing emails | Review both confirmation email templates as sent (use a test customer email account) |
| All SLA figures are tagged [PLACEHOLDER] | Search both email templates and the confirmation screen for any number followed by "business days" — tag as [PLACEHOLDER] |
| Form saves progress automatically | JSM request forms do not auto-save. Workaround for prototype: add a note at the top of the form: "You can save your progress at any time by clicking Save Draft." Confirm Save Draft is available in your JSM version. |
| Mobile operability | Open portal on a mobile browser — check that all fields, conditional logic, and submit button function correctly |

---

### Step 2.11 — Phase 2 archaeology check

Answer before proceeding to Phase 3 (TD-03–05 light builds):

| Check | Question |
|---|---|
| B1 | Does the triage automation complete within 2 minutes of submission? Test with a submission that clearly meets all 5 criteria and one that fails C3. |
| B2 | Does the internal triage comment appear on the ticket with the correct classification and criteria breakdown? |
| B3 | Does the confirmation email arrive within 3 minutes with the correct reference number, team list, and SLA estimate matching the triage classification? |
| B4 | Does a customer-account login show the request in "Submitted" or "In Review" status but NOT show the triage label, classification, or queue assignment? |
| B5 | If personal data = Yes, does the data type field appear? If No, does it hide? |
| B6 | If integrations = Yes, does the systems list appear? If No, does it hide? |
| B7 | Does the duplicate detection automation fire on a second submission with the same app name? |
| B8 | On mobile: can a requester complete the full form and submit without the conditional fields or submit button being inaccessible? |

---

## Participant recruitment guide (for testing TD-01 and TD-02)

Recruit before prototype testing begins:

**Requester participants (5–6 people):**
- Must be business users — not IT, not the project team
- Mix: at least 2 who are not particularly tech-confident
- Must not have seen the prototype before the session
- Brief them only: "We're testing a new way to request software tools. No right or wrong answers."

**Reviewer participants (2 people, Experiment 6):**
- One from App Packaging or Cybersecurity
- One from Supplier Governance or Legal
- Must be people who actually review app requests today — not their managers
- Brief them: "We'll show you some completed request forms. We want to know if you could act on them as submitted."

**Session format:**
- 45–60 minutes per requester participant (moderated, screen share or in-person)
- 30 minutes per reviewer participant (unmoderated review + 15-minute debrief)
- Facilitator: one person who has not worked on the prototype design
- Observer: one note-taker using the hypothesis observation guide (to be created from Experiment Design outputs)

---

## What is NOT built in this phase

The following are explicitly out of scope for Phase 1 + 2 and will be addressed in the lighter TD-03–05 builds:

- Status tracker (TD-03) — representative screen only, backstage not wired
- Decision communication emails (TD-04) — templates only, no automated trigger
- Post-onboarding obligations view (TD-05) — portal page with placeholder content
- RFI module (mentioned in service blueprint) — beyond JSM's native comment function for the prototype; label as [PLACEHOLDER] in the workflow
- Real reviewer accounts or active queue processing — prototype testing uses agent accounts for observation only

---

*Build Specification v1.0 | Ready to implement | Validation gate: approved 2026-04-08*
*Next: TD-03 to TD-05 light builds (pending Product Critic review of requirements)*
