# PROJECT BRIEF — HMJ UNIMED LOGIN

## 1. Project Overview

**Project Name:** HMJ UNIMED Interactive Login

**Project Type:** Modern, interactive, responsive website login interface.

**Primary Goal:** Develop a professional login experience for the Himpunan Mahasiswa Jurusan (HMJ) at Universitas Negeri Medan (UNIMED), featuring an interactive sliding puzzle based on the official UNIMED logo and an animated padlock that unlocks when the puzzle is correctly solved.

This project must combine usability, visual quality, meaningful interaction, and maintainable code.

## 2. Project Vision

The login page must feel like a modern academic digital experience rather than a conventional login form.

Before accessing the login form, users must solve a sliding puzzle made from the official UNIMED logo. Once the puzzle is correctly assembled, a padlock animation plays, symbolizing successful completion of the interaction. The login form then becomes visible and usable.

The interaction must feel natural, polished, responsive, and visually connected from beginning to end.

The puzzle and padlock are core features of the project, not optional decorations.

## 3. Target Users

The primary users are students and authorized members of the HMJ UNIMED organization.

The interface must be easy to understand for first-time users and usable on desktop computers, laptops, tablets, and mobile phones.

## 4. Core User Experience

The application must follow this sequence:

1. The user opens the login website.
2. The initial interface displays the UNIMED logo sliding puzzle and a locked padlock.
3. The user arranges the puzzle tiles until the official logo is correctly assembled.
4. The application validates the puzzle arrangement.
5. When the solution is correct, the padlock plays its unlocking animation.
6. After the unlocking transition completes, the login form appears and becomes interactive.
7. The user enters their username or email and password.
8. The application submits the credentials to the configured authentication system.

The login form must not be accessible through the normal interface before the puzzle has been successfully solved.

The puzzle completion event must be the trigger for the unlocking sequence. The unlocking animation must not play merely because the user clicks the padlock or another unrelated element.

## 5. Core Features

### 5.1 UNIMED Sliding Puzzle

- Use the official UNIMED logo as the puzzle source.
- Divide the logo image into square tiles.
- Implement a sliding puzzle with one empty space.
- Allow users to move only tiles adjacent to the empty space.
- Validate the actual tile arrangement against the solved configuration.
- Ensure the randomized puzzle is solvable.
- Provide clear visual feedback for tile movement and successful completion.
- Support mouse, touch, and keyboard interaction where appropriate.
- Prevent accidental interaction conflicts during transitions.

The default puzzle configuration should be 3 × 3 tiles. Any change to the puzzle size must be based on a deliberate design decision.

### 5.2 Animated Padlock

- Display a clearly recognizable locked padlock before puzzle completion.
- Trigger the unlocking animation only after the puzzle is validated successfully.
- Use smooth movement, controlled timing, and subtle visual feedback.
- Maintain visual consistency with the website's design system.
- Prevent repeated triggers from causing broken animation states.
- Provide a reduced-motion alternative for users who prefer less animation.

### 5.3 Login Form

- Display the login form after the unlocking sequence completes.
- Include a username or email field and a password field.
- Include a password visibility toggle.
- Provide a clear primary login button.
- Include appropriate validation, loading, error, and success states.
- Keep form controls accessible and usable on small screens.
- Support integration with the project's actual authentication backend.

The initial implementation must not pretend that authentication is functional when no backend has been configured.

## 6. Visual Direction

The visual identity must communicate professionalism, academic credibility, and modern simplicity.

### Primary visual principles

- Use white or natural off-white as the primary background.
- Use green accents that complement UNIMED's official visual identity.
- Use neutral gray for supporting text, borders, and secondary elements.
- Maintain clear typography, balanced spacing, and consistent alignment.
- Use subtle shadows, refined borders, and restrained visual effects.
- Keep the interface clean and avoid unnecessary decorative elements.
- Ensure the puzzle, padlock, and login form feel like parts of one coherent design.

Avoid excessive futuristic effects, overly dark themes, aggressive gradients, excessive glow, cluttered layouts, and inconsistent component styling.

The official logo must retain its correct proportions, colors, and recognizable appearance.

## 7. Responsive Design

The application must work across desktop, laptop, tablet, and mobile screen sizes.

The puzzle must remain readable and comfortably playable on touchscreens. The login form must fit smaller screens without horizontal overflow.

Animations and layout transitions must adapt to the available screen space.

Responsive behavior must be implemented as part of the design, not added as an afterthought.

## 8. Technical Principles

The existing project structure and technology stack must be inspected before implementation.

If the project already exists, preserve its established architecture unless a change is necessary and justified.

If the project is new, React and Vite may be used as the default frontend stack, with Tailwind CSS for styling and Framer Motion for animations where appropriate.

Implementation must prioritize:

- Clear component responsibilities.
- Maintainable and reusable code.
- Predictable application state.
- Reliable puzzle validation.
- Smooth but purposeful animations.
- Accessible interaction controls.
- Performance on modest hardware.
- Compatibility with the project's existing dependencies.

Do not introduce unnecessary libraries or rebuild working features without a clear reason.

## 9. Security and Authentication

The puzzle is an interactive interface feature, not a security boundary.

Frontend state must never be treated as proof of identity or authorization.

Authentication must be validated by a backend or a properly configured authentication service. Passwords must not be stored in plaintext, and sensitive credentials must not be exposed in client-side code.

If authentication has not yet been implemented, clearly separate the interface prototype from the real authentication workflow.

## 10. Scope Boundaries

The primary scope is the login experience and its supporting interaction system.

The following features are not automatically included unless explicitly requested:

- Full administrative dashboard.
- Member management system.
- Registration and password recovery workflows.
- Database design and deployment.
- Additional gamification.
- Unrelated landing pages or decorative animations.

Future features must not distract from the core login experience.

## 11. Definition of Done

The project is considered ready for its initial release when:

- The interface follows the agreed visual direction.
- The official UNIMED logo is used correctly.
- The sliding puzzle can be completed successfully.
- Invalid puzzle arrangements do not unlock the padlock.
- The unlocking animation is triggered exactly by successful puzzle completion.
- The login form appears only after the unlocking transition.
- Form fields and controls work as intended.
- The layout works on desktop and mobile.
- Important interaction and error states have been tested.
- No critical console errors or broken interactions remain.
- Authentication behavior is accurately documented.
- The implementation remains consistent with the project's documentation.

## 12. Non-Negotiable Project Rules

1. Do not change the core puzzle-to-padlock-to-login sequence without explicit approval.
2. Do not replace the UNIMED logo with an invented or unrelated logo.
3. Do not remove agreed features merely to simplify implementation.
4. Do not introduce visual elements that conflict with the established design direction.
5. Do not claim that a feature works unless it has been implemented and verified.
6. Inspect existing files before modifying project architecture.
7. Keep code maintainable and avoid unnecessary complexity.
8. Ask for clarification before making significant decisions that are not covered by the documentation.
9. Treat this document as the source of truth for the project's overall vision and scope.

---

**End of PROJECT_BRIEF.md**