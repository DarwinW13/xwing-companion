// Bottom-sheet scoring UI
import { state, lists, shipState, pendingMission, missionPts, opponentOf } from '../state.js';
import { $, esc } from '../utils/format.js';
import { on } from '../utils/bus.js';
import { registerActions } from '../utils/actions.js';
import { calcShipPts, toggleShipState, setPendingMission, submitMissionPts } from './scoring.js';

let active = null;   // 1 | 2 | null

function shipRow(player, pilot, i) {
  const pts = pilot.points || 0, half = Math.floor(pts / 2);
  const st = shipState[player][i] || 'none';
  const earned = st === 'half' ? `+${half} pts (half)` : st === 'full' ? `+${pts} pts (destroyed)` : '';
  return `
    <div class="ship-row">
      <div class="ship-info">
        <div class="ship-name">${esc(pilot.name)}</div>
        ${earned ? `<div class="ship-pts-earned">${earned}</div>` : `<div class="ship-pts">${half} / ${pts} pts</div>`}
      </div>
      <div class="ship-btns">
        <button class="ship-btn half ${st === 'half' ? 'active-half' : ''}" data-action="shipState" data-player="${player}" data-idx="${i}" data-type="half">½</button>
        <button class="ship-btn full ${st === 'full' ? 'active-full' : ''}" data-action="shipState" data-player="${player}" data-idx="${i}" data-type="full">✕</button>
      </div>
    </div>`;
}

function missionSection(player) {
  const off = state.round < 2;
  const pend = pendingMission[player];
  let html = `<div class="mission-row"><div class="mission-label">Mission points this round${off ? ' (available from round 2)' : ''}</div><div class="mission-btns">`;
  [0, 2, 4].forEach(val => {
    html += `<button class="mission-btn ${pend === val && !off ? 'active' : ''}" ${off ? 'style="opacity:0.4;pointer-events:none;"' : ''} data-action="pendingMission" data-player="${player}" data-val="${val}">${val}</button>`;
  });
  html += '</div>';
  if (!off && pend > 0) {
    html += `<button data-action="submitMission" data-player="${player}" style="margin-top:10px;width:100%;padding:0.55rem;border:0.5px solid #1D9E75;border-radius:var(--border-radius-md);background:#E1F5EE;color:#0F6E56;font-size:14px;font-weight:500;cursor:pointer;">Add ${pend} mission pts to score</button>`;
  }
  return html + '</div>';
}

export function renderSheet() {
  if (!active) return;
  const player = active, oppList = lists[opponentOf(player)];
  let html = '<div class="ship-section-label">Opponent\'s ships</div>';
  html += !oppList || oppList.pilots.length === 0
    ? '<div style="padding:12px 16px;font-size:13px;color:var(--color-text-secondary);">Load opponent\'s XWS list to enable ship tracking.</div>'
    : oppList.pilots.map((p, i) => shipRow(player, p, i)).join('');
  html += missionSection(player);
  $('sheet-body').innerHTML = html;

  const pending = state.round >= 2 ? pendingMission[player] : 0;
  $('sheet-total').textContent = (calcShipPts(player) + missionPts[player] + pending) + ' pts';
}

function openSheet(player) {
  active = player;
  $('sheet-title').textContent = `Player ${player} — Scoring`;
  renderSheet();
  $('sheet-overlay').classList.add('open');
  requestAnimationFrame(() => $('score-sheet').classList.add('open'));
}

export function closeSheet() {
  $('score-sheet').classList.remove('open');
  $('sheet-overlay').classList.remove('open');
  active = null;
}

export function initSheet() {
  on('scores', renderSheet);
  registerActions({
    openSheet: d => openSheet(Number(d.player)),
    closeSheet,
    shipState: d => toggleShipState(Number(d.player), Number(d.idx), d.type),
    pendingMission: d => setPendingMission(Number(d.player), Number(d.val)),
    submitMission: d => submitMissionPts(Number(d.player)),
  });
}
