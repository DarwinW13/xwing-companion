// Score math + mutations. No DOM except the two score numbers.
import { state, lists, shipState, missionPts, pendingMission, missionHistory, PLAYERS, opponentOf } from '../state.js';
import { $ } from '../utils/format.js';
import { emit } from '../utils/bus.js';

// Points a player has earned from the OPPONENT's ships
export function calcShipPts(player) {
  const oppList = lists[opponentOf(player)];
  if (!oppList) return 0;
  return oppList.pilots.reduce((sum, pilot, i) => {
    const pts = pilot.points || 0;
    const st = shipState[player][i] || 'none';
    return sum + (st === 'half' ? Math.floor(pts / 2) : st === 'full' ? pts : 0);
  }, 0);
}

export const calcTotal = p => calcShipPts(p) + missionPts[p];
export const updateScoreDisplay = p => { $('score' + p + '-num').textContent = calcTotal(p); };
export const updateAllScores = () => PLAYERS.forEach(updateScoreDisplay);

function changed() { updateAllScores(); emit('scores'); emit('changed'); }

export function toggleShipState(player, idx, type) {
  const cur = shipState[player][idx] || 'none';
  if (type === 'half') {
    if (cur === 'half') shipState[player][idx] = 'none';
    else if (cur === 'none') shipState[player][idx] = 'half';   // 'full' stays – can't un-destroy via half
  } else {
    shipState[player][idx] = cur === 'full' ? 'none' : 'full';
  }
  changed();
}

export function setPendingMission(player, val) {
  if (state.round < 2) return;
  pendingMission[player] = pendingMission[player] === val ? 0 : val;
  changed();
}

export function submitMissionPts(player) {
  if (state.round < 2 || pendingMission[player] === 0) return;
  missionPts[player] += pendingMission[player];
  pendingMission[player] = 0;
  changed();
}
// Note: individual submits are mid-round actions and are not undone by going back a round.

// Called when the round counter moves
export function commitRound() {
  missionHistory.push({ round: state.round, p1: pendingMission[1], p2: pendingMission[2] });
  PLAYERS.forEach(p => { missionPts[p] += pendingMission[p]; pendingMission[p] = 0; });
  updateAllScores();
}
export function undoRound() {
  const e = missionHistory.pop();
  if (!e) return;
  pendingMission[1] = e.p1; pendingMission[2] = e.p2;
  missionPts[1] -= e.p1;    missionPts[2] -= e.p2;
  updateAllScores();
}

export function resetScores() {
  missionHistory.length = 0;
  PLAYERS.forEach(p => {
    shipState[p] = lists[p] ? lists[p].pilots.map(() => 'none') : [];
    missionPts[p] = 0;
    pendingMission[p] = 0;
  });
  updateAllScores();
}
