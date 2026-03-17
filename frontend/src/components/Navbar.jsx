import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getUser, clearUser } from '../utils/storage';
import { logout } from '../api/authApi';

export default function Navbar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const user      = getUser();

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try { await logout(); } catch { /* ignore */ }
    clearUser();
    navigate('/login');
  };

  const navLink = (to, label) => (
    <Link to={to} style={{
      fontSize: 14, fontWeight: 500, padding: '.35rem .65rem', borderRadius: 6,
      color: isActive(to) ? 'var(--green-primary)' : 'var(--text-primary)',
      background: isActive(to) ? 'var(--green-light)' : 'transparent',
      textDecoration: 'none', transition: 'background .15s, color .15s',
    }}>
      {label}
    </Link>
  );

  // Hide navbar on admin pages
  if (location.pathname.startsWith('/admin')) return null;

  return (
    <nav style={{
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      padding: '.75rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky', top: 0, zIndex: 100,
      boxShadow: 'var(--shadow)',
      transition: 'background-color .3s ease, border-color .3s ease',
    }}>
      {/* Logo */}
      <Link to="/" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:8 }}>
        <div style={{ width:32, height:32, background:'#16a34a', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:14 }}>
          OB
        </div>
        <span style={{ fontWeight:700, fontSize:17, color:'var(--green-dark)' }}>OngoleBulls</span>
      </Link>

      {/* Nav links */}
      <div style={{ display:'flex', alignItems:'center', gap:4, flexWrap:'wrap' }}>
        {navLink('/funds',       'Funds')}
        {navLink('/blogs',       'Blogs')}
        {navLink('/calculator',  'Calculator')}
        {navLink('/appointment', 'Appointment')}
        {navLink('/careers',     'Careers')}
        {navLink('/contact',     'Contact')}
      </div>

      {/* Auth */}
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        {user ? (
          <>
            <Link to="/dashboard"
              style={{ fontSize:14, fontWeight:600, color:'var(--green-primary)', textDecoration:'none' }}>
              {user.fullName?.split(' ')[0] || 'Dashboard'}
            </Link>
            <button className="btn btn-outline btn-sm" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login"    className="btn btn-outline btn-sm">Sign In</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
          </>
        )}
      </div>
    </nav>
  );
}
