// print-sheets.jsx — renders A4 print sheets for the Why Deck.
// 9 cards per page (3×3 grid), front pages followed by mirrored back pages
// for double-sided duplex printing.

const PRINT_PALETTE = {
  ink: "#100000", charcoal: "#423B3B",
  paper: "#FBF7EE", paper2: "#F4EFE2",
  teal: "#47ACA4", pink: "#FF3990", yellow: "#FFBD59", plum: "#7A1F4A",
};
const PRINT_ACCENTS = ["teal", "pink", "yellow", "plum"];
function printColor(idx) {
  const a = PRINT_ACCENTS[idx % 4];
  return { fg: PRINT_PALETTE.ink, bg: PRINT_PALETTE.paper, accent: PRINT_PALETTE[a] };
}

const CARDS_PER_PAGE = 9;
const TOTAL = window.VALUES.length;

function chunk(arr, n) {
  const out = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

function CardFront({ value, idx }) {
  const Art = window.ART2[value.archetype] || window.ART2.dot;
  const c = printColor(idx);
  return (
    <div className="card">
      <div className="c-front c-front-bleed">
        <div className="c-art-full">
          <svg viewBox={window.ART2_VIEWBOX} preserveAspectRatio="xMidYMid slice">
            <Art fg={c.fg} bg={c.bg} accent={c.accent} />
          </svg>
        </div>
        <div className="c-num c-num-bleed">{String(idx + 1).padStart(3, "0")}</div>
        <div className="c-name-band" style={{ background: PRINT_PALETTE.ink, color: PRINT_PALETTE.paper }}>
          {value.name.toLowerCase()}<span style={{ color: c.accent, fontStyle: "italic" }}>.</span>
        </div>
      </div>
    </div>
  );
}

function CardBack({ value, idx }) {
  const Art = window.ART2[value.archetype] || window.ART2.dot;
  const c = printColor(idx);
  return (
    <div className="card is-back" style={{ background: PRINT_PALETTE.paper2 }}>
      <div className="c-back">
        <div className="c-back-num">
          {String(idx + 1).padStart(3, "0")} / {String(TOTAL).padStart(3, "0")}
        </div>
        <div className="c-back-name">
          {value.name.toLowerCase()}<span style={{ color: PRINT_PALETTE.plum, fontStyle: "italic" }}>.</span>
        </div>
        <div className="c-rule" style={{ background: c.accent }} />
        <div className="c-blurb">{value.blurb}</div>
        <div className="c-prompt-label">A question to sit with</div>
        <div className="c-prompt">{value.prompt}</div>
        <div className="c-mark">
          <svg viewBox={window.ART2_VIEWBOX}><Art fg={c.fg} bg={PRINT_PALETTE.paper2} accent={c.accent} /></svg>
        </div>
      </div>
    </div>
  );
}

function FrontPage({ cards, sheetNum, totalSheets }) {
  // pad to 9
  const padded = [...cards];
  while (padded.length < CARDS_PER_PAGE) padded.push(null);
  return (
    <div className="page">
      <div className="page-header">
        <span className="pg-meta">Sheet {sheetNum} of {totalSheets} · fronts · {String(cards[0].idx + 1).padStart(3, "0")}–{String(cards[cards.length - 1].idx + 1).padStart(3, "0")}</span>
        <span className="pg-side">the why deck</span>
        <span className="pg-meta">A4 · 9-up · cut on lines</span>
      </div>
      <div className="card-grid">
        {padded.map((c, i) =>
          c ? <CardFront key={i} value={c.value} idx={c.idx} />
            : <div key={i} className="card" style={{ borderStyle: "dashed", opacity: .25 }} />
        )}
      </div>
    </div>
  );
}

function BackPage({ cards, sheetNum, totalSheets }) {
  // For duplex printing, the back must be mirrored horizontally so
  // when you flip the page along the long edge, card 1's back lines up
  // with card 1's front. Reverse within rows of 3.
  const padded = [...cards];
  while (padded.length < CARDS_PER_PAGE) padded.push(null);
  const rows = chunk(padded, 3).map(r => [...r].reverse()).flat();
  return (
    <div className="page">
      <div className="page-header">
        <span className="pg-meta">A4 · 9-up · cut on lines</span>
        <span className="pg-side">the why deck</span>
        <span className="pg-meta">Sheet {sheetNum} of {totalSheets} · backs · mirrored for duplex</span>
      </div>
      <div className="card-grid is-back">
        {rows.map((c, i) =>
          c ? <CardBack key={i} value={c.value} idx={c.idx} />
            : <div key={i} className="card is-back" style={{ borderStyle: "dashed", opacity: .25 }} />
        )}
      </div>
    </div>
  );
}

function Cover({ count, sheets }) {
  return (
    <div className="cover">
      <div className="cover-eyebrow">A working set · {count} cards · printed at home</div>
      <div style={{ marginTop: "18mm" }}>
        <span className="cover-sig">a working set of</span>
        <h1 className="cover-title">
          values<br />
          &amp; <em>whys</em>.
        </h1>
      </div>
      <p className="cover-lede">
        One bold metaphor on the front. A short blurb plus a question
        to sit with on the back. Cut on the lines, shuffle, and lay them
        out face down. Pick the ones that pull you in.
      </p>
      <div className="cover-orn">
        <svg viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="84" fill="none" stroke={PRINT_PALETTE.ink} strokeWidth="3" />
          <circle cx="100" cy="100" r="58" fill="none" stroke={PRINT_PALETTE.ink} strokeWidth="3" />
          <circle cx="100" cy="100" r="32" fill={PRINT_PALETTE.plum} />
          <circle cx="100" cy="100" r="10" fill={PRINT_PALETTE.paper} />
        </svg>
      </div>
      <dl className="cover-spec">
        <div>
          <dt>Format</dt>
          <dd>A4 portrait,<br />9 cards per page</dd>
        </div>
        <div>
          <dt>Cards</dt>
          <dd>~60 × 85 mm,<br />poker-ish</dd>
        </div>
        <div>
          <dt>Sheets</dt>
          <dd>{sheets} fronts<br />+ {sheets} backs</dd>
        </div>
        <div>
          <dt>Printing</dt>
          <dd>Duplex, long-edge,<br />card stock 200–300 gsm</dd>
        </div>
        <div>
          <dt>Cutting</dt>
          <dd>Square edges.<br />Guillotine or scalpel.</dd>
        </div>
        <div>
          <dt>Bleed</dt>
          <dd>None — trim to<br />border line.</dd>
        </div>
        <div>
          <dt>Colour</dt>
          <dd>Plum · Pink<br />Teal · Yellow</dd>
        </div>
        <div>
          <dt>Order</dt>
          <dd>Print sheet 1 front,<br />flip, print sheet 1 back.</dd>
        </div>
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

  if (range === "cover") {
    return <Cover count={TOTAL} sheets={totalSheets} />;
  }

  return (
    <>
      {range === "all" && <Cover count={TOTAL} sheets={totalSheets} />}
      {groups.map((g, gi) => {
        const sheetNum = range === "all" ? gi + 1 : Math.floor(parseInt(range.split("-")[0]) / CARDS_PER_PAGE) + gi + 1;
        return (
          <React.Fragment key={gi}>
            <FrontPage cards={g} sheetNum={sheetNum} totalSheets={totalSheets} />
            <BackPage cards={g} sheetNum={sheetNum} totalSheets={totalSheets} />
          </React.Fragment>
        );
      })}
    </>
  );
}

ReactDOM.createRoot(document.getElementById("sheets")).render(<Sheets />);
