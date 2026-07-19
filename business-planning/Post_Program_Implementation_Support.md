# Post-Program Implementation Support — Definition & Design Principles

What "helping people create and live the outcome" actually means for Frankly Human, and how it's structurally different from the retreat/coaching-retainer model both Nilsera and Lisa Markwick are built around.

---

## The core distinction

The event/retainer model's business logic is recurring engagement — the value lives in the room with the facilitator, so the person needs to keep coming back (another retreat, a renewed coaching contract) for the value to continue. That's a legitimate model. It's just not the one Frankly Human's architecture is built for.

Frankly Human's actual mechanism is different: every track produces an artifact the person keeps — a Why Statement, a Business Why Statement, a Design Influence Profile, a Leadership Influence Profile, a 90-day plan. The promise embedded in "compass, not contract" is that the tool hands someone something and gets out of the way, rather than positioning itself as the room they need to keep returning to.

**The gap this document addresses:** right now, nothing structured happens after that artifact is delivered. A 90-day plan on paper is not the same as support to actually live it. Without something here, Frankly Human either quietly becomes the event model by default (people only get value while they're in a live engagement) or under-delivers on its own promise (people get a compass and then genuinely are on their own).

---

## Design principles — what this has to be, and what it can't become

1. **Scaffolding, not coaching.** The job is to help someone execute the plan they already made, not to generate new content or run new sessions. If it starts requiring Jacinta live and present to work, it has quietly become the event model again.
2. **Tied to their own stated action, not generic advice.** Every touchpoint should reference something the person actually said — their Why Statement, their first step, their 90-day plan — the same discipline already used in the diagnostic outputs (per the Plan B Engine teardown: measure against their own stated number, not a generic benchmark).
3. **Async by default.** Email and self-serve check-ins, not scheduled calls, as the default layer. This is what makes it scale without consuming Jacinta's time 1:1 per person.
4. **Time-boxed, not indefinite.** A defined arc (e.g. 30/60/90 days) with a clear end, not an open-ended relationship — keeps this from becoming an unstructured ongoing retainer by default.
5. **Revision-friendly, not renewal-driven.** The goal is to help someone update their own compass as things change, not to sell them a new engagement each time they check back in.

---

## What already exists that this can build on

- **The Runs architecture** (from the dashboard scaffold) already stores every diagnostic output with a timestamp and status — this is the natural home for tracking implementation over time, not just the original result
- **The "draft, not destination" language** already sets the expectation that a statement gets revisited and tweaked — implementation support is the mechanism that actually makes that true, rather than just a nice phrase
- **Kit's tagging and sequence infrastructure** already exists for the entry-point nurture sequences — the same infrastructure can carry a second, later sequence triggered by program completion rather than diagnostic completion

---

## Concrete mechanism — the lightweight version

### 1. A check-in sequence, separate from the entry nurture sequence

Triggered not by diagnostic completion, but by **program completion** (D2M finished, Business Design Reset finished, a Design-Led module cohort finished). Three touchpoints:

- **Day 30** — "Here's what you said you'd do: [their stated first step / 90-day plan opener]. Has it happened? What got in the way, if not?"
- **Day 60** — "What's changed since you wrote this? Would you write the same statement today?"
- **Day 90** — Direct invitation to formally revisit: a short check-in flow (see below) that updates their Run rather than starting a new engagement

This reuses the existing Kit sequence infrastructure and the existing tone (draft, not destination) — it's new content, not new architecture.

### 2. A lightweight "check-in" flow, not a new diagnostic

Shorter than the original tool — three or four questions, not a full coached conversation:

- Is your statement/plan still true? (yes / partially / no)
- What's one thing that's actually changed?
- What's the next right action, given that?

This writes back to the **same Run record** in Airtable as a revision, not a new Run — so the person's dashboard shows their statement evolving over time, not a pile of disconnected sessions. This is the direct, structural answer to "living the outcome," not just delivering it once.

### 3. The community layer — monthly virtual, quarterly in-person

This is deliberately positioned as enrichment sitting on top of the check-in mechanism above, not the thing carrying the core promise. Someone gets full value from their compass and their 90-day check-ins with zero community participation — the gatherings are for belonging and momentum, not where the transformation lives. That distinction is what keeps this different from the Nilsera/Lisa model, where the room *is* the value.

**Structure:**
- **Monthly virtual** — separate per track. Come Home to Yourself and Regional Business Leader get their own monthly session; Design-Led: Practitioner and Design-Led: Leader get theirs once those tracks have graduates to gather.
- **Quarterly in-person** — one shared gathering across all four tracks, new and separate from Maffra and Mewburn (which remain the entry-point/flagship events for their specific tracks, not the community layer).

**Resourcing reality worth naming directly:** at full scale across four tracks, this is 48 virtual sessions a year plus 4 in-person gatherings — a significant ongoing commitment on top of running the diagnostics, the programs, and (currently) a full-time role at Macquarie. This should scale in with track maturity, not launch all at once:

- Now: no community layer yet — no track has graduates
- Near-term: Come Home to Yourself and Regional Business Leader monthly virtuals start once the first cohort completes their program (not before)
- Design-Led tracks: monthly virtuals wait until those tracks are validated and have real graduates
- Quarterly in-person: worth waiting until at least two tracks have active communities, so the shared gathering has enough people to be worth the logistics

This isn't a reason not to design it now — it's a reason to sequence it deliberately rather than let four monthly commitments land simultaneously later this year.

---

## What this deliberately is NOT

- Not a coaching retainer — no expectation of ongoing paid 1:1 time
- Not the primary value mechanism — the check-in flow and artifact revision carry the actual promise; the community layer is enrichment on top, not a substitute for it. Someone gets full value with zero community participation.
- Not indefinite — the check-in arc has a defined arc and a clear endpoint (day 90); the community layer is opt-in and ongoing by design, but never required
- Not launched all at once — the community layer scales in per track as programs actually produce graduates, not as a day-one commitment across all four tracks simultaneously

---

## What this needs from the build

- Add a `program_completed_date` field to Participants (or a `program-complete` stage tag in Kit) to trigger the check-in sequence separately from diagnostic completion
- Build the short check-in flow as a variant of the existing tool architecture — reuses the Netlify function pattern, writes a revision to the existing Run rather than creating a new one
- Draft the three check-in emails per track (12 emails total across four tracks) — lower priority than the entry sequences, but worth scoping once the entry-point tools are live

This is a Phase 2/3 concern relative to the current build priorities — surfaced now so it's designed in from the start rather than retrofitted once programs actually start completing.
