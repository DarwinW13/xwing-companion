const crypto = require('crypto');
const express = require('express');
const { ALLOWED_FIELDS } = require('./config');
const { defaultState, readState, writeState } = require('./store');
const hub = require('./hub');

const router = express.Router();

router.get('/state', (req, res) => res.json(readState()));

router.get('/events', (req, res) => hub.subscribe(req, res, readState()));

// Create a fresh session (wipes state)
router.post('/session/new', (req, res) => {
  const sessionId = crypto.randomBytes(3).toString('hex').toUpperCase();   // e.g. "A3F9C2"
  const state = { ...defaultState(), sessionId };
  const mode = req.body && req.body.gameMode;
  if (mode) {
    state.gameMode = mode;
    state.gameTimerSecs = mode === 'fangs' ? 60 * 60 : 75 * 60;
  }
  writeState(state);
  hub.broadcast(state);
  res.json({ sessionId });
});

// Merge whitelisted fields from a client
router.post('/update', (req, res) => {
  const incoming = req.body || {};
  const state = readState();
  if (incoming.sessionId && state.sessionId && incoming.sessionId !== state.sessionId) {
    return res.status(409).json({ error: 'session mismatch' });
  }
  ALLOWED_FIELDS.forEach(k => { if (k in incoming) state[k] = incoming[k]; });
  writeState(state);
  hub.broadcast(state);
  res.json({ ok: true });
});

module.exports = router;
