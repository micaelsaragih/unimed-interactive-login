/**
 * authentication.js — Authentication service boundary.
 *
 * This module defines the interface between the login form and the backend
 * authentication system. It is intentionally separated from UI code so that
 * a real backend can be wired here without touching the form component.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * CURRENT STATUS: No backend has been configured for this project.
 *
 * The `login` function exported below will REJECT every attempt with a clear
 * "not configured" error. It never simulates success or stores credentials.
 *
 * TO INTEGRATE A REAL BACKEND:
 *   1. Replace the body of the `login` function with your actual HTTP call.
 *   2. Store any session token using your auth provider's recommended method
 *      (e.g. httpOnly cookie set by the server, or a short-lived JWT in memory).
 *   3. Never log or store the plain-text password.
 *
 * Example integration comment block:
 *
 *   const response = await fetch('/api/auth/login', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     credentials: 'include',          // send/receive httpOnly cookies
 *     body: JSON.stringify({ username, password }),
 *   });
 *   if (!response.ok) {
 *     const data = await response.json().catch(() => ({}));
 *     return { success: false, error: data.message ?? 'Kredensial tidak valid.' };
 *   }
 *   return { success: true };
 *
 * ──────────────────────────────────────────────────────────────────────────
 * SECURITY RULES (must remain true after integration):
 *   - Never include passwords in log statements.
 *   - Never store the password in localStorage, sessionStorage, or app state.
 *   - Never accept frontend state as proof of authentication on the server.
 *   - Always validate credentials on the server side.
 * ──────────────────────────────────────────────────────────────────────────
 */

/**
 * Submits credentials to the configured authentication backend.
 *
 * Returns a resolved Promise in both success and failure cases so callers
 * can use async/await without top-level try/catch for network errors that
 * are caught internally.
 *
 * Throws only for unexpected, unrecoverable errors (e.g. programming mistakes).
 *
 * @param {{ username: string, password: string }} credentials
 * @returns {Promise<{ success: true } | { success: false, error: string }>}
 */
export async function login(credentials) {
  // ── Validation guard — should not be reached; the form validates first ──
  if (!credentials.username.trim() || !credentials.password) {
    return { success: false, error: 'Lengkapi semua kolom yang wajib diisi.' };
  }

  // ── Backend not configured ────────────────────────────────────────────
  // Remove this block and replace with a real fetch call when the backend
  // endpoint is available. See the integration notes above.
  return {
    success: false,
    error:
      'Layanan autentikasi belum tersedia karena integrasi dengan backend belum dilakukan.',
  };

  // ── Example integration (commented out until backend is ready) ─────────
  // try {
  //   const response = await fetch('/api/auth/login', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     credentials: 'include',
  //     body: JSON.stringify({
  //       username: credentials.username.trim(),
  //       password: credentials.password,
  //     }),
  //   });
  //
  //   if (response.ok) {
  //     return { success: true };
  //   }
  //
  //   const data = await response.json().catch(() => ({}));
  //   return {
  //     success: false,
  //     error: data.message ?? 'Kredensial tidak valid. Silakan coba lagi.',
  //   };
  // } catch {
  //   return {
  //     success: false,
  //     error: 'Koneksi gagal. Periksa koneksi internet Anda lalu coba lagi.',
  //   };
  // }
}
