# Design Thinking Diagnostic — Content Copy

Prepared by: Content Writer (CW)
For: Design Lead and Design Builder
Inputs: `Design Thinking Diagnostic — 02 Strategy.md` (design-strategist), `Design Thinking Diagnostic — 03 Inspiration.md` (inspiration scout), `business-planning/Design_Thinking_Diagnostic_Curriculum.docx` (touchpoint brief — guardrails and Reframe story lifted near-verbatim as instructed), `why-workshop-app-v2/index.html` + `app.js` + `netlify/functions/chat.js` (shipped voice and architecture baseline), `style-guides/Content & Voice Guide.html` (house voice rules)

---

## 0. How to read this deck

- `{name}`, `{project}`, `{lens}`, `{mindset}`, `{state}` are runtime placeholders, filled the same way the Why Workbook fills `${v3}` etc. into its developer messages.
- Phase headers use the phase tokens from the Strategy doc's IA table (`0, 1a, 1b, 1c, 2a, 2b, 3, 4`) so this maps directly onto a `PHASE_LABELS`-style object and a `buildDeveloperMessage(phase, …)` switch, exactly like `why-workshop-app-v2/netlify/functions/chat.js`.
- Two registers are in play throughout, per Design Principle 5: **default** (direct, commercially fluent, a little edge) and **guardrail** (the three named triggers only — defensiveness, blame-by-name, distress). Every phase below is written in default register; Section 5 holds the guardrail lines and states exactly when they override the default.
- Grade 6 is the ceiling, not the floor, per the content-writer brief — but this audience is professionally fluent designers mid-career, so some copy sits a little above Grade 6 where the word is the user's own word (*"commercially," "attribution," "organisational"*) rather than product jargon. Flagged inline where it happens.

---

## 1. Welcome screen

```
eyebrow        Frankly Human
title           The Design Thinking
                 Diagnostic.
lede 1          A 20–30 minute diagnostic conversation.
lede 2          You'll leave with the specific pattern keeping you in an
                 executor role — and the exact module that fixes it.
name label      Your first name
name placeholder First name
CTA             Begin the diagnostic →
reassurance     Free · No account needed · 20–30 minutes
```

**Resume banner** (same pattern as Why Workbook's `resume-banner`, session-persisted):
```
Welcome back{, name} — you have a Design Thinking Diagnostic in progress.
[Continue where I left off →]   [Start fresh instead]
```

**Rationale (handoff note to design-lead):** the strategy doc is explicit that this audience "will bail from anything that smells like a 45-minute self-discovery workshop." Two copy decisions do that work on this screen:

1. Lede 1 leads with the time commitment, not the promise — the opposite order from the Why Workbook, which leads with format ("A 45-minute self-paced coaching workbook") because time isn't Dinesh's objection, format doubt is. Here, time *is* the objection, so it goes first and gets a number.
2. The reassurance note swaps the Why Workbook's "Start anytime" for the time figure again, repeated. Repetition of "20–30 minutes" across lede and reassurance note is deliberate, not an oversight — this is the single fact most likely to stop a scroll-past bail. Don't compress it into one instance to save vertical space; if space is tight, cut something else first.
3. Nowhere on this screen does the word "reflect," "explore," "journey," or "values" appear. That's a content constraint the design-lead should know about before laying out any supporting microcopy near this screen — no illustration caption or tooltip should reintroduce that vocabulary here even if it survives elsewhere in the product family.

---

## 2. Diagnostic screen — shell copy

**Header**
```
sr-only h1      the Design Thinking Diagnostic
brand           frankly human.
phase label     (see table below, aria-live="polite")
header-right    the pattern, read.
support button  Need support?
back button     ← back   (aria-label: "Go back")
```

**Phase label table** (mirrors `PHASE_LABELS` / `updatePhaseLabel`):

| Token | Displayed as |
|---|---|
| `0` | *(no label — the Reframe is a cold open, not a counted phase)* |
| `1a`, `1b`, `1c` | Phase 1 of 4 · The Three Lenses |
| `2a`, `2b` | Phase 2 of 4 · The Six Mindsets |
| `3` | Phase 3 of 4 · Where Influence Breaks Down |
| `4` | Phase 4 of 4 · Design Influence Profile |

**Chat input**
```
input placeholder   Type your answer…
send button aria    Send answer
```
(Kept one word tighter than the Why Workbook's "Type your response…" / "Send response" — "answer" fits a diagnostic register better than "response," which leans therapeutic.)

**Default continue button** (overridden per-phase where noted below): `Continue →`

---

## 3. Phase-by-phase chat copy

### Phase `0` — Reframe

Opens cold, before any question. Does not ask the participant anything — same job as the Why Workbook's Phase 1: name a failure pattern without blaming the participant, then hand control over.

> {name}, here's how this usually goes wrong.
>
> Meridian Bank shipped a new onboarding flow. On time. Under budget. Drop-off at step 2 got 34% worse. Nobody had asked why.
>
> That's not a skills problem. It's what happens when a real decision skips a lens, and nobody notices until the number comes in. This finds where that's happening in your own work — and whether it's you, your organisation, or someone you needed in your corner.
>
> One real project. Twenty minutes. Let's find the pattern.
>
> Ready when you are.

*Sourcing note: the curriculum document's own opener doesn't name a bank — it reads "A product team shipped a new onboarding flow…" The named-org treatment above ("Meridian Bank," the exact 34%-drop-off figure kept intact) borrows the house style guide's own recurring example ("Meridian Bank shipped on time. Drop-off at step 2 was 34% worse" — `Content & Voice Guide.html`, Pattern 02). This is the strategy doc's "Meridian Bank story" instruction resolved: same data points as the curriculum's real opener, dressed in the studio's own named-provocation convention rather than inventing a new one. Flagging this substitution explicitly for the design-lead and strategist in case "verbatim from Module 01" was meant more literally — easy one-line revert if so.*

### Phase `1a` — The Three Lenses (Discovery)

> Bring one real, recent project to mind — something you actually worked on in the last few months. Not a hypothetical. What was it?

**Vague-answer follow-up** (per the curriculum's "never let a vague answer stand"):
> That's a bit general — what's the actual project? A name, a sprint, a launch you can picture.

*Task note: once a project is named, Claude assigns it a short label (e.g. "the onboarding redesign") and uses that label — never "your project" — for the rest of the session. This is Design Principle 1's re-anchoring requirement; it's a copy discipline as much as a logic one, so every phase script below uses `{project}` deliberately instead of a generic pronoun.*

### Phase `1b` — Score {project} (Discovery) — special component

Chat line before the component appears:
> Here's where every design decision lives: three lenses. Score {project} against each one — where was it actually there, and where did it get skipped?

*(Component copy in full — Section 4.1.)*

Continue button once all three are scored: `I've scored all three →`

### Phase `1c` — Skip attribution (Discovery → Meaning)

> You marked {lens} as {state} on {project}. Who skipped it — you, or the organisation around you?

**Vague-answer follow-up:**
> It's rarely fully one or the other. Which way does it lean?

*Task note: first-pass signal only, per the Strategy doc — this is not yet the full three-way skill/organisational/relationship split. That happens in `2b`. Don't let this phase's copy try to do `2b`'s job; if the participant volunteers a fuller answer here, reflect it back briefly and hold it for `2b` rather than resolving it early.*

### Phase `2a` — The Six Mindsets (Discovery) — special component

> Design runs on six mindsets. Walk through them, then tell me: which one is hardest to practise in your organisation — not in yourself.

*(Component copy in full — Section 4.2.)*

Confirm button: `That's the one →`

### Phase `2b` — Name the cause (Meaning) — chat probe + special component

Chat probe, asked before the component appears:
> Why is {mindset} hard to practise there? Is it something you haven't built yet, something the org won't let you do, or someone whose backing you didn't have?

**"It's complicated" follow-up** (this is the exact guardrail the Dinesh persona is built to test — see Strategy doc 2.2):
> "Complicated" usually means two of these are tangled together. Which one's closer to true, today, in {project}?

Then the structured component appears. *(Component copy in full — Section 4.3.)*

Confirm button: `That's the cause →`

*Task note — this is the single most load-bearing exchange in the diagnostic (Strategy doc, Design Principle 2 and the Handoff note). Do not let the confirm button enable until one of the three states is explicitly selected — this must be captured as state, never inferred from the chat probe's prose, even when the chat answer sounds decisive.*

### Phase `3` — Where Influence Breaks Down (Meaning → Action)

Chat only, no special component — per Design Principle 6, this is deliberately the least encumbered phase so the guardrail copy (Section 5) can carry full weight if it fires. Four sequential turns, one question per message, per the strategy doc's explicit spec ("Four sequential questions, one at a time"), each preceded by a short reflect-back of the previous answer (1 sentence, no filler):

> Think of one specific moment in {project} where this actually cost you something. What happened?

> What did you do? And what did you want to do instead?

> Going into that moment, whose support did you have — or not have?

> What did that gap actually cost — the project, the team, or you?

*Task note: this maps directly to the curriculum's four bullets under Phase 3, kept at exactly four turns per "ask one question at a time" — the second turn holds two clauses of one question ("what did you do" / "what did you want to do instead") as a single beat, matching the curriculum's own bullet structure rather than splitting it into a fifth turn. Reflect-backs use the participant's own words where possible — this is also where the inspiration doc's "cite the evidence directly" recommendation for Phase 4 gets its raw material, so Claude should be instructed to note (not necessarily surface yet) one exact quoted phrase from these four answers for reuse in the Phase 4 reveal.*

### Phase `4` — Design Influence Profile (Integration)

Short bridge message, then hands off to the Close screen — mirrors the Why Workbook's two-message Phase 4d close, but this diagnostic only needs one message here since the reveal itself lives on the Close screen, not in chat.

> That's the thread — {one-sentence paraphrase of the Phase 3 cost answer, in Claude's words, not a question}. I've got your pattern.
>
> The next screen names it, and shows exactly where it goes.

Continue button: `See my Design Influence Profile →`

---

## 4. Special component copy library

### 4.1 Lens scorer (Phase `1b`)

Structurally identical to the Why Workbook's `values-map` / `vm-state-btn` pattern (label + short descriptor per button), relabelled to describe **presence, not feeling** per Design Principle 4 and the Strategy doc's own instruction.

```
component instruction:
"For each lens, was it actually there in {project} — or did it get skipped?"

Desirable — does anyone actually want this?
Viable — does it work commercially?
Feasible — can it actually be built?

  [ Present ]   genuinely there, shaped the outcome
  [ Thin ]      technically covered, didn't shape anything
  [ Skipped ]   never really happened

done button: "I've scored all three →" (disabled until all three lenses have a state)
```

*Copy rationale, resolving the Strategy doc's open question (Section 5, first bullet): "Present / Thin / Skipped" was chosen over the doc's placeholder "Present/Thin/Skipped, or something sharper" because all three describe an observable fact about the project ("was it there") rather than a feeling about it — matching the pathology-report register the inspiration doc argues for (Section 3), and matching the `vm-state-btn` precedent of one plain label + one plain descriptor, never an adjective describing the participant.*

### 4.2 Six-mindset selector (Phase `2a`)

Single-select chips, not multi-select/star like the Why Workbook's values sort — this is one answer, not a top-3.

```
component instruction:
"Which is hardest to practise in your organisation — not in yourself?"

  Empathy first          the user's reality over your own assumptions
  Systems thinking        how one decision ripples through the whole product
  Bias to action          shipping the test over debating the theory
  Embrace ambiguity       moving before every answer is certain
  Iterate always          treating version one as a draft, not the answer
  Communicate intent      showing your reasoning, not just your output

confirm button: "That's the one →" (disabled until one chip is selected)
```

### 4.3 Cause-attribution component (Phase `2b`)

Reuses the `vm-state-btn` visual pattern again (three buttons, label + descriptor) with three new options in place of aligned/activated/absent — the load-bearing distinction in the whole diagnostic, captured as explicit state per Design Principle 2.

```
component instruction:
"Which one is it, really?"

  [ A skill I haven't built yet ]      more practice or reps would close this
  [ A system that won't let me use it ]  the org doesn't make room for it, however good I get
  [ A sponsor I never had ]            the right person's backing wasn't there going in

confirm button: "That's the cause →" (disabled until one state is selected)
```

*Copy rationale: labels are written in first person ("I haven't built," "I never had") rather than as abstract category names ("Skill gap," "Organisational constraint," "Relationship gap") because Design Principle 2 requires this to read as a confirmed decision the participant is making about their own situation, not a category they're being sorted into — a subtle but real difference from a typology-selector. All three are now parallel noun-phrase clauses ("A skill…," "A system…," "A sponsor…") rather than a mix of complete and fragment phrasing — under Design Principle 6's "no chrome" pressure at this exact moment, three buttons that scan in the same grammatical shape read faster than three that don't. Internal `STATE` values can still be the abstract `skill / organisational / relationship` tokens; only the visible label is first-person.*

*Per the inspiration doc's explicit caution (Section 4, "Avoid"): no colour-coding by cause on this component or anywhere downstream. Keep any visual differentiation here structural (button position/order), not chromatic — the Phase 4 reveal must stay colour-restrained regardless of which cause was picked.*

---

## 5. Guardrail copy

Lifted near-verbatim from the curriculum document per the brief — these are already well-built and load-bearing. Each is a **register shift**, not a tone the rest of the product defaults to (Design Principle 5) — outside these three triggers, default copy stays direct, no hedging.

**If the participant becomes defensive or self-critical:**
> This isn't about whether you're good at your job. It's about where the system around you makes good judgment harder. Let's find the actual moment.

**If the participant tries to blame a colleague or leader by name:**
> Let's keep this about the pattern, not the person — what would need to be true structurally for this not to happen again?

**If distress or burnout signals appear:**
> That sounds like more than a workflow problem. I'm glad you said it. We can come back to the diagnostic — is there someone you can talk this through with today?

*Deployment note for the Ade persona specifically (Strategy doc 2.3, highest defensiveness risk): the defensiveness line is the one guardrail most likely to fire on him, and the strategy doc names generic-sounding reassurance as his single worst-outcome failure mode. Nothing about this line should be shortened or softened further to "sound warmer" — its force comes from being exactly this specific ("where the system around you," not "you're doing great") and exactly this short. Padding it is the failure mode, not a fix for it.*

**Support panel** (same shell component as the Why Workbook's `support-panel`, copy adjusted for a professional-diagnostic register rather than a personal-workshop one):

```
panel lede    If this brought up more than a work problem, you don't have to sit with it alone:
list          Lifeline (Australia) — 13 11 14, free & confidential, 24/7
              Beyond Blue — 1300 22 4636
note          Outside Australia, please reach out to a local crisis line or someone you trust.
close button  Close
```

*The header's "Need support?" button stays reachable at all times, independent of whether Claude's API call succeeds — same reasoning as the Why Workbook's implementation: this is the one resource that must not depend on the thing that might be down exactly when it's needed.*

---

## 6. Close screen

Per Design Principle 3, the profile card is the largest, first, and most typographically dominant element — the copy below is written to that hierarchy; see the inspiration doc's report-architecture recommendation for the visual treatment.

### 6.1 Profile reveal card

```
card label (small, above the rule)   Your Design Influence Profile
tag (DM Serif Display italic, plum, no container — per inspiration doc Section 4.1)
                                      {profile tag}
evidence sentence (Fraunces italic)   {diagnostic sentence}
quoted fragment (Inter, smaller)      "{participant's own words, quoted from Phase 1a or Phase 3}"
credit line                          Frankly Human · Design Thinking Diagnostic
```

Named per the inspiration doc's Section 4.2 instruction — a diagnostic noun phrase in the register of a chart entry, not a punchy compound coinage. Five candidates below, deliberately spanning different lens/mindset/cause combinations so the design-lead can see the tag-plus-sentence pairing hold up across the whole space, not just one flattering example:

| Tag | Diagnostic sentence | Cause | Routes to |
|---|---|---|---|
| **The Downstream Designer** | "Strong on craft, invisible at the strategy table." | Viable lens skipped — organisational constraint | Module 04 — Strategy |
| **The Unsponsored Operator** | "You did the strategic thinking. Someone else got the credit for having it." | Bias to action — relationship/buy-in gap | Module 12 — Judgment in Practice |
| **The Unproven Strategist** | "You can execute anything. You haven't yet been tested on what to execute." | Viable lens skipped — genuine skill gap | Module 04 — Strategy |
| **The Point-Solution Designer** | "Your team is a feature factory, and you know it." | Systems thinking — organisational constraint | Module 07 — Service Design |
| **The Uncredited Strategist** | "The thinking was yours. The room never found out." | Communicate intent — relationship/buy-in gap | Module 03 — Analysis |

*Naming rationale: each tag is a role-shaped noun phrase built from a verb or preposition that names a structural position ("Downstream," "Unsponsored," "Unproven," "Point-Solution," "Uncredited") rather than a trait or a coinage — closer to a job-requisition red flag than a horoscope sign. None describes the participant's personality; all describe where in the system their work is sitting. "The Point-Solution Designer" is the closest of the five to the riskier "Feature Factory" territory the inspiration doc flags (Section 4, "name it like a chart entry") — kept because the underlying sentence ("Your team is a feature factory, and you know it") is verbatim curriculum copy and the tag needed to stay in its register rather than soften it; worth a second look from the design-lead if it still reads as too close to a coinage once set in type.*

**One question to bring back to your team** (small line beneath the module-bridge, not the profile card — this is the curriculum's "a next right question to bring back to their team" deliverable):
> {example, paired to tag} *"Who signed off on the roadmap before design was in the room?"*

### 6.2 Module-bridge card

Same `d2m-bridge` component pattern as the Why Workbook, pointed at the specific Design-Led: Practitioner module the named pattern routes to — not always Module 01.

```
eyebrow      Where this goes next
body         {Module N — Module name} is where {short, specific reason tied to the named
              gap} — the exact thing {project} ran into.
primary CTA  Start with {Module N — Module name} →
secondary    or see the full Design-Led: Practitioner syllabus →
```

Example, filled for "The Downstream Designer":
> **Where this goes next**
> Module 04 — Strategy is where you stop arriving after the Viable calls are already made — the exact thing the onboarding redesign ran into.
> [Start with Module 04 — Strategy →]
> or see the full Design-Led: Practitioner syllabus →

**Closing bridge line** (verbatim from the curriculum document, placed directly beneath the module-bridge CTA, before the email capture):
> Would you like to continue into Design-Led: Practitioner next?

### 6.3 Email capture

Same `ec-*` component and validation pattern as the Why Workbook, offer line adjusted to what's actually being sent (the profile plus the routed module, not a generic PDF):

```
offer         I'll send you this profile, plus the syllabus for {Module N}, as a PDF to keep.
name field    First name
email field   Email · placeholder: your@email.com
inline error  Please enter a valid email address.
primary CTA   Send me the PDF
skip          That's okay — I'll screenshot it
success       On its way. Check your inbox in the next few minutes.
```

---

## 7. Error and empty states

Same shell infrastructure and placement as the Why Workbook's error handling (`showAPIError`, `shake`, `ec-error`) — reused, not reinvented, per the design-lead's build notes. One deliberate departure: the Why Workbook's shipped `showAPIError()` currently ships the literal string **"Something went wrong."** This fails the content-writer standard this deck is held to (error copy must say what happened and what to do, never a placeholder for "an error occurred") — fixed here, same bubble placement and `Try again` button:

**API call fails or times out** (same `showAPIError` component):
```
timeout      Claude's taking a little longer than usual. Try again?
other error  That didn't send. Nothing you said is lost — try again.
retry button Try again
```
If a distress flag is already active when this fires, the technical failure screen still surfaces the Lifeline line inline (not just via the header), exactly as the Why Workbook does — a technical failure must never be the only thing on screen at a moment support was already flagged as needed.

**Recommend feeding this same fix back to the Why Workbook's own `showAPIError()`** — it's the identical underlying bug (a message that names neither the problem nor the next step), and the fix above needs no diagnostic-specific rewording to carry over.

**Email subscribe fails:** the Why Workbook's shipped `handleSubscribe()` has no failure copy at all today — on a non-OK response or thrown error, the button just silently reverts to its default label, which reads as the click having done nothing. New copy for this touchpoint (and recommended back-port to the Why Workbook), placed in the existing `.ec-error` slot:
```
Send fails    That didn't send. Your profile isn't lost — try again, or screenshot the card above for now.
```

**Empty message send:** no copy — the input field shakes (same `shake` class/animation as the Why Workbook). Deliberately silent: a validation message here would be scolding a mid-career professional for an empty text box, which fails the "no blame" rule for no real benefit. The shake is feedback enough.

**Invalid email on capture:** `Please enter a valid email address.` — kept identical to the Why Workbook; it's already blame-free, specific, and tells the user exactly what to fix.

**Storage save fails (private browsing / quota):** no user-facing copy — degrades silently, same as the Why Workbook's `saveState()`. A 20–30 minute session losing its resume capability is a real cost but not one worth surfacing mid-flow; flagging here only so the design-lead knows this is a deliberate omission, not a gap.

---

## 8. Handoff notes to the design-lead

1. **The lens scorer and cause-attribution components share a visual pattern (`vm-state-btn`-style: label + descriptor) but carry different copy registers on purpose.** The lens scorer describes the *project* ("Present," "Thin," "Skipped" — third person, about the work). The cause-attribution component describes the *participant's own account* in first person ("I haven't built," "I didn't have"). If these end up looking identical on screen with no other differentiator, that copy distinction will be invisible — worth a small visual cue (not colour, per the inspiration doc's caution) marking that `2b` is a more personal, higher-stakes confirmation than `1b`.

2. **The profile tag needs room to breathe with nothing else competing for weight**, per the inspiration doc's "no container, no badge" instruction (Section 4.1) — none of the five candidate tags above are short. "The Point-Solution Designer" and "The Unsponsored Operator" both run to three or four words plus "The," which is longer than a single archetype word like "the Architect." Test the largest of the five at the DM Serif Display size the inspiration doc recommends before locking a container width — there's real wrapping risk on mobile portrait that a one-word tag wouldn't have had.

3. **The module-bridge body copy (Section 6.2) is a template, not five fixed strings** — it needs the same kind of dynamic-fill logic as the Why Workbook's `buildD2MBridgeText()`, keyed off whichever of the three causes and which lens/mindset was actually named, not just the five illustrative tag/module pairings above. Those five are meant to prove the pattern holds across the space, not to be the exhaustive list — the actual routing table (lens → module, mindset → module) should live with the design-builder as a small lookup, mirroring the curriculum document's own examples ("a Viable-lens gap points to Module 04… a mindset gap in 'bias to action' points to Module 12").

4. **The Meridian Bank substitution in the Phase 0 Reframe (Section 3, sourcing note) is a copy call I made, not a strategy call** — flagging it again here because it's the one place in this deck where I diverged from "verbatim from Module 01" in the letter, while trying to stay true to it in spirit (same facts, house-voice provocation convention). Easy to revert to the curriculum's unnamed version if the strategist or you would rather keep it structurally identical to the source doc.

5. **Two small fixes made on a pass against this deck's own standard, both worth a follow-up in the Why Workbook itself:** Phase 3 (Section 3) was tightened from five chat turns to four, to match the strategy doc's explicit "four sequential questions, one at a time" spec rather than splitting the curriculum's combined "what did you do / what did you want to do instead" bullet into two turns. And Section 7's error copy no longer ships the literal string `"Something went wrong."` — the Why Workbook's shipped `showAPIError()` still uses that string today, which fails the content-writer standard both products are meant to meet (say what happened, say what to do). The replacement copy here, and the newly-added subscribe-failure copy (the Why Workbook currently has none — a failed `/api/subscribe` call silently reverts the button with no message at all), are both straightforward back-ports.
