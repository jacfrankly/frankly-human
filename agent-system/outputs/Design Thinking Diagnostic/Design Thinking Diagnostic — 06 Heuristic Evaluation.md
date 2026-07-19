# Design Thinking Diagnostic — Heuristic Evaluation

Prepared by: Heuristic Evaluator (HE)
Method: Static source review (`design-thinking-diagnostic-app/index.html`, `app.js`, `netlify/functions/chat.js`) + Nielsen's 10 heuristics + full cognitive walkthrough of Dinesh (Persona 2.2, the strategy doc's primary hold-in-mind persona)
Inputs: `Design Thinking Diagnostic — 02 Strategy.md`, `— 04 Motion Spec.md`

No live browser was available — findings on rendered/mobile behaviour are traced from CSS/DOM logic, not observed pixels, and are flagged as such.

---

## 0. Headline

The build gets the *visible* architecture of Design Principle 2 right — cause attribution is a real tap component, not inferred prose, exactly as specified. But two structural defects sit underneath that visible correctness and both land squarely on Dinesh, the persona the strategy doc says to hold above the other two:

1. **The Phase 1a/1c "Continue" button is shown before the participant has answered the question it belongs to**, not after — so the project-naming step this entire diagnostic depends on (Design Principle 1) can be silently skipped in one click, on the very first screen of the diagnostic.
2. **The cause attribution (Phase 2b) is locked *before* Phase 3's evidence-gathering interrogation runs**, and nothing ever revisits it — so Phase 3's "whose support did you have going in" question, which the strategy doc explicitly says exists to "pull the real answer out of" Dinesh, fires *after* the diagnosis it's supposed to inform has already been recorded and cannot be changed.

Both are code-verifiable, not speculative. Details below.

---

## 1. Severity-rated findings

### Finding 1 — Phase 1a/1c "Continue" advances before an answer exists (Critical, 4)

**Heuristics violated:** Error Prevention (H5, primary); Consistency and Standards (H4); User Control and Freedom (H3).

**Where:** `app.js`, `enterPhase1a()` (lines 562–572) and `enterPhase1c()` (lines 652–669).

In both functions, the **initial** `callAPI(null, onSuccess)` call — the one that fires the moment the phase opens and Claude asks its first question ("Bring one real, recent project to mind... What was it?" / "Who skipped it — you, or the organisation around you?") — has an `onSuccess` callback that calls `showContinue(...)` **immediately**, before the participant has typed anything:

```js
callAPI(null, () => {
  const goNext = () => transitionTo('1b');
  showContinue('Continue to scoring →', goNext);   // <-- fires on Claude's OPENING question
  phaseOnResponse = () => showContinue('Continue to scoring →', goNext);
});
```

`showInputRow()` is also active at this point, so the participant sees the text box and a live "Continue to scoring →" button side by side, before answering. Nothing disables or hides the button until an answer exists. Compare this to Phase 1b's `btn-lens-done` and Phase 2b's `btn-cause-done`, which are correctly `disabled` until a value is set — the gating pattern exists elsewhere in the codebase, it's just missing here. Phase 3 also gets this right (`enterPhase3()`'s initial `onSuccess` sets up `phaseOnResponse` only, no premature `showContinue`).

**Consequence:** a participant can click through Phase 1a without ever naming a project. `STATE.workbook.project_label` stays `''`, and every subsequent phase silently falls back to the generic string `'the project'` (`enterPhase1b`, the 2b/3/4/profile developer-message templates in `chat.js` all interpolate `workbook.project_label || 'the project'`). This is a silent, total failure of **Design Principle 1 ("one project, one thread")** — achievable in one click, on the first screen, with zero error message, zero visual distinction between "you must answer" and "feel free to skip."

**Who's affected:** anyone moving fast — which is the explicit context for two of the three personas (Priya: "will not tolerate anything that feels like a 45-minute... workshop"; Dinesh: early-career, self-blaming, wants this over with). It doesn't require confusion, just a normal "I'll get to it" reflex common in chat-UI patterns where a Continue button implies "you may proceed."

**Remediation:** disable `#btn-continue` (or don't call `showContinue()` at all) in the *initial* `onSuccess` of `enterPhase1a()` and `enterPhase1c()`; only show/enable it inside the *second* `phaseOnResponse` closure, after `lastUserMessage()` is non-empty. Phase 0 is the one legitimate exception (no answer is required there) and should stay as-is.

---

### Finding 2 — Cause attribution locks before Phase 3's evidence exists; no revision path (Critical, 4)

**Heuristics violated:** Error Prevention (H5, primary); User Control and Freedom (H3); Help Users Recover from Errors (H9).

**Where:** phase order is `2a → 2b → 3` (`PHASE_ENTRY`, `app.js` lines 467–476). `STATE.workbook.cause_attribution` is written exactly once, in `handleCauseClick()` (line 771), during Phase 2b — **before** Phase 3 runs. Phase 3's four questions include, verbatim, "Going into that moment, whose support did you have — or not have?" (`chat.js` line 179) — but by the time this question is asked, `cause_attribution` is already committed and nothing in the code ever reads Phase 3's answers to reconsider it. `generateProfile()`'s developer message (`chat.js` case `'profile'`) passes `cause` straight through from the Phase 2b button click; Phase 3's `evidence_quote` and `cost_answer` are used only as flavour text for the profile sentence and citation, never as a check against the recorded cause.

**Why this is the load-bearing bug, specifically for Dinesh:** the strategy doc's own success criterion for Persona 2.2 is *"the 'whose support did you have going in' probe in Phase 3 pulls the real answer out of him even though he didn't arrive expecting it."* That sentence only makes sense if Phase 3 has the power to surface or correct a cause that hasn't been locked yet. In the shipped build it can't — Phase 3 is downstream of the irreversible decision, not upstream of it. If Dinesh's 2b answer is a confident, non-hedged self-blaming statement ("I think I just need to get better at holding the room" — see the walkthrough below for why this is likely), he clicks "A skill I haven't built yet," and Phase 3's relationship-shaped evidence — even if he all but names the missing sponsor two questions later — has no mechanical way back into `cause_attribution`. That is exactly the failure mode the strategy doc names for him: *"he leaves with a skill-gap diagnosis that's actually a relationship gap."*

**Compounding factor:** the "never let a vague answer stand" guardrail (system prompt, `chat.js` lines 32–35) is implemented in the 2b developer message only as a check for literally hedged phrasing ("it's complicated," "a bit of both" — `chat.js` line 171). It has no branch for a *confidently wrong* answer, which is the more likely failure mode for a persona whose defining trait is that he "won't self-report [the political explanation] unprompted" and "defaults to self-blame." A confident wrong answer is not vague, so the vagueness guardrail never fires for it, and Claude is explicitly instructed not to contest or reframe it ("never declare which of the three it is yourself... never pre-empt their selection").

**Who's affected:** primarily Dinesh's persona class (relationship/buy-in-gap cases) — the exact case the strategy doc says the product must work for above the other two. Priya and Ade are lower-risk here because their personas describe them as already suspecting their real cause going in.

**Remediation:** two independent options, either sufficient on its own:
- Reorder so Phase 3's interrogation happens *before* Phase 2b's structured commit (matches the strategy narrative better — evidence before verdict); or
- Keep the current order but make the cause-attribution buttons revisable: surface them again after Phase 3 with the participant's own Phase-3 answers quoted alongside the three options ("earlier you said the buy-in wasn't there going in — does that change your answer?"), so the structured-state requirement (Design Principle 2) is preserved but isn't a one-shot, pre-evidence guess.

---

### Finding 3 — `generateProfile()` has no timeout, unlike every other API call in the app (Major, 3)

**Heuristics violated:** Visibility of System Status (H1, primary); Help Users Recover from Errors (H9).

**Where:** `app.js`, `generateProfile()` (lines 831–872). Every other network call in the app (`callAPI()`, line 340–341) wraps its `fetch` in an `AbortController` with an 8-second timeout and a user-facing retry UI (`showAPIError()` / `retryAPI()`). `generateProfile()`'s `fetch('/api/chat', ...)` has neither — no `AbortController`, no `signal`, no timeout. Its `try/catch` only fires on an outright network/parse error, not a hang.

**Consequence:** `finishDiagnostic()` calls `hideContinue()` (removing the only button on screen) and then `await generateProfile()`. If that request hangs — slow network, a stalled Netlify function, anything short of an outright rejection — the participant is left on a static screen with no button, no spinner, no message, at the single moment the strategy doc calls "the highest-stakes single moment in the product" (Motion Spec §3.5). `STATE.session.completed = true` is set in memory before the await, but `saveState()` is never reached while the hang persists, so the only escape is an unsignposted page reload, which — because nothing was actually saved — correctly drops the participant back to a resumable Phase 4 (verified: `loadSavedSession()` would return the last *persisted* state, not the in-memory `completed: true`). The recovery path exists, but it is not discoverable from inside the product.

**Who's affected:** anyone hitting a slow connection or backend hiccup exactly at the reveal — statistically rare per session, catastrophic in experience when it happens, at the worst possible point in the flow to lose confidence.

**Remediation:** give `generateProfile()` the same `AbortController`/timeout pattern as `callAPI()`, and on timeout, fall through to the existing `fallbackTag()`/`fallbackSentence()` path (which already exists and already works for the parse-failure case) rather than hanging indefinitely.

---

### Finding 4 — Mobile header `.ww-phase-label` cannot actually truncate; risks pushing "Need support?" off-screen (Major, 3)

**Heuristics violated:** Visibility of System Status (H1); Aesthetic and Minimalist Design (H8, secondary).

**Where:** `index.html`, `.ww-header` (flex row, `justify-content: space-between`, no `flex-wrap`) containing three children: `.ww-brand`, `#phase-label.ww-phase-label`, and `.header-right` (support + back buttons). `.ww-phase-label` sets `white-space: nowrap; overflow: hidden; text-overflow: ellipsis;` but has **no `min-width: 0`**. As a flex item, its default `min-width` is `auto`, which for non-wrapping text resolves to the text's full intrinsic width — meaning the flex item cannot actually shrink below its content, so `overflow:hidden`/`text-overflow:ellipsis` never gets a chance to engage. On a narrow viewport (this is an explicitly phone-first product per Design Principle 6) with a longer label — e.g. `"Phase 3 of 4 · Where Influence Breaks Down"` — the three flex children's combined intrinsic width will exceed the viewport, and with no wrap and no working truncation, the row will overflow rather than compress.

**Consequence:** on a real narrow phone (iPhone SE-class, 375px), this risks the `.header-right` group — which contains **"Need support?"**, the one safety-relevant control in the product — being pushed partially or fully out of the visible/tappable area, precisely during Phase 3, the phase the design spec itself flags as most likely to trigger distress ("keep the interaction unencumbered by UI chrome so Claude's guardrail copy can carry full weight" — Strategy §1). This is the opposite of unencumbered: the support exit could be the one thing that's actually missing from view.

**Who's affected:** any participant on a small-viewport phone in portrait — the primary stated audience for this product ("a phone-first product for a phone-first audience," Design Principle 6).

**Remediation:** add `min-width: 0` to `.ww-phase-label` (and confirm `.ww-brand`/`.header-right` have enough shrink headroom, or give the phase label a `flex-shrink: 1; max-width: ...` alongside it). This is a one-line CSS fix; recommend a real-device check on a 375px viewport once fixed.

---

### Finding 5 — Design Principles 1 and "never let a vague answer stand" have no code-level backstop anywhere except crisis language (Major, 3)

**Heuristics violated:** Error Prevention (H5).

**Where:** system-wide pattern, `chat.js`. `CRISIS_KEYWORDS` (lines 63–66) is the *only* hard-coded, code-level check in the entire guardrail/precision system. Everything else that Design Principle 1 ("one project, one thread — no drift") and the "never let a vague answer stand" guardrail depend on is prose instruction to a `claude-haiku-4-5` model (explicitly the fast/cheap tier, chosen for cost per the code comment) with **zero verification** that the model actually complied. There is no keyword/similarity check that a Phase 3 answer still references `project_label`, no re-ask loop if a vague-answer catch doesn't land on the second try, nothing analogous to `CRISIS_KEYWORDS` for the vagueness or drift cases.

This is a systemic observation more than a single bug, and it's the root cause underneath Findings 1 and 2: the product's central value proposition ("refusing to collapse three genuinely different causes into one generic verdict" — Strategy §4) rests entirely on hoped-for LLM behaviour with no fallback detection, on the one phase the strategy doc calls the most load-bearing exchange in the whole diagnostic.

**Who's affected:** every session, probabilistically — this is a reliability tax on the whole product, not a single-user edge case.

**Remediation:** at minimum, add a lightweight code-level check that the Phase 3 evidence-gathering answers can override the recorded cause (see Finding 2's second remediation option), which converts an LLM-only safeguard into a structural one for the single riskiest moment.

---

### Finding 6 — Silent fallback in `generateProfile()` on parse failure (Moderate, 2)

**Heuristics violated:** Visibility of System Status (H1); Help Users Recover from Errors (H9).

**Where:** `app.js`, `generateProfile()` catch block (lines 864–870). If the model returns malformed JSON (or an unparseable response), the code silently substitutes `fallbackTag()`/`fallbackSentence()` — reasonable defaults, correctly keyed to the recorded `cause_attribution` — but the participant is never told their profile is a generic fallback rather than a bespoke read of their specific project. Given the entire pitch of the product is "not a personality quiz, a specific read of your work," a silently generic result undermines that promise without any signal that something degraded.

**Remediation:** low-cost fix — nothing needs to change visibly for most users, but consider logging/flagging this server-side so degraded sessions are detectable in aggregate, since it's currently invisible even to the product owner.

---

### Finding 7 — Back-navigation to Phase 2b duplicates Phase 3's visible transcript on re-forward (Moderate, 2)

**Heuristics violated:** Consistency and Standards (H4); Recognition Rather Than Recall (H6, minor).

**Where:** `goBack()` (line 526) restores 2b's UI including `showInputRow()`. If the participant re-answers or simply re-clicks "That's the cause →" (`handleCauseDone()` → `transitionTo('3')`), `enterPhase3()` resets `STATE.session.p3_answers` and the API-context `STATE.messages`, but does **not** remove the previous Phase 3 Q&A from the visible `#chat-log` (transcript is append-only). The participant would see the old four-question round still on screen, followed immediately by a second "Think of one specific moment..." round starting fresh — duplicated and potentially confusing, though at least nothing is hidden.

**Remediation:** either prevent re-triggering Phase 3 from an unchanged 2b state, or insert a system divider ("— restarting from here —") so the duplication reads as intentional rather than a glitch.

---

### Finding 8 — `:has()` selector dependency for mobile brand-panel collapse, no fallback (Minor, 1)

**Heuristics violated:** none directly (not a usability problem in isolation) — noted per the audit's mobile-chrome check.

**Where:** `index.html`, `.app-shell:has(#screen-diagnostic.active) .brand-panel { display: none; }` (line 632). `:has()` has broad support in current evergreen browsers as of 2026, so this is unlikely to bite in practice, but there is no fallback for browsers that don't support it — on an unsupported mobile browser, the brand panel would persist and eat the vertical space Design Principle 6 explicitly forbids. Flagged for completeness only; not a build-blocking finding.

---

## 2. What's working (confirmed, not just hoped-for)

Worth stating plainly since three of the eight findings above touch Design Principle 2 — the parts of the spec that *are* correctly built:

- **Design Principle 2 (structured state, Phase 2b UI itself):** `btn-cause-done` is correctly `disabled` until a button is clicked (`buildCauseAttribution()`/`handleCauseClick()`), and the write to `STATE.workbook.cause_attribution` happens on click, not inferred from prose — exactly as specified. The *sequencing* relative to Phase 3 is the problem (Finding 2), not the component itself.
- **Design Principle 3 (profile outranks the funnel):** confirmed by DOM order and typography — `.profile-reveal` (with the largest type on the page, `clamp(36px,7vw,60px)` italic serif tag) renders first, `.d2m-bridge` and `#email-capture` follow, un-animated, exactly per Motion Spec §3.5's "nothing competes with the reveal for attention."
- **Reveal "play once" on resume — verified implemented correctly.** `initWelcome()` checks `saved.session.completed` *before* building the resume banner and, if true, sets `STATE.session.__resumedToClose = true` and calls `enterClose({ instant: true })`, which skips `animate-in` and the underline stroke draw entirely (`instant || reducedMotion` branch, lines 953–957) and renders the finished static state immediately. A genuinely first-time reveal (reaching Phase 4 and clicking through, including after a mid-session resume) correctly still gets the full animated sequence, because `__resumedToClose` is only ever set in the completed-session path. This resolves the motion-designer's flagged risk cleanly.
- **Regular chat API failure recovery is coherent:** `showAPIError()` preserves the participant's typed text (never lost), offers a same-message "Try again," and `retryAPI()` correctly re-splices the pending user message back into `STATE.messages` before resending. This is the one failure path in the app that's fully handled.
- **Crisis-language handling has a real code-level backstop** (`CRISIS_KEYWORDS`) in addition to the prompt-level guardrail — the only guardrail in the product that isn't purely instruction-based.
- **Mobile chrome is otherwise minimal and correct:** only `.ww-header` persists above the chat log on the diagnostic screen; the brand panel correctly disappears via `:has()` once the diagnostic/close screens are active. Aside from Finding 4's specific overflow bug, this matches Design Principle 6's intent.

---

## 3. Cognitive walkthrough — Dinesh, full flow

Dinesh: product designer, 4–5 years, scale-up. Strong craft/research, wants strategic work, keeps getting out-judged in the room by a PM. Arrives assuming this is a skill problem ("I just need to get better"), early-career enough to default to self-blame, won't self-report the political read unprompted. Success = the tool pulls the relationship-gap answer out of him despite his wrong starting theory.

**Welcome.** Clear, fast, commercial framing ("20–30 minutes," "Free · No account needed"). Dinesh, taking this in a break, will not bounce here — the copy explicitly signals contained scope, matching the audience note in Strategy §1. *Will he know what to do next?* Yes — one field, one button, disabled until filled. No friction.

**Phase 0 — Reframe.** Claude opens with the Meridian Bank story verbatim per the dev-message template. Input row and a "Continue →" both appear immediately — correctly, since Phase 0 requires no answer. Dinesh reads, clicks Continue. *Understands feedback?* Yes, the story does its job of naming a failure pattern without blame, exactly as specced.

**Phase 1a — Name a project.** Claude asks: "Bring one real, recent project to mind... What was it?" Here is where **Finding 1** bites: the "Continue to scoring →" button is already live the instant this question renders, sitting right next to the text box. If Dinesh is moving fast (plausible — he's an "isolated operator" not treating this as a big event) he could click through. Assume the more charitable path — he does type an answer, e.g. "the checkout redesign last quarter." Claude acknowledges it in one sentence, "Continue to scoring →" appears (correctly, this time, post-answer) — Dinesh proceeds. *This step works if he engages; it does not require him to if he doesn't* — a landmine that just happens not to go off in this walkthrough.

**Phase 1b — Lens scorer.** Tap grid, three lenses, each gated by presence/thin/skipped. Clear, low-ambiguity, self-explanatory buttons with plain-language descriptions ("does anyone actually want this?"). Dinesh scores Desirable=Present, Viable=Thin, Feasible=Present (plausible for someone whose complaint is being excluded from viability/strategy calls). *Will he see how to do it?* Yes — `btn-lens-done` stays disabled until all three are set, a correctly-implemented forced-completion pattern. No ambiguity here.

**Phase 1c — Skip attribution.** System picks the weakest lens (Viable/Thin) and asks: "You marked Viable as Thin on [project]. Who skipped it — you, or the organisation around you?" This is a good, sharply-framed forced-choice question that gives Dinesh explicit permission to answer "the organisation" without having to invent that framing himself. Again, though, **Finding 1** applies here too — Continue appears before he answers. Assume he engages: he might still default to self-blame ("probably me, I didn't push for it") since that's his stated pattern. Claude's one-shot vagueness catch only fires on literal hedge words ("it's complicated," "both") — a confident wrong answer like this sails through unchallenged, reflected back neutrally, and the phase advances. *Understands feedback?* Yes, but the feedback doesn't correct the misattribution — it can't, by design (this is explicitly "first-pass signal only, not yet the full three-way split" per the dev-message comment, so this alone is not a finding).

**Phase 2a — Six mindsets.** Single-select chip grid, "hardest to practise in your organisation." Dinesh picks something like "Communicate intent" or "Bias to action" — plausible for someone who feels out-argued in the room by a PM. Gated correctly (`btn-mindset-done` disabled until selected). No issues.

**Phase 2b — Name the cause. The load-bearing moment.** Claude asks the well-constructed forced-choice question: "Why is [mindset] hard to practise there? Is it something you haven't built yet, something the org won't let you do, or someone whose backing you didn't have?" This explicit three-way framing is a real strength — it puts the relationship option in front of Dinesh in words, rather than requiring him to invent it. But per his persona, he "won't self-report it unprompted" — the likely realistic answer is something like *"I think I just haven't earned the room yet, honestly. I need to get better at making the case."* This is confident, not hedged — the vagueness guardrail doesn't fire (**Finding 2/5**). Claude reflects it back in one sentence, hands off to the three buttons, and — critically — **is instructed never to contest or reframe it**. Dinesh, seeing his own words reflected back neutrally, clicks **"A skill I haven't built yet."** `STATE.workbook.cause_attribution = 'skill'` — locked. Nothing from this point forward can change it.

**Phase 3 — Where Influence Breaks Down.** Four sequential questions, chat-only, no UI chrome (correct per Design Principle 6 — this is genuinely the least encumbered phase in the app). Question 3 is precisely the one the strategy doc says exists to save Dinesh: *"Going into that moment, whose support did you have — or not have?"* Suppose he answers honestly here, now that a specific, costly moment is in front of him rather than an abstract self-assessment: *"Actually, no one senior had signed off before that meeting — my manager wasn't in the room, and the PM had already talked to leadership."* This is textbook relationship-gap evidence, exactly on cue, exactly as the persona doc predicts it would surface. **But `cause_attribution` is already `'skill'`, set two phases earlier, and nothing reads this answer to reconsider it (Finding 2).** The walkthrough breaks down here, precisely at the moment the strategy doc says the product must not fail.

**Phase 4 — Profile generation.** Claude paraphrases the cost in one message, hands off to Close. `generateProfile()` fires with `cause: 'skill'` — the locked, now-contradicted value. The resulting JSON tag/sentence will be built around a skill-gap frame ("The Undersold Practitioner" register) even though Phase 3 just produced clear counter-evidence. If the request hangs (**Finding 3**), Dinesh instead sees nothing at all for an indeterminate time, with no way back short of reloading and hoping the resume banner appears.

**Close — Profile reveal.** Assuming the request succeeds: Dinesh receives a profile diagnosing him as needing to build a skill he may well already have — the deficit-generic outcome the entire product exists to prevent (Strategy §0.1, §6: *"quietly breaks the thing that makes this diagnostic worth building"*). The card itself is well-executed (correct visual precedence per Design Principle 3, correct one-time reveal animation), which makes the miscalibrated content underneath it more convincing, not less — a well-produced wrong answer is worse than an obviously generic one.

**Net assessment for Dinesh:** the walkthrough does not fail on any single visible interaction — every tap component is legible, every button state is correctly gated (excepting Finding 1's chat-phase continue buttons), the copy is warm-with-a-backbone exactly as specced, and the reveal card is genuinely well-built. It fails structurally, upstream of the UI, in the ordering of *when* the diagnosis is locked relative to *when* the evidence that should inform it becomes available. That is precisely — almost exactly in the strategy doc's own words — the failure case Persona 2.2 exists to test for.

---

## 4. Direct answers to the audit's specific checks

- **Does the UI/copy genuinely resist letting a vague answer pass at 2b?** Partially. The upfront question is well-framed (explicit three-way choice in plain language) and the forced-choice buttons correctly require an explicit click (no bypass at 2b itself — contrast Finding 1's 1a/1c bug). But the resistance to *vagueness* is a single LLM-judged, hedge-word-keyed nudge with no code backstop (Finding 5), and it has no mechanism at all for a *confident but wrong* answer — the more likely failure mode for this persona. There is also no link between what's typed in the 2b chat exchange and which button gets clicked; the two are never cross-checked.
- **Is there a real mechanism (not just hoped-for LLM behaviour) preventing drift across phases (Design Principle 1)?** No. `project_label` is captured once in Phase 1a and interpolated into every later developer-message template server-side, which is a reasonable anchor mechanism *if it's ever set* — but nothing prevents it from being empty (Finding 1), and nothing verifies that a participant's free-text answers in Phase 3 still refer to the same project; that constraint is prompt-only.
- **What happens if the API call fails mid-phase?** For ordinary chat turns (`callAPI()`), recovery is well-built: text is preserved, retry works, distress-flag context is retained. For the one call that matters most — `generateProfile()` — there is no timeout at all (Finding 3), which is a real gap, not a hypothetical one.
- **Mobile portrait — does anything above the chat log persist and eat vertical space?** Only the intended single thin header bar, correctly matching Design Principle 6 — except that header itself has a truncation bug (Finding 4) that could, on a narrow device with a long phase label, overflow and risk hiding the support-panel trigger.
- **Is the reveal's "play once" behaviour on resume actually implemented?** Yes, confirmed correct — see §2 above. This is not a residual risk.

---

## 5. Priority for the Fix round

1. Finding 1 (premature Continue, 1a/1c) — Critical, small fix, high leverage.
2. Finding 2 (cause-attribution sequencing) — Critical, requires a design decision (reorder vs. add revision step), not just a code patch — flag for design-lead input before the builder proceeds.
3. Finding 3 (`generateProfile()` timeout) — Major, small fix, mirrors existing pattern.
4. Finding 4 (mobile header overflow) — Major, one-line CSS fix, verify on a real 375px device afterward.
5. Finding 5 (systemic instruction-only enforcement) — Major, best addressed as a side effect of fixing Finding 2's remediation.
6. Findings 6–8 — Moderate/Minor, fix if time permits.
