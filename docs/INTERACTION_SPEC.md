# INTERACTION SPECIFICATION — HMJ UNIMED LOGIN

## 1. Purpose

This document defines the functional behavior, interaction flow, application states, and transition rules for the HMJ UNIMED Interactive Login website.

It is the primary reference for implementing the sliding puzzle, animated padlock, and login form interaction.

All implementations must follow this specification and remain consistent with `PROJECT_BRIEF.md` and `DESIGN_SYSTEM.md`.

## 2. Core Interaction Concept

The application consists of three interconnected elements:

1. A sliding puzzle created from the official UNIMED logo.
2. A padlock that visually represents access to the login form.
3. A login form that becomes available only after the puzzle has been solved and the unlocking animation has completed.

The interaction must follow this order:

**Solve puzzle → Validate solution → Unlock padlock → Reveal login form → Authenticate user.**

No component may bypass this sequence through ordinary user interaction.

## 3. Application State Machine

The application must use explicit states rather than relying on unrelated Boolean variables.

Required states:

### 3.1 `locked`

Initial application state.

- The puzzle is visible and interactive.
- The padlock appears closed.
- The login form is hidden and inactive.
- Puzzle movement is permitted.
- The unlocking animation has not started.

### 3.2 `unlocking`

Entered only when the puzzle solution has been successfully validated.

- The puzzle solution is preserved.
- Further puzzle movement is disabled.
- The padlock plays its unlocking animation.
- The login form remains hidden and inactive.
- Repeated completion events must not restart the transition.

### 3.3 `unlocked`

Entered after the unlocking animation completes.

- The padlock displays its open state.
- The login form becomes visible and interactive.
- Focus may move to the username or email input when appropriate.
- Puzzle movement remains disabled.
- The application must not return to `locked` during ordinary interaction.

### 3.4 `authenticating`

Entered when the user submits validly formatted credentials.

- The login form remains visible.
- Duplicate submissions are prevented.
- A loading indicator or equivalent feedback is displayed.
- Authentication is processed by the configured backend or authentication service.

### 3.5 `authentication-error`

Entered when authentication fails.

- The login form remains available.
- A clear, non-sensitive error message is displayed.
- Password input may be cleared according to the application's security and usability requirements.
- The user can correct the credentials and retry.
- The padlock remains open.

### 3.6 `authenticated`

Entered only after successful authentication has been confirmed by the authentication service.

- The application follows the configured post-login behavior.
- Protected pages must still enforce server-side or authentication-provider authorization.
- The interface must not infer successful authentication from the completion of the puzzle.

If authentication is not yet implemented, the authentication states must be clearly marked as pending integration rather than simulated as real authentication.

## 4. State Transition Rules

The expected transitions are:

- `locked` → `unlocking`: the puzzle is correctly solved.
- `unlocking` → `unlocked`: the padlock animation completes.
- `unlocked` → `authenticating`: the login form is submitted.
- `authenticating` → `authenticated`: authentication succeeds.
- `authenticating` → `authentication-error`: authentication fails.
- `authentication-error` → `authenticating`: the user submits another attempt.

No other transition should occur without an explicitly documented reason.

The application must prevent invalid transitions, duplicate animation triggers, and unintended access to the login form.

A page refresh may restart the puzzle from the locked state unless a different behavior has been explicitly approved. Do not persist an unlocked state by default.

## 5. Sliding Puzzle Specification

### 5.1 Puzzle Configuration

The default puzzle is a 3 × 3 sliding puzzle.

- Total board positions: 9.
- Number of image tiles: 8.
- Number of empty positions: 1.
- The board displays the official UNIMED logo as a complete image when solved.
- All tiles must preserve the original image proportions and alignment.

The implementation must use a consistent coordinate system for tile positions and their original image locations.

### 5.2 Tile Movement

A tile can move only when it is directly adjacent to the empty position horizontally or vertically.

Diagonal movement is prohibited.

A valid move swaps the selected tile with the empty position.

An invalid move must not alter the puzzle state.

The movement logic must be independent of decorative CSS animations. Visual movement must reflect the actual application state.

### 5.3 Input Methods

Support the following interactions where practical:

- Mouse click on an adjacent tile.
- Touch interaction on mobile devices.
- Keyboard interaction for accessibility.

Keyboard controls must provide a clear, understandable method of selecting or moving tiles and must not interfere with normal form controls.

Do not implement unrestricted drag-and-drop or free movement unless explicitly approved.

### 5.4 Puzzle Randomization

The puzzle must begin in a solvable, non-completed configuration.

The recommended method is to start from the solved arrangement and perform a series of valid random moves.

This method preserves solvability without requiring a separate permutation-parity correction algorithm.

The final arrangement must differ from the solved arrangement and should provide a meaningful challenge.

Do not use arbitrary random tile permutations without checking solvability.

The application must also avoid generating a puzzle that is already solved.

### 5.5 Solution Validation

The puzzle is complete only when every tile occupies its correct original position and the empty position matches the designated solved arrangement.

Validation must use the underlying tile-position data, not:

- Visual similarity alone.
- CSS transforms alone.
- A click counter.
- A completion button.
- An unverified animation event.

When the arrangement is correct, the application must trigger a single completion event.

### 5.6 Puzzle Completion

After successful validation:

1. Confirm the solved arrangement.
2. Change the application state from `locked` to `unlocking`.
3. Disable additional puzzle input.
4. Preserve the completed puzzle appearance.
5. Trigger the padlock animation exactly once.

The completion handler must be safe against repeated calls.

## 6. Padlock Animation Specification

### 6.1 Locked State

The padlock must clearly communicate that the login form is still inaccessible.

The closed shackle and body must be visually distinguishable.

The padlock must not respond to clicks as though it were an independent unlock control.

### 6.2 Unlocking Trigger

The padlock animation must start only after successful puzzle validation.

The animation must be driven by the application's `unlocking` state.

It must not be triggered by:

- Clicking the padlock.
- Clicking an arbitrary area of the page.
- Opening the login page.
- Submitting login credentials.
- A timer that runs independently of puzzle completion.

### 6.3 Animation Sequence

The recommended sequence is:

1. The completed puzzle briefly settles into place.
2. The padlock shackle moves upward or rotates to communicate opening.
3. A subtle success highlight may appear.
4. The padlock reaches its stable unlocked appearance.
5. The animation completion callback changes the application state to `unlocked`.
6. The login form begins its reveal transition.

The animation must be brief and purposeful.

### 6.4 Animation Completion

The application must transition to `unlocked` only when the unlocking sequence has actually completed.

Use the animation library's completion callback or an equivalent reliable mechanism.

Do not use an arbitrary timeout that may become inconsistent with the actual animation duration.

If reduced-motion preferences are enabled, use an appropriate shortened or immediate visual transition while preserving the same logical state sequence.

## 7. Login Form Reveal

### 7.1 Visibility

Before the application reaches `unlocked`, the login form must not be accessible through ordinary interaction.

The form must not be focusable through keyboard navigation while locked.

It must not be submitted programmatically through the normal UI before unlocking.

If the form is conditionally rendered, render it when appropriate. If it remains mounted, apply a reliable inactive and inaccessible state until it becomes available.

Do not rely exclusively on opacity, blur, or off-screen positioning to hide the form.

### 7.2 Reveal Animation

After the padlock animation completes:

- Reveal the form with a subtle fade and short movement.
- Avoid abrupt layout shifts.
- Maintain the agreed visual hierarchy.
- Keep the puzzle and padlock visually coherent with the form.
- Ensure the animation works on mobile and desktop.

The form must become interactive at the correct point in the transition.

### 7.3 Form Controls

The login form must support:

- Username or email input.
- Password input.
- Password visibility toggle.
- Submit button.
- Field validation.
- Loading feedback.
- Authentication error feedback.

The submit button must be disabled while an authentication request is in progress to prevent duplicate submissions.

### 7.4 Authentication Boundary

Puzzle completion is not authentication.

Unlocking the padlock must not grant access to protected pages or user data.

Credentials must be processed by the configured authentication service. Authorization must be enforced independently of frontend state.

## 8. Error Handling and Edge Cases

The implementation must handle:

- Invalid puzzle moves.
- Repeated tile clicks during movement.
- Rapid interaction near puzzle completion.
- Repeated completion events.
- Animation interruption or component unmounting.
- Small-screen layout changes.
- Reduced-motion preferences.
- Empty or incorrectly formatted login inputs.
- Failed authentication requests.
- Network failures during authentication.
- Repeated login submissions.

Invalid puzzle moves must leave the board unchanged.

Once the unlocking sequence begins, puzzle input must remain disabled.

A failed authentication attempt must not relock the puzzle or close the padlock.

Authentication errors must not expose sensitive implementation details.

## 9. Accessibility

The interaction must be understandable without relying solely on animation or color.

Requirements:

- Provide concise puzzle instructions.
- Give interactive tiles accessible labels or equivalent descriptions.
- Support keyboard operation.
- Display visible keyboard focus.
- Communicate puzzle completion through an accessible status message.
- Ensure the login form follows a logical focus order.
- Respect reduced-motion preferences.
- Ensure disabled controls cannot be activated accidentally.
- Keep form labels and error messages accessible to assistive technology.

Where focus is moved after unlocking, it must be moved deliberately and must not interrupt an existing user interaction.

## 10. Performance and Reliability

- Keep puzzle state in a predictable data structure.
- Avoid unnecessary full-page re-renders.
- Keep animation logic separate from puzzle validation.
- Prevent race conditions between tile movement and puzzle completion.
- Avoid excessive dependencies.
- Clean up animation listeners and callbacks when necessary.
- Test the interaction on both desktop and mobile browsers.

Correct behavior takes priority over decorative complexity.

## 11. Acceptance Criteria

The interaction implementation is complete when:

1. The initial state is `locked`.
2. The puzzle uses the official UNIMED logo.
3. Only valid adjacent tile movements are accepted.
4. The randomized puzzle is solvable.
5. The solved arrangement is verified using tile data.
6. The padlock remains closed for an incorrect arrangement.
7. Correct completion triggers the unlocking sequence exactly once.
8. Puzzle input is disabled during unlocking.
9. The login form remains inaccessible until the unlocking sequence completes.
10. The login form becomes usable after unlocking.
11. Failed authentication does not relock the puzzle.
12. Successful authentication is confirmed by the actual authentication service.
13. Keyboard and touch interactions work as intended.
14. Reduced-motion behavior is supported.
15. Invalid state transitions and duplicate submissions are prevented.

## 12. Implementation Rules

1. Follow this specification when implementing the puzzle, padlock, and form interactions.
2. Keep puzzle validation independent of animation code.
3. Use explicit application states and documented transitions.
4. Do not introduce shortcuts that bypass puzzle completion.
5. Do not use the puzzle as a replacement for authentication or authorization.
6. Do not simulate successful authentication when no real authentication service exists.
7. Preserve existing project architecture unless a justified change is approved.
8. Update this document when an approved interaction change affects system behavior.
9. Test all acceptance criteria before marking the interaction implementation complete.

---

**End of INTERACTION_SPEC.md**