# Design Thinking Diagnostic — Motion Spec

Prepared by: Motion Designer (MD)
For: Design Builder, via Design Lead
Inputs: `Design Thinking Diagnostic — 02 Strategy.md` (design-strategist), `Design Thinking Diagnostic — 03 Inspiration.md` (inspiration-scout, esp. Section 4 and the Motion theme in Section 2), `why-workshop-app-v2/index.html` + `app.js` (shipped motion baseline), `style-guides/Visual Style Guide.html` (`.mark-underline` primitive)

---

## 0. Working rule for this document

Every spec below states a trigger, duration, easing curve, properties animated, and an intent sentence. If I couldn't write the intent sentence honestly, I cut the motion instead of including it. Two things I decided NOT to add, on that basis:

- **No entrance animation on the lens-scorer / six-mindset / cause-attribution grids themselves.** The Why Workbook's existing special components (`values-map`, `actions-ui`, etc.) already just appear with no fade when their wrapper is unhidden — there's no precedent to extend, and inventing one here would be decoration the strategy doc didn't ask for. I only extend `msgIn` to the components' *outer wrapper* (Section 2.2) so they don't visually pop against the chat log's fades — that's a consistency fix, not new decoration.
- **No hover/idle "shimmer" or pulse on the profile tag once revealed.** The aesthetic direction is explicit: said once, not performed continuously. Once the underline stroke completes, nothing about the profile card moves again, ever — no breathing glow, no re-trigger on scroll-into-view. It sits there the way a pathology report sits on a desk.

All new animation in this document follows the codebase's existing non-negotiable pattern: **every keyframe/transition-based motion is wrapped in `@media (prefers-reduced-motion: no-preference)`**, exactly like `msgIn` (index.html:205) and `.shake` (app.js:1075). The unwrapped, reduced-motion-safe base state is always the *final* visual state — elements simply appear, nothing moves.

---

## 1. Motion vocabulary this touchpoint inherits (baseline, unchanged)

| Token | Definition | Current use |
|---|---|---|
| `msgIn` | `opacity 0→1, translateY 6px→0`, **0.2s ease** | Every `.msg` (coach/user/system) fades up as it enters the chat log |
| `dotpulse` | `opacity/scale` pulse per dot, **1.2s ease-in-out, infinite**, staggered 0.2s/0.4s | Typing indicator |
| `shake` | `translateX` wobble, **0.35s ease** | Empty-message input validation error |
| Micro-transitions | `border-color` / `background` / `color`, **0.12s–0.15s, plain `ease`** | Inputs on focus, buttons/chips on state change, `#btn-send` hover |
| Screen transitions | **None.** Hard cut via `display:none` ↔ `display:flex` | Welcome → Diagnostic → Close |

I am not introducing a new screen-transition animation for Welcome → Diagnostic → Close. There's no existing precedent, the strategy doc's Principle 6 is about chrome *disappearing*, not chrome *transitioning*, and a screen wipe would be exactly the kind of "demonstrating capability" motion the role brief tells me to cut. Screens keep cutting hard.

One new easing token, used in exactly one place:

| Token | Value | Where |
|---|---|---|
| `--ease-chalk` | `cubic-bezier(0.45, 0, 0.15, 1)` | The profile-tag underline stroke only (Section 3.5). Front-loaded like pressure being applied, settling firmly at the end — a drawn line, not a wipe. Everything else in this spec uses the existing plain `ease`, deliberately, so the new touchpoint doesn't grow its own competing easing library. |

---

## 2. Transition library — how this touchpoint extends the Why Workbook's

### 2.1 Chat messages (coach / user / system) — reuse `msgIn`, unmodified
No change. Phase-0 reframe, all chat-only phases (1a, 1c, 3), and every coach/user turn use `msgIn` exactly as shipped. This is the connective tissue that makes the diagnostic read as "the same app, new content" per the strategy doc's own framing.

### 2.2 New special components (lens-scorer, six-mindset chips, cause-attribution) — extend `msgIn` to the wrapper
**Gap found:** `.special-component` currently has no entrance animation at all in the Why Workbook (confirmed — no CSS rule targets it beyond layout). Existing components just snap into view when their `display:none` is cleared. Left alone, three brand-new component types would inherit that same abrupt pop, which reads as more "form" than "conversation" — friction against the strategy doc's chat-not-wizard argument.

**Spec:** apply the `msgIn` keyframe (same 0.2s ease, same opacity+translateY-6px) to `.special-component` itself, gated inside the same `prefers-reduced-motion: no-preference` block as everything else. This is the one place I'm extending the existing vocabulary rather than only reusing it — and the extension is literally the same token, just applied to one more selector, so it costs nothing in either build complexity or visual-language coherence.

- Trigger: component's wrapper unhidden (JS sets `display:flex`/removes `style="display:none"`)
- Duration/easing: 0.2s ease (unchanged)
- Properties: opacity, transform: translateY
- Intent: the lens-scorer, mindset chips, and cause-attribution grid arrive with the same weight as a coach message, because structurally that's what they are — a coach turn wearing a tap interface instead of prose. Treating them differently would visually contradict Design Principle 2 (attribution as structured *conversation* state, not a form dropped into the chat).

### 2.3 Component internal state changes — reuse `vm-state-btn` / `value-chip` transitions, unmodified
Lens-scorer (1b) and cause-attribution (2b) reuse the `vm-state-btn` pattern's existing `transition: all 0.12s` for state changes (background/border/color per selected state). Six-mindset chips (2a) reuse `value-chip`'s existing `transition: all 0.12s`. No new keyframes. This is intentional — see Section 3.1–3.3, these are visual-only extensions of shapes that already have their motion defined.

### 2.4 Phase transitions — extend the existing `msg-system` divider with a paced silence, not a new visual
Covered in full in Section 3.4. In short: no new component. The existing centered small-caps divider (`.msg-system`, already inheriting `msgIn` because `addSystemMessage()` assigns it class `msg msg-system`) is reused verbatim. What's new is the *pacing* around it — a deliberate pause is inserted in the JS orchestration before and after the divider appears, which is a timing spec, not a CSS spec.

### 2.5 Profile reveal — the one genuinely new sequence in this document
Covered in full in Section 3.5. Reuses `msgIn` for the evidence line (per the inspiration doc's direct instruction) and introduces exactly one new technique: an SVG stroke-draw on the `.mark-underline` primitive, using `--ease-chalk`.

---

## 3. Motion specs

### 3.1 Lens-scorer tap states (Phase 1b)
3-item grid (Desirable / Viable / Feasible), each with a row of state buttons, structurally identical to `vm-state-btn`.

| | |
|---|---|
| **Trigger** | Tap/click on an unselected state button |
| **Duration / easing** | 0.12s, `ease` (unchanged `vm-state-btn` transition) |
| **Properties** | `background-color`, `border-color`, `color` |
| **Intent** | Confirms the tap registered as the recorded state for that lens. Nothing more — this is a low-stakes, reversible selection (Design Principle 1's "one project, one thread" framing means the *content* carries the weight here, not the interaction). |

**New, small addition — press feedback (applies to every tappable element in this touchpoint, specified once here, referenced everywhere else):**

| | |
|---|---|
| **Trigger** | `:active` (finger/cursor down) |
| **Duration / easing** | 0.08s, `ease`, no delay |
| **Properties** | `transform: scale(0.98)` |
| **Intent** | Phone-first audience (Design Principle 6) tapping small targets needs tactile confirmation that a touch registered *before* the 0.12s color change resolves. This is the one micro-interaction in this spec that isn't a direct reuse — it's new because none of the Why Workbook's tap targets currently have a press state at all (checked: `vm-state-btn` and `value-chip` define `:focus` but no `:active`). Justification against the "would removing this make it less trustworthy" test: on a touchscreen, a target with zero tap feedback until a 120ms color transition completes reads as unresponsive in the first 50–80ms, which matters more here than in the Why Workbook because Dinesh (Persona 2.2) is explicitly primed to bail at the first sign of friction. |
| **Performance note** | `transform` only, no layout properties — cheap, GPU-composited, safe on low-end mobile. |

Apply this same press rule to: six-mindset chips (3.2), cause-attribution buttons (3.3), `btn-continue`, and `#btn-send`. I'm not writing it out four more times below — assume it's present on every tappable surface in the diagnostic screen unless stated otherwise.

### 3.2 Six-mindset chip selection (Phase 2a)
6 chips, single-select (not the Why Workbook's circle/star multi-state) — reuse `value-chip` shape, new selection semantics.

| | |
|---|---|
| **Trigger** | Tap on an unselected chip |
| **Duration / easing** | 0.12s, `ease` (unchanged `value-chip` transition) |
| **Properties** | `background-color`, `border-color`, `color`, `font-weight` (whatever the design-lead defines for the "selected" visual state) |
| **Behavior, not just style** | Because this is single-select, selecting a new chip must simultaneously revert the previously-selected chip to its unselected state. Both transitions run concurrently, same 0.12s/ease, so the "handoff" between chips reads as one smooth swap rather than two staggered events. Do not sequence these (e.g., "wait for old to deselect before selecting new") — that would introduce a delay this component has no reason to carry. |
| **Intent** | A single, immediate, reversible choice — "which is hardest to practise in your organisation." No confirm step, no weight beyond a normal chip tap, because unlike 2b this isn't yet the load-bearing attribution — it's the setup question. |

### 3.3 Cause-attribution selection (Phase 2b) — deliberately weighted differently from 3.1 and 3.2
3-button `vm-state-btn` reuse (personal skill gap / organisational constraint / relationship gap). Per Design Principle 2, this is "the single most important thing this diagnostic produces." The base state-change is identical to Section 3.1 — but I'm adding one thing on top, and I want to be explicit about why, since the brief specifically warns against unjustified "delight" motion.

| | |
|---|---|
| **Base trigger / duration / properties** | Same as 3.1: tap → 0.12s ease → background/border/color |
| **Addition: confirm pulse** | On selection, the button's border briefly overshoots to full `--ink` (or `--plum`, design-lead's call) for one beat before settling to its resting selected-state border color. |
| **Timing** | 0ms: state-class applied, 0.12s color transition begins as normal. 120ms: border-width or border-opacity animates from overshoot back to rest over 180ms, `ease`. Total added time: 180ms, once, no repeat. |
| **Properties** | `border-color` (or `box-shadow` if the design-lead prefers a ring rather than a border change — builder's implementation choice, either is fine) |
| **Intent** | This is the one selection in the whole touchpoint where the strategy doc explicitly says the moment must feel like a *recorded, confirmed decision*, not a browsing state (Test in Principle 2: "could someone read `STATE.workbook` and see which cause was named, without re-parsing the conversation?"). The other five interactive components in this touchpoint are exploratory or low-stakes; this one directly becomes the Phase 4 diagnosis. A visually identical tap-feedback across all six would undersell that this specific tap is different in kind, not just in content — which risks exactly the failure mode the strategy doc names for Dinesh (Persona 2.2): if the tool doesn't visibly do "real work" to pull out and lock in the relationship-gap explanation, it's failed its hardest job. The pulse is a restrained nod to the EKG mood-board reference (Inspiration doc, Motion theme) — "a steady trace producing one identifiable spike" — applied here, once, at the one moment in the diagnostic phase that deserves it. |
| **Performance note** | Border-color/width only, no reflow if implemented as `box-shadow` instead of `border-width` (recommend `box-shadow` specifically for this reason — animating `border-width` triggers layout, `box-shadow` doesn't). Flag for builder below. |

If a second opinion decides this is one flourish too many, it's the single cuttable item in this document — everything else is either direct reuse or has no substitute. I'd keep it, but it's the right one to cut first if you need to.

### 3.4 Phase transitions — "rooms entered deliberately"
No new component (Section 2.4). What changes is pacing, implemented as JS timing, not CSS.

**Current Why Workbook behavior:** `addSystemMessage()` appends the divider immediately, `msgIn` fades it in over 0.2s, and the next coach message's typing indicator can appear right after with no enforced gap.

**Spec for this touchpoint:**

| Beat | Timing | What happens |
|---|---|---|
| Phase content settles | T = 0ms | Last answer of the outgoing phase is recorded (special-component selection confirmed, or chat answer submitted) |
| Pause before divider | T = 0 → 400ms | Nothing renders. This is the "beat of quiet before the coach speaks" from the Friday Night Lights reference — the outgoing phase is allowed to finish being felt before the tool visibly moves on |
| Divider appears | T = 400ms | `addSystemMessage()` fires as today, `msgIn` 0.2s ease, unchanged |
| Pause before next phase opens | T = 600ms → 1000ms (400ms after divider completes) | Nothing renders |
| Typing indicator, then next coach message | T = 1000ms onward | Existing `showTyping()` / `dotpulse` / `msgIn` flow, unchanged |

**Intent:** phases are the diagnostic's structural spine (Discovery → Meaning → Action across three lenses, six mindsets, and one named cause). Zumthor's "room entered deliberately" reference is not a visual metaphor to illustrate — it's a pacing instruction: don't let one phase run into the next at chat-message speed. The 400ms pauses are short enough not to read as lag (well under the ~1s threshold where a pause starts to feel like a stall) but long enough to register as a held beat rather than nothing.

**Performance note:** pure `setTimeout` sequencing, zero rendering cost. Flag for builder: guard this timing against the existing `REPLAYING` flag exactly the way `resumeSession()` already suppresses `TRANSCRIPT` writes — on resume, phase dividers should replay at normal (near-instant) speed like the rest of the transcript replay, not re-run the 400/400ms pause choreography. Re-pacing a session someone already lived through would feel like the app making them wait for its own effect.

### 3.5 Profile reveal (Phase 4 → Close screen) — the flagship sequence

This is the highest-stakes single moment in the product. Full timeline below, all times relative to the moment the Close screen's content is ready to reveal (i.e., after the hard-cut screen switch already used for Welcome→Diagnostic→Close — no new screen transition, per Section 1).

**Pre-condition, stated explicitly because it's easy to miss:** this sequence plays **once** — on the pageview where the diagnosis is first produced. If the participant reloads the tab or the session resumes onto an already-completed Close screen (the existing `resumeSession()` path), the profile card must render in its **final, fully-settled state immediately** — evidence visible, tag visible, underline fully drawn, no animation. Replaying the reveal on every return visit would directly violate the "said once" principle this entire spec is built on; a dramatic beat that repeats on refresh stops being dramatic and starts being a loading screen. Gate this in JS against whatever flag distinguishes "diagnosis just computed this pageview" from "diagnosis already existed in `STATE`."

**Layout note:** only the profile card's own contents animate. The module-bridge card and email-capture block below it render in their current static, un-animated state from T=0 (same as the Why Workbook ships today) — nothing competes with the reveal for attention, which is the motion-level enforcement of Design Principle 3 ("the profile outranks the funnel").

| Time | Event | Duration | Easing | Properties | Intent |
|---|---|---|---|---|---|
| **T = 0ms** | Close screen content mounts. Evidence sentence begins fade-in. Tag element exists in DOM but is fully transparent (`opacity: 0`); underline `<path>` has `stroke-dashoffset` set to its full computed length (hidden) | — | — | — | Nothing is visible of the profile yet except the evidence sentence beginning to arrive |
| **T = 0 → 200ms** | Evidence sentence (the diagnostic sentence + quoted fragment from the participant's own words, per Inspiration doc Section 4.3) fades in | **200ms** | `ease` | `opacity 0→1`, `translateY 6px→0` | Reuse of `msgIn`, unmodified, per the inspiration doc's direct instruction. This is deliberately identical to how every coach message has arrived for the entire session — the evidence is *presented*, conversationally, before anything shifts register |
| **T = 200 → 700ms** | **Pause.** Nothing on screen changes | **500ms held** | — | — | The single most important non-visual beat in this document. This is the "ten seconds after the doctor turns the monitor" and the boxing-corner "one flat sentence, no throat-clearing" reference, compressed to a screen-reading pace: long enough to read as a held breath, not a stall (500ms sits just past the point where a pause reads as "deliberate" rather than "the previous animation's tail end"), short enough that Dinesh doesn't feel the tool stalling on him at the one moment he's been waiting the whole session for |
| **T = 700 → 850ms** | Tag text (`DM Serif Display` italic, `--plum`, no container — per Inspiration doc Section 4, Do #1) fades in | **150ms** | `ease` | `opacity 0→1` **only** — no `translateY` | Deliberately *not* `msgIn`. The tag is a verdict, not a conversational turn — giving it the same float-up motion as every chat bubble would make the single most important sentence in the product feel like just another message. A flat opacity fade reads as "stamped" rather than "arrived," closer to the pathology report's bolded line than to a chat bubble |
| **T = 850 → 1000ms** | **Pause.** Tag is now fully visible, unmarked | **150ms held** | — | — | The beat where the tailor has laid the chalk against the fabric but not yet drawn — the reader gets a half-second with the bare tag before the mark confirms it. Short pause, not a repeat of the 500ms beat — this is punctuation, not another held breath |
| **T = 1000 → 1700ms** | Underline stroke draws beneath the tag, left to right, single continuous motion | **700ms** | **`--ease-chalk`** (`cubic-bezier(0.45, 0, 0.15, 1)`) | `stroke-dashoffset: [pathLength] → 0` on the `.mark-underline` `<path>` | The one new technique in this spec (implementation in Section 4). This is the chalk-mark reference made literal: one unhurried, continuous stroke, not a wipe or a fill. `--ease-chalk` front-loads slightly (pressure going down) and settles firmly at the end (the chalk lifting off), rather than the constant-velocity feel a plain `ease` or `linear` would give a hand-drawn gesture |
| **T = 1700ms** | Sequence complete. Nothing about the profile card animates again — no idle pulse, no re-trigger on scroll, ever | — | — | — | — |

**Total elapsed time: 1.7 seconds.** This is a deliberate, named outlier against every other duration in this document (nothing else exceeds 0.35s, most sit at 0.12–0.2s). I'm flagging the outlier explicitly rather than letting it slip in unexamined: it's justified because this is the one moment in a 20–30 minute product that the entire tool has been building toward, and every mood-board reference for it (pathology report, chalk mark, boxing corner, EKG) describes a *held* moment, not a fast one. If usability testing shows 1.7s reads as slow rather than deliberate, the first thing to trim is the 500ms pause at T=200–700ms down to ~350ms — not the stroke-draw, which is the one piece of motion actually doing representational work.

---

## 4. Micro-interaction: the underline-stroke SVG technique (implementation detail for design-builder)

The `.mark-underline` primitive is currently defined in `style-guides/Visual Style Guide.html` (lines 53–68) as CSS only — `position: absolute`, sized to `112%` of the parent's width, `18px` tall, positioned `-10px` below the baseline. **There is no existing instance of this primitive anywhere in the codebase with an actual `<path d="...">` value** — I checked (grepped the whole repo) and confirmed it's only ever been specified, never instantiated. That means I can't hand you a measured path length; I can hand you the correct technique so it's right regardless of what path the design-lead/builder ends up authoring.

**Do not hardcode a `stroke-dasharray` pixel value.** Compute it at runtime:

```js
const path = tagUnderlineEl.querySelector('path');
const len = path.getTotalLength(); // exact length in user-space units, works for any path
path.style.strokeDasharray = len;
path.style.strokeDashoffset = len; // fully hidden — line "undrawn"

// after the T=1000ms pause completes:
path.style.transition = `stroke-dashoffset 700ms cubic-bezier(0.45, 0, 0.15, 1)`;
path.style.strokeDashoffset = '0';
```

**Three implementation gotchas to flag explicitly:**

1. **Don't hide the pre-state with `display: none`.** `getTotalLength()` can return `0` on some browsers for an element with no computed layout box. Hide it with `opacity: 0` on the parent `.mark-underline` wrapper (which you're already fading via Section 3.5's tag fade-in) or `visibility: hidden`, not `display: none`.
2. **Measure after the web font has settled.** If the tag's width is font-dependent and the underline path is authored to match it dynamically, `getTotalLength()` called before `DM Serif Display` has finished loading will measure against a fallback-font layout and the stroke will be the wrong length. Gate this behind `document.fonts.ready`, or — simpler, and what I'd actually recommend — use a **fixed-viewBox path** (the primitive already scales via `width: 112%` per its existing CSS, so a fixed `d` at a fixed viewBox stretches correctly to fit the rendered tag width regardless of the tag's actual pixel size). A fixed viewBox sidesteps the font-timing problem entirely, since `getTotalLength()` on a static path is stable the moment the SVG is parsed. I'd default to this unless the design-lead has a specific reason to want a width-matched dynamic path.
3. **Reduced motion:** under `prefers-reduced-motion: reduce`, skip the transition entirely — set `strokeDashoffset = '0'` immediately with no `transition` property set, so the underline simply appears fully drawn in its final position at the same moment the tag becomes visible. Same rule applies to the tag's opacity fade and the evidence sentence's `msgIn` — collapse all three to their end states, no animated properties, matching the codebase's existing convention (base state = arrived, `no-preference` query = added motion).

**Performance:** this is a single short path, animated once, on a screen the user reaches once. `getTotalLength()` forces a geometry read but on one element, one time — not a per-frame cost, not a concern at this scale. No library needed; this is native SVG DOM + CSS transitions, consistent with the codebase's existing "prefer CSS transitions over JS" posture.

---

## 5. Handoff note to the design-builder

**Must be implemented precisely, because removing or simplifying them changes what the product communicates:**
- The profile reveal timeline in Section 3.5, especially the two pauses (200–700ms, 850–1000ms). These aren't loading delays to optimize away — they're the whole point, borrowed directly from the inspiration doc's mood board. If you're tempted to tighten the sequence for snappiness, tighten the 500ms pause first (down to ~350ms floor), never cut it to zero.
- The underline stroke must be a genuine left-to-right draw (`stroke-dashoffset`), not a `scaleX` reveal or a clip-path wipe. Those would look like a progress bar or a UI reveal, not a drawn line — wrong register entirely for the chalk-mark reference this is built on.
- The tag's opacity-only fade (no `translateY`) must stay visually distinct from `msgIn`. If both end up looking identical, the tag reads as "one more chat message" instead of a verdict, which undercuts the whole point of Section 3.5.

**Fine to simplify if performance or timeline requires it:**
- Section 3.3's cause-attribution confirm pulse is the one explicitly cuttable item in this document (flagged inline). Cut it before touching anything in Section 3.5.
- Section 3.1's press-feedback `scale(0.98)` can be dropped on components where it proves fiddly on real devices without materially changing what the product communicates — it's a nicety, not a signal-carrying motion, unlike everything in Section 3.5.
- The phase-transition pauses (Section 3.4) can compress toward 250ms/250ms if 400ms/400ms tests as sluggish in a 20–30 minute product — just keep some pause, don't remove it to zero, or phase transitions stop reading as anything at all.

**Technique to know upfront:** the underline stroke (Section 4) is the only non-trivial implementation in this entire spec. Everything else is CSS transitions/keyframes matching the existing codebase's exact pattern. Budget real testing time for the stroke — specifically, test it against the actual authored `.mark-underline` path once the design-lead has one, since `getTotalLength()` behavior can surprise you on paths with subpath gaps or unusual curve construction (hand-drawn-looking paths sometimes have these). Test on a real font-load-throttled connection if you go with the dynamic-width approach in gotcha #2, or just take my recommendation and use the fixed-viewBox version to avoid the question entirely.

**One aside, not part of this deliverable:** while reading the existing motion code I noticed `.typing-dots span`'s `dotpulse` animation (index.html:246) is applied unconditionally, not gated inside the `prefers-reduced-motion: no-preference` block the way `msgIn` and `.shake` are. It's an infinite animation, so it's the one place in the current Why Workbook that doesn't fully honor a reduced-motion preference. Not mine to fix under this brief, but worth a ticket — and worth not copying that gap forward into any new typing-indicator instance this touchpoint reuses.
