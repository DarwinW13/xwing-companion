// Mode toggle, round counter, reset-all
import { state, MAX_ROUND } from '../state.js';
import { $ } from '../utils/format.js';
import { emit } from '../utils/bus.js';
import { registerActions } from '../utils/actions.js';
import { resetTimers, gameTimerInProgress } from './timers.js';
import { twoTap } from '../utils/confirm.js';
import { commitRound, undoRound, resetScores } from './scoring.js';
import { closeSheet } from './sheet.js';

export function setMode(mode) {
  state.mode = mode;
  const fangs = mode === 'fangs';
  $('mode-standard').classList.toggle('active', !fangs);
  $('mode-fangs').classList.toggle('active', fangs);
  $('game-timer-label').innerHTML =
    `<i class="ti ti-clock" aria-hidden="true" style="font-size:13px;margin-right:4px;"></i>Game timer — ${fangs ? 60 : 75} min`;
  $('round-timer-card').style.display = fangs ? 'block' : 'none';
  resetTimers();
  emit('changed');
}

export function setRound(n) {
  state.round = n;
  $('round-val').textContent = n;
}

function adjustRound(d) {
  const next = Math.max(1, Math.min(MAX_ROUND, state.round + d));
  if (next > state.round) commitRound();
  else if (next < state.round) undoRound();
  setRound(next);
  emit('scores');
  emit('changed');
}

function resetAll() {
  resetTimers();
  setRound(1);
  resetScores();
  closeSheet();
  emit('changed');
}

export function initTracker() {
  registerActions({
    setMode: d => {
      if (d.mode === state.mode) return;
      if (gameTimerInProgress() && !confirm('Switching modes will reset the game timer. Continue?')) return;
      setMode(d.mode);
    },
    adjustRound: d => adjustRound(Number(d.delta)),
    resetAll: (d, el) => twoTap(el, resetAll, { text: 'Tap again to reset everything' }),
  });
}
