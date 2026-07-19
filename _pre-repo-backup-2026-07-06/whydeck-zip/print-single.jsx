// print-single.jsx — single-sided A4 sheets, with tweakable controls.
// Each card has a large asymmetric bleed image behind name + blurb + question.

const PS_PALETTE = {
  ink: "#100000", charcoal: "#423B3B",
  paper: "#FBF7EE", white: "#FFFFFF",
  teal: "#47ACA4", pink: "#FF3990", yellow: "#FFBD59", plum: "#7A1F4A"
};
const PS_ACCENTS = ["teal", "pink", "yellow", "plum"];
function psColor(idx) {
  const a = PS_ACCENTS[idx % 4];
  return { fg: PS_PALETTE.ink, bg: PS_PALETTE.white, accent: PS_PALETTE[a] };
}

const ALL_LAYOUTS = ["a", "b", "c", "d"];
function layoutFor(idx, mode) {
  if (mode === "cycle") return ALL_LAYOUTS[idx % 4];
  if (mode === "alternate") return ALL_LAYOUTS[idx % 2]; // a / b only
  return mode; // "a" | "b" | "c" | "d"
}

const CARDS_PER_PAGE = 9;
const TOTAL = window.VALUES.length;

function chunk(arr, n) {
  const out = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

function SingleCard({ value, idx, layoutMode, showNum, fontScale }) {
  const Art = window.ART2[value.archetype] || window.ART2.dot;
  const c = psColor(idx);
  const layout = layoutFor(idx, layoutMode);
  return (
    <div className={"card " + "layout-" + layout}>
      <div className="single">
        <div className="art-bleed">
          <svg viewBox={window.ART2_VIEWBOX} preserveAspectRatio="xMidYMid slice">
            <Art fg={c.fg} bg={c.bg} accent={c.accent} />
          </svg>
        </div>
        <div className="single-content" style={{ fontSize: `${fontScale}%`, justifyContent: "flex-end", alignItems: "stretch" }}>
          {showNum && <div className="s-num">{String(idx + 1).padStart(3, "0")}</div>}
          <h2 className="s-name" style={{ margin: "1px 0px 7.55906px" }}>
            {value.name.toLowerCase()}<span className="dot">.</span>
          </h2>
          <div className="s-rule" style={{ background: c.accent }} />
          <p className="s-blurb">{value.blurb}</p>
          <div className="s-prompt-label">A question to sit with</div>
          <p className="s-prompt">{value.prompt}</p>
        </div>
      </div>
    </div>);

}

function SheetPage({ cards, sheetNum, totalSheets, ...rest }) {
  const padded = [...cards];
  while (padded.length < CARDS_PER_PAGE) padded.push(null);
  return (
    <div className="page">
      <div className="page-header">
        <span className="pg-meta">Sheet {sheetNum} of {totalSheets} · {String(cards[0].idx + 1).padStart(3, "0")}–{String(cards[cards.length - 1].idx + 1).padStart(3, "0")}</span>
        <span className="pg-side">the why deck</span>
        <span className="pg-meta">A4 · 9-up · single-sided · cut on lines</span>
      </div>
      <div className="card-grid">
        {padded.map((c, i) =>
        c ? <SingleCard key={i} value={c.value} idx={c.idx} {...rest} /> :
        <div key={i} className="card" style={{ borderStyle: "dashed", opacity: .25 }} />
        )}
      </div>
    </div>);

}

function Cover({ count, sheets }) {
  return (
    <div className="cover">
      <div className="cover-eyebrow">A working set · {count} cards · single-sided · printed at home</div>
      <div style={{ marginTop: "18mm" }}>
        <span className="cover-sig">a working set of</span>
        <h1 className="cover-title">values<br />&amp; <em>whys</em>.</h1>
      </div>
      <p className="cover-lede">
        One bold metaphor. A short blurb. A question to sit with. All on the
        front, with the image bleeding off one edge so each card feels like
        a small painting. Cut on the lines; shuffle; lay them out and pick
        the ones that pull you in.
      </p>
      <dl className="cover-spec">
        <div><dt>Format</dt><dd>A4 portrait,<br />9 cards per page</dd></div>
        <div><dt>Cards</dt><dd>~60 × 85 mm</dd></div>
        <div><dt>Sheets</dt><dd>{sheets} sheets,<br />single-sided</dd></div>
        <div><dt>Stock</dt><dd>200–300 gsm,<br />matte or silk</dd></div>
        <div><dt>Edges</dt><dd>Square cut</dd></div>
        <div><dt>Bleed</dt><dd>Trim on hairline</dd></div>
        <div><dt>Colour</dt><dd>Plum · Pink<br />Teal · Yellow</dd></div>
        <div><dt>Notes</dt><dd>Use Tweaks panel to<br />adjust before printing</dd></div>
      </dl>
    </div>);

}

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "layoutMode": "cycle",
  "artSize": 100,
  "fontScale": 100,
  "background": "white",
  "showNum": true
} /*EDITMODE-END*/;

function App() {
  const [t, setTweak] = window.useTweaks(TWEAK_DEFAULTS);
  const [range, setRange] = React.useState("all");

  const all = window.VALUES.map(([name, archetype, blurb, prompt], i) => ({
    idx: i, value: { name, archetype, blurb, prompt }
  }));

  let working = all;
  if (range !== "all" && range !== "cover") {
    const [a, b] = range.split("-").map(Number);
    working = all.slice(a, b);
  }

  const groups = chunk(working, CARDS_PER_PAGE);
  const totalSheets = chunk(all, CARDS_PER_PAGE).length;

  React.useEffect(() => {
    const sel = document.getElementById("rangeSel");
    if (!sel) return;
    const h = (e) => setRange(e.target.value);
    sel.addEventListener("change", h);
    return () => sel.removeEventListener("change", h);
  }, []);

  // Apply art-size and background as runtime CSS overrides.
  const sizeMul = t.artSize / 100;
  const cardBg = t.background === "cream" ? PS_PALETTE.paper : PS_PALETTE.white;

  const dynamicCss = `
    :root { --card-bg: ${cardBg}; }
    .layout-a .art-bleed { width: ${62 * sizeMul}%; height: ${50 * sizeMul}%; }
    .layout-b .art-bleed { width: ${62 * sizeMul}%; height: ${50 * sizeMul}%; }
    .layout-c .art-bleed { width: ${62 * sizeMul}%; height: ${50 * sizeMul}%; }
    .layout-d .art-bleed { height: ${46 * sizeMul}%; }
    /* Bump safe-zone padding when art is larger so text never overlaps */
    .layout-a .single-content { padding-top: ${32 * sizeMul}mm; }
    .layout-b .single-content { padding-top: ${32 * sizeMul}mm; }
    .layout-c .single-content { padding-bottom: ${32 * sizeMul}mm; }
    .layout-d .single-content { padding-top: ${38 * sizeMul}mm; }
  `;

  const content = range === "cover" ?
  <Cover count={TOTAL} sheets={totalSheets} /> :

  <>
      {range === "all" && <Cover count={TOTAL} sheets={totalSheets} />}
      {groups.map((g, gi) => {
      const baseOffset = range === "all" ? 0 : Math.floor(parseInt(range.split("-")[0]) / CARDS_PER_PAGE);
      const sheetNum = baseOffset + gi + 1;
      return (
        <SheetPage key={gi} cards={g} sheetNum={sheetNum} totalSheets={totalSheets}
        layoutMode={t.layoutMode} showNum={t.showNum} fontScale={t.fontScale} />);

    })}
    </>;


  return (
    <>
      <style>{dynamicCss}</style>
      {content}
      <window.TweaksPanel title="Tweaks">
        <window.TweakSection label="Layout" />
        <window.TweakSelect label="Pattern" value={t.layoutMode}
        options={[
        { value: "cycle", label: "Cycle A→D" },
        { value: "alternate", label: "Alt A/B" },
        { value: "a", label: "All top-right" },
        { value: "b", label: "All top-left" },
        { value: "c", label: "All bot-right" },
        { value: "d", label: "All top-wide" }]
        }
        onChange={(v) => setTweak("layoutMode", v)} />
        <window.TweakSlider label="Art size" value={t.artSize}
        min={70} max={130} step={5}
        onChange={(v) => setTweak("artSize", v)} />
        <window.TweakSlider label="Text size" value={t.fontScale}
        min={85} max={120} step={5}
        onChange={(v) => setTweak("fontScale", v)} />
        <window.TweakSection label="Card" />
        <window.TweakRadio label="Background" value={t.background}
        options={[{ value: "white", label: "White" }, { value: "cream", label: "Cream" }]}
        onChange={(v) => setTweak("background", v)} />
        <window.TweakToggle label="Show card number" value={t.showNum}
        onChange={(v) => setTweak("showNum", v)} />
      </window.TweaksPanel>
    </>);

}

ReactDOM.createRoot(document.getElementById("sheets")).render(<App />);