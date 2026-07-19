# Design Thinking Diagnostic — Build Notes

Prepared by: Design Builder (DB)
For: Design-critic, accessibility-reviewer, heuristic-evaluator, and the design-lead/strategist/content-writer for any follow-up passes.
Scope: this pass built the three backend files only (`netlify/functions/chat.js`, `netlify/functions/subscribe.js`, `package.json`). `index.html` and `app.js` were built in a prior pass and were **not** modified — Section 1 below is a read-only fidelity audit against the upstream Design Spec, Motion Spec, and Content Copy docs, done to catch anything worth flagging before Review.

---

## 1. Audit of the pre-built `index.html` / `app.js` against spec

Overall fidelity is high — copy is near-universally verbatim from the Content Copy doc (not paraphrased), the three new tap components match the Design Spec's colour/state logic exactly, and the phase-transition pacing (400ms/400ms, `REPLAYING`-gated) matches the Motion Spec's numbers precisely. One significant motion bug and two minor gaps found:

### 1.1 Significant — the Profile reveal's tag-fade timing collapses the flagship pause (Motion Spec §3.5)

The Motion Spec is explicit and repeated that the 500ms held pause before the profile tag appears (T=200→700ms) is *"the single most important non-visual beat in this document"* and must not be compressed to zero. In the shipped CSS:

```css
.profile-reveal.animate-in .pr-evidence { animation: msgIn 0.2s ease forwards; }
.profile-reveal.animate-in .pr-citation { animation: msgIn 0.2s ease 0.1s forwards; }
.profile-reveal.animate-in .pr-tag { animation: tagFade 0.15s ease forwards; }
```

`.pr-tag`'s `tagFade` animation has no `animation-delay`. It starts at T=0 alongside the evidence sentence and finishes at T=150ms — instead of starting at T=700ms per spec. The underline stroke is still correctly deferred via `setTimeout(drawUnderlineStroke, 1000)` in `app.js`, so the net effect is: the tag becomes fully visible almost immediately, then sits fully-formed and unmarked for ~850ms before the underline draws — the inverse of the intended choreography (bare evidence → held silence → tag arrives → brief unmarked pause → stroke confirms it). This is a one-line CSS fix (`animation: tagFade 0.15s ease 0.7s forwards;`) but it's worth flagging clearly since it undercuts the one sequence both the Design Spec and Motion Spec single out as the highest-stakes moment in the product.

### 1.2 Minor — mindset chips drop their descriptor copy

`app.js`'s `MINDSETS` array carries a `desc` field for all six mindsets, copied verbatim from Content Copy §4.2 ("Empathy first — *the user's reality over your own assumptions*", etc.) — but `buildMindsetSelector()` only renders `m.key` as `chip.textContent`; the `desc` field is dead data, never shown to the participant. This actually matches the *Design Spec's* component contract for §2.3 literally (plain-label chips, no descriptor line, unlike the lens-scorer/cause-attribution buttons which do get a label+desc treatment) — so it's not a bug against the Design Spec, but it is a real gap against the Content Copy doc's evident intent in providing descriptors for every mindset. Worth a design-lead call: either render the descriptors (matching the other two components' pattern) or strip the unused `desc` field so it's not silently-dead content.

### 1.3 Minor — press-feedback scale lacks its own transition

Motion Spec §3.1 specifies the shared `:active { transform: scale(0.98) }` press state should be `0.08s ease`. The shipped CSS lists `background-color, border-color, color, box-shadow` in the `.lens-state-btn, .mindset-chip` transition property list but not `transform`, so the scale-down/up on tap is an instant snap rather than a brief eased dip. Cosmetic, unlikely to be noticed, but worth a one-line fix (`transform 0.08s ease` added to the shared transition list) if a Fix round touches this file anyway.

### 1.4 Noted, not a defect — box-shadow used in two places, not one

Design Spec §1.3 says box-shadow should appear in exactly one place (`.support-panel`). The confirm-pulse on the cause-attribution buttons (`§2b`) also uses `box-shadow`. This is actually the *correct* resolution of a genuine conflict between the two upstream docs: Motion Spec §3.3 explicitly recommends `box-shadow` over animating `border-width` for the confirm-pulse specifically to avoid a layout reflow, and names it as the reason. The build followed the more specific, technically-justified instruction. Flagging only so a reviewer doesn't independently flag it as a Design Spec violation without the context.

### 1.5 Copy fidelity — spot check passed

Checked Welcome copy, resume banner, header microcopy, lens/cause labels and descriptors, done/confirm button labels, email capture copy, API-error and subscribe-fail copy, and support panel copy against Content Copy §1–§7 line by line: all verbatim or near-verbatim, including the two content-writer fixes (the rewritten `showAPIError()` text and the newly-added subscribe-failure copy) that were flagged in Content Copy §7 as needing to replace the Why Workbook's weaker originals — both are correctly present here, not just inherited unchanged. Where the Design Spec's own placeholder copy differed from the Content Copy doc's final wording (lens-state descriptors, cause labels, the `.pr-eyebrow`/`.pr-credit` text), the build correctly used the content-writer's copy, not the design-lead's draft — the right precedence.

---

## 2. This pass's build: `chat.js`, `subscribe.js`, `package.json`

**Payload shape verified against `app.js`, not assumed.** `callAPI()` posts `{ phase, name, messages, workbook, distress_flag, turn, ...extra }`; the Phase 1c call adds `{ lens, lens_state }`; the separate `generateProfile()` call posts `{ phase: 'profile', name, messages, workbook, distress_flag, routed_module }` to the same `/api/chat` endpoint but expects a raw-JSON-in-`content` response instead of a chat bubble. `chat.js`'s handler destructures all of these directly from `body` and `buildDeveloperMessage()` branches on `phase` including a dedicated `'profile'` case — confirmed against the actual `fetch` calls in `app.js`, not inferred from the Why Workbook's field names.

**Phase 3's turn arithmetic.** `STATE.session.p3_answers` ("turn") is read *before* it's incremented in `sendMessage()`'s `onSuccess`, so the same `turn` value is sent both for "no answer yet, asking question N" and "just answered question N, need question N+1." `chat.js` disambiguates by checking whether the last message in the `messages` array is the `[Phase 3 — begin now]` placeholder (initial call) or real user text (an answer), then maps `turn` → which of the four fixed questions to ask/reflect. Documented inline in the phase-`3` case since this arithmetic isn't obvious from the payload alone.

**Phase 2b's one-shot structural constraint.** In `app.js`, `phaseOnResponse` for `2b` unconditionally reveals the cause-attribution tap component after exactly one round-trip, regardless of what Claude's reply says — there's no mechanism for the backend to gate the component behind a "the vague-answer catch actually landed" check. So the Content Copy's "it's complicated" follow-up and the handoff to the buttons had to be written as *one* reply, not a real two-turn exchange. This is a pre-existing frontend architecture constraint (not something I could fix without touching `app.js`, which was out of scope) — flagging it for the design-lead/strategist in case a future revision wants Phase 2b to actually gate on a resolved answer rather than always advancing after one exchange.

**Distress protocol extended beyond Content Copy §5.** The content doc gives one guardrail line for generic "distress or burnout" signals. The frontend already has its own `CRISIS_KEYWORDS` list and surfaces a Lifeline (13 11 14) line in the API-error state whenever `distress_flag` is set — implying the product needs a harder response tier for acute crisis language, not just workplace overwhelm. I added a second, stronger crisis-tier line (mirroring Why Workbook's own crisis protocol, same Lifeline number already used in this app's support panel) alongside the near-verbatim burnout line, and instructed the model to pick the appropriate one. This is a reasoned addition beyond the content copy doc's literal text, done for safety parity with the Why Workbook and with this app's own existing crisis-keyword/Lifeline UI — flagging in case the content-writer wants to author that crisis line directly rather than inherit my paraphrase of the Why Workbook's.

**Profile-phase output contract.** `phase: 'profile'` gets its own developer-message branch instructing pure-JSON output (`{tag, sentence, next_question}`), matching what `generateProfile()` in `app.js` parses (it strips code fences defensively and falls back to `fallbackTag()`/`fallbackSentence()` on any parse failure, so a malformed response degrades safely). Kept the same model (`claude-haiku-4-5-20251001`) and `max_tokens` as every other call to match why-workshop-app-v2's exact technical pattern per the brief — worth a note that this is the single highest-value piece of copy the product produces (the tag/sentence a participant might screenshot or say out loud), so it may be worth A/B-testing a stronger model here specifically if early sessions show weak tags; not changed in this pass to keep the pattern match exact.

**Module routing.** The `routed_module` the profile prompt uses comes from `app.js`'s own `MODULE_ROUTES` lookup (already flagged in that file's comments as partly inferred beyond the content-writer's four sourced examples) — `chat.js` treats it as ground truth from the frontend rather than re-deriving or second-guessing it, per Content Copy §8 handoff note 3.

**No CORS headers.** why-workshop-app-v2's `chat.js` doesn't set any CORS headers (same-origin Netlify Functions calls), so none were added here either — matching the "exact technical pattern" instruction literally rather than the brief's passing mention of CORS.

**`subscribe.js`.** Same Kit v4 tag-and-fetch structure as the Why Workbook's, with two adaptations: Kit tags renamed to `track:design-thinking-diagnostic` / `stage:diagnostic-complete` (no existing naming convention for this product to inherit, so I followed the Why Workbook's own `track:` / `stage:` pattern), and the `fields` payload swapped from the Why Workbook's `statement_draft`/`next_move` to this product's actual workbook shape: `project`, `profile_tag`, `profile_sentence`, `cause_attribution`, `routed_module`.

**`package.json`.** Identical structure to why-workshop-app-v2's, `name` changed to `design-thinking-diagnostic`.

---

## 3. Follow-up needed — deployment wiring (found, not fixed, out of scope for this file list)

The repo's root `netlify.toml` currently routes **both** `/api/chat` and `/api/subscribe` to `why-workshop-app/netlify/functions` — the original v1 Why Workbook app, not even `why-workshop-app-v2`. There is no per-app routing anywhere in the repo. As built, `design-thinking-diagnostic-app/index.html`'s calls to `/api/chat` and `/api/subscribe` will hit the wrong app's functions (or nothing, depending on how the site is actually deployed) unless one of two things happens before this ships:

1. This app is deployed as its own separate Netlify site, each with its own `netlify.toml`/functions directory, or
2. The root `netlify.toml` is restructured with path-prefixed redirects (e.g. `/design-thinking-diagnostic-app/api/chat` → this app's functions) so multiple apps can share one site.

This is a deployment/infra decision, not a design-builder call, so I didn't touch `netlify.toml` — flagging it clearly since the backend built in this pass is functionally correct but currently unreachable from the shipped frontend without one of the above.
