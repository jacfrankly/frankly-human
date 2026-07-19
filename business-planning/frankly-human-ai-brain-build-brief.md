# Frankly Human — AI Brain + Social Tool: Build Brief

## Purpose
Build a DIY system that replaces manual content planning and ad management for Frankly Human with a Claude-driven pipeline: strategy → draft → review → schedule → paid promotion → performance dashboard with ROI.

This is not a single app. It's four connected components, built in sequence. Do not skip ahead to Component 4 before 1–3 exist — there's nothing to measure yet.

---

## Context: what already exists

**Business:** Frankly Human — independent life-design and design-leadership consulting venture. Four audience tracks (per `Kit_Email_Content_Strategy.md` and `Kit_Airtable_Wiring_Spec.md`):
- **Come Home to Yourself** — Why Workbook → Design to Me (D2M), a 12-module / 3-layer curriculum (Awareness → Alignment → Agency) → in-person/retreat
- **Regional Business Leader** — Business Why Workshop → Business Design Reset (12-module / 3-layer curriculum adapted directly from D2M's structure — Awareness → Alignment → Agency), feeds the Maffra in-person day
- **Design-Led: Practitioner** — Design Thinking Diagnostic, for designers who've stopped being asked for their strategic opinion
- **Design-Led: Leader** — Design Leadership Diagnostic, for Heads of Design who've built credibility but can't get the room

Practitioner and Leader are collectively "Design-Led" — not "AI-Era Design Leader," which isn't current track naming anywhere else.

Core IP: D2M curriculum, and the Frankly Human Loop (See → Sense → Shape → Show → Sustain).

**Current stack:**
- Netlify + GitHub — hosting/publishing (Why Workbook already live at frankly-human-tools.netlify.app)
- Claude API — powers the Why Workbook coaching tool (Haiku, ~AUD $0.05/session)
- Airtable — available, not yet used for content
- Buffer (free plan) — schedules to LinkedIn (personal), Instagram (franklyhumanai), Facebook (franklyhumanai)
- Kit (ConvertKit) — email, payments (Kit's built-in payment engine — no separate Stripe integration), and forms
- Content bank: 7 LinkedIn posts already drafted

**Standing content rules (must be enforced in the Brain, not just remembered):**
- No banking / Macquarie references anywhere in Frankly Human content
- Voice: direct, short punchy paragraphs, no filler, end on observation rather than a call-to-action
- Preferred hashtags: #WomenInBusiness #SmallBusinessOwner #RegionalBusiness #LifeDesign
- "Founder" is explicitly rejected as a term — too tech-coded

---

## Architecture

### Component 1 — The Brain (instruction layer)
A set of separate markdown files (not one mega-prompt) that Claude reads before generating anything:

- `brand-voice.md` — tone rules, banned terms/references, hashtag set, the "ends on observation not CTA" rule
- `positioning.md` — four-track audience definitions (Come Home to Yourself, Regional Business Leader, Design-Led: Practitioner, Design-Led: Leader), what each needs to hear differently
- `frankly-human-loop.md` — See → Sense → Shape → Show → Sustain, explained for content-generation use
- `d2m-context.md` — enough of the D2M 12-module curriculum (and Business Design Reset's parallel 12-module curriculum, for the Regional Business Leader track) for Claude to draw on without inventing content
- `content-pillars.md` — recurring themes/topics to rotate through

Store in a repo. This becomes Claude Code's project context (or a Claude Project's knowledge base if not using Code for this step).

**Build task:** Draft these five files from the source material already written for Frankly Human (positioning docs, Why Workbook system prompt, existing LinkedIn post bank). Flag anything inferred vs anything sourced directly.

### Component 2 — Content pipeline (organic)
Flow: brief/topic → Claude drafts using the Brain → human review/edit → approved post → Buffer (scheduling stays in Buffer, unchanged).

**Build task:**
- Script or Claude Code workflow that takes a short brief (topic + track + platform) and outputs a draft in the established voice
- Output format should be Buffer-ready (per-platform variants if needed — LinkedIn vs IG vs FB copy differs)
- No auto-publish. Human review is a required step before anything goes to Buffer.

### Component 3 — Paid layer (Facebook Ads)
Separate from Buffer, which is organic-only. Requires Meta Marketing API access via a Meta Business/Ads account.

**Approach:** promote organic posts that already perform, rather than designing paid-only creative from scratch. Simpler to build and matches the "organic-first" positioning.

**Build task:**
- Meta Business account + Ads API credentials (manual setup, not code)
- Script to pull organic post performance from Buffer's API to identify promotion candidates
- Script to push a promotion campaign via Meta Ads API for a selected post
- Do not build this until Component 2 is producing content Buffer can measure

### Component 4 — Dashboard + ROI
Pull data from Buffer (organic) and Meta Ads (paid) into one store, visualise, and tie spend to actual revenue.

**Build task:**
- Airtable as the data store — new tables in the existing Frankly Human base (which already holds Participants/Runs for the diagnostic tools per `Kit_Airtable_Wiring_Spec.md`), one table per source (organic posts + metrics, ad campaigns + spend + results). Do not collide with or repurpose the Participants/Runs tables.
- UTM-tagged links on any promoted content, so traffic can be attributed
- Conversion tie-back: UTM → Kit purchase (Kit's payment engine), so ROI = revenue attributed to a campaign vs spend on it (not just clicks or engagement)
- Visualisation layer: Looker Studio pulling from Airtable, or a lightweight custom dashboard if Looker Studio's Airtable connector proves limiting

---

## Build order (do not reorder)
1. Brain (Component 1)
2. Content pipeline, organic only (Component 2) — run this for real for a period before adding paid
3. Dashboard, organic metrics only (start of Component 4) — confirms the data plumbing works before adding ad spend
4. Paid layer (Component 3)
5. Full ROI tie-back (finish Component 4)

## Open decisions for Claude Code to raise, not assume
- Where the repo lives (new GitHub repo vs folder in existing Frankly Human project)
- Whether content review happens in a doc, a CLI prompt, or something else — needs a real answer before Component 2 is built
- Airtable schema — propose one, don't guess silently
- Whether Buffer's free plan API access is sufficient, or whether a paid tier is needed to pull analytics (check before building Component 4)
