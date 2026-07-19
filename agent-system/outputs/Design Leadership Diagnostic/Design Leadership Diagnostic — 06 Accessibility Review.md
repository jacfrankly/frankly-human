# Design Leadership Diagnostic — Accessibility Review

**Reviewer:** accessibility-reviewer (AR)
**Method:** Static source review of `index.html` and `app.js`. Colour contrast computed from literal `:root` hex values using the WCAG relative-luminance formula (not eyeballed). Guidelines: WCAG 2.2 AA + COGA.
**Context:** $500 paid product for senior design leaders. A sibling app (`why-workshop-app-v2`) was hardened this session for: clickable `<div>`s without keyboard support, missing `aria-live` on chat/status, missing focus-visible states, missing `prefers-reduced-motion` guards, brand-colour text failing contrast, and reversed-colour password-gate blocks failing contrast. This review checks whether any of those anti-patterns recur here.

---

## Computed contrast ratios (relative luminance method)

| Pair | Ratio | Normal text (4.5:1) | Large text / UI (3:1) |
|---|---|---|---|
| ink `#111111` on paper `#FAFAF7` | 18.06:1 | Pass | Pass |
| charcoal `#2A2724` on paper | 14.20:1 | Pass | Pass |
| paper on ink (privacy block, reversed) | 18.06:1 | Pass | Pass |
| cobalt `#1F44E8` on paper (links, CTA text) | 6.59:1 | Pass | Pass |
| paper on cobalt (pressed buttons, filled CTAs) | 6.59:1 | Pass | Pass |
| ink on lime `#C8F23A` (reveal highlight) | 14.58:1 | Pass | Pass |
| muted `#6B6B66` on paper | 5.12:1 | Pass (marginal) | Pass |
| muted on soft-white `#FAF7F2` | 5.01:1 | Pass (marginal) | Pass |
| **ember `#E8503A` on paper** | **3.56:1** | **Fail** | Pass (large only) |
| **ember on soft-white** | **3.49:1** | **Fail** | Pass (large only) |
| ink on cobalt (input `:focus` border change) | 2.74:1 | n/a (border, not text) | — |
| **75%-opacity paper on cobalt (selected trap-card `.desc`)** | **4.36:1** | **Fail** | — |

The ember/paper failure is confined to *normal-sized* text; the one large-text usage (`.dl-reveal-sentence`, 28–48px) legitimately clears the 3:1 large-text threshold and is not flagged.

---

## Critical

### C1 — Ember-on-paper text fails AA contrast, and it's the app's primary emphasis colour
**Issue:** `--ember: #E8503A` on `--paper`/`--soft-white` measures 3.56:1 / 3.49:1 against a 4.5:1 requirement for normal text. Ember is used as text colour (not just large-hero-text) in four places:
- `.dl-note .ember` — the **"$500"** price on the welcome screen (11px mono)
- `.dl-msg-claude-inner em.dl-ember` — the bolded trap-name emphasis inside **every** Claude chat turn (17px) — this is the design spec's core emphasis device, so it recurs constantly through the diagnostic
- `.dl-reveal-context em.dl-ember` — the quoted-fragment emphasis inside the Profile Reveal's context line (15px italic) — on the paid deliverable screen
- `.ec-error` — the email-validation error message ("That's not a valid email address.", 12px)

**Guideline:** WCAG 2.2 SC 1.4.3 Contrast (Minimum).
**Affected users:** Low-vision users, anyone with mild contrast-sensitivity loss (a substantial share of the 35–55 executive demographic this product targets).
**Remediation:** Darken ember for text usage only (keep the current hex for large-text/background use where it already clears 3:1). A shifted value around `#C23F28`–`#B83A26` (roughly 15–20% darker) should clear 4.5:1 on both paper and soft-white while staying recognizably "ember." Verify with the luminance formula before locking the value, and audit all four usage sites, not just the error message.

### C2 — Profile Reveal screen has no heading structure at all
**Issue:** `#screen-close` (the Profile Reveal — the paid deliverable the user is buying) contains zero `<h1>`–`<h6>` elements. "Your Leadership Influence Profile" is a `<span class="dl-reveal-eyebrow">`; the profile sentence is a `<p>`; "Take this further" / "Where this goes" are also `<span>`s. Every other screen in the app has its own `<h1>` (`dl-display` on welcome and intake, an `sr-only` h1 on the diagnostic) — the one screen that skips headings entirely is the results screen.
**Guideline:** WCAG 2.2 SC 1.3.1 Info and Relationships; 2.4.6 Headings and Labels. Heading navigation is the primary way screen-reader users survey a page.
**Affected users:** Screen-reader and switch-access users, who typically jump straight to a heading list (e.g. NVDA/JAWS "H" key, VoiceOver rotor) to orient themselves on a new screen — they will find nothing to jump to on the screen that matters most.
**Remediation:** Promote `.dl-reveal-eyebrow` (or add a visually-hidden heading immediately before it) to an `<h1>` or `<h2>` — e.g. `<h2 class="dl-reveal-eyebrow">Your Leadership Influence Profile</h2>` (the eyebrow styling can stay identical; only the tag changes). Consider a second-level heading for "Take this further" / "Where this goes" so the bridge sections are also heading-navigable.

---

## Major

### M1 — Support panel doesn't restore focus to its trigger on close
**Issue:** `setSupportPanel(true)` correctly moves focus into the panel (`.support-close.focus()`), but `setSupportPanel(false)` — triggered by the Close button or Escape — never returns focus to `#btn-support`. Since the panel is then `hidden`, focus is dropped to `<body>`, disorienting keyboard and screen-reader users.
**Guideline:** WCAG 2.2 SC 2.4.3 Focus Order (and general disclosure-pattern practice, ARIA APG).
**Affected users:** Keyboard-only and screen-reader users.
**Remediation:** In `setSupportPanel(false)`, call `document.getElementById('btn-support').focus()`.

### M2 — Email-capture error not programmatically associated with its field
**Issue:** `#ec-error` is shown/hidden via `style.display`, but `#ec-email` has no `aria-describedby="ec-error"` and no `aria-invalid="true"` toggle. Focus does return to the field on failure (`.focus()`), which helps, but a screen reader re-focusing the field won't necessarily re-announce the error text, and there's no `aria-live` on the error paragraph, so if focus isn't moved (e.g. on a second failed attempt while already focused) nothing is announced at all.
**Guideline:** WCAG 2.2 SC 3.3.1 Error Identification; 4.1.3 Status Messages.
**Affected users:** Screen-reader users.
**Remediation:** Add `aria-describedby="ec-error"` to `#ec-email` permanently (harmless when hidden), toggle `aria-invalid` alongside the display toggle, and add `role="alert"` (or `aria-live="assertive"`) to `#ec-error` so the message is announced the moment it appears. This compounds with C1 — the same error text is also failing contrast.

### M3 — Selected trap-card description text fails contrast
**Issue:** `.dl-trap-card[aria-pressed="true"] .desc { color: rgba(250,250,247,0.75); }` on the cobalt fill background composites to ~4.36:1 — just under the 4.5:1 requirement for its 13px text.
**Guideline:** WCAG 2.2 SC 1.4.3 Contrast (Minimum).
**Affected users:** Low-vision users, specifically while interacting with the trap-selector — one of the two custom components this review was asked to check closely.
**Remediation:** Raise the opacity to ≥0.87 (or drop the rgba entirely and use solid `--paper`, matching how `.name` is handled) — solid paper on cobalt already measures 6.59:1.

### M4 — Text-input focus indicator is weaker and inconsistent with button focus indicators
**Issue:** Every button in the app (`.btn-primary`, `.dl-thread-btn`, `.dl-trap-card`, `.btn-continue`, `#btn-send`, `.dl-bridge-cta`) gets a proper `:focus-visible { outline: 2px solid var(--cobalt); outline-offset: 2px; }`. But all text inputs — `#participant-name`, `.dl-thread-evidence-input`, `#user-input`, `#ec-name`, `#ec-email` — only get `:focus { border-color: var(--cobalt); }`, a 1px border shift from ink (`#111`) to cobalt, at 2.74:1 contrast between the two border colours. This is a materially weaker and less consistent focus signal than the rest of the interface for the same interaction (keyboard tabbing).
**Guideline:** WCAG 2.2 SC 2.4.7 Focus Visible (AA baseline satisfied — some change occurs — but 2.4.11 Focus Appearance's spirit, and internal consistency, are not).
**Affected users:** Low-vision and keyboard-only users, especially on the four-thread scorer's evidence textarea, where losing track of focus mid-flow costs the most.
**Remediation:** Add a matching `:focus-visible` outline to all text/textarea inputs, consistent with the buttons.

---

## Minor

### N1 — Typing indicator's infinite animation isn't gated by `prefers-reduced-motion`
`.typing-dots span { animation: dotpulse 1.2s infinite ease-in-out; }` has no media-query guard, unlike `msgIn`, `dlRevealIn`, and `shake`, which are all correctly wrapped in `@media (prefers-reduced-motion: no-preference)`. Low vestibular risk given the small (6px) scale, but it's an inconsistency in an otherwise-careful pattern and should be closed for completeness. Guideline: WCAG 2.2 SC 2.3.3 (AAA, but consistent with the app's own established practice).

### N2 — Typing indicator has no accessible text alternative
The `.msg-typing` div injected into the `aria-live="polite"` chat log contains only three empty `<span>` dots — no accessible name ("Claude is typing…"). Sighted users get a visual cue that a response is coming; screen-reader users get nothing. Add an `.sr-only` text node inside the typing indicator.

### N3 — No landmark regions outside the diagnostic screen
Welcome, intake, and close screens are plain `<div>`s with no `<main>`/`<section>` landmarks (only the diagnostic screen has a `<header>`). Not blocking, but reduces landmark-based navigation efficiency for screen-reader users skimming the page structure.

### N4 — Muted grey passes AA only marginally
`--muted: #6B6B66` clears 4.5:1 by a small margin (5.12:1 on paper, 5.01:1 on soft-white) and is used extensively at 10–11px with heavy letter-spacing (mono eyebrows/labels). Recommend a slightly darker value for more headroom given the small type sizes involved.

### N5 — Four-thread forced-choice uses two independent toggle buttons rather than radio semantics
`role="group"` + two `aria-pressed` buttons is a workable, spec-permitted pattern for a mutually-exclusive A/B choice, but `role="radiogroup"` + `role="radio"` (or native radio inputs, visually restyled) would communicate "pick exactly one" more directly to assistive technology. Not a failure, a recommended strengthening.

### N6 — Disabled `btn-start` gives no accessible reason for its disabled state
Relies on the sighted-only cue of `opacity: 0.38`. Low severity — the fix (type a name) is immediately discoverable — but an `aria-describedby` hint would remove the ambiguity for screen-reader users.

---

## What passed cleanly (confirmed, not assumed)

Called out explicitly since this review was calibrated against a sibling app's known failures:

- **No clickable `<div>`s anywhere in this build.** Every interactive control checked — `.dl-thread-btn`, `.dl-trap-card`, all CTAs, the support toggle — is a real `<button>`, `<a>`, `<input>`, or `<textarea>`. The sibling app's #1 anti-pattern was not repeated.
- **The Intake screen's privacy "redaction block" (reversed paper-on-ink) passes at 18.06:1.** This is the exact pattern (dark-fill block, light reversed text) that failed contrast in a sibling app's password gates — here it's implemented correctly and by a wide margin.
- **`role="log"` + `aria-live="polite"` on the chat log** is correctly wired, and `aria-live="polite"` on the phase label announces phase changes.
- **Reduced-motion is correctly gated for 3 of 4 animations** (`msgIn`, `dlRevealIn`, `shake`) — only the typing-dots pulse (N1) was missed.
- **Every form field has a visible, persistent `<label>`** — no placeholder-as-label anti-pattern anywhere, including the email field (placeholder is supplementary, not the only label).
- **Touch targets meet or exceed 44×44px** on all primary interactive elements (thread buttons 52px min-height, trap cards 96px min-height, send button 44×44 exactly).
- **Cobalt-on-paper / paper-on-cobalt (6.59:1) and ink-on-lime (14.58:1) both pass AA comfortably** — the palette's core interactive-state colours are sound; the contrast problem is specifically confined to ember-as-text.
- **The reveal-sentence's large-text ember usage (28–48px) legitimately qualifies for the 3:1 large-text threshold and passes** — the ember failure is about the smaller inline/emphasis usages, not the hero treatment.

---

## Overall WCAG 2.2 AA conformance assessment

**Does not currently conform to WCAG 2.2 AA.** Two Critical issues (ember-on-paper text contrast recurring through the app's core emphasis mechanism and error messaging; complete absence of heading structure on the results/deliverable screen) and four Major issues (support-panel focus management, unassociated form error, a secondary contrast failure in the trap-selector, and inconsistent input focus indicators) must be resolved before ship. None of these require a structural rebuild — they are targeted fixes (one colour-token adjustment, a handful of ARIA attributes, one focus-management call, one CSS rule) — but at a $500 price point for a senior audience with, as briefed, zero tolerance for a broken experience, both Criticals should block release. The underlying architecture (semantic buttons throughout, correct live regions, correct reduced-motion pattern in three of four cases, strong touch targets, and a genuinely well-executed reversed-colour privacy block) shows the team has the right instincts; this is a fix-round away from a clean AA pass, not a redesign.
