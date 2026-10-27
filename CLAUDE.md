# X-Wing Companion

Mobile web app for X-Wing Miniatures under X-Wing Alliance (XWA) 2.5 rules, used on iPhone Safari and Android Chrome.
Tabs: Setup (live-session QR code, XWS list paste, random scenario picker), Tracker (timers, rounds, scoring sheet), Rules (link to PDF).
A second player joins by scanning the session QR, which opens `<app url>?join=CODE` and auto-connects (`autoJoinFromUrl` in `session.js`). QR rendering uses the vendored MIT-licensed `site/js/vendor/qrcode.mjs` (no build step, no CDN).

## Layout
- `site/` – static client, uploaded as-is via cPanel File Manager to xwing.lemmerfamily.net. **No build step** (Namecheap shared hosting). Must work over HTTPS as native ES modules.
- `server/` – Node/Express sync server at api.xwing.lemmerfamily.net (cPanel "Setup Node.js App", startup file `server.js`). **Restart the app after any server change.** Supports many simultaneous sessions: one JSON file per session in `server/sessions/` (gitignored), SSE clients grouped by code, idle sessions deleted after 24h. Routes: `POST /session/new`, `GET /session/:code/{state,events}`, `POST /session/:code/update`.
- Details and "adding a feature" steps are in README.md.

## Conventions
- Markup uses `data-action="name"` (+ `data-*` args); handlers are registered with `registerActions` in a `js/features/*.js` module and wired from `js/main.js`. No inline `onclick`.
- Shared state lives in `js/state.js` and is mutated in place (never reassigned).
- Modules talk through `js/utils/bus.js`: emit `'changed'` after a local state mutation (pushes to the session), `'scores'` to re-render scores/sheet, `'activity'` when timers or the session start/stop (drives wake lock). Don't import features circularly.
- Escape any user/remote text (pilot names etc.) with `esc()` before `innerHTML`.
- Server wire format is flat (`gameTimerSecs`, `gameTimerRunning`, `gameTimerStartedAt`, ...) and whitelisted in `server/src/config.js`. Keep client and server in sync.
- Timers are wall-clock based (`Date.now()`), so they survive phone sleep. While running, the synced value is the *baseline* (`secsAtStart`), not the remaining time – otherwise receivers double-count elapsed time.
- Audio alarms are pre-scheduled on the Web Audio clock at timer start (needs a user gesture to unlock).

## Intentional UI decisions – do not change without asking
- Scenario sections are collapsed by default; there is no "Pick another" button.
- Scenario text is the official XWA 2.5 text. Never invent scenario content.
- Score sliders were replaced by the XWS bottom-sheet scoring; mission points are 0/2/4 from round 2, committed on round advance or via the submit button.
- Destructive buttons (game timer reset, reset all) use two-tap confirmation.

## Testing
No test suite. Serve `site/` (`python3 -m http.server`) and drive it with Playwright; check the console for errors. Server: `cd server && npm install && PORT=3917 node server.js`, then curl the routes above. For a local client, set `window.XWING_API='http://localhost:3917'` and start the server with `ALLOWED_ORIGIN=http://localhost:8123`.

## Known gaps
- Audio is unverified on real iOS/Android devices.
- Cross-device timer sync assumes phone clocks agree (uses `Date.now()` from the sender).
- `submitMissionPts` (mid-round submit) is not undone by decrementing the round.
