import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

// Existing pages
import Home                 from './components/Home/Home';
import AboutUs              from './RoutingPages/AboutUs/AboutUs';
import MutualFund           from './RoutingPages/MutualFund/MutualFund';
import PmsPage              from './RoutingPages/PmsPage/PmsPage';
import ContactForm          from './RoutingPages/ContactForm/ContactForm';
import AppointmentForm      from './RoutingPages/AppointmentForm/AppointmentForm';
import Services             from './RoutingPages/Services/Services';
import ServiceDetail        from './RoutingPages/Services/ServiceDetail';
import BlogList             from './pages/blogs/BlogList';
import BlogDetail           from './pages/blogs/BlogDetail';
import ToolsRoutes          from './routes/toolsRoutes';
import ElssPage             from './pages/ElssPage';
import SipDetailPage        from './pages/SipDetailPage';
import StocksPage           from './pages/StocksPage';
import EtfsPage             from './pages/EtfsPage';

// Auth (lazy)
const Login  = lazy(() => import('./pages/auth/Login'));
const Signup = lazy(() => import('./pages/auth/Signup'));

// Admin pages (lazy)
const AdminLogin          = lazy(() => import('./pages/admin/AdminLogin'));
const AdminPortalLayout   = lazy(() => import('./pages/admin-portal/AdminPortalLayout'));
const DashboardPage       = lazy(() => import('./pages/admin-portal/DashboardPage'));
const ClientsPage         = lazy(() => import('./pages/admin-portal/ClientsPage'));
const PlansPage           = lazy(() => import('./pages/admin-portal/PlansPage'));
const InvestmentsPage     = lazy(() => import('./pages/admin-portal/InvestmentsPage'));
const BlogsPage           = lazy(() => import('./pages/admin-portal/BlogsPage'));
const ServicesPage        = lazy(() => import('./pages/admin-portal/ServicesPage'));
const ServiceDetailPage   = lazy(() => import('./pages/admin-portal/ServiceDetailPage'));
const ServiceSectionsPage = lazy(() => import('./pages/admin-portal/ServiceSectionsPage'));
const SeoPage             = lazy(() => import('./pages/admin-portal/SeoPage'));
const SettingsPage        = lazy(() => import('./pages/admin-portal/SettingsPage'));
const DocumentsPage       = lazy(() => import('./pages/admin-portal/DocumentsPage'));
const CareersPage         = lazy(() => import('./pages/admin-portal/CareersPage'));

// Route guard
import { AdminRoute } from './components/ProtectedRoute';

// User Dashboard
const UserDashboardLayout = lazy(() => import('./components/user-db/UserDashboardLayout').then(m => ({ default: m.UserDashboardLayout })));
const DashboardHome = lazy(() => import('./components/user-db/pages/DashboardHome').then(m => ({ default: m.DashboardHome })));
const ExploreFunds = lazy(() => import('./components/user-db/pages/Placeholders').then(m => ({ default: m.ExploreFunds })));
const SIPs = lazy(() => import('./components/user-db/pages/Placeholders').then(m => ({ default: m.SIPs })));
const Statements = lazy(() => import('./components/user-db/pages/Placeholders').then(m => ({ default: m.Statements })));
const Support = lazy(() => import('./components/user-db/pages/Placeholders').then(m => ({ default: m.Support })));
const UccRegistration = lazy(() => import('./pages/ucc/UccRegistration'));


const Loader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* ── Admin Portal (no public header/footer) ──────────────────────── */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin-portal"
            element={
              <AdminRoute>
                <AdminPortalLayout />
              </AdminRoute>
            }
          >
            <Route index                          element={<DashboardPage />} />
            <Route path="clients"                 element={<ClientsPage />} />
            <Route path="plans"                   element={<PlansPage />} />
            <Route path="investments"             element={<InvestmentsPage />} />
            <Route path="blogs"                   element={<BlogsPage />} />
            <Route path="services"                element={<ServicesPage />} />
            <Route path="services/:serviceId"     element={<ServiceDetailPage />} />
            <Route path="services/:serviceId/sections" element={<ServiceSectionsPage />} />
            <Route path="seo"                     element={<SeoPage />} />
            <Route path="settings"                element={<SettingsPage />} />
            <Route path="documents"               element={<DocumentsPage />} />
            <Route path="careers"                 element={<CareersPage />} />
          </Route>

          {/* ── User Dashboard (Custom UI without main header/footer) ── */}
          <Route path="/dashboard" element={<UserDashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="explore" element={<ExploreFunds />} />
            <Route path="sips" element={<SIPs />} />
            <Route path="statements" element={<Statements />} />
            <Route path="support" element={<Support />} />
            {/* Added KYC/UCC placeholders pointing back to the dashboard home or you can make them standard pages */}
            <Route path="kyc" element={<Support />} /> 
            <Route path="ucc" element={<UccRegistration />} />
          </Route>

          {/* ── Public Routes (with header/footer) ──────────────────────────── */}
          <Route
            path="*"
            element={
              <>
                <Header />
                <main>
                  <Routes>
                    <Route path="/"                    element={<Home />} />
                    <Route path="/Aboutus"             element={<AboutUs />} />
                    <Route path="/services"            element={<Services />} />
                    <Route path="/services/:slug"      element={<ServiceDetail />} />
                    <Route path="/blogs"               element={<BlogList />} />
                    <Route path="/blogs/:id"           element={<BlogDetail />} />
                    <Route path="/MutualFund"          element={<MutualFund />} />
                    <Route path="/elss"                element={<ElssPage />} />
                    <Route path="/stocks"              element={<StocksPage />} />
                    <Route path="/etfs"                element={<EtfsPage />} />
                    <Route path="/sip"                 element={<SipDetailPage />} />
                    <Route path="/PmsPage"             element={<PmsPage />} />
                    <Route path="/contactForm"         element={<ContactForm />} />
                    <Route path="/AppointmentForm"     element={<AppointmentForm />} />
                    <Route path="/tools/*"             element={<ToolsRoutes />} />
                    <Route path="/login"               element={<Login />} />
                    <Route path="/signup"              element={<Signup />} />
                  </Routes>
                </main>
                <Footer />
              </>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
