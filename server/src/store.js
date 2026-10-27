// One JSON file per session: sessions/<CODE>.json
const fs = require('fs');
const path = require('path');
const { SESSIONS_DIR, SESSION_TTL_MS, CODE_RE } = require('./config');

fs.mkdirSync(SESSIONS_DIR, { recursive: true });

const file = code => path.join(SESSIONS_DIR, code + '.json');   // code is validated by CODE_RE first

const defaultState = sessionId => ({
  sessionId,
  round: 1,
  lists: { 1: null, 2: null },
  shipState: { 1: [], 2: [] },
  missionPts: { 1: 0, 2: 0 },
  pendingMission: { 1: 0, 2: 0 },
  missionHistory: [],
  gameMode: 'standard',
  gameTimerSecs: 75 * 60,
  gameTimerRunning: false,
  gameTimerStartedAt: null,
  roundTimerSecs: 120,
  roundTimerRunning: false,
  roundTimerStartedAt: null,
});

const isValidCode = code => CODE_RE.test(code);

// Returns the session state, or null if the code is invalid / unknown / expired
function readState(code) {
  if (!isValidCode(code)) return null;
  try { return JSON.parse(fs.readFileSync(file(code), 'utf8')); }
  catch { return null; }
}

function writeState(code, state) {
  fs.writeFileSync(file(code), JSON.stringify(state), 'utf8');   // also refreshes mtime (activity)
}

const exists = code => isValidCode(code) && fs.existsSync(file(code));

// Remove sessions with no activity for SESSION_TTL_MS
function cleanupExpired() {
  const cutoff = Date.now() - SESSION_TTL_MS;
  for (const name of fs.readdirSync(SESSIONS_DIR)) {
    if (!name.endsWith('.json')) continue;
    const p = path.join(SESSIONS_DIR, name);
    try { if (fs.statSync(p).mtimeMs < cutoff) fs.unlinkSync(p); } catch { /* ignore */ }
  }
}

module.exports = { defaultState, readState, writeState, exists, isValidCode, cleanupExpired };
