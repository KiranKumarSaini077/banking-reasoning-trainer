# TASKS

## V3 Multi-Clue Integration
- [x] Build reusable multi-constraint validator
- [x] Add 2-clue chain exercises
- [x] Add 3-clue chain exercises
- [x] Support 3 and 4 entity construction
- [x] Mix direction and gap constraints
- [x] Highlight failed clues
- [x] Add derived inference stage
- [x] Persist chain attempts and mastery
- [x] Activate Puzzle Lab
- [x] Activate Mistake Lab
- [x] Extend dashboard skill profile


## V2.2 Visual Statement Lab
- [x] Remove learner-facing symbolic-expression questions from active Statement Lab
- [x] Add reusable Position Board component
- [x] Add click-to-select and click-to-place
- [x] Add drag and drop as optional interaction
- [x] Add token movement and occupied-slot swap
- [x] Add undo and reset
- [x] Add relative-direction validator
- [x] Add gap/distance validator
- [x] Accept multiple valid absolute arrangements
- [x] Add 12 visual plotting exercises
- [x] Preserve mastery, hints, persistence, and session summary


## V2.1 Emergency Reliability Fix
- [x] Diagnose blank-shell startup failure
- [x] Add one-click Windows HTTP launcher
- [x] Add visible startup diagnostics
- [x] Fix string-answer NaN corruption in Skill Gym
- [x] Add route-level error recovery
- [x] Correct Service Worker fallback behavior
- [x] Bust stale V2 caches
- [x] Add deep debug report


## Completed in V1
- [x] Static modular architecture, responsive shell, navigation, five themes
- [x] IndexedDB and LocalStorage abstractions
- [x] Complete Gap Calculation vertical slice
- [x] Persistent mastery, attempts, sessions, dashboard analytics
- [x] PWA foundation and documentation

## Completed in V2
- [x] Complete Statement Lab vertical slice
- [x] Direction mapping
- [x] Reference identification
- [x] Reference reversal
- [x] Gap-language decoding
- [x] Equivalent statement recognition
- [x] Representation error checking
- [x] Progressive hint ladder
- [x] Hint-depth tracking and mastery penalty
- [x] Multi-skill mastery updates
- [x] Weakest-skill dashboard recommendation
- [x] Statement Lab session summary
- [x] Service-worker cache update

## Current Task
- V2 complete and ready for browser QA.

## Next Highest-Value Tasks for V3
1. Build Mistake Lab from persisted error patterns.
2. Add lightweight spaced-review scheduling by pattern family.
3. Add adaptive daily session composition.
4. Expand Skill Gym with adjacency, nth-position, negative constraints, and two-clue chains.
5. Only then begin the interactive linear puzzle board.

## Known Limitations
- Full natural-language parsing is intentionally out of scope.
- Statement exercises use authored structured data.
- Roadmap modules remain honest non-functional roadmap states.
- Direct `file://` launch is unsupported because ES modules and JSON fetch require HTTP/HTTPS.

## V5 Complete
- [x] Guided full linear puzzle workflow
- [x] Multi-case boards
- [x] Case duplication
- [x] Case deletion/pruning
- [x] Deterministic base guidance
- [x] Full-clue validation

## V6 Complete
- [x] Independent PO puzzle module
- [x] Practice mode
- [x] Timed mode
- [x] Exam Simulation mode
- [x] Tentative/confirmed placements
- [x] Undo/redo/reset
- [x] Transfer questions
- [x] Time-pressure diagnosis
- [x] Session persistence

## V6.1 Complete
- [x] Remove invalid clue set
- [x] Rebuild V6 independent puzzles
- [x] Prove each puzzle satisfiable
- [x] Prove each included set uniquely solvable
- [x] Verify all transfer answer keys from actual solutions
- [x] Add reusable puzzle validation script

## V6.2 Complete
- [x] Physical movable tiles
- [x] Direct repositioning
- [x] Swap occupied tiles
- [x] No visible slot numbers
- [x] Explicit left/right-end clue wording
- [x] No redundant remaining-position clues
- [x] Unique and non-redundant puzzle validation

## V6.2.1 Complete
- [x] Restore original board implementation
- [x] Preserve Tentative / Confirmed states
- [x] Allow already placed person to be selected
- [x] Move selected placed person directly to an empty slot
- [x] Preserve all unrelated placements
- [x] Prevent accidental overwrite of occupied positions

## V7 Complete
- [x] Adaptive learner profile
- [x] Weakest-skill ranking
- [x] Due-review awareness
- [x] Basic fatigue signal
- [x] Balanced session composition
- [x] Today's Training
- [x] Weakness Map
- [x] Progress Analytics
- [x] Preserve V6.2.1 board behavior

## Highest-value next step
- [ ] V8: expand validated puzzle families after linear seating stability

## V8 Complete
- [x] Sidebar independently scrollable
- [x] Mobile sidebar uses full dynamic viewport height
- [x] Settings always reachable
- [x] Remove duplicate navigation aliases
- [x] Working Pattern Library
- [x] JSON-driven pattern data
- [x] Pattern-to-training routes
- [x] Update offline cache coverage
- [x] Preserve V6.2.1 board behavior

## V9 Complete
- [x] Circular seating foundation
- [x] Interactive circular board
- [x] Direct repositioning
- [x] Arrangement validation
- [x] Transfer questions
- [x] Rotational-equivalence-aware uniqueness and redundancy QA
