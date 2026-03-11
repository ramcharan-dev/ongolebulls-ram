import { useEffect, useMemo, useState } from 'react';
import { Plus, Users } from 'lucide-react';
import { createClient, deleteClient, getClients, updateClient } from '../../api/clientApi';
import ConfirmDialog from './components/ConfirmDialog';

const EMPTY_CLIENT = {
  fullName: '',
  email: '',
  phone: '',
  city: '',
  state: '',
  address: '',
  riskProfile: '',
  annualIncome: '',
  occupation: '',
  aadhaar: '',
  panCard: '',
  bankAccountDetails: '',
  nomineeName: '',
  nomineeRelation: '',
  investmentExperience: '',
  preferredInvestments: '',
  pinCode: '',
  emailVerified: false,
  password: '',
  resetToken: '',
};

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_CLIENT);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadClients = async () => {
    setLoading(true);
    try {
      const response = await getClients();
      setClients(Array.isArray(response.data) ? response.data : []);
    } catch {
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return clients;
    return clients.filter((client) =>
      [client.fullName, client.email, client.phone, client.city, client.panCard]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [clients, search]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_CLIENT);
    setFormOpen(true);
  };

  const openEdit = (client) => {
    setEditing(client);
    setForm({ ...EMPTY_CLIENT, ...client, annualIncome: client.annualIncome ?? '' });
    setFormOpen(true);
  };

  const save = async () => {
    setFormLoading(true);
    try {
      const payload = {
        ...form,
        annualIncome: form.annualIncome === '' ? null : Number(form.annualIncome),
      };

      if (editing?.id) {
        await updateClient(editing.id, payload);
      } else {
        await createClient(payload);
      }

      setFormOpen(false);
      loadClients();
    } finally {
      setFormLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteClient(deleteTarget.id);
      setDeleteTarget(null);
      loadClients();
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div>
      <div className="ap-page-header">
        <div className="ap-page-title">
          <Users size={20} />
          <div>
            <h1>Clients</h1>
            <p className="ap-page-subtitle">Manage client records via `/api/clients`</p>
          </div>
        </div>
        <div className="ap-actions">
          <input className="ap-input" placeholder="Search clients" value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: 220 }} />
          <button type="button" className="ap-btn ap-btn-secondary" onClick={loadClients}>Refresh</button>
          <button type="button" className="ap-btn ap-btn-primary" onClick={openCreate}><Plus size={14} /> Add Client</button>
        </div>
      </div>

      <div className="ap-table-wrap">
        <div className="ap-table-scroll">
          <table className="ap-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>City/State</th>
                <th>Risk</th>
                <th>Income</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7}><div style={{ display: 'grid', placeItems: 'center', padding: 20 }}><div className="ap-spinner" /></div></td></tr>
              ) : filtered.length ? (
                filtered.map((client) => (
                  <tr key={client.id}>
                    <td>{client.fullName || '-'}</td>
                    <td>{client.email || '-'}</td>
                    <td>{client.phone || '-'}</td>
                    <td>{[client.city, client.state].filter(Boolean).join(', ') || '-'}</td>
                    <td>{client.riskProfile || '-'}</td>
                    <td>{client.annualIncome ?? '-'}</td>
                    <td>
                      <div className="ap-actions">
                        <button type="button" className="ap-btn ap-btn-secondary" onClick={() => openEdit(client)}>Edit</button>
                        <button type="button" className="ap-btn ap-btn-danger" onClick={() => setDeleteTarget(client)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={7}><div className="ap-empty">No clients found</div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {formOpen ? (
        <div className="ap-modal-backdrop">
          <div className="ap-modal" role="dialog" aria-modal="true" aria-labelledby="client-form-title">
            <div className="ap-modal-header">
              <h2 id="client-form-title">{editing ? 'Edit Client' : 'Create Client'}</h2>
              <button type="button" className="ap-btn ap-btn-ghost" onClick={() => setFormOpen(false)}>Close</button>
            </div>
            <div className="ap-modal-body">
              <div className="ap-form-grid">
                {[
                  ['fullName', 'Full Name'],
                  ['email', 'Email'],
                  ['phone', 'Phone'],
                  ['city', 'City'],
                  ['state', 'State'],
                  ['riskProfile', 'Risk Profile'],
                  ['annualIncome', 'Annual Income'],
                  ['occupation', 'Occupation'],
                  ['panCard', 'PAN Card'],
                  ['aadhaar', 'Aadhaar'],
                  ['nomineeName', 'Nominee Name'],
                  ['nomineeRelation', 'Nominee Relation'],
                  ['investmentExperience', 'Investment Experience'],
                  ['preferredInvestments', 'Preferred Investments'],
                  ['pinCode', 'Pin Code'],
                  ['bankAccountDetails', 'Bank Account Details'],
                ].map(([field, label]) => (
                  <div key={field} className="ap-field">
                    <label className="ap-label" htmlFor={`client-${field}`}>{label}</label>
                    <input
                      id={`client-${field}`}
                      className="ap-input"
                      value={form[field] ?? ''}
                      onChange={(e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))}
                    />
                  </div>
                ))}
                <div className="ap-field" style={{ gridColumn: '1 / -1' }}>
                  <label className="ap-label" htmlFor="client-address">Address</label>
                  <textarea
                    id="client-address"
                    className="ap-textarea"
                    value={form.address}
                    onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
                  />
                </div>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={!!form.emailVerified}
                    onChange={(e) => setForm((prev) => ({ ...prev, emailVerified: e.target.checked }))}
                  />
                  Email Verified
                </label>
              </div>
            </div>
            <div className="ap-modal-footer">
              <button type="button" className="ap-btn ap-btn-secondary" onClick={() => setFormOpen(false)}>Cancel</button>
              <button type="button" className="ap-btn ap-btn-primary" onClick={save} disabled={formLoading || !form.fullName || !form.email}>
                {formLoading ? 'Saving...' : editing ? 'Update Client' : 'Create Client'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Client"
        message={`Delete client "${deleteTarget?.fullName || ''}"?`}
        confirmLabel="Delete"
        loading={deleteLoading}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
