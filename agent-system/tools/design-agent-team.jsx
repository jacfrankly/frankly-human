import { useState } from "react";

const SERVICE_AGENTS = [
  {
    id: "service-researcher",
    name: "Service Researcher",
    layer: "service",
    symbol: "SR",
    role: "Contextual inquiry, ethnography, ecosystem mapping, stakeholder mapping",
    inputs: ["Business brief", "Stakeholder interviews", "Field observation"],
    outputs: ["Ecosystem map", "Actor/stakeholder map", "Contextual research synthesis"],
    handlesTo: ["journey-architect"],
    tension: [],
    phase: "Discover → Ethnography",
    description: "Asks how the service actually works in practice — and where it breaks. Distinct from the Design-Scout's competitive benchmarking; this agent operates in the real world, not on screens.",
  },
  {
    id: "journey-architect",
    name: "Journey Architect",
    layer: "service",
    symbol: "JA",
    role: "Cross-channel orchestration, multi-touchpoint journey design, service moments mapping",
    inputs: ["Ecosystem map", "Actor map", "Research synthesis"],
    outputs: ["As-is journey map", "Future-state journey", "Touchpoint inventory", "Channel matrix"],
    handlesTo: ["service-blueprinter"],
    tension: ["design-lead"],
    phase: "Journey Architecture",
    description: "Designs how the experience holds together across digital, human, and physical touchpoints over time. Not UX flow design — operates above and across product surfaces.",
  },
  {
    id: "service-blueprinter",
    name: "Service Blueprinter",
    layer: "service",
    symbol: "SB",
    role: "Frontstage/backstage mapping, support processes, systems, policies, people behind each customer action",
    inputs: ["Journey map", "Touchpoint inventory", "Stakeholder map"],
    outputs: ["Service blueprint", "Backstage process map", "System dependency map", "Touchpoint briefs for design"],
    handlesTo: ["design-strategist"],
    tension: ["design-critic"],
    phase: "Blueprint",
    description: "The core service design artifact role. Produces the blueprint before anyone touches screen design — handing each touchpoint brief to the Designpowers layer with full backstage context.",
  },
  {
    id: "policy-reviewer",
    name: "Policy Reviewer",
    layer: "service",
    symbol: "PR",
    role: "Validates that backstage processes, policies and systems actually support what the frontstage promises",
    inputs: ["Service blueprint", "Completed designs", "Organisational constraints"],
    outputs: ["Promise-delivery gap analysis", "Policy conflict flags", "Backstage remediation recommendations"],
    handlesTo: [],
    tension: ["design-critic", "heuristic-evaluator"],
    phase: "Policy Review (post-Review)",
    description: "The service design critique role. Checks whether the designed UI actually delivers the service promise end-to-end — not just whether it's usable in isolation. Can trigger a re-blueprint if gaps are systemic.",
  },
];

const PRODUCT_AGENTS = [
  {
    id: "design-strategist",
    name: "Design Strategist",
    layer: "product",
    symbol: "DS",
    role: "Flows, information architecture, personas, design principles",
    inputs: ["Touchpoint brief from Service Blueprinter", "Research synthesis"],
    outputs: ["IA map", "Personas", "Design principles", "UX strategy"],
    handlesTo: ["design-lead", "content-writer"],
    tension: [],
    phase: "Strategise",
    description: "Receives the touchpoint brief from the Service Blueprinter and translates service context into screen-level strategy. The bridge between service design and product design.",
  },
  {
    id: "design-scout",
    name: "Design Scout",
    layer: "product",
    symbol: "DSc",
    role: "Competitive research and pattern analysis",
    inputs: ["Brief", "Category context"],
    outputs: ["Competitive audit", "Pattern library", "Benchmark analysis"],
    handlesTo: ["design-strategist"],
    tension: [],
    phase: "Research",
    description: "Maps the competitive landscape and identifies established patterns. Runs early and feeds the Strategist before principles are set.",
  },
  {
    id: "inspiration-scout",
    name: "Inspiration Scout",
    layer: "product",
    symbol: "IS",
    role: "Aesthetic references, cross-domain inspiration, mood boards",
    inputs: ["Taste profile", "Design principles"],
    outputs: ["Mood board", "Reference collection", "Aesthetic direction brief"],
    handlesTo: ["design-lead"],
    tension: [],
    phase: "Inspire",
    description: "Handles aesthetic research before design execution. Carries the human's taste profile into visual direction — drawing from outside the category, not just within it.",
  },
  {
    id: "design-lead",
    name: "Design Lead",
    layer: "product",
    symbol: "DL",
    role: "Visual design — layout, colour, typography, components",
    inputs: ["UX strategy", "Aesthetic direction brief", "Content draft"],
    outputs: ["Visual design system", "Component library", "Design specs"],
    handlesTo: ["design-builder", "motion-designer"],
    tension: ["accessibility-reviewer"],
    phase: "Design",
    description: "Executes the visual layer. Orchestrates the Design phase and manages open threads across agents before ship. The agent that calls the question on unresolved issues.",
  },
  {
    id: "motion-designer",
    name: "Motion Designer",
    layer: "product",
    symbol: "MD",
    role: "Animation, transitions, micro-interactions",
    inputs: ["Visual design specs", "Interaction patterns"],
    outputs: ["Motion specs", "Transition library", "Micro-interaction definitions"],
    handlesTo: ["design-builder"],
    tension: [],
    phase: "Design",
    description: "Works in parallel with the Design Lead. Defines the temporal dimension of the experience — how things move, appear, and respond.",
  },
  {
    id: "content-writer",
    name: "Content Writer",
    layer: "product",
    symbol: "CW",
    role: "Interface copy written at Grade 6 reading level",
    inputs: ["UX strategy", "Personas", "Design specs"],
    outputs: ["UI copy", "Error states", "Empty states", "Microcopy library"],
    handlesTo: ["design-builder"],
    tension: [],
    phase: "Design",
    description: "Writes for clarity, not cleverness. Needs the strategist's persona and principle output before starting — and feeds copy directly into build alongside design specs.",
  },
  {
    id: "design-builder",
    name: "Design Builder",
    layer: "product",
    symbol: "DB",
    role: "Converts specs into production code",
    inputs: ["Design specs", "Motion specs", "Copy", "Accessibility requirements"],
    outputs: ["Production code", "Component implementations"],
    handlesTo: ["accessibility-reviewer", "heuristic-evaluator"],
    tension: ["accessibility-reviewer"],
    phase: "Build",
    description: "Takes all upstream outputs and produces shippable code. The target of the Review agents — whose pushback can send work back for a Fix round.",
  },
  {
    id: "accessibility-reviewer",
    name: "Accessibility Reviewer",
    layer: "product",
    symbol: "AR",
    role: "WCAG and COGA evaluations on everything the team produces",
    inputs: ["Built components", "Design specs", "Copy"],
    outputs: ["Accessibility audit", "WCAG compliance report", "Remediation requirements"],
    handlesTo: ["design-builder"],
    tension: ["design-critic"],
    phase: "Review",
    description: "Evaluates every layer of output — not just code. When this agent and the Design Critic disagree, the Design Lead calls a reconciliation step before Fix begins.",
  },
  {
    id: "design-critic",
    name: "Design Critic",
    layer: "product",
    symbol: "DC",
    role: "Reviews work against the brief and principles, finding gaps nobody else caught",
    inputs: ["Built product", "Original brief", "Design principles", "Service blueprint"],
    outputs: ["Critical review", "Gap analysis", "Principle violations", "Ship/hold recommendation"],
    handlesTo: ["design-builder", "service-blueprinter"],
    tension: ["accessibility-reviewer", "policy-reviewer"],
    phase: "Review",
    description: "The most adversarial agent on purpose. Reviews against brief AND the service blueprint — can escalate back to the Policy Reviewer if the gap is systemic rather than surface-level.",
  },
  {
    id: "heuristic-evaluator",
    name: "Heuristic Evaluator",
    layer: "product",
    symbol: "HE",
    role: "Nielsen's 10 heuristics evaluation and cognitive walkthroughs of key tasks",
    inputs: ["Built product", "Key task flows"],
    outputs: ["Heuristic violations report", "Cognitive walkthrough findings", "Severity ratings"],
    handlesTo: ["design-builder"],
    tension: [],
    phase: "Review",
    description: "Runs structured usability evaluation in parallel with the Design Critic and Accessibility Reviewer. Severity-rates findings so the Fix round is prioritised, not chaotic.",
  },
];

const PIPELINE_STAGES = [
  {
    layer: "service",
    phase: "Service Design Layer",
    stages: [
      { name: "Ecosystem Map", agents: ["service-researcher"], human: false, note: "Maps actors, relationships, system boundaries" },
      { name: "Ethnography", agents: ["service-researcher"], human: false, note: "Contextual inquiry, field research, how the service actually works" },
      { name: "Journey Architecture", agents: ["journey-architect"], human: true, note: "Human reviews: does this journey match what we're trying to achieve?" },
      { name: "Blueprint", agents: ["service-blueprinter"], human: true, note: "Human reviews: backstage dependencies confirmed?" },
      { name: "Policy Review", agents: ["policy-reviewer"], human: false, note: "Validates backstage can support frontstage promise" },
    ],
    handoff: "Touchpoint briefs issued — one per digital surface in the journey",
  },
  {
    layer: "product",
    phase: "Touchpoint Design Layer (per touchpoint)",
    stages: [
      { name: "Discover", agents: ["design-scout", "design-strategist"], human: false, note: "Touchpoint brief consumed; context established" },
      { name: "Research", agents: ["design-scout"], human: false, note: "Competitive patterns, benchmarks" },
      { name: "Strategise", agents: ["design-strategist"], human: false, note: "IA, personas, design principles" },
      { name: "Taste", agents: [], human: true, note: "Human only: aesthetic instincts captured / taste profile loaded" },
      { name: "Inspire", agents: ["inspiration-scout"], human: false, note: "Mood boards, cross-domain references" },
      { name: "Plan", agents: ["design-strategist", "design-lead"], human: false, note: "Strategy → visual direction handoff" },
      { name: "Design", agents: ["design-lead", "motion-designer", "content-writer"], human: false, note: "Parallel execution; agents write handoff notes to each other" },
      { name: "Build", agents: ["design-builder"], human: false, note: "Specs → production code" },
      { name: "Taste Check", agents: [], human: true, note: "Human only: intermediate output reviewed; aesthetic mismatches caught" },
      { name: "Review", agents: ["accessibility-reviewer", "design-critic", "heuristic-evaluator"], human: false, note: "Adversarial review — disagreements trigger reconciliation" },
      { name: "Fix", agents: ["design-builder"], human: false, note: "Severity-prioritised; relevant agents re-engaged as needed" },
      { name: "Ship", agents: ["design-builder"], human: true, note: "Human final approval" },
      { name: "Retrospective", agents: ["design-strategist", "design-lead", "design-critic"], human: true, note: "Decisions documented; patterns captured" },
    ],
    handoff: "Blueprint updated — service layer informed of what was built and any backstage implications",
  },
];

const layerColors = {
  service: { bg: "#2a1a00", border: "#d97706", text: "#fbbf24", badge: "#92400e", badgeText: "#fde68a", dot: "#f59e0b" },
  product: { bg: "#001a2a", border: "#0891b2", text: "#22d3ee", badge: "#164e63", badgeText: "#a5f3fc", dot: "#06b6d4" },
};

export default function DesignAgentTeam() {
  const [activeTab, setActiveTab] = useState("team");
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [expandedStage, setExpandedStage] = useState(null);

  const allAgents = [...SERVICE_AGENTS, ...PRODUCT_AGENTS];

  const getAgent = (id) => allAgents.find((a) => a.id === id);

  return (
    <div style={{
      background: "#0a0a0f",
      minHeight: "100vh",
      color: "#e2e8f0",
      fontFamily: "'DM Mono', 'Fira Code', 'Courier New', monospace",
      padding: "0",
    }}>
      {/* Header */}
      <div style={{
        borderBottom: "1px solid #1e293b",
        padding: "28px 32px 20px",
        background: "linear-gradient(180deg, #0f0f1a 0%, #0a0a0f 100%)",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.2em", color: "#475569", textTransform: "uppercase", marginBottom: 8 }}>
            Designpowers Extended — Service Design Integration
          </div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#f1f5f9", letterSpacing: "-0.02em", fontFamily: "'DM Mono', monospace" }}>
            Multi-Agent Design System
          </h1>
          <p style={{ margin: "8px 0 0", fontSize: 13, color: "#64748b", maxWidth: 600 }}>
            14 specialist agents across two layers — Service Design and Touchpoint Design — with a human Creative Director directing the whole.
          </p>

          {/* Layer legend */}
          <div style={{ display: "flex", gap: 20, marginTop: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#f59e0b" }} />
              <span style={{ fontSize: 11, color: "#94a3b8", letterSpacing: "0.1em" }}>SERVICE DESIGN LAYER — 4 agents</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#06b6d4" }} />
              <span style={{ fontSize: 11, color: "#94a3b8", letterSpacing: "0.1em" }}>TOUCHPOINT DESIGN LAYER — 10 agents</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#a78bfa" }} />
              <span style={{ fontSize: 11, color: "#94a3b8", letterSpacing: "0.1em" }}>HUMAN — Creative Director</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: "1px solid #1e293b", padding: "0 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", gap: 0 }}>
          {["team", "pipeline"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: "none",
                border: "none",
                borderBottom: activeTab === tab ? "2px solid #e2e8f0" : "2px solid transparent",
                color: activeTab === tab ? "#f1f5f9" : "#475569",
                cursor: "pointer",
                fontSize: 12,
                fontFamily: "inherit",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                padding: "14px 20px 12px",
                transition: "color 0.15s",
              }}
            >
              {tab === "team" ? "Agent Roster" : "Pipeline & Interactions"}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 32px" }}>

        {/* TEAM TAB */}
        {activeTab === "team" && (
          <div>
            {/* Human Director */}
            <div style={{
              background: "linear-gradient(135deg, #1a0a2e 0%, #0f0a1a 100%)",
              border: "1px solid #7c3aed",
              borderRadius: 8,
              padding: "16px 20px",
              marginBottom: 32,
              display: "flex",
              alignItems: "center",
              gap: 20,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: "50%",
                background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, fontWeight: 700, color: "#fff", flexShrink: 0,
              }}>CD</div>
              <div>
                <div style={{ fontSize: 13, color: "#a78bfa", fontWeight: 600, marginBottom: 4 }}>Creative Director — Human in the Loop</div>
                <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.5 }}>
                  Sets taste profile · approves all handoffs in Direct mode · resolves agent disagreements · makes aesthetic judgments agents cannot · the only one who decides what's beautiful
                </div>
              </div>
              <div style={{
                marginLeft: "auto", flexShrink: 0,
                background: "#4c1d95", borderRadius: 4,
                padding: "4px 10px", fontSize: 10, color: "#c4b5fd", letterSpacing: "0.1em",
              }}>GATES: TASTE · TASTE CHECK · SHIP · DISAGREEMENTS</div>
            </div>

            {/* Service Design Layer */}
            <div style={{ marginBottom: 36 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 28, height: 1, background: "#d97706" }} />
                <span style={{ fontSize: 11, color: "#d97706", letterSpacing: "0.2em", textTransform: "uppercase" }}>
                  Service Design Layer
                </span>
                <div style={{ flex: 1, height: 1, background: "#1e293b" }} />
                <span style={{ fontSize: 11, color: "#475569" }}>runs once per service</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
                {SERVICE_AGENTS.map((agent) => (
                  <AgentCard key={agent.id} agent={agent} selected={selectedAgent?.id === agent.id} onClick={() => setSelectedAgent(selectedAgent?.id === agent.id ? null : agent)} />
                ))}
              </div>
            </div>

            {/* Handoff divider */}
            <div style={{
              border: "1px dashed #334155", borderRadius: 6, padding: "12px 16px",
              marginBottom: 32, textAlign: "center",
              background: "#0f172a",
            }}>
              <span style={{ fontSize: 11, color: "#64748b", letterSpacing: "0.15em" }}>
                ↓ SERVICE BLUEPRINTER ISSUES TOUCHPOINT BRIEFS ↓ ONE PER DIGITAL SURFACE IN THE JOURNEY
              </span>
            </div>

            {/* Product Design Layer */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 28, height: 1, background: "#0891b2" }} />
                <span style={{ fontSize: 11, color: "#0891b2", letterSpacing: "0.2em", textTransform: "uppercase" }}>
                  Touchpoint Design Layer
                </span>
                <div style={{ flex: 1, height: 1, background: "#1e293b" }} />
                <span style={{ fontSize: 11, color: "#475569" }}>runs per touchpoint</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
                {PRODUCT_AGENTS.map((agent) => (
                  <AgentCard key={agent.id} agent={agent} selected={selectedAgent?.id === agent.id} onClick={() => setSelectedAgent(selectedAgent?.id === agent.id ? null : agent)} />
                ))}
              </div>
            </div>

            {/* Expanded agent detail */}
            {selectedAgent && (
              <div style={{
                background: selectedAgent.layer === "service" ? "#1a0f00" : "#001420",
                border: `1px solid ${layerColors[selectedAgent.layer].border}`,
                borderRadius: 8, padding: 24, marginTop: 8,
                animation: "fadeIn 0.15s ease",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 11, color: layerColors[selectedAgent.layer].text, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6 }}>
                      {selectedAgent.layer === "service" ? "Service Design Layer" : "Touchpoint Design Layer"}
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9" }}>{selectedAgent.name}</div>
                  </div>
                  <button onClick={() => setSelectedAgent(null)} style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 18 }}>×</button>
                </div>
                <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.65, marginBottom: 20 }}>{selectedAgent.description}</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  <DetailBlock label="Inputs" items={selectedAgent.inputs} color={layerColors[selectedAgent.layer].text} />
                  <DetailBlock label="Outputs" items={selectedAgent.outputs} color={layerColors[selectedAgent.layer].text} />
                </div>
                {selectedAgent.tension.length > 0 && (
                  <div style={{ marginTop: 16, padding: "10px 14px", background: "#1e1010", border: "1px solid #7f1d1d", borderRadius: 6 }}>
                    <span style={{ fontSize: 11, color: "#ef4444", letterSpacing: "0.1em" }}>PRODUCTIVE TENSION WITH: </span>
                    <span style={{ fontSize: 12, color: "#fca5a5" }}>
                      {selectedAgent.tension.map((id) => getAgent(id)?.name).join(" · ")}
                    </span>
                    <div style={{ fontSize: 11, color: "#7f1d1d", marginTop: 4 }}>
                      Disagreements between these agents trigger a reconciliation step before Fix round begins.
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* PIPELINE TAB */}
        {activeTab === "pipeline" && (
          <div>
            <div style={{ fontSize: 12, color: "#475569", marginBottom: 24, lineHeight: 1.6 }}>
              The pipeline runs in two nested loops. The service design layer runs once for the whole service. The touchpoint layer runs once for each digital surface identified in the service blueprint.
            </div>

            {PIPELINE_STAGES.map((layer, li) => (
              <div key={li} style={{ marginBottom: 40 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 28, height: 1, background: li === 0 ? "#d97706" : "#0891b2" }} />
                  <span style={{ fontSize: 11, color: li === 0 ? "#d97706" : "#0891b2", letterSpacing: "0.2em", textTransform: "uppercase" }}>
                    {layer.phase}
                  </span>
                  <div style={{ flex: 1, height: 1, background: "#1e293b" }} />
                </div>

                <div style={{ position: "relative" }}>
                  {/* Connecting line */}
                  <div style={{
                    position: "absolute", left: 19, top: 20, bottom: 20,
                    width: 1, background: li === 0 ? "#78350f" : "#164e63",
                    zIndex: 0,
                  }} />

                  {layer.stages.map((stage, si) => {
                    const isExpanded = expandedStage === `${li}-${si}`;
                    const agentObjs = stage.agents.map(id => allAgents.find(a => a.id === id)).filter(Boolean);
                    const layerC = li === 0 ? layerColors.service : layerColors.product;

                    return (
                      <div key={si} style={{ display: "flex", gap: 16, marginBottom: 8, position: "relative", zIndex: 1 }}>
                        {/* Step indicator */}
                        <div style={{
                          width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
                          background: stage.human && stage.agents.length === 0 ? "#1e1030" : "#0f1723",
                          border: `2px solid ${stage.human && stage.agents.length === 0 ? "#7c3aed" : layerC.border}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 11, color: stage.human && stage.agents.length === 0 ? "#a78bfa" : layerC.text,
                          fontWeight: 700,
                        }}>
                          {si + 1}
                        </div>

                        {/* Stage block */}
                        <div
                          style={{
                            flex: 1, borderRadius: 6, overflow: "hidden",
                            border: `1px solid ${isExpanded ? layerC.border : "#1e293b"}`,
                            cursor: "pointer",
                            transition: "border-color 0.15s",
                          }}
                          onClick={() => setExpandedStage(isExpanded ? null : `${li}-${si}`)}
                        >
                          <div style={{
                            padding: "10px 16px",
                            background: isExpanded ? (li === 0 ? "#1a0f00" : "#001420") : "#0f172a",
                            display: "flex", alignItems: "center", gap: 12,
                          }}>
                            <span style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", flex: 1 }}>{stage.name}</span>

                            {/* Agent pills */}
                            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                              {stage.agents.length === 0 && stage.human && (
                                <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 3, background: "#4c1d95", color: "#c4b5fd", letterSpacing: "0.08em" }}>
                                  HUMAN ONLY
                                </span>
                              )}
                              {agentObjs.map(a => (
                                <span key={a.id} style={{
                                  fontSize: 10, padding: "2px 8px", borderRadius: 3,
                                  background: layerC.badge, color: layerC.badgeText,
                                  letterSpacing: "0.05em",
                                }}>{a.symbol}</span>
                              ))}
                              {stage.human && stage.agents.length > 0 && (
                                <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 3, background: "#2e1065", color: "#c4b5fd", letterSpacing: "0.05em" }}>
                                  +CD
                                </span>
                              )}
                            </div>
                            <span style={{ fontSize: 11, color: "#334155" }}>{isExpanded ? "▲" : "▼"}</span>
                          </div>

                          {isExpanded && (
                            <div style={{ padding: "12px 16px", background: li === 0 ? "#110900" : "#000d16", borderTop: `1px solid ${layerC.border}22` }}>
                              <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 10, lineHeight: 1.6 }}>{stage.note}</div>
                              {agentObjs.length > 0 && (
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                  {agentObjs.map(a => (
                                    <div key={a.id} style={{
                                      padding: "6px 12px", borderRadius: 4,
                                      background: "#0f172a", border: `1px solid ${layerC.border}44`,
                                    }}>
                                      <div style={{ fontSize: 11, color: layerC.text, fontWeight: 600 }}>{a.name}</div>
                                      <div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>{a.role.split("—")[0].trim()}</div>
                                    </div>
                                  ))}
                                  {stage.human && stage.agents.length > 0 && (
                                    <div style={{
                                      padding: "6px 12px", borderRadius: 4,
                                      background: "#0f172a", border: "1px solid #7c3aed44",
                                    }}>
                                      <div style={{ fontSize: 11, color: "#a78bfa", fontWeight: 600 }}>Creative Director</div>
                                      <div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>Reviews and approves handoff</div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Layer handoff */}
                <div style={{
                  marginLeft: 54,
                  border: "1px dashed #334155",
                  borderRadius: 6, padding: "10px 14px",
                  background: "#0a0f1a", marginTop: 8,
                }}>
                  <span style={{ fontSize: 11, color: "#475569", letterSpacing: "0.1em" }}>
                    LAYER HANDOFF → {layer.handoff}
                  </span>
                </div>
              </div>
            ))}

            {/* Tension note */}
            <div style={{
              marginTop: 8,
              background: "#1a0808",
              border: "1px solid #7f1d1d",
              borderRadius: 8, padding: 20,
            }}>
              <div style={{ fontSize: 11, color: "#ef4444", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10 }}>
                Productive Tensions — Where Quality Comes From
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { pair: "Accessibility Reviewer ↔ Design Critic", note: "Most common conflict. Critic wants to ship; Reviewer flags violations. Design Lead calls reconciliation." },
                  { pair: "Design Critic ↔ Policy Reviewer", note: "Critic reviews against brief; Policy Reviewer reviews against service promise. If both flag issues, it's systemic — triggers a re-blueprint." },
                  { pair: "Journey Architect ↔ Design Lead", note: "Journey Architect holds the cross-channel view; Design Lead focuses on this surface. Tension keeps individual touchpoints honest to the bigger journey." },
                  { pair: "Service Blueprinter ↔ Design Critic", note: "After ship, the Critic can escalate back to the Blueprinter if the delivered product deviates from the blueprint's backstage assumptions." },
                ].map((t, i) => (
                  <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 12, color: "#fca5a5", fontWeight: 600, flexShrink: 0, minWidth: 280 }}>{t.pair}</span>
                    <span style={{ fontSize: 12, color: "#7f1d1d" }}>{t.note}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        button:hover { opacity: 0.85; }
      `}</style>
    </div>
  );
}

function AgentCard({ agent, selected, onClick }) {
  const c = layerColors[agent.layer];
  return (
    <div
      onClick={onClick}
      style={{
        background: selected ? (agent.layer === "service" ? "#1a0f00" : "#001420") : "#0f172a",
        border: `1px solid ${selected ? c.border : "#1e293b"}`,
        borderRadius: 8, padding: "14px 16px",
        cursor: "pointer",
        transition: "all 0.15s",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Active indicator */}
      {selected && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: c.border }} />}

      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 6, flexShrink: 0,
          background: agent.layer === "service" ? "#451a03" : "#0c2942",
          border: `1px solid ${c.border}44`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 10, fontWeight: 700, color: c.text,
          letterSpacing: "0.05em",
        }}>{agent.symbol}</div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", marginBottom: 3 }}>{agent.name}</div>
          <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.5, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
            {agent.role}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end", flexShrink: 0 }}>
          <span style={{
            fontSize: 9, padding: "2px 6px", borderRadius: 3,
            background: c.badge, color: c.badgeText, letterSpacing: "0.08em",
          }}>{agent.phase}</span>
          {agent.tension.length > 0 && (
            <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 3, background: "#450a0a", color: "#fca5a5", letterSpacing: "0.05em" }}>
              TENSION
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailBlock({ label, items, color }) {
  return (
    <div>
      <div style={{ fontSize: 10, color: color, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
      <ul style={{ margin: 0, padding: "0 0 0 16px", listStyle: "none" }}>
        {items.map((item, i) => (
          <li key={i} style={{ fontSize: 12, color: "#94a3b8", marginBottom: 4, lineHeight: 1.5, paddingLeft: 0, position: "relative" }}>
            <span style={{ position: "absolute", left: -12, color: "#334155" }}>›</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
