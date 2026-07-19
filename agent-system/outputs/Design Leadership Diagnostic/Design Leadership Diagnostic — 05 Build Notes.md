# Design Leadership Diagnostic — Build Notes

Prepared by: Design Builder (DB)
For: accessibility-reviewer, design-critic, heuristic-evaluator, Creative Director
Covers: an audit of the already-built `index.html` / `app.js` against the design, content, and motion specs, followed by notes on the backend build (`chat.js`, `subscribe.js`, `package.json`) produced in this pass.

---

## 1. Frontend audit (index.html / app.js — not rebuilt, verification only)

### 1.1 Speaker-turn styling vs the asymmetric-hairline-rule spec — PASS

The Design Lead's spec (per the Strategy doc's Editorial-register call and the Inspiration doc's deposition-transcript / Judd-box references) calls for speaker turns rendered as an asymmetric hairline rule — cobalt left-border for Claude, ink right-border for the participant — with no fill, no radius, no shadow. This is confirmed correctly implemented, not reverted to a filled-bubble pattern:

- `.dl-msg-claude-inner` (`index.html` ~line 256): `background: transparent; border: none; border-left: 2px solid var(--cobalt); padding: 2px 0 2px 20px;`
- `.dl-msg-user-inner` (~line 267): `background: transparent; border: none; border-right: 2px solid var(--ink); padding: 2px 20px 2px 0; text-align: right;`
- Global reset at the top of the stylesheet (`button, input, textarea { border-radius: 0; }`) plus no `border-radius` set anywhere on `.msg`, `.dl-msg-claude-inner`, or `.dl-msg-user-inner` — no rounding anywhere in the chat log.
- No `box-shadow` on either speaker-turn class. The one shadow in the whole stylesheet is on `.support-panel` (a floating overlay, explicitly commented as "the one functional shadow exception — floating panel depth cue"), which is a defensible, separately-scoped exception, not a leak into the chat log itself.
- The typing indicator (`.typing-dots`) reuses the same `border-left: 2px solid var(--cobalt)` treatment rather than inventing a bubble/spinner pattern, keeping the vocabulary consistent even for a transient state.

No fix needed here. This is the cleanest match to spec in the build.

### 1.2 Four-thread model — no three-lever leakage found

Checked every surface that scores, lists, or summarises organisational influence, per Design Principle 1 (four threads, always, never three):

- `THREADS` array (`app.js` line 12) — four entries: Budget Authority, Roadmap Influence, Executive Trust, Relationship Capital, each with its own forced-choice pair (Relationship Capital correctly uses its own "who's backing me / who I owe" pair rather than being forced into the "I shape this" template used by the other three, matching the content copy doc's explicit rationale).
- `PHASE_META` (line 48) — Phase 1 is subdivided into four sub-phase keys (`1-budget`, `1-roadmap`, `1-trust`, `1-relationship`), all labelled "The Four Threads."
- `showThreadCard` / `handleThreadSubmit` — iterate `THREADS.length` (4), not a hardcoded 3.
- `renderReveal` (line 671) — the Close-screen thread strip renders via `THREADS.forEach`, unconditionally showing all four, matching the content copy doc's handoff note #4 ("this copy deck never produces a card that silently drops Relationship Capital because it wasn't the headline thread").
- `buildClaudeContinueLink` (line 703) — the Claude hand-off text also lists all four threads via the same `THREADS.forEach`.
- `buildFallbackReveal` (line 645) — the deterministic safety-net reveal (used if Claude's JSON payload fails to parse) also searches all four threads (`order = ['trust','roadmap','budget','relationship']`) for the clearest gap, so even the failure path doesn't silently drop the fourth thread.
- Grepped the whole app for "three-lever"/"three thread" language — no matches outside a comment in the new `chat.js` (written this pass, referring to the model it supersedes, not a leftover).

No fix needed. The frontend was built correctly against the four-thread model throughout.

### 1.3 Other spec conformance notes (not requested, flagged as observed in passing)

- Payment/paywall gating on the Intake screen is explicitly stubbed with a `TODO` (both in `app.js`'s `initIntakeOnce` and `index.html`'s Intake screen markup), proceeding straight to the diagnostic. This matches the orchestrator's brief that payment integration is out of scope for this build, and the unconfirmed-payment error copy from the Content Copy doc (§6.2) is noted inline as ready to wire in later. Flagging only so it isn't mistaken for an oversight — it's an intentional, documented deferral already called out by the prior pass.
- The `STORAGE_KEY` constant (`dld_session_v1`) is commented as "proposed in the design spec, Open Thread §4.5 — flag for sign-off." Leaving this as-is; it's a naming sign-off question for the design-lead, not a build defect.

---

## 2. Backend build (this pass)

### 2.1 Files produced

- `design-leadership-diagnostic-app/netlify/functions/chat.js`
- `design-leadership-diagnostic-app/netlify/functions/subscribe.js`
- `design-leadership-diagnostic-app/package.json`

All three follow `why-workshop-app-v2`'s exact technical pattern: ESM (`type: module`), `@anthropic-ai/sdk` client constructed per-invocation from `process.env.ANTHROPIC_API_KEY`, a cached top-level `SYSTEM_PROMPT` block (`cache_control: { type: 'ephemeral' }`) plus an uncached per-phase developer message, `claude-haiku-4-5-20251001`, JSON-in/JSON-out over a Netlify function handler, no CORS headers (same-origin, matching the reference — `why-workshop-app-v2` has none either). Kit (ConvertKit) tagging pattern in `subscribe.js` is copied structurally unchanged — same `getOrCreateTagId` / `tagSubscriber` helpers, same two-tag pattern (a `track:` tag and a `stage:diagnostic-complete` tag).

### 2.2 chat.js — phase/payload verification against app.js

Read `app.js`'s `fetch('/api/chat', …)` call (line 318) precisely before building. The request body is:
```
{ phase: STATE.session.phase, name, messages, diagnostic: STATE.diagnostic, distress_flag }
```
— note the field is `diagnostic`, not `workbook` (the Why Workbook's field name). `chat.js` destructures it as `diagnostic` accordingly, not copied blindly from the reference. Response shape returned is `{ content, distress }`, matching what `callAPI` expects (`data.content`, `data.distress`).

Phase codes handled, matching `PHASE_META` / `STATE.session.phase` exactly: `reframe`, `1-budget`, `1-roadmap`, `1-trust`, `1-relationship`, `2-open`, `2-probe`, `3`, `4`, plus a generic default fallback.

Phase-specific logic notes:

- **`1-<key>` phases carry two distinct turns on one phase code**, discovered by tracing `transitionToThread` vs `handleThreadSubmit`: an *opening* call (`apiText: null`, before the thread-scorer card renders — `diagnostic.threads[key]` not yet set) and an *acknowledgment* call (`apiText` = the submitted choice/evidence — `diagnostic.threads[key]` already set, since `app.js` writes to `STATE.diagnostic.threads` before calling the API). `chat.js` branches on `threads[key]` presence to tell these apart, since the phase code alone doesn't distinguish them. The Phase 1 intro line ("Organisational influence runs through four threads…") is scripted to fire only on the `budget` thread's opening turn, matching the content copy doc's single-use placement.
- **Phase 1's "vague answer" guardrail could not be wired as a blocking loop.** The content copy doc calls for a repeatable "That's a description, not an example" follow-up at every thread. But `handleThreadSubmit` in the already-built `app.js` commits the evidence and swaps the card for a summary immediately on submit — there's no UI path back to re-open a thread card after submission. I did not alter `app.js` (out of scope), so `chat.js`'s acknowledgment-turn instruction for `1-<key>` allows Claude to note thin evidence in its one-sentence acknowledgment but does not block progression, since the frontend has already committed and moved on by the time the API responds. **Flagging this as a spec/frontend mismatch for the design-lead**, not resolving it myself: the full repeatable-follow-up behaviour the content copy doc specifies is only actually achievable in Phase 2 (`2-probe`) and Phase 3 (`3`), which are free-text chat turns where the participant can be re-prompted before the Continue button is used. If blocking enforcement at the Phase 1 card level is wanted, it needs a frontend change (hold the card open pending a "sufficient evidence" signal from the API) — a decision I'm surfacing, not making.
- **Phase 3 has no sub-phase codes** for its three sequential questions (`app.js` only ever sends phase `'3'`). `chat.js` instructs Claude to infer progress from the trailing conversation history (last 10 messages, per the existing truncation in both `app.js` and `chat.js`) rather than tracking a counter server-side, since the function is stateless between calls. This mirrors how `why-workshop-app-v2/chat.js` handles multi-turn phases like `2b` and `4bc` (instructing Claude to read the conversation for continuity) rather than introducing new state fields `app.js` doesn't send.
- **Phase 4** is a single call producing the full reveal in one response: an exact opening line, a fenced ```json block with the five keys `app.js`'s `extractRevealJSON` regex expects (`headline_thread`, `profile_sentence`, `lime_phrase`, `why_line`, `quoted_fragment`), and an exact closing line. The instructions explicitly require `lime_phrase` to be an exact substring of `profile_sentence` and `quoted_fragment` an exact substring of `why_line`, since `renderReveal` in `app.js` does a literal `.includes()` check before highlighting — if Claude paraphrases instead of quoting exactly, the highlight span silently fails to render (falls back to plain text, not an error), so this was called out explicitly and twice in the prompt. `max_tokens` is raised to 700 for phase `4` only (vs 400 elsewhere) to give the structured payload room.
- **Distress handling is two-tiered**, matching the two distinct distress mechanisms already built into `app.js`: (1) client-side `CRISIS_KEYWORDS` matching (suicide/self-harm language) sets `distress_flag: true` in the request body — when present, `chat.js` fully overrides the developer message to a pause-coaching, no-phase-advance response, mirroring `why-workshop-app-v2/chat.js`'s crisis-protocol override. (2) A lighter in-conversation guardrail (ordinary burnout/distress signals, not crisis language) is one of the three near-verbatim guardrail lines in `SYSTEM_PROMPT`, and `detectDistressInResponse` watches for that line's own phrasing so that if Claude uses it unprompted, the response sets `distress: true` and the client persists the Lifeline note — same detection pattern as the reference file, different trigger phrases (matched to this product's actual guardrail line, not the Why Workbook's).
- The three guardrails (cynicism/defeat, naming-and-blaming an executive, distress) are reproduced in `SYSTEM_PROMPT` at near-verbatim fidelity to the Content Copy doc §3.6, as instructed — not paraphrased.

### 2.3 subscribe.js adaptation

Field names updated from the Why Workbook's `workbook` payload (`values_top3`, `statement_draft`) to this product's `diagnostic` payload shape (`diagnostic.reveal.profile_sentence`, `diagnostic.trap.name`, `diagnostic.threads.<key>.choiceText` for all four threads). Tags changed to `track:design-leadership-diagnostic` / `stage:diagnostic-complete` (parallel structure to the Why Workbook's `track:come-home-to-yourself` / `stage:diagnostic-complete`, new track name for the new product, same stage-tag convention). Email validation regex and error-handling/status-code structure copied unchanged.

### 2.4 package.json

Copied `why-workshop-app-v2/package.json`'s structure exactly (ESM, `@anthropic-ai/sdk: latest`, `private: true`), renamed to `design-leadership-diagnostic`.

### 2.5 Deployment config — not addressed, flagging

Neither `why-workshop-app-v2` nor `design-leadership-diagnostic-app` has its own `netlify.toml`. The repo-root `netlify.toml` only points at `why-workshop-app/netlify/functions` (the old v1 app), so `why-workshop-app-v2` is evidently deployed as its own separate Netlify site with functions directory and redirects configured via the Netlify dashboard, not committed to the repo. `design-leadership-diagnostic-app` will need the same treatment (a separate site, or a dashboard-level functions-directory + `/api/chat` and `/api/subscribe` redirect config) before `app.js`'s `fetch('/api/chat')` / `fetch('/api/subscribe')` calls will resolve in production. This is a deploy-configuration task outside this pass's file scope, surfaced for whoever owns Netlify site setup.