# Design Thinking Diagnostic — Accessibility Review

Prepared by: Accessibility Reviewer (AR)
For: design-builder (Fix round), design-lead, Creative Director
Method: static source review of `index.html` and `app.js` (no live browser/screen reader available in this pass — see §4 for items that need live verification). Colour contrast is computed from the literal `:root` hex values using the WCAG relative-luminance formula, not eyeballed; all ratios below are exact to two decimal places.

Scope note: this app was built after the `why-workshop-app-v2` hardening pass, so this review specifically checked whether the five known anti-patterns from that audit (clickable-div controls, missing `aria-live`, missing focus-visible states, brand-colour text failing contrast, missing `prefers-reduced-motion` guards) were repeated here. Short version: three of the five were avoided cleanly; **focus-visible states were partially reintroduced** (text inputs, not buttons); brand-colour-as-text was avoided for teal/pink but a new, undocumented contrast failure showed up on a muted/opacity byline.

---

## 1. Critical

### 1.1 No focus management across phase transitions — keyboard and screen-reader users lose their place at every one of the ~9 phase changes

**Issue.** `transitionTo()` (app.js ~L496–511) and `goBack()` hide the active special component, append new coach content to `#chat-log`, and never call `.focus()` on anything. When a phase's UI element is hidden (e.g. `#btn-lens-done`, `#btn-mindset-done`, `#btn-cause-done`, `#btn-continue` via `hideContinue()`), if that was the focused element, focus reverts to `<body>`. The same happens on `resumeSession()` (clicking `#btn-resume` hides `#screen-welcome`, taking the focused button with it) and on `initDiagnostic()`/`showScreen()` generally. Nothing moves focus to the new coach message, the updated `#phase-label`, or the newly-revealed component.

**Guideline.** WCAG 2.2 SC 2.4.3 (Focus Order) and, functionally, SC 2.4.7 (Focus Visible) — focus that silently drops to `<body>` is technically "visible" but meaningless; the user has no way to know where they landed. COGA: predictability and orientation across a multi-step process.

**Affected users.** Screen-reader users and keyboard-only users. This is not a one-off — it recurs at every phase boundary (0→1a→1b→1c→2a→2b→3→4→close, plus every `goBack()` and the resume flow), across a 20–30 minute session. A screen-reader user in browse mode has no reliable way to jump to "what just changed" and must re-scan the growing transcript from the top after each turn.

**Remediation.** On each phase entry (and after `showScreen()`/resume), move focus to a stable, sensible anchor — e.g. a `tabindex="-1"` heading/landmark at the top of the new content, or the first interactive element of the new special component (the first `lens-state-btn`, the mindset chips group, etc.), or `#phase-label`. At minimum, set focus to the newly-appended coach message container so a screen-reader user's next Tab picks up from there rather than from `<body>`.

---

## 2. Major

### 2.1 `aria-label` on the three special-component wrappers is inert — no `role` is set

**Issue.** `#lens-scorer`, `#mindset-selector`, and `#cause-attribution` (index.html L703, 710, 717) each carry `aria-label` but no `role` attribute:
```html
<div id="lens-scorer" class="special-component" style="display:none;" aria-label="Score the three lenses">
<div id="mindset-selector" class="special-component" style="display:none;" aria-label="Select the hardest mindset">
<div id="cause-attribution" class="cause-attribution special-component" style="display:none;" aria-label="Name the cause">
```
A plain `<div>` has the ARIA role `generic`, and `generic` explicitly prohibits an accessible name from being computed from `aria-label` (per the ARIA accname spec). These labels will not be announced by any conformant screen reader. Contrast this with `#support-panel` two lines earlier in the same file (L688), which correctly pairs `role="region"` with `aria-label="Support resources"` — the author clearly knows the pattern, it just wasn't applied to these three.

**Guideline.** WCAG 4.1.2 (Name, Role, Value).

**Affected users.** Screen-reader users, who lose the only piece of framing text ("Score the three lenses," etc.) for each of the three custom components, beyond whatever the dynamically-inserted instruction paragraph happens to say.

**Remediation.** Add `role="group"` (or `role="region"` if it should be a landmark) to all three wrapper divs.

### 2.2 Native focus outline removed from every text input, replaced with a subtle border-colour shift only

**Issue.** `outline: none` is set on `.name-field input` (L116), `#user-input` (L387), and `.ec-field input` (L511) — i.e. the participant's first-name field, the main chat textarea, and both email-capture fields. The only focus feedback left is `border-color: var(--teal-text)` on a 1px border (L118, 389, 513). This is the exact class of issue the sibling `why-workshop-app-v2` audit flagged and fixed for buttons; here it's been reintroduced specifically for inputs. It's also internally inconsistent: the app's own buttons (`.lens-state-btn:focus`, `.mindset-chip:focus`) correctly use a 2px `outline` with `outline-offset` — the pattern exists in the codebase, it just wasn't applied to inputs.

**Guideline.** WCAG 2.2 SC 2.4.7 (Focus Visible); the intent of SC 2.4.13 (Focus Appearance, AAA) re: indicator robustness.

**Affected users.** Low-vision and keyboard-only users, on the four most fundamental data-entry fields in the app (including the primary conversation input used dozens of times per session).

**Remediation.** Remove the `outline: none` overrides on these three input rules, or replace with an equally visible custom indicator (2px outline/offset, matching the button pattern) in addition to the border-colour change.

### 2.3 Focus-outline colour (teal) fails 3:1 non-text contrast on the two components that do have an outline

**Issue.** `.lens-state-btn:focus` and `.mindset-chip:focus` (L301, 341) use `outline: 2px solid var(--teal)`, offset 2px, sitting against the page's `--paper` background in both components' actual layout context.
- `--teal` (#47ACA4) luminance = 0.3353; `--paper` (#FBF7EE) luminance = 0.9319 → contrast **2.55:1**.
- Required: 3:1 minimum for UI-component/focus-indicator contrast.

**Guideline.** WCAG 2.2 SC 1.4.11 (Non-text Contrast); relevant to SC 2.4.13 (Focus Appearance, AAA).

**Affected users.** Low-vision keyboard users on the lens scorer and mindset-chip selector specifically (the two components where a real outline exists at all — see 2.2 for the inputs, where the situation is worse).

**Remediation.** Swap the focus outline colour to `--teal-text` (#1F6E67, 5.63:1 against paper — comfortably clears 3:1) or `--plum` (9.25:1), keeping teal for hover-only states if the palette distinction matters.

### 2.4 Default (unselected) borders on interactive controls are ~1.4:1 against their own background — boundaries are barely perceivable

**Issue.** `--sand` (#E0D2B5, luminance 0.6529) is used as the 1px border colour on `#user-input`, `.name-field input`, `.ec-field input`, `.lens-state-btn`, and `.mindset-chip` — all of which sit on a `background: var(--paper)` (luminance 0.9319) that is *identical* to the page background behind them. Contrast: **1.40:1**. Because the fill doesn't differ from the page, the border is the *only* cue to each control's boundary, and it falls far short of the 3:1 minimum.

**Guideline.** WCAG 2.2 SC 1.4.11 (Non-text Contrast) — applies because these are interactive-control boundaries with no other means of identification (fill = page background).

**Affected users.** Low-vision users trying to locate the name field, the chat textarea, the email fields, or the tap-targets of the lens/mindset/cause components before they hover or focus them.

**Remediation.** Either darken the default border (e.g. to `--muted` or `--charcoal`, both of which clear 3:1 against paper) or give unselected controls a fill that itself contrasts ≥3:1 against the page (e.g. `--paper-2`, which is only 1.07:1 against paper and wouldn't be enough on its own — a genuinely darker neutral is needed either way).

### 2.5 `role="radiogroup"`/`role="radio"` used without the expected arrow-key interaction model

**Issue.** `#mindset-chips` and `#cause-options` are marked `role="radiogroup"` containing buttons with `role="radio"` and `aria-checked` (correctly toggled in `handleMindsetClick`/`handleCauseClick`). But per the WAI-ARIA APG radio-group pattern, this role combination is a contract: only one item should be in the Tab order (roving `tabindex`) and Left/Right/Up/Down arrow keys should move both focus and selection between options. Neither is implemented — every chip/option keeps its own default Tab stop, and there's no `keydown` handler for arrow keys anywhere in `app.js`. Screen-reader users who hear "radio button, 1 of 6" and reach for arrow keys (the standard, taught interaction) will find nothing happens. (By contrast, the lens scorer at L602 correctly avoids this trap by using plain `role="group"` + `aria-pressed` toggle buttons instead of radio semantics — see 3.1 for the resulting inconsistency.)

**Guideline.** WCAG 4.1.2 (Name, Role, Value) — role must match actual behaviour.

**Affected users.** Screen-reader and switch-access users on the Phase 2a mindset picker and Phase 2b cause-attribution component — two of the three components this review was specifically asked to check.

**Remediation.** Either implement roving-tabindex + arrow-key handling per the APG radiogroup pattern, or drop the radio semantics in favour of the same `role="group"` + `aria-pressed` toggle-button pattern already used correctly by the lens scorer (simpler, and now consistent across all three components — see 3.1).

### 2.6 Close screen has no heading at all; where headings do exist, their order is reversed

**Issue.** `#screen-close` (L741–794) contains zero heading elements. The Profile Reveal card — the single most important piece of content in the whole app, the "verdict" the entire 20–30 minute session builds to — is marked up as `<span class="pr-eyebrow">` + `<p id="pr-tag-text">`, not a heading. Separately, across the app as a whole: the persistent `<aside class="brand-panel">` contains an `<h2 class="bp-title">` (L646) that precedes, in DOM order, the `<h1 class="ww-title">` on `#screen-welcome` (L662) and the `<h1 class="sr-only" id="phase-label-sr">` on `#screen-diagnostic` (L677) — an h2 appearing before any h1 on the page.

**Guideline.** WCAG 2.2 SC 1.3.1 (Info and Relationships) and SC 2.4.6 (Headings and Labels) — headings must form a logical, non-reversed hierarchy, and the primary content of a screen should be identifiable via heading navigation (the single most common screen-reader navigation method).

**Affected users.** Screen-reader users, who typically navigate by heading list first. On the close screen, that list is empty — there is nothing to jump to for the profile result itself.

**Remediation.** Give `#pr-tag-text` (or its wrapping `.pr-tag-wrap`) a real heading level (`<h1>` or `<h2>`, since it's the page's primary content), and either demote `.bp-title` to not outrank the page's actual `<h1>`, or promote/reorder so the brand panel's heading doesn't lead the document.

### 2.7 Submitting an empty answer fails silently for non-visual and reduced-motion users

**Issue.** `sendMessage()` (L420–428): on empty input, the only feedback is `input.classList.add('shake')` — a CSS animation that is itself gated behind `@media (prefers-reduced-motion: no-preference)` (L407–409). No text is added, no `aria-live` region is touched, no `aria-invalid` is set. For a `prefers-reduced-motion: reduce` user, nothing observable happens at all; for everyone else, a screen reader gets nothing either way (the shake is purely visual).

**Guideline.** WCAG 2.2 SC 3.3.1 (Error Identification) and SC 4.1.3 (Status Messages).

**Affected users.** Screen-reader users and anyone with `prefers-reduced-motion` enabled, attempting to submit a blank answer.

**Remediation.** Add a text message (into the existing `aria-live="polite"` chat log, or a small inline error near the textarea) alongside the shake, and keep it independent of the reduced-motion gate.

### 2.8 Email-capture error is not programmatically associated with the field, and `aria-invalid` is never set

**Issue.** `#ec-error` (index.html L782) sits visually beside `#ec-email` but nothing points from the input to the error: no `aria-describedby="ec-error"` on `#ec-email`, and `handleSubscribe()` (app.js L998–1008) never sets `aria-invalid="true"` on the input, only toggles the paragraph's `display`. `errorEl` is also outside any `aria-live` region, so if focus doesn't move (it does, via `.focus()`, but a screen reader landing on a field it was already on may not re-announce a sibling paragraph it isn't linked to) the reason for the failure isn't reliably heard.

**Guideline.** WCAG 2.2 SC 3.3.1 (Error Identification), SC 4.1.2 (Name, Role, Value — invalid state).

**Affected users.** Screen-reader users attempting the optional PDF email capture on the close screen.

**Remediation.** Add `aria-describedby="ec-error"` to `#ec-email` (present regardless of visibility state is fine — the error text stays in the accessibility tree since it's just `display:none`, which is properly hidden either way), and set/clear `aria-invalid` alongside the error toggle.

### 2.9 `.pr-credit` byline fails AA contrast — computed, not eyeballed

**Issue.** `.pr-credit` (L452–455) is `color: var(--muted); opacity: 0.55;` at 10px on `--paper`. Opacity blends the text colour toward the background, so the *effective* rendered colour is muted (#5E584F) mixed 55/45 with paper (#FBF7EE) ≈ rgb(165, 160, 151). Luminance of that blend ≈ 0.3517 vs paper's 0.9319 → contrast **2.45:1**. Required: 4.5:1 for normal text (10px is normal-size, not large-text-exempt). This is real, non-decorative information (the "Frankly Human · Design Thinking Diagnostic" attribution line), so it doesn't qualify for the decorative-text exemption.

**Guideline.** WCAG 2.2 SC 1.4.3 (Contrast Minimum).

**Affected users.** Low-vision users on the close screen.

**Remediation.** Drop the `opacity: 0.55` and either use `--muted` at full opacity (6.58:1 against paper — passes) or a comparably dark neutral if a lighter visual weight is still wanted.

### 2.10 Typing indicator has no accessible text equivalent

**Issue.** `showTyping()` (app.js L248–256) appends `<div class="typing-dots"><span></span><span></span><span></span></div>` into `#chat-log`, which is `aria-live="polite"`. The dots carry no text content and no `aria-label`/visually-hidden equivalent (e.g. "Coach is typing…"), so the live-region update is functionally silent for screen-reader users — they get an announced-but-empty mutation, then the real message replaces it moments later with no warning a wait was happening.

**Guideline.** WCAG 2.2 SC 4.1.3 (Status Messages).

**Affected users.** Screen-reader users, throughout the whole conversation (this fires on every single coach turn).

**Remediation.** Add an `.sr-only` text node inside the typing indicator, e.g. "Coach is typing…".

---

## 3. Minor

### 3.1 Inconsistent selection pattern between the lens scorer and its two sibling components

The lens scorer (`.lens-states`, L602) uses `role="group"` + `aria-pressed` toggle buttons for its "choose one of three" interaction; the mindset chips and cause-attribution options (built as visually near-identical controls) use `role="radiogroup"`/`role="radio"`/`aria-checked` for the same kind of choice (see 2.5). Both patterns are individually valid, but using two different ARIA models for the same interaction shape across three components that were explicitly built as a matched set is confusing for AT users and increases maintenance risk. Recommend standardising on the lens scorer's group+`aria-pressed` pattern (it's already fully keyboard-operable with no extra work) unless the team specifically wants radiogroup semantics, in which case fix 2.5 first.

### 3.2 No `<main>` landmark

None of `#screen-welcome`, `#screen-diagnostic`, or `#screen-close` is wrapped in `<main>` or `role="main"`. The only landmark in the document is the `<aside class="brand-panel">` (implicit `complementary`). Screen-reader users who jump by landmark (a very common strategy) have no "skip to main content" target. Low cost, meaningful win: wrap the screen container(s) in `<main>`.

### 3.3 `btn-back` / `btn-support` touch targets are tight

`.btn-back` (`padding: 4px 0`, no horizontal padding) and `.btn-support` (same vertical-only padding) render close to or under a comfortable tap target at small font sizes. WCAG 2.2 SC 2.5.8 (Target Size Minimum, AA) sets a 24×24 CSS px floor, which these likely clear vertically only in some rendering conditions — recommend padding both out toward 44×44 as a low-risk improvement, matching the care already given to `.mindset-chip` (`min-height: 44px`) and `.lens-state-btn` (`min-height: 52px`).

### 3.4 Support panel is a dialog-shaped disclosure without dialog semantics or focus containment

`#support-panel` (`position: fixed`, box-shadow, styled like a popover) uses `role="region"` rather than `role="dialog"`, and nothing prevents Tab from moving from the panel's Close button into the chat log/input behind it while the panel is still visually open. This is a defensible choice for a non-blocking disclosure (Escape closes it, an explicit Close button is focused on open), but worth a deliberate design-lead confirmation that it's meant to be non-modal rather than an oversight.

### 3.5 Redundant/conflicting label on `#user-input`

The textarea has both an associated `<label for="user-input" class="sr-only">Your answer</label>` and `aria-label="Type your answer"` (index.html L732–733). Per accname computation, `aria-label` wins, so the sr-only `<label>` is dead code with a different string than the one actually announced. Not broken, but worth reconciling so the two don't drift further apart.

---

## 4. Needs live verification

The following can't be fully confirmed from source and should be checked with real assistive tech before sign-off:

- **`aria-live="polite"` behaviour under rapid updates** — chat-log appends, the typing indicator, and `#phase-label` changes all fire close together during a phase transition; verify NVDA/JAWS/VoiceOver don't drop, garble, or over-announce these in practice.
- **Radiogroup keyboard behaviour (2.5)** — confirm in an actual screen reader exactly what a user hears/can do when they reach the mindset chips and cause options.
- **Reflow at 400% zoom** (WCAG 1.4.10) — the layout uses `dvh`, `clamp()`, and flex/grid throughout, which suggests reasonable responsiveness, but should be checked live for horizontal scroll or content loss, especially the two-column `.app-shell` grid at the 900px breakpoint.
- **`prefers-reduced-motion` end-to-end** — the CSS gating looks correct and complete on inspection (every `@keyframes` use is wrapped; the Profile Reveal's multi-stage sequence — evidence fade, citation fade, the 500ms held pause, tag fade, underline stroke draw — is entirely skipped via the `instant || reducedMotion` early return in `enterClose()`, app.js L953–957, which only ever adds `is-revealed` and not `animate-in`). Worth one live pass with the OS setting on to confirm actual browser behaviour matches, but this is the one area of the review with no findings — call it a clean pass pending that check.
- **Voice control / switch access** on the three custom components.

---

## 5. Overall WCAG 2.2 AA conformance assessment

**Not yet AA-conformant.** The app gets a lot right that the sibling audit flagged elsewhere: every interactive element in this file is a real `<button>` (no clickable-div anti-pattern anywhere), the chat log and phase label correctly use `aria-live`, body-text contrast is excellent throughout (ink/charcoal/muted all clear AA and mostly AAA against paper), and the `prefers-reduced-motion` gating is genuinely thorough — including on the long multi-stage Profile Reveal sequence, which is fully and correctly suppressed. Brand-colour-as-text was also avoided for teal and pink specifically (raw `--teal`/`--pink` are never used as text colour; `--teal-text`/`--pink-text` are used correctly everywhere text needs the brand hue).

But one Critical (no focus management across a flow with ~9 phase transitions) and ten Major findings — spanning missing focus indicators on all text inputs, sub-3:1 focus/border contrast on every default and focused control, an ARIA role/label defect on all three custom components, a genuinely blank close-screen heading structure, and one directly-computed contrast failure (2.4 and 2.5 above are new instances of the *same class* of issue the sibling app was hardened against, just on different elements — inputs and borders rather than buttons and chat logs) — are enough that this should not ship as-is. None of these require a redesign; they're concentrated, fixable in a single Fix round, and several (2.1, 2.2, 2.3) share a root cause (focus-visible treatment wasn't extended from buttons to inputs) that one pass can close out.
