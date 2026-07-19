# Creative Director's Pipeline Playbook
## How to run the agent team from a stakeholder brief

---

## The shape of the workflow

```
Stakeholder brief (any format)
        ↓
You: Brief intake — structure it into the Brief Template
        ↓
Claude Code: Service Design Layer (agents 1–4)
        ↓  ← You review at each CD gate
Blueprint JSON produced
        ↓
Import into Blueprint Tool
        ↓
Claude Code: Touchpoint Design Layer (agents 5–14)
        ↓  ← You review at each CD gate
Design outputs produced
        ↓
Designers pick up touchpoint briefs and run Designpowers
```

You are the Creative Director throughout. The agents do the work. You approve the direction, resolve disagreements, and make the calls they cannot make.

---

## Part 1 — Before you open Claude Code

### What you need from the stakeholder

You do not need a polished brief. You need enough to answer six questions. Get these from whatever source you have — a meeting, an email, a Confluence page, a conversation:

1. **What is this service?** What does it do, for whom, delivered by which part of the organisation?
2. **What is the problem?** Why is this being looked at now? What is broken, missing, or changing?
3. **Who are the users?** Primary users (the people the service is for) and secondary users (staff, partners, anyone else affected).
4. **What does success look like?** How will you know this project delivered something useful?
5. **What are the constraints?** Timeline, budget, technology, regulation, organisational politics — anything that limits the solution space.
6. **What is out of scope?** Explicitly. If the stakeholder has not said, ask. Undefined scope is the most common source of wasted agent output.

You do not need perfect answers. You need honest ones. Gaps are fine — flag them as research questions for the service-researcher.

---

### The Brief Template

Fill this in before running any agent. It is what you paste into Claude Code to start the pipeline. It can be rough — full sentences are not required.

```markdown
# Brief: [Service name]

## The service
[What it does, for whom, delivered by which team or system]

## The problem
[Why this is being worked on now — what is broken, changing, or missing]

## Users
Primary: [who the service is primarily for]
Secondary: [staff, partners, or other affected parties]

## Success looks like
[How you will know this project delivered something useful]

## Constraints
- [Timeline if known]
- [Budget if known]  
- [Technology constraints — what systems must be used or avoided]
- [Regulatory or compliance requirements]
- [Organisational constraints — politics, dependencies, decisions already made]

## Explicitly out of scope
- [What this project will NOT address]

## What we already know
[Any existing research, previous work, relevant data, or context the agents should factor in]

## Research gaps
[Things we do not know yet that the service-researcher should investigate]

## Touchpoints we expect to design
[If known: the specific digital surfaces this project will produce — app, portal, dashboard, etc.]
[If unknown: leave blank — the journey-architect and service-blueprinter will determine this]

## Entry point
[ ] Fresh service design — standard pipeline from Part 2
[ ] UI review brief — existing interface, suspected service issues underneath (see Part 9)
[ ] Inherited prototype — vibe-coded or technically-led build, simultaneous UI + service work needed (see Part 10)
[ ] Hybrid — other combination (describe below)

## If UI review entry point:
Existing UI: [description or link]
Stakeholder's stated problem: [what they told you]
Diagnostic review completed: [ ] Yes  [ ] No
Service root causes identified: [ ] Yes — scope below  [ ] No — UI-only scope
Service investigation scope: [specific backstage processes, systems, handoffs to investigate]

## If inherited prototype entry point:
Prototype description: [what was built, by whom, using what approach]
How it was built: [vibe-coded / architect-led / technically-led / other]
User involvement in its design: [ ] None  [ ] Some  [ ] Substantial
Team's stated goal: [what they want from you]
Team's resistance level: [ ] Open to change  [ ] Cautious  [ ] Resistant to significant change
Prototype archaeology — assumed user goal: [what goal does the prototype assume the user has?]
Prototype archaeology — assumed backstage: [what processes/systems does it assume exist and work?]
Prototype archaeology — assumed pre/post: [what does it assume happens before and after the interaction?]
Prototype archaeology — unaddressed problems: [what user problems does it not attempt to solve?]
```

---

## Part 2 — Running the Service Design Layer in Claude Code

Open Claude Code in your project directory (the one containing your `agents/` folder).

The service design layer has four stages. Each produces a file. You review before proceeding to the next.

---

### Stage 1 — Service Researcher

**What it does:** Maps the ecosystem, conducts contextual analysis, and produces the research synthesis the journey-architect needs to draw a credible journey.

**The prompt:**

```
You are acting as the service-researcher agent. Here are your instructions:

[paste the full contents of agents/service-researcher.md]

Here is the brief you are working from:

[paste your completed Brief Template]

Please produce:
1. An ecosystem map
2. An actor / stakeholder map  
3. A contextual research synthesis

Where you do not have enough information to make a confident finding, flag it explicitly as a research gap rather than inferring. Write your handoff note to the journey-architect at the end.

Save your outputs to: outputs/01-service-research.md
```

**What to check before proceeding:**
- Are the research gaps named honestly, or has the agent inferred things it cannot know?
- Does the ecosystem map capture all the actors you know about from the stakeholder brief?
- Are there actors or dependencies the agent identified that surprise you? Chase those.

**Your CD gate:** Read the handoff note. If you disagree with anything the agent has framed as a key finding, correct it before the journey-architect runs. The journey-architect trusts what the service-researcher hands it.

---

### Stage 2 — Journey Architect

**What it does:** Draws the as-is and future-state journeys. Produces the touchpoint inventory and channel matrix that tells the blueprinter what surfaces need to be designed.

**The prompt:**

```
You are acting as the journey-architect agent. Here are your instructions:

[paste the full contents of agents/journey-architect.md]

Here is the brief:

[paste Brief Template]

Here is the service researcher's output:

[paste contents of outputs/01-service-research.md]

Please produce:
1. An as-is journey map
2. A future-state journey map
3. A touchpoint inventory
4. A channel matrix

Write your handoff note to the service-blueprinter at the end.

Save your outputs to: outputs/02-journey-architecture.md
```

**What to check before proceeding:**
- Does the future-state journey reflect what the stakeholder actually wants to achieve, or has the agent drifted toward what is easiest to design?
- Is the touchpoint inventory complete? Are there surfaces you know are in scope that are missing?
- Are the channel transitions realistic? The most common failure is a journey that assumes a seamless handoff between channels that is actually broken in the current organisation.

**Your CD gate:** This is the most important review in the service design layer. The journey-architect's output shapes everything downstream. If the journey is wrong, the blueprints will be wrong, and the designs will be wrong. Take time here.

---

### Stage 3 — Service Blueprinter

**What it does:** Produces the service blueprint and one touchpoint brief per digital surface. This is the handoff point between the service design layer and the product design layer.

**The prompt:**

```
You are acting as the service-blueprinter agent. Here are your instructions:

[paste the full contents of agents/service-blueprinter.md]

Here is the brief:

[paste Brief Template]

Here is the journey architect's output:

[paste contents of outputs/02-journey-architecture.md]

Please produce:
1. A service blueprint (frontstage / backstage / support processes)
2. A backstage process map for any complex processes
3. A system dependency map
4. One touchpoint brief for each digital surface in the touchpoint inventory

Write your handoff note to the design-strategist for each touchpoint brief.

Save your outputs to: outputs/03-service-blueprint.md
```

**What to check before proceeding:**
- Does each touchpoint brief contain enough backstage context for a designer to understand the constraints?
- Are there backstage dependencies flagged as "does not currently exist"? These are project risks — escalate them to the stakeholder before starting design.
- Is the line of visibility drawn correctly? Frontstage promises should not depend on backstage capabilities that are not confirmed.

**Your CD gate:** Review the touchpoint briefs as a set. Do they form a coherent service, or do they feel like isolated design tasks? If the briefs feel disconnected from each other, the journey-architect's output may need revision.

---

### Stage 4 — Policy Reviewer

**What it does:** Validates that the blueprint is deliverable — that the organisation's processes, policies, and systems can actually support what has been designed.

**The prompt:**

```
You are acting as the policy-reviewer agent. Here are your instructions:

[paste the full contents of agents/policy-reviewer.md]

Here is the brief:

[paste Brief Template]

Here is the service blueprint:

[paste contents of outputs/03-service-blueprint.md]

Please produce:
1. A promise-delivery gap analysis
2. Policy conflict flags
3. Backstage remediation recommendations with verdicts: design fix / backstage fix / re-blueprint

Save your outputs to: outputs/04-policy-review.md
```

**What to check before proceeding:**
- Are any gaps flagged as "re-blueprint"? These must be resolved before starting design. Go back to the service-blueprinter with the specific issue and revise.
- Are there "backstage fix" items that require action from other teams? These need to be raised with the stakeholder — design can start in parallel, but the backstage issues must be tracked.
- Are there design fix items that constrain what the design-lead can do? Note these in the touchpoint briefs.

**Your CD gate:** If any "re-blueprint" items exist, stop here. Resolve them first. Starting product design on a blueprint with known systemic gaps creates wasted work.

---

### Generating the blueprint JSON

Once all four service design outputs are complete and you are satisfied, generate the blueprint JSON for import into the tool.

**The prompt:**

```
I have completed the service design layer for a project. I need you to convert the outputs into a blueprint JSON file that I can import into my blueprint tool.

Here is the data model the tool expects:

[paste the Data Model section from blueprint-tool-spec.md]

Here are the service design outputs:

Service research: [paste outputs/01-service-research.md]
Journey architecture: [paste outputs/02-journey-architecture.md]  
Service blueprint: [paste outputs/03-service-blueprint.md]
Policy review: [paste outputs/04-policy-review.md]

Please generate a complete blueprint JSON. For each step:
- Set source: "agent" and agent_id to the appropriate agent
- Set confidence: "high" for well-supported findings, "medium" for inferred findings, "low" for gaps or assumptions
- Set requires_validation: true for any step flagged as uncertain or requiring stakeholder confirmation

Also populate the agent_pipeline array with the four agents and their handoff notes.

Save the JSON to: outputs/blueprint.json
```

Import `outputs/blueprint.json` into the blueprint tool using the `Open` button.

---

## Part 3 — The Creative Director gates (summary)

These are the moments where you must review before the pipeline continues. Do not skip them.

| Gate | After | What you are checking |
|------|-------|----------------------|
| **Gate 1** | Service Researcher | Research gaps are honest. Ecosystem is complete. No unexplained inferences. |
| **Gate 2** | Journey Architect | Future-state journey reflects stakeholder intent. Touchpoint inventory is complete. Channel transitions are realistic. |
| **Gate 3** | Service Blueprinter | Touchpoint briefs have enough backstage context. No unconfirmed backstage dependencies that would block design. |
| **Gate 4** | Policy Reviewer | No re-blueprint items remain unresolved. Backstage fix items are tracked with stakeholder. |
| **Taste** | Before Inspire phase | Aesthetic instincts captured. Taste profile loaded or set. |
| **Taste Check** | Mid-build | Intermediate design output reviewed. Aesthetic mismatches caught before Review phase. |
| **Testing gate** | After prototype build | TASKS array matches Experiment Designer output. Pass/fail criteria are specific. Facilitator sessions planned. |
| **Ship** | After Fix round | Final approval. Nothing ships without this. |

---

## Part 4 — Running the Touchpoint Design Layer

For each touchpoint in the blueprint, run a separate Designpowers pipeline. The touchpoint brief from the service-blueprinter is the starting input.

You do not have to run all touchpoints sequentially. If you have multiple designers, they can each run a pipeline for a different touchpoint simultaneously.

**Starting prompt (per touchpoint):**

```
I am running a Designpowers design pipeline for a specific touchpoint. 

The agents I have available are:
[list your 10 product design agent files]

The touchpoint brief is:
[paste the relevant touchpoint brief from outputs/03-service-blueprint.md]

The full service blueprint context is:
[paste outputs/03-service-blueprint.md]

Please start with the design-scout agent. Here are its instructions:
[paste agents/design-scout.md]

Run the Research phase and produce the competitive audit, pattern library, and benchmark analysis. Save to: outputs/[touchpoint-name]/05-design-scout.md
```

Then continue sequentially through design-strategist, inspiration-scout, design-lead, motion-designer, content-writer, design-builder, accessibility-reviewer, design-critic, heuristic-evaluator — pausing at each CD gate.

---

## Part 5 — Handling agent disagreements

When reviewer agents (accessibility-reviewer, design-critic, heuristic-evaluator, policy-reviewer) reach conflicting conclusions, do not let Claude Code resolve the conflict automatically. You resolve it.

**The prompt when two agents disagree:**

```
The accessibility-reviewer and design-critic have reached conflicting conclusions about [describe the issue].

Accessibility-reviewer says: [paste finding]
Design-critic says: [paste finding]

As Creative Director, I need to understand the trade-off clearly before making a call. 

Please summarise:
1. What exactly is in conflict
2. What each agent's reasoning is
3. What the options are and what each option costs

Do not resolve the conflict. Present it for my decision.
```

Then make the call and tell Claude Code:

```
I have reviewed the conflict. My decision is: [your decision and rationale].

Please update the design accordingly and note this decision in the retrospective log.
```

---

## Part 6 — Typical session structure

### First session (brief intake + service design layer)
*2–4 hours depending on complexity*

1. Get brief from stakeholder — meeting, email, document, whatever you have
2. Fill in the Brief Template (20–30 minutes)
3. Run service-researcher → review → run journey-architect → review → run service-blueprinter → review → run policy-reviewer → review
4. Generate blueprint JSON
5. Import into blueprint tool, scan for obvious errors
6. Identify any blockers (re-blueprint items, missing backstage info) and raise with stakeholder

### Second session (touchpoint design — one touchpoint)
*2–3 hours*

1. Pick one touchpoint from the blueprint
2. Set taste profile (this is your input — have references ready)
3. Run design-scout → design-strategist → inspiration-scout → Taste gate
4. Review taste with stakeholder or designer if needed
5. Run design-lead + motion-designer + content-writer (parallel or sequential) → Taste Check gate
6. Run design-builder → review agents → fix round → Ship gate

### Stakeholder walkthrough session
*1–2 hours*

1. Open blueprint tool
2. Enter presentation mode (`P`)
3. Walk through the map stage by stage
4. Edit steps live as stakeholders correct or add information
5. Toggle fail points, moments of truth, touchpoints as they are identified
6. Exit presentation mode, save, export updated JSON if needed for agent re-run

---

## Part 7 — Common problems and how to handle them

**"The agent produced something too generic"**

The agent did not have enough specific context. Go back to the brief — what did you not include? Stakeholder organisation context, existing system names, previous project history, and known constraints dramatically improve output specificity.

Prompt addition: *"Your previous output was too generic. Here is additional context: [specific details]. Please revise with this in mind."*

**"The agent ignored a constraint from the brief"**

Restate the constraint explicitly and ask for revision:

*"Your output does not reflect the following constraint from the brief: [constraint]. Please revise the [specific section] to account for this."*

**"The service blueprint does not match what the stakeholder described"**

Go back to Gate 2 (Journey Architect). The blueprint is downstream of the journey — if the blueprint is wrong, the journey map is probably wrong. Do not try to patch the blueprint directly.

**"The journey feels too aspirational — we cannot deliver this"**

This is a policy-reviewer finding before the policy-reviewer has run. Stop and run the policy-reviewer now. Do not continue to design an undeliverable service.

**"The agent is producing too much output — it is hard to read"**

Ask for a summary first, then expand:

*"Please summarise your output as 5 bullet points before the full document. I want to check the direction before reading the detail."*

**"I am not sure if this output is good enough to move forward"**

Run the design-critic directly on any output, not just design artefacts:

*"You are the design-critic. Here are your instructions: [paste design-critic.md]. Please review the following journey architect output against the brief and tell me whether it is good enough to proceed to blueprinting, and what is missing: [paste output]."*

---

## Part 8 — The files you are managing

By the end of a full project, you will have:

```
project-name/
├── brief.md                          ← your Brief Template
├── agents/                           ← all 14 agent .md files
│   ├── service-researcher.md
│   ├── journey-architect.md
│   ├── service-blueprinter.md
│   ├── policy-reviewer.md
│   ├── design-strategist.md
│   ├── design-scout.md
│   ├── inspiration-scout.md
│   ├── design-lead.md
│   ├── motion-designer.md
│   ├── content-writer.md
│   ├── design-builder.md
│   ├── accessibility-reviewer.md
│   ├── design-critic.md
│   └── heuristic-evaluator.md
└── outputs/
    ├── 01-service-research.md
    ├── 02-journey-architecture.md
    ├── 03-service-blueprint.md
    ├── 04-policy-review.md
    ├── blueprint.json                ← imports into blueprint tool
    ├── [Project Short Name] — Prototype.html    ← self-contained clickable prototype
    ├── [Project Short Name] — Blueprint Studio.html
    ├── test-summaries/                           ← one file per testing session
    │   ├── Session 01 — Prototype Test Summary.md
    │   ├── [Participant Name] — Prototype Test Summary.md
    │   └── ...
    └── [touchpoint-name]/
        ├── 05-design-scout.md
        ├── 06-design-strategist.md
        ├── 07-inspiration-scout.md
        ├── 08-design-lead.md
        ├── 09-motion-designer.md
        ├── 10-content-writer.md
        ├── 11-design-builder.md
        ├── 12-accessibility-review.md
        ├── 13-design-critic.md
        └── 14-heuristic-evaluation.md
```

Keep this folder in a SharePoint or OneDrive location your team can access. The `outputs/` folder is the paper trail — every decision, every handoff note, every finding, all dated and attributed.

---

## Part 9 — Entry point: UI review brief masking a service problem

### The situation
A stakeholder comes with a request to improve or redesign an existing interface. The problem they describe is real — but your diagnostic sense suggests the interface is compensating for broken backstage processes, and a UI redesign alone will not hold.

### Step 1 — The diagnostic conversation
Before opening Claude Code, ask these questions in your stakeholder meeting. They reveal service problems beneath UI requests:

- *"When users struggle with this interface, what do they typically do next?"* — If the answer involves calling someone or escalating, the UI is compensating for a broken backstage process.
- *"What happens after a user completes this flow?"* — Long manual handoffs or unexplained delays mean the frontstage promise is not backed by the backstage.
- *"Has this UI been redesigned before? What happened?"* — If problems recurred after a previous redesign, you are treating symptoms not causes.
- *"Who else is involved in delivering this service beyond the system?"* — Undisclosed actors signal a service design problem.
- *"What would a good outcome look like for the user — not just for this screen?"* — Shifts the frame from interface to journey.

Two or more of these signals = service problem wearing a UI brief.

### Step 2 — Name it without losing the stakeholder
Wrong framing: *"Actually this is a service design problem and we need to scope it properly before we do anything."*

Right framing: *"What you're describing in the UI is real and we should fix it. What I want to make sure is that we fix it in a way that sticks — because if the problem is partly upstream of the interface, a redesign alone won't hold. Can I spend a short time understanding the wider context before we get into the UI work? It'll make the design brief much sharper."*

Key words: **short time** and **sharper brief**. You are protecting their UI investment, not expanding their project.

### Step 3 — Run the prototype audit (design-critic + heuristic-evaluator)

```
You are acting as the design-critic and heuristic-evaluator.

[paste agent instructions]

Here is the existing UI: [screenshots, description, or walkthrough]
Here is the stakeholder's reported problem: [what they told you]

Evaluate the UI and categorise every finding as:
- UI ROOT CAUSE — fixable by redesign
- SERVICE ROOT CAUSE — the UI is compensating for something broken upstream

For SERVICE ROOT CAUSE findings, describe what backstage condition the UI is working around.
```

This output makes the argument for service investigation in neutral technical language. The agents are making the case, not you.

### Step 4 — Offer a genuine choice
Present findings to the stakeholder and offer two options:

**Option A — UI-only scope.** Fix all UI root cause findings. Note service root cause issues as known risks. Fast, scoped, lower sustained impact.

**Option B — UI plus service diagnostic (parallel, not sequential).** UI refinement starts immediately. Service investigation runs in parallel and informs the final design. Modest time addition. Higher sustained impact.

Most stakeholders choose Option B when shown the evidence and when it is framed as parallel not sequential.

### Step 5 — If Option A chosen
Run standard Designpowers touchpoint pipeline against the existing UI. Document service root cause findings in the blueprint tool as a "Known Service Risks" lane with steps flagged `requires_validation: true`. This is your head start when the problems recur.

### Step 6 — If Option B chosen
Complete the Brief Template's "If UI review entry point" fields. Run the service design layer scoped tightly to the Layer 3 (service assumption) findings only. This takes hours not days. Import into blueprint tool. Use the blueprint to inform the final UI design.

---

## Part 10 — Entry point: inherited prototype (vibe-coded or technically-led)

### The situation
A team has built a working prototype using vibe-coding or architecture-led development. No user involvement in the design. They want UI refinement and service design simultaneously but are resistant to significant changes. This is the new normal — handle it as a repeatable pattern.

### The two problems you are managing
**The evidence problem** — the prototype embeds assumptions about users and backstage processes that have never been tested. It may be solving the right problem badly, or a related but wrong problem.

**The ownership problem** — the team has psychological investment in what they built. Treating it as a problem to be replaced will end the engagement. Treat it as a hypothesis to be tested and you keep the room.

### The core reframe
Say this, or a version of it:
*"What you've built is a hypothesis made tangible — a hypothesis about what this service should do. My job is to test that hypothesis against user reality and service reality, and then help you evolve it rather than replace it."*

### Step 1 — Prototype archaeology (before any agents)
Spend time with the prototype before opening Claude Code. Treat it as a primary source that reveals the team's mental model. Answer these questions and record them in the Brief Template:

- What user goal does this prototype assume the user has?
- What does it assume happens before the user arrives at this interface?
- What does it assume happens after they complete their task?
- What backstage processes does it assume exist and are reliable?
- What user problems does it not attempt to solve — and are those in scope?

These become your hypothesis list.

### Step 2 — Three-layer prototype audit

```
You are acting as the design-critic and heuristic-evaluator.

[paste agent instructions]

Here is the prototype: [description, screenshots, or walkthrough]
Here is what the team built it for: [their stated purpose]
Here is the prototype archaeology — the assumptions it embeds: [your archaeology findings]

Evaluate the prototype and categorise every finding into one of three layers:

LAYER 1 — UI surface: visual design, copy, interaction patterns.
Fixable without understanding the user or the service.

LAYER 2 — UX assumptions: flows, IA, task models.
Embed assumptions about how users think and what they need.
Cannot be validated without user exposure.

LAYER 3 — Service assumptions: what the prototype assumes about
backstage processes, systems, handoffs, and people.
Cannot be evaluated without service design investigation.

For each finding: state which layer, and why.
```

Share this output with the team. Layer 1 findings are immediately actionable — this shows you are adding value. Layer 2 and 3 findings build the evidence-based case for deeper investigation without you having to make that argument yourself.

### Step 3 — Run two tracks in parallel (the key structural move)
Do not make service design a prerequisite for UI work. Run them simultaneously.

**Track A — UI refinement on the prototype (immediate)**
Take Layer 1 findings and start improving. Run design-lead, content-writer, and accessibility-reviewer against the prototype. Produces tangible wins quickly, builds trust, gives the team momentum. Keep the existing prototype as the base — you are refining, not replacing.

**Track B — Service investigation (parallel, scoped tightly)**
Scope the service design agents to the Layer 3 assumptions only:

```markdown
## Service investigation scope (Track B brief)
Prototype: [what was built]
Hypotheses to test: [the Layer 3 / backstage assumptions from the audit]
Specifically investigating: [which backstage processes the prototype touches]
NOT investigating: [everything else — keep this tight]
```

Run service-researcher (focused on: do these backstage processes actually work as assumed?) → journey-architect (as-is journey the prototype implies vs. journey users actually experience) → service-blueprinter (briefs scoped to prototype's touchpoints only).

### Step 4 — Get the prototype in front of users (human work, not agent work)
Before Track A goes beyond initial improvements, get the prototype in front of real users — even briefly. Five users, a corridor test, three SMEs talking through their actual workflow.

Frame to the team: *"Before we lock in the UI direction, let's do a quick sense-check with a few people who'll use this. Half a day, saves us rework."*

The goal is not comprehensive research. It is evidence that is not you. The team can argue with your opinion. They cannot argue with what three users did.

### Step 5 — The convergence session
Once Track A has produced initial improvements, Track B has a service blueprint, and you have user observations — run a convergence session with the team:

1. Here is what the prototype does well (validate their work)
2. Here is what users responded to and where they struggled (evidence not opinion)
3. Here is what we found about the backstage processes the prototype depends on
4. Here is the gap between what the prototype assumes and what is actually true
5. Here are the options for what to do next (not a prescription)

The prototype is now Version 1 of the right direction rather than a flawed artefact to be replaced. Changes are justified by evidence. The team has been part of the discovery rather than recipients of a verdict.

### Step 6 — Informed redesign
UI changes go into a revised Track A run — now informed by service blueprint context and user evidence. Service gaps go into the blueprint tool with a roadmap: some addressed in this iteration, some tracked as future work. The team knows why every change is being made.

### Choreography summary
```
Inherited prototype
      ↓
Prototype archaeology — record assumptions in Brief Template
      ↓
Three-layer audit (design-critic + heuristic-evaluator)
      ↓
Share Layer 1 findings with team immediately
      ↓
┌─────────────────────────┐    ┌──────────────────────────────┐
│ Track A                 │    │ Track B                      │
│ UI refinement           │    │ Service investigation         │
│ Layer 1 findings        │    │ Scoped to Layer 3 assumptions │
│ design-lead,            │    │ service-researcher,           │
│ content-writer,         │    │ journey-architect,            │
│ accessibility-reviewer  │    │ service-blueprinter           │
└─────────────────────────┘    └──────────────────────────────┘
      ↓                               ↓
      └──────────────┬────────────────┘
                     ↓
        User exposure (even minimal — 3–5 people)
                     ↓
        Convergence session with team
        (validate + evidence + gap + options)
                     ↓
        Informed redesign
        (Track A revised + service roadmap)
```

### On the resistance to change
The resistance is not irrational — it is protective of effort and investment. The sequence above addresses it structurally:
- You never tell the team the prototype is wrong
- You start by making it better (Track A), not by questioning it
- Evidence from users speaks, not your opinion
- The convergence session positions changes as completing what they started, not replacing it
- Every change has a documented reason (user finding or service gap), not designer preference

### Adapting the Brief Template for this entry point
Fill in the "If inherited prototype entry point" fields in the Brief Template — particularly the prototype archaeology section. The more specifically you capture what the prototype assumes, the more precisely the service agents can test those assumptions.

---

## Part 11 — Running the PM agent pipeline (ProductPowers)

### The situation
A product owner or platform owner brings you a brief — new initiative, new feature, strategic question. You want to run the full ProductPowers pipeline before design work begins, either alongside the PO or as a service you are providing to enable them.

### The PM pipeline in Claude Code

Open your `~/Documents/agent-system/` project in VS Code with Claude Code. The PM pipeline has three layers running in sequence, each with a Product Lead gate before the next layer begins.

---

### Strategy Layer (runs once per initiative)

**Stage 1 — Market Researcher**

```
Act as the market-researcher agent.
Read agents/pm/market-researcher.md for your instructions.

Here is the brief:
[paste brief or reference projects/[name]/brief.md]

Produce your full output and save to:
outputs/[project-name]/01-market-research.md
```

**What to check:** Are estimates labelled as estimates? Is the competitive set broader than the obvious? Are risks specific rather than generic?

**CD gate:** Read the handoff note. Correct any gaps before moving on — the user-researcher will use this as context.

---

**Stage 2 — User Researcher**

```
Act as the user-researcher agent.
Read agents/pm/user-researcher.md for your instructions.

Here is the brief: [paste or reference]
Here is the market research: [paste outputs/[name]/01-market-research.md]

Produce your full output using JTBD framing and service design lens.
Label all findings as [RESEARCHED], [INFERRED], or [ASSUMED].
Save to: outputs/[project-name]/02-user-research.md
```

**What to check:** Are JTBD findings specific to this service context? Does the assumption inventory name the things most likely to be wrong? Is the service lens present — not just what users do in the product, but what they do when it fails them?

---

**Stage 3 — Business Analyst**

```
Act as the business-analyst agent.
Read agents/pm/business-analyst.md for your instructions.

Here is the brief: [paste or reference]
Here is the market research: [paste 01-market-research.md]
Here is the user research: [paste 02-user-research.md]

Produce the business case, ROI model, and strategic alignment map.
Save to: outputs/[project-name]/03-business-case.md
```

**What to check:** Are financial assumptions visible and challengeable? Is the strategic alignment honest — does it flag misalignment rather than manufacturing a connection?

---

**Stage 4 — Strategy Architect**

```
Act as the strategy-architect agent.
Read agents/pm/strategy-architect.md for your instructions.

Here is the brief: [paste or reference]
Market research: [paste 01]
User research: [paste 02]
Business case: [paste 03]

Produce the product vision, North Star metric, input metrics,
OKR alignment, and product principles.
Save to: outputs/[project-name]/04-product-strategy.md
```

**★ STRATEGY GATE** — Review with the PO before proceeding. Check:
- Is the North Star genuinely about user value, not a proxy metric?
- Do the product principles rule things out, or are they so broad they permit anything?
- Is the tension between user need and business viability named rather than papered over?
- Would the PO use this strategy to argue against a bad proposal?

If the strategy is not good enough to gate on, send it back. Do not proceed to discovery with a weak strategy.

---

### Discovery Layer (runs per opportunity — may loop)

**Stage 5 — Opportunity Mapper**

```
Act as the opportunity-mapper agent.
Read agents/pm/opportunity-mapper.md for your instructions.

Product strategy and North Star metric: [paste 04-product-strategy.md]
User research: [paste 02-user-research.md]

Build the Opportunity Solution Tree.
Map opportunities — do NOT generate solutions yet.
Produce the prioritised opportunity backlog and assumption inventory.
Save to: outputs/[project-name]/05-opportunity-map.md
```

**What to check:** Does the tree have opportunities at multiple levels of abstraction? Are the top 3 opportunities genuinely different, or variations of the same thing? Is the assumption inventory honest about what is not yet known?

---

**Stage 6 — Risk Assessor**

```
Act as the risk-assessor agent.
Read agents/pm/risk-assessor.md for your instructions.

Opportunity map: [paste 05-opportunity-map.md]
Business case: [paste 03-business-case.md]

Produce the risk register, critical assumption list, mitigation strategies,
and go/no-go recommendation.
Save to: outputs/[project-name]/06-risk-assessment.md
```

**What to check:** Are any structural risks (cannot be tested, must be escalated to PO or stakeholder) present? Is the go/no-go recommendation direct rather than hedged?

---

**Stage 7 — Experiment Designer**

```
Act as the experiment-designer agent.
Read agents/pm/experiment-designer.md for your instructions.

Opportunity map: [paste 05]
Risk assessment and critical assumptions: [paste 06]

Design the minimum experiment to test the most critical assumption.
Produce hypothesis statements with specific pass/fail criteria.
Save to: outputs/[project-name]/07-experiment-design.md
```

**★ VALIDATION GATE** — Review the experiment design with the PO before running:
- Is the hypothesis specific enough to pass or fail clearly?
- Is this the minimum test — or is it a prototype waiting to become a product?
- Are the pass/fail thresholds specific enough that a reasonable person could evaluate them?
- Is the riskiest assumption being tested first?

After experiments run, feed results back into the opportunity mapper:

```
Update the opportunity map based on these experiment results:
[paste findings]
Read agents/pm/opportunity-mapper.md.
Revise outputs/[project-name]/05-opportunity-map.md with validated /
invalidated branches clearly labelled.
```

Repeat the discovery loop (stages 5–7) until the top opportunity is sufficiently validated to proceed to delivery.

---

### Delivery Layer (runs per feature / release)

**Stage 8 — Prioritisation Lead**

```
Act as the prioritisation-lead agent.
Read agents/pm/prioritisation-lead.md for your instructions.

Validated opportunity backlog: [paste 05-opportunity-map.md — validated version]
Risk assessment: [paste 06]
Business case: [paste 03]

Produce RICE scores with explicit assumptions, MoSCoW analysis,
and a trade-off analysis.
Save to: outputs/[project-name]/08-prioritisation.md
```

---

**Stage 9 — Roadmap Architect**

```
Act as the roadmap-architect agent.
Read agents/pm/roadmap-architect.md for your instructions.

Prioritised backlog: [paste 08]
Product strategy: [paste 04]
Technical constraints: [describe or paste]

Produce the product roadmap (Now/Next/Later), release plan,
and dependency map.
Save to: outputs/[project-name]/09-roadmap.md
```

**★ ROADMAP GATE** — Review sequence and dependencies with the PO. Is the sequencing logic explicit and challengeable? Are dependencies that could block multiple downstream items visible?

---

**Stage 10 — Requirements Writer**

```
Act as the requirements-writer agent.
Read agents/pm/requirements-writer.md for your instructions.

Validated opportunity: [paste relevant section from 05]
Experiment findings: [paste 07]
Prioritisation decision: [paste 08]

Produce user stories with acceptance criteria, PRD, and —
critically — the feature brief / touchpoint brief that the
design system will receive.
Save to: outputs/[project-name]/10-requirements.md
```

**This is the handoff point to the design system.** The feature brief / touchpoint brief in the requirements output is what you pass to the service-blueprinter or design-strategist to begin the Designpowers pipeline.

---

**Stage 11 — Metrics Definer**

```
Act as the metrics-definer agent.
Read agents/pm/metrics-definer.md for your instructions.

Product strategy (North Star): [paste 04]
Feature brief: [paste relevant section from 10]

Define success metrics, leading indicators, guardrail metrics,
and the measurement plan including instrumentation requirements.
Save to: outputs/[project-name]/11-metrics-plan.md
```

---

**Stage 12 — Product Critic**

```
Act as the product-critic agent.
Read agents/pm/product-critic.md for your instructions.

Requirements: [paste 10]
Validated opportunity map: [paste 05 — validated version]
Product strategy and principles: [paste 04]

Review requirements against the validated opportunity.
Does each requirement trace to a real user need?
Does the solution actually solve the problem, or a proxy of it?
Produce a verdict: rethink / revise / proceed with note / proceed.
Save to: outputs/[project-name]/12-product-critique.md
```

If the product critic says **rethink** — go back to the opportunity mapper before any further delivery work.
If **revise** — return to requirements writer with specific revision instructions.
If **proceed with note** or **proceed** — continue.

---

**Stage 13 — Launch Planner**

```
Act as the launch-planner agent.
Read agents/pm/launch-planner.md for your instructions.

Feature brief: [paste 10]
Metrics plan: [paste 11]
Roadmap: [paste 09]

Produce the GTM plan, staged rollout strategy, adoption metrics,
communication plan, and change management brief.
Save to: outputs/[project-name]/13-launch-plan.md
```

**★ LAUNCH GATE** — PO approves rollout strategy and confirms internal readiness before feature ships.

---

**Stage 14 — Retrospective Lead**

```
Act as the retrospective-lead agent.
Read agents/pm/retrospective-lead.md for your instructions.

Metrics plan: [paste 11]
Launch data and user feedback: [paste or describe]

Review actual outcomes against expected metrics.
Update the opportunity map.
Produce the next cycle brief.
Save to: outputs/[project-name]/14-retrospective.md
```

**★ LEARNING GATE** — PO and you review whether strategy needs revision based on outcomes. The retrospective-lead's next cycle brief feeds back to the user-researcher to begin the next discovery cycle.

---

### PM pipeline gates summary

| Gate | After | What you are checking |
|------|-------|----------------------|
| **Strategy gate** | Strategy Architect | North Star is about user value. Principles rule things out. Tensions named. |
| **Validation gate** | Experiment Designer | Minimum test. Specific pass/fail. Riskiest assumption tested first. |
| **Roadmap gate** | Roadmap Architect | Sequencing logic explicit. Dependencies visible. |
| **Launch gate** | Launch Planner | Internal readiness confirmed. Rollback criteria defined. |
| **Learning gate** | Retrospective Lead | Outcomes reviewed. Strategy revised or confirmed. Next cycle briefed. |

---

## Part 12 — Claude Code prototype archaeology (automated)

### The situation
The prototype is already a Claude Code project. Rather than walking through the UI and manually recording what it assumes, Claude Code can read the entire codebase and infer the archaeology automatically — from routing, component hierarchy, data models, API calls, and state management. This is faster and more accurate than manual observation.

### The prompt

Run this inside the prototype's Claude Code project before doing anything else:

```
Read this entire codebase and produce a prototype archaeology analysis.
For each section, reference specific files, components, and routes.

1. Implied user goal
What goal does the navigation structure and primary flows assume
the user has? Which files and routes support this inference?

2. Assumed pre-conditions
What does the code assume is true before the user arrives?
(auth state, data already loaded, prior steps completed elsewhere)
Reference specific files, guards, redirects, or data-fetching patterns.

3. Assumed post-conditions
What does the code assume happens after the user completes a flow?
Look for: API calls at flow completion, navigation targets, state
resets, and anything that implies a manual step not in the code.

4. Backstage dependencies
What processes, systems, or APIs does the code touch or assume exist?
List everything called, imported, stubbed, or mocked.
Distinguish between: confirmed integration / placeholder / assumed.

5. Navigation and IA structure
Map the current information architecture:
- All routes and their relationships
- Primary navigation and what it reveals about the product's mental model
- Secondary navigation or in-flow navigation
- The conceptual model the IA implies about what the product is for

6. Unaddressed user problems
What is structurally absent that a user of this service would need?
What flows are missing? What states have no handling?
What does the prototype assume the user will do that the code
does not support?

7. Hardcoded assumptions
Any data, flows, or states that are hardcoded rather than
driven by real system behaviour. These are hypothesis flags —
they represent decisions made without evidence.

Save to: outputs/[project-name]/00-prototype-archaeology.md
```

### What this replaces

This automated archaeology replaces the manual Step 1 from Part 10 (the five questions about what the prototype assumes). The output is richer because it sees the code, not just the interface — it catches assumptions baked into the implementation that would be invisible from the UI.

The output feeds directly into the three-layer audit (Part 10, Step 2). The Layer 3 items from the audit are the backstage assumptions identified in the archaeology.

### After the archaeology runs

Feed the archaeology output into the brief template:

```
Fill in the prototype archaeology fields in the brief template
using this analysis:

[paste outputs/[project-name]/00-prototype-archaeology.md]

Extract:
- Implied user goal → brief field: "Prototype archaeology — assumed user goal"
- Assumed backstage → brief field: "Prototype archaeology — assumed backstage"  
- Assumed pre/post conditions → brief field: "Prototype archaeology — assumed pre/post"
- Unaddressed problems → brief field: "Prototype archaeology — unaddressed problems"
- Hardcoded assumptions → research gaps section

Save updated brief to: projects/[project-name]/brief.md
```

Then run the three-layer audit from Part 10 Step 2, using the archaeology output as additional context alongside the brief.

### When archaeology reveals something serious

If the archaeology reveals that the prototype's IA or navigation structure is fundamentally misaligned with the implied user goal — which is common in architecture-led builds — name it to the team before running the audit:

*"Before we run the formal review, I want to share something the codebase analysis surfaced. The navigation structure implies [X] as the primary user goal, but the service context suggests the actual goal is [Y]. This is worth discussing before we invest in refining the UI, because it may affect the fundamental structure rather than just the surface."*

This is a much easier conversation than presenting it as a critique after the team has seen the audit findings. The archaeology makes it a structural observation, not a design opinion.

---

## Part 13 — The combined PM + Design pipeline

### The situation
You are working alongside a PO on a new initiative. Both the PM pipeline and the design pipeline need to run — not sequentially, but in a structured relationship where PM discovery gates design work and design findings can send work back up the PM chain.

### The sequence

```
PM: Strategy Layer (Parts 11 stages 1–4)
        ↓ STRATEGY GATE
PM: Discovery Layer (Parts 11 stages 5–7, may loop)
        ↓ VALIDATION GATE
PM: Delivery starts — Requirements Writer produces touchpoint brief
        ↓ HANDOFF
Design: Service Design Layer (Part 2 — service-researcher through policy-reviewer)
        ↓ OR if service context already known:
Design: Touchpoint Design Layer starts from touchpoint brief (Part 4)
        ↓ TASTE GATE
Design: Design → Build → Review
        ↓
PM: Metrics monitoring + Retrospective Lead
        ↓ LEARNING GATE
Next cycle begins
```

### The handoff in detail

The Requirements Writer produces a touchpoint brief. This is what the design system receives. The handoff prompt:

```
The PM pipeline has produced a validated touchpoint brief.
Read the requirements: outputs/[project-name]/10-requirements.md

Extract the touchpoint brief section and pass it to the
service-blueprinter agent. Read agents/service/service-blueprinter.md.

The blueprinter should use the touchpoint brief as their primary input,
supplemented by the service design layer outputs if available:
[paste service design outputs if run, or note they are not available]

Produce touchpoint briefs for each digital surface identified.
Save to: outputs/[project-name]/service-blueprint.md
```

### When design findings send work back up

The design system has two escalation paths back into the PM pipeline:

**Design Critic → Requirements Writer**
When the design-critic finds that the design cannot honour the brief because the brief itself is wrong — the user need was misspecified, or the solution does not address the validated opportunity:

```
The design-critic has flagged a problem with the requirements brief.
Finding: [paste design-critic finding]

Act as the product-critic agent.
Read agents/pm/product-critic.md.
Review this finding against the validated opportunity map:
[paste 05-opportunity-map.md]

Is this a requirements revision (return to requirements-writer)
or a deeper opportunity misalignment (return to opportunity-mapper)?
Produce a verdict with specific revision instructions.
```

**Policy Reviewer → Roadmap Architect**
When the policy-reviewer finds that backstage processes cannot support what the design promises — and the gap is systemic rather than a design fix:

```
The policy-reviewer has found a systemic backstage gap:
[paste policy-reviewer finding]

This is not a design fix — it requires a change to the
delivery roadmap or the backstage capability plan.

Act as the roadmap-architect agent.
Read agents/pm/roadmap-architect.md.
Review the roadmap and flag: does this gap require a new work item
before this touchpoint can ship, or is it a dependency to track?
Produce a specific roadmap amendment recommendation.
Save to: outputs/[project-name]/roadmap-amendment-[date].md
```

### Working session structure for combined pipeline

**Session 1 — PM strategy layer (2–3 hours with PO)**
Run market-researcher → user-researcher → business-analyst → strategy-architect with the PO in the Product Lead role. End with a strategy gate review. PO approves or revises.

**Session 2 — PM discovery layer (2–3 hours)**
Run opportunity-mapper → risk-assessor → experiment-designer. PO gates the experiment design. Experiments run between sessions (async).

**Session 3 — Discovery synthesis + delivery start (1–2 hours)**
Review experiment findings. Update opportunity map. Run prioritisation-lead → roadmap-architect → requirements-writer. Extract touchpoint briefs.

**Session 4 — Service design layer (2–3 hours)**
Run service-researcher → journey-architect → service-blueprinter with PO present for backstage confirmation. Policy-reviewer runs async.

**Session 5 — Touchpoint design (per touchpoint, 2–3 hours)**
Run Designpowers pipeline per touchpoint. Taste gate with stakeholder. Build → review → fix.

**Session 6 — Convergence and launch planning (1 hour)**
Run launch-planner. Gate with PO. Define rollout approach.

**Session 7 — Retrospective (2–4 weeks post-launch, 1 hour)**
Run retrospective-lead with PO. Gate on learnings. Brief next cycle.

### What you own vs what the PO owns

This is worth being explicit about with your PO partner before starting:

| Decision | Owner |
|----------|-------|
| North Star metric | PO (you advise) |
| Strategy gate — proceed or revise | PO |
| Validation gate — experiment design approval | PO |
| Roadmap sequence | PO (you advise on dependencies) |
| Launch gate | PO |
| Learning gate | PO |
| Service design layer direction | You |
| Taste profile and aesthetic direction | You |
| Design critique and review | You |
| Handoff quality from PM to design | Shared |
| Escalations from design back to PM | Shared |

The PO owns the product decisions. You own the design and service decisions. The handoff and escalation paths are where you work together.

---

## Part 14 — Prototype testing harness

### What it is

Every HTML prototype built in this system ships with a built-in testing harness. The harness is invisible unless activated — opening the prototype shows a modal that offers "Begin testing session" or "Open prototype only." When activated, a dark bar locks to the top of every screen with task instructions, Pass/Fail buttons, and an Annotate toggle. The prototype underneath is unchanged — participants interact with it normally while the facilitator records observations above.

This is not a separate tool. It is baked into the prototype HTML file at build time. Every prototype is always test-ready.

---

### Standard harness components

Every prototype produced by this system includes these components, populated per project:

| Component | What it does |
|---|---|
| **Intro overlay** | Shown on load. Lists tasks for facilitator review. Two options: begin session or open prototype only. |
| **Harness bar** | Fixed bar at top. Shows task counter, progress dots, scenario text, and Pass/Fail buttons. Pass/Fail criteria in button tooltips — visible to facilitator only. |
| **Annotate mode** | Click Annotate, then click anywhere on the prototype to drop a numbered amber pin. Input popup opens for the observation note. Ctrl+Enter saves. |
| **Pins** | Document-relative — stay anchored to content as the facilitator scrolls. Only shown for the current screen. |
| **Summary panel** | Opens after final task or on demand. Two tabs: Task results (verdict + annotations per task) and All annotations (chronological list). |
| **Save test feedback** | Name input + save button in summary footer. Uses browser Save dialog (Chrome/Edge). Generates a formatted markdown summary doc. |
| **Copy as text** | Plain text version of the full session (tasks + verdicts + annotations) for pasting into a report or Claude prompt. |

---

### Where tasks come from

Tasks in the harness are derived directly from the **Experiment Designer** output (`07-experiment-design.md`). The mapping is:

| Experiment type | Task type |
|---|---|
| Prototype usability test (E5-type) | Catalogue or navigation discovery task |
| Dual-participant intake test (E6-type) | Form completion / submission task |
| Post-task interview (E7-type) | Screen review + verbal debrief task |
| Adversarial test (E4-type) | Scenario-specific form task — run after intake task |

The Experiment Designer names the hypothesis, scenario design, participant setup, and pass/fail thresholds. These map directly into the TASKS array. Do not write tasks from scratch — always derive them from the experiment file.

---

### Task structure — the TASKS array

Each task in the harness follows this structure. This is what you update when building a new prototype:

```javascript
{
  id: 'T1',                          // sequential, T1–TN
  title: 'Short facilitator label',   // shown in summary panel
  hypothesis: 'E5 — H1 App Discovery', // experiment reference from 07-experiment-design.md
  scenario: 'Read aloud to participant before they interact.',
  instruction: 'What to say as they begin: do not prime or guide.',
  passCriteria: 'Specific observable behaviour that constitutes pass.',
  failCriteria: 'Specific observable behaviour that constitutes fail.'
}
```

**Rules for task writing:**

- `scenario` is read aloud to the participant — no jargon, no internal framing. Write it as a real-world situation.
- `instruction` is what the facilitator says to start the task — keep it neutral. "Use it as you normally would" not "click the search bar."
- `passCriteria` and `failCriteria` are in facilitator tooltips — participants never see them. Write them as observable behaviours, not design preferences.
- Tasks that run sequentially (e.g., confirmation screen debrief running after a form submission) should note this in their scenario: *"You've just submitted the request — this is the confirmation screen."* This orients the participant without requiring navigation.
- The adversarial triage task (E4-type) must not name its purpose. Brief participants as a general usability test. If the scenario reveals that triage accuracy is being tested, the test is invalid.

---

### Deriving tasks from the experiment designer output

When the Experiment Designer has run, use this prompt to generate the TASKS array:

```
The Experiment Designer has produced experiment designs for prototype testing.
Read outputs/[Project Short Name]/[Project Short Name] — 07 Experiment Design.md.

Identify all experiments designated as "Experiment type: Prototype usability test",
"Dual-participant prototype test", "Post-task interview", or "Adversarial prototype test".

For each, produce one TASKS array entry following this format:
{
  id: 'T[N]',
  title: '[facilitator-facing short label]',
  hypothesis: '[experiment reference] — [hypothesis label]',
  scenario: '[read aloud to participant — plain language, no internal framing]',
  instruction: '[neutral prompt to start the task]',
  passCriteria: '[observable pass behaviour from experiment pass criterion]',
  failCriteria: '[observable fail behaviour from experiment fail criterion]'
}

Rules:
- Sequence tasks so that form-completion tasks precede post-submission debrief tasks
- Adversarial tasks should follow natural-flow tasks (participant has already used the service)
- Do not reveal triage or classification testing in the scenario or instruction
- Pass/fail criteria must be observable behaviours — not design opinions
- Maximum 5 tasks per session (participant fatigue)

Output the complete TASKS array ready to paste into the prototype HTML script block.
```

---

### Testing gate — before sessions begin

Before running any participant sessions, verify:

- [ ] TASKS array entries match experiments from `07-experiment-design.md` — not invented
- [ ] Scenario text for each task is readable aloud in under 30 seconds
- [ ] Pass/Fail criteria are specific enough that two facilitators would make the same call
- [ ] Adversarial task (E4-type) scenario does not reveal it is testing triage accuracy
- [ ] Reviewer participants for E6-type tasks are real reviewers from the actual teams — not proxies or service designers roleplayingParticipant recruitment is in progress (target: 3–5 requesters + 2 reviewers)

---

### Running a session — facilitator protocol

**Before the session**

1. Open `[Project Short Name] — Prototype.html` in Chrome or Edge on the session computer
2. The intro overlay appears — review the task list with yourself, not the participant
3. Prepare any scenario props (printed brief, scenario card) so you can hand them to participants without reading from a screen

**Starting the session**

1. Tell the participant: *"This is a working prototype of a service we're designing. There are no right or wrong actions — we're testing the design, not you. I'll be watching and taking notes using the tool at the top. Please think aloud as you go."*
2. Click **Begin testing session** — the harness bar appears
3. Read the Task 1 scenario aloud from the harness bar
4. Click nothing — watch what the participant does first

**During tasks**

- Record **Pass** or **Fail** when the task reaches a natural conclusion — before moving on
- Use **Annotate** to pin observations in real time: click the button, click the screen area where the observation belongs, type the note
- Do not prompt or guide — if the participant is stuck, note it as an annotation ("participant stuck at search — did not proceed to form") and let it play out
- For post-task debrief tasks (E7-type): ask the interview questions from the experiment design. Record responses as annotations, not as pass/fail until you have the full answer

**Ending the session**

1. After the final Pass/Fail is recorded, the harness bar shows "Session complete"
2. Click **View summary** to open the summary panel
3. Enter a session name in the footer input (e.g. "Participant 1 — Finance" or the participant's first name and team)
4. Click **Save test feedback** — navigate to `outputs/[Project Short Name]/test-summaries/` in the Save dialog
5. The file saves as `[Session name] — Prototype Test Summary.md`

**Between sessions**

- Refresh the browser before each new participant — this clears all session state and pins
- Do not reload from the Save dialog's recent files — reload the HTML directly to clear state fully

---

### Annotation standards

Annotations should capture observable behaviour, not design opinions. The facilitator is a recorder during the session, not a critic.

| Good annotation | Why |
|---|---|
| "Participant searched 'tracking' before going to form — found nothing, then submitted anyway" | Observable sequence, no interpretation |
| "Participant read SLA aloud, said 'so that's two to six weeks' — misread the range" | Exact quote, specific confusion |
| "Participant did not see the back button — scrolled back to top instead" | Navigation failure, specific location |

| Poor annotation | Why |
|---|---|
| "Navigation is confusing" | Design opinion, not observable behaviour |
| "Participant struggled" | Not specific enough to act on |
| "Bad UX on this screen" | Conclusion, not observation |

After sessions, annotations are evidence. Keep them descriptive. Interpretation happens in the design implications table in the summary doc — not in the annotations themselves.

---

### Session output files

Each session produces one markdown file in `outputs/[Project Short Name]/test-summaries/`:

```
[Participant name or Session N] — Prototype Test Summary.md
```

The file contains:
- Session overview table (tasks completed, pass/fail count, annotation count)
- Task-by-task results (hypothesis, scenario, verdict, annotations)
- Design implications table (annotation → task → finding)

Name sessions consistently so they sort clearly:
- `Session 01 — Prototype Test Summary.md` (anonymous or pre-session)
- `Sarah J Finance — Prototype Test Summary.md` (named, no surnames)
- `Reviewer 01 Cybersecurity — Prototype Test Summary.md` (reviewer participants)

---

### After testing — feeding results back into the pipeline

Session summary files are the input to three downstream agents:

**1. Opportunity Mapper (re-run)**
Paste session summaries to update validated/invalidated branches:

```
The prototype testing sessions have completed. Here are the session summaries:

[paste all test-summaries/*.md files]

The current opportunity map is at: outputs/[Project]/05-opportunity-map.md
Read agents/pm/opportunity-mapper.md.

Update the opportunity map:
- Mark each hypothesis as validated, invalidated, or partial — with evidence from session summaries
- Flag any new opportunities surfaced by participant annotations
- Note which annotations point to design fixes (addressable in prototype iteration)
  vs. service-level findings (require blueprint revision)
Save the updated map to: outputs/[Project]/05-opportunity-map.md
```

**2. Prioritisation Lead**
Feed session summaries + updated opportunity map to prioritisation:

```
Prototype testing is complete. Updated opportunity map and all session summaries are available.
Feed validated findings into prioritisation.
Read agents/pm/prioritisation-lead.md.
[paste 05-opportunity-map.md — updated version]
[paste session summaries]
```

**3. Prototype amendment (design fix loop)**
For findings classified as design fixes in the implications table:

```
The prototype testing sessions have produced these design findings:
[paste design implications tables from session summaries]

These are the screens and elements that need updating in:
outputs/[Project Short Name]/[Project Short Name] — Prototype.html

For each finding, describe the specific change needed.
Then implement the changes in the prototype HTML.
```

This is the design fix loop — testing → annotations → implications → prototype amendment → re-test. Run until findings converge or the build decision is made.

---

### Building the harness into a new prototype

When generating a new HTML prototype, the prompt to Claude Code is:

```
Build a self-contained HTML clickable prototype for [Project Short Name].

The prototype covers these touchpoints: [list from service blueprinter output]
The app/service data is: [paste APPS array or equivalent data]
The screens are: [list screen IDs and descriptions]

The prototype must include the standard testing harness:
- Intro overlay with task list (populated from TASKS array on load)
- Harness bar (fixed, dark, position:fixed top:0, z-index:9000)
- Annotation overlay and pin system (document-relative pin positions)
- Pin input popup (amber border, Ctrl+Enter saves)
- Summary panel with Task results and All annotations tabs
- Save test feedback button with session name input (File System Access API, fallback download)
- Copy as text button

The TASKS array should be derived from:
outputs/[Project Short Name]/[Project Short Name] — 07 Experiment Design.md

Follow the task derivation rules from the playbook (Part 14).

Save the prototype to:
outputs/[Project Short Name]/[Project Short Name] — Prototype.html
```

The testing harness CSS, HTML structure, and JS functions are consistent across all prototypes. Only the TASKS array, APPS/data array, and screen content change per project.

---

---

## Quick reference — the six questions for any brief

Before running any agent, make sure you can answer these:

1. What is this service and who is it for?
2. What is broken or changing and why now?
3. Who are the users (primary and secondary)?
4. What does success look like?
5. What are the constraints?
6. What is explicitly out of scope?

If you cannot answer all six, go back to the stakeholder before running agents. Agent output is only as good as the brief it runs from.

---

## Quick reference — entry point decision

| Situation | Entry point | First agent action |
|-----------|-------------|-------------------|
| Fresh brief from stakeholder | Standard (Part 2) | service-researcher |
| Fresh brief — full PM + design pipeline | Combined pipeline (Part 13) | market-researcher |
| Brief needs PM discovery before design | PM pipeline only (Part 11) | market-researcher |
| Existing UI, problem feels surface | Standard (Part 2) | service-researcher with UI context |
| Existing UI, diagnostic signals present | UI review (Part 9) | design-critic + heuristic-evaluator on existing UI |
| Prototype exists, team open to direction | Inherited prototype (Part 10) | Claude Code archaeology (Part 12) → three-layer audit |
| Prototype exists, team resistant to change | Inherited prototype (Part 10) — Track A first | Claude Code archaeology (Part 12) → Track A immediately |
| Prototype exists in Claude Code / VS Code | Inherited prototype (Part 10) | Automated archaeology (Part 12) — skip manual questions |
| No prototype, no brief — just a problem statement | Standard (Part 2) | service-researcher |
| HTML prototype built, ready for user testing | Testing harness (Part 14) | Derive TASKS from 07-experiment-design.md → testing gate → run sessions |
| Testing sessions complete, summaries available | Post-testing pipeline (Part 14) | Re-run opportunity-mapper with session summaries → prioritisation-lead |

When in doubt about the entry point: run the diagnostic questions from Part 9 Step 1 in your first stakeholder conversation. The answers will tell you which path you are on.
