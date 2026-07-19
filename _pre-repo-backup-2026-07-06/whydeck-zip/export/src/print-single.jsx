// print-single.jsx — single-sided A4 sheets for the Why Deck.
// Each card combines name + blurb + question + a LARGE asymmetric bleed image.
// White card stock. 9 cards per A4 page.

const PS_PALETTE = {
  ink: "#100000", charcoal: "#423B3B",
  paper: "#FBF7EE", white: "#FFFFFF",
  teal: "#47ACA4", pink: "#FF3990", yellow: "#FFBD59", plum: "#7A1F4A",
};
const PS_ACCENTS = ["teal", "pink", "yellow", "plum"];
function psColor(idx) {
  const a = PS_ACCENTS[idx % 4];
  return { fg: PS_PALETTE.ink, bg: PS_PALETTE.white, accent: PS_PALETTE[a] };
}

// Rotate through 4 asymmetric layouts to give the deck visual rhythm.
const LAYOUTS = ["a", "b", "c", "d"];
function layoutFor(idx) { return LAYOUTS[idx % 4]; }

const CARDS_PER_PAGE = 9;
const TOTAL = window.VALUES.length;

function chunk(arr, n) {
  const out = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

function SingleCard({ value, idx }) {
  const Art = window.ART2[value.archetype] || window.ART2.dot;
  const c = psColor(idx);
  const layout = layoutFor(idx);
  return (
    <div className={"card " + "layout-" + layout}>
      <div className="single">
        <div className="art-bleed">
          <svg viewBox={window.ART2_VIEWBOX} preserveAspectRatio="xMidYMid slice">
            <Art fg={c.fg} bg={c.bg} accent={c.accent} />
          </svg>
        </div>
        <div className="single-content">
          <div className="s-num">{String(idx + 1).padStart(3, "0")}</div>
          <h2 className="s-name">
            {value.name.toLowerCase()}<span className="dot">.</span>
          </h2>
          <div className="s-rule" style={{ background: c.accent }} />
          <p className="s-blurb">{value.blurb}</p>
          <div className="s-prompt-label">A question to sit with</div>
          <p className="s-prompt">{value.prompt}</p>
        </div>
      </div>
    </div>
  );
}

function SheetPage({ cards, sheetNum, totalSheets }) {
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
          c ? <SingleCard key={i} value={c.value} idx={c.idx} />
            : <div key={i} className="card" style={{ borderStyle: "dashed", opacity: .25 }} />
        )}
      </div>
    </div>
  );
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
        a small painting. White card stock; cut on the lines; shuffle; lay
        them out and pick the ones that pull you in.
      </p>
      <dl className="cover-spec">
        <div><dt>Format</dt><dd>A4 portrait,<br />9 cards per page</dd></div>
        <div><dt>Cards</dt><dd>~60 × 85 mm,<br />poker-ish</dd></div>
        <div><dt>Sheets</dt><dd>{sheets} sheets,<br />single-sided</dd></div>
        <div><dt>Stock</dt><dd>200–300 gsm white,<br />matte or silk</dd></div>
        <div><dt>Edges</dt><dd>Square cut.<br />Guillotine or scalpel.</dd></div>
        <div><dt>Bleed</dt><dd>Art bleeds.<br />Trim on hairline.</dd></div>
        <div><dt>Colour</dt><dd>Plum · Pink<br />Teal · Yellow</dd></div>
        <div><dt>Notes</dt><dd>Layouts rotate A→D<br />for visual rhythm.</dd></div>
      </dl>
    </div>
  );
}

function Sheets() {
  const [range, setRange] = React.useState("all");

  const all = window.VALUES.map(([name, archetype, blurb, prompt], i) => ({
    idx: i, value: { name, archetype, blurb, prompt },
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

  if (range === "cover") return <Cover count={TOTAL} sheets={totalSheets} />;

  return (
    <>
      {range === "all" && <Cover count={TOTAL} sheets={totalSheets} />}
      {groups.map((g, gi) => {
        const baseOffset = range === "all" ? 0 : Math.floor(parseInt(range.split("-")[0]) / CARDS_PER_PAGE);
        const sheetNum = baseOffset + gi + 1;
        return <SheetPage key={gi} cards={g} sheetNum={sheetNum} totalSheets={totalSheets} />;
      })}
    </>
  );
}

ReactDOM.createRoot(document.getElementById("sheets")).render(<Sheets />);
