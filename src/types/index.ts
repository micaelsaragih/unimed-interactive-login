/**
 * Application state type — mirrors the state machine defined in INTERACTION_SPEC.md.
 *
 * Transitions:
 *   locked → unlocking    (puzzle solved)
 *   unlocking → unlocked  (padlock animation complete)
 *   unlocked → authenticating (form submitted)
 *   authenticating → authenticated | authentication-error
 *   authentication-error → authenticating (retry)
 */
export type LoginFlowStatus =
  | 'locked'
  | 'unlocking'
  | 'unlocked'
  | 'authenticating'
  | 'authentication-error'
  | 'authenticated';

export type LoginFlowState =
  | { status: 'locked' }
  | { status: 'unlocking' }
  | { status: 'unlocked' }
  | { status: 'authenticating' }
  | { status: 'authentication-error'; message: string }
  | { status: 'authenticated' };
