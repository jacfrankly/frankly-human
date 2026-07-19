# Design Leadership Diagnostic — Motion Spec

Prepared by: Motion Designer (MD)
For: Design Lead (integration into the full design specs package) and Design Builder (implementation)
Working within: the Strategy doc's Principle 5 (no comparative/visible failure state) and Principle 7 (immediate in-session reveal); the Inspiration doc's explicit ban on score visualisation of any kind at any point, its "rarer not louder" instruction for the reveal, and the Zumthor/Therme Vals four-rooms-one-ritual-each pacing metaphor; and the Why Workbook v2 shell's existing motion vocabulary (`why-workshop-app-v2/index.html`, `app.js`).

No design-lead visual spec exists yet for this touchpoint (checked — only the Strategy and Inspiration docs are on disk). Everything below is written against the Strategy doc's Editorial-register direction (Section 5.3) and the Inspiration doc's aesthetic brief (Section 3) directly, flagged wherever a visual decision isn't mine to make and needs the design-lead to confirm a hook (a class name, a DOM point) rather than a treatment.

---

## 0. The governing rule, stated once

Every animation below has to pass the test the role brief sets: *if I removed this motion, would the experience be harder to understand or less trustworthy?* For this touchpoint specifically, there's a second, stricter test layered on top of it, taken directly from the Inspiration doc's "withholding" note: *does this motion spend a gesture the moment has not yet earned?* A motion can pass the first test and still fail the second — this doc cuts several animations that would be defensible in an ordinary product (a card lift on hover, a satisfied checkmark bounce on selection) purely because this audience reads that vocabulary as trying too hard.

Baseline inherited from the Why Workbook and held unchanged: **every single animation is wrapped in `@media (prefers-reduced-motion: no-preference)`, without exception.** Where a spec below says "animation," read that guard as already applied; I don't repeat it per-spec, but the builder should treat its absence anywhere in the implementation as a bug, not an oversight.

Baseline duration/easing vocabulary carried over from the shell (do not introduce new curves without cause):
- **Fast state feedback:** 0.12–0.15s, default ease (button hover/focus, input border).
- **Entrance:** 0.2s ease (`msgIn`).
- **Alert/error:** 0.35s ease (`shake`).

This diagnostic adds exactly one new duration band (the reveal, Section 3) and reuses everything else.

---

## 1. What is explicitly NOT animated, and why

Stated first, per the brief, because restraint-by-omission is the actual content of this spec.

| Not animated | Why |
|---|---|
| **Phase progress of any kind** — no incrementing counter, no "3 of 4 threads scored" fill, no dot-stepper filling in as phases complete. | Principle 5 and the Inspiration doc's Section 4.2 rule this out at the level of *existence*, not just visual treatment — there is no safe "subtle" version of a progress animation here. The phase label is static text (`Phase 2 of 4 · The Three Traps`) that replaces on transition; it never fills, ticks, or counts. |
| **Thread-scorer / trap-selector selection: no checkmark pop, no bounce, no confetti, no colour fill sweep.** | The forced-choice and trap cards get a hairline-border state change only (Section 2). Anything with spring/overshoot physics reads as gamified feedback — the Rams/Judd reference in the Inspiration doc rules out "satisfying" tap feedback as a category, not just a specific implementation of it. |
| **Typing indicator beyond the Why Workbook's existing `dotpulse`.** | The Berkshire Chairman's Letter reference is cited explicitly as a guardrail against "delight" additions under build pressure. The existing three-dot pulse (already restrained, already reduced-motion-gated) is inherited unchanged — it is not upgraded with a new pulse-glow or size change for this touchpoint. |
| **Card hover lift / shadow-on-hover for the thread-scorer and trap-selector cards.** | Explicitly ruled out by the Inspiration doc ("no drop shadow... including on the new special components"). A lift-on-hover implies a shadow to lift *into*, which the register doesn't have. Hover state is a border-weight or border-colour change only (Section 2) — no transform, no shadow. |
| **Ambient/looping motion anywhere** (background gradient shift, breathing glow, cursor-follow effects). | Directly the *Spotlight* (2015) negative reference in the Inspiration doc: "resist any temptation toward a cinematic chat treatment (ambient motion, mood lighting via gradient)." This is a hard no for the entire touchpoint, not just Phase 3. |
| **Phase-transition screen wipe, slide, or crossfade of the chat log itself.** | Considered and rejected — see Section 3. The transition is a near-motionless cut with a static header-label update, per the brief's own suggestion, because an animated transition (even a restrained one) would be *more* motion than any other single moment in the 20–30 minute session except the reveal, which inverts the "rare gesture" economy the whole doc is built on. |
| **Payment/Intake confirmation checkmark or success animation (Screen 2).** | Same logic as the thread-scorer: a checkmark-draw or success-pulse is a stock SaaS pattern this register doesn't have room for. Confirmation is conveyed by static copy and the screen's own presence (Principle 6 — the screen itself is the gesture; it doesn't need a second one inside it). |
| **Number counting/ticking on any figure that appears** (e.g. if a session timer or word count is ever surfaced). | No numeric value in this product is a score, but even a neutral figure (elapsed time) ticking upward borrows the visual grammar of a counter, which Principle 5 rules out by association. If a timer exists, it's static/refreshed, not animated. |

---

## 2. Micro-interaction definitions

These are the small, purposeful responses — kept to the minimum the interaction requires to be legible, per the Judd/Rams "identical unit, no decoration" direction.

### 2.1 Thread scorer — forced-choice buttons (Phase 1)

Two buttons per thread: "I shape this" / "I execute someone else's call on this," plus a required evidence field. This is new relative to the Why Workbook's chip-sort and needs its own spec.

- **Default state:** flat rectangle, 1px hairline border (ink or sand, per design-lead's palette call), no fill.
- **Hover (pointer devices only):** border weight 1px → 1.5px, or border colour shifts one step darker. **Trigger:** `:hover`. **Duration:** 0.12s. **Easing:** ease. **Properties:** `border-color` and/or `border-width`. **Intent:** confirm the target is interactive before commit — nothing more. No background fill on hover; fill is reserved for the *selected* state so hover and selected stay visually distinct.
- **Selected (tap/click):** background fills solid (ink or the design-lead's chosen structural colour — cobalt reads right per the Inspiration doc's "cobalt marks structure"), text inverts to paper. **Trigger:** `click`/`tap`, on the button itself, immediately on interaction (no confirm step). **Duration:** 0.12s. **Easing:** ease. **Properties:** `background-color`, `color`, `border-color`. **Intent:** binary, immediate confirmation of a forced choice — this is a state change, not a celebration, so the timing matches the shell's other instant-feedback moments (button hover) rather than the slower entrance band.
- **Deselecting the other option** (choosing "shape" after having chosen "execute," or vice versa): the previously-selected button reverses the same transition, same duration, in parallel — not sequenced, not delayed. **Intent:** the two buttons read as one mutually-exclusive unit; staggering the reversal would imply a causal animation relationship between them that isn't there.
- **What's explicitly not here:** no scale-up/scale-down "press" effect, no icon (checkmark) appearing inside the selected button. The fill *is* the whole signal, per the Braun "colour used only where it carries operational meaning" reference.
- **Evidence field (required before the thread can be marked scored):** standard text input, inherits the shell's existing `border-color` focus transition (0.15s, ease) unchanged — no new treatment needed, this is exactly the kind of moment where reusing the boring existing pattern is correct.
- **Validation (attempting to advance without an evidence example, per Principle 3):** reuse the shell's `shake` animation verbatim (0.35s, ease, `translateX` per the existing keyframe in `app.js`) applied to the empty required field, not the whole card. **Intent:** identical to its existing use on the Why Workbook's message input — a firm, brief "this is required," not a scold. Do not invent a new validation animation for this touchpoint; the existing one is already correctly restrained (a shake, not a red flash, not an error icon bounce).

### 2.2 Trap selector cards (Phase 2)

Three named cards (Service Department Trap / Feature Factory Manager / Silent Expert), tap to select one as "feels most true."

- **Default / hover / selected states:** identical mechanics to Section 2.1's buttons — hairline border, hover darkens the border only, selected fills solid. Deliberately reusing the exact same state-change vocabulary as the thread scorer rather than inventing a card-specific treatment, because Judd's "identical units, positional variation only" reference argues directly against giving every new component its own micro-interaction personality. One tap-feedback pattern, reused everywhere a discrete choice is made in this product.
- **Only three options, single-select:** selecting a new card reverses the previously-selected one in parallel, same as 2.1.
- **What's explicitly not here:** no card "shuffle" or reflow animation when one is selected — the two unselected cards do not move, resize, or fade when the third is chosen. They simply sit at reduced visual weight (a lower-opacity border or muted text colour is a design-lead call, not a motion one) with zero transition duration beyond the existing 0.12s border/fill change.

### 2.3 Buttons (primary CTA, send, continue)

Inherit the Why Workbook's existing button vocabulary unchanged: `background`/`color`/`border-color` transition at 0.15s ease on hover, `:disabled` at `opacity: 0.35–0.38` with no transition on the disabled state itself (it should read as immediately inert, not fade into inertness). No new button treatment for this touchpoint — Editorial's restraint argument is best served by *not* redesigning something that already works.

### 2.4 Input focus (evidence fields, Intake fields, chat input)

Inherit unchanged: `border-color` transition, 0.15s, ease. No glow, no shadow-ring, no label-float animation. This is a case where the existing shell pattern already meets the Braun/Rams bar without modification.

### 2.5 Chat message entrance

Inherit `msgIn` unchanged for every message type (coach, participant, system) — see Section 3.2 for the one place this needs a decision (the coloured speaker-turn question) rather than a blanket carryover.

---

## 3. Phase transitions — the Zumthor moment

This is the spec most likely to create tension with a design-lead's visual instincts, so the reasoning is laid out in full before the spec itself.

### 3.1 The call: near-motionless cut, not an animated transition

**Spec:**
- **Trigger:** a phase boundary is reached (Reframe → Phase 1, Phase 1 → 2, 2 → 3, 3 → 4).
- **Visual change:** the mono phase-label in the header updates in place (`Phase 1 · The Four Threads` → `Phase 2 · The Three Traps`), and a single `msg-system` divider (the shell's existing centered, tracked-out mono rule, already used in the Why Workbook — see `.msg-system` in `index.html`) is inserted into the chat log marking the threshold, carrying the new phase's governing thought as its one line of copy.
- **Animation:** **none beyond the label's existing text swap and the divider's existing `msgIn` entrance** (0.2s ease, inherited as-is — the divider is just another chat-log item, it doesn't get bespoke treatment). No crossfade of the chat log, no slide, no colour wash, no wipe.
- **Duration:** effectively instantaneous — the phase-label swap is a text-content change with no transition property on it at all (a transition here would be a case of animating the label because it's *possible* to, not because it communicates anything the plain swap doesn't).
- **Intent:** this is the spec's most deliberate act of restraint. The Inspiration doc frames each phase as a Zumthor room — "one ritual per room... entered and left deliberately, with a phase-transition treatment marking the threshold." I read "marking the threshold" as satisfied entirely by the mono-label header update plus the system-divider's existing entrance — adding motion *on top of* that (a slide, a fade-through-black, a colour sweep) would be scoring the transition the way a wizard scores a step-count, which is exactly the visual grammar Principle 5 rules out. Zumthor's rooms are experienced through walking, not through a dissolve effect between them; the chat log scrolling to reveal the new divider *is* the walk. That's sufficient.

**Why this beats an animated alternative:** I considered and rejected three animated options before landing here, worth stating so the design-lead doesn't re-litigate them without the reasoning:
1. *Chat log crossfades out/in between phases* — rejected because it implies the prior phase's content is being discarded or hidden, which contradicts "the accumulated weight is structural" (Inspiration doc, Section 3) — participants should still see Phase 1's messages above the Phase 2 divider, scrolled-past not erased.
2. *A colour wash (cobalt) sweeps across the header on transition* — rejected because it spends the "cobalt marks structure" budget four times in one session on a gesture that's decorative, not informational; the plain-text label swap already carries the same information with zero ink spent.
3. *A brief pause/held-silence beat (e.g., a 400–600ms gap before the next message appears) to give the transition weight without any visual motion at all* — genuinely closest in spirit to Zumthor and to the Morris/*Fog of War* "let silence sit" reference, and worth the design-lead and content-writer considering as a *pacing* device (a scripted delay in Claude's response timing at phase boundaries specifically, longer than the ordinary typing-indicator wait). I'm not specifying it as a motion spec because it's a content-pacing/backend-timing decision, not a CSS animation — flagging it here as a strong option for the design-lead or content-writer to pick up, not claiming it as mine to spec.

### 3.2 Coloured speaker-turn component — does it need different entrance treatment?

The brief asks this directly. Answer: **no — identically restrained, `msgIn` unchanged, and the "coloured" part should not be read as license for a coloured *entrance*, only a coloured *rest state*.**

Reasoning: the Inspiration doc's Section 4 is unambiguous that speaker differentiation must be "typographic, not chromatic" as the *primary* mechanism, and flags that if the Creative Director has confirmed keeping some coloured speaker differentiation (noted in this brief as already decided upstream, with the design-lead's spec to follow), it has to be executed "with Editorial restraint" — meaning the colour is a static property of the message's rest state (e.g., a hairline left-border in one held-back hue, per the Why Workbook's own `msg-coach-inner` pattern, which already uses exactly this device: `border-left: 3px solid var(--teal)` with no colour anywhere else on the bubble), not something that gets its own animated reveal. If the message's entrance animated its border-colour in separately from its opacity/position (e.g., the border "drawing on" after the text fades in), that would be spending a second, distinct gesture on every single message in a 20-30 minute session — directly the failure mode Section 4.3 of the Inspiration doc warns against ("if ember... starts appearing on every Claude message... the register has been diluted").

**Spec:** the coloured message-turn component uses `msgIn` verbatim — 0.2s, ease, `opacity` + `translateY(6px→0)` — with its border-colour (or whatever static device the design-lead specifies) simply present from frame one, not animated in separately. One entrance, one set of animated properties, applied uniformly regardless of speaker or colour. This keeps the message-turn component from becoming a second place (beyond the reveal) where the session spends a "rare gesture" — its rarity budget is entirely used by *being coloured at rest*, not by *how it arrives*.

---

## 4. The reveal — Phase 4 / Leadership Influence Profile

The one moment per Principle 7 and Inspiration Section 3/4.3 that's allowed to be "loud" — where loud means *visually rare*, not kinetically busy. This is the only place in the entire spec where a genuinely new animation is introduced rather than an existing one reused.

**Context this has to sit inside:** by the time the participant reaches this moment, they have seen exactly one animation type for 20-30 minutes (`msgIn`, 0.2s, opacity+6px translate) and a handful of instant border/fill state changes (0.12-0.15s). Nothing has been "big" and nothing has used ember. The entire job of the reveal's motion is to make the *arrival* of the profile card feel like the first time the session allows itself size and colour — not to perform that arrival with technique.

- **Trigger:** the profile card (`why-card`-equivalent) renders in the chat log / on the Close screen, immediately following Claude's closing message — no separate "reveal" button click, no loading spinner gating it (a spinner here would be the one place a wait-state animation could accidentally read as suspense-building, which is the wrong emotional register entirely; if a genuine processing delay exists, it should read as the same typing-indicator dots already used everywhere else, not a bespoke "generating your profile" treatment).
- **Animation:** the card uses `msgIn`'s *exact* opacity/translateY mechanic — **not a new entrance curve** — but held for longer: **duration 0.4s** (2x the standard message entrance, not more), **easing: ease-out** (not the standard `ease`, specifically so the motion settles rather than arriving at even velocity — the one deliberate easing deviation in this entire spec, because this is the one moment "deliberate, not bouncy" needs to be felt in the curve itself, not just stated as a rule).
- **Properties:** `opacity` 0→1, `transform: translateY(10px→0)` (slightly more displacement than the standard 6px, proportionate to the card's larger size, not proportionate to "wanting it to feel bigger").
- **Colour:** ember/cobalt/lime are applied to the card's *content* (the profile sentence, the thread+trap combination, the one lime highlight word per the Inspiration doc's "one single-word highlight... the way a book gets exactly one pull-quote") as static properties present from the first rendered frame — colour does not fade in, wipe in, or animate its own appearance separately from the card's single opacity transition. **This mirrors the Section 3.2 rule exactly:** one entrance, one set of animated properties, and colour rides along inside it rather than getting a second gesture.
- **Type:** if the design-lead's Archivo display-weight treatment is applied to the headline sentence, it renders at full size immediately within the same entrance — no counting-up font-size animation, no letter-by-letter reveal, no typewriter effect on the profile sentence. (A typewriter effect is worth flagging explicitly as a plausible but wrong build-pressure shortcut — it would read as *performing* the reveal, exactly what Principle 5 and the Row/Rams references rule out. The sentence should look like it was already true, not like it's being typed live for effect.)
- **What makes this "rare" rather than "loud" in the kinetic sense:** total motion budget for the reveal is one transition, 0.4s, two animated properties (opacity, translateY) — objectively *less* choreography than a typical SaaS "success" moment, and only ~2x longer than the ordinary message entrance it's built from. The "loudness" is entirely a property of what's on screen (first big type, first spent colour) arriving through the same restrained mechanism as every other message before it — not a property of how many techniques are stacked onto its arrival. This is the direct execution of the Inspiration doc's line: "it will land simply by being the first time in half an hour that type gets big and colour gets used for content rather than structure."
- **What's explicitly not here:** no confetti, no scale-bounce/overshoot, no glow/pulse on the card border, no staggered reveal of the card's internal elements (label, then sentence, then thread tags arriving in sequence) — the card enters as one unit, once, the same way every message before it entered as one unit. Staggering internal elements would manufacture a "big moment" through technique the way a typewriter effect would; the brief for this component is that its bigness is self-evident from content and colour alone.
- **Bridge (`d2m-bridge`-equivalent) and secondary CTA below the card:** enter via standard `msgIn` (0.2s, ease) immediately after, or simultaneously with, the card — not held back for a second staggered "and now here's more" beat. These are structural (cobalt-register) elements, not part of the reveal's spent gesture, and should read as such by using the ordinary timing, not the reveal's extended one.

---

## 5. Transition library summary

| Element | Animation | Duration | Easing | Properties | New or inherited |
|---|---|---|---|---|---|
| Chat message entrance (all speakers, incl. coloured turns) | `msgIn` | 0.2s | ease | opacity, translateY(6px) | Inherited unchanged |
| Typing indicator | `dotpulse` | 1.2s loop | ease-in-out | opacity, scale | Inherited unchanged |
| Button hover | fill/border transition | 0.15s | ease (default) | background, color, border-color | Inherited unchanged |
| Input focus | border transition | 0.15s | ease (default) | border-color | Inherited unchanged |
| Required-field validation | `shake` | 0.35s | ease | translateX | Inherited unchanged, reused verbatim |
| Thread-scorer button hover | border transition | 0.12s | ease | border-color/width | New, matches existing fast-feedback band |
| Thread-scorer button selected | fill transition | 0.12s | ease | background-color, color, border-color | New, matches existing fast-feedback band |
| Trap-card hover/selected | identical to thread-scorer | 0.12s | ease | background-color, color, border-color | New, deliberately reuses thread-scorer spec |
| Phase transition | none (static label swap + existing divider `msgIn`) | n/a | n/a | text-content only | New decision: explicitly no dedicated transition animation |
| Profile reveal card | extended `msgIn` | 0.4s | ease-out | opacity, translateY(10px) | New — only genuinely new timing/easing in the system |
| Bridge/secondary CTA (Close screen) | `msgIn` | 0.2s | ease | opacity, translateY(6px) | Inherited unchanged |

Everything in this table other than the phase transition and the reveal is a direct reuse of the Why Workbook's existing values — that's a deliberate outcome, not a gap in this spec. A touchpoint this restrained shouldn't need a large new motion vocabulary; it needs the existing one applied with more discipline about *when* to reach for it.

---

## 6. Handoff notes

### To the design-lead
- The one open dependency this doc has on your forthcoming spec: the coloured message-turn component's *rest-state* colour treatment (which hue, what property — border, background-tint, label-colour) is yours to decide; Section 3.2 only constrains that whatever you choose must be static and present from frame one, not separately animated in. If your spec ends up wanting the colour to feel more "alive" than a static hairline border allows, that's a signal worth raising with the Creative Director before build, not a motion problem I can solve by adding movement — Principle 5 and the Inspiration doc's accent-economy argument (Section 4.3) apply to the whole session, not just the reveal.
- Section 3.1's "held-silence" pacing option (a longer response delay at phase boundaries) is a genuinely strong idea I'm flagging but not claiming — it belongs to content-writer/backend timing, not CSS. Worth a conversation with them.
- The phase-transition divider reuses the shell's existing `.msg-system` component verbatim. If you're designing new visual treatment for it (colour, weight) for this touchpoint, the motion spec (its `msgIn` entrance) doesn't need to change regardless of what you decide visually — flagging so a visual update to that component doesn't accidentally trigger a motion review that isn't needed.

### To the design-builder
- **Must be implemented precisely:** the reveal's 0.4s/ease-out timing (Section 4) — this is the one moment in the system where the exact numbers matter, because it's calibrated specifically to read as "slightly slower, slightly softer than everything before it," not as a stylistic flourish. If performance or framework constraints force a simplification, keep the duration and ease-out curve exact before compromising anything else about this animation.
- **Can be simplified without loss if needed:** the thread-scorer/trap-selector hover state (Section 2.1/2.2) — if a build constraint makes a separate hover state (distinct from the selected state) impractical on touch-primary devices, it's fine to drop hover entirely on touch and keep only the selected-state fill transition; hover was never load-bearing for comprehension there, only a nicety for pointer users.
- **No new library or technique required anywhere in this spec.** Every animation is a CSS transition or a CSS `@keyframes` block, consistent with the existing shell's approach (`msgIn`, `dotpulse`, `shake` are all plain CSS, no JS animation library, no requestAnimationFrame). The reveal's card entrance can reuse the exact same `msgIn`-pattern implementation with an overridden `animation-duration` and `animation-timing-function` — it does not need its own keyframe block if the builder prefers a shared one with a duration override; a separate `@keyframes profileReveal` is also fine if that's cleaner to maintain. Either is acceptable; the visible result is what's specified, not the implementation shape.
- **Reminder inherited from the shell, worth restating because this is the strictest-motion touchpoint in the system and it would be easy to assume more animation is warranted:** every animation above must sit inside `@media (prefers-reduced-motion: no-preference)`. With reduced motion active, all state changes (selection, phase transition, the reveal itself) still occur — they simply appear instantly, with no transition. Verify this specifically for the profile-card reveal, since it's tempting to treat the "important" moment as an exception; it is not. A participant with motion sensitivity should get the same information, instantly, with zero loss of content or colour.
