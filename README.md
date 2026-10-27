# xwing-companion
Web app for tracking score and time for the  X-WIng Tabletop Miniatures Game, Version 2.5 (XWA).

## Layout
site/            upload contents to xwing.lemmerfamily.net (static, no build step)
  index.html     markup only; buttons use data-action="name"
  css/           one file per area (variables, tabs, scenarios, tracker, scoring, sheet, session, rules)
  js/main.js     wires everything together
  js/state.js    shared game state
  js/data/       scenarios.js (edit scenario text here)
  js/features/   tabs, scenarios, timers, tracker (mode/round/reset), scoring, xws, sheet, session
  js/utils/      actions (click delegation), bus (events), audio, wakelock, format
server/          upload to the Node app root; startup file stays server.js
  src/           config, store (JSON file), hub (SSE), routes, app

## Adding a feature
1. Put markup in index.html with data-action="myAction".
2. In a features/ module: registerActions({ myAction: (dataset, el) => ... }).
3. Call initX() from main.js. Emit 'changed' after state mutations to sync to the session.
