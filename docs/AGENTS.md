# AGENTS.md

## Before Editing
1. Inspect the project tree.
2. Read this file.
3. Read `TASKS.md`.
4. Read `ARCHITECTURE.md`.
5. Read `CHANGELOG.md`.
6. Inspect actual relevant source files.
7. Run the application and verify current behavior.

## Non-Negotiable Rules
- No Node runtime requirement, npm, frameworks, bundlers, or compile step.
- Preserve ES module separation.
- Do not move large datasets into JavaScript.
- Do not scatter raw IndexedDB calls outside the storage abstraction.
- Do not create fake working buttons.
- Do not silently swallow errors.
- Do not regress the working gap-calculation vertical slice.
- Source code is the final truth when documentation disagrees.

## Continuity
Update `TASKS.md` and `CHANGELOG.md` after meaningful milestones, not only at the end of a long session.

## Verification
Test:
- static-server launch
- navigation and refresh
- theme persistence
- exercise loading
- malformed data behavior
- answer feedback
- IndexedDB persistence
- dashboard after reload
- narrow mobile layout
- keyboard focus
- repeated clicks
- service-worker/offline behavior
