const crypto = require('crypto');
const express = require('express');
const { ALLOWED_FIELDS } = require('./config');
const store = require('./store');
const hub = require('./hub');

const router = express.Router();

function newCode() {
  let code;
  do { code = crypto.randomBytes(3).toString('hex').toUpperCase(); } while (store.exists(code));
  return code;
}

// Create a new, independent session
router.post('/session/new', (req, res) => {
  const sessionId = newCode();
  const state = store.defaultState(sessionId);
  const mode = req.body && req.body.gameMode;
  if (mode === 'standard' || mode === 'fangs') {
    state.gameMode = mode;
    state.gameTimerSecs = mode === 'fangs' ? 60 * 60 : 75 * 60;
  }
  store.writeState(sessionId, state);
  res.json({ sessionId });
});

// Everything below is scoped to one session code
router.use('/session/:code', (req, res, next) => {
  const code = String(req.params.code).toUpperCase();
  const state = store.readState(code);
  if (!state) return res.status(404).json({ error: 'session not found' });
  req.code = code;
  req.state = state;
  next();
});

router.get('/session/:code/state', (req, res) => res.json(req.state));

router.get('/session/:code/events', (req, res) => hub.subscribe(req.code, req, res, req.state));

router.post('/session/:code/update', (req, res) => {
  const incoming = req.body || {};
  const state = req.state;
  ALLOWED_FIELDS.forEach(k => { if (k in incoming) state[k] = incoming[k]; });
  store.writeState(req.code, state);
  hub.broadcast(req.code, state);
  res.json({ ok: true });
});

module.exports = router;
