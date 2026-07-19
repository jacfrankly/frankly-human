# Service Blueprint Tool — Full Build Spec
## For Claude Code — Phased Implementation

---

## How to use this spec with Claude Code

Build phase by phase. Do not start Phase 2 until Phase 1 is working and you are happy with it. At the start of each phase, tell Claude Code:

> "I am building a React service blueprint tool. Here is the full spec: [paste this file]. I want to build Phase [N] only. The previous phases are already complete. Here is what I have so far: [paste your current component]."

This keeps the context focused and prevents Claude Code from trying to implement everything at once.

---

## Stack

- **Single-file React component** — default export, no required props
- **Tailwind CSS** — utility classes only, no custom CSS files
- **Google Fonts** — Syne (headings/labels) + DM Sans (body), loaded via @import in a style tag
- **jsPDF** — loaded from CDN for PDF export only (lazy, on demand)
- **No other dependencies** — no routing, no state management library, no backend

---

## Data model (reference for all phases)

```javascript
// Full state shape — implement incrementally across phases
{
  meta: {
    title: "Untitled Blueprint",
    created: ISO8601,
    modified: ISO8601,
    version: "1.0.0",
    // Phase 3 additions:
    business_goals: "",
    scope_notes: "",
    revision_notes: ""
  },
  
  stages: [
    {
      id: uuid,
      name: "Acquisition",
      order: 0,
      branches: [
        {
          id: uuid,
          name: "Main Path",
          colour: "#06b6d4",
          // Phase 3 additions:
          review_status: "draft" // "draft" | "in-review" | "approved" | "locked"
        }
      ]
    }
  ],
  
  lanes: [
    {
      id: uuid,
      name: "Customer",
      order: 0,
      colour: "#eef2ff",
      is_line_of_visibility: false // renders dashed divider AFTER this lane
    }
  ],
  
  steps: [
    {
      id: uuid,
      lane_id: uuid,
      stage_id: uuid,
      branch_id: uuid,
      column: 0, // position within stage/branch/lane
      text: "",
      markers: {
        touchpoint: false,
        fail_point: false,
        moment_of_truth: false
      },
      annotations: {
        external_dependency: false,
        time_sensitive: false,
        compliance: false,
        human_touchpoint: false
      },
      comments: [
        {
          id: uuid,
          author: "You",
          text: "",
          timestamp: ISO8601
        }
      ],
      business_context: "",
      // Phase 3 additions:
      source: "human", // "human" | "agent"
      agent_id: null,  // "service-blueprinter" | "journey-architect" | etc.
      confidence: "high", // "high" | "medium" | "low"
      requires_validation: false,
      // Phase 4 additions:
      review_state: null // null | "approved" | "queried" | "rejected"
    }
  ],
  
  connections: [
    {
      id: uuid,
      source_step_id: uuid,
      target_step_id: uuid,
      type: "triggers", // "triggers" | "handoff" | "approval" | "notify"
      label: ""
    }
  ],
  
  // Phase 3 additions:
  agent_pipeline: [
    {
      agent_id: "service-researcher",
      agent_name: "Service Researcher",
      completed_at: ISO8601,
      handoff_note: ""
    }
  ],
  
  // Phase 4 additions:
  reviews: [
    {
      id: uuid,
      reviewer_name: "",
      submitted_at: ISO8601,
      step_reviews: [
        {
          step_id: uuid,
          state: "approved", // "approved" | "queried" | "rejected"
          comment: ""
        }
      ]
    }
  ]
}
```

---

## Default content

### Lanes (in order)
1. Customer — `#eef2ff` — `is_line_of_visibility: false`
2. Frontstage (IT / Service Desk) — `#f0fdf4` — `is_line_of_visibility: true` ← dashed line renders AFTER this lane
3. Backstage (IT Ops / MDM) — `#fffbeb` — `is_line_of_visibility: false`
4. Support Processes — `#fff1f2` — `is_line_of_visibility: false`
5. Risk (Controls) — `#faf5ff` — `is_line_of_visibility: false`
6. Data (Inputs / Outputs) — `#f0f9ff` — `is_line_of_visibility: false`

### Stages (in order)
Acquisition, Provisioning, Deployment, In-Use / Support, Refresh, Disposal

Each stage starts with one branch: "Main Path" colour `#06b6d4`

### Branch colour palette (cycles in this order)
`#06b6d4` cyan, `#22c55e` green, `#f59e0b` gold, `#ec4899` pink, `#a78bfa` lavender, `#f97316` amber

---

## Phase 1 — Core grid, lanes, stages, steps

**Goal:** A working blueprint grid you can type in and export to JSON. Nothing else.

### Layout

```
┌─────────────────────────────────────────────────┐
│ Toolbar                                         │
├──────────┬──────────────────────────────────────┤
│          │ Stage headers (scrollable →)          │
│ Lane     ├──────────────────────────────────────┤
│ labels   │ Grid (horizontally + vertically       │
│ (fixed)  │ scrollable)                           │
└──────────┴──────────────────────────────────────┘
```

Lane labels are fixed-width (200px), sticky on the left. Stage columns scroll horizontally. The whole grid scrolls vertically.

### Toolbar (Phase 1)

Dark background `#0f172a`. Left to right:
- Blueprint title — editable inline (click to edit, Enter/blur to save)
- Unsaved indicator — a small amber `●` dot next to the title when there are unsaved changes since last file save
- Spacer
- `New` button — creates a blank blueprint (confirmation dialog if unsaved changes exist)
- `Open` button — opens a blueprint JSON file from disk
- `Save` button — saves to the current open file; shows `⌘S` shortcut hint on hover; disabled and greyed out if no file is open yet
- `Save As` button — saves to a new file (always available)
- Divider `|`
- `+ Stage` button — opens modal (see Stage modal below)
- `+ Lane` button — opens modal (see Lane modal below)
- Divider `|`
- `Export JSON` button — copies full state to clipboard
- `Export MD` button — copies markdown to clipboard

### Stage modal

A centred modal overlay (backdrop `rgba(0,0,0,0.4)`). Contains:
- Heading: "New Stage" (or "Rename Stage" when editing)
- Text input with placeholder "Stage name"
- `Cancel` and `Create` buttons (or `Save` when renaming)
- Close on backdrop click or Escape

Same modal used for: `+ Stage` in toolbar, `+` in stage header row, inline rename on click.

### Lane modal

Same pattern as stage modal but labelled "New Lane" / "Rename Lane".

### Stage headers

A sticky row below the toolbar. For each stage:
- Drag handle `⠿` on the left — drag to reorder (see Drag and drop below)
- Stage name — click to open rename modal
- `⑂` button — visible on hover — adds a new branch to this stage
- `+` button — opens stage modal to add a stage after this one
- `✕` button — deletes stage with confirmation if it contains steps

When a stage has multiple branches, the stage header spans all branch sub-columns. Each branch shows:
- A colour stripe across the top (branch colour)
- Branch name — click to rename inline
- `✕` to delete branch — visible on hover

### Lane labels

Fixed 200px column on the left. For each lane:
- Drag handle `⠿` — drag to reorder
- Lane name — click to open rename modal  
- Coloured left border (lane colour)
- Insert above / below — small `+` buttons visible on hover of lane label

Dashed Line of Visibility: after the Frontstage lane, render a full-width dashed horizontal rule `border-top: 2px dashed #94a3b8` with a small "Line of Visibility" label on the left side.

### Step tiles

Each lane × stage × branch intersection holds a horizontal row of step tiles.

**Empty slot:** dashed border `border: 1.5px dashed #cbd5e1`, background `#f8fafc`, click anywhere to create a step at that position.

**Step tile:**
- White background, rounded corners `8px`, subtle shadow
- Left border in branch colour (if stage has multiple branches)
- Step number in top-left — small, muted, auto-numbered within lane/stage/branch
- Editable textarea — click to activate, `Escape` to close, auto-resizes to content
- On hover, reveal:
  - Marker toggles: `◉` Touchpoint (blue `#3b82f6`), `⚠` Fail Point (red `#ef4444`), `★` Moment of Truth (amber `#f59e0b`) — toggle on/off, highlight when active
  - Annotation badges: `🔗` `⏱` `🔒` `👤` — toggle on/off
  - `💬` annotation icon — opens side panel (Phase 2)
  - `✕` delete button

Steps within a stage/branch/lane align in columns — column 1 in one lane aligns vertically with column 1 in all other lanes for the same stage/branch.

### Drag and drop

Implement using HTML5 drag and drop API (no library).

For stages:
- `draggable` attribute on stage header
- `onDragStart`, `onDragOver`, `onDrop` handlers
- Visual drop indicator: a 3px highlighted gap between stage columns where the dragged stage will be inserted, colour `#6366f1`

For lanes:
- Same pattern on lane labels
- Drop indicator: highlighted gap between lane rows

### Export JSON

Copies `JSON.stringify(state, null, 2)` to clipboard. Show a brief "Copied!" toast (1.5s).

### Export Markdown

Format:
```markdown
# [Blueprint title]

## [Stage name]

### [Branch name]

| Step | Customer | Frontstage | Backstage | Support | Risk | Data |
|------|----------|------------|-----------|---------|------|------|
| 1    | Step text [◉][⚠] | ... | | | | |

## Connections
- Step A (Lane, Stage) → [Triggers] → Step B (Lane, Stage)
```

Copies to clipboard. Show "Copied!" toast.

### File management (File System Access API)

The tool uses the browser's [File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API) for open and save. This works in Chrome and Edge (the browsers your team will use on Windows). It does not work in Safari — show a clear warning if the user opens the tool in an unsupported browser.

**State: file handle**

Track a `fileHandle` ref alongside the blueprint state:
```javascript
const fileHandleRef = useRef(null) // null = no file open yet
const [unsavedChanges, setUnsavedChanges] = useState(false)
```

**New blueprint**

```javascript
async function handleNew() {
  if (unsavedChanges) {
    const ok = confirm("You have unsaved changes. Create a new blueprint anyway?")
    if (!ok) return
  }
  fileHandleRef.current = null
  setState(defaultState()) // fresh default content
  setUnsavedChanges(false)
}
```

**Open blueprint**

```javascript
async function handleOpen() {
  const [handle] = await window.showOpenFilePicker({
    types: [{ description: 'Blueprint JSON', accept: { 'application/json': ['.json'] } }]
  })
  const file = await handle.getFile()
  const text = await file.text()
  const loaded = JSON.parse(text)
  fileHandleRef.current = handle
  setState(loaded)
  setUnsavedChanges(false)
}
```

**Save (overwrite current file)**

```javascript
async function handleSave() {
  if (!fileHandleRef.current) return handleSaveAs()
  const writable = await fileHandleRef.current.createWritable()
  await writable.write(JSON.stringify(state, null, 2))
  await writable.close()
  setUnsavedChanges(false)
}
```

Keyboard shortcut: `⌘S` (Mac) / `Ctrl+S` (Windows) triggers Save.

**Save As**

```javascript
async function handleSaveAs() {
  const handle = await window.showSaveFilePicker({
    suggestedName: `${state.meta.title || 'blueprint'}.json`,
    types: [{ description: 'Blueprint JSON', accept: { 'application/json': ['.json'] } }]
  })
  const writable = await handle.createWritable()
  await writable.write(JSON.stringify(state, null, 2))
  await writable.close()
  fileHandleRef.current = handle
  setUnsavedChanges(false)
}
```

**Unsaved changes tracking**

Set `unsavedChanges = true` on every state mutation. Clear it on Save or Save As. Show the amber `●` in the toolbar title when true.

Add a `beforeunload` handler to warn if the user closes the tab with unsaved changes:
```javascript
useEffect(() => {
  const handler = (e) => {
    if (unsavedChanges) { e.preventDefault(); e.returnValue = '' }
  }
  window.addEventListener('beforeunload', handler)
  return () => window.removeEventListener('beforeunload', handler)
}, [unsavedChanges])
```

**localStorage fallback**

Still save to `localStorage` on every change (debounced 500ms) as a crash recovery backup. On mount, if there is no file being opened, check localStorage for a recovery state and offer: "We found an unsaved blueprint from your last session. Recover it?" with Recover / Discard buttons. Do not auto-load — always ask.

**Browser compatibility warning**

On mount, check `typeof window.showOpenFilePicker !== 'undefined'`. If false (Safari, Firefox), show a persistent banner:
> "⚠ File saving is not supported in this browser. Use Chrome or Edge for the full experience. You can still export JSON manually."
In unsupported browsers, hide the Open / Save / Save As buttons and show only Export JSON.

---

## Phase 2 — Annotations panel + connections

**Goal:** Per-step comments and business context. SVG connections between steps.

### Step annotation panel

Slides in from the right (320px wide). Triggered by clicking `💬` on any step.

Contents:
- Header: "Step [number] — [lane name] / [stage name]" + `✕` close button
- **Comments thread** — list of comment entries, each showing:
  - Author name (editable inline, defaults to "You")
  - Timestamp (relative: "2 hours ago")
  - Comment text
  - Delete `✕` button
- **Add comment** — textarea + `Post` button, appends to thread
- **Business context** — labelled "Business goals / context", multiline textarea, saves on blur
- Closes on `✕`, on `Escape`, or on click outside the panel

Steps with at least one comment or business context entry show a filled `💬` badge (not outline) in the tile header — visible at all times (not just on hover).

### Connections

**Connect mode toggle** in toolbar — when active, toolbar shows a connection type dropdown:
- Triggers — blue `#3b82f6`
- Handoff — orange `#f97316`  
- Approval — green `#22c55e`
- Notify — purple `#a855f7`

**Drawing a connection:**
- In connect mode, click a source step (highlights in selected state)
- Click a target step — connection is created
- Escape cancels mid-draw

**Rendering connections:**
- Full-width, full-height SVG overlay, `pointer-events: none` except on connection elements
- Positions computed from step tile DOM refs using `getBoundingClientRect()` relative to the scrollable container
- Curved paths using cubic bezier — control points offset 80px horizontally from source/target
- Directional arrowhead at target end (SVG marker)
- Small label at path midpoint showing connection type name
- Clicking the label deletes the connection

Recompute all path positions on every render (the grid can scroll and reorder).

---

## Phase 3 — Agent attribution + pipeline provenance

**Goal:** Surface which content was produced by agents vs. humans. Make agent reasoning visible to designers.

### Agent attribution on step tiles

Add to step data model: `source`, `agent_id`, `confidence`, `requires_validation` (see data model above).

**Visual treatment:**
- Agent-produced steps: subtle left border indicator in addition to branch colour — a thin `3px` band in `#6366f1` indigo on the far left of the tile
- Low confidence steps (`confidence: "low"`): amber dashed border `border: 1.5px dashed #f59e0b`
- Requires validation (`requires_validation: true`): small amber badge `"!"` in tile header
- Agent badge in tile header: small pill showing agent symbol (e.g. "SB" for service-blueprinter) in muted indigo

**When creating steps manually:** source defaults to `"human"`, no badge shown.

### Pipeline provenance panel

Second tab in the right sidebar (alongside the business context panel from Phase 2). Label: "Pipeline".

Contents:
- A vertical timeline of agents that have contributed to this blueprint
- Each agent entry shows:
  - Agent name + symbol badge
  - Completed timestamp
  - Handoff note (expandable, collapsed by default)
  - Count of steps attributed to this agent
- If no agent data, shows: "No agent pipeline data. Import a blueprint JSON produced by the agent system to see pipeline provenance."

### Import JSON

Add `Import JSON` button to toolbar. Opens a file picker (`.json` files only). Loads state from the file, replacing current state with a confirmation dialog first ("This will replace your current blueprint. Continue?").

This is the mechanism for loading agent-produced blueprint JSON into the tool.

### Context sidebar

Collapsible sidebar on the right edge of the screen. Toggle button in toolbar labelled "Context" (panel icon).

When open (320px wide), shows three sections:
- **Business Goals** — multiline textarea, global to blueprint
- **Scope Notes** — multiline textarea (what's in / out of scope)
- **Revision Notes** — multiline textarea (running notes for this session)

These are global (not per-step). Saved to state on blur.

---

## Phase 4 — Stakeholder review mode + approval workflow

**Goal:** A mode that makes the tool safe and usable for non-technical SME stakeholders.

### Review mode

Activated via URL parameter: `?mode=review` OR a toggle in the toolbar labelled "Review Mode".

When in review mode:
- Toolbar simplifies — shows only: blueprint title (read-only), reviewer name field, "Submit Review" button, and a progress indicator
- No step editing, no drag and drop, no add/delete stages or lanes
- All step tiles are read-only but show a three-state toggle on hover: `✓` Approve (green), `?` Query (amber), `✗` Reject (red)
- Clicking a state opens a small popover for an optional comment on that step
- Reviewer name field at top of screen — required before submitting

**Progress indicator:** "12 / 34 steps reviewed" — updates live as reviewer approves/queries/rejects.

### Submitting a review

"Submit Review" button exports a review JSON:
```json
{
  "reviewer_name": "Name",
  "submitted_at": "ISO8601",
  "blueprint_version": "1.0.0",
  "step_reviews": [
    { "step_id": "uuid", "state": "approved", "comment": "" }
  ]
}
```
Copies to clipboard AND offers a file download. Reviewer sends this file back to the Creative Director.

### Merging a review

In the main toolbar (non-review mode): `Merge Review` button. Opens a file picker for a review JSON. On load:
- Step tiles update to show review state badges from that reviewer
- Multiple reviews can be merged — each shows a different reviewer's badge
- Conflicting states (one reviewer approved, another rejected) highlight the step in amber with both states shown

### Stage approval workflow

Each stage header gets a status pill (visible to Creative Director only, not in review mode):
- `draft` — grey
- `in-review` — blue
- `approved` — green  
- `locked` — with lock icon

Click to cycle through states (with confirmation for `locked`). Locked stages: all steps read-only, visual lock overlay on stage column.

Progress bar in toolbar: "4 / 6 stages approved".

---

### Presentation mode

**Purpose:** A clean, distraction-free view for walking stakeholders through a blueprint live — projected or screenshared. You remain in full control; the audience sees only the map.

**Activation:** A `⊞ Present` button in the main toolbar. Keyboard shortcut `P` when not editing a step. `Escape` to exit.

**What changes in presentation mode:**

- Toolbar hides entirely — replaced by a minimal floating bar at the top:
  - Blueprint title (read-only, centred)
  - A small `● Editing` pill in green — visible at all times so you know you are live
  - `Exit` button (or press `Escape`)
- Agent attribution badges hidden (indigo stripe, confidence indicators, "!" badges)
- Review state badges hidden (approve/query/reject indicators)
- Stage approval status pills hidden
- Pipeline provenance panel closed and inaccessible
- Context sidebar closed and inaccessible
- All step controls (markers, annotation badges, 💬, ✕) hidden on hover — the tile shows only its text and any active markers already toggled on
- Connect mode disabled
- Lane drag handles and stage drag handles hidden

**What stays fully functional in presentation mode:**

- Click any empty slot to create a new step
- Click any step text to edit it inline (textarea activates, `Escape` closes)
- Marker toggles (◉ ⚠ ★) — visible on step hover, so you can toggle them during the session
- Horizontal and vertical scroll
- The full grid remains navigable

**Visual treatment:**

- Grid background lightens slightly to `#ffffff` for maximum screen contrast
- Step tiles gain a slightly more pronounced shadow `0 2px 8px rgba(0,0,0,0.12)` for depth on a projector
- Lane label column stays visible and styled normally
- Stage headers stay visible but without their control buttons

**Editing during a session:**

When you click into a step text area, the floating bar briefly shows `✎ Editing step...` in place of the title, then returns to the title on blur. This gives you a subtle signal visible at the edge of your screen without disrupting the audience view.

**Exiting presentation mode** restores the full toolbar and all panels to their previous state.

---

## Phase 5 — Diff viewer + PDF export

**Goal:** Version comparison and print-ready output.

### Diff viewer

`Compare` button in toolbar opens a modal (full-screen).

Two columns:
- Left: "Version A" — paste JSON area + "Load from file" button
- Right: "Version B" — paste JSON area + "Load from file" button
- "Compare" button between them

On compare:
- Summary line: "3 additions, 1 removal, 2 changes"
- Added stages/lanes/steps: green highlight
- Removed stages/lanes/steps: red highlight with strikethrough
- Modified step text: old text with strikethrough + new text in green
- Added/removed connections: listed separately at bottom

The current tool state can be loaded into either column via a "Use current" button.

### PDF export (A3 landscape)

Load jsPDF from CDN on demand: `https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js`

**Page size:** A3 landscape — 420mm × 297mm

**Pagination:** Stages paginated horizontally. Fit as many stage columns as possible at minimum 38mm each per page.

**Every page contains:**

Header (repeated):
- Blueprint title (left, Syne bold)
- Stage range on this page — e.g. "Stages 1–3 of 6" (centre)
- Export date + page X of Y (right)
- Hairline rule below header

Footer (repeated):
- Marker legend left: `◉` Touchpoint  `⚠` Fail Point  `★` Moment of Truth
- Page X / Y centre
- Section index tab: small coloured rectangle bottom-right, tab colour cycles through branch palette, shows page number

**Crop marks:**
- L-shaped corner marks at all four corners, 4.5mm length, 2.5mm gap from page edge
- Centre registration ticks on all four edges
- Colour `#999999`, line weight 0.25pt

**File marks:**
- Three evenly-spaced notch ticks on the right edge, between crop marks
- 4mm length, `#999999`, 0.25pt

**Continuation arrows:**
- `‹` on left edge where blueprint continues from previous page
- `›` on right edge where blueprint continues to next page

**Theme:** light — dark navy `#0f172a` on white, coloured accents (branch colours, marker colours) retained.

---

## Visual design reference

### Colours
| Element | Colour |
|---------|--------|
| Toolbar background | `#0f172a` |
| Toolbar text | `#f1f5f9` |
| Grid background | `#f8f9fb` |
| Stage cell background | `#f1f5f9` |
| Step tile background | `#ffffff` |
| Step tile shadow | `0 1px 3px rgba(0,0,0,0.08)` |
| Line of Visibility | `#94a3b8` dashed |
| Drop indicator | `#6366f1` |
| Agent attribution stripe | `#6366f1` |
| Modal overlay | `rgba(0,0,0,0.4)` |

### Typography
```css
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700&family=DM+Sans:wght@400;500&display=swap');

/* Headings, stage names, lane names, toolbar labels */
font-family: 'Syne', sans-serif;

/* Step text, comments, body text */
font-family: 'DM Sans', sans-serif;
```

### Responsive toolbar
Controls wrap on narrow viewports — use `flex-wrap: wrap` on toolbar and group related controls.

---

## Do you still need a VS Code extension?

**No — not for this tool.** The React tool replaces the visualiser role entirely. It's richer, shareable, and works for every actor in your workflow.

The VS Code extension was originally proposed as an orchestration shell — a place to run agent pipelines from the terminal and pipe outputs into a JSON file. That work still happens, but it happens in **Claude Code directly**, which already runs in VS Code. You do not need to build a custom extension on top of it.

Your actual workflow becomes:
1. Run agent pipeline in Claude Code (terminal in VS Code) → produces blueprint JSON
2. Import that JSON into the React tool → visualise, edit, present, share for review
3. Export updated JSON back out → feed back to agents if needed

Claude Code is already doing the "extension" job. Build the React tool, skip the extension.

---

## Local development — step by step

Everything below assumes you are on a Mac with Claude Code already installed.

### One-time setup (do this once)

**1. Install Node.js**

Open Terminal and run:
```bash
node --version
```
If you get a version number (`v18` or higher), you already have it. If not:
```bash
brew install node
```
If you don't have Homebrew, install it first: paste the command from `brew.sh` into Terminal.

**2. Install Git**
```bash
git --version
```
If not installed, macOS will prompt you to install Xcode Command Line Tools. Accept and wait.

**3. Create a GitHub account** if you don't have one — `github.com`. You'll need this for deployment.

---

### Creating the project (do this once)

In Terminal:
```bash
# Go to wherever you keep projects
cd ~/Documents

# Create a new Vite + React project
npm create vite@latest blueprint-tool -- --template react
cd blueprint-tool

# Install dependencies
npm install

# Install Tailwind
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Configure Tailwind** — open `tailwind.config.js` and replace its contents with:
```javascript
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: { extend: {} },
  plugins: [],
}
```

Open `src/index.css` and replace its contents with:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Test it works:**
```bash
npm run dev
```
Open `http://localhost:5173` in your browser. You should see the Vite + React default page. If you do, the scaffold is working.

---

### Building with Claude Code

Open the project folder in VS Code:
```bash
code .
```

Open Claude Code in the terminal panel (or a new terminal window). Your workflow per phase:

1. Tell Claude Code which phase you are building and paste the spec
2. Claude Code generates the component — it will create or edit `src/App.jsx`
3. Your browser at `localhost:5173` hot-reloads automatically — you see changes instantly
4. Iterate until the phase checklist is done
5. Move to the next phase

**Keeping versions safe:**

Before starting each new phase, save a copy:
```bash
cp src/App.jsx src/App.phase1.jsx
```
If Phase 2 breaks something, you have Phase 1 to fall back to.

---

### Day-to-day development

Every time you sit down to work:
```bash
cd ~/Documents/blueprint-tool
npm run dev
```
Browser opens at `localhost:5173`. Edit, save, see changes instantly. Stop the server with `Ctrl+C` when done.

That is the entire local development loop. No compilation step, no build required until you are ready to deploy.

---

## Deploying to Azure Static Web Apps — step by step

Do this when Phase 1 is working and you want it accessible to colleagues.

### Part 1 — Push to GitHub

**1. Create a new GitHub repository**

Go to `github.com` → New repository. Name it `blueprint-tool`. Set to Private (important for internal tools). Do not initialise with a README.

**2. Connect your local project to GitHub**

In Terminal, inside your project folder:
```bash
git init
git add .
git commit -m "Initial build"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/blueprint-tool.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username. GitHub will ask for your credentials the first time.

**From now on**, whenever you want to deploy an update:
```bash
git add .
git commit -m "What you changed"
git push
```
Azure will automatically redeploy within 2–3 minutes.

---

### Part 2 — Create the Azure Static Web App

You will need:
- Access to your company's Azure subscription (ask your IT/cloud team for a resource group to deploy into, or use your own Azure account if you have one)
- The GitHub repo from Part 1

**In the Azure portal (`portal.azure.com`):**

1. Click `+ Create a resource`
2. Search for `Static Web App` → Create
3. Fill in:
   - **Subscription** — your company subscription
   - **Resource group** — create new or use existing (ask IT if unsure)
   - **Name** — `blueprint-tool` (or whatever you like — this becomes part of the URL)
   - **Plan type** — Free (sufficient for internal tools)
   - **Region** — choose the closest to your location
   - **Source** — GitHub
   - Click `Sign in with GitHub` and authorise
   - Select your organisation, repository (`blueprint-tool`), and branch (`main`)
   - **Build presets** — Vite
   - **App location** — `/`
   - **Output location** — `dist`

4. Click `Review + Create` → `Create`

Azure now:
- Creates a GitHub Action in your repo (you will see a `.github/workflows/` folder appear)
- Runs the first build automatically
- Deploys your app

After 3–5 minutes, your app is live at a URL like:
`https://wonderful-grass-012345.azurestaticapps.net`

---

### Part 3 — Lock it behind your company login

This is the most important step for an internal tool. It means only people with your company's Microsoft accounts can access it — no separate logins or passwords.

**In the Azure portal, go to your Static Web App → Authentication:**

1. Click `Add identity provider`
2. Choose `Microsoft`
3. Leave defaults — Azure handles the app registration automatically
4. Click `Add`

**In your project, create a new file** at the root level called `staticwebapp.config.json`:
```json
{
  "routes": [
    {
      "route": "/*",
      "allowedRoles": ["authenticated"]
    }
  ],
  "responseOverrides": {
    "401": {
      "redirect": "/.auth/login/aad",
      "statusCode": 302
    }
  }
}
```

Push this file:
```bash
git add staticwebapp.config.json
git commit -m "Add AAD authentication"
git push
```

After the next deploy, anyone hitting your URL who isn't signed in with a company Microsoft account gets redirected to the Microsoft login page automatically. No code, no backend, no user management.

---

### Part 4 — Sharing the review mode URL

For stakeholders who need to do async review (not live walkthrough):

```
https://your-app.azurestaticapps.net?mode=review
```

If you want them to access this without needing a company login (e.g. external stakeholders), you can create an exemption route in `staticwebapp.config.json`:
```json
{
  "routes": [
    {
      "route": "/",
      "allowedRoles": ["authenticated"]
    },
    {
      "route": "/*",
      "allowedRoles": ["anonymous", "authenticated"]
    }
  ]
}
```
This keeps the main tool behind login but allows the review URL to be accessed without authentication. Adjust based on how sensitive your blueprint content is.

---

### Summary — what you need to learn

| Skill | Difficulty | When you need it |
|-------|-----------|-----------------|
| Running `npm run dev` | Very easy | Every build session |
| Pasting component code from Claude Code into `App.jsx` | Easy | Every build session |
| `git add / commit / push` | Easy (3 commands) | Every deployment |
| Azure portal — creating Static Web App | Easy (wizard-driven) | Once |
| Azure Authentication setup | Easy (no code) | Once |
| Editing `staticwebapp.config.json` | Easy | Once, maybe twice |

The only thing you need to genuinely understand is the `git add / commit / push` loop. Everything else is either a wizard or a copy-paste. Claude Code can also run git commands for you if you ask it to.

---

## Claude Code prompting strategy

**Starting a phase:**
> "I am building a React service blueprint tool as a single-file component. Here is the full spec: [paste spec]. I want to implement Phase 1 only. Please build it."

**Iterating within a phase:**
> "The drag and drop reordering for stages is not working correctly — when I drop a stage it jumps to the wrong position. Here is the relevant state and handler code: [paste]. Please fix it."

**Moving to the next phase:**
> "Phase 1 is working. Here is the current component: [paste]. Now I want to add Phase 2 — the annotation panel and SVG connections. Please add these to the existing component without breaking Phase 1."

**When something is too complex:**
> "The SVG connection rendering is producing incorrect positions when the grid is scrolled. Let us isolate just the position calculation logic and fix that before integrating it."

**Tips:**
- Paste the full current component when asking for changes — Claude Code needs the context
- Ask for one thing at a time within a phase
- If a feature is taking many iterations to get right, ask Claude Code to explain the approach before implementing — it surfaces assumptions early
- Keep a working version saved before starting each new phase

---

## Phase delivery checklist

### Phase 1
- [ ] Grid renders with default lanes and stages
- [ ] Steps can be created, edited, and deleted
- [ ] Stages can be added, renamed, reordered, deleted
- [ ] Lanes can be added, renamed, reordered
- [ ] Branch colours render correctly
- [ ] Line of Visibility renders after Frontstage lane
- [ ] Marker toggles work on step tiles
- [ ] Annotation badges work on step tiles
- [ ] New blueprint clears state with confirmation if unsaved changes
- [ ] Open loads a .json file from disk and sets file handle
- [ ] Save overwrites current file (disabled if no file open)
- [ ] Save As prompts for file location and saves
- [ ] ⌘S / Ctrl+S triggers Save
- [ ] Unsaved changes amber dot appears after edits
- [ ] Unsaved changes dot clears after Save / Save As
- [ ] beforeunload warning fires if tab closed with unsaved changes
- [ ] localStorage crash recovery prompt on mount
- [ ] Browser compatibility warning shows in Safari / Firefox
- [ ] Export JSON copies to clipboard
- [ ] Export Markdown copies to clipboard

### Phase 2
- [ ] Annotation panel slides in from right
- [ ] Comments can be added, attributed, and deleted
- [ ] Business context saves correctly
- [ ] Filled 💬 badge shows on steps with content
- [ ] Connect mode toggle works
- [ ] Connections render as curved SVG paths
- [ ] Connections recompute on scroll and reorder
- [ ] Connection labels clickable to delete

### Phase 3
- [ ] Import JSON loads agent-produced blueprints
- [ ] Agent-produced steps show attribution badge
- [ ] Low-confidence steps show amber dashed border
- [ ] Requires-validation steps show "!" badge
- [ ] Pipeline provenance panel shows agent timeline and handoff notes
- [ ] Context sidebar saves business goals, scope, revision notes

### Phase 4
- [ ] Review mode activates via toolbar toggle
- [ ] Toolbar simplifies in review mode
- [ ] Per-step approve/query/reject works
- [ ] Review submission exports correct JSON
- [ ] Merge review imports and renders review states
- [ ] Stage approval status cycles correctly
- [ ] Locked stages are non-editable
- [ ] Presentation mode activates via toolbar button and `P` shortcut
- [ ] Toolbar hides and floating bar appears in presentation mode
- [ ] Agent badges, review states, approval pills all hidden in presentation mode
- [ ] Step editing still works in presentation mode
- [ ] Marker toggles visible on hover in presentation mode
- [ ] `Escape` exits presentation mode and restores full toolbar

### Phase 5
- [ ] Diff viewer loads and compares two JSON blobs
- [ ] Added/removed/changed items highlighted correctly
- [ ] PDF exports to A3 landscape
- [ ] Header and footer repeat on every page
- [ ] Stages paginate correctly
- [ ] Crop marks and file marks render
- [ ] Section index tabs cycle through branch colours

---

## Phase 6 — Azure Blob Storage backend (blueprint library)

**Goal:** A proper multi-user blueprint library stored in Azure. Every blueprint is a JSON blob. Any team member with access can open, edit, and save blueprints from any device. No SharePoint wrangling, no file attachments.

**When to build this:** After Phases 1–4 are working and your team is using the tool regularly with the file-based system. Let real usage pull you toward this rather than building it speculatively. The trigger is when you find yourself saying "can you send me the latest version of that blueprint?" more than twice a week.

---

### Architecture overview

```
React tool (Static Web App)
         ↕ HTTPS
Azure Function App (API layer)
         ↕
Azure Blob Storage (blueprint JSON files)
         ↕
Azure Active Directory (identity — already set up from deployment)
```

Three Azure resources, all in the same resource group as your existing Static Web App.

---

### Azure resources to create

**1. Azure Storage Account**

- In Azure portal: New resource → Storage account
- Name: `blueprintstorage` (or similar — must be globally unique)
- Performance: Standard
- Redundancy: LRS (locally redundant — cheapest, fine for internal tools)
- One container named `blueprints` with private access

**2. Azure Function App**

- New resource → Function App
- Runtime: Node.js 20
- Hosting: Consumption plan (pay per request — effectively free at internal tool scale)
- Connect to the same Storage Account

The Function App is a small API layer between the React tool and Blob Storage. It handles authentication (verifying the user's AAD token) and CRUD operations on blueprints.

---

### API endpoints (4 functions)

**GET /api/blueprints**
Lists all blueprints. Returns an array of metadata objects (id, title, modified, owner).

**GET /api/blueprints/{id}**
Returns the full JSON for a single blueprint.

**PUT /api/blueprints/{id}**
Creates or updates a blueprint. Body is the full blueprint JSON. Returns the saved blueprint with updated `meta.modified`.

**DELETE /api/blueprints/{id}**
Deletes a blueprint. Requires confirmation in the UI before calling.

---

### Function code (ask Claude Code to generate these)

Each function is a small Node.js file. Example for GET list:

```javascript
// api/blueprints/index.js
const { BlobServiceClient } = require('@azure/storage-blob')

module.exports = async function (context, req) {
  const client = BlobServiceClient.fromConnectionString(process.env.STORAGE_CONNECTION_STRING)
  const container = client.getContainerClient('blueprints')
  
  const blueprints = []
  for await (const blob of container.listBlobsFlat()) {
    blueprints.push({
      id: blob.name.replace('.json', ''),
      ...blob.metadata // title, modified stored as blob metadata
    })
  }
  
  context.res = { body: blueprints }
}
```

The connection string lives in Azure Function App → Configuration → Application settings, not in code.

---

### Changes to the React tool (Phase 6 additions)

**Blueprint library homepage**

When the tool loads with no file open, show a library view instead of an empty grid:

```
┌─────────────────────────────────────────────────┐
│ Blueprint Library              [+ New Blueprint] │
├─────────────────────────────────────────────────┤
│ 🗂 IT Onboarding Service       Modified 2 days ago  [Open] [Delete] │
│ 🗂 Hardware Refresh Journey    Modified 1 week ago  [Open] [Delete] │
│ 🗂 Procurement Process v2      Modified 3 weeks ago [Open] [Delete] │
└─────────────────────────────────────────────────┘
```

- Fetches from `GET /api/blueprints` on mount
- Click `Open` or the blueprint name to load it into the editor
- Click `+ New Blueprint` to create a new one (prompts for title first)
- Click the back arrow in the toolbar to return to the library from the editor

**Save behaviour changes**

Replace the File System Access API with API calls:
- Auto-save replaces `Save` — every change is saved to the API after a 2-second debounce
- The unsaved indicator (`●`) still shows during the debounce window
- `Save As` → `Duplicate` — creates a copy with a new name

**Toolbar changes**

- Replace `Open / Save / Save As` with `← Library` (back button) and `Duplicate`
- Blueprint title still editable inline — saves on blur

**Sharing a blueprint**

Because blueprints now have stable IDs in Azure, you can share a direct link:
`https://your-app.azurestaticapps.net?blueprint=abc123`

The tool loads that blueprint directly, skipping the library. Combined with the review mode:
`https://your-app.azurestaticapps.net?blueprint=abc123&mode=review`

This is the link you send to SME stakeholders for async review — they open it, review it, submit. No file attachments.

---

### Multi-team access

By default, all authenticated users in your AAD tenant can see all blueprints. For team isolation (Team A can only see their blueprints), add a `team_id` field to blueprint metadata and filter in the API function. The team ID comes from the user's AAD group membership, which the Function App can read from the token claims.

This is a two-hour addition once the basic API is working.

---

### Phase 6 checklist
- [ ] Azure Storage Account created with `blueprints` container
- [ ] Azure Function App created and connected to storage
- [ ] All 4 API functions deployed and tested
- [ ] React tool shows library homepage on load
- [ ] Library lists blueprints from API
- [ ] Opening a blueprint loads it into the editor
- [ ] Auto-save sends updates to API after 2s debounce
- [ ] Unsaved indicator shows during debounce window
- [ ] Duplicate creates a named copy
- [ ] Back button returns to library
- [ ] Direct link `?blueprint=id` opens blueprint immediately
- [ ] Review mode link `?blueprint=id&mode=review` works end to end
- [ ] Delete blueprint works with confirmation

---

### Claude Code prompts for Phase 6

**For the Azure Functions:**
> "I need to build 4 Azure Functions in Node.js to act as a CRUD API for blueprint JSON files stored in Azure Blob Storage. The functions are: list all blueprints, get one blueprint by ID, save/update a blueprint, delete a blueprint. Use the @azure/storage-blob SDK. Connection string comes from an environment variable called STORAGE_CONNECTION_STRING. Please build all 4 functions."

**For the React tool changes:**
> "I am adding a Phase 6 to my blueprint tool. Here is the current component: [paste]. I need to: 1) Add a library homepage that fetches blueprints from GET /api/blueprints and displays them in a list. 2) Replace the File System API open/save with API calls to /api/blueprints/{id}. 3) Add auto-save with a 2-second debounce. 4) Add a back button to return to the library. Please implement these changes."
