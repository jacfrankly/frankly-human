#!/bin/bash

# ============================================================
# ProductPowers + Designpowers Extended — Mac Setup Script
# Run this from the folder containing all your .md agent files
# ============================================================

set -e

echo ""
echo "=================================================="
echo "  Agent System Setup"
echo "  ProductPowers + Designpowers Extended"
echo "=================================================="
echo ""

# ── Step 1: Create project directory ──────────────────────

PROJECT_DIR="$HOME/Documents/agent-system"
echo "→ Creating project directory at $PROJECT_DIR"
mkdir -p "$PROJECT_DIR/agents/pm"
mkdir -p "$PROJECT_DIR/agents/design"
mkdir -p "$PROJECT_DIR/agents/service"
mkdir -p "$PROJECT_DIR/skills"
mkdir -p "$PROJECT_DIR/outputs"
mkdir -p "$PROJECT_DIR/projects"
echo "  ✓ Directory structure created"
echo ""

# ── Step 2: Copy PM agents ─────────────────────────────────

echo "→ Copying PM agents..."

PM_AGENTS=(
  "market-researcher.md"
  "user-researcher.md"
  "business-analyst.md"
  "strategy-architect.md"
  "opportunity-mapper.md"
  "risk-assessor.md"
  "experiment-designer.md"
  "requirements-writer.md"
  "prioritisation-lead.md"
  "metrics-definer.md"
  "roadmap-architect.md"
  "product-critic.md"
  "launch-planner.md"
  "retrospective-lead.md"
)

COPIED_PM=0
for agent in "${PM_AGENTS[@]}"; do
  if [ -f "./$agent" ]; then
    cp "./$agent" "$PROJECT_DIR/agents/pm/$agent"
    echo "  ✓ $agent"
    COPIED_PM=$((COPIED_PM + 1))
  else
    echo "  ⚠ $agent not found in current directory — skipping"
  fi
done
echo "  $COPIED_PM / ${#PM_AGENTS[@]} PM agents copied"
echo ""

# ── Step 3: Copy service design agents ────────────────────

echo "→ Copying service design agents..."

SERVICE_AGENTS=(
  "service-researcher.md"
  "journey-architect.md"
  "service-blueprinter.md"
  "policy-reviewer.md"
)

COPIED_SERVICE=0
for agent in "${SERVICE_AGENTS[@]}"; do
  if [ -f "./$agent" ]; then
    cp "./$agent" "$PROJECT_DIR/agents/service/$agent"
    echo "  ✓ $agent"
    COPIED_SERVICE=$((COPIED_SERVICE + 1))
  else
    echo "  ⚠ $agent not found in current directory — skipping"
  fi
done
echo "  $COPIED_SERVICE / ${#SERVICE_AGENTS[@]} service design agents copied"
echo ""

# ── Step 4: Copy product design agents ────────────────────

echo "→ Copying product design agents..."

DESIGN_AGENTS=(
  "design-strategist.md"
  "design-scout.md"
  "inspiration-scout.md"
  "design-lead.md"
  "motion-designer.md"
  "content-writer.md"
  "design-builder.md"
  "accessibility-reviewer.md"
  "design-critic.md"
  "heuristic-evaluator.md"
)

COPIED_DESIGN=0
for agent in "${DESIGN_AGENTS[@]}"; do
  if [ -f "./$agent" ]; then
    cp "./$agent" "$PROJECT_DIR/agents/design/$agent"
    echo "  ✓ $agent"
    COPIED_DESIGN=$((COPIED_DESIGN + 1))
  else
    echo "  ⚠ $agent not found in current directory — skipping"
  fi
done
echo "  $COPIED_DESIGN / ${#DESIGN_AGENTS[@]} product design agents copied"
echo ""

# ── Step 5: Create CLAUDE.md ───────────────────────────────

echo "→ Creating CLAUDE.md..."

cat > "$PROJECT_DIR/CLAUDE.md" << 'CLAUDEMD'
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
         [Project Short Name] — Index.md

Example (project short name "App Onboarding"):
  outputs/App Onboarding/App Onboarding — 01 Market Research.md
  outputs/App Onboarding/App Onboarding — Index.md

CLAUDEMD

echo "  ✓ CLAUDE.md created"
echo ""

# ── Step 6: Create a sample project folder ────────────────

echo "→ Creating sample project structure..."
mkdir -p "$PROJECT_DIR/projects/example-project"
cat > "$PROJECT_DIR/projects/example-project/brief.md" << 'BRIEF'
# Brief: [Service name]

## The service
[What it does, for whom, delivered by which team or system]

## The problem
[Why this is being worked on now]

## Users
Primary: 
Secondary: 

## Success looks like
[How you will know this delivered value]

## Constraints
- Timeline: 
- Technology: 
- Regulatory: 
- Organisational: 

## Explicitly out of scope
- 

## What we already know
[Existing research, previous work, relevant data]

## Research gaps
[What the agents should flag as unknown]

## Entry point
[ ] Fresh service design
[ ] UI review brief
[ ] Inherited prototype

## Touchpoints we expect to design
[List or leave blank for agents to determine]
BRIEF

echo "  ✓ Example project created at projects/example-project/"
echo ""

# ── Summary ───────────────────────────────────────────────

TOTAL=$((COPIED_PM + COPIED_SERVICE + COPIED_DESIGN))
echo "=================================================="
echo "  Setup complete"
echo "=================================================="
echo ""
echo "  Project location: $PROJECT_DIR"
echo "  Agents installed: $TOTAL of 28"
echo "  PM agents:            $COPIED_PM / 14"
echo "  Service design agents: $COPIED_SERVICE / 4"  
echo "  Product design agents: $COPIED_DESIGN / 10"
echo ""
echo "  Next steps:"
echo "  1. Open $PROJECT_DIR in VS Code:"
echo "     code $PROJECT_DIR"
echo ""
echo "  2. Open Claude Code in that directory"
echo ""
echo "  3. Copy your brief into:"
echo "     projects/example-project/brief.md"
echo ""
echo "  4. Start your first pipeline:"
echo "     'Act as the market-researcher agent."
echo "      Read agents/pm/market-researcher.md."
echo "      Here is the brief: [paste brief]'"
echo ""
echo "  Full instructions in CLAUDE.md"
echo ""
