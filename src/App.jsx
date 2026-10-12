/**
 * App — root component for HMJ UNIMED Interactive Login.
 *
 * Phase 5: Functional login form integrated.
 *
 * State machine (INTERACTION_SPEC.md §3):
 *   locked            → unlocking          (puzzle solved)
 *   unlocking         → unlocked           (padlock animation complete)
 *   unlocked          → authenticating     (form submitted)
 *   authenticating    → authenticated      (auth service confirmed success)
 *   authenticating    → authentication-error (auth service returned failure)
 *   authentication-error → authenticating  (user retries)
 *
 * Authentication is handled by src/lib/authentication.js.
 * The form is not rendered before the `unlocked` state is reached.
 */

import { useEffect, useRef, useState } from 'react';
import { PuzzleBoard } from './components/puzzle/PuzzleBoard';
import { Padlock } from './components/lock/Padlock';
import { LoginForm } from './components/login/LoginForm';
import './App.css';

const PUZZLE_BACKGROUND_VIDEO = '/assets/bg-login-wisuda-hijau.mp4';
const LOGIN_BACKGROUND_IMAGE = '/assets/bg.jpg';

export default function App() {
  const [flowState, setFlowState] = useState({ status: 'locked' });
  const [screen, setScreen] = useState('puzzle');
  const [dissolveSeed, setDissolveSeed] = useState(null);
  const [backgroundVideoUnavailable, setBackgroundVideoUnavailable] = useState(false);
  const backgroundVideoRef = useRef(null);

  useEffect(() => {
    const video = backgroundVideoRef.current;
    if (!video || backgroundVideoUnavailable) return;

    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePlayback = () => {
      if (motionPreference.matches || document.hidden) {
        video.pause();
        return;
      }

      video.play().catch(() => {
        if (video.isConnected) setBackgroundVideoUnavailable(true);
      });
    };

    updatePlayback();
    motionPreference.addEventListener('change', updatePlayback);
    document.addEventListener('visibilitychange', updatePlayback);

    return () => {
      motionPreference.removeEventListener('change', updatePlayback);
      document.removeEventListener('visibilitychange', updatePlayback);
    };
  }, [screen, backgroundVideoUnavailable]);

  useEffect(() => {
    if (screen !== 'settling') return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = window.setTimeout(() => {
      setDissolveSeed(Math.floor(Math.random() * 0x7fffffff));
      setScreen('dissolving');
    }, reducedMotion ? 0 : 250);

    return () => window.clearTimeout(timer);
  }, [screen]);

  // ── Puzzle solved → begin unlock sequence ─────────────────────────────
  function handlePuzzleSolved() {
    setFlowState((prev) =>
      prev.status === 'locked' ? { status: 'unlocking' } : prev
    );
  }

  // ── Padlock animation complete → reveal form ──────────────────────────
  function handleUnlockComplete() {
    setFlowState((prev) =>
      prev.status === 'unlocking' ? { status: 'unlocked' } : prev
    );
    setScreen((current) => current === 'puzzle' ? 'settling' : current);
  }

  function handleTransitionComplete() {
    setScreen((current) => current === 'dissolving' ? 'login' : current);
  }

  // ── Form submitted with valid input → authenticating ──────────────────
  function handleAuthenticating() {
    setFlowState((prev) =>
      prev.status === 'unlocked' || prev.status === 'authentication-error'
        ? { status: 'authenticating' }
        : prev
    );
  }

  // ── Auth service returned failure ─────────────────────────────────────
  function handleAuthError(message) {
    setFlowState((prev) =>
      prev.status === 'authenticating'
        ? { status: 'authentication-error', message }
        : prev
    );
  }

  // ── Auth service confirmed success ────────────────────────────────────
  // NOTE: Only called when the real backend confirms authentication.
  // The puzzle completion alone does NOT trigger this.
  function handleAuthenticated() {
    setFlowState((prev) =>
      prev.status === 'authenticating' ? { status: 'authenticated' } : prev
    );
  }

  // ── Derived state helpers ─────────────────────────────────────────────
  const isFormVisible =
    flowState.status === 'unlocked' ||
    flowState.status === 'authenticating' ||
    flowState.status === 'authentication-error' ||
    flowState.status === 'authenticated';

  const padlockState =
    flowState.status === 'unlocking'
      ? 'unlocking'
      : isFormVisible
      ? 'unlocked'
      : 'locked';

  const isAuthenticated = flowState.status === 'authenticated';

  return (
    <div className={`app-root${screen === 'login' ? ' login-screen' : ''}${backgroundVideoUnavailable && screen !== 'login' ? ' background-video-fallback' : ''}`}>
      {screen !== 'login' && !backgroundVideoUnavailable && (
        <video
          ref={backgroundVideoRef}
          className="app-background-video"
          src={PUZZLE_BACKGROUND_VIDEO}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          controls={false}
          tabIndex={-1}
          aria-hidden="true"
          onError={() => setBackgroundVideoUnavailable(true)}
        />
      )}
      {screen === 'login' && (
        <div
          className="app-background-photo"
          style={{ backgroundImage: `url("${LOGIN_BACKGROUND_IMAGE}")` }}
          aria-hidden="true"
        />
      )}
      <div className="app-background-overlay" aria-hidden="true" />

      {/* ── Main ───────────────────────────────────────────────── */}
      <main className={`app-main${screen === 'login' ? ' login-main' : ''}`} id="main-content">
        {screen !== 'login' ? (
          <div className={`content-card${screen === 'dissolving' ? ' content-card-dissolving' : ''}`}>

          {/* ── Intro ──────────────────────────────────────────── */}
          <section className="intro-section" aria-labelledby="page-title">
            <h1 id="page-title" className="page-title">
              Akses Sistem
            </h1>
            {flowState.status === 'locked' && (
              <p className="page-subtitle">
                Pilih dua keping untuk menukar posisinya, lalu susun logo UNIMED
                untuk membuka akses masuk.
              </p>
            )}
          </section>

          {/* ── Puzzle ─────────────────────────────────────────── */}
          <section className="puzzle-section" aria-label="Area puzzle">
            <PuzzleBoard
              onSolved={handlePuzzleSolved}
              disabled={flowState.status !== 'locked'}
              dissolving={screen === 'dissolving'}
              dissolveSeed={dissolveSeed}
            />
          </section>

          {/* ── Padlock ────────────────────────────────────────── */}
          <section className="padlock-section" aria-label="Status akses">
            <Padlock
              state={padlockState}
              onUnlockComplete={handleUnlockComplete}
              exiting={screen === 'dissolving'}
              onExitComplete={handleTransitionComplete}
            />

            {flowState.status === 'locked' && (
              <p className="padlock-hint" role="status" aria-live="polite">
                Selesaikan puzzle untuk membuka akses masuk.
              </p>
            )}
          </section>

          {/* ── Login form ─────────────────────────────────────── */}
          {/* Form entry waits until both visual exit animations have completed. */}
          </div>
        ) : (
          <div className="login-view">
            {isFormVisible && !isAuthenticated && (
              <LoginForm
                onAuthenticating={handleAuthenticating}
                onAuthError={handleAuthError}
                onAuthenticated={handleAuthenticated}
                authError={
                  flowState.status === 'authentication-error'
                    ? flowState.message
                    : undefined
                }
              />
            )}

            {isAuthenticated && (
              <section className="auth-success-section" aria-live="polite">
                <p className="auth-success-msg">✓ Berhasil masuk.</p>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
