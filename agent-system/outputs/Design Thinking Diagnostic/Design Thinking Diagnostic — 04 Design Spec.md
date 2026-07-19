# Design Thinking Diagnostic — Design Spec

Prepared by: Design Lead (DL)
For: Design Builder, ahead of implementation. Cc Motion Designer, Content Writer.
Inputs: `Design Thinking Diagnostic — 02 Strategy.md` (design-strategist), `Design Thinking Diagnostic — 03 Inspiration.md` (inspiration-scout), `why-workshop-app-v2/index.html` + `app.js` (shipped shell, read in full), `style-guides/Visual Style Guide.html` (`.mark-underline` primitive)

Taste-profile note: as with the upstream docs, there is no formal Creative Director profile for this run. I've treated the Why Workbook's shipped build as the taste anchor and the two upstream docs as binding constraints, and made the calls both docs explicitly left to design-lead judgment. Every one of those calls is named in Section 4 (Open Threads) with my position stated, not buried in the spec as if it were settled.

---

## 0. What this build is, in one paragraph

Same three-screen shell as the Why Workbook (Welcome → Diagnostic → Close), same phase-token state machine, same chat-log-plus-embedded-special-component pattern, same DM Serif Display / Fraunces / Inter type stack and ink/paper/sand palette. What changes: the diagnostic phases run leaner than the Why Workbook's — no painted blobs, no Allura, one working accent colour (plum) instead of four in rotation, and no hand-drawn iconography anywhere. Three new tap components carry the diagnostic's actual analytical work (lens scorer, mindset chip, cause-attribution buttons), and the Close screen's reveal is a deliberate departure from the Why Workbook's boxed `why-card`: a report-style verdict that sits directly on paper, sized and staged like the pathology-report/tailor's-chalk references the inspiration doc pinned. This is subtraction from an existing system, not a new one.

---

## 1. Visual design system

### 1.1 Palette — same tokens, new usage discipline

Reuse the Why Workbook's `:root` tokens exactly (no new colour values):

```
--ink:      #100000
--charcoal: #423B3B
--paper:    #FBF7EE
--paper-2:  #F4EFE2
--sand:     #E0D2B5
--teal:     #47ACA4
--pink:     #FF3990
--yellow:   #FFBD59
--plum:     #7A1F4A
--muted:    #5E584F
--teal-text:#1F6E67
--pink-text:#C40060
--max:      640px
```

**Usage discipline for this touchpoint** (this is the actual design decision — the tokens aren't new, the rules governing them are):

| Token | Role in the diagnostic | Changed from Why Workbook? |
|---|---|---|
| `--ink` / `--paper` / `--paper-2` / `--sand` | Structural foundation — text, borders, surfaces. Unchanged. | No |
| `--plum` | **The single working accent.** Used for: selected-state fill on all three new tap components (1b, 2a, 2b), the Profile tag + underline stroke on Close, the `d2m-bridge-cta` border/text (already plum in the shipped build). Nowhere else. | Usage narrowed — was one of four accents in rotation, now the only one doing selection/reveal work |
| `--teal` | **Retained as structural chat chrome only** — the `msg-coach-inner` left border-stripe and the `#user-input`/`.name-field input` focus-border colour (`--teal-text`). This is a functional, uniform marker every coach message shares identically; it isn't "decoration in rotation," it's the one piece of shell furniture that makes this still read as the same app's chat log. Keep it. | No change — deliberate keep, reasoning stated |
| `--pink` / `--yellow` | **Not used anywhere in the diagnostic phases.** No chip states, no selection fills, no dividers. `--pink-text` remains available strictly for form-validation errors on the Close screen email field (functional, not decorative — unchanged from Why Workbook). | Removed from decorative/selection use entirely |
| `--muted` | System dividers (`.msg-system`), captions, eyebrows, citation text. | System dividers move from `--teal-text` to `--muted` — see below |
| `--teal-text` | Focus-border colour only (inputs, functional a11y-adjacent convention). | No change |

**One explicit token change:** `.msg-system` (the phase-break divider, e.g. "— Phase 2 of 4 —") is `--teal-text` in the Why Workbook. In the diagnostic, set it to `--muted`. Reasoning: if plum is going to read as scarce and earned when it finally arrives at the Phase 4 reveal, it can't be competing with teal doing quiet decorative work at every phase break in between. Neutralising the divider colour costs nothing and protects the one colour moment that matters. (Flagged in Open Threads for confirmation since it's a departure from the shipped pattern, however small.)

### 1.2 Typography — same stack, narrower role list

Reuse the exact font stack and loading (`DM Serif Display:ital@0;1`, `Fraunces` variable, `Inter:wght@400;500;600`). Two roles are dropped for this touchpoint:

- **Patrick Hand — not used.** In the Why Workbook it carries informal instruction copy (`.vs-instruction`, `.vm-instruction`) — a hand-written, workshop-aside register. The diagnostic's register is "read accurately by someone who's done the job," closer to a report than a workshop handout. Replace every instance of Patrick Hand instruction copy with plain Inter body text (see `.dtd-instruction` in §2). This is the single biggest typographic departure from the Why Workbook and it's deliberate, not an oversight.
- **Allura — not used anywhere in this touchpoint, including Close.** The inspiration doc leaves this as "reserve for Close, if at all." My call: don't use it at all. The Profile reveal's own gesture — the `.mark-underline` stroke draw — is already this touchpoint's one hand-made moment. Adding a second hand-made flourish (the script signature) on the same screen dilutes both. One human gesture per touchpoint, not two. (Flagged in Open Threads — this is a real subtraction beyond what either upstream doc explicitly settled.)

Everything else — DM Serif Display for display/title moments, Fraunces italic for lede/evidence copy, Inter for all UI chrome — is unchanged and reused at the Why Workbook's existing sizes unless a spec below says otherwise.

### 1.3 Spacing, borders, elevation

No new spacing scale. Reuse the Why Workbook's numeric rhythm as-is: `8 / 12 / 14 / 16 / 20 / 24 / 28 / 36px` steps, `1px` borders in `--ink` or `--sand`, `--max: 640px` content column. Nothing in this touchpoint needs a new spacing token.

**Elevation: flatter than the Why Workbook.** Box-shadow is used in exactly one place in the shipped shell — `.support-panel`, a functional popover — and that's the only place it should appear here too. No shadows on chips, buttons, or the reveal card. This matches the pathology-report reference directly: "almost everything on the page is the same quiet weight, and that quietness is what makes the one bolded line register as loud." A shadow anywhere in the diagnostic body competes with that discipline.

### 1.4 Iconography — none

Zero iconographic elements anywhere in the diagnostic screens, Welcome through Close: no hand-drawn sketch icons, no vector icon set, no emoji, no decorative glyphs. The only symbols on screen are the shell's existing *functional* typographic marks — `→` in primary buttons, `↑` on the send button, `←` on the back button — which are UI affordances, not illustration, and stay. This is a direct instruction from the inspiration doc ("explicitly recommends against icon-as-mascot treatments") and it extends to the Welcome screen's brand panel — see §3.0.

### 1.5 Motion principles

Reuse what exists; add exactly one new gesture.

1. **`msgIn` (existing, reused as-is).** 0.2s ease, `translateY(6px) → 0`, opacity `0 → 1`. Used for every chat bubble already, and reused for the Profile reveal's evidence sentence + citation (see §2.4). Wrapped in the existing `@media (prefers-reduced-motion: no-preference)` guard — no new reduced-motion handling needed, just reuse the pattern.
2. **Stroke-draw (new, one instance in the whole product).** The `.mark-underline` path beneath the Profile tag draws on once, using the standard SVG line-draw technique (`stroke-dasharray`/`stroke-dashoffset` set to path length via `getTotalLength()`, animated to `0` over 600ms ease-out). Fires once, after the tag has faded in, never repeats, never used anywhere else on the touchpoint. Full spec in §2.4. Under `prefers-reduced-motion: reduce`, skip straight to the fully-drawn state (`stroke-dashoffset: 0`, no transition) — do not simply disable the whole gesture, since the stroke itself (not its animation) is part of the permanent design, not a decoration that can be dropped.
3. **No other motion.** No hover-lift, no bounce, no card-flip, no confetti, no auto-clearing overlays (the inspiration doc explicitly names the NFL Next Gen Stats "appears then clears" pattern as the thing to avoid — the reveal is a permanent artifact, not a graphic that times out). All interactive state changes (chip/button selection) are instant colour/border transitions at the Why Workbook's existing `0.12s` speed — consistent with "say it once, don't repeat it, no do-overs" from the boxing-corner/tailor pacing references.
4. **Typing dots (existing `dotpulse`).** Reused unchanged for the "Claude is thinking" state.

---

## 2. Component library

### 2.0 Reused unchanged (no new spec needed)

These ship exactly as they exist in `why-workshop-app-v2`: `.ww-header` / phase label / support panel / back button, `.msg-coach` / `.msg-user` / `.msg-typing` (chat bubbles), `.chat-input-area` / `#user-input` / `#btn-send` / continue bar, `.resume-banner`, `.name-field`, `.btn-primary`, `.ec-*` email capture, `.ec-success`. Builder: copy these blocks verbatim from `why-workshop-app-v2/index.html`'s `<style>` and reuse the corresponding JS render functions from `app.js` as the pattern to follow for new state.

One universal change across all of these: `.msg-system` colour is `--muted`, not `--teal-text` (§1.1).

### 2.1 NEW — Instruction line (`.dtd-instruction`)

Replaces `.vs-instruction` / `.vm-instruction`'s Patrick Hand treatment for every special-component instruction in this touchpoint (used above the lens scorer, the mindset chips, and the cause-attribution buttons).

```
.dtd-instruction {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  line-height: 1.55;
  color: var(--charcoal);
  margin: 0 0 20px;
}
```

No states — static copy.

**Shared `:active` (tap-down) state across all three new tap components (§2.2–2.4):** none of these are press-and-hold controls, but the moment between finger-down and the JS-driven `.selected` class committing needs its own tactile feedback, or a tap on a slow connection reads as unresponsive. All three share one rule: `:active { transform: scale(0.98); }`, 80ms, no easing curve change from the existing `0.12s` transition already on the element. This is feedback for the gesture, not a fourth colour state — it never introduces a new hue, just a momentary scale dip that resolves into either the hover or selected state within the same frame budget the shell already uses elsewhere (`0.12s` on `.value-chip`, `.vm-state-btn`). Builder: add this once, on the shared `.lens-state-btn` / `.mindset-chip` base rule, not per-component.

### 2.2 NEW — Lens Scorer (Phase 1b)

**What it is:** three items (Desirable / Viable / Feasible — the named project scored against each), each with a 3-button single-select state group. Structurally this is the Why Workbook's `.vm-item` / `.vm-state-btn` pattern reused almost verbatim — same box model, same sizing — with the state *language* and *colour logic* both changed on purpose.

**Proposed state language** (strategy doc flags this as unresolved — this is my specific proposed call, not a placeholder):

| State | Label | Description (small line under label) |
|---|---|---|
| 1 | **Present** | this lens genuinely shaped the work |
| 2 | **Thin** | technically covered, didn't drive decisions |
| 3 | **Skipped** | not really in the room |

Rationale: these describe *presence in the work*, not feeling — exactly what Design Principle 2 and the strategy doc's own framing call for ("Present/Thin/Skipped entirely" was the strategist's own draft; I'm confirming it rather than inventing new language, because it already does the job — it's specific, it's not a feelings-scale, and "Thin" in particular gives the participant a real third option between "yes" and "no" that the Why Workbook's `values_map` states don't have an equivalent for). Recommend one round of copy-testing against real project examples per the strategy doc's own flag — see Open Threads.

**Markup structure** (per lens item):

```
.lens-item { margin-bottom: 24px; }
.lens-name {
  font-family: 'DM Serif Display', serif;
  font-size: 22px;
  margin: 0 0 4px;
  letter-spacing: -0.01em;
}
.lens-name-desc {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: var(--muted);
  margin: 0 0 10px;
}
/* e.g. under "Desirable": "did the people who'd use this actually want it?" —
   content-writer's exact wording, but the slot and sizing are specified here */
.lens-states { display: flex; gap: 8px; flex-wrap: wrap; }
```

**States for `.lens-state-btn`** (structurally identical to `.vm-state-btn`: `padding: 10px 16px; min-height: 52px; display:flex; flex-direction:column; align-items:flex-start; gap:2px; text-align:left;`):

| State | Background | Border | Text colour |
|---|---|---|---|
| Default | `--paper` | `1px solid var(--sand)` | `--charcoal` |
| Hover (non-touch) | `--paper` (unchanged) | `1px solid var(--plum)` | `--charcoal` |
| Selected | `--plum` | `1px solid var(--plum)` | `--paper` |
| Selected — desc line | — | — | `--paper` at `opacity: 0.75` |
| Focus | add `outline: 2px solid var(--teal); outline-offset: 2px;` (unchanged functional a11y token — keep teal here, it's not a decorative accent) | | |
| Disabled | not used — always interactive | | |
| Error | not used at component level — "done" button below stays `disabled` (existing `.btn-primary:disabled` treatment, `opacity: 0.38`) until all 3 lenses have a state | | |

**Deliberate colour departure from `.vm-state-btn`:** the Why Workbook uses three *different* accent colours for its three states (teal/pink/sand). Here, all three states share one colour when selected (`--plum`) — the states are told apart by their label text, not by colour-coding, because (a) only one button per lens can be selected so colour disambiguation isn't load-bearing, and (b) three colours here would spend the "one accent, used once" discipline three phases before the Phase 4 reveal is meant to earn it. This directly answers the strategy doc's own open question (§5, second bullet) about how close a visual match to `vm-state-btn` is right: **structurally close (same shape, same shell), colour-logic distinct.** It reads as "the same app, new content" without reading as a literal reskin.

Footer button: `.btn-primary`, "I've scored the project →", disabled until all 3 lenses have a selected state (same `checkAllValuesMapped()`-style completeness check, ported).

### 2.3 NEW — Six Mindset Chips (Phase 2a, single-select)

**What it is:** 6 chips, exactly one selectable at a time — visually related to `.value-chip` but behaviourally a radio group, not the circle-then-star two-pass system. Do not reuse `[data-state="circled"]` / `[data-state="starred"]` — that visual language specifically signals "you can pick several, then narrow," which is the wrong affordance here (strategy doc is explicit: "single-select — not multi-select/star like the Why Workbook's values sort — this is one answer, not a top-3"). New class name to keep the semantics from bleeding across components:

```
.mindset-chip {
  padding: 9px 16px; min-height: 44px;
  border: 1px solid var(--sand); background: var(--paper);
  font-family: 'Inter'; font-size: 14px; color: var(--charcoal);
  cursor: pointer; user-select: none;
  transition: all 0.12s;
  display: inline-flex; align-items: center;
}
```

**States:**

| State | Background | Border | Text |
|---|---|---|---|
| Default | `--paper` | `1px solid var(--sand)` | `--charcoal` |
| Hover | `--paper` | `1px solid var(--plum)` | `--charcoal` |
| Selected (only one at a time) | `--plum` | `1px solid var(--plum)` | `--paper`, `font-weight: 600` |
| Focus | `outline: 2px solid var(--teal); outline-offset: 2px` | | |
| Disabled | not used | | |

No `★` prefix, no icon — plain text label only, per §1.4.

Layout: `display: flex; flex-wrap: wrap; gap: 8px;` — same container pattern as `.values-chips`, just 6 items instead of 45 and radio instead of multi-select-with-count. No `.vs-count` equivalent needed (binary selected/not, not a running tally) — footer is just the `.btn-primary` "Continue →", disabled until one chip is selected.

Instruction line above: `.dtd-instruction` (§2.1), explicitly asking which mindset is hardest to practise *in your organisation* — content-writer's exact copy, but per Design Principle 1 this instruction must reference the participant's own named project, not ask generically.

### 2.4 NEW — Cause Attribution (Phase 2b) — the load-bearing component

This is Design Principle 2's component: "could someone read `STATE.workbook` at the end of the session and see which of the three causes was named, without re-parsing the conversation?" Get this one right above all others.

**What it is:** appears *after* the chat probe, not instead of it (strategy doc is explicit: chat-probe-then-confirm, not chat-only). One question, three mutually-exclusive buttons:

| Option | Label | Description |
|---|---|---|
| 1 | **Skill gap** | a capability I haven't built yet |
| 2 | **Organisational constraint** | the system wouldn't let me use it |
| 3 | **Relationship gap** | I didn't have the sponsor I needed |

(Content-writer's call on final wording — these mirror the curriculum's own three-way distinction and the persona language already in the strategy doc, given here as a specific, buildable placeholder rather than a vague slot.)

**Markup/shape:** same `.lens-state-btn` shape and sizing as §2.2 (`padding: 10px 16px; min-height: 52px`, label + desc stacked), but laid out as a single unlabelled row (no lens-name heading above it — the chat probe that just happened *is* the framing) with more deliberate visual weight, since this is the single most consequential tap in the product:

```
.cause-attribution { margin: 24px 0; }
.cause-divider {
  /* reuses .msg-system's exact treatment: centered, tracked, --muted,
     border-top sand — signals "this is a considered decision point,"
     not just another chat message */
  text-align: center;
  font-family: 'Inter'; font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--muted);
  padding: 14px 0 10px;
  border-top: 1px solid var(--sand);
  margin: 8px 0 20px;
}
/* copy: "— Naming the cause —" or content-writer's equivalent */
.cause-options {
  display: flex; flex-direction: column; gap: 8px;
}
@media (min-width: 560px) {
  .cause-options { flex-direction: row; }
  .cause-options .lens-state-btn { flex: 1; }
}
```

Mobile: stacked full-width (not wrapped inline like the mindset chips) — this decision deserves its own line each, not a shared row fighting for width. Desktop (≥560px): three columns.

**States:** identical table to §2.2's `.lens-state-btn` (default sand border / hover plum border / selected plum fill / focus teal outline). Same colour-logic reasoning applies, doubly so here — this is exactly the moment the inspiration doc warns against colour-coding by cause ("a colour-coded result category is a half-step back toward 'type'"). One accent, applied uniformly regardless of which cause is picked, keeps that discipline intact right at its most tempting point.

**Data contract note for the builder:** selecting an option must write an explicit value to state — e.g. `STATE.workbook.cause_attribution = 'skill' | 'organisational' | 'relationship'` — set on click, not inferred later from the transcript. This is the literal implementation of Design Principle 2's test. Confirm button: `.btn-primary`, disabled until one option is selected.

### 2.5 NEW — Profile Reveal Card (Close screen)

This replaces `.why-card` for this touchpoint. **Do not reuse the Why Workbook's boxed, plum-filled `.why-card` container** — that's a deliberate, explicit departure, not an oversight. The inspiration doc's direct instruction: *"Do not give it a background fill, a border-radius, or a container shape — no card, no pill, no icon... the verdict should look like the one thing on the page that is not a UI control."* A filled box would visually tell the participant "this is one of several possible results," which is precisely the personality-quiz reading Design Principle 4 rejects.

**Structure, top to bottom, exactly as the inspiration doc's Section 4 specifies** (report architecture: quiet evidence first, loud verdict second):

```
.profile-reveal { margin-bottom: 40px; }

.pr-eyebrow {
  font-family: 'Inter'; font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--muted); margin: 0 0 18px; display: block;
}
/* copy: "Design Influence Profile" */

.pr-evidence {
  font-family: 'Fraunces', serif; font-style: italic;
  font-size: clamp(19px, 3vw, 22px); line-height: 1.5;
  color: var(--charcoal);
  font-variation-settings: "SOFT" 50, "opsz" 144;
  margin: 0 0 8px;
}
/* the full diagnostic sentence — content-writer's copy, must cite the
   participant's own named project per Design Principle 1 */

.pr-citation {
  font-family: 'Inter'; font-style: italic; font-size: 13px;
  color: var(--muted); margin: 0 0 32px;
}
/* one quoted fragment in the participant's own words, e.g.:
   — "the checkout redesign, three weeks before launch." */

.pr-rule {
  border: none; border-top: 1px solid var(--ink);
  margin: 0 0 32px;
}

.pr-tag {
  font-family: 'DM Serif Display', serif; font-style: italic;
  font-size: clamp(36px, 7vw, 60px); line-height: 1.05; letter-spacing: -0.01em;
  color: var(--plum);
  margin: 0 0 40px;
}
/* the named pattern, e.g. "The Isolated Operator" — set as a diagnostic
   noun phrase per the inspiration doc's Section 4, point 2: chart-entry
   register, not BuzzFeed-archetype register. Wrapped in .mark-underline.mark-plum
   (see below), applied to the full tag phrase, once. */

.pr-rule--bottom {
  border: none; border-top: 1px solid var(--ink);
  margin: 0 0 40px;
}

.pr-credit {
  font-family: 'Inter'; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--muted); opacity: 0.55; margin: 0;
}
/* "Frankly Human · Design Influence Diagnostic" — mirrors .wc-credit's role */
```

**Sizing note on `.pr-tag`:** the inspiration doc asks for something "closer to `.ww-title` than to any chip/pill/card" — `.ww-title` is `clamp(52px, 14vw, 96px)`. I've specified `clamp(36px, 7vw, 60px)` instead, one register down. Reasoning: `.ww-title` is calibrated for a two-to-four-word brand lockup ("The Why Workbook"); a diagnostic tag in the register the inspiration doc itself recommends ("The Isolated Operator," "The Underpowered Craftsperson") runs three to four words *of body text*, and at true `.ww-title` scale on mobile that wraps awkwardly across 3+ lines and starts to read as a banner rather than a considered verdict. `clamp(36px, 7vw, 60px)` is deliberately closer to the Bloomberg editorial-headline reference the inspiration doc itself preferred over the NFL-broadcast reference — large enough to unmistakably dominate the screen (it will be 2–3× the size of anything else on Close), restrained enough not to tip into marketing-banner territory. Flagged in Open Threads for a taste-check regardless, since the inspiration doc named this exact tension as unresolved.

**The underline stroke — exact spec:**

Reuses the `.mark-underline` primitive from `style-guides/Visual Style Guide.html` verbatim (CSS already defined there — do not redefine):

```
.mark-underline, .mark-plum {
  /* from Visual Style Guide.html, reused as-is: */
  position: relative; display: inline-block;
}
.mark-underline svg {
  position: absolute; left: -6%; right: -6%; width: 112%;
  bottom: -10px; height: 18px;
  pointer-events: none; overflow: visible;
}
.mark-underline svg path {
  fill: none; stroke-width: 4; stroke-linecap: round; stroke-linejoin: round;
}
.mark-plum svg path { stroke: var(--plum); }
```

Markup:

```html
<p class="pr-tag">
  <span class="mark-underline mark-plum" id="pr-tag-mark">
    The Isolated Operator
    <svg viewBox="0 0 300 20" preserveAspectRatio="none" aria-hidden="true">
      <path d="M4,10 Q80,3 150,9 T296,8" />
    </svg>
  </span>
</p>
```

The path above is a placeholder geometry (a single gentle hand-drawn-feeling curve, not straight) — flagged in Open Threads for the motion designer to confirm or replace with a matching asset from the existing sketch-mark library, if one exists closer to the tailor's-chalk reference than a placeholder Bezier curve.

**Reveal sequencing (ties §1.5's motion spec to this component specifically):**

| Beat | Timing | What happens |
|---|---|---|
| 1 | 0ms | `.pr-eyebrow` present immediately (static, no animation — it's a label, not part of the reveal) |
| 2 | 0–200ms | `.pr-evidence` fades in via `msgIn` (reused, unchanged) |
| 3 | 100–300ms | `.pr-citation` fades in via `msgIn`, ~100ms stagger after evidence |
| 4 | 300–600ms | **Pause.** No motion. This is the "beat of quiet before the coach speaks" from the Friday Night Lights reference — do not compress this. |
| 5 | 600–900ms | `.pr-tag` fades in (opacity `0 → 1`, 300ms ease — reuse `msgIn`'s easing curve, not a new one) |
| 6 | 900–1500ms | `.mark-underline` stroke draws once (`stroke-dashoffset` animated to `0`, 600ms ease-out) |
| — | after 1500ms | Card is static. No looping, no re-trigger on scroll-into-view a second time. |

Under `prefers-reduced-motion: reduce`: skip all timing — render the full card instantly with the stroke already fully drawn (`stroke-dashoffset: 0`). Do not remove the stroke itself; only remove its animation.

---

## 3. Design specs — screen by screen

Reuse the shipped shell's screen-level CSS (`.screen`, `#screen-welcome`, `#screen-workshop`, `#screen-close`, `.app-shell` split-panel behaviour, mobile brand-panel-collapse rule) verbatim. What follows are the deltas per screen/phase.

### 3.0 Welcome

Reuse `.welcome-inner`, `.ww-eyebrow`, `.ww-title`, `.ww-lede`, `.name-field`, `.btn-primary`, `.ww-note`, `.resume-banner` exactly as specced in the Why Workbook, with new copy (content-writer) and a new `localStorage` key (`dtd_session_v1`, proposed — see Open Threads).

**Brand panel (desktop left column) — the one deliberate subtraction beyond what either upstream doc explicitly asked for:** drop the `.fanned-deck` illustration entirely. Do not replace it with a new illustrated device. Keep `.brand-panel`'s structural shell (radial-gradient backdrop, `.brand-panel-inner`, responsive collapse-on-mobile behaviour) but let the panel be `.bp-eyebrow` (swap Allura for the shell's own `.ww-eyebrow` Inter treatment — no script font, per §1.2) + `.bp-title` (DM Serif Display, same `clamp(40px, 5vw, 72px)` sizing, lowercase, e.g. "design influence,<br>in one <em>sitting.</em>") + `.bp-lede` (Fraunces, signalling the 20–30 minute, commercial, contained framing per the strategy doc's Welcome guidance) — then generous paper whitespace where the deck used to sit. This follows the Visual Style Guide's own "plenty of paper... breath, not brand fill" principle literally, and matches the inspiration scout's closing note that "the job was subtraction... more than addition." Flagged in Open Threads since it's a bigger cut than either upstream doc explicitly signed off on — worth a taste-check before build, not after.

Copy must avoid any values-workshop framing per the strategy doc — content-writer's job, but the layout has no slot that implies otherwise.

### 3.1 Phase 0 — Reframe

Chat only. No new component. `.msg-system` divider reads "— Reframe —" (or equivalent), styled per §1.1's `--muted` change. Coach message delivers the Meridian Bank story (or structural cousin) in the standard `.msg-coach-inner` treatment — unchanged (18px Inter, `--paper-2` background, `--sand` border, `--teal` left border-stripe retained per §1.1).

### 3.2 Phase 1a — Three Lenses

Chat only. No new component. Claude anchors the named project here; per Design Principle 1, every subsequent phase's chat copy and every special-component instruction line must reference it. No visual implication needed beyond what the chat already carries — this is a content/prompt concern, not a layout one.

### 3.3 Phase 1b — Lens scorer

Full component spec: §2.2. Layout: `.special-component` container (reused, `max-width: var(--max)`, same padding as the Why Workbook's), containing `.dtd-instruction` then three `.lens-item` blocks then the `.btn-primary` completion button. Scrolls into view on entry via the same `scrollIntoView({behavior:'smooth', block:'start'})` pattern as `enterPhase2c`'s values-map.

### 3.4 Phase 1c — Skip attribution

Chat only. No new component. First-pass signal only per the strategy doc — the full 3-way distinction is Phase 2b's job, not this phase's. Don't add a tap component here even though it might feel underspecified next to 1b and 2b either side of it — that asymmetry is intentional per the strategy doc's IA table.

### 3.5 Phase 2a — Six Mindsets

Full component spec: §2.3. Layout: `.special-component` container, `.dtd-instruction`, `.mindset-chip` group (`flex-wrap`), `.btn-primary` "Continue →" footer, disabled until one chip selected.

### 3.6 Phase 2b — Cause attribution

Full component spec: §2.4. This phase is chat-probe-first (standard `.msg-coach`/`.msg-user` exchange, `#user-input` visible) — the `.cause-attribution` component only mounts after the probe concludes, similar to how `enterPhase2b` in the shipped app calls the API first and only reveals UI in the completion callback. Once mounted, hide the text input row (`hideInputRow()`) the same way `enterPhase2c` does when the values-map takes over — the cause selection is confirmed by tap, not typed.

### 3.7 Phase 3 — Where Influence Breaks Down

Chat only, deliberately. **No special-component div, no continue-bar decoration beyond the standard bar, no new UI at all.** Per Design Principle 6 and the strategy doc's explicit note, this is the phase most likely to trigger the defensiveness/distress guardrails — "keep the interaction unencumbered by UI chrome so Claude's guardrail copy can carry full weight." Four sequential questions arrive as individual `.msg-coach` messages exactly like Phase 1a/1c's pattern. If a future round proposes adding visual structure here (a progress dots row, a "question 2 of 4" counter), that's a violation of this phase's spec — flag it back to design-lead, don't build it.

### 3.8 Phase 4 — Design Influence Profile

No standalone screen UI — this phase assembles the result (naming the pattern, drawing the line to the relevant Design-Led module, the next-right-question) and then calls `transitionTo('close')`. All visual weight for this phase's output lives in the Close screen's Profile Reveal Card (§2.5), not in Phase 4 itself. Do not add intermediate "generating your profile..." chrome beyond the existing `.msg-typing` dots — no progress bar, no loading illustration.

### 3.9 Close

Order, top to bottom (per Design Principle 3 — profile outranks funnel):

1. `.profile-reveal` (§2.5) — largest, first, most typographically dominant. In a screenshot, the eye should land on `.pr-tag` before anything else on the screen.
2. `.d2m-bridge` — reused from the Why Workbook essentially unchanged (`.d2m-bridge-eyebrow`, `.d2m-bridge-text`, `.d2m-bridge-cta`, `.d2m-bridge-secondary`), pointed at the specific Design-Led: Practitioner module the participant's gap maps to (per the strategy doc, not always the same module). No visual changes needed — it's already correctly subordinate in scale to any reasonable `.pr-tag` size.
3. `.ec-*` email capture — reused unchanged. Copy adjusts ("I'll send you this profile as a PDF to keep" or equivalent) — content-writer's job, no layout change.
4. `.ec-success` — reused unchanged.

`.close-inner` container reused unchanged (`max-width: var(--max)`).

---

## 4. Open threads log

Named per the strategy doc's own flags plus calls I made that go beyond what either upstream doc explicitly settled. Each has my position stated — none of these should silently ship as "the design-lead's problem now."

1. **Allura omitted entirely, not just reserved for Close.** The inspiration doc left this as "if used at all, Close only." My call: cut it everywhere in this touchpoint — the underline-stroke gesture is this product's one hand-made moment, and I don't want two. **Recommendation: confirm at Taste Check.** If overruled, the only acceptable slot is a single small `.bp-eyebrow`-style line on Close, never mid-diagnostic.

2. **Phase 1b state language — "Present / Thin / Skipped."** Confirmed as my proposed call per the strategy doc's own flag that this needs a design pass. **Recommendation: one round of copy-testing against 2–3 real project examples before build**, per the strategy doc's own suggestion — "Thin" in particular is worth stress-testing since it's the one state without a clean precedent elsewhere in the shell.

3. **Visual closeness of the new tap components to `.vm-state-btn`.** Strategy doc named this explicitly as a design-lead call (§5, second bullet). My call: structurally near-identical (same shape, sizing, label+description layout — reads as "the same app"), colour-logic deliberately distinct (one accent, not three) — reasoning in §2.2. **Recommendation: confirm at Taste Check**, specifically on the question "does the shared shape read as reassuring continuity, or does the missing three-colour system read as a downgrade?"

4. **Profile tag size — `clamp(36px, 7vw, 60px)`, editorial register over broadcast register.** The inspiration doc flagged real tension between its Bloomberg reference (editorial, restrained) and its NFL Next Gen Stats reference (broadcast-graphic, more aggressive), and asked for a second opinion. I leaned Bloomberg, per the inspiration scout's own stated preference. **Recommendation: this is the single highest-value thing to put in front of the Creative Director as an actual rendered mockup before build** — "is this weight right, or bolder/lighter?" is a real question here, not a rhetorical one.

5. **Welcome brand panel — dropped the fanned-deck illustration with no replacement device.** Neither upstream doc explicitly asked for this; it's my extrapolation of "subtraction over addition" applied one screen further than the diagnostic phases themselves. **Recommendation: confirm before build** — risk is it reads as under-designed/placeholder rather than intentionally restrained, especially against the Why Workbook's fuller Welcome screen sitting one click away in the product family.

6. **`.msg-system` colour changed from `--teal-text` to `--muted`.** Small, but it's a literal token change from the shipped Why Workbook pattern. Reasoning in §1.1 (protect plum's scarcity). **Recommendation: low-stakes, approve by default**, flag only if someone wants system dividers to carry brand colour consistently across both products.

7. **`.mark-underline` stroke path is placeholder geometry.** I've specified a functional path (`M4,10 Q80,3 150,9 T296,8`) that satisfies the primitive's contract but isn't a designed asset. **Recommendation: motion designer to confirm or supply a hand-drawn-feeling replacement** closer to the tailor's-chalk reference before this ships — the current path is buildable but not art-directed.

8. **Data contract for the Profile card's quoted citation.** §2.5 specifies that `.pr-citation` must quote the participant's own words from Phase 1a or Phase 3, but which exact turn supplies it and how it's captured into `STATE.workbook` isn't resolved here — that's a content/build-logic question, not a visual one. **Recommendation: content-writer and design-builder agree the exact field (e.g. `STATE.workbook.evidence_quote`) and selection logic before Phase 4's prompt is finalised**, since the visual design assumes this data will reliably exist and be short enough to fit one line at 13px.

9. **New `localStorage` key `dtd_session_v1`, proposed not confirmed.** Trivial, but worth a single line of sign-off so it doesn't collide with any other in-flight diagnostic-family product using a similar key.

---

## 5. Handoff note to the design-builder

Read the Why Workbook's `index.html` and `app.js` before touching this spec — almost everything here is phrased as a delta against that file, and the delta only makes sense if you've seen the baseline. Three things I'd want front-of-mind going in:

First, **the Profile card is not a new `.why-card` with a new colour.** It's a structurally different object — no box, no fill, no border-radius — built to look like the one thing on the Close screen that isn't a UI control. If you find yourself reaching for a `border` and `background` on `.profile-reveal`, stop; that's the exact "badge architecture" the inspiration doc names as the failure mode.

Second, **the three new tap components (§2.2–2.4) all share one colour rule on purpose**: selected = plum, always, regardless of which of the 2–3 options was picked. If a future iteration proposes colour-coding the cause-attribution buttons by which cause they represent, that's not a small tweak — it's undoing Design Principle 4 and the inspiration doc's explicit warning against it. Push back and bring it to design-lead rather than just building it.

Third, **Phase 3 gets nothing.** No progress indicator, no chrome, no special component. If it looks underbuilt next to Phase 1b and 2b on either side of it in a review, that's correct — re-read §3.7 before "fixing" it.

Open threads in §4 are ordered roughly by how much they'll cost to change late — items 1–4 affect the Close screen's visual peak and are worth resolving before you build it; items 5–9 can be resolved in parallel with early build work.
