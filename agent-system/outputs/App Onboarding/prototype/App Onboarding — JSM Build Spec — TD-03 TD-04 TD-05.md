# JSM Prototype Build Specification — TD-03, TD-04, TD-05
### App Onboarding Redesign — Light Builds | 2026-04-08
### Incorporating Product Critic revisions

---

## Scope reminder

These are representative screens — enough to walk a participant through the full post-submission journey and test communication design. They are NOT wired to the backstage. No automation triggers, no live SLA timers, no ownership workflows.

**Facilitator instruction (applies to all three):** When showing these screens to test participants, the framing is: *"This is what the service would look like at this point in your journey. I'd like to know whether this gives you what you'd need."* Do not say "this is how it works." The screens show a concept, not a live system.

---

## TD-03 — Status Visibility (light build)

**What we are testing:** Whether the information architecture and milestone framing of a status view would reduce a requester's intent to chase — independent of whether the underlying process is reliable.

**What is NOT being built:** Live status automation, SLA timers, RFI notification triggers, team-level queue visibility.

---

### Step 3.1 — Create the portal request view

JSM's native customer portal already shows submitted requests to logged-in customers. Extend this view for the prototype using the request's status field.

Navigate to: **Project settings → Customer portal → Request list**

Confirm the following are visible when a customer views their open request:
- Request summary (app name + vendor)
- Reference number (issue key)
- Current status (customer-facing label from workflow)
- Date submitted
- Link to view full request details

These are available by default in JSM. No additional configuration required.

---

### Step 3.2 — Create a status explainer article

The portal's native status display shows a label. It does not explain what the label means or what the requester should expect next. Supplement it with a knowledge base article that is linked from the request view.

**Article title:** `Understanding your request status`

**Article content:**

```
YOUR REQUEST STATUS — WHAT EACH STAGE MEANS

──────────────────────────────────────────
SUBMITTED
Your request has been received and is being prepared for review.
You will receive an email confirmation within one business day.
No action is required from you at this stage.

──────────────────────────────────────────
IN REVIEW
Your request has been sent to the relevant reviewing teams.
They are assessing it in parallel — you will not need to contact
them individually.

Estimated timeframe: [PLACEHOLDER: 7–30 business days depending
on complexity]. You will be notified if this estimate changes.

No action is required from you unless you receive an
"Action required" notification.

──────────────────────────────────────────
ACTION REQUIRED — PLEASE CHECK YOUR REQUEST
One of the reviewing teams has asked a question about your request.
You will have received a notification with details.

Log in to this portal and open your request to see the question
and provide your response. Please respond within [PLACEHOLDER:
5 business days] to avoid a delay to your request.

Do not email the reviewing team directly — all responses must
be submitted through this portal.

──────────────────────────────────────────
DECISION REACHED
A decision has been made on your request.
You will receive a separate notification with the full outcome,
what it means for you, and what happens next.

──────────────────────────────────────────
COMPLETE
Your request has been fully processed.
If your request was approved, you should have received access
instructions. If you have not received them within [PLACEHOLDER:
2 business days] of this status appearing, contact:
[placeholder service team email]

──────────────────────────────────────────

WHAT IF MY REQUEST IS TAKING LONGER THAN EXPECTED?

If your request has been "In review" for longer than the estimated
timeframe, you will be notified automatically. You do not need to
follow up — if no notification has been sent, your request is
progressing within the expected timeframe.

If you believe there is an error or your request has been lost,
contact: [placeholder service team email] with your reference number.
```

**Link placement:** Add a "What does my status mean?" link to the customer portal's request list view or request detail view. In JSM this can be done via the portal's announcement banner or as a featured article on the portal home page.

---

### Step 3.3 — Build the "Action required" static screen

For prototype testing, create a test request that is manually set to the `Information Required` status. This simulates what a participant would see if an RFI were issued during their wait.

**To set up for testing:**
1. Submit a test request (use a test customer account)
2. As an agent, manually transition the request to `Information Required`
3. Add a comment (customer-visible) using the RFI template below
4. Show this state to participants during testing as: *"This is what you'd see if a reviewing team had a question for you."*

**RFI comment template (customer-visible):**

```
ACTION REQUIRED — Response needed by [PLACEHOLDER: date]

A question has been raised about your request by the
Cybersecurity review team.

─────────────────────────────────────────
QUESTION
Does [App name] process any data from systems that connect to
your organisation's identity management platform (e.g. employee
login, single sign-on)?

Please describe the data flow, even if you believe the answer
is no.
─────────────────────────────────────────

HOW TO RESPOND
Reply to this message using the "Reply to team" field below.
Do not email the reviewing team directly.

Your request will remain on hold until we receive your response.
The review clock will resume from the point we receive it.
```

**[PROTOTYPE label]:** Add to the top of this comment in internal notes: `[PROTOTYPE: In the live service, this state is triggered automatically when a reviewer submits an RFI through the reviewer queue. The requester receives a portal notification and an email simultaneously. Neither automation is active in this prototype.]`

---

### Step 3.4 — TD-03 archaeology check

| Check | Question |
|---|---|
| C1 | When a test customer logs in and views their open request, is the status label visible without clicking into the request? |
| C2 | Does the "What does my status mean?" article open in a new tab or within the portal — and is it findable without the facilitator pointing to it? |
| C3 | Does the `Information Required` status screen show the RFI content clearly — is the question readable, is the deadline visible, is the response mechanism obvious? |
| C4 | Is there anything on any of these screens that implies the system is live and automated? (Search for: "automatically updated", "real-time", "live tracking") Remove or [PLACEHOLDER]-label any such language. |

---

## TD-04 — Decision Communications (light build)

**What we are testing:** Whether the decision notification format and plain-language framing makes the outcome immediately clear — no follow-up contact needed.

**What is NOT being built:** Automated decision trigger, decision consolidation module, conditions register. Templates only.

**Prototype scope (per Product Critic):** Build and test Approved and Rejected templates. Create Conditionally approved and Deferred as labelled placeholders — not included in user testing sessions.

---

### Step 4.1 — Approved decision email template

Create an automation rule: `Send decision notification — Approved`
**Trigger:** Issue transitioned to `Decision Made` AND label = `decision-approved`
**Action:** Send email to reporter

*(For prototype: trigger manually by adding the label `decision-approved` to a test request and transitioning it to Decision Made.)*

**Subject:** `Decision on your request — {{issue.summary}} [{{issue.key}}]`

**Body:**

```
Hello {{issue.reporter.displayName}},

A decision has been reached on your request to onboard
{{issue.summary}}.

─────────────────────────────────────────
DECISION: APPROVED
─────────────────────────────────────────

Your request has been approved. The application will now be
set up for your team.

WHAT HAPPENS NEXT

The App Packaging and SSO teams will provision access for the
users you listed in your request. You will receive a separate
notification when access is ready — estimated within
[PLACEHOLDER: 5 business days].

You do not need to contact any team to chase provisioning.
If access has not been confirmed within [PLACEHOLDER: 5 business
days] of this notification, contact: [placeholder service email]

─────────────────────────────────────────
YOUR REQUEST REFERENCE
{{issue.key}}

SUBMITTED
{{issue.created | date("d MMM yyyy")}}

DECISION DATE
{{now | date("d MMM yyyy")}}
─────────────────────────────────────────

If you have any questions about this decision, contact the
App Onboarding service team: [placeholder email]

This is an automated message. Please do not reply directly.
```

---

### Step 4.2 — Rejected decision email template

Create an automation rule: `Send decision notification — Rejected`
**Trigger:** Issue transitioned to `Decision Made` AND label = `decision-rejected`
**Action:** Send email to reporter

**Subject:** `Decision on your request — {{issue.summary}} [{{issue.key}}]`

**Body:**

```
Hello {{issue.reporter.displayName}},

A decision has been reached on your request to onboard
{{issue.summary}}.

─────────────────────────────────────────
DECISION: NOT APPROVED
─────────────────────────────────────────

After review, your request has not been approved at this time.

WHY THIS DECISION WAS REACHED

[AGENT TO COMPLETE BEFORE SENDING — one of the following:]

Option A — Data / security reason:
  This application does not meet our current data security
  requirements. Specifically: [PLACEHOLDER: plain-language
  reason — e.g. "data is processed outside the UK/EU without
  adequate contractual controls"].

Option B — Supplier / contractual reason:
  We were unable to establish the necessary contractual
  protections with this vendor at this time.
  [PLACEHOLDER: additional detail if applicable]

Option C — Duplicate / existing tool:
  A tool that meets this need is already approved for use.
  We recommend: [PLACEHOLDER: approved alternative + link to
  catalogue entry].

Option D — Not in scope:
  This type of application falls outside the scope of what
  this service can approve. [PLACEHOLDER: explanation + where
  to direct this request instead].

─────────────────────────────────────────
WHAT YOU CAN DO NOW

[If alternative exists]:
  An approved alternative may meet your need — see above.

[If reconsideration process exists]:
  If your use case is materially different from the one reviewed,
  you may request reconsideration by contacting:
  [placeholder service email] within [PLACEHOLDER: 20 business
  days] of this notification.

[If no reconsideration]:
  If you have questions about this decision, contact the App
  Onboarding service team: [placeholder email]

─────────────────────────────────────────
YOUR REQUEST REFERENCE
{{issue.key}}

SUBMITTED
{{issue.created | date("d MMM yyyy")}}

DECISION DATE
{{now | date("d MMM yyyy")}}
─────────────────────────────────────────

This is an automated message. Please do not reply directly.
```

**Note on the Rejected template:** The "WHY" section requires an agent to select and complete the relevant option before the notification is sent. For the prototype, this is acceptable — in the pilot, this must become a structured field in the decision record that auto-populates the template. Add this to the requirements backlog.

---

### Step 4.3 — Placeholder templates (not tested in prototype sessions)

Create these as draft automation rules. Label clearly. Do not trigger during user testing.

**Conditionally Approved — [PLACEHOLDER — not in test scope]**

```
DECISION: APPROVED WITH CONDITIONS

Your request has been approved, subject to the following conditions
that must be met before or during use of this application:

[PLACEHOLDER: list of discrete, actionable conditions — each with
a named responsible owner and a due date. This content is drawn
from the structured conditions recorded in the decision record.
Template cannot be completed until conditions are recorded as
discrete items during the review process — D-02 dependency.]

WHAT HAPPENS NEXT
[PLACEHOLDER: provisioning timeline + conditions acknowledgement step]
```

**Deferred — [PLACEHOLDER — not in test scope]**

```
DECISION: DEFERRED — FURTHER INFORMATION REQUIRED

A consolidated decision on your request cannot be reached yet.
One or more reviewing teams requires additional information before
they can confirm their position.

[PLACEHOLDER: specific outstanding information + which team requires
it + deadline. This state should be rare — it indicates a failure
of the RFI process during review, not a standard outcome.]

WHAT HAPPENS NEXT
[PLACEHOLDER]
```

---

### Step 4.4 — TD-04 archaeology check

| Check | Question |
|---|---|
| D1 | Does the Approved email display the reference number, submitted date, and decision date correctly from JSM field values? |
| D2 | Does the Rejected email display without any unfilled [AGENT TO COMPLETE] placeholders — i.e. has the agent populated the reason before sending? (For prototype: pre-fill with Option A or C for test scenarios.) |
| D3 | Is the next step in both emails singular and unambiguous? A participant reading it cold should be able to say in one sentence what they are supposed to do now. |
| D4 | Does neither email contain internal terminology — "triage classification", "fast-track", "standard review", team-internal labels? Search both templates. |
| D5 | Are the Conditionally approved and Deferred draft rules clearly marked as [PLACEHOLDER] and NOT triggered during any test session? |

---

## TD-05 — Post-Onboarding Obligations (light build)

**What we are testing:** Whether an app owner can understand their obligations from a single confirmation screen — is the format clear, is ownership explicit, does the person know what they have agreed to?

**What is NOT being built** (per Product Critic revision): Ownership transfer workflow. Ongoing notification automation. Dynamic obligation updates. Obligations tracking view. All deferred to post-pilot roadmap pending app owner discovery research.

---

### Step 5.1 — Create the obligations confirmation portal page

**JSM mechanism:** A knowledge base article serving as a static obligations confirmation screen, linked from the provisioning complete notification. Not a live dynamic view — a representative screen with placeholder obligations.

**Article title:** `Your app ownership responsibilities — [App name]`

**Article content template:**

```
APP OWNERSHIP RESPONSIBILITIES
[App name] | Approved [Date] | Owner: [App owner name]

You have been assigned as the responsible owner for this
application. This means you are accountable for ensuring
the following obligations are met.

─────────────────────────────────────────
YOUR OBLIGATIONS
─────────────────────────────────────────

1. ANNUAL SECURITY REVIEW
   What:    Confirm with Cybersecurity that the vendor's security
            certifications (SOC 2 / ISO 27001) remain current.
   Due:     [PLACEHOLDER: 12 months from approval date]
   Owner:   You ([App owner name])
   Status:  Upcoming

2. SUPPLIER CONTRACT REVIEW
   What:    Confirm with Supplier Governance that the vendor
            contract is active and renewal terms are agreed.
   Due:     [PLACEHOLDER: 60 days before contract expiry]
   Owner:   You ([App owner name])
   Status:  Upcoming

3. LICENCE AUDIT
   What:    Provide Licence Management with a current count of
            active users and confirm all users are still active
            and authorised.
   Due:     [PLACEHOLDER: Every 12 months from approval date]
   Owner:   You ([App owner name])
   Status:  Upcoming

4. DATA PROCESSING CONFIRMATION
   What:    Confirm to Legal that the application's data
            processing activities remain within the scope
            reviewed and approved at onboarding.
   Due:     [PLACEHOLDER: If data processing scope changes,
            immediately. Otherwise, annually.]
   Owner:   You ([App owner name])
   Status:  Upcoming

─────────────────────────────────────────
IF YOUR CIRCUMSTANCES CHANGE

If you change roles and can no longer be the responsible owner
for this application, notify the App Onboarding service team
immediately: [placeholder service email]

Ownership must be formally transferred — obligations do not
automatically transfer when a person changes roles.

[PLACEHOLDER: Ownership transfer process to be defined before
pilot launch. Contact the service team to initiate a transfer.]

─────────────────────────────────────────
QUESTIONS ABOUT YOUR OBLIGATIONS?

Contact the App Onboarding service team: [placeholder email]
Reference: [issue key]

─────────────────────────────────────────

By confirming below, you acknowledge that you have read and
understood your responsibilities as the owner of this application.

[ CONFIRM I ACCEPT THESE RESPONSIBILITIES ]

─────────────────────────────────────────
[PROTOTYPE NOTE — not shown to participants]:
In the live service, this screen would be generated automatically
from conditions recorded during the review process. Obligations
would be specific to the risk classification and conditions of
this application — not a generic template. The "Confirm" button
would log the app owner's acceptance and trigger the catalogue
record update. None of these automations are active in this
prototype.
```

**The "Confirm" button:** JSM knowledge base articles do not support button actions. For the prototype, use one of:
- A link that navigates back to the portal (simulating an acknowledged action)
- A short Google Form embedded via link: "Confirm your obligations" → captures name and timestamp → thank-you screen

---

### Step 5.2 — Provisioning complete notification (triggers TD-05)

This email is sent when the request reaches `Complete` status. It serves as the trigger that brings the app owner to the obligations screen.

Create automation rule: `Send provisioning complete notification`
**Trigger:** Issue transitioned to `Complete`
**Action:** Send email to reporter (and optionally to a second "app owner" email field if configured)

**Subject:** `Access confirmed — {{issue.summary}} [{{issue.key}}]`

**Body:**

```
Hello {{issue.reporter.displayName}},

Access to {{issue.summary}} has been provisioned.

─────────────────────────────────────────
ACCESS IS NOW AVAILABLE

The users listed in your original request should now have
access to {{issue.summary}}. If anyone has not received
access within [PLACEHOLDER: 1 business day], contact:
[placeholder IT support email]

─────────────────────────────────────────
YOUR ONGOING RESPONSIBILITIES

As the requestor and app owner for this application, you are
now responsible for ensuring it continues to meet the
organisation's requirements.

Please review your app ownership responsibilities here:
[link to TD-05 obligations article — placeholder URL]

This will take approximately 2 minutes to read. You will be
asked to confirm you have understood your responsibilities.

─────────────────────────────────────────
YOUR REQUEST REFERENCE
{{issue.key}}
─────────────────────────────────────────

App Onboarding service team: [placeholder email]

This is an automated message. Please do not reply directly.
```

---

### Step 5.3 — TD-05 archaeology check

| Check | Question |
|---|---|
| E1 | Does the obligations article display cleanly on mobile — are all four obligations readable without horizontal scrolling? |
| E2 | Is the [PROTOTYPE NOTE] section hidden from participants — either removed for the test session or scrolled past before handing to participants? |
| E3 | Is the "Confirm" action (link or form) functional — does clicking it produce a response, even if it is just a thank-you screen? |
| E4 | Does the provisioning complete email send when a test request is manually transitioned to Complete? Does the obligations article link work? |
| E5 | Are the four placeholder obligations written in plain language that a non-technical app owner could understand — no jargon, no internal taxonomy? Read them aloud as a test. |
| E6 | Does the ownership transfer section make clear this is a manual process for now — no broken link, no implied automation that doesn't exist? |

---

## Full prototype test session guide

**Session order for each requester participant:**

1. **TD-01** — "You need a tool for your team. Here is the service. What would you do?" [observe catalogue discovery — H1]
2. **TD-02** — "The tool you need isn't in the catalogue. Please complete this request." [observe form completion — H2]
3. **Confirmation screen** — "You've submitted. What would you do next?" [observe confirmation understanding — H3 setup]
4. **TD-03** — "A few days have passed. Here is what the service shows you. Does this give you what you need?" [evaluate status screen — H3]
5. **TD-03 RFI state** — "A reviewer has sent you a question. Here is what you'd see." [evaluate RFI clarity]
6. **TD-04 Approved** — "Here is the decision notification you've received. What do you understand from this?" [evaluate decision clarity]
7. **TD-05** — "Your access has been set up. Here is what you've been sent. What does this mean for you?" [evaluate obligations clarity]
8. **Debrief** — 5 minutes: What was clear? What was confusing? What would make you trust this service?

**Reviewer participant session (separate):**

1. Show 5 completed test submissions from requester sessions
2. "Could you begin your review of each of these as submitted?" [H2 — reviewer perspective]
3. "What, if anything, would you need to ask before you could act?" [record per submission]
4. Debrief: which fields were most valuable? Which were missing or unclear?

---

## Prototype complete — what exists after this build

| Touchpoint | Built | Tested in sessions | Notes |
|---|---|---|---|
| TD-01 App Discovery | ✓ Full build | ✓ H1 | 10 catalogue articles + search |
| TD-02 Intake Submission | ✓ Full build | ✓ H2, H4 | Form + triage + confirmation |
| TD-03 Status Visibility | ✓ Light build | ✓ H3 | Static screens + explainer article |
| TD-04 Decision Comms | ✓ Light build (Approved + Rejected) | ✓ | 2 live templates + 2 placeholders |
| TD-05 Obligations | ✓ Light build | ✓ | Confirmation screen only |
| Ownership transfer | ✗ Deferred | ✗ | Pending app owner discovery |
| Conditionally approved template | ✗ Placeholder | ✗ | Pending D-02 + conditions structure |
| Live SLA timers | ✗ Deferred | ✗ | Pending D-01 + D-05 |
| RFI automation | ✗ Deferred | ✗ | Pending backstage mapping |

---

*Build Specification v1.0 | Light builds — TD-03, TD-04, TD-05*
*Product Critic revisions incorporated | Ready to implement*
*Next: User testing (3–5 participants) → Prioritisation Lead + Roadmap Architect*
