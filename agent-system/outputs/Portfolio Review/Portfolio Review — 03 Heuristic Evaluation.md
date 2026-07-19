# Portfolio Review — 03 Heuristic Evaluation

**Evaluator:** Heuristic Evaluator (HE) — Nielsen's 10 Usability Heuristics + cognitive walkthrough
**Method:** Static review of source (HTML/CSS/JS) — interaction logic traced by reading `<script>` blocks, not exercised in a live browser. Anywhere behavior depends on runtime conditions (network failure, mobile OS tab-eviction, CDN latency) is flagged explicitly as **needs live-test confirmation**.
**Scope:** 5 touchpoints across the Frankly Human site.

## Personas used

No formal personas exist for this project yet. For the cognitive walkthroughs below I used four inferred user types, as instructed:

- **(a) Prospective participant** — browsing the portal on a phone, deciding whether to sign up for a program.
- **(b) Solo D2M participant** — working through a module alone at home, no facilitator present.
- **(c) Solo Why Workbook user** — doing the ~45-minute AI-coached chat flow alone on a phone.
- **(d) Live facilitator** — presenting the Masterclass deck to a room from a laptop/tablet.

---

## 1. Portal homepage — `index.html`

### Cognitive walkthrough: (a) first-time visitor on a phone, trying to find and open D2M

1. Lands on the hero. Stripe bar, sticky nav, large serif headline. No immediate mention of "D2M" by name — the visitor has to infer that "Design to Me" (mentioned in the intro copy) is what they're looking for.
2. Taps the hamburger (`.nav-toggle`, appears <900px). Menu opens (`topnav-menu.is-open`), `aria-expanded` correctly toggled.
3. Taps "Programs" — on mobile this is `preventDefault()`'d and toggles `.open` on the parent `<li>`, revealing "Design to Me" and "D2M — Full Curriculum" as two separate links.
4. Taps "Design to Me" → lands on `sales-page.html`. Task succeeds.

This path works cleanly and is the strongest walkthrough in the review — no breakdown found. Two small frictions:

| # | Heuristic | Sev | Finding |
|---|---|---|---|
| P1 | H6 Recognition rather than recall / H2 Match with real world | **1 – Minor** | The "Programs" dropdown offers two undifferentiated choices — "Design to Me" and "D2M — Full Curriculum" — with no label telling a first-time visitor which one *is* the sales pitch vs. the syllabus. A visitor unfamiliar with the site has to guess or open both. *Affected: persona (a).* **Fix:** add a one-line qualifier under each link (e.g. "Design to Me — start here" / "Full Curriculum — see all 13 modules").|
| P2 | H4 Consistency and standards | **1 – Minor** | The hero's "Explore the programs →" CTA anchors to `#programs`, scrolling down the *same page* to the card grid, while the top-nav "Programs" item is a dropdown that jumps straight to `sales-page.html`. Two entry points, two different behaviours, for what reads as the same action. *Affected: persona (a).* **Fix:** either make both entry points land on the same place, or visually differentiate "browse on this page" from "go to program."|

No critical or major issues on this touchpoint. The mega-nav's hover/click duality (hover-to-open on desktop, click-to-toggle on mobile via `matchMedia`) is implemented correctly and degrades gracefully.

---

## 2. D2M workbook site — `curriculum/workbooks/d2m/*`

Reviewed in full: `index.html` (curriculum overview), `sales-page.html`, `01-origin-story.html`, `06-future-self.html`. Skimmed `02-values-in-practice.html` through `05-life-systems.html` for consistency drift (confirmed present on disk and fully built — see D2 below).

### Cognitive walkthrough: (b) solo participant completing Module 01, loses their place partway through

1. Participant clicks "Start Module 01 →" from the curriculum overview topbar (the single most prominent CTA on that page — visible before any scrolling).
2. `01-origin-story.html` loads. `<html data-mode="presenter">` is the hard-coded default; `init()` only overrides it from `localStorage.getItem('d2m_mode_global')` or a `?mode=` URL param — neither is set on first visit, so the module opens in **Presenter** mode.
3. In Presenter mode, `.p-input { pointer-events:none; opacity:0.18 }` — **every text field on the page is inert and dimmed.** The participant sees a full-bleed title slide, then scroll-snapped concept slides, each carrying a black facilitator-notes bar at the bottom addressed to a workshop host ("*Read each brief aloud slowly… Ask: 'Does any of that feel familiar?'*"), and quick-hit/activity slides whose textareas cannot be typed into.
4. The participant has no facilitator, no room, no pairs to share with — but the interface is speaking entirely in that register, and won't accept their input. The only way out is noticing the small "Present / Workbook" toggle in the topbar and clicking "Workbook."
5. *If* they find and click it, the page reflows into the participant-friendly accordion/workbook layout, fields become live, and a progress bar appears. Typing into a field saves to `localStorage` on every keystroke and shows a "Saved" toast — this part works well.
6. **Losing their place:** the participant closes the tab mid-module (kettle boils, phone rings). They return later via a bookmark or by re-clicking "Start Module 01." `d2m_mode_global` is honoured, so the page correctly reopens in Workbook mode — but it opens at the **top of the page**, not at the section they were working in. All their typed answers are silently restored (localStorage), but there is no visual marker (e.g. "last edited here") pointing them back to where they stopped; for a 13-slide, dozens-of-field module they must re-scroll and re-read to relocate themselves. The progress bar (% of fields filled) tells them *how much* is done but not *where* to resume.

| # | Heuristic | Sev | Finding |
|---|---|---|---|
| D1 | H1 Visibility of system status / H2 Match between system and real world | **4 – Critical** | The default landing state (Presenter mode) is reached via the most prominent CTA on the curriculum page and via any direct link/bookmark to a module, yet it **disables every input field** and presents scripted, second-person facilitator instructions ("ask the room," "collect 3–4 answers") to a user who is alone. A solo participant cannot complete the module's core task (writing reflections) until they discover a small, unlabelled-by-context topbar toggle. *Affected: persona (b), and any participant who reaches a module via a direct link rather than reading the curriculum page's "How it works" explainer first.* **Fix:** default new/first-time visits to Workbook mode (or detect the referring context — e.g., a `?mode=participant` param on every "Start Module" link from participant-facing pages), and/or show a one-time interstitial explaining the two modes before the first slide.|
| D2 | H1 Visibility of system status | **3 – Major** | The curriculum overview (`index.html`) marks Modules 02–13 as `.inactive` with a "Coming soon" tag and no `href` — but Modules 02–06 already exist on disk as fully built, dual-mode pages structurally identical to Module 01 (verified directly). They are reachable only by clicking "Next →" from within a module, never from the curriculum page itself. A prospective participant (persona a) evaluating "is this program actually built?" from the overview page will conclude only 1 of 13 modules exists, undercounting real, finished work and likely suppressing enrolment interest. *Affected: personas (a) and (b).* **Fix:** update the module cards for 02–06 to link out like Module 01 does; keep "Coming soon" only for modules that truly don't exist yet (07–13).|
| D3 | H4 Consistency and standards | **3 – Major** | Modules 01–05 persist the Present/Workbook mode choice under the shared key `d2m_mode_global`. **Module 06 alone uses a different key, `d2m_mode`** (confirmed by direct comparison of the inline scripts). A participant who switches to Workbook mode in Module 01 and clicks through to Module 06 (the natural "Next" path after Module 05) will silently land back in locked-down Presenter mode and have to rediscover the toggle — recreating finding D1 mid-journey. *Affected: persona (b), specifically anyone progressing past Module 05.* **Fix:** rename Module 06's key to `d2m_mode_global` to match the other five modules, and — longer term — extract the mode/persistence script into one shared file included by every module instead of copy-pasted per file (see cross-touchpoint synthesis).|
| D4 | H6 Recognition rather than recall | **2 – Moderate** | No "resume where you left off" mechanism. Field values persist via `localStorage`, but scroll position does not; returning participants land at the top of a long module and must re-orient manually. *Affected: persona (b).* **Fix:** on load in Workbook mode, scroll to the first slide containing an empty required field, or to the last slide with a recorded `input` event (store a "last active slide" key alongside field data).|
| D5 | H4 Consistency and standards | **1 – Minor** | Module 06's progress-bar calculation hardcodes a 5-field tracked array (`['m06_future_self_map', …]`), while Modules 01–05 generically track *every* `[data-field]` element on the page. Debrief/quick-hit reflections in Module 06 don't count toward its progress bar the way equivalent fields do elsewhere, so "% complete" means something subtly different from module to module. *Affected: persona (b).* **Fix:** standardise on the generic all-fields approach used in 01–05.|
| D6 | H9 Help users recognise/diagnose/recover from errors | **0 – Not a problem** | `sales-page.html` is explicitly self-labelled `DRAFT — internal review only · schedule & pricing to be confirmed` via a sticky ribbon, and "Enrol now" opens a `mailto:` with TBC pricing. Since the page announces its own draft status up front, this isn't a usability violation — noted for completeness only.|

**Consistency check across Modules 02–05:** all four use `d2m_mode_global` and the generic all-fields progress calc, matching Module 01. Module 06 is the only outlier (D3, D5) — consistent with it likely being built in a separate pass.

---

## 3. The Why Workbook (AI-coached chat) — `why-workshop-app-v2/index.html` + `app.js`

### Cognitive walkthrough: (c) solo user doing the ~45-minute flow on a phone

1. Welcome screen: enters first name, taps "Begin →." Clean, one clear action, correctly disabled until a name is typed.
2. Enters `screen-workshop`. `startPhase1()` posts to `/api/chat`, coach message streams in, `addSystemMessage('— Phase 1 of 4: Reframe —')` prints once into the chat log.
3. User chats back and forth, moves through Values (chip-sort → emotional check → map), Moments of Truth (actions → ripple conversation), and Why Statement (draft → refine → close).
4. **Does the user always know what phase they're in and how much is left?** No. `updatePhaseLabel()` — the function meant to keep a persistent phase indicator current — writes to `document.getElementById('phase-label')`, but **no element with `id="phase-label"` exists anywhere in `index.html`.** The function silently no-ops every time it's called. The *only* signal of phase is the one-line system message dropped into the scrolling chat log at the start of each phase (e.g. "— Phase 3 of 4: Moments of Truth —"), which scrolls out of view as the conversation continues. There is no persistent header, progress bar, or step indicator anywhere on screen. A user who gets pulled away mid-conversation and returns has to scroll back up through the chat log to figure out what phase they're even in.
5. **What happens if they close the tab and come back?** Nothing good. `STATE` is a plain in-memory JavaScript object — there is no `localStorage`/`sessionStorage` write anywhere in `app.js`. Closing the tab, refreshing, or simply having a mobile browser reclaim a backgrounded tab (extremely common during a 45-minute session with a phone in someone's pocket) wipes every value picked, every action written, every draft of the Why Statement. There is no warning about this anywhere in the UI before or during the session.

| # | Heuristic | Sev | Finding |
|---|---|---|---|
| W1 | H1 Visibility of system status | **4 – Critical** | No persistent phase/progress indicator is actually rendered — the code that's supposed to show one (`updatePhaseLabel` → `#phase-label`) targets an element that doesn't exist in the page. The task brief's own diagnostic question — "does the user always know what phase they're in, how much is left" — resolves to **no** for this tool. *Affected: persona (c), most acutely anyone interrupted mid-session.* **Fix:** add a visible, persistent phase indicator (e.g., in `.ww-header`, "Phase 2 of 4 · Values") wired to `updatePhaseLabel()`, which the code already calls at every transition — this is a near-zero-effort fix since the call sites already exist.|
| W2 | H3 User control and freedom / H5 Error prevention | **4 – Critical** | Zero session persistence. All workbook state (`STATE`) lives only in memory; there is no save-as-you-go mechanism comparable to the one the D2M workbook modules already implement successfully. A closed tab, refresh, or OS-reclaimed background tab loses the entire session with no recovery path and no advance warning to set expectations. Given the explicit design intent ("self-paced," "start anytime," 45 minutes, mobile-first two-column layout that collapses to single-column on phones) this is the single highest-impact fix available on the whole site. *Affected: persona (c) overwhelmingly, but also anyone using the tool during a workday with tab-switching.* **Fix:** mirror the D2M pattern — write `STATE` to `localStorage` on every state-changing action and rehydrate on load; at minimum, warn the user before they navigate away with unsaved progress (`beforeunload`).|
| W3 | H1 Visibility of system status / H9 Help users recover from errors | **3 – Major** (needs live-test confirmation) | Likely dead-end after a retried failed request. Every phase-entry function (`startPhase1`, `enterPhase2b`, `enterPhase3a`, `enterPhase3bc`, `enterPhase4a`, `enterPhase4d`) calls `await callAPI(null)` and only wires up the "Continue →" button *after* a successful response (`if (!data) return;` exits early on failure). On failure, `showAPIError()` renders a "Try again" button; `retryAPI()` resends the message and, on success, calls `phaseOnResponse()` — but `phaseOnResponse` is still its default no-op at that point, because the original phase-entry function never reached the line that would have set it. Net effect: the coach's message reappears after a successful retry, but the "Continue" affordance that should follow it never appears, and the user is stuck with no visible way forward. This needs to be confirmed with a live, network-throttled test, but the code path is unambiguous. *Affected: persona (c) on an unreliable mobile connection — the most likely context for this tool.* **Fix:** move the "wire up continue / show next UI" logic into a named function called both on first success and inside `retryAPI`'s `.then()`.|
| W4 | H9 Help users recognise/diagnose/recover from errors | **2 – Moderate** | Crisis/distress handling is delegated entirely to the LLM's generated text — the client only sets `distress_flag` and stops auto-advancing phases. There is no static, guaranteed-to-render safety element (e.g. a helpline link) anywhere in the interface itself. If the `/api/chat` call errors or times out at the exact moment a distressed user has just disclosed something difficult, they see the same generic "Claude is taking a moment… Try again" message as any other failure, with no fallback support resource surfaced. *Affected: persona (c), specifically anyone in genuine distress during the "Moments of Truth" phase.* **Fix:** add a low-key, always-present "need support right now?" link/resource in the chat UI (not just AI-generated text), and route it into the error state too.|
| W5 | H3 User control and freedom | **1 – Minor** (needs live-test confirmation) | The back button (`btn-back`, appears once `phaseHistory.length > 1`) restores UI state for the previous phase but does not undo `STATE.messages` resets that several phase-entry functions perform (`STATE.messages = []` in 3a/3bc/4a), nor guarantee re-entering a phase reproduces the same AI response. Going back and forward again can silently produce a different coach message than the first pass. *Affected: persona (c) if they use back navigation.* **Fix:** low priority; note in code comments or accept as intentional if going back is meant to be a "start this phase over" action rather than true undo — but this isn't communicated to the user either way.|
| W6 | H1 Visibility of system status | **0 – Not a problem** | By contrast, the values-star cap (max 3) *does* give feedback — attempting a 4th star triggers a system message ("You already have 3 starred — which ones wouldn't you negotiate on?"). Noted as a positive counter-example to W1/W2, not a finding.|

---

## 4. The Why Deck — `why-deck/Why Deck v2.html` + `app-v2.jsx`

### Cognitive walkthrough: browsing/filtering to find resonant cards, then printing a set

1. Password gate ("frankly") → React/ReactDOM/Babel load from a CDN, JSX transpiles client-side, then the deck renders. On a slow connection there is no loading indicator between "gate dismissed" and "grid visible" — just a blank body. *(Minor — see V4.)*
2. 174 cards, grouped alphabetically by value name (A–Z), with a free-text search box filtering on name + blurb, and a fixed A–Z rail on the right for jumping to a letter.
3. User wants to "browse for what resonates" — but the only organizing structure is alphabetical. There's no theme/category facet (e.g. by archetype, by loop phase, by anything semantic), so browsing 174 cards for resonance means either scrolling the entire alphabet or already knowing the specific word they're looking for to search it.
4. Clicking a card opens a full-screen `Focus` modal (flip to read blurb + prompt, arrow-key/click navigation between cards, "+/✓" to add to the 5-slot "my top values" tray).
5. User taps "+" on a 6th card after already picking 5: `togglePick()` just returns the array unchanged — the button does nothing, with no toast, no shake, no message. It looks broken, not intentionally capped.
6. User has their 5 picks and wants to print them (this is the explicit promise on the portal homepage: "print double-sided on A4 card stock and cut to size"). **There is no print/export affordance anywhere in the interactive tool** — no button, no link. The only `@media print` rule present just hides the rail and tray, meaning a native browser print would dump the full 174-card on-screen grid (built from 3D-perspective flip-card transforms) rather than a clean print sheet. The actual print-ready files (`Why Deck - Print Sheets.html`, `Why Deck - Print Single-Sided.html`) exist in the same folder but are **linked from nowhere** — not from the interactive deck, not from the portal homepage card that promises the printable outcome.

| # | Heuristic | Sev | Finding |
|---|---|---|---|
| V1 | H1 Visibility of system status / H2 Match between system and real world | **3 – Major** | The portal homepage explicitly promises "Browse interactively or print double-sided on A4 card stock and cut to size," but the interactive tool provides no path to that outcome — no print button, no link to the separate print-ready files that already exist in the same folder. A user who does the exploratory work of picking favourites has no way to finish the task the product description told them they could do. *Affected: anyone in the "printing a set" walkthrough — the exact task named in this review's brief.* **Fix:** add a "Print my picks" action in the tray that either opens the existing print-sheet file (pre-filtered/anchored to the 5 picks if feasible) or, at minimum, a visible link to it.|
| V2 | H1 Visibility of system status | **2 – Moderate** | Adding a 6th card to a full 5-slot tray fails silently (`togglePick` no-ops with no feedback). *Affected: anyone who picks freely before narrowing to 5, which is the natural way to use a "star your favourites" interaction.* **Fix:** on a full-tray tap, show a brief message ("Tray's full — remove one first") the same way the Why Workbook already does for its 3-star cap (W6 above is a good in-house pattern to reuse).|
| V3 | H7 Flexibility and efficiency of use / H2 Match with real world | **2 – Moderate** | Only two ways to narrow 174 cards: alphabetical scroll or exact-text search. There's no thematic/category filter, so "browsing to find what resonates" (the task named in the brief) isn't well supported — alphabetical order carries no meaning about which values feel similar or contrasting. *Affected: anyone browsing without a specific word in mind — likely the majority of first-time users.* **Fix:** add a lightweight facet (e.g. group by archetype/icon family, which the code already tracks via `value.archetype`) as an alternate browse mode.|
| V4 | H1 Visibility of system status | **1 – Minor** | No loading indicator while three CDN scripts (React, ReactDOM, Babel standalone) load and JSX transpiles in-browser before the deck renders. On a slow connection, the page looks stalled/blank after the password gate. *Affected: users on slow mobile connections.* **Fix:** a simple CSS-only skeleton/spinner shown until `#root` has content.|
| V5 | H4 Consistency and standards | **1 – Minor** | The password gate's `sessionStorage` key (`fh_whydeck_v2`) is reused verbatim in the unrelated Why Workshop Masterclass v2 file — unlocking one silently unlocks the other in the same browser session. Low practical impact (same password either way) but indicates copy-pasted gate code with no shared source of truth. See cross-touchpoint synthesis.|

---

## 5. Why Workshop Masterclass v2 — `2023-why-workshop-masterclass-v2.html`

### Cognitive walkthrough: (d) facilitator presenting live — can they jump slides, see where they are, recover if they scroll too far?

1. Deck opens full-screen, scroll-snap-y, 34 slides. A 34-dot vertical rail (`#progress`) sits fixed on the right edge; each dot is clickable (`scrollIntoView`) and an `IntersectionObserver` toggles an `.on` class (opacity/scale bump) on the dot matching the currently visible slide.
2. **Can they jump slides?** Yes — click any dot, or use Arrow Up/Down/Left/Right (bound globally, computed against the slide whose bounding rect currently spans the viewport top). Reasonable and functional.
3. **Can they see where they are?** On a desktop-width window, yes, via the highlighted dot — though the affordance is genuinely subtle: a 5px dot growing to ~7.5px with a partial opacity change, no numeral, no section label. The only way to know *which* slide a dot represents is the `title="Slide N"` tooltip, which requires a mouse hover and doesn't render at all on touch.
4. **Recovering from over-scrolling:** scroll-snap-mandatory plus the dot highlight should keep a facilitator roughly oriented on a full-size screen; there's no dedicated "back to start" or slide-search affordance, but for a linear 34-slide talk this is a minor gap at most.
5. **The critical failure:** `.progress { display: none; }` inside the `@media (max-width: 800px)` block. Any facilitator presenting from a tablet, a narrower laptop window (e.g. docked next to speaker notes), or mirroring to a sub-800px secondary display loses the **entire** navigation/position system — no dots, no counter, nothing. They're left with scroll-snap and arrow keys only, with zero visual confirmation of where they are in a 34-slide deck.

| # | Heuristic | Sev | Finding |
|---|---|---|---|
| M1 | H1 Visibility of system status | **3 – Major** | The only slide-position/jump mechanism (the 34-dot rail) is entirely hidden below 800px viewport width, with no fallback (no counter text, no menu). This directly undermines the facilitator's ability to navigate and orient on any device narrower than a standard laptop — plausible for tablet-based presenting or multi-window setups. *Affected: persona (d) on tablet/narrow-window setups.* **Fix:** replace the fully-hidden rail on small screens with a minimal "Slide 6 / 34" text indicator plus a tap-and-hold or double-tap "jump to slide" affordance, rather than removing wayfinding entirely.|
| M2 | H1 Visibility of system status | **2 – Moderate** | Even where visible, the rail communicates position only through 34 nearly-identical unlabelled dots; the only slide-number cue is a `title` tooltip that requires mouse hover, unusable in the moment a facilitator glances over mid-sentence to check position. *Affected: persona (d).* **Fix:** add a small persistent "N / 34" numeral near the rail, and/or group dots into the deck's own sections (Welcome / Framework / Objections / Close) with a subtle divider, so position reads as "I'm in the Objections section" at a glance rather than "I'm at dot 27 of 34."|
| M3 | H4 Consistency and standards | **1 – Minor** | Shares the same `sessionStorage` gate key (`fh_whydeck_v2`) as the unrelated Why Deck tool — see V5. Low practical impact, noted for completeness.|

---

## Cross-touchpoint synthesis — repeated issues, ranked by severity

These are the highest-leverage fixes because each appears in more than one touchpoint, meaning a single engineering pattern-fix pays off across the site rather than once.

### 1. No save-as-you-go persistence outside D2M — **Critical**
The Why Workbook (W2) has *zero* session persistence for a 45-minute solo mobile flow — the single worst finding in this review. The Why Deck's picks/tray (V-series, lower stakes) is equally non-persistent. Meanwhile the **D2M workbook modules already solved this correctly** with a simple `localStorage`-per-field pattern (D-series). The fix isn't novel work — it's applying an existing, working in-house pattern to the two tools that skipped it.

### 2. No reliable "what phase am I in / how much is left" indicator — **Critical/Major**
The Why Workbook's phase indicator is wired to a DOM element that doesn't exist (W1) — a straightforward bug with an outsized impact on a 4-phase, multi-step flow. The Masterclass deck's only positional cue disappears completely below 800px width (M1). Two of five touchpoints fail this basic orientation requirement for exactly the kind of long, multi-step experience where it matters most.

### 3. Copy-pasted-per-file code drifts silently — **Major**
D2M Module 06 uses a different localStorage key for mode persistence than Modules 01–05 (D3) and a different progress-calculation method (D5). The Why Deck and Masterclass password gates share one `sessionStorage` key by accident, not by design (V5/M3). Each instance is individually low-to-moderate severity, but the pattern — shared logic hand-duplicated per file instead of centralized — means every new module or page has a fresh chance to introduce the same class of bug. **Recommend extracting the mode-toggle/field-persistence/progress-calc script (used identically across D2M modules) and the password-gate script (used across Why Deck and Masterclass) into shared, single-source files.**

### 4. The system understates what's actually built or deliverable — **Major**
The D2M curriculum overview marks 5 fully-built modules as "Coming soon" with no link (D2), directly undercutting the sales case to prospective participants. The Why Deck's promised print output exists on disk but is unreachable from the product itself (V1). Both are "the interface says X isn't available when it actually is (or should be)" — a visibility-of-system-status failure with a direct cost to conversion/completion, not just polish.

### 5. Silent caps with no feedback — **Moderate**
The Why Deck's 5-card tray fails silently past its limit (V2). Contrast this with the Why Workbook's 3-star cap, which *does* message the user (W6) — a good in-house pattern that should be copied to the Why Deck rather than reinvented.

---

*End of report.*
