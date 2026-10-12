import styles from './LoginFormPlaceholder.module.css';

export function LoginFormPlaceholder({ available }) {
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
