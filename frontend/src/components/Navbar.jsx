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
      color: isActive(to) ? '#16a34a' : '#374151',
      background: isActive(to) ? '#dcfce7' : 'transparent',
      textDecoration: 'none', transition: 'background .15s',
    }}>
      {label}
    </Link>
  );

  // Hide navbar on admin pages
  if (location.pathname.startsWith('/admin')) return null;

  return (
    <nav style={{
      background: '#fff',
      borderBottom: '1px solid #e5e7eb',
      padding: '.75rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky', top: 0, zIndex: 100,
      boxShadow: '0 1px 3px rgba(0,0,0,.06)',
    }}>
      {/* Logo */}
      <Link to="/" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:8 }}>
        <div style={{ width:32, height:32, background:'#16a34a', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:14 }}>
          OB
        </div>
        <span style={{ fontWeight:700, fontSize:17, color:'#14532d' }}>OngoleBulls</span>
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
              style={{ fontSize:14, fontWeight:600, color:'#16a34a', textDecoration:'none' }}>
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
