import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, ArrowLeft, X } from 'lucide-react';
import { login, forgotPassword } from '../../api/authApi';
import { saveUser } from '../../utils/storage';
import logo from '../../assets/logo4.png';
import './Auth.css';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Forgot-password modal state
  const [fpOpen, setFpOpen] = useState(false);
  const [fpEmail, setFpEmail] = useState('');
  const [fpLoading, setFpLoading] = useState(false);
  const [fpMessage, setFpMessage] = useState('');
  const [fpError, setFpError] = useState('');
  const fpInputRef = useRef(null);

  // Focus the email input when modal opens
  useEffect(() => {
    if (fpOpen && fpInputRef.current) fpInputRef.current.focus();
  }, [fpOpen]);

  // Close modal on Escape
  useEffect(() => {
    if (!fpOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') closeFpModal(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [fpOpen]);

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

  /* ── Forgot-password helpers ─────────────────────────── */
  const openFpModal = (e) => {
    e.preventDefault();
    setFpEmail(form.email); // pre-fill with login email if any
    setFpMessage('');
    setFpError('');
    setFpOpen(true);
  };

  const closeFpModal = () => {
    setFpOpen(false);
    setFpMessage('');
    setFpError('');
  };

  const handleFpSubmit = async (e) => {
    e.preventDefault();
    if (!fpEmail.trim()) return;
    setFpError('');
    setFpMessage('');
    setFpLoading(true);
    try {
      await forgotPassword(fpEmail.trim());
      setFpMessage('Password reset link has been sent to your email.');
    } catch (err) {
      setFpError(err.userMessage || 'No account found with that email address.');
    } finally {
      setFpLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-login">
        <div className="auth-logo-container">
          <img src={logo} alt="OngoleBulls" className="auth-logo" />
        </div>

        <h2 className="auth-title">Sign In</h2>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div>
            <label className="auth-label">Email Address</label>
            <input
              type="email" name="email" required
              value={form.email} onChange={handleChange}
              placeholder="you@example.com"
              className="auth-input"
            />
          </div>

          <div>
            <label className="auth-label">Password</label>
            <div className="auth-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password" required
                value={form.password} onChange={handleChange}
                placeholder="••••••••"
                className="auth-input auth-input--has-icon"
              />
              <button
                type="button"
                className="auth-eye-toggle"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <a
              href="#"
              onClick={openFpModal}
              className="auth-link"
              style={{ fontSize: '13px' }}
            >
              Forgot password?
            </a>
          </div>

          <button className="auth-btn auth-btn-primary" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="auth-footer-text">
          Don't have an account?{' '}
          <Link to="/signup" className="auth-link">Create one</Link>
        </p>
      </div>

      {/* ── Forgot-password modal ──────────────────────────── */}
      {fpOpen && (
        <div className="fp-overlay" onClick={closeFpModal}>
          <div className="fp-modal" onClick={(e) => e.stopPropagation()}>
            <button className="fp-close" onClick={closeFpModal} aria-label="Close">
              <X size={20} />
            </button>

            <div className="fp-icon-circle">
              <Mail size={24} />
            </div>

            <h3 className="fp-title">Reset your password</h3>
            <p className="fp-desc">
              Enter the email address associated with your account and we'll send you a link to reset your password.
            </p>

            {fpError && <div className="auth-error" style={{ marginBottom: '1rem' }}>{fpError}</div>}

            {fpMessage ? (
              <div className="fp-success">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
                  <circle cx="10" cy="10" r="10" fill="#dcfce7" />
                  <path d="M6 10.5l2.5 2.5L14 7.5" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>{fpMessage}</span>
              </div>
            ) : (
              <form onSubmit={handleFpSubmit} className="fp-form">
                <input
                  ref={fpInputRef}
                  type="email"
                  required
                  value={fpEmail}
                  onChange={(e) => setFpEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="auth-input"
                  disabled={fpLoading}
                />
                <button
                  type="submit"
                  className="auth-btn auth-btn-primary"
                  disabled={fpLoading || !fpEmail.trim()}
                >
                  {fpLoading ? 'Sending…' : 'Send Reset Link'}
                </button>
              </form>
            )}

            <button className="fp-back" onClick={closeFpModal}>
              <ArrowLeft size={14} /> Back to sign in
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
