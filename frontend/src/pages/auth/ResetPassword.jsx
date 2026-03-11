import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { validateResetToken, resetPassword } from '../../api/passwordResetApi';

export default function ResetPassword() {
  const [searchParams]      = useSearchParams();
  const navigate            = useNavigate();
  const token               = searchParams.get('token');

  const [tokenValid, setTokenValid] = useState(null); // null=checking, true, false
  const [password, setPassword]     = useState('');
  const [confirm, setConfirm]       = useState('');
  const [loading, setLoading]       = useState(false);
  const [success, setSuccess]       = useState('');
  const [error, setError]           = useState('');

  // Validate token on mount
  useEffect(() => {
    if (!token) { setTokenValid(false); return; }
    validateResetToken(token)
      .then((res) => setTokenValid(res.data?.valid === true))
      .catch(() => setTokenValid(false));
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (password.length < 6)  { setError('Password must be at least 6 characters.'); return; }

    setLoading(true);
    try {
      const res = await resetPassword(token, password);
      if (res.data?.success) {
        setSuccess('Password reset successfully! Redirecting to login…');
        setTimeout(() => navigate('/login'), 2500);
      } else {
        setError(res.data?.message || 'Reset failed.');
      }
    } catch (err) {
      setError(err.userMessage || 'Could not reset password.');
    } finally {
      setLoading(false);
    }
  };

  if (tokenValid === null) {
    return <div className="text-center mt-3">Validating reset link…</div>;
  }

  if (!tokenValid) {
    return (
      <div style={{ maxWidth: 420, margin: '5rem auto', padding: '0 1.5rem' }}>
        <div className="card text-center">
          <p style={{ fontSize: 40, marginBottom: '.75rem' }}>⚠️</p>
          <h3 style={{ marginBottom: '.5rem' }}>Invalid or Expired Link</h3>
          <p className="text-muted mb-2">This reset link is no longer valid.</p>
          <Link to="/forgot-password" className="btn btn-primary btn-block">
            Request a New Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 420, margin: '5rem auto', padding: '0 1.5rem' }}>
      <div className="card">
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#14532d' }}>
          Set New Password
        </h2>

        {success && <div className="alert alert-success">{success}</div>}
        {error   && <div className="alert alert-error">{error}</div>}

        {!success && (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password" required minLength={6}
                value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
              />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password" required
                value={confirm} onChange={(e) => setConfirm(e.target.value)}
                placeholder="Re-enter password"
              />
            </div>
            <button className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Resetting…' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
