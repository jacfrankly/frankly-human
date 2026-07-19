# Metrics Plan — Application Onboarding Redesign
### Metrics Definer (MD) | Test (Enterprise) | 2026-04-08

---

## Framing note

Metrics are defined here before the prototype is tested and before the pilot launches. Any metric added after results are known — because the pre-defined metrics are not moving — is post-hoc metric selection and undermines the validity of the evaluation. This plan is the reference document for the launch-planner and retrospective-lead.

This plan covers three distinct measurement moments:
1. **During prototype testing** — observable signals in a 3–5 person moderated session
2. **During the JSM pilot** — instrumented metrics in a live (but controlled) environment
3. **At pilot review gate** — the metrics that determine whether to expand, adapt, or stop

---

## North Star (from Strategy Architect)

**Requester-confirmed resolution rate within target timeframe without chasing or escalating**

Measured as: % of closed requests where:
- (a) elapsed calendar time from submission to final decision falls within the target band
- (b) the requester did not initiate an escalation or chase contact during that period
- (c) a brief post-closure confirmation from the requester confirms the outcome was actionable

**Current baseline:** Unknown. Establishing this baseline from Jira data is a pre-condition, not a nice-to-have (see Baseline Requirements below).

---

## Part 1 — Prototype testing metrics

These are observational metrics collected during moderated usability sessions. They are not instrumented — they are recorded by the session facilitator.

### Primary observable metric — Prototype

**Submission completeness rate (SCR)**
The proportion of test submissions that a real reviewer participant can act on without requesting additional information.

- Definition: (submissions requiring no RFI / total test submissions) × 100
- Source: Reviewer participant assessment in Experiment 6 (H2)
- Prototype pass threshold: ≥80% (≥4 of 5 submissions)
- Why primary: The most important thing a front door can do is deliver complete, actionable intake data to reviewers. If this fails in a 5-person test, it will fail at scale.

### Secondary observable metrics — Prototype

**Catalogue discovery rate**
% of requester participants who navigate to the app catalogue independently before the intake form.
- Source: Facilitator observation, Experiment 5 (H1)
- Threshold: ≥70% (≥4 of 5 participants)
- Connection to North Star: Duplicate prevention → reduces total request volume → reduces reviewer load → improves resolution rate

**Triage misclassification rate**
% of adversarial-scenario submissions that produce an incorrect fast-track classification.
- Source: Requester submission vs. reviewer independent assessment, Experiment 4 (H4)
- Threshold: If ≥30% misclassify, triage criteria must be hardened before pilot. This metric is a gate, not a target.
- Connection to North Star: Incorrect fast-track classifications that bypass specialist review create governance failures that invalidate the resolution — the requester gets a decision, but it is not a valid one.

**Status-chasing intent rate**
% of participants who state they would contact a reviewer or escalate within seven days of submission, despite receiving a confirmation screen.
- Source: Post-task debrief interview, Experiment 7 (H3)
- Threshold: ≤20% intent to chase within 7 days (≤1 of 5 participants)
- Connection to North Star: Requester-initiated escalation contacts are a component of the North Star failure condition — they signal that the service did not meet the requester's transparency need.

### Counter-metric — Prototype

**Form abandonment signal**
If any participant abandons the intake form mid-completion and does not return — even after prompting — this is a counter-metric trigger.
- Source: Facilitator observation
- Threshold: Any single abandonment is a trigger for immediate review of the abandonment point before the pilot proceeds.
- Why a counter-metric, not a success metric: A form that requesters cannot complete is not a serviceable front door regardless of how well any other metric performs.

---

## Part 2 — JSM pilot metrics

These are instrumented metrics collected during the controlled pilot. They require instrumentation to be in place before the pilot goes live.

### Primary metric — Pilot

**Requester-confirmed resolution rate (RCRR)**
The North Star metric, measured at pilot scale.

- Definition: (requests closed where elapsed time ≤ target band AND no requester escalation/chase AND requester confirms outcome actionable) / (total requests closed in pilot period) × 100
- Numerator components:
  - (a) Elapsed time: submission timestamp to decision notification timestamp, measured in calendar days
  - (b) No escalation: zero requester-initiated contacts to any reviewing team outside the RFI module during the request lifecycle
  - (c) Requester confirmation: a one-question post-closure micro-survey sent 48 hours after decision notification — "Was the outcome of your request clear and actionable? Yes / No / Partially"
- Denominator: all requests reaching "Decision Made" status in the pilot period
- Data source: JSM ticket metadata (timestamps), RFI module logs, post-closure survey response
- Review frequency: Weekly during pilot, full review at pilot gate
- Owner: Service owner (once named)
- Target: Not set until baseline is established. Direction: increase.

**Important:** Do not set a numerical target for RCRR before the baseline is extracted from historical Jira data. Setting a target before the baseline is known produces a gameable metric — the pilot can be declared a success by selecting the right denominator.

### Secondary metrics — Pilot

**Intake completeness rate (ICR)**
% of submitted requests that proceed to first substantive review without the reviewer returning the request for missing information.

- Definition: (requests with no RFI in the first 5 business days of review) / (total requests entering review) × 100
- Data source: RFI module logs — first RFI timestamp vs. submission timestamp
- Baseline: Unknown. Establish from existing Jira ticket data (proportion of current tickets that have a "request for information" note within the first week).
- Pilot target direction: Increase vs. baseline.
- Review frequency: Weekly.

**Escalation and chase contact rate (ECCR)**
Number of requester-initiated status contacts per 100 active requests per month.

- Definition: (requester-initiated contacts outside the RFI module in a calendar month) / (average active requests in that month) × 100
- Data source: Helpdesk tickets, email contacts to reviewing teams (requires teams to log inbound requester contacts — this is an instrumentation dependency, see below), escalations to service owner
- Baseline: Unknown. Must be estimated from existing email and helpdesk data before pilot.
- Pilot target direction: Decrease vs. baseline.
- Review frequency: Monthly.

**Catalogue deflection rate (CDR)**
% of catalogue sessions that end in "Request access" (to an existing approved app) rather than "Request new app."

- Definition: (catalogue sessions resulting in access request) / (total catalogue sessions) × 100
- Data source: JSM portal analytics — page navigation events (requires portal analytics to be enabled before launch)
- Baseline: 0% (no catalogue exists today). No baseline comparison possible; track trend from pilot launch.
- Review frequency: Monthly.

**Triage accuracy rate (TAR)** — *conditional metric*
% of pilot requests where the triage classification assigned at intake matches the classification confirmed by the specialist reviewer after review.

- Definition: (requests where intake classification = post-review confirmed classification) / (total requests with a triage classification) × 100
- Data source: Intake triage output field (fast-track / standard) vs. reviewer-confirmed classification field in JSM ticket
- Activation condition: This metric cannot be activated until D-02 (Cybersecurity and Legal define fast-track criteria) is complete and agreed criteria are embedded in the triage logic. Do not measure triage accuracy against provisional criteria.
- Review frequency: Monthly once active.

**Channel consolidation progress (CCP)**
Number of original intake channels formally decommissioned vs. total of six. Tracked as a programme milestone.

- Definition: Count of team intake channels with written decommission sign-off and evidence of closure (redirect or removal of the previous intake route)
- Data source: Decommission commitment letters (Experiment 2); channel audit post-decommission
- Gate: 6/6 required before pilot can expand to full rollout. Any holdout is a programme risk.
- Review frequency: At pilot entry and pilot exit review.

### Counter-metrics (guardrail metrics) — Pilot

These must NOT degrade during the pilot. If any guardrail is breached, the pilot pauses for investigation before continuing.

**Reviewer RFI volume**
Total number of RFIs sent from reviewers to requesters per month. Must not increase vs. pre-pilot baseline.

- Rationale: The intake form redesign is intended to reduce RFIs, not shift when they occur. If RFI volume increases during the pilot, the intake form is not delivering completeness — despite the pilot's front-door improvements.
- Trigger: >15% increase in RFI volume vs. pre-pilot baseline for two consecutive weeks.

**Requester drop-off rate**
% of started intake form sessions that are abandoned before submission.

- Rationale: A front door that requesters cannot complete is worse than no front door. Intake completeness gains mean nothing if the form drives abandonment.
- Trigger: >20% abandonment rate across the pilot period.
- Data source: JSM portal session analytics — form start event vs. submission event.

**Post-decision complaint rate**
Number of requester complaints about decision quality or process clarity per 100 closed requests.

- Rationale: Faster resolution is not success if requesters receive decisions they cannot act on or do not understand. The post-closure confirmation survey (component (c) of RCRR) doubles as the measurement mechanism — a "No" or "Partially" response is a complaint signal.
- Trigger: >25% of post-closure survey responses are "No" or "Partially actionable."

---

## Part 3 — Pilot gate metrics (go/expand/stop decision)

At the pilot review gate, these are the metrics used to make the expansion decision.

| Metric | Expand condition | Adapt condition | Stop condition |
|---|---|---|---|
| RCRR | ≥baseline + meaningful improvement (to be defined once baseline known) | Flat vs. baseline but ICR and ECCR improving | Worse than baseline |
| ICR | ≥80% submissions complete at first review | 65–79% | <65% |
| ECCR | Decrease vs. baseline | Flat vs. baseline | Increase vs. baseline |
| TAR (if active) | ≥90% classification agreement | 75–89% | <75% — fast-track suspended |
| CCP | 6/6 decommissioned | — | Any holdout team — full rollout blocked |
| Guardrails | None breached | One guardrail breached, recoverable | Any guardrail in sustained breach |

---

## Part 4 — Baseline data requirements

The following baselines must be extracted before the pilot goes live. If they do not exist, the pilot's success criteria cannot be evaluated.

| Baseline | Source | Owner | Required by |
|---|---|---|---|
| Elapsed time (submission to decision) for current requests | 24-month Jira pull across all six instances | Jira admin + analyst | Pilot launch |
| Requester escalation / chase contact rate (current) | Helpdesk ticket logs + email contact data from each team | Each team lead | Pilot launch |
| RFI rate (reviewer to requester, current) | Jira ticket comment / field history | Jira admin | Pilot launch |
| Request volume by team and quarter | 24-month Jira pull (Experiment 3, CA-04) | Jira admin + analyst | Before business case is finalised |
| Post-decision requester satisfaction (current) | Does not exist. No current mechanism. | Must be created | No pre-pilot baseline possible — track from pilot day one |

**Measurement gap — post-decision satisfaction:** There is no current mechanism for capturing requester confirmation that a decision was actionable. The post-closure survey is a new instrument. This means component (c) of the North Star metric has no pre-pilot baseline. Track from pilot launch and treat the first 30 days as the baseline establishment period.

---

## Part 5 — Instrumentation requirements (pre-launch checklist)

The following must be in place before the pilot goes live. If any item is missing, the relevant metric cannot be collected and the pilot evaluation is incomplete.

| Instrumentation | Required for | Status |
|---|---|---|
| JSM portal session analytics (page views, navigation paths, form start/submit events) | CDR, form abandonment guardrail | Not confirmed — verify JSM analytics capability |
| RFI module with timestamp logging | ICR, reviewer RFI guardrail | Required — confirm JSM workflow supports this |
| Triage classification field on JSM ticket (auto-populated at submission) | TAR | Required — confirm JSM automation supports classification output |
| Post-closure micro-survey (48-hour trigger after decision notification) | RCRR component (c) | New instrument — must be built before pilot |
| Inbound requester contact logging by reviewing teams | ECCR | Requires team agreement — may be the hardest instrumentation item |
| Decommission status tracker (linked to commitment letters) | CCP | Simple spreadsheet or JSM dashboard |

**Hardest instrumentation item:** ECCR requires each of the six reviewing teams to log inbound requester contacts (email, phone, Slack) during the pilot. This is a behaviour change for all six teams and requires the service owner's authority to enforce. Without it, ECCR cannot be measured and the escalation-reduction claim cannot be validated.

---

## Handoff note to Launch Planner and Retrospective Lead

**The single metric that best captures whether this worked:**
RCRR — requester-confirmed resolution rate. It is the only metric that cannot be gamed by optimising a sub-metric in isolation.

**The leading indicator to watch in the first two weeks of the pilot:**
Intake completeness rate (ICR). It is measurable from day one, requires no requester participation, and predicts whether reviewers will be able to maintain processing speed. If ICR is high from the start, the other downstream metrics are likely to follow. If ICR is low, intervene before the reviewers fall behind.

**The guardrail metric that must not degrade:**
Reviewer RFI volume. If the front door produces more RFIs than the current process, the service has added a layer without adding value — and the reviewing teams will lose confidence in the programme.

**Instrumentation gaps that must be resolved before launch:**
1. ECCR measurement requires six-team agreement on contact logging — escalate to service owner as a programme pre-condition
2. Post-closure survey must be built in JSM before pilot goes live — it is a component of the North Star metric, not a nice-to-have
3. Portal session analytics must be confirmed as available in the JSM instance — verify before prototype testing begins

**One thing this plan cannot measure:**
Whether requesters who should have used the front door used a legacy channel instead. Channel consolidation (CCP) tells you whether the channels have been closed — it does not tell you whether any shadow channels (email to a known reviewer, Slack DMs) persist informally. The service owner will need to monitor this qualitatively during the pilot.

---

*Metrics Definer (MD) | Handoff to: Launch Planner, Retrospective Lead*
*Review trigger: any change to North Star metric, pilot scope, or CA-01/CA-04 outcome*
