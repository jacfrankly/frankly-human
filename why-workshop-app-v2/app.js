/* ================================================================
   Why Workbook — app.js
   Vanilla JS state machine. No framework, no build step.
   ================================================================ */

const VALUES = [
  'Achievement','Adventure','Authenticity','Belonging','Boldness',
  'Challenge','Compassion','Connection','Courage','Creativity',
  'Curiosity','Equity','Excellence','Expression','Family',
  'Freedom','Growth','Harmony','Honesty','Impact',
  'Independence','Integrity','Joy','Justice','Kindness',
  'Leadership','Learning','Love','Loyalty','Meaning',
  'Nature','Openness','Originality','Play','Purpose',
  'Relationships','Responsibility','Security','Service','Simplicity',
  'Spirituality','Sustainability','Trust','Vitality','Wisdom'
];

const CRISIS_KEYWORDS = [
  'suicide','suicidal','kill myself','end it all','self-harm','self harm',
  'hurt myself','want to die','not worth living','no point going on'
];

const PHASE_LABELS = {
  '1':'Reframe', '2a':'Values', '2b':'Values', '2c':'Values',
  '3a':'Moments of Truth', '3bc':'Moments of Truth',
  '4a':'Why Statement', '4bc':'Why Statement', '4d':'Why Statement'
};

// ─── State ──────────────────────────────────────────────────────────

let STATE = {
  participant: { name: '', session_id: '' },
  workbook: {
    values_raw: [], values_top3: [], emotional_signal: [],
    values_map: {}, actions: {},
    wants_more: '', ripple: '',
    statement_draft: '', next_move: ''
  },
  session: { phase: '1', distress_flag: false, completed: false },
  messages: []
};

let typingEl = null;
let isSending = false;
let phaseOnResponse = () => {};
let phaseHistory = [];

// ─── Persistence ────────────────────────────────────────────────────
// Mirrors the pattern the D2M workbook modules already use: save on every
// state-changing action, offer to resume on return. Without this, closing
// the tab, an accidental back-swipe, or a phone reclaiming a backgrounded
// tab mid-session loses the whole 45-minute flow with no recovery.

const STORAGE_KEY = 'ww_session_v1';
let TRANSCRIPT = [];   // full chat log for visual replay (STATE.messages is capped at 10 for API context)
let REPLAYING = false; // true while replaying a saved transcript, so replay doesn't re-save itself
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
      // Private browsing / storage disabled / quota exceeded — degrade
      // silently rather than breaking the session over a save failure.
    }
  }, 250);
}

function loadSavedSession() {
  try {
    var raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    var data = JSON.parse(raw);
    if (!data || !data.participant || !data.participant.name) return null;
    if (data.session && data.session.completed) return null;
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

function scrollChatToBottom() {
  const main = document.getElementById('ww-main');
  if (main) main.scrollTo({ top: main.scrollHeight, behavior: 'smooth' });
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// ─── Chat rendering ─────────────────────────────────────────────────

function renderMarkdown(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^---$/gm, '<hr style="border:none;border-top:1px solid var(--sand);margin:4px 0;">');
}

function addCoachMessage(text) {
  if (!text || !text.trim()) return;
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
  typingEl.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
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
  const name = PHASE_LABELS[phase];
  el.textContent = name ? `Phase ${phase.charAt(0)} of 4 · ${name}` : '';
}

// ─── Support panel ──────────────────────────────────────────────────
// Always-reachable, static fallback resource — deliberately not dependent
// on the AI response, since that's the one thing that might be unavailable
// at exactly the moment someone needs this.

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

// ─── API call ────────────────────────────────────────────────────────

// Remembers the success handler for the most recent callAPI() invocation so
// retryAPI() can run the *correct* completion logic (e.g. a phase-entry's
// "show Continue button" step) — not just the generic phaseOnResponse, which
// may not have been wired up yet if the very first call in a phase failed.
let pendingOnSuccess = null;

async function callAPI(userText, onSuccess) {
  pendingOnSuccess = onSuccess || null;
  if (userText) {
    STATE.messages.push({ role: 'user', content: userText });
    if (STATE.messages.length > 10) STATE.messages = STATE.messages.slice(-10);
  } else {
    // Phase transitions — inject a clear marker so Claude follows the new phase developer message
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
      body: JSON.stringify({
        phase: STATE.session.phase,
        name: STATE.participant.name,
        messages: STATE.messages,
        workbook: STATE.workbook,
        distress_flag: STATE.session.distress_flag
      }),
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
    // pendingOnSuccess is left set — retryAPI() reads it so a retry runs the
    // same completion logic the original call would have.
    return null;
  }
}

function showAPIError(isTimeout) {
  const log = document.getElementById('chat-log');
  const div = document.createElement('div');
  div.className = 'msg msg-coach';
  const msg = isTimeout ? 'Claude is taking a moment…' : 'Something went wrong.';
  // If distress was flagged, don't let a technical failure be the only thing
  // that shows up right now — surface the static support resource inline,
  // not just via the always-there header link.
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
  // Remove the last user message from state so it doesn't double-up
  const lastIdx = [...STATE.messages].reverse().findIndex(m => m.role === 'user');
  let retryText = null;
  if (lastIdx !== -1) {
    const idx = STATE.messages.length - 1 - lastIdx;
    retryText = STATE.messages[idx].content;
    STATE.messages.splice(idx, 1);
  }
  // Re-run whatever completion logic the failed call would have triggered —
  // for a phase-entry's first call, that's the "show Continue" step, which
  // phaseOnResponse alone doesn't capture until after that step has run once.
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
    return;
  }

  if (CRISIS_KEYWORDS.some(kw => text.toLowerCase().includes(kw))) {
    STATE.session.distress_flag = true;
  }

  input.value = '';
  input.style.height = 'auto';
  addUserMessage(text);

  callAPI(text, () => {
    if (!STATE.session.distress_flag) phaseOnResponse();
  });
}

// ─── Phase machine ───────────────────────────────────────────────────

function transitionTo(newPhase) {
  STATE.session.phase = newPhase;
  updatePhaseLabel(newPhase);
  hideContinue();
  phaseOnResponse = () => {};
  saveState();

  const transitions = {
    '2a': enterPhase2a,
    '2b': enterPhase2b,
    '2c': enterPhase2c,
    '3a': enterPhase3a,
    '3bc': enterPhase3bc,
    '4a': enterPhase4a,
    '4bc': enterPhase4bc,
    '4d': enterPhase4d,
    'close': showClose
  };

  if (transitions[newPhase]) transitions[newPhase]();
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
  restorePhase(phaseHistory[phaseHistory.length - 1]);
}

function restorePhase(phase) {
  STATE.session.phase = phase;
  updatePhaseLabel(phase);
  phaseOnResponse = () => {};

  const continueBtn = document.getElementById('btn-continue');
  continueBtn.style.cssText = '';
  continueBtn.textContent = 'Continue →';

  document.getElementById('values-sort').style.display = 'none';
  document.getElementById('values-map').style.display = 'none';
  document.getElementById('actions-ui').style.display = 'none';
  document.getElementById('why-area').style.display = 'none';

  hideContinue();
  showInputRow();

  switch (phase) {
    case '1': {
      const fn = () => transitionTo('2a');
      showContinue('Continue to Values →', fn);
      phaseOnResponse = () => showContinue('Continue to Values →', fn);
      break;
    }
    case '2a': {
      hideInputRow();
      document.getElementById('values-sort').style.display = 'block';
      buildValuesSort();
      STATE.workbook.values_top3.forEach(val => {
        const chip = document.querySelector(`.value-chip[data-value="${val}"]`);
        if (chip) { chip.dataset.state = 'starred'; chip.setAttribute('aria-pressed', 'true'); }
      });
      STATE.workbook.values_raw.forEach(val => {
        if (STATE.workbook.values_top3.includes(val)) return;
        const chip = document.querySelector(`.value-chip[data-value="${val}"]`);
        if (chip) { chip.dataset.state = 'circled'; chip.setAttribute('aria-pressed', 'mixed'); }
      });
      updateVsCount();
      const any = document.querySelectorAll('.value-chip[data-state="circled"],.value-chip[data-state="starred"]').length;
      document.getElementById('btn-values-done').disabled = (any === 0);
      break;
    }
    case '2b': {
      const fn = () => transitionTo('2c');
      showContinue('Continue to Mapping →', fn);
      phaseOnResponse = () => showContinue('Continue to Mapping →', fn);
      break;
    }
    case '2c': {
      hideInputRow();
      document.getElementById('values-map').style.display = 'block';
      buildValuesMap();
      Object.entries(STATE.workbook.values_map).forEach(([val, state]) => {
        const item = document.querySelector(`.vm-item[data-value="${val}"]`);
        if (!item) return;
        const btn = item.querySelector(`.vm-state-btn[data-state="${state}"]`);
        if (btn) { btn.classList.add(`sel-${state}`); btn.setAttribute('aria-pressed', 'true'); }
      });
      checkAllValuesMapped();
      break;
    }
    case '3a': {
      document.getElementById('actions-ui').style.display = 'block';
      buildActionsUI();
      Object.entries(STATE.workbook.actions).forEach(([val, action]) => {
        const input = document.querySelector(`.action-input[data-value="${val}"]`);
        if (input) input.value = action;
      });
      checkActionsDone();
      break;
    }
    case '3bc': {
      const fn = () => {
        const recentUser = [...STATE.messages].reverse().find(m => m.role === 'user');
        if (recentUser) STATE.workbook.ripple = recentUser.content;
        transitionTo('4a');
      };
      showContinue('Continue to Why Statement →', fn);
      phaseOnResponse = () => showContinue('Continue to Why Statement →', fn);
      break;
    }
    case '4a':
    case '4bc': {
      document.getElementById('why-area').style.display = 'block';
      const ta = document.getElementById('why-textarea');
      ta.value = STATE.workbook.statement_draft || '';
      ta.removeEventListener('input', onStatementInput);
      ta.addEventListener('input', onStatementInput);
      phaseOnResponse = onStatementInput;
      onStatementInput();
      break;
    }
    case '4d': {
      // No UI-only state to rebuild for the closing phase — re-ask the
      // final question rather than leaving the participant on a dead end.
      hideContinue();
      document.getElementById('why-area').style.display = 'none';
      enterPhase4d();
      break;
    }
  }

  updateBackButton();
  scrollChatToBottom();
}

// Phase 1 — welcome + reframe

function startPhase1() {
  pushHistory('1');
  updatePhaseLabel('1');
  showInputRow();
  addSystemMessage('— Phase 1 of 4: Reframe —');

  callAPI(null, () => {
    const continueToValues = () => transitionTo('2a');
    showContinue('Continue to Values →', continueToValues);
    phaseOnResponse = () => showContinue('Continue to Values →', continueToValues);
  });
}

// Phase 2a — values sort

function enterPhase2a() {
  pushHistory('2a');
  hideInputRow();
  hideContinue();
  addSystemMessage('— Phase 2 of 4: Values —');
  addCoachMessage("Values aren't aspirations or goals. They're the things that make you feel most like yourself — what lights you up, or grounds you, or bothers you when it's missing.\n\nRead through the list below. Circle the ones that feel true to you. Then star your top 3 — the ones you wouldn't negotiate on.\n\nThere are no right answers. Go with what lands, not what looks good.");
  document.getElementById('values-sort').style.display = 'block';
  buildValuesSort();
  setTimeout(() => {
    document.getElementById('values-sort').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 80);
}

// Phase 2b — emotional check

function enterPhase2b() {
  pushHistory('2b');
  document.getElementById('values-sort').style.display = 'none';
  showInputRow();
  addSystemMessage('— Emotional check —');

  callAPI(null, () => {
    const continueToMap = () => transitionTo('2c');
    showContinue('Continue to Mapping →', continueToMap);
    phaseOnResponse = () => showContinue('Continue to Mapping →', continueToMap);
  });
}

// Phase 2c — values map (UI-only, no initial API call)

function enterPhase2c() {
  pushHistory('2c');
  hideInputRow();
  hideContinue();
  addSystemMessage('— Map your values —');
  document.getElementById('values-map').style.display = 'block';
  buildValuesMap();
  setTimeout(() => {
    document.getElementById('values-map').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 80);
}

// Phase 3a — actions UI with API intro

function enterPhase3a() {
  pushHistory('3a');
  document.getElementById('values-map').style.display = 'none';
  STATE.messages = [];
  showInputRow();
  addSystemMessage('— Phase 3 of 4: Moments of Truth —');

  callAPI(null, () => {
    document.getElementById('actions-ui').style.display = 'block';
    buildActionsUI();
    setTimeout(() => {
      document.getElementById('actions-ui').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  });
}

// Phase 3bc — wants more + ripple conversation

function enterPhase3bc() {
  pushHistory('3bc');
  document.getElementById('actions-ui').style.display = 'none';
  STATE.messages = [];

  callAPI(null, () => {
    const continueToWhy = () => {
      const recentUser = [...STATE.messages].reverse().find(m => m.role === 'user');
      if (recentUser) STATE.workbook.ripple = recentUser.content;
      transitionTo('4a');
    };
    showContinue('Continue to Why Statement →', continueToWhy);
    phaseOnResponse = () => showContinue('Continue to Why Statement →', continueToWhy);
  });
}

// Phase 4a — introduce framework

function enterPhase4a() {
  STATE.messages = [];
  addSystemMessage('— Phase 4 of 4: Why Statement —');

  callAPI(null, () => {
    document.getElementById('why-area').style.display = 'block';
    // Scroll to the why-area
    document.getElementById('why-area').scrollIntoView({ behavior: 'smooth', block: 'center' });
    transitionTo('4bc');
  });
}

// Phase 4bc — draft + refine

function enterPhase4bc() {
  pushHistory('4bc');
  showInputRow();

  const textarea = document.getElementById('why-textarea');
  textarea.addEventListener('input', onStatementInput);
  onStatementInput();

  phaseOnResponse = onStatementInput;
}

function onStatementInput() {
  const text = document.getElementById('why-textarea').value.trim();
  STATE.workbook.statement_draft = text;
  saveState();
  if (text.length > 5) {
    showContinue('This is my statement →', () => {
      STATE.workbook.statement_draft = document.getElementById('why-textarea').value.trim();
      transitionTo('4d');
    });
  }
}

// Phase 4d — closing

function enterPhase4d() {
  pushHistory('4d');
  hideContinue();
  document.getElementById('why-area').style.display = 'none';

  callAPI(null, () => {
    // After participant answers the final question, save + show complete
    // Don't let Claude reopen — show the complete button immediately on their response
    phaseOnResponse = () => {
      const lastUser = [...STATE.messages].reverse().find(m => m.role === 'user');
      if (lastUser) STATE.workbook.next_move = lastUser.content;
      STATE.session.completed = true;
      // Show complete as primary button (override the ghost style for this terminal action)
      const bar = document.getElementById('continue-bar');
      const btn = document.getElementById('btn-continue');
      btn.textContent = 'Complete your Why Workbook →';
      btn.style.cssText = 'width:100%;padding:14px;border:1px solid var(--ink);background:var(--ink);font-family:Inter;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:var(--paper);cursor:pointer;';
      btn.onclick = showClose;
      bar.style.display = 'block';
      hideInputRow();
    };
  });
}

// ─── Values sort component ───────────────────────────────────────────

function buildValuesSort() {
  const container = document.getElementById('values-chips');
  container.innerHTML = '';

  VALUES.forEach(val => {
    const chip = document.createElement('button');
    chip.className = 'value-chip';
    chip.textContent = val;
    chip.dataset.value = val;
    chip.dataset.state = 'neutral';
    chip.setAttribute('aria-pressed', 'false');
    chip.type = 'button';
    chip.addEventListener('click', () => handleValueChipClick(chip));
    container.appendChild(chip);
  });

  updateVsCount();
}

function handleValueChipClick(chip) {
  const current = chip.dataset.state;
  const starredCount = document.querySelectorAll('.value-chip[data-state="starred"]').length;

  if (current === 'neutral') {
    chip.dataset.state = 'circled';
    chip.setAttribute('aria-pressed', 'mixed');
  } else if (current === 'circled') {
    if (starredCount >= 3) {
      addSystemMessage('You already have 3 starred — which ones wouldn\'t you negotiate on?');
      return;
    }
    chip.dataset.state = 'starred';
    chip.setAttribute('aria-pressed', 'true');
  } else {
    chip.dataset.state = 'neutral';
    chip.setAttribute('aria-pressed', 'false');
  }

  updateVsCount();
  const any = document.querySelectorAll('.value-chip[data-state="circled"],.value-chip[data-state="starred"]').length;
  document.getElementById('btn-values-done').disabled = (any === 0);

  // Live-persist selections as they're made, not just once "Done" is clicked —
  // otherwise an in-progress selection is invisible to saveState().
  const raw = [...document.querySelectorAll('.value-chip[data-state="circled"],.value-chip[data-state="starred"]')]
    .map(c => c.dataset.value);
  const top3 = [...document.querySelectorAll('.value-chip[data-state="starred"]')]
    .map(c => c.dataset.value);
  STATE.workbook.values_raw = raw;
  STATE.workbook.values_top3 = top3;
  saveState();
}

function updateVsCount() {
  const circled = document.querySelectorAll('.value-chip[data-state="circled"]').length;
  const starred = document.querySelectorAll('.value-chip[data-state="starred"]').length;
  const total = circled + starred;
  document.getElementById('vs-count').textContent = `${total} selected · ${starred} ★ starred`;

  const hint = document.getElementById('vs-star-hint');
  if (hint) hint.style.display = (total >= 3 && starred < 3) ? 'block' : 'none';
}

function handleValuesDone() {
  const raw = [...document.querySelectorAll('.value-chip[data-state="circled"],.value-chip[data-state="starred"]')]
    .map(c => c.dataset.value);
  const top3 = [...document.querySelectorAll('.value-chip[data-state="starred"]')]
    .map(c => c.dataset.value);

  STATE.workbook.values_raw = raw;
  STATE.workbook.values_top3 = top3.length > 0 ? top3 : raw.slice(0, 3);
  transitionTo('2b');
}

// ─── Values map component ────────────────────────────────────────────

function buildValuesMap() {
  const container = document.getElementById('vm-items');
  container.innerHTML = '';

  const values = STATE.workbook.values_top3.length > 0
    ? STATE.workbook.values_top3.slice(0, 3)
    : STATE.workbook.values_raw.slice(0, 3);

  values.forEach(val => {
    const item = document.createElement('div');
    item.className = 'vm-item';
    item.dataset.value = val;
    item.innerHTML = `
      <p class="vm-value-name">${escHtml(val)}</p>
      <div class="vm-states" role="group" aria-label="How are you experiencing ${escHtml(val)}">
        <button class="vm-state-btn" type="button" data-state="aligned" aria-pressed="false">
          <span class="vm-btn-label">Aligned</span>
          <span class="vm-btn-desc">present and flowing</span>
        </button>
        <button class="vm-state-btn" type="button" data-state="activated" aria-pressed="false">
          <span class="vm-btn-label">Activated</span>
          <span class="vm-btn-desc">something's stirring here</span>
        </button>
        <button class="vm-state-btn" type="button" data-state="absent" aria-pressed="false">
          <span class="vm-btn-label">Absent</span>
          <span class="vm-btn-desc">missing or blocked</span>
        </button>
      </div>
    `;
    item.querySelectorAll('.vm-state-btn').forEach(btn => {
      btn.addEventListener('click', () => handleVmStateClick(btn, val, btn.dataset.state));
    });
    container.appendChild(item);
  });
}

function handleVmStateClick(btn, value, state) {
  const item = btn.closest('.vm-item');
  item.querySelectorAll('.vm-state-btn').forEach(b => {
    b.classList.remove('sel-aligned', 'sel-activated', 'sel-absent');
    b.setAttribute('aria-pressed', 'false');
  });
  btn.classList.add(`sel-${state}`);
  btn.setAttribute('aria-pressed', 'true');
  STATE.workbook.values_map[value] = state;
  checkAllValuesMapped();
  saveState();
}

function checkAllValuesMapped() {
  const values = STATE.workbook.values_top3.length > 0
    ? STATE.workbook.values_top3.slice(0, 3)
    : STATE.workbook.values_raw.slice(0, 3);
  const allDone = values.every(v => STATE.workbook.values_map[v]);
  document.getElementById('btn-map-done').disabled = !allDone;
}

function handleMapDone() {
  transitionTo('3a');
}

// ─── Actions component ───────────────────────────────────────────────

function buildActionsUI() {
  const container = document.getElementById('actions-inputs');
  container.innerHTML = '';

  const values = STATE.workbook.values_top3.length > 0
    ? STATE.workbook.values_top3.slice(0, 3)
    : STATE.workbook.values_raw.slice(0, 3);

  values.forEach(val => {
    const item = document.createElement('div');
    item.className = 'action-item';
    const id = `action-${val.toLowerCase().replace(/\W/g, '-')}`;
    item.innerHTML = `
      <label class="action-value-name" for="${id}">${escHtml(val)}</label>
      <input type="text" id="${id}" class="action-input"
        placeholder="One small action this week…"
        aria-label="Action for ${escHtml(val)}"
        data-value="${escHtml(val)}" />
    `;
    item.querySelector('.action-input').addEventListener('input', checkActionsDone);
    container.appendChild(item);
  });

  document.getElementById('btn-actions-done').disabled = true;
}

function checkActionsDone() {
  const allFilled = [...document.querySelectorAll('.action-input')].every(i => i.value.trim().length > 0);
  document.getElementById('btn-actions-done').disabled = !allFilled;
  document.querySelectorAll('.action-input').forEach(input => {
    STATE.workbook.actions[input.dataset.value] = input.value.trim();
  });
  saveState();
}

function handleActionsDone() {
  document.querySelectorAll('.action-input').forEach(input => {
    STATE.workbook.actions[input.dataset.value] = input.value.trim();
  });
  transitionTo('3bc');
}

// ─── Close screen ────────────────────────────────────────────────────

// Personalize the D2M bridge with whichever value showed the most tension —
// absent (missing) beats activated (stirring) beats a generic fallback.
// Always points to Module 01 regardless — D2M's layers build on each other,
// so the hook can be personal but the entry point stays fixed.
function buildD2MBridgeText() {
  const map = STATE.workbook.values_map || {};
  const order = STATE.workbook.values_top3.length > 0
    ? STATE.workbook.values_top3
    : STATE.workbook.values_raw.slice(0, 3);

  const absent = order.find(v => map[v] === 'absent');
  if (absent) {
    return `You flagged <strong>${escHtml(absent)}</strong> as something that's missing right now — Origin Story is where that gets unpacked.`;
  }

  const activated = order.find(v => map[v] === 'activated');
  if (activated) {
    return `<strong>${escHtml(activated)}</strong> came up as something stirring for you — Origin Story is where that gets unpacked.`;
  }

  if (STATE.workbook.ripple && STATE.workbook.ripple.trim()) {
    return `Hold onto what you said about the ripple — Origin Story is where you start turning that into a system you can actually live inside.`;
  }

  return `Origin Story is where you start turning today's reflection into a system you can actually live inside.`;
}

function showClose() {
  const statement = STATE.workbook.statement_draft || 'Your Why Statement';
  document.getElementById('wc-statement').textContent = statement;

  const valuesEl = document.getElementById('wc-values');
  valuesEl.innerHTML = '';
  const displayValues = STATE.workbook.values_top3.length > 0
    ? STATE.workbook.values_top3.slice(0, 3)
    : STATE.workbook.values_raw.slice(0, 3);
  displayValues.forEach(v => {
    const span = document.createElement('span');
    span.className = 'wc-value';
    span.textContent = v;
    valuesEl.appendChild(span);
  });

  document.getElementById('d2m-bridge-text').innerHTML = buildD2MBridgeText();

  // Pre-fill name
  document.getElementById('ec-name').value = STATE.participant.name;

  clearSavedSession();
  showScreen('screen-close');
}

// ─── Email capture ───────────────────────────────────────────────────

async function handleSubscribe() {
  const name = document.getElementById('ec-name').value.trim();
  const email = document.getElementById('ec-email').value.trim();
  const errorEl = document.getElementById('ec-error');

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errorEl.style.display = 'block';
    document.getElementById('ec-email').focus();
    return;
  }
  errorEl.style.display = 'none';

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
    }
  } catch {
    btn.disabled = false;
    btn.textContent = 'Send me the PDF';
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
    initWorkshop(false);
  });

  const saved = loadSavedSession();
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
      initWorkshop(true);
    });

    document.getElementById('btn-resume-fresh').addEventListener('click', () => {
      clearSavedSession();
      banner.hidden = true;
    });
  }
}

// ─── Workshop init ───────────────────────────────────────────────────

function initWorkshop(isResume) {
  showScreen('screen-workshop');

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
  document.getElementById('btn-values-done').addEventListener('click', handleValuesDone);
  document.getElementById('btn-map-done').addEventListener('click', handleMapDone);
  document.getElementById('btn-actions-done').addEventListener('click', handleActionsDone);

  const whyTextarea = document.getElementById('why-textarea');
  whyTextarea.addEventListener('input', function () {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
  });

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
    startPhase1();
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
  restorePhase(STATE.session.phase);
}

// ─── Shake animation (injected once) ────────────────────────────────

(function addShakeStyle() {
  const s = document.createElement('style');
  s.textContent = `
    @keyframes shake {
      0%,100%{transform:translateX(0)}
      20%{transform:translateX(-4px)}
      40%{transform:translateX(4px)}
      60%{transform:translateX(-3px)}
      80%{transform:translateX(2px)}
    }
    @media (prefers-reduced-motion: no-preference) {
      .shake { animation: shake 0.35s ease; }
    }
  `;
  document.head.appendChild(s);
})();

// ─── Boot ────────────────────────────────────────────────────────────

initWelcome();
