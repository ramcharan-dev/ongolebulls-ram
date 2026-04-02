import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LockKeyhole, Mail, Shield } from 'lucide-react';
import { adminLogin } from '../../api/adminApi';
import { saveAdmin, clearAdmin } from '../../utils/storage';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await adminLogin(email, password);
      const payload = response?.data || {};
      if (!payload.success) {
        setError(payload.message || 'Invalid credentials');
        return;
      }

      clearAdmin();
      saveAdmin({
        email,
        name: payload.name || 'Manager',
        loggedInAt: new Date().toISOString(),
      });

      navigate('/website-controls');
    } catch (err) {
      setError(err.userMessage || 'Unable to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg, #0f172a, #1e293b)', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 420, background: '#fff', borderRadius: 18, border: '1px solid #e2e8f0', boxShadow: '0 30px 80px rgba(2,6,23,.35)', overflow: 'hidden' }}>
        <div style={{ padding: 24, borderBottom: '1px solid #eef2f7', background: 'linear-gradient(135deg, #e0f2fe, #dbeafe)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 999, background: '#fff', border: '1px solid #bae6fd', color: '#0c4a6e', fontWeight: 700, fontSize: 12 }}>
            <Shield size={14} /> Website Controls
          </div>
          <h1 style={{ margin: '12px 0 0', fontSize: 24, color: '#0f172a' }}>Sign In</h1>
          <p style={{ margin: '4px 0 0', color: '#475569', fontSize: 13 }}>Authenticate to manage website content and operations.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: 24 }}>
          {error ? (
            <div style={{ marginBottom: 12, borderRadius: 10, border: '1px solid #fcd34d', background: '#fef3c7', color: '#92400e', padding: '10px 12px', fontSize: 13, fontWeight: 600 }}>
              {error}
            </div>
          ) : null}

          <label style={{ display: 'block', marginBottom: 6, fontSize: 12, color: '#334155', fontWeight: 700 }}>Email</label>
          <div style={{ position: 'relative', marginBottom: 12 }}>
            <Mail size={14} style={{ position: 'absolute', left: 10, top: 11, color: '#94a3b8' }} />
            <input
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              placeholder="controls@ongolebullsinvest.com"
              style={{ width: '100%', border: '1px solid #dbe1ea', borderRadius: 10, padding: '9px 10px 9px 34px', fontSize: 13 }}
            />
          </div>

          <label style={{ display: 'block', marginBottom: 6, fontSize: 12, color: '#334155', fontWeight: 700 }}>Password</label>
          <div style={{ position: 'relative', marginBottom: 18 }}>
            <LockKeyhole size={14} style={{ position: 'absolute', left: 10, top: 11, color: '#94a3b8' }} />
            <input
              type="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: '100%', border: '1px solid #dbe1ea', borderRadius: 10, padding: '9px 10px 9px 34px', fontSize: 13 }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', border: 0, borderRadius: 10, background: 'linear-gradient(135deg,#2563eb,#0ea5e9)', color: '#fff', fontWeight: 700, fontSize: 13, padding: '10px 14px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
