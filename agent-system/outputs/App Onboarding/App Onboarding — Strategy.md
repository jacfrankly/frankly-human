# Strategy Outputs: Application Onboarding Redesign
### Strategy Architect — Service Design Team | 2026-04-08

---

## 1. Service Vision

**The app onboarding service is the organisation's single, authoritative route for evaluating and approving new third-party applications — one that gives requesters a clear answer, gives reviewers the right information at the right time, and gives the organisation a defensible record of every decision made.**

The service succeeds when a requester can submit once, track progress without chasing, and receive a decision they understand — and when the six reviewing teams can apply proportionate effort based on risk rather than processing every request identically.

This vision rules out: a better-looking intake form that leaves the backstage process unchanged. It rules out a new channel sitting alongside the existing six. It rules out a fast-track pathway that trades speed for governance integrity.

---

## 2. North Star Metric

**Metric: Requester-confirmed resolution rate within target timeframe**

The proportion of app onboarding requests that are resolved — with a decision the requester considers complete and actionable — within a defined target elapsed time, without the requester needing to chase or escalate.

| Element | Detail |
|---|---|
| **What it measures** | Whether the service actually delivered a usable outcome to the person who needed it, in a reasonable time, without them having to compensate for process failure |
| **How it is measured** | Percentage of closed requests where: (a) elapsed calendar time from submission to final decision falls within the target band AND (b) the requester did not initiate an escalation or chase contact during that period AND (c) a brief post-closure confirmation from the requester confirms the outcome was actionable |
| **Current baseline** | Unknown. Establishing this baseline from Jira data is a pre-condition for the programme, not a nice-to-have. |
| **Target direction** | Increase. A meaningful target cannot be set until baseline elapsed time and current escalation rate are measured. |
| **Why this and not elapsed time alone** | Elapsed time can be gamed — by fast-tracking low-complexity requests, by rejecting ambiguous ones quickly, or by closing tickets without resolution. The requester-confirmation component prevents the team from optimising the metric without creating actual value. |

---

## 3. Input Metrics

### Input Metric 1: Duplicate request prevention rate
The proportion of submitted requests that are redirected — pre-submission — to an existing approved application that meets the requester's need.
- **Lever:** Design and content quality of the pre-submission discovery experience; accuracy and currency of the approved app catalogue.
- **Dependency:** Requires confirmed duplication rate data before this metric has meaning.

### Input Metric 2: Escalation and chase contact rate
The number of requester-initiated status enquiries and escalations per 100 active requests, per month.
- **Lever:** Proactive status notification design; clarity of ownership at each stage; accuracy of displayed process state.
- **Caution:** This metric will not improve unless the backstage process produces reliable state data to surface.

### Input Metric 3: Intake completeness rate
The proportion of submitted requests that proceed to first substantive review without requiring the reviewer to return the request for missing or ambiguous information.
- **Lever:** Intake form field design — but only after the six-team data-mapping exercise is complete.
- **Critical dependency:** Form fields must be outputs of the downstream team data-mapping exercise.

### Input Metric 4: Risk triage accuracy rate
The proportion of requests where the risk classification assigned at intake matches the classification assigned after specialist review.
- **Lever:** Intake triage logic design; Cybersecurity and Legal definition of risk criteria; absence of self-declaration in the triage logic.
- **Status:** Cannot be activated until the Risk Assessor's four fast-track pre-conditions are met.

### Input Metric 5: Channel consolidation progress
The number of original intake channels that have been formally decommissioned, tracked against the total of six, with written commitment from each team.
- **Lever:** Governance authority of the named service owner.
- **Note:** This is a programme milestone gate, not a continuous metric. Its failure is an immediate programme-ending condition.

---

## 4. OKR Alignment

> **Important caveat:** No OKRs were provided by the client. Connections below are hypotheses to be validated, not confirmed strategic alignment. Confirming OKR alignment should be a programme initiation step.

### Likely OKR 1: Operational Efficiency
Alignment strength: **High.** Directly reduces measurable process waste across six teams.
Condition: Efficiency gains are backstage gains. If the programme is measured against a speed improvement OKR but the backstage process is not reformed, the service will fail to deliver even if the front door is excellent.

### Likely OKR 2: Governance Maturity and Risk Management
Alignment strength: **High.** Centralising intake creates, for the first time, a single auditable record of all app onboarding decisions.
Risk: The fast-track pathway, if the Risk Assessor's conditions are not met, could actively undermine this OKR by introducing a governance shortcut that produces under-reviewed approvals.

### Likely OKR 3: IT-Business Relationship and Experience
Alignment strength: **Moderate.** Resolving the status/sense-making job materially improves the perceived relationship between business users and the IT/governance function.
Condition: A notification system on top of an unreliable backstage process does not improve the relationship — it creates false confidence and then disappoints.

---

## 5. Service Principles

**Principle 1: The front door is only as good as what happens behind it.**
Design decisions about the requester-facing experience must be evaluated against whether they produce reliable, actionable data for backstage reviewers.
*This rules out:* Designing the intake form before the six-team data-mapping exercise. Launching a status tracker that displays process states the backstage process cannot reliably populate.

**Principle 2: Transparency is a process commitment, not a UI feature.**
The status/sense-making job can only be met if the underlying process produces reliable state information.
*This rules out:* Building a status dashboard before the backstage handoff process is mapped and reformed. Generic "your request is being reviewed" notifications when the actual state is unknown.

**Principle 3: Organisational authority is a design dependency, not a design output.**
Naming a service owner with Director-level authority is a pre-condition for the programme, not something the service design will eventually create.
*This rules out:* Designing coordination mechanisms intended to compensate for the absence of genuine organisational authority. Launching the pilot without written channel decommission commitments from all six teams.

**Principle 4: Proportionate effort requires accurate triage — and accuracy must be demonstrated, not assumed.**
Risk criteria must be defined by Cybersecurity and Legal, not ratified by them after the fact. Requester self-declaration of risk category is not a triage mechanism.
*This rules out:* Any intake design in which the requester selects their own risk tier. Launching the fast-track before shadow-review has validated triage accuracy.

**Principle 5: Pilot scope is determined by what can be measured, not by what can be built.**
The programme should only expand to the scope for which it has a validated baseline and a reliable measurement mechanism.
*This rules out:* Expanding to full programme scope before Jira data has validated request volume. Claiming success on elapsed time reduction if the baseline elapsed time was never measured.

**Principle 6: Risk governance is a first-class design constraint, not a final review gate.**
Security and legal requirements are inputs to the design of the intake process, not approvals sought after the design is complete.
*This rules out:* Designing the intake form and triage logic and then presenting it to Cybersecurity and Legal for sign-off.

---

## 6. Strategic Tensions

**Tension 1: Speed of delivery vs. correctness of foundation**
The client wants visible momentum. All three specialist roles converge on the same message: the foundations are not yet in place to build confidently. Volume is unvalidated. Authority is unconfirmed. The form cannot be designed before the data-mapping exercise.
*Navigation:* The pilot is explicitly framed as a measurement exercise, not a launch. The first milestone is "baseline established and pre-conditions confirmed" — not "front door live."

**Tension 2: User experience ambition vs. backstage process reality**
Requesters need status transparency and fast resolution. The front door cannot deliver what requesters need without backstage reform — which is an organisational change programme, not a design programme.
*Navigation:* The North Star metric is designed to be unmeetable without backstage reform — it includes escalation rate as a component. This prevents the programme from claiming success on UX while the underlying problem persists.

**Tension 3: Fast-track opportunity vs. governance integrity**
The fast-track is the feature most likely to generate client enthusiasm and most likely to generate a governance failure.
*Navigation:* The fast-track is a conditional component with explicit go/no-go criteria, not a planned feature with a delivery date. If conditions cannot be met within the pilot timeframe, the fast-track does not launch in the pilot. Non-negotiable.

**Tension 4: Centralisation aspiration vs. organisational authority reality**
Six teams with established processes will not voluntarily decommission their intake channels because a better design exists. Design cannot solve this problem.
*Navigation:* The single authority condition is a pre-condition, not a design goal. The pilot does not proceed without it. The channel consolidation progress metric keeps it visible at steering level.

---

## Handoff Note: Requirements Writer and Opportunity Mapper

### The core strategic bet
This programme bets that a single, authoritative intake point — with proportionate risk triage and reliable status transparency — can replace fragmented parallel channels and deliver measurably faster, more trustworthy outcomes. The bet is reasonable and worth a structured pilot. It is not yet a compelling business case.

The programme succeeds only if it reforms the backstage process, not just the front door. Every requirements decision should be tested against this.

### What the strategy explicitly rules out
- A new intake channel alongside the existing six rather than replacing them
- An intake form designed before the six-team data-mapping exercise
- A fast-track pathway based on requester self-declaration of risk category
- A status transparency feature built on an unreliable backstage process state
- A pilot that expands to full programme scope before request volume has been validated
- Any design intervention intended to substitute for the Director-level service owner authority condition

### The input metric most important to move first
**Escalation and chase contact rate.** Measurable now, without waiting for the data-mapping exercise or fast-track conditions. Reducing it requires the team to engage with the backstage process — which is where the real problem is.

### The strategic assumption that, if wrong, requires the strategy to be revised
**That a named service owner with Director-level authority over all six teams can be secured before the programme's inception.**

If wrong: the single front door becomes a seventh intake channel; every volume-based metric becomes unreliable; governance record is incomplete; elapsed time does not improve. A different strategic frame would be needed — possibly a lightweight coordination layer across parallel channels rather than a genuine single front door. That is a materially different programme.

*Review trigger: any change to the authority condition, volume validation outcome, or fast-track risk review decision.*
