import { useState, type FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const { user, login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(username, password, remember);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } })
          .response?.data?.errors?.username?.[0]
        || (err as { response?: { data?: { message?: string } } }).response?.data?.message
        || 'Accesso non riuscito.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page-login">
      <div className="login-shell">
        <div className="card card-elevated login-card">
          <div className="login-brand-icon" aria-hidden="true">GH</div>
          <h1>Bentornato</h1>
          <p className="login-subtitle">Accedi a GuestHub per gestire invii Alloggiati Web e Ross1000.</p>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={(e) => void handleSubmit(e)}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
              autoFocus
            />
            <label htmlFor="password" style={{ marginTop: '0.85rem' }}>Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
            <div className="checkbox-row" style={{ marginTop: '0.85rem' }}>
              <label>
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                Resta connesso
              </label>
            </div>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Accesso…' : 'Accedi'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
