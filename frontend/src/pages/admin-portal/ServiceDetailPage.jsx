import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Layers, RotateCcw, Save } from 'lucide-react';
import { getSectionsByService, getServiceById, updateService } from '../../api/serviceApi';
import { resolveMediaUrl } from '../../utils/media';

const SECTION_TYPES = ['hero', 'features', 'steps', 'why_choose_us', 'faq', 'cta'];
const DEFAULT_FORM = {
  title: '',
  slug: '',
  subtitle: '',
  bannerImage: '',
  metaTitle: '',
  metaDescription: '',
  metaKeywords: '',
  isActive: true,
  theme: 'blue',
  allowedSectionTypes: [],
};

function normalizeSlug(value) {
  return (value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, '')
    .replace(/--+/g, '-')
    .replace(/^-|-$/g, '');
}

function mapServiceToForm(service) {
  return {
    title: service?.title || '',
    slug: service?.slug || '',
    subtitle: service?.subtitle || '',
    bannerImage: service?.bannerImage || '',
    metaTitle: service?.metaTitle || '',
    metaDescription: service?.metaDescription || '',
    metaKeywords: service?.metaKeywords || '',
    isActive: service?.isActive !== false,
    theme: service?.theme || 'blue',
    allowedSectionTypes: Array.isArray(service?.allowedSectionTypes) ? service.allowedSectionTypes : [],
  };
}

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString();
}

export default function ServiceDetailPage() {
  const navigate = useNavigate();
  const { serviceId } = useParams();

  const [service, setService] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState(DEFAULT_FORM);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const showToast = (message, type = 'success') => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ message, type });
    toastTimer.current = setTimeout(() => setToast(null), 2800);
  };

  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
  }, []);

  const load = useCallback(async () => {
    if (!serviceId) return;
    setLoading(true);
    setError('');
    try {
      const [serviceRes, sectionRes] = await Promise.all([
        getServiceById(serviceId),
        getSectionsByService(serviceId),
      ]);
      const loadedService = serviceRes.data || null;
      setService(loadedService);
      setForm(mapServiceToForm(loadedService));
      setErrors({});
      setSections(Array.isArray(sectionRes.data) ? sectionRes.data : []);
    } catch (err) {
      setService(null);
      setSections([]);
      setError(err.userMessage || 'Failed to load service details');
    } finally {
      setLoading(false);
    }
  }, [serviceId]);

  useEffect(() => {
    load();
  }, [load]);

  const orderedSections = useMemo(
    () => [...sections].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0)),
    [sections]
  );

  const totalItems = useMemo(
    () => orderedSections.reduce((sum, section) => sum + (section.items?.length || 0), 0),
    [orderedSections]
  );

  const isDirty = useMemo(() => {
    if (!service) return false;
    return JSON.stringify(form) !== JSON.stringify(mapServiceToForm(service));
  }, [form, service]);

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = 'Title is required';
    if (!form.slug.trim()) next.slug = 'Slug is required';
    if (form.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug)) {
      next.slug = 'Use lowercase letters and hyphens only';
    }
    if (
      form.bannerImage &&
      !/^https?:\/\/.+/i.test(form.bannerImage) &&
      !/^[A-Za-z0-9._\-\/]+$/.test(form.bannerImage)
    ) {
      next.bannerImage = 'Use /assets/file.png, a full URL, or a valid asset path';
    }
    if ((form.metaDescription || '').length > 160) {
      next.metaDescription = 'Meta description should be 160 chars max';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const toggleSectionType = (value) => {
    setForm((prev) => {
      const exists = prev.allowedSectionTypes.includes(value);
      const next = exists
        ? prev.allowedSectionTypes.filter((item) => item !== value)
        : [...prev.allowedSectionTypes, value];
      return { ...prev, allowedSectionTypes: next };
    });
  };

  const resetInline = () => {
    setForm(mapServiceToForm(service));
    setErrors({});
  };

  const saveInline = async () => {
    if (!service?.id) return;
    const sanitized = { ...form, slug: normalizeSlug(form.slug) };
    setForm(sanitized);
    if (!validate()) return;

    setSaving(true);
    try {
      const response = await updateService(service.id, sanitized);
      const updated = response.data || { ...service, ...sanitized };
      setService(updated);
      setForm(mapServiceToForm(updated));
      setErrors({});
      showToast('Service updated');
    } catch (err) {
      showToast(err.userMessage || 'Unable to update service', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="ap-loading">
        <div className="ap-spinner" />
      </div>
    );
  }

  if (!service) {
    return (
      <div>
        <div className="ap-page-header">
          <div className="ap-page-title">
            <button type="button" className="ap-btn ap-btn-ghost" onClick={() => navigate('/admin-portal/services')}>
              <ArrowLeft size={14} /> Back
            </button>
            <div>
              <h1>Service Details</h1>
              <p className="ap-page-subtitle">{error || 'Service not found'}</p>
            </div>
          </div>
        </div>
        <div className="ap-empty">No data available for this service.</div>
      </div>
    );
  }

  return (
    <div>
      {toast ? <div className={`ap-toast ${toast.type === 'error' ? 'ap-toast-error' : 'ap-toast-success'}`}>{toast.message}</div> : null}

      <div className="ap-page-header">
        <div className="ap-page-title">
          <button type="button" className="ap-btn ap-btn-ghost" onClick={() => navigate('/admin-portal/services')}>
            <ArrowLeft size={14} /> Back
          </button>
          <div>
            <h1>{service.title || 'Service Details'}</h1>
            <p className="ap-page-subtitle">Inline editable service profile and content settings</p>
          </div>
        </div>
        <div className="ap-actions">
          <button type="button" className="ap-btn ap-btn-secondary" onClick={load} disabled={saving}>Refresh</button>
          <button type="button" className="ap-btn ap-btn-secondary" onClick={() => navigate(`/admin-portal/services/${service.id}/sections`)}>
            <Layers size={14} /> Manage Sections
          </button>
          <button type="button" className="ap-btn ap-btn-secondary" onClick={resetInline} disabled={!isDirty || saving}>
            <RotateCcw size={14} /> Reset
          </button>
          <button type="button" className="ap-btn ap-btn-primary" onClick={saveInline} disabled={!isDirty || saving}>
            <Save size={14} /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="ap-grid ap-grid-3" style={{ marginBottom: 12 }}>
        <div className="ap-card">
          <div className="ap-card-body">
            <p className="ap-kpi-label">Slug</p>
            <p className="ap-kpi-value" style={{ fontSize: 18 }}>{service.slug || '-'}</p>
          </div>
        </div>
        <div className="ap-card">
          <div className="ap-card-body">
            <p className="ap-kpi-label">Status</p>
            <p className="ap-kpi-value" style={{ fontSize: 18 }}>{service.isActive !== false ? 'Active' : 'Inactive'}</p>
          </div>
        </div>
        <div className="ap-card">
          <div className="ap-card-body">
            <p className="ap-kpi-label">Theme</p>
            <p className="ap-kpi-value" style={{ fontSize: 18, textTransform: 'capitalize', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                width: 12, height: 12, borderRadius: '50%', display: 'inline-block',
                background: service.theme === 'gold' ? 'linear-gradient(135deg, #D4AF37, #F5D06F)' : 'linear-gradient(135deg, #2563EB, #3B82F6)',
              }} />
              {service.theme || 'blue'}
            </p>
          </div>
        </div>
      </div>

      <div className="ap-grid ap-grid-2" style={{ marginBottom: 12 }}>
        <div className="ap-card">
          <div className="ap-card-body">
            <div className="ap-form-grid">
              <div className="ap-field">
                <label className="ap-label" htmlFor="service-title-inline">Title *</label>
                <input id="service-title-inline" className="ap-input" value={form.title} onChange={(event) => setField('title', event.target.value)} />
                {errors.title ? <div className="ap-field-error">{errors.title}</div> : null}
              </div>
              <div className="ap-field">
                <label className="ap-label" htmlFor="service-slug-inline">Slug *</label>
                <input
                  id="service-slug-inline"
                  className="ap-input"
                  value={form.slug}
                  onChange={(event) => setField('slug', normalizeSlug(event.target.value))}
                />
                <div className="ap-field-hint">/services/{form.slug || ''}</div>
                {errors.slug ? <div className="ap-field-error">{errors.slug}</div> : null}
              </div>
              <div className="ap-field" style={{ gridColumn: '1 / -1' }}>
                <label className="ap-label" htmlFor="service-subtitle-inline">Subtitle</label>
                <textarea id="service-subtitle-inline" className="ap-textarea" value={form.subtitle} onChange={(event) => setField('subtitle', event.target.value)} />
              </div>
              <div className="ap-field" style={{ gridColumn: '1 / -1' }}>
                <label className="ap-label" htmlFor="service-banner-inline">Banner Image URL</label>
                <input id="service-banner-inline" className="ap-input" value={form.bannerImage} onChange={(event) => setField('bannerImage', event.target.value)} />
                <div className="ap-field-hint">Recommended for production: `/assets/your-image.png`</div>
                {errors.bannerImage ? <div className="ap-field-error">{errors.bannerImage}</div> : null}
              </div>
              <div className="ap-field">
                <label className="ap-label" htmlFor="service-status-inline">Status</label>
                <select
                  id="service-status-inline"
                  className="ap-select"
                  value={form.isActive ? 'active' : 'inactive'}
                  onChange={(event) => setField('isActive', event.target.value === 'active')}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="ap-field">
                <label className="ap-label">Service Theme</label>
                <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                  <label style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px',
                    borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600,
                    border: form.theme === 'gold' ? '2px solid #D4AF37' : '2px solid var(--border, #e5e7eb)',
                    background: form.theme === 'gold' ? 'rgba(212,175,55,0.08)' : 'transparent',
                  }}>
                    <input type="radio" name="service-theme" value="gold" checked={form.theme === 'gold'} onChange={() => setField('theme', 'gold')} />
                    <span style={{ width: 14, height: 14, borderRadius: '50%', background: 'linear-gradient(135deg, #D4AF37, #F5D06F)', flexShrink: 0 }} />
                    Gold
                  </label>
                  <label style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px',
                    borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600,
                    border: form.theme === 'blue' ? '2px solid #2563EB' : '2px solid var(--border, #e5e7eb)',
                    background: form.theme === 'blue' ? 'rgba(37,99,235,0.08)' : 'transparent',
                  }}>
                    <input type="radio" name="service-theme" value="blue" checked={form.theme === 'blue'} onChange={() => setField('theme', 'blue')} />
                    <span style={{ width: 14, height: 14, borderRadius: '50%', background: 'linear-gradient(135deg, #2563EB, #3B82F6)', flexShrink: 0 }} />
                    Blue
                  </label>
                </div>
              </div>
              <div className="ap-field">
                <label className="ap-label">Allowed Section Types</label>
                <div className="ap-row">
                  {SECTION_TYPES.map((type) => (
                    <label key={type} className="ap-badge ap-badge-gray" style={{ cursor: 'pointer', userSelect: 'none' }}>
                      <input
                        type="checkbox"
                        style={{ marginRight: 6 }}
                        checked={form.allowedSectionTypes.includes(type)}
                        onChange={() => toggleSectionType(type)}
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="ap-card">
          <div className="ap-card-body">
            <p className="ap-label">Meta Title</p>
            <input className="ap-input" value={form.metaTitle} onChange={(event) => setField('metaTitle', event.target.value)} />

            <p className="ap-label" style={{ marginTop: 12 }}>Meta Description</p>
            <textarea className="ap-textarea" value={form.metaDescription} onChange={(event) => setField('metaDescription', event.target.value)} />
            <div className="ap-field-hint">{(form.metaDescription || '').length}/160</div>
            {errors.metaDescription ? <div className="ap-field-error">{errors.metaDescription}</div> : null}

            <p className="ap-label" style={{ marginTop: 12 }}>Meta Keywords</p>
            <input className="ap-input" value={form.metaKeywords} onChange={(event) => setField('metaKeywords', event.target.value)} />

            <p className="ap-label" style={{ marginTop: 12 }}>Created</p>
            <p className="ap-page-subtitle">{formatDate(service.createdAt)}</p>
            <p className="ap-label" style={{ marginTop: 12 }}>Updated</p>
            <p className="ap-page-subtitle">{formatDate(service.updatedAt)}</p>

            <p className="ap-label" style={{ marginTop: 12 }}>Banner Preview</p>
            {form.bannerImage ? (
              <img
                src={resolveMediaUrl(form.bannerImage)}
                alt={service.title || 'Service banner'}
                style={{ width: '100%', maxHeight: 220, objectFit: 'cover', borderRadius: 10, border: '1px solid #e2e8f0' }}
              />
            ) : (
              <div className="ap-empty" style={{ padding: 12 }}>No banner image</div>
            )}
          </div>
        </div>
      </div>

      <div className="ap-card">
        <div className="ap-card-body">
          <p className="ap-label" style={{ marginBottom: 10 }}>Sections Overview</p>
          {orderedSections.length ? (
            <div className="ap-grid">
              {orderedSections.map((section) => (
                <div key={section.id} className="ap-item-row">
                  <div>
                    <div className="ap-item-title">{section.title || section.sectionType}</div>
                    <div className="ap-item-subtitle">{section.subtitle || '-'}</div>
                    <div className="ap-field-hint">Type: {section.sectionType} | Order: {section.orderIndex ?? '-'}</div>
                  </div>
                  <div className="ap-badge-row">
                    <span className="ap-badge ap-badge-amber">Items: {section.items?.length || 0}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="ap-empty">No sections found for this service.</div>
          )}
        </div>
      </div>
    </div>
  );
}
