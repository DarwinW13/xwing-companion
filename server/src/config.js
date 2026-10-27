const path = require('path');

module.exports = {
  PORT: process.env.PORT || 3000,
  ALLOWED_ORIGIN: 'https://xwing.lemmerfamily.net',
  STATE_FILE: path.join(__dirname, '..', 'game-state.json'),
  // Fields clients may write via POST /update
  ALLOWED_FIELDS: [
    'round', 'lists', 'shipState', 'missionPts', 'pendingMission', 'missionHistory',
    'gameMode', 'gameTimerSecs', 'gameTimerRunning', 'gameTimerStartedAt',
    'roundTimerSecs', 'roundTimerRunning', 'roundTimerStartedAt',
  ],
};
