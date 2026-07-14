# V10.5.3

- START_APP.bat now launches the local server hidden, so the CMD window closes automatically.
- Added browser-tab heartbeat tracking. The local server shuts down after all app tabs are closed.
- Starting the app again still terminates any previous ReasonForge server before launching a fresh instance.
- Added a startup grace period and multi-tab-safe timeout behavior.

# V10.5.2 - Restart-safe launcher

- `START_APP.bat` now stops any existing ReasonForge local server process before starting a fresh instance.
- Re-running the launcher therefore restarts the app server instead of silently choosing another port.
- Preserves Python launcher detection, automatic browser opening, and PowerShell fallback.

# V10.4

- Added 40-puzzle practice bank: 10 center, 10 outside, 20 mixed.
- Added four difficulty tiers, Previous/Next/Random navigation, filters, and persistent solved progress.
- Added varied branching clue graphs instead of simple sequential chains.
- Every generated puzzle passed exhaustive uniqueness and greedy clue-redundancy elimination during build.
- Added quality scores and stable clue mapping checks.


## V10.5 Reliability + Completion Pass
- Activated Cognitive Warm-Up with rapid scanning, mental position updating, and constraint-memory drills.
- Fixed fragile reliance on browser-created global variables for Constraint Lab controls.
- Added route-change cleanup so Full PO Puzzle countdown timers stop when the user leaves the module.
- Bumped offline cache namespace and cached the new warm-up module.
- Re-ran linear and circular content validators. Circular bank remains 40 puzzles with uniqueness, stable clue mapping, and redundancy preflight passing.

## V10.5.1 - Launcher Hotfix
- Replaced the fragile PowerShell-first launcher with a Python standard-library server launcher.
- `START_APP.bat` now detects both Windows `py` launcher and `python` on PATH.
- Automatically finds a free port starting at 8765 if the default port is occupied.
- Automatically opens the app in the default browser.
- Retains the existing PowerShell server as a fallback.
- Adds visible startup errors instead of silently closing the launcher window.
