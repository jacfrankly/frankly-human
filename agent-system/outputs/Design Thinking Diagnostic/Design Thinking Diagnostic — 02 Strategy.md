# Design Thinking Diagnostic — Strategy

Prepared by: Design Strategist (DS)
For: Design Lead and Content Writer, ahead of screen-level design and copy
Inputs: `business-planning/Design_Thinking_Diagnostic_Curriculum.docx` (touchpoint brief), Module 01 — Foundations of `curriculum/design-led-leader/DESIGN-LED_Full_Curriculum.pdf`, `why-workshop-app-v2/index.html` + `app.js` (architecture baseline), `agent-system/outputs/Diagnostic Tools — 01 Competitive Scout.md`, `business-planning/Diagnostic_Tool_Build_Notes.md`, `style-guides/Content & Voice Guide.html`

Standalone-pipeline note: there is no service-blueprinter or service-researcher upstream of this run. The curriculum document stands in as the touchpoint brief; the Why Workbook's shipped build stands in as the taste anchor in place of a formal Creative Director profile.

---

## 0. Two decisions made explicitly, not by default

### 0.1 Architecture: chat, not wizard — confirmed

The curriculum document states "same architecture as the Why Workbook" as if settled. It's the right call, but it deserves its own reasoning, because the build notes flag this as a genuinely open question and the competitive scout found real counter-evidence (Gallup CliftonStrengths is a zero-adaptivity wizard and is the industry standard; 16Personalities is a Likert form wearing a conversational skin).

**Why chat wins here specifically, not by default:**

- The curriculum's own Claude behaviours require adaptive probing that a fixed-sequence wizard cannot do: *"Never let a vague answer stand — press for the actual project, the actual moment"* and *"Distinguish clearly between a personal skill gap and an organisational constraint — don't collapse the two."* A wizard can ask "was this a skill gap or an org constraint?" once. Only a coached conversation can hear "it's complicated," recognise that as the vague answer it is, and follow up until it lands on one of the three real causes. This is exactly the Enneagram growth/stress-arrow capability the scout flagged as something a chat format does better than a scripted lookup table.
- The tone brief explicitly rejects the wizard register: *"should feel like being read accurately by someone who's done the job, not like a personality quiz."* Fixed-sequence tools are precisely what produces the personality-quiz feeling the brief is trying to avoid.
- Reusing the Why Workbook shell (phase-token state machine, `PHASE_LABELS`, chat-log + embedded special components, close-screen bridge) costs nothing net-new architecturally and is proven in production, mobile included.

Gallup's counter-evidence doesn't transfer: CliftonStrengths never needs to distinguish *why* a pattern exists, only *what* it is. This diagnostic's hardest job — telling a skill gap from an organisational constraint from a relationship gap — is a "why" question, and "why" questions are where chat earns its build cost. Confirmed: chat.

### 0.2 Output format: named pattern, not score — confirmed, with a refinement

The curriculum already commits to a named pattern ("Design Influence Profile," example sentences like *"Strong on craft, invisible at the strategy table"*). The scout's research flags this as a real, non-default choice (HubSpot's Grader shows a numeric-score version of this same commercial shape works too), so it's worth confirming on its own merits rather than inheriting it silently.

**Confirmed, for two reasons specific to this audience:**
- A score invites benchmarking against peers — useful for urgency, but this audience's entry pain is already "I keep getting treated as an executor, not a strategic partner." A number risks reading as one more instrument that ranks them, which is the opposite of the "read accurately" tone goal.
- The curriculum's guardrail language — *"Treat the profile as a diagnosis to explore, not a verdict"* — is much harder to sustain around a number than around a sentence. Numbers read as verdicts by default; sentences can be framed as observations.

**One refinement worth building toward, not deferring silently:** the curriculum's example outputs ("Strong on craft, invisible at the strategy table") are diagnostic sentences, not nameable nouns — structurally closer to an Enneagram motivation statement than a 16Personalities archetype ("the Architect"). The scout's strongest finding is that a single memorable noun is the highest-leverage move in the whole category for word-of-mouth. Those two things are in tension: a bumper-sticker noun risks tipping into exactly the "personality quiz" feeling the tone brief rejects; a sentence-only result is harder to say out loud or put in a Slack message.

Recommendation for the design-lead and content-writer to prototype, not resolve here: treat the result as **one short, specific tag as the visual headline** (e.g. "The Feature Factory," "Strong on Craft, Invisible at the Table" compressed further) **with the full diagnostic sentence directly beneath it as the explanation** — tag for shareability, sentence for the "read accurately" feeling. This is a design/content exploration question, not a strategy one; see Open Questions below.

---

## 1. Information architecture

Three screens, matching the Why Workbook shell exactly: **Welcome → Diagnostic → Close.** No account, no login, session-persisted to `localStorage` with resume-on-return (same pattern as `ww_session_v1`).

**Welcome.** Brand panel + name field + "Begin →." Copy should signal *commercial, contained, 20–30 min* up front — this audience will bail from anything that smells like a 45-minute self-discovery workshop. No values-workshop framing anywhere on this screen.

**Diagnostic** (single scrolling chat screen with embedded special components, phase-token state machine):

| Phase | Coaching stage | What happens | UI |
|---|---|---|---|
| `0` — Reframe | — | Claude opens with the Meridian Bank story (or a close structural cousin) verbatim from Module 01's own opener — same job as the Why Workbook's Phase 1 reframe: names a failure pattern without blaming the participant. | Chat only |
| `1a` — Three Lenses | Discovery | "Bring one real, recent project to mind." Claude anchors it by name for every phase that follows. | Chat only |
| `1b` — Lens scorer | Discovery | Score the named project against Desirable / Viable / Feasible. | Special component — 3-item tap grid, structurally identical to the Why Workbook's `values-map` (`vm-state-btn` pattern), relabelled per-lens with states describing *presence*, not *feeling* — e.g. Present / Thin / Skipped entirely (see Open Questions — exact state language needs a design pass) |
| `1c` — Skip attribution | Meaning | "Which lens got skipped, and by whom — you, or the org around you?" First-pass signal only; not yet the full 3-way distinction. | Chat only |
| `2a` — Six Mindsets | Discovery | Walk the six mindsets briefly; single-select "which is hardest to practise **in your organisation** — not in yourself." | Special component — 6 chips, single-select (not multi-select/star like the Why Workbook's values sort — this is one answer, not a top-3) |
| `2b` — Cause attribution | Meaning | Probe why: personal skill gap / organisational constraint / relationship gap (whose buy-in did you have, or not). This is the load-bearing distinction in the whole diagnostic. | Chat probe **followed by** a 3-button structured-state component (reuse the `vm-state-btn` visual pattern again, three options instead of aligned/activated/absent) so the cause is captured as explicit state, not inferred from prose — see Design Principle 2 |
| `3` — Where Influence Breaks Down | Meaning → Action | For the named lens/mindset gap: one recent moment, what they did vs. wanted to do, whose support they had going in, the actual cost. Four sequential questions, one at a time, per the curriculum's Claude behaviours. | Chat only — no special UI. This is the phase most likely to trigger the defensiveness/blame/distress guardrails; keep the interaction unencumbered by UI chrome so Claude's guardrail copy can carry full weight. |
| `4` — Design Influence Profile | Integration | Name the pattern in one specific sentence. Draw the line to the Design-Led module that addresses it. Hand back a next right question for their team. | Transitions to Close screen |

**Close.** Profile reveal card (the visual and narrative peak — see Principle 3) → module-bridge card (Why Workbook's `d2m-bridge` pattern, pointed at the specific Design-Led: Practitioner module, not always Module 01) → "Would you like to continue into Design-Led: Practitioner next?" → skippable email capture (`ec-*` pattern, unchanged). No PDF-only, no email-gate-before-reveal — per the scout's hard entrenched-pattern finding, the reveal happens in-session before any form appears.

This is one sub-phase leaner than the Why Workbook's nine (`1, 2a, 2b, 2c, 3a, 3bc, 4a, 4bc, 4d`) at eight (`0, 1a, 1b, 1c, 2a, 2b, 3, 4`) — appropriate for a 20–30 minute product against the Why Workbook's 45.

---

## 2. Personas

The curriculum's own Phase 2 distinction — skill gap / organisational constraint / relationship (buy-in) gap — is the sharpest available grounding for personas, because it means each persona also functions as a test case: **would this design correctly route this person to their real cause without leading them there?**

### 2.1 Priya — the Underpowered Craftsperson (organisational-constraint case)
Senior product designer, 6–8 years, mid-size B2B SaaS. Strong research instincts (Desirable lens is genuinely present in her work) but Viable and Feasible calls get made by PM and eng before she's in the room — design arrives to "make it pretty" after the real decisions are locked.

- **Goal at this touchpoint:** language for why she keeps losing scope fights, that isn't "get better at politics" advice and isn't self-blame.
- **Context/constraints:** found this on LinkedIn during a break; will not tolerate anything that feels like a 45-minute self-discovery workshop or a generic career-coach personality quiz.
- **Success:** leaves with a specific, org-located pattern she can paste into a 1:1 with her manager, plus a next-question for her team — without the tool implying she's the problem.
- **Failure:** the diagnostic defaults to a generic "you need better communication skills" read (deficit-generic — precisely what the curriculum's guardrails exist to prevent), or the org-constraint explanation gets diluted into vague encouragement.

### 2.2 Dinesh — the Isolated Operator (relationship/buy-in case)
Product designer, 4–5 years, scale-up. Strong craft and research, wants to move into strategic work, keeps getting out-judged in the room by a PM. Suspects the real issue is political but has no language for it and won't self-report it unprompted.

- **Goal at this touchpoint:** find out whether this is a skill problem or something else — arrives assuming it's the former because that's the default story he tells himself.
- **Context/constraints:** early-career enough to default to self-blame ("I just need to get better"); the tool has to actively surface the relationship-capital explanation, not wait for him to name it.
- **Success:** the "whose support did you have going in" probe in Phase 3 pulls the real answer out of him even though he didn't arrive expecting it.
- **Failure:** he gives a vague "it's complicated" and the tool accepts it — exactly the "never let a vague answer stand" guardrail failing in practice — and he leaves with a skill-gap diagnosis that's actually a relationship gap.

### 2.3 Ade — the Undersold Practitioner (genuine skill-gap case)
Designer, 3–4 years, strong visual/craft output, recently passed over for a senior role with explicit feedback that he "doesn't think commercially yet." This is the one persona where the honest answer partly implicates him — a real Viable-lens skill gap, not a misperception.

- **Goal at this touchpoint:** find out, honestly, whether "executor" is a deserved label right now, and what specifically to build if so.
- **Context/constraints:** highest risk of the defensiveness guardrail triggering, because this is the one case where the diagnosis isn't purely external. The reassurance copy ("this isn't about whether you're good at your job... let's find the actual moment") has to land as genuine, not boilerplate.
- **Success:** leaves with a specific, self-recognised gap and the exact module that addresses it (e.g. Module 04 — Strategy), without disengaging defensively mid-flow.
- **Failure:** guardrail copy reads as generic reassurance, he shuts down, and abandons before Phase 4 — the single worst outcome for this persona, since he's also the one most likely to convert into Design-Led: Practitioner if the diagnosis lands well.

---

## 3. Design principles

Each is written to be violable — a specific design or copy choice can fail it.

**1. One project, one thread — no hypotheticals, no drift.**
Every phase from `1a` onward must re-anchor to the *same* named project the participant brought in Phase 1. A design that lets Phase 2 or Phase 3 drift to a different or generic project, or that lets Claude ask "in general, how do you..." instead of "in that project, when..." violates this. Test: does the UI/copy reference the participant's own project by their own words at least once per phase?

**2. Attribution is structured state, not inferred prose.**
The skill-gap / organisational-constraint / relationship-gap distinction (Phase `2b`) is the single most important thing this diagnostic produces — it's what makes the eventual Profile specific instead of generic. It must be captured as an explicit, visible decision point (a tap component, a confirmed selection), not left buried in a chat transcript for Claude to infer from later. Test: could someone read `STATE.workbook` at the end of the session and see which of the three causes was named, without re-parsing the conversation?

**3. The profile outranks the funnel.**
On the close screen, the Design Influence Profile card must be the largest, first, and most typographically dominant element — bigger and earlier than the Design-Led module bridge and the email capture, exactly mirroring the Why Workbook's `why-card` precedence over `d2m-bridge`. Test: in a screenshot of the close screen, is the eye drawn to the diagnosis before the CTA?

**4. Named diagnosis, not a personality type, not a score.**
The headline result is a specific sentence about *this* person's *this* project — never a percentage, maturity level, or generic category label anywhere in the primary result state. Test: does any version of the result contain a number that isn't the participant's own stated fact (e.g. a lens score out of 10)? If yes, it violates.

**5. Guardrails soften the moment, not the whole product's voice.**
Default copy stays direct and commercially fluent per the tone brief — no hedging, no encouragement-for-its-own-sake. Only the three named guardrail triggers (defensiveness, naming a colleague, distress signals) shift register, and they should be visually and tonally distinguishable when they fire — the same way the Why Workbook's support panel and distress copy are a deliberate register-shift, not a tone the whole product defaults to. Test: read the copy for any phase with the guardrails removed — does it still sound "warm clarity with a backbone," or has it gone soft by default?

**6. Chrome disappears on mobile; the conversation never fights the frame.**
This is a phone-first product for a phone-first audience taking a break at their desk or on a train. No persistent sidebar, step-counter, or dashboard chrome may consume meaningful vertical space during the diagnostic screen on portrait mobile — reuse the Why Workbook's brand-panel-collapses-on-mobile pattern exactly. This is the named anti-pattern from the build notes (Plan B Engine's fixed-width sidebar eating half the screen in portrait). Test: on a real phone in portrait, does anything above the chat log persist across the whole diagnostic besides a single thin header bar?

---

## 4. UX strategy brief (summary for design-lead and content-writer)

**What this is:** a 20–30 minute chat-coached diagnostic that names the specific pattern keeping a mid-weight designer in an executor role — not a personality test, not a skills audit, an entry point into Design-Led: Practitioner. It borrows the Why Workbook's proven shell wholesale (three screens, phase-token state machine, chat-log + embedded tap components, close-screen reveal-then-bridge-then-email) and replaces every values-finding move with a pattern-naming one grounded in Module 01 — Foundations.

**The strategic logic in one paragraph:** this audience's entry pain is professional, not personal — "I keep getting treated as an executor." The single highest-value thing this tool can do is refuse to collapse three genuinely different causes (a skill they haven't built, a system that won't let them use it, a sponsor they never had) into one generic "be more confident" verdict. Everything else — the chat architecture over a wizard, the structured attribution component, the named-not-scored output, the guardrails that soften only when needed — exists in service of keeping that three-way distinction real and specific rather than letting it flatten into generic career advice.

**The persona and goal to hold in mind above the other two while designing:** Dinesh (2.2), the Isolated Operator. He's the hardest case, because he arrives with the wrong theory about his own problem and won't correct it unless the tool does real work to pull the relationship-gap explanation out of him. Priya and Ade both arrive closer to already knowing their real cause; Dinesh doesn't. If the design and copy only work for people who already suspect the right answer, the tool has failed its most distinctive job.

**The two principles most likely to create tension with visual instincts:** Principle 2 (attribution as structured state) will push toward adding a tap component at a moment (`2b`) that might otherwise feel like it should stay pure conversation — resist the instinct to leave it as chat-only for elegance; the structure is what makes Phase 4's diagnosis specific instead of generic. Principle 5 (guardrails as a deliberate register-shift, not a default tone) will push against a natural instinct to make the whole product warmer and softer throughout, given this is still a coaching product; the tone brief and the audience both call for precision-by-default, warmth-on-trigger, not the reverse.

**Strategic constraints from the curriculum brief to keep front of mind:** never let the tool imply prior real help (therapy, other coaching) was insufficient; never let a colleague be named or blamed — redirect to the pattern; the reveal must be immediate and in-session, never emailed-after-the-fact (this is the one thing UX-PM's otherwise-comparable "Design Maturity Score" gets wrong, per the scout).

---

## 5. Open questions I could not resolve without design exploration

**The biggest one:** how to make the Profile reveal genuinely shareable/nameable (the scout's strongest, most evidence-backed recommendation, and a real driver of word-of-mouth into the paid course) without it curdling into the "personality quiz" feeling the tone brief explicitly rejects. The curriculum's own example outputs are full diagnostic sentences, not archetypal nouns — that's probably correct for the tone, but sentences alone are hard to say out loud or repost the way "I'm a Campaigner" is. I've recommended a two-tier tag-plus-sentence treatment as a starting hypothesis (Section 0.2), but whether that reads as sharp and specific or as a diagnosis wearing a quiz-result costume is a typography and copy question that needs an actual mockup and a few candidate pattern names to test against the tone brief, not something strategy can settle on paper.

Secondary, smaller open questions for the design-lead:
- Exact state language for the Phase `1b` lens scorer (Present/Thin/Skipped, or something sharper) — needs a few rounds of copy testing against real project examples.
- Whether the Phase `2b` cause-attribution component should visually resemble the Why Workbook's `values-map` states closely enough to feel like "the same app, new content," or should look distinct enough to avoid this reading as a Why Workbook reskin — a legitimate design-lead judgment call, not a strategy one.

---

## 6. Handoff note

To the design-lead and content-writer, together: you're both building from the same brief, so read the whole document, not just your half. The one thing I'd want you to internalise before opening a design file or a doc: **this tool's entire value proposition is refusing to collapse three different causes into one verdict.** Every shortcut that makes Phase 2 easier to build — skipping the structured attribution component, letting Claude infer the cause from prose instead of confirming it, softening the "which lens got skipped, and by whom" question into something gentler — quietly breaks the thing that makes this diagnostic worth building instead of just writing another generic "how to get taken seriously as a designer" article. Hold the line on precision even when warmth feels like the safer default; that's the whole bet this product is making.
