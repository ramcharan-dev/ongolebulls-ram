import { useState } from 'react';
import { submitContact } from '../../api/contactApi';

export default function Contact() {
  const [form, setForm]       = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError]     = useState('');

  const handle = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setLoading(true);
    try {
      await submitContact(form.name, form.email, form.message);
      setSuccess("Thank you! We've received your message and will get back to you shortly.");
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setError(err.userMessage || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>
        {/* Info */}
        <div>
          <h1 className="page-title">Get in Touch</h1>
          <p style={{ fontSize: 16, color: '#374151', marginBottom: '2rem', lineHeight: 1.8 }}>
            Have questions about investments, our services, or your account?
            Our team of financial experts is here to help.
          </p>
          {[
            ['📍', 'Address', 'Ongole, Andhra Pradesh, India'],
            ['📧', 'Email', 'info@ongolebullsinvest.com'],
            ['🌐', 'Website', 'www.ongolebullsinvest.com'],
          ].map(([icon, label, val]) => (
            <div key={label} style={{ display:'flex', gap:12, marginBottom:16 }}>
              <span style={{ fontSize:20 }}>{icon}</span>
              <div>
                <p style={{ fontWeight:600, fontSize:14 }}>{label}</p>
                <p className="text-muted" style={{ fontSize:14 }}>{val}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="card">
          <h3 style={{ marginBottom:'1.25rem' }}>Send a Message</h3>
          {success && <div className="alert alert-success">{success}</div>}
          {error   && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input name="name" required value={form.name} onChange={handle} placeholder="Your full name" />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" required value={form.email} onChange={handle} placeholder="you@example.com" />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea name="message" required rows={5} value={form.message} onChange={handle}
                placeholder="How can we help you?" style={{ resize:'vertical' }} />
            </div>
            <button className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Sending…' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
