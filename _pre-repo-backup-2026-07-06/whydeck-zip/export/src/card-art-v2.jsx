// card-art-v2.jsx
// Geometric archetype compositions for The Why Deck v2.
// Frankly Human palette: ink #100000, paper #FBF7EE, sand #E0D2B5,
// teal #47ACA4, pink #FF3990, yellow #FFBD59, plum #7A1F4A.
// All compositions draw inside 200x260 viewBox. Primitives only.

const ART2_VIEWBOX = "0 0 200 260";

const F = ({ children, bg }) => (
  <g><rect x="0" y="0" width="200" height="260" fill={bg} />{children}</g>
);

// ── 25 archetype compositions ──────────────────────────────────────────────
const A = {
  // 1 concentric — curiosity, focus, awareness, mindfulness, clarity, intuition
  concentric: ({ fg, bg, accent }) => (
    <F bg={bg}>
      <circle cx="100" cy="135" r="72" fill="none" stroke={fg} strokeWidth="3.5" />
      <circle cx="100" cy="135" r="52" fill="none" stroke={fg} strokeWidth="3.5" />
      <circle cx="100" cy="135" r="32" fill={accent} />
      <circle cx="100" cy="135" r="10" fill={bg} />
    </F>
  ),
  // 2 flame — courage, passion, vitality, drive, energy, boldness, bravery
  flame: ({ fg, bg, accent }) => (
    <F bg={bg}>
      <path d="M100 40 L162 222 L38 222 Z" fill={accent} />
      <path d="M100 90 L142 222 L58 222 Z" fill={fg} />
      <path d="M100 140 L120 222 L80 222 Z" fill={bg} />
      <line x1="40" y1="232" x2="160" y2="232" stroke={fg} strokeWidth="3" strokeLinecap="round" />
    </F>
  ),
  // 3 trio — family, community, friendship, connection, teamwork, cooperation
  trio: ({ fg, bg, accent }) => (
    <F bg={bg}>
      <line x1="20" y1="206" x2="180" y2="206" stroke={fg} strokeWidth="3" />
      <circle cx="100" cy="115" r="42" fill={fg} />
      <circle cx="55" cy="158" r="30" fill={accent} />
      <circle cx="145" cy="158" r="30" fill={accent} />
      <circle cx="100" cy="115" r="13" fill={bg} />
      <circle cx="55" cy="158" r="9" fill={bg} />
      <circle cx="145" cy="158" r="9" fill={bg} />
    </F>
  ),
  // 4 pyramid — craft, mastery, achievement, expertise, success, brilliance, competence
  pyramid: ({ fg, bg, accent }) => (
    <F bg={bg}>
      <rect x="40" y="186" width="120" height="32" fill={fg} />
      <rect x="60" y="146" width="80" height="32" fill={accent} />
      <rect x="80" y="106" width="40" height="32" fill={fg} />
      <line x1="35" y1="226" x2="165" y2="226" stroke={fg} strokeWidth="3" />
      <circle cx="100" cy="84" r="9" fill={accent} />
    </F>
  ),
  // 5 wings — freedom, independence, adventure, travel, spontaneity, agility
  wings: ({ fg, bg, accent }) => (
    <F bg={bg}>
      <circle cx="100" cy="80" r="32" fill={accent} />
      <path d="M28 168 L100 134 L100 178 Z" fill={fg} />
      <path d="M172 168 L100 134 L100 178 Z" fill={fg} />
      <line x1="42" y1="218" x2="158" y2="218" stroke={fg} strokeWidth="3" strokeLinecap="round" />
      <line x1="58" y1="230" x2="142" y2="230" stroke={fg} strokeWidth="3" strokeLinecap="round" />
    </F>
  ),
  // 6 plumb — honesty, integrity, accuracy, fairness, directness, authenticity, frankness, dignity
  plumb: ({ fg, bg, accent }) => (
    <F bg={bg}>
      <line x1="100" y1="48" x2="100" y2="200" stroke={fg} strokeWidth="3" />
      <circle cx="100" cy="48" r="6" fill={fg} />
      <path d="M100 200 L122 232 L78 232 Z" fill={accent} />
      <line x1="50" y1="124" x2="68" y2="124" stroke={fg} strokeWidth="3" strokeLinecap="round" />
      <line x1="132" y1="124" x2="150" y2="124" stroke={fg} strokeWidth="3" strokeLinecap="round" />
    </F>
  ),
  // 7 seedstack — growth, learning, development, maturity, education
  seedstack: ({ fg, bg, accent }) => (
    <F bg={bg}>
      <rect x="38" y="222" width="124" height="6" fill={fg} />
      <circle cx="100" cy="208" r="8" fill={fg} />
      <circle cx="100" cy="180" r="14" fill={accent} />
      <circle cx="100" cy="146" r="22" fill={fg} />
      <circle cx="100" cy="100" r="32" fill={accent} />
      <circle cx="100" cy="100" r="10" fill={bg} />
    </F>
  ),
  // 8 ripples — stillness, calmness, serenity, patience, contentment, peace
  ripples: ({ fg, bg, accent }) => (
    <F bg={bg}>
      <ellipse cx="100" cy="140" rx="82" ry="14" fill="none" stroke={fg} strokeWidth="3" />
      <ellipse cx="100" cy="140" rx="58" ry="10" fill="none" stroke={fg} strokeWidth="3" />
      <ellipse cx="100" cy="140" rx="34" ry="6" fill="none" stroke={accent} strokeWidth="3" />
      <circle cx="100" cy="140" r="6" fill={accent} />
      <line x1="100" y1="56" x2="100" y2="124" stroke={fg} strokeWidth="3" strokeDasharray="4 8" />
    </F>
  ),
  // 9 starburst — wonder, inspiration, creativity, originality, imagination, innovation, inventiveness, brilliance, vision
  starburst: ({ fg, bg, accent }) => {
    const arr = [];
    for (let i = 0; i < 12; i++) {
      const a = (i * Math.PI) / 6;
      arr.push(<line key={i}
        x1={100 + Math.cos(a) * 30} y1={140 + Math.sin(a) * 30}
        x2={100 + Math.cos(a) * 78} y2={140 + Math.sin(a) * 78}
        stroke={fg} strokeWidth="3" strokeLinecap="round" />);
    }
    return (
      <F bg={bg}>{arr}
        <circle cx="100" cy="140" r="22" fill={accent} />
        <circle cx="100" cy="140" r="8" fill={bg} />
      </F>
    );
  },
  // 10 bowl — service, kindness, charity, generosity, compassion, hospitality, sharing, sacrifice, empathy, warmth
  bowl: ({ fg, bg, accent }) => (
    <F bg={bg}>
      <circle cx="100" cy="80" r="14" fill={accent} />
      <path d="M28 130 A72 72 0 0 0 172 130 L162 206 L38 206 Z" fill={fg} />
      <path d="M50 146 A50 50 0 0 0 150 146" fill="none" stroke={bg} strokeWidth="3" />
      <line x1="40" y1="222" x2="160" y2="222" stroke={fg} strokeWidth="3" strokeLinecap="round" />
    </F>
  ),
  // 11 sun — joy, happiness, optimism, cheerfulness, fun, playfulness, celebration, gratitude, appreciation, hopefulness
  sun: ({ fg, bg, accent }) => {
    const r = [];
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      r.push(<line key={i}
        x1={100 + Math.cos(a) * 56} y1={140 + Math.sin(a) * 56}
        x2={100 + Math.cos(a) * 86} y2={140 + Math.sin(a) * 86}
        stroke={fg} strokeWidth="5" strokeLinecap="round" />);
    }
    return (
      <F bg={bg}>{r}
        <circle cx="100" cy="140" r="44" fill={accent} />
        <circle cx="100" cy="140" r="44" fill="none" stroke={fg} strokeWidth="3" />
      </F>
    );
  },
  // 12 venn — belonging, collaboration, harmony, equality, diversity, unity
  venn: ({ fg, bg, accent }) => (
    <F bg={bg}>
      <circle cx="100" cy="98" r="42" fill={fg} opacity="0.9" />
      <circle cx="72" cy="158" r="42" fill={accent} opacity="0.9" />
      <circle cx="128" cy="158" r="42" fill={fg} opacity="0.65" />
      <circle cx="100" cy="138" r="9" fill={bg} />
    </F>
  ),
  // 13 crescent — reflection, intuition, mystery
  crescent: ({ fg, bg, accent }) => (
    <F bg={bg}>
      <circle cx="100" cy="140" r="64" fill={fg} />
      <circle cx="124" cy="124" r="56" fill={bg} />
      <circle cx="60" cy="84" r="4" fill={accent} />
      <circle cx="160" cy="194" r="4" fill={accent} />
      <circle cx="40" cy="174" r="3" fill={fg} />
    </F>
  ),
  // 14 grid — discipline, consistency, professionalism, reliability, order, structure
  grid: ({ fg, bg, accent }) => (
    <F bg={bg}>
      <rect x="50" y="90" width="100" height="100" fill="none" stroke={fg} strokeWidth="3" />
      <line x1="50" y1="123" x2="150" y2="123" stroke={fg} strokeWidth="3" />
      <line x1="50" y1="156" x2="150" y2="156" stroke={fg} strokeWidth="3" />
      <line x1="83" y1="90" x2="83" y2="190" stroke={fg} strokeWidth="3" />
      <line x1="117" y1="90" x2="117" y2="190" stroke={fg} strokeWidth="3" />
      <circle cx="100" cy="140" r="14" fill={accent} />
    </F>
  ),
  // 15 arrowup — ambition, motivation, drive, proactivity, initiative, achievement
  arrowup: ({ fg, bg, accent }) => (
    <F bg={bg}>
      <line x1="100" y1="220" x2="100" y2="80" stroke={fg} strokeWidth="6" strokeLinecap="round" />
      <path d="M100 50 L130 100 L70 100 Z" fill={accent} />
      <line x1="40" y1="232" x2="160" y2="232" stroke={fg} strokeWidth="3" />
      <circle cx="60" cy="200" r="5" fill={fg} />
      <circle cx="140" cy="160" r="5" fill={fg} />
    </F>
  ),
  // 16 shield — safety, security, loyalty, trust, faith, commitment, responsibility, duty, accountability
  shield: ({ fg, bg, accent }) => (
    <F bg={bg}>
      <path d="M100 50 L160 80 L160 150 Q160 210 100 230 Q40 210 40 150 L40 80 Z" fill={fg} />
      <path d="M100 80 L138 96 L138 148 Q138 188 100 204 Q62 188 62 148 L62 96 Z" fill={accent} />
      <circle cx="100" cy="148" r="12" fill={fg} />
    </F>
  ),
  // 17 door — openness, open-mindedness, change, hospitality, transformation
  door: ({ fg, bg, accent }) => (
    <F bg={bg}>
      <path d="M50 80 Q50 50 100 50 Q150 50 150 80 L150 220 L50 220 Z" fill={fg} />
      <path d="M62 86 Q62 62 100 62 Q138 62 138 86 L138 208 L62 208 Z" fill={accent} />
      <circle cx="124" cy="148" r="5" fill={fg} />
    </F>
  ),
  // 18 mountain — perseverance, resilience, strength, fortitude, ambition
  mountain: ({ fg, bg, accent }) => (
    <F bg={bg}>
      <path d="M20 222 L80 100 L120 170 L150 130 L180 222 Z" fill={fg} />
      <path d="M68 130 L80 100 L92 130 L80 152 Z" fill={accent} />
      <line x1="20" y1="232" x2="180" y2="232" stroke={fg} strokeWidth="3" />
      <circle cx="148" cy="80" r="8" fill={accent} />
    </F>
  ),
  // 19 balance — balance, justice, fairness, equality, equity
  balance: ({ fg, bg, accent }) => (
    <F bg={bg}>
      <line x1="100" y1="60" x2="100" y2="180" stroke={fg} strokeWidth="3" />
      <line x1="40" y1="100" x2="160" y2="100" stroke={fg} strokeWidth="3" strokeLinecap="round" />
      <line x1="40" y1="100" x2="40" y2="130" stroke={fg} strokeWidth="3" />
      <line x1="160" y1="100" x2="160" y2="130" stroke={fg} strokeWidth="3" />
      <ellipse cx="40" cy="138" rx="22" ry="6" fill={accent} />
      <ellipse cx="160" cy="138" rx="22" ry="6" fill={accent} />
      <rect x="70" y="180" width="60" height="6" fill={fg} />
      <circle cx="100" cy="60" r="6" fill={fg} />
    </F>
  ),
  // 20 spiral — spirituality, transcendence, evolution, change
  spiral: ({ fg, bg, accent }) => (
    <F bg={bg}>
      <path d="M100 140 m-58 0 a58 58 0 1 1 116 0 a44 44 0 1 1 -88 0 a30 30 0 1 1 60 0 a16 16 0 1 1 -32 0"
            fill="none" stroke={fg} strokeWidth="4" strokeLinecap="round" />
      <circle cx="100" cy="140" r="6" fill={accent} />
    </F>
  ),
  // 21 eye — awareness, observation, perception, vision, recognition
  eye: ({ fg, bg, accent }) => (
    <F bg={bg}>
      <path d="M30 140 Q100 70 170 140 Q100 210 30 140 Z" fill={fg} />
      <circle cx="100" cy="140" r="28" fill={bg} />
      <circle cx="100" cy="140" r="18" fill={accent} />
      <circle cx="100" cy="140" r="6" fill={fg} />
    </F>
  ),
  // 22 crown — leadership, dignity, pride, honor, recognition, legacy, status
  crown: ({ fg, bg, accent }) => (
    <F bg={bg}>
      <path d="M40 200 L40 100 L70 140 L100 80 L130 140 L160 100 L160 200 Z" fill={fg} />
      <rect x="40" y="200" width="120" height="14" fill={accent} />
      <circle cx="40" cy="100" r="6" fill={accent} />
      <circle cx="100" cy="80" r="7" fill={accent} />
      <circle cx="160" cy="100" r="6" fill={accent} />
    </F>
  ),
  // 23 hourglass — time, patience, legacy, mortality
  hourglass: ({ fg, bg, accent }) => (
    <F bg={bg}>
      <path d="M50 60 L150 60 L100 140 L150 220 L50 220 L100 140 Z" fill={fg} />
      <path d="M64 72 L136 72 L100 132 Z" fill={accent} />
      <path d="M100 148 L136 208 L64 208 Z" fill={accent} />
      <line x1="40" y1="60" x2="160" y2="60" stroke={fg} strokeWidth="4" strokeLinecap="round" />
      <line x1="40" y1="220" x2="160" y2="220" stroke={fg} strokeWidth="4" strokeLinecap="round" />
    </F>
  ),
  // 24 tree — stability, tradition, home, nature, family, roots
  tree: ({ fg, bg, accent }) => (
    <F bg={bg}>
      <rect x="92" y="160" width="16" height="58" fill={fg} />
      <circle cx="100" cy="120" r="56" fill={accent} />
      <circle cx="68" cy="100" r="22" fill={fg} />
      <circle cx="132" cy="100" r="22" fill={fg} />
      <line x1="40" y1="222" x2="160" y2="222" stroke={fg} strokeWidth="3" />
    </F>
  ),
  // 25 ladder — progress, ambition, perseverance, learning, education
  ladder: ({ fg, bg, accent }) => (
    <F bg={bg}>
      <line x1="68" y1="50" x2="68" y2="220" stroke={fg} strokeWidth="5" strokeLinecap="round" />
      <line x1="132" y1="50" x2="132" y2="220" stroke={fg} strokeWidth="5" strokeLinecap="round" />
      <line x1="68" y1="90" x2="132" y2="90" stroke={fg} strokeWidth="4" strokeLinecap="round" />
      <line x1="68" y1="130" x2="132" y2="130" stroke={fg} strokeWidth="4" strokeLinecap="round" />
      <line x1="68" y1="170" x2="132" y2="170" stroke={fg} strokeWidth="4" strokeLinecap="round" />
      <circle cx="100" cy="50" r="8" fill={accent} />
    </F>
  ),
  // 26 ring — wholeheartedness, simplicity, completion, presence, unity
  ring: ({ fg, bg, accent }) => (
    <F bg={bg}>
      <circle cx="100" cy="140" r="68" fill="none" stroke={fg} strokeWidth="14" />
      <circle cx="100" cy="140" r="14" fill={accent} />
    </F>
  ),
  // 27 compass — purpose, direction, vision, decisiveness, focus
  compass: ({ fg, bg, accent }) => (
    <F bg={bg}>
      <circle cx="100" cy="140" r="68" fill="none" stroke={fg} strokeWidth="3" />
      <path d="M100 80 L116 140 L100 200 L84 140 Z" fill={accent} />
      <path d="M100 80 L116 140 L100 140 Z" fill={fg} />
      <circle cx="100" cy="140" r="6" fill={fg} />
    </F>
  ),
  // 28 flower — beauty, aesthetics, femininity, nature, charm
  flower: ({ fg, bg, accent }) => {
    const petals = [];
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3;
      const cx = 100 + Math.cos(a) * 32;
      const cy = 140 + Math.sin(a) * 32;
      petals.push(<circle key={i} cx={cx} cy={cy} r="22" fill={accent} />);
    }
    return (
      <F bg={bg}>{petals}
        <circle cx="100" cy="140" r="20" fill={fg} />
        <line x1="100" y1="180" x2="100" y2="222" stroke={fg} strokeWidth="4" />
      </F>
    );
  },
  // 29 wave — adaptability, flexibility, flow, change, fluidity
  wave: ({ fg, bg, accent }) => (
    <F bg={bg}>
      <path d="M20 100 Q60 60 100 100 T180 100" fill="none" stroke={fg} strokeWidth="5" strokeLinecap="round" />
      <path d="M20 140 Q60 100 100 140 T180 140" fill="none" stroke={accent} strokeWidth="5" strokeLinecap="round" />
      <path d="M20 180 Q60 140 100 180 T180 180" fill="none" stroke={fg} strokeWidth="5" strokeLinecap="round" />
    </F>
  ),
  // 30 handshake — trust, partnership, agreement, friendship, sharing
  handshake: ({ fg, bg, accent }) => (
    <F bg={bg}>
      <path d="M30 140 Q60 80 100 140" fill="none" stroke={fg} strokeWidth="6" strokeLinecap="round" />
      <path d="M170 140 Q140 80 100 140" fill="none" stroke={fg} strokeWidth="6" strokeLinecap="round" />
      <circle cx="100" cy="140" r="16" fill={accent} />
      <circle cx="30" cy="140" r="6" fill={fg} />
      <circle cx="170" cy="140" r="6" fill={fg} />
      <line x1="40" y1="206" x2="160" y2="206" stroke={fg} strokeWidth="3" />
    </F>
  ),
  // 31 embrace — acceptance, love, vulnerability, kindness, forgiveness, compassion
  embrace: ({ fg, bg, accent }) => (
    <F bg={bg}>
      <path d="M70 60 Q30 140 70 220" fill="none" stroke={fg} strokeWidth="8" strokeLinecap="round" />
      <path d="M130 60 Q170 140 130 220" fill="none" stroke={fg} strokeWidth="8" strokeLinecap="round" />
      <circle cx="100" cy="140" r="22" fill={accent} />
      <path d="M88 140 Q100 156 112 140" fill="none" stroke={fg} strokeWidth="3" strokeLinecap="round" />
    </F>
  ),
  // 32 ribbon — recognition, honor, achievement, celebration, pride
  ribbon: ({ fg, bg, accent }) => (
    <F bg={bg}>
      <circle cx="100" cy="120" r="48" fill={accent} />
      <circle cx="100" cy="120" r="48" fill="none" stroke={fg} strokeWidth="4" />
      <path d="M70 158 L60 230 L100 200 L140 230 L130 158 Z" fill={fg} />
      <circle cx="100" cy="120" r="14" fill={fg} />
    </F>
  ),
  // 33 heart — love, kindness, compassion, devotion, warmth
  heart: ({ fg, bg, accent }) => (
    <F bg={bg}>
      <path d="M100 220 C 30 170 30 100 70 90 C 90 86 100 100 100 110 C 100 100 110 86 130 90 C 170 100 170 170 100 220 Z" fill={accent} />
      <circle cx="100" cy="140" r="14" fill={fg} />
    </F>
  ),
  // 34 dot — simplicity, presence, focus, mindfulness, clarity
  dot: ({ fg, bg, accent }) => (
    <F bg={bg}>
      <circle cx="100" cy="140" r="36" fill={fg} />
      <circle cx="100" cy="140" r="14" fill={accent} />
    </F>
  ),
  // 35 lock — privacy, security, safety, confidentiality
  lock: ({ fg, bg, accent }) => (
    <F bg={bg}>
      <path d="M70 130 L70 100 Q70 60 100 60 Q130 60 130 100 L130 130" fill="none" stroke={fg} strokeWidth="6" />
      <rect x="50" y="130" width="100" height="92" fill={fg} />
      <circle cx="100" cy="170" r="12" fill={accent} />
      <rect x="96" y="170" width="8" height="26" fill={accent} />
    </F>
  ),
  // 36 leaf — health, nature, growth, sustainability, vitality, wellbeing
  leaf: ({ fg, bg, accent }) => (
    <F bg={bg}>
      <path d="M100 60 Q40 140 100 220 Q160 140 100 60 Z" fill={accent} />
      <path d="M100 60 Q40 140 100 220 Q160 140 100 60 Z" fill="none" stroke={fg} strokeWidth="3" />
      <line x1="100" y1="60" x2="100" y2="220" stroke={fg} strokeWidth="3" />
      <line x1="100" y1="100" x2="78" y2="120" stroke={fg} strokeWidth="2.5" />
      <line x1="100" y1="100" x2="122" y2="120" stroke={fg} strokeWidth="2.5" />
      <line x1="100" y1="140" x2="70" y2="160" stroke={fg} strokeWidth="2.5" />
      <line x1="100" y1="140" x2="130" y2="160" stroke={fg} strokeWidth="2.5" />
    </F>
  ),
  // 37 coin — wealth, financial stability, value, exchange
  coin: ({ fg, bg, accent }) => (
    <F bg={bg}>
      <ellipse cx="100" cy="140" rx="64" ry="64" fill={accent} />
      <ellipse cx="100" cy="140" rx="64" ry="64" fill="none" stroke={fg} strokeWidth="4" />
      <ellipse cx="100" cy="140" rx="48" ry="48" fill="none" stroke={fg} strokeWidth="2.5" />
      <line x1="100" y1="108" x2="100" y2="172" stroke={fg} strokeWidth="6" strokeLinecap="round" />
      <line x1="80" y1="124" x2="120" y2="124" stroke={fg} strokeWidth="4" strokeLinecap="round" />
      <line x1="80" y1="156" x2="120" y2="156" stroke={fg} strokeWidth="4" strokeLinecap="round" />
    </F>
  ),
  // 38 firepit — passion, fierceness, intensity (alt to flame)
  firepit: ({ fg, bg, accent }) => (
    <F bg={bg}>
      <ellipse cx="100" cy="222" rx="64" ry="10" fill={fg} />
      <path d="M70 215 Q60 160 95 130 Q90 170 110 145 Q120 175 140 130 Q150 175 130 215 Z" fill={accent} />
    </F>
  ),
};

window.ART2_VIEWBOX = ART2_VIEWBOX;
window.ART2 = A;
