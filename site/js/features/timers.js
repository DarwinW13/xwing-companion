// Both timers are instances of one wall-clock timer (survives phone sleep).
import { state } from '../state.js';
import { $, formatTime } from '../utils/format.js';
import { ensureAudio, playWarning, playExpired, scheduleAlarms, cancelAlarms } from '../utils/audio.js';
import { twoTap } from '../utils/confirm.js';
import { emit } from '../utils/bus.js';
import { registerActions } from '../utils/actions.js';

function createTimer({ prefix, duration, warnAt }) {
  // prefix: 'game' | 'round' – matches element ids and the wire format keys
  const t = { secs: 0, secsAtStart: 0, startedAt: null, running: false, interval: null };
  const el = () => $(prefix + '-timer-display');
  const setBtn = (running, label) => {
    $(prefix + '-timer-icon').className = 'ti ' + (running ? 'ti-player-pause' : 'ti-player-play');
    $(prefix + '-toggle-label').textContent = label;
  };
  const remaining = () =>
    Math.max(0, t.secsAtStart - Math.floor((Date.now() - t.startedAt) / 1000));

  // Pre-schedule warning + expiry beeps on the audio clock for the time remaining
  const schedule = () => scheduleAlarms(prefix, t.secs > warnAt ? t.secs - warnAt : null, t.secs);

  function tick() {
    const prev = t.secs;
    t.secs = remaining();
    el().textContent = formatTime(t.secs);
    if (prev > warnAt && t.secs <= warnAt && t.secs > 0) { el().classList.add('warning'); playWarning(prefix); }
    if (t.secs <= 0) {
      clearInterval(t.interval);
      t.running = false;
      setBtn(false, 'Start');
      el().textContent = 'Time!';
      el().classList.add('warning');
      playExpired(prefix);
      emit('activity');
    }
  }

  function startLocal(secs, startedAt) {
    t.startedAt = startedAt; t.secsAtStart = secs; t.secs = secs; t.running = true;
    setBtn(true, 'Pause');
    clearInterval(t.interval);
    t.interval = setInterval(tick, 500);
    t.secs = remaining();   // account for time already elapsed (remote start)
    el().textContent = formatTime(t.secs);
    schedule();
    emit('activity');
  }

  function stopLocal() {
    clearInterval(t.interval);
    t.running = false;
    cancelAlarms(prefix);
    emit('activity');
  }

  function toggle() {
    ensureAudio();
    if (t.running) {
      t.secs = remaining();
      stopLocal();
      setBtn(false, 'Resume');
    } else {
      if (t.secs <= 0) return;
      startLocal(t.secs, Date.now());
    }
    emit('changed');
  }

  function reset() {
    stopLocal();
    t.startedAt = null;
    t.secs = t.secsAtStart = duration();
    setBtn(false, 'Start');
    el().classList.remove('warning');
    el().textContent = formatTime(t.secs);
  }

  // Apply the timer fields from a server snapshot.
  function applyRemote(secs, running, startedAt) {
    if (typeof secs !== 'number') return;
    if (running && !t.running) {
      startLocal(secs, startedAt || Date.now());
    } else if (!running && t.running) {
      t.secs = t.secsAtStart = secs; t.startedAt = null;
      stopLocal();
      setBtn(false, 'Resume');
    }
    // While running locally, the wall-clock baseline is authoritative – don't touch it.
    if (!t.running) { t.secs = secs; el().textContent = formatTime(Math.max(0, secs)); }
    el().classList.toggle('warning', t.secs <= warnAt && t.secs > 0);
  }

  // Remote snapshot value: while running, send the BASELINE (secsAtStart) so receivers
  // computing elapsed from startedAt don't subtract the elapsed time twice.
  const wireSecs = () => (t.running ? t.secsAtStart : t.secs);
  return { t, toggle, reset, tick, applyRemote, wireSecs };
}

const game  = createTimer({ prefix: 'game',  duration: () => (state.mode === 'fangs' ? 60 : 75) * 60, warnAt: 300 });
const round = createTimer({ prefix: 'round', duration: () => 2 * 60, warnAt: 10 });

export const resetTimers = () => { game.reset(); round.reset(); };

// Re-sync displays after the phone was asleep / tab hidden
export function resyncTimers() {
  if (game.t.running) game.tick();
  if (round.t.running) round.tick();
}
export const gameTimerInProgress = () =>
  game.t.running || game.t.secs !== (state.mode === 'fangs' ? 60 : 75) * 60;
export const anyTimerRunning = () => game.t.running || round.t.running;

// Wire format shared with server.js (flat keys)
export const timerSnapshot = () => ({
  gameTimerSecs: game.wireSecs(), gameTimerRunning: game.t.running, gameTimerStartedAt: game.t.startedAt,
  roundTimerSecs: round.wireSecs(), roundTimerRunning: round.t.running, roundTimerStartedAt: round.t.startedAt,
});
export function applyRemoteTimers(s) {
  game.applyRemote(s.gameTimerSecs, s.gameTimerRunning, s.gameTimerStartedAt);
  round.applyRemote(s.roundTimerSecs, s.roundTimerRunning, s.roundTimerStartedAt);
}

export function initTimers() {
  registerActions({
    toggleGameTimer: game.toggle,
    resetGameTimer: (d, el) => twoTap(el, () => { game.reset(); emit('changed'); }, { text: 'Tap again to reset' }),
    toggleRoundTimer: round.toggle,
    resetRoundTimer: () => { round.reset(); emit('changed'); },
  });
  resetTimers();
}
