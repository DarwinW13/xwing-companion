// Tiny pub/sub so feature modules don't import each other in circles.
//   'changed'      – local state changed by the user; session.js pushes it to the server
//   'scores'       – score data changed; sheet.js re-renders if open
const handlers = {};
export const on = (evt, fn) => (handlers[evt] ||= []).push(fn);
export const emit = (evt, ...args) => (handlers[evt] || []).forEach(fn => fn(...args));
