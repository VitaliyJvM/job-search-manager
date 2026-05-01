import { useEffect, useState } from 'react';
import { promptsApi } from '../api/prompts.ts';
import type { PromptTemplate, PromptTemplateRequest, PromptType } from '../types/index.ts';
import Modal from '../components/Modal.tsx';
import ConfirmDialog from '../components/ConfirmDialog.tsx';
import LoadingSpinner from '../components/LoadingSpinner.tsx';

const PROMPT_TYPES: PromptType[] = ['RESUME_TAILORING', 'LINKEDIN_MESSAGE', 'FOLLOW_UP', 'COVER_LETTER', 'OTHER'];
const EMPTY_FORM: PromptTemplateRequest = { name: '', type: 'RESUME_TAILORING', promptText: '', isDefault: false };

export default function PromptLibrary() {
  const [prompts, setPrompts] = useState<PromptTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<PromptTemplate | null>(null);
  const [form, setForm] = useState<PromptTemplateRequest>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<PromptTemplate | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    promptsApi.getAll()
      .then(setPrompts)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setModalOpen(true); };
  const openEdit = (p: PromptTemplate) => {
    setEditing(p);
    setForm({ name: p.name, type: p.type, promptText: p.promptText, isDefault: p.isDefault });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) await promptsApi.update(editing.id, form);
      else await promptsApi.create(form);
      setModalOpen(false); load();
    } catch (e: unknown) { alert((e as Error).message); }
    finally { setSaving(false); }
  };

  const handleSetDefault = async (id: number) => {
    try { await promptsApi.setDefault(id); load(); }
    catch (e: unknown) { alert((e as Error).message); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try { await promptsApi.delete(deleteTarget.id); setDeleteTarget(null); load(); }
    catch (e: unknown) { alert((e as Error).message); }
    finally { setDeleting(false); }
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Prompt Library</h1>
          <p className="page-subtitle">{prompts.length} template{prompts.length !== 1 ? 's' : ''}</p>
        </div>
        <button id="btn-add-prompt" className="btn btn-primary" onClick={openCreate}>+ New Template</button>
      </div>

      {error && <div className="error-banner">⚠️ {error}</div>}

      {loading ? <LoadingSpinner /> : (
        prompts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📝</div>
            <h3>No prompt templates yet</h3>
            <p>Create reusable AI prompts for resume tailoring, cover letters, and more.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
            {prompts.map((p) => (
              <div key={p.id} className="prompt-card">
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <h3 style={{ color: 'var(--text-primary)' }}>{p.name}</h3>
                      {p.isDefault && <span className="badge badge-default">⭐ Default</span>}
                    </div>
                    {p.type && <span className="badge badge-neutral" style={{ marginTop: 4, display: 'inline-block' }}>{p.type.replace(/_/g, ' ')}</span>}
                  </div>
                </div>
                <div className="prompt-text-preview">{p.promptText}</div>
                <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => openEdit(p)}>Edit</button>
                  {!p.isDefault && (
                    <button className="btn btn-secondary btn-sm" onClick={() => handleSetDefault(p.id)}>Set Default</button>
                  )}
                  <button className="btn btn-danger btn-sm" onClick={() => setDeleteTarget(p)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {modalOpen && (
        <Modal
          title={editing ? 'Edit Prompt Template' : 'New Prompt Template'}
          onClose={() => setModalOpen(false)}
          maxWidth="680px"
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving || !form.name.trim() || !form.promptText.trim()}>
                {saving && <span className="loading-spinner" style={{ width: 14, height: 14 }} />}
                {editing ? 'Save Changes' : 'Create'}
              </button>
            </>
          }
        >
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="prompt-name">Template Name *</label>
              <input id="prompt-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Senior Engineer Tailoring" />
            </div>
            <div className="form-group">
              <label htmlFor="prompt-type">Type</label>
              <select id="prompt-type" value={form.type ?? ''} onChange={(e) => setForm({ ...form, type: e.target.value as PromptType })}>
                {PROMPT_TYPES.map((t) => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
              </select>
            </div>
            <div className="form-group full-width" style={{ alignItems: 'flex-start' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input id="prompt-default" type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} style={{ width: 'auto' }} />
                Set as default prompt
              </label>
            </div>
            <div className="form-group full-width">
              <label htmlFor="prompt-text">Prompt Text *</label>
              <textarea id="prompt-text" value={form.promptText} onChange={(e) => setForm({ ...form, promptText: e.target.value })} rows={12} placeholder="Write your prompt here. Use {masterResume} and {jobDescription} as placeholders..." style={{ fontFamily: 'monospace', fontSize: '0.8rem' }} />
            </div>
          </div>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          message={`Delete prompt template "${deleteTarget.name}"?`}
          loading={deleting}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </>
  );
}
