# Regional Business Leader Day — Kit Signup Form Spec

Built as a native Kit form, not Tally — a native form applies tags on submit directly, so there's no second tool and no cross-tool tag-mapping to keep in sync with the automation trigger.

---

## Form name (internal, in Kit)
Regional Business Leader Day — Maffra Signup

## Intro copy (shown above the fields)
A day for regional business owners and leaders — built around "your business is a system" thinking, applied directly to what's actually driving your results.

[Date] · [Venue] · limited to [X] spots.

## Fields

1. **First name** — text, required
2. **Email** — email, required
3. **Business name** — custom field, optional
4. **What's the one thing you'd want this day to help you fix or figure out?** — custom field (long text), optional — a live source of language for later marketing/testimonials, worth asking even though optional
5. **Anything else we should know before the day?** (dietary, accessibility, etc.) — custom field (long text), optional

## Confirmation message (shown after submit)
You're in. Details for the day — exact time, address, what to bring — are coming to your inbox shortly.

If anything changes before then, I'll email you directly at the address you just gave me.

---

## Tagging — set this in the form's "Automation" / "Incentive" settings, so it fires on submit

Apply both tags directly on the form, no separate integration step:
- `track:regional-business-leader`
- `stage:program-interested` *(decided — a Maffra signup is someone interested in a program, not someone who finished a diagnostic. Make sure the Regional Business Leader automation's trigger tag matches this, since the form and the automation are two separate places in the Kit UI that both need to agree.)*

## Where to embed the form
- Standalone Kit-hosted landing page link — this is what goes in the LinkedIn post and the Maffra announcement email as "the signup link"
- Optionally embed the same form inline on a Frankly Human site page if you want a branded landing page rather than Kit's default hosted one
