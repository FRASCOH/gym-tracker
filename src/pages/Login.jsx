import { useState } from 'react';
import { signInWithEmail, signUpWithEmail, signInWithGoogle } from '../lib/supabase';
import { Mail, Lock, LogIn, UserPlus, AlertCircle } from 'lucide-react';

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const fn = isSignUp ? signUpWithEmail : signInWithEmail;
      const { error: authError } = await fn(email, password);

      if (authError) {
        setError(authError.message);
      }
    } catch (err) {
      setError('Si è verificato un errore. Riprova.');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setError('');
    const { error: authError } = await signInWithGoogle();
    if (authError) {
      setError(authError.message);
    }
  }

  return (
    <div className="auth-container">
      {/* Logo */}
      <div className="auth-logo">🏋️</div>
      <h1 className="auth-title text-gradient">GymTracker</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
        Metodo inVictus Academy
      </p>

      {/* Auth card */}
      <div className="auth-card">
        {/* Google Button */}
        <button
          className="btn btn-google btn-full btn-lg"
          onClick={handleGoogleLogin}
          id="google-login-btn"
        >
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Accedi con Google
        </button>

        <div className="auth-divider">oppure</div>

        {/* Email form */}
        <form onSubmit={handleSubmit} className="stack stack-md">
          <div>
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Mail
                size={18}
                style={{
                  position: 'absolute',
                  left: 14,
                  color: 'var(--text-tertiary)',
                  pointerEvents: 'none',
                }}
              />
              <input
                type="email"
                className="input"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                id="email-input"
                style={{ paddingLeft: 42 }}
              />
            </div>
          </div>

          <div>
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Lock
                size={18}
                style={{
                  position: 'absolute',
                  left: 14,
                  color: 'var(--text-tertiary)',
                  pointerEvents: 'none',
                }}
              />
              <input
                type="password"
                className="input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                id="password-input"
                style={{ paddingLeft: 42 }}
              />
            </div>
          </div>

          {error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-danger-bg)',
                color: 'var(--color-danger)',
                fontSize: '0.8125rem',
              }}
            >
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            disabled={loading}
            id="submit-btn"
          >
            {loading ? (
              <span className="animate-pulse">...</span>
            ) : isSignUp ? (
              <>
                <UserPlus size={18} /> Registrati
              </>
            ) : (
              <>
                <LogIn size={18} /> Accedi
              </>
            )}
          </button>
        </form>

        {/* Toggle Sign up / Sign in */}
        <div
          style={{
            textAlign: 'center',
            marginTop: 20,
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
          }}
        >
          {isSignUp ? 'Hai già un account?' : 'Non hai un account?'}{' '}
          <button
            className="btn btn-ghost"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
            style={{
              display: 'inline',
              padding: 0,
              color: 'var(--accent-primary-light)',
              fontWeight: 600,
            }}
          >
            {isSignUp ? 'Accedi' : 'Registrati'}
          </button>
        </div>
      </div>
    </div>
  );
}
