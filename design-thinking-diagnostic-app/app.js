/* ================================================================
   Design Thinking Diagnostic — app.js
   Vanilla JS phase-token state machine, adapted from the Why
   Workbook's app.js (why-workshop-app-v2). No framework, no build step.

   Phases: 0, 1a, 1b, 1c, 2a, 2b, 3, 4  →  close
   ================================================================ */

const LENSES = [
  { key: 'Desirable', desc: 'does anyone actually want this?' },
  { key: 'Viable',    desc: 'does it work commercially?' },
  { key: 'Feasible',  desc: 'can it actually be built?' }
];

const LENS_STATES = [
  { key: 'present', label: 'Present', desc: 'genuinely there, shaped the outcome' },
  { key: 'thin',    label: 'Thin',    desc: "technically covered, didn't shape anything" },
  { key: 'skipped', label: 'Skipped', desc: 'never really happened' }
];
// Priority for "which lens got skipped" in Phase 1c — most-absent first.
const LENS_STATE_PRIORITY = { skipped: 0, thin: 1, present: 2 };

const MINDSETS = [
  { key: 'Empathy first',       desc: "the user's reality over your own assumptions" },
  { key: 'Systems thinking',    desc: 'how one decision ripples through the whole product' },
  { key: 'Bias to action',      desc: 'shipping the test over debating the theory' },
  { key: 'Embrace ambiguity',   desc: 'moving before every answer is certain' },
  { key: 'Iterate always',      desc: 'treating version one as a draft, not the answer' },
  { key: 'Communicate intent',  desc: 'showing your reasoning, not just your output' }
];

const CAUSES = [
  { key: 'skill',          label: 'A skill I haven’t built yet',        desc: 'more practice or reps would close this' },
  { key: 'organisational', label: 'A system that won’t let me use it',  desc: "the org doesn't make room for it, however good I get" },
  { key: 'relationship',   label: 'A sponsor I never had',                  desc: "the right person's backing wasn't there going in" }
];

// Deterministic routing table — lens/mindset gap → Design-Led: Practitioner
// module. Claude writes the connective sentence; the routing itself is
// computed here so it stays reliable regardless of model output.
// Note: Viable→Module 04, Systems thinking→Module 07, Bias to action→Module 12,
// and Communicate intent→Module 03 are sourced directly from the content-writer's
// worked examples (Content Copy §6.1/§8.3). Desirable, Feasible, and the
// remaining three mindsets are this builder's inferred mapping — flagged in
// the build notes for a content-writer pass.
const MODULE_ROUTES = {
  lens: {
    Desirable: { n: '03', name: 'Analysis' },
    Viable:    { n: '04', name: 'Strategy' },
    Feasible:  { n: '07', name: 'Service Design' }
  },
  mindset: {
    'Empathy first':      { n: '03', name: 'Analysis' },
    'Systems thinking':   { n: '07', name: 'Service Design' },
    'Bias to action':     { n: '12', name: 'Judgment in Practice' },
    'Embrace ambiguity':  { n: '12', name: 'Judgment in Practice' },
    'Iterate always':     { n: '12', name: 'Judgment in Practice' },
    'Communicate intent': { n: '03', name: 'Analysis' }
  },
  fallback: { n: '01', name: 'Foundations' }
};

const CRISIS_KEYWORDS = [
  'suicide','suicidal','kill myself','end it all','self-harm','self harm',
  'hurt myself','want to die','not worth living','no point going on'
];

const PHASE_LABELS = {
  '1a': 'Phase 1 of 4 · The Three Lenses',
  '1b': 'Phase 1 of 4 · The Three Lenses',
  '1c': 'Phase 1 of 4 · The Three Lenses',
  '2a': 'Phase 2 of 4 · The Six Mindsets',
  '2b': 'Phase 2 of 4 · The Six Mindsets',
  '3':  'Phase 3 of 4 · Where Influence Breaks Down',
  '4':  'Phase 4 of 4 · Design Influence Profile'
  // '0' intentionally has no label — the Reframe is a cold open, not a counted phase.
};

// ─── State ──────────────────────────────────────────────────────────

let STATE = {
  participant: { name: '', session_id: '' },
  workbook: {
    project_label: '', project_raw: '',
    lens_scores: {},           // { Desirable: 'present'|'thin'|'skipped', ... }
    skip_signal: '',           // Phase 1c free-text signal (first pass only)
    mindset: '',               // Phase 2a selected chip
    cause_attribution: '',     // 'skill' | 'organisational' | 'relationship' — Design Principle 2
    evidence_quote: '',        // participant's own words, Phase 3 turn 1
    cost_answer: '',           // Phase 3 turn 4 answer, feeds Phase 4 paraphrase
    profile_tag: '',
    profile_sentence: '',
    routed_module: null,       // { n, name, reason }
    next_question: ''
  },
  session: {
    phase: '0', distress_flag: false, completed: false,
    p3_answers: 0, profile_ready: false
  },
  messages: []
};

let typingEl = null;
let isSending = false;
let phaseOnResponse = () => {};
let phaseHistory = [];
// True while the cause-attribution component is being re-shown as a
// revision checkpoint after Phase 3 (see enterCauseConfirm) rather than
// its normal first-pass appearance after Phase 2b.
let causeConfirmMode = false;

// ─── Persistence ────────────────────────────────────────────────────
// Mirrors the Why Workbook's pattern: save on every state-changing action,
// offer to resume on return. One deliberate extension beyond the Why
// Workbook's literal behaviour: a *completed* session is not cleared from
// storage, so a reload after finishing can render the static Profile card
// immediately (Motion Spec §3.5's "resumes onto an already-completed Close
// screen" case) instead of losing the artifact and returning to Welcome.

const STORAGE_KEY = 'dtd_session_v1';
let TRANSCRIPT = [];
let REPLAYING = false;
let saveTimer = null;

function saveState() {
  if (REPLAYING) return;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(function () {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        participant: STATE.participant,
        workbook: STATE.workbook,
        session: STATE.session,
        messages: STATE.messages,
        transcript: TRANSCRIPT,
        phaseHistory: phaseHistory
      }));
    } catch (e) {
      // Private browsing / storage disabled / quota exceeded — degrade silently.
    }
  }, 250);
}

function loadSavedSession() {
  try {
    var raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    var data = JSON.parse(raw);
    if (!data || !data.participant || !data.participant.name) return null;
    return data;
  } catch (e) {
    return null;
  }
}

function clearSavedSession() {
  try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
}

// ─── Utils ──────────────────────────────────────────────────────────

function uuid() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
}

function escHtml(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// Truncates to a short, honest fragment of the participant's own words —
// cut at a word boundary, never mid-word. Used for the Phase 1a project
// label and the Phase 4 reveal's quoted citation (Inspiration doc §4.3).
function truncateQuote(text, maxLen) {
  maxLen = maxLen || 70;
  const t = (text || '').trim().replace(/\s+/g, ' ');
  if (t.length <= maxLen) return t;
  const cut = t.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > 20 ? cut.slice(0, lastSpace) : cut).replace(/[,;:.\-]+$/, '') + '…';
}

function lastUserMessage() {
  const m = [...STATE.messages].reverse().find(m => m.role === 'user');
  return m ? m.content : '';
}

function scrollChatToBottom() {
  const main = document.getElementById('ww-main');
  if (main) main.scrollTo({ top: main.scrollHeight, behavior: 'smooth' });
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// Short pause-then-act helper, per Motion Spec §3.4 ("rooms entered
// deliberately"). Skipped entirely during transcript replay so resuming a
// session doesn't re-run pacing the participant already lived through.
function afterPause(ms, fn) {
  if (REPLAYING) { fn(); return; }
  setTimeout(fn, ms);
}

// ─── Chat rendering ─────────────────────────────────────────────────

function renderMarkdown(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^---$/gm, '<hr style="border:none;border-top:1px solid var(--sand);margin:4px 0;">');
}

function addCoachMessage(text) {
  if (!text || !text.trim()) return null;
  const log = document.getElementById('chat-log');
  const div = document.createElement('div');
  div.className = 'msg msg-coach';
  const paragraphs = text.trim().split(/\n\n+/).map(p =>
    '<p>' + renderMarkdown(p.replace(/\n/g, '<br>')) + '</p>'
  ).join('');
  div.innerHTML = '<div class="msg-coach-inner">' + paragraphs + '</div>';
  log.appendChild(div);
  scrollChatToBottom();
  if (!REPLAYING) { TRANSCRIPT.push({ role: 'coach', text: text }); saveState(); }
  return div;
}

function addUserMessage(text) {
  const log = document.getElementById('chat-log');
  const div = document.createElement('div');
  div.className = 'msg msg-user';
  div.innerHTML = '<div class="msg-user-inner">' + escHtml(text) + '</div>';
  log.appendChild(div);
  scrollChatToBottom();
  if (!REPLAYING) { TRANSCRIPT.push({ role: 'user', text: text }); saveState(); }
}

function addSystemMessage(text) {
  const log = document.getElementById('chat-log');
  const div = document.createElement('div');
  div.className = 'msg msg-system';
  div.textContent = text;
  log.appendChild(div);
  scrollChatToBottom();
  if (!REPLAYING) { TRANSCRIPT.push({ role: 'system', text: text }); saveState(); }
}

function showTyping() {
  if (typingEl) return;
  const log = document.getElementById('chat-log');
  typingEl = document.createElement('div');
  typingEl.className = 'msg msg-typing';
  typingEl.innerHTML = '<div class="typing-dots" role="status"><span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span><span class="sr-only">Claude is typing…</span></div>';
  log.appendChild(typingEl);
  scrollChatToBottom();
}

function hideTyping() {
  if (typingEl) { typingEl.remove(); typingEl = null; }
}

// ─── Phase label ────────────────────────────────────────────────────

function updatePhaseLabel(phase) {
  const el = document.getElementById('phase-label');
  if (!el) return;
  el.textContent = PHASE_LABELS[phase] || '';
  // Move focus here on every phase change so keyboard/screen-reader users
  // land somewhere stable instead of silently dropping to <body> once the
  // previous phase's UI is hidden (WCAG 2.4.3). The header is always
  // visible, so this never causes a disruptive scroll.
  el.focus({ preventScroll: true });
}

// ─── Support panel ──────────────────────────────────────────────────

function setSupportPanel(open) {
  const panel = document.getElementById('support-panel');
  const btn = document.getElementById('btn-support');
  if (!panel || !btn) return;
  panel.hidden = !open;
  btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  if (open) panel.querySelector('.support-close').focus();
}

function toggleSupportPanel() {
  const panel = document.getElementById('support-panel');
  setSupportPanel(!!panel && panel.hidden);
}

// ─── Continue button ────────────────────────────────────────────────

function showContinue(label, onClickFn) {
  const bar = document.getElementById('continue-bar');
  const btn = document.getElementById('btn-continue');
  btn.textContent = label;
  btn.onclick = onClickFn;
  bar.style.display = 'block';
}

function hideContinue() {
  document.getElementById('continue-bar').style.display = 'none';
}

function showInputRow() {
  document.getElementById('input-row').style.display = 'flex';
}

function hideInputRow() {
  document.getElementById('input-row').style.display = 'none';
}

function setSendDisabled(disabled) {
  isSending = disabled;
  const btn = document.getElementById('btn-send');
  if (btn) btn.disabled = disabled;
}

function hideAllSpecialComponents() {
  document.getElementById('lens-scorer').style.display = 'none';
  document.getElementById('mindset-selector').style.display = 'none';
  document.getElementById('cause-attribution').style.display = 'none';
}

// ─── API call ────────────────────────────────────────────────────────

let pendingOnSuccess = null;

async function callAPI(userText, onSuccess, extra) {
  pendingOnSuccess = onSuccess || null;
  if (userText) {
    STATE.messages.push({ role: 'user', content: userText });
    if (STATE.messages.length > 10) STATE.messages = STATE.messages.slice(-10);
  } else {
    const last = STATE.messages[STATE.messages.length - 1];
    if (!last || last.role === 'assistant') {
      STATE.messages.push({ role: 'user', content: `[Phase ${STATE.session.phase} — begin now]` });
      if (STATE.messages.length > 10) STATE.messages = STATE.messages.slice(-10);
    }
  }

  showTyping();
  setSendDisabled(true);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.assign({
        phase: STATE.session.phase,
        name: STATE.participant.name,
        messages: STATE.messages,
        workbook: STATE.workbook,
        distress_flag: STATE.session.distress_flag,
        turn: STATE.session.p3_answers
      }, extra || {}))
      ,
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const data = await res.json();
    hideTyping();
    setSendDisabled(false);

    if (data.distress) { STATE.session.distress_flag = true; saveState(); }

    const content = data.content || '';
    addCoachMessage(content);
    if (content) {
      STATE.messages.push({ role: 'assistant', content });
      if (STATE.messages.length > 10) STATE.messages = STATE.messages.slice(-10);
    }

    pendingOnSuccess = null;
    if (onSuccess) onSuccess(data);
    return data;
  } catch (err) {
    clearTimeout(timeoutId);
    hideTyping();
    setSendDisabled(false);
    const isTimeout = err.name === 'AbortError';
    showAPIError(isTimeout);
    return null;
  }
}

function showAPIError(isTimeout) {
  const log = document.getElementById('chat-log');
  const div = document.createElement('div');
  div.className = 'msg msg-coach';
  const msg = isTimeout
    ? "Claude's taking a little longer than usual. Try again?"
    : "That didn't send. Nothing you said is lost — try again.";
  const distressNote = STATE.session.distress_flag
    ? `<p style="margin-top:10px;">If things feel like a lot right now: <strong>Lifeline (Australia)</strong> — <a href="tel:131114">13 11 14</a>, free &amp; confidential, 24/7.</p>`
    : '';
  div.innerHTML = `<div class="msg-coach-inner">
    <p>${escHtml(msg)}</p>
    ${distressNote}
    <button onclick="retryAPI(this)" style="font-family:Inter;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;padding:8px 16px;background:none;border:1px solid var(--sand);cursor:pointer;margin-top:8px;">Try again</button>
  </div>`;
  log.appendChild(div);
  scrollChatToBottom();
}

function retryAPI(btn) {
  btn.closest('.msg').remove();
  const lastIdx = [...STATE.messages].reverse().findIndex(m => m.role === 'user');
  let retryText = null;
  if (lastIdx !== -1) {
    const idx = STATE.messages.length - 1 - lastIdx;
    retryText = STATE.messages[idx].content;
    STATE.messages.splice(idx, 1);
  }
  const onSuccess = pendingOnSuccess;
  callAPI(retryText, onSuccess);
}

// ─── Send message ────────────────────────────────────────────────────

function sendMessage() {
  if (isSending) return;
  const input = document.getElementById('user-input');
  const text = input.value.trim();
  if (!text) {
    input.classList.add('shake');
    setTimeout(() => input.classList.remove('shake'), 400);
    const errorEl = document.getElementById('input-error');
    if (errorEl) {
      errorEl.textContent = '';
      setTimeout(() => { errorEl.textContent = 'Please type an answer before sending.'; }, 20);
    }
    return;
  }

  if (CRISIS_KEYWORDS.some(kw => text.toLowerCase().includes(kw))) {
    STATE.session.distress_flag = true;
  }

  input.value = '';
  input.style.height = 'auto';
  addUserMessage(text);

  // Phase 1a: capture the participant's own words as the running project
  // label the moment they answer — this is "their own words," not Claude's
  // paraphrase, per Design Principle 1 and the Inspiration doc's citation
  // recommendation (§4.3).
  if (STATE.session.phase === '1a') {
    STATE.workbook.project_raw = text;
    STATE.workbook.project_label = truncateQuote(text, 60);
    saveState();
  }

  // Phase 3: capture the evidence quote (turn 1) and the cost answer (turn 4).
  if (STATE.session.phase === '3') {
    if (STATE.session.p3_answers === 0) {
      STATE.workbook.evidence_quote = truncateQuote(text, 90);
    }
  }

  callAPI(text, (data) => {
    if (STATE.session.phase === '3') {
      STATE.session.p3_answers += 1;
      if (STATE.session.p3_answers === 4) STATE.workbook.cost_answer = text;
      saveState();
    }
    if (!STATE.session.distress_flag) phaseOnResponse(data);
  });
}

// ─── Phase machine ───────────────────────────────────────────────────

const PHASE_ENTRY = {
  '1a': enterPhase1a,
  '1b': enterPhase1b,
  '1c': enterPhase1c,
  '2a': enterPhase2a,
  '2b': enterPhase2b,
  '3':  enterPhase3,
  '4':  enterPhase4,
  'close': enterClose
};

// Divider copy shown at each phase entry — short, specific labels per Motion
// Spec §3.4, not a literal repeat of the header's "Phase N of 4" text at
// every sub-phase (mirrors the Why Workbook's own mix of full and short
// system-message labels across its 2a/2b/2c sub-phases).
const PHASE_DIVIDERS = {
  '0':  '— Reframe —',
  '1a': '— Phase 1 of 4: The Three Lenses —',
  '1b': '— Score the project —',
  '1c': '— Naming what got skipped —',
  '2a': '— Phase 2 of 4: The Six Mindsets —',
  '2b': '— Naming the cause —',
  '3':  '— Phase 3 of 4: Where Influence Breaks Down —',
  '4':  '— Phase 4 of 4: Design Influence Profile —'
};

// Central transition: pause → divider → pause → phase entry, per Motion
// Spec §3.4. Guarded against REPLAYING via afterPause() so a resumed
// session doesn't re-run the choreography.
function transitionTo(newPhase) {
  hideContinue();
  hideInputRow();
  hideAllSpecialComponents();
  phaseOnResponse = () => {};

  afterPause(400, () => {
    if (PHASE_DIVIDERS[newPhase]) addSystemMessage(PHASE_DIVIDERS[newPhase]);
    afterPause(400, () => {
      STATE.session.phase = newPhase;
      updatePhaseLabel(newPhase);
      saveState();
      if (PHASE_ENTRY[newPhase]) PHASE_ENTRY[newPhase]();
    });
  });
}

// ─── Phase history + back navigation ────────────────────────────────

function pushHistory(phase) {
  if (phaseHistory[phaseHistory.length - 1] !== phase) phaseHistory.push(phase);
  updateBackButton();
  saveState();
}

function updateBackButton() {
  const btn = document.getElementById('btn-back');
  if (btn) btn.style.display = phaseHistory.length > 1 ? 'inline-flex' : 'none';
}

function goBack() {
  if (phaseHistory.length < 2) return;
  phaseHistory.pop();
  const target = phaseHistory[phaseHistory.length - 1];
  hideContinue();
  hideInputRow();
  hideAllSpecialComponents();
  phaseOnResponse = () => {};
  STATE.session.phase = target;
  updatePhaseLabel(target);
  saveState();
  // Re-enter the phase's UI without replaying the pacing/dividers — back
  // navigation revisits a special component, it doesn't re-run coaching.
  if (target === '1b') { document.getElementById('lens-scorer').style.display = 'block'; buildLensScorer(); }
  else if (target === '2a') { document.getElementById('mindset-selector').style.display = 'block'; buildMindsetSelector(); }
  else if (target === '2b') {
    causeConfirmMode = false;
    document.getElementById('btn-cause-done').textContent = "That's the cause →";
    document.getElementById('cause-attribution').style.display = 'block';
    buildCauseAttribution();
    showInputRow();
  }
  else { showInputRow(); }
  updateBackButton();
  scrollChatToBottom();
}

// ─── Phase 0 — Reframe ────────────────────────────────────────────────

function startPhase0() {
  pushHistory('0');
  showInputRow();
  addSystemMessage(PHASE_DIVIDERS['0']);

  callAPI(null, () => {
    showContinue('Continue →', () => transitionTo('1a'));
    phaseOnResponse = () => showContinue('Continue →', () => transitionTo('1a'));
  });
}

// ─── Phase 1a — The Three Lenses (Discovery) ──────────────────────────

function enterPhase1a() {
  pushHistory('1a');
  showInputRow();
  STATE.messages = [];

  callAPI(null, () => {
    const goNext = () => transitionTo('1b');
    // Do NOT show Continue here — this fires on Claude's opening question,
    // before the participant has named a project. Continue only appears
    // once phaseOnResponse fires, i.e. after they've actually answered.
    phaseOnResponse = () => showContinue('Continue to scoring →', goNext);
  });
}

// ─── Phase 1b — Lens scorer (special component) ───────────────────────

function enterPhase1b() {
  pushHistory('1b');
  hideInputRow();
  STATE.messages = [];

  callAPI(null, () => {
    document.getElementById('lens-scorer').style.display = 'block';
    document.getElementById('lens-instruction').textContent =
      `For each lens, was it actually there in ${STATE.workbook.project_label || 'the project'} — or did it get skipped?`;
    buildLensScorer();
    setTimeout(() => {
      document.getElementById('lens-scorer').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  });
}

function buildLensScorer() {
  const container = document.getElementById('lens-items');
  container.innerHTML = '';
  LENSES.forEach(lens => {
    const item = document.createElement('div');
    item.className = 'lens-item';
    item.dataset.lens = lens.key;
    item.innerHTML = `
      <p class="lens-name">${escHtml(lens.key)}</p>
      <p class="lens-name-desc">${escHtml(lens.desc)}</p>
      <div class="lens-states" role="group" aria-label="${escHtml(lens.key)} — how present was it?"></div>
    `;
    const statesEl = item.querySelector('.lens-states');
    LENS_STATES.forEach(state => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'lens-state-btn';
      btn.dataset.state = state.key;
      btn.setAttribute('aria-pressed', STATE.workbook.lens_scores[lens.key] === state.key ? 'true' : 'false');
      if (STATE.workbook.lens_scores[lens.key] === state.key) btn.classList.add('is-selected');
      btn.innerHTML = `<span class="lens-btn-label">${escHtml(state.label)}</span><span class="lens-btn-desc">${escHtml(state.desc)}</span>`;
      btn.addEventListener('click', () => handleLensStateClick(lens.key, state.key, item));
      statesEl.appendChild(btn);
    });
    container.appendChild(item);
  });
  checkLensDone();
}

function handleLensStateClick(lensKey, stateKey, item) {
  item.querySelectorAll('.lens-state-btn').forEach(b => {
    b.classList.remove('is-selected');
    b.setAttribute('aria-pressed', 'false');
  });
  const btn = item.querySelector(`.lens-state-btn[data-state="${stateKey}"]`);
  btn.classList.add('is-selected');
  btn.setAttribute('aria-pressed', 'true');
  STATE.workbook.lens_scores[lensKey] = stateKey;
  checkLensDone();
  saveState();
}

function checkLensDone() {
  const allDone = LENSES.every(l => STATE.workbook.lens_scores[l.key]);
  document.getElementById('btn-lens-done').disabled = !allDone;
}

function handleLensDone() {
  transitionTo('1c');
}

// ─── Phase 1c — Skip attribution (Discovery → Meaning) ────────────────

function pickSkippedLens() {
  const scored = LENSES
    .map(l => ({ key: l.key, state: STATE.workbook.lens_scores[l.key] || 'present' }))
    .sort((a, b) => LENS_STATE_PRIORITY[a.state] - LENS_STATE_PRIORITY[b.state]);
  return scored[0];
}

function enterPhase1c() {
  pushHistory('1c');
  showInputRow();
  STATE.messages = [];

  const picked = pickSkippedLens();
  const stateLabel = (LENS_STATES.find(s => s.key === picked.state) || {}).label || picked.state;

  callAPI(null, () => {
    const goNext = () => transitionTo('2a');
    // Same fix as enterPhase1a: Continue must not appear until the
    // participant has actually answered who skipped the lens.
    phaseOnResponse = (data) => {
      STATE.workbook.skip_signal = lastUserMessage();
      saveState();
      showContinue('Continue →', goNext);
    };
  }, { lens: picked.key, lens_state: stateLabel });
}

// ─── Phase 2a — The Six Mindsets (Discovery) ──────────────────────────

function enterPhase2a() {
  pushHistory('2a');
  hideInputRow();
  STATE.messages = [];

  callAPI(null, () => {
    document.getElementById('mindset-selector').style.display = 'block';
    buildMindsetSelector();
    setTimeout(() => {
      document.getElementById('mindset-selector').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  });
}

function buildMindsetSelector() {
  const container = document.getElementById('mindset-chips');
  container.innerHTML = '';
  MINDSETS.forEach(m => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'mindset-chip';
    chip.textContent = m.key;
    chip.dataset.mindset = m.key;
    chip.setAttribute('aria-pressed', STATE.workbook.mindset === m.key ? 'true' : 'false');
    if (STATE.workbook.mindset === m.key) chip.classList.add('is-selected');
    chip.addEventListener('click', () => handleMindsetClick(chip, m.key));
    container.appendChild(chip);
  });
  document.getElementById('btn-mindset-done').disabled = !STATE.workbook.mindset;
}

function handleMindsetClick(chip, key) {
  document.querySelectorAll('.mindset-chip').forEach(c => {
    c.classList.remove('is-selected');
    c.setAttribute('aria-pressed', 'false');
  });
  chip.classList.add('is-selected');
  chip.setAttribute('aria-pressed', 'true');
  STATE.workbook.mindset = key;
  document.getElementById('btn-mindset-done').disabled = false;
  saveState();
}

function handleMindsetDone() {
  transitionTo('2b');
}

// ─── Phase 2b — Name the cause (Meaning) — the load-bearing phase ─────

function enterPhase2b() {
  pushHistory('2b');
  showInputRow();
  STATE.messages = [];

  callAPI(null, () => {
    phaseOnResponse = () => {
      hideInputRow();
      document.getElementById('cause-attribution').style.display = 'block';
      buildCauseAttribution();
      setTimeout(() => {
        document.getElementById('cause-attribution').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
    };
  });
}

function buildCauseAttribution() {
  const container = document.getElementById('cause-options');
  container.innerHTML = '';
  CAUSES.forEach(c => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'lens-state-btn';
    btn.dataset.cause = c.key;
    btn.setAttribute('aria-pressed', STATE.workbook.cause_attribution === c.key ? 'true' : 'false');
    if (STATE.workbook.cause_attribution === c.key) btn.classList.add('is-selected');
    btn.innerHTML = `<span class="lens-btn-label">${escHtml(c.label)}</span><span class="lens-btn-desc">${escHtml(c.desc)}</span>`;
    btn.addEventListener('click', () => handleCauseClick(btn, c.key));
    container.appendChild(btn);
  });
  document.getElementById('btn-cause-done').disabled = !STATE.workbook.cause_attribution;
}

function handleCauseClick(btn, key) {
  document.querySelectorAll('#cause-options .lens-state-btn').forEach(b => {
    b.classList.remove('is-selected', 'confirm-pulse');
    b.setAttribute('aria-pressed', 'false');
  });
  btn.classList.add('is-selected');
  btn.setAttribute('aria-pressed', 'true');
  // Confirm-pulse — this is the one selection in the whole diagnostic that
  // must feel like a recorded decision, not a browsing state (Motion Spec §3.3).
  requestAnimationFrame(() => btn.classList.add('confirm-pulse'));
  // Design Principle 2's literal test: this write IS the data contract —
  // STATE.workbook.cause_attribution is set here, on click, never inferred
  // from the chat transcript.
  STATE.workbook.cause_attribution = key;
  document.getElementById('btn-cause-done').disabled = false;
  saveState();
}

function handleCauseDone() {
  if (causeConfirmMode) {
    causeConfirmMode = false;
    document.getElementById('cause-attribution').style.display = 'none';
    document.getElementById('btn-cause-done').textContent = "That's the cause →";
    transitionTo('4');
  } else {
    transitionTo('3');
  }
}

// ─── Phase 3 — Where Influence Breaks Down (Meaning → Action) ─────────
// Deliberately no special component (Design Principle 6 / Design Spec §3.7).
// Four sequential turns, tracked via STATE.session.p3_answers (0–4).

function enterPhase3() {
  pushHistory('3');
  showInputRow();
  STATE.messages = [];
  STATE.session.p3_answers = 0;
  saveState();

  callAPI(null, () => {
    phaseOnResponse = () => {
      if (STATE.session.p3_answers >= 4) {
        hideInputRow();
        enterCauseConfirm();
      }
      // Turns 1–3: the next question is already delivered inline by Claude;
      // no additional UI action needed, input row stays open.
    };
  });
}

// ─── Cause confirmation (revision checkpoint) ──────────────────────────
// Design Principle 2 only does its real job if a Phase 2b answer given
// before any evidence existed can still be corrected once Phase 3's
// evidence is in front of the participant — the strategy doc's own test
// for Persona 2.2 (Dinesh) depends on this. Reuses the same
// cause-attribution component from 2b, pre-selected to the current value,
// genuinely revisable rather than a one-shot lock.
function enterCauseConfirm() {
  causeConfirmMode = true;
  addSystemMessage('— Before your profile —');
  addCoachMessage("One more check before I put this together: does that still feel like the right frame, now that you've walked through the actual moment — or would you change it?");
  document.getElementById('cause-attribution').style.display = 'block';
  buildCauseAttribution();
  document.getElementById('btn-cause-done').textContent = "That's still it →";
  setTimeout(() => {
    document.getElementById('cause-attribution').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 80);
}

// ─── Phase 4 — Design Influence Profile (Integration) ─────────────────

function enterPhase4() {
  pushHistory('4');
  hideInputRow();
  STATE.messages = [];

  callAPI(null, (data) => {
    showContinue('See my Design Influence Profile →', () => finishDiagnostic());
  });
}

function computeRoutedModule() {
  const picked = pickSkippedLens();
  let route = null;
  if (picked && picked.state !== 'present' && MODULE_ROUTES.lens[picked.key]) {
    route = MODULE_ROUTES.lens[picked.key];
  } else if (STATE.workbook.mindset && MODULE_ROUTES.mindset[STATE.workbook.mindset]) {
    route = MODULE_ROUTES.mindset[STATE.workbook.mindset];
  } else {
    route = MODULE_ROUTES.fallback;
  }
  return route;
}

// Second, dedicated API call: request a structured JSON payload (tag,
// sentence, next question) rather than a chat bubble. Kept separate from
// callAPI() because this response isn't rendered as conversation.
async function generateProfile() {
  const route = computeRoutedModule();
  STATE.workbook.routed_module = route;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phase: 'profile',
        name: STATE.participant.name,
        messages: STATE.messages,
        workbook: STATE.workbook,
        distress_flag: STATE.session.distress_flag,
        routed_module: route
      }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    const data = await res.json();
    let raw = (data.content || '').trim();
    raw = raw.replace(/^```(json)?/i, '').replace(/```$/, '').trim();
    let parsed = null;
    try { parsed = JSON.parse(raw); }
    catch (e) {
      const m = raw.match(/\{[\s\S]*\}/);
      if (m) { try { parsed = JSON.parse(m[0]); } catch (e2) {} }
    }
    if (parsed) {
      STATE.workbook.profile_tag = parsed.tag || fallbackTag();
      STATE.workbook.profile_sentence = parsed.sentence || fallbackSentence();
      STATE.workbook.next_question = parsed.next_question || '';
    } else {
      throw new Error('unparseable profile response');
    }
  } catch (e) {
    // Fallback (including timeout/abort): a reasonable, deterministic default
    // so the reveal never renders empty even if the model or network fails
    // at the one moment this product has been building toward.
    clearTimeout(timeoutId);
    STATE.workbook.profile_tag = STATE.workbook.profile_tag || fallbackTag();
    STATE.workbook.profile_sentence = STATE.workbook.profile_sentence || fallbackSentence();
  }
  saveState();
}

function fallbackTag() {
  const c = STATE.workbook.cause_attribution;
  if (c === 'organisational') return 'The Downstream Designer';
  if (c === 'relationship') return 'The Unsponsored Operator';
  return 'The Undersold Practitioner';
}

function fallbackSentence() {
  const project = STATE.workbook.project_label || 'the project you brought in';
  return `A specific pattern showed up in ${project} — worth taking into your next conversation about scope.`;
}

async function finishDiagnostic() {
  hideContinue();
  STATE.session.completed = true;
  STATE.session.profile_ready = false; // becomes true only once the fetch resolves
  await generateProfile();
  STATE.session.profile_ready = true;
  saveState();
  transitionToClose();
}

// Close doesn't go through the paced transitionTo() — it's a hard screen
// cut per the Motion Spec §1 ("no new screen-transition animation"), same
// as Welcome → Diagnostic.
function transitionToClose() {
  STATE.session.phase = 'close';
  saveState();
  enterClose();
}

// ─── Close screen ────────────────────────────────────────────────────

function buildD2MBridgeText() {
  const route = STATE.workbook.routed_module || MODULE_ROUTES.fallback;
  const project = STATE.workbook.project_label || 'the project you brought in';
  const cause = STATE.workbook.cause_attribution;
  let reason = 'this is where the gap you named gets addressed directly';
  if (cause === 'organisational') reason = "this is where you learn to get into the room before the decision is already made";
  else if (cause === 'relationship') reason = 'this is where you build the sponsorship you were missing going in';
  else if (cause === 'skill') reason = "this is where you build the specific capability you're missing";
  return `Module ${route.n} — ${escHtml(route.name)} is where ${reason} — the exact thing ${escHtml(project)} ran into.`;
}

function enterClose(opts) {
  const instant = !!(opts && opts.instant) || !!STATE.session.__resumedToClose;

  const evidenceEl = document.getElementById('pr-evidence');
  const citationEl = document.getElementById('pr-citation');
  const tagTextEl = document.getElementById('pr-tag-text');
  const cardEl = document.getElementById('profile-reveal');

  evidenceEl.textContent = STATE.workbook.profile_sentence || fallbackSentence();
  citationEl.textContent = STATE.workbook.evidence_quote ? `— "${STATE.workbook.evidence_quote}"` : '';
  tagTextEl.textContent = STATE.workbook.profile_tag || fallbackTag();

  const route = STATE.workbook.routed_module || computeRoutedModule();
  document.getElementById('d2m-bridge-text').innerHTML = buildD2MBridgeText();
  const cta = document.getElementById('d2m-bridge-cta');
  cta.textContent = '';
  cta.innerHTML = `Start with Module ${route.n} — ${escHtml(route.name)} <span>→</span>`;

  const nqWrap = document.getElementById('pr-next-question');
  const nqText = document.getElementById('pr-next-question-text');
  if (STATE.workbook.next_question) {
    nqText.textContent = STATE.workbook.next_question;
    nqWrap.style.display = 'block';
  } else {
    nqWrap.style.display = 'none';
  }

  document.getElementById('ec-offer').textContent =
    `I'll send you this profile, plus the syllabus for Module ${route.n}, as a PDF to keep.`;
  document.getElementById('ec-name').value = STATE.participant.name;

  showScreen('screen-close');

  const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (instant || reducedMotion) {
    setupUnderlinePath(true);
    cardEl.classList.add('is-revealed');
    return;
  }

  // Play the reveal exactly once, per Motion Spec §3.5. Evidence + citation
  // fade via msgIn (CSS handles this through .animate-in), tag fades flat
  // (opacity only, no translateY — it's a verdict, not a conversational
  // turn), then the underline stroke draws once.
  setupUnderlinePath(false);
  cardEl.classList.add('animate-in');
  cardEl.classList.add('is-revealed');

  setTimeout(() => {
    drawUnderlineStroke();
  }, 1000); // tag fade begins ~700ms in the spec's absolute timeline; the
            // stroke draw is timed relative to the tag becoming visible —
            // 300ms after tag-fade starts (700ms) lands here at 1000ms,
            // consistent with the spec's T=1000ms mark.
}

function setupUnderlinePath(instant) {
  const path = document.getElementById('pr-tag-path');
  if (!path) return;
  let len = 300;
  try { len = path.getTotalLength(); } catch (e) {}
  if (instant) {
    path.style.strokeDasharray = 'none';
    path.style.strokeDashoffset = '0';
  } else {
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = len;
  }
}

function drawUnderlineStroke() {
  const path = document.getElementById('pr-tag-path');
  if (!path) return;
  path.style.transition = 'stroke-dashoffset 700ms cubic-bezier(0.45, 0, 0.15, 1)';
  path.style.strokeDashoffset = '0';
}

// ─── Email capture ───────────────────────────────────────────────────

async function handleSubscribe() {
  const name = document.getElementById('ec-name').value.trim();
  const email = document.getElementById('ec-email').value.trim();
  const errorEl = document.getElementById('ec-error');

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errorEl.style.display = 'block';
    errorEl.textContent = 'Please enter a valid email address.';
    const emailInput = document.getElementById('ec-email');
    emailInput.setAttribute('aria-invalid', 'true');
    emailInput.focus();
    return;
  }
  errorEl.style.display = 'none';
  document.getElementById('ec-email').setAttribute('aria-invalid', 'false');

  const btn = document.getElementById('btn-subscribe');
  btn.disabled = true;
  btn.textContent = 'Sending…';

  try {
    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, workbook: STATE.workbook })
    });
    if (res.ok) {
      document.getElementById('email-capture').style.display = 'none';
      document.getElementById('ec-success').style.display = 'block';
    } else {
      btn.disabled = false;
      btn.textContent = 'Send me the PDF';
      errorEl.textContent = "That didn't send. Your profile isn't lost — try again, or screenshot the card above for now.";
      errorEl.style.display = 'block';
    }
  } catch {
    btn.disabled = false;
    btn.textContent = 'Send me the PDF';
    errorEl.textContent = "That didn't send. Your profile isn't lost — try again, or screenshot the card above for now.";
    errorEl.style.display = 'block';
  }
}

// ─── Welcome screen ──────────────────────────────────────────────────

function initWelcome() {
  const nameInput = document.getElementById('participant-name');
  const startBtn = document.getElementById('btn-start');

  nameInput.addEventListener('input', () => {
    startBtn.disabled = nameInput.value.trim().length === 0;
  });

  nameInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !startBtn.disabled) startBtn.click();
  });

  startBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    if (!name) return;
    STATE.participant.name = name;
    STATE.participant.session_id = uuid();
    initDiagnostic(false);
  });

  const saved = loadSavedSession();

  // Deliberate extension beyond the Why Workbook: a completed session
  // renders straight to the (static) Close screen rather than losing the
  // artifact — see the Persistence section note above.
  if (saved && saved.session && saved.session.completed) {
    STATE.participant = saved.participant;
    STATE.workbook = saved.workbook;
    STATE.session = saved.session;
    STATE.session.__resumedToClose = true;
    showScreen('screen-diagnostic'); // needed once so ww-main etc. exist if referenced; immediately overridden
    enterClose({ instant: true });
    return;
  }

  const banner = document.getElementById('resume-banner');
  if (saved && banner) {
    const nameEl = document.getElementById('resume-name');
    if (nameEl) nameEl.textContent = saved.participant.name ? ', ' + saved.participant.name : '';
    banner.hidden = false;

    document.getElementById('btn-resume').addEventListener('click', () => {
      STATE.participant = saved.participant;
      STATE.workbook = saved.workbook;
      STATE.session = saved.session;
      STATE.messages = saved.messages || [];
      TRANSCRIPT = saved.transcript || [];
      phaseHistory = saved.phaseHistory || [];
      initDiagnostic(true);
    });

    document.getElementById('btn-resume-fresh').addEventListener('click', () => {
      clearSavedSession();
      banner.hidden = true;
    });
  }
}

// ─── Diagnostic init ─────────────────────────────────────────────────

function initDiagnostic(isResume) {
  showScreen('screen-diagnostic');

  const userInput = document.getElementById('user-input');
  userInput.addEventListener('input', function () {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 120) + 'px';
  });
  userInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  document.getElementById('btn-support').addEventListener('click', toggleSupportPanel);
  document.getElementById('btn-support-close').addEventListener('click', () => setSupportPanel(false));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') setSupportPanel(false);
  });

  document.getElementById('btn-back').addEventListener('click', goBack);
  document.getElementById('btn-send').addEventListener('click', sendMessage);
  document.getElementById('btn-lens-done').addEventListener('click', handleLensDone);
  document.getElementById('btn-mindset-done').addEventListener('click', handleMindsetDone);
  document.getElementById('btn-cause-done').addEventListener('click', handleCauseDone);

  document.getElementById('btn-subscribe').addEventListener('click', handleSubscribe);
  document.getElementById('btn-skip-subscribe').addEventListener('click', () => {
    document.getElementById('email-capture').style.display = 'none';
  });

  window.addEventListener('beforeunload', e => {
    if (STATE.participant.name && !STATE.session.completed) {
      e.preventDefault();
      e.returnValue = '';
    }
  });

  if (isResume) {
    resumeSession();
  } else {
    startPhase0();
  }
}

function resumeSession() {
  REPLAYING = true;
  TRANSCRIPT.forEach(entry => {
    if (entry.role === 'coach') addCoachMessage(entry.text);
    else if (entry.role === 'user') addUserMessage(entry.text);
    else addSystemMessage(entry.text);
  });
  REPLAYING = false;
  addSystemMessage('— Welcome back — resuming where you left off —');
  updatePhaseLabel(STATE.session.phase);
  updateBackButton();

  // Rebuild whatever special-component UI belongs to the resumed phase.
  hideContinue();
  hideInputRow();
  hideAllSpecialComponents();

  const phase = STATE.session.phase;
  if (phase === '1b') {
    document.getElementById('lens-scorer').style.display = 'block';
    buildLensScorer();
  } else if (phase === '2a') {
    document.getElementById('mindset-selector').style.display = 'block';
    buildMindsetSelector();
  } else if (phase === '2b') {
    showInputRow();
    if (STATE.workbook.cause_attribution || document.querySelectorAll('#cause-options .lens-state-btn').length) {
      document.getElementById('cause-attribution').style.display = 'block';
      buildCauseAttribution();
    }
  } else if (phase === '3' || phase === '1a' || phase === '1c') {
    showInputRow();
    phaseOnResponse = () => {
      if (phase === '3' && STATE.session.p3_answers >= 4) {
        hideInputRow();
        showContinue('Continue →', () => transitionTo('4'));
      }
    };
  } else if (phase === '4') {
    showContinue('See my Design Influence Profile →', () => finishDiagnostic());
  } else if (phase === '0') {
    showInputRow();
    showContinue('Continue →', () => transitionTo('1a'));
  }

  scrollChatToBottom();
}

// ─── Boot ────────────────────────────────────────────────────────────

initWelcome();
