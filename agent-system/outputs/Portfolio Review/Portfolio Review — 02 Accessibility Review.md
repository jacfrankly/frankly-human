# Frankly Human — Portfolio Accessibility Review

**Reviewer:** Accessibility Reviewer (AR) — Design Team
**Method:** Static source review (HTML/CSS/JS read directly, no live browser/screen reader session). Colour contrast ratios below are computed from the literal hex values in each file's `:root` using the WCAG relative-luminance formula, not eyeballed. Anywhere a finding depends on live rendering (focus order under real interaction, actual screen-reader announcement, keyboard-trap behaviour in a real browser), it is called out explicitly as **needs manual verification** rather than skipped.
**Standard:** WCAG 2.2 AA + COGA (per the accessibility-reviewer brief).

---

## Core palette — contrast reference

These combinations recur across all five touchpoints (`--ink #100000`, `--paper #FBF7EE`, `--teal #47ACA4`, `--pink #FF3990`, `--yellow #FFBD59`, `--plum #7A1F4A`, `--muted #7A736B`, plus the earthy `#4F5B3C` / `#E8503A` used on the portal homepage). Ratios computed once here and referenced by touchpoint below.

| Foreground | Background | Ratio | AA normal text (4.5:1) | AA large text / UI (3:1) |
|---|---|---|---|---|
| `--ink` #100000 | `--paper` #FBF7EE | **19.2:1** | Pass | Pass |
| `--ink` #100000 | `--yellow` #FFBD59 | **12.4:1** | Pass | Pass |
| `--ink` #100000 | `--teal` #47ACA4 | **7.5:1** | Pass | Pass |
| `--plum` #7A1F4A | `--paper` #FBF7EE | **9.25:1** | Pass | Pass |
| `#4F5B3C` (olive) | `--paper` #FBF7EE | **6.78:1** | Pass | Pass |
| `--muted` #7A736B | `--paper` #FBF7EE | **4.37:1** | **Fail** (needs 4.5) | Pass |
| `--pink` #FF3990 | `--paper` #FBF7EE | **3.15:1** | **Fail** | Pass |
| `#E8503A` | `--paper` #FBF7EE | **3.48:1** | **Fail** | Pass |
| `--teal` #47ACA4 | `--paper` #FBF7EE | **2.55:1** | **Fail** | **Fail** |
| ink @55% opacity (eyebrow) | `--teal` #47ACA4 | **3.42:1** | **Fail** | Pass |
| ink @78% opacity (`.fran`) | `--teal` #47ACA4 | **5.70:1** | Pass | Pass |
| paper @60% opacity (eyebrow) | `--plum` #7A1F4A | **4.30:1** | **Fail** (borderline) | Pass |
| ink @20% opacity (placeholder) | `--paper` #FBF7EE | **1.59:1** | **Fail** (severe) | **Fail** |
| paper @55% opacity (footer) | `--ink` #100000 | **5.92:1** | Pass | Pass |

**Headline problem:** `--teal` and `--pink` are brand-signature colours used throughout as link/CTA/label text directly on `--paper`, but neither meets even the 3:1 UI-component minimum against that background. `--muted` — the workhorse "secondary text" colour — fails AA by a hair almost everywhere it's used for body copy.

---

## Touchpoint 1 — Portal Homepage (`index.html`)

### Critical

**1. No heading elements anywhere on the page.**
The entire page — hero, loop strip, all six card sections — is built from styled `<div>`/`<span>` elements (`.hero-brand`, `.card-title`, `.section-label`, etc.). There is not a single `<h1>`–`<h6>` in the document.
- **Guideline:** WCAG 1.3.1 (Info and Relationships), 2.4.6 (Headings and Labels).
- **Affected users:** Screen reader users, who rely on heading navigation (a "list headings" pass is the single most common screen-reader orientation technique) get nothing to navigate by on the practice's front door.
- **Remediation:** Give the page one `<h1>` (the "frankly human." wordmark/tagline) and convert `.section-label` (Programs / Workshops / Tools / Consulting / About) to `<h2>`, and `.card-title` to `<h3>` inside each card.

**2. Mega-nav dropdowns are keyboard-inoperable on desktop.**
`.topnav-dropdown` is shown only via `:hover` or a `.open` class that the script (lines 598–608) only ever toggles inside a `max-width: 900px` media query. On desktop, there is no `:focus`/`:focus-within` rule and no click handler that opens the dropdown, so a sighted-keyboard or switch-device user who tabs to "Programs", "Workshops", "Tools", or "About" cannot reveal or reach any of the links inside those dropdowns (Design to Me, Why Workshop v1/v2, Why Deck, Why Workbook, Methods Poster, Content & Voice, Visual Identity). Those links are `display:none` while collapsed, so they're also removed from the desktop tab order entirely.
- **Guideline:** WCAG 2.1.1 (Keyboard), 2.4.3 (Focus Order).
- **Affected users:** Keyboard-only users, switch-access users, screen-reader users navigating with Tab.
- **Remediation:** Add `:focus-within` alongside `:hover`/`.open` for `.topnav-dropdown`, and make the parent `.topnav-link` a real disclosure control (`aria-expanded`, `aria-haspopup="true"`) that opens on both Enter/Space and click, at every viewport width — not just under 900px.

### Major

**3. `--muted` body/caption text fails contrast (4.37:1 vs 4.5:1 required).**
Used for `.hero-sub` (15px), `.card-desc` (via `--muted` in places), `.card-eyebrow`, `.mono-label`, footer text, `.loop-phase-mini-desc`. This is the single most-used secondary-text colour on the page.
- **Guideline:** WCAG 1.4.3 (Contrast — Minimum).
- **Affected users:** Low-vision users, older users, anyone reading in bright ambient light.
- **Remediation:** Darken `--muted` to roughly `#5E584F` (≈6.2:1) or increase to 18.7px+/bold where it must stay this light.

**4. Brand-colour CTA text fails contrast.** `.card-cta` uses `color: var(--teal)` ("Open the workbook →", 2.55:1) and `color: var(--pink)` ("View style guide →", 3.15:1) directly on the page's paper background, and `#E8503A` ("Open poster →", 3.48:1). All fail AA for normal-size text (these CTAs run at 11px).
- **Guideline:** WCAG 1.4.3.
- **Affected users:** Low-vision users.
- **Remediation:** Either darken these link colours specifically for text use (keep the bright hue for decorative dots/swatches, which don't need text contrast), or pair with underline + sufficient weight and confirm against a text-contrast-safe tint.

### Minor

**5. No visible skip-link.** Every page load requires tabbing through the full nav before reaching content.
- **Guideline:** WCAG 2.4.1 (Bypass Blocks).
- **Remediation:** Add a `"Skip to content"` link, visually hidden until focused.

**6. No custom focus-indicator styling defined anywhere in this file** (default browser outline is left as-is on nav links, cards). This is not a failure per se (Chrome/Firefox default focus rings are usually visible against `--paper`), but combined with the removed dropdown accessibility above, it's worth an explicit visual QA pass. **Needs manual verification** in a live browser at each breakpoint.

---

## Touchpoint 2 — D2M Workbook Site

Files: `d2m/index.html`, `d2m/sales-page.html` (full read), `01-origin-story.html`, `06-future-self.html` (full deep-dive), `02-05` (skim — the accordion, label, and toast issues below are confirmed present identically in `02-values-in-practice.html`; no material drift found).

### What's working well (context for the findings below)
`index.html` and `sales-page.html` use real `<h1>`–`<h3>` hierarchy throughout, and `sales-page.html`'s Q+A section uses native `<details>/<summary>` — a fully keyboard- and screen-reader-accessible accordion with zero custom JS. This is the strongest accessible pattern found anywhere in the portfolio and is worth protecting as a template for other accordions (see Critical #1 below).

### Critical

**1. The context-accordion control (`.ctx-header`) is a `<div onclick>`, not a keyboard-operable control, in every module (`01`, `06`, confirmed also in `02`).**
```html
<div class="ctx-header" onclick="toggleContext(this.closest('section'))">
```
It has no `tabindex`, no `role="button"`, and no `keydown` handler for Enter/Space — it is invisible to the keyboard entirely. Compounding this, `aria-expanded` is set on the ancestor `<section data-type="context">`, not on the interactive control itself, which is the wrong element for that attribute (a screen reader has no reason to associate expand/collapse state with a `<section>` that isn't a button). In Workbook mode, this accordion gates access to all the module's teaching/concept content — collapsed by default.
- **Guideline:** WCAG 2.1.1 (Keyboard), 4.1.2 (Name, Role, Value).
- **Affected users:** Keyboard-only users, screen-reader users, switch-access users — cannot expand any "Context" slide's teaching content in Workbook mode.
- **Remediation:** Change `.ctx-header` to a real `<button type="button" aria-expanded="false" aria-controls="[id of .slide-teaching]">`. Move `aria-expanded` off the `<section>` and onto the button; toggle it in `toggleContext()`. `sales-page.html`'s native `<details>` pattern is a good model if a non-JS solution is preferred instead.

### Major

**2. Several textareas have no persistent visible `<label>` — placeholder is the only instruction.** Confirmed: Module 01 Quick Hit (`m01_quick_hit`), Debrief 1 & 2 reflection fields (`m01_debrief_1`, `m01_debrief_2`); Module 06 Debrief 1 & 2 reflection fields. (Module 06's Quick Hit field *does* have a label — inconsistent even within one module.)
- **Guideline:** WCAG 3.3.2 (Labels or Instructions), 1.3.1; persona rule "placeholder text alone is not a label."
- **Affected users:** Screen-reader users (placeholder text is not reliably announced as a label by all AT, and disappears once text is entered — sighted users lose the instruction too as soon as they start typing).
- **Remediation:** Add a `<label class="field-label">` to every `.field-ta`, matching the pattern already used in the Activity blocks.

**3. Placeholder text contrast is close to invisible: ~1.6:1.** `.field-ta::placeholder { color: rgba(16,0,0,0.2); }` against `--paper`. Where this placeholder is also the *only* instruction (see #2), the guidance is nearly unreadable for low-vision users and fails contrast for everyone.
- **Guideline:** WCAG 1.4.3 (applies to placeholder text conveying instructions).
- **Remediation:** Raise placeholder opacity to at least 0.45–0.5 (~3:1) as an interim step, but the real fix is #2 — placeholders should be supplementary, not load-bearing.

**4. Focus indicator on all text inputs is a 1–2px border-colour change to `--teal`, which itself fails the 3:1 non-text-contrast minimum (2.55:1) against `--paper`.**
```css
.field-ta:focus { border-color: var(--teal); border-bottom-color: var(--teal); }
```
- **Guideline:** WCAG 1.4.11 (Non-text Contrast), 2.4.11 (Focus Appearance).
- **Affected users:** Low-vision and keyboard users trying to track which field currently has focus.
- **Remediation:** Use a colour that hits 3:1+ against paper for the focus ring (e.g. `--plum` or `--ink`), and consider a visible outline in addition to the border-colour swap for a stronger indicator.

**5. Auto-save confirmation ("Saved" toast) is visual-only — no `aria-live`/`role="status"`.** The workbook has no explicit Save button; all persistence is silent `localStorage` writes confirmed only by a transient, unannounced toast (`.save-toast`).
- **Guideline:** WCAG 4.1.3 (Status Messages).
- **Affected users:** Screen-reader users get zero confirmation their work was saved — a trust/predictability issue (COGA).
- **Remediation:** Add `role="status"` (or `aria-live="polite"`) to `#saveToast`.

**6. Eyebrow-label text fails contrast on coloured slide backgrounds.** `.slide-teal .eyebrow` / `.slide-yellow .eyebrow` = `rgba(16,0,0,.55)` on teal → **3.42:1** (fails 4.5:1 normal text). `.slide-plum .eyebrow` = `rgba(251,247,238,.6)` on plum → **4.30:1** (fails, borderline). Both used for section eyebrows like "Module 06 · Close", "Design to Me · Module 06" — present in the title/close slides of every module.
- **Guideline:** WCAG 1.4.3.
- **Remediation:** Raise opacity to ~0.72–0.8 on both variants (verified to clear 4.5:1 at that level using the same formula).

**7. Workbook mode is entirely non-functional without JavaScript.** `<html data-mode="presenter">` is the hard-coded default; the mode toggle buttons only work via `onclick`. If JS fails to load, every `.p-input` field stays at `pointer-events:none; opacity:.18` (the Presenter-mode style) permanently — none of the exercises can be filled in.
- **Guideline:** COGA / robustness (WCAG 4.1 principle), not a strict SC but a real access barrier.
- **Affected users:** Users on restrictive networks/browsers, corporate lockdowns, or JS-blocking extensions.
- **Remediation:** At minimum, make Workbook mode the accessible fallback (`<noscript>` styling that forces participant-mode CSS).

### Minor

**8. `mode-toggle` Present/Workbook buttons have no `aria-pressed`.** Active state is conveyed by background colour only (`html[data-mode="presenter"] .mode-btn.btn-presenter { background: ink; color: paper; }`).
- **Guideline:** WCAG 4.1.2, 1.4.1 (Use of Color).
- **Remediation:** Toggle `aria-pressed="true/false"` on the two buttons alongside the visual state.

**9. Heading-tag usage is inconsistent between modules.** Module 01 uses a real `<h3 class="serif h3">` for debrief headers; Module 06 uses `<h2 class="serif h3">` (h2 *tag*, h3 *visual size*) for the same slide type. Across the deck, heading level appears to be chosen by desired font size rather than document structure.
- **Guideline:** WCAG 1.3.1, 2.4.6.
- **Remediation:** Decouple heading *level* from the `.h1/.h2/.h3` *size* classes; pick the tag by semantic depth, the class by desired look.

**10. `localStorage` key for the mode toggle differs between modules** (`d2m_mode_global` in Module 01 vs. `d2m_mode` in Module 06) — a participant who sets Workbook mode in one module lands back in Presenter mode in the next. Not a WCAG violation, but a COGA predictability/consistency issue worth flagging.

**11. No skip-link past the fixed topbar**, same pattern as the homepage.

---

## Touchpoint 3 — The Why Workbook (`why-workshop-app-v2/index.html` + `app.js`)

This is the most accessible implementation in the portfolio: the chat log is a proper `role="log" aria-live="polite" aria-label="Coaching conversation"` region, the values-sort chips and values-map buttons are real `<button>` elements with correctly maintained `aria-pressed` (including `"mixed"` for the two-stage circled/starred chip state), and every text input has a real associated `<label>` (or `aria-label` where a visible label would be redundant, e.g. `#user-input`). Findings below are refinements, not foundational gaps.

### Major

**1. Email-capture error is not programmatically associated with the field.** `handleSubscribe()` (app.js line 762) toggles `#ec-error`'s `display` but never sets `aria-describedby` on `#ec-email`, never sets `aria-invalid`, and the error `<p>` has no `role="alert"`/`aria-live`. The code does move focus to the email field (`document.getElementById('ec-email').focus()`), which helps, but a screen reader landing back on the (unchanged) input has no reason to announce the new error text.
- **Guideline:** WCAG 3.3.1 (Error Identification), 4.1.3 (Status Messages).
- **Remediation:** Add `aria-describedby="ec-error"` to `#ec-email` permanently, set `aria-invalid="true"` when the error shows, and add `role="alert"` to `#ec-error`.

**2. Submitting an empty chat message produces no text feedback at all** — only a CSS "shake" animation (`sendMessage()`, app.js line 251-259). A screen-reader or blind user who presses Send on an empty field gets total silence; nothing is announced, focus doesn't move, no error text exists anywhere in the DOM.
- **Guideline:** WCAG 3.3.1.
- **Remediation:** On empty submit, announce a short message into the existing `aria-live="polite"` log ("Type a response before sending") in addition to (or instead of) the shake.

### Minor

**3. The "typing" indicator carries no accessible text.** `showTyping()` inserts `.typing-dots` (three animated `<span>`s, no text, no `aria-label`) into the `aria-live` log. Sighted users see the coach "thinking"; screen-reader users get nothing until the reply lands.
- **Guideline:** WCAG 4.1.3 / COGA (predictability of wait states).
- **Remediation:** Add `aria-label="Coach is typing"` (or visually-hidden text) to the typing indicator element.

**4. During the core coaching interaction there is effectively no heading in view.** The only `<h1>`/`<h2>` in the document live on the Welcome screen and in the `<aside class="brand-panel">`; on mobile, the brand panel is explicitly hidden once `#screen-workshop` is active (`.app-shell:has(#screen-workshop.active) .brand-panel { display:none; }`), leaving zero headings on screen for the majority of the session.
- **Guideline:** WCAG 2.4.6, 1.3.1.
- **Remediation:** Add a visually-hidden `<h1>` inside `#screen-workshop` reflecting the current phase (the `PHASE_LABELS` map already has this text available).

**5. Same recurring focus-indicator contrast issue** as D2M — `border-color: var(--teal)` on `.name-field input:focus`, `.action-input:focus`, `#why-textarea:focus`, `#user-input:focus`, `.ec-field input:focus` (2.55:1, fails 3:1). The values-chip and values-map buttons do better structurally (`outline: 2px solid var(--teal); outline-offset: 2px`) but the colour itself still fails contrast.

**6. No `prefers-reduced-motion` accommodation** for the message-entry animation (`@keyframes msgIn`) or the input shake. Low severity on its own (small, short transforms) but consistent with the portfolio-wide gap — see synthesis.

---

## Touchpoint 4 — The Why Deck v2 (`why-deck/Why Deck v2.html` + `app-v2.jsx`)

### Critical

**1. The entire card-browsing interaction is mouse/touch-only.** Every card cell in the grid is a plain `<div className="v2-cell" onClick={...}>` (app-v2.jsx line 261) — no `tabIndex`, no `role="button"`, no `onKeyDown`. The card's own flip trigger (`.v2-card-3d`, line 46) is the same pattern. There is no way for a keyboard user to flip a card, open a card's "read the back" content, or open Focus/browse mode for any of the 174 cards. The one genuinely accessible control on each card — the "+/✓" pick button — *is* a real `<button>`, so a keyboard user can pick values blind, but cannot read what they're picking.
- **Guideline:** WCAG 2.1.1 (Keyboard).
- **Affected users:** Keyboard-only and switch-access users are locked out of the deck's core purpose (reading the blurb + reflection prompt on the back of each card).
- **Remediation:** Convert `.v2-cell`/card wrapper to a `<button>` (or add `tabIndex={0}`, `role="button"`, and Enter/Space `onKeyDown`) that triggers the same flip/open behaviour as `onClick`.

**2. The Focus (read/browse) modal has no dialog semantics and no focus management.** `<div className="v2-focus">` (app-v2.jsx line 127) has no `role="dialog"`, no `aria-modal="true"`, and nothing moves keyboard focus into it when opened or restores focus on close. Background grid content is not marked `inert`/`aria-hidden`, so it remains in the tab order behind the visually-covering overlay. (This compounds #1 — currently nothing can open this modal via keyboard at all, but it should be fixed as a modal regardless, since mouse users do reach it and AT users following along would be equally stuck once entry is fixed.)
- **Guideline:** WCAG 2.4.3 (Focus Order), 4.1.2, "Dialog (Modal)" APG pattern.
- **Remediation:** Add `role="dialog" aria-modal="true" aria-label="[card name]"`, move focus to the close button on open, trap Tab within the modal, and restore focus to the triggering element on close.

### Major

**3. Two sets of controls are below the WCAG 2.2 minimum touch-target size (24×24px).** `.v2-tray-x` (remove-from-tray button) is **18×18px**. `.v2-rail-l` (A–Z jump links) are **22×18px**. Neither qualifies for the spacing exception (targets sit with only a few px between them).
- **Guideline:** WCAG 2.5.8 (Target Size — Minimum, AA in 2.2).
- **Affected users:** Motor-impaired and touch-screen users.
- **Remediation:** Pad the clickable area to at least 24×24px even if the visual glyph stays small (increase padding/hit-area, not necessarily the visible circle).

**4. Search input has no associated `<label>`** — only `placeholder="Search values…"`.
- **Guideline:** WCAG 3.3.2, 4.1.2.
- **Remediation:** Add a visually-hidden `<label for="...">Search values</label>` (there's precedent for this exact pattern in the Why Workbook's `.sr-only` class — reuse it).

**5. Password gate error is unassociated, same pattern as elsewhere in the portfolio** (`#_gerr`, toggled via `style.display`, no `aria-live`, no `aria-describedby` on `#_gin`, no `aria-invalid`). Repeats verbatim in the Masterclass deck's gate (same code).
- **Remediation:** as Touchpoint 3, finding 1.

**6. Corner index label text fails contrast: `~3.35:1`.** `.v2-corner` (card number + name, e.g. "003 · JOY") uses `color: var(--charcoal)` at `opacity:.6` over the paper card face.
- **Guideline:** WCAG 1.4.3.
- **Remediation:** Raise opacity to ~0.85+ or use a solid darker tone.

### Minor

**7. Letter-group headers are `<div class="v2-letter">`, not real heading elements**, so screen-reader heading-navigation cannot jump between the 26 alphabetical sections the way the sighted A–Z rail allows visually.
- **Remediation:** Wrap in `<h2>` (visually restyle if the 96px display type needs to stay).

**8. Decorative SVG card-art has no `aria-hidden="true"`.** Low severity since the SVGs contain no text nodes and the value name is duplicated as real text alongside every instance, but explicit hiding is best practice and cheap to add.

**9. No `prefers-reduced-motion` handling** for the 3D card flip (`.7s` `rotateY`), hover lift, or focus-modal fade — the flip in particular is a plausible vestibular trigger given the perspective/rotate transform.

---

## Touchpoint 5 — Why Workshop Masterclass v2 (`2023-why-workshop-masterclass-v2.html`)

### Critical

**1. Slide-jump progress navigation is entirely non-interactive markup.** The 34 progress dots are generated as plain `<div class="pdot">` elements (script, near end of file) with only a `title` attribute (a mouse-hover tooltip, not a reliable accessible name) and a `click` listener. They carry no `role`, no `tabindex`, no keyboard handler. They sit inside `<nav aria-label="Slide navigation">`, which advertises a navigable landmark but delivers nothing operable to non-mouse users.
  - **Mitigating factor (confirmed in code):** a separate `document`-level `keydown` listener handles `ArrowUp/ArrowDown/ArrowLeft/ArrowRight` to step sequentially through slides, so keyboard users are not fully locked out of the deck — they can still page through slide-by-slide. What they cannot do is jump directly to slide 20 the way a sighted mouse user can via the dot rail.
- **Guideline:** WCAG 2.1.1 (Keyboard), 4.1.2 (Name, Role, Value), 1.3.1.
- **Affected users:** Keyboard-only and screen-reader users lose direct-jump wayfinding; screen-reader users get no announcement of dots at all (a `<nav>` landmark with nothing readable inside it).
- **Remediation:** Render each dot as `<a href="#slide-N">` or `<button aria-label="Slide N: [title]" aria-current={isCurrent}>`, keeping the same visual styling.

### Major

**2. Progress dots fail touch-target size dramatically:** `5×5px` with `7px` gaps (≈12px pitch) — far below the 24×24px WCAG 2.2 minimum and outside the spacing exception.
- **Remediation:** Keep the small visual dot but wrap it in a larger invisible hit-area (≥24×24px) per dot.

**3. Global `scroll-behavior: smooth` + `scroll-snap-type: y mandatory` on `<html>`, with no `prefers-reduced-motion` override anywhere in the file.** Every slide transition — arrow key, dot click, or manual scroll — is a forced animated/snapped scroll. This is the single largest concentration of the motion issue in the portfolio, since slide navigation *is* the primary interaction model for this file.
- **Guideline:** WCAG 2.3.3 (Animation from Interactions, AAA — but good practice regardless at AA), general vestibular-safety best practice.
- **Affected users:** Users with vestibular disorders who have set the OS-level "reduce motion" preference.
- **Remediation:** Wrap both rules in `@media (prefers-reduced-motion: no-preference)`.

**4. Password gate error unassociated** — identical pattern to the Why Deck gate (same code, same fix).

**5. Same core-palette contrast failures apply wherever `--teal`, `--pink`, or `--muted` are used as text** on this deck's `--paper`-background slides (confirmed present via shared `:root`; not separately re-derived here since the values are identical to the reference table).

### Minor

**6. Heading levels chosen for visual size, not document structure**, most visibly at the three stacked `<h2>` elements (~lines 1325, 1328, 1331) used to render one three-line visual composition at decreasing emphasis on a single slide — three heading-navigation stops that don't represent three distinct topics.

### What's working well
Decorative blob images consistently and correctly use `alt=""` throughout (dozens of instances checked), and the one inline decorative SVG icon found (line 1162) correctly carries `aria-hidden="true"`. This file's image-accessibility hygiene is the best in the portfolio and should be the reference pattern for the others.

---

## Needs manual/live verification (not assessable from static source)

- Actual keyboard focus order through the homepage's mega-nav once dropdown `:focus-within` is added (interaction between the mobile media-query JS and desktop CSS should be re-tested live).
- Real screen-reader announcement behaviour of the Why Workbook's `aria-live="polite"` chat log under actual network latency / streaming conditions (NVDA/JAWS/VoiceOver may each queue or clip differently).
- Whether the Why Deck's Focus modal, once made keyboard-operable, actually traps focus correctly in-browser (React re-render timing can affect this in ways static reading can't predict).
- Colour rendering on real, colour-managed displays — the ratios above are computed from literal source hex values; a colour-managed screen or print export could shift them slightly.
- Reflow/zoom behaviour at 400% (WCAG 1.4.10) across all five touchpoints — none of the fixed-width sidebar/rail/tray layouts (Why Deck rail+tray, D2M topbar) were evaluated for reflow collapse.
- Actual behaviour with the OS `prefers-reduced-motion` flag enabled, once implemented, across all scroll-snap/flip/transition surfaces.

---

## Cross-Touchpoint Synthesis

Ranked by leverage — fix these first, they each resolve findings across multiple touchpoints at once.

1. **"Clickable `<div>`" is the portfolio's dominant interaction anti-pattern.** The homepage's dropdown menu, every D2M module's context accordion, every Why Deck card cell + Focus modal trigger, and the Masterclass's slide-jump dots are all built the same way: a `<div>`/wrapper with an `onclick`/`onClick` and nothing else. This single pattern, repeated five different times in five different files, accounts for most of this review's Critical findings. It's worth fixing once as a rule ("interactive things are `<button>`/`<a>`, or get `role`+`tabindex`+`onKeyDown`") rather than five separate times.

2. **No `prefers-reduced-motion` support exists anywhere in the codebase** (confirmed by search — zero matches outside this review's own brief). Given how much of the portfolio's navigation model *is* scroll-snap/smooth-scroll (D2M's presenter mode, both Masterclass decks, Why Deck's flip transitions), this is a single global fix (wrap the relevant rules in a media query) with outsized reach.

3. **The brand's signature accent colours (`--teal`, `--pink`) do not meet text-contrast minimums against `--paper`**, and are nonetheless used directly as link/CTA/label text color on the homepage, in D2M eyebrows, and in Why Deck index labels. `--muted`, the default secondary-text colour, fails AA by a narrow margin (4.37 vs. 4.5) nearly everywhere it's used for body copy. This is a palette-level problem, not a per-page bug — the fix belongs in the shared design tokens (a text-safe darkened teal/pink, and a slightly darker muted), not in each file separately.

4. **Focus indicators are consistently a `border-color: teal` swap**, and teal itself fails the 3:1 non-text-contrast minimum — so the one visual cue keyboard users get for "where am I" is under-contrast on every text input across the D2M workbooks and the Why Workbook chat app.

5. **Visual-only error/status feedback recurs at every password gate (Why Deck, Masterclass) and in the D2M save-toast and Why Workbook email-capture flow.** None are connected to assistive tech via `aria-live`, `role="alert"`, or `aria-describedby`. This is a single reusable fix pattern (an accessible error/toast component) that would resolve four separate findings at once.

6. **Missing or placeholder-only form labels** appear in D2M (several reflection textareas) and Why Deck (search input) — inconsistent with the otherwise-good labeling practice in the Why Workbook app, suggesting the fix is known and applied selectively rather than uniformly.

### Overall assessment against WCAG AA

The portfolio is **not currently AA-conformant**, and the gap is uneven rather than uniform: **The Why Workbook** (AI chat tool) and **D2M's sales-page/index** are close — solid heading structure, labeled inputs, live regions, native `<details>` — and would likely pass an AA audit with the handful of Major fixes above (error announcement, focus-contrast). By contrast, **the portal homepage** (zero headings, keyboard-inaccessible nav), **the Why Deck** (mouse-only card browsing, the tool's core purpose), and **the Masterclass deck** (mouse-only slide-jump nav) each contain at least one Critical, group-blocking failure that would fail an audit outright — specifically on 2.1.1 Keyboard and, for the homepage, 1.3.1/2.4.6 heading structure. Because the same clickable-`div` pattern and the same brand-colour contrast gaps repeat identically across files, the fastest path to AA is the six cross-cutting fixes above, not five independent touchpoint-by-touchpoint passes.
