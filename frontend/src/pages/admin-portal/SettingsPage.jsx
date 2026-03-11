import { useEffect, useMemo, useState } from 'react';
import { Save, Settings } from 'lucide-react';
import { createSetting, getSettings, updateSetting, uploadFavicon } from '../../api/settingsApi';

const EMPTY = {
  siteName: '',
  logoUrl: '',
  faviconUrl: '',
  footerDescription: '',
  contactEmail: '',
  contactPhone: '',
  address: '',
  facebookUrl: '',
  instagramUrl: '',
  linkedInUrl: '',
  twitterUrl: '',
  youtubeUrl: '',
  seoTitle: '',
  seoKeywords: '',
  seoDescription: '',
};

export default function SettingsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [selectedId, setSelectedId] = useState(null);
  const [message, setMessage] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const response = await getSettings();
      const list = Array.isArray(response.data) ? response.data : [];
      setRows(list);
      if (list.length) {
        setSelectedId(list[0].id);
        setForm({ ...EMPTY, ...list[0] });
      } else {
        setSelectedId(null);
        setForm(EMPTY);
      }
    } catch {
      setRows([]);
      setSelectedId(null);
      setForm(EMPTY);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const selected = useMemo(() => rows.find((item) => item.id === selectedId) || null, [rows, selectedId]);

  const save = async () => {
    setSaving(true);
    setMessage('');
    try {
      if (selected?.id) {
        await updateSetting(selected.id, form);
      } else {
        await createSetting(form);
      }
      setMessage('Settings saved successfully');
      load();
    } catch (err) {
      setMessage(err.userMessage || 'Unable to save settings');
    } finally {
      setSaving(false);
    }
  };

  const onFaviconUpload = async (file) => {
    if (!selected?.id || !file) return;
    setUploading(true);
    setMessage('');
    try {
      const response = await uploadFavicon(selected.id, file);
      const newUrl = response.data?.faviconUrl;
      setForm((prev) => ({ ...prev, faviconUrl: newUrl || prev.faviconUrl }));
      setMessage('Favicon uploaded successfully');
      load();
    } catch (err) {
      setMessage(err.userMessage || 'Favicon upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="ap-page-header">
        <div className="ap-page-title">
          <Settings size={20} />
          <div>
            <h1>Global Settings</h1>
            <p className="ap-page-subtitle">Manage site identity, contact info and default SEO</p>
          </div>
        </div>
        <div className="ap-actions">
          <button type="button" className="ap-btn ap-btn-secondary" onClick={load}>Refresh</button>
          <button type="button" className="ap-btn ap-btn-primary" onClick={save} disabled={saving}><Save size={14} /> {saving ? 'Saving...' : 'Save Settings'}</button>
        </div>
      </div>

      {message ? <div className="ap-card" style={{ marginBottom: 12 }}><div className="ap-card-body" style={{ fontSize: 13 }}>{message}</div></div> : null}

      {loading ? (
        <div style={{ display: 'grid', placeItems: 'center', minHeight: 160 }}><div className="ap-spinner" /></div>
      ) : (
        <div className="ap-card">
          <div className="ap-card-body">
            <div className="ap-form-grid">
              {[
                ['siteName', 'Site Name'],
                ['logoUrl', 'Logo URL'],
                ['faviconUrl', 'Favicon URL'],
                ['contactEmail', 'Contact Email'],
                ['contactPhone', 'Contact Phone'],
                ['address', 'Address'],
                ['facebookUrl', 'Facebook URL'],
                ['instagramUrl', 'Instagram URL'],
                ['linkedInUrl', 'LinkedIn URL'],
                ['twitterUrl', 'Twitter URL'],
                ['youtubeUrl', 'Youtube URL'],
                ['seoTitle', 'SEO Title'],
                ['seoKeywords', 'SEO Keywords'],
              ].map(([field, label]) => (
                <div className="ap-field" key={field}>
                  <label className="ap-label" htmlFor={`settings-${field}`}>{label}</label>
                  <input
                    id={`settings-${field}`}
                    className="ap-input"
                    value={form[field] || ''}
                    onChange={(e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))}
                  />
                </div>
              ))}
            </div>

            <div className="ap-field">
              <label className="ap-label" htmlFor="settings-footer">Footer Description</label>
              <textarea
                id="settings-footer"
                className="ap-textarea"
                value={form.footerDescription || ''}
                onChange={(e) => setForm((prev) => ({ ...prev, footerDescription: e.target.value }))}
              />
            </div>

            <div className="ap-field">
              <label className="ap-label" htmlFor="settings-seo-description">SEO Description</label>
              <textarea
                id="settings-seo-description"
                className="ap-textarea"
                value={form.seoDescription || ''}
                onChange={(e) => setForm((prev) => ({ ...prev, seoDescription: e.target.value }))}
              />
            </div>

            <div className="ap-field">
              <label className="ap-label" htmlFor="settings-favicon-upload">Upload Favicon</label>
              <input
                id="settings-favicon-upload"
                type="file"
                className="ap-input"
                accept="image/*"
                disabled={!selected?.id || uploading}
                onChange={(e) => onFaviconUpload(e.target.files?.[0] || null)}
              />
              {!selected?.id ? <div className="ap-field-hint">Create settings first, then upload favicon.</div> : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
