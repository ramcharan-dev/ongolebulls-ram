import { useEffect, useMemo, useState } from 'react';
import { Briefcase, Plus } from 'lucide-react';
import {
  createJob,
  deleteJob,
  getDepartments,
  getExperiences,
  getJobs,
  getLocations,
  getWorkTypes,
  updateJob,
} from '../../api/jobApi';
import ConfirmDialog from './components/ConfirmDialog';

const EMPTY = {
  title: '',
  department: '',
  location: '',
  experience: '',
  remoteType: '',
  employmentType: '',
  salaryRange: '',
  qualification: '',
  description: '',
  skillsRequired: '',
  keyResponsibility: '',
  rolesAndResponsibilities: '',
  postedDate: '',
  applyDeadline: '',
  seoTitle: '',
  seoKeywords: '',
  seoDescription: '',
};

export default function CareersPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ department: '', location: '', experience: '', remoteType: '' });
  const [meta, setMeta] = useState({ departments: [], locations: [], experiences: [], workTypes: [] });

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadMeta = async () => {
    const [depRes, locRes, expRes, workRes] = await Promise.all([
      getDepartments(),
      getLocations(),
      getExperiences(),
      getWorkTypes(),
    ]);
    setMeta({
      departments: Array.isArray(depRes.data) ? depRes.data : [],
      locations: Array.isArray(locRes.data) ? locRes.data : [],
      experiences: Array.isArray(expRes.data) ? expRes.data : [],
      workTypes: Array.isArray(workRes.data) ? workRes.data : [],
    });
  };

  const loadJobs = async () => {
    setLoading(true);
    try {
      const response = await getJobs(filters);
      setRows(Array.isArray(response.data) ? response.data : []);
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMeta();
  }, []);

  useEffect(() => {
    loadJobs();
  }, [filters.department, filters.location, filters.experience, filters.remoteType]);

  const sortedRows = useMemo(() => [...rows].sort((a, b) => Number(b.id || 0) - Number(a.id || 0)), [rows]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY);
    setFormOpen(true);
  };

  const openEdit = (job) => {
    setEditing(job);
    setForm({ ...EMPTY, ...job });
    setFormOpen(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      if (editing?.id) {
        await updateJob(editing.id, form);
      } else {
        await createJob(form);
      }
      setFormOpen(false);
      loadJobs();
      loadMeta();
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteJob(deleteTarget.id);
      setDeleteTarget(null);
      loadJobs();
      loadMeta();
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div>
      <div className="ap-page-header">
        <div className="ap-page-title">
          <Briefcase size={20} />
          <div>
            <h1>Careers</h1>
            <p className="ap-page-subtitle">Manage job postings and career filters</p>
          </div>
        </div>
        <div className="ap-actions">
          <button type="button" className="ap-btn ap-btn-secondary" onClick={loadJobs}>Refresh</button>
          <button type="button" className="ap-btn ap-btn-primary" onClick={openCreate}><Plus size={14} /> Add Job</button>
        </div>
      </div>

      <div className="ap-row" style={{ marginBottom: 12 }}>
        <div className="ap-col" style={{ maxWidth: 220 }}>
          <select className="ap-select" value={filters.department} onChange={(e) => setFilters((prev) => ({ ...prev, department: e.target.value }))}>
            <option value="">All Departments</option>
            {meta.departments.map((dep) => <option key={dep} value={dep}>{dep}</option>)}
          </select>
        </div>
        <div className="ap-col" style={{ maxWidth: 220 }}>
          <select className="ap-select" value={filters.location} onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value }))}>
            <option value="">All Locations</option>
            {meta.locations.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
          </select>
        </div>
        <div className="ap-col" style={{ maxWidth: 220 }}>
          <select className="ap-select" value={filters.experience} onChange={(e) => setFilters((prev) => ({ ...prev, experience: e.target.value }))}>
            <option value="">All Experience</option>
            {meta.experiences.map((exp) => <option key={exp} value={exp}>{exp}</option>)}
          </select>
        </div>
        <div className="ap-col" style={{ maxWidth: 220 }}>
          <select className="ap-select" value={filters.remoteType} onChange={(e) => setFilters((prev) => ({ ...prev, remoteType: e.target.value }))}>
            <option value="">All Work Types</option>
            {meta.workTypes.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
      </div>

      <div className="ap-table-wrap">
        <div className="ap-table-scroll">
          <table className="ap-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Department</th>
                <th>Location</th>
                <th>Experience</th>
                <th>Work Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6}><div style={{ display: 'grid', placeItems: 'center', padding: 16 }}><div className="ap-spinner" /></div></td></tr>
              ) : sortedRows.length ? (
                sortedRows.map((job) => (
                  <tr key={job.id}>
                    <td>{job.title || '-'}</td>
                    <td>{job.department || '-'}</td>
                    <td>{job.location || '-'}</td>
                    <td>{job.experience || '-'}</td>
                    <td>{job.remoteType || '-'}</td>
                    <td>
                      <div className="ap-actions">
                        <button type="button" className="ap-btn ap-btn-secondary" onClick={() => openEdit(job)}>Edit</button>
                        <button type="button" className="ap-btn ap-btn-danger" onClick={() => setDeleteTarget(job)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={6}><div className="ap-empty">No jobs found</div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {formOpen ? (
        <div className="ap-modal-backdrop">
          <div className="ap-modal" role="dialog" aria-modal="true" aria-labelledby="career-form-title">
            <div className="ap-modal-header">
              <h2 id="career-form-title">{editing ? 'Edit Job' : 'Create Job'}</h2>
              <button type="button" className="ap-btn ap-btn-ghost" onClick={() => setFormOpen(false)}>Close</button>
            </div>
            <div className="ap-modal-body">
              <div className="ap-form-grid">
                {[
                  ['title', 'Title'],
                  ['department', 'Department'],
                  ['location', 'Location'],
                  ['experience', 'Experience'],
                  ['remoteType', 'Remote Type'],
                  ['employmentType', 'Employment Type'],
                  ['salaryRange', 'Salary Range'],
                  ['qualification', 'Qualification'],
                  ['postedDate', 'Posted Date'],
                  ['applyDeadline', 'Apply Deadline'],
                  ['seoTitle', 'SEO Title'],
                  ['seoKeywords', 'SEO Keywords'],
                ].map(([field, label]) => (
                  <div className="ap-field" key={field}>
                    <label className="ap-label" htmlFor={`job-${field}`}>{label}</label>
                    <input id={`job-${field}`} className="ap-input" value={form[field] || ''} onChange={(e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))} />
                  </div>
                ))}
                <div className="ap-field" style={{ gridColumn: '1 / -1' }}>
                  <label className="ap-label">Description</label>
                  <textarea className="ap-textarea" value={form.description || ''} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} />
                </div>
                <div className="ap-field" style={{ gridColumn: '1 / -1' }}>
                  <label className="ap-label">Skills Required</label>
                  <textarea className="ap-textarea" value={form.skillsRequired || ''} onChange={(e) => setForm((prev) => ({ ...prev, skillsRequired: e.target.value }))} />
                </div>
                <div className="ap-field" style={{ gridColumn: '1 / -1' }}>
                  <label className="ap-label">Key Responsibility</label>
                  <textarea className="ap-textarea" value={form.keyResponsibility || ''} onChange={(e) => setForm((prev) => ({ ...prev, keyResponsibility: e.target.value }))} />
                </div>
                <div className="ap-field" style={{ gridColumn: '1 / -1' }}>
                  <label className="ap-label">Roles and Responsibilities</label>
                  <textarea className="ap-textarea" value={form.rolesAndResponsibilities || ''} onChange={(e) => setForm((prev) => ({ ...prev, rolesAndResponsibilities: e.target.value }))} />
                </div>
                <div className="ap-field" style={{ gridColumn: '1 / -1' }}>
                  <label className="ap-label">SEO Description</label>
                  <textarea className="ap-textarea" value={form.seoDescription || ''} onChange={(e) => setForm((prev) => ({ ...prev, seoDescription: e.target.value }))} />
                </div>
              </div>
            </div>
            <div className="ap-modal-footer">
              <button type="button" className="ap-btn ap-btn-secondary" onClick={() => setFormOpen(false)}>Cancel</button>
              <button type="button" className="ap-btn ap-btn-primary" onClick={save} disabled={saving || !form.title || !form.department || !form.location}>
                {saving ? 'Saving...' : editing ? 'Update Job' : 'Create Job'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Job"
        message={`Delete job "${deleteTarget?.title || ''}"?`}
        confirmLabel="Delete"
        loading={deleteLoading}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={remove}
      />
    </div>
  );
}
