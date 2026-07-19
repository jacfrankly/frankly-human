import { useState } from "react";

const METHODOLOGY_REFS = {
  "Continuous Discovery": "Teresa Torres — weekly touchpoints with users, structured opportunity discovery",
  "JTBD": "Jobs to Be Done — understanding the progress users are trying to make, not just their stated needs",
  "Opportunity Solution Tree": "Teresa Torres — maps desired outcomes to opportunities to solutions to experiments",
  "North Star Framework": "Single metric that best captures the value delivered to users; supported by input metrics",
  "RICE": "Reach × Impact × Confidence ÷ Effort — structured prioritisation scoring",
  "WSJF": "Weighted Shortest Job First — SAFe prioritisation: cost of delay ÷ job duration",
  "OKR": "Objectives and Key Results — connects team work to organisational strategy",
  "Build-Measure-Learn": "Lean Startup — minimum experiment to test an assumption before full build",
  "Impact Mapping": "Connects business goals to actor behaviours to deliverables — Why → Who → How → What",
  "MoSCoW": "Must have / Should have / Could have / Won't have — scope negotiation framework",
  "Double Diamond": "Discover → Define → Develop → Deliver — diverge then converge, twice",
};

const LAYERS = {
  strategy: {
    label: "Product Strategy Layer",
    sublabel: "runs once per initiative",
    color: "#1a3a2a",
    accent: "#22c55e",
    soft: "#f0fdf4",
    badge: "#14532d",
    badgeText: "#86efac",
  },
  discovery: {
    label: "Product Discovery Layer",
    sublabel: "runs per opportunity",
    color: "#3a1a00",
    accent: "#f59e0b",
    soft: "#fffbeb",
    badge: "#78350f",
    badgeText: "#fde68a",
  },
  delivery: {
    label: "Product Delivery Layer",
    sublabel: "runs per feature / release",
    color: "#0a2030",
    accent: "#0ea5e9",
    soft: "#f0f9ff",
    badge: "#0c4a6e",
    badgeText: "#7dd3fc",
  },
};

const AGENTS = [
  {
    id: "market-researcher",
    layer: "strategy",
    symbol: "MR",
    name: "Market Researcher",
    phase: "Market Analysis",
    role: "Market sizing, competitive landscape, opportunity identification, industry dynamics",
    description: "Maps the external environment before any internal product decisions are made. Answers whether the opportunity is real and how large it is. Distinct from user research — this agent looks at markets, competitors, and trends, not individual users.",
    methodology: ["Double Diamond", "RICE"],
    inputs: ["Business brief", "Market context", "Competitive signals"],
    outputs: ["Market sizing analysis", "Competitive landscape map", "Opportunity assessment", "Market risk factors"],
    handsTo: ["Strategy Architect"],
    tension: [],
    gate: false,
  },
  {
    id: "user-researcher",
    layer: "strategy",
    symbol: "UR",
    name: "User Researcher",
    phase: "Discovery",
    role: "Qualitative discovery, Jobs to Be Done analysis, problem interviews, continuous discovery synthesis",
    description: "Operates through a service design lens — not just what users do in a product, but what they are trying to accomplish in their life or work. Applies JTBD framing to understand the progress users seek, not just their stated preferences. Runs continuously, not just at project start.",
    methodology: ["Continuous Discovery", "JTBD", "Double Diamond"],
    inputs: ["Research brief", "Stakeholder context", "Market research"],
    outputs: ["Opportunity landscape", "JTBD analysis", "User interview synthesis", "Assumption inventory"],
    handsTo: ["Opportunity Mapper", "Strategy Architect"],
    tension: ["business-analyst"],
    gate: false,
  },
  {
    id: "business-analyst",
    layer: "strategy",
    symbol: "BA",
    name: "Business Analyst",
    phase: "Business Case",
    role: "Business case, ROI modelling, revenue impact, cost analysis, stakeholder value mapping",
    description: "Translates opportunity into organisational value. Answers whether building this makes business sense, not just product sense. Models the revenue, cost, and strategic impact of different product directions before any commitment is made.",
    methodology: ["OKR", "Impact Mapping"],
    inputs: ["Market research", "User research", "Strategic priorities"],
    outputs: ["Business case", "ROI model", "Value proposition", "Strategic alignment map"],
    handsTo: ["Strategy Architect"],
    tension: ["user-researcher"],
    gate: false,
  },
  {
    id: "strategy-architect",
    layer: "strategy",
    symbol: "SA",
    name: "Strategy Architect",
    phase: "Product Strategy",
    role: "Product vision, North Star metric, OKR alignment, positioning, strategic narrative",
    description: "Synthesises market, user, and business inputs into a coherent product strategy. Defines the North Star metric and the input metrics that lead to it. Connects product direction to organisational OKRs. Produces the strategic frame that every downstream decision must align to.",
    methodology: ["North Star Framework", "OKR", "Impact Mapping"],
    inputs: ["Market analysis", "User research", "Business case"],
    outputs: ["Product vision", "North Star metric", "OKR alignment", "Strategic positioning", "Product principles"],
    handsTo: ["Opportunity Mapper", "Roadmap Architect"],
    tension: ["opportunity-mapper"],
    gate: true,
    gateLabel: "Strategy gate — Product Lead approves direction before discovery begins",
  },
  // DISCOVERY LAYER
  {
    id: "opportunity-mapper",
    layer: "discovery",
    symbol: "OM",
    name: "Opportunity Mapper",
    phase: "Opportunity Mapping",
    role: "Opportunity Solution Tree construction, assumption mapping, opportunity sizing and prioritisation",
    description: "The central PM discovery agent. Builds an Opportunity Solution Tree — mapping the desired outcome (from strategy) to the opportunities that sit between users and that outcome, before any solutions are considered. Prevents the team from jumping to solutions before opportunities are understood.",
    methodology: ["Opportunity Solution Tree", "Continuous Discovery", "Impact Mapping"],
    inputs: ["Product strategy", "User research synthesis", "North Star metric"],
    outputs: ["Opportunity Solution Tree", "Prioritised opportunity backlog", "Assumption inventory", "Opportunity sizing"],
    handsTo: ["Experiment Designer", "Risk Assessor"],
    tension: ["strategy-architect"],
    gate: false,
  },
  {
    id: "experiment-designer",
    layer: "discovery",
    symbol: "ED",
    name: "Experiment Designer",
    phase: "Validation",
    role: "Hypothesis formation, experiment design, test methodology, validation criteria, prototype strategy",
    description: "Designs the minimum experiment needed to test a core assumption before committing to build. Applies Build-Measure-Learn discipline — the experiment is not a prototype waiting to become a product, it is a test with a specific pass/fail criterion. Prevents the team from building what they have not yet validated.",
    methodology: ["Build-Measure-Learn", "Continuous Discovery", "Double Diamond"],
    inputs: ["Opportunity map", "Assumption inventory", "Risk assessment"],
    outputs: ["Experiment plan", "Hypothesis statements", "Test designs", "Validation criteria", "Learning plan"],
    handsTo: ["Requirements Writer", "Opportunity Mapper"],
    tension: ["risk-assessor"],
    gate: true,
    gateLabel: "Validation gate — Product Lead reviews: is this experiment worth running?",
  },
  {
    id: "risk-assessor",
    layer: "discovery",
    symbol: "RA",
    name: "Risk Assessor",
    phase: "Risk Assessment",
    role: "Technical risk, market risk, user adoption risk, assumption identification, mitigation strategy",
    description: "Surfaces the risks that would cause a product decision to fail — before the decision is made. Categorises risks by type and severity, identifies which assumptions are load-bearing (if wrong, the whole approach fails), and proposes mitigation strategies. Creates productive friction against over-optimistic opportunity assessments.",
    methodology: ["Build-Measure-Learn", "RICE"],
    inputs: ["Opportunity map", "Business case", "Technical context"],
    outputs: ["Risk register", "Critical assumption list", "Mitigation strategies", "Go/no-go recommendation"],
    handsTo: ["Experiment Designer", "Prioritisation Lead"],
    tension: ["experiment-designer"],
    gate: false,
  },
  // DELIVERY LAYER
  {
    id: "requirements-writer",
    layer: "delivery",
    symbol: "RW",
    name: "Requirements Writer",
    phase: "Specification",
    role: "User stories, acceptance criteria, PRDs, feature briefs, edge case documentation",
    description: "Translates validated opportunities into buildable specifications. Writes from the user's perspective, not the system's. Produces the feature brief that the design system picks up as a touchpoint brief — making this the explicit handoff point between the PM agent system and the design agent system.",
    methodology: ["JTBD", "Impact Mapping", "MoSCoW"],
    inputs: ["Validated experiment results", "Opportunity mapping", "Prioritisation decisions"],
    outputs: ["User stories with acceptance criteria", "PRD", "Feature brief / touchpoint brief", "Edge case inventory"],
    handsTo: ["Design Strategist (design system)"],
    tension: ["product-critic"],
    gate: false,
    isHandoff: true,
  },
  {
    id: "prioritisation-lead",
    layer: "delivery",
    symbol: "PL",
    name: "Prioritisation Lead",
    phase: "Prioritisation",
    role: "RICE / WSJF scoring, MoSCoW analysis, trade-off facilitation, backlog ordering, scope negotiation",
    description: "Applies structured prioritisation frameworks to the opportunity backlog, preventing the most common PM failure: building what is loudest rather than what is highest impact. Facilitates trade-off conversations with evidence rather than opinion. Works in productive tension with the Roadmap Architect.",
    methodology: ["RICE", "WSJF", "MoSCoW"],
    inputs: ["Opportunity backlog", "Risk assessment", "Business case", "Technical constraints"],
    outputs: ["Prioritised backlog", "RICE/WSJF scores", "Trade-off analysis", "Scope recommendation"],
    handsTo: ["Roadmap Architect"],
    tension: ["roadmap-architect"],
    gate: false,
  },
  {
    id: "metrics-definer",
    layer: "delivery",
    symbol: "MD",
    name: "Metrics Definer",
    phase: "Measurement",
    role: "KPI definition, success criteria, leading and lagging indicators, North Star alignment, measurement plan",
    description: "Defines exactly how success will be measured before a feature is built — not after. Connects feature-level metrics to the North Star and OKRs. Distinguishes between leading indicators (which predict outcomes) and lagging indicators (which confirm them). Prevents outcome metrics from being defined post-hoc to match results.",
    methodology: ["North Star Framework", "OKR", "Build-Measure-Learn"],
    inputs: ["Product strategy", "Feature brief", "Business case"],
    outputs: ["Success metrics", "Leading indicators", "Measurement plan", "Baseline data requirements"],
    handsTo: ["Launch Planner", "Retrospective Lead"],
    tension: [],
    gate: false,
  },
  {
    id: "roadmap-architect",
    layer: "delivery",
    symbol: "ROA",
    name: "Roadmap Architect",
    phase: "Roadmap Planning",
    role: "Release planning, dependency mapping, sequencing, milestone definition, cross-team coordination",
    description: "Structures the sequence of delivery — not just what to build but in what order and why. Maps dependencies between features and teams. Distinguishes between the product roadmap (outcomes over time) and the release plan (features over time), ensuring the roadmap tells a strategic story rather than a feature list.",
    methodology: ["OKR", "WSJF", "Impact Mapping"],
    inputs: ["Prioritised backlog", "Technical constraints", "Strategic timeline", "Dependency map"],
    outputs: ["Product roadmap", "Release plan", "Dependency map", "Milestone definitions"],
    handsTo: ["Requirements Writer", "Launch Planner"],
    tension: ["prioritisation-lead"],
    gate: true,
    gateLabel: "Roadmap gate — Product Lead approves sequence before delivery begins",
  },
  {
    id: "product-critic",
    layer: "delivery",
    symbol: "PC",
    name: "Product Critic",
    phase: "Review",
    role: "Assumption challenging, devil's advocacy, brief quality review, problem-solution fit assessment",
    description: "The most adversarial agent in the PM system — deliberately so. Reviews requirements, roadmap decisions, and feature briefs against one question: does this actually solve the problem the opportunity mapping identified? Prevents solution drift, scope creep, and the common failure where a feature is built correctly but solves the wrong problem.",
    methodology: ["Opportunity Solution Tree", "JTBD", "Build-Measure-Learn"],
    inputs: ["Feature briefs", "Opportunity map", "Product strategy", "User research"],
    outputs: ["Assumption challenges", "Problem-solution fit assessment", "Ship / rethink recommendation"],
    handsTo: ["Requirements Writer", "Opportunity Mapper"],
    tension: ["requirements-writer"],
    gate: false,
  },
  {
    id: "launch-planner",
    layer: "delivery",
    symbol: "LP",
    name: "Launch Planner",
    phase: "Go to Market",
    role: "GTM strategy, rollout planning, adoption strategy, change management, communication planning",
    description: "Designs how a feature reaches users — not just that it ships, but that it is adopted. Addresses the gap between deployment and adoption that most product teams leave unplanned. Includes change management for internal stakeholders and rollout strategy for users, with staged rollout plans and adoption metrics.",
    methodology: ["Build-Measure-Learn", "OKR"],
    inputs: ["Feature brief", "Metrics plan", "Roadmap", "Stakeholder map"],
    outputs: ["GTM plan", "Rollout strategy", "Adoption metrics", "Communication plan", "Change management brief"],
    handsTo: ["Retrospective Lead"],
    tension: [],
    gate: false,
  },
  {
    id: "retrospective-lead",
    layer: "delivery",
    symbol: "RL",
    name: "Retrospective Lead",
    phase: "Learning",
    role: "Outcome vs output review, learning capture, backlog refinement, North Star progress tracking",
    description: "Closes the loop between what was built and what was learned. Compares actual outcomes against the success metrics defined before build. Updates the Opportunity Solution Tree based on what was learned. Feeds findings back to the User Researcher for the next discovery cycle. The mechanism that makes continuous discovery actually continuous.",
    methodology: ["Build-Measure-Learn", "Continuous Discovery", "OKR"],
    inputs: ["Success metrics", "Launch data", "User feedback", "North Star progress"],
    outputs: ["Outcome review", "Learning synthesis", "Backlog updates", "OST refinements", "Next cycle brief"],
    handsTo: ["User Researcher", "Opportunity Mapper"],
    tension: [],
    gate: true,
    gateLabel: "Learning gate — Product Lead reviews outcomes and approves next cycle direction",
  },
];

const TENSIONS = [
  {
    pair: "User Researcher ↔ Business Analyst",
    note: "User desirability vs business viability. The most fundamental PM tension — what users need and what the business can sustain are not always the same thing. The Strategy Architect resolves conflicts between them.",
    method: "The intersection of desirability, viability, feasibility (classic PM framework)",
  },
  {
    pair: "Strategy Architect ↔ Opportunity Mapper",
    note: "Top-down strategy vs bottom-up opportunity discovery. Strategy defines the destination; opportunity mapping finds the route. When they conflict, it means either the strategy is wrong or the opportunity is off-target.",
    method: "Opportunity Solution Tree — connects desired outcome (strategy) to opportunities (discovery)",
  },
  {
    pair: "Risk Assessor ↔ Experiment Designer",
    note: "How much validation is enough before committing? Risk Assessor wants more evidence; Experiment Designer designs the minimum test. Prevents both analysis paralysis and premature commitment.",
    method: "Build-Measure-Learn — minimum experiment to invalidate critical assumptions",
  },
  {
    pair: "Prioritisation Lead ↔ Roadmap Architect",
    note: "What to build now vs how to sequence it. Prioritisation Lead scores by impact; Roadmap Architect considers dependencies and strategic narrative. A high-RICE item may still need to be sequenced later.",
    method: "WSJF — cost of delay forces explicit sequencing trade-offs",
  },
  {
    pair: "Product Critic ↔ Requirements Writer",
    note: "Is this the right thing to build? Critic challenges problem-solution fit; Requirements Writer specifies how to build the agreed solution. When critic flags a problem after requirements are written, it routes back to Opportunity Mapper.",
    method: "Opportunity Solution Tree — critic checks solution traces back to a validated opportunity",
  },
];

const PIPELINE_STAGES = [
  {
    layer: "strategy",
    stages: [
      { n: "1", name: "Market Analysis", agents: ["market-researcher"], human: false, note: "External opportunity confirmed before internal investment" },
      { n: "2", name: "User Discovery", agents: ["user-researcher"], human: false, note: "JTBD and continuous discovery — what progress are users trying to make?" },
      { n: "3", name: "Business Case", agents: ["business-analyst"], human: false, note: "Viability and ROI confirmed alongside desirability" },
      { n: "4", name: "Product Strategy", agents: ["strategy-architect"], human: true, note: "★ STRATEGY GATE — Product Lead approves North Star, OKRs, and direction before discovery begins" },
    ],
    handoff: "Approved strategy + opportunity landscape passed to Discovery Layer",
  },
  {
    layer: "discovery",
    stages: [
      { n: "5", name: "Opportunity Mapping", agents: ["opportunity-mapper"], human: false, note: "Opportunity Solution Tree built — opportunities identified before solutions considered" },
      { n: "6", name: "Risk Assessment", agents: ["risk-assessor"], human: false, note: "Critical assumptions identified — what would cause this to fail?" },
      { n: "7", name: "Experiment Design", agents: ["experiment-designer"], human: true, note: "★ VALIDATION GATE — minimum test designed; Product Lead approves before running" },
      { n: "8", name: "Validation", agents: ["experiment-designer", "user-researcher"], human: false, note: "Experiment runs — structured learning, not build" },
      { n: "9", name: "Learning Synthesis", agents: ["opportunity-mapper", "risk-assessor"], human: false, note: "OST updated with validated / invalidated opportunities; iterate or proceed" },
    ],
    handoff: "Validated opportunity + experiment results passed to Delivery Layer",
  },
  {
    layer: "delivery",
    stages: [
      { n: "10", name: "Prioritisation", agents: ["prioritisation-lead"], human: false, note: "RICE/WSJF applied — what to build and in what order, with evidence" },
      { n: "11", name: "Roadmap", agents: ["roadmap-architect"], human: true, note: "★ ROADMAP GATE — Product Lead approves sequence and dependencies" },
      { n: "12", name: "Requirements", agents: ["requirements-writer"], human: false, note: "Feature briefs written — touchpoint briefs produced for design system handoff" },
      { n: "13", name: "Metrics Definition", agents: ["metrics-definer"], human: false, note: "Success criteria defined before build, not after — leading and lagging indicators" },
      { n: "14", name: "Product Critique", agents: ["product-critic"], human: false, note: "Problem-solution fit checked — does this feature trace back to a validated opportunity?" },
      { n: "15", name: "Launch Planning", agents: ["launch-planner"], human: false, note: "GTM and adoption strategy — deployment ≠ adoption" },
      { n: "16", name: "Launch", agents: ["launch-planner"], human: true, note: "★ LAUNCH GATE — Product Lead approves rollout" },
      { n: "17", name: "Retrospective", agents: ["retrospective-lead"], human: true, note: "★ LEARNING GATE — outcomes vs metrics reviewed; next cycle briefed" },
    ],
    handoff: "Feature brief → Design System (Service Blueprinter receives touchpoint brief)",
  },
];

const layerC = (layer) => LAYERS[layer];

export default function PMAgentTeam() {
  const [tab, setTab] = useState("team");
  const [selected, setSelected] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [methodExpanded, setMethodExpanded] = useState(null);

  const getAgent = (id) => AGENTS.find(a => a.id === id);

  return (
    <div style={{ background: "#fafaf7", minHeight: "100vh", fontFamily: "'DM Sans', system-ui, sans-serif", color: "#1a1a1a" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .agent-card:hover { transform: translateY(-1px); box-shadow: 0 4px 20px rgba(0,0,0,0.08) !important; }
        .stage-row:hover { background: #f5f5f0 !important; }
      `}</style>

      {/* Header */}
      <div style={{ background: "#0f1f14", borderBottom: "1px solid #1a3a1a", padding: "32px 40px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontSize: 10, letterSpacing: "0.25em", color: "#4a7a5a", textTransform: "uppercase", marginBottom: 10 }}>
            Product Management Agent System
          </div>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#f0fdf4", fontFamily: "'Playfair Display', serif", letterSpacing: "-0.01em" }}>
            ProductPowers
          </h1>
          <p style={{ margin: "10px 0 0", fontSize: 13, color: "#4a7a5a", maxWidth: 560, lineHeight: 1.6 }}>
            14 specialist agents across three layers — Strategy, Discovery, Delivery — with a human Product Lead directing the whole. Methodology-grounded. Validation-first.
          </p>

          {/* Layer legend */}
          <div style={{ display: "flex", gap: 24, marginTop: 20, flexWrap: "wrap" }}>
            {Object.entries(LAYERS).map(([k, v]) => (
              <div key={k} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: v.accent }} />
                <span style={{ fontSize: 11, color: "#4a7a5a", letterSpacing: "0.08em" }}>
                  {v.label.toUpperCase().replace(" LAYER", "")} — {k === "strategy" ? "4" : k === "discovery" ? "3" : "7"} agents
                </span>
              </div>
            ))}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#a78bfa" }} />
              <span style={{ fontSize: 11, color: "#4a7a5a", letterSpacing: "0.08em" }}>PRODUCT LEAD — human</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: "2px solid #e8e8e0", background: "#fff", padding: "0 40px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex" }}>
          {["team", "pipeline", "methodology", "tensions"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              background: "none", border: "none",
              borderBottom: tab === t ? "2px solid #1a3a2a" : "2px solid transparent",
              marginBottom: -2,
              color: tab === t ? "#1a3a2a" : "#888",
              cursor: "pointer", fontSize: 12, fontFamily: "inherit",
              letterSpacing: "0.12em", textTransform: "uppercase",
              padding: "14px 20px 12px", transition: "color 0.15s",
              fontWeight: tab === t ? 600 : 400,
            }}>
              {t === "team" ? "Agent Roster" : t === "pipeline" ? "Pipeline" : t === "methodology" ? "Methodology" : "Tensions"}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 40px" }}>

        {/* TEAM TAB */}
        {tab === "team" && (
          <div>
            {/* Product Lead */}
            <div style={{ background: "linear-gradient(135deg, #1a0a2e, #0f0a1a)", border: "1px solid #7c3aed", borderRadius: 10, padding: "18px 24px", marginBottom: 36, display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0 }}>PL</div>
              <div>
                <div style={{ fontSize: 13, color: "#a78bfa", fontWeight: 600, marginBottom: 4 }}>Product Lead — Human in the Loop</div>
                <div style={{ fontSize: 12, color: "#6b6b80", lineHeight: 1.6, maxWidth: 700 }}>
                  Sets strategic direction · approves gates (strategy, validation, roadmap, launch, learning) · resolves agent conflicts · makes decisions under uncertainty · the only one who can commit to build
                </div>
              </div>
              <div style={{ marginLeft: "auto", flexShrink: 0, background: "#2e1065", borderRadius: 6, padding: "6px 12px", fontSize: 10, color: "#c4b5fd", letterSpacing: "0.1em" }}>
                5 GATES: STRATEGY · VALIDATION · ROADMAP · LAUNCH · LEARNING
              </div>
            </div>

            {/* Layers */}
            {Object.entries(LAYERS).map(([layerKey, layer]) => {
              const agents = AGENTS.filter(a => a.layer === layerKey);
              return (
                <div key={layerKey} style={{ marginBottom: 36 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                    <div style={{ width: 32, height: 2, background: layer.accent }} />
                    <span style={{ fontSize: 11, color: layer.accent, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600 }}>
                      {layer.label}
                    </span>
                    <div style={{ flex: 1, height: 1, background: "#e8e8e0" }} />
                    <span style={{ fontSize: 11, color: "#aaa" }}>{layer.sublabel}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
                    {agents.map(agent => {
                      const lc = layerC(agent.layer);
                      const isSelected = selected?.id === agent.id;
                      return (
                        <div key={agent.id} className="agent-card" onClick={() => setSelected(isSelected ? null : agent)} style={{
                          background: "#fff", border: `1px solid ${isSelected ? lc.accent : "#e8e8e0"}`,
                          borderRadius: 10, padding: "16px 18px", cursor: "pointer",
                          transition: "all 0.15s", position: "relative",
                          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                        }}>
                          {isSelected && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: lc.accent, borderRadius: "10px 10px 0 0" }} />}
                          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                            <div style={{ width: 38, height: 38, borderRadius: 8, background: lc.soft, border: `1px solid ${lc.accent}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: lc.color, letterSpacing: "0.05em", flexShrink: 0 }}>
                              {agent.symbol}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a", marginBottom: 4 }}>{agent.name}</div>
                                <div style={{ display: "flex", gap: 4, flexShrink: 0, marginLeft: 8 }}>
                                  <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 4, background: lc.soft, color: lc.color, border: `1px solid ${lc.accent}44` }}>{agent.phase}</span>
                                  {agent.tension.length > 0 && <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 4, background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" }}>TENSION</span>}
                                  {agent.gate && <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 4, background: "#faf5ff", color: "#7c3aed", border: "1px solid #e9d5ff" }}>GATE</span>}
                                  {agent.isHandoff && <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 4, background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe" }}>→ DESIGN</span>}
                                </div>
                              </div>
                              <div style={{ fontSize: 11, color: "#888", lineHeight: 1.5 }}>{agent.role.split(",").slice(0, 2).join(", ")}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Design system handoff */}
            <div style={{ border: "2px dashed #bfdbfe", borderRadius: 8, padding: "14px 20px", marginBottom: 36, background: "#eff6ff", display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ fontSize: 18 }}>→</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#1d4ed8", marginBottom: 3 }}>Handoff to Design Agent System</div>
                <div style={{ fontSize: 11, color: "#3b82f6" }}>Requirements Writer produces touchpoint briefs → Service Blueprinter receives them → Designpowers pipeline begins</div>
              </div>
            </div>

            {/* Selected agent detail */}
            {selected && (() => {
              const lc = layerC(selected.layer);
              return (
                <div style={{ background: "#fff", border: `2px solid ${lc.accent}`, borderRadius: 12, padding: 28, animation: "fadeUp 0.2s ease" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    <div>
                      <div style={{ fontSize: 11, color: lc.accent, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6 }}>{LAYERS[selected.layer].label}</div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: "#1a1a1a", fontFamily: "'Playfair Display', serif" }}>{selected.name}</div>
                    </div>
                    <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", fontSize: 20, color: "#ccc", cursor: "pointer" }}>×</button>
                  </div>
                  <p style={{ fontSize: 13, color: "#555", lineHeight: 1.7, marginBottom: 24 }}>{selected.description}</p>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 20 }}>
                    <div>
                      <div style={{ fontSize: 10, color: lc.accent, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8, fontWeight: 600 }}>Inputs</div>
                      {selected.inputs.map((i, idx) => <div key={idx} style={{ fontSize: 12, color: "#555", marginBottom: 4 }}>› {i}</div>)}
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: lc.accent, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8, fontWeight: 600 }}>Outputs</div>
                      {selected.outputs.map((o, idx) => <div key={idx} style={{ fontSize: 12, color: "#555", marginBottom: 4 }}>› {o}</div>)}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    {selected.methodology.map(m => (
                      <span key={m} style={{ fontSize: 11, padding: "4px 10px", borderRadius: 4, background: lc.soft, color: lc.color, border: `1px solid ${lc.accent}33` }}>{m}</span>
                    ))}
                    {selected.isHandoff && (
                      <span style={{ fontSize: 11, padding: "4px 10px", borderRadius: 4, background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe" }}>→ Hands off to Design System</span>
                    )}
                    {selected.tension.length > 0 && (
                      <span style={{ fontSize: 11, padding: "4px 10px", borderRadius: 4, background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" }}>
                        Tension: {selected.tension.map(id => getAgent(id)?.name).join(", ")}
                      </span>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* PIPELINE TAB */}
        {tab === "pipeline" && (
          <div>
            <p style={{ fontSize: 13, color: "#666", marginBottom: 28, lineHeight: 1.6 }}>
              Three nested loops. Strategy runs once per initiative. Discovery runs per opportunity — and may loop multiple times before proceeding to delivery. Delivery runs per feature. Stars mark Product Lead gates.
            </p>
            {PIPELINE_STAGES.map((layer, li) => {
              const lc = LAYERS[layer.layer];
              return (
                <div key={li} style={{ marginBottom: 36 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                    <div style={{ width: 32, height: 2, background: lc.accent }} />
                    <span style={{ fontSize: 11, color: lc.accent, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600 }}>{lc.label}</span>
                    <div style={{ flex: 1, height: 1, background: "#e8e8e0" }} />
                    <span style={{ fontSize: 11, color: "#aaa" }}>{lc.sublabel}</span>
                  </div>

                  <div style={{ position: "relative" }}>
                    <div style={{ position: "absolute", left: 19, top: 20, bottom: 20, width: 1, background: `${lc.accent}33`, zIndex: 0 }} />
                    {layer.stages.map((stage, si) => {
                      const key = `${li}-${si}`;
                      const isExpanded = expanded === key;
                      const agentObjs = stage.agents.map(id => AGENTS.find(a => a.id === id)).filter(Boolean);
                      const isGate = stage.note.startsWith("★");
                      return (
                        <div key={si} style={{ display: "flex", gap: 14, marginBottom: 6, position: "relative", zIndex: 1 }}>
                          <div style={{ width: 38, height: 38, borderRadius: "50%", flexShrink: 0, background: isGate ? "#f5f3ff" : "#fff", border: `2px solid ${isGate ? "#7c3aed" : lc.accent}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: isGate ? "#7c3aed" : lc.accent, fontWeight: 700 }}>
                            {isGate ? "★" : stage.n}
                          </div>
                          <div className="stage-row" onClick={() => setExpanded(isExpanded ? null : key)} style={{ flex: 1, borderRadius: 8, border: `1px solid ${isExpanded ? lc.accent : "#e8e8e0"}`, overflow: "hidden", cursor: "pointer", transition: "border-color 0.15s", background: "#fff" }}>
                            <div style={{ padding: "10px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                              <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a", flex: 1 }}>{stage.name}</span>
                              <div style={{ display: "flex", gap: 6 }}>
                                {agentObjs.map(a => (
                                  <span key={a.id} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 3, background: lc.soft, color: lc.color }}>{a.symbol}</span>
                                ))}
                                {stage.human && <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 3, background: "#f5f3ff", color: "#7c3aed" }}>+PL</span>}
                              </div>
                              <span style={{ fontSize: 11, color: "#ccc" }}>{isExpanded ? "▲" : "▼"}</span>
                            </div>
                            {isExpanded && (
                              <div style={{ padding: "10px 16px 14px", borderTop: `1px solid ${lc.accent}22`, background: lc.soft }}>
                                <div style={{ fontSize: 12, color: "#555", marginBottom: 10, lineHeight: 1.6 }}>{stage.note.replace("★ ", "")}</div>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                  {agentObjs.map(a => (
                                    <div key={a.id} style={{ padding: "6px 12px", borderRadius: 6, background: "#fff", border: `1px solid ${lc.accent}44` }}>
                                      <div style={{ fontSize: 11, fontWeight: 600, color: lc.color }}>{a.name}</div>
                                      <div style={{ fontSize: 10, color: "#888", marginTop: 2 }}>{a.methodology.join(" · ")}</div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ marginLeft: 52, marginTop: 8, padding: "10px 14px", background: "#fff", border: "1px dashed #d1d5db", borderRadius: 6 }}>
                    <span style={{ fontSize: 11, color: "#888" }}>LAYER HANDOFF → {layer.handoff}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* METHODOLOGY TAB */}
        {tab === "methodology" && (
          <div>
            <p style={{ fontSize: 13, color: "#666", marginBottom: 28, lineHeight: 1.6 }}>
              The PM agent system embeds these methodologies as structural constraints — not optional best practices. Each agent applies specific frameworks so that the outputs are methodologically grounded by default.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {Object.entries(METHODOLOGY_REFS).map(([name, desc]) => {
                const isExp = methodExpanded === name;
                const agentsUsing = AGENTS.filter(a => a.methodology.includes(name));
                return (
                  <div key={name} onClick={() => setMethodExpanded(isExp ? null : name)} style={{ background: "#fff", border: `1px solid ${isExp ? "#1a3a2a" : "#e8e8e0"}`, borderRadius: 10, padding: "16px 18px", cursor: "pointer", transition: "all 0.15s", boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a", fontFamily: "'Playfair Display', serif" }}>{name}</div>
                      <span style={{ fontSize: 11, color: "#ccc" }}>{isExp ? "▲" : "▼"}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#888", marginTop: 6, lineHeight: 1.5 }}>{desc}</div>
                    {isExp && (
                      <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #f0f0e8" }}>
                        <div style={{ fontSize: 10, color: "#22c55e", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8, fontWeight: 600 }}>Applied by</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                          {agentsUsing.map(a => {
                            const lc = layerC(a.layer);
                            return <span key={a.id} style={{ fontSize: 11, padding: "3px 8px", borderRadius: 4, background: lc.soft, color: lc.color }}>{a.name}</span>;
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TENSIONS TAB */}
        {tab === "tensions" && (
          <div>
            <p style={{ fontSize: 13, color: "#666", marginBottom: 8, lineHeight: 1.6 }}>
              Quality in PM comes from structured conflict between perspectives — not from agents agreeing. These tensions are designed into the system. Each one prevents a specific failure mode.
            </p>
            <div style={{ fontSize: 12, color: "#22c55e", marginBottom: 28, padding: "10px 14px", background: "#f0fdf4", borderRadius: 6, border: "1px solid #bbf7d0" }}>
              PM tension is different from design tension. Design tensions are primarily about quality trade-offs (accessibility vs aesthetics). PM tensions are primarily about direction trade-offs — which problems to solve, how much validation before committing, what to build and when.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {TENSIONS.map((t, i) => (
                <div key={i} style={{ background: "#fff", border: "1px solid #e8e8e0", borderRadius: 10, padding: "20px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#dc2626", fontFamily: "'Playfair Display', serif", marginBottom: 10 }}>{t.pair}</div>
                  <div style={{ fontSize: 13, color: "#444", lineHeight: 1.7, marginBottom: 12 }}>{t.note}</div>
                  <div style={{ fontSize: 11, color: "#888", padding: "8px 12px", background: "#fafaf7", borderRadius: 6, border: "1px solid #e8e8e0" }}>
                    <span style={{ fontWeight: 600, color: "#555" }}>Resolution framework: </span>{t.method}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 32, background: "#0f1f14", borderRadius: 10, padding: "24px 28px", color: "#e8f5e9" }}>
              <div style={{ fontSize: 12, color: "#4a7a5a", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12, fontWeight: 600 }}>The meta-tension: PM vs Design</div>
              <div style={{ fontSize: 13, lineHeight: 1.7, color: "#a7c5a7" }}>
                The PM system and Design system are themselves in productive tension. PM asks whether to build something and what exactly — Design asks how it should work. The handoff point (Requirements Writer → Service Blueprinter) is where this tension becomes explicit. The Service Blueprinter may surface backstage constraints that send work back to the Product Critic for reassessment. The Design Critic may surface frontstage implications that challenge the original requirements. These escalations back up the chain are features, not failures.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
