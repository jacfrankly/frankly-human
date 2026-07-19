# "Coach in Your Pocket" — WhatsApp Build Approach

A phased plan for extending the diagnostic/coaching architecture to WhatsApp. Reuses the same Netlify + Airtable + Claude API backend already speccd for the four diagnostic tools, WhatsApp is a new interface on top of it, not a new system.

---

## Phase 0 — Decision checkpoint (do this before anything else)

**Activity:** Compare WhatsApp Business API against Telegram honestly before committing build time.

| | WhatsApp Business API | Telegram Bot API |
|---|---|---|
| Setup | Meta Business verification required | Free, instant via @BotFather, no verification |
| Ongoing cost | Per-message fees after a small free tier | Effectively free (just Claude API usage, fractions of a cent per message) |
| Outbound messaging rules | Requires pre-approved templates for messages sent outside an active 24-hour conversation window | No such restriction |
| Audience familiarity | Near-universal in Australia | Lower, but common among tech-comfortable and international audiences |
| Build complexity | Higher | Lower |

**Decision to make:** is WhatsApp specifically necessary because of who the audience is (older, more mainstream, expects WhatsApp specifically), or would Telegram deliver the same "coach in your pocket" experience for meaningfully less build and ongoing cost? Worth answering this honestly before Phase 1, since the two builds are similar in shape but very different in effort.

**Output:** a one-line decision, WhatsApp, Telegram, or both, with the reason written down, not just decided in your head.

---

## Phase 1 — Meta Business setup (WhatsApp-specific, skip if Telegram is chosen instead)

**Activities:**
- Create or confirm a Meta Business Portfolio
- Register a WhatsApp Business phone number (can't be a number already active on personal WhatsApp)
- Complete Meta's business verification process
- Note the realistic timeline, this step alone can take days, sometimes longer if verification is contested, factor this into any launch date

**Output:** a verified WhatsApp Business number ready to be connected to a webhook.

---

## Phase 2 — Backend wiring (the core build)

**Activities:**
- Build a new Netlify function, `/api/whatsapp-webhook`, separate from but structurally identical to `/api/complete-run` from the existing wiring spec
- Register this webhook URL with Meta so incoming WhatsApp messages are forwarded to it
- On each incoming message: identify the sender (phone number), look up or create their Participant record in Airtable, load their conversation state (which phase of which flow they're in)
- Call the Claude API with the relevant flow's system prompt (Why Workbook, Business Why Workshop, or one of the diagnostics) plus the message history for that conversation
- Send Claude's response back to the sender via the WhatsApp API
- On flow completion, write the Run to Airtable and fire the same Kit tagging call already specced for the web version

**Output:** a working, if rough, end-to-end WhatsApp conversation that mirrors the web-based diagnostic flow.

---

## Phase 3 — Message templates and compliance

**Activities:**
- Identify which messages need to happen outside an active 24-hour conversation window, most importantly the post-program check-ins (day 30/60/90) from the implementation-support design
- Draft these as WhatsApp message templates and submit them to Meta for approval, this can take several days and templates can be rejected, requiring resubmission
- Do not assume this step is quick, build it into the timeline explicitly

**Output:** approved templates ready to use for anything sent proactively, not just in response to an incoming message.

---

## Phase 4 — Testing and soft launch

**Activities:**
- Run the full flow yourself, end to end, on a real WhatsApp number before anyone else touches it
- Test what happens on interruption, someone starts the Why Workbook, stops mid-conversation, comes back three days later, does the state resume correctly
- Invite two or three trusted people (not paying clients) to test the real flow and give honest feedback on the experience specifically on WhatsApp, not just whether the content is good
- Monitor actual per-message costs against the Meta pricing tier during this test period

**Output:** a validated flow and a real cost estimate, not a guess, before opening it to real clients.

---

## Phase 5 — Rollout

**Activities:**
- Add the WhatsApp number to relevant marketing surfaces, LinkedIn About, email signatures, the primer posts, wherever it makes sense
- Confirm Kit tagging and the Runs table are receiving WhatsApp-originated completions correctly alongside web-originated ones, they should be indistinguishable in the data model, just tagged with a different source
- Decide whether WhatsApp is offered as the only entry point for some future track, or as an alternative alongside the web tool, worth deciding deliberately rather than defaulting

---

## Where this fits the existing roadmap

This is explicitly a Phase 3/4 idea relative to what's launching this week and next. Nothing here should start before the web-based Why Workbook and Business Why Workshop are live and have run real conversations, since the backend architecture this reuses needs to already be proven on the simpler surface first. The post-program check-in flow (30/60/90 day) is the natural first candidate for a WhatsApp or Telegram extension, since it's already designed as short, async, low-stakes messages, exactly what a chat platform does well, rather than starting with the full diagnostic conversation, which is longer and more complex to get right on a new channel.
