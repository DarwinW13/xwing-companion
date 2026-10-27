import { lists, shipState } from '../state.js';
import { $ } from '../utils/format.js';
import { emit } from '../utils/bus.js';
import { registerActions } from '../utils/actions.js';
import { updateScoreDisplay } from './scoring.js';

// Accepts xws.pilots or xws.roster[0].pilots
export function parseXws(text, player) {
  const xws = JSON.parse(text);
  const raw = xws.pilots || (xws.roster && xws.roster[0] && xws.roster[0].pilots) || [];
  return {
    name: xws.name || 'Player ' + player,
    pilots: raw.map(p => ({
      name: p.name || p.id || 'Unknown',
      ship: p.ship || '',
      points: typeof p.points === 'number' ? p.points : 0,
    })),
  };
}

export function loadXws(player, text) {
  try {
    lists[player] = parseXws(text, player);
    shipState[player] = lists[player].pilots.map(() => 'none');
    showListName(player);
    updateScoreDisplay(player);
    emit('scores');
    emit('changed');
  } catch {
    alert('Could not parse XWS. Make sure you copied the full JSON from your list builder.');
  }
}

export const showListName = p => {
  $('xws' + p + '-name').textContent = lists[p] ? (lists[p].name || 'List loaded') : 'No list loaded';
};

async function pasteXws(player) {
  let text = '';
  try { text = await navigator.clipboard.readText(); }
  catch { text = prompt('Paste your XWS JSON here:') || ''; }   // clipboard blocked → prompt
  if (text.trim()) loadXws(player, text);
}

export function initXws() {
  registerActions({ pasteXws: d => pasteXws(Number(d.player)) });
}
