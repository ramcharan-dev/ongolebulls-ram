import { useEffect, useMemo, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { deleteSeoSetting, getSeoSettings, saveSeoSetting } from '../../api/seoApi';
import ConfirmDialog from './components/ConfirmDialog';

const EMPTY = {
  slug: '',
  metaTitle: '',
  metaDescription: '',
  metaKeywords: '',
  robotsTag: 'index,follow',
  schemaJson: '',
};

export default function SeoPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const response = await getSeoSettings();
      setRows(Array.isArray(response.data) ? response.data : []);
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((item) =>
      [item.slug, item.metaTitle, item.metaDescription]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q))
    );
  }, [rows, search]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY);
    setFormOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({ ...EMPTY, ...item });
    setFormOpen(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      await saveSeoSetting({ ...form, id: editing?.id });
      setFormOpen(false);
      load();
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteSeoSetting(deleteTarget.id);
      setDeleteTarget(null);
      load();
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div>
      <div className="ap-page-header">
        <div className="ap-page-title">
          <Search size={20} />
          <div>
            <h1>SEO Settings</h1>
            <p className="ap-page-subtitle">Manage route-level SEO metadata</p>
          </div>
        </div>
        <div className="ap-actions">
          <input className="ap-input" style={{ width: 230 }} placeholder="Search by slug/title" value={search} onChange={(e) => setSearch(e.target.value)} />
          <button type="button" className="ap-btn ap-btn-secondary" onClick={load}>Refresh</button>
          <button type="button" className="ap-btn ap-btn-primary" onClick={openCreate}><Plus size={14} /> Add SEO</button>
        </div>
      </div>

      <div className="ap-table-wrap">
        <div className="ap-table-scroll">
          <table className="ap-table">
            <thead>
              <tr>
                <th>Slug</th>
                <th>Meta Title</th>
                <th>Robots</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5}><div style={{ display: 'grid', placeItems: 'center', padding: 16 }}><div className="ap-spinner" /></div></td></tr>
              ) : filtered.length ? (
                filtered.map((item) => (
                  <tr key={item.id}>
                    <td>{item.slug || '-'}</td>
                    <td>{item.metaTitle || '-'}</td>
                    <td>{item.robotsTag || '-'}</td>
                    <td>{item.updatedAt ? new Date(item.updatedAt).toLocaleString() : '-'}</td>
                    <td>
                      <div className="ap-actions">
                        <button type="button" className="ap-btn ap-btn-secondary" onClick={() => openEdit(item)}>Edit</button>
                        <button type="button" className="ap-btn ap-btn-danger" onClick={() => setDeleteTarget(item)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={5}><div className="ap-empty">No SEO records found</div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {formOpen ? (
        <div className="ap-modal-backdrop">
          <div className="ap-modal" role="dialog" aria-modal="true" aria-labelledby="seo-modal-title">
            <div className="ap-modal-header">
              <h2 id="seo-modal-title">{editing ? 'Edit SEO Setting' : 'Create SEO Setting'}</h2>
              <button type="button" className="ap-btn ap-btn-ghost" onClick={() => setFormOpen(false)}>Close</button>
            </div>
            <div className="ap-modal-body">
              <div className="ap-form-grid">
                <div className="ap-field">
                  <label className="ap-label">Slug</label>
                  <input className="ap-input" value={form.slug} onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))} />
                </div>
                <div className="ap-field">
                  <label className="ap-label">Robots</label>
                  <input className="ap-input" value={form.robotsTag} onChange={(e) => setForm((prev) => ({ ...prev, robotsTag: e.target.value }))} />
                </div>
              </div>
              <div className="ap-field">
                <label className="ap-label">Meta Title</label>
                <input className="ap-input" value={form.metaTitle} onChange={(e) => setForm((prev) => ({ ...prev, metaTitle: e.target.value }))} />
              </div>
              <div className="ap-field">
                <label className="ap-label">Meta Description</label>
                <textarea className="ap-textarea" value={form.metaDescription} onChange={(e) => setForm((prev) => ({ ...prev, metaDescription: e.target.value }))} />
              </div>
              <div className="ap-field">
                <label className="ap-label">Meta Keywords</label>
                <input className="ap-input" value={form.metaKeywords} onChange={(e) => setForm((prev) => ({ ...prev, metaKeywords: e.target.value }))} />
              </div>
              <div className="ap-field">
                <label className="ap-label">Schema JSON</label>
                <textarea className="ap-textarea" value={form.schemaJson} onChange={(e) => setForm((prev) => ({ ...prev, schemaJson: e.target.value }))} />
              </div>
            </div>
            <div className="ap-modal-footer">
              <button type="button" className="ap-btn ap-btn-secondary" onClick={() => setFormOpen(false)}>Cancel</button>
              <button type="button" className="ap-btn ap-btn-primary" onClick={save} disabled={saving || !form.slug}>{saving ? 'Saving...' : 'Save SEO'}</button>
            </div>
          </div>
        </div>
      ) : null}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete SEO Setting"
        message={`Delete SEO entry for "${deleteTarget?.slug || ''}"?`}
        confirmLabel="Delete"
        loading={deleteLoading}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={remove}
      />
    </div>
  );
}
