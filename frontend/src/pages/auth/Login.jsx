import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../api/authApi';
import { saveUser } from '../../utils/storage';
import logo from '../../assets/logo4.png';
import './Auth.css';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(form.email, form.password);
      saveUser(res.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.userMessage || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-login">
        <div className="auth-logo-container">
          <img src={logo} alt="OngoleBulls" className="auth-logo" />
        </div>

        <h2 className="auth-title">
          Sign In
        </h2>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div>
            <label className="auth-label">
              Email Address
            </label>
            <input
              type="email" name="email" required
              value={form.email} onChange={handleChange}
              placeholder="you@example.com"
              className="auth-input"
            />
          </div>

          <div>
            <label className="auth-label">
              Password
            </label>
            <input
              type="password" name="password" required
              value={form.password} onChange={handleChange}
              placeholder="••••••••"
              className="auth-input"
            />
          </div>

          <div style={{ textAlign: 'right' }}>
            <Link to="/forgot-password" className="auth-link" style={{ fontSize: '13px' }}>
              Forgot password?
            </Link>
          </div>

          <button
            className="auth-btn auth-btn-primary"
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="auth-footer-text">
          Don't have an account?{' '}
          <Link to="/signup" className="auth-link">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
