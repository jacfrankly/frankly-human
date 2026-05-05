# Frankly Human — Mobile Design & Build Guide

This guide documents how UX is designed for desktop and how it translates to mobile across the Frankly Human platform.

---

## Design Philosophy

**Desktop**: immersive, scroll-snapped, full-viewport presentation. Each slide is a deliberate moment — content is staged for a large screen with room for two-column layouts, typographic scale, and visual breathing room.

**Mobile**: same visual language, same content hierarchy, different reading contract. Slides still fill the full viewport (one thought per screen), but layout collapses to single-column and type scales down from the desktop clamps. The session feels more like turning pages than presenting slides.

The goal on both: **one idea, one screen, full attention.**

---

## Layout System

### Desktop (≥ 680px)
- Slides: `min-height: 100vh`, `scroll-snap-type: y mandatory`
- Two-column grid: `grid-template-columns: 1fr 1fr`, `gap: 64px`
- Slide padding: `100px 72px 64px`
- Progress dots: visible, right edge

### Mobile (< 680px)
- Slides: `min-height: 100dvh`, `scroll-snap-type: y mandatory`
- All grids collapse to **single column**
- Slide padding: `80px 24px 64px` (top accounts for fixed topbar)
- Progress dots: hidden

### Long-content exception (`slide-long`)
Some slides contain more content than fits in one viewport (values list, process steps, objection grid). These use `.slide-long`:
```css
.slide-long {
  min-height: auto;
  scroll-snap-align: none;
}
```
The user scrolls through them naturally. Apply to any section where content reliably exceeds 100dvh on a 390px screen.

**Current long slides:** s11 (values list), s23 (design process), s31 (objections grid)

---

## Typography Scale

| Token | Desktop | Mobile |
|---|---|---|
| `.h1` | `clamp(52px, 13vw, 160px)` | Same — scales via vw |
| `.h2` | `clamp(36px, 9vw, 96px)` | Same |
| `.h3` | `clamp(28px, 7vw, 60px)` | Same |
| `.body-lg` | `clamp(18px, 4vw, 24px)` | Same |
| `.body-md` | `clamp(17px, 3.5vw, 20px)` | Same |
| `.body-sm` | `15px` | Same |
| Base body | `18px` | `18px` |

Typography is designed mobile-first with `clamp()` — it scales automatically. No separate mobile overrides needed for type size.

---

## Grid Rules

| Component | Mobile | Desktop (≥ 680px) |
|---|---|---|
| `.two-col` | `1fr` (single column) | `1fr 1fr` |
| `.values-grid` | `1fr 1fr` (A–J / K–R), S–W full-width | `repeat(3, 1fr)` |
| `.obj-grid` | `1fr` | `repeat(3, 1fr)` at 900px |
| `.why-frame` | `1fr` | `1fr 1fr` |
| `.process` | Wrap + centre, arrows hidden | Row, arrows visible |

---

## Scroll Behaviour

**Both breakpoints** use `scroll-snap-type: y mandatory` on `html` with `scroll-snap-align: start` on each `.slide`. This creates the deliberate one-slide-at-a-time reading experience.

On mobile, scroll-snap works well when each slide is `100dvh`. Avoid stacking too much content in a single snap slide — if content overflows, add `.slide-long`.

Use `100dvh` (dynamic viewport height, not `100vh`) — this accounts for mobile browser chrome (address bar) shrinking/expanding.

---

## Section Openers

Section opener slides (dark/coloured backgrounds with big script + headline) use the class `slide-opener` in addition to `slide` and a colour modifier:

```html
<section class="slide slide-opener slide-ink" id="s5">
```

The `::after` pseudo-element provides a soft CSS decorative circle — no image assets needed:

```css
.slide-opener::after {
  content: '';
  position: absolute;
  width: 60vw; height: 60vw;
  border-radius: 999px;
  opacity: 0.07;
  right: -20vw; bottom: -20vw;
  pointer-events: none;
  z-index: 0;
}
```

Colour the `::after` based on slide colour:
- `.slide-ink.slide-opener::after` → `background: var(--yellow)`
- `.slide-pink.slide-opener::after` → `background: var(--paper)`
- `.slide-teal.slide-opener::after` → `background: var(--plum)`
- `.slide-yellow.slide-opener::after` → `background: var(--plum)`
- `.slide-plum.slide-opener::after` → `background: var(--yellow)`
- `.slide-paper.slide-opener::after` → `background: var(--teal)`

---

## Colour Palette

```css
--ink:      #100000   /* near-black, primary text */
--charcoal: #423B3B   /* secondary text */
--paper:    #FBF7EE   /* warm off-white background */
--paper-2:  #F4EFE2   /* slightly darker paper, alternate sections */
--sand:     #E0D2B5   /* tertiary warm tone */
--teal:     #47ACA4   /* primary accent */
--pink:     #FF3990   /* energy, highlights, CTAs */
--yellow:   #FFBD59   /* warmth, emphasis */
--plum:     #7A1F4A   /* depth, signature script */
--muted:    #7A736B   /* captions, labels */
```

---

## Floating Video Bubble

The presenter bubble sits `position: fixed` in the bottom-right corner and shows a circular video (Loom, Vimeo, or YouTube embed).

### Sizing
- **Avatar (closed):** `clamp(90px, 25vw, 130px)` — approximately 1/8 of screen width as radius on a 390px device
- **Video panel (open):** `clamp(200px, 55vw, 280px)` — larger circle, video crops to fill

### To activate
Find this line in the HTML:
```html
data-src="YOUR_LOOM_OR_VIMEO_EMBED_URL_HERE"
```
Replace with your embed URL. Examples:
- **Loom:** Share → Embed → copy the `src` value from the `<iframe>` code
- **Vimeo:** Share → Embed → copy the `src` value
- **YouTube:** `https://www.youtube.com/embed/VIDEO_ID?autoplay=1`

The video lazy-loads on first open and pauses (by blanking `src`) when closed.

### Video cropping
The iframe is oversized (300% × 300%) and centred inside the circular container. This simulates `object-fit: cover` for iframes. Works best with portrait or square face-cam videos (Loom, Vimeo portrait). 16:9 landscape video will crop the sides — test and adjust `top`/`left` offsets if needed.

---

## Asset Strategy

**No external image assets.** All visual decoration is CSS-only:
- Background circles: CSS `::after` pseudo-elements
- Sketch marks (underline, circle): inline SVG paths
- Section number watermarks: `.bg-num` large typography in `opacity: 0.04`

This means the page loads fast with zero broken image requests and no dependency on an `assets/` folder.

---

## File Naming Convention

| File | Purpose |
|---|---|
| `*-v2.html` | Desktop-first, scroll-snap, full-viewport slides |
| `*-mobile.html` | Mobile-first, full-viewport snap, single-column |
| `courses/index.html` | D2M curriculum index |
| `why-workshop-app/index.html` | AI-coached Why Workbook (vanilla JS) |

---

## Topbar

Fixed topbar: `height ~46px`, `z-index: 50`. All slides must account for this with `padding-top` ≥ 72px (mobile) or ≥ 88px (desktop).

The right side of the topbar shows the current section name via `IntersectionObserver`:

```javascript
const sectionMap = {
  s1: 'The Why Workshop', s2: 'The Why Workshop',
  s5: '§ Mistakes', s6: '§ Mistakes',
  s9: '§ Values', /* ... */
};
```

Update `sectionMap` whenever slides are added or reordered.

---

## Building a New Mobile Page

1. Start from `*-mobile.html` as a template
2. Every section uses `class="slide [colour-modifier]"` — gets `100dvh` + snap for free
3. Add `slide-opener` to section headers (coloured full-bleed dividers)
4. Add `slide-long` to any section where content reliably exceeds the viewport
5. All grids default to `1fr` — add responsive breakpoints only where the desktop two-column genuinely improves comprehension
6. No image assets — use CSS decorative elements
7. Test on 390×844 (iPhone 14) and 430×932 (iPhone 14 Plus) as primary targets
