# Frankly Human — Portfolio Design Review
**Reviewer:** Design Critic (DC)
**Scope:** Portal homepage · D2M workbook site · The Why Workbook · The Why Deck · Why Workshop Masterclass v2
**References used:** No formal brief, design-principles doc, or service blueprint exists for this work — it was built organically, not through this agency's pipeline. In place of those, I've treated two documents as the de facto references, per instruction: `style-guides/Content & Voice Guide.html` (voice/content rules) and `style-guides/Visual Style Guide.html` (visual system). Where I'm inferring intent rather than checking against something explicit, I've said so.

A note up front, because it shapes almost everything below: **these two reference documents disagree with each other.** The Content & Voice Guide (v1.0, dated "May 2026") defines an "Editorial" register (Archivo display type, JetBrains Mono labels, ember/cobalt/lime accents on paper/ink) and an "Earthy" register (charcoal/sand/olive/clay, Caveat script) for D2M. The Visual Style Guide (v0.4, undated but structurally newer) throws that out and defines a completely different pair of registers — "Coaching" (DM Serif Display, Fraunces, Allura, Patrick Hand, ink/paper/teal/pink/yellow/plum) and "frankly@work" (lime-on-ink). Every touchpoint I reviewed for this report actually ships in the *Visual Style Guide* system, not the Content & Voice Guide's. That's evidence the newer document is where the real design intent now lives — but the older one is still live, still linked from the homepage's own "About" menu as a current reference, and at least one shipped asset (Why Workshop v1) still uses its palette. I flag this once here and again in the synthesis, because it's the root cause of more than one finding below.

---

## 1. Portal homepage — `index.html`

### What it's doing
Single-file landing page: sticky nav with dropdowns (Programs / Workshops / Tools / Consulting / About), a hero introducing Jacinta and the practice, a five-phase "Frankly Human Loop" strip, and a card grid linking out to every other touchpoint in this review.

### Ship blockers
- **None specific to this page in isolation.** Its ship blockers are downstream — it is the page that *presents* two problems that live elsewhere (see D2M and cross-touchpoint synthesis): it links a DRAFT sales page as a primary CTA, and it presents "Why Workshop v1" and "v2" as parallel current options when they run on two different, unreconciled design systems.

### Fix round items
- **Craft — the Workshops dropdown normalizes a split brand.** The nav and the card grid both offer "Why Workshop V1" and "Why Workshop V2" side by side, labelled in the card copy itself as "Style Guide 1" and "Style Guide 2." That copy is honest about the split, but honesty about a problem isn't the same as fixing it — a first-time visitor has no way to know which one is "the" Frankly Human, because the page tells them, correctly, that there are two. *Reference: Content & Voice Guide's own hero line — "One practice, one voice, one visual system." Violated, on this page, by this page's own design.*
- **Homepage oversells the D2M curriculum relative to what its own linked page shows.** The "D2M — Full Curriculum" card promises "All 13 modules from Origin Story to Life OS," and the primary "Design to Me" card promises "13 modules · ~28 hrs." Click through and the curriculum index shows only 1 of 13 modules as open, with 5 more fully-built modules mislabelled "Coming soon" (detailed in Section 2). The homepage isn't technically wrong, but it sets an expectation the very next click quietly walks back.

### Post-ship improvements
- Hero copy ("I solve problems with people for people... I'm a creative confidence coach...") is a clean, specific two-part declaration in the house voice — no notes.
- The five-phase Loop strip (See / Sense / Shape / Show / Sustain) is a nice piece of information design: compact, colour-coded, and it correctly foreshadows the fuller version on the D2M page. This is the one place the "shared component, reused faithfully across pages" pattern is working as intended (see Finding 4 in the synthesis).
- Responsive nav (hamburger + accordion dropdowns under 900px) is implemented cleanly and I didn't find a broken state in the markup.

### Ship recommendation
**Ship with fixes.** The page itself is well-crafted and on-system (with the *new* system). The two problems it surfaces belong to the touchpoints they link to, not to this page's design — but this page is where a visitor first encounters both, so it's the highest-leverage place to *not* paper over them with confident copy.

---

## 2. D2M workbook site

Reviewed: `d2m/index.html` (curriculum overview), `d2m/sales-page.html`, `d2m/01-origin-story.html` (deep dive), `d2m/06-future-self.html` (deep dive), plus a structural skim of modules 02–05.

### What it's doing
A 13-module self-authorship curriculum. Each module ships as a single dual-mode HTML file — "Present" mode is a full-bleed scroll-snap deck with facilitator notes; "Workbook" mode collapses teaching content into accordions, opens input fields, autosaves to `localStorage`, and supports clean A4 print. This is a genuinely ambitious, well-thought-through content architecture for a static, no-build site.

### Ship blockers
- **The curriculum overview hides finished work behind "Coming soon."** I checked the file system directly: modules 01 through 06 all exist as fully-authored, ~40KB, 13-slide dual-mode pages (plus A3 canvas companions for each) — not stubs. Yet `d2m/index.html` shows only Module 01 as an active card; Modules 02–06 are rendered as `.module-card.inactive` at 55% opacity with a "Coming soon" label and no link. A visitor arriving at the front door of the curriculum has no way to discover that 5/6 of the built content exists, unless they happen to click "Next" repeatedly from inside Module 01 (whose own in-page nav correctly links forward). This is the single biggest gap between *what's been designed and built* and *what the front door tells you exists*. Fix: sync the index card states to the filesystem before this page is next touched — it's a labelling problem, not a content problem, and should be cheap to fix.
- **Module 06 links twice to a page that doesn't exist.** Both the top nav ("Next →") and the closing-slide CTA ("Continue to Module 07 · Decision Design →") in `06-future-self.html` point to `07-decision-design.html`. That file does not exist in the directory — Module 07 hasn't been built yet. So the exact moment a participant finishes Module 06 — having just written their future-self map and named a behaviour bridge, at the module's emotional high point — the "continue" action is a 404. A curriculum whose whole premise is that it won't let you down at moments of truth should not have a dead link *at* one. Fix: either build a real Module 07 stub before shipping Module 06 as "active," or point the CTA at the curriculum index instead of a module that isn't there yet.
- **The sales page is a live, primary-nav-linked DRAFT.** `sales-page.html` carries a sticky banner reading "DRAFT — internal review only · schedule & pricing to be confirmed," and its Investment section literally displays "TBC" under "Your investment," with an "Enrol now" button that's a `mailto:` link, not an enrolment flow. Despite that self-declared draft status, this exact page is the destination of the homepage's primary "Design to Me" card *and* the main nav's "Programs → Design to Me" link — i.e., it's the first thing a paying-customer-track visitor is funnelled to from the practice's front door. (Note: the task brief for this review said the sales page was *not* currently linked from the main portal nav — that's out of date; I found it linked in both the nav dropdown and the homepage card grid. Worth confirming with Jacinta whether that link was added deliberately or is itself an oversight.) Either this page needs to come off primary nav until pricing is real, or the draft banner needs to come off once it's genuinely ready — right now it's doing neither.

### Fix round items
- **Code-level drift between modules, visible after comparing only two of six.** Module 01 wraps each slide in `<section class="slide" data-slide="N">` and drives its accordion via `toggleContext(this.closest('section'))`; Module 06 wraps slides in plain `<div class="slide">` (no `data-slide`, less semantic) and drives the identical interaction via a differently-named `toggleCtx(this)`. Module 01 keeps a facilitator note on every slide; Module 06 drops the note on 5 of 13 slides (title, both context-overview slides, break, and the debrief-01 slide). None of this breaks anything today, but it's copy-paste drift with no shared template to anchor it, visible after comparing just two of thirteen planned modules — it will compound. *This is a craft/systems finding, not a bug report*: recommend extracting the shared shell (topbar, mode toggle, slide-type CSS, accordion JS, print rules — which are ~90% byte-identical between the two files I read in full) into one include or a copy-paste checklist before Module 07 is built, so the thirteenth module isn't a thirteenth independent fork.
- **Sales page pricing block reads as unfinished rather than "coming soon" done well.** Compare this to `consulting.html`, which handles an unfinished page honestly and well: "More soon," one clear sentence about what's coming, a direct contact path, no fake CTA. The sales page's investment section, by contrast, has the full visual weight of a real pricing block (eyebrow, big serif price, note, CTA button) sitting empty ("TBC") behind a working-looking "Enrol now" button. If the page is going to stay in primary nav pre-launch, it should look more like `consulting.html`'s honesty and less like a finished offer with the price redacted.

### Post-ship improvements
- The three-mode promise (Present / Workbook / "go deeper with Claude") stated on the curriculum index is only two-thirds verifiable from the files reviewed — the Claude coaching-spec integration is referenced but not present in either module file I read in full. Not a defect (it may live server-side or be a future step), just noting it as unverified from source.
- Print stylesheet handling (A4, break-inside: avoid, hiding chrome, exact colour printing for accent slides) is thorough and well thought through in both modules I read — genuinely good craft that's easy to overlook.

### Ship recommendation
**Ship with fixes — and the two blockers above should block.** The underlying module design (voice, pacing, dual-mode interaction, print handling) is some of the strongest work in this portfolio. The problems are entirely about the gap between what's built and what the navigation/links honestly represent — fixable in a focused pass, not a redesign.

---

## 3. The Why Workbook — `why-workshop-app-v2/`

Reviewed: `index.html` (markup/CSS) and `app.js` (interaction logic) in full. I could not run this live, so the interaction model below is reasoned from code, not observed — flagged explicitly wherever that matters.

### What it's doing
A four-phase AI-coached chat workbook (Reframe → Values → Moments of Truth → Why Statement), vanilla JS, no framework, with custom UI components (a values chip-sort, a values-state mapper, an actions list, a Why Statement draft box) interleaved into the chat log, backed by a `/api/chat` endpoint.

### Ship blockers
None found specific to this tool in isolation — see the persistence gap below, which I've placed at Fix round rather than blocker because I can't confirm from source how often it would actually bite (depends on real-world session length and device stability), but it's close to blocker-severity given what this tool is for.

### Fix round items
- **No session persistence, in the one tool where it matters most.** `STATE` lives entirely in a JS variable; there is no `localStorage` write anywhere in `app.js`. A refresh, an accidental back-swipe, a crashed mobile tab, or a phone call mid-session loses everything, including a Why Statement the participant just finished writing. Compare this directly to the D2M module pages reviewed above, which autosave every field to `localStorage` on `input` and show a "Saved" toast — that's the standard this portfolio has already set for itself, in a *less* consequential tool. The Why Workbook is explicitly positioned (per the sales page) as the 45-minute on-ramp that feeds Design to Me enrolment; losing it to a refresh is a real conversion risk, not just an inconvenience.
- **Crisis-path behaviour is unverifiable from source and should be live-tested before wider release.** `CRISIS_KEYWORDS` correctly scans user input and sets `session.distress_flag`, which is sent to the backend and used to suppress the normal `phaseOnResponse()` progression. But nothing in the client renders a visible resource, helpline, or explicit acknowledgement when that flag trips — the entire response to a disclosed crisis is delegated to whatever the server-side Claude system prompt does with `distress_flag: true`, which isn't in this codebase. I'm not able to verify from the front-end alone whether a participant who discloses distress gets an appropriate response. Recommend an explicit live walkthrough of this path (type a crisis phrase, observe the actual coach response) before treating this tool as ready for unsupervised use.

### Post-ship improvements
- The values chip-sort's third-tap-to-star limit (max 3) is only communicated *after* a participant hits it, via a reactive system message ("You already have 3 starred..."). Stating the limit in the initial instruction line would remove a small trial-and-error moment. This is a judgment call, not a rule violation.
- Accessibility groundwork here (aria-live on the chat log, aria-pressed on chip/state buttons, sr-only labels, focus-visible states, abortable fetch with a friendly timeout message and a retry button) is genuinely good engineering discipline for a hand-rolled vanilla-JS tool, and is worth calling out as a positive — this is not boundary-of-scope accessibility review, just noting that the interaction code shows real care.

### Ship recommendation
**Ship with fixes.** The interaction model, as reasoned from code, is coherent and well-built. The persistence gap is the one issue I'd want closed (or at minimum, explicitly accepted as a known risk) before treating this as the front door to a paid program, and the crisis path needs a live check, not a code read.

---

## 4. The Why Deck — `why-deck/Why Deck v2.html`

### What it's doing
An interactive, print-optional browser for 174 illustrated values cards: flip-to-reveal detail, a letter-jump rail, a "tray" for picking favourites, a full-screen focus/lightbox mode. Visually, this is the most elaborate execution of the Coaching register in the portfolio.

### Ship blockers
- **Runtime dependency on unbundled, in-browser JSX transpilation.** The page loads React 18, ReactDOM 18, and Babel Standalone from `unpkg.com` on every page view, then transpiles four `.jsx` files live in the browser via `<script type="text/babel">`. Every other touchpoint in this review is plain HTML/CSS/vanilla JS that loads instantly with zero external runtime dependencies. This one tool is a structural outlier: it's slower to first paint (Babel Standalone is a heavy, well-documented performance cost), and it has a single point of failure that isn't under this practice's control — if `unpkg` has an outage, changes a version, or is blocked by a participant's network, the entire card deck fails to render, with no fallback shown. For a design-led practice whose stated value is care and rigour, this is the one place the engineering doesn't match the design.
- **Stray dev-tooling shipped to production.** The page also loads `tweaks-panel.jsx`, which by its own header comment is a reusable prototyping shell — it listens for `__activate_edit_mode` messages from an external "host" and exposes `EDITMODE-BEGIN/END` template markers. This reads as leftover scaffolding from whatever tool was used to build the prototype, not a feature of the Why Deck itself. It adds load weight and exposes internal tooling in view-source for no user-facing benefit. Recommend stripping it before this is treated as a finished, public tool.

### Fix round items
- **The "password gate" doesn't gate anything.** Access control is `sessionStorage` plus a hardcoded password (`"frankly"`) checked in plaintext, client-side JavaScript — visible in seconds via view-source, with no server-side enforcement at all. If the intent is genuine access control, it fails completely. If the intent is a soft "don't index this / casual-browsing deterrent," that's a legitimate and common pattern, but the UI (`#_gtit`, "Incorrect password — try again," a real error state) presents it with the full visual confidence of an actual gate, which invites a false sense of privacy for whatever's behind it. I'm flagging this as a design-honesty question — does the interface deliver the promise its own copy makes — not as a security audit, which is out of my remit here.

### Post-ship improvements
- I was not able to verify the "174 values" count from source in the time available (the values data file's structure didn't match my first grep pattern); worth a quick manual spot-check that the full set renders and each card's back face has real (not placeholder) blurb/prompt copy.
- The flip-card, letter-rail, and tray interactions are genuinely well-designed — good micro-interaction craft (hover lift + slight rotation on cards, a paper-grain texture overlay, a fanned-deck motif reused consistently with the Why Workbook's brand panel). This is strong visual work sitting on top of a shaky engineering foundation.

### Ship recommendation
**Ship with fixes — engineering fixes specifically.** The design is some of the best-looking work in the portfolio; the delivery mechanism is the weakest engineering in the portfolio. I'd want the CDN/Babel dependency and the leftover tweaks panel addressed before treating this as equivalent in production-readiness to the rest of the site.

---

## 5. Why Workshop Masterclass v2 — `2023-why-workshop-masterclass-v2.html`

### What it's doing
A 34-slide, scroll-snap presentation deck (values → purpose → the Why framework → D2M pitch), fully restyled from an earlier version into the current Coaching register.

### Ship blockers
None found.

### Fix round items
- **The deck is date-stamped 2023 and presented on a 2026 homepage with no archival framing.** The filename (`2023-why-workshop-masterclass-v2.html`), and the literal footer text on the closing slide ("Frankly Human · 2023"), both anchor this to a specific past year, yet the homepage links it as a current, undated offering ("Open deck →") alongside a 34-slide sibling deck ("v1") from the same year. Whether this is a deliberately reused, evergreen workshop asset (reasonable — the content doesn't read as time-bound) or simply hasn't been re-dated since its last real update is something only Jacinta can resolve; I'm flagging it as an inference, not a fact, but it's worth a two-minute decision either way: update the year, or add a line that makes clear this is a stable, reusable asset rather than a stale one.

### Post-ship improvements
- I spot-checked every slide's class markers (all 34 `<section class="slide...">` blocks) for palette/type consistency and for Content & Voice Guide "avoid list" violations (corporate filler words, exclamation marks). Found none — the deck is clean, on-voice, and on-system throughout, including consistent use of the sketch-mark underline/circle primitives, the Allura signature accent, and the DM Serif Display / Fraunces / Inter type stack.
- Keyboard navigation (arrow keys), a clickable progress-dot rail, and an `IntersectionObserver`-driven active-slide indicator are a nice, unobtrusive craft addition and match the same scroll-snap pattern used in the D2M presenter mode — good internal consistency between two otherwise-separate parts of the codebase.

### Ship recommendation
**Ship.** This is the cleanest touchpoint in the review relative to its own reference documents. Its only real issue (the year anchor) is a judgment call for Jacinta, not a defect.

---

## Cross-touchpoint synthesis

Five patterns repeat across multiple touchpoints. Fixing these once is higher-leverage than fixing each symptom where it happens to surface.

1. **Two competing "current" style guides.** The Content & Voice Guide (Archivo/JetBrains Mono/Caveat, ember-cobalt-lime and charcoal-sand-olive-clay registers) and the Visual Style Guide (DM Serif Display/Fraunces/Inter/Allura/Patrick Hand, ink-paper-teal-pink-yellow-plum registers) describe two different brand systems, and both are live, both are linked from the homepage's own "About" menu as current references, and both are actually in production use — every touchpoint I reviewed in depth ships the newer system, but "Why Workshop v1" ships the older one, and it sits right next to v2 in primary nav with copy that names the split out loud ("Style Guide 1" / "Style Guide 2") rather than resolving it. **This is the single highest-leverage fix in the whole review.** Either formally retire the Content & Voice Guide and its v1 assets (mark them legacy, pull from primary nav), or reconcile the two documents into one current source of truth. As it stands, there is no way for anyone — a future collaborator, or Jacinta in six months — to know which document governs a new page.

2. **"Coming soon" labels that have quietly gone stale.** The D2M curriculum index marks five fully-built modules as "Coming soon." This is the same failure mode, in miniature, as the sales page's DRAFT banner staying live after the page got linked into primary nav. `consulting.html`, by contrast, is a model of doing this well — a genuinely unfinished page that says so plainly, with one honest sentence and a real contact path, no fake CTA sitting on top of empty content. Recommend one standing rule across the whole site: a page or card's "coming soon" / draft state gets removed in the same commit that makes the content real — it should never be possible for finished work to still say "coming soon."

3. **Dead or misleading links land at emotionally loaded moments.** Module 06 of D2M — the module about imagining your future self — ends with a "continue" link to a module that doesn't exist. A curriculum whose whole design premise is "we don't drop you at the moment of truth" should be especially careful that its own navigation doesn't do exactly that.

4. **No shared component layer, and the drift is already visible.** Every module, deck, and page in this portfolio hand-rolls the same ~10 recurring primitives (topbar, accent stripe, slide-type CSS, eyebrow, serif h1/h2/h3, activity block, debrief block, module CTA) from scratch in each file. That's a defensible choice for a no-build static site, but comparing just two of thirteen planned D2M modules already turned up copy-paste drift (renamed JS functions, inconsistent semantic tags, inconsistent facilitator-note coverage). This will get harder to manage, not easier, as more modules ship. Worth deciding now — before Module 07 — whether to introduce a lightweight include/build step or to accept and actively manage the drift.

5. **Engineering rigour is inconsistent across otherwise-equal touchpoints.** Everything else in this portfolio is plain, dependency-free, fast-loading HTML/CSS/vanilla JS. The Why Deck alone pulls in three CDN scripts and transpiles JSX live in the browser, plus ships a stray dev-tooling file. It's the best-looking single piece of visual craft in the review and the least production-ready piece of engineering — worth bringing up to the same bar as everything around it.

### Overall ship recommendation: **Ship with fixes.**

The design craft here — voice, type, palette discipline (within the newer system), interaction pacing, print handling, accessibility groundwork in the hand-rolled JS — is genuinely strong and well above what "built organically, no formal pipeline" would lead you to expect. Nothing found in this review calls for a redesign. But two things should not go out as-is: the D2M Module 06 dead link, and the DRAFT sales page sitting in primary nav with a "TBC" price and a fake enrolment button. Both are quick, contained fixes. Everything else — the two-style-guide split, the stale "coming soon" labels, the Why Deck's engineering, the code drift between modules — is real and worth a focused pass, but none of it should hold up shipping what's already working well.
