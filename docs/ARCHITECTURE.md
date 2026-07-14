# ReasonForge V1 Architecture

## Purpose
A static, local-first Bank PO reasoning training system. V1 proves one complete vertical slice: gap calculation.

## Runtime
- HTML5, modular CSS, native ES modules
- No Node.js, npm, bundler, framework, or build step
- Serve through any static HTTP server
- IndexedDB: attempts, mastery, sessions, reviews
- LocalStorage: lightweight settings
- Service Worker: application-shell and data caching

## Data Flow
JSON exercise -> validation -> Skill Gym -> timed response -> correctness -> error diagnosis -> attempt score -> mastery update -> IndexedDB -> dashboard insight/session summary.

## Separation
- `core`: routing, state, configuration, persistence
- `engines`: domain logic and scoring
- `modules`: page-level controllers/rendering
- `components`: reusable UI helpers
- `data`: structured content, never embedded in render logic

## Mastery Formula
Per attempt:
`100 × (0.72 × accuracy + 0.28 × speed) × hintPenalty × difficultyWeight`

Where:
- accuracy = 1 correct, 0 incorrect
- speed = capped ratio of estimated time to response time
- hint penalty = `max(0.35, 1 - 0.13 × hintLevel)`
- difficulty weight = `1 + 0.08 × (difficulty - 1)`

Mastery uses an exponential update:
- correct attempt alpha: 0.25
- incorrect attempt alpha: 0.32

This is a transparent heuristic, not a scientifically validated psychometric model.

## Important Decisions
1. Planned modules are explicitly marked as roadmap items rather than fake functionality.
2. V1 focuses on a reliable end-to-end training loop.
3. Static content uses deterministic IDs.
4. User records use `crypto.randomUUID()`.
5. Median response time is preferred in summary analytics.


## V2 Statement Lab Flow
Structured statement JSON -> validation -> randomized session -> response timing -> optional progressive hints -> answer diagnosis -> multi-skill mastery updates -> IndexedDB -> dashboard weakest-skill recommendation -> session debrief.

### New Domain Engine
`js/engines/statement-engine.js` owns Statement Lab validation, diagnosis, attempt persistence, and multi-skill mastery updates. Page rendering remains in `js/modules/statement-lab.js`.


## V3 Multi-Clue Architecture
`puzzle-lab.js` owns the guided session UI. `constraint-engine.js` validates each authored constraint independently and aggregates failed clue indexes. The visual `PositionBoard` remains presentation/input infrastructure and does not contain puzzle business logic.

Flow:
multi-clue JSON -> schema validation -> visual construction -> aggregate constraint validation -> optional derived inference -> attempt recording -> multi-skill mastery -> IndexedDB -> Dashboard/Mistake Lab.

The learner never sees internal symbolic relationship syntax.
