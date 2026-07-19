import { useState } from "react";

/* ══════════════════════ PROJECT ════════════════════════════════════════════ */
const PROJECT_NAME = "Service Blueprint"; // update per project

/* ══════════════════════ CONSTANTS ══════════════════════════════════════════ */
const MARKERS = {
  touchpoint: { short: "TP", label: "Touchpoint",     color: "#00e5ff" },
  failpoint:  { short: "FP", label: "Fail Point",      color: "#ff4757" },
  mot:        { short: "★",  label: "Moment of Truth", color: "#ffd700" },
};
const LANE_STYLES = {
  evidence:   { accent: "#4fc3f7", glow: "rgba(79,195,247,0.09)"  },
  customer:   { accent: "#00e5ff", glow: "rgba(0,229,255,0.09)"   },
  frontstage: { accent: "#69f0ae", glow: "rgba(105,240,174,0.09)" },
  backstage:  { accent: "#ce93d8", glow: "rgba(206,147,216,0.09)" },
  support:    { accent: "#ffab40", glow: "rgba(255,171,64,0.09)"  },
  default:    { accent: "#90a4ae", glow: "rgba(144,164,174,0.09)" },
};
const getLs    = (t) => LANE_STYLES[t] ?? LANE_STYLES.default;
const BR_COLS  = ["#00e5ff","#69f0ae","#ffd700","#ff6b9d","#ce93d8","#ffab40"];
const B0       = "b0";
const DEF_BR   = { id: B0, name: "Main Path", color: BR_COLS[0] };
const BRANCH_W = 178; // px – each branch column width
const STAGE_H  = 44;  // px – stage name row height
const BRANCH_H = 28;  // px – branch sub-header row height
const CELL_H   = 138; // px – minimum cell height
const VIS_H    = 28;  // px – visibility line row height

/* ══════════════════════ DEFAULT DATA ═══════════════════════════════════════ */
const mk = (content, markers = []) => ({ content, markers });
const STAGE_DEFAULTS = [
  { id:"s1", name:"Stage 1", branches:[{ ...DEF_BR }] },
  { id:"s2", name:"Stage 2", branches:[{ ...DEF_BR }] },
  { id:"s3", name:"Stage 3", branches:[{ ...DEF_BR }] },
];
const LANE_DEFAULTS = [
  { id:"l1", name:"Physical Evidence",   type:"evidence"   },
  { id:"l2", name:"Customer Actions",    type:"customer"   },
  { id:"l3", name:"Frontstage (System)", type:"frontstage" },
  { id:"l4", name:"Backstage Actions",   type:"backstage"  },
  { id:"l5", name:"Support Processes",   type:"support"    },
];
const CELL_DEFAULTS = {};

/* ══════════════════════ UID ════════════════════════════════════════════════ */
let _id = 500;
const uid = () => `x${_id++}`;

/* ══════════════════════ PDF HELPERS ════════════════════════════════════════ */
const hx = (hex) => [
  parseInt(hex.slice(1,3),16),
  parseInt(hex.slice(3,5),16),
  parseInt(hex.slice(5,7),16),
];
const loadJsPDF = () =>
  new Promise((resolve, reject) => {
    if (window.jspdf) { resolve(window.jspdf.jsPDF); return; }
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    s.onload = () => resolve(window.jspdf.jsPDF);
    s.onerror = reject;
    document.head.appendChild(s);
  });

/* ══════════════════════ COMPONENT ══════════════════════════════════════════ */
export default function ServiceBlueprint() {
  const [stages,     setStages]     = useState(STAGE_DEFAULTS);
  const [lanes,      setLanes]      = useState(LANE_DEFAULTS);
  const [cells,      setCells]      = useState(CELL_DEFAULTS);
  const [visAfter,   setVisAfter]   = useState("l3");
  const [editCell,   setEditCell]   = useState(null);
  const [editLane,   setEditLane]   = useState(null);
  const [editStage,  setEditStage]  = useState(null);
  const [editBranch, setEditBranch] = useState(null); // "stageId|branchId"
  const [hover,      setHover]      = useState(null);
  const [pdfBusy,    setPdfBusy]    = useState(false);
  const [newStage,   setNewStage]   = useState(false); // dialog open
  const [newStageName, setNewStageName] = useState("");

  /* ── derived ───────────────────────────────────────────────────────────── */
  const totalBranches = stages.reduce((s, st) => s + st.branches.length, 0);
  const totalWidth    = 200 + totalBranches * BRANCH_W + 44;

  /* ── cell helpers ──────────────────────────────────────────────────────── */
  const getCell = (lId, sId, bId) =>
    cells[`${lId}-${sId}-${bId}`] ?? { content: "", markers: [] };

  const setContent = (lId, sId, bId, txt) =>
    setCells(p => ({ ...p, [`${lId}-${sId}-${bId}`]: { ...getCell(lId,sId,bId), content: txt } }));

  const toggleMarker = (lId, sId, bId, marker) => {
    const key = `${lId}-${sId}-${bId}`;
    const c   = getCell(lId, sId, bId);
    const ms  = c.markers.includes(marker)
      ? c.markers.filter(m => m !== marker)
      : [...c.markers, marker];
    setCells(p => ({ ...p, [key]: { ...c, markers: ms } }));
  };

  /* ── stage CRUD ────────────────────────────────────────────────────────── */
  const createStage = (name) => {
    const sid = uid(), bid = uid();
    setStages(p => [...p, {
      id: sid,
      name: name || "New Stage",
      branches: [{ id: bid, name: "Main Path", color: BR_COLS[0] }],
    }]);
    setNewStage(false);
    setNewStageName("");
    setEditStage(sid);
  };
  const delStage = (id) => {
    if (stages.length <= 1) return;
    setStages(p => p.filter(s => s.id !== id));
    setCells(p => Object.fromEntries(
      Object.entries(p).filter(([k]) => k.split("-")[1] !== id)
    ));
  };
  const renStage = (id, name) =>
    setStages(p => p.map(s => s.id === id ? { ...s, name } : s));

  /* ── branch CRUD ───────────────────────────────────────────────────────── */
  const addBranch = (stageId) => {
    const stage = stages.find(s => s.id === stageId);
    const id    = uid();
    const color = BR_COLS[stage.branches.length % BR_COLS.length];
    setStages(p => p.map(s => s.id === stageId
      ? { ...s, branches: [...s.branches, { id, name: `Path ${s.branches.length + 1}`, color }] }
      : s
    ));
    setEditBranch(`${stageId}|${id}`);
  };
  const delBranch = (stageId, branchId) => {
    const stage = stages.find(s => s.id === stageId);
    if (stage.branches.length <= 1) return;
    setStages(p => p.map(s => s.id === stageId
      ? { ...s, branches: s.branches.filter(b => b.id !== branchId) }
      : s
    ));
    setCells(p => Object.fromEntries(
      Object.entries(p).filter(([k]) => {
        const pts = k.split("-");
        return !(pts[1] === stageId && pts[2] === branchId);
      })
    ));
  };
  const renBranch = (stageId, branchId, name) =>
    setStages(p => p.map(s => s.id === stageId
      ? { ...s, branches: s.branches.map(b => b.id === branchId ? { ...b, name } : b) }
      : s
    ));

  /* ── lane CRUD ─────────────────────────────────────────────────────────── */
  const addLane = () => {
    const id = uid();
    setLanes(p => [...p, { id, name: "New Lane", type: "default" }]);
    setEditLane(id);
  };
  const delLane = (id) => {
    if (lanes.length <= 1) return;
    setLanes(p => p.filter(l => l.id !== id));
    setCells(p => Object.fromEntries(
      Object.entries(p).filter(([k]) => k.split("-")[0] !== id)
    ));
    if (visAfter === id) setVisAfter(null);
  };
  const renLane = (id, name) =>
    setLanes(p => p.map(l => l.id === id ? { ...l, name } : l));

  /* ── JSON export ───────────────────────────────────────────────────────── */
  const exportJSON = () => {
    const payload = {
      meta: { title: `${PROJECT_NAME} — Service Blueprint`, exportedAt: new Date().toISOString() },
      stages, lanes, visibilityLineAfterLane: visAfter,
      cells: Object.fromEntries(
        Object.entries(cells).filter(([, v]) => v.content || v.markers?.length)
      ),
    };
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }));
    a.download = "service-blueprint.json";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  /* ── A3 PDF EXPORT ─────────────────────────────────────────────────────── */
  const exportPDF = async () => {
    setPdfBusy(true);
    try {
      const jsPDF = await loadJsPDF();

      /* ── Page dimensions (mm) ── */
      const PW = 420, PH = 297;               // A3 landscape
      const PAD = 14;                          // page bleed margin
      const CW  = PW - PAD * 2;               // content width
      const CH  = PH - PAD * 2;               // content height

      /* ── Row heights (mm) ── */
      const HDR_H  = 15;   // header bar
      const FTR_H  = 9;    // footer bar
      const STG_H  = 11;   // stage name row
      const BRN_H  = 8;    // branch name row
      const LBL_W  = 44;   // lane label column width
      const VIS_RH = 5;    // visibility line row
      const CELL_RH = 30;  // cell row height – adjusted dynamically if needed

      const hasBranches  = stages.some(st => st.branches.length > 1);
      const headerRowH   = STG_H + BRN_H;
      const bodyTop      = PAD + HDR_H;
      const bodyBot      = PH - PAD - FTR_H;
      const bodyH        = bodyBot - bodyTop;
      const availH       = bodyH - headerRowH;

      /* ── Compute effective cell height to fit all lanes on page ── */
      const visLineCount = lanes.filter((_, li) => li > 0 && lanes[li-1]?.id === visAfter).length;
      const rawLaneH     = availH - visLineCount * VIS_RH;
      const effCellH     = Math.max(18, Math.min(CELL_RH, rawLaneH / lanes.length));

      /* ── Flatten all branch columns ── */
      const allCols = stages.flatMap(st =>
        st.branches.map((br, bi) => ({
          stageId: st.id, stageName: st.name,
          branchId: br.id, branchName: br.name, branchColor: br.color,
          stageIdx: stages.findIndex(s => s.id === st.id),
          totalBrsInStage: st.branches.length, branchIdx: bi,
        }))
      );

      /* ── Paginate columns ── */
      const AVAIL_COL_W  = CW - LBL_W;
      const MIN_COL_W    = 38;
      const maxPerPage   = Math.max(1, Math.floor(AVAIL_COL_W / MIN_COL_W));

      // Try to keep all branches of a stage together
      const pages = [];
      let i = 0;
      while (i < allCols.length) {
        const batch = [];
        let count   = 0;
        while (i < allCols.length && count < maxPerPage) {
          // If adding this col exceeds limit AND it's mid-stage AND we have something, stop
          const col = allCols[i];
          if (count > 0 && count >= maxPerPage) break;
          batch.push(col);
          count++;
          i++;
        }
        if (batch.length) pages.push(batch);
      }

      const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a3" });

      /* ═══ DRAW EACH PAGE ═══ */
      pages.forEach((pageCols, pIdx) => {
        if (pIdx > 0) doc.addPage("a3", "landscape");

        const colW       = AVAIL_COL_W / pageCols.length;
        const stageNames = [...new Set(pageCols.map(c => c.stageName))];
        const rangeLabel = stageNames.join("  ›  ");
        const dateStr    = new Date().toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" });

        /* ── Crop marks (L-shaped corners) ── */
        const CL = 4.5, CG = 2.5;
        doc.setDrawColor(155, 155, 155);
        doc.setLineWidth(0.18);
        [
          [PAD, PAD, -1, -1],
          [PW - PAD, PAD, 1, -1],
          [PAD, PH - PAD, -1, 1],
          [PW - PAD, PH - PAD, 1, 1],
        ].forEach(([x, y, dx, dy]) => {
          doc.line(x + dx * CG, y, x + dx * (CG + CL), y);
          doc.line(x, y + dy * CG, x, y + dy * (CG + CL));
        });

        /* ── Bleed registration tick (centre marks on each edge) ── */
        doc.setDrawColor(130, 130, 130);
        doc.setLineWidth(0.12);
        [[PW/2, PAD - CG - CL, PW/2, PAD - CG],
         [PW/2, PH - PAD + CG, PW/2, PH - PAD + CG + CL],
         [PAD - CG - CL, PH/2, PAD - CG, PH/2],
         [PW - PAD + CG, PH/2, PW - PAD + CG + CL, PH/2]
        ].forEach(([x1,y1,x2,y2]) => doc.line(x1,y1,x2,y2));

        /* ── Page border ── */
        doc.setDrawColor(25, 55, 95);
        doc.setLineWidth(0.3);
        doc.rect(PAD, PAD, CW, CH);

        /* ── Header bar ── */
        doc.setFillColor(4, 13, 28);
        doc.rect(PAD, PAD, CW, HDR_H, "F");
        // left accent stripe
        doc.setFillColor(0, 180, 218);
        doc.rect(PAD, PAD, 2.5, HDR_H, "F");
        // title
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(0, 200, 230);
        doc.text(`BLUEPRINT STUDIO  —  ${PROJECT_NAME.toUpperCase()} SERVICE BLUEPRINT`, PAD + 6, PAD + 6);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(6.5);
        doc.setTextColor(45, 100, 140);
        doc.text(`STAGES:  ${rangeLabel}`, PAD + 6, PAD + 11.5);
        // right: date + page
        doc.setTextColor(45, 100, 140);
        doc.text(`${dateStr}   ·   PAGE ${pIdx + 1} / ${pages.length}`, PW - PAD - 5, PAD + 11.5, { align: "right" });

        /* ── Footer bar ── */
        const FY = PH - PAD - FTR_H;
        doc.setFillColor(4, 13, 28);
        doc.rect(PAD, FY, CW, FTR_H, "F");
        doc.setDrawColor(25, 55, 95);
        doc.setLineWidth(0.2);
        doc.line(PAD, FY, PAD + CW, FY);

        // Marker legend
        let lx = PAD + 5;
        Object.entries(MARKERS).forEach(([, v]) => {
          const [r,g,b] = hx(v.color);
          doc.setFillColor(r,g,b);
          doc.rect(lx, FY + 2.2, 6, 4, "F");
          doc.setFont("helvetica","bold"); doc.setFontSize(4.2); doc.setTextColor(0,0,0);
          doc.text(v.short, lx + 3, FY + 5.1, { align: "center" });
          doc.setFont("helvetica","normal"); doc.setFontSize(5); doc.setTextColor(80,130,165);
          doc.text(v.label, lx + 8, FY + 5.1);
          lx += 44;
        });

        // File/registration marks on right edge (3 equally spaced notches)
        doc.setDrawColor(60, 110, 155);
        doc.setLineWidth(0.35);
        [0.25, 0.5, 0.75].forEach(p => {
          const ny = PAD + CH * p;
          doc.line(PW - PAD - 3.5, ny, PW - PAD, ny);
        });

        // Section index tab (bottom-right corner)
        doc.setFillColor(0, 80, 120);
        doc.rect(PW - PAD - 20, FY + 1, 20, FTR_H - 2, "F");
        doc.setFont("helvetica","bold"); doc.setFontSize(5.5); doc.setTextColor(0,200,230);
        doc.text(`${pIdx + 1}/${pages.length}`, PW - PAD - 10, FY + 5.5, { align: "center" });

        // Continuation arrow (if more pages)
        if (pIdx < pages.length - 1) {
          doc.setFont("helvetica","bold"); doc.setFontSize(7); doc.setTextColor(0,180,210);
          doc.text("›", PW - PAD - 2, bodyTop + bodyH / 2, { align: "right" });
        }
        if (pIdx > 0) {
          doc.setFont("helvetica","bold"); doc.setFontSize(7); doc.setTextColor(0,180,210);
          doc.text("‹", PAD + 2, bodyTop + bodyH / 2);
        }

        /* ── Column width & body area ── */
        const BX   = PAD;
        const BY   = bodyTop;

        /* ── Stage + branch header row background ── */
        doc.setFillColor(6, 18, 38);
        doc.rect(BX, BY, CW, headerRowH, "F");

        // Corner header cell
        doc.setFillColor(4, 14, 30);
        doc.rect(BX, BY, LBL_W, headerRowH, "F");
        doc.setDrawColor(0, 90, 130);
        doc.setLineWidth(0.2);
        doc.rect(BX, BY, LBL_W, headerRowH, "S");
        doc.setFont("helvetica","normal"); doc.setFontSize(5); doc.setTextColor(35, 75, 105);
        doc.text("SWIM LANE  /  STAGE", BX + 3.5, BY + 5);
        doc.text("(click cell to edit)", BX + 3.5, BY + 9.5);

        // Stage headers (grouped by stageId)
        const stageGroups = {};
        pageCols.forEach(c => {
          if (!stageGroups[c.stageId]) stageGroups[c.stageId] = [];
          stageGroups[c.stageId].push(c);
        });

        let curX = BX + LBL_W;
        pageCols.forEach((col) => {
          if (col.branchIdx === 0) {
            const grp  = stageGroups[col.stageId];
            const stW  = grp.length * colW;
            doc.setFillColor(5, 16, 34);
            doc.rect(curX, BY, stW, STG_H, "F");
            doc.setDrawColor(0, 75, 115);
            doc.setLineWidth(0.2);
            doc.rect(curX, BY, stW, STG_H, "S");
            // stage number chip
            doc.setFillColor(0, 60, 100);
            doc.rect(curX + 2, BY + 2, 8, 5, "F");
            doc.setFont("helvetica","bold"); doc.setFontSize(4.5); doc.setTextColor(0,190,220);
            doc.text(String(col.stageIdx + 1).padStart(2,"0"), curX + 6, BY + 5.8, { align:"center" });
            // stage name
            doc.setFont("helvetica","bold"); doc.setFontSize(7.5); doc.setTextColor(185, 215, 240);
            const stLabel = col.stageName.toUpperCase();
            const stLines = doc.splitTextToSize(stLabel, stW - 16);
            doc.text(stLines, curX + 12, BY + 5.5);
          }

          // Branch sub-header
          const bY = BY + STG_H;
          const [cr,cg,cb] = hx(col.branchColor);
          doc.setFillColor(4, 14, 28);
          doc.rect(curX, bY, colW, BRN_H, "F");
          // branch color bar
          doc.setFillColor(cr,cg,cb);
          doc.rect(curX, bY, colW, 1.2, "F");
          doc.setDrawColor(0, 55, 90);
          doc.setLineWidth(0.12);
          doc.rect(curX, bY, colW, BRN_H, "S");
          doc.setFont("helvetica", col.totalBrsInStage > 1 ? "bold" : "normal");
          doc.setFontSize(5.5);
          doc.setTextColor(cr,cg,cb);
          doc.text(col.branchName, curX + 2.5, bY + 5.5);

          curX += colW;
        });

        /* ── Lane rows ── */
        let rowY = BY + headerRowH;

        lanes.forEach((lane, li) => {
          const prev    = lanes[li - 1];
          const showVis = li > 0 && prev?.id === visAfter;
          const ls      = getLs(lane.type);
          const [ar,ag,ab] = hx(ls.accent);

          /* Visibility line row */
          if (showVis) {
            doc.setFillColor(0, 28, 50);
            doc.rect(BX, rowY, CW, VIS_RH, "F");
            // dashed line
            doc.setDrawColor(0, 170, 205);
            doc.setLineWidth(0.45);
            doc.setLineDashPattern([3, 2], 0);
            doc.line(BX, rowY + VIS_RH / 2, BX + CW, rowY + VIS_RH / 2);
            doc.setLineDashPattern([], 0);
            // label pill
            const vlW = 46, vlX = BX + CW / 2 - vlW / 2;
            doc.setFillColor(4, 13, 28);
            doc.rect(vlX, rowY + 0.8, vlW, VIS_RH - 1.6, "F");
            doc.setDrawColor(0, 160, 195);
            doc.setLineWidth(0.2);
            doc.rect(vlX, rowY + 0.8, vlW, VIS_RH - 1.6, "S");
            doc.setFont("helvetica","bold"); doc.setFontSize(4.5); doc.setTextColor(0,175,210);
            doc.text("LINE OF VISIBILITY", vlX + vlW / 2, rowY + 4, { align:"center" });
            rowY += VIS_RH;
          }

          /* Lane label cell */
          doc.setFillColor(4, 13, 26);
          doc.rect(BX, rowY, LBL_W, effCellH, "F");
          // accent bar
          doc.setFillColor(ar,ag,ab);
          doc.rect(BX, rowY, 2.5, effCellH, "F");
          doc.setDrawColor(0, 55, 90);
          doc.setLineWidth(0.2);
          doc.rect(BX, rowY, LBL_W, effCellH, "S");
          // lane dot
          doc.setFillColor(ar,ag,ab);
          doc.circle(BX + LBL_W - 5, rowY + 5, 1.2, "F");
          // lane name
          doc.setFont("helvetica","bold"); doc.setFontSize(6.5); doc.setTextColor(ar,ag,ab);
          const lnLines = doc.splitTextToSize(lane.name.toUpperCase(), LBL_W - 8);
          doc.text(lnLines, BX + 5.5, rowY + 6.5);

          /* Stage / branch cells */
          curX = BX + LBL_W;
          pageCols.forEach(col => {
            const c = getCell(lane.id, col.stageId, col.branchId);

            doc.setFillColor(3, 11, 23);
            doc.rect(curX, rowY, colW, effCellH, "F");

            // branch color top stripe (for multi-branch stages)
            if (col.totalBrsInStage > 1) {
              const [cr2,cg2,cb2] = hx(col.branchColor);
              doc.setFillColor(cr2, cg2, cb2);
              doc.setGState(doc.GState({ opacity: 0.45 }));
              doc.rect(curX, rowY, colW, 1.2, "F");
              doc.setGState(doc.GState({ opacity: 1 }));
            }

            doc.setDrawColor(0, 42, 70);
            doc.setLineWidth(0.12);
            doc.rect(curX, rowY, colW, effCellH, "S");

            // Markers (badges)
            let mx = curX + 2;
            (c.markers ?? []).forEach(m => {
              const mk2 = MARKERS[m];
              if (!mk2) return;
              const [mr,mg,mb] = hx(mk2.color);
              doc.setFillColor(mr,mg,mb);
              doc.rect(mx, rowY + 2.2, 8, 3.8, "F");
              doc.setFont("helvetica","bold"); doc.setFontSize(4); doc.setTextColor(0,0,0);
              doc.text(mk2.short, mx + 4, rowY + 5, { align:"center" });
              mx += 10;
            });

            // Cell content text
            const hasMarkers  = (c.markers ?? []).length > 0;
            const textY       = rowY + (hasMarkers ? 9.5 : 3.5);
            const textH       = effCellH - (hasMarkers ? 10 : 4);
            const maxTxtLines = Math.max(1, Math.floor(textH / 5.8));
            doc.setFont("helvetica","normal"); doc.setFontSize(5.5); doc.setTextColor(130, 178, 210);
            const wrappedText = doc.splitTextToSize(c.content || "", colW - 4.5);
            doc.text(wrappedText.slice(0, maxTxtLines), curX + 2.5, textY + 4);

            curX += colW;
          });

          rowY += effCellH;
        });

        /* Closing grid lines */
        doc.setDrawColor(0, 55, 90);
        doc.setLineWidth(0.15);
        doc.line(BX + CW, BY, BX + CW, rowY);   // right edge
        doc.line(BX, rowY, BX + CW, rowY);        // bottom edge
      });

      doc.save("service-blueprint-a3.pdf");
    } catch (err) {
      console.error("PDF failed:", err);
      alert("PDF generation failed — check console for details.");
    } finally {
      setPdfBusy(false);
    }
  };

  /* ── Style helpers ─────────────────────────────────────────────────────── */
  const iBtn = (col) => ({
    background:"none", border:"none", color: col, cursor:"pointer",
    fontSize: 11, width: 17, height: 17, padding: 0, borderRadius: 2,
    display:"flex", alignItems:"center", justifyContent:"center",
  });
  const inpSt = (bc) => ({
    background: "rgba(255,255,255,.05)",
    border: `1px solid ${bc}55`,
    color: "#e0ecf8", padding: "3px 6px", borderRadius: 3,
    fontSize: 11, outline: "none", width: "100%",
    fontFamily: "'IBM Plex Mono', monospace",
  });

  const markerCounts = Object.values(cells).reduce((acc, c) => {
    c.markers?.forEach(m => { acc[m] = (acc[m] || 0) + 1; });
    return acc;
  }, {});

  /* ════════════════════════════ RENDER ════════════════════════════════════ */
  return (
    <div style={{
      height:"100vh", background:"#040b16", color:"#ccdbe8",
      fontFamily:"'IBM Plex Mono',monospace",
      display:"flex", flexDirection:"column", overflow:"hidden",
    }}>
      {/* ── Fonts + global CSS ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=Barlow+Condensed:wght@500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        textarea,input{font-family:'IBM Plex Mono',monospace}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:#020810}
        ::-webkit-scrollbar-thumb{background:#152840;border-radius:3px}
        ::-webkit-scrollbar-corner{background:#020810}
        .bp-shw:hover .bp-acts{opacity:1!important}
        .bp-mrkbtn{transition:all .15s}
        .bp-mrkbtn:hover{transform:scale(1.1)}
        .bp-addbtn{opacity:.3;transition:opacity .2s}
        .bp-addbtn:hover{opacity:1}
        @keyframes bp-vl{0%,100%{opacity:.78}50%{opacity:.35}}
        .bp-vl{animation:bp-vl 3.5s ease-in-out infinite}
        .bp-inbtn{transition:all .2s}
        .bp-inbtn:hover{background:rgba(0,200,255,.12)!important;border-color:rgba(0,200,255,.6)!important}
      `}</style>

      {/* ── NEW STAGE DIALOG ── */}
      {newStage && (
        <div style={{ position:"fixed", inset:0, background:"rgba(2,8,18,.85)", zIndex:999, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ background:"#07131f", border:"1px solid rgba(0,200,255,.25)", borderRadius:8, padding:28, width:360, boxShadow:"0 20px 60px rgba(0,0,0,.6)" }}>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:18, color:"#fff", letterSpacing:2, marginBottom:6 }}>NEW STAGE</div>
            <div style={{ fontSize:10, color:"#2a5070", marginBottom:18, letterSpacing:.5 }}>A new column will be added to the right of the blueprint.</div>
            <input
              autoFocus
              placeholder="Stage name…"
              value={newStageName}
              onChange={e => setNewStageName(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter") createStage(newStageName);
                if (e.key === "Escape") { setNewStage(false); setNewStageName(""); }
              }}
              style={{ ...inpSt("#00c8ff"), fontSize:13, padding:"8px 10px", marginBottom:16, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:600, letterSpacing:.5 }}
            />
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={() => createStage(newStageName)} style={{
                flex:1, background:"rgba(0,200,255,.1)", border:"1px solid rgba(0,200,255,.45)",
                color:"#00c8ff", padding:"7px 0", borderRadius:4, cursor:"pointer",
                fontSize:11, letterSpacing:1.2, fontFamily:"'IBM Plex Mono',monospace",
              }}>CREATE STAGE</button>
              <button onClick={() => { setNewStage(false); setNewStageName(""); }} style={{
                background:"none", border:"1px solid rgba(255,255,255,.1)",
                color:"#4a6a82", padding:"7px 14px", borderRadius:4, cursor:"pointer",
                fontSize:11, fontFamily:"'IBM Plex Mono',monospace",
              }}>CANCEL</button>
            </div>
          </div>
        </div>
      )}

      {/* ── TOOLBAR ── */}
      <header style={{
        padding:"9px 18px", borderBottom:"1px solid rgba(0,200,255,.1)",
        background:"rgba(3,10,22,.96)", display:"flex", alignItems:"center",
        gap:10, flexShrink:0, zIndex:200,
      }}>
        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:9, flexShrink:0 }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="3" fill="rgba(0,200,255,.1)"/>
            <rect x="2.5" y="2.5" width="23" height="23" rx="2" stroke="#00c8ff" strokeWidth=".9"/>
            <line x1="2.5" y1="10" x2="25.5" y2="10" stroke="#00c8ff" strokeWidth=".6"/>
            <line x1="2.5" y1="17" x2="25.5" y2="17" stroke="#00c8ff" strokeWidth=".6" strokeDasharray="2 1.5"/>
            <line x1="10" y1="2.5" x2="10" y2="25.5" stroke="#00c8ff" strokeWidth=".6"/>
            <line x1="18" y1="2.5" x2="18" y2="25.5" stroke="#00c8ff" strokeWidth=".6"/>
          </svg>
          <div>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, color:"#fff", letterSpacing:2.5 }}>BLUEPRINT STUDIO</div>
            <div style={{ fontSize:8, color:"#2a5070", letterSpacing:3 }}>{PROJECT_NAME.toUpperCase()}</div>
          </div>
        </div>

        {/* Marker legend */}
        <div style={{ display:"flex", gap:11, alignItems:"center", marginLeft:4 }}>
          {Object.entries(MARKERS).map(([k, v]) => (
            <div key={k} style={{ display:"flex", alignItems:"center", gap:4 }}>
              <div style={{ background:v.color, color:"#000", width:20, height:14, borderRadius:3, display:"flex", alignItems:"center", justifyContent:"center", fontSize:7, fontWeight:"bold" }}>{v.short}</div>
              <span style={{ fontSize:9, color:"#3a6080" }}>{v.label}</span>
              {markerCounts[k] > 0 && <span style={{ fontSize:8, color:v.color, opacity:.75 }}>×{markerCounts[k]}</span>}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display:"flex", gap:7, marginLeft:"auto", alignItems:"center" }}>
          <button className="bp-inbtn" onClick={() => setNewStage(true)} style={{
            background:"rgba(0,200,255,.08)", border:"1px solid rgba(0,200,255,.38)",
            color:"#00c8ff", padding:"5px 14px", borderRadius:4, cursor:"pointer",
            fontSize:10, letterSpacing:1, fontFamily:"'IBM Plex Mono',monospace",
          }}>+ STAGE</button>

          <button className="bp-inbtn" onClick={exportJSON} style={{
            background:"none", border:"1px solid rgba(0,200,255,.22)", color:"#3a7090",
            padding:"5px 12px", borderRadius:4, cursor:"pointer",
            fontSize:10, letterSpacing:1, fontFamily:"'IBM Plex Mono',monospace",
          }}>↓ JSON</button>

          <button onClick={exportPDF} disabled={pdfBusy} style={{
            background: pdfBusy ? "rgba(255,160,0,.06)" : "rgba(255,160,0,.09)",
            border: `1px solid ${pdfBusy ? "rgba(255,160,0,.18)" : "rgba(255,160,0,.42)"}`,
            color: pdfBusy ? "#604020" : "#ffab40",
            padding:"5px 14px", borderRadius:4,
            cursor: pdfBusy ? "wait" : "pointer",
            fontSize:10, letterSpacing:1, fontFamily:"'IBM Plex Mono',monospace",
            transition:"all .2s",
          }}>{pdfBusy ? "⏳  GENERATING…" : "⬜  A3 PDF"}</button>
        </div>
      </header>

      {/* ── SCROLL CONTAINER ── */}
      <div style={{ flex:1, overflow:"auto" }}>
        <div style={{ minWidth: totalWidth, display:"flex", flexDirection:"column" }}>

          {/* ── STICKY STAGE / BRANCH HEADER ── */}
          <div style={{
            position:"sticky", top:0, zIndex:50, display:"flex",
            background:"#030a16", borderBottom:"1px solid rgba(0,200,255,.12)",
            flexShrink:0,
          }}>
            {/* Corner cell */}
            <div style={{
              width:200, flexShrink:0,
              position:"sticky", left:0, zIndex:60,
              background:"#030a16",
              borderRight:"1px solid rgba(0,200,255,.2)",
              padding:"10px 14px 6px",
              display:"flex", flexDirection:"column", justifyContent:"space-between",
              minHeight: STAGE_H + BRANCH_H,
            }}>
              <span style={{ fontSize:8, color:"#152840", letterSpacing:2, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:600 }}>SWIM LANE / STAGE</span>
              <span style={{ fontSize:7.5, color:"#0d2035", letterSpacing:1 }}>branches →</span>
            </div>

            {/* Stage headers */}
            <div style={{ display:"flex", flex:1 }}>
              {stages.map((st, si) => {
                const stageW = st.branches.length * BRANCH_W;
                return (
                  <div key={st.id} className="bp-shw" style={{
                    width:stageW, flexShrink:0,
                    borderRight:"1px solid rgba(0,200,255,.08)",
                    display:"flex", flexDirection:"column",
                  }}>
                    {/* Stage name row */}
                    <div style={{ height:STAGE_H, padding:"6px 10px", display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        <span style={{ fontSize:8, color:"#152840", fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1 }}>
                          STAGE {String(si + 1).padStart(2,"0")}
                        </span>
                        <div className="bp-acts" style={{ display:"flex", gap:3, opacity:0, transition:"opacity .2s" }}>
                          <button onClick={() => setEditStage(st.id)} style={iBtn("#00c8ff")} title="Rename stage">✎</button>
                          <button onClick={() => addBranch(st.id)}    style={iBtn("#69f0ae")} title="Add branch path ⑂">⑂</button>
                          <button onClick={() => delStage(st.id)}     style={iBtn("#ff4757")} title="Delete stage">✕</button>
                        </div>
                      </div>
                      {editStage === st.id
                        ? <input autoFocus defaultValue={st.name}
                            onBlur={e => { renStage(st.id, e.target.value); setEditStage(null); }}
                            onKeyDown={e => { if(["Enter","Escape"].includes(e.key)) e.target.blur(); }}
                            style={{ ...inpSt("#00c8ff"), fontFamily:"'Barlow Condensed',sans-serif", fontWeight:600, fontSize:13 }} />
                        : <div onClick={() => setEditStage(st.id)} style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:600, fontSize:14, color:"#a8c8e0", cursor:"text", letterSpacing:.5 }}>
                            {st.name}
                          </div>
                      }
                    </div>

                    {/* Branch sub-header row */}
                    <div style={{ display:"flex", height:BRANCH_H, borderTop:"1px solid rgba(0,200,255,.07)" }}>
                      {st.branches.map((br, bi) => {
                        const ebKey = `${st.id}|${br.id}`;
                        return (
                          <div key={br.id} className="bp-shw" style={{
                            width:BRANCH_W, flexShrink:0,
                            borderRight: bi < st.branches.length - 1 ? "1px solid rgba(0,200,255,.05)" : "none",
                            borderTop: `2px solid ${br.color}`,
                            padding:"4px 8px",
                            display:"flex", alignItems:"center", justifyContent:"space-between",
                          }}>
                            {editBranch === ebKey
                              ? <input autoFocus defaultValue={br.name}
                                  style={{ ...inpSt(br.color), fontSize:10 }}
                                  onBlur={e => { renBranch(st.id, br.id, e.target.value); setEditBranch(null); }}
                                  onKeyDown={e => { if(["Enter","Escape"].includes(e.key)) e.target.blur(); }} />
                              : <div onClick={() => setEditBranch(ebKey)} style={{
                                  fontSize:10, color: st.branches.length > 1 ? br.color : "#2a4a62",
                                  cursor:"text", letterSpacing:.3,
                                  fontFamily:"'Barlow Condensed',sans-serif",
                                  fontWeight: st.branches.length > 1 ? 600 : 400,
                                  flex:1,
                                }}>{br.name}</div>
                            }
                            {st.branches.length > 1 && (
                              <div className="bp-acts" style={{ opacity:0, transition:"opacity .2s", flexShrink:0, marginLeft:4 }}>
                                <button onClick={() => delBranch(st.id, br.id)} style={iBtn("#ff4757")} title="Delete branch">✕</button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add stage button */}
            <div style={{ width:44, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <button className="bp-addbtn" onClick={() => setNewStage(true)} title="Add stage" style={{
                background:"none", border:"1px solid rgba(0,200,255,.28)", color:"#00c8ff",
                width:26, height:26, borderRadius:4, cursor:"pointer", fontSize:17, lineHeight:1,
              }}>+</button>
            </div>
          </div>

          {/* ── GRID (lane rows only) ── */}
          <div style={{ display:"grid", gridTemplateColumns:`200px repeat(${totalBranches}, ${BRANCH_W}px) 44px` }}>

            {lanes.map((lane, li) => {
              const ls       = getLs(lane.type);
              const prevLane = lanes[li - 1];
              const showVis  = li > 0 && prevLane?.id === visAfter;

              return [
                /* visibility line */
                ...(showVis ? [(
                  <div key={`vis-${lane.id}`} style={{
                    gridColumn:"1 / -1", height:VIS_H, position:"relative",
                    background:"rgba(0,200,255,.02)", display:"flex", alignItems:"center",
                  }}>
                    <div style={{ position:"absolute", left:0, right:0, top:"50%", borderTop:"1.5px dashed rgba(0,200,255,.48)" }} />
                    <div className="bp-vl" style={{
                      position:"absolute", left:"50%", transform:"translateX(-50%)",
                      background:"#040b16", border:"1px solid rgba(0,200,255,.42)",
                      color:"#00d2ff", padding:"2px 16px",
                      fontSize:8, letterSpacing:3.5,
                      fontFamily:"'Barlow Condensed',sans-serif", fontWeight:600,
                      whiteSpace:"nowrap", userSelect:"none",
                    }}>── LINE OF VISIBILITY ──</div>
                  </div>
                )] : []),

                /* lane header */
                <div key={`lh-${lane.id}`} className="bp-shw" style={{
                  position:"sticky", left:0, zIndex:30,
                  background:"#030a16",
                  borderLeft:`3px solid ${ls.accent}`,
                  borderRight:"1px solid rgba(0,200,255,.18)",
                  borderBottom:"1px solid rgba(0,200,255,.07)",
                  padding:"10px 11px",
                  display:"flex", flexDirection:"column", justifyContent:"space-between",
                  minHeight:CELL_H, gap:8,
                }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                    <div style={{ width:6, height:6, borderRadius:"50%", background:ls.accent, boxShadow:`0 0 7px ${ls.accent}`, marginTop:3, flexShrink:0 }} />
                    <div className="bp-acts" style={{ display:"flex", gap:3, opacity:0, transition:"opacity .2s" }}>
                      <button onClick={() => setEditLane(lane.id)} style={iBtn(ls.accent)} title="Rename lane">✎</button>
                      <button onClick={() => delLane(lane.id)}     style={iBtn("#ff4757")} title="Delete lane">✕</button>
                    </div>
                  </div>
                  {editLane === lane.id
                    ? <input autoFocus defaultValue={lane.name}
                        onBlur={e => { renLane(lane.id, e.target.value); setEditLane(null); }}
                        onKeyDown={e => { if(["Enter","Escape"].includes(e.key)) e.target.blur(); }}
                        style={inpSt(ls.accent)} />
                    : <div onClick={() => setEditLane(lane.id)} style={{
                        fontFamily:"'Barlow Condensed',sans-serif", fontWeight:600,
                        fontSize:12, color:ls.accent, cursor:"text",
                        letterSpacing:.6, textTransform:"uppercase", lineHeight:1.35,
                      }}>{lane.name}</div>
                  }
                  <div
                    onClick={() => setVisAfter(visAfter === lane.id ? null : lane.id)}
                    title={visAfter === lane.id ? "Remove visibility line" : "Place line of visibility after this lane"}
                    style={{
                      fontSize:7.5, cursor:"pointer", userSelect:"none", letterSpacing:.8,
                      color: visAfter === lane.id ? "#00d2ff" : "#152840",
                      fontFamily:"'Barlow Condensed',sans-serif", fontWeight:500,
                      transition:"color .2s",
                    }}>
                    {visAfter === lane.id ? "◉ VIS LINE BELOW ▾" : "○ set vis line here"}
                  </div>
                </div>,

                /* branch × stage cells */
                ...stages.flatMap(st =>
                  st.branches.map((br, bi) => {
                    const ck      = `${lane.id}-${st.id}-${br.id}`;
                    const c       = getCell(lane.id, st.id, br.id);
                    const editing = editCell === ck;
                    const hovered = hover === ck;
                    const isLast  = bi === st.branches.length - 1;
                    const multiBranch = st.branches.length > 1;
                    return (
                      <div key={`c-${ck}`}
                        onMouseEnter={() => setHover(ck)}
                        onMouseLeave={() => setHover(null)}
                        style={{
                          background: hovered ? ls.glow : "#040b16",
                          borderRight: isLast ? "1px solid rgba(0,200,255,.09)" : "1px solid rgba(0,200,255,.04)",
                          borderBottom:"1px solid rgba(0,200,255,.06)",
                          padding:8, minHeight:CELL_H,
                          display:"flex", flexDirection:"column", gap:5,
                          transition:"background .15s", position:"relative",
                        }}>
                        {/* branch colour top strip */}
                        {multiBranch && (
                          <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:br.color, opacity:.55 }} />
                        )}

                        {/* marker badges */}
                        {c.markers.length > 0 && (
                          <div style={{ display:"flex", gap:3, flexWrap:"wrap", paddingTop: multiBranch ? 5 : 0 }}>
                            {c.markers.map(m => (
                              <span key={m} style={{ background:MARKERS[m].color, color:"#000", fontSize:7, fontWeight:"bold", padding:"1px 5px", borderRadius:3, letterSpacing:.3 }}>
                                {MARKERS[m].short}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* content */}
                        {editing
                          ? <textarea autoFocus defaultValue={c.content} rows={5}
                              onBlur={e => { setContent(lane.id, st.id, br.id, e.target.value); setEditCell(null); }}
                              onKeyDown={e => { if(e.key==="Escape") e.target.blur(); }}
                              style={{ flex:1, background:"rgba(0,210,255,.05)", border:"1px solid rgba(0,210,255,.28)", color:"#d8ecf8", fontSize:10, lineHeight:1.55, padding:"5px 6px", borderRadius:3, resize:"none", outline:"none", width:"100%", minHeight:75 }} />
                          : <div onClick={() => setEditCell(ck)} style={{
                              flex:1, fontSize:10, lineHeight:1.55, cursor:"text",
                              whiteSpace:"pre-wrap", minHeight:52,
                              color: c.content ? "#7a9fb8" : (hovered ? "#253a4a" : "transparent"),
                            }}>
                              {c.content || (hovered ? "click to edit…" : "·")}
                            </div>
                        }

                        {/* marker toggle buttons (hover / edit) */}
                        {(hovered || editing) && (
                          <div style={{ display:"flex", gap:3, marginTop:"auto", paddingTop:2 }}>
                            {Object.entries(MARKERS).map(([k, v]) => {
                              const active = c.markers.includes(k);
                              return (
                                <button key={k} className="bp-mrkbtn"
                                  onClick={() => toggleMarker(lane.id, st.id, br.id, k)}
                                  title={`Toggle ${v.label}`}
                                  style={{
                                    background: active ? v.color : "transparent",
                                    border:`1px solid ${v.color}`,
                                    color: active ? "#000" : v.color,
                                    width:28, height:17, borderRadius:3,
                                    cursor:"pointer", fontSize:7.5, fontWeight:"bold",
                                    letterSpacing:.3, padding:0, opacity: active ? 1 : .5,
                                  }}>
                                  {v.short}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })
                ),

                /* empty right cell */
                <div key={`em-${lane.id}`} style={{ background:"#030810", borderBottom:"1px solid rgba(0,200,255,.06)" }} />,
              ];
            })}

            {/* ── Add lane row ── */}
            <div style={{
              position:"sticky", left:0, zIndex:30,
              background:"#030a16",
              borderRight:"1px solid rgba(0,200,255,.18)",
              borderTop:"1px solid rgba(0,200,255,.1)",
              padding:"7px 10px", display:"flex", alignItems:"center",
            }}>
              <button className="bp-addbtn" onClick={addLane} style={{
                background:"none", border:"1px dashed rgba(0,200,255,.22)",
                color:"#00d2ff", padding:"4px 8px", borderRadius:4,
                cursor:"pointer", fontSize:9.5, width:"100%",
                fontFamily:"'IBM Plex Mono',monospace",
              }}>+ add lane</button>
            </div>
            <div style={{ gridColumn:"2 / -1", background:"#030810", borderTop:"1px solid rgba(0,200,255,.07)" }} />
          </div>
        </div>
      </div>

      {/* ── STATUS BAR ── */}
      <div style={{
        padding:"4px 18px", borderTop:"1px solid rgba(0,200,255,.07)",
        background:"#020810", display:"flex", gap:16, flexShrink:0, alignItems:"center",
      }}>
        {[["stages",stages.length],["lanes",lanes.length],["branches",totalBranches-stages.length]].map(([l,c]) => (
          <span key={l} style={{ fontSize:8.5, color:"#1e3a55", letterSpacing:1 }}>
            {String(l).toUpperCase()}: <span style={{ color:"#2a5070" }}>{c}</span>
          </span>
        ))}
        {Object.entries(markerCounts).map(([k,c]) => (
          <span key={k} style={{ fontSize:8.5, color:MARKERS[k]?.color, opacity:.55, letterSpacing:.5 }}>
            {MARKERS[k]?.short} ×{c}
          </span>
        ))}
        <span style={{ marginLeft:"auto", fontSize:8, color:"#0e2030", letterSpacing:.8 }}>
          CLICK TO EDIT · HOVER FOR MARKERS · ⑂ TO BRANCH · + STAGE · ⬜ A3 PDF
        </span>
      </div>
    </div>
  );
}
