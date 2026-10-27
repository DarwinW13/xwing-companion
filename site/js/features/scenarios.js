import { SCENARIOS } from '../data/scenarios.js';
import { state } from '../state.js';
import { registerActions } from '../utils/actions.js';
import { $, esc } from '../utils/format.js';

const sections = s => [
  { title: 'Setup', html: s.setup.map((t, i) => `<div class="step"><div class="step-num">${i + 1}</div><p>${esc(t)}</p></div>`).join('') },
  { title: 'Scoring', html: s.scoring.map(bullet).join('') },
  { title: 'Victory conditions', html: s.winning.map(bullet).join('') },
  { title: 'Scenario rules', html: s.notes.map(n => `<div class="note-item">${esc(n)}</div>`).join('') },
];
const bullet = t => `<div class="score-row"><div class="score-dot"></div><p>${esc(t)}</p></div>`;

function pickScenario() {
  let idx;
  do { idx = Math.floor(Math.random() * SCENARIOS.length); }
  while (idx === state.lastScenario && SCENARIOS.length > 1);
  state.lastScenario = idx;
  const s = SCENARIOS[idx];

  $('badge').textContent = `Scenario ${idx + 1} of ${SCENARIOS.length}`;
  $('sname').textContent = s.name;
  $('stagline').textContent = s.tagline;
  $('sobjectives').textContent = s.objectives;

  const el = $('sections');
  el.innerHTML = '';
  sections(s).forEach(def => {
    const sec = document.createElement('div');
    sec.className = 'section';
    sec.innerHTML = `<div class="section-header" data-action="toggleSection"><span class="section-title">${def.title}</span><i class="ti ti-chevron-down section-chevron" aria-hidden="true"></i></div><div class="section-body">${def.html}</div>`;
    el.appendChild(sec);
  });
  $('result').classList.add('visible');
  $('result').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

export function initScenarios() {
  registerActions({
    pickScenario,
    toggleSection: (d, el) => el.parentElement.classList.toggle('open'),
  });
}
