# Manual QA Checklist

## Launch
Use a static HTTP server. Examples:
- VS Code Live Server
- `python -m http.server 8000` from the project folder

Do not open `index.html` directly with `file://`, because browser module and fetch security rules may block JSON loading.

## Foundation
- [ ] No console errors on initial load.
- [ ] Dashboard opens.
- [ ] Every navigation item opens either a working module or an explicit roadmap state.
- [ ] Browser refresh preserves the current hash route.
- [ ] Mobile menu opens and closes.

## Themes and Settings
- [ ] Switch all five themes.
- [ ] Refresh and confirm selected theme persists.
- [ ] Change default session duration and confirm persistence.

## Skill Gym
- [ ] Start Gap Training.
- [ ] Complete all 10 questions.
- [ ] Rapid double-clicking cannot record duplicate answers.
- [ ] Correct and incorrect states are visible without relying only on color.
- [ ] Explanations appear after answering.
- [ ] Known distractors produce mapped error diagnoses.
- [ ] Session summary appears.
- [ ] Dashboard updates after returning.
- [ ] Reload browser and confirm progress remains.

## Failure Handling
- [ ] Temporarily rename the JSON file and verify visible load failure.
- [ ] Add one malformed exercise and verify console development error while valid items still work.
- [ ] Test with IndexedDB disabled/private restrictions and verify errors appear in console without a blank app.

## Responsive and Accessibility
- [ ] Test at 320px, 375px, 768px, 1024px, and desktop widths.
- [ ] Navigate interactive controls by keyboard.
- [ ] Confirm visible focus states.
- [ ] Enable OS reduced motion and verify animation reduction.
- [ ] Test High Contrast theme.

## Offline
- [ ] Load once through HTTP/HTTPS.
- [ ] In DevTools, verify service worker activation.
- [ ] Switch network offline.
- [ ] Reload and confirm cached shell and gap dataset load.


## V2 Statement Lab
- [ ] Open Statement Lab from navigation.
- [ ] Complete a 10-item randomized session.
- [ ] Verify each answer locks after one submission.
- [ ] Verify correct option is visibly identified.
- [ ] Use hints from level 1 through level 4.
- [ ] Verify hint level resets on the next exercise.
- [ ] Verify hint usage is shown in session summary.
- [ ] Trigger direction-reversal and reference-confusion distractors.
- [ ] Verify mastery updates for all skills tagged on an exercise.
- [ ] Return to Dashboard and verify weakest-skill recommendation changes with performance.
- [ ] Reload and confirm Statement Lab attempts and mastery persist.
