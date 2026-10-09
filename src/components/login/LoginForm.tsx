/**
 * LoginForm — functional login form for HMJ UNIMED.
 *
 * Only rendered after the padlock animation completes (state = `unlocked`).
 * The parent App component is responsible for enforcing that rule.
 *
 * Local responsibilities:
 *   - Collecting and validating username/email + password.
 *   - Managing password visibility toggle.
 *   - Managing loading and error UI states.
 *   - Preventing duplicate submissions.
 *   - Calling the authentication service and reporting the result.
 *
 * Props:
 *   onAuthenticating  — called when a valid submission starts (→ authenticating)
 *   onAuthError       — called when auth fails, with a user-friendly message
 *   onAuthenticated   — called only on confirmed success from the auth service
 *
 * Authentication is delegated to src/lib/authentication.ts.
 * This component never fabricates a successful login.
 */

import { useEffect, useRef, useState } from 'react';
import { login } from '../../lib/authentication';
import styles from './LoginForm.module.css';

interface LoginFormProps {
  onAuthenticating: () => void;
  onAuthError: (message: string) => void;
  onAuthenticated: () => void;
  /** Auth-level error message from the parent state machine (authentication-error state). */
  authError?: string;
}

interface FieldErrors {
  username?: string;
  password?: string;
}

export function LoginForm({
  onAuthenticating,
  onAuthError,
  onAuthenticated,
  authError,
}: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Focus the username field when the form first mounts (after unlock).
  const usernameRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    // Small delay so the form's reveal animation completes first.
    const timer = setTimeout(() => usernameRef.current?.focus(), 380);
    return () => clearTimeout(timer);
  }, []);

  // ── Client-side validation ───────────────────────────────────────────
  function validate(): FieldErrors {
    const errors: FieldErrors = {};
    const u = username.trim();

    if (!u) {
      errors.username = 'Masukkan nama pengguna atau email.';
    }

    if (!password) {
      errors.password = 'Masukkan kata sandi.';
    }

    return errors;
  }

  // ── Form submission ──────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Prevent duplicate submissions
    if (isSubmitting) return;

    // Clear previous field-level errors
    setFieldErrors({});

    // Validate before calling the service
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      // Focus the first invalid field
      if (errors.username) usernameRef.current?.focus();
      return;
    }

    // Transition app state to authenticating
    setIsSubmitting(true);
    onAuthenticating();

    const result = await login({ username: username.trim(), password });

    setIsSubmitting(false);

    if (result.success) {
      // Clear sensitive input before handing off
      setPassword('');
      onAuthenticated();
    } else {
      // Clear password on failure for security
      setPassword('');
      onAuthError(result.error);
    }
  }

  // ── Clear a field error as soon as the user types ────────────────────
  function handleUsernameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setUsername(e.target.value);
    if (fieldErrors.username) {
      setFieldErrors((prev) => ({ ...prev, username: undefined }));
    }
  }

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
    if (fieldErrors.password) {
      setFieldErrors((prev) => ({ ...prev, password: undefined }));
    }
  }

  const usernameErrorId = 'login-username-error';
  const passwordErrorId = 'login-password-error';

  return (
    <section className={styles.section} aria-label="Formulir masuk">
      <img
        src="/assets/logo-unimed.png"
        alt="Logo UNIMED"
        className={styles.brandLogo}
        width="76"
        height="76"
      />
      <h2 className={styles.heading}>Masuk ke Akun</h2>

      {/* Auth-level error banner (from authentication-error state) */}
      {authError && (
        <div className={styles.authErrorBanner} role="alert" aria-live="assertive">
          <span className={styles.authErrorIcon} aria-hidden="true">⚠</span>
          {authError}
        </div>
      )}

      <form
        className={styles.form}
        onSubmit={handleSubmit}
        noValidate
        aria-busy={isSubmitting ? 'true' : 'false'}
      >
        {/* ── Username / e-mail ───────────────────────────────── */}
        <div className={styles.field}>
          <label htmlFor="login-username" className={styles.label}>
            Nama Pengguna atau Email
          </label>
          <input
            ref={usernameRef}
            id="login-username"
            type="text"
            className={`${styles.input} ${fieldErrors.username ? styles.inputError : ''}`}
            value={username}
            onChange={handleUsernameChange}
            autoComplete="username"
            placeholder="Masukkan nama pengguna atau email"
            disabled={isSubmitting}
            aria-required="true"
            aria-invalid={!!fieldErrors.username}
            aria-describedby={fieldErrors.username ? usernameErrorId : undefined}
            spellCheck={false}
            autoCapitalize="off"
          />
          {fieldErrors.username && (
            <span id={usernameErrorId} className={styles.errorMsg} role="alert">
              {fieldErrors.username}
            </span>
          )}
        </div>

        {/* ── Password ─────────────────────────────────────────── */}
        <div className={styles.field}>
          <label htmlFor="login-password" className={styles.label}>
            Kata Sandi
          </label>
          <div className={styles.passwordRow}>
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              className={`${styles.input} ${styles.passwordInput} ${fieldErrors.password ? styles.inputError : ''}`}
              value={password}
              onChange={handlePasswordChange}
              autoComplete="current-password"
              placeholder="Masukkan kata sandi"
              disabled={isSubmitting}
              aria-required="true"
              aria-invalid={!!fieldErrors.password}
              aria-describedby={fieldErrors.password ? passwordErrorId : undefined}
            />
            <button
              type="button"
              className={styles.visibilityBtn}
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
              aria-pressed={showPassword}
              tabIndex={0}
              disabled={isSubmitting}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
          {fieldErrors.password && (
            <span id={passwordErrorId} className={styles.errorMsg} role="alert">
              {fieldErrors.password}
            </span>
          )}
        </div>

        {/* ── Submit ───────────────────────────────────────────── */}
        <button
          type="submit"
          className={styles.submitBtn}
          disabled={isSubmitting}
          aria-busy={isSubmitting ? 'true' : 'false'}
        >
          {isSubmitting ? (
            <span className={styles.loadingRow} aria-label="Sedang masuk…">
              <Spinner /> Sedang masuk…
            </span>
          ) : (
            'Masuk'
          )}
        </button>

      </form>
    </section>
  );
}

// ── Inline SVG icons (no external dependency) ─────────────────────────────

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8
               a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8
               a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg
      className={styles.spinner}
      width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" aria-hidden="true"
    >
      <path d="M12 2 A10 10 0 0 1 22 12" />
    </svg>
  );
}
