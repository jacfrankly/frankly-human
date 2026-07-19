# Design Thinking Diagnostic — Design Critic Review

Prepared by: Design Critic (DC)
For: Design Builder, Design Lead, Creative Director
Inputs reviewed: `— 02 Strategy.md`, `— 03 Inspiration.md`, `— 04 Design Spec.md`, `— 04 Content Copy.md`, `— 04 Motion Spec.md`, `— 05 Build Notes.md`, and the shipped build (`design-thinking-diagnostic-app/index.html`, `app.js`, `netlify/functions/chat.js`), read in full — not sampled.

Overall: this is a well-executed build against a genuinely demanding spec. Copy fidelity is high, the colour discipline holds, the reveal choreography is close to spec once the self-reported animation bug is accounted for. But I found two code-level defects that go straight at this product's actual reason for existing — not cosmetic gaps, but places where the shipped logic lets the tool skip the exact work the strategy doc says is the whole point. Both are more serious than anything the design-builder's own audit surfaced.

---

## Design principles — verdict by principle

**1. One project, one thread — PARTIALLY HONOURED, at real risk.**
Copy consistently references `{project}` by name across every phase script, which is correct. But the *mechanism* that's supposed to guarantee a real project gets named in the first place is broken — see Ship Blocker 1. A principle that can be silently bypassed by clicking a button that shouldn't be visible yet isn't honoured just because the copy above it is well-written.

**2. Attribution is structured state, not inferred prose — HONOURED at the code level, undermined at the conversational level.**
Verified directly: `handleCauseClick()` in app.js (line 771) writes `STATE.workbook.cause_attribution = key` synchronously on click — a real, inspectable value, never inferred from the transcript. This is correctly implemented and is the strongest single piece of engineering in the build. But the principle's deeper intent — that the *chat* does real work to pull a hedged answer into one of three real causes before the buttons even appear — is thinned to a single round-trip. See Ship Blocker 2.

**3. The profile outranks the funnel — HONOURED.**
DOM order is `.profile-reveal` → `.d2m-bridge` → next-question line → email capture, exactly as specified. Type scale is decisive: `.pr-tag` runs `clamp(36px, 7vw, 60px)` in plum DM Serif Display italic against `.d2m-bridge-text`'s 17px Fraunces — 2–3× the size, no contest. The reveal card correctly has no box, border, or fill (`.profile-reveal` — verified no `border`/`background` rule anywhere), while the bridge is deliberately the only bordered, filled card on the screen. In a screenshot the eye goes to the tag first. This is well executed.

**4. Named diagnosis, not a personality type or score — HONOURED.**
No numeric/percentage content appears in the primary result state. The `profile` phase prompt in chat.js explicitly forbids encoding the cause via colour or a scored number ("The tag must never encode {cause} via colour or a scored number — it is a named pattern, not a score"). Lens states are Present/Thin/Skipped labels, never numbers.

**5. Guardrails soften the moment, not the whole product's voice — HONOURED, with one open item.**
Default SYSTEM_PROMPT tone is direct and unhedged; the three named guardrail lines are near-verbatim from Content Copy §5 and clearly bounded ("three named triggers only... Outside these triggers, stay direct"). One gap: the build added a fourth, stronger "acute crisis" guardrail line beyond what Content Copy specified, self-flagged in Build Notes as the design-builder's own paraphrase. Crisis-response copy is precisely the category that shouldn't ship on an engineer's best guess — see Fix Round 5.

**6. Chrome disappears on mobile — HONOURED.**
`.brand-panel` is correctly hidden during the diagnostic and close screens on mobile via the same `:has()` pattern as why-workshop-app-v2 (verified identical in both files), leaving only the thin `.ww-header` bar above the chat log, which the principle's own test explicitly permits.

---

## Ship blockers

### 1. Design Principle 1 can be bypassed entirely — the "Continue" button appears before the project is ever named

`enterPhase1a()` (app.js, lines 562–572) calls the API for Claude's opening, *unanswered* question ("Bring one real, recent project to mind... What was it?"), and its `onSuccess` callback immediately calls `showContinue('Continue to scoring →', ...)` — displaying the Continue bar **at the same moment as the question, before the participant has typed anything.** The input row and Continue bar are visible simultaneously, so a participant can click straight through to Phase 1b with `STATE.workbook.project_label` still empty. Every subsequent phase then falls back to the generic string `'the project'` (see `enterPhase1b`, line 584) instead of a real, named anchor — which is the literal thing Design Principle 1 exists to prevent ("does the UI/copy reference the participant's own project ... at least once per phase?"). The identical pattern repeats in `enterPhase1c()` (lines 660–668) for the skip-attribution question.

Root cause, verified by comparison: this is copied from why-workshop-app-v2's `enterPhase2b()` ("Emotional check," app.js lines 547–558), where showing Continue immediately after the opening message is appropriate because that phase's answer is genuinely optional. Phase 1a's answer is not optional — it's the foundation the other seven phases re-anchor to. The pattern was reused without adjusting for the fact that this product's Principle 1 is stricter than its parent's.

**Recommendation:** in `enterPhase1a` and `enterPhase1c`, move `showContinue(...)` out of the initial `onSuccess` callback entirely — it should only be set inside `phaseOnResponse`, i.e. only after the participant has actually sent a message and Claude has responded to *that*. This is a small, contained fix but it is the fix that makes Principle 1 actually true rather than just well-copy-written.

### 2. Phase 2b — the single most load-bearing exchange in the product — is one round-trip, not the two-turn probe the spec calls for

Design Spec §3.6 and Content Copy §3 both describe Phase 2b as chat-probe → possible "it's complicated" clarifying follow-up → participant's *second* answer → **then** the structured cause buttons appear. The shipped `enterPhase2b()` (app.js, lines 723–738) and chat.js's `case '2b'` branch collapse this to exactly one round-trip: whatever the participant says in their first reply, the buttons appear right after, with the "it's complicated" handling folded into that same single reply rather than a real second exchange that waits for resolution. Build Notes §2 self-flags this as a pre-existing app.js constraint ("no mechanism for the backend to gate the component behind a 'the vague-answer catch actually landed' check").

This lands directly on Persona 2.2 (Dinesh), which the strategy doc names as *the* persona to hold above the other two while designing (§4: "If the design and copy only work for people who already suspect the right answer, the tool has failed its most distinctive job"). Dinesh's failure mode is explicitly "he gives a vague 'it's complicated' and the tool accepts it" (§2.2). The shipped version does force him to pick one of three labelled buttons — so `STATE.workbook.cause_attribution` is never left unset — but the chat no longer does the "real work" of pulling the relationship-gap explanation out of someone who arrived with the wrong theory about himself; it hands him three options after one exchange and lets him default to self-blame if he wants to. Principle 2's literal state-capture test passes; the underlying reason the strategy doc built Principle 2 the way it did does not fully survive into the shipped conversation.

**Recommendation:** either give Phase 2b a genuine second round-trip gated on whether Claude's reply signals the vagueness actually resolved (a small `phaseOnResponse` change, mirroring how Phase 3 already correctly gates on `p3_answers`), or — if that's too costly before ship — have the single reply do more diagnostic work (briefly reflect what each of the three causes would look like in *this* person's actual described situation) before the buttons appear. Either way, flag this explicitly to design-lead/strategist as the item most likely to determine whether the product does its distinctive job, not a routine Fix Round line item.

### 3. Deployment: the app cannot reach its own backend as configured

Self-flagged in Build Notes §3 and still unresolved in the current repo state: the root `netlify.toml` routes both `/api/chat` and `/api/subscribe` to `why-workshop-app/netlify/functions` (the original v1 app), not this app's functions. As wired, this build — regardless of design fidelity — is non-functional in production. Not a design-craft issue, but it blocks ship on its own and should be tracked as such, not quietly assumed to be "someone else's problem" at sign-off.

---

## Fix round items

**4. `distress_flag` has no path back to false, and this product's own vocabulary makes false positives more likely than in its parent.** Confirmed via code: `STATE.session.distress_flag` is set to `true` in three places (app.js lines 364, 431) and never unset anywhere in the file — identical to why-workshop-app-v2's own gap. Once set, `phaseOnResponse` never fires again (`if (!STATE.session.distress_flag) phaseOnResponse(data);`, line 461) and every future `/api/chat` call permanently returns the "DISTRESS FLAG IS ACTIVE" branch. This is inherited, not new — but `CRISIS_KEYWORDS` includes phrases like "no point going on," which is markedly more likely to occur as ordinary language about a stalled project or roadmap in *this* diagnostic's own register than in the Why Workbook's. Recommend a path to resume coaching once a support interaction concludes.

**5. The added "acute crisis" guardrail line needs content-writer sign-off before ship.** It's a reasoned, safety-motivated addition (Build Notes §2), but crisis-response copy is exactly the category that shouldn't ship as an engineer's best paraphrase of a sibling product's line.

**6. `MODULE_ROUTES` (app.js, lines 46–61) is half-sourced.** Only 4 of 9 lens/mindset → module mappings (Viable→04, Systems thinking→07, Bias to action→12, Communicate intent→03) trace to the content-writer's worked examples; the remaining 5 are the design-builder's own inferred guess, and Content Copy §8 explicitly asked for this table to be built with the content-writer, not inferred. Since the routed module drives the entire Close-screen bridge, an unreviewed guess here can send a participant to a module that doesn't actually address their named gap — which quietly undercuts the "genuinely earned" quality the whole reveal is built on (Principle 3/4's intent, even if the visual hierarchy is intact).

**7. Motion Spec §3.1's press-feedback rule is incompletely applied.** `.lens-state-btn`/`.mindset-chip` has the `:active { transform: scale(0.98) }` rule (index.html line 275) but the transition list (line 272) still omits `transform` — self-flagged in Build Notes §1.3 as a one-line fix, confirmed still present. More significantly, and *not* caught by the design-builder's own audit: the same press rule was never applied to `#btn-send` or `.btn-continue` at all, despite Motion Spec §3.1 explicitly naming both by name as required targets. Grep of the whole file confirms exactly one `:active` rule exists in the entire stylesheet.

---

## Post-ship improvements

**8.** `.mark-underline` stroke path is still the functional placeholder curve (`M4,10 Q80,3 150,9 T296,8`), not an art-directed chalk-stroke asset — flagged as open in Design Spec Open Thread #7, unresolved. Fine to ship on, worth commissioning properly given how much weight this one gesture carries.

**9.** Longer profile tags ("The Unsponsored Operator," "The Point-Solution Designer") risk wrapping to 2–3 lines at `clamp(36px, 7vw, 60px)` on narrow mobile viewports — an explicitly open, untested risk per both Content Copy handoff note 2 and Design Spec Open Thread #4. Worth an on-device pass across all candidate tags.

**10.** `MINDSETS[].desc` (app.js) carries real content-writer copy that `buildMindsetSelector()` never renders (only `m.key` becomes `chip.textContent`). Matches the Design Spec's literal component contract, but leaves authored content dead — design-lead call on whether to surface it or delete it (Build Notes §1.2).

**11.** Minor CSS looseness: `.pr-credit` carries its own `margin: 0 0 40px` in addition to `.profile-reveal`'s own `margin-bottom: 40px` (harmless — they collapse — but redundant); `.pr-tag` ships at `line-height: 1.15` vs. the spec's `1.05` (likely intentional, avoids descender clipping on the italic serif, not worth changing).

**12.** The shipped reveal stages `.pr-evidence` and `.pr-citation` as two separately-staggered fades (0–200ms, then 100–300ms) rather than the Motion Spec's single combined 0–200ms block, so the effective held pause before the tag arrives measures roughly 400ms from the last visible motion rather than the specified 500ms. Reads correctly in spirit — a genuine pause is present — but worth a literal QA pass against the Motion Spec's numbers.

**Confirmed fixed, verified not just claimed:** the `.pr-tag` animation-delay bug the build notes flagged (`tagFade` firing at T=0 instead of T=700ms) is genuinely fixed — `index.html` line 480 now reads `animation: tagFade 0.15s ease 0.7s forwards;` — and the resulting sequence (evidence → citation → held pause → tag fade at 700–850ms → underline stroke at 1000–1700ms via the `setTimeout(drawUnderlineStroke, 1000)` in app.js) now matches the Motion Spec's intended choreography, not its inverse.

---

## Ship recommendation

**Ship with fixes — do not ship as-is.**

The craft is genuinely good: colour discipline holds throughout (verified — no decorative teal/pink/yellow anywhere in the diagnostic phases, only functional a11y/error use), copy fidelity to the Content Copy doc is close to verbatim, the profile reveal's visual hierarchy correctly makes the diagnosis dominate the close screen, and the animation bug flagged in the build notes is properly fixed. This is not a design that drifted from its brief in the ways these reviews usually catch.

But Ship Blockers 1 and 2 are not polish issues — they're places where the shipped *logic*, not the shipped copy or layout, lets the product skip the exact work its own strategy doc says is the entire reason to build it instead of a cheaper wizard. A principle that reads as honoured in the copy but can be silently walked around by a stray button click is not honoured. Fix both before this goes in front of Dinesh, Priya, or Ade — they are, respectively, the persona most exposed to Blocker 2, and the failure mode both blockers create (a diagnosis anchored to nothing, or a cause picked without real interrogation) is precisely the "deficit-generic" and "collapsed distinction" outcomes the whole product exists to prevent. Blocker 3 is a hard stop regardless of design sign-off — the app cannot currently talk to its own backend.
