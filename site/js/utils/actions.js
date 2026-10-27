// Click delegation. Markup uses data-action="name" (plus any data-* args);
// handlers are registered by name and receive (dataset, element, event).
const registry = {};
export const registerActions = map => Object.assign(registry, map);

export function initActions() {
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-action]');
    if (!el) return;
    const fn = registry[el.dataset.action];
    if (fn) fn(el.dataset, el, e);
    else console.warn('No handler for action', el.dataset.action);
  });
}
