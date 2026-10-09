# TECHNICAL GUIDE — HMJ UNIMED LOGIN

## 1. Purpose

This document defines the technical architecture, implementation standards, component responsibilities, state management, testing requirements, and authentication boundaries for the HMJ UNIMED Interactive Login website.

It must be used together with:

- `PROJECT_BRIEF.md`
- `DESIGN_SYSTEM.md`
- `INTERACTION_SPEC.md`

These documents serve different purposes and must remain consistent.

`PROJECT_BRIEF.md` defines the project vision and scope.

`DESIGN_SYSTEM.md` defines visual standards.

`INTERACTION_SPEC.md` defines application behavior and interaction rules.

`TECHNICAL_GUIDE.md` defines how the implementation should be structured, maintained, and verified.

## 2. Initial Project Audit

Before writing or modifying application code, inspect the existing project.

Identify:

- Current framework and build tool.
- Package manager and lockfile.
- Installed dependencies.
- Existing folder structure.
- Existing components, pages, and styles.
- Available logo and image assets.
- Existing authentication implementation, if any.
- Current development and build commands.
- Existing tests, linting, and formatting tools.

Do not assume the project is new.

If the project already exists, preserve its working architecture and conventions whenever practical.

If the project is empty or new, use the technology stack specified in Section 3.

Before making significant changes, summarize the findings and identify any conflicts with the project documentation.

Do not delete or replace existing files merely to match a preferred folder structure.

## 3. Technology Stack

### 3.1 Existing Projects

The existing project's established framework and dependencies take priority unless a change is necessary and approved.

Do not migrate frameworks or replace major dependencies without a clear technical justification.

### 3.2 New Projects

If the project has no existing implementation, use the following preferred stack:

- React for the user interface.
- Vite for development and production builds.
- TypeScript when practical for stronger type safety.
- Tailwind CSS if compatible with the project setup.
- Framer Motion for coordinated UI animations when justified.
- Vitest and React Testing Library for component and interaction tests, if compatible with the selected setup.

Do not install every suggested dependency automatically.

Check compatibility, project requirements, and existing packages before adding dependencies.

Prefer native CSS transitions and browser capabilities when they are sufficient.

## 4. Architecture Principles

The implementation must follow these principles:

- Separation of concerns.
- Reusable components.
- Predictable application state.
- Explicit interaction boundaries.
- Minimal unnecessary dependencies.
- Readable and maintainable code.
- Accessible controls.
- Reliable error handling.
- Testable business logic.

Puzzle logic, padlock animation, and authentication logic must not be combined into one oversized component.

Visual components must not independently decide whether the puzzle has been solved or whether a user is authenticated.

Business rules must be implemented in appropriate logic or state-management layers.

## 5. Recommended Project Structure

Adapt this structure to the existing project rather than enforcing it blindly.

```text
src/
├── components/
│   ├── puzzle/
│   │   ├── PuzzleBoard.tsx
│   │   └── PuzzleTile.tsx
│   ├── lock/
│   │   └── Padlock.tsx
│   ├── login/
│   │   ├── LoginForm.tsx
│   │   └── LoginField.tsx
│   └── ui/
│       ├── Button.tsx
│       └── StatusMessage.tsx
│
├── hooks/
│   └── useLoginFlow.ts
│
├── lib/
│   ├── puzzle.ts
│   └── authentication.ts
│
├── types/
│   └── index.ts
│
├── styles/
│   └── globals.css
│
├── App.tsx
└── main.tsx

public/
└── assets/
    └── logo-unimed.png

docs/
├── PROJECT_BRIEF.md
├── DESIGN_SYSTEM.md
├── INTERACTION_SPEC.md
├── TECHNICAL_GUIDE.md
└── AGENTS.md
```

File names and extensions may differ when the existing project uses JavaScript, another framework, or a different established convention.

Do not create empty folders or placeholder components that have no implementation purpose.

## 6. Component Responsibilities

### 6.1 `PuzzleBoard`

Responsible for:

- Rendering the puzzle grid.
- Displaying the current tile arrangement.
- Receiving valid tile interaction events.
- Communicating tile moves to the puzzle logic.
- Displaying the completed arrangement.
- Disabling interaction during the unlocking transition.

It must not implement authentication or directly control the visual details of the padlock.

### 6.2 `PuzzleTile`

Responsible for:

- Displaying a single tile.
- Rendering the appropriate portion of the logo.
- Providing accessible interaction controls.
- Displaying focus, hover, and disabled states.

It must not independently determine whether the entire puzzle is solved.

### 6.3 `Padlock`

Responsible for:

- Displaying the locked, unlocking, and unlocked visual states.
- Playing the corresponding animation.
- Reporting animation completion to the parent state controller.

It must not initiate unlocking in response to an arbitrary click.

### 6.4 `LoginForm`

Responsible for:

- Collecting username or email and password.
- Managing field-level presentation and validation feedback.
- Providing password visibility controls.
- Displaying loading and authentication error states.
- Submitting credentials through the configured authentication interface.

It must not treat puzzle completion as proof of authentication.

### 6.5 `useLoginFlow` or Equivalent State Controller

Responsible for coordinating:

- Application states.
- Puzzle completion events.
- The transition to unlocking.
- Padlock animation completion.
- Login form availability.
- Authentication submission and results.

Use a reducer or another explicit state-management approach when it improves reliability.

Avoid maintaining multiple independent Boolean variables that can produce contradictory states.

### 6.6 `puzzle.ts` or Equivalent Puzzle Module

Responsible for pure puzzle operations, such as:

- Creating the solved arrangement.
- Generating a solvable randomized arrangement.
- Checking valid tile moves.
- Applying valid moves.
- Checking whether the puzzle is solved.

Puzzle logic must be testable independently of React components and animation libraries.

### 6.7 `authentication.ts` or Equivalent Authentication Module

Responsible for communicating with the configured authentication provider or backend.

If no backend exists, expose a clearly defined integration boundary rather than pretending to authenticate users.

Do not place passwords, secret keys, or privileged credentials in client-side source code.

## 7. State Management

Use the state model defined in `INTERACTION_SPEC.md`.

The main states are:

- `locked`
- `unlocking`
- `unlocked`
- `authenticating`
- `authentication-error`
- `authenticated`

All state changes must follow documented transition rules.

Prefer a discriminated union or equivalent type-safe model when using TypeScript.

Example:

```ts
type LoginFlowState =
  | { status: "locked" }
  | { status: "unlocking" }
  | { status: "unlocked" }
  | { status: "authenticating" }
  | { status: "authentication-error"; message: string }
  | { status: "authenticated" };
```

This example defines the state model only. It does not replace the need to implement and validate transition rules.

Prevent:

- Duplicate unlocking triggers.
- Puzzle moves after unlocking begins.
- Form submissions before the form is available.
- Duplicate authentication requests.
- Authentication success without confirmation from the authentication service.
- Invalid transitions caused by delayed callbacks.

Animation state and authentication state must remain logically distinct.

## 8. Puzzle Implementation Requirements

### 8.1 Tile Data

Represent each tile using stable data that identifies its original position.

The current arrangement must be stored as structured application state.

Do not use DOM position, CSS transforms, or visual image comparison as the authoritative puzzle solution.

### 8.2 Solvable Randomization

Generate the randomized board by applying valid moves from a solved board.

Ensure that:

- The final arrangement is not already solved.
- The generated board remains solvable.
- The empty position is represented consistently.
- The solution checker uses the original tile positions.

### 8.3 Movement Logic

Validate each move before updating state.

Reject moves that:

- Select the empty position.
- Select a nonadjacent tile.
- Occur after the application enters `unlocking`.
- Conflict with an active interaction lock, if one is required.

Keep puzzle operations deterministic where practical so that unit tests can verify their behavior.

## 9. Asset Handling

Use the official UNIMED logo supplied for the project.

Before implementation, verify:

- The asset exists.
- Its file format is supported.
- Its proportions are correct.
- Its resolution is sufficient for the puzzle.
- Its background and transparency are understood.
- The project has permission to use the asset.

For a sliding puzzle, use a consistent source image and calculate tile positions from the same image dimensions.

If the source image is missing, ask for it or use a clearly identified temporary placeholder.

Do not invent a replacement logo or silently substitute a generic university emblem.

## 10. Animation Implementation

Keep animation presentation separate from application-state decisions.

The application state determines whether the padlock is locked, unlocking, or unlocked.

The animation system renders the appropriate visual transition and reports completion when the animation has finished.

Requirements:

- Use a single authoritative unlocking trigger.
- Prevent overlapping or repeated unlocking animations.
- Preserve the completed puzzle while unlocking.
- Reveal the login form only at the correct state transition.
- Support reduced-motion preferences.
- Handle interrupted animations safely.
- Avoid excessive continuous animation or expensive rendering effects.

Do not use arbitrary delays as the sole mechanism for synchronizing state with animation.

## 11. Authentication and Security

The puzzle is an interface interaction, not an authentication or authorization mechanism.

Required principles:

- Validate credentials through a real backend or authentication provider.
- Never store passwords in plaintext.
- Never expose privileged secrets in client-side code.
- Do not grant protected access based on frontend state.
- Do not fabricate successful login responses.
- Handle loading, network failure, and rejected credentials.
- Follow the configured authentication provider's session and security practices.

If the backend has not been specified, document the integration requirements and keep the frontend implementation clearly separated from production authentication.

Do not introduce a database, backend framework, or authentication provider without confirming project requirements.

## 12. Testing Strategy

Test the application at several levels.

### 12.1 Unit Tests

Verify:

- Solved-board generation.
- Valid and invalid tile movement.
- Solvable randomization.
- Correct solution detection.
- State-transition rules.

### 12.2 Component Tests

Verify:

- Puzzle rendering.
- Tile interaction.
- Locked and unlocked padlock presentation.
- Form visibility.
- Input validation.
- Loading and error feedback.

### 12.3 Integration Tests

Verify the complete sequence:

1. The page starts in the locked state.
2. The user solves the puzzle.
3. The application enters `unlocking`.
4. The padlock animation completes.
5. The form becomes available.
6. Authentication is submitted.
7. The resulting state reflects the actual authentication response.

Also test invalid moves, repeated completion events, interrupted animations, and failed authentication.

### 12.4 Responsive and Accessibility Tests

Verify:

- Desktop and mobile layouts.
- Touch interaction.
- Keyboard interaction.
- Focus order.
- Accessible status messages.
- Reduced-motion behavior.
- Absence of horizontal overflow.

Use the testing tools already available in the project whenever possible.

## 13. Development Workflow

For every implementation task:

1. Read the relevant project documentation.
2. Inspect the existing code and identify affected components.
3. Define the intended change and its acceptance criteria.
4. Implement the smallest coherent change.
5. Run the relevant tests and build checks.
6. Review the UI and interaction behavior.
7. Fix regressions introduced by the change.
8. Report what changed, what was tested, and any remaining limitations.
9. Update `PROGRESS.md` if that file is used by the project.

Do not report a test as successful unless it was actually executed and passed.

If a test cannot be executed, state that limitation clearly.

## 14. Code Quality Rules

- Use descriptive variable, function, and component names.
- Keep functions focused on a single responsibility.
- Avoid unnecessary duplication.
- Avoid overly complex conditional rendering.
- Handle asynchronous operations and errors explicitly.
- Remove unused imports and dead code introduced by changes.
- Follow existing formatting and linting conventions.
- Avoid unrelated refactoring.
- Preserve existing working functionality.
- Do not add dependencies without a clear need.

Prefer clear, maintainable solutions over clever but difficult-to-understand implementations.

## 15. Completion Criteria

A technical implementation is ready when:

- The project builds successfully.
- Relevant tests pass.
- Puzzle operations behave correctly.
- State transitions follow the interaction specification.
- Animation callbacks cannot incorrectly unlock the form.
- The form submits credentials through the configured authentication boundary.
- No known critical regression remains.
- Responsive and accessibility requirements have been checked.
- The code follows the established project conventions.
- Documentation reflects any approved technical changes.

---

**End of TECHNICAL_GUIDE.md**