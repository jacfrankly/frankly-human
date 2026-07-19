# Frankly Human — Kit Email Content Strategy

How email fits across all four tracks, what to build in Kit this week, and what can wait.

---

## Priority order (matches this week's plan of attack)

1. **Come Home to Yourself** — build now. Why Workbook funnel goes live this week.
2. **Regional Business Leader** — build now. Maffra day needs this to convert signups.
3. **Design-Led: Practitioner** — tagging structure only. Full sequence waits until the diagnostic tool is actually built.
4. **Design-Led: Leader** — capture only. No sequence yet — still unvalidated, conference conversations come first.

---

## Tagging & segmentation structure (set this up first, across all four)

This is the one piece worth building fully now, even for the two tracks that aren't launching yet — retrofitting tags onto existing subscribers later is more work than starting clean.

**Track tag** (which door they came in):
- `track:come-home-to-yourself`
- `track:regional-business-leader`
- `track:design-led-practitioner`
- `track:design-led-leader`

**Stage tag** (where they are in the funnel):
- `stage:diagnostic-complete` (finished the Why Workbook / Business Why Workshop / diagnostic)
- `stage:nurture-active`
- `stage:program-interested` (clicked through / replied / booked a call)
- `stage:program-purchased`
- `stage:coming-soon` (captured before the tool for their track exists — Design-Led only, for now)

**Custom fields** (for merge-tag personalisation in emails):
- `first_name`
- `why_statement` (their actual Why Statement or Business Why Statement text, pulled from the Airtable Run)
- `named_pattern` (for the diagnostics later — their Design Influence Profile / Leadership Influence Profile)

A subscriber ends up tagged e.g. `track:come-home-to-yourself` + `stage:diagnostic-complete`, which is what triggers the right sequence and lets emails open with something like "You said your Why was: [why_statement]" rather than generic copy.

---

## The shared sequence shape

All four tracks use the same six-email arc — same shape as the diagnostic methodology itself (Discovery → Meaning → Action → Integration), just at nurture pace instead of single-session pace. Only the content changes per track.

| # | Timing | Job |
|---|---|---|
| 1 | Immediately | Deliver their result, set expectation for what's next |
| 2 | Day 2–3 | Reinforce — go one layer deeper on what they said |
| 3 | Day 5–7 | Name the trap/pattern that keeps people stuck (their track's version of the "5 mistakes") |
| 4 | Day 10 | POV/story piece — a belief, not a pitch |
| 5 | Day 14 | Soft invite to the next step |
| 6 | Day 21 | Direct invite — the explicit bridge line |

---

## Come Home to Yourself — full sequence (build this week)

**Email 1 — Immediately after Why Workbook**
Subject: Your Why Statement

> Hi [first_name],
>
> Here's what you landed on:
>
> "[why_statement]"
>
> Sit with it for a few days before you do anything with it. It's a draft, not a destination — you'll tweak it as things change, and that's exactly how it's supposed to work.
>
> I'll send a few more thoughts over the next couple of weeks — things that might sharpen it, or challenge it a little. No pressure to reply, just read when it's useful.
>
> Jacinta

**Email 2 — Day 2–3**
Subject: The part most people skip

> Most people write a Why Statement and then go straight back to what they were doing before.
>
> The thing that actually changes something isn't the statement — it's the one small action attached to it. You named one when you did the workbook. Have you done it yet?
>
> If not, that's not a failure. It's just information. What got in the way?

**Email 3 — Day 5–7**
Subject: Comparison, pressure, or just early?

> When people get stuck living out their Why, it's rarely because the Why was wrong. It's usually one of a few things: comparing their life to someone else's version of it, feeling pushed instead of pulled, or mistaking "I'm not sure yet" for "something's wrong."
>
> ...is any of that you, right now?
>
> Worth naming, not fixing. Naming it is usually most of the work.

**Email 4 — Day 10**
Subject: Nothing changes if nothing changes

> [Adapt from the manifesto / closing deck line — a short belief piece on why a Why Statement without action is just a nice sentence. Warm, direct, no ask.]

**Email 5 — Day 14**
Subject: What comes after the Why

> A Why Statement is the entry point. What most people actually want is to build a life that reflects it — not just believe it, but design around it.
>
> That's what Design to Me is. Thirteen modules, four layers, built around exactly the Why you just wrote.
>
> Not pushing it on you — just want you to know it exists, in case the timing's right.

**Email 6 — Day 21**
Subject: Would you like to continue?

> Would you like to continue into Design to Me next?
>
> [Direct CTA link/button.]

---

## Regional Business Leader — full sequence (build this week, feeds Maffra)

**Email 1 — Immediately after Business Why Workshop**
Subject: Your Business Why Statement

> Hi [first_name],
>
> Here's what you landed on:
>
> "[why_statement]"
>
> This is a compass for the business, not a contract. You'll tweak it as the business changes — that's expected, not a sign you got it wrong.
>
> A few more thoughts coming over the next couple of weeks. And if you're near Maffra — there's an in-person day worth knowing about. More on that soon.

**Email 2 — Day 2–3**
Subject: The action, not just the statement

> A Business Why Statement without an action attached is just a nice sentence on a whiteboard.
>
> You named one action during the workshop. Has it happened yet? If not — what got in the way? Cash flow, time, or just the busyness of running the thing?

**Email 3 — Day 5–7**
Subject: The metro playbook was never built for this

> Comparing your business to a metro playbook that wasn't built for regional constraints. Running on pressure instead of purpose. Mistaking busy for progress.
>
> Any of that landing? Naming which one is usually most of the work.

**Email 4 — Day 10**
Subject: Business Design Reset

> [POV piece adapted from Business Design Reset positioning — "your business is a system, systems produce predictable outcomes" — belief piece, no ask.]

**Email 5 — Day 14**
Subject: A day in Maffra

> If you're within reach of Maffra, there's a Regional Business Leadership Day coming up — built directly on the same Why Workshop you just did, plus the business strategy layer that comes next.
>
> [Date/venue once locked. Link to Tally signup.]

**Email 6 — Day 21**
Subject: Would you like to continue?

> Would you like to continue into Business Design Reset next — starting with the Maffra day?
>
> [Direct CTA.]

---

## Design-Led: Practitioner — tagging only, for now

No sequence content yet — the diagnostic tool itself isn't built. What to set up now:

- The tag structure above (`track:design-led-practitioner`)
- A single holding email, sent once, for anyone who lands on a "coming soon" capture (e.g. from a LinkedIn post): acknowledges interest, sets expectation for timing, no false promise of an immediate tool

**Holding email:**
Subject: Thanks for your interest

> Hi [first_name],
>
> Thanks for putting your hand up. I'm building a short diagnostic for designers who feel like they've stopped being asked for their strategic opinion — I'll let you know the moment it's ready to try.
>
> In the meantime, if you want to follow the thinking as it develops, I'm writing about this on LinkedIn — [link].

---

## Design-Led: Leader — capture only, for now

Same holding-email pattern as Practitioner, but tone pitched higher (matches the Leader diagnostic's more direct register) and no LinkedIn link promise until the primer posts are actually confirmed running:

**Holding email:**
Subject: Noted

> Hi [first_name],
>
> You're on the list. I'm building a diagnostic for Heads of Design who've built the credibility and still can't get the room — testing the thinking in person over the next couple of weeks before it's ready to share properly.
>
> I'll be in touch when there's something real to send you.

---

## What to actually do in Kit this week

1. Create the tag structure (track + stage) — five minutes, do this first regardless of anything else
2. Build the six-email Come Home to Yourself sequence, trigger: tag `track:come-home-to-yourself` + `stage:diagnostic-complete`
3. Build the six-email Regional Business Leader sequence, trigger: tag `track:regional-business-leader` + `stage:diagnostic-complete`
4. Add the two holding emails for Design-Led Practitioner/Leader, trigger: respective track tag + `stage:coming-soon`
5. Confirm the Why Workbook and Business Why Workshop tools actually apply these tags on completion — this depends on the Netlify/Airtable build, worth checking before assuming Kit will fire correctly
