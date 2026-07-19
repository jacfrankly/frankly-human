/* ================================================================
   Design Leadership Diagnostic — app.js
   Vanilla JS state machine, ported from the Why Workbook v2 shell's
   proven architecture (phase machine, session persistence, chat log
   + embedded special components) and adapted to this touchpoint's
   four-screen flow and four-thread / three-trap / three-question
   phase structure.
   ================================================================ */

// ─── Content constants ──────────────────────────────────────────────

const THREADS = [
  {
    key: 'budget', label: 'BUDGET AUTHORITY',
    optionA: 'I shape this.', optionB: "I execute someone else's call on this.",
    stateA: 'shaping', stateB: 'reacting'
  },
  {
    key: 'roadmap', label: 'ROADMAP INFLUENCE',
    optionA: 'I shape this.', optionB: "I execute someone else's call on this.",
    stateA: 'shaping', stateB: 'reacting'
  },
  {
    key: 'trust', label: 'EXECUTIVE TRUST',
    optionA: "I'm in the room when it's decided.", optionB: "I get briefed after it's decided.",
    stateA: 'in the room', stateB: 'briefed after'
  },
  {
    key: 'relationship', label: 'RELATIONSHIP CAPITAL',
    optionA: "I know who's backing me, and who I owe.", optionB: "I don't have a current picture of who's actually behind me.",
    stateA: 'backed', stateB: 'exposed'
  }
];

const TRAPS = [
  { key: 'service', name: 'The Service Department Trap', desc: 'Brought in to execute a decision someone else already made.' },
  { key: 'factory', name: 'The Feature Factory Manager', desc: 'Measured on velocity and output — never on outcomes or strategy.' },
  { key: 'silent', name: 'The Silent Expert', desc: 'Has the strategic opinion. Has learned not to offer it unless asked.' }
];

const CRISIS_KEYWORDS = [
  'suicide', 'suicidal', 'kill myself', 'end it all', 'self-harm', 'self harm',
  'hurt myself', 'want to die', 'not worth living', 'no point going on'
];

// Header/phase-divider metadata. Reframe is deliberately absent — it
// carries no phase slot per the strategy doc's own IA (Section 1.1).
const PHASE_META = {
  '1-budget':       { n: 1, label: 'The Four Threads' },
  '1-roadmap':      { n: 1, label: 'The Four Threads' },
  '1-trust':        { n: 1, label: 'The Four Threads' },
  '1-relationship': { n: 1, label: 'The Four Threads' },
  '2-open':         { n: 2, label: 'The Three Traps' },
  '2-probe':        { n: 2, label: 'The Three Traps' },
  '3':              { n: 3, label: 'Where the Room Was Lost' },
  '4':              { n: 4, label: 'The Leadership Influence Profile' }
};

// ─── State ──────────────────────────────────────────────────────────

let STATE = {
  participant: { name: '', session_id: '' },
  diagnostic: {
    threads: {},        // key -> { choice: 'A'|'B', choiceText, evidence }
    trap: { key: '', name: '' },
    reveal: null         // { headline_thread, profile_sentence, lime_phrase, why_line, quoted_fragment }
  },
  session: { phase: 'reframe', distress_flag: false, distressNoteShown: false, completed: false },
  messages: []
};

let typingEl = null;
let isSending = false;
let phaseOnResponse = () => {};
let apiRetryCount = 0;

// ─── Persistence ────────────────────────────────────────────────────
// Ported faithfully from the Why Workbook's pattern: save on every
// state-changing action, offer to resume on return. At $500, session-loss
// recovery matters more here, not less (Strategy doc §1.1).

const STORAGE_KEY = 'dld_session_v1'; // proposed in the design spec, Open Thread §4.5 — flag for sign-off
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
        diagnostic: STATE.diagnostic,
        session: STATE.session,
        messages: STATE.messages,
        transcript: TRANSCRIPT
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
  const main = document.getElementById('dl-main');
  if (main) main.scrollTo({ top: main.scrollHeight, behavior: 'smooth' });
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// ─── Chat rendering ─────────────────────────────────────────────────
// Speaker turns are an asymmetric hairline rule (cobalt for Claude, ink
// for the participant) per Design Spec §2.1 — no bubble, no fill, no
// radius, no shadow. The only Markdown Claude's copy ever uses is a
// single **bold** pair around the trap name (ember ledger item #2,
// Design Spec §1.1) — rendered as <em class="dl-ember">, never <strong>.

function renderClaudeInline(text) {
  const trapName = STATE.diagnostic.trap && STATE.diagnostic.trap.name;
  return escHtml(text)
    .replace(/\*\*(.+?)\*\*/g, (match, inner) => {
      // Only the exact, already-selected trap name earns the ember ledger
      // treatment — any other bold Claude emits (a stray emphasis, not the
      // one licensed markdown use) renders as plain text, never <strong>.
      if (trapName && inner === trapName) return '<em class="dl-ember">' + inner + '</em>';
      return inner;
    })
    .replace(/\n/g, '<br>');
}

function addClaudeMessage(text) {
  if (!text || !text.trim()) return null;
  const log = document.getElementById('chat-log');
  const div = document.createElement('div');
  div.className = 'msg msg-claude';
  const paragraphs = text.trim().split(/\n\n+/).map(p => '<p>' + renderClaudeInline(p) + '</p>').join('');
  div.innerHTML = '<div class="dl-msg-claude-inner"><span class="dl-msg-label">Claude</span>' + paragraphs + '</div>';
  log.appendChild(div);
  scrollChatToBottom();
  if (!REPLAYING) { TRANSCRIPT.push({ role: 'claude', text: text }); saveState(); }
  return div;
}

function addParticipantMessage(text) {
  const log = document.getElementById('chat-log');
  const div = document.createElement('div');
  div.className = 'msg msg-user';
  div.innerHTML = '<div class="dl-msg-user-inner"><span class="dl-msg-label">You</span><p>' + escHtml(text) + '</p></div>';
  log.appendChild(div);
  scrollChatToBottom();
  if (!REPLAYING) { TRANSCRIPT.push({ role: 'user', text: text }); saveState(); }
}

function addSystemDivider(text) {
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

function showDistressNote() {
  const log = document.getElementById('chat-log');
  const claudeMsgs = log.querySelectorAll('.msg-claude');
  const last = claudeMsgs[claudeMsgs.length - 1];
  if (!last) return;
  const inner = last.querySelector('.dl-msg-claude-inner');
  if (!inner || inner.querySelector('.dl-distress-note')) return;
  const note = document.createElement('div');
  note.className = 'dl-distress-note';
  note.innerHTML = 'If this is more than a work problem right now: <strong>Lifeline (Australia)</strong> — <a href="tel:131114">13 11 14</a>, free and confidential, 24/7.';
  inner.appendChild(note);
  scrollChatToBottom();
}

// ─── Phase label / dividers ─────────────────────────────────────────

function updatePhaseLabel(phase) {
  const el = document.getElementById('phase-label');
  if (!el) return;
  const meta = PHASE_META[phase];
  el.textContent = meta ? `Phase ${meta.n} of 4 · ${meta.label}` : '';
}

// Only insert an in-log divider when the phase *number* changes, not on
// every sub-phase (e.g. moving between the four threads inside Phase 1
// doesn't re-announce Phase 1 four times).
function maybeDivider(prevPhase, newPhase) {
  const prevMeta = PHASE_META[prevPhase];
  const newMeta = PHASE_META[newPhase];
  if (!newMeta) return;
  if (!prevMeta || prevMeta.n !== newMeta.n) {
    addSystemDivider(`Phase ${newMeta.n} of 4 · ${newMeta.label}`);
  }
}

// ─── Support panel ──────────────────────────────────────────────────

function setSupportPanel(open) {
  const panel = document.getElementById('support-panel');
  const btn = document.getElementById('btn-support');
  if (!panel || !btn) return;
  panel.hidden = !open;
  btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  if (open) panel.querySelector('.support-close').focus();
  else btn.focus();
}

function toggleSupportPanel() {
  const panel = document.getElementById('support-panel');
  setSupportPanel(!!panel && panel.hidden);
}

// ─── Continue button / input row ────────────────────────────────────

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

function showInputRow() { document.getElementById('input-row').style.display = 'flex'; }
function hideInputRow() { document.getElementById('input-row').style.display = 'none'; }

function setSendDisabled(disabled) {
  isSending = disabled;
  const btn = document.getElementById('btn-send');
  if (btn) btn.disabled = disabled;
}

// ─── API call ────────────────────────────────────────────────────────

let pendingOnSuccess = null;
let pendingApiText = null;

// Pulls the fenced ```json ... ``` block out of Claude's Phase 4 response
// (the structured reveal payload) and returns the remaining prose plus the
// parsed data separately, so the chat bubble only ever shows the prose.
function extractRevealJSON(rawText) {
  const match = rawText.match(/```json([\s\S]*?)```/i);
  if (!match) return { display: rawText.trim(), data: null };
  const display = (rawText.slice(0, match.index) + rawText.slice(match.index + match[0].length)).trim();
  let data = null;
  try { data = JSON.parse(match[1].trim()); } catch (e) { data = null; }
  return { display, data };
}

async function callAPI(apiText, onSuccess) {
  pendingOnSuccess = onSuccess || null;
  pendingApiText = apiText;

  if (apiText) {
    STATE.messages.push({ role: 'user', content: apiText });
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
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phase: STATE.session.phase,
        name: STATE.participant.name,
        messages: STATE.messages,
        diagnostic: STATE.diagnostic,
        distress_flag: STATE.session.distress_flag
      }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const data = await res.json();
    hideTyping();
    setSendDisabled(false);
    apiRetryCount = 0;

    if (data.distress) STATE.session.distress_flag = true;

    let content = data.content || '';
    let revealData = null;
    if (STATE.session.phase === '4') {
      const extracted = extractRevealJSON(content);
      content = extracted.display;
      revealData = extracted.data;
    }

    if (content) addClaudeMessage(content);

    if (STATE.session.distress_flag && !STATE.session.distressNoteShown) {
      showDistressNote();
      STATE.session.distressNoteShown = true;
    }
    saveState();

    if (content) {
      STATE.messages.push({ role: 'assistant', content });
      if (STATE.messages.length > 10) STATE.messages = STATE.messages.slice(-10);
    }

    pendingOnSuccess = null;
    if (onSuccess) onSuccess(data, revealData);
    return data;
  } catch (err) {
    clearTimeout(timeoutId);
    hideTyping();
    setSendDisabled(false);
    apiRetryCount++;
    const isTimeout = err.name === 'AbortError';
    showAPIError(isTimeout, apiRetryCount);
    return null;
  }
}

function showAPIError(isTimeout, retryCount) {
  const log = document.getElementById('chat-log');
  const div = document.createElement('div');
  div.className = 'msg msg-claude';
  let msg;
  if (retryCount >= 2) {
    msg = "Still not going through — this is on our end, not yours. If it keeps happening, email hello@franklyhuman.com and I'll pick up the conversation from where you left off.";
  } else {
    msg = isTimeout ? 'This is taking longer than it should.' : "That didn't go through.";
  }
  const distressNote = STATE.session.distress_flag
    ? '<div class="dl-distress-note">If this is more than a work problem right now: <strong>Lifeline (Australia)</strong> — <a href="tel:131114">13 11 14</a>, free and confidential, 24/7.</div>'
    : '';
  div.innerHTML = `<div class="dl-msg-claude-inner">
    <p>${escHtml(msg)}</p>
    ${distressNote}
    <button type="button" onclick="retryAPI()" style="font-family:'Inter';font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;padding:10px 18px;background:none;border:1px solid var(--ink);cursor:pointer;margin-top:10px;">Try again</button>
  </div>`;
  log.appendChild(div);
  scrollChatToBottom();
}

function retryAPI() {
  const log = document.getElementById('chat-log');
  const lastClaudeMsg = log.querySelector('.msg-claude:last-child');
  if (lastClaudeMsg) lastClaudeMsg.remove();

  const lastIdx = [...STATE.messages].reverse().findIndex(m => m.role === 'user');
  let retryText = pendingApiText;
  if (lastIdx !== -1) {
    const idx = STATE.messages.length - 1 - lastIdx;
    retryText = STATE.messages[idx].content;
    STATE.messages.splice(idx, 1);
  }
  const onSuccess = pendingOnSuccess;
  callAPI(retryText, onSuccess);
}

// ─── Send message (free-text turns: 2-probe, Phase 3) ───────────────

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
  addParticipantMessage(text);
  hideContinue();

  callAPI(text, () => {
    if (!STATE.session.distress_flag) phaseOnResponse();
  });
}

// ─── Phase machine ───────────────────────────────────────────────────

function startReframe() {
  STATE.session.phase = 'reframe';
  updatePhaseLabel('reframe');
  hideInputRow();
  hideContinue();
  saveState();

  callAPI(null, () => {
    const fn = () => transitionToThread(0);
    showContinue('Continue →', fn);
    phaseOnResponse = () => showContinue('Continue →', fn);
  });
}

// Phase 1 — The Four Threads

function transitionToThread(index) {
  const t = THREADS[index];
  const phaseKey = '1-' + t.key;
  maybeDivider(STATE.session.phase, phaseKey);
  STATE.session.phase = phaseKey;
  updatePhaseLabel(phaseKey);
  hideContinue();
  hideInputRow();

  if (index === 0) document.getElementById('thread-scorer').innerHTML = '';
  saveState();

  callAPI(null, () => { showThreadCard(index); });
}

function showThreadCard(index) {
  const t = THREADS[index];
  const container = document.getElementById('thread-scorer');
  container.style.display = 'block';

  const card = document.createElement('div');
  card.className = 'dl-thread-card';
  card.dataset.threadKey = t.key;
  card.innerHTML = `
    <span class="dl-thread-label">${escHtml(t.label)}</span>
    <div class="dl-thread-choice" role="group" aria-label="${escHtml(t.label)} — forced choice">
      <button type="button" class="dl-thread-btn" data-option="A" aria-pressed="false">${escHtml(t.optionA)}</button>
      <button type="button" class="dl-thread-btn" data-option="B" aria-pressed="false">${escHtml(t.optionB)}</button>
    </div>
    <label class="dl-thread-evidence-label" for="evidence-${t.key}">The example that proves it</label>
    <textarea class="dl-thread-evidence-input" id="evidence-${t.key}" rows="2" aria-required="true"></textarea>
    <button type="button" class="btn-primary dl-thread-next">${index === THREADS.length - 1 ? 'Continue to Phase 2 →' : 'Next thread →'}</button>
  `;
  container.appendChild(card);

  const btns = card.querySelectorAll('.dl-thread-btn');
  btns.forEach(b => b.addEventListener('click', () => {
    btns.forEach(x => x.setAttribute('aria-pressed', 'false'));
    b.setAttribute('aria-pressed', 'true');
  }));

  card.querySelector('.dl-thread-next').addEventListener('click', () => handleThreadSubmit(index));

  setTimeout(() => card.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
}

function handleThreadSubmit(index) {
  const t = THREADS[index];
  const container = document.getElementById('thread-scorer');
  const card = container.querySelector('.dl-thread-card');
  if (!card) return;

  const choiceBtn = card.querySelector('.dl-thread-btn[aria-pressed="true"]');
  const evidenceInput = card.querySelector('.dl-thread-evidence-input');
  const evidence = evidenceInput.value.trim();

  if (!choiceBtn) {
    const group = card.querySelector('.dl-thread-choice');
    group.classList.add('shake');
    setTimeout(() => group.classList.remove('shake'), 400);
    return;
  }
  if (!evidence) {
    evidenceInput.classList.add('shake');
    setTimeout(() => evidenceInput.classList.remove('shake'), 400);
    evidenceInput.focus();
    return;
  }

  const option = choiceBtn.dataset.option;
  const choiceText = option === 'A' ? t.optionA : t.optionB;
  STATE.diagnostic.threads[t.key] = { choice: option, choiceText, evidence };
  saveState();

  const summary = document.createElement('div');
  summary.className = 'dl-thread-summary';
  summary.innerHTML = `<span class="name">${escHtml(t.label)}</span><span class="choice">${escHtml(choiceText)}</span>`;
  card.replaceWith(summary);

  addParticipantMessage(evidence);

  const apiText = `Thread: ${t.label}. Choice: "${choiceText}". Example: "${evidence}"`;
  callAPI(apiText, () => {
    if (index + 1 < THREADS.length) transitionToThread(index + 1);
    else enterPhase2();
  });
}

// Phase 2 — The Three Traps

function enterPhase2() {
  maybeDivider(STATE.session.phase, '2-open');
  STATE.session.phase = '2-open';
  updatePhaseLabel('2-open');
  hideInputRow();
  hideContinue();
  document.getElementById('thread-scorer').style.display = 'none';
  saveState();

  callAPI(null, () => { showTrapSelector(); });
}

function showTrapSelector() {
  const wrap = document.getElementById('trap-selector');
  const optionsEl = document.getElementById('trap-options');
  const evidenceBlock = document.getElementById('trap-evidence-block');
  wrap.style.display = 'block';

  const alreadyCommitted = STATE.diagnostic.trap && STATE.diagnostic.trap.key;

  if (alreadyCommitted) {
    // Resume/replay into 2-probe or later — the trap is locked in, same
    // treatment as a completed thread in the thread-scorer.
    optionsEl.innerHTML = '';
    const summary = document.createElement('div');
    summary.className = 'dl-thread-summary';
    summary.innerHTML = `<span class="name">Trap</span><span class="choice">${escHtml(STATE.diagnostic.trap.name)}</span>`;
    optionsEl.appendChild(summary);
    evidenceBlock.style.display = 'none';
    return;
  }

  optionsEl.innerHTML = '';
  evidenceBlock.style.display = 'none';
  document.getElementById('trap-evidence-input').value = '';
  let selectedTrap = null;

  TRAPS.forEach(trap => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'dl-trap-card';
    btn.setAttribute('aria-pressed', 'false');
    btn.innerHTML = `<span class="name">${escHtml(trap.name)}</span><span class="desc">${escHtml(trap.desc)}</span>`;
    btn.addEventListener('click', () => {
      document.querySelectorAll('#trap-options .dl-trap-card').forEach(b => b.setAttribute('aria-pressed', 'false'));
      btn.setAttribute('aria-pressed', 'true');
      selectedTrap = trap;
      evidenceBlock.style.display = 'block';
      setTimeout(() => evidenceBlock.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
    });
    optionsEl.appendChild(btn);
  });

  document.getElementById('btn-trap-submit').onclick = () => handleTrapSubmit(selectedTrap);

  setTimeout(() => wrap.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
}

// Evidence is required before a trap commits — matching the thread-scorer's
// already-correct "choice + evidence, gated" pattern, rather than committing
// the instant a card is tapped.
function handleTrapSubmit(trap) {
  const optionsEl = document.getElementById('trap-options');
  const evidenceInput = document.getElementById('trap-evidence-input');
  const evidence = evidenceInput.value.trim();

  if (!trap) {
    optionsEl.classList.add('shake');
    setTimeout(() => optionsEl.classList.remove('shake'), 400);
    return;
  }
  if (!evidence) {
    evidenceInput.classList.add('shake');
    setTimeout(() => evidenceInput.classList.remove('shake'), 400);
    evidenceInput.focus();
    return;
  }

  STATE.diagnostic.trap = { key: trap.key, name: trap.name, evidence };

  optionsEl.innerHTML = '';
  const summary = document.createElement('div');
  summary.className = 'dl-thread-summary';
  summary.innerHTML = `<span class="name">Trap</span><span class="choice">${escHtml(trap.name)}</span>`;
  optionsEl.appendChild(summary);
  document.getElementById('trap-evidence-block').style.display = 'none';

  addParticipantMessage(evidence);

  STATE.session.phase = '2-probe';
  updatePhaseLabel('2-probe');
  showInputRow();
  saveState();

  const apiText = `Selected trap: ${trap.name}. Example: "${evidence}"`;
  callAPI(apiText, () => {
    const fn = () => enterPhase3();
    showContinue('Continue to Phase 3 →', fn);
    phaseOnResponse = () => showContinue('Continue to Phase 3 →', fn);
  });
}

// Phase 3 — Where the Room Was Lost

function enterPhase3() {
  maybeDivider(STATE.session.phase, '3');
  STATE.session.phase = '3';
  updatePhaseLabel('3');
  document.getElementById('trap-selector').style.display = 'none';
  hideContinue();
  showInputRow();
  saveState();

  callAPI(null, () => {
    const fn = () => enterPhase4();
    showContinue('Continue to Phase 4 →', fn);
    phaseOnResponse = () => showContinue('Continue to Phase 4 →', fn);
  });
}

// Phase 4 — The Leadership Influence Profile

function enterPhase4() {
  maybeDivider(STATE.session.phase, '4');
  STATE.session.phase = '4';
  updatePhaseLabel('4');
  hideInputRow();
  hideContinue();
  saveState();

  callAPI(null, (data, revealData) => {
    STATE.diagnostic.reveal = revealData || buildFallbackReveal();
    STATE.diagnostic.revealDegraded = !revealData;
    STATE.session.completed = true;
    saveState();
    showContinue('See your Leadership Influence Profile →', finishToClose);
  });
}

function threadStateLabel(t) {
  const rec = STATE.diagnostic.threads[t.key];
  if (!rec) return '—';
  return rec.choice === 'A' ? t.stateA : t.stateB;
}

// Deterministic safety net if Claude's structured reveal payload fails to
// parse — the reveal must never be empty (Principle 7: immediate,
// in-session, never deferred).
function buildFallbackReveal() {
  const trapName = (STATE.diagnostic.trap && STATE.diagnostic.trap.name) || 'the pattern';
  const order = ['trust', 'roadmap', 'budget', 'relationship'];
  let headline = 'trust';
  for (const key of order) {
    const rec = STATE.diagnostic.threads[key];
    if (rec && rec.choice === 'B') { headline = key; break; }
  }
  const t = THREADS.find(x => x.key === headline);
  return {
    headline_thread: headline,
    profile_sentence: "You've built the credibility. You haven't been given the room.",
    lime_phrase: 'the room',
    why_line: `What you described points to a ${t ? t.label.toLowerCase() : 'trust'} gap, tangled up with ${trapName} — that's why this is the read.`,
    quoted_fragment: trapName
  };
}

function finishToClose() {
  renderReveal(STATE.diagnostic.reveal);
  clearSavedSession();
  showScreen('screen-close');
}

// ─── Close screen ────────────────────────────────────────────────────

function renderReveal(reveal) {
  const contextEl = document.getElementById('reveal-context');
  const sentenceEl = document.getElementById('reveal-sentence');
  const threadsEl = document.getElementById('reveal-threads');
  const degradedEl = document.getElementById('reveal-degraded-note');
  if (degradedEl) degradedEl.hidden = !STATE.diagnostic.revealDegraded;

  let contextHtml = escHtml(reveal.why_line || '');
  if (reveal.quoted_fragment && (reveal.why_line || '').includes(reveal.quoted_fragment)) {
    contextHtml = escHtml(reveal.why_line).split(escHtml(reveal.quoted_fragment))
      .join('<em class="dl-ember">' + escHtml(reveal.quoted_fragment) + '</em>');
  }
  contextEl.innerHTML = contextHtml;

  let sentenceHtml = escHtml(reveal.profile_sentence || '');
  if (reveal.lime_phrase && (reveal.profile_sentence || '').includes(reveal.lime_phrase)) {
    sentenceHtml = escHtml(reveal.profile_sentence).split(escHtml(reveal.lime_phrase))
      .join('<span class="dl-lime">' + escHtml(reveal.lime_phrase) + '</span>');
  }
  sentenceEl.innerHTML = sentenceHtml;

  // Four threads, always rendered, unconditionally — Principle 1 made literal.
  threadsEl.innerHTML = '';
  THREADS.forEach(t => {
    const span = document.createElement('span');
    span.className = 'dl-reveal-thread';
    span.innerHTML = `<span class="name">${escHtml(t.label)}</span><span class="state">${escHtml(threadStateLabel(t))}</span>`;
    threadsEl.appendChild(span);
  });

  document.getElementById('ec-name').value = STATE.participant.name;
  buildClaudeContinueLink(reveal);
}

function buildClaudeContinueLink(reveal) {
  const lines = [];
  lines.push("I just completed the Design Leadership Diagnostic (Frankly Human). Here's what it surfaced — help me turn this into a script for my next conversation with my own leadership, or a deeper 90-day plan.");
  lines.push('');
  lines.push(`Profile: ${reveal.profile_sentence || ''}`);
  lines.push(`Trap: ${(STATE.diagnostic.trap && STATE.diagnostic.trap.name) || ''}`);
  lines.push('');
  lines.push('Four threads:');
  THREADS.forEach(t => {
    const rec = STATE.diagnostic.threads[t.key] || {};
    lines.push(`- ${t.label}: ${threadStateLabel(t)} — "${rec.evidence || ''}"`);
  });
  if (reveal.why_line) { lines.push(''); lines.push(`Why this, specifically: ${reveal.why_line}`); }

  const url = 'https://claude.ai/new?q=' + encodeURIComponent(lines.join('\n'));
  const link = document.getElementById('btn-continue-claude');
  if (link) link.href = url;
}

// ─── Email capture ───────────────────────────────────────────────────

async function handleSubscribe() {
  const name = document.getElementById('ec-name').value.trim();
  const email = document.getElementById('ec-email').value.trim();
  const errorEl = document.getElementById('ec-error');

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errorEl.style.display = 'block';
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
      body: JSON.stringify({ name, email, diagnostic: STATE.diagnostic })
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
    showScreen('screen-intake');
    initIntakeOnce();
  });

  const saved = loadSavedSession();
  const banner = document.getElementById('resume-banner');
  if (saved && banner) {
    const text = document.getElementById('resume-text');
    const namePart = saved.participant && saved.participant.name ? ', ' + saved.participant.name : '';
    const hasProgress = saved.session && saved.session.phase && saved.session.phase !== 'reframe';
    text.textContent = hasProgress
      ? `Welcome back${namePart} — your diagnostic is partway done.`
      : `Welcome back${namePart} — you haven't started yet.`;
    banner.hidden = false;

    document.getElementById('btn-resume').addEventListener('click', () => {
      STATE.participant = saved.participant;
      STATE.diagnostic = saved.diagnostic || STATE.diagnostic;
      STATE.session = saved.session;
      STATE.messages = saved.messages || [];
      TRANSCRIPT = saved.transcript || [];
      initDiagnostic(true);
    });

    document.getElementById('btn-resume-fresh').addEventListener('click', () => {
      clearSavedSession();
      banner.hidden = true;
    });
  }
}

// ─── Intake screen ───────────────────────────────────────────────────

let intakeInitialized = false;
function initIntakeOnce() {
  if (intakeInitialized) return;
  intakeInitialized = true;
  document.getElementById('btn-begin').addEventListener('click', () => {
    // TODO: payment integration — gate this on a confirmed-payment session
    // state before proceeding. Out of scope for this build; proceeding
    // directly to the diagnostic per the orchestrator's brief. If payment
    // is unconfirmed, render Content Copy §6.2's error copy here instead
    // of calling initDiagnostic().
    initDiagnostic(false);
  });
}

// ─── Diagnostic screen init ──────────────────────────────────────────

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

  document.getElementById('btn-send').addEventListener('click', sendMessage);

  window.addEventListener('beforeunload', e => {
    if (STATE.participant.name && !STATE.session.completed) {
      e.preventDefault();
      e.returnValue = '';
    }
  });

  if (isResume) resumeSession();
  else startReframe();
}

function resumeSession() {
  REPLAYING = true;
  TRANSCRIPT.forEach(entry => {
    if (entry.role === 'claude') addClaudeMessage(entry.text);
    else if (entry.role === 'user') addParticipantMessage(entry.text);
    else addSystemDivider(entry.text);
  });
  REPLAYING = false;
  addSystemDivider('Welcome back — resuming where you left off');
  updatePhaseLabel(STATE.session.phase);
  restorePhase(STATE.session.phase);
}

function restorePhase(phase) {
  hideContinue();
  showInputRow();
  document.getElementById('trap-selector').style.display = 'none';
  phaseOnResponse = () => {};

  if (phase === 'reframe') {
    hideInputRow();
    const fn = () => transitionToThread(0);
    showContinue('Continue →', fn);
    phaseOnResponse = () => showContinue('Continue →', fn);
    return;
  }

  if (phase.indexOf('1-') === 0) {
    const key = phase.slice(2);
    const idx = THREADS.findIndex(t => t.key === key);
    hideInputRow();
    const container = document.getElementById('thread-scorer');
    container.style.display = 'block';
    container.innerHTML = '';
    THREADS.forEach((t, i) => {
      if (i < idx && STATE.diagnostic.threads[t.key]) {
        const rec = STATE.diagnostic.threads[t.key];
        const summary = document.createElement('div');
        summary.className = 'dl-thread-summary';
        summary.innerHTML = `<span class="name">${escHtml(t.label)}</span><span class="choice">${escHtml(rec.choiceText)}</span>`;
        container.appendChild(summary);
      }
    });
    if (idx >= 0) showThreadCard(idx);
    return;
  }

  if (phase === '2-open') {
    hideInputRow();
    showTrapSelector();
    return;
  }

  if (phase === '2-probe') {
    showInputRow();
    showTrapSelector();
    const fn = () => enterPhase3();
    showContinue('Continue to Phase 3 →', fn);
    phaseOnResponse = () => showContinue('Continue to Phase 3 →', fn);
    return;
  }

  if (phase === '3') {
    showInputRow();
    const fn = () => enterPhase4();
    showContinue('Continue to Phase 4 →', fn);
    phaseOnResponse = () => showContinue('Continue to Phase 4 →', fn);
    return;
  }

  if (phase === '4') {
    hideInputRow();
    if (STATE.diagnostic.reveal) {
      showContinue('See your Leadership Influence Profile →', finishToClose);
    } else {
      enterPhase4();
    }
    return;
  }
}

// ─── Boot ────────────────────────────────────────────────────────────

document.getElementById('btn-subscribe').addEventListener('click', handleSubscribe);
document.getElementById('btn-skip-subscribe').addEventListener('click', () => {
  document.getElementById('email-capture').style.display = 'none';
});

initWelcome();
