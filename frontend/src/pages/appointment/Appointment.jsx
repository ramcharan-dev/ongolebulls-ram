import { useState } from 'react';
import { bookAppointment } from '../../api/appointmentApi';

const TYPES = [
  { value: 'INVESTMENT_CONSULTATION', label: 'Investment Consultation' },
  { value: 'FINANCIAL_PLANNING',      label: 'Financial Planning' },
  { value: 'WEALTH_MANAGEMENT',       label: 'Wealth Management' },
  { value: 'OTHERS',                  label: 'Others' },
];

export default function Appointment() {
  const [form, setForm]       = useState({
    fullName: '', email: '', mobile: '',
    preferredDate: '', preferredTime: '10:00:00',
    type: 'INVESTMENT_CONSULTATION', notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError]     = useState('');

  const handle = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSuccess('');
    setLoading(true);
    try {
      await bookAppointment(form);
      setSuccess("Your appointment has been successfully booked! Our team will connect with you shortly.");
      setForm({ fullName:'', email:'', mobile:'', preferredDate:'', preferredTime:'10:00:00', type:'INVESTMENT_CONSULTATION', notes:'' });
    } catch (err) {
      setError(err.userMessage || 'Could not book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: 600 }}>
      <h1 className="page-title">Book an Appointment</h1>
      <p style={{ color:'#374151', marginBottom:'1.5rem' }}>
        Schedule a free consultation with our investment experts.
      </p>

      <div className="card">
        {success && <div className="alert alert-success">{success}</div>}
        {error   && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input name="fullName" required value={form.fullName} onChange={handle} />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" required value={form.email} onChange={handle} />
            </div>
            <div className="form-group">
              <label>Mobile</label>
              <input type="tel" name="mobile" required pattern="[0-9]{10}" value={form.mobile} onChange={handle} placeholder="10-digit number" />
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div className="form-group">
              <label>Preferred Date</label>
              <input type="date" name="preferredDate" required value={form.preferredDate} onChange={handle}
                min={new Date().toISOString().split('T')[0]} />
            </div>
            <div className="form-group">
              <label>Preferred Time</label>
              <input type="time" name="preferredTime" required value={form.preferredTime.slice(0,5)}
                onChange={(e) => setForm(p => ({...p, preferredTime: e.target.value + ':00'}))} />
            </div>
          </div>
          <div className="form-group">
            <label>Appointment Type</label>
            <select name="type" value={form.type} onChange={handle}>
              {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Notes (optional)</label>
            <textarea name="notes" rows={3} value={form.notes} onChange={handle}
              placeholder="Any specific questions or topics you'd like to discuss…" style={{ resize:'vertical' }} />
          </div>
          <button className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Booking…' : 'Book Appointment'}
          </button>
        </form>
      </div>
    </div>
  );
}
