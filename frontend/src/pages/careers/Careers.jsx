import { useEffect, useState } from 'react';
import { getJobs, getDepartments, getLocations, getExperiences, applyForJob } from '../../api/jobApi';
import { submitCandidateApplication } from '../../api/candidateApi';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function Careers() {
  const [jobs, setJobs]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [departments, setDepts]   = useState([]);
  const [locations, setLocs]      = useState([]);
  const [experiences, setExps]    = useState([]);
  const [filters, setFilters]     = useState({ department:'', location:'', experience:'' });

  // Apply modal
  const [applying, setApplying]   = useState(null); // job object
  const [applyForm, setApplyForm] = useState({ name:'', email:'', phone:'', resume:null });
  const [applyMsg, setApplyMsg]   = useState('');
  const [applyLoading, setApplyLoading] = useState(false);

  useEffect(() => {
    Promise.all([getDepartments(), getLocations(), getExperiences()])
      .then(([d, l, e]) => {
        setDepts(d.data || []); setLocs(l.data || []); setExps(e.data || []);
      });
    loadJobs({});
  }, []);

  const loadJobs = async (f) => {
    setLoading(true); setError('');
    try {
      const res = await getJobs(f);
      setJobs(res.data || []);
    } catch (e) { setError(e.userMessage || 'Failed to load jobs.'); }
    finally { setLoading(false); }
  };

  const handleFilterChange = (e) => {
    const updated = { ...filters, [e.target.name]: e.target.value };
    setFilters(updated);
    loadJobs(updated);
  };

  const openApply = (job) => {
    setApplying(job); setApplyForm({ name:'', email:'', phone:'', resume:null }); setApplyMsg('');
  };

  const submitApply = async () => {
    if (!applyForm.name || !applyForm.email || !applyForm.phone || !applyForm.resume) {
      setApplyMsg('All fields are required.'); return;
    }
    setApplyLoading(true); setApplyMsg('');
    try {
      const fd = new FormData();
      fd.append('name',   applyForm.name);
      fd.append('email',  applyForm.email);
      fd.append('phone',  applyForm.phone);
      fd.append('resume', applyForm.resume);
      fd.append('jobId',  applying.id);
      await applyForJob(fd);
      setApplyMsg('Application submitted successfully! We will be in touch.');
      setTimeout(() => setApplying(null), 2000);
    } catch (e) { setApplyMsg(e.userMessage || 'Application failed.'); }
    finally { setApplyLoading(false); }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <h1 className="page-title">Careers at OngoleBulls</h1>

      {/* Filters */}
      <div style={{ display:'flex', gap:12, marginBottom:'1.5rem', flexWrap:'wrap' }}>
        {[
          ['department', 'Department', departments],
          ['location',   'Location',   locations],
          ['experience', 'Experience', experiences],
        ].map(([key, label, opts]) => (
          <select key={key} name={key} value={filters[key]} onChange={handleFilterChange}
            style={{ padding:'8px 12px', border:'1.5px solid #e5e7eb', borderRadius:8, fontSize:14, background:'#fff' }}>
            <option value="">All {label}s</option>
            {opts.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        ))}
      </div>

      {loading && <LoadingSpinner />}
      {error   && <div className="alert alert-error">{error}</div>}

      {!loading && !error && (
        <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          {jobs.length === 0 && <p className="text-muted">No open positions match your criteria.</p>}
          {jobs.map((job) => (
            <div className="card" key={job.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'1rem' }}>
              <div style={{ flex:1 }}>
                <h3 style={{ fontWeight:600, marginBottom:4 }}>{job.title}</h3>
                <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:8 }}>
                  {[job.department, job.location, job.experience, job.employmentType, job.remoteType].filter(Boolean).map((tag) => (
                    <span key={tag} style={{ background:'#f3f4f6', padding:'2px 8px', borderRadius:4, fontSize:12, color:'#374151' }}>{tag}</span>
                  ))}
                </div>
                {job.salaryRange && <p className="text-muted" style={{ fontSize:13 }}>💰 {job.salaryRange}</p>}
                {job.applyDeadline && <p className="text-muted" style={{ fontSize:13 }}>⏰ Apply by: {job.applyDeadline}</p>}
              </div>
              <button className="btn btn-primary btn-sm" style={{ flexShrink:0 }} onClick={() => openApply(job)}>
                Apply Now
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Apply Modal */}
      {applying && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.45)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:999 }}>
          <div className="card" style={{ width:400, maxHeight:'90vh', overflowY:'auto' }}>
            <h3 style={{ marginBottom:4 }}>Apply — {applying.title}</h3>
            <p className="text-muted mb-2">{applying.department} · {applying.location}</p>
            {applyMsg && <div className={`alert ${applyMsg.includes('success') ? 'alert-success' : 'alert-error'}`}>{applyMsg}</div>}
            {['name','email','phone'].map((f) => (
              <div className="form-group" key={f}>
                <label style={{ textTransform:'capitalize' }}>{f}</label>
                <input type={f==='email'?'email':'text'} value={applyForm[f]}
                  onChange={e => setApplyForm(p => ({...p, [f]: e.target.value}))} />
              </div>
            ))}
            <div className="form-group">
              <label>Resume (PDF)</label>
              <input type="file" accept=".pdf,.doc,.docx" onChange={e => setApplyForm(p => ({...p, resume: e.target.files[0]}))} />
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <button className="btn btn-outline" onClick={() => setApplying(null)}>Cancel</button>
              <button className="btn btn-primary" style={{ flex:1 }} onClick={submitApply} disabled={applyLoading}>
                {applyLoading ? 'Submitting…' : 'Submit Application'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
