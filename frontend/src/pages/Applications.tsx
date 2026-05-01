import { useEffect, useState } from 'react';
import { applicationsApi } from '../api/applications.ts';
import { companiesApi } from '../api/companies.ts';
import type { JobApplication, JobApplicationRequest, ApplicationStatus, Company } from '../types/index.ts';
import Modal from '../components/Modal.tsx';
import ConfirmDialog from '../components/ConfirmDialog.tsx';
import StatusBadge, { ALL_STATUSES } from '../components/StatusBadge.tsx';
import LoadingSpinner from '../components/LoadingSpinner.tsx';

const EMPTY_FORM: JobApplicationRequest = {
  jobTitle: '', status: 'INTERESTED', companyId: undefined, jobDescription: '',
  salaryRange: '', sourceUrl: '', appliedAt: '', nextFollowUpAt: '', notes: '',
};

export default function Applications() {
  const [apps, setApps] = useState<JobApplication[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filter, setFilter] = useState<ApplicationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<JobApplication | null>(null);
  const [form, setForm] = useState<JobApplicationRequest>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<JobApplication | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([
      applicationsApi.getAll(filter ?? undefined),
      companiesApi.getAll(),
    ]).then(([a, c]) => { setApps(a); setCompanies(c); })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, [filter]);

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setModalOpen(true); };
  const openEdit = (a: JobApplication) => {
    setEditing(a);
    setForm({
      jobTitle: a.jobTitle, status: a.status, companyId: a.companyId,
      jobDescription: a.jobDescription ?? '', salaryRange: a.salaryRange ?? '',
      sourceUrl: a.sourceUrl ?? '', appliedAt: a.appliedAt ?? '', nextFollowUpAt: a.nextFollowUpAt ?? '',
      notes: a.notes ?? '',
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...form, companyId: form.companyId || undefined };
      if (editing) { await applicationsApi.update(editing.id, payload); }
      else { await applicationsApi.create(payload); }
      setModalOpen(false); load();
    } catch (e: unknown) { alert((e as Error).message); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try { await applicationsApi.delete(deleteTarget.id); setDeleteTarget(null); load(); }
    catch (e: unknown) { alert((e as Error).message); }
    finally { setDeleting(false); }
  };

  const filtered = apps;

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Applications</h1>
          <p className="page-subtitle">{filtered.length} application{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <button id="btn-add-application" className="btn btn-primary" onClick={openCreate}>+ Add Application</button>
      </div>

      {error && <div className="error-banner">⚠️ {error}</div>}

      <div className="filter-bar">
        <button className={`filter-btn${filter === null ? ' active' : ''}`} onClick={() => setFilter(null)}>All</button>
        {ALL_STATUSES.map((s) => (
          <button key={s} className={`filter-btn${filter === s ? ' active' : ''}`} onClick={() => setFilter(s)}>
            {s.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {loading ? <LoadingSpinner /> : (
        filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <h3>No applications yet</h3>
            <p>Track each job you apply to here.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Company</th>
                  <th>Status</th>
                  <th>Salary</th>
                  <th>Applied</th>
                  <th>Follow-Up</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <tr key={a.id}>
                    <td className="name-cell">{a.jobTitle}</td>
                    <td>{a.companyName ?? '—'}</td>
                    <td><StatusBadge value={a.status} /></td>
                    <td>{a.salaryRange ?? '—'}</td>
                    <td>{a.appliedAt ?? '—'}</td>
                    <td style={{ color: isOverdue(a.nextFollowUpAt) ? 'var(--danger)' : undefined }}>
                      {a.nextFollowUpAt ?? '—'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(a)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => setDeleteTarget(a)}>Delete</button>
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
          title={editing ? 'Edit Application' : 'New Application'}
          onClose={() => setModalOpen(false)}
          maxWidth="680px"
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving || !form.jobTitle.trim()}>
                {saving && <span className="loading-spinner" style={{ width: 14, height: 14 }} />}
                {editing ? 'Save Changes' : 'Create'}
              </button>
            </>
          }
        >
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="app-job-title">Job Title *</label>
              <input id="app-job-title" value={form.jobTitle} onChange={(e) => setForm({ ...form, jobTitle: e.target.value })} placeholder="e.g. Senior Engineer" />
            </div>
            <div className="form-group">
              <label htmlFor="app-company">Company</label>
              <select id="app-company" value={form.companyId ?? ''} onChange={(e) => setForm({ ...form, companyId: e.target.value ? Number(e.target.value) : undefined })}>
                <option value="">— No company —</option>
                {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="app-status">Status *</label>
              <select id="app-status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ApplicationStatus })}>
                {ALL_STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="app-salary">Salary Range</label>
              <input id="app-salary" value={form.salaryRange} onChange={(e) => setForm({ ...form, salaryRange: e.target.value })} placeholder="e.g. $120k–$150k" />
            </div>
            <div className="form-group">
              <label htmlFor="app-applied-at">Applied At</label>
              <input id="app-applied-at" type="date" value={form.appliedAt} onChange={(e) => setForm({ ...form, appliedAt: e.target.value })} />
            </div>
            <div className="form-group">
              <label htmlFor="app-follow-up">Next Follow-Up</label>
              <input id="app-follow-up" type="date" value={form.nextFollowUpAt} onChange={(e) => setForm({ ...form, nextFollowUpAt: e.target.value })} />
            </div>
            <div className="form-group full-width">
              <label htmlFor="app-source-url">Source URL</label>
              <input id="app-source-url" value={form.sourceUrl} onChange={(e) => setForm({ ...form, sourceUrl: e.target.value })} placeholder="https://..." />
            </div>
            <div className="form-group full-width">
              <label htmlFor="app-job-desc">Job Description</label>
              <textarea id="app-job-desc" value={form.jobDescription} onChange={(e) => setForm({ ...form, jobDescription: e.target.value })} rows={5} placeholder="Paste the job description here..." />
            </div>
            <div className="form-group full-width">
              <label htmlFor="app-notes">Notes</label>
              <textarea id="app-notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} placeholder="Personal notes..." />
            </div>
          </div>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          message={`Delete "${deleteTarget.jobTitle}" application?`}
          loading={deleting}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </>
  );
}

function isOverdue(date?: string): boolean {
  if (!date) return false;
  return new Date(date) < new Date();
}
