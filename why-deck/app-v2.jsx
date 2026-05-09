// app-v2.jsx — The Why Deck v2 (Frankly Human)
const { useState, useEffect, useMemo, useRef } = React;

const PALETTE = {
  ink: "#100000", charcoal: "#423B3B", paper: "#FBF7EE", paper2: "#F4EFE2",
  sand: "#E0D2B5", teal: "#47ACA4", pink: "#FF3990", yellow: "#FFBD59", plum: "#7A1F4A",
};
const ACCENTS = ["teal", "pink", "yellow", "plum"];

// Deterministic accent assignment per value index, but each archetype gets all 4 colors across the deck.
function colorFor(idx) {
  const a = ACCENTS[idx % 4];
  const fg = PALETTE.ink;
  const accent = PALETTE[a];
  return { fg, accent, bg: PALETTE.paper, name: a };
}

function shapeStyle(shape) {
  if (shape === "rounded") return { borderRadius: "22px" };
  if (shape === "square") return { borderRadius: "4px" };
  if (shape === "arched") return { borderRadius: "50% 50% 18px 18px / 22% 22% 8% 8%" };
  return { borderRadius: "22px" };
}

// ── Card ──────────────────────────────────────────────────────────────────
function Card({ value, idx, shape, layout, flipped, onFlip, picked, onPick, mini, dims }) {
  const Art = window.ART2[value.archetype] || window.ART2.dot;
  const c = colorFor(idx);
  const sh = shapeStyle(shape);
  const D = dims || { w: 270, h: 380 };

  if (mini) {
    return (
      <div className="v2-card-mini" style={{ ...sh, background: c.bg, borderColor: PALETTE.ink }}>
        <svg viewBox={window.ART2_VIEWBOX} style={{ width: "100%", height: "70%" }}>
          <Art fg={c.fg} bg={c.bg} accent={c.accent} />
        </svg>
        <div className="v2-mini-name">{value.name}</div>
      </div>
    );
  }

  return (
    <div className="v2-card-3d" style={{ width: D.w, height: D.h }} onClick={onFlip}>
      <div className={"v2-flip " + (flipped ? "is-flipped" : "")}>
        {/* FRONT */}
        <div className="v2-face" style={{ ...sh, background: c.bg, borderColor: PALETTE.ink }}>
          <div className="v2-grain" style={sh} />
          <div className="v2-front" data-layout={layout}>
            {layout === "asymmetric" ? (
              <>
                <div className="v2-art v2-art-asym">
                  <svg viewBox={window.ART2_VIEWBOX}><Art fg={c.fg} bg={c.bg} accent={c.accent} /></svg>
                </div>
                <div className="v2-name v2-name-asym">{value.name.toLowerCase()}</div>
              </>
            ) : layout === "fullbleed" ? (
              <>
                <div className="v2-art v2-art-full">
                  <svg viewBox={window.ART2_VIEWBOX} preserveAspectRatio="xMidYMid slice"><Art fg={c.fg} bg={c.bg} accent={c.accent} /></svg>
                </div>
                <div className="v2-name-band" style={{ background: PALETTE.ink, color: PALETTE.paper }}>{value.name.toLowerCase()}</div>
              </>
            ) : (
              <>
                <div className="v2-art v2-art-centered">
                  <svg viewBox={window.ART2_VIEWBOX}><Art fg={c.fg} bg={c.bg} accent={c.accent} /></svg>
                </div>
                <div className="v2-name v2-name-centered">{value.name.toLowerCase()}<span className="v2-period" style={{ color: PALETTE.plum }}>.</span></div>
              </>
            )}
          </div>
          <div className="v2-corner" style={{ color: PALETTE.charcoal }}>
            {String(idx + 1).padStart(3, "0")} · {value.name.toUpperCase()}
          </div>
          {onPick && (
            <button className={"v2-pick " + (picked ? "is-picked" : "")}
                    onClick={(e) => { e.stopPropagation(); onPick(); }}
                    style={{
                      borderColor: PALETTE.ink,
                      background: picked ? PALETTE.ink : PALETTE.paper,
                      color: picked ? PALETTE.paper : PALETTE.ink,
                    }}>
              {picked ? "✓" : "+"}
            </button>
          )}
        </div>
        {/* BACK */}
        <div className="v2-face v2-back" style={{ ...sh, background: PALETTE.paper2, borderColor: PALETTE.ink }}>
          <div className="v2-grain" style={sh} />
          <div className="v2-back-inner">
            <div className="v2-back-num">{String(idx + 1).padStart(3, "0")} / {String(window.VALUES.length).padStart(3, "0")}</div>
            <div className="v2-back-name">{value.name.toLowerCase()}<span style={{ color: PALETTE.plum }}>.</span></div>
            <div className="v2-rule" style={{ background: c.accent }} />
            <div className="v2-blurb">{value.blurb}</div>
            <div className="v2-prompt-label">A question to sit with</div>
            <div className="v2-prompt">{value.prompt}</div>
            <div className="v2-mark">
              <svg viewBox={window.ART2_VIEWBOX}><Art fg={c.fg} bg={PALETTE.paper2} accent={c.accent} /></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Focus modal ──────────────────────────────────────────────────────────
function Focus({ idx, setIdx, all, shape, layout, picks, onPick, onClose }) {
  const [flipped, setFlipped] = useState(false);
  useEffect(() => setFlipped(false), [idx]);
  useEffect(() => {
    const k = (e) => {
      if (e.key === "ArrowRight") setIdx((idx + 1) % all.length);
      else if (e.key === "ArrowLeft") setIdx((idx - 1 + all.length) % all.length);
      else if (e.key === " ") { e.preventDefault(); setFlipped(f => !f); }
      else if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [idx, all.length, onClose, setIdx]);

  const v = all[idx];
  return (
    <div className="v2-focus">
      <button className="v2-focus-close" onClick={onClose}>✕</button>
      <button className="v2-focus-nav v2-prev" onClick={() => setIdx((idx - 1 + all.length) % all.length)}>←</button>
      <div className="v2-focus-stage">
        <Card value={v} idx={v._origIdx} shape={shape} layout={layout}
              flipped={flipped} onFlip={() => setFlipped(f => !f)}
              picked={picks.includes(v.name)} onPick={() => onPick(v.name)}
              dims={{ w: 320, h: 450 }} />
        <div className="v2-focus-meta">
          {String(idx + 1).padStart(3, "0")} of {String(all.length).padStart(3, "0")}
          <span className="v2-sep">·</span>
          click to {flipped ? "see front" : "read the back"}
          <span className="v2-sep">·</span>
          ← → to browse
        </div>
      </div>
      <button className="v2-focus-nav v2-next" onClick={() => setIdx((idx + 1) % all.length)}>→</button>
    </div>
  );
}

// ── Tray ─────────────────────────────────────────────────────────────────
function Tray({ picks, onPick, shape, onOpen }) {
  return (
    <div className="v2-tray">
      <div className="v2-tray-label">
        <span className="v2-tray-num">{picks.length}<span className="v2-tray-of">/5</span></span>
        <span className="v2-tray-cap">my top values</span>
        {picks.length === 0 && <span className="v2-tray-hint">— tap + on any card</span>}
      </div>
      <div className="v2-tray-slots">
        {Array.from({ length: 5 }).map((_, i) => {
          const pn = picks[i];
          const v = pn && window.VALUES.find(x => x[0] === pn);
          const vIdx = v ? window.VALUES.findIndex(x => x[0] === pn) : -1;
          if (!v) {
            return <div key={i} className="v2-tray-empty" style={shapeStyle(shape)}>{i + 1}</div>;
          }
          const value = { name: v[0], archetype: v[1], blurb: v[2], prompt: v[3] };
          return (
            <div key={i} className="v2-tray-full" onClick={() => onOpen(vIdx)}>
              <Card value={value} idx={vIdx} shape={shape} layout="centered" mini />
              <button className="v2-tray-x" onClick={(e) => { e.stopPropagation(); onPick(value.name); }}>✕</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main app ─────────────────────────────────────────────────────────────
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "shape": "rounded",
  "layout": "centered",
  "showLetterNav": true,
  "grain": true
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = window.useTweaks(TWEAK_DEFAULTS);
  const [view, setView] = useState("grid");
  const [focusIdx, setFocusIdx] = useState(0);
  const [picks, setPicks] = useState([]);
  const [query, setQuery] = useState("");

  const all = useMemo(() => window.VALUES.map(([name, archetype, blurb, prompt], i) => ({
    name, archetype, blurb, prompt, _origIdx: i,
  })), []);

  const filtered = useMemo(() => {
    if (!query.trim()) return all;
    const q = query.toLowerCase().trim();
    return all.filter(v => v.name.toLowerCase().includes(q) || v.blurb.toLowerCase().includes(q));
  }, [all, query]);

  // group by first letter
  const groups = useMemo(() => {
    const g = {};
    filtered.forEach(v => {
      const L = v.name[0].toUpperCase();
      (g[L] = g[L] || []).push(v);
    });
    return g;
  }, [filtered]);

  const togglePick = (name) => {
    setPicks(p => {
      if (p.includes(name)) return p.filter(x => x !== name);
      if (p.length >= 5) return p;
      return [...p, name];
    });
  };

  const openIdx = (origIdx) => { setFocusIdx(origIdx); setView("focus"); };

  return (
    <div className="v2-app">
      <header className="v2-header">
        <div className="v2-eyebrow"><span className="v2-eyebrow-rule" />The Why Deck · v2</div>
        <h1 className="v2-title">
          <span className="v2-sig">a working set of</span>
          values<span style={{ color: PALETTE.plum, fontStyle: "italic" }}> &amp; whys</span>.
        </h1>
        <p className="v2-lede">
          {window.VALUES.length} cards. Each one is a single metaphor, drawn in the brand's painted palette. Tap a card to read what's on the back — and a question to sit with.
        </p>
        <div className="v2-bar">
          <div className="v2-search">
            <span className="v2-search-icon">⌕</span>
            <input
              type="text"
              placeholder="Search values…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && <button className="v2-search-clear" onClick={() => setQuery("")}>✕</button>}
          </div>
          <span className="v2-count">
            {filtered.length} of {all.length} · {picks.length}/5 picked
          </span>
        </div>
      </header>

      <main className="v2-main">
        {Object.keys(groups).sort().map(letter => (
          <section key={letter} className="v2-letter-section" id={"L" + letter}>
            <div className="v2-letter-row">
              <div className="v2-letter">{letter}</div>
              <div className="v2-letter-count">{groups[letter].length}</div>
              <div className="v2-letter-rule" />
            </div>
            <div className="v2-grid">
              {groups[letter].map(v => (
                <div key={v.name} className="v2-cell" onClick={() => openIdx(v._origIdx)}>
                  <Card value={v} idx={v._origIdx}
                        shape={t.shape} layout={t.layout}
                        flipped={false} onFlip={() => openIdx(v._origIdx)}
                        picked={picks.includes(v.name)}
                        onPick={() => togglePick(v.name)} />
                </div>
              ))}
            </div>
          </section>
        ))}
        {filtered.length === 0 && (
          <div className="v2-empty">No values match "{query}".</div>
        )}
      </main>

      {/* Letter rail */}
      {t.showLetterNav && (
        <nav className="v2-rail">
          {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(L => {
            const has = !!groups[L];
            return (
              <a key={L} href={has ? "#L" + L : undefined}
                 className={"v2-rail-l " + (has ? "" : "is-empty")}
                 onClick={(e) => { if (!has) e.preventDefault(); }}>
                {L}
              </a>
            );
          })}
        </nav>
      )}

      <Tray picks={picks} onPick={togglePick} shape={t.shape}
            onOpen={(i) => openIdx(i)} />

      {view === "focus" && (
        <Focus idx={focusIdx} setIdx={setFocusIdx} all={all}
               shape={t.shape} layout={t.layout}
               picks={picks} onPick={togglePick}
               onClose={() => setView("grid")} />
      )}

      <window.TweaksPanel title="Tweaks">
        <window.TweakSection label="Card" />
        <window.TweakRadio label="Shape" value={t.shape}
          options={[{ value: "rounded", label: "Rounded" }, { value: "square", label: "Square" }, { value: "arched", label: "Arched" }]}
          onChange={(v) => setTweak("shape", v)} />
        <window.TweakRadio label="Layout" value={t.layout}
          options={[{ value: "centered", label: "Centered" }, { value: "asymmetric", label: "Asym." }, { value: "fullbleed", label: "Bleed" }]}
          onChange={(v) => setTweak("layout", v)} />
        <window.TweakSection label="Navigation" />
        <window.TweakToggle label="A–Z rail" value={t.showLetterNav}
          onChange={(v) => setTweak("showLetterNav", v)} />
        <window.TweakToggle label="Paper grain" value={t.grain}
          onChange={(v) => setTweak("grain", v)} />
      </window.TweaksPanel>

      <style>{t.grain ? "" : ".v2-grain{display:none !important}"}</style>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
