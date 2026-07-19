// app.jsx
// Why/Values cards prototype.
// Modes: grid (browse all), focus (one card large, click to flip), tray (top-5).

const { useState, useEffect, useMemo, useRef } = React;

// ── card data ─────────────────────────────────────────────────────────────
const CARDS = [
  { id: "curiosity", name: "Curiosity",
    blurb: "I follow the question further than the answer. The world repays paying attention.",
    prompt: "What have I been quietly curious about lately?" },
  { id: "courage", name: "Courage",
    blurb: "Doing the thing while afraid. Choosing the harder, truer path on purpose.",
    prompt: "Where am I being careful when I should be brave?" },
  { id: "family", name: "Family",
    blurb: "The people I show up for without keeping score. The ones who know my whole shape.",
    prompt: "Who in my circle have I not called this month?" },
  { id: "craft", name: "Craft",
    blurb: "Caring about the work itself, not just the finish line. Small details, repeated.",
    prompt: "What am I willing to do badly long enough to do well?" },
  { id: "freedom", name: "Freedom",
    blurb: "Room to choose my own days. Lightness over weight, motion over stuck.",
    prompt: "What would I drop if I trusted I'd be okay without it?" },
  { id: "honesty", name: "Honesty",
    blurb: "Telling the truth on time — to myself first, to everyone else second.",
    prompt: "What am I pretending not to know?" },
  { id: "growth", name: "Growth",
    blurb: "Becoming, not arriving. Choosing the version of me that doesn't exist yet.",
    prompt: "Who will I be a year from now if I keep going?" },
  { id: "stillness", name: "Stillness",
    blurb: "Quiet on purpose. Letting the surface settle until I can see the bottom.",
    prompt: "When was I last bored — and what came up?" },
  { id: "wonder", name: "Wonder",
    blurb: "Refusing to flatten the world. Treating ordinary things as small miracles.",
    prompt: "What did I notice today that I almost didn't?" },
  { id: "service", name: "Service",
    blurb: "Being useful. Taking my hands off myself long enough to hold someone else.",
    prompt: "Whose load could I lighten this week, even a little?" },
  { id: "joy", name: "Joy",
    blurb: "Catching delight on the way past. Permission to be silly, soft, undefended.",
    prompt: "What makes me laugh that I keep forgetting to do?" },
  { id: "belonging", name: "Belonging",
    blurb: "Being part of something. Knowing my chair has a name on the back of it.",
    prompt: "Where do I feel most like myself, around whom?" },
];

// ── palettes ───────────────────────────────────────────────────────────────
const PALETTES = {
  earthy:  { bg: "#F4ECDC", fg: "#2A2520", ink: "#2A2520", c1: "#C44A2C", c2: "#D4A24A", c3: "#4F6B4A", paper: "#EFE6D2" },
  primary: { bg: "#F4ECDC", fg: "#1A1A1A", ink: "#1A1A1A", c1: "#D93426", c2: "#F2C744", c3: "#2C5FB3", paper: "#EFE6D2" },
  muted:   { bg: "#ECE7DE", fg: "#2C2A2E", ink: "#2C2A2E", c1: "#B97C7C", c2: "#C9A96E", c3: "#7C8E84", paper: "#E5DFD3" },
  riso:    { bg: "#F1ECE2", fg: "#1F1F1F", ink: "#1F1F1F", c1: "#E5443B", c2: "#F2C744", c3: "#2A4FA8", paper: "#EAE3D4" },
  ink:     { bg: "#F4ECDC", fg: "#1F1B17", ink: "#1F1B17", c1: "#1F1B17", c2: "#9C7A4E", c3: "#3D3530", paper: "#EFE6D2" },
};

// ── color rotation per card so the deck has variety ───────────────────────
function colorsFor(card, palette, idx) {
  const P = PALETTES[palette];
  const wheel = [
    { fg: P.c1, accent: P.c2 },
    { fg: P.c3, accent: P.c1 },
    { fg: P.c2, accent: P.c3 },
    { fg: P.c1, accent: P.c3 },
    { fg: P.c3, accent: P.c2 },
    { fg: P.c2, accent: P.c1 },
  ];
  const slot = wheel[idx % wheel.length];
  return { ...slot, bg: P.bg, ink: P.ink };
}

// ── arched card frame (clip-path) ─────────────────────────────────────────
function shapeStyle(shape) {
  if (shape === "arched")
    return { borderRadius: "50% 50% 14px 14px / 22% 22% 6% 6%" };
  if (shape === "rounded")
    return { borderRadius: "18px" };
  if (shape === "square")
    return { borderRadius: "4px" };
  return { borderRadius: "18px" };
}

// ── grain SVG (data url, applied as background) ───────────────────────────
const GRAIN_URL = `url("data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.06 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>`
)}")`;

// ── single Card (front + back, 3D flip) ───────────────────────────────────
function Card({ card, idx, palette, shape, layout, font, size, flipped, onFlip, picked, onPick, mini }) {
  const Art = window.ART[card.id];
  const colors = colorsFor(card, palette, idx);
  const P = PALETTES[palette];
  const shapeS = shapeStyle(shape);

  const dims = size === "tarot"
    ? { w: 280, h: 448 }
    : size === "square"
    ? { w: 320, h: 320 }
    : { w: 280, h: 392 }; // poker-ish

  if (mini) {
    return (
      <div className="card-mini" style={{ ...shapeS, background: colors.bg }}>
        <svg viewBox={window.ART_VIEWBOX} style={{ width: "100%", height: "70%", display: "block" }}>
          <Art fg={colors.fg} bg={colors.bg} accent={colors.accent} />
        </svg>
        <div className="card-mini-name" style={{ fontFamily: font.display, color: colors.ink }}>
          {card.name}
        </div>
      </div>
    );
  }

  return (
    <div className="card-3d" style={{ width: dims.w, height: dims.h }}
         onClick={onFlip}>
      <div className={"card-flip " + (flipped ? "is-flipped" : "")}>
        {/* FRONT */}
        <div className="card-face" style={{ ...shapeS, background: colors.bg, color: colors.ink }}>
          <div className="card-grain" style={{ ...shapeS }} />
          <div className="card-front-inner" data-layout={layout}>
            {layout === "asymmetric" ? (
              <>
                <div className="card-art-wrap card-art-asym">
                  <svg viewBox={window.ART_VIEWBOX} preserveAspectRatio="xMidYMid meet">
                    <Art fg={colors.fg} bg={colors.bg} accent={colors.accent} />
                  </svg>
                </div>
                <div className="card-name card-name-asym" style={{ fontFamily: font.display, color: colors.ink }}>
                  {card.name}
                </div>
              </>
            ) : layout === "fullbleed" ? (
              <>
                <div className="card-art-wrap card-art-full">
                  <svg viewBox={window.ART_VIEWBOX} preserveAspectRatio="xMidYMid slice">
                    <Art fg={colors.fg} bg={colors.bg} accent={colors.accent} />
                  </svg>
                </div>
                <div className="card-name-band" style={{ background: colors.ink, color: P.bg, fontFamily: font.display }}>
                  {card.name}
                </div>
              </>
            ) : (
              <>
                <div className="card-art-wrap card-art-centered">
                  <svg viewBox={window.ART_VIEWBOX} preserveAspectRatio="xMidYMid meet">
                    <Art fg={colors.fg} bg={colors.bg} accent={colors.accent} />
                  </svg>
                </div>
                <div className="card-name card-name-centered" style={{ fontFamily: font.display, color: colors.ink }}>
                  {card.name}
                </div>
              </>
            )}
          </div>
          <div className="card-corner-id" style={{ fontFamily: font.body, color: colors.ink }}>
            {String(idx + 1).padStart(2, "0")} <span className="card-corner-dot">·</span> {card.name.toUpperCase()}
          </div>
          {onPick && (
            <button className={"card-pick " + (picked ? "is-picked" : "")}
                    style={{ borderColor: colors.ink, color: picked ? P.bg : colors.ink, background: picked ? colors.ink : "transparent" }}
                    onClick={(e) => { e.stopPropagation(); onPick(); }}>
              {picked ? "✓" : "+"}
            </button>
          )}
        </div>

        {/* BACK */}
        <div className="card-face card-back" style={{ ...shapeS, background: P.paper, color: colors.ink }}>
          <div className="card-grain" style={{ ...shapeS }} />
          <div className="card-back-inner">
            <div className="card-back-num" style={{ fontFamily: font.body, color: colors.fg }}>
              {String(idx + 1).padStart(2, "0")} / {String(CARDS.length).padStart(2, "0")}
            </div>
            <div className="card-back-name" style={{ fontFamily: font.display, color: colors.ink }}>
              {card.name}
            </div>
            <div className="card-back-rule" style={{ background: colors.fg }} />
            <div className="card-back-blurb" style={{ fontFamily: font.body }}>
              {card.blurb}
            </div>
            <div className="card-back-prompt-label" style={{ fontFamily: font.body, color: colors.fg }}>
              A QUESTION TO SIT WITH
            </div>
            <div className="card-back-prompt" style={{ fontFamily: font.display }}>
              {card.prompt}
            </div>
            <div className="card-back-mark">
              <svg viewBox={window.ART_VIEWBOX} style={{ width: 56, height: 56 }}>
                <Art fg={colors.fg} bg={P.paper} accent={colors.accent} />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Grid view ──────────────────────────────────────────────────────────────
function GridView({ palette, shape, layout, font, size, picks, onPick, onOpen }) {
  return (
    <div className="grid-wrap">
      <div className="grid">
        {CARDS.map((c, i) => (
          <div key={c.id} className="grid-cell" onClick={() => onOpen(i)}>
            <Card card={c} idx={i} palette={palette} shape={shape} layout={layout}
                  font={font} size={size}
                  flipped={false} onFlip={() => onOpen(i)}
                  picked={picks.includes(c.id)}
                  onPick={() => onPick(c.id)} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Focus view ─────────────────────────────────────────────────────────────
function FocusView({ idx, setIdx, palette, shape, layout, font, size, picks, onPick, onClose }) {
  const [flipped, setFlipped] = useState(false);
  useEffect(() => { setFlipped(false); }, [idx]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") setIdx((idx + 1) % CARDS.length);
      else if (e.key === "ArrowLeft") setIdx((idx - 1 + CARDS.length) % CARDS.length);
      else if (e.key === " ") { e.preventDefault(); setFlipped((f) => !f); }
      else if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [idx, onClose, setIdx]);

  const card = CARDS[idx];

  return (
    <div className="focus">
      <button className="focus-close" onClick={onClose} aria-label="Close">✕</button>
      <button className="focus-nav focus-prev" onClick={() => setIdx((idx - 1 + CARDS.length) % CARDS.length)}>
        <span>←</span>
      </button>
      <div className="focus-stage">
        <Card card={card} idx={idx} palette={palette} shape={shape} layout={layout}
              font={font} size={size}
              flipped={flipped} onFlip={() => setFlipped(f => !f)}
              picked={picks.includes(card.id)}
              onPick={() => onPick(card.id)} />
        <div className="focus-meta">
          <span>{String(idx + 1).padStart(2, "0")} of {String(CARDS.length).padStart(2, "0")}</span>
          <span className="focus-meta-sep">·</span>
          <span>click card to {flipped ? "see front" : "read the back"}</span>
          <span className="focus-meta-sep">·</span>
          <span>← → to browse</span>
        </div>
      </div>
      <button className="focus-nav focus-next" onClick={() => setIdx((idx + 1) % CARDS.length)}>
        <span>→</span>
      </button>
    </div>
  );
}

// ── Top-5 tray ─────────────────────────────────────────────────────────────
function PickTray({ picks, onPick, palette, shape, font, onOpen }) {
  const P = PALETTES[palette];
  return (
    <div className="tray" style={{ background: P.bg, borderTopColor: P.ink + "22" }}>
      <div className="tray-label" style={{ fontFamily: font.body, color: P.ink }}>
        <span className="tray-num" style={{ fontFamily: font.display }}>{picks.length}/5</span>
        <span>my top values</span>
        {picks.length === 0 && <span className="tray-hint">— tap the + on any card</span>}
      </div>
      <div className="tray-slots">
        {Array.from({ length: 5 }).map((_, i) => {
          const pid = picks[i];
          const card = pid && CARDS.find(c => c.id === pid);
          const cardIdx = pid ? CARDS.findIndex(c => c.id === pid) : -1;
          if (!card) {
            return (
              <div key={i} className="tray-slot tray-slot-empty" style={{ ...shapeStyle(shape), borderColor: P.ink + "22", color: P.ink + "55", fontFamily: font.body }}>
                {i + 1}
              </div>
            );
          }
          return (
            <div key={i} className="tray-slot tray-slot-full" onClick={() => onOpen(cardIdx)}>
              <Card card={card} idx={cardIdx} palette={palette} shape={shape}
                    layout="centered" font={font} size="poker" mini />
              <button className="tray-remove" onClick={(e) => { e.stopPropagation(); onPick(card.id); }}
                      style={{ background: P.ink, color: P.bg }}>✕</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── App root ───────────────────────────────────────────────────────────────
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "earthy",
  "shape": "arched",
  "layout": "centered",
  "fontPair": "bricolage-fraunces",
  "size": "poker",
  "grain": true
}/*EDITMODE-END*/;

const FONT_PAIRS = {
  "bricolage-fraunces": { display: "'Bricolage Grotesque', system-ui, sans-serif", body: "'Fraunces', Georgia, serif", label: "Bricolage / Fraunces" },
  "fraunces-spectral":  { display: "'Fraunces', Georgia, serif", body: "'Spectral', Georgia, serif", label: "Fraunces / Spectral" },
  "rubik-jetbrains":    { display: "'Rubik', system-ui, sans-serif", body: "'JetBrains Mono', monospace", label: "Rubik / JetBrains Mono" },
  "dmSerif-dmSans":     { display: "'DM Serif Display', Georgia, serif", body: "'DM Sans', system-ui, sans-serif", label: "DM Serif / DM Sans" },
};

function App() {
  const [t, setTweak] = window.useTweaks(TWEAK_DEFAULTS);
  const [view, setView] = useState("grid"); // grid | focus
  const [focusIdx, setFocusIdx] = useState(0);
  const [picks, setPicks] = useState([]);
  const [order, setOrder] = useState(CARDS.map((_, i) => i));

  const font = FONT_PAIRS[t.fontPair] || FONT_PAIRS["bricolage-fraunces"];
  const P = PALETTES[t.palette] || PALETTES.earthy;

  const openIdx = (i) => { setFocusIdx(i); setView("focus"); };

  const togglePick = (id) => {
    setPicks(p => {
      if (p.includes(id)) return p.filter(x => x !== id);
      if (p.length >= 5) return p;
      return [...p, id];
    });
  };

  const shuffle = () => {
    const arr = [...order];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setOrder(arr);
  };

  const reset = () => { setOrder(CARDS.map((_, i) => i)); setPicks([]); };

  // grid uses `order` to render
  const orderedCards = order.map(i => ({ ...CARDS[i], _origIdx: i }));

  return (
    <div className="app" style={{
      "--bg": P.bg, "--fg": P.fg, "--ink": P.ink, "--paper": P.paper,
      "--c1": P.c1, "--c2": P.c2, "--c3": P.c3,
      background: P.bg, color: P.ink,
      fontFamily: font.body,
    }}>
      <header className="app-header">
        <div className="app-mark">
          <span className="app-mark-dot" style={{ background: P.c1 }} />
          <span className="app-mark-dot" style={{ background: P.c2 }} />
          <span className="app-mark-dot" style={{ background: P.c3 }} />
        </div>
        <div className="app-title" style={{ fontFamily: font.display, color: P.ink }}>
          The Why Deck
        </div>
        <div className="app-sub" style={{ fontFamily: font.body, color: P.ink }}>
          A working set — 12 values, drawn as metaphors. Tap a card to read the back.
        </div>
        <div className="app-actions">
          <button className="btn" onClick={shuffle} style={{ borderColor: P.ink, color: P.ink, fontFamily: font.body }}>
            ⟳ Shuffle
          </button>
          <button className="btn" onClick={reset} style={{ borderColor: P.ink, color: P.ink, fontFamily: font.body }}>
            Reset
          </button>
          <span className="app-count" style={{ fontFamily: font.body, color: P.ink }}>
            {CARDS.length} cards · {picks.length}/5 picked
          </span>
        </div>
      </header>

      <main className="app-main">
        <div className="grid-wrap">
          <div className="grid">
            {orderedCards.map((c) => (
              <div key={c.id} className="grid-cell" onClick={() => openIdx(c._origIdx)}>
                <Card card={c} idx={c._origIdx} palette={t.palette} shape={t.shape}
                      layout={t.layout} font={font} size={t.size}
                      flipped={false} onFlip={() => openIdx(c._origIdx)}
                      picked={picks.includes(c.id)}
                      onPick={() => togglePick(c.id)} />
              </div>
            ))}
          </div>
        </div>
      </main>

      <PickTray picks={picks} onPick={togglePick} palette={t.palette} shape={t.shape} font={font} onOpen={(i) => openIdx(i)} />

      {view === "focus" && (
        <FocusView idx={focusIdx} setIdx={setFocusIdx}
                   palette={t.palette} shape={t.shape} layout={t.layout}
                   font={font} size={t.size}
                   picks={picks} onPick={togglePick}
                   onClose={() => setView("grid")} />
      )}

      <window.TweaksPanel title="Tweaks">
        <window.TweakSection label="Palette" />
        <window.TweakRadio
          label="Color world"
          value={t.palette}
          options={[
            { value: "earthy",  label: "Earthy" },
            { value: "primary", label: "Primary" },
            { value: "muted",   label: "Muted" },
            { value: "riso",    label: "Riso" },
            { value: "ink",     label: "Ink" },
          ]}
          onChange={(v) => setTweak("palette", v)} />

        <window.TweakSection label="Type" />
        <window.TweakSelect
          label="Font pair"
          value={t.fontPair}
          options={Object.entries(FONT_PAIRS).map(([v, o]) => ({ value: v, label: o.label }))}
          onChange={(v) => setTweak("fontPair", v)} />

        <window.TweakSection label="Card" />
        <window.TweakRadio
          label="Shape"
          value={t.shape}
          options={[
            { value: "arched",  label: "Arched" },
            { value: "rounded", label: "Rounded" },
            { value: "square",  label: "Square" },
          ]}
          onChange={(v) => setTweak("shape", v)} />
        <window.TweakRadio
          label="Front layout"
          value={t.layout}
          options={[
            { value: "centered",   label: "Centered" },
            { value: "asymmetric", label: "Asymmetric" },
            { value: "fullbleed",  label: "Full-bleed" },
          ]}
          onChange={(v) => setTweak("layout", v)} />
        <window.TweakRadio
          label="Size"
          value={t.size}
          options={[
            { value: "poker",  label: "Poker" },
            { value: "tarot",  label: "Tarot" },
            { value: "square", label: "Square" },
          ]}
          onChange={(v) => setTweak("size", v)} />
        <window.TweakToggle
          label="Paper grain"
          value={t.grain}
          onChange={(v) => setTweak("grain", v)} />
      </window.TweaksPanel>

      {/* runtime grain toggle */}
      <style>{t.grain ? "" : ".card-grain{display:none !important}"}</style>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
