// Official XWA 2.5 scenario text. Edit here; no other file needs to change.
export const SCENARIOS = [
  {
    "name": "ASSAULT AT THE SATELLITE ARRAY",
    "tagline": "Take control of the Satellite Array before enemy forces do.",
    "objectives": "5 Satellites",
    "setup": [
      "At the start of the Place Obstacles step of Setup, place one satellite in the center of the play area.",
      "Then, starting with the first player, players take turns placing the remaining four satellites at range 3 of the center satellite and beyond range 2 of each other satellite.",
      "The first satellite placed by each player must be placed at range 2-4 of their board edge.",
      "The second satellite placed by each player must be placed at range 2-4 of their opponent's board edge.",
      "Once all five satellites have been placed, players place obstacles as described in the Rules Reference. Obstacles cannot be placed overlapping a satellite."
    ],
    "scoring": [
      "The first time a ship is reduced to half its health (combined total hull and shields, including any modifications to hull and shields via cards such as Hull upgrade or Shield upgrade), the opposing player immediately gains mission points equal to half the squad point value of the destroyed ship, rounded down.",
      "When an enemy ship is destroyed or removed from the game, the opposing player gains mission points equal to half the squad point value of that ship, rounded up. If no mission points were scored earlier in the game from a ship that has been removed from the game being reduced to half its health, the opposing player gains mission points equal to the squad point value of that ship instead.",
      "Starting on the second round, at the start of the End Phase, each player earns 2 mission points if they control at least 1 satellite, or 4 mission points instead if they control more satellites than their opponent.",
      "A player controls a satellite if they have more ships at range 0-1 of the satellite than any other player. When determining control of a satellite, medium and large ships each count as two ships."
    ],
    "winning": [
      "At the end of the End Phase, if only one player has ships remaining in the play area, they win the game, regardless of other victory conditions.",
      "At the end of the End Phase, if one player has 50 or more mission points and has more mission points than their opponent, the game ends.",
      "At the end of the twelfth round, or at the end of the first End Phase after time has expired, the game ends.",
      "At the end of the game, if both players have at least one ship remaining in the play area, the player with the most mission points wins."
    ],
    "notes": [
      "SATELLITE — A satellite is a scenario feature."
    ]
  },
  {
    "name": "CHANCE ENGAGEMENT",
    "tagline": "Defeat enemy forces to force a retreat from the sector.",
    "objectives": "1 Satellite",
    "setup": [
      "At the start of the Place Obstacles step of Setup, place one satellite in the center of the play area.",
      "Then, players place obstacles as described in the Rules Reference. Obstacles cannot be placed overlapping a satellite."
    ],
    "scoring": [
      "The first time a ship is reduced to half its health (combined total hull and shields, including any modifications to hull and shields via cards such as Hull upgrade or Shield upgrade), the opposing player immediately gains mission points equal to half the squad point value of the destroyed ship, rounded down.",
      "When an enemy ship is destroyed or removed from the game, the opposing player gains mission points equal to half the squad point value of that ship, rounded up. If no mission points were scored earlier in the game from a ship that has been removed from the game being reduced to half its health, the opposing player gains mission points equal to the squad point value of that ship instead.",
      "Starting on the second round, at the start of the End Phase, each player earns 2 mission points if they contest the satellite. If only one player is contesting the satellite, that player scores two additional mission points.",
      "A player contests the satellite if they have one or more ships at range 0-2 of the satellite."
    ],
    "winning": [
      "At the end of the End Phase, if only one player has ships remaining in the play area, they win the game, regardless of other victory conditions.",
      "At the end of the End Phase, if one player has 50 or more mission points and has more mission points than their opponent, the game ends.",
      "At the end of the twelfth round, or at the end of the first End Phase after time has expired, the game ends.",
      "At the end of the game, if both players have at least one ship remaining in the play area, the player with the most mission points wins."
    ],
    "notes": [
      "SATELLITE — A satellite is a scenario feature."
    ]
  },
  {
    "name": "SALVAGE MISSION",
    "tagline": "Retrieve as many supply caches as possible before the enemy.",
    "objectives": "5 Supply Caches",
    "setup": [
      "At the start of the Place Obstacles step of Setup, place one supply cache in the center of the play area.",
      "Then, starting with the first player, players take turns placing the remaining four supply caches at range 3 of the center supply cache and beyond range 2 of each other supply cache.",
      "The first supply cache placed by each player must be placed at range 2-4 of their board edge.",
      "The second supply cache placed by each player must be placed at range 2-4 of their opponent's board edge.",
      "Once all five supply caches have been placed, players place obstacles as described in the Rules Reference. Obstacles cannot be placed overlapping a supply cache."
    ],
    "scoring": [
      "The first time a ship is reduced to half its health (combined total hull and shields, including any modifications to hull and shields via cards such as Hull upgrade or Shield upgrade), the opposing player immediately gains mission points equal to half the squad point value of the destroyed ship, rounded down.",
      "When an enemy ship is destroyed or removed from the game, the opposing player gains mission points equal to half the squad point value of that ship, rounded up. If no mission points were scored earlier in the game from a ship that has been removed from the game being reduced to half its health, the opposing player gains mission points equal to the squad point value of that ship instead.",
      "Starting on the second round, at the start of the End Phase, players earn 2 mission points if they have at least 1 supply cache on a friendly ship's card, or 4 mission points instead if they have more supply caches on friendly ship's cards than their opponent has on their ships."
    ],
    "winning": [
      "At the end of the End Phase, if only one player has ships remaining in the play area, they win the game, regardless of other victory conditions.",
      "At the end of the End Phase, if one player has 50 or more mission points and has more mission points than their opponent, the game ends.",
      "At the end of the twelfth round, or at the end of the first End Phase after time has expired, the game ends.",
      "At the end of the game, if both players have at least one ship remaining in the play area, the player with the most mission points wins."
    ],
    "notes": [
      "SUPPLY CACHE — A supply cache is a scenario feature. Ships can use the scenario action to interact with these scenario features starting on the second round.",
      "SCENARIO ACTION [TOW] — When a ship performs a tow action, choose a supply cache at range 0-1. Remove the chosen supply cache from the play area and place it on the ship's card. A ship can have only one supply cache on its card. Then, place one of your player markers next to the ship's miniature to show that it is towing a supply cache. If there is no supply cache in range, the action fails. After a ship performs a tow action, it removes any cloak tokens it has.",
      "At the end of a ship's activation, a ship may choose to jettison its supply cache. If it does, remove the supply cache from the ship's card, then the opposing player places it in the play area anywhere at range 1 of that ship.",
      "While a ship is towing a supply cache, it cannot perform barrel roll actions, boost actions, cloak actions, SLAM actions, or gain cloak tokens.",
      "When a ship that is towing a supply cache suffers a crit damage or is destroyed, the supply cache is jettisoned. Remove the supply cache from the ship's card, then the opposing player places the marker at range 1 of that ship.",
      "When a ship that is towing a supply cache is placed in reserve, the supply cache is jettisoned from the ship's position before the ship is placed on its ship card.",
      "When a ship that is towing a supply cache flees the battlefield, the supply cache is jettisoned from the ship's position before it executed its maneuver."
    ]
  },
  {
    "name": "SCRAMBLE THE TRANSMISSIONS",
    "tagline": "Scramble the transmissions from the satellites to deny enemy forces valuable information.",
    "objectives": "3 Satellites",
    "setup": [
      "At the start of the Place Obstacles step of Setup, place one satellite in the center of the play area.",
      "Then, starting with the first player, players take turns placing the remaining two satellites at range 3 of the center satellite and beyond range 2 of each other satellite.",
      "When a player places a satellite, it must be placed at range 2-4 of their opponent's board edge.",
      "Once all three satellites have been placed, players place obstacles as described in the Rules Reference. Obstacles cannot be placed overlapping a satellite."
    ],
    "scoring": [
      "The first time a ship is reduced to half its health (combined total hull and shields, including any modifications to hull and shields via cards such as Hull upgrade or Shield upgrade), the opposing player immediately gains mission points equal to half the squad point value of the destroyed ship, rounded down.",
      "When an enemy ship is destroyed or removed from the game, the opposing player gains mission points equal to half the squad point value of that ship, rounded up. If no mission points were scored earlier in the game from a ship that has been removed from the game being reduced to half its health, the opposing player gains mission points equal to the squad point value of that ship instead.",
      "Starting on the second round, at the start of the End Phase, each player earns 2 mission points if they control at least 1 satellite, or 4 mission points instead if they control more satellites than their opponent. The player whose marker is on each satellite controls that objective."
    ],
    "winning": [
      "At the end of the End Phase, if only one player has ships remaining in the play area, they win the game, regardless of other victory conditions.",
      "At the end of the End Phase, if one player has 50 or more mission points and has more mission points than their opponent, the game ends.",
      "At the end of the twelfth round, or at the end of the first End Phase after time has expired, the game ends.",
      "At the end of the game, if both players have at least one ship remaining in the play area, the player with the most mission points wins."
    ],
    "notes": [
      "SATELLITE — Ships can use the scenario action to interact with these scenario features starting on the second round.",
      "SCENARIO ACTION [SCRAMBLE] — When a ship performs a scramble action, choose a satellite at range 0-1 and place one of your player markers on the chosen satellite. If the chosen satellite has another player's marker on it, remove it before placing your own. If there is no satellite in range, the action fails. While a satellite is marked with a player's marker, that player controls the satellite."
    ]
  },
  {
    "name": "ANCIENT KNOWLEDGE",
    "tagline": "Find forgotten knowledge, and use it to your advantage against your enemy.",
    "objectives": "3 Data Caches",
    "setup": [
      "At the start of the Place Obstacles step of Setup, place one data cache in the center of the play area.",
      "Then, starting with the first player, players take turns placing the remaining two data caches at range 3 of the center data cache and beyond range 2 of each other data cache.",
      "When a player places a data cache, it must be placed at range 2-4 of their opponent's board edge.",
      "Once all three data caches have been placed, players place obstacles as described in the Rules Reference. Obstacles cannot be placed overlapping a data cache."
    ],
    "scoring": [
      "The first time a ship is reduced to half its health (combined total hull and shields, including any modifications to hull and shields via cards such as Hull upgrade or Shield upgrade), the opposing player immediately gains mission points equal to half the squad point value of the destroyed ship, rounded down.",
      "When an enemy ship is destroyed or removed from the game, the opposing player gains mission points equal to half the squad point value of that ship, rounded up. If no mission points were scored earlier in the game from a ship that has been removed from the game being reduced to half its health, the opposing player gains mission points equal to the squad point value of that ship instead.",
      "Starting on the second round, at the start of the End Phase, each player earns 2 mission points if at least 1 of their ships has the Ancient Knowledge condition, or 4 mission points instead if they have more ships with the Ancient Knowledge condition than their opponent.",
      "If a player scores 4 mission points, they must choose one of their ships to lose the Ancient Knowledge condition."
    ],
    "winning": [
      "At the end of the End Phase, if only one player has ships remaining in the play area, they win the game, regardless of other victory conditions.",
      "At the end of the End Phase, if one player has 50 or more mission points and has more mission points than their opponent, the game ends.",
      "At the end of the twelfth round, or at the end of the first End Phase after time has expired, the game ends.",
      "At the end of the game, if both players have at least one ship remaining in the play area, the player with the most mission points wins."
    ],
    "notes": [
      "DATA CACHE — A data cache is a scenario feature. At the beginning of the game, each data cache is assigned a charge token, placed on its Active side. After scoring, each data cache with an inactive charge recovers its charge. Ships can use the scenario action to interact with these scenario features starting on the second round.",
      "SCENARIO ACTION [TRANSMIT] — When a ship performs a Transmit action, choose a data cache at range 0-1. Spend that cache's charge to assign the Ancient Knowledge condition to that ship. If there is no active data cache in range, the action fails. A ship cannot perform this action if it already has the Ancient Knowledge condition.",
      "ANCIENT KNOWLEDGE CONDITION — You can only be assigned one Ancient Knowledge condition. While you defend or perform an attack, you may discard this condition to change 1 of your results to a hit or evade result. When you flee the battlefield or are put on reserve, and after you are destroyed, remove this condition."
    ]
  }
];
