# Design Leadership Diagnostic — Design Spec

Prepared by: Design Lead (DL)
For: Design Builder, ahead of implementation. Cc Motion Designer, Content Writer, Creative Director.
Inputs: `Design Leadership Diagnostic — 02 Strategy.md` (design-strategist — IA, personas, 7 design principles), `Design Leadership Diagnostic — 03 Inspiration.md` (inspiration-scout — Editorial-register aesthetic direction, the deposition-transcript/Paris Review/Zumthor/Rams reference set), `Design Leadership Diagnostic — 04 Content Copy.md` (content-writer — full copy deck, already drafted, incorporated by reference below rather than reproduced), `Design Leadership Diagnostic — 04 Motion Spec.md` (motion-designer — full interaction/timing spec, incorporated by reference), `style-guides/Content & Voice Guide.html` (Editorial register's live token values and component precedents), `why-workshop-app-v2/index.html` + `app.js` (the shipped interaction shell this touchpoint inherits architecturally).

**Taste-profile note:** no formal Creative Director taste profile exists for this project yet — same gap the inspiration-scout and motion-designer both flagged. I've treated the Content & Voice Guide's own Editorial-register component precedents (the `register-card`, `mood-*`, `comp-card` examples already built in that file) as the taste anchor, since they're the closest thing to a Creative-Director-approved execution of this exact register that exists on disk. Every call I made beyond what the upstream docs settled is named in Section 4 with my position stated.

One instruction from this brief overrides a recommendation in the Inspiration doc and is treated as settled, not re-litigated anywhere below: **coloured message-turn differentiation between Claude and the participant is kept.** Section 2.1 is my specific answer for how that's done inside Editorial's restraint rather than against it.

---

## 0. What this build is, in one paragraph

A four-screen flow (Welcome → Intake → Diagnostic chat → Close) built on the Why Workbook v2's exact interaction shell — phase state machine, chat-log-plus-embedded-special-component pattern, session persistence, the `d2m-bridge` handoff pattern — with a completely new visual skin: Archivo / JetBrains Mono / Inter instead of DM Serif Display / Fraunces / Patrick Hand / Allura, and ink / paper / ember / cobalt / lime instead of ink / paper / teal / pink / yellow / plum. Nothing skeuomorphic survives the swap: no filled message bubbles, no card-shadow, no rounded corners anywhere. The single hardest design problem — how two speakers stay visually distinct across a 20–30 minute chat without a coloured bubble — is solved with a hairline rule, not a fill (Section 2.1). The single hardest restraint problem — how a chat log this long avoids feeling monotone without diluting the "one accent, rarely spent" discipline — is solved by splitting the accent economy in two: cobalt is spent constantly, because it marks *structure* (who's speaking, where a phase begins, where the exits are); ember is spent four times in the whole session, because it marks *cost* (Section 1.1 has the full ledger). This is not a reskin of the Why Workbook. It's the same architecture wearing a completely different, and considerably quieter, set of clothes.

---

## 1. Visual design system

### 1.1 Palette — exact tokens, and the accent ledger

```css
:root {
  --ink:        #111111;
  --paper:      #FAFAF7;
  --soft-white: #FAF7F2;
  --charcoal:   #2A2724;
  --muted:      #6B6B66;
  --ember:      #E8503A;
  --cobalt:     #1F44E8;
  --lime:       #C8F23A;
  --max:        640px;
}
```

Pulled verbatim from `style-guides/Content & Voice Guide.html`'s `:root` — no new colour values invented for this touchpoint. `--soft-white` is Editorial's second neutral (slightly warmer than `--paper`) and is reserved for exactly one job here: the Welcome screen's brand/hero backdrop, so it never competes with the chat log's flat `--paper`. Everywhere in the diagnostic itself (Intake, chat, Close) is `--paper` straight.

**The three-tier accent discipline, stated as a rule before the ledger:**

1. **Ink / paper / soft-white / charcoal / muted** are structural neutrals — text, hairline rules, surfaces. Spend these freely; they carry no meaning beyond legibility.
2. **Cobalt is the architecture colour.** It is spent constantly, on purpose, because its entire job is to mark *where you are in the structure* — which speaker, which phase, which exit. A participant should be able to say, without reading a word, "cobalt means scaffolding" by minute five. This is not a violation of the Inspiration doc's accent-economy rule — that rule was written specifically about content-colour dilution ("if ember starts appearing on every Claude message, the register has been diluted"). Cobalt is never applied to content. It never colours a sentence, a fact, or an insight. It only ever marks a boundary or a control. That distinction is the whole design.
3. **Ember is the cost colour**, and its budget is genuinely scarce — four uses in the entire product, named below, none of them negotiable up. **Lime is spent exactly once**, on one word, in Phase 4.

**The ember ledger — every single use, named, so nothing "just feels right" at build time:**

| # | Where | What | Why this qualifies as "something true and costly said out loud" |
|---|---|---|---|
| 1 | Welcome screen, reassurance line | The figure **$500** | The first costly fact in the whole product is literally a cost. Precision-not-softening (Principle 6) made concrete: the number gets the colour that means "this is real," not a footnote treatment. |
| 2 | Phase 2, Claude's line after trap selection | The named trap (e.g. **the Silent Expert**) | The moment the pattern gets a name for the first time — the curriculum's own "here's what I see" beat, one phase early. |
| 3 | Phase 4 opening synthesis, "why this, specifically" line | The quoted fragment of the participant's own words (per Content Copy §5.1's dynamic template) | This is the exact "tie the cost back to what they actually said" moment the build notes named as the sharpest lesson available — ember marks *their own words*, not a generic label. |
| 4 | Close screen, Profile Reveal | The profile sentence itself (Section 2.5) | The reveal. The single most-spent gesture in the product, and it only works because nothing before it has spent this colour on content. |

That's the whole ledger. If a build pass finds ember anywhere else — a hover state, a form error, a chip fill — that's a bug, not a stylistic choice, and should be flagged back to design-lead before shipping, per the Inspiration doc's own pre-emptive warning about exactly this failure mode.

**Lime — single use:** one word inside the Phase 4 profile sentence (Section 2.5), using the Content & Voice Guide's existing `.section-lede em` treatment (`background: var(--lime); padding: 2px 8px;`) reused verbatim, no new mark invented. Nowhere else in the product — not the chat, not Intake, not a button, not a hover state.

**Archivo — the display-weight ledger, same discipline applied to type:** the Inspiration doc asks for Archivo doing "the work of a governing-thought headline only three or four times in thirty minutes." Concretely:

| # | Where | Copy (per Content Copy doc) |
|---|---|---|
| 1 | Welcome H1 | "Why does the room keep closing without you in it?" |
| 2 | Intake H1 | "What this is — and isn't" |
| 3 | Close screen, Profile Reveal sentence | The dynamic profile sentence (e.g. "You've built the credibility. You haven't been given the room.") |

Three uses, not four — I didn't find a fourth moment that earns it without inflating the count for its own sake, and the Inspiration doc explicitly allows "three or four." Everything else in the product — phase headers, chat body, button labels, the Intake is/is-not list, the trap cards, the thread scorer — is Inter or JetBrains Mono. If the Creative Director wants a fourth moment, my candidate would be the Design-Led: Leader bridge headline on Close, but I'd only add it after seeing the three-use version built — see Open Threads §4.1.

### 1.2 Typography

```css
--font-display: 'Archivo', sans-serif;   /* weight 800, font-stretch 110%, letter-spacing -0.02em, line-height 0.96 — reused verbatim from .display in the style guide */
--font-mono:    'JetBrains Mono', monospace; /* labels, eyebrows, phase headers, speaker labels — letter-spacing 0.04–0.22em depending on size */
--font-body:    'Inter', sans-serif;     /* all body copy, all UI chrome, both speakers' chat text */
```

No Caveat (Editorial's hand-written accent face, used elsewhere in the brand system for a single warm note) anywhere in this touchpoint. This is a deliberate cut, consistent with the Design Thinking Diagnostic's precedent of dropping Patrick Hand/Allura: a hand-drawn mark reads as *reassurance*, and Persona 1 doesn't want reassurance, she wants to be read accurately. Flagged in Open Threads §4.2 since neither upstream doc explicitly ruled Caveat out — I'm ruling it out here.

**One deliberate departure from the Paris Review reference that's worth stating plainly:** the inspiration doc's ideal is "one face, one size, one weight of body text for its entire length." I've held that for *body copy* — both speakers' chat text is Inter, 17px, line-height 1.6, identical weight, identical size (Section 2.1) — but I have not extended it to eyebrows/labels, which stay JetBrains Mono, or to the three Archivo headline moments. The Paris Review's own interviews still use a mono-ish small-caps label for the speaker turn ("INTERVIEWER" / surname) that's typographically distinct from the body — that's the convention I'm actually matching, not literal one-face-throughout.

**Type scale:**

| Role | Face | Size | Weight | Tracking |
|---|---|---|---|---|
| Display (3 uses only, §1.1) | Archivo | `clamp(32px, 6vw, 56px)` | 800 | -0.02em |
| Eyebrow / mono label | JetBrains Mono | 11–13px | 400–500 | 0.18–0.22em, uppercase |
| Phase header | JetBrains Mono | 11px | 500 | 0.1em, uppercase |
| Chat body (both speakers) | Inter | 17px | 400 | normal |
| Lede / Intake body | Inter | 17–18px | 400 | normal |
| Button label | Inter | 12px | 600 | 0.14–0.16em, uppercase |
| Caption / credit line | JetBrains Mono | 10–11px | 400 | 0.16–0.22em, uppercase |

### 1.3 Spacing, borders, elevation

Numeric rhythm: `8 / 12 / 16 / 24 / 32 / 48 / 64 / 96px`. Editorial's magazine-native proportions run more generous than the Why Workbook's tighter workshop rhythm — more whitespace between sections, per the Berkshire Hathaway restraint reference (a document with nothing to prove doesn't need to fill space).

**Zero shadows, zero gradients, zero border-radius, anywhere, on any element in this product — including the new special components.** This is the single most-repeated non-negotiable across every component below, so it's stated once here at full strength: no `box-shadow`, no `linear-gradient`/`radial-gradient` fills, no `border-radius` above `0`. The one functional exception, carried over from the Why Workbook unchanged, is a popover-style panel if one is needed for this touchpoint's equivalent of the support panel — box-shadow there is a functional depth cue for a floating element with a real z-index stacking problem, not decoration, and it should stay the only place in the whole product a shadow appears.

**What replaces shadow as the depth/hierarchy cue, made explicit (the task brief asks for this directly):**

1. **Rule weight.** 1px hairline = a boundary that separates without asserting hierarchy (Intake's is/is-not list dividers, the thread-scorer card borders). 2px = a boundary that means something operationally (the Claude speaker-turn rule, phase-transition dividers, the profile card's top/bottom rules). There is no 3px+ rule anywhere in this system — if something needs more visual weight than 2px communicates, the answer is size or colour, never a heavier line.
2. **Fill vs. no-fill as the selection signal**, not elevation. A thread-scorer button or trap card at rest has zero fill (transparent, bordered only); selected, it fills solid cobalt. The "lift" a shadow would normally communicate on hover is replaced entirely by this binary — flat/unfilled reads as "available," filled reads as "chosen." Nothing lifts, tilts, or scales.
3. **Whitespace as separation.** Between phases, between screens, between the profile card's evidence-then-verdict sections — generous padding does the job a card boundary or drop-shadow would otherwise do. The profile reveal (Section 2.5) is the clearest test of this: it has to read as the most important thing on the Close screen with *zero* container around it at all, purely through scale, colour-spend, and the whitespace holding it apart from everything else.

### 1.4 Iconography

None. Zero icons, zero illustrations, zero emoji, anywhere in this touchpoint — Welcome through Close. The only non-text marks on screen are functional typographic ones already in the shell's vocabulary: `→` on primary CTAs, `↑` on send. This is a harder cut than the Why Workbook (which has the fanned-deck illustration and hand-drawn value icons) and a harder cut even than the Design Thinking Diagnostic sibling's already-icon-free approach, because this product doesn't even get a brand-panel illustration — see Section 3.0.

### 1.5 Motion

Fully specified in `Design Leadership Diagnostic — 04 Motion Spec.md` — not reproduced here. Two points of integration worth flagging explicitly since they gate component decisions below:

- The motion spec's Section 3.2 makes the coloured speaker-turn's colour a *static rest-state property, present from frame one* — never animated in separately from the message's ordinary `msgIn` entrance. Section 2.1 below is built to that constraint exactly: the cobalt rule has no draw-on animation, no fade-in-after-text, nothing. It's just there.
- The motion spec's Section 4 (the reveal) assumes the Profile Reveal Card (Section 2.5) has no container to animate *into* — no box scaling up, no card flipping. That assumption is correct against this spec: the card is unboxed (Section 2.5's opening line), so the reveal motion is purely a two-property fade-and-settle on flat elements, exactly as motion-designer specified.

---

## 2. Component library

### 2.1 The chat message / speaker-turn component — the load-bearing decision in this brief

**The brief, restated:** the Creative Director has already decided coloured differentiation stays. The job is finding the Editorial-appropriate mechanism — not a filled bubble, not the Why Workbook's soft-pastel treatment, and per the Inspiration doc's own steer, ideally closer to a hairline rule than a shape.

**The solution: an asymmetric hairline rule, cobalt for Claude, ink for the participant, on a completely flat, unfilled background. No bubble, no card, no radius, no shadow, on either speaker.**

```css
/* Shared base — both speakers */
.dl-msg { max-width: none; } /* no bubble-width constraint on Claude's side */
.dl-msg p { font-family: 'Inter'; font-size: 17px; line-height: 1.6; margin: 0 0 12px; }
.dl-msg p:last-child { margin: 0; }
.dl-msg-label {
  font-family: 'JetBrains Mono'; font-size: 11px; letter-spacing: 0.18em;
  text-transform: uppercase; color: var(--muted); margin: 0 0 8px; display: block;
}

/* Claude turn */
.dl-msg-claude { align-self: stretch; }
.dl-msg-claude-inner {
  background: transparent; border: none;
  border-left: 2px solid var(--cobalt);
  padding: 2px 0 2px 20px;
}
.dl-msg-claude-inner p { color: var(--ink); }
.dl-msg-claude-inner em.dl-ember {
  font-style: normal; color: var(--ember); font-weight: 600;
} /* the only place ember appears inside chat copy — Section 1.1's ledger items #2 and #3 */

/* Participant turn */
.dl-msg-user { align-self: flex-end; max-width: 78%; }
.dl-msg-user-inner {
  background: transparent; border: none;
  border-right: 2px solid var(--ink);
  padding: 2px 20px 2px 0; text-align: right;
}
.dl-msg-user-inner p { color: var(--charcoal); }
.dl-msg-user .dl-msg-label { text-align: right; }
```

**Why cobalt-on-Claude does not violate the accent-economy rule, stated directly because it's the single most likely point of disagreement in this whole document:** the Inspiration doc's warning is about *content* colour — "ember appearing on every Claude message just to make the interface feel alive" is the failure mode it names, and that's a warning about spending a *meaning-bearing* colour as decoration. The cobalt rule here carries zero content meaning. It never changes, never reacts to what's said, never intensifies or varies. Its entire and only job is identical to the Q./A. label in a deposition transcript: it tells you whose turn it is, nothing more, every single time, with total consistency. That consistency is the point — a structural marker that changed meaning or intensity partway through would be worse, not better, because it would imply the structure itself was unstable. Precedent for exactly this reasoning already exists in the product family: the Design Thinking Diagnostic's design-lead kept `--teal` as "structural chat chrome... a functional, uniform marker every coach message shares identically... not decoration in rotation, it's the one piece of shell furniture." This is the same move, with cobalt standing in for teal and Editorial's discipline making the rule thinner and unfilled instead of a padded bubble stripe.

**Why the participant gets ink, not a second accent:** giving the participant's turn its own accent colour would mean two colours competing for "structural" status, which dilutes the very legibility the rule exists to create, and it would use up visual distinctiveness this touchpoint doesn't need to spend — the participant's turn is already fully differentiated by right-alignment, the mono label, and the mirrored rule position (right edge, not left). Ink is a neutral, not an accent; using it here costs nothing from the ledger.

**States:**

| State | Claude | Participant |
|---|---|---|
| Default (only state — no interaction happens on a message itself) | Cobalt 2px left rule, ink text, transparent ground | Ink 2px right rule, charcoal text, transparent ground, right-aligned |
| Distress/error message (system-level, not a message state) | Uses the same `.dl-msg-claude` shell — no visual escalation, no red flash, no icon. The guardrail copy (Content Copy §3.6) carries the weight; the container stays identical to every other Claude turn. This is deliberate: a visually alarmed error state would contradict the Errol Morris "don't visually rescue or dramatise" reference that governs Phase 3 specifically, and there's no principled reason to relax that rule only for the guardrail path. |

**Non-negotiables:** no background fill on either speaker, ever. No border-radius. No box-shadow. No avatar, no icon next to the label. No message-level hover state (messages are not interactive elements; only buttons and form controls get hover treatment). Ember inside a Claude message is permitted *only* for the two exact ledger items in Section 1.1 (#2 trap name, #3 quoted fragment) — it is not a general-purpose "important word" emphasis device, and the builder should not extend it to bold key phrases at will.

**System/phase divider** (reused shell pattern, `.msg-system` equivalent, recoloured): centered, mono, tracked, `border-top: 1px solid var(--cobalt)` (was `--sand` in the Why Workbook — cobalt here because a phase boundary is exactly the kind of structural moment cobalt exists for), text colour `--muted`. Copy per Content Copy's phase-header pattern (`Phase {n} of 4 · {Phase name}`), rendered by the existing `updatePhaseLabel()`/`addSystemMessage()` functions with the colour token swapped.

### 2.2 Intake / paywall screen (new — full component, no Why Workbook equivalent)

**Function, restated from the strategy doc:** convert "I clicked a link" into "I paid and I'm ready." This is where the product visibly signals it takes $500 seriously — not a Stripe-redirect afterthought.

**Layout, top to bottom:**

```
[eyebrow — mono]           Before you start
[H1 — Archivo, display #2] What this is — and isn't
[body — Inter, 17px]       (the "is" paragraph, Content Copy §2)
[is/is-not list]           flat, Q./A.-adjacent list — see below
[PRIVACY DEVICE]           the redaction-block — see below, non-negotiable visual moment
[what-you-leave-with list] flat list, mono numerals, no icons
[primary CTA]              Begin  (flat ink fill / paper text, no radius)
[secondary microcopy]      mono, small, muted — "Takes 20–30 minutes. You can leave and come back."
```

**Is/is-not list — flat, no cards:**

```css
.dl-intake-item {
  border-top: 1px solid var(--ink);
  padding: 16px 0;
  display: flex; gap: 24px; align-items: baseline;
}
.dl-intake-item:last-child { border-bottom: 1px solid var(--ink); }
.dl-intake-item .lead {
  font-family: 'JetBrains Mono'; font-size: 11px; letter-spacing: 0.14em;
  text-transform: uppercase; color: var(--muted); flex-shrink: 0; width: 90px;
}
.dl-intake-item .body { font-family: 'Inter'; font-size: 16px; line-height: 1.55; color: var(--ink); }
```

Each row: a short mono tag ("IS NOT" repeated, or "IS" once at the top) in the lead column, the sentence in the body column. This is the SEC-10-K/deposition reference applied directly — hairline rules doing the entire job a card-per-item treatment would otherwise do, and it reads as a *document*, not a marketing feature list, which is exactly the register this screen needs.

**The privacy device — the "clear, confident visual moment" the task brief explicitly asks for, not just copy:**

This is a solid ink block, paper text reversed out, flat rectangle, no rotation, no border-radius — the CIA-PDB redaction-bar reference translated literally rather than decoratively. Ink, not ember: the redaction bar is an *institutional-withholding* device (something is deliberately not shown to someone), which is a different semantic job from ember's *cost-disclosure* one (something true and costly is being said). Keeping them visually distinct protects both meanings.

```css
.dl-privacy-block {
  background: var(--ink); color: var(--paper);
  padding: 28px 32px; margin: 32px 0;
}
.dl-privacy-block .tag {
  font-family: 'JetBrains Mono'; font-size: 10px; letter-spacing: 0.22em;
  text-transform: uppercase; color: rgba(250,250,247,0.5); margin: 0 0 14px; display: block;
}
.dl-privacy-block p {
  font-family: 'Inter'; font-size: 16px; line-height: 1.55; color: var(--paper); margin: 0;
}
```

Tag copy: "PRIVACY" or "WHAT STAYS PRIVATE" (content-writer's exact call). Body copy: the Content Copy doc's already-drafted privacy line verbatim ("What you say here stays with you. If this was purchased through a corporate licence, the person who bought your seat sees that a seat was used — never your answers, never your result. No exceptions."). This line's factual claim is now confirmed by the task brief itself ("individual participant results are never visible to a corporate purchaser, full stop") — the copy and the design both assume that answer is final; Strategy doc §6's open question is resolved as of this spec.

**Non-negotiables:** no card border around the is/is-not list (rules only). No icon on any list item (no checkmark, no cross, no lock icon on the privacy block — the ink-block *is* the icon, in Rams' sense: the form itself communicates the function). No rounded corners on the privacy block. The privacy block must not use ember, gold, or any "trust badge" colour convention borrowed from consumer SaaS (a green padlock, etc.) — ink-on-paper-reversed is the entire trust signal, deliberately unlike anything a checkout page usually shows.

### 2.3 Four-thread scorer (Phase 1)

**Mechanic, per strategy doc:** forced-choice-plus-evidence, not a slider. One thread at a time, four in sequence (per Content Copy §4.1's "the participant sees one thread at a time"). Each completed thread collapses to a compact summary line in the chat log before the next thread's card mounts — this is the visual expression of the Judd "identical repeated unit, richness from accumulation" reference: by the end of Phase 1 the participant has scrolled past four structurally identical, now-completed units stacking down the page, and *that accumulation* is the phase's only visual richness. Nothing else varies between them.

**Active (unscored) card:**

```css
.dl-thread-card { margin: 8px 0 32px; }
.dl-thread-label {
  font-family: 'JetBrains Mono'; font-size: 11px; letter-spacing: 0.18em;
  text-transform: uppercase; color: var(--ink); margin: 0 0 16px; display: block;
} /* BUDGET AUTHORITY / ROADMAP INFLUENCE / EXECUTIVE TRUST / RELATIONSHIP CAPITAL */

.dl-thread-choice { display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; }
.dl-thread-btn {
  flex: 1; min-width: 220px; min-height: 52px;
  padding: 14px 18px;
  border: 1px solid var(--ink); background: transparent;
  font-family: 'Inter'; font-size: 15px; color: var(--ink);
  text-align: left; cursor: pointer;
  transition: background-color 0.12s ease, color 0.12s ease, border-color 0.12s ease;
}
.dl-thread-btn:hover { border-color: var(--cobalt); }
.dl-thread-btn[aria-pressed="true"] {
  background: var(--cobalt); border-color: var(--cobalt); color: var(--paper);
}
.dl-thread-btn:focus-visible { outline: 2px solid var(--cobalt); outline-offset: 2px; }

.dl-thread-evidence-label {
  display: block; font-family: 'JetBrains Mono'; font-size: 10px; letter-spacing: 0.16em;
  text-transform: uppercase; color: var(--muted); margin: 0 0 8px;
} /* "THE EXAMPLE THAT PROVES IT" */
.dl-thread-evidence-input {
  width: 100%; border: 1px solid var(--ink); background: var(--paper);
  padding: 12px 14px; font-family: 'Inter'; font-size: 15px; color: var(--ink);
  outline: none; transition: border-color 0.15s;
}
.dl-thread-evidence-input:focus { border-color: var(--cobalt); }
```

**Completed (collapsed summary) state**, once a thread is scored and the participant has moved on:

```css
.dl-thread-summary {
  border-top: 1px solid var(--ink); padding: 14px 0;
  display: flex; justify-content: space-between; gap: 16px;
  font-family: 'JetBrains Mono'; font-size: 12px; color: var(--muted);
}
.dl-thread-summary .name { color: var(--ink); letter-spacing: 0.1em; text-transform: uppercase; }
.dl-thread-summary .choice { color: var(--muted); }
```

A one-line receipt: `BUDGET AUTHORITY — I shape this.` No colour, no checkmark, no icon — the completed state is deliberately *less* visually loud than the active state, which is correct: attention belongs on whichever thread is currently live, not on a trophy shelf of completed ones (that trophy-shelf instinct is exactly the kind of "3 of 4 threads scored" progress signal Principle 5 and the motion spec both rule out).

**States:** default (bordered, unfilled) → hover (border → cobalt, no fill) → selected (solid cobalt fill, paper text, per the forced-choice pair) → evidence-required-but-empty (the shell's existing `shake` animation on the input, reused verbatim per motion spec §2.1, plus the validation copy from Content Copy §6.3) → completed (collapses to `.dl-thread-summary`).

**Non-negotiables:** all four thread cards are structurally identical — same markup, same sizing, same states — differentiated only by the mono label and the forced-choice copy pair (Content Copy §4.1's table). No colour-coding per thread (no "Budget Authority is cobalt, Roadmap is X" scheme) — that would be a half-step toward a typed-personality-quiz read, which Principle 4 rules out. Selected state is always cobalt, regardless of which of the two options or which of the four threads. No radio-dot icon, no checkmark inside the button — the fill *is* the entire signal (Rams/Braun reference, same reasoning as the sibling diagnostic's tap components).

### 2.4 Trap selector (Phase 2)

Three named cards (Content Copy §4.2), tap to select one, single-select. Structurally near-identical to the thread scorer's forced-choice buttons — deliberately, per the Judd "one repeated tap-feedback vocabulary across the whole product" principle already established in Section 2.3.

```css
.dl-trap-options { display: flex; flex-direction: column; gap: 8px; margin: 20px 0 24px; }
@media (min-width: 640px) { .dl-trap-options { flex-direction: row; } }

.dl-trap-card {
  flex: 1; padding: 20px; min-height: 96px;
  border: 1px solid var(--ink); background: transparent;
  text-align: left; cursor: pointer;
  display: flex; flex-direction: column; gap: 8px;
  transition: background-color 0.12s ease, color 0.12s ease, border-color 0.12s ease;
}
.dl-trap-card .name {
  font-family: 'Inter'; font-weight: 600; font-size: 15px;
}
.dl-trap-card .desc {
  font-family: 'Inter'; font-size: 13px; line-height: 1.4; color: var(--muted);
}
.dl-trap-card:hover { border-color: var(--cobalt); }
.dl-trap-card[aria-pressed="true"] {
  background: var(--cobalt); border-color: var(--cobalt); color: var(--paper);
}
.dl-trap-card[aria-pressed="true"] .desc { color: rgba(250,250,247,0.75); }
.dl-trap-card:focus-visible { outline: 2px solid var(--cobalt); outline-offset: 2px; }
```

Unselected cards, once one is chosen: no fade, no dim, no reflow (per motion spec §2.2 — they stay full-weight, just unselected). I'm holding this even though it's a smaller visual distinction than a dimmed-competitor treatment would give, because dimming the two not-picked traps risks reading as "these are wrong, this one's right" — a comparative-failure-state echo Principle 5 explicitly rules out, applied here to the trap's siblings rather than to the participant's own result. Flagged as a genuine judgment call in Open Threads §4.3.

**Non-negotiables:** same as Section 2.3 — no colour-per-trap coding, no icon, no card-shadow-on-hover, fill is the only selection signal.

### 2.5 Leadership Influence Profile reveal card (Close screen — the screen this whole product is built to earn)

**The one instruction that governs everything else in this component:** it must never resemble a benchmark, a gauge, or a percentile (Principle 5), and it must not read as "one of several possible outcomes" (Principle 4 — strengths-framed, not a typed result). The most direct way to guarantee that: **it is not a card.** No box, no border, no fill, no radius, no drop-shadow. It sits directly on `--paper`, distinguished from everything above and below it purely by scale, by being the one place in the whole product Archivo and ember are spent on content, and by two full-width hairline rules bracketing it top and bottom — the same "quiet evidence, then the one loud line, then quiet again" architecture the deposition-transcript and McKinsey governing-thought references both point to.

```css
.dl-reveal { margin: 40px 0 48px; }

.dl-reveal-eyebrow {
  font-family: 'JetBrains Mono'; font-size: 10px; letter-spacing: 0.22em;
  text-transform: uppercase; color: var(--muted); margin: 0 0 20px; display: block;
} /* "YOUR LEADERSHIP INFLUENCE PROFILE" */

.dl-reveal-context {
  font-family: 'Inter'; font-size: 15px; line-height: 1.6; color: var(--muted);
  font-style: italic; margin: 0 0 32px;
} /* the "why this, specifically" quoted-fragment line — ember touches only the
     quoted words themselves, per the §1.1 ledger, not the whole line */

.dl-reveal-rule { border: none; border-top: 1px solid var(--ink); margin: 0 0 32px; }

.dl-reveal-sentence {
  font-family: 'Archivo', sans-serif; font-weight: 800; font-stretch: 110%;
  letter-spacing: -0.02em; line-height: 1.05;
  font-size: clamp(28px, 5.5vw, 48px);
  color: var(--ember); margin: 0 0 40px;
}
.dl-reveal-sentence .dl-lime {
  font-style: normal; background: var(--lime); color: var(--ink);
  padding: 2px 8px; box-decoration-break: clone; -webkit-box-decoration-break: clone;
} /* the single one-word (or short-phrase) highlight — reused from
     .section-lede em in the Content & Voice Guide, verbatim */

.dl-reveal-rule--bottom { border: none; border-top: 1px solid var(--ink); margin: 0 0 32px; }

.dl-reveal-threads {
  display: flex; flex-wrap: wrap; gap: 24px; margin: 0 0 32px;
}
.dl-reveal-thread {
  font-family: 'JetBrains Mono'; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase;
}
.dl-reveal-thread .name { color: var(--ink); }
.dl-reveal-thread .state { color: var(--muted); margin-left: 6px; }
/* e.g. BUDGET AUTHORITY  shaping   ·   ROADMAP INFLUENCE  reacting   ·  ... */

.dl-reveal-credit {
  font-family: 'JetBrains Mono'; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--muted); opacity: 0.55; margin: 0;
}
```

**Structure, top to bottom, matching the report architecture the motion spec's reveal sequencing (§4) is already built against — quiet evidence first, loud verdict second, quiet close:**

1. Eyebrow label (static, no animation)
2. "Why this, specifically" context line — quoted fragment ember-touched, rest muted italic
3. Hairline rule
4. **The profile sentence — Archivo, ember, one lime-highlighted word or short phrase.** This is display use #3 from the §1.1 ledger and the single largest, most saturated moment in the entire product.
5. Hairline rule
6. Four threads, always shown, flat text, no bars, no numbers, no ranking — Principle 1 made literally unbreakable: the markup renders all four unconditionally, so a build can't silently drop Relationship Capital because it wasn't the headline thread.
7. Credit line, muted, small

**Which word gets lime:** the single most load-bearing word or short phrase in the sentence — for "You've built the credibility. You haven't been given the room," that's **the room**; for "Your team executes brilliantly and gets consulted last," that's **consulted last**. This needs a per-sentence-template annotation from the content-writer (which span of each of the example sentences in Content Copy §5.1 is the lime target) before build — flagged in Open Threads §4.4, since the copy doc didn't originally write with this markup in mind.

**Non-negotiables:** no box, no border, no fill, no radius, no shadow on the reveal as a whole — if a builder reaches for `background` or `border-radius` on `.dl-reveal`, that's the exact "badge architecture" failure mode the Design Thinking Diagnostic's design-lead named for its own sibling component, and it applies with equal force here. No numeric score, percentage, or ranking anywhere in this component, including in a private/dev-only view — Principle 5 rules this out at the level of existence, not visual treatment. No comparative language in the four-threads line ("above average," "top quartile," anything relative to other participants). The four threads are always rendered, unconditionally, regardless of which was the headline thread.

---

## 3. Design specs — screen by screen, phase by phase

Reuses the shipped shell's screen-level CSS (`.screen`, `.app-shell` structure, session persistence pattern) as the interaction skeleton; every visual value below is new per Sections 1–2. `localStorage` key: `dld_session_v1` (proposed — flagged in Open Threads §4.5 to avoid collision with any other in-flight diagnostic).

### 3.0 Welcome

- **Brand panel (desktop left column):** no illustration — the fanned-deck device does not transfer, and this touchpoint gets nothing in its place, matching the "subtraction over addition" instinct the Design Thinking Diagnostic sibling already established for its own Welcome screen, taken one step further. Backdrop is `--soft-white` (the one place that token is used), flat, no radial-gradient wash (the Why Workbook's brand panel uses a soft radial gradient — cut here; gradients are a hard no per §1.3 regardless of subtlety). Just eyebrow + title + lede on generous whitespace.
- **Eyebrow:** mono, "FRANKLY HUMAN · DESIGN LEADERSHIP DIAGNOSTIC" per Content Copy §1.
- **H1:** Archivo, display use #1, "Why does the room keep closing without you in it?" — set at the top of the type scale (`clamp(32px, 6vw, 56px)`, §1.2), ink.
- **Lede:** two lines, Inter 17–18px, `--charcoal`, per Content Copy §1.
- **Name field:** flat, ink border, no radius, unchanged mechanically from the Why Workbook's `.name-field`, recoloured (focus border → cobalt, not teal).
- **Primary CTA:** "Start the diagnostic" — flat ink fill / paper text; hover fills cobalt / paper text; disabled 38% opacity. No radius.
- **Reassurance note:** mono, small, tracked, `$500 · 20–30 minutes · Result on screen the moment you finish` — **`$500` set in ember, the rest in `--muted`.** This is ember ledger item #1 (§1.1) and it's the very first thing the product spends its scarce content-colour on — a deliberate opening statement that this diagnostic states its cost as plainly as it will later state its findings.
- **Resume banner:** unchanged mechanically, recoloured — ink border, soft-white fill, no accent colour spent (functional/utility moment, not a content or structure beat).

### 3.1 Intake

Full component spec: Section 2.2. No special-component divs, no chat — this is a static screen, matching the Why Workbook's Welcome-screen pattern (form/read, single CTA forward) rather than the chat screen's rhythm. Reachable only after a confirmed-payment state (backend/build concern, not visual — Content Copy §6.2 already has the copy for the unconfirmed-payment edge case; the visual treatment for that edge case is the same screen with the primary CTA replaced by the error copy in a plain paragraph, no privacy block, no is/is-not list — just the error state and a retry path).

### 3.2 Phase 0 — Reframe

Chat only, no special component. System divider (`.msg-system` recoloured to cobalt border-top, per §2.1) reads "— REFRAME —" or equivalent. Claude's opening message (Content Copy §3.1, the Head of Design story) renders in the standard `.dl-msg-claude` treatment (§2.1) — no visual escalation, no different treatment for this being the "cold open." It's just the first Claude turn.

### 3.3 Phase 1 — The Four Threads

Full component spec: Section 2.3. Sequenced: Claude's framing line (Content Copy §3.2 opening) → thread 1 card mounts (Budget Authority) → on valid submission, collapses to summary, Claude may deliver a brief probe if the evidence was vague (the reusable follow-up line, Content Copy §3.2) → thread 2 mounts (Roadmap Influence) → ... through Relationship Capital. All four threads render in strict sequence, never simultaneously — this is a design decision beyond what either upstream doc explicitly specified (the strategy doc describes the mechanic per-thread but doesn't confirm sequential vs. simultaneous display); flagged in Open Threads §4.6 for confirmation, though I'd resist simultaneous display strongly — four active forced-choice-plus-evidence cards on screen at once is a wizard-form read this whole IA call was built to avoid (Strategy doc §1.2).

### 3.4 Phase 2 — The Three Traps

Full component spec: Section 2.4. Claude's framing line (Content Copy §3.3) → trap selector mounts → on selection, the follow-up probe fires as a normal chat turn ("Is the organisation doing this to you...") with the text input visible again. The trap name lands in Claude's *next* message after the probe resolves, not on the card itself — the card names the trap as a label the participant picked ("The Silent Expert"); the ember-highlighted "named it back" moment (ledger item #2) happens in Claude's subsequent prose, e.g. "You're describing **the Silent Expert**" with only the trap name in ember inside that sentence.

### 3.5 Phase 3 — Where the Room Was Lost

Chat only. **No special component, no UI chrome beyond the standard input row — deliberately, mirroring the Design Thinking Diagnostic sibling's explicit "this phase gets nothing" precedent**, and for the same reason stated even more strongly here: this is the Errol Morris phase (Inspiration doc mood board #10), and any visual structure beyond the plain question-answer rhythm would be the interface doing exactly the "visual rescue" the reference warns against. Three sequential questions (Content Copy §3.4), each a standalone `.dl-msg-claude` turn, no system divider between them, no progress indicator. If a future revision proposes adding one, it's a violation of this phase's spec, not a refinement — flag it back to design-lead.

### 3.6 Phase 4 — The Leadership Influence Profile

No standalone screen chrome in the chat itself. Claude's opening line ("Here's what I see. Tell me if I'm wrong," Content Copy §3.5) renders as a normal turn, then the flow transitions to Close, where the full Profile Reveal Card (Section 2.5) renders. No "generating your profile..." loading state beyond the existing typing-dots — a bespoke loading treatment here would manufacture suspense this register has no room for (Berkshire Hathaway reference, again).

### 3.7 Close

**Order, top to bottom — and this is a deliberate departure from the sibling diagnostic's precedent, stated with reasoning:**

1. **`.dl-reveal`** (Section 2.5) — largest, first, most typographically dominant. The eye lands on the profile sentence before anything else.
2. **Continue-in-Claude bridge** (`d2m-bridge`-equivalent, Content Copy §5.2) — the reveal's own primary next action, cobalt-bordered CTA per the Inspiration doc's own instruction that cobalt marks "the handoff to Design-Led: Leader" — though that line in the source doc conflates two separate handoffs; I'm reserving cobalt specifically for *this* one (Continue in Claude) since it's the structural, product-native exit, and treating the Design-Led: Leader sales bridge (item 4 below) as a persuasive moment that shouldn't borrow the same "this is architecture" signal a sale isn't.
3. **Save/export (email capture)** — moved *up*, immediately after the primary handoff, ahead of the Design-Led: Leader sales bridge. This is the deliberate departure: the Design Thinking Diagnostic spec put email capture last. Strategy doc §1.1 explicitly requires the save/export mechanism be "reachable without scrolling past it, given a $500 purchaser has more at stake in not losing their result than a free-tool user does" — reordering satisfies that requirement directly rather than trusting a "keep scrolling" assumption on a purchaser who has more anxiety about data loss than the free tool's audience ever did.
4. **Design-Led: Leader bridge** (Content Copy §5.3) — last, correctly subordinate; this is the upsell, and it should read as the thing you reach after you've secured your result, not before.

All four sections share the `.close-inner` container (`max-width: var(--max)`), unchanged from the shell. No visual box around any of them except the profile reveal's own hairline rules (Section 2.5) — the bridges and email capture stay flat, bordered-not-filled, matching the rest of the system's non-negotiables.

---

## 4. Open threads log

1. **Cobalt spent on every single Claude message, not just 3–5 times.** This is the single highest-stakes call in this document (Section 2.1's core reasoning) and the most likely to draw a second opinion, because it reads at first glance like it contradicts the Inspiration doc's accent-economy instruction even though I believe the content/structure distinction resolves it cleanly. **Recommendation: build a short comped chat sequence (4–5 turns) and taste-check it before committing** — the test question isn't "does this look right" but "does cobalt on every Claude turn still read as restrained by minute ten, or does it start to feel like decoration despite the reasoning above?" If the Creative Director calls it decoration, the fallback is the Inspiration doc's own original recommendation — typographic label only, no colour on the rule at all, cobalt reserved purely for phase dividers and CTAs.

2. **Caveat cut entirely, not reserved for a single Close-screen note.** Neither upstream doc explicitly ruled it out; I did, for the reasons in Section 1.2. **Recommendation: confirm at Taste Check**, low stakes either way — the product loses nothing structural if a single small Caveat note is reinstated somewhere on Close.

3. **Trap selector's unselected cards stay full-weight, don't dim.** Stated in Section 2.4 as a genuine judgment call, not a settled read of either upstream doc — I resisted dimming to avoid a comparative-failure-state echo, but a mild opacity reduction on the two unselected cards is a defensible alternative if the Creative Director reads the current spec as under-signalling the selection. **Recommendation: build both and compare — this is a real two-way tension, not a rhetorical question.**

4. **Which word/phrase gets the lime highlight, per profile sentence.** Section 2.5 needs a specific annotation from the content-writer against each of the four example sentences in Content Copy §5.1 (and against the dynamic template generally, since the actual reveal sentence is built at runtime from the participant's answers, not fixed). **Recommendation: content-writer and design-lead agree the selection rule together** (e.g. "the second clause's final noun phrase," or a hand-picked span per template) before build, since this can't be left to the builder's on-the-spot judgment without risking an inconsistent or badly-placed highlight.

5. **`localStorage` key `dld_session_v1`.** Proposed, not confirmed — trivial, but worth a one-line sign-off to avoid collision with any other in-flight product in this family (the Design Thinking Diagnostic uses `dtd_session_v1`, per its own spec; naming convention is consistent, just needs the actual sign-off).

6. **Phase 1's four threads render strictly sequentially, never simultaneously.** My call, stated in Section 3.3, reasoned against the wizard-form failure mode Strategy doc §1.2 warns about. Neither upstream doc explicitly confirmed sequential-only. **Recommendation: confirm before build** — this affects the component's state machine, not just its visual treatment, so it's expensive to change late.

7. **The "held-silence" pacing device at phase transitions**, flagged by the motion-designer (Motion Spec §3.1, point 3, and §6) as a genuinely strong idea belonging to content-writer/backend timing, not motion or visual design. I have no visual objection to it — a longer response delay at phase boundaries doesn't require any change to Section 2.1's static-divider spec — but it's unclaimed by any agent so far. **Recommendation: content-writer and whoever owns backend response timing should pick this up directly; flagging forward, not resolving here.**

8. **A possible fourth Archivo moment** (the Design-Led: Leader bridge headline on Close), mentioned as a live option in Section 1.1's ledger but not specified. **Recommendation: build the three-use version first and see whether Close's final bridge feels under-typeset without a fourth display moment before adding one** — easier to add scarcity back than to remove an over-spent fourth use later.

9. **Payment-confirmation gating on the Intake screen** is a backend dependency this spec assumes exists (a boolean "payment confirmed" state gating whether Intake renders its full content vs. the unconfirmed-payment error copy from Content Copy §6.2) but doesn't itself resolve. **Recommendation: flag to whoever owns the payment/Stripe integration — this is a build sequencing dependency, not a visual one, but Intake cannot ship without it.**

---

## 5. Handoff note to the design-builder

Read the Why Workbook's `index.html` and `app.js`, and the Design Thinking Diagnostic's shipped spec, before touching this one — this document is phrased as a delta against the shell, and several components (thread scorer, trap selector) intentionally reuse the *shape* of that sibling product's Lens Scorer and Cause Attribution components even though the colour logic, type stack, and speaker-turn treatment are entirely new. Three things to hold onto going in:

**First, the coloured speaker-turn rule (Section 2.1) is the single most-watched decision in this whole build.** If you find yourself reaching for a background-fill, a bubble shape, or a rounded corner on either speaker's message, stop — that's the exact treatment this spec was built specifically to avoid, and it's called out by name in the original brief as the thing not to revert to. The entire mechanism is a 2px hairline rule and a mono label. Nothing else.

**Second, the ember ledger (Section 1.1) is exhaustive, not illustrative.** There are exactly four places ember appears in the whole product. If a phase transition, a hover state, a selected button, or a validation error looks like it "wants" ember to feel finished, that instinct is the thing this whole register is built to resist — bring it to design-lead rather than spending the colour to solve a problem cobalt or plain ink should be solving instead.

**Third, the Profile Reveal Card (Section 2.5) has no box.** Not a lighter box, not a borderless-but-still-implied card via padding-and-background — genuinely no container. Its authority comes entirely from scale, from being the first and only place Archivo-display and ember touch content rather than structure, and from the whitespace holding it apart from the bridges below it. If it looks "unfinished" in an early build pass sitting next to the fully-bordered thread-scorer and trap-selector components above it in the same session, that contrast is correct — it's supposed to look like the one thing on the page that isn't a UI control, because it isn't one.

Open threads in Section 4 are ordered roughly by build cost if resolved late: items 1–4 affect the two moments (chat log throughout, and the Close-screen reveal) most expensive to redo after the fact; items 5–9 can run in parallel with early build work without blocking it.
