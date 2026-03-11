import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, CircleOff, Plus, RefreshCw, Search, Wrench } from 'lucide-react';
import { createService, deleteService, getServices, updateService } from '../../api/serviceApi';
import ServiceCard from './components/ServiceCard';
import ServiceFormModal from './components/ServiceFormModal';
import ConfirmDialog from './components/ConfirmDialog';

export default function ServicesPage() {
  const navigate = useNavigate();
  const toastTimer = useRef(null);

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState('updated-desc');

  const [formOpen, setFormOpen] = useState(false);
  const [formInitial, setFormInitial] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ message, type });
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
  }, []);

  const loadServices = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getServices();
      setServices(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      showToast(err.userMessage || 'Failed to load services', 'error');
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const stats = useMemo(() => {
    const active = services.filter((item) => item.isActive !== false).length;
    return { total: services.length, active, inactive: services.length - active };
  }, [services]);

  const filtered = useMemo(() => {
    let list = [...services];

    if (status === 'active') list = list.filter((item) => item.isActive !== false);
    if (status === 'inactive') list = list.filter((item) => item.isActive === false);

    if (search.trim()) {
      const query = search.toLowerCase();
      list = list.filter((item) =>
        [item.title, item.slug, item.subtitle]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query))
      );
    }

    if (sort === 'title-asc') list.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    if (sort === 'title-desc') list.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
    if (sort === 'updated-asc') list.sort((a, b) => new Date(a.updatedAt || 0).getTime() - new Date(b.updatedAt || 0).getTime());
    if (sort === 'updated-desc') list.sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime());

    return list;
  }, [services, search, status, sort]);

  const saveService = async (payload) => {
    setFormLoading(true);
    try {
      if (formInitial?.id) {
        await updateService(formInitial.id, payload);
        showToast('Service updated');
      } else {
        await createService(payload);
        showToast('Service created');
      }
      setFormOpen(false);
      loadServices();
    } catch (err) {
      showToast(err.userMessage || 'Unable to save service', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const removeService = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteService(deleteTarget.id);
      setDeleteTarget(null);
      showToast('Service deleted');
      loadServices();
    } catch (err) {
      showToast(err.userMessage || 'Unable to delete service', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const resetFilters = () => {
    setSearch('');
    setStatus('all');
    setSort('updated-desc');
  };

  const openServiceDetails = (service) => {
    if (!service?.id) {
      showToast('Service ID missing', 'error');
      return;
    }
    navigate(`/admin-portal/services/${service.id}`);
  };

  return (
    <div>
      {toast ? (
        <div className={`ap-toast ${toast.type === 'error' ? 'ap-toast-error' : 'ap-toast-success'}`}>
          {toast.message}
        </div>
      ) : null}

      <div className="ap-page-header">
        <div className="ap-page-title">
          <Wrench size={20} />
          <div>
            <h1>Services</h1>
            <p className="ap-page-subtitle">Manage service pages and metadata</p>
          </div>
        </div>

        <div className="ap-actions">
          <button type="button" className="ap-btn ap-btn-secondary" onClick={loadServices} disabled={loading}>
            <RefreshCw size={14} /> Refresh
          </button>
          <button type="button" className="ap-btn ap-btn-primary" onClick={() => { setFormInitial(null); setFormOpen(true); }}>
            <Plus size={14} /> Add Service
          </button>
        </div>
      </div>

      <div className="ap-row" style={{ marginBottom: 12 }}>
        <button type="button" className={`ap-pill ${status === 'all' ? 'active' : ''}`} onClick={() => setStatus('all')}><Wrench size={12} /> All {stats.total}</button>
        <button type="button" className={`ap-pill ${status === 'active' ? 'active' : ''}`} onClick={() => setStatus('active')}><Activity size={12} /> Active {stats.active}</button>
        <button type="button" className={`ap-pill ${status === 'inactive' ? 'active' : ''}`} onClick={() => setStatus('inactive')}><CircleOff size={12} /> Inactive {stats.inactive}</button>
      </div>

      <div className="ap-row" style={{ marginBottom: 16 }}>
        <div className="ap-col" style={{ minWidth: 280 }}>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: 10, color: '#94a3b8' }} />
            <input className="ap-input" style={{ paddingLeft: 32 }} placeholder="Search services" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="ap-col" style={{ maxWidth: 200 }}>
          <select className="ap-select" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="updated-desc">Recently updated</option>
            <option value="updated-asc">Oldest updated</option>
            <option value="title-asc">Title A-Z</option>
            <option value="title-desc">Title Z-A</option>
          </select>
        </div>
        <div>
          <button type="button" className="ap-btn ap-btn-secondary" onClick={resetFilters}>Reset</button>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'grid', placeItems: 'center', minHeight: 180 }}><div className="ap-spinner" /></div>
      ) : filtered.length ? (
        <div className="ap-grid ap-grid-auto">
          {filtered.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onView={openServiceDetails}
              onManageSections={(target) => navigate(`/admin-portal/services/${target.id}/sections`)}
              onEdit={(target) => { setFormInitial(target); setFormOpen(true); }}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      ) : (
        <div className="ap-empty">No services found for current filters</div>
      )}

      <ServiceFormModal
        open={formOpen}
        initial={formInitial}
        loading={formLoading}
        onClose={() => setFormOpen(false)}
        onSubmit={saveService}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Service"
        message={`Delete service "${deleteTarget?.title || ''}"? This also removes linked sections/items.`}
        confirmLabel="Delete"
        loading={deleteLoading}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={removeService}
      />
    </div>
  );
}
