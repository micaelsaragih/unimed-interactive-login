/**
 * PadlockPlaceholder — inline SVG padlock that communicates the locked state.
 *
 * This is a static visual placeholder used during Phase 2 (foundation).
 * In Phase 4, this component will be replaced by the animated Padlock
 * component that responds to the `unlocking` and `unlocked` app states.
 *
 * Props:
 *   - state: 'locked' | 'unlocking' | 'unlocked' — controls which icon variant
 *     is shown. For now only 'locked' is rendered; the others show the same
 *     icon so the component is ready to accept the real state.
 */

import styles from './PadlockPlaceholder.module.css';

type PadlockState = 'locked' | 'unlocking' | 'unlocked';

interface PadlockPlaceholderProps {
  state?: PadlockState;
}

export function PadlockPlaceholder({ state = 'locked' }: PadlockPlaceholderProps) {
  const isOpen = state === 'unlocked';
  const isAnimating = state === 'unlocking';

  return (
    <div
      className={`${styles.wrapper} ${isOpen ? styles.open : ''} ${isAnimating ? styles.animating : ''}`}
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

        {/* Shackle — closed: centered arc; open: raised arc */}
        <path
          d={
            isOpen
              ? /* open shackle — raised up-left */ 'M20 32 V14 A12 12 0 0 1 44 14 V24'
              : /* closed shackle */               'M20 32 V22 A12 12 0 0 1 44 22 V32'
          }
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={styles.shackle}
        />

        {/* Keyhole body */}
        <circle cx="32" cy="52" r="5" className={styles.keyhole} />
        <rect x="29" y="55" width="6" height="7" rx="2" className={styles.keyhole} />
      </svg>

      <span className={styles.label}>
        {isOpen ? 'Terbuka' : isAnimating ? 'Membuka kunci…' : 'Terkunci'}
      </span>
    </div>
  );
}
