# Risk Assessment — Application Onboarding Redesign
### Risk Assessor Output | Test (Enterprise) | 2026-04-08

---

## 1. Risk Register

### Category 1: User Adoption Risk

| ID | Risk | Probability | Impact | Current Mitigation |
|----|------|-------------|--------|-------------------|
| UA-01 | Requesters continue using existing team-direct channels (email, Jira, Slack) out of habit or relationship. The front door becomes a seventh channel, not the only one. | **High** | **High** | None identified. No enforcement mechanism exists. |
| UA-02 | Requesters learn that declaring higher risk means more process, and self-select their apps as "low risk" to access fast-track — regardless of actual risk profile. | **High** | **High** | None. This is structurally incentivised by the design. |
| UA-03 | Requesters in different roles have different mental models of what "onboarding an app" means. Intake form doesn't map to their frame of reference, leading to abandonment or error-completion. | **Medium** | **High** | None. No primary research on requester mental models. |
| UA-04 | Mobile channel provides a degraded intake experience for a process requiring detailed technical and contractual information. Requesters on mobile abandon mid-form or submit incomplete data. | **Medium** | **Medium** | Not addressed in brief. Channel parity not scoped. |
| UA-05 | In-person channel operates on different intake logic than the web form, creating inconsistent data and parallel process variants. | **Medium** | **Medium** | Not addressed. Channel governance not defined. |

### Category 2: Technical Risk

| ID | Risk | Probability | Impact | Current Mitigation |
|----|------|-------------|--------|-------------------|
| T-01 | Six teams operate separate Jira instances/desks with incompatible field schemas. A front door that cannot route reliably simply adds a manual handoff layer. | **High** | **High** | Not addressed. Integration approach not specified. |
| T-02 | Intake data captured at the front door is insufficient to populate downstream team workflows. Each team has specialist data requirements that cannot be surfaced at intake without creating a form too complex for requesters. | **High** | **High** | Not addressed. Data model not designed. |
| T-03 | Third-party integrations may not support bidirectional data exchange, making status tracking aspirational rather than functional. | **Medium** | **Medium** | Not identified in brief. |
| T-04 | Risk-scoring logic for fast-track triage depends on deterministic rules applied to requester-supplied data. If risk requires contextual specialist judgment, the fast-track cannot be automated. | **High** | **High** | Partially flagged — fast-track requires internal risk review approval (outstanding). |
| T-05 | SSO team integration creates a hard technical dependency. If SSO is a bottleneck team with its own queue, front-door speed gains are absorbed backstage. | **Medium** | **High** | Not addressed. |

### Category 3: Organisational Risk

| ID | Risk | Probability | Impact | Current Mitigation |
|----|------|-------------|--------|-------------------|
| O-01 | No single function has been granted authority over all six teams. Without explicit organisational authority, the "single front door" is a coordination aspiration, not a structural reality. | **High** | **High** | Not addressed. |
| O-02 | Teams resist decommissioning their existing intake channels because those channels give them control over their own queue. Cybersecurity and Legal are particularly likely to resist, citing professional liability. | **High** | **High** | None. No change management plan referenced. |
| O-03 | Ownership of the front door itself is unassigned. When the service fails, there is no accountable owner to escalate to. | **High** | **High** | Not addressed. |
| O-04 | App Packaging team has different throughput constraints to Legal. Consolidating intake does not consolidate capacity. If one team is a bottleneck, all fast-tracked requests still wait. | **High** | **Medium** | Not addressed. Capacity mapping not referenced. |
| O-05 | Pilot team selection will not surface multi-team coordination failures if the pilot runs with only one cooperative team. | **Medium** | **High** | Pilot approach referenced but not scoped. |

### Category 4: Governance Risk

| ID | Risk | Probability | Impact | Current Mitigation |
|----|------|-------------|--------|-------------------|
| G-01 | Fast-track gaming: Requesters under-disclose risk to access fast-track. A low-risk-classified app is onboarded without cybersecurity review. A data breach, compliance violation, or licensing failure occurs. | **High** | **High** | None. Self-declaration is structurally gameable. |
| G-02 | Cybersecurity and/or Legal refuse to recognise fast-track decisions as sufficient authorisation and require their own review regardless. | **High** | **High** | Not addressed. Governance sign-off on fast-track criteria is outstanding. |
| G-03 | Regulatory or compliance obligations require specialist review for categories of app that requesters will not correctly identify at intake. | **Medium** | **High** | Not addressed. No legal mapping of mandatory review triggers. |
| G-04 | Supplier governance requirements (contract terms, vendor risk ratings, data processing agreements) cannot be assessed by requesters and are missed at intake. | **Medium** | **High** | Not addressed. |
| G-05 | Post-pilot, the fast-track approval criteria become de facto organisational policy without formal ratification, creating liability ambiguity if an incident occurs. | **Low** | **High** | Partially addressed — BA flags need for real go/no-go gate. |

### Category 5: Programme Risk

| ID | Risk | Probability | Impact | Current Mitigation |
|----|------|-------------|--------|-------------------|
| P-01 | Fast-track pathway is built into the pilot before internal risk review approval is received, then needs redesign mid-programme. | **Medium** | **High** | Partially flagged. Approval is outstanding. |
| P-02 | Pilot has no defined go/no-go gate. Programme continues to full rollout regardless of pilot performance because political commitments make stopping feel like failure. | **High** | **High** | BA has flagged this. Not yet addressed. |
| P-03 | Scope creep: the "single front door" mandate expands to include existing in-flight requests, renewals, and licence changes before the core flow is stable. | **Medium** | **Medium** | Not addressed. Scope boundary not defined. |
| P-04 | Volume assumptions (150–300 requests/year) are unvalidated. If actual volume is 80/year, the business case does not justify the investment. | **High** | **High** | Not addressed. No plan to validate volume before programme commitment. |
| P-05 | Dependencies between teams mean a delay in any one team's readiness blocks the entire pilot. | **Medium** | **High** | Not addressed. No dependency map referenced. |

---

## 2. Critical Assumption List

### CA-01 — "Low risk" can be determined at intake without specialist input
**Why load-bearing:** The entire fast-track pathway depends on this.
**What validates it:** Cybersecurity and Legal independently classify a sample of 30–40 historical requests using only requester-supplied intake data. Agreement rate >90% = passes. Below that = fails.
**What invalidates it:** Specialists identifying cases where requester-supplied information was insufficient or missed a material risk factor.

### CA-02 — Teams will decommission their existing intake channels
**Why load-bearing:** If any team maintains a parallel channel, the front door data becomes incomplete and the business case evaporates.
**What validates it:** Formal written commitment from each team lead — with their line manager's sign-off — specifying the decommission date. Verbal agreement in a workshop is not validation.
**What invalidates it:** Any team lead declining to commit, citing operational necessity or professional liability.

### CA-03 — A single function will be granted genuine authority over all six teams
**Why load-bearing:** Without this authority, every design decision that affects more than one team becomes a negotiation that cannot be resolved.
**What validates it:** A named individual with documented authority ratified at Director or C-suite level, covering all six teams, with the ability to mandate (not recommend) process changes.
**What invalidates it:** Programme governance that operates by consensus, or where any one team can effectively veto decisions by non-compliance.

### CA-04 — Annual request volume is sufficient to justify the programme
**Why load-bearing:** Volume is the multiplier on everything in the business case. Wrong volume = wrong programme size.
**What validates it:** A retrospective count of actual onboarding requests across all six teams for the past 24 months from Jira data, deduplicated across channels.
**What invalidates it:** Volume below 100/year (business case fails) or above 400/year (pilot scope fails).

### CA-05 — Requesters accurately know and will correctly report what they are requesting
**Why load-bearing:** Intake data quality determines routing accuracy, fast-track eligibility, team workload, and SLA measurement.
**What validates it:** Interviews with 8–12 requesters who have submitted in the past 12 months — what information did they have at point of request vs. what they had to look up?
**What invalidates it:** Requesters reporting they routinely did not know vendor risk categories, data classifications, or licensing terms at point of request.

---

## 3. Mitigation Strategies — High/High Risks

### UA-01 / O-01 / O-02 — Channel consolidation failure
**Specific mitigation:** Before the pilot launches, require each of the six team leads to sign a channel decommission agreement specifying: (a) the date their existing intake route closes, (b) how they will redirect requests that arrive via old channels, and (c) their line manager's countersignature.

Track the volume of requests arriving at each team directly during the pilot as a leak metric. A leak rate above 10% is a programme failure indicator, not a user education problem.

### UA-02 / G-01 — Fast-track gaming through risk under-disclosure
**Specific mitigation:** Remove requester self-declaration as the sole input to fast-track triage. Fast-track eligibility criteria must reference only attributes that can be verified independently (e.g., vendor already on approved vendor list, app type on approved category list, no data processing agreement required based on data type).

Implement a post-onboarding audit sample: a random 10% of fast-tracked apps receive a retrospective specialist review within 60 days. If the audit finds systematic misclassification, the fast-track is suspended until criteria are revised.

### T-01 / T-02 — Integration failure
**Specific mitigation:** Conduct a data mapping exercise before any technical build begins. Each team must document: (a) minimum data fields required to action a request, (b) fields currently missing that they have to chase, (c) any mandatory fields a requester cannot supply without specialist assistance.

The intake form can only be finalised after this exercise. Pilot with the two teams with the least complex integration requirements and highest volume share first.

### O-03 — No accountable owner for the front door
**Specific mitigation:** Name a single accountable individual — not a team or committee — with authority ratified at Director level before the pilot launches. This person must have decision rights over intake form design, escalation authority over inter-team disputes, and a mandate to reject requests arriving outside the front door.

If the organisation cannot name this person before pilot launch, the pilot should not launch.

### P-02 — Pilot has no real go/no-go gate
**Specific mitigation:** Define go/no-go criteria before the pilot begins. Proposed minimum threshold: (a) leak rate below 10%, (b) intake data completeness above 85%, (c) all six team leads confirming routed data is actionable, (d) elapsed time for standard requests stable or improved vs. baseline.

Agree and sign off these criteria before the pilot starts. Document them visibly to stakeholders.

### G-02 — Cybersecurity and Legal refuse to honour fast-track decisions
**Specific mitigation:** Convene a formal governance alignment session with Cybersecurity and Legal leads before the fast-track pathway is designed. Purpose: determine whether there is a category of app they will accept without additional review. If no such category exists, there is no fast-track. Do not build a fast-track and then present it for sign-off.

---

## 4. Go/No-Go Recommendation

### 4a. Pilot — Conditional Go

Do not proceed until three pre-conditions are satisfied:

**Pre-condition 1:** A named individual with Director-level mandate over all six teams must be designated before launch.

**Pre-condition 2:** Pull two years of historical request data from all six teams. Validate volume before business case commitment. Takes one week. Do this now.

**Pre-condition 3:** Channel decommission commitments in writing from all six teams. If any team declines, scope the pilot around the teams that commit and document that the pilot does not represent a full single-front-door model.

### 4b. Fast-Track Pathway — No-Go

Do not build the fast-track pathway until four conditions are met:

**Condition 1:** Internal risk review approval received and documented.

**Condition 2:** Cybersecurity and Legal define the fast-track criteria — they are not presented with criteria to ratify. If they cannot define a category of app they will accept without review, there is no fast-track.

**Condition 3:** Triage logic must not rely on requester self-declaration of risk level. Use verifiable, objective criteria only.

**Condition 4:** A post-onboarding audit mechanism must be designed before the pathway launches.

---

## Handoff Note to Requirements Writer

### The risk most dangerous and least visible
**Assumption CA-05 combined with risk UA-02:** Requesters won't know what they're being asked, and will have a structural incentive to under-report risk. This manifests silently — the intake form appears functional but returns systematically wrong data. Becomes visible when a fast-tracked app causes an incident, or when backstage teams start logging information-chase rates. If the design bakes in a self-declaration model, the problem cannot be fixed by better user guidance — it requires a structural redesign of the triage logic.

### Conditions the design specification must honour

1. **Fast-track eligibility must not be determined by requester self-declaration of risk level.** Criteria must be objective and independently verifiable. Requester-selected risk tiers are a design defect, not a design choice.

2. **The specification must define an accountable owner role as a first-class service component.** Who owns the front door service; what authority they hold; what the escalation path is; what happens when routing produces a dispute.

3. **The intake form data fields must be outputs of the downstream team data-mapping exercise, not inputs to it.** Any prototype or technical build based on a pre-exercise form is invalidated when the exercise completes.

### Structural risks the client must resolve before pilot

1. **Organisational authority must be assigned before the pilot launches.** This is an executive decision, not a design question. If it cannot be named, the pilot has already identified its own ceiling.

2. **Internal risk review approval for the fast-track must be received before any fast-track design work begins.** No design resources should be allocated to this pathway until approval is received.
