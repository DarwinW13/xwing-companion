export const formatTime = s =>
  String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');

// Escape user-supplied text (pasted XWS, synced from opponent) before using innerHTML.
export const esc = str => String(str).replace(/[&<>"']/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export const $ = id => document.getElementById(id);
