import { registerActions } from '../utils/actions.js';

export function initTabs() {
  registerActions({
    showTab: (d, btn) => {
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.getElementById('tab-' + d.tab).classList.add('active');
      btn.classList.add('active');
    },
  });
}
