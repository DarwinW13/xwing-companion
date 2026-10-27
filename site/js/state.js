// Shared game state. Objects are mutated in place, never reassigned,
// so every module sees the same references.
export const state = {
  mode: 'standard',        // 'standard' | 'fangs'
  round: 1,                // 1–12
  sessionId: null,
  lastScenario: -1,
};

// Per-player data, keyed by player number (1 or 2)
export const lists = { 1: null, 2: null };        // { name, pilots:[{name,ship,points}] }
export const shipState = { 1: [], 2: [] };        // 'none'|'half'|'full' per OPPONENT pilot index
export const missionPts = { 1: 0, 2: 0 };         // committed mission points
export const pendingMission = { 1: 0, 2: 0 };     // this round's selection (0|2|4)
export const missionHistory = [];                 // [{round,p1,p2}] one per committed round

export const PLAYERS = [1, 2];
export const opponentOf = p => (p === 1 ? 2 : 1);
export const MAX_ROUND = 12;
