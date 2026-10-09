/**
 * LoginFormPlaceholder — structural placeholder for the login form.
 *
 * Per INTERACTION_SPEC.md the login form must NOT be interactive or focusable
 * before the `unlocked` state is reached. This placeholder component:
 *
 *   - Renders the correct form structure in the DOM for layout purposes.
 *   - Is fully inaccessible (aria-hidden, inert, tabIndex=-1 on all controls)
 *     when `available` is false.
 *   - Uses conditional rendering (`available` gate) so keyboard users cannot
 *     reach it via Tab before the puzzle is solved.
 *
 * In Phase 5 this will be replaced by the real LoginForm component.
 */

import styles from './LoginFormPlaceholder.module.css';

interface LoginFormPlaceholderProps {
  available: boolean;
}

export function LoginFormPlaceholder({ available }: LoginFormPlaceholderProps) {
  // Do not render at all until the unlocked state is reached.
  // This is the safest approach per INTERACTION_SPEC.md §7.1.
  if (!available) return null;

  return (
    <section className={styles.formSection} aria-label="Formulir masuk">
      <h2 className={styles.heading}>Masuk ke Akun</h2>

      <form className={styles.form} onSubmit={(e) => e.preventDefault()} noValidate>
        <div className={styles.field}>
          <label htmlFor="login-username" className={styles.label}>
            Nama Pengguna atau Email
          </label>
          <input
            id="login-username"
            type="text"
            className={styles.input}
            autoComplete="username"
            placeholder="Masukkan nama pengguna atau email"
            disabled
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="login-password" className={styles.label}>
            Kata Sandi
          </label>
          <div className={styles.passwordWrapper}>
            <input
              id="login-password"
              type="password"
              className={styles.input}
              autoComplete="current-password"
              placeholder="Masukkan kata sandi"
              disabled
            />
            {/* Password visibility toggle — wired in Phase 5 */}
            <button
              type="button"
              className={styles.visibilityToggle}
              aria-label="Tampilkan kata sandi"
              disabled
            >
              <EyeIcon />
            </button>
          </div>
        </div>

        <button type="submit" className={styles.submitButton} disabled>
          Masuk
        </button>

      </form>
    </section>
  );
}

/* Inline eye icon — no external dependency */
function EyeIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
