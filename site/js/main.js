import { initActions } from './utils/actions.js';
import { updateWakeLock } from './utils/wakelock.js';
import { ensureAudio } from './utils/audio.js';
import { on } from './utils/bus.js';
import { state } from './state.js';
import { initTabs } from './features/tabs.js';
import { initScenarios } from './features/scenarios.js';
import { initTimers, resyncTimers, anyTimerRunning } from './features/timers.js';
import { initTracker } from './features/tracker.js';
import { initXws } from './features/xws.js';
import { initSheet } from './features/sheet.js';
import { initSession, reconnectIfNeeded, autoJoinFromUrl } from './features/session.js';

initTabs();
initScenarios();
initTimers();
initTracker();
initXws();
initSheet();
initSession();
initActions();   // after all registerActions calls
autoJoinFromUrl();

// Phone woke up: resync timers, re-acquire wake lock, reconnect live sync
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState !== 'visible') return;
  resyncTimers();
  wake();
  reconnectIfNeeded();
});

// Keep the screen on while a timer is running or a live session is open; release otherwise
const wake = () => updateWakeLock(anyTimerRunning() || !!state.sessionId);
on('activity', wake);

// Unlock audio on the first touch anywhere, so a device that only *receives* a remote
// timer start can still beep
['pointerdown', 'keydown'].forEach(evt => document.addEventListener(evt, ensureAudio, { once: true }));
