import { useEffect, useMemo, useState } from 'react';
import { FileText, Plus } from 'lucide-react';
import { createBlog, deleteBlog, getAllBlogs, updateBlog } from '../../api/blogApi';
import ConfirmDialog from './components/ConfirmDialog';

const EMPTY_BLOG = {
  title: '',
  shortDescription: '',
  fullContent: '',
  author: '',
};

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_BLOG);
  const [imageFile, setImageFile] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadBlogs = async () => {
    setLoading(true);
    try {
      const response = await getAllBlogs();
      setBlogs(Array.isArray(response.data) ? response.data : []);
    } catch {
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return blogs;
    return blogs.filter((blog) =>
      [blog.title, blog.shortDescription, blog.author]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [blogs, search]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_BLOG);
    setImageFile(null);
    setFormOpen(true);
  };

  const openEdit = (blog) => {
    setEditing(blog);
    setForm({
      title: blog.title || '',
      shortDescription: blog.shortDescription || '',
      fullContent: blog.fullContent || '',
      author: blog.author || '',
    });
    setImageFile(null);
    setFormOpen(true);
  };

  const save = async () => {
    setFormLoading(true);
    try {
      const payload = new FormData();
      payload.append('title', form.title);
      payload.append('shortDescription', form.shortDescription);
      payload.append('fullContent', form.fullContent);
      payload.append('author', form.author);
      if (imageFile) payload.append('imageFile', imageFile);

      if (editing?.id) {
        await updateBlog(editing.id, payload);
      } else {
        await createBlog(payload);
      }

      setFormOpen(false);
      loadBlogs();
    } finally {
      setFormLoading(false);
    }
  };

  const remove = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteBlog(deleteTarget.id);
      setDeleteTarget(null);
      loadBlogs();
    } finally {
      setDeleteLoading(false);
    }
  };

  const blogImageUrl = (blog) => {
    if (!blog?.image) return '';
    if (blog.image.startsWith('http')) return blog.image;
    return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/assets/${blog.image}`;
  };

  return (
    <div>
      <div className="ap-page-header">
        <div className="ap-page-title">
          <FileText size={20} />
          <div>
            <h1>Blogs</h1>
            <p className="ap-page-subtitle">Create, update and delete blogs from `/api/blogs`</p>
          </div>
        </div>
        <div className="ap-actions">
          <input className="ap-input" style={{ width: 220 }} placeholder="Search blogs" value={search} onChange={(e) => setSearch(e.target.value)} />
          <button type="button" className="ap-btn ap-btn-secondary" onClick={loadBlogs}>Refresh</button>
          <button type="button" className="ap-btn ap-btn-primary" onClick={openCreate}><Plus size={14} /> Add Blog</button>
        </div>
      </div>

      <div className="ap-grid ap-grid-auto">
        {loading ? (
          <div className="ap-card"><div className="ap-card-body" style={{ display: 'grid', placeItems: 'center', minHeight: 130 }}><div className="ap-spinner" /></div></div>
        ) : filtered.length ? (
          filtered.map((blog) => (
            <div key={blog.id} className="ap-card">
              {blog.image ? (
                <div style={{ height: 140, background: '#f8fafc' }}>
                  <img src={blogImageUrl(blog)} alt={blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                </div>
              ) : null}
              <div className="ap-card-body">
                <h3 style={{ marginTop: 0, marginBottom: 8 }}>{blog.title}</h3>
                <p style={{ margin: 0, color: '#64748b', fontSize: 13 }}>{blog.shortDescription || '-'}</p>
                <div style={{ marginTop: 10, fontSize: 12, color: '#475569' }}>By {blog.author || 'Unknown'}</div>
                <div className="ap-actions" style={{ marginTop: 12 }}>
                  <button type="button" className="ap-btn ap-btn-secondary" onClick={() => openEdit(blog)}>Edit</button>
                  <button type="button" className="ap-btn ap-btn-danger" onClick={() => setDeleteTarget(blog)}>Delete</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="ap-empty">No blogs found</div>
        )}
      </div>

      {formOpen ? (
        <div className="ap-modal-backdrop">
          <div className="ap-modal" role="dialog" aria-modal="true" aria-labelledby="blog-form-title">
            <div className="ap-modal-header">
              <h2 id="blog-form-title">{editing ? 'Edit Blog' : 'Create Blog'}</h2>
              <button type="button" className="ap-btn ap-btn-ghost" onClick={() => setFormOpen(false)}>Close</button>
            </div>
            <div className="ap-modal-body">
              <div className="ap-form-grid">
                <div className="ap-field">
                  <label className="ap-label" htmlFor="blog-title">Title</label>
                  <input id="blog-title" className="ap-input" value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} />
                </div>
                <div className="ap-field">
                  <label className="ap-label" htmlFor="blog-author">Author</label>
                  <input id="blog-author" className="ap-input" value={form.author} onChange={(e) => setForm((prev) => ({ ...prev, author: e.target.value }))} />
                </div>
              </div>

              <div className="ap-field">
                <label className="ap-label" htmlFor="blog-short">Short Description</label>
                <textarea id="blog-short" className="ap-textarea" value={form.shortDescription} onChange={(e) => setForm((prev) => ({ ...prev, shortDescription: e.target.value }))} />
              </div>

              <div className="ap-field">
                <label className="ap-label" htmlFor="blog-content">Full Content</label>
                <textarea id="blog-content" className="ap-textarea" style={{ minHeight: 160 }} value={form.fullContent} onChange={(e) => setForm((prev) => ({ ...prev, fullContent: e.target.value }))} />
              </div>

              <div className="ap-field">
                <label className="ap-label" htmlFor="blog-image">Image File</label>
                <input id="blog-image" type="file" className="ap-input" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
              </div>
            </div>
            <div className="ap-modal-footer">
              <button type="button" className="ap-btn ap-btn-secondary" onClick={() => setFormOpen(false)}>Cancel</button>
              <button type="button" className="ap-btn ap-btn-primary" onClick={save} disabled={formLoading || !form.title || !form.fullContent}>
                {formLoading ? 'Saving...' : editing ? 'Update Blog' : 'Create Blog'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Blog"
        message={`Delete blog "${deleteTarget?.title || ''}"?`}
        confirmLabel="Delete"
        loading={deleteLoading}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={remove}
      />
    </div>
  );
}
