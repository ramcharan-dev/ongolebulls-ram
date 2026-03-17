import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import StepIndicator from './StepIndicator';

const STEPS = ['Basic', 'SEO', 'Review'];

const DEFAULT_FORM = {
  title: '',
  subtitle: '',
  slug: '',
  bannerImage: '',
  metaTitle: '',
  metaDescription: '',
  metaKeywords: '',
  isActive: true,
  theme: 'blue',
};

export default function ServiceFormModal({ open, initial, loading, onClose, onSubmit }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [errors, setErrors] = useState({});
  const isEdit = !!initial?.id;

  useEffect(() => {
    if (!open) return;
    setForm(initial ? { ...DEFAULT_FORM, ...initial } : DEFAULT_FORM);
    setStep(0);
    setErrors({});
  }, [open, initial]);

  useEffect(() => {
    if (!open) return undefined;
    const onKeydown = (event) => {
      if (event.key === 'Escape' && !loading) onClose();
    };
    window.addEventListener('keydown', onKeydown);
    return () => window.removeEventListener('keydown', onKeydown);
  }, [open, loading, onClose]);

  const slugPreview = useMemo(() => `/services/${form.slug || ''}`, [form.slug]);

  if (!open) return null;

  const set = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const onTitleChange = (value) => {
    set('title', value);
    if (!isEdit) {
      const generatedSlug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      set('slug', generatedSlug);
    }
  };

  const validate = () => {
    const nextErrors = {};
    if (step === 0) {
      if (!form.title.trim()) nextErrors.title = 'Title is required';
      if (!form.slug.trim()) nextErrors.slug = 'Slug is required';
      if (form.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug)) {
        nextErrors.slug = 'Use lowercase letters and hyphens only';
      }
    }
    if (step === 1) {
      // Allow either a full URL (http/https) or a relative asset/filename
      if (
        form.bannerImage &&
        !/^https?:\/\/.+/i.test(form.bannerImage) &&
        !/^[A-Za-z0-9._\-\/]+$/.test(form.bannerImage)
      ) {
        nextErrors.bannerImage = 'Use /assets/file.png, a full URL, or a valid asset path';
      }
      if ((form.metaDescription || '').length > 160) {
        nextErrors.metaDescription = 'Meta description should be 160 chars max';
      }
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const next = () => {
    if (validate()) setStep((current) => Math.min(current + 1, STEPS.length - 1));
  };

  const back = () => setStep((current) => Math.max(current - 1, 0));

  const submit = () => {
    if (validate()) onSubmit(form);
  };

  return (
    <div className="ap-modal-backdrop">
      <div className="ap-modal" role="dialog" aria-modal="true" aria-labelledby="service-form-title">
        <div className="ap-modal-header">
          <h2 id="service-form-title">{isEdit ? 'Edit Service' : 'Create Service'}</h2>
          <button type="button" className="ap-btn ap-btn-ghost" onClick={onClose} aria-label="Close"><X size={16} /></button>
        </div>

        <div className="ap-modal-body">
          <StepIndicator steps={STEPS} current={step} />

          {step === 0 ? (
            <>
              <div className="ap-field">
                <label className="ap-label" htmlFor="service-title">Title *</label>
                <input id="service-title" className="ap-input" value={form.title} onChange={(e) => onTitleChange(e.target.value)} />
                {errors.title ? <div className="ap-field-error">{errors.title}</div> : null}
              </div>

              <div className="ap-field">
                <label className="ap-label" htmlFor="service-slug">Slug *</label>
                <input
                  id="service-slug"
                  className="ap-input"
                  value={form.slug}
                  onChange={(e) => set('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                />
                <div className="ap-field-hint">{slugPreview}</div>
                {errors.slug ? <div className="ap-field-error">{errors.slug}</div> : null}
              </div>

              <div className="ap-field">
                <label className="ap-label" htmlFor="service-subtitle">Subtitle</label>
                <textarea id="service-subtitle" className="ap-textarea" value={form.subtitle} onChange={(e) => set('subtitle', e.target.value)} />
              </div>

              <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600 }}>
                <input type="checkbox" checked={form.isActive} onChange={(e) => set('isActive', e.target.checked)} />
                Active Service
              </label>

              <div className="ap-field" style={{ marginTop: 16 }}>
                <label className="ap-label">Service Theme</label>
                <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
                  <label style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px',
                    borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600,
                    border: form.theme === 'gold' ? '2px solid #D4AF37' : '2px solid #e5e7eb',
                    background: form.theme === 'gold' ? 'rgba(212,175,55,0.08)' : 'transparent',
                  }}>
                    <input type="radio" name="theme" value="gold" checked={form.theme === 'gold'} onChange={() => set('theme', 'gold')} />
                    <span style={{ width: 14, height: 14, borderRadius: '50%', background: 'linear-gradient(135deg, #D4AF37, #F5D06F)', flexShrink: 0 }} />
                    Gold Theme
                  </label>
                  <label style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px',
                    borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600,
                    border: form.theme === 'blue' ? '2px solid #2563EB' : '2px solid #e5e7eb',
                    background: form.theme === 'blue' ? 'rgba(37,99,235,0.08)' : 'transparent',
                  }}>
                    <input type="radio" name="theme" value="blue" checked={form.theme === 'blue'} onChange={() => set('theme', 'blue')} />
                    <span style={{ width: 14, height: 14, borderRadius: '50%', background: 'linear-gradient(135deg, #2563EB, #3B82F6)', flexShrink: 0 }} />
                    Blue Theme
                  </label>
                </div>
              </div>
            </>
          ) : null}

          {step === 1 ? (
            <>
              <div className="ap-field">
                <label className="ap-label" htmlFor="service-banner">Banner Image URL</label>
                <input id="service-banner" className="ap-input" value={form.bannerImage} onChange={(e) => set('bannerImage', e.target.value)} />
                <div className="ap-field-hint">Recommended for production: `/assets/your-image.png`</div>
                {errors.bannerImage ? <div className="ap-field-error">{errors.bannerImage}</div> : null}
              </div>

              <div className="ap-field">
                <label className="ap-label" htmlFor="service-meta-title">Meta Title</label>
                <input id="service-meta-title" className="ap-input" value={form.metaTitle} onChange={(e) => set('metaTitle', e.target.value)} />
              </div>

              <div className="ap-field">
                <label className="ap-label" htmlFor="service-meta-description">Meta Description</label>
                <textarea id="service-meta-description" className="ap-textarea" value={form.metaDescription} onChange={(e) => set('metaDescription', e.target.value)} />
                <div className="ap-field-hint">{(form.metaDescription || '').length}/160</div>
                {errors.metaDescription ? <div className="ap-field-error">{errors.metaDescription}</div> : null}
              </div>

              <div className="ap-field">
                <label className="ap-label" htmlFor="service-meta-keywords">Meta Keywords</label>
                <input id="service-meta-keywords" className="ap-input" value={form.metaKeywords} onChange={(e) => set('metaKeywords', e.target.value)} />
              </div>
            </>
          ) : null}

          {step === 2 ? (
            <div className="ap-table-wrap">
              <div className="ap-table-scroll">
                <table className="ap-table">
                  <tbody>
                    <tr><th>Title</th><td>{form.title || '-'}</td></tr>
                    <tr><th>Slug</th><td>{slugPreview}</td></tr>
                    <tr><th>Status</th><td>{form.isActive ? 'Active' : 'Inactive'}</td></tr>
                    <tr><th>Theme</th><td style={{ textTransform: 'capitalize' }}>{form.theme || 'blue'}</td></tr>
                    <tr><th>Subtitle</th><td>{form.subtitle || '-'}</td></tr>
                    <tr><th>Banner URL</th><td>{form.bannerImage || '-'}</td></tr>
                    <tr><th>Meta Title</th><td>{form.metaTitle || '-'}</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </div>

        <div className="ap-modal-footer">
          <button type="button" className="ap-btn ap-btn-ghost" onClick={step === 0 ? onClose : back}><ArrowLeft size={14} /> {step === 0 ? 'Cancel' : 'Back'}</button>
          {step < STEPS.length - 1 ? (
            <button type="button" className="ap-btn ap-btn-primary" onClick={next}>Next <ArrowRight size={14} /></button>
          ) : (
            <button type="button" className="ap-btn ap-btn-primary" disabled={loading} onClick={submit}>{loading ? 'Saving...' : isEdit ? 'Update Service' : 'Create Service'}</button>
          )}
        </div>
      </div>
    </div>
  );
}
