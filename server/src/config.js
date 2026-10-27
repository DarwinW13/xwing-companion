const path = require('path');

module.exports = {
  PORT: process.env.PORT || 3000,
  ALLOWED_ORIGIN: process.env.ALLOWED_ORIGIN || 'https://xwing.lemmerfamily.net',
  SESSIONS_DIR: path.join(__dirname, '..', 'sessions'),
  SESSION_TTL_MS: 24 * 60 * 60 * 1000,      // delete sessions idle for 24h
  CODE_RE: /^[0-9A-F]{6}$/,
  // Fields clients may write via POST /session/:code/update
  ALLOWED_FIELDS: [
    'round', 'scenarioIndex', 'lists', 'shipState', 'missionPts', 'pendingMission', 'missionHistory',
    'gameMode', 'gameTimerSecs', 'gameTimerRunning', 'gameTimerStartedAt',
    'roundTimerSecs', 'roundTimerRunning', 'roundTimerStartedAt',
  ],
};
