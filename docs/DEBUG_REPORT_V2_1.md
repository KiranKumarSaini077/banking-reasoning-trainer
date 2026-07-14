# V2.1 Deep Debug Report

## Root cause of the screenshot
The screenshot shows that HTML and CSS loaded but `app.js` did not execute: navigation was empty, dashboard content was empty, and the theme select had no generated options.

The most likely trigger is direct `file://` opening. Native ES modules and JSON fetch are intentionally restricted by modern browsers in this context. V2 documented the HTTP requirement but failed badly: it left a blank shell instead of explaining the problem.

## Confirmed code defect
### String answer corruption in Skill Gym
V2 used `Number(button.dataset.answer)` for every answer. Two gap exercises contain string answers. Those answers became `NaN`, making correct submission impossible.

Fixed by storing option indexes and retrieving the original typed value from `exercise.options`.

## Reliability defects fixed
1. Blank-screen startup failure had no visible diagnostic.
2. Route rendering errors were not caught by the router.
3. Service Worker fallback could return `index.html` for failed non-navigation requests, potentially turning JS/JSON failures into confusing MIME/syntax errors.
4. Old Service Worker cache could preserve stale broken assets.
5. Service Worker registration was attempted without an explicit protocol guard.
6. V2 had no one-click static-server launcher despite requiring HTTP.

## V2.1 safeguards
- `START_APP.bat` launches a local PowerShell static server.
- Startup watchdog detects `file://` and gives exact recovery instructions.
- Fatal bootstrap errors render visibly.
- Route errors render a retry/recovery screen.
- Service Worker uses navigation-only HTML fallback.
- Cache name bumped to `reasonforge-v2.1.0-fixed`.
- Typed answers are preserved.

## Static validation performed
- All JavaScript files syntax-checked.
- Both JSON datasets parsed.
- Every exercise correct answer verified to exist in its options.
- Every required module referenced by `app.js` exists.
- Every Service Worker precache path verified to exist.
- V2.1 ZIP built from the corrected source tree.

## Browser note
The application architecture requires an HTTP origin for its intended ES-module, fetch, IndexedDB, and Service Worker behavior. The included launcher provides that environment without Node.js.
