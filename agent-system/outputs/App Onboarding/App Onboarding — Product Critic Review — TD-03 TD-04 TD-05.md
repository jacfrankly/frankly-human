# Product Critic Review — TD-03, TD-04, TD-05
### Product Critic (PC) | App Onboarding Redesign | 2026-04-08

---

## Verdicts at a glance

| Touchpoint | Verdict | Primary issue |
|---|---|---|
| TD-03 — Status Visibility | **Proceed with note** | Prototype design must not simulate process reliability that does not yet exist |
| TD-04 — Decision Communications | **Proceed with note** | Prototype light build should be scoped to Approved and Rejected states only |
| TD-05 — Post-Onboarding Obligations | **Revise** | Requirements describe a full product; prototype brief calls for a light build — these are not the same thing, and the full product has not been discovered |

---

## TD-03 — Status Visibility (Awaiting Decision)

**Verdict: Proceed with note**

---

### 1. Validated opportunity trace

The status visibility touchpoint traces to the clearest validated need in the project: the business user's JTBD of "track and confirm without chasing." The user research identified that requesters initiate escalation contacts not because they are impatient but because the current process gives them no reliable signal that anything is happening. The North Star metric's escalation-rate component directly measures whether this is fixed.

The connection is clean. TD-03 addresses a real, validated need.

### 2. Principles audit

**Principle 1 — The front door is only as good as what happens behind it.**
PARTIALLY HONOURED. The touchpoint brief itself acknowledges the D-05 blocking dependency: "every status state shown to the user must have a confirmed backstage trigger." This is the correct design constraint. The problem is that the prototype brief treats TD-03 as a light build — a representative screen — which, by definition, shows status states that are NOT connected to real backstage triggers. A status screen that looks functional but is backed by placeholder data tests a different thing than the real touchpoint will deliver.

**Principle 2 — Transparency is a process commitment, not a UI feature.**
AT RISK IN PROTOTYPE. This is the most important principle to watch for TD-03. The requirement states that status displayed must reflect real, observable backstage events. In the prototype, it will not — it will be a representative screen with static or simulated status. If the prototype test passes H3 (participants say they'd wait without chasing), the team must be clear about what was validated: the information architecture and communication design, not the process reliability. These are different things. Conflating them at the pilot launch would be a serious error.

**Principle 3 — Organisational authority is a design dependency.**
HONOURED. The touchpoint correctly flags that SLA timers must be live and the escalation process must be operational. These are dependencies, not design goals.

### 3. Problem-solution fit

The real problem: requesters chase because they have no reliable signal about what is happening.

The proposed solution: a portal view showing request status with milestone labels.

The critical question: Is the status tracker solving the problem, or surfacing the absence of the backstage process that would make it work?

At full build: it solves the problem — IF D-05 is resolved, SLA timers are live, and the escalation process exists. These are large conditional ifs.

At prototype (light build): it tests whether the information architecture and communication framing would reduce chasing intent — which is a legitimate and valuable thing to test. The test result is only valid if the session facilitator is explicit that what participants are seeing is a representative example, not a live system. If participants believe the system is live, they are evaluating something that does not exist.

### 4. Scope discipline — prototype specifically

The prototype brief specifies milestone labels: Submitted → Triaged → Under Review → Decision Made → Complete. This is the right level of abstraction for a light build. Five statuses. No sub-states. No team-level detail.

Two scope additions that would exceed the light build framing and must not be included:

- **RFI action state in the prototype**: TD-03 requires an "Action required" status when an RFI is issued. This state is triggered by a reviewer action in the backstage. For the light build, show "Action required" as a static screen with placeholder RFI content — do not wire up the notification trigger or the reviewer-to-requester routing. Label it [PROTOTYPE: this state would be triggered by a reviewer action].
- **"Delayed" status with SLA breach indicator**: The full spec requires an SLA timer. The prototype cannot have a live SLA timer — there are no confirmed SLAs and no live backstage. Include a "Delayed" state as a static screen with placeholder content only. Do not imply to test participants that this state is automated.

### Note to carry forward

When testing TD-03 with participants, the facilitator must NOT say "this is how the status tracker works." The correct framing: "This is what the status view would look like. I'd like to know whether this kind of information would change how you'd behave while waiting."

The distinction matters for how you interpret the test result. H3 passes if participants say they'd wait — but the validity of that result depends on whether they are responding to the design concept or the (non-existent) process reliability behind it.

---

## TD-04 — Decision Communications

**Verdict: Proceed with note**

---

### 1. Validated opportunity trace

TD-04 traces to the business user's JTBD: know the outcome and understand what it means without further contact. The North Star metric's requester-confirmation component (part c — "requester confirms outcome was actionable") is directly tested by whether the decision communication is understandable and complete.

The connection is clean.

### 2. Principles audit

**Principle 1 — The front door is only as good as what happens behind it.**
PARTIALLY HONOURED. The decision notification is only as good as the consolidated decision record it draws from. The touchpoint brief correctly states this: "the notification must be triggered by the actual writing of the consolidated decision record." If the decision record contains vague conditions ("ensure compliance with data policy"), the notification will contain vague conditions regardless of how well designed the template is. The design cannot rescue a poorly recorded decision.

**Principle 2 — Transparency is a process commitment, not a UI feature.**
HONOURED. The brief correctly constrains the design: decision must be consolidated, plain-language, with a single next step. It rules out displaying separate team verdicts that the requester must interpret.

**Principle 6 — Risk governance is a first-class design constraint.**
PROCEED WITH CAUTION. The "Approved with conditions" decision type is where governance integrity is at its most visible to the requester. If conditions are vaguely recorded backstage, the design cannot surface them clearly — and vague conditions displayed to an app owner are a compliance liability, not a transparency feature. The design constraint is correct; the backstage process must record conditions as discrete, actionable items. Flag this for the D-01/D-02 sessions.

### 3. Problem-solution fit

The real problem: requesters receive a decision but do not understand what it means or what to do next, so they make contact to clarify.

The proposed solution: consolidated plain-language notification with decision type, conditions, and a single next step.

Fit: direct. The solution addresses the problem at the right level. Nothing in the brief introduces a proxy.

### 4. Scope — prototype light build

The brief specifies four decision states: Approved / Conditionally approved / Rejected / Deferred.

**Scope recommendation: build Approved and Rejected email templates only for the prototype.**

Reasoning:
- "Approved" and "Rejected" are the states that all requesters will care about and that cover the most common outcomes. They test the core hypothesis: does the communication make the outcome clear without further contact?
- "Conditionally approved" requires discrete, structured conditions drawn from the backstage. In the prototype, these will be placeholder conditions — but placeholder conditions do not test whether the real design will work when conditions are complex or contested. The template can exist, but do not include it in the user testing protocol.
- "Deferred" is an edge state that represents a failure of the decision consolidation process. Do not test this in the prototype — it adds complexity without adding signal on the core hypothesis.

If the prototype build includes all four templates: label "Conditionally approved" and "Deferred" as [PLACEHOLDER — not tested in user sessions].

### Note to carry forward

The post-closure micro-survey (component (c) of the North Star — "was the outcome clear and actionable?") is triggered after TD-04. This is the instrumentation that closes the loop on whether the decision communication worked. Confirm with the Metrics Definer that this survey is built into the JSM automation before the pilot, not the prototype.

---

## TD-05 — Post-Onboarding Obligations

**Verdict: Revise**

---

### 1. The core issue

The TD-05 requirements brief describes a post-onboarding obligation management system. The prototype brief calls for a light build — a representative screen. These are not the same thing, and the requirements as written cannot be used to scope a light build without creating confusion about what is being built and what is being tested.

More fundamentally: TD-05 serves a different user than TD-01 through TD-04. The primary persona shifts from the Business Requester to the App Sponsor / Technology Owner. There is no user research in the discovery outputs that specifically examines this persona's needs, mental model, or current behaviour around app ownership obligations. The JTBD work covered the business user (requester), the tech user, and the governance user — not the app owner as a distinct role.

Building — even a light version of — a touchpoint for a persona that has not been researched means building on unvalidated assumptions.

### 2. Validated opportunity trace

**Partially traceable.** The opportunity to reduce obligation-related failures (apps becoming non-compliant after approval because no one manages them) is referenced in the risk register (G-05: post-pilot fast-track approvals becoming de facto policy without formal ratification). The service blueprint includes post-onboarding as Stage 8. The opportunity is real.

What has NOT been validated:
- Whether app owners currently have a reliable place to track obligations and simply use it poorly, or whether no such mechanism exists
- Whether obligation failures are primarily caused by lack of awareness, lack of a tracking mechanism, or unclear ownership
- Whether the current volume of approved apps is high enough to make an obligations tracking system a meaningful investment relative to the pilot's other priorities
- What the app owner persona's mental model of "obligation" is — compliance due dates? Supplier review meetings? Licence renewals?

Without this, the requirements are built on assumed user needs. The design could be solving the wrong version of a real problem.

### 3. Principles audit

**Principle 1 — The front door is only as good as what happens behind it.**
VIOLATED in current scope. The obligations view requires: (a) conditions recorded as discrete structured items during review, (b) agreed notification windows, (c) ownership transfer workflow, (d) a mechanism for updating obligations when risk classification changes. None of these backstage processes are confirmed. The TD-05 design, if built, will surface the absence of these processes rather than solve the obligation management problem.

**Principle 5 — Pilot scope is determined by what can be measured, not what can be built.**
VIOLATED. There is no measurement plan for TD-05 in the Metrics Plan — it was not included in the pilot metrics, the prototype hypothesis set, or the instrumentation requirements. A touchpoint that cannot be measured should not be in the pilot scope.

### 4. Problem-solution fit

The real problem (assumed, not validated): app owners lose track of their ongoing obligations after an app is approved, leading to compliance gaps.

The proposed solution: an obligation tracking view with proactive notifications and ownership transfer.

The design risk: if the real problem is that obligations are not clearly defined during the review process (backstage), then surfacing them in a portal view does not fix anything — it displays the absence of clarity. This is the same pattern the strategy-architect warned against for status tracking: "a notification system on top of an unreliable backstage process does not improve the relationship — it creates false confidence and then disappoints."

### 5. Scope — what should be built for the prototype

The light build for the prototype should be scoped to ONE thing only:

**Show the app owner a confirmation screen that lists their obligations in a structured format, immediately after provisioning is complete.**

This tests whether:
- The app owner understands what they are being made responsible for
- The obligation format (named item / due date / status) is comprehensible
- The user knows what to do if an obligation is unclear or if they are not the right owner

It does NOT require:
- Ownership transfer workflow
- Ongoing notification automation
- Dynamic obligation updates
- Integration with the catalogue record
- Escalation logic for missed obligations

All of the above are second-order features that belong in a post-pilot roadmap, not a prototype.

### 6. Revision instructions for Requirements Writer

Return the TD-05 requirements brief with the following changes:

**1. Reduce prototype scope to the obligation confirmation screen only.**
One screen. Shown immediately after the "provisioning complete" notification (the end of TD-05 context — what happens before). Displays 3–5 placeholder obligations in a table: obligation name / due date / responsible owner / status. Single CTA: "I accept these responsibilities."

**2. Remove from prototype scope (defer to post-pilot roadmap):**
- Ownership transfer action
- Proactive notification triggers
- Dynamic obligation updates when risk classification changes
- "Obligations due / overdue / complete" view (requires ongoing system operation)

**3. Flag for user research before full build:**
Before writing full TD-05 requirements, conduct a minimum of 3 discovery interviews with current app owners (people who manage approved software tools today) to understand: how they currently track compliance obligations, what "obligation" means in their vocabulary, and whether the failure mode is awareness or structure. This research does not exist yet.

**4. Add to the Metrics Plan:**
If TD-05 is included in any pilot scope, define at minimum: what does a successful obligation interaction look like (owner confirms receipt, owner completes first obligation on time), and how will it be measured.

---

## Summary handoff to Requirements Writer

**TD-03:** Proceed to light build. Add to the test protocol: facilitator must be explicit that the status view is a concept, not a live system. Do not wire up RFI trigger or SLA timer for the prototype.

**TD-04:** Proceed to light build. Build Approved and Rejected email templates for prototype testing. Label Conditionally approved and Deferred as [PLACEHOLDER — not in test scope].

**TD-05:** Return for revision. Reduce prototype scope to obligation confirmation screen only. Remove ownership transfer, notification triggers, and obligations view from prototype. Before full build: conduct 3 discovery interviews with current app owners. Before any pilot inclusion: add TD-05 metrics to the measurement plan.

---

*Product Critic (PC) | Findings delivered to: Requirements Writer*
*Escalation threshold not reached — no finding requires escalation to Product Lead or Opportunity Mapper*
*Review trigger: if TD-05 is added back to pilot scope without discovery interviews, escalate to Product Lead*
