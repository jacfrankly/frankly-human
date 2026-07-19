// card-art.jsx
// 12 geometric "metaphor" compositions for value cards.
// Rules: only primitives (circles, arcs, triangles, lines, rects, simple paths).
// Two-color compositions on cream. Designed at 200x260 viewBox with arched top.
//
// Each art component receives { fg, bg, accent } colors. The outer arched-top
// frame is drawn by the Card component, not here — these draw INSIDE that frame.

const ART_VIEWBOX = "0 0 200 260";

// ── helpers ────────────────────────────────────────────────────────────────
const Frame = ({ children, bg }) => (
  <g>
    <rect x="0" y="0" width="200" height="260" fill={bg} />
    {children}
  </g>
);

// ── 1. CURIOSITY — concentric arcs / opening doorway ──────────────────────
const ArtCuriosity = ({ fg, bg, accent }) => (
  <Frame bg={bg}>
    <circle cx="100" cy="135" r="70" fill="none" stroke={fg} strokeWidth="3" />
    <circle cx="100" cy="135" r="52" fill="none" stroke={fg} strokeWidth="3" />
    <circle cx="100" cy="135" r="34" fill="none" stroke={accent} strokeWidth="3" />
    <circle cx="100" cy="135" r="14" fill={accent} />
    <circle cx="100" cy="135" r="5" fill={bg} />
    <line x1="100" y1="40" x2="100" y2="62" stroke={fg} strokeWidth="3" strokeLinecap="round" />
    <line x1="100" y1="208" x2="100" y2="230" stroke={fg} strokeWidth="3" strokeLinecap="round" />
    <line x1="20" y1="135" x2="42" y2="135" stroke={fg} strokeWidth="3" strokeLinecap="round" />
    <line x1="158" y1="135" x2="180" y2="135" stroke={fg} strokeWidth="3" strokeLinecap="round" />
  </Frame>
);

// ── 2. COURAGE — flame as nested triangles ────────────────────────────────
const ArtCourage = ({ fg, bg, accent }) => (
  <Frame bg={bg}>
    <path d="M100 40 L160 220 L40 220 Z" fill={accent} />
    <path d="M100 80 L140 220 L60 220 Z" fill={fg} />
    <path d="M100 130 L120 220 L80 220 Z" fill={bg} />
    <circle cx="100" cy="200" r="8" fill={accent} />
  </Frame>
);

// ── 3. FAMILY — three huddled shapes with shared base ─────────────────────
const ArtFamily = ({ fg, bg, accent }) => (
  <Frame bg={bg}>
    <rect x="20" y="200" width="160" height="6" fill={fg} />
    <circle cx="100" cy="120" r="44" fill={fg} />
    <circle cx="55" cy="160" r="32" fill={accent} />
    <circle cx="145" cy="160" r="32" fill={accent} />
    <circle cx="100" cy="120" r="14" fill={bg} />
    <circle cx="55" cy="160" r="9" fill={bg} />
    <circle cx="145" cy="160" r="9" fill={bg} />
  </Frame>
);

// ── 4. CRAFT — pyramid of stacked blocks ──────────────────────────────────
const ArtCraft = ({ fg, bg, accent }) => (
  <Frame bg={bg}>
    <rect x="40" y="180" width="120" height="30" fill={fg} />
    <rect x="60" y="140" width="80" height="30" fill={accent} />
    <rect x="80" y="100" width="40" height="30" fill={fg} />
    <rect x="40" y="180" width="120" height="30" fill="none" stroke={bg} strokeWidth="3" />
    <rect x="60" y="140" width="80" height="30" fill="none" stroke={bg} strokeWidth="3" />
    <line x1="40" y1="220" x2="160" y2="220" stroke={fg} strokeWidth="3" />
    <circle cx="100" cy="80" r="8" fill={accent} />
  </Frame>
);

// ── 5. FREEDOM — bird as two triangles + sun ─────────────────────────────
const ArtFreedom = ({ fg, bg, accent }) => (
  <Frame bg={bg}>
    <circle cx="100" cy="80" r="34" fill={accent} />
    <path d="M30 170 L100 140 L100 175 Z" fill={fg} />
    <path d="M170 170 L100 140 L100 175 Z" fill={fg} />
    <line x1="40" y1="215" x2="160" y2="215" stroke={fg} strokeWidth="3" strokeLinecap="round" />
    <line x1="55" y1="225" x2="145" y2="225" stroke={fg} strokeWidth="3" strokeLinecap="round" />
  </Frame>
);

// ── 6. HONESTY — vertical plumb line / mirror ─────────────────────────────
const ArtHonesty = ({ fg, bg, accent }) => (
  <Frame bg={bg}>
    <line x1="100" y1="40" x2="100" y2="200" stroke={fg} strokeWidth="3" />
    <circle cx="100" cy="40" r="6" fill={fg} />
    <path d="M100 200 L120 230 L80 230 Z" fill={accent} />
    <circle cx="100" cy="220" r="5" fill={fg} />
    <line x1="50" y1="120" x2="65" y2="120" stroke={fg} strokeWidth="3" strokeLinecap="round" />
    <line x1="135" y1="120" x2="150" y2="120" stroke={fg} strokeWidth="3" strokeLinecap="round" />
  </Frame>
);

// ── 7. GROWTH — sprouting stack / expanding spiral ────────────────────────
const ArtGrowth = ({ fg, bg, accent }) => (
  <Frame bg={bg}>
    <rect x="40" y="220" width="120" height="6" fill={fg} />
    <circle cx="100" cy="200" r="8" fill={fg} />
    <circle cx="100" cy="172" r="14" fill={accent} />
    <circle cx="100" cy="138" r="22" fill={fg} />
    <circle cx="100" cy="92" r="32" fill={accent} />
    <circle cx="100" cy="92" r="10" fill={bg} />
  </Frame>
);

// ── 8. STILLNESS — pond ripples ────────────────────────────────────────────
const ArtStillness = ({ fg, bg, accent }) => (
  <Frame bg={bg}>
    <ellipse cx="100" cy="135" rx="80" ry="14" fill="none" stroke={fg} strokeWidth="3" />
    <ellipse cx="100" cy="135" rx="58" ry="10" fill="none" stroke={fg} strokeWidth="3" />
    <ellipse cx="100" cy="135" rx="36" ry="6" fill="none" stroke={accent} strokeWidth="3" />
    <circle cx="100" cy="135" r="6" fill={accent} />
    <line x1="100" y1="50" x2="100" y2="120" stroke={fg} strokeWidth="3" strokeDasharray="4 8" />
  </Frame>
);

// ── 9. WONDER — starburst / asterisk ──────────────────────────────────────
const ArtWonder = ({ fg, bg, accent }) => {
  const lines = [];
  for (let i = 0; i < 12; i++) {
    const a = (i * Math.PI) / 6;
    const x1 = 100 + Math.cos(a) * 30;
    const y1 = 135 + Math.sin(a) * 30;
    const x2 = 100 + Math.cos(a) * 75;
    const y2 = 135 + Math.sin(a) * 75;
    lines.push(<line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={fg} strokeWidth="3" strokeLinecap="round" />);
  }
  return (
    <Frame bg={bg}>
      {lines}
      <circle cx="100" cy="135" r="22" fill={accent} />
      <circle cx="100" cy="135" r="8" fill={bg} />
    </Frame>
  );
};

// ── 10. SERVICE — bowl / open hands as arc ────────────────────────────────
const ArtService = ({ fg, bg, accent }) => (
  <Frame bg={bg}>
    <circle cx="100" cy="80" r="14" fill={accent} />
    <path d="M30 130 A70 70 0 0 0 170 130 L160 200 L40 200 Z" fill={fg} />
    <path d="M50 145 A50 50 0 0 0 150 145" fill="none" stroke={bg} strokeWidth="3" />
    <line x1="40" y1="215" x2="160" y2="215" stroke={fg} strokeWidth="3" strokeLinecap="round" />
  </Frame>
);

// ── 11. JOY — sun with rays ────────────────────────────────────────────────
const ArtJoy = ({ fg, bg, accent }) => {
  const rays = [];
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    const x1 = 100 + Math.cos(a) * 56;
    const y1 = 135 + Math.sin(a) * 56;
    const x2 = 100 + Math.cos(a) * 86;
    const y2 = 135 + Math.sin(a) * 86;
    rays.push(<line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={fg} strokeWidth="5" strokeLinecap="round" />);
  }
  return (
    <Frame bg={bg}>
      {rays}
      <circle cx="100" cy="135" r="44" fill={accent} />
      <circle cx="100" cy="135" r="44" fill="none" stroke={fg} strokeWidth="3" />
      <circle cx="86" cy="128" r="4" fill={fg} />
      <circle cx="114" cy="128" r="4" fill={fg} />
      <path d="M82 145 Q100 162 118 145" fill="none" stroke={fg} strokeWidth="3" strokeLinecap="round" />
    </Frame>
  );
};

// ── 12. BELONGING — three overlapping circles (Venn) ──────────────────────
const ArtBelonging = ({ fg, bg, accent }) => (
  <Frame bg={bg}>
    <circle cx="100" cy="95" r="42" fill={fg} opacity="0.85" />
    <circle cx="72" cy="155" r="42" fill={accent} opacity="0.85" />
    <circle cx="128" cy="155" r="42" fill={fg} opacity="0.65" />
    <circle cx="100" cy="135" r="9" fill={bg} />
  </Frame>
);

// ── 13. PATIENCE — slow arc / crescent ────────────────────────────────────
const ArtPatience = ({ fg, bg, accent }) => (
  <Frame bg={bg}>
    <circle cx="100" cy="135" r="65" fill={fg} />
    <circle cx="125" cy="120" r="55" fill={bg} />
    <circle cx="60" cy="80" r="4" fill={accent} />
    <circle cx="160" cy="190" r="4" fill={accent} />
    <circle cx="40" cy="170" r="3" fill={fg} />
    <circle cx="170" cy="100" r="3" fill={fg} />
  </Frame>
);

// ── 14. MAKING — hand as gridded square + dot ─────────────────────────────
const ArtMaking = ({ fg, bg, accent }) => (
  <Frame bg={bg}>
    <rect x="50" y="85" width="100" height="100" fill="none" stroke={fg} strokeWidth="3" />
    <line x1="50" y1="118" x2="150" y2="118" stroke={fg} strokeWidth="3" />
    <line x1="50" y1="151" x2="150" y2="151" stroke={fg} strokeWidth="3" />
    <line x1="83" y1="85" x2="83" y2="185" stroke={fg} strokeWidth="3" />
    <line x1="117" y1="85" x2="117" y2="185" stroke={fg} strokeWidth="3" />
    <circle cx="100" cy="135" r="14" fill={accent} />
  </Frame>
);

// ── exports ───────────────────────────────────────────────────────────────
window.ART_VIEWBOX = ART_VIEWBOX;
window.ART = {
  curiosity: ArtCuriosity,
  courage: ArtCourage,
  family: ArtFamily,
  craft: ArtCraft,
  freedom: ArtFreedom,
  honesty: ArtHonesty,
  growth: ArtGrowth,
  stillness: ArtStillness,
  wonder: ArtWonder,
  service: ArtService,
  joy: ArtJoy,
  belonging: ArtBelonging,
  patience: ArtPatience,
  making: ArtMaking,
};
