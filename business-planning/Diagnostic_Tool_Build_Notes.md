# Diagnostic Tool Build Notes — Learnings from "Plan B Engine" Teardown

Reference notes for whenever the Practitioner or Business diagnostic tool actually gets built (Why Workbook style, Claude API + Netlify). Pulled from tearing down a competitor coach's lead-magnet tool.

---

## What worked well

**The capability-vs-enjoyment split.** "What do people come to you for?" followed immediately by "just because people come to you for it doesn't mean you love doing it — tap the ones you genuinely enjoy." Honest, non-obvious distinction. Same shape as the capability-vs-credibility split in Design-Led — worth reusing the phrasing pattern ("just because you're asked for it doesn't mean it's yours to keep doing") if a similar filter gets built into any Frankly Human diagnostic.

**Tap-to-rank over free text.** "Top 3, in the order they matter" as numbered chips, not a text box. Faster on mobile, still captures priority not just presence. Directly applicable to the Why Workbook's "star your top 3" if it's ever built as tappable UI instead of pure chat.

**Permission-giving copy.** "It's okay if none of these light you up — that tells us something too." Lowers the stakes of answering honestly. Consistent with our own "draft, not destination" instinct — worth using more of this kind of line in any tool we build.

**Skills tagged by feeling, not just listed.** "List your skills" then tag each one Love using it / It's fine / Can do it but dread it — captures capability AND sentiment in one interaction instead of two separate questions. Strong pattern to steal for a Practitioner or Leader diagnostic — tagging skills by dread/love would surface a Silent Expert pattern almost automatically, without asking about it directly.

**Demographics last, not first.** Years working, seniority, salary all asked at the end, after the values/skills work — keeps early questions from feeling like a form. Use purely for output personalisation, not framing.

**Output structure, per recommendation:**
- **Fit** — ties back to specific things the person actually said ("you flagged X as a green skill," "you said your best environment is a turnaround"), not a generic archetype match
- **Trade-off** — the honest downside stated plainly, not just upside. Most tools skip this; it's what makes the output feel credible rather than salesy
- **Numbers** — real market rates, explicitly measured against the person's OWN stated targets (their "survival number," their "breathe number"), not generic benchmarks
- **First step this week** — concrete, doable without new infrastructure ("no website needed, just a one-pager and three conversations")

That "measure against their own stated number" move is the sharpest thing in the whole tool. If Design Leadership Diagnostic or Business Design Reset ever names a cost or a pattern, tying it back to something the person themselves stated earlier (their actual salary bracket, their actual team size, their own survival number equivalent) will land harder than a generic statement.

**Stopgap/bridge option alongside the big bets.** Not every recommendation needs to be the pivot — naming one small, fast, low-risk option alongside bigger structural ones is honest in a way most coaching tools aren't.

**Error state tone.** "Something hiccupped — it's not you, try again" matches our own warm-clarity tone. Good reference for our own failure states.

---

## What didn't work — avoid these

**Correction from a later screenshot: there IS an export, and it's smarter than a simple download.** A "Takeaway tools" screen offers (1) Save/Print as a clean one-pager PDF, and (2) an "Operationalise it" handoff — a pre-filled prompt the person copies into Claude or ChatGPT, containing their chosen route, the "why it fits" reasoning, their full skills list, their financial targets, their first step, and their working style, ending with an explicit ask for a week-by-week 90-day plan.

That handoff prompt is the single best idea in this tool. Rather than building a full planning engine themselves, they packaged everything the diagnostic already knows into a complete, ready-to-paste prompt and handed the person off to go deeper elsewhere — honest about the tool's actual boundary (diagnosis, not infinite planning) while still giving a path to more depth, at zero extra build cost. This is a legitimate pattern for us to copy directly: a diagnostic doesn't need to do everything itself — it needs to produce a rich enough structured output (pattern named, specifics cited, numbers attached, working style noted) that a follow-up Claude conversation can pick up seamlessly with no re-explaining required. Worth building this exact handoff — a "continue in Claude" prompt — into whichever Frankly Human diagnostic gets built first, rather than trying to script every downstream step inside the tool itself.

**Original (incorrect) note, retained for context:** the no-export gap noted from the first pass wasn't accurate — this screen wasn't visible until later in the flow. Still worth the general lesson: if a tool's export or handoff mechanism isn't reachable within the first few screens, it's easy to miss and easy for a real user to abandon before finding it. Ours should surface the "save/continue" option early and often, not just at the very end.

**Not mobile-optimised, despite clearly being used on mobile.** The left nav ("Plan B Engine," Dashboard/My Plan B/Reports/Profile & Settings, Connected status, Sign Out) is sticky and fixed-width, and in portrait orientation it eats close to half the screen — pushing all actual question content into a narrow column on the right. Confirmed by direct experience: had to complete the whole flow in landscape to see it properly, which is not a natural way to hold a phone through a 12-step quiz.

**Lesson for our build:** if this becomes a phone-first diagnostic (which the Why Workbook funnel and both track diagnostics almost certainly will be, given the audience), the nav/chrome needs to collapse or hide entirely in portrait — not just shrink. A persistent sidebar is a desktop pattern; it should not survive the transition to mobile at all. Test the actual build in portrait on a real phone before considering it done, not just in a resized browser window.

---

**Saved, revisitable runs ("Reports").** Every completed run is saved with a timestamp and title, listed newest-first, one marked "CURRENT." Opening a past run shows its full Profile Card, options, and chosen plan again — nothing is lost once the session ends. This is the natural home for our own "draft, not destination" language: if someone's Why Statement or Business Why Statement is meant to be revisited and tweaked over time, there needs to be a persistent place it lives, not just a single-session chat output. Strongly suggests our tools need at least lightweight accounts/persistence, not just a one-shot conversation.

---

## Anti-pattern: manufactured urgency (what NOT to do)

Source: a LinkedIn post using a "red pill / blue pill" framing to pressure corporate professionals toward leaving their jobs. Worth keeping visible as a named anti-pattern, since some of its craft is genuinely good and easy to accidentally absorb along with the manipulative part if not separated deliberately.

**What's reusable, and already consistent with Frankly Human's voice:**
- Naming a feeling the reader hasn't articulated yet ("you cannot quite name it, but it's there") — the same move as "...is that me?", as long as it holds up a mirror rather than diagnosing the reader
- Concrete sensory scenes over abstraction ("watching the clock," not "feeling stuck") — already present in the onboarding-flow story and "on time, under budget, still wrong"
- Personal story as evidence, when it costs the storyteller something to admit
- Closing on agency, not urgency

**What's NOT reusable — the actual mechanism doing the damage:**
A binary that forecloses one option as self-deception before the reader gets to think ("comfortable cage you decorated so well you forgot it's a cage" vs "freedom"). This denies the legitimacy of the reader's own honest answer, directly opposite to "it's okay if none of these light you up, that tells us something too."

**The redeemable version of the same structure:** two real paths, both given honest trade-offs (same discipline as the Plan B Engine's Fit/Trade-off/Numbers output), with neither one coded as a lie or a cage. Keep the craft, drop the coercion.

---

## Anti-pattern: delegitimising the reader's real prior effort

Source: a Facebook masterclass ad ("If you're feeling stuck in life") targeting women broadly, using an unfalsifiable diagnosis and dismissing real help already sought.

**The mechanism, worth naming precisely:**
- Opens with flattery and validation ("it's not delusion, it's just who you are") before pivoting to diagnose an invisible problem only the product can see: "you're not fully living it yet because of your subconscious beliefs." Unfalsifiable by design, nobody can check whether they have the right subconscious beliefs, so the ad gets to define the problem in a way only its own offer resolves.
- Lists everything the reader has actually already tried, journaling, affirmations, podcasts, courses, even therapy, and dismisses all of it as "surface-level." This is the sharpest and most important part to avoid: it doesn't just build urgency, it actively delegitimises real help someone may have already received, including licensed therapy, to clear space for its own offer.
- Invents undefined jargon ("the identity loop") that sounds like a real psychological mechanism but isn't one, giving false authority without being accountable to anything.
- Closes on aspirational identity markers ("main character energy," "backs herself") stacked with no real content behind them, unlike the red-pill post above, there's no specific scene, no real personal cost admitted, almost none of the redeeming craft, closer to pure pressure.

**Why this one matters more than the others to actively guard against:** Frankly Human's own guardrails explicitly refuse to do the opposite of this move, "I can't offer therapeutic advice, let's explore what this brings up for you" (from the Why Workshop and both diagnostics' guardrail sections). Implying a program can succeed where therapy failed, or that any prior real effort was merely "surface-level," is a serious overreach and directly contradicts Frankly Human's own stated guardrails. Never frame prior therapy, coaching, or other real help as insufficient or surface-level in any Frankly Human content, even implicitly.

---

## Architecture question still open



This tool is a **wizard/quiz** — fixed question sequence, tap targets, step counter, persistent account/dashboard. Our diagnostics are currently scripted as **chat-based coaching conversations** — adaptive, no fixed question count, no login. These are genuinely different products:

- Wizard: faster to build, easier to make mobile-safe, less responsive to individual answers, easier to add tap-to-rank/tag-by-feeling interactions
- Chat: slower to build, more adaptive, matches the "thinking partner" tone more naturally, harder to keep mobile-friendly without careful design

Worth deciding this deliberately when the Practitioner or Business diagnostic actually gets built, rather than defaulting to chat because that's how the scripts are currently written.
