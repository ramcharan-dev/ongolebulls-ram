import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ReceiptText,
  TrendingUp,
  FileText,
  Wrench,
  Search,
  Settings,
  FolderOpen,
  Briefcase,
  LogOut,
} from 'lucide-react';
import { clearAdmin, getAdmin } from '../../utils/storage';
import './admin-portal.css';

const NAV_ITEMS = [
  { to: '/admin-portal', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin-portal/clients', icon: Users, label: 'Clients' },
  { to: '/admin-portal/plans', icon: ReceiptText, label: 'Plans' },
  { to: '/admin-portal/investments', icon: TrendingUp, label: 'Investments' },
  { to: '/admin-portal/blogs', icon: FileText, label: 'Blogs' },
  { to: '/admin-portal/services', icon: Wrench, label: 'Services' },
  { to: '/admin-portal/seo', icon: Search, label: 'SEO' },
  { to: '/admin-portal/settings', icon: Settings, label: 'Settings' },
  { to: '/admin-portal/documents', icon: FolderOpen, label: 'Documents' },
  { to: '/admin-portal/careers', icon: Briefcase, label: 'Careers' },
];

export default function AdminPortalLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const admin = getAdmin();

  const doLogout = () => {
    clearAdmin();
    navigate('/admin/login', { replace: true });
  };

  const pageTitle = NAV_ITEMS.find((item) =>
    item.end ? location.pathname === item.to : location.pathname.startsWith(item.to)
  )?.label || 'Admin Portal';

  return (
    <div className="ap-root">
      <aside className="ap-sidebar">
        <div className="ap-brand">
          <h1>OngoleBulls Admin</h1>
          <p>Website Operations Console</p>
        </div>

        <nav className="ap-nav">
          {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => `ap-nav-link${isActive ? ' active' : ''}`}>
              <Icon size={16} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="ap-sidebar-footer">Environment: Admin</div>
      </aside>

      <main className="ap-main">
        <header className="ap-topbar">
          <div className="ap-topbar-title">{pageTitle}</div>
          <div className="ap-topbar-right">
            <div className="ap-admin-chip">{admin?.name || 'Admin'}</div>
            <button type="button" className="ap-btn ap-btn-secondary" onClick={doLogout}>
              <LogOut size={14} /> Logout
            </button>
          </div>
        </header>

        <section className="ap-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
