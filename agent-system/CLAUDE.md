# Agent System — ProductPowers + Designpowers Extended

This project contains a multi-agent system spanning three layers:
- Product Management (PM) agents — 14 agents across Strategy, Discovery, Delivery
- Service Design agents — 4 agents for service-level context
- Product Design agents — 10 agents for touchpoint-level design

## Agent directories

- `agents/pm/` — Product Management agents
- `agents/service/` — Service Design agents  
- `agents/design/` — Product Design agents
- `skills/` — Standalone skills (invoke without pipeline context)
- `outputs/` — All agent outputs saved here
- `projects/` — One subfolder per active project

## Pipeline routing

The brief form captures an **Engagement type** that maps directly to the pipeline below. When you receive a brief, read the engagement type and run the corresponding agents in sequence.

| Engagement type | Agents — in sequence |
|---|---|
| **Full pipeline** | market-researcher → user-researcher → business-analyst → strategy-architect → opportunity-mapper → risk-assessor → experiment-designer → requirements-writer → service-researcher → journey-architect → service-blueprinter → policy-reviewer → design-scout → design-strategist → inspiration-scout → design-lead + content-writer + motion-designer → design-builder → accessibility-reviewer + design-critic + heuristic-evaluator |
| **PM strategy + service design** | market-researcher → user-researcher → business-analyst → strategy-architect → opportunity-mapper → risk-assessor → experiment-designer → requirements-writer → service-researcher → journey-architect → service-blueprinter → policy-reviewer |
| **Service design only** | service-researcher → journey-architect → service-blueprinter → policy-reviewer → requirements-writer |
| **UI review with service context** | service-researcher (context only) → design-scout → design-strategist → inspiration-scout → design-lead + content-writer + motion-designer → design-builder → accessibility-reviewer + design-critic + heuristic-evaluator |
| **Touchpoint design only** | design-scout → design-strategist → inspiration-scout → design-lead + content-writer + motion-designer → design-builder → accessibility-reviewer + design-critic + heuristic-evaluator |

**Key gates — pause and review before crossing:**
- After strategy-architect → **Strategy gate** (is the North Star about user value? do the principles rule things out?)
- After experiment-designer → **Validation gate** (is this the minimum test? are pass/fail criteria specific?)
- After service-blueprinter → **Blueprint gate** (does every touchpoint have a clear owner and backstage process?)
- After inspiration-scout → **Taste gate** (does this direction fit the client's context?)
- After design-builder → **Ship gate** (accessibility, heuristics, and critique resolved?)

For detailed prompts for each agent stage, refer to `creative-director-playbook.md`.

---

## How to run an agent

Tell Claude Code which agent to activate and paste or reference the agent file:

```
Act as the market-researcher agent. 
Read agents/pm/market-researcher.md for your instructions.
Here is the brief: [paste brief]
Save your output to outputs/[Project Short Name]/[Project Short Name] — 01 Market Research.md
```

## How to run the full PM pipeline

```
Run the full ProductPowers strategy layer on this brief.
Agents to run in sequence: market-researcher → user-researcher → business-analyst → strategy-architect
Pause after each agent for my review before proceeding.
Read each agent file from agents/pm/ before running.
Save each output to outputs/[Project Short Name]/ with sequential numbering and the project short name as a prefix on each file title.
```

## How to run the service design layer

```
Run the service design layer on this brief.
Agents: service-researcher → journey-architect → service-blueprinter → policy-reviewer
Read each agent file from agents/service/ before running.
Pause after each for my review.
Save outputs to outputs/[Project Short Name]/ with sequential numbering and the project short name as a prefix on each file title.
```

## How to run a Designpowers touchpoint pipeline

```
Run the Designpowers pipeline for this touchpoint.
Brief: [paste touchpoint brief from service-blueprinter output]
Agents: design-scout → design-strategist → inspiration-scout → design-lead + content-writer + motion-designer → design-builder → accessibility-reviewer + design-critic + heuristic-evaluator
Read each agent file from agents/design/ before running.
Pause at taste, taste-check, and ship gates.
Save outputs to outputs/[Project Short Name]/[touchpoint-name]/
```

## How to invoke a skill

```
Apply the [skill-name] skill to the following:
Read skills/[skill-name].md for instructions.
[paste content to analyse]
```

## Output file naming convention

Every output is saved in a folder named after the project short name. Every file
title begins with that short name, followed by a sequential number and descriptor.

Folder:  outputs/[Project Short Name]/
Files:   [Project Short Name] — 01 Market Research.md
         [Project Short Name] — 02 User Research.md
         [Project Short Name] — 03 Business Case.md
         [Project Short Name] — 04 Strategy.md
         [Project Short Name] — 05 Opportunity Map.md
         [Project Short Name] — 06 Risk Assessment.md
         [Project Short Name] — 07 Experiment Design.md
         [Project Short Name] — 08 Requirements.md
         [Project Short Name] — 09 Metrics Plan.md
         [Project Short Name] — 10 Roadmap.md
         [Project Short Name] — Journey Maps & Recommendations.md
         [Project Short Name] — Design Spec.md
         [Project Short Name] — Blueprint Studio.html
         [Project Short Name] — Index.md

The Blueprint Studio HTML file is a self-contained interactive service blueprint viewer.
It opens directly in Chrome or Edge — no install required, no VS Code required.
Each project gets its own HTML file with its blueprint data pre-loaded.
To generate one: read `Blueprint Studio/ServiceBlueprint.jsx`, set PROJECT_NAME, populate
STAGE_DEFAULTS / LANE_DEFAULTS / CELL_DEFAULTS with the project's blueprint data, then
write the complete component (wrapped in HTML with React + Babel CDN scripts) to
`outputs/[Project Short Name]/[Project Short Name] — Blueprint Studio.html`.

Example (project short name "App Onboarding"):
  outputs/App Onboarding/App Onboarding — 01 Market Research.md
  outputs/App Onboarding/App Onboarding — Blueprint Studio.html
  outputs/App Onboarding/App Onboarding — Index.md

