const fs = require('fs');
const { STATE_FILE } = require('./config');

const defaultState = () => ({
  sessionId: null,
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

function readState() {
  try { return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8')); }
  catch { return defaultState(); }
}

function writeState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state), 'utf8');
}

module.exports = { defaultState, readState, writeState };
