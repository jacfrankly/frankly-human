# Frankly Human Tooling — Dashboard Scaffold Plan

How to broaden the partial Why Workshop build (Netlify + Kit/Airtable) into a shared dashboard shell that all four diagnostics can eventually plug into — modelled on the useful patterns from the Plan B Engine teardown, adapted to the stack already in progress.

**Core principle:** build the container once, generically, while finishing the Why Workshop. Each of the other three tools (Business Why Workshop, Design Thinking Diagnostic, Design Leadership Diagnostic) should become "add a flow config," not "build a new app."

---

## The shape of it

Four pieces, reusable across every tool:

1. **Identity** — lightweight, email-based. No need for Google sign-in or passwords like the reference app. Simplest version: enter email → magic link or 6-digit code → session. Kit is already capturing emails somewhere in the funnel; this can be the same identity, not a separate signup.
2. **Runs** — every completed (or in-progress) session through any tool gets saved as a "Run": which tool, when, the answers given, and the generated output. This is the "Reports" pattern from Plan B Engine — newest first, one marked current, all reopenable.
3. **Flow engine** — the actual conversation/question sequence for a given tool. This is the only part that's genuinely different between Why Workshop, Business Why Workshop, and the two diagnostics. Everything else (identity, saving, reports, export) is shared.
4. **Output + handoff** — every run ends the same way regardless of tool: a named result (Why Statement / Business Why Statement / Design Influence Profile / Leadership Influence Profile), a Save/Print one-pager, and a "Continue in Claude" copy-paste prompt pre-filled with everything the run already knows.

---

## Data model (Airtable)

Three tables cover all four tools:

**Participants**
- email (primary key)
- name
- created date

**Runs**
- participant (link to Participants)
- tool (single select: Why Workshop / Business Why Workshop / Design Thinking Diagnostic / Design Leadership Diagnostic)
- status (in progress / complete)
- created date
- raw answers (JSON — whatever the flow collected)
- generated output (long text — the named statement/pattern plus supporting reasoning)
- handoff prompt (long text — the pre-filled "continue in Claude" text)

**Tool Configs** (optional, if you want the flow questions editable without redeploying)
- tool name
- phase definitions
- prompt library reference

This is deliberately close to what's likely already sketched for the Why Workshop backend — the only real addition is the `tool` field on Runs, which is what makes the whole thing generalize instead of needing a parallel Airtable base per tool later.

---

## Screens (mirrors Plan B Engine, adapted)

1. **Entry** — email capture → session start (no dashboard yet if it's someone's first run; go straight into the flow)
2. **Dashboard** — for returning participants: list of past Runs (title = tool + date), a "start new" option per tool, current run highlighted
3. **Flow runner** — the actual conversation, reusing whatever's built for Why Workshop; just needs to write to Runs on completion instead of ending the session
4. **Report view** — the saved output for one Run: named result, reasoning, Save/Print button, "Continue in Claude" prompt block with a copy button

---

## Mobile note (per the build-notes doc)

No persistent sidebar. On mobile, the tool list / navigation should collapse into a bottom sheet or hide behind a menu icon entirely — not shrink and stay visible. Test in portrait on a real phone before considering any screen done.

---

## Phasing

**Phase 1 — finish Why Workshop on this shell**
Build identity + Runs + report view + handoff prompt around the Why Workshop flow that's already partially built. Skip anything tool-agnostic-looking that isn't needed yet (no Tool Configs table, no multi-tool dashboard) — just prove the shell with one tool.

**Phase 2 — generalize**
Add the `tool` field, build the dashboard list view properly (multiple tools visible), and confirm the shell doesn't need Why-Workshop-specific assumptions baked in.

**Phase 3 — add Business Why Workshop**
Second flow config on the same shell. This is the real test of whether the generalization in Phase 2 worked — it should be materially faster to add than Phase 1 was.

**Phase 4 — add both diagnostics**
Same pattern, two more flow configs. By this point the shell is genuinely a "Frankly Human Engine," not four separate builds.

---

## What NOT to copy from Plan B Engine

- Full account system (Google OAuth, persistent login chrome) — overkill for this audience and this stage
- Fixed-step wizard with a step counter — our flows are coached conversations, not linear forms; keep them adaptive
- Sticky desktop-style sidebar nav — confirmed broken on mobile in their build, don't repeat it
