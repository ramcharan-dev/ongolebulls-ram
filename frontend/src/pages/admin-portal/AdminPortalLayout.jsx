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
  { to: '/website-controls', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/website-controls/clients', icon: Users, label: 'Clients' },
  { to: '/website-controls/plans', icon: ReceiptText, label: 'Plans' },
  { to: '/website-controls/investments', icon: TrendingUp, label: 'Investments' },
  { to: '/website-controls/blogs', icon: FileText, label: 'Blogs' },
  { to: '/website-controls/services', icon: Wrench, label: 'Services' },
  { to: '/website-controls/seo', icon: Search, label: 'SEO' },
  { to: '/website-controls/settings', icon: Settings, label: 'Settings' },
  { to: '/website-controls/documents', icon: FolderOpen, label: 'Documents' },
  { to: '/website-controls/careers', icon: Briefcase, label: 'Careers' },
];

export default function AdminPortalLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const admin = getAdmin();

  const doLogout = () => {
    clearAdmin();
    navigate('/website-controls/login', { replace: true });
  };

  const pageTitle = NAV_ITEMS.find((item) =>
    item.end ? location.pathname === item.to : location.pathname.startsWith(item.to)
  )?.label || 'Website Controls';

  return (
    <div className="ap-root">
      <aside className="ap-sidebar">
        <div className="ap-brand">
          <h1>OngoleBulls Controls</h1>
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

        <div className="ap-sidebar-footer">Website controls</div>
      </aside>

      <main className="ap-main">
        <header className="ap-topbar">
          <div className="ap-topbar-title">{pageTitle}</div>
          <div className="ap-topbar-right">
            <div className="ap-admin-chip">{admin?.name || 'Manager'}</div>
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
