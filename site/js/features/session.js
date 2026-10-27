// Live two-player sync: REST for writes, SSE for pushes.
import { state, lists, shipState, missionPts, pendingMission, missionHistory, PLAYERS } from '../state.js';
import { $ } from '../utils/format.js';
import { on, emit } from '../utils/bus.js';
import { registerActions } from '../utils/actions.js';
import { timerSnapshot, applyRemoteTimers } from './timers.js';
import { updateAllScores } from './scoring.js';
import { showListName } from './xws.js';
import { setMode, setRound } from './tracker.js';

const API = 'https://api.xwing.lemmerfamily.net';   // ← change if the API host moves

let eventSource = null;
let isApplyingRemote = false;   // suppresses echoing remote updates back to the server
let debounce = null;

function setStatus(s) {   // 'disconnected' | 'connecting' | 'connected'
  $('session-dot').className = 'session-dot' + (s === 'connected' ? ' connected' : s === 'connecting' ? ' connecting' : '');
  $('session-status-text').textContent =
    s === 'connected' ? 'Connected — syncing live' : s === 'connecting' ? 'Connecting…' : 'Not connected';
}

function showCode(code) {
  state.sessionId = code;
  emit('activity');
  $('session-code-display').textContent = code;
  $('session-active').style.display = 'block';
}

function connectSSE() {
  if (eventSource) eventSource.close();
  setStatus('connecting');
  eventSource = new EventSource(API + '/events');
  eventSource.onopen = () => setStatus('connected');
  eventSource.onerror = () => setStatus('connecting');
  eventSource.onmessage = e => {
    try {
      const s = JSON.parse(e.data);
      if (s.sessionId && state.sessionId && s.sessionId !== state.sessionId) return;
      applyRemote(s);
    } catch (err) { console.error('SSE parse error', err); }
  };
}

export function reconnectIfNeeded() {
  if (state.sessionId && (!eventSource || eventSource.readyState === EventSource.CLOSED)) connectSSE();
}

async function createSession() {
  try {
    setStatus('connecting');
    const res = await fetch(API + '/session/new', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameMode: state.mode }),
    });
    showCode((await res.json()).sessionId);
    connectSSE();
  } catch {
    alert('Could not reach sync server. Check your connection.');
    setStatus('disconnected');
  }
}

function toggleJoinRow() {
  const row = $('join-row');
  row.style.display = row.style.display === 'none' ? 'flex' : 'none';
  if (row.style.display === 'flex') $('join-code-input').focus();
}

async function joinSession() {
  const code = $('join-code-input').value.trim().toUpperCase();
  if (code.length !== 6) { alert('Please enter the full 6-character session code.'); return; }
  try {
    setStatus('connecting');
    const s = await (await fetch(API + '/state')).json();
    if (!s.sessionId || s.sessionId !== code) {
      alert('Session not found. Check the code and try again.');
      setStatus('disconnected');
      return;
    }
    showCode(code);
    $('join-row').style.display = 'none';
    applyRemote(s);
    connectSSE();
  } catch {
    alert('Could not reach sync server.');
    setStatus('disconnected');
  }
}

function pushState() {
  if (!state.sessionId || isApplyingRemote) return;
  clearTimeout(debounce);
  debounce = setTimeout(async () => {
    try {
      await fetch(API + '/update', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: state.sessionId,
          round: state.round, gameMode: state.mode,
          lists, shipState, missionPts, pendingMission, missionHistory,
          ...timerSnapshot(),
        }),
      });
    } catch { /* offline – UI still works locally */ }
  }, 150);
}

function applyRemote(s) {
  if (!s) return;
  isApplyingRemote = true;
  try {
    if (typeof s.round === 'number') setRound(s.round);
    if (s.lists) PLAYERS.forEach(p => { if (s.lists[p]) { lists[p] = s.lists[p]; showListName(p); } });
    if (s.shipState) PLAYERS.forEach(p => { if (s.shipState[p]) shipState[p] = s.shipState[p]; });
    if (s.missionPts) PLAYERS.forEach(p => { if (typeof s.missionPts[p] === 'number') missionPts[p] = s.missionPts[p]; });
    if (s.pendingMission) PLAYERS.forEach(p => { if (typeof s.pendingMission[p] === 'number') pendingMission[p] = s.pendingMission[p]; });
    if (s.missionHistory) { missionHistory.length = 0; s.missionHistory.forEach(e => missionHistory.push(e)); }
    updateAllScores();

    if (s.gameMode && s.gameMode !== state.mode) setMode(s.gameMode);  // resets timers → do before restoring them
    applyRemoteTimers(s);
    emit('scores');   // re-render open sheet
  } finally {
    isApplyingRemote = false;
  }
}

export function initSession() {
  on('changed', pushState);
  registerActions({ createSession, toggleJoinRow, joinSession });
}
