// Alarms are PRE-SCHEDULED on the audio clock when a timer starts, so they fire on time
// even if JS timers are throttled (screen dimmed / tab backgrounded). Needs one user gesture to unlock.
let ctx = null;
const scheduled = {};   // key -> [oscillator nodes]

export function ensureAudio() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    // iOS: playing a silent buffer inside a gesture fully unlocks output
    const src = ctx.createBufferSource();
    src.buffer = ctx.createBuffer(1, 1, 22050);
    src.connect(ctx.destination);
    src.start(0);
  }
  if (ctx.state === 'suspended') ctx.resume();
}

function tone(freq, startAt, dur, vol = 0.4) {
  const osc = ctx.createOscillator(), gain = ctx.createGain();
  osc.connect(gain); gain.connect(ctx.destination);
  osc.type = 'sine'; osc.frequency.value = freq;
  gain.gain.setValueAtTime(vol, startAt);
  gain.gain.exponentialRampToValueAtTime(0.001, startAt + dur);
  osc.start(startAt); osc.stop(startAt + dur);
  return osc;
}

const WARNING = [[660, 0, 0.2]];
const EXPIRED = [[880, 0, 0.3], [660, 0.32, 0.3], [440, 0.64, 0.6]];   // [freq, offset, dur]

export function cancelAlarms(key) {
  (scheduled[key] || []).forEach(o => { try { o.stop(); } catch { /* already stopped */ } });
  delete scheduled[key];
}

// warnIn / expireIn: seconds from now (warnIn may be null)
export function scheduleAlarms(key, warnIn, expireIn) {
  cancelAlarms(key);
  if (!ctx) return;
  const now = ctx.currentTime, nodes = [];
  if (warnIn != null && warnIn > 0) WARNING.forEach(([f, o, d]) => nodes.push(tone(f, now + warnIn + o, d)));
  if (expireIn > 0) EXPIRED.forEach(([f, o, d]) => nodes.push(tone(f, now + expireIn + o, d)));
  scheduled[key] = nodes;
}

export const hasAlarms = key => !!scheduled[key];

// Fallbacks used by the display tick only when nothing was pre-scheduled
function playNow(pattern) { if (ctx) pattern.forEach(([f, o, d]) => tone(f, ctx.currentTime + o, d)); }
export const playWarning = key => { if (!hasAlarms(key)) playNow(WARNING); };
export const playExpired = key => { if (!hasAlarms(key)) playNow(EXPIRED); };
