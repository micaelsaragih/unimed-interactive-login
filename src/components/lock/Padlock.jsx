import { useEffect, useRef } from 'react';
import styles from './Padlock.module.css';

export function Padlock({
  state,
  onUnlockComplete,
  exiting = false,
  onExitComplete,
}) {
  const callbackFiredRef = useRef(false);
  const exitCallbackFiredRef = useRef(false);
  const onExitCompleteRef = useRef(onExitComplete);
  onExitCompleteRef.current = onExitComplete;

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

  function handleShackleAnimationEnd() {
    if (isAnimating && !callbackFiredRef.current) {
      callbackFiredRef.current = true;
      onUnlockComplete?.();
    }
  }

  function handleExitAnimationEnd(event) {
    if (event.target !== event.currentTarget || !exiting || exitCallbackFiredRef.current) {
      return;
    }
    exitCallbackFiredRef.current = true;
    onExitCompleteRef.current?.();
  }

  const shackleOpen = 'M20 32 V14 A12 12 0 0 1 44 14 V24';
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
        <rect
          x="6"
          y="32"
          width="52"
          height="40"
          rx="8"
          className={styles.body}
        />

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

        <circle cx="32" cy="52" r="5" className={styles.keyhole} />
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
