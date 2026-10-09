/**
 * Padlock — animated SVG padlock for the HMJ UNIMED login flow.
 *
 * Responds to three states driven by the parent App state machine:
 *   - `locked`    — padlock closed, shackle in down position
 *   - `unlocking` — shackle animates upward; fires onUnlockComplete when done
 *   - `unlocked`  — stable open state; form becomes available
 *
 * Animation strategy:
 *   - The shackle `<path>` receives a CSS animation class while state = `unlocking`.
 *   - React's `onAnimationEnd` synthetic event fires when that animation finishes.
 *   - A guard ref ensures onUnlockComplete is called at most once per unlock.
 *   - For reduced-motion users, the animation is suppressed and onUnlockComplete
 *     is invoked immediately via a microtask so the state machine still advances.
 *
 * Props:
 *   state             — current padlock visual state (controlled by App)
 *   onUnlockComplete  — callback fired once when unlocking animation finishes
 */

import { useEffect, useRef } from 'react';
import styles from './Padlock.module.css';

type PadlockState = 'locked' | 'unlocking' | 'unlocked';

interface PadlockProps {
  state: PadlockState;
  onUnlockComplete?: () => void;
  exiting?: boolean;
  onExitComplete?: () => void;
}

export function Padlock({
  state,
  onUnlockComplete,
  exiting = false,
  onExitComplete,
}: PadlockProps) {
  /** Prevents onUnlockComplete from firing more than once per unlock sequence. */
  const callbackFiredRef = useRef(false);
  const exitCallbackFiredRef = useRef(false);
  const onExitCompleteRef = useRef(onExitComplete);
  onExitCompleteRef.current = onExitComplete;

  /** Detects whether the user prefers reduced motion. */
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Reset the guard whenever we return to locked so a future unlock works.
  useEffect(() => {
    if (state === 'locked') {
      callbackFiredRef.current = false;
    }
  }, [state]);

  useEffect(() => {
    if (!exiting) {
      exitCallbackFiredRef.current = false;
      return;
    }

    const completeExit = () => {
      if (exitCallbackFiredRef.current) return;
      exitCallbackFiredRef.current = true;
      onExitCompleteRef.current?.();
    };

    if (prefersReducedMotion) {
      const frame = window.requestAnimationFrame(completeExit);
      return () => window.cancelAnimationFrame(frame);
    }

    const fallback = window.setTimeout(completeExit, 1250);
    return () => window.clearTimeout(fallback);
  }, [exiting, prefersReducedMotion]);

  // For reduced-motion users: skip the animation and advance the state immediately.
  useEffect(() => {
    if (state === 'unlocking' && prefersReducedMotion && !callbackFiredRef.current) {
      callbackFiredRef.current = true;
      // Use a microtask so the current render cycle completes first.
      Promise.resolve().then(() => onUnlockComplete?.());
    }
  }, [state, prefersReducedMotion, onUnlockComplete]);

  const isOpen = state === 'unlocked';
  const isAnimating = state === 'unlocking';

  /**
   * Fired by React when the CSS animation on the shackle ends.
   * Guard ensures it triggers at most once.
   */
  function handleShackleAnimationEnd() {
    if (isAnimating && !callbackFiredRef.current) {
      callbackFiredRef.current = true;
      onUnlockComplete?.();
    }
  }

  function handleExitAnimationEnd(event: React.AnimationEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget || !exiting || exitCallbackFiredRef.current) {
      return;
    }
    exitCallbackFiredRef.current = true;
    onExitCompleteRef.current?.();
  }

  // Open-position shackle path (used for both `unlocking` and `unlocked` states)
  const shackleOpen = 'M20 32 V14 A12 12 0 0 1 44 14 V24';
  // Closed-position shackle path
  const shackleClosed = 'M20 32 V22 A12 12 0 0 1 44 22 V32';

  return (
    <div
      className={[
        styles.wrapper,
        isOpen ? styles.open : '',
        isAnimating ? styles.animating : '',
        exiting ? styles.exiting : '',
      ].filter(Boolean).join(' ')}
      onAnimationEnd={handleExitAnimationEnd}
      aria-hidden={exiting}
      aria-label={
        isOpen
          ? 'Gembok terbuka — akses masuk tersedia'
          : isAnimating
          ? 'Membuka kunci…'
          : 'Gembok terkunci — selesaikan puzzle untuk melanjutkan'
      }
      role="img"
    >
      <svg
        className={styles.icon}
        viewBox="0 0 64 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        overflow="visible"
      >
        {/* Lock body */}
        <rect
          x="6"
          y="32"
          width="52"
          height="40"
          rx="8"
          className={styles.body}
        />

        {/*
         * Shackle path:
         *   - When animating: path is set to the OPEN position and the CSS
         *     animation starts with a translateY offset that simulates movement
         *     from the closed to open position.
         *   - When locked: path is the CLOSED position, no animation.
         *   - When unlocked: path stays at OPEN position, no animation.
         *
         * onAnimationEnd is on this element so it fires when the shackle
         * animation specifically completes.
         */}
        <path
          d={isAnimating || isOpen ? shackleOpen : shackleClosed}
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={[
            styles.shackle,
            isAnimating && !prefersReducedMotion ? styles.shackleAnimating : '',
          ].filter(Boolean).join(' ')}
          onAnimationEnd={handleShackleAnimationEnd}
        />

        {/* Keyhole — circle */}
        <circle cx="32" cy="52" r="5" className={styles.keyhole} />
        {/* Keyhole — slot */}
        <rect
          x="29"
          y="55"
          width="6"
          height="7"
          rx="2"
          className={styles.keyhole}
        />
      </svg>

      <span className={styles.label} aria-live="polite">
        {isOpen
          ? 'Terbuka'
          : isAnimating
          ? 'Membuka kunci…'
          : 'Terkunci'}
      </span>
    </div>
  );
}
