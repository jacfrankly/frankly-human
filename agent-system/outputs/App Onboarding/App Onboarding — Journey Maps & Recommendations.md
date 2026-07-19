# Application Onboarding Redesign
## Service Design Synthesis Report

**Client:** Test (Enterprise, 1,000+ employees)
**Date:** 8 April 2026
**Prepared by:** Service Design â€” Synthesis of Research, Strategy, and Risk Outputs
**Status:** Draft for client review

---

---

# DELIVERABLE 1: USER JOURNEY MAPS

---

## Journey Map 1: Business User (Requester)

### AS-IS Journey â€” Current State

| Row | 1. Trigger | 2. Discovery | 3. Finding the intake point | 4. Submission | 5. Waiting | 6. Escalation | 7. Outcome |
|---|---|---|---|---|---|---|---|
| **Stage** | Need identified | Search for existing app or process | Locate the right desk | Submit request | Wait for response | Chase or escalate | Receive outcome (or abandon) |
| **User action** | Business user identifies a need for a new third-party application | Searches intranet, asks colleagues, checks previous emails | Finds a Jira service desk (often the wrong one); submits anyway or asks IT helpdesk | Fills in form with available information; submits to whichever desk they found | Waits; no acknowledgement or tracker; follows up via email | Emails the desk; escalates through manager; submits duplicate ticket to another desk | Receives rejection, approval, or no response; either uses app without approval or abandons |
| **Touchpoint** | Internal meeting, email from colleague, external vendor | Intranet search, colleague conversation, email thread | Jira service desk (one of several), IT helpdesk email | Jira form, email | Email inbox, calendar reminders to self | Email, management chain, second Jira ticket | Email notification, Jira status update (if any) |
| **Thoughts** | "I need this app to do my job. How do I get it approved?" | "I can't tell if this already exists. I'll just ask around." | "I'm not sure this is the right place but I'll try it." | "I don't know what half these fields mean. I'll guess." | "No one has responded. Is my ticket lost? Did I do it wrong?" | "I'll have to get my manager involved. This is embarrassing." | "Finally. / I give up. / I'll just use it and hope no one notices." |
| **Feelings** | Motivated, neutral â€” medium + | Confused, uncertain â€” medium - | Uncertain, anxious â€” medium - | Resigned, uncertain â€” medium - | Frustrated, powerless â€” high - | Stressed, embarrassed â€” high - | Relieved (if resolved) or resigned/resentful â€” high +/- |
| **Pain points** | No prompt to check whether an equivalent app already exists [RESEARCHED] | No authoritative app catalogue; intranet search is unreliable [RESEARCHED] | Multiple Jira desks with no clear differentiation; wrong submissions are common [RESEARCHED] | Form fields misaligned with what requesters know; no guidance on what information is needed [INFERRED] | No status visibility; no acknowledgement SLA [RESEARCHED] | Escalation through management creates political cost; duplicate submissions increase governance workload [RESEARCHED] | Rejection reasons are unclear; no resubmission guidance; some users bypass process entirely [RESEARCHED] |
| **Opportunities** | Trigger a catalogue check at the point of need | Build a searchable, authoritative app catalogue as the first screen | Single front door with clear routing logic; kill all other intake channels | Progressive disclosure form; plain-English field guidance; pre-population where possible | Real-time status tracker tied to a reliable backstage workflow | Eliminate the need for escalation through proactive comms and SLA transparency | Clear outcome communications with next steps; rejection letters with resubmission path |

---

### TO-BE Journey â€” Redesigned State

| Row | 1. Trigger | 2. Discovery | 3. Single intake | 4. Submission | 5. Tracking | 6. Decision comms | 7. Outcome and use |
|---|---|---|---|---|---|---|---|
| **Stage** | Need identified | Check catalogue first | Submit via single front door | Guided submission | Transparent waiting | Proactive decision notification | Clear outcome and onboarding |
| **User action** | Business user identifies need; prompted to check the app catalogue before submitting | Searches the catalogue; either finds an approved app (request ends) or confirms it is genuinely new | Navigates to the single onboarding portal â€” the only intake channel | Completes a guided form; triage questions route the request appropriately; confirmation and reference number issued automatically | Logs into portal to view live status; receives proactive email updates at defined milestones | Receives a clear decision notification â€” approved, conditionally approved, or rejected with reasons and next steps | Gains access to the app or understands exactly what to do next; no chasing required |
| **Touchpoint** | Intranet prompt or portal landing page | Onboarding portal â€” app catalogue module | Onboarding portal (web or mobile) | Onboarding portal form | Portal status tracker, email notifications | Email notification, portal outcome screen | IT provisioning, portal closure notification |
| **Thoughts** | "Let me check if this already exists before I submit." | "It's not in the catalogue â€” I can proceed to request it." | "There is one place to go. Good." | "The form is asking me sensible questions and I know how to answer them." | "I can see where my request is and what's happening. I don't need to chase." | "I understand the decision and what it means for me." | "I know what happens next. This felt manageable." |
| **Feelings** | Neutral, purposeful â€” medium + | Informed, efficient â€” medium + | Confident â€” medium + | Guided, competent â€” medium + | Patient, reassured â€” low - | Clear, satisfied or disappointed-but-informed â€” medium +/- | Resolved â€” high + |
| **Pain points addressed** | Catalogue check prevents duplicate submissions before they occur | Authoritative catalogue removes ambiguity about existing provision | Single channel removes routing confusion entirely | Guided form removes guesswork; triage replaces requester self-classification | Status tracker removes need to chase; proactive comms replace silence | Clear decision language removes ambiguity about outcome | No abandonment; no shadow use; no management escalation |
| **Design constraints** | Catalogue must be accurate and maintained â€” stale data recreates the problem [RISK] | Catalogue search must be fast and findable â€” not buried in the portal [INFERRED] | All existing Jira desks must be decommissioned or this becomes a seventh channel [STRATEGY] | Triage questions must be designed after team data-mapping â€” not before [STRATEGY] | Status tracker is only credible if the backstage workflow is reliable [RISK] | Rejection communications must be drafted with Legal and governance teams [INFERRED] | Provisioning handoff must be defined in the service design â€” portal cannot end at approval [ASSUMED] |

---

---

## Journey Map 2: Technology User (App Sponsor / Owner)

### AS-IS Journey â€” Current State

| Row | 1. Tagged as sponsor | 2. Understanding obligations | 3. Coordinating across teams | 4. Chasing and tracking | 5. Communicating back | 6. Post-approval |
|---|---|---|---|---|---|---|
| **Stage** | Assigned sponsorship of a request | Determining what is required and from whom | Engaging App Packaging, Legal, Cyber, SLM, SSO | Tracking progress across desks | Reporting status to the business user | Managing post-onboarding obligations |
| **User action** | Receives notification (often ad hoc â€” email or verbal) that they are the app sponsor; no briefing provided | Researches obligations independently; asks colleagues; reads old emails; finds no single source of truth | Contacts each of the six teams separately; provides information repeatedly; chases each individually | Maintains a personal spreadsheet of in-flight requests; cross-references Jira tickets manually | Gives estimates to business users based on gut feel; unable to commit to firm dates | Assumes ongoing obligations exist but has no formal record of what they are or when reviews are due |
| **Touchpoint** | Email, verbal, Jira assignment | Email, intranet, colleague conversation | Six separate Jira service desks, email, ad hoc meetings | Personal spreadsheet, email, Jira (across multiple desks) | Email, instant messaging, informal updates | Email reminders (self-managed), no system-generated obligation tracker |
| **Thoughts** | "I've been made a sponsor. What does that actually mean?" | "I can't find a clear list of what I need to do or who owns what." | "I'm repeating myself to every team. Why doesn't this flow automatically?" | "I have no idea where this actually is. I'm making this spreadsheet up as I go." | "I'm giving this person a date I can't back up. This will come back on me." | "I think there are annual reviews I'm supposed to do. I'm not sure." |
| **Feelings** | Competent but uninformed â€” medium +/- | Anxious, uncertain â€” medium - | Frustrated, overwhelmed â€” high - | Stressed, accountable without control â€” high - | Exposed, uncertain â€” high - | Worried, unsupported â€” medium - |
| **Pain points** | No formal sponsor briefing or onboarding [RESEARCHED] | No single source of truth for obligations; each team holds its own requirements [RESEARCHED] | Information is re-entered at each desk; no shared data model between teams [RESEARCHED] | Shadow spreadsheets are the only tracking mechanism available [RESEARCHED] | ETAs are guesses; sponsor credibility suffers when they are wrong [RESEARCHED] | Post-onboarding obligations are informal, undocumented, and easy to miss [INFERRED] |
| **Opportunities** | Formal sponsor brief triggered automatically on assignment | Single obligations register visible to sponsor from day one | Shared intake model â€” information entered once, routed to all relevant teams | Sponsor-facing dashboard showing real-time status across all workstreams | System-generated ETAs based on actual SLAs, not sponsor estimates | Post-approval checklist with calendar-triggered reminders for reviews |

---

### TO-BE Journey â€” Redesigned State

| Row | 1. Tagged as sponsor | 2. Understanding obligations | 3. Single submission | 4. Coordinated review | 5. Communicating back | 6. Post-approval |
|---|---|---|---|---|---|---|
| **Stage** | Formally assigned with briefing | Clear obligations from intake | Information entered once | Backstage coordination is invisible to sponsor | Confident, accurate status updates | Managed post-onboarding obligations |
| **User action** | Receives formal sponsor assignment via portal with a structured briefing document and checklist | Reviews obligations register in the portal â€” a clear list of what is required, by when, and from whom | Completes a single guided intake form; information is routed automatically to all relevant teams | Monitors a sponsor dashboard showing status across all workstreams; receives alerts when action is required | Shares portal status link with business user; no guesswork; updates are system-generated | Receives post-approval obligation pack; calendar reminders triggered for reviews and renewals |
| **Touchpoint** | Portal notification, structured briefing document | Portal â€” obligations register | Onboarding portal â€” single form | Sponsor dashboard, email alerts | Portal status link (shareable), email | Portal â€” post-approval module, calendar integration |
| **Thoughts** | "I know exactly what I've taken on and what I need to do." | "Everything I need to know is in one place." | "I entered the information once. The system handled the routing." | "I can see where every workstream is without chasing anyone." | "I'm giving this person accurate information from the system, not a guess." | "I have a clear record of what I need to do and when." |
| **Feelings** | Confident, informed â€” medium + | Competent, in control â€” medium + | Efficient, trusted â€” medium + | Reassured, in control â€” medium + | Credible, professional â€” high + | Supported, accountable â€” medium + |
| **Pain points addressed** | Formal briefing eliminates the "what does sponsor mean?" confusion | Obligations register removes the need to research independently | Single form removes repeated data entry across teams | Dashboard replaces shadow spreadsheets | System ETAs replace guess-based communication | Post-approval module removes obligation drift |
| **Design constraints** | Briefing content must be co-designed with all six teams [INFERRED] | Obligations register must be maintained â€” a static document becomes stale [RISK] | Data-mapping exercise must precede form design to ensure all team needs are captured [STRATEGY] | Backstage workflow reliability is a precondition for dashboard credibility [RISK] | Status data must reflect real workflow state â€” not a manual update from a team member [RISK] | Post-approval obligations must be formally agreed by all teams before the module is built [ASSUMED] |

---

---

## Journey Map 3: Governance User (Reviewer)

### AS-IS Journey â€” Current State

| Row | 1. Request received | 2. Initial triage | 3. Information gathering | 4. Cross-team coordination | 5. Assessment | 6. Decision and communication |
|---|---|---|---|---|---|---|
| **Stage** | Receive a request into own desk | Assess completeness | Chase missing information | Coordinate (or not) with other teams | Conduct review | Communicate decision |
| **User action** | Receives a Jira ticket into team-specific desk; may also receive duplicates of the same app from different routes | Reads the submission; discovers essential fields are missing or ambiguous | Emails requester or sponsor to chase missing data; may go back and forth multiple times | Conducts review in isolation; may not know other teams are reviewing in parallel; no shared view | Completes own team's assessment; no visibility of whether the app has been assessed before | Communicates decision via Jira comment, email, or informal message; no standard template |
| **Touchpoint** | Jira service desk (team-specific), email | Jira ticket, team inbox | Email, phone, Jira comments | Email, ad hoc meeting, no shared system | Own team's tools and records | Jira comment, email, informal message |
| **Thoughts** | "Another incomplete ticket. I can't start work on this." | "I need at least three more pieces of information before I can assess this." | "I've sent three chasers. Still waiting." | "I don't know where Cybersecurity are up to. I hope we're not duplicating work." | "We approved something very similar six months ago. I'm doing this from scratch again." | "I don't know how to tell them this is rejected. There's no standard way to do this." |
| **Feelings** | Professionally engaged then immediately deflated â€” medium - | Frustrated with quality â€” high - | Overwhelmed by volume of chasing â€” high - | Isolated, uncertain â€” medium - | Capable but inefficient â€” medium - | Uncomfortable, exposed â€” medium - |
| **Pain points** | Incomplete submissions are the norm; no minimum viable data enforced at intake [RESEARCHED] | No intake validation; requesters don't know what's needed [RESEARCHED] | Information-chasing consumes significant reviewer time [RESEARCHED] | Teams review in isolation; no shared case management across the six teams [RESEARCHED] | Prior decisions are not systematically reused; every app starts from scratch [INFERRED] | No standard decision communication template; rejection is handled inconsistently [INFERRED] |
| **Opportunities** | Enforce minimum viable data at intake â€” nothing submitted without required fields | Intake form validated against each team's data requirements before submission | Information collected at intake, not chased after submission | Shared case management view; each team sees status of all workstreams | Decision library: prior approvals searchable by app category, vendor, or risk profile | Standardised decision communications; approved language for rejections and conditions |

---

### TO-BE Journey â€” Redesigned State

| Row | 1. Request received | 2. Triage | 3. Assessment | 4. Cross-team coordination | 5. Decision | 6. Communication |
|---|---|---|---|---|---|---|
| **Stage** | Receive a complete, valid request | Review triage output | Conduct substantive assessment | Coordinate within a shared case | Make and record a defensible decision | Communicate clearly via standard templates |
| **User action** | Receives a case via the shared platform; intake has already validated completeness; all required fields are present | Reviews automated triage output â€” risk classification, routing logic, and any flagged items â€” before beginning assessment | Conducts substantive review using complete intake data; checks decision library for prior decisions on similar apps | Views parallel workstream status; can flag a blocker or dependency to another team via the platform | Records decision with rationale in a structured decision log; decision is defensible and auditable | Sends decision notification via a system-generated, team-approved template; clear language for approvals, conditions, and rejections |
| **Touchpoint** | Shared case management platform, email notification | Platform â€” triage summary view | Platform â€” case file, decision library | Platform â€” cross-team status panel | Platform â€” decision recording module | Platform â€” decision communication module, email |
| **Thoughts** | "Everything I need is here. I can start work immediately." | "The triage has already done the initial classification. I can focus on the substantive issues." | "There's a prior decision for a very similar app. I'll reference it and note the differences." | "I can see Legal are still in progress. I'll flag that we're aligned on the risk classification." | "My decision is recorded, reasoned, and traceable. I'm comfortable with this." | "The communication is clear, professional, and consistent with how other teams communicate." |
| **Feelings** | Professionally engaged, ready â€” medium + | Efficient, focused â€” medium + | Competent, building on prior work â€” medium + | Collaborative, informed â€” medium + | Confident, professionally protected â€” high + | Professional, consistent â€” high + |
| **Pain points addressed** | Complete intake eliminates the incomplete-submission loop | Automated triage replaces manual classification from scratch | Decision library eliminates redundant assessment work | Shared case view eliminates parallel isolation | Structured decision recording creates audit trail | Standard templates eliminate inconsistent communication |
| **Design constraints** | Intake validation rules must be defined by each team in the data-mapping exercise â€” not assumed [STRATEGY] | Triage logic must be approved by Cybersecurity and Legal before it routes any real requests [RISK] | Decision library requires a data governance decision about what can be reused and under what conditions [INFERRED] | Shared case management requires a technology decision â€” this is not a form; it is a workflow platform [ASSUMED] | Decision log format must be agreed with Legal and compliance before the module is built [INFERRED] | Decision communication templates must be drafted and approved before go-live [INFERRED] |

---

---

# DELIVERABLE 2: RECOMMENDATIONS REPORT

---

## Executive Summary

### The Core Problem

The current application onboarding process at Test has no single point of entry, no shared data model, and no accountable owner. Requests enter the system through at least six separate Jira service desks, frequently land at the wrong team, and are routinely incomplete. Reviewers chase information rather than assess it. Sponsors maintain shadow spreadsheets because no shared tracking exists. Business users escalate through management or bypass the process entirely because the official route does not work reliably. The result is a service that costs between Â£260,000 and Â£496,000 per year in avoidable staff time and lost productivity â€” and that does not currently produce the outcome it exists to produce: a timely, defensible decision on whether a new third-party application is approved for use.

### The Recommended Approach

The recommended approach is a sequenced, evidence-gated programme beginning with a bounded pilot. Before any design or build work begins, three structural pre-conditions must be met: a named service owner must be appointed with Director-level authority over all six teams; request volume must be validated against existing Jira data; and all existing intake channels must be formally committed for decommission. If those conditions are met, the programme proceeds with a data-mapping exercise across all six teams, a governance alignment session to define triage criteria, and a pilot of the single front door â€” with fast-track explicitly excluded from the pilot scope. Fast-track is a separate work item with its own four conditions and its own go/no-go gate.

### The Three Conditions Before the Programme Proceeds

1. A named service owner is appointed with Director-level authority over App Packaging, Supplier Governance, Legal, Cybersecurity, Software License Management, and SSO â€” in writing, before any design work begins.
2. Request volume from existing Jira service desks is validated from historical data, and the volume figures are agreed as the basis for business case and pilot scope.
3. All six teams provide written commitment to decommission their existing intake channels upon pilot go-live â€” no exceptions.

---

---

## Current State Assessment

### What Is Broken

| Finding | Evidence Label | Source |
|---|---|---|
| There is no single intake point â€” requests enter via at least six separate Jira service desks | [RESEARCHED] | Business user and technology user research |
| Requesters routinely submit to the wrong desk, creating rework for all parties | [RESEARCHED] | Business user research |
| Intake forms are not designed around reviewer data requirements â€” submissions are routinely incomplete | [RESEARCHED] | Governance user research |
| Reviewers spend significant time chasing missing information rather than conducting assessments | [RESEARCHED] | Governance user research |
| There is no shared case management across the six teams â€” each reviews in isolation | [RESEARCHED] | Governance and technology user research |
| App sponsors maintain shadow spreadsheets as their only tracking mechanism | [RESEARCHED] | Technology user research |
| There is no authoritative app catalogue â€” requesters cannot check whether an app already exists | [RESEARCHED] | Business user research |
| Business users escalate through management or bypass the process when the official route fails | [RESEARCHED] | Business user research |
| Prior governance decisions are not systematically reused â€” every assessment starts from scratch | [INFERRED] | Governance user research, process analysis |
| Post-onboarding obligations are informal and undocumented â€” compliance drift is likely | [INFERRED] | Technology user research |
| There is no named owner of the end-to-end service â€” accountability is distributed and therefore absent | [ASSUMED] | Strategy architecture output, confirmed as critical risk |

### Root Causes

These are causes, not symptoms. Addressing symptoms â€” for example, improving a single form â€” without addressing these roots will not produce sustainable change.

1. **No end-to-end ownership.** The service is operated as six separate team processes with no coordinating authority. Each team optimises for its own workload, not the requester's outcome. No one is accountable for the full journey.

2. **No shared data model.** Each team's intake form was designed for its own needs. Information is not entered once and shared â€” it is requested repeatedly, in different formats, by different teams. This is the structural cause of incomplete submissions and repeated chasing.

3. **No triage at intake.** Requests are not classified before routing. All apps, regardless of risk profile, enter the same queue and receive the same level of scrutiny. Proportionate review is impossible without a validated triage model.

4. **No feedback loop to requesters.** The service produces no proactive communication. Status is invisible. The only way requesters know something has happened is if they chase â€” which they do, at high cost to both themselves and the teams receiving the chases.

5. **Channel proliferation by default, not design.** Multiple intake points exist because each team built its own, not because multiple points serve a user need. The addition of a new front door without decommissioning existing channels will add a seventh channel, not replace six.

### Cost of Inaction

Current estimated annual cost of the broken process: **Â£260,000â€“Â£496,000** (staff processing time, avoidable submissions, requester lost productivity). This figure is a modelled estimate based on available data â€” [INFERRED] â€” and should be validated against actual Jira ticket volumes before being used as a primary business case figure.

Post-redesign estimated annual saving: **Â£90,000â€“Â£160,000**.

The business case is assessed as **contingent/viable** â€” sufficient to justify a bounded pilot investment, not sufficient to justify full programme commitment without validation data. The cost of inaction includes not only the direct financial cost but the ongoing reputational cost of a service that drives users to bypass governance â€” a shadow IT risk that is not currently measured.

---

---

## Strategic Recommendations

### R1 â€” Appoint a Named Service Owner with Director-Level Authority

**Priority: Critical â€” this is a pre-condition for all other recommendations**

**Recommendation:** Before any design, build, or pilot work begins, a named individual must be appointed as the accountable service owner for the end-to-end application onboarding service. This person must hold Director-level authority (or equivalent) over all six teams: App Packaging, Supplier Governance, Legal, Cybersecurity, Software License Management, and SSO. The appointment must be documented and communicated to all team leads.

**Rationale:** The strategy architecture has identified this as the single most critical assumption underpinning the programme. Without a named owner with cross-team authority, every design decision will be subject to veto by individual teams, the decommissioning of existing channels will stall, and the service will fragment back into six separate processes within months of launch. All prior redesign attempts that have failed have done so, in part, because ownership was distributed. [RESEARCHED â€” confirmed in stakeholder outputs; structural pattern is assumed based on comparable programmes.]

**Expected outcome:** A single accountable decision-maker who can enforce channel decommissioning, resolve inter-team conflicts, set and hold SLAs, and report to leadership on service performance.

**Dependencies and pre-conditions:** This is itself a pre-condition â€” it has no dependencies within the programme, but it requires a sponsorship decision at leadership level before the programme begins.

---

### R2 â€” Validate Request Volume from Existing Jira Data

**Priority: Critical â€” pre-condition for business case and pilot scope**

**Recommendation:** Extract and analyse historical ticket data from all existing Jira service desks before any programme scope is committed. Specifically: total volume of requests per year by team; duplicate submission rate (same app submitted to multiple desks); incomplete submission rate; average elapsed time from submission to decision by team; and escalation rate.

**Rationale:** The business case figures (Â£260,000â€“Â£496,000 annual cost; Â£90,000â€“Â£160,000 saving) are modelled estimates. They are sufficient to justify investigation, not investment. The Risk Assessor has identified volume validation as a pilot pre-condition. Pilot design decisions â€” including team capacity, SLA design, and fast-track thresholds â€” cannot be responsibly made without real volume data. [ASSUMED â€” based on standard practice for business case validation in service redesign programmes.]

**Expected outcome:** A validated volume baseline that either confirms the business case or identifies where it needs to be revised. This baseline also provides the denominator for measuring pilot success.

**Dependencies and pre-conditions:** Access to Jira admin data across all six service desks. Requires buy-in from each team lead to provide export permissions.

---

### R3 â€” Conduct a Six-Team Data-Mapping Exercise Before Designing the Intake Form

**Priority: Critical â€” pre-condition for form design**

**Recommendation:** Run a structured data-mapping exercise with all six teams to produce a single agreed list of: (a) data fields required by each team to conduct their assessment; (b) fields that are shared across teams (to be entered once); (c) fields that are team-specific (to be routed selectively); (d) fields that teams currently request but that could be sourced from other systems (pre-population candidates); and (e) fields that teams request out of habit but do not actually use in assessments (candidates for removal).

**Rationale:** The strategy architecture has explicitly ruled out designing the form before this exercise is complete. The governance user research confirms that incomplete submissions are the primary source of reviewer friction â€” and incomplete submissions are a direct consequence of forms that were not designed around reviewer needs. [RESEARCHED] Designing another form without this exercise will reproduce the same problem.

**Expected outcome:** A single agreed data model that is the basis for the intake form. All six teams have signed off on what they need. The form, when designed, will produce submissions that reviewers can act on immediately.

**Dependencies and pre-conditions:** Requires the service owner (R1) to convene and chair the exercise. Requires all six team leads to participate and reach consensus. Should be completed before any form design or prototype work begins.

---

### R4 â€” Run a Governance Alignment Session to Define Verifiable Fast-Track Criteria

**Priority: Critical â€” pre-condition for any fast-track design**

**Recommendation:** Convene a formal session with Cybersecurity and Legal (minimum) to produce a written, agreed definition of "low risk" for the purposes of fast-track eligibility. The definition must be expressed in verifiable, objective terms â€” criteria that can be evaluated from system data or third-party sources, not criteria that rely on requester self-declaration. The output must be approved by both teams before any fast-track triage logic is designed.

**Rationale:** The Risk Assessor has identified the absence of this definition as a structural risk â€” no triage model can be validated until it exists. The strategy architecture has explicitly ruled out fast-track on self-declaration. The most dangerous hidden risk in the programme is that requesters will under-disclose risk to access fast-track, and this will fail silently, showing up as an incident rather than a process failure. [RISK â€” assessed by Risk Assessor.] This session is the gate that determines whether fast-track is ever built.

**Expected outcome:** A written, jointly approved definition of fast-track eligibility criteria. This document becomes the specification for the triage module. Without it, fast-track design cannot begin.

**Dependencies and pre-conditions:** Requires the service owner (R1) to mandate participation. Requires both Cybersecurity and Legal to commit to producing a verifiable definition â€” not a principles statement. The Risk Assessor's four fast-track conditions must all be met before the session output is used to begin design (see Fast-Track Pathway Assessment section).

---

### R5 â€” Build the App Catalogue Discovery Feature and Measure Duplication Rate

**Priority: High â€” first design output after pre-conditions are met**

**Recommendation:** The first user-facing feature to be designed and built is the app catalogue â€” a searchable, authoritative register of all approved third-party applications. Business users must be directed to search the catalogue before they can initiate a new request. The catalogue must be accurate at launch (requires a data exercise to establish baseline) and must have a named maintainer as part of the service owner's team. Measure duplication rate â€” requests for apps already approved â€” for the first 90 days.

**Rationale:** The business user research identifies the inability to discover existing apps as a primary pain point [RESEARCHED]. Every request for an app that already exists is a fully avoidable cost â€” for the requester, for the sponsor, and for all six reviewing teams. The catalogue is also the logical entry point for the single front door â€” it frames the service as "find before you request." Without a catalogue, the service has no memory and no way to reuse prior decisions.

**Expected outcome:** Measurable reduction in duplicate requests. A baseline duplication rate that can be used to quantify avoided cost. A foundation for the decision library used by governance reviewers.

**Dependencies and pre-conditions:** Requires a data exercise to populate the initial catalogue (source: existing approved app records held by teams). Requires a maintenance model â€” an unmaintained catalogue recreates the intranet problem. Requires the service owner (R1) to assign catalogue ownership.

---

### R6 â€” Define Pilot Go/No-Go Criteria Before the Pilot Launches

**Priority: High â€” governance of the programme itself**

**Recommendation:** Before the pilot launches, the programme team and the service owner must agree in writing: (a) the specific metrics that will be measured during the pilot; (b) the thresholds that constitute success; (c) the thresholds that constitute failure requiring intervention; and (d) the decision-making process for proceeding to full programme after the pilot. These criteria must be agreed before the pilot begins â€” not defined during it or retrospectively.

**Rationale:** The Risk Assessor has flagged pre-defined go/no-go criteria as a pilot pre-condition. Pilots without agreed success criteria tend to continue regardless of outcomes, because there is no agreed basis on which to stop them. The business case is described as contingent â€” this means the pilot must generate real evidence, and that evidence must be evaluated against a pre-agreed standard. [ASSUMED â€” based on standard programme governance practice; confirmed as risk by Risk Assessor.]

**Expected outcome:** A documented pilot evaluation framework that the service owner and leadership have signed off before day one of the pilot. No ambiguity about what the pilot is trying to prove or disprove.

**Dependencies and pre-conditions:** Requires the service owner (R1) and leadership sponsor to agree the framework. Should be completed as part of pilot design, before any go-live date is set.

---

### R7 â€” Commission Primary Research with Requesters and Reviewers Before Pilot Design Is Finalised

**Priority: High â€” evidence quality**

**Recommendation:** Before the pilot design is finalised, commission a structured round of primary research â€” interviews and/or contextual observation â€” with a representative sample of business users (requesters) and governance users (reviewers). The research brief should focus on: what information requesters have available at the point of need; what reviewers actually use from current intake forms versus what they discard; and what "a good outcome" looks like in practice from both perspectives.

**Rationale:** The current evidence base for this programme includes researched findings from user research, but the level of detail required to design a functioning intake form, triage logic, and status communication is not yet available. Several key design assumptions are labelled [INFERRED] or [ASSUMED] in this report â€” those labels indicate gaps that primary research must close before design decisions are locked. Designing the pilot form without this research risks reproducing the current form's failures in a new wrapper.

**Expected outcome:** A set of validated design inputs â€” confirmed field requirements, confirmed language for triage questions, confirmed communication preferences â€” that replace inferences with evidence before the pilot is built.

**Dependencies and pre-conditions:** Requires access to a sample of real users across segments (minimum 8â€“10 requesters, 6â€“8 reviewers across the six teams). Requires the service owner (R1) to facilitate access. Should be completed before the data-mapping exercise (R3) is finalised, so findings can inform team conversations.

---

---

## Fast-Track Pathway Assessment

### Current State: Not Yet Approvable

The fast-track pathway â€” an expedited review route for low-risk applications â€” is assessed as a **No-Go** at the time of this report. It is a legitimate and potentially high-value feature of the redesigned service, but it cannot be designed, built, or piloted until four specific conditions are met. Building it before those conditions are met would introduce the most dangerous risk in the programme: silent under-disclosure of risk by requesters seeking faster approval.

### Four Conditions Required Before Fast-Track Can Proceed

These conditions are taken directly from the Risk Assessor's output:

1. **Risk review approval obtained.** The fast-track proposal must be formally reviewed and approved by the relevant risk governance body before design begins. This is not a design decision â€” it is a governance gate.

2. **Cybersecurity and Legal have jointly defined fast-track eligibility criteria in verifiable, objective terms.** "Low risk" is not a definition. Eligibility criteria must be expressed as specific, checkable attributes (for example: vendor holds a named certification; data classification does not exceed a defined level; no personal data processed; existing contract in place). The criteria must be agreed in writing by both teams.

3. **Triage logic does not rely on requester self-declaration.** Requesters must not be able to self-select into the fast-track by answering questions about their own app's risk profile. Self-declaration fails silently â€” requesters will, whether deliberately or through ignorance, describe their app in terms that qualify it for fast-track. Eligibility must be determined by verifiable data, not by requester input alone.

4. **A post-onboarding audit mechanism is defined and agreed.** Fast-track cannot be a one-way door. There must be a defined mechanism for reviewing fast-tracked apps after approval â€” both to catch apps that were incorrectly classified and to verify that the fast-track criteria are working as intended. This mechanism must be designed and resourced before any app is fast-tracked.

### Design Constraints That Must Be Honoured When Fast-Track Is Built

- The fast-track eligibility criteria must be applied by the system or by a reviewer using objective data â€” not by the requester describing their own app.
- Fast-tracked apps must be flagged in the decision record as fast-tracked, with the criteria applied and the evidence used, so the audit mechanism can review the classification.
- The fast-track must have a defined escalation path â€” if a reviewer is uncertain whether an app meets the criteria, there must be a named person or team that makes the call, and a defined timeframe for that decision.
- Governance users (reviewers) have expressed defensive behaviour around fast-track [RESEARCHED]. This must be addressed through co-design with reviewer teams â€” not by imposing a fast-track they had no input in designing.

### Risk If Fast-Track Is Built Without Meeting These Conditions

If fast-track is built before the four conditions are met, the most likely failure mode is as follows: requesters discover that describing their app in certain terms (low data risk, limited integration, small user base) results in faster approval. They learn â€” consciously or not â€” to describe their apps in those terms regardless of actual risk profile. The service approves apps it should have reviewed more carefully. This does not produce an error message or a failed ticket â€” it produces an approved app that later causes an incident. The service will appear to be working faster while actually producing worse risk outcomes. This failure is silent until it is not.

---

---

## What Success Looks Like

### North Star Metric

**Requester-confirmed resolution rate within target timeframe without chasing.**

This metric measures the percentage of requests that reach a confirmed outcome â€” approved, conditionally approved, or rejected with clear next steps â€” within the defined SLA, without the requester having to chase, escalate, or submit a duplicate ticket.

**How it is measured:**
- Resolution rate: percentage of closed requests where the requester received a decision notification (not just a Jira status change) within the target timeframe.
- Without chasing: measured by absence of chaser emails or duplicate tickets within the same request lifecycle. Requires logging of inbound chaser contacts per case.
- Requester-confirmed: measured by a short close-loop survey sent to the requester at case closure â€” did they receive a clear outcome? Did they understand what it meant? Did they have to chase?

This metric is not measurable in the current state because the backstage workflow is not reliable enough to produce consistent timestamps. Establishing baseline measurement is itself a pilot deliverable.

### 90-Day Pilot Success Criteria

| Metric | Target | Measurement method |
|---|---|---|
| Single front door adoption rate | >80% of new requests submitted via the pilot portal | Jira ticket source analysis |
| Duplicate submission rate | <10% of requests (down from baseline) | Matched app ID across submissions |
| Incomplete submission rate at intake | <20% of submissions requiring information chase | Reviewer-logged chase rate per case |
| Average elapsed time, submission to decision | Agreed target set at pilot design stage (baseline first) | Timestamp comparison, submission to decision notification |
| Requester satisfaction (close-loop survey) | >60% rate the process as clear and manageable | Post-closure survey response rate and score |
| Existing channel decommission | 100% of committed channels closed by pilot go-live | Channel audit |

### 12-Month Programme Success Criteria

| Metric | Target | Measurement method |
|---|---|---|
| North Star metric â€” resolution without chasing | >75% of requests resolved within SLA without chaser contact | Case lifecycle analysis + close-loop survey |
| Annual cost avoidance | Â£90,000â€“Â£160,000 against baseline | Staff time analysis, ticket volume, duplication rate |
| Shadow IT bypass rate | Measurable reduction in apps in use without approval | IT discovery tool integration with catalogue |
| Reviewer time on substantive assessment vs. chasing | >70% of reviewer time on assessment (not chasing) | Time-logging sample exercise at 6 and 12 months |
| App catalogue accuracy | >95% of in-scope apps represented and current | Quarterly catalogue audit |
| Post-onboarding obligation compliance | >90% of approved apps with completed post-approval checklist | Catalogue/portal tracking |

---

---

## What NOT to Build First

### Fast-Track Triage Module

Attractive because: it is mentioned in the brief as a stretch goal and has obvious appeal to requesters. **Do not build first because:** four conditions are unmet. The hidden risk of silent under-disclosure is the most dangerous failure mode in the programme. Fast-track built without validated criteria is not a faster service â€” it is a faster route to unapproved risk.

### Status Tracker (as a Standalone Feature)

Attractive because: status visibility is a top requester pain point and appears straightforward. **Do not build first because:** a status tracker is only credible if the backstage workflow is reliable. Surfacing unreliable status data to requesters will be worse than surfacing no data â€” it will generate more chasing, not less, when the displayed status is wrong or stale. The backstage workflow must be reliable before the status tracker is built.

### A New Intake Form (Before the Data-Mapping Exercise)

Attractive because: the current forms are clearly broken and designing a better one feels like immediate progress. **Do not build first because:** a form designed without the data-mapping exercise will reproduce the same problems in a new wrapper â€” it will be designed around assumptions about what teams need, not around what they have confirmed they need. The data-mapping exercise is the form design.

### Mobile Application

Attractive because: mobile is listed as a channel in the brief. **Do not build first because:** there is no evidence that requesters want or need to submit app onboarding requests via mobile. The web portal must work first. Mobile is a future-state consideration, not a pilot deliverable. [ASSUMED â€” no mobile-specific user research has been cited.]

### Decision Library (Reviewer-Facing)

Attractive because: reuse of prior decisions is an obvious efficiency and appears on the governance journey map as an opportunity. **Do not build first because:** the decision library requires a data governance decision about what can be reused, under what conditions, and who is responsible for maintaining accuracy. It also requires a sufficient volume of structured, recorded decisions to be useful â€” which means the structured decision log must exist first. Sequence: decision log, then library.

### Full Programme (Before Pilot Evidence)

Attractive because: the problem is well-understood and the solution direction is clear. **Do not commit the full programme budget before the pilot generates evidence.** The business case is contingent. The pilot exists precisely to test the assumptions on which the full programme depends. Committing full scope before pilot evidence is available removes the programme's ability to adjust based on what it learns.

---

---

## Open Questions Requiring Client Decision

These are questions that the service design team cannot resolve. They require a decision from the client before the programme can proceed. They are listed in the order in which the decision is required.

| # | Question | Why it cannot wait | Decision required by |
|---|---|---|---|
| 1 | Who is the named service owner? What is their title, reporting line, and formal authority over each of the six teams? | Pre-condition for all design and build work. Without this, the programme cannot proceed. | Before programme kick-off |
| 2 | Will each of the six teams provide written commitment to decommission their existing Jira intake channels on pilot go-live? If any team refuses, how will that be resolved? | A new front door alongside existing channels is a seventh channel. Channel decommissioning is a non-negotiable pilot pre-condition. | Before programme kick-off |
| 3 | What is the agreed target SLA for each stage of the onboarding process â€” from submission to triage, triage to decision by team, and decision to requester notification? | SLAs are required to design the status tracker, define pilot success criteria, and set requester expectations. They cannot be assumed by the design team. | Before pilot design begins |
| 4 | Does the organisation consent to a Jira data export across all six service desks for the volume validation exercise? Who has admin access to authorise this? | Volume validation is a pilot pre-condition. Without Jira data, the business case figures remain unvalidated. | Before R2 can begin |
| 5 | Is Legal willing to participate in the governance alignment session (R4) and commit to producing a verifiable fast-track eligibility definition? | Legal participation is listed as a fast-track condition. If Legal will not engage, fast-track is permanently off the table and the programme scope should reflect that. | Before R4 is scheduled |
| 6 | Is Cybersecurity willing to participate in the governance alignment session (R4) on the same basis? | As above. | Before R4 is scheduled |
| 7 | What technology platform will host the single front door and shared case management? Is there an existing enterprise platform (for example, ServiceNow, or a successor to the current Jira configuration), or does this require a procurement decision? | The design of the backstage workflow depends on the platform. This is a significant dependency that affects timeline, cost, and what the team can build. | Before pilot design begins |
| 8 | Who owns the app catalogue data currently, and is there an agreed source of truth for approved apps? If not, who will fund and resource the initial catalogue build? | The catalogue is the first user-facing feature. If there is no source data, building it requires a data collection exercise that must be scoped and resourced. | Before R5 begins |
| 9 | What is the leadership appetite for the fast-track pathway? Is it a committed programme goal, or a stretch goal that can be descoped if conditions are not met? | The answer determines whether the programme carries fast-track as a live workstream or parks it pending conditions. Carrying it as a live workstream has a resource cost. | Before programme scope is finalised |
| 10 | What is the formal risk governance process for approving the fast-track triage model? Which body reviews and approves it, and what is the expected timeline? | This is the first of the four fast-track conditions. Without knowing the process, the team cannot plan when fast-track design could begin â€” or whether it will be possible within the programme timeline. | Before R4 begins |

---

*End of report. All inferences and assumptions are labelled throughout. This document is a synthesis of research, strategy, and risk inputs â€” it is not itself primary research. Findings labelled [RESEARCHED] are drawn from user research outputs provided to this workstream. Findings labelled [INFERRED] are logical derivations from researched findings. Findings labelled [ASSUMED] are working assumptions that should be tested before design decisions are made on their basis.*

*Version 1.0 â€” 8 April 2026 â€” For client review and comment*agentId: a723fce0e502dd38b (use SendMessage with to: 'a723fce0e502dd38b' to continue this agent)
<usage>total_tokens: 20516
tool_uses: 0
duration_ms: 416546</usage>
