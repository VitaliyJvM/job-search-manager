import { useEffect, useState } from 'react';
import { contactsApi } from '../api/contacts.ts';
import { companiesApi } from '../api/companies.ts';
import type { Contact, ContactRequest, Company, RelationshipType } from '../types/index.ts';
import Modal from '../components/Modal.tsx';
import ConfirmDialog from '../components/ConfirmDialog.tsx';
import StatusBadge from '../components/StatusBadge.tsx';
import LoadingSpinner from '../components/LoadingSpinner.tsx';

const RELATIONSHIP_TYPES: RelationshipType[] = ['RECRUITER', 'ENGINEER', 'MANAGER', 'REFERRAL', 'LOCAL_CONTACT', 'OTHER'];
const EMPTY_FORM: ContactRequest = { fullName: '', companyId: undefined, roleTitle: '', linkedinUrl: '', email: '', relationshipType: undefined, notes: '' };

export default function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filterCompany, setFilterCompany] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Contact | null>(null);
  const [form, setForm] = useState<ContactRequest>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Contact | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([contactsApi.getAll(filterCompany ?? undefined), companiesApi.getAll()])
      .then(([c, co]) => { setContacts(c); setCompanies(co); })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, [filterCompany]);

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setModalOpen(true); };
  const openEdit = (c: Contact) => {
    setEditing(c);
    setForm({ fullName: c.fullName, companyId: c.companyId, roleTitle: c.roleTitle ?? '', linkedinUrl: c.linkedinUrl ?? '', email: c.email ?? '', relationshipType: c.relationshipType, notes: c.notes ?? '' });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...form, companyId: form.companyId || undefined };
      if (editing) await contactsApi.update(editing.id, payload);
      else await contactsApi.create(payload);
      setModalOpen(false); load();
    } catch (e: unknown) { alert((e as Error).message); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try { await contactsApi.delete(deleteTarget.id); setDeleteTarget(null); load(); }
    catch (e: unknown) { alert((e as Error).message); }
    finally { setDeleting(false); }
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Contacts</h1>
          <p className="page-subtitle">{contacts.length} contact{contacts.length !== 1 ? 's' : ''}</p>
        </div>
        <button id="btn-add-contact" className="btn btn-primary" onClick={openCreate}>+ Add Contact</button>
      </div>

      {error && <div className="error-banner">⚠️ {error}</div>}

      <div className="filter-bar">
        <button className={`filter-btn${filterCompany === null ? ' active' : ''}`} onClick={() => setFilterCompany(null)}>All Companies</button>
        {companies.map((c) => (
          <button key={c.id} className={`filter-btn${filterCompany === c.id ? ' active' : ''}`} onClick={() => setFilterCompany(c.id)}>
            {c.name}
          </button>
        ))}
      </div>

      {loading ? <LoadingSpinner /> : (
        contacts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">👥</div>
            <h3>No contacts yet</h3>
            <p>Add recruiters, engineers, and managers you meet.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Name</th><th>Company</th><th>Role</th><th>Type</th><th>Email</th><th>LinkedIn</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {contacts.map((c) => (
                  <tr key={c.id}>
                    <td className="name-cell">{c.fullName}</td>
                    <td>{c.companyName ?? '—'}</td>
                    <td>{c.roleTitle ?? '—'}</td>
                    <td><StatusBadge value={c.relationshipType} /></td>
                    <td>{c.email ? <a href={`mailto:${c.email}`} style={{ color: 'var(--accent)' }}>{c.email}</a> : '—'}</td>
                    <td>{c.linkedinUrl ? <a href={c.linkedinUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>Profile</a> : '—'}</td>
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
          title={editing ? 'Edit Contact' : 'Add Contact'}
          onClose={() => setModalOpen(false)}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving || !form.fullName.trim()}>
                {saving && <span className="loading-spinner" style={{ width: 14, height: 14 }} />}
                {editing ? 'Save Changes' : 'Create'}
              </button>
            </>
          }
        >
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="contact-name">Full Name *</label>
              <input id="contact-name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="Jane Smith" />
            </div>
            <div className="form-group">
              <label htmlFor="contact-company">Company</label>
              <select id="contact-company" value={form.companyId ?? ''} onChange={(e) => setForm({ ...form, companyId: e.target.value ? Number(e.target.value) : undefined })}>
                <option value="">— None —</option>
                {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="contact-role">Role Title</label>
              <input id="contact-role" value={form.roleTitle} onChange={(e) => setForm({ ...form, roleTitle: e.target.value })} placeholder="e.g. Senior Recruiter" />
            </div>
            <div className="form-group">
              <label htmlFor="contact-type">Relationship Type</label>
              <select id="contact-type" value={form.relationshipType ?? ''} onChange={(e) => setForm({ ...form, relationshipType: (e.target.value as RelationshipType) || undefined })}>
                <option value="">— Select —</option>
                {RELATIONSHIP_TYPES.map((t) => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="contact-email">Email</label>
              <input id="contact-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="jane@company.com" />
            </div>
            <div className="form-group">
              <label htmlFor="contact-linkedin">LinkedIn URL</label>
              <input id="contact-linkedin" value={form.linkedinUrl} onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })} placeholder="https://linkedin.com/in/..." />
            </div>
            <div className="form-group full-width">
              <label htmlFor="contact-notes">Notes</label>
              <textarea id="contact-notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} />
            </div>
          </div>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          message={`Delete contact "${deleteTarget.fullName}"?`}
          loading={deleting}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </>
  );
}
