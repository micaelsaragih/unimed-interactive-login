# DESIGN SYSTEM — HMJ UNIMED LOGIN

## 1. Purpose

This document defines the visual design standards for the HMJ UNIMED Interactive Login website.

All interface components, layouts, animations, and visual assets must follow these guidelines to maintain consistency throughout the project.

The design must feel modern, professional, clean, accessible, and appropriate for a university student organization.

`PROJECT_BRIEF.md` defines the overall project vision. This document defines how that vision must look and feel.

## 2. Design Philosophy

The interface must follow these principles:

- Clean and minimal.
- Bright and naturally lit.
- Professional and academically appropriate.
- Interactive without unnecessary visual complexity.
- Consistent across all components.
- Responsive across desktop and mobile devices.
- Lightweight and suitable for modest hardware.

The website must prioritize clarity and usability over decorative effects.

Avoid making the interface look like a gaming dashboard, a cryptocurrency platform, or an excessively futuristic AI interface.

## 3. Color System

Use the following initial design tokens. They are provisional implementation values and must be checked against the official UNIMED brand assets before final approval.

### Primary colors

- `--color-primary: #16845B`
- `--color-primary-hover: #116B49`
- `--color-primary-soft: #E8F5EE`
- `--color-primary-subtle: #F3FAF6`

### Background colors

- `--color-background: #FAFBF9`
- `--color-surface: #FFFFFF`
- `--color-surface-muted: #F4F6F3`

### Text colors

- `--color-text-primary: #202923`
- `--color-text-secondary: #68736C`
- `--color-text-muted: #89928C`
- `--color-text-inverse: #FFFFFF`

### Border and feedback colors

- `--color-border: #E1E7E1`
- `--color-border-focus: #16845B`
- `--color-success: #16845B`
- `--color-error: #C83D43`
- `--color-warning: #B7791F`

All colors must be defined centrally using CSS variables or the project's existing design-token system.

Do not introduce arbitrary colors into individual components when an existing token can be reused.

Do not assume that the provisional green value represents the exact official UNIMED brand color.

## 4. Typography

Use a clean, readable sans-serif typeface.

Preferred font order:

1. Inter, if already available or reasonably included in the project.
2. A compatible system sans-serif font as a lightweight alternative.

Use the following initial typography scale:

- Main heading: `32px`, weight `700`.
- Section heading: `24px`, weight `600`.
- Card heading: `18px`, weight `600`.
- Body text: `14px–16px`, weight `400`.
- Supporting text: `12px–14px`, weight `400`.
- Button text: `14px–16px`, weight `600`.

Use a line height of approximately `1.5` for body text.

Headings must be visually distinct without dominating the interface.

Avoid programming-style fonts, decorative display fonts, excessively thin text, and unnecessary uppercase text.

Typography must remain readable on smaller screens.

## 5. Layout and Spacing

Use a consistent spacing scale based on multiples of four:

- `4px`: minimal separation.
- `8px`: compact spacing.
- `12px`: small component spacing.
- `16px`: standard spacing.
- `24px`: section spacing.
- `32px`: large spacing.
- `48px`: major layout separation.
- `64px`: spacious section separation.

Prefer balanced whitespace over tightly packed components.

Use Flexbox or CSS Grid for layout rather than arbitrary positioning.

Absolute positioning is acceptable for decorative elements when it does not compromise responsiveness or accessibility.

Avoid excessive empty space that makes the interface appear unfinished.

## 6. Shape, Borders, and Shadows

Use a restrained and consistent shape system:

- Small controls: `8px` border radius.
- Inputs and buttons: `10px–12px` border radius.
- Cards: `16px–20px` border radius.
- Larger interface containers: up to `24px` border radius when appropriate.
- Standard borders: `1px solid var(--color-border)`.

Use subtle shadows to establish visual hierarchy.

Cards must remain visually clean, with enough contrast between their surfaces and the page background.

Avoid excessive glassmorphism, strong blur effects, thick borders, and large dark shadows.

Glass-like transparency may be used selectively, but readability must take priority.

## 7. Main Page Composition

The initial page must prioritize the interactive puzzle and locked padlock.

The login form must remain hidden or inactive until the unlocking sequence has completed.

The main interface should include:

- Official UNIMED logo or appropriate organization identity.
- A short, clear instruction explaining how to solve the puzzle.
- The sliding puzzle board.
- The locked padlock illustration or animation.
- Optional progress feedback or a concise completion message.

Do not add unrelated sections, promotional banners, or excessive navigation to the initial login experience.

The composition must remain balanced on both large and small screens.

The exact placement of the puzzle, padlock, and login form must be finalized in `INTERACTION_SPEC.md`.

## 8. Sliding Puzzle Design

The puzzle board must look like a deliberate part of the interface rather than a generic embedded game.

Requirements:

- Use square tiles with consistent dimensions.
- Preserve the source logo's aspect ratio and correct visual proportions.
- Ensure tile boundaries remain visible without obscuring important logo details.
- Use restrained borders and subtle tile separation.
- Provide clear hover and pressed states on interactive tiles.
- Provide a visible focus state for keyboard interaction.
- Use smooth movement transitions.
- Prevent decorative effects from interfering with tile selection.
- Keep the board centered and sufficiently large for touch interaction.

The puzzle should use the official logo asset rather than a manually recreated approximation.

The default puzzle size is 3 × 3, as defined in `PROJECT_BRIEF.md`.

Do not apply heavy shadows or excessive glow to individual tiles.

## 9. Padlock Visual Design

The padlock is the main visual indicator of puzzle completion.

Its visual treatment must communicate two clear states:

### Locked state

- Clearly recognizable closed padlock.
- Neutral metallic or restrained green-accented appearance.
- Stable positioning relative to the puzzle.
- No animation suggesting that access has already been granted.

### Unlocking and unlocked states

- Smooth, physically understandable movement of the shackle.
- Subtle green light or a restrained success effect.
- No excessive particles, flashes, or distracting visual effects.
- A clear visual difference between locked and unlocked states.

The padlock must remain visually consistent with the overall website.

A CSS/SVG animation or a lightweight animation library is preferred when it can achieve the required result.

Do not use a large video asset for the padlock unless explicitly approved.

## 10. Login Form Design

The login form must visually belong to the same design system as the puzzle interface.

Required elements:

- Organization identity or a concise welcome heading.
- Username or email input.
- Password input.
- Password visibility toggle.
- Primary login button.
- Clear validation and authentication feedback.

Input requirements:

- Visible labels or equivalent accessible names.
- Consistent input heights and spacing.
- Clear focus states.
- Readable placeholder text.
- Error messages placed near the relevant field when appropriate.
- Adequate touch target sizes.

The primary button must use the designated green color.

Disabled, loading, hover, focus, and error states must be visually distinguishable.

Do not reveal the form through a permanent background element or an accidental layout overlap before the unlocking sequence completes.

## 11. Animation Principles

Animations must support understanding, not distract from the task.

Preferred characteristics:

- Smooth transitions.
- Controlled acceleration and deceleration.
- Clear cause-and-effect relationships.
- Consistent motion between related components.
- No unnecessary bouncing or exaggerated movement.

Initial timing guidance:

- Hover and focus transitions: `120ms–200ms`.
- Puzzle tile movement: `160ms–250ms`.
- Form appearance: `250ms–450ms`.
- Padlock unlocking: `400ms–800ms`.

These values are starting points, not mandatory exact timings. Final timing must be tested against the complete interaction sequence.

Respect the user's `prefers-reduced-motion` setting.

When reduced motion is enabled, replace nonessential movement with shorter transitions or simple state changes without breaking functionality.

## 12. Responsive Design

The interface must support:

- Desktop screens.
- Laptop screens.
- Tablets.
- Mobile phones.

Requirements:

- No horizontal page overflow.
- Puzzle tiles remain large enough to interact with.
- The logo remains recognizable at smaller sizes.
- Form fields fit within the available viewport.
- The padlock does not overlap important controls.
- Text remains readable without unnecessary zooming.
- The primary action remains easy to find.
- Transitions do not cause unexpected layout shifts.

Use responsive CSS rather than maintaining separate unrelated designs for desktop and mobile.

## 13. Accessibility

The design must support accessible interaction.

Requirements:

- Sufficient text and control contrast.
- Visible keyboard focus indicators.
- Meaningful labels for form inputs.
- Accessible names for interactive puzzle tiles.
- Keyboard-operable controls where applicable.
- Error messages that clearly communicate the problem.
- Reduced-motion support.
- No reliance on color alone to communicate success or failure.

The puzzle must have understandable instructions and must not become unusable for people who cannot use a mouse or touchscreen.

## 14. Asset Management

Use official project assets whenever available.

Store static visual assets in the existing public asset directory or another established project location.

Recommended asset categories include:

- Official UNIMED logo.
- HMJ identity assets, if provided.
- Optional lightweight icons or supporting illustrations.

Do not invent an official-looking organization logo.

Do not distort, recolor, or crop the official UNIMED logo in ways that change its identity.

If the required assets are missing, identify the missing files and request or clearly document the temporary placeholder before treating the design as final.

## 15. Design Quality Rules

Before considering a visual implementation complete, verify that:

- The overall page feels balanced and intentional.
- Colors and typography follow this document.
- Components share consistent spacing and border treatments.
- The puzzle is visually clear and usable.
- The padlock communicates its state correctly.
- The login form remains consistent with the initial interface.
- Animations feel smooth rather than excessive.
- Mobile and desktop layouts are both usable.
- No accidental overlaps, clipped elements, or unreadable text remain.
- No arbitrary visual redesign has been introduced without approval.

## 16. Non-Negotiable Rules

1. Follow this design system for all new components.
2. Reuse established design tokens instead of creating conflicting styles.
3. Preserve the official UNIMED logo and its proportions.
4. Maintain a bright, clean, professional academic appearance.
5. Avoid excessive futuristic effects, dark-heavy palettes, and visual clutter.
6. Never sacrifice accessibility for animation or visual appearance.
7. Do not change the agreed visual direction without explicit approval.
8. Update this document when an approved design-system change affects multiple components.

---

**End of DESIGN_SYSTEM.md**