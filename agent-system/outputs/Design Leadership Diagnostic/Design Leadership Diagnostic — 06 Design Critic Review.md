# Design Leadership Diagnostic — Design Critic Review

Prepared by: Design Critic (DC)
For: Design Builder (Fix round), Design Lead, Creative Director
Reviewed: `design-leadership-diagnostic-app/index.html`, `app.js`, `netlify/functions/chat.js`, `subscribe.js`, `netlify.toml`, `package.json`
Against: Strategy doc (7 principles), Inspiration doc (Editorial register), Design Spec, Content Copy, Motion Spec, Build Notes

---

## Headline finding

The structural bones of this build are genuinely good — the four-thread model is bulletproof throughout, the asymmetric hairline speaker-turn is executed exactly to spec, and the screen order and component library match the Design Lead's brief with unusual fidelity for a first build pass. But the single most carefully-argued discipline in the entire design package — the four-use ember ledger, "exhaustive, not illustrative" — has one guaranteed live leak and one unverified, structurally uncontrolled channel for further leakage. Both are concrete, code-level findings, not aesthetic opinions, and both sit directly on Principle 5, the principle every upstream doc flagged as the one most likely to erode under build pressure. That is exactly what has started to happen here, quietly, in two places nobody's own audit caught.

---

## Principle-by-principle verdict

**1. Four threads, always, never three — HONOURED.**
Checked every surface that scores, lists, or summarises influence. `THREADS` array (`app.js:12`), `PHASE_META`'s four `1-*` sub-phase keys, `renderReveal`'s unconditional `THREADS.forEach`, `buildFallbackReveal`'s four-way search order, `buildClaudeContinueLink`'s four-line dump, and `subscribe.js`'s four `threads.*` fields all carry Budget Authority / Roadmap Influence / Executive Trust / Relationship Capital, never three. `chat.js`'s `SYSTEM_PROMPT` states it explicitly: "FOUR THREADS — always four, never the superseded three-lever model." No three-lever leakage anywhere in the app files. This is the cleanest, best-evidenced pass in the whole review.

**2. Named pattern, not a score — HONOURED.**
`profile_sentence` is a dynamic two-declarative-sentence template, never a number. Grepped the whole app for `progress|percent|score:|gauge|badge` — the only hits are the copy text of the rule itself ("No percentile, no maturity level") and an unrelated `hasProgress` boolean naming a resume-banner state, not a UI score.

**3. Evidence before judgment, every phase — PARTIALLY HONOURED.**
The "no evidence at all" case is enforced: `handleThreadSubmit` (`app.js:502-523`) shakes and blocks if the evidence field is empty. But the principle's actual load-bearing clause — "never let a vague answer stand" — is confirmed real by the Build Notes' own admission and verified by me in code: `handleThreadSubmit` commits the evidence to `STATE.diagnostic.threads` and replaces the card with a summary *before* the API is ever called, so there is no code path back into a Phase 1 thread card once submitted. `chat.js`'s own instruction for the acknowledgment turn says it outright: "you may note that plainly... but do not block progress — the next thread's card is coming regardless" (`chat.js:132`). The full enforcement mechanism only works in Phase 2's probe and Phase 3's three questions, which are free-text turns Claude can re-prompt. That means 4 of the diagnostic's evidence-gathering moments (all of Phase 1) have no real vague-answer enforcement, only a "did you type something" gate — on the exact phase that opens the entire session, for a persona explicitly profiled as someone who "will detect a scripted quiz... faster than a junior audience would."

**4. Strengths-framed, never deficit-framed — HONOURED.**
`SYSTEM_PROMPT`: "Never imply she is deficient, behind, or should feel behind peers... her prior competence is never in question — the gap is structural." Trap copy in both `TRAPS` (`app.js:35-39`) and the system prompt frames each as something "brought in to," "measured on," "has learned not to" — system-caused, never chosen.

**5. No comparative or visible failure state, ever — PARTIALLY HONOURED, AND ACTIVELY AT RISK.**
No progress bar, gauge, percentage, or score exists anywhere in the CSS or markup — the headline threat this principle names is fully avoided. But this principle's actual mechanism, per every upstream doc, is the ember accent economy ("this product's entire credibility rests on never letting the result feel gradeable" is executed, concretely, as "four ember uses, none of them negotiable up"). That economy is already broken in the shipped code — see Ship Blockers #1 and #2 below. A ledger that leaks is the practical, load-bearing form this principle takes in this build, and it's leaking.

**6. The paid moment earns its own screen — HONOURED, with one live caveat.**
The Intake screen does real, distinct work: the is/is-not list (`index.html:584-601`), the ink-block privacy device modelled directly on the Inspiration doc's redaction-bar reference (`index.html:603-606`), and the five-item "what you leave with" list are not a thin pass-through — they match Design Spec §2.2 almost line for line and are genuinely absent from the Welcome screen, so the screen earns its keep. The caveat: the "Begin" CTA (`app.js:814-821`) proceeds unconditionally with a `TODO` comment — the screen currently *talks about* taking $500 seriously without confirming $500 was paid. Acknowledged and tracked, not a design oversight, but it means this principle isn't fully proven until payment gating exists.

**7. Immediate, in-session reveal, never "we'll email your report" — HONOURED.**
`enterPhase4` → `finishToClose` renders the profile synchronously in the same session off the same API call (`app.js:620-667`). The email capture on Close is explicitly optional/secondary ("Skip — I'll save it myself") and never the delivery mechanism for the result itself.

---

## Craft and quality, beyond the principles

The asymmetric hairline speaker-turn — the single most-watched decision in the Design Lead's brief — is executed correctly and precisely: `border-left: 2px solid var(--cobalt)` for Claude, `border-right: 2px solid var(--ink)` for the participant, zero fill, zero radius, zero shadow on either (`index.html:255-273`). This does not read as a Coaching-register bubble wearing a new coat of paint; it reads as the deposition-transcript reference it was built from. The Close-screen reveal correctly has no box at all, and the bridge ordering (reveal → Continue-in-Claude → email capture → Design-Led: Leader upsell) matches the Design Lead's deliberate, reasoned departure from the sibling product's spec exactly, including which bridge gets the cobalt border and which doesn't. For a first build pass this is unusually faithful execution — most of the "$500 craft" test passes.

Two things pull it back down toward "reskin" territory, both concrete:

**The typing-indicator dots use `border-radius: 50%`** (`index.html:290`) — a literal, if tiny, exception to "zero border-radius... on any element in this product," and unlike the support-panel's shadow, it's nowhere named as a sanctioned exception. Inherited unchanged from the Why Workbook per the Motion Spec's explicit instruction not to touch it, so this is defensible, but it should be a *documented* exception, not a silent one.

**"I'll send this as a PDF"** (Close screen offer copy) has no PDF-generation code anywhere in this build — `subscribe.js` only tags a Kit subscriber with text fields (`subscribe.js:78-86`). This is almost certainly fulfilled by a downstream Kit automation, the same way the Why Workbook presumably does it, but that dependency is invisible and unverified from this codebase. At $500, a promised deliverable that silently doesn't arrive is a much worse trust failure than it would be on the free tool.

---

## Ship blockers

**1. Ember ledger violation: form-validation error uses ember.**
`index.html:521` — `.ec-error { color: var(--ember); ... }`, applied to the "That's not a valid email address" message on the Close screen. This is a live, guaranteed-to-render fifth use of ember, and it is precisely the failure mode the Design Spec pre-emptively named and forbade by name: *"If a build pass finds ember anywhere else — a hover state, a form error, a chip fill — that's a bug, not a stylistic choice, and should be flagged back to design-lead before shipping."* This isn't a grey area — the spec used "a form error" as its own example of what not to do, and that's exactly what shipped. **Fix:** change to `var(--ink)` or `var(--charcoal)`. Trivial to fix; not trivial to have missed, since it directly contradicts the ledger's own explicit worked example.

**2. Ember ledger item #2 is unwired — and the mechanism that would fire it is completely unguarded.**
Design Spec §3.4 specifies that the "named it back" moment in Phase 2 — the trap name landing in ember for the first time — happens because Claude's prose literally contains `**the Silent Expert**`, which `app.js`'s `renderClaudeInline` (`app.js:152-156`) converts to `<em class="dl-ember">`. I checked `chat.js`'s entire `SYSTEM_PROMPT` and every phase's `buildDeveloperMessage` branch, including `2-probe`, for any instruction to emit `**...**` markdown around the trap name (or anywhere) — there is none. Grepped for `**`, `bold`, `markdown`, `emphasis`: zero matches. Two consequences, both bad: (a) ledger item #2 most likely never fires as designed — the "pattern gets a name for the first time" moment described in the Inspiration and Design Spec docs will render as plain ink text, silently degrading the ledger from four uses to three without anyone noticing; and (b) because `renderClaudeInline`'s bold→ember conversion applies to *every single Claude message in the product*, with zero phase gating and zero validation against an expected string, nothing stops Claude from spontaneously bolding some other phrase at some other point in a 20-30 minute session and having it render in the scarcest, most meaning-laden colour in the system — directly the outcome the Design Lead named as the one thing ember must never become: *"a general-purpose 'important word' emphasis device."* This wasn't caught by the Build Notes' own audit, which verified the CSS matched spec but didn't trace whether the trigger for that CSS is actually reachable. **Fix:** either (a) instruct Claude explicitly to emit `**trap name**` on the correct turn and gate `renderClaudeInline`'s conversion to only the phases where ember is licensed (2-probe acknowledgment, Phase 4 quoted fragment), validating the bolded string against the actual trap/thread name before rendering it in ember — not trusting free-form model output to self-regulate a four-times-only budget.

**3. Payment gating is stubbed — Intake proceeds unconditionally.**
`app.js:811-821`, marked `TODO`, explicitly out of scope for this build pass per the orchestrator's brief and already flagged in Build Notes §1.3 and §2.5. Listing it here anyway because a $500 product cannot ship live with an unconditional path past the paywall, regardless of whose queue it's sitting in. Not a design defect — the Intake screen's actual content and structure are correct and ready — but the product cannot go live until this is wired.

---

## Fix round items

**1. Phase 1's vague-answer enforcement gap (Principle 3).** See verdict above. Recommend either holding the thread card open pending a lightweight sufficiency signal from the API before allowing "next thread" (the real fix), or explicitly documenting the enforcement asymmetry in the Strategy/Content docs so it's a known, accepted trade-off rather than a silent gap between what Principle 3 promises and what Phase 1 delivers.

**2. Design Spec Open Thread #1 was never resolved before build.** The Design Lead named "cobalt spent on every single Claude message" as *"the single highest-stakes call in this document"* and explicitly recommended building a short comped sequence and taste-checking it before committing, with a named fallback (typographic label only, no colour on the rule) if it reads as decoration by minute ten. The build shipped the primary option directly, with no evidence the taste-check happened. Given how much weight the upstream docs put on this exact call, it should be taste-checked now, before ship — reworking it after launch is a much larger cost than reworking it now.

**3. Confirm the PDF-delivery mechanism actually exists** for this product's specific Kit tags (`track:design-leadership-diagnostic` / `stage:diagnostic-complete`) before ship. Copy promises a PDF; nothing in this codebase generates or sends one.

**4. Document the typing-dot `border-radius` as a sanctioned exception** (or remove it) so the "zero border-radius, no exceptions but one" rule has an accurate exception list.

---

## Post-ship improvements

1. `localStorage` key `dld_session_v1` still carries its "proposed, not confirmed" comment (Design Spec Open Thread #5) — needs a one-line sign-off, no functional risk.
2. The "held-silence" pacing device at phase transitions (Design Spec Open Thread #7, Motion Spec §3.1.3) — flagged as a genuinely strong idea by two separate agents, still unclaimed and unimplemented. Worth a post-ship pass, not launch-blocking.
3. `.chat-log` sets both `width: 100%` and `align-self: flex-start` (`index.html:236`) — the latter has no effect given the explicit width; harmless dead CSS, worth a cleanup pass.

---

## Ship recommendation

**Ship with fixes.** The architecture, the four-thread integrity, the speaker-turn treatment, and the screen-level craft are all executed at a level that genuinely earns the $500 register — this is not a free-tool reskin. But the product cannot ship with a documented, self-contradicting ember leak sitting in a form-error state, nor with the ledger's second use case running on an unwired, unguarded assumption about model behaviour — both are direct hits on Principle 5, the principle every upstream doc singled out as the one to protect hardest. Fix the two ember issues (Ship Blockers #1–2), wire payment gating (#3, already tracked), and this is ready. None of the Fix Round items should hold the release if the team's timeline is tight, but Principle 3's Phase 1 gap deserves a real decision, not a silent pass, before the next iteration.
