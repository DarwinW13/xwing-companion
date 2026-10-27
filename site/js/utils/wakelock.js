// Screen stays on while wanted() is true (a timer is running or a live session is open).
let lock = null;

async function acquire() {
  if (lock || !('wakeLock' in navigator)) return;
  try {
    lock = await navigator.wakeLock.request('screen');
    lock.addEventListener('release', () => { lock = null; });
  } catch { /* denied or unsupported */ }
}

function release() {
  if (lock) { lock.release(); lock = null; }
}

export const updateWakeLock = wanted => (wanted ? acquire() : release());
