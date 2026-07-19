# Design Leadership Diagnostic — Strategy

Prepared by: Design Strategist (DS)
For: Design Lead and Content Writer (simultaneous handoff), and the Creative Director
Standalone pipeline run — no service-blueprinter or service-researcher upstream. Inputs used in place of a touchpoint brief: the original diagnostic curriculum draft, the authoritative Design-Led: Leader curriculum (2026 edition), the Diagnostic Tools competitive scout report, the Why Workbook v2 shell (`why-workshop-app-v2/index.html` + `app.js`), the Diagnostic Tool Build Notes, and the Frankly Human style guides.

---

## 0. Framework correction, stated once, load-bearing throughout

The original curriculum draft (`business-planning/Design_Leadership_Diagnostic_Curriculum.docx`) is written against a **three**-lever model — Budget Authority, Roadmap Influence, Executive Trust — and explicitly flags itself as "a draft to pressure-test, not a finished spec."

That draft is superseded. The authoritative source (`curriculum/design-led-leader/Design_Led_Leader_Curriculum.docx`, "2026 EDITION") runs on a **four**-thread model: Budget Authority, Roadmap Influence, Executive Trust, and **Relationship Capital** — added specifically because the first three only work in a rational, well-run organisation, and Relationship Capital is what a political one actually responds to. The three leadership traps carry over unchanged: the Service Department Trap, the Feature Factory Manager, the Silent Expert.

Everything below is built on the four-thread model. This matters beyond terminology: Module 13 of the full curriculum closes with each participant's own diagnostic result, and a 90-day plan that explicitly includes "a current relationship/sponsorship map." If the diagnostic only ever surfaces three threads, it structurally cannot produce the fourth-thread result Module 13 is built to receive. The diagnostic's Phase 1 scoring structure and Phase 4 output **must** have four slots, not three, or the entry point silently breaks the product it's meant to feed.

---

## 1. Information architecture

### 1.1 Screen-level structure (inherits the Why Workbook's three-screen shell)

```
Welcome  →  Intake/Paywall  →  Diagnostic (chat)  →  Close
```

This is a **four**-screen flow, not the Why Workbook's three — see Principle 6 below for why the paid product earns an extra screen the free tool doesn't need.

**Screen 1 — Welcome**
- Same shell pattern as Why Workbook: eyebrow, title, one-line lede, name field, primary CTA, reassurance note.
- Reassurance note changes register: not "Free · No account needed · Start anytime" but something that names the price and the time cost plainly, e.g. "$500 · 20–30 minutes · Immediate result." Precision, not softening — see the tone brief in Section 4.
- Resume-session banner pattern carries over unchanged (a $500 product makes session-loss recovery more important, not less).

**Screen 2 — Intake (new; the Why Workbook has no equivalent)**
- This is the paywall/payment-confirmation moment. Function: convert "I clicked a link" into "I paid and I'm ready," and set expectations for what the $500 buys before the coaching conversation starts.
- Contains: what the diagnostic will and won't do (explicitly: not a personality quiz, not 360 feedback, not executive coaching — lifted directly from the curriculum doc's own "It is NOT" list), roughly how long it takes, and what they leave with (the named profile, not a generic "results").
- This is also the natural home for a single high-trust reassurance line addressing the guarded-audience risk named in Section 3: privacy of what they say, and that the result is theirs, not shared with their employer.
- Payment itself is out of scope for this doc (a build/backend concern) — the strategic requirement is that a confirmation/orientation moment exists as its own screen, not folded silently into Welcome.

**Screen 3 — Diagnostic (chat)**
Four phases, one-question-at-a-time chat, matching the curriculum's own phase structure and the Why Workbook's `PHASE_LABELS`-driven header:

1. **Reframe** (pre-phase, no participant input) — open with the organisational-power story ("A Head of Design spent eighteen months... no one thought to ask her into the room"), Claude's equivalent of the Why Workbook's "5 Mistakes" cold open. Does not consume a phase slot in the header; it's scene-setting before Phase 1 begins.
2. **Phase 1 — The Four Threads (See).** Score real recent evidence against all four threads: Budget Authority, Roadmap Influence, Executive Trust, Relationship Capital. One example per thread, tap-assisted where possible (see Principle 3), not open free text for the scoring step itself.
3. **Phase 2 — The Three Traps (Sense).** Which trap feels most true; probe whether it's something the org is doing to them or something they've started doing to themselves.
4. **Phase 3 — Where the Room Was Lost (Shape).** The specific-moment interrogation: one meeting/decision they weren't in, what they did, what it cost.
5. **Phase 4 — The Leadership Influence Profile (Show).** Names the pattern in one sentence, ties it to a thread + trap combination, and hands off to Design-Led: Leader.

**Screen 4 — Close**
- Named-profile card (equivalent of the Why Workbook's `why-card`), stated as a diagnosis to explore, not a verdict.
- `d2m-bridge`-equivalent handoff: "Continue in Claude" prompt pre-filled with the four thread scores, the named trap, the specific moment, and the profile sentence, ending with an explicit ask the participant can use immediately — either a next-conversation script for their own leadership, or a request for a deeper 90-day plan. This directly reuses the single best pattern identified in both the build notes (Plan B Engine's "Operationalise it" handoff) and the Why Workbook's own shipped `d2m-bridge`.
- Secondary CTA into Design-Led: Leader (group program / executive coaching / corporate licensing), using the curriculum's own bridge line: "Would you like to talk about what Design-Led: Leader could do for your seat at the table?"
- Save/export mechanism surfaced here, not gated — per the build notes' mobile-nav lesson, this must be reachable without scrolling past it, given a $500 purchaser has more at stake in not losing their result than a free-tool user does.

### 1.2 Why chat, not wizard — explicit reasoning

The prompt asks me to confirm this rather than inherit it by default. My reasoning, weighing both sides:

**The case for wizard** (from the competitive scout): CliftonStrengths and 16Personalities are both fixed-sequence and both succeed at massive scale with zero adaptivity — the scout report is explicit that "chat automatically wins" is not a proven claim. Wizards are faster to build, easier to make mobile-safe, and pair naturally with tap-to-rank/tag-by-feeling interactions.

**The case for chat, specific to this touchpoint:**
1. **The diagnostic's own content requires branching, not just sequencing.** Phase 2's core move — "is this something the organisation is doing to you, or something you've started doing to yourself" — is a judgment call that depends on what the participant says in Phase 1's specific examples. Phase 3's follow-up questions ("what did you do, what did you want to do, what did that cost") are Socratic, not enumerable; a wizard would need to pre-script every branch, and this content resists pre-scripting by design (the curriculum's own guardrail language — "never let a vague answer stand," "press for the actual moment" — is written as adaptive coaching behaviour, not as menu logic).
2. **The audience-specific failure mode a wizard invites is worse here than for the free tool.** This is a senior, self-aware, pattern-tired audience (see Persona 1 below) who will detect a scripted quiz wearing a conversational skin faster than a junior audience would, and the cost of that detection is higher at $500 than at $0 — it reads as "we didn't actually build the thing we're charging for."
3. **The product this diagnostic feeds (Design-Led: Leader) is itself built on real reps, not simulations** — "wherever a module could teach the language of a skill or the actual doing of it, this curriculum chooses the doing." A wizard's tap-to-select scoring UI for Phase 1 is fine (see Principle 3), but the entry point to a program built on that philosophy should not itself be a static questionnaire.
4. Gallup's own counter-evidence doesn't transfer cleanly: CliftonStrengths sells a report people read once and file away. This diagnostic's stated job is to produce **one specific moment, one specific cost, one specific sentence** the participant will bring into a follow-up Claude conversation and possibly a $5,000 enrolment decision — that requires depth a fixed 30-item questionnaire structurally cannot reach in 20-30 minutes.

**Call: chat-based, adaptive, one question at a time — same architecture as the Why Workbook.** Where the wizard pattern legitimately wins (fast, tappable, mobile-safe scoring) is absorbed as an embedded special component *within* the chat, exactly as the Why Workbook already does with `values-sort` and `values-map` — not as the outer architecture.

### 1.3 Special components needed (new, beyond what the Why Workbook ships)

- **Thread scorer** (Phase 1) — a tap-based component for scoring the four threads, closer to CliftonStrengths' paired-statement mechanic than the Why Workbook's chip-sort: for each thread, a short forced-choice framing ("I shape this" / "I execute someone else's call on this") plus a one-line example field, not a 1-5 slider. Sliders invite false precision on a construct this qualitative; forced-choice-plus-evidence matches how the curriculum itself asks the question ("do you control or meaningfully shape spend, not just execute against someone else's?").
- **Trap selector** (Phase 2) — three named cards (Service Department Trap / Feature Factory Manager / Silent Expert), each with a one-line description, tap to select one as "feels most true," matching the Why Workbook's chip interaction pattern but with only three options and richer per-option copy than a value chip carries.
- **Profile reveal card** (Phase 4 / Close) — equivalent of `why-card`, holding the named sentence, the thread + trap combination, and a short "why this, specifically" line tied to what the participant actually said (per the build notes' sharpest lesson: tie any named cost back to something the person themselves stated, not a generic benchmark).

---

## 2. Personas

### Persona 1 — "The credible but sidelined Head of Design" (primary)

This is the persona the curriculum doc names directly: someone who has built the credibility and hasn't been given the room.

- **Goal at this touchpoint:** Get told something sharp and specific about *why* the room keeps closing without her in it — not reassurance, not a personality label, a mechanism she can act on this quarter.
- **Context:** 8-15 years in, several shipped wins she can point to, currently Head of Design or an equivalent senior IC/lead role. Has read leadership content before and can smell genericness in one paragraph. Arrived here because something specific just happened — a strategy meeting she wasn't in, a roadmap decision made without her, a budget conversation she heard about after the fact.
- **Constraints:** Limited patience for onboarding/hand-holding (skip the warm-up, per the curriculum's own coaching-flow note). Will not tolerate being told what she already knows in language softer than she'd use herself. Has genuine political constraints that are not simply solvable by "communicate better" advice — this is exactly why Relationship Capital exists as its own thread.
- **What makes this succeed:** The diagnostic names her actual pattern with enough specificity that she recognises it before she's told the name — the "read accurately by someone who's done the job" bar from the tone brief. It respects that her prior effort (the design system with 90% adoption, the years of shipped work) was real and good, and the gap is structural, not a personal failing.
- **What makes this fail:** Generic leadership-coaching language ("communicate your value," "build a personal brand"). Any hint of deficit framing ("here's what's wrong with your leadership"). A quiz that feels interchangeable with a LinkedIn "what's your leadership style" post — the exact genre this audience has learned to distrust.

### Persona 2 — "The design director testing the water before a $5,000 commitment"

- **Goal at this touchpoint:** Decide, credibly and cheaply, whether Design-Led: Leader is worth the larger spend — for herself or for budget she'd need to request.
- **Context:** One level below Persona 1, or a peer evaluating the program on behalf of a function. Arrives more skeptical, more evaluative, less already-convinced. May be assessing this as much as a proof-of-craft signal about Frankly Human ("is this program going to be any good") as a self-diagnostic.
- **Constraints:** Needs the $500 to feel proportionate to what she gets, immediately, in-session — not a promise of value redeemed later by email. Will judge the whole $5,000-$50,000 funnel by how this $500 entry point is built and delivered.
- **What makes this succeed:** The diagnostic's own execution quality functions as a demo of the program's quality — sharp questions, real adaptivity, a profile that couldn't have been produced by a static quiz. The handoff to Design-Led: Leader names her specific gap concretely enough that the $5,000 ask feels like the obvious next step, not a sales pitch bolted onto the end.
- **What makes this fail:** Any moment where the tool feels cheaper or less considered than a $500 price point implies (the paywall/intake screen doing too little work, a generic reveal, a broken mobile layout — see the build notes' mobile-nav failure mode).

### Persona 3 — "The corporate buyer scoping this for someone else" (secondary, worth naming not designing a full flow for)

- **Goal at this touchpoint:** Evaluate whether to purchase this diagnostic (or the corporate cohort license) for a design leader or leadership team she manages, not necessarily complete it herself.
- **Context:** An HR/L&D lead, a CDO, or a design leader's own manager, evaluating from outside the target persona's lived experience.
- **Constraints:** Needs to trust the tool's discretion — this persona's presence is the reason the Intake screen needs an explicit privacy/discretion line (see Section 1.1): a diagnostic purchased on someone's behalf, or known to be used inside a company, raises the stakes on "is what I say here going to come back to my employer" higher than the Why Workbook ever had to address.
- **Design implication, not a full flow:** worth a single line of copy on the Welcome or Intake screen making explicit that individual responses aren't shared with whoever purchased access, if/when this is sold as a seat within a corporate license. Flagged as an open question in Section 5 — the diagnostic's backend/access model for corporate buyers isn't yet specified and affects this persona's design needs directly.

---

## 3. Design principles

Each is stated so a specific design choice can be judged to honour or violate it — not aspirational language.

**1. Four threads, always, never three.**
Any screen, component, or copy that scores, lists, or summarises organisational influence must show all four threads — Budget Authority, Roadmap Influence, Executive Trust, Relationship Capital — never the superseded three. Violated if: the Phase 1 scorer ships with three slots because a build reused the original curriculum draft; the Close screen's profile card omits Relationship Capital when it wasn't the identified thread (it should still be visible as scored, even if not the headline).

**2. Named pattern, not a score — and the name must survive being said out loud.**
The Phase 4 output is a specific sentence ("You've built the credibility. You haven't been given the room."), not a 1-100 number, a percentile, or a maturity level. Test per the scout report's own bar: would this participant say the resulting phrase unprompted, the way someone says "I'm a Campaigner"? Violated if: any numeric score, gauge, or comparative benchmark appears anywhere in the primary output (a private, participant-only self-reference number for their own tracking across future retakes is fine; a visible/comparative score is not — see Principle 5 for the reasoning).

**3. Evidence before judgment, every phase.**
No thread score, trap selection, or profile line is accepted without a specific, real example attached first (one recent project, one specific meeting, one actual moment) — never a self-rating in the abstract. Violated if: a component lets the participant score a thread or pick a trap without an accompanying example field being required; violated if Claude's coaching copy accepts a vague answer ("politics, mostly") without a follow-up probing for the specific mechanism, per the curriculum's own guardrail language.

**4. Strengths-framed, not deficit-framed, even when naming a trap.**
Every trap name and profile sentence describes a *pattern that made sense given the system*, not a personal shortfall — mirroring CliftonStrengths' strengths-only instinct over UX-PM's "maturity score" gap-framing (see competitive scout, Section 1.2 and 1.6). Violated if: any output copy uses language implying the participant is deficient, behind, or should feel behind peers (no percentile, no "you're at Level 2 of 5," no comparison to other participants' scores). The existing curriculum draft's own profile examples ("Your team executes brilliantly and gets consulted last") are the register to hold — the trap is real and named, and the participant's competence is never in question.

**5. No comparative or visible failure state — self-report only, ever.**
Directly imported from the LinkedIn Skill Assessments finding in the competitive scout: because this is an executive-facing, reputationally sensitive product, the diagnostic must never produce, store, or surface a result in a form that could be seen or compared by anyone else (a manager, a peer, a future employer) unless the participant explicitly chooses to share it. Violated if: results are stored in a way discoverable by a corporate purchaser (see Persona 3) without explicit consent; violated if a future "compare your profile" feature is ever proposed — rule it out now, not later.

**6. The paid moment earns its own screen — deliberately, not just a bigger price tag on the Why Workbook's shell.**
Because this is a $500 product, not a free lead magnet, the flow gets a fourth screen (Intake, Section 1.1) the Why Workbook doesn't need — a moment that confirms payment, sets explicit expectations ("what this is / is not," lifted from the curriculum's own list), and reassures on privacy before the coaching conversation starts. Violated if: the build simply reskins the Why Workbook's three-screen shell and treats the price as a backend/Stripe concern invisible in the UX — the payment and the promise it represents need a visible moment in the flow, not just a paywall gate bolted in front of Screen 1.

**7. Immediate, in-session reveal — never "we'll email your report."**
The named profile appears on-screen the moment the diagnostic ends, matching every well-regarded competitor product and the Why Workbook's own close screen — this is now a hard market expectation, per the competitive scout, and the one direct comparable that violates it (UX-PM) is explicitly the anti-pattern to avoid. Violated if: any build shortcut proposes deferring the reveal to a follow-up email "report" under time pressure — flagged pre-emptively because the scout report specifically names this as a tempting simplification once build pressure hits.

---

## 4. UX strategy brief

### The strategic logic, in one paragraph

This diagnostic's job is to do for organisational credibility what the Why Workbook does for personal values: take something the participant already half-knows and make it specific enough to act on, in one sitting, without homework. The audience is senior, self-aware, and allergic to being managed gently — they've spent years being told to "communicate their value" by people who've never had to. The diagnostic's entire strategic advantage is refusing every soft, generic, deficit-framed, or comparison-based move the broader leadership-content market defaults to, and replacing each one with something specific: real evidence before any score, a named pattern that could only have come from what they actually said, and an honest structural read (not a personal one) of why the room keeps closing.

### Most important persona and primary goal

Persona 1 — the credible-but-sidelined Head of Design. Her primary goal is to be read accurately, fast, by something that has clearly "done the job." Every design decision should be pressure-tested against her specifically: would this feel like being seen, or would it feel like being processed?

### The 1-2 principles most likely to create tension with visual instincts

- **Principle 5 (no comparative/visible failure state)** will tempt a design-lead toward a benchmark visual — a progress bar, a peer-average line, a "you're stronger than 60% of leaders on this thread" — because these are proven, satisfying data-viz moves. Resist them here specifically. This product's entire credibility rests on never letting the result feel gradeable.
- **Principle 6 (the paid moment earns its own screen)** will be the harder one to hold under build-simplicity pressure. It's tempting to fold payment confirmation into the Welcome screen the way a Stripe checkout redirect naturally would. Don't — the Intake screen is where this product visibly signals it takes the $500 seriously, and it's the natural home for the privacy reassurance Persona 3's existence requires.

### Strategic constraints from the "touchpoint brief" (the curriculum docs) to keep front of mind

- Four threads, not three (Section 0) — this is not a stylistic preference, it's a structural dependency for Module 13's closing 90-day plan downstream.
- The tone is pitched higher than the Practitioner/Design Thinking Diagnostic sibling: "skip the warm-up," "let them go long," "some edge." Don't default to the warmer, more exploratory Why Workbook voice.
- Guardrails for defensiveness, blame-by-name, and distress signals (Section: Guardrails, in the curriculum doc) are load-bearing coaching content, not optional copy — the content-writer needs these verbatim or near-verbatim, they're already well-crafted.

### Open questions I could not resolve without design exploration

See Section 5 below in full — surfaced here per the standard handoff format, expanded there because two of them affect early build decisions materially.

---

## 5. Explicit calls made, and the one significant open question

### Call: chat, not wizard.
Made explicitly in Section 1.2, with reasoning weighed against the competitive scout's own caution against assuming chat wins by default.

### Call: named pattern, not a score.
Made explicitly in Principle 2 and Principle 5. The scout report treats this as "already decided" by the "Profile" language in both diagnostics' names; I'm confirming it as the deliberate choice rather than an unexamined default, specifically because a numeric score was a live, credible alternative (HubSpot Grader's model) and this audience's reputational sensitivity makes it the wrong one.

### Call: this $500 product needs visual differentiation from the free Why Workbook — and there's already a brand-system answer for it, not a fresh design decision.
The style guide (`style-guides/Content & Voice Guide.html`) defines two registers: **Editorial** (soft white/ink/ember/cobalt/lime, Archivo + JetBrains Mono + Caveat, "magazine-grade type... one idea per slide, no drop shadow, no gradient, no filler") explicitly scoped to "DESIGN-LED · Service Blueprinting · LinkedIn · Programme decks," and **Earthy** (soft white/sand/olive/clay/mustard, gentler, hand-drawn, lower-case titles) scoped to "Design to Me · Workbooks · Reflection prompts · Newsletters." The Why Workbook's shipped design (DM Serif Display/Fraunces/Inter/Allura, ink/paper/teal/pink/yellow/plum) sits close to but doesn't exactly match either formalised register — it predates or sits outside this later style guide.

The Design Leadership Diagnostic is explicitly the entry point into **DESIGN-LED: Leader**, a program the style guide already names as an Editorial-register property. This is not a case of the design-strategist inventing a new visual direction for a paid product to feel more premium — it's a case of correctly routing this touchpoint to the register the brand system already assigned it, rather than defaulting to the Why Workbook's look because that's the nearest built reference. Concretely: this recommends Archivo (or the closest available equivalent) for display type instead of DM Serif Display's italic display serif, JetBrains Mono for labels instead of Inter's uppercase-tracked labels, ink/paper/ember/cobalt/lime as the working palette instead of teal/pink/yellow/plum, and a materially more restrained surface (single accent per screen, no drop-shadow/gradient/hand-drawn flourish) — while keeping the Why Workbook's proven interaction shell (chat log, one-question-at-a-time, embedded special components, close-screen card + bridge + capture) completely intact. Structure carries over; skin does not. This is a recommendation for the design-lead to execute, not a visual decision I'm making myself.

### Open question I could not resolve without design exploration (the one that matters most):

**How much of the Editorial register's restraint survives contact with a 20-30 minute chat interface, versus a static deck?** The style guide's Editorial register was evidently designed for decks and single-artefact surfaces (LinkedIn posts, programme slides) — "one idea per slide," big confident numbers, a single accent per surface. A chat UI is inherently a multi-message, scrolling, accumulating surface, closer in kind to what the Earthy register's `msg-coach`/`msg-user` pattern already solves well for the Why Workbook. It is not yet resolved whether the Editorial palette and type stack can be applied to a chat log without either (a) diluting the "no filler, no gradient, one accent" discipline the register is built on, since a long conversation naturally wants visual variety to stay legible, or (b) requiring the design-lead to invent chat-specific Editorial-register component patterns (a coach-message treatment, a typing-indicator treatment, a special-component card treatment) that don't exist yet anywhere in either style guide. This needs an actual design exploration pass — a handful of comped chat-log screens in the Editorial register — before the visual differentiation call in the previous section can be treated as fully resolved rather than directionally right.

---

## 6. Note on Persona 3 and corporate access, flagged but not designed

Persona 3 (the corporate buyer) surfaces a genuine product-model question outside this doc's scope: does a corporate cohort license grant seats that route participants through this same $500 individual flow, or a separate corporate variant? If the former, Principle 5's privacy requirement needs a concrete backend answer (is a purchasing HR lead able to see individual profiles, yes or no) before the Intake screen's reassurance copy can be written honestly. Surfacing this to the Creative Director rather than assuming an answer, per the design-strategist's boundary on backstage constraints that aren't mine to resolve unilaterally.
