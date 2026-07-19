# Experiment Design — Application Onboarding Redesign
### Experiment Designer (ED) | Test (Enterprise) | 2026-04-08

---

## Framing note

The prototype brief has confirmed that a JSM prototype will be built and tested. The Experiment Designer's role here is not to ask "should we prototype?" — that decision is made. The role is to:

1. Flag which critical assumptions cannot be tested through the prototype and require a different approach
2. Harden the prototype into a rigorous experiment with explicit protocols, signal quality standards, and pass/fail gates
3. Sequence the experiments in the order that maximum risk-reduction per unit of effort

The prototype is the right vehicle for H1–H4. The assumptions that could sink the programme before the prototype is even tested (CA-01, CA-02, CA-04) require separate, lower-cost experiments that should run in parallel — not after.

---

## Assumption priority ranking

Ranked by: consequence if false × current validation status

| Rank | Assumption | If false | Testable by prototype? | Current status |
|---|---|---|---|---|
| 1 | **CA-01**: Director-level service owner can be named | Programme becomes coordination aspiration, not structural reality. All volume/adoption metrics become unreliable. | No — requires a leadership decision | Unresolved |
| 2 | **CA-02**: All six teams will decommission direct intake channels | Single front door becomes a seventh channel. Adoption metrics are meaningless. | No — requires organisational commitment | Unresolved |
| 3 | **CA-04**: Request volume is 150–300/year | Business case does not hold at <100/year. North Star metric denominator is wrong. | No — requires data extraction | Unresolved |
| 4 | **CA-03**: Fast-track triage criteria can be defined objectively | Fast-track cannot be launched safely. Governance failure risk activates. | Yes — H4 tests this directly | In progress (prototype) |
| 5 | **CA-05**: Six JSM instances can share intake routing | Technical integration fails; routing becomes a manual handoff layer | Partially — platform decision confirmed JSM | Partially resolved |

**Rule applied:** The riskiest assumptions are tested first. Running H1–H4 while CA-01 and CA-02 remain untested means the team could prove the front door works with users and still be unable to launch.

---

## Experiment 1 — CA-01: Service owner authority

**Assumption:** A named Director-level individual with formal authority over all six teams can be secured before programme launch.

**Why this is not an experiment:** This assumption cannot be tested empirically. There is no test design that produces a valid signal. A Director expressing willingness to be named is not the same as a Director being formally appointed with confirmed authority. This is a structural risk — a programme pre-condition that requires a governance decision, not a product decision.

**Recommended action (not an experiment):**
- Raise at next steering group or executive sponsor meeting
- Request a formal decision with a named owner and documented scope of authority
- If the answer is "we'll sort that later," the programme should not proceed to pilot — the front door will be a seventh channel regardless of how well the prototype tests

**Handoff flag to requirements-writer:** Every backstage process step in the service blueprint that depends on the service owner (routing rules, SLA enforcement, channel decommission authority) is marked as unresolvable until CA-01 is confirmed. Do not design these steps as if the authority exists.

---

## Experiment 2 — CA-02: Channel decommission commitment

**Assumption:** All six reviewing teams will formally commit to closing their direct intake channels when the single front door goes live.

**Experiment type:** Structured commitment exercise (not a prototype test — a stakeholder test)

**Why this must run before the pilot, not after:** The channel consolidation progress metric (Input Metric 5 from the strategy) only has meaning if decommission is actually planned. A prototype that tests beautifully with users proves nothing about whether those users will be directed to use the front door if their previous channel still exists.

**Test design:**

*We believe that all six team leads will sign a written commitment to decommission their direct intake channels if the service owner is named and the decommission date is specific and reasonable. We will know this is true when all six team leads have returned signed commitments within four weeks of the service owner being named.*

- Document format: a one-page commitment letter specifying the team, the channels being decommissioned, the decommission date, and the line manager countersignature
- Process: service owner presents the letter to each team lead individually (not in a group session — group dynamics will suppress honest resistance)
- Decommission date: set at least 8 weeks after front door pilot launch, to reduce urgency-based resistance

**Pass criterion:** All six letters returned with countersignature within four weeks of service owner confirmation.

**Fail criterion:** Any team lead declines, conditions the commitment on changes to the front door design, or requests to maintain a parallel channel "for exceptions." A conditional commitment is a failed commitment.

**If it fails:** The programme scope changes materially. The strategy's own handoff note states: "If wrong, the single front door becomes a seventh intake channel — a different strategic frame would be needed." Do not proceed to full pilot if any team fails to commit. A pilot with five committed teams and one holdout is not a single-front-door pilot.

**Resources required:** Service owner's time (once named), template letter (1 day to draft), four-week collection window.

---

## Experiment 3 — CA-04: Request volume validation

**Assumption:** Annual request volume across all six teams is 150–300 requests per year.

**Experiment type:** Data archaeology

*We believe that the organisation receives 150–300 genuine new application onboarding requests per year across the six reviewing teams. We will know this is true when a 24-month pull from all six Jira instances produces a count of 125–350 distinct, non-duplicate new-app onboarding tickets (allowing for ±15% data quality margin).*

**Test design:**

- Extraction scope: all six Jira service desk instances, 24 months back from extraction date
- Ticket filter: new application onboarding requests only — exclude access requests to existing apps, licence renewals, and app decommission tickets
- Deduplication: same requester + same app within a 90-day window = one request
- Quality check: manual sample of 10% of extracted tickets to validate categorisation accuracy

**Pass criterion:** 125–350 unique new-app onboarding tickets identified across 24 months (62–175 per year). Business case ROI projections (£90k–£160k savings) are based on this range.

**Fail criterion:** Fewer than 100 tickets per year. At this volume, the process overhead of a centralised front door may exceed the efficiency gain — the business case does not hold and the North Star metric denominator is too small to produce statistically meaningful results from a pilot.

**Stretch fail:** More than 400 tickets per year. At this volume, the pilot design (manual triage, manual routing) will not scale to full rollout without additional tooling not currently scoped.

**Resources required:** Jira admin access to all six instances, 3–4 days of analyst time for extraction and deduplication, output in a shared spreadsheet.

**Dependency:** This experiment can run immediately — it does not require CA-01 to be resolved first. Run it in parallel with the prototype build.

---

## Experiment 4 — H4 (CA-03): Triage self-declaration produces unreliable classifications

**Assumption:** If any fast-track triage criterion relies on requester self-assessment rather than verifiable fact, requesters will describe their apps in ways that produce fast-track eligibility — even when objective criteria would route to standard review.

**Experiment type:** Adversarial prototype test (deliberate scenario design)

*We believe that requesters will optimistically describe their apps in ways that produce fast-track classifications even when the objective answer should be "standard review." We will know this is confirmed when ≥30% of test participants, given a scenario that should clearly route to standard review, produce a submission that the triage logic classifies as fast-track — and a reviewer participant independently agrees the submission should be standard.*

**Why we want this hypothesis to be TRUE:** Confirming this risk at prototype stage costs nothing. Discovering it after pilot launch means a governance failure has already occurred.

**Test design:**

*Participant setup:*
- 4–6 requester participants (business users across different teams — not IT-literate)
- 2 reviewer participants (one from Cybersecurity, one from Supplier Governance — the two teams most likely to challenge a misclassification)

*Scenario design (adversarial):*
Design two test scenarios where the correct classification is clearly "standard review":
- Scenario A: An app that processes employee data (C3 = false) but the app description is ambiguous ("collaboration tool with reporting features")
- Scenario B: An app with no explicit SOC2/ISO27001 certification listed on the vendor's website, but the vendor is well-known

*Protocol:*
1. Requester participants complete the intake form using the scenario brief — no prompting or guidance on triage criteria
2. The triage logic classifies the submission
3. Reviewer participants independently assess the same scenario brief and state their expected classification
4. Compare: requester-generated classification vs. reviewer-expected classification

*Signal quality note:* Participants must not be told this is a triage accuracy test. Brief them as a general usability test of the intake form. If they know you are testing triage accuracy, they will answer more carefully than real users will.

**Pass criterion (risk confirmed):** ≥30% of requester-generated submissions for adversarial scenarios produce a fast-track classification that at least one reviewer participant would overturn. This confirms the design risk and informs the triage hardening work.

**Fail criterion (risk not found):** All requester submissions for adversarial scenarios route to standard review, and reviewer participants agree with the classifications. This reduces (but does not eliminate) concern about self-declaration gaming.

**What to do with the result:**
- If confirmed: replace any triage criterion that relies on requester-supplied description with a verifiable-document-only criterion. This is non-negotiable before pilot launch (D-02).
- If not confirmed: note that the provisional triage criteria are performing as intended under test conditions, but maintain the D-02 session with Cybersecurity and Legal before piloting.

---

## Experiment 5 — H1: App discovery reduces duplicate submissions

**Assumption:** If the app catalogue is searchable by function and plain-language description, requesters will find and check existing apps independently before submitting a new request.

**Experiment type:** Prototype usability test (TD-01 full build)

*We believe that business requesters who need an app will check the catalogue before submitting a new request — without being instructed to do so — if the catalogue is findable from the main service entry point and results are described in function-first, plain language. We will know this is true when ≥70% of test participants navigate to the catalogue independently and search it before proceeding to the intake form, measured across a 5-person moderated test.*

**Test design:**

- 5 participants: business users who have never used the prototype. Mix of tech-comfortable and tech-averse requesters.
- Scenario: "You want to start using [tool name] for your team. Here is the service. What would you do first?" — no mention of catalogue, no prompting.
- Observer records: does the participant navigate to the catalogue before the intake form? Does their first action on the catalogue page involve search or browse?
- Do not intervene. If a participant goes directly to the intake form, note it and continue.

**Pass criterion:** ≥4 of 5 participants navigate to the catalogue independently and search it before proceeding to the form.

**Fail criterion:** ≥2 participants skip the catalogue entirely, or the majority search by exact app name (not function) — indicating the catalogue entry points or search design is failing to surface functional discovery.

**What to watch for specifically:**
- Participants searching by app name only (naming behaviour, not need behaviour)
- Participants who find a match but do not understand the "Request access" vs. "Request new app" distinction
- Placeholder app descriptions that don't match the scenario's implied need

---

## Experiment 6 — H2: Front door produces complete submissions

**Assumption:** If intake form fields match what reviewers actually need, submissions will arrive complete — reviewers can act without chasing.

**Experiment type:** Dual-participant prototype test (requesters + reviewers, TD-02 full build)

*We believe that reviewer participants can act on ≥80% of test submissions produced by requester participants without requesting additional information. We will know this when, in a structured review of 5 test submissions by 2 reviewer participants, fewer than 1 submission in 5 requires an RFI to proceed.*

**Test design:**

Phase 1 — Requester session:
- 5 requester participants complete the intake form using a standard scenario brief
- Do not observe them — let them complete independently
- Capture completed submissions

Phase 2 — Reviewer session (separate, within 48 hours):
- 2 reviewer participants (one from App Packaging, one from Cybersecurity)
- Show each participant the 5 submissions
- Ask: "Could you begin your review of this request as submitted? What, if anything, would you need to ask the requester before you could act?"
- Record: how many submissions require additional information, which specific fields are missing or unclear

**Pass criterion:** ≥4 of 5 submissions reviewed without the reviewer identifying a missing-field blocker.

**Fail criterion:** ≥2 submissions require an RFI from either reviewer. Note which fields caused the gap — this directly informs the D-01 data-mapping exercise.

**Signal quality note:** The reviewer participants must be real reviewers from the actual teams — not service design team members roleplaying reviewers. The signal from surrogate reviewers is not valid for this test.

---

## Experiment 7 — H3: Confirmation screen reduces status-chasing intent

**Assumption:** A clear confirmation with reference number, reviewing teams named, and an honest SLA range is sufficient to reduce status-chasing intent — even though the 7–30 day range is wide.

**Experiment type:** Post-task interview following prototype test

*We believe that requesters who receive a well-designed submission confirmation will report that they would wait without chasing or escalating within the first week — even with a 7–30 day SLA range. We will know this is true when ≥4 of 5 debrief participants describe the confirmation as "enough to wait" and say they would not send a follow-up email or contact the reviewing team within seven days.*

**Test design:**

- Immediately after completing the Experiment 6 (intake submission) task, participants view the confirmation screen
- Post-task interview questions (ask in this order, do not lead):
  1. "What would you do next after seeing this screen?"
  2. "How long would you wait before following up?"
  3. "Is there anything on this screen that doesn't feel right or that you'd want to be different?"
  4. "If you had a colleague who needed to approve this — what would you tell them at this point?"

**Pass criterion:** ≥4 of 5 participants state unprompted that they would wait at least one week without follow-up. Participants can describe what they'd check (reference number, email confirmation) but should not express intent to contact a reviewer directly.

**Fail criterion:** Any participant says they would email a reviewer, their line manager, or IT helpdesk within the first week regardless of the confirmation. Or: the majority describe the 7–30 day range as "too vague to trust."

**What to watch for:** Is the SLA range (7–30 days) so wide that it creates distrust rather than managing expectations? Fast-track participants (classified by triage as fast-track) should be tested against the tighter 7–10 day estimate to see if this improves trust.

---

## Sequencing and resource plan

| Experiment | Runs when | Blocks what | Resources |
|---|---|---|---|
| E3 — Volume validation | Now (parallel to prototype build) | Pilot scope decision | Jira admin + analyst, 3–4 days |
| E2 — Channel decommission | After CA-01 confirmed | Pilot launch | Service owner time, 4-week window |
| E4 — Triage adversarial test | During prototype test | Fast-track pilot launch | 6 requester + 2 reviewer participants |
| E5 — H1 App discovery | During prototype test | TD-01 design approval | 5 business user participants |
| E6 — H2 Intake completeness | During prototype test | TD-02 design approval + D-01 | 5 requesters + 2 real reviewers |
| E7 — H3 Status-chasing intent | During prototype test (post-task) | Confirmation screen design | No additional participants |
| CA-01 — Service owner | Now (structural) | Everything | Executive sponsor / steering group |

**Total participant requirement for prototype testing:** 5–6 business users (requesters), 2–3 real reviewers from different teams, moderated by one facilitator. No more than 3 sessions over 2 days.

---

## Validation gate

Before experiments begin, the Product Lead reviews and approves:
- [ ] Pass/fail criteria are specific enough that a reasonable person could say yes or no
- [ ] Adversarial test scenarios (E4) are genuinely ambiguous — not obviously wrong
- [ ] Reviewer participants in E6 are real reviewers from the actual teams (not proxies)
- [ ] CA-01 and CA-02 have been escalated to the appropriate level before prototype testing begins
- [ ] E3 (volume validation) has been initiated in parallel with prototype build

---

## Handoff note to Requirements Writer

**What is validated enough to build:**
- The prototype build for TD-01 and TD-02 is the right next step — the experiments above are designed to run against it, not before it
- The provisional intake form field set (Section 4 of prototype brief) is appropriate as a prototype starting point
- The 5-criterion triage logic (C1–C5) is appropriate for the prototype, with the explicit caveat that E4 is designed to break it

**What is not yet validated:**
- Service owner authority (CA-01) — do not design any backstage process step as if this is confirmed
- Channel decommission (CA-02) — the pilot cannot launch until E2 is complete
- Request volume (CA-04) — the business case ROI figures carry a HIGH uncertainty flag until E3 is complete
- Fast-track triage accuracy (CA-03) — if E4 confirms the risk, the triage criteria must be hardened before D-02

**The single riskiest thing the team could do right now:** Build the full prototype, run the usability tests, pass H1–H3, and then discover that CA-01 cannot be resolved — making every test result irrelevant. Run CA-01 resolution and E3 in parallel with the prototype build. Do not let the prototype create false confidence that the programme is on track.

**What the team is ready to build:** The front door (TD-01 and TD-02). The backstage process steps depend on CA-01 and CA-02. Build the front door. Prove it works. Then close the structural risks.

---

*Experiment Designer (ED) | Validation gate: pending Product Lead review*
