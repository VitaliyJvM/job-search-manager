import { useEffect, useState } from 'react';
import { companiesApi } from '../api/companies.ts';
import type { Company, CompanyRequest } from '../types/index.ts';
import Modal from '../components/Modal.tsx';
import ConfirmDialog from '../components/ConfirmDialog.tsx';
import LoadingSpinner from '../components/LoadingSpinner.tsx';

const EMPTY_FORM: CompanyRequest = { name: '', industry: '', location: '', website: '', notes: '', priority: undefined };

export default function Companies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Company | null>(null);
  const [form, setForm] = useState<CompanyRequest>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Company | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    companiesApi.getAll()
      .then(setCompanies)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setModalOpen(true); };
  const openEdit = (c: Company) => {
    setEditing(c);
    setForm({ name: c.name, industry: c.industry ?? '', location: c.location ?? '', website: c.website ?? '', notes: c.notes ?? '', priority: c.priority });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        await companiesApi.update(editing.id, form);
      } else {
        await companiesApi.create(form);
      }
      setModalOpen(false);
      load();
    } catch (e: unknown) {
      alert((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await companiesApi.delete(deleteTarget.id);
      setDeleteTarget(null);
      load();
    } catch (e: unknown) {
      alert((e as Error).message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Companies</h1>
          <p className="page-subtitle">{companies.length} company{companies.length !== 1 ? 'ies' : 'y'} tracked</p>
        </div>
        <button id="btn-add-company" className="btn btn-primary" onClick={openCreate}>+ Add Company</button>
      </div>

      {error && <div className="error-banner">⚠️ {error}</div>}

      {loading ? <LoadingSpinner /> : (
        companies.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🏢</div>
            <h3>No companies yet</h3>
            <p>Add companies you're interested in to get started.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Industry</th>
                  <th>Location</th>
                  <th>Website</th>
                  <th>Priority</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((c) => (
                  <tr key={c.id}>
                    <td className="name-cell">{c.name}</td>
                    <td>{c.industry ?? '—'}</td>
                    <td>{c.location ?? '—'}</td>
                    <td>
                      {c.website
                        ? <a href={c.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>
                            {c.website.replace(/^https?:\/\//, '')}
                          </a>
                        : '—'}
                    </td>
                    <td>{c.priority != null ? `P${c.priority}` : '—'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(c)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => setDeleteTarget(c)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {modalOpen && (
        <Modal
          title={editing ? 'Edit Company' : 'Add Company'}
          onClose={() => setModalOpen(false)}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving || !form.name.trim()}>
                {saving ? <span className="loading-spinner" style={{ width: 14, height: 14 }} /> : null}
                {editing ? 'Save Changes' : 'Create'}
              </button>
            </>
          }
        >
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="company-name">Company Name *</label>
              <input id="company-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Acme Corp" />
            </div>
            <div className="form-group">
              <label htmlFor="company-industry">Industry</label>
              <input id="company-industry" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} placeholder="e.g. Software" />
            </div>
            <div className="form-group">
              <label htmlFor="company-location">Location</label>
              <input id="company-location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. San Francisco, CA" />
            </div>
            <div className="form-group">
              <label htmlFor="company-website">Website</label>
              <input id="company-website" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://..." />
            </div>
            <div className="form-group">
              <label htmlFor="company-priority">Priority (1 = highest)</label>
              <input id="company-priority" type="number" min={1} max={10} value={form.priority ?? ''} onChange={(e) => setForm({ ...form, priority: e.target.value ? Number(e.target.value) : undefined })} placeholder="1–10" />
            </div>
            <div className="form-group full-width">
              <label htmlFor="company-notes">Notes</label>
              <textarea id="company-notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} placeholder="Any notes about this company..." />
            </div>
          </div>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          message={`Are you sure you want to delete "${deleteTarget.name}"? This action cannot be undone.`}
          loading={deleting}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </>
  );
}
