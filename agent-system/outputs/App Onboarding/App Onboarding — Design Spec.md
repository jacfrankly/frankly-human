# Service Design Specification: Enterprise App Onboarding Redesign

**Organisation:** Test | **Version:** 1.0 | **Date:** 2026-04-08
**Author role:** Requirements Writer (RW)
**Status:** Design-ready handoff â€” pending dependency resolution (see Section 3, Dependencies)

---

## 1. SERVICE BLUEPRINT

### Reading Guide

- **Frontstage:** Everything the user sees, touches, or receives
- **Backstage:** Everything that must happen for the frontstage to work, but which the user does not see
- **Support processes:** Systems, tools, governance, and organisational structures that enable backstage actions
- All eight stages map left to right; all process layers map top to bottom

---

| Process Layer | Stage 1: Pre-Submission (Discovery) | Stage 2: Intake (Submission) | Stage 3: Triage | Stage 4: Routing | Stage 5: Review | Stage 6: Decision & Notification | Stage 7: Onboarding Execution | Stage 8: Post-Onboarding Handoff |
|---|---|---|---|---|---|---|---|---|
| **USER ACTION** | Requester searches for an existing approved app before submitting a new request | Requester completes a single guided intake form and submits their request | No user action required â€” triage is system-executed at point of submission | No user action required â€” routing is system-executed | Requester responds to any structured RFI (request for information) issued by a reviewer | Requester reads decision notification; confirms whether their original need is met | No user action required for execution â€” requester notified when complete | App owner reviews obligations document; confirms acceptance of ongoing responsibilities |
| **USER-FACING ARTIFACT / FRONTSTAGE ACTION** | App catalogue search UI; plain-language descriptions of approved apps; "Request access" shortcut if app already approved; "Request new app" CTA if no match found | Guided multi-step intake form; smart conditional logic shows only relevant fields; inline help text at each field; progress indicator; submission confirmation with reference number and expected timeframe | Requester sees: triage classification result ("standard" or "fast-track"), estimated timeframe, and which teams are involved â€” no more detail than necessary | Requester sees: status updated to "In review â€” [team list]"; no individual routing detail exposed | Requester sees: any structured RFI requests appear in their request dashboard; structured response form pre-populated with the original question | Requester receives: structured decision notification (approved / approved with conditions / rejected / deferred); plain-language explanation; next step instruction | Requester sees: status updated to "In delivery"; notified when provisioning is complete with access instructions | App owner receives: obligations summary document; confirmation prompt; link to ongoing management view in catalogue |
| **LINE OF INTERACTION** | â†‘ User/service boundary â†‘ | â†‘ User/service boundary â†‘ | â†‘ User/service boundary â†‘ | â†‘ User/service boundary â†‘ | â†‘ User/service boundary â†‘ | â†‘ User/service boundary â†‘ | â†‘ User/service boundary â†‘ | â†‘ User/service boundary â†‘ |
| **FRONTSTAGE SYSTEM ACTION** | Catalogue search returns results ranked by relevance; existing-app match triggers "Request access" path; no match triggers intake form pre-populated with search term | Form validates fields in real time; duplicate detection checks for existing requests for same app by same team; submission triggers triage engine; confirmation email sent automatically | Triage engine applies criteria supplied by Cybersecurity and Legal (see dependency D-02); outputs classification and routing map; no requester self-declaration used as triage input | System dispatches request to all applicable review queues simultaneously (parallel, not serial); timestamps recorded per team; SLA clock starts | RFI module captures reviewer's structured question; routes to requester; structured response captured and appended to request record; reviewer notified on response receipt | Decision record consolidated from all review teams; notification composed and sent; status updated in requester dashboard; if conditions attached, conditions logged against app record | Provisioning tasks dispatched to App Packaging and SSO teams; status updates automated from ticketing system; access confirmation sent to requester and line manager | App catalogue record created or updated; obligations document generated from standard template; app owner prompted to confirm; ongoing management view activated |
| **LINE OF VISIBILITY** | â†• Visible/backstage boundary â†• | â†• Visible/backstage boundary â†• | â†• Visible/backstage boundary â†• | â†• Visible/backstage boundary â†• | â†• Visible/backstage boundary â†• | â†• Visible/backstage boundary â†• | â†• Visible/backstage boundary â†• | â†• Visible/backstage boundary â†• |
| **BACKSTAGE ACTION** | Catalogue maintained by App Packaging team; descriptions written by service owner team; approval status kept current | Data fields defined by six-team mapping exercise (dependency D-01); form logic reviewed by all six teams before launch | Cybersecurity and Legal define and maintain triage criteria (dependency D-02); criteria versioned and auditable | Service owner (Director-level) routing rules define which teams are triggered by which app attributes; rules maintained and versioned | Each team works request in their own specialist system; SLA compliance monitored by service owner; escalation triggered if SLA breached | All team leads submit decisions to central decision record; service owner reviews consolidated output; decision authority confirmed before pilot (dependency D-03) | App Packaging executes build/deployment; SSO team provisions identity; both update central status record on completion | Catalogue record governance: supplier governance logs vendor; legal logs contract reference; cybersecurity logs risk classification; license management logs entitlement |
| **LINE OF INTERNAL INTERACTION** | â†• Frontstage/support boundary â†• | â†• Frontstage/support boundary â†• | â†• Frontstage/support boundary â†• | â†• Frontstage/support boundary â†• | â†• Frontstage/support boundary â†• | â†• Frontstage/support boundary â†• | â†• Frontstage/support boundary â†• | â†• Frontstage/support boundary â†• |
| **SUPPORTING PROCESSES & SYSTEMS** | App catalogue database; search index; approval status registry | Intake form platform; form field registry (post data-mapping); duplicate detection logic; email confirmation service | Triage rules engine; risk classification framework (Cybersecurity + Legal); audit log | Routing rules engine; team queue management systems; SLA timer service; service owner dashboard | Specialist review tools per team (App Packaging, Supplier Governance, Legal, Cybersecurity, License Management, SSO); RFI module; notification service | Decision consolidation module; notification service; conditions register; requester dashboard | App packaging toolchain; SSO provisioning system; access rights management; status sync API | App catalogue CMS; obligations template library; app owner notification service; ongoing management dashboard |
| **ORGANISATIONAL DEPENDENCY** | App Packaging team owns catalogue maintenance; service owner sets quality standard | All six teams commit to channel decommission before launch (dependency D-04); data fields confirmed post-mapping (D-01) | Cybersecurity and Legal own and maintain triage criteria (D-02) | Service owner (Director-level) holds authority over all six teams to enforce parallel routing (D-03) | Each team's SLA confirmed by service owner before pilot; escalation path to service owner confirmed | Service owner confirms decision authority model before pilot (D-03) | App Packaging and SSO teams commit to status update obligations | Service owner confirms catalogue governance model; all six teams confirm post-onboarding data obligations |

---

## 2. USER STORIES WITH ACCEPTANCE CRITERIA

### Traceability Key

All user stories trace to the validated user jobs listed in the brief. Each story header notes which validated need it satisfies.

---

### a. App Discovery

**Validated user need:** Requesters â€” pre-submission: find out if an existing approved app already meets their need.

---

**User Story AD-01: Search for an existing approved app before submitting a new request**

> As a business user considering a new software tool,
> I want to search a catalogue of already-approved apps before I start a new request,
> so that I don't submit a duplicate request for something that's already available to me.

**Acceptance Criteria**

*Given* I am on the service front door (web or mobile),
*When* I enter a search term (app name, function, or category),
*Then* the catalogue returns matching results ranked by relevance, with each result showing: app name, plain-language description of what it does, current approval status, and a clear next action ("Request access" if approved, "In review â€” request pending" if already in progress, or "Request new app" if no match).

*Given* the search returns a result that matches my need,
*When* I select "Request access",
*Then* I am routed to the access request path (not the new app onboarding path), and no new onboarding request is created.

*Given* the search returns no results matching my need,
*When* I select "Request new app",
*Then* the intake form is pre-populated with my search term and I do not have to re-enter it.

*Given* I search and results are returned,
*When* I view a result marked "In review â€” request pending",
*Then* I can see who the current sponsor/requestor team is (not an individual name) and an option to contact the service team to explore whether my need can be added to that in-progress request.

**Edge Cases**

- Search term returns partial matches only: system shows partial matches with a "Did you mean?" prompt and a "None of these â€” request new app" option.
- Catalogue is empty (e.g., at pilot launch): system shows an empty state message explaining the catalogue will grow over time, with a direct "Request new app" CTA.
- App exists in catalogue but approval status is "Rejected" or "Retired": system shows this status with the rejection reason (if shareable) and does not offer "Request access". Requester is offered "Request new app" with a note that a previous request was reviewed â€” prior review record is linked for the reviewer's benefit.
- Search is performed on mobile: all above behaviour is consistent; results are rendered in a mobile-appropriate list view.

**Out of Scope**

- This story does not cover access provisioning to an already-approved app â€” that is a separate access management process.
- This story does not cover searching for apps that are in scope of a different onboarding channel (legacy channels, if not yet decommissioned â€” see dependency D-04).
- Catalogue content authoring is out of scope of this story; it is covered under App Catalogue (story AC-01).

---

### b. Single Intake Form

**Validated user need:** Requesters â€” submission: submit a single, guided request in one place.

**Risk addressed:** Intake completeness failure; requester under-disclosure.

---

**User Story IF-01: Complete and submit a guided intake request**

> As a business user who has confirmed no existing approved app meets my need,
> I want to complete one guided form in one place,
> so that I don't have to contact multiple teams or repeat myself across different channels.

**Acceptance Criteria**

*Given* I have initiated the "Request new app" path (from search or directly),
*When* I begin the intake form,
*Then* the form presents questions in a logical, plain-language sequence with a visible progress indicator showing how many steps remain.

*Given* I am completing the intake form,
*When* I answer a question that determines whether subsequent questions are relevant (e.g., "Will this app process personal data?"),
*Then* the form shows only the follow-on questions that my answer makes relevant â€” questions that are irrelevant to my situation are not shown.

*Given* I submit the intake form,
*When* all mandatory fields are complete and validation passes,
*Then* I receive an on-screen confirmation with a unique reference number, the classification result (standard or fast-track), the list of teams that will review my request, and an indicative timeframe. I also receive a confirmation email with the same information within two minutes.

*Given* I attempt to submit the intake form,
*When* one or more mandatory fields are incomplete,
*Then* the form does not submit; each incomplete field is highlighted with a plain-language explanation of what is missing and why it is needed; no data already entered is lost.

*Given* I am completing the form on a mobile device,
*When* I interact with any form field,
*Then* the field is usable on a touch interface; date pickers, dropdowns, and file uploads all function correctly on mobile; I can save progress and return on a different device.

**Dependency â€” D-01:** The specific data fields included in this form must not be finalised until the six-team data-mapping exercise is complete. This story specifies the structural requirements of the form (guidance, conditional logic, validation, confirmation); it does not specify field content. Field content is a separate deliverable, dependent on D-01.

**Edge Cases**

- See Section 5 (Edge Case Inventory) for: incomplete submission states, duplicate request detection, returning requester, third-party vendor not in supplier database, and maximum-complexity case.

**Out of Scope**

- This story does not cover the triage logic applied after submission â€” see Triage (parallel routing story RT-01).
- This story does not cover the reviewer's view of submitted data â€” see Reviewer Dashboard (RD-01).
- This story does not cover access requests for already-approved apps.
- This story does not specify individual form fields â€” those are defined post data-mapping exercise (D-01).

---

### c. Request Status Tracking

**Validated user need:** Requesters â€” progress: see current status and understand what's blocking it. Technology users â€” consolidated view of in-flight requests with status and next action.

**Strategic constraint:** Status transparency features must be tied to actual backstage process state â€” no fake status.

---

**User Story ST-01: View the real-time status of my submitted request**

> As a business user or app sponsor who has submitted a request,
> I want to see the current status of my request at any time,
> so that I know what is happening without having to contact anyone.

**Acceptance Criteria**

*Given* I have submitted a request and received a reference number,
*When* I view my request in the dashboard (web or mobile),
*Then* I can see: current stage (from the eight blueprint stages), which teams have completed their review, which teams are still reviewing, whether any action is required from me, and the current estimated completion date (updated in real time based on actual SLA progress â€” not a fixed date set at submission).

*Given* a review team has issued an RFI (request for information) to me,
*When* I view my dashboard,
*Then* the request status clearly shows "Action required â€” information requested by [team name]" and the RFI is displayed with a structured response field; the estimated completion date is paused until I respond; I receive a notification via email and in-app.

*Given* a review team's SLA has been breached (they have not completed their review within the committed timeframe),
*When* I view my dashboard,
*Then* the status shows "Delayed â€” [team name] review is overdue" with a plain-language explanation that the service owner has been notified; I do not need to chase the team myself.

*Given* my request has reached the decision stage,
*When* I view my dashboard,
*Then* the status is updated to reflect the decision and I receive a notification â€” this state transition must be triggered by the actual decision record being written, not by a scheduled timer or manual status update.

**Dependency â€” D-05:** Status states must be defined jointly with all six backstage teams before build, to ensure that every displayed state corresponds to a real, observable system or process state. No status label may be created without a confirmed backstage trigger.

**Edge Cases**

- Request has been with a review team for longer than expected but SLA has not technically been breached: status shows "In review" with actual elapsed time visible; estimated completion date shown alongside original target.
- Requester's session times out while viewing dashboard: on return, dashboard reflects the current real state â€” no stale data shown.
- App sponsor views dashboard for a request they are sponsoring but did not submit: sponsor can see full status detail but cannot take actions belonging to the requester (e.g., responding to RFIs directed at the requester).

**Out of Scope**

- This story does not cover the service owner's operational monitoring dashboard â€” that is a service management tool, not a user-facing feature.
- This story does not cover status notifications for access requests to already-approved apps.
- Push notifications (beyond email and in-app) are out of scope for the initial build.

---

### d. Parallel Routing

**Validated user need:** Technology users â€” know which backstage team is the bottleneck. Governance users â€” route low-risk requests appropriately.

**Risk addressed:** Serial routing creates unnecessary delay; service must enforce simultaneous dispatch.

---

**User Story RT-01: Request is dispatched to all relevant review teams simultaneously**

> As a service operation,
> I need all relevant review teams to receive the request at the same time,
> so that total review time is determined by the slowest relevant team, not the sum of all teams.

*(Note: This is a service-layer requirement â€” the direct beneficiary is the requester, whose validated need is resolution within target timeframe without chasing. The implementation is not user-visible but is user-consequential.)*

**Acceptance Criteria**

*Given* a request has been submitted and triage is complete,
*When* the routing step executes,
*Then* the request appears simultaneously in the queue of every applicable review team within two minutes of triage completion; all team queues are timestamped at the same dispatch moment; the SLA clock for each team starts at that same timestamp.

*Given* the routing rules determine that a particular team is not applicable to this request (e.g., no personal data processed, therefore Legal review not required),
*When* the request is dispatched,
*Then* that team's queue does not receive the request; the routing decision is logged with the reason; the requester's status view reflects only the teams that are reviewing.

*Given* a review team completes their review,
*When* they record their decision,
*Then* their portion of the review is marked complete in the central record; remaining teams continue their review unaffected; the requester's status view updates to reflect which teams have completed.

*Given* all applicable teams have recorded their decisions,
*When* the last team submits,
*Then* the decision consolidation step is triggered automatically; no manual hand-off is required.

**Dependency â€” D-03:** The service owner (Director-level authority over all six teams) must be confirmed before pilot launch. Parallel routing requires an authority holder who can enforce SLA compliance across teams that may have competing priorities. Routing rules must be signed off by the service owner.

**Edge Cases**

- A review team's system is unavailable at the moment of dispatch: the routing engine retries at defined intervals (maximum three retries over 30 minutes); if unsuccessful, the service owner is alerted automatically; the requester's status shows "In review" â€” no degraded status shown until service owner determines action.
- Routing rules produce a result of zero applicable teams (e.g., an app type not yet covered by the triage model): the request is flagged for manual triage review by the service owner; the requester sees "Under review â€” additional classification in progress" with an adjusted timeframe.

**Out of Scope**

- This story does not cover the internal workflow tools used by each specialist team â€” those are within each team's operational scope.
- This story does not cover the serial legacy routing process â€” that process must be decommissioned as a condition of this feature launching (dependency D-04).

---

### e. Fast-Track Pathway

**Validated user need:** Governance users â€” route low-risk requests away from the full review queue.

**Strategic constraint:** Fast-track triage must NOT use requester self-declaration of risk â€” criteria must come from Cybersecurity and Legal.

**Risk addressed:** Fast-track gaming via self-declaration.

---

**User Story FT-01: Low-risk request is automatically routed through a streamlined review pathway**

> As a governance reviewer,
> I want low-risk requests to be identified and routed away from the full review queue automatically,
> so that I can focus my time on requests that genuinely require detailed scrutiny.

**Acceptance Criteria**

*Given* a request has been submitted and the triage engine is running,
*When* the request attributes match the fast-track eligibility criteria defined by Cybersecurity and Legal,
*Then* the request is classified as "fast-track" automatically; no input is sought from the requester regarding their own risk assessment; the classification is logged with the specific criteria that triggered it.

*Given* a request is classified as fast-track,
*When* it is routed,
*Then* it is dispatched only to the review queues applicable to fast-track requests (as defined by Cybersecurity and Legal â€” dependency D-02); the reviewer sees the fast-track classification and the criteria that triggered it.

*Given* a request is classified as fast-track,
*When* the requester views their dashboard,
*Then* they see "Fast-track review â€” estimated [timeframe]"; they do not see a list of criteria or an invitation to challenge the classification.

*Given* a reviewer in the fast-track queue determines that a request has been incorrectly classified as fast-track,
*When* they trigger an escalation to full review,
*Then* the request is moved to the standard queue; all already-completed fast-track review steps are preserved; the requester's status updates to "Standard review â€” additional assessment required"; the timeframe estimate is updated; the escalation is logged with the reviewer's reason.

**Pre-conditions (must all be true before this feature can build or launch)**

- **D-02:** Cybersecurity and Legal have defined and formally signed off the fast-track eligibility criteria in a documented, versioned format.
- **D-02a:** The criteria use only fields that are verifiable from submitted data and existing organisational systems â€” no criterion relies on requester self-assessment.
- **D-02b:** A process for reviewing and updating criteria (e.g., when the threat landscape changes) has been agreed with Cybersecurity and Legal.
- **D-03:** Service owner authority is confirmed â€” fast-track classification disputes require an authority holder.

**Edge Cases**

- Request attributes are ambiguous (e.g., a field that determines fast-track eligibility is answered in a way that could be interpreted either way): the system defaults to standard review; ambiguity is logged; the triage criteria owners (Cybersecurity/Legal) are notified to refine the criterion.
- A request that was fast-tracked in the past is resubmitted (e.g., annual renewal): the system checks whether the criteria have changed since the last assessment; if criteria have changed, the request is re-triaged from scratch; if unchanged, fast-track classification is noted with reference to the prior decision.

**Out of Scope**

- The specific fast-track eligibility criteria are out of scope of this specification â€” they are defined by Cybersecurity and Legal (D-02).
- This story does not cover the creation of a separate fast-track UI â€” fast-track requests flow through the same intake form and dashboard; the difference is in routing and timeframe only.
- Requesters cannot apply for fast-track treatment â€” classification is fully system-determined.

---

### f. Reviewer Dashboard

**Validated user need:** Governance users â€” receive all information needed to make a decision without having to ask for it separately; know whether a similar app has already been assessed; route low-risk requests; send structured RFIs.

---

**User Story RD-01: Reviewer sees their queue with all decision-relevant information**

> As a governance reviewer (from any of the six teams),
> I want a consolidated view of all requests assigned to my team, with all the information I need already attached,
> so that I can make a decision without having to request information separately or search across multiple systems.

**Acceptance Criteria**

*Given* I am a designated reviewer for one or more of the six teams,
*When* I access the reviewer dashboard,
*Then* I see only the requests assigned to my team; each request shows: app name, requester team, submission date, classification (fast-track or standard), SLA deadline for my team's review, current status of my team's review, and a link to the full request record.

*Given* I open a request record,
*When* I view the detail,
*Then* I see all submitted information relevant to my team's review domain in a single view; I also see a "Similar apps reviewed" section showing any prior assessments of the same or similar apps, with links to those decisions; I do not need to search a separate system.

*Given* I need additional information before I can make a decision,
*When* I issue an RFI,
*Then* I complete a structured form specifying: what information I need, why it is needed, and a deadline for response; the RFI is sent to the requester in a structured format; the response, when received, is appended to the request record in a structured format that is machine-readable as well as human-readable; I am notified when the response arrives.

*Given* I have reviewed a request and reached a decision,
*When* I record my decision,
*Then* I select from a defined decision taxonomy (Approved / Approved with conditions / Rejected / Deferred â€” further information required); I provide a structured rationale; any conditions are recorded as discrete, actionable items; my decision is time-stamped and attributed to my role (not my personal name, unless required by governance policy).

**Edge Cases**

- Reviewer from Team A views a request where Team B has already completed their review: Team B's decision is visible to Team A's reviewer (to avoid conflicting conditions), but Team A's decision field remains independent.
- Reviewer attempts to submit a decision without completing a mandatory rationale field: form does not submit; the field is highlighted; no partial decision record is created.
- A request assigned to my team is escalated from fast-track to standard while I have it open: my view refreshes; I see a notification that the classification has changed; any fast-track-specific review steps I completed are preserved and marked as such.

**Out of Scope**

- Cross-team decision authority (i.e., one team overriding another's decision) is out of scope â€” this is a governance model question to be resolved by the service owner (D-03).
- The reviewer dashboard does not serve as the operational management tool for the service owner â€” the service owner has a separate operational view.
- Bulk decision-making (approving multiple requests in one action) is out of scope for the initial build.

---

### g. App Catalogue

**Validated user need:** Technology users â€” understand ongoing obligations after onboarding is complete. Requesters â€” pre-submission discovery.

---

**User Story AC-01: App catalogue is updated after successful onboarding and maintained by the app owner**

> As an app owner (technology user / app sponsor),
> I want a clear record of my app's approval, risk classification, and my ongoing obligations,
> so that I know what I am responsible for and others can discover and reuse the approval decision.

**Acceptance Criteria**

*Given* an app onboarding request has been approved and provisioning is complete,
*When* the onboarding execution stage is complete,
*Then* the app catalogue record is automatically created or updated with: app name, description, approval date, review decisions from all applicable teams, risk classification, conditions attached to approval, app owner name and team, contract/vendor reference, license entitlement summary, and next review date (if applicable).

*Given* the catalogue record has been created,
*When* the app owner accesses their obligations view,
*Then* they see a plain-language list of their ongoing obligations (e.g., license compliance, data handling requirements, annual security review), each with an owner, a due date, and a status indicator; obligations are drawn from the conditions recorded during review.

*Given* a condition attached to approval has a due date that is approaching,
*When* the due date is within the notification window (to be defined during build),
*Then* the app owner receives a notification; the obligation appears as "Action required" in their obligations view.

*Given* a new requester is searching the catalogue (story AD-01),
*When* they find an approved app,
*Then* the catalogue record they see includes: plain-language description, current approval status, and whether access can be requested â€” it does not expose internal review decisions, risk classifications, or conditions unless the viewer has reviewer-level permissions.

**Edge Cases**

- App is approved with conditions but conditions have not yet been fulfilled: catalogue record is created with status "Approved â€” conditions pending"; the app is not shown as fully available for access requests until conditions are confirmed as met by the responsible reviewer team.
- App owner leaves the organisation before obligations are fulfilled: the service triggers a notification to the app owner's line manager and the service team; the obligation record shows "Owner unassigned â€” action required".

**Out of Scope**

- Catalogue records for apps approved through legacy processes (before this service launched) are out of scope for initial build â€” a migration plan is a separate workstream.
- The catalogue does not serve as a license management system â€” it references the license management system's records, it does not replace them.

---

## 3. PRODUCT REQUIREMENTS DOCUMENT (PRD) â€” SINGLE FRONT DOOR

---

### Problem Statement

Test's application onboarding process is currently fragmented across six specialist teams (App Packaging, Supplier Governance, Legal, Cybersecurity, Software License Management, SSO), each operating independently with their own intake channels, process sequences, and communication standards.

The consequences for users are as follows.

**For requesters:** There is no single place to submit a request. Requesters must identify and contact the correct teams themselves, submit information multiple times in different formats, and actively chase progress across multiple contacts. Resolution time is opaque and unpredictable. The requester bears the coordination burden that belongs to the service.

**For app sponsors:** There is no consolidated view of in-flight requests. Sponsors cannot determine which team is causing delay or what is needed to unblock a review. Post-approval obligations are communicated inconsistently and not tracked.

**For governance reviewers:** Requests arrive incomplete, requiring repeated rounds of information-gathering before a decision can be made. There is no systematic way to reuse prior decisions on similar apps. Low-risk and high-risk requests are not reliably separated, leading to full review effort being applied regardless of proportionate need.

**For the organisation:** The cost of the current process â€” in staff time, delayed access to tools, and duplicated effort â€” is not visible. There is no North Star metric against which to measure improvement. The six-team structure creates a coordination overhead that is currently absorbed informally, at significant and unmeasured cost.

The redesign creates a single front door: one place to submit, one place to track, one coordinated backstage process, and one clear outcome. The front door is only as good as what happens behind it â€” accordingly, this specification treats organisational authority, process integration, and channel decommission as first-class design dependencies, not implementation details.

---

### Users and Context by Persona

**Persona 1: The Business Requester**

*Who they are:* An employee at Test who needs a new third-party software application to do their job. They may submit one or two such requests per year. They are not technically expert in procurement, security, or licensing.

*Context:* They have a business need. They do not know which teams are involved in approving software, what those teams need from them, or how long the process takes. They are likely to pursue workarounds (shadow IT, repurposing approved tools) if the legitimate route is too opaque or slow.

*What they need:* A single, guided submission experience; a way to check whether the tool they need is already approved; real-time progress visibility without having to ask anyone; a decision they can understand; and confidence that once approved, the tool will actually be available to them within a known timeframe.

*Current pain:* Unknown point of entry; duplicate submissions; no status visibility; no clarity on what is blocking their request.

**Persona 2: The App Sponsor / Technology Owner**

*Who they are:* A technology professional (e.g., an IT manager, product owner, or technical lead) who has agreed to sponsor a software request and is responsible for the ongoing management of an approved app.

*Context:* They may be sponsoring multiple requests simultaneously. They are accountable for the app's continued compliance after onboarding but may not be the person who submitted the request. They have more technical context than the requester but still lack visibility into the multi-team review process.

*What they need:* A consolidated view of all requests they are sponsoring; clarity on which team is blocking a stalled request; a clear statement of post-approval obligations; a mechanism for managing those obligations over time.

*Current pain:* No consolidated view; obligations communicated ad hoc; no early warning system for obligation due dates.

**Persona 3: The Governance Reviewer**

*Who they are:* A specialist professional in one of the six teams (App Packaging, Supplier Governance, Legal, Cybersecurity, License Management, SSO). They are an expert in their domain. They receive requests from a wide range of sources in varying formats.

*Context:* They may review dozens of requests per week. They are accountable for the quality of their decision within their domain but are not accountable for the overall outcome for the requester. They need complete, well-structured information to make decisions efficiently.

*What they need:* A queue containing only relevant, complete requests; the ability to see prior decisions on similar apps; a structured way to request additional information and receive a structured response; a clear taxonomy for recording their decision; visibility of decisions made by other teams on the same request.

*Current pain:* Incomplete submissions requiring back-and-forth; no prior-decision lookup; no structured RFI mechanism; decisions recorded inconsistently across teams.

---

### Proposed Solution

A single web and mobile application that serves as the exclusive intake channel for all new third-party app onboarding requests at Test. The solution comprises five integrated components.

**Component 1 â€” App Discovery (pre-submission).** A searchable catalogue of approved apps that allows requesters to confirm whether an existing approved app meets their need before submitting a new request. Prevents duplicate requests and enables reuse of existing approvals.

**Component 2 â€” Single Guided Intake Form.** A structured, conditional-logic form that collects all information required for all applicable review teams in one submission. Field set is determined by the six-team data-mapping exercise (dependency D-01). Triage logic is embedded at the point of submission.

**Component 3 â€” Parallel Routing and Status Tracking.** Automatic simultaneous dispatch of the request to all applicable review teams, with real-time status visible to the requester and sponsor at every stage. Status states are tied to actual backstage process events â€” no status is displayed that does not have a confirmed backstage trigger.

**Component 4 â€” Fast-Track Pathway.** An automated triage pathway for requests that meet objective, Cybersecurity- and Legal-defined criteria for low-risk classification. Eligibility is determined entirely by system logic applied to submitted data â€” requester self-declaration plays no role.

**Component 5 â€” Reviewer Dashboard.** A role-specific view for governance reviewers showing their assigned queue with complete decision-relevant information, prior-decision lookup, structured RFI capability, and a standardised decision taxonomy.

**Component 6 â€” App Catalogue (post-onboarding).** An automatically updated catalogue record created upon successful onboarding, containing all governance outcomes, conditions, and obligations. Serves both as the discovery resource for future requesters and as the obligations management tool for app owners.

The solution is a web app (primary channel) and mobile app (secondary channel, parity for key user journeys). Email is used for notifications only, not for submissions or decisions. In-person support is available for requesters who need assistance completing a submission but does not constitute a separate intake channel. All existing intake channels (team-specific inboxes, ticketing systems, email chains) must be decommissioned before this front door launches (dependency D-04).

---

### Success Metrics

**North Star Metric**

Requester-confirmed resolution rate within target timeframe â€” without chasing or escalating.

Definition: The percentage of completed requests where the requester confirms (via post-resolution survey or in-app prompt) that (a) their original need was met, and (b) they did not need to contact anyone outside the front door to move their request forward.

Target: To be set based on pilot data. Baseline measurement required in pilot phase before targets are set.

**Input Metrics (leading indicators)**

| Metric | What it measures | Why it matters |
|---|---|---|
| Intake form completion rate | % of started forms that result in a valid submission | Measures whether the form is usable and appropriately scoped |
| Triage accuracy rate | % of fast-track classifications that are not subsequently escalated to standard | Measures whether fast-track criteria are well-calibrated |
| Duplicate request rate | % of submissions that are duplicates of an existing approved or in-progress request | Measures whether App Discovery is working |
| Time to first team action | Time from submission to the first review team opening the request | Measures routing efficiency |
| SLA compliance rate per team | % of reviews completed within each team's committed SLA | Measures backstage process health; identifies bottleneck teams |
| RFI rate | % of requests that require at least one RFI | Measures intake completeness; high rate indicates form design or field set problem |
| Time to decision | End-to-end elapsed time from submission to decision | Operational efficiency metric |
| Requester dashboard engagement | % of requesters who check status without contacting the service team | Measures whether status transparency is reducing chasing behaviour |

**Guardrail Metrics**

- Fast-track escalation rate must not exceed a threshold to be set by Cybersecurity and Legal â€” a high escalation rate indicates gaming or miscalibrated criteria.
- RFI response rate â€” requests that receive an RFI but receive no response within the response window are a service risk; this metric is monitored and triggers an outreach from the service team.

---

### Constraints

**C-01 â€” No requester self-declaration of risk.** Triage and fast-track classification must not include any field or mechanism that asks the requester to assess their own risk level. All triage criteria must be objective and verifiable.

**C-02 â€” No fake status.** Every status state displayed to a user must correspond to a real, observable backstage process state. Status may not be updated on a timer, on a schedule, or manually without a corresponding real-world event as the trigger.

**C-03 â€” Single channel only.** All existing intake channels must be decommissioned before the front door launches. The front door must be the only intake route. The service design must not create a situation where a requester can circumvent the front door by contacting a team directly and receiving service.

**C-04 â€” Form fields are a post-mapping deliverable.** The specific data fields in the intake form must not be finalised until the six-team data-mapping exercise is complete. This constraint prevents the form from being designed around assumptions that are later contradicted by what reviewers actually need.

**C-05 â€” Pilot scope is measurable scope.** The pilot must include only features and pathways for which baseline measurement is possible. Features that cannot be measured must not be included in the pilot build.

**C-06 â€” Risk governance is a first-class constraint.** Legal and Cybersecurity requirements are not optional features â€” they are structural requirements that determine what the system can and cannot offer requesters. Requirements from these teams must be incorporated at design stage, not retrofitted.

---

### Dependencies

| ID | Dependency | Owner | Blocking | Status |
|---|---|---|---|---|
| D-01 | Six-team data-mapping exercise complete and intake form field set agreed | Service owner (all six teams) | Intake form field content; intake story IF-01 field specification | Not started |
| D-02 | Cybersecurity and Legal define, document, and sign off fast-track triage criteria | Cybersecurity lead; Legal lead | Fast-track pathway (FT-01); triage engine build | Not started |
| D-02a | Triage criteria confirmed to use only verifiable, non-self-declared fields | Cybersecurity lead; Legal lead | Fast-track pathway (FT-01) | Not started |
| D-02b | Process for reviewing and updating triage criteria agreed | Cybersecurity lead; Legal lead | Fast-track pathway (FT-01); ongoing service operations | Not started |
| D-03 | Service owner (Director-level authority over all six teams) confirmed and committed | Sponsor / executive | Parallel routing enforcement; SLA compliance model; escalation paths; decision authority model | Not started |
| D-04 | All six teams commit in writing to decommissioning their existing intake channels before front door launches | Service owner (each team lead) | Front door launch; channel exclusivity (C-03) | Not started |
| D-05 | Status states defined jointly with all six teams; each state has a confirmed backstage trigger | Service owner (all six teams) | Status tracking build (ST-01); no fake status (C-02) | Not started |
| D-06 | Pilot scope agreed with service owner; measurable pathways identified | Service owner | Pilot launch | Not started |

---

### Open Questions

These questions are not yet decided. Each has a named decision-maker. Design and build must not proceed on the blocked item until the question is answered.

| # | Question | Decision-maker | Blocks |
|---|---|---|---|
| OQ-01 | Who is the confirmed service owner with Director-level authority over all six teams? | Sponsor / executive team | D-03; parallel routing; escalation; pilot launch |
| OQ-02 | What is the agreed SLA for each team's review, per request type (standard and fast-track)? | Service owner (with each team lead) | SLA compliance metric; requester timeframe display; ST-01 |
| OQ-03 | What decision authority model applies â€” does one team's objection block the entire request, or does the service owner adjudicate conflicts between team decisions? | Service owner; legal / governance lead | RD-01; decision consolidation; FT-01 escalation |
| OQ-04 | What is the appeals or challenge process for a requester who receives a rejection they dispute? | Legal lead; service owner | Decision notification design; requester rights |
| OQ-05 | What notification channels (beyond email and in-app) are required â€” e.g., Microsoft Teams integration, SMS? | Service owner; IT delivery team | Notification architecture |
| OQ-06 | What is the data retention policy for request records, including rejected and withdrawn requests? | Legal lead; information governance | Catalogue and audit log design |
| OQ-07 | Will the pilot include all six teams, or a subset? If a subset, which teams and which app types are in scope? | Service owner | D-06; pilot launch |
| OQ-08 | What is the process and authority for retiring or updating an existing catalogue record (e.g., when an approved app is later found to pose a new risk)? | Service owner; Cybersecurity lead | Catalogue governance; AC-01 |
| OQ-09 | Are there app types that are explicitly out of scope for this front door (e.g., internally developed apps, infrastructure tools)? | Service owner | Intake form scope; triage model; discovery catalogue scope |

---

## 4. TOUCHPOINT BRIEFS (DESIGN HANDOFF)

---

### Touchpoint Brief 1 â€” App Discovery

**Touchpoint identifier:** TD-01
**Channel:** Web app (primary); Mobile app (parity)
**User personas served:** Business Requester; App Sponsor

---

**The user goal at this touchpoint**

The user wants to confirm, before investing time in a new request, whether a software tool that meets their need is already approved and available. They want a definitive answer, not a partial one.

**Service context â€” what happens before**

The user has a business need for a software tool. They have arrived at the service front door, either directly or via an internal communications link. They have not yet submitted anything. No backstage process has started.

**Service context â€” what happens after**

If the user finds an existing approved app: they leave the onboarding service and are directed to the access request path (separate from this service). No onboarding process is triggered.

If the user finds an in-progress request for the same app: they are offered the option to contact the service team to explore whether their need can be added. They do not submit a duplicate onboarding request.

If no match is found: the user proceeds to the intake form (TD-02). Their search term is carried forward; they do not re-enter it. A new onboarding request is initiated.

**Backstage dependencies**

- The app catalogue must be accurate and current. Catalogue maintenance is owned by the App Packaging team; the service owner sets the quality standard.
- Approval status in the catalogue must reflect actual current status â€” not a status that has not been updated since a review completed. Stale catalogue data will result in users submitting duplicate requests.
- Catalogue descriptions must be written in plain language by the service owner team â€” technical names alone are insufficient for a non-technical requester to assess whether a tool meets their need.

**Constraints the design must honour**

- Do not present an app with a "Rejected" or "Retired" status as available. Show the status honestly with a plain-language explanation.
- Do not prevent discovery by requiring the user to know the exact app name â€” search must work on function, category, and partial name.
- Do not surface internal review decisions, risk classifications, or conditions to users without reviewer-level permissions.
- The "Request access" path for already-approved apps must not create an onboarding request â€” the two paths (access to approved app; new app onboarding) must be structurally separate.

**Anti-goal**

After completing this touchpoint, the user must NOT need to:
- Contact a team to ask whether an app is approved
- Submit a new onboarding request for an app that is already approved
- Repeat their search term when they proceed to the intake form

**Success criteria from the user's perspective**

- "I found out whether the tool I need is already approved in under two minutes."
- "The results made sense â€” I could tell whether any of them actually matched what I need."
- "When I couldn't find a match, the next step was obvious."

---

### Touchpoint Brief 2 â€” Intake Submission

**Touchpoint identifier:** TD-02
**Channel:** Web app (primary); Mobile app (parity); In-person (assisted completion â€” not a separate channel)
**User personas served:** Business Requester

---

**The user goal at this touchpoint**

The user wants to submit everything that is needed for their request to be assessed, in one place, without needing to know what each review team requires. They want to know, at the end of submission, that their request has been received and what will happen next.

**Service context â€” what happens before**

The user has confirmed (via app discovery, TD-01) that no existing approved app meets their need, or they have navigated directly to the intake form. If they came via discovery, their search term is pre-populated.

**Service context â€” what happens after**

Upon submission, the triage engine runs automatically. Within two minutes, the request is classified and dispatched to all applicable review teams simultaneously. The user receives a confirmation with reference number, classification, involved teams, and estimated timeframe. The user's experience transitions to the "Awaiting decision" touchpoint (TD-03).

**Backstage dependencies**

- **D-01 (blocking):** The specific data fields in this form must not be finalised until the six-team data-mapping exercise is complete. The design must accommodate a form with a variable field set â€” the structure, logic, and UX patterns must be built to be field-agnostic, with field content populated after D-01 is resolved.
- Duplicate detection logic must be live at the point of submission â€” this cannot be a post-submission check.
- Confirmation email infrastructure must be available at launch â€” the on-screen confirmation is not sufficient on its own.

**Constraints the design must honour**

- The form must not ask the requester to assess their own risk level in any field or in any way â€” see C-01.
- The form must save progress automatically so that a user who cannot complete in one session does not lose their work.
- All mandatory fields must be clearly marked; the reason a field is mandatory must be accessible (via inline help, not hidden in a tooltip that cannot be found on mobile).
- The form must be operable on mobile without loss of functionality.
- The form must not submit in an incomplete state â€” but it must also not destroy completed data if it cannot submit.

**Anti-goal**

After completing this touchpoint, the user must NOT need to:
- Contact any of the six teams to tell them the request has been submitted
- Resubmit information they have already provided
- Find out separately what their reference number is or which teams are reviewing their request
- Wonder whether their submission was actually received

**Success criteria from the user's perspective**

- "I completed the form in one sitting and knew exactly what each question was asking."
- "When I submitted, I knew immediately that it had gone through, who was reviewing it, and roughly how long it would take."
- "I didn't have to answer the same question twice."

---

### Touchpoint Brief 3 â€” Awaiting Decision (Status Visibility)

**Touchpoint identifier:** TD-03
**Channel:** Web app (primary); Mobile app (parity); Email (notifications only)
**User personas served:** Business Requester; App Sponsor

---

**The user goal at this touchpoint**

The user wants to know, at any moment, exactly where their request is in the process â€” without having to ask anyone. If action is required from them, they want to know precisely what it is. If there is a delay, they want to know why and that someone is accountable for it.

**Service context â€” what happens before**

The user has submitted their request (TD-02) and received a confirmation. The request is now in the backstage review process. Time is passing. The user has no inherent visibility into what is happening unless the service provides it.

**Service context â€” what happens after**

This touchpoint persists until a decision is reached. It transitions to "Decision received" (TD-04) when all applicable teams have recorded their decisions and the consolidated decision notification is sent. During this period, the user may need to respond to one or more RFIs (requests for information from reviewers) â€” this interaction happens within this touchpoint.

**Backstage dependencies**

- **D-05 (blocking):** Every status state shown to the user must have a confirmed backstage trigger. This touchpoint cannot be designed or built until all status states are mapped jointly with the six teams, with each state linked to a specific system event.
- SLA timers per team must be live in the system for the "Delayed" status state to be accurate.
- The service owner's escalation process (triggered when SLA is breached) must be operational before this feature can meaningfully promise that breaches are being acted upon.

**Constraints the design must honour**

- No status state may be displayed that does not correspond to a real, observable backstage event â€” see C-02.
- The estimated completion date shown to the user must be derived from real SLA data, updated dynamically â€” not a fixed date set at submission.
- If an RFI is issued by a reviewer, the user's status must change immediately to "Action required" â€” this must not require a manual update from the service team.
- The user must not be required to contact anyone to understand their status â€” if the status shown does not contain enough information for the user to understand their position, it is a design failure.

**Anti-goal**

After engaging with this touchpoint at any point during the wait period, the user must NOT need to:
- Email or call the service team to find out what is happening
- Contact any of the six review teams directly to ask for an update
- Guess whether their request is delayed or progressing normally
- Discover an action required of them (e.g., an RFI) by any means other than this touchpoint and its associated notifications

**Success criteria from the user's perspective**

- "I could see at a glance where my request was and whether I needed to do anything."
- "When something was delayed, the dashboard told me â€” I didn't have to figure it out myself."
- "When a reviewer needed something from me, I got a clear notification and knew exactly what to provide."

---

### Touchpoint Brief 4 â€” Decision Received

**Touchpoint identifier:** TD-04
**Channel:** Web app (primary); Email (notification); Mobile app (notification and view)
**User personas served:** Business Requester; App Sponsor

---

**The user goal at this touchpoint**

The user wants to know the outcome of their request in plain language â€” what the decision is, why it was made, what it means for them, and what they need to do next (if anything). They want to confirm that their original need has been met, or understand clearly why it has not.

**Service context â€” what happens before**

All applicable review teams have recorded their decisions. The decision consolidation step has run. A consolidated decision record exists in the system. The user has been waiting and is now receiving the outcome of that wait.

**Service context â€” what happens after**

If approved: the request transitions to onboarding execution. The user is notified when provisioning is complete and access is available (TD-05 triggers for the app owner). The user receives access instructions.

If approved with conditions: conditions are explained; if any conditions require action from the requester or app owner, those actions are specified clearly. Conditions are logged against the catalogue record.

If rejected: the user receives a plain-language explanation. If there is a reconsideration or appeals process (OQ-04), they are told how to access it. No further onboarding action is taken.

If deferred (further information required): this state is distinguished from an active RFI during review â€” deferral at decision stage means the consolidated decision cannot be reached yet; the user is told what specific information is still outstanding and from whom.

**Backstage dependencies**

- The decision notification must be triggered by the actual writing of the consolidated decision record â€” not by a timer or a manual notification step.
- The consolidated decision record must accurately reflect all team decisions, including any conditions, before the notification is sent.
- If conditions are attached, the conditions must be recorded as discrete, actionable items in the system before the notification is issued â€” the notification references them; it does not contain them in full narrative form only.

**Constraints the design must honour**

- The decision notification must use plain language â€” not internal governance taxonomy or legal language without explanation.
- The decision must be presented as a single, consolidated outcome â€” not as a list of separate team verdicts that the requester must interpret themselves.
- If the decision is "Approved with conditions", the conditions must be specific and actionable â€” not vague qualifications.
- The notification must include a clear, single next step â€” the user must not have to determine for themselves what happens now.

**Anti-goal**

After receiving this touchpoint, the user must NOT need to:
- Ask what the decision means in practice
- Contact any team to find out what conditions apply
- Determine for themselves what the next step is
- Wait for a separate communication to find out when access will be provisioned (if approved)

**Success criteria from the user's perspective**

- "I understood immediately what the decision was and what it meant for me."
- "If there were conditions, I knew exactly what they were and who was responsible for them."
- "The next step was obvious â€” I didn't have to ask."
- "My original need was met â€” or I understood clearly why it couldn't be."

---

### Touchpoint Brief 5 â€” Post-Onboarding (App Owner Obligations)

**Touchpoint identifier:** TD-05
**Channel:** Web app (primary); Email (notifications)
**User personas served:** App Sponsor / Technology Owner

---

**The user goal at this touchpoint**

The app owner wants a clear, persistent record of what they are responsible for now that the app is approved and live â€” and a reliable way to be told when those obligations require action.

**Service context â€” what happens before**

The app has been approved, provisioned, and is live. The catalogue record has been created automatically. The app owner has been formally assigned to the record as the responsible owner.

**Service context â€” what happens after**

This touchpoint persists for the life of the approved app. It is a long-running relationship between the app owner and the service. It concludes only if the app is retired, the approval is withdrawn, or ownership is formally transferred. Obligation due dates trigger notifications; missed obligations trigger escalation (to the service owner, and potentially to the app owner's line manager â€” see edge case in AC-01).

**Backstage dependencies**

- Obligations shown in this touchpoint must be drawn from the conditions recorded during review â€” they are not manually authored post-hoc. If the review did not record conditions as discrete, structured items, this touchpoint cannot surface them accurately.
- The obligation notification window (how far in advance a due date triggers a notification) must be agreed with the service owner and Legal before build.
- The catalogue record must be kept current â€” if the risk classification of an app changes after approval, the obligations may change; the process for updating obligations is defined by the service owner (OQ-08).

**Constraints the design must honour**

- Obligations must be specific, actionable, and owned â€” each obligation has a named owner, a due date, and a status. Vague obligations ("maintain compliance") are not acceptable.
- The app owner must not need to remember their obligations independently â€” the service must proactively notify them.
- The obligations view must distinguish between obligations that are upcoming, overdue, and complete.
- Transfer of ownership (when the app owner changes) must be a supported action â€” the design must not make obligations invisible or inaccessible during a transition.

**Anti-goal**

After accepting app ownership through this touchpoint, the app owner must NOT need to:
- Maintain a separate record of their obligations outside the service
- Discover an obligation due date by receiving a complaint that it was missed
- Ask the service team what their responsibilities are
- Lose visibility of obligations if they change roles and a new owner is assigned

**Success criteria from the user's perspective**

- "I can see at a glance everything I'm responsible for and when it's due."
- "I get notified well in advance when something is coming up â€” I'm not caught off guard."
- "If ownership changes, the handover is managed in the system â€” nothing falls through the gap."

---

## 5. EDGE CASE INVENTORY

*Scope: Intake form and triage specifically, as specified.*

---

### EC-01 â€” Error States

| Error State | Trigger | System Response | User Impact |
|---|---|---|---|
| EC-01-A: Field validation failure | User enters data in an invalid format (e.g., non-date in a date field, URL format expected but not provided) | Field is highlighted in real time before submission attempt; plain-language error message explains what is expected and why; no data in other fields is lost | User corrects the specific field; no other fields are affected |
| EC-01-B: Mandatory field missing on submission attempt | User attempts to submit with one or more mandatory fields empty | Form does not submit; all incomplete mandatory fields highlighted simultaneously; user is scrolled to the first incomplete field; count of incomplete fields shown | User completes missing fields and resubmits; no data loss |
| EC-01-C: File upload failure | Attached file exceeds size limit or is in an unsupported format | Upload field shows specific error: file size X exceeds limit Y / file type not accepted; list of accepted types shown; field accepts a retry without page reload | User selects a compliant file or is directed to compress/convert before uploading |
| EC-01-D: Session timeout during form completion | User's authenticated session expires mid-form | Auto-save captures most recent state before timeout; on re-authentication, user is returned to the form with data intact; a "Your session timed out â€” your progress has been saved" message is shown | User continues from where they left off; no data loss |
| EC-01-E: System unavailable at submission | Service is unavailable at the moment of submission (e.g., maintenance window, unplanned outage) | User receives an on-screen message explaining the service is temporarily unavailable; form data is held in local/session storage; user is given the option to retry or to receive a notification when the service is restored | User does not lose their form data; service team is alerted to the failed submission for follow-up |
| EC-01-F: Triage engine fails to classify after submission | Submission received but triage engine returns no classification | Request is held in a "Pending classification" state; requester is notified that classification is taking longer than expected; service team is alerted automatically; SLA clock does not start until classification completes | Requester sees an honest status; not "In review" when review has not started |

---

### EC-02 â€” Incomplete Submission States

| State | Trigger | System Response | User Impact |
|---|---|---|---|
| EC-02-A: Form started but not submitted (within current session) | User begins form, navigates away or closes browser | Auto-save retains all entered data; draft is associated with the user's account | User returns to find their draft intact |
| EC-02-B: Form started, saved as draft, not returned to (within X days) | User does not return to complete a draft within a defined inactivity period (X to be confirmed during build) | User receives an email reminder: "You have an incomplete application â€” it will expire in [Y days]" | User can return to complete; draft remains accessible until expiry |
| EC-02-C: Draft expires (user never completed submission) | Draft reaches expiry date without being submitted | Draft is deleted; user receives notification that the draft has expired and they can start a new request; no onboarding process was initiated | No process impact â€” nothing was submitted; user must restart if still needed |
| EC-02-D: Submission incomplete due to required attachment not yet available | User has answered all questions but cannot upload a required document (e.g., vendor contract not yet signed) | System allows form to be saved as a draft; the incomplete field is flagged; user cannot submit until the attachment is provided; user is reminded via email | User completes and submits when the document is available |

---

### EC-03 â€” Apps That Don't Fit the Triage Model (Ambiguous Risk)

| Scenario | Trigger | System Response | User Impact |
|---|---|---|---|
| EC-03-A: App category not recognised by triage model | Request attributes do not match any defined triage category | System defaults to standard review; request is flagged for manual triage review by service owner; requester is notified: "Your request requires additional classification â€” we'll be in touch within [X working days]"; SLA clock does not start until classification is confirmed | Requester is not misclassified into fast-track; review is not delayed indefinitely |
| EC-03-B: App straddles two risk categories (e.g., partially processes personal data, partially does not) | Answers to conditional questions create an internally inconsistent risk profile | System flags the inconsistency; requester is shown a plain-language prompt: "Your answers suggest [X] â€” please review [specific questions]"; if still inconsistent after review, the system defaults to the higher risk classification and flags for service owner review | Requester corrects if they answered incorrectly; if genuinely ambiguous, defaults to higher risk |
| EC-03-C: App is described by requester as a novel type not yet in the triage model | Free-text description in intake reveals the app does not fit existing categories | Triage engine flags the submission; service owner is notified; request is classified as "Pending classification"; triage criteria owners (Cybersecurity/Legal) are alerted to assess whether criteria need updating | Requester is not blocked indefinitely; process is initiated; criteria are refined |

---

### EC-04 â€” Duplicate Request Detection

| Scenario | Trigger | System Response | User Impact |
|---|---|---|---|
| EC-04-A: Exact duplicate â€” same app, same requesting team, existing request in progress | Submission matches an in-progress request by app name and requesting team/organisational unit | System prevents submission; requester is shown: "A request for [App X] from [your team] is already in progress â€” reference [REF-001]. You can view its status here." | Requester is directed to the existing request; no duplicate is created |
| EC-04-B: Near-duplicate â€” same app, different requesting team | Submission matches an in-progress request by app name but from a different team | System alerts requester: "A request for [App X] is currently in review by another team. You can still submit your request, or contact the service team to explore whether your need can be added to the existing request." Requester chooses to proceed or contact service team | Requester has information to make an informed choice; duplicate is allowed if requester confirms different need |
| EC-04-C: App already approved â€” duplicate of an existing catalogue entry | Submission matches an app already in the approved catalogue | System blocks intake; requester is directed to the discovery result for that app and the "Request access" path | Requester is redirected; no redundant review process is initiated |
| EC-04-D: App previously rejected â€” re-submission | Submission matches an app that was previously rejected | System alerts requester: "A previous request for [App X] was reviewed and [decision] on [date]. [Reason, if shareable]." Requester is given the option to continue (if circumstances have changed) or to withdraw. If they continue, the prior review record is surfaced to reviewers | Prior decision is not lost; reviewers benefit from prior context; requester can make an informed choice |

---

### EC-05 â€” Returning Requester (Previously Submitted or Abandoned)

| Scenario | Trigger | System Response | User Impact |
|---|---|---|---|
| EC-05-A: Requester has a previous approved request and is submitting a new one | Requester's account has one or more prior submissions | System pre-populates known organisational information (e.g., team, business unit, line manager) from the previous record; app-specific information is not pre-populated | Reduced re-entry burden; no risk of incorrect carry-forward of app-specific data |
| EC-05-B: Requester abandoned a previous request (draft expired) | Requester starts a new submission for the same app they previously abandoned | System detects the match and informs the requester: "You previously started a request for [App X] on [date] that was not completed. Would you like to start a new request?" | Requester is not confused by the history; clean new request initiated |
| EC-05-C: Requester returns to a live draft from a previous session | Requester logs in and navigates to the intake form | System presents the draft with a "Continue your saved request" prompt; draft summary shown (app name, started date, completion percentage) | Requester resumes efficiently; no need to restart |

---

### EC-06 â€” Third-Party Vendor Not in Existing Supplier Database

| Scenario | Trigger | System Response | User Impact |
|---|---|---|---|
| EC-06-A: Vendor name entered does not match any record in the supplier database | Requester types a vendor name that has no match in the Supplier Governance team's database | System shows "This vendor is not in our supplier database â€” your request will include a new vendor assessment." Requester is prompted to provide additional vendor information fields (fields defined post D-01); the request is routed to Supplier Governance as a mandatory team regardless of other triage outcomes | Requester understands the scope of their request is wider; no submission is blocked |
| EC-06-B: Vendor is in the database but under a different name or trading name | Requester enters a name that is a trading name, subsidiary, or alternative spelling | System applies fuzzy matching and presents potential matches: "Did you mean [Vendor A] (also known as [Trading Name])?" | Requester can confirm the correct vendor; avoids creating duplicate supplier records |
| EC-06-C: Vendor is known but has an unresolved governance issue (e.g., lapsed contract, unresolved compliance action) | Vendor is in the database but is flagged with an unresolved issue | System shows: "This vendor has an unresolved issue â€” your request will be reviewed by Supplier Governance. This may affect your request timeframe." Request is routed to Supplier Governance as mandatory; requester is not told the detail of the governance issue | Request is not blocked; Supplier Governance is engaged; requester is not given inappropriate access to internal governance data |

---

### EC-07 â€” Request Requiring Review by All Six Teams (Maximum Complexity Case)

| Aspect | Specification |
|---|---|
| **Trigger** | Triage engine determines that the request attributes require review by all six teams: App Packaging, Supplier Governance, Legal, Cybersecurity, Software License Management, and SSO |
| **Routing behaviour** | Request is dispatched simultaneously to all six team queues at the same timestamp; SLA clock for each team starts at the same moment; each team's review is independent |
| **Requester status view** | Status shows all six teams listed as "In review"; as each team completes their review, their status updates to "Complete â€” [date]"; the overall status does not move to "Decision" until all six teams have recorded their decisions |
| **Estimated timeframe** | Estimated completion date is calculated based on the longest SLA among the six teams â€” not the sum of all SLAs; this is the key benefit of parallel routing and must be accurately communicated |
| **RFI handling** | Multiple teams may issue RFIs simultaneously or in sequence; each RFI is presented to the requester as a distinct item in their dashboard; requester responds to each separately; responses are routed back to the issuing team; a backlog of concurrent RFIs must be visually manageable in the dashboard |
| **SLA breach handling** | If any one of the six teams breaches their SLA, the breach is flagged individually for that team; the other five teams' reviews continue unaffected; the service owner is notified of the breach for that team; the requester sees "Delayed â€” [Team X] review is overdue" without implication that all six teams are delayed |
| **Decision consolidation** | All six team decisions must be recorded before consolidation runs; if five of six teams are complete but one is outstanding, the status remains "In review" until all six are done; there is no partial decision |
| **Known risk** | Maximum-complexity cases are the highest-volume consumers of reviewer time and the most likely to breach SLA; the service owner's escalation authority is most critical in these cases; this case type should be included in pilot monitoring with explicit SLA tracking per team |

---

*End of specification.*

---

**Document status notes**

This specification is design-ready for all components except those explicitly blocked by unresolved dependencies (D-01 through D-06). Design and build must not proceed on blocked components without dependency resolution.

Dependencies D-01 through D-05 require active resolution by named owners before the next design phase can complete. The open questions (OQ-01 through OQ-09) require decisions from named owners before the affected components can be finalised. These are not design decisions â€” they are organisational and governance decisions that the design must implement, not create.

The North Star metric (requester-confirmed resolution rate within target timeframe without chasing) cannot be baselined until the pilot is live. All input metrics listed in Section 3 should be instrumented from day one of the pilot to enable baseline measurement and target-setting.agentId: a747cf9f5d01d187c (use SendMessage with to: 'a747cf9f5d01d187c' to continue this agent)
<usage>total_tokens: 26070
tool_uses: 0
duration_ms: 538345</usage>
