# Frankly Human — Kit + Airtable Wiring Spec

Full build spec for connecting all four tools to Airtable (data) and Kit (email/tagging). For handing to a Claude Code session.

---

## Current state (the honest audit)

| Track | Front-end tool | Status |
|---|---|---|
| Come Home to Yourself | Why Workbook | Conversational prototype exists in Claude. Not wired to Airtable or Kit. |
| Regional Business Leader | Business Why Workshop | **Not built yet.** Needs coding as a variant of the Why Workbook. |
| Design-Led: Practitioner | Design Thinking Diagnostic | **Not built yet.** Needs coding from the four-phase spec in the curriculum doc. |
| Design-Led: Leader | Design Leadership Diagnostic | **Not built yet.** Needs coding from the four-thread spec in the curriculum doc. |

So there are really two kinds of work here: **backend wiring** (one shared system, build once) and **front-end coding** (four separate flows, build one at a time).

---

## Part 1 — The shared backend (build this once, all four tools plug into it)

### Airtable schema

**Participants**
- `email` (primary field)
- `first_name`
- `created_date`

**Runs**
- `participant` (link to Participants)
- `tool` (single select: `why-workbook` / `business-why-workshop` / `design-thinking-diagnostic` / `design-leadership-diagnostic`)
- `status` (`in-progress` / `complete`)
- `created_date`
- `raw_answers` (long text — JSON of whatever the conversation collected)
- `generated_output` (long text — the Why Statement / Business Why Statement / Design Influence Profile / Leadership Influence Profile, plus supporting reasoning)
- `handoff_prompt` (long text — the pre-filled "continue in Claude" text, same pattern as the Plan B Engine teardown)

That's the whole schema needed for Phase 1. Don't add more tables yet — a Tool Configs table can wait until there's a real reason to make flows editable outside code.

### Kit setup (what's already done vs what's left)

**Already done, per earlier setup:**
- Tag structure created (`track:*` × 4, `stage:*` × 5)
- Custom fields started (`why_statement` at minimum)

**Still to do when back at the computer — API method only, no forms or Rules needed:**
- Grab your Kit API key (Settings → Developer)
- Grab each tag's numeric ID — Kit's API tags-a-subscriber endpoint needs the tag ID, not the tag name. Check this via the tag's detail view in Kit, or by calling `GET /v4/tags` once you have the API key, which lists every tag with its ID.
- Confirm the trial→paid conversion is sorted so nothing gets suspended mid-build
- Finish and activate both email sequences (don't leave drafts unpublished like "Would you like to continue?" was showing)
- **No forms or Rules needed** — the Netlify function calls Kit's API directly (create subscriber + apply tags + set custom field), bypassing forms entirely. Forms/Rules were only relevant to the simpler no-code approach we decided against.

### The Netlify function (this is the actual new code)

One function, reused by all four tools (pass `tool` as a parameter):

```
POST /api/complete-run

Input:
  - email
  - first_name
  - tool  (why-workbook | business-why-workshop | design-thinking-diagnostic | design-leadership-diagnostic)
  - raw_answers (whatever the conversation collected)
  - generated_output (the statement/profile text)
  - handoff_prompt (the pre-filled continue-in-Claude text)

Does, in order:
  1. Look up or create the Participant in Airtable by email
  2. Create a new Run record with all the above
  3. Look up or create the subscriber in Kit (POST /v4/subscribers)
  4. Tag them in Kit with the right track tag AND stage:diagnostic-complete
  5. Set the why_statement (or equivalent) custom field in Kit, so email merge tags work
  6. Return { success: true, run_id } to the front-end
```

This single function is what makes the whole architecture reusable — every tool calls the same endpoint at the end of its flow, just with a different `tool` value and different content in `generated_output`. Building it once now means the three tools that don't exist yet don't need any new backend thinking when they're coded — they just need to call this function correctly at the end.

**Kit API pieces needed:**
- API key (Kit Settings → Developer)
- `POST /v4/subscribers` — create/find subscriber
- `POST /v4/tags/{tag_id}/subscribers/{id}` — apply a tag (needs the tag's ID, grab this from Kit once tags are created)
- Setting the custom field is typically part of the subscriber create/update call, not a separate endpoint — confirm exact shape in Kit's dev docs when building

---

## Part 2 — The four front-ends (build one at a time, in this order)

### 1. Why Workbook (Come Home to Yourself) — closest to done
- Take the existing Claude conversational prototype
- At the end of the flow, instead of just displaying the result, call `/api/complete-run` with `tool: "why-workbook"`
- Show the result on-screen either way, plus the handoff-prompt copy block (per the Plan B Engine pattern)

### 2. Business Why Workshop (Regional Business Leader) — build next, unblocks Maffra
- Not a new architecture — literally the same conversational shape as the Why Workbook, with different copy at each phase (Reframe → Non-Negotiables → Turning Points → Business Why Statement, per the translation table already drafted)
- Same end-of-flow call to `/api/complete-run`, `tool: "business-why-workshop"`
- Fastest of the three unbuilt tools since it's mostly copy-swapping an existing flow, not new conversation logic

### 3. Design Thinking Diagnostic (Practitioner) — build after the conference
- New conversation logic: Reframe (onboarding-flow story) → Three Lenses → Six Mindsets → Where Influence Breaks Down → Design Influence Profile
- Call `/api/complete-run`, `tool: "design-thinking-diagnostic"`

### 4. Design Leadership Diagnostic (Leader) — build last, after framework validation
- New conversation logic: Reframe (organisational-power story) → Three/Four Threads → Three Traps → Where the Room Was Lost → Leadership Influence Profile
- Call `/api/complete-run`, `tool: "design-leadership-diagnostic"`
- Deliberately last — the four-thread framework is still unvalidated, no point coding it before the conference conversations confirm it's right

---

## Checklist — what to actually do when back at the computer

**Kit (finish what's in progress):**
- [ ] Confirm trial → paid conversion status
- [ ] Finish and activate both email sequences (don't leave drafts unpublished)
- [ ] Grab your Kit API key (Settings → Developer)
- [ ] Grab each tag's numeric ID (via tag detail view, or `GET /v4/tags` once you have the API key)
- [ ] No forms or Rules needed — skip this entirely, the Netlify function handles tagging via API

**Airtable:**
- [ ] Create the base with Participants + Runs tables, fields as specified above

**Dev session (Claude Code):**
- [ ] Build the shared `/api/complete-run` Netlify function first
- [ ] Wire the existing Why Workbook prototype to call it
- [ ] Build the Business Why Workshop as a copy-variant of the Why Workbook
- [ ] Test both end-to-end: complete a run → check Airtable has the record → check Kit tagged correctly and fired the sequence

**Deliberately not yet:**
- [ ] Design Thinking Diagnostic and Design Leadership Diagnostic front-ends — after conference, in that order
