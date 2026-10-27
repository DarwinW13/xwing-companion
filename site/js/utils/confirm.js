// Two-tap confirmation for destructive buttons: first tap arms (button turns red and asks),
// second tap within `ms` runs the action; otherwise it disarms.
export function twoTap(el, action, { text = 'Tap again to confirm', ms = 3000 } = {}) {
  if (el._armTimer) {
    clearTimeout(el._armTimer);
    disarm(el);
    action();
    return;
  }
  el._origHtml = el.innerHTML;
  el.classList.add('armed');
  el.textContent = text;
  el._armTimer = setTimeout(() => disarm(el), ms);
}

function disarm(el) {
  el._armTimer = null;
  el.classList.remove('armed');
  el.innerHTML = el._origHtml;
}
