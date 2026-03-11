import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../../api/authApi';

export default function ForgotPassword() {
  const [email, setEmail]     = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError]     = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setLoading(true);
    try {
      await forgotPassword(email);
      setSuccess('Password reset link has been sent to your email. Please check your inbox.');
    } catch (err) {
      setError(err.userMessage || 'Could not send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: '5rem auto', padding: '0 1.5rem' }}>
      <div className="card">
        <h2 style={{ textAlign: 'center', marginBottom: '.5rem', color: '#14532d' }}>
          Forgot Password
        </h2>
        <p className="text-muted text-center mb-2">
          Enter your registered email to receive a reset link.
        </p>

        {success && <div className="alert alert-success">{success}</div>}
        {error   && <div className="alert alert-error">{error}</div>}

        {!success && (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email" required
                value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <button className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Sending…' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <p className="text-center mt-3" style={{ fontSize: 14 }}>
          <Link to="/login">← Back to Sign In</Link>
        </p>
      </div>
    </div>
  );
}
